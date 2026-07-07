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
    const { data, error } = await supabase
      .from("re_seller_leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching seller leads:", error);
      throw error;
    }

    return NextResponse.json({ data: data ?? [] });
  } catch {
    return NextResponse.json({ error: "Error al obtener leads" }, { status: 500 });
  }
}
