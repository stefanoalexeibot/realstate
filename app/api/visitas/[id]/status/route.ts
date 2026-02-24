import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const supabase = createServiceClient();

    const updateData: Record<string, unknown> = {};
    if ("status" in body) updateData.status = body.status;
    if ("agent_notes" in body) updateData.agent_notes = body.agent_notes;
    if ("interest_level" in body) updateData.interest_level = body.interest_level;
    if ("feedback_tags" in body) updateData.feedback_tags = body.feedback_tags;

    const { error } = await supabase
      .from("re_visits")
      .update(updateData)
      .eq("id", params.id);

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
