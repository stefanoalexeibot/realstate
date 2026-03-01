import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { verifyAdminStatus } from "@/lib/auth-utils";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await verifyAdminStatus();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const { pipeline_stage } = await req.json();
    const supabase = createServiceClient();
    const { error } = await supabase
      .from("re_seller_leads")
      .update({ pipeline_stage })
      .eq("id", params.id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
