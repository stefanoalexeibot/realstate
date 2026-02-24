import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

// GET /api/propiedades-list — list active properties (used by invite modal)
export async function GET() {
    try {
        const supabase = createServiceClient();
        const { data } = await supabase
            .from("re_properties")
            .select("id, title, neighborhood")
            .eq("status", "active")
            .order("created_at", { ascending: false });
        return NextResponse.json({ properties: data ?? [] });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Error" }, { status: 500 });
    }
}
