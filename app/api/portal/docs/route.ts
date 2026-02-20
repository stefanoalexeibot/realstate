import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const propietario_id = searchParams.get("propietario_id");
  if (!propietario_id) {
    return NextResponse.json({ error: "propietario_id requerido" }, { status: 400 });
  }
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("re_propietario_docs")
    .select("*")
    .eq("propietario_id", propietario_id)
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ docs: data ?? [] });
}

export async function POST(req: Request) {
  try {
    const { propietario_id, name, url, type } = await req.json();
    if (!propietario_id || !name || !url) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("re_propietario_docs")
      .insert({ propietario_id, name, url, type: type || "contract" })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ ok: true, id: data.id });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error desconocido";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
