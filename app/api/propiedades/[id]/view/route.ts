import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient();
    const today = new Date().toISOString().slice(0, 10);
    await supabase.rpc("increment_property_view", {
      p_property_id: params.id,
      p_date: today,
    });
  } catch {
    // Non-critical — silently ignore errors
  }
  return NextResponse.json({ ok: true });
}
