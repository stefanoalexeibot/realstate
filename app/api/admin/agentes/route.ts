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

    const { data: agentes, error: agError } = await supabase
      .from("re_agentes")
      .select("*")
      .order("name");

    if (agError) {
      console.error("Error fetching agentes:", agError);
      throw agError;
    }

    const { data: props } = await supabase
      .from("re_properties")
      .select("agent_id, status");

    return NextResponse.json({
      agentes: agentes ?? [],
      properties: props ?? [],
    });
  } catch {
    return NextResponse.json({ error: "Error al obtener agentes" }, { status: 500 });
  }
}
