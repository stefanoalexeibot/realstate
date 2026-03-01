import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { notifyNewVisit } from "@/lib/notify";
import { checkRateLimit, isHoneypotFilled } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const rateLimited = checkRateLimit(req);
    if (rateLimited) return rateLimited;

    const body = await req.json();

    if (isHoneypotFilled(body)) {
      return NextResponse.json({ ok: true });
    }

    const { property_id, name, phone, email, preferred_date, message } = body;

    if (!property_id || !name || !phone) {
      return NextResponse.json({ error: "Datos requeridos incompletos" }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Get property title for notification
    const { data: property } = await supabase
      .from("re_properties")
      .select("title")
      .eq("id", property_id)
      .single();

    const { error } = await supabase.from("re_visits").insert({
      property_id,
      name,
      phone,
      email: email || null,
      preferred_date: preferred_date || null,
      message: message || null,
    });

    if (error) throw error;

    // Non-blocking notification
    notifyNewVisit({ name, phone, email, propertyTitle: property?.title ?? "Propiedad", preferred_date, message });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }
}
