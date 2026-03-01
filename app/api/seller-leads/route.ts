import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { notifyNewLead } from "@/lib/notify";
import { checkRateLimit, isHoneypotFilled } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const rateLimited = checkRateLimit(req);
    if (rateLimited) return rateLimited;

    const body = await req.json();

    // Honeypot — bots fill this hidden field
    if (isHoneypotFilled(body)) {
      return NextResponse.json({ ok: true }); // fake success to not alert bot
    }

    const { name, phone, email, neighborhood, property_type, operation_type, estimated_price, message,
      utm_source, utm_medium, utm_campaign, utm_content, utm_term, referrer } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: "Nombre y teléfono son requeridos" }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { error } = await supabase.from("re_seller_leads").insert({
      name,
      phone,
      email: email || null,
      neighborhood: neighborhood || null,
      property_type: property_type || null,
      operation_type: operation_type || "venta",
      estimated_price: estimated_price || null,
      message: message || null,
      utm_source: utm_source || null,
      utm_medium: utm_medium || null,
      utm_campaign: utm_campaign || null,
      utm_content: utm_content || null,
      utm_term: utm_term || null,
      referrer: referrer || null,
    });

    if (error) throw error;

    // Non-blocking notification
    notifyNewLead({ name, phone, email, neighborhood, operation_type, estimated_price, message });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }
}
