import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

// Public endpoint — returns only non-sensitive fields filtered by referrer name
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const nombre = searchParams.get("nombre");

    if (!nombre || nombre.trim().length < 2) {
      return NextResponse.json({ error: "Nombre requerido (mínimo 2 caracteres)" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("re_seller_leads")
      .select("id, name, neighborhood, pipeline_stage, created_at, message")
      .ilike("referrer", `%${nombre.trim()}%`)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;

    return NextResponse.json({ data: data ?? [] });
  } catch {
    return NextResponse.json({ error: "Error al buscar referidos" }, { status: 500 });
  }
}
