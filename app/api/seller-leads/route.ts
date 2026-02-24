import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { notifyNewLead } from "@/lib/notify";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, email, neighborhood, property_type, operation_type, estimated_price, message } = body;

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
    });

    if (error) throw error;

    // Non-blocking notification
    notifyNewLead({ name, phone, email, neighborhood, operation_type, estimated_price, message });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }
}
