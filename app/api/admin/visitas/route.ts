import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { verifyAdminStatus } from "@/lib/auth-utils";

export async function GET() {
  try {
    const auth = await verifyAdminStatus();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const supabase = createAdminClient();

    const { data: visits, error: visitsError } = await supabase
      .from("re_visits")
      .select(`
        id, name, phone, status, created_at, preferred_date,
        agent_notes, interest_level, feedback_tags,
        re_properties(id, title, neighborhood, slug, cover_photo)
      `)
      .order("created_at", { ascending: false });

    if (visitsError) {
      console.error("Error fetching visits:", visitsError);
      throw visitsError;
    }

    const { data: properties } = await supabase
      .from("re_properties")
      .select("id, title, neighborhood")
      .eq("status", "active")
      .order("title");

    return NextResponse.json({
      visits: visits ?? [],
      properties: properties ?? [],
    });
  } catch {
    return NextResponse.json({ error: "Error al obtener visitas" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await verifyAdminStatus();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const body = await req.json();
    const { property_id, name, phone, email, preferred_date, message } = body;

    if (!property_id || !name || !phone) {
      return NextResponse.json({ error: "Faltan campos obligatorios (Propiedad, Nombre y Teléfono)" }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("re_visits")
      .insert({
        property_id,
        name,
        phone,
        email: email || null,
        preferred_date: preferred_date || null,
        message: message || "Registro manual por asesor",
        status: "confirmed",
      })
      .select();

    if (error) {
      console.error("Supabase manual visit error:", error);
      return NextResponse.json({ error: `Error de base de datos: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ ok: true, visit: data?.[0] });
  } catch (e: unknown) {
    console.error("Manual visit route error:", e);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
