import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { verifyAdminStatus } from "@/lib/auth-utils";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await verifyAdminStatus();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const supabase = createAdminClient();

    const updateData: Record<string, unknown> = {};
    if ("status" in body) updateData.status = body.status;
    if ("agent_notes" in body) updateData.agent_notes = body.agent_notes;
    if ("interest_level" in body) updateData.interest_level = body.interest_level;
    if ("feedback_tags" in body) updateData.feedback_tags = body.feedback_tags;

    console.log(`[PATCH /api/visitas/${id}/status] Updating with:`, updateData);

    const { data, error } = await supabase
      .from("re_visits")
      .update(updateData)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Supabase update error:", error);
      throw error;
    }

    if (!data) {
      console.warn(`[PATCH /api/visitas/${id}/status] No record found or updated for ID: ${id}`);
      return NextResponse.json({ error: "No se encontró el registro o no tienes permisos." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, data });
  } catch (err: any) {
    console.error("Visit status PATCH error:", err);
    return NextResponse.json({ error: err.message || "Error" }, { status: 500 });
  }
}
