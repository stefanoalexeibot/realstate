import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { property_id, name, phone, email, preferred_date, message } = body;

    if (!property_id || !name || !phone) {
      return NextResponse.json({ error: "Datos requeridos incompletos" }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { error } = await supabase.from("re_visits").insert({
      property_id,
      name,
      phone,
      email: email || null,
      preferred_date: preferred_date || null,
      message: message || null,
    });

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }
}
