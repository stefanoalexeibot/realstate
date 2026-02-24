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
        const [{ data: propietarios }, { data: agentes }, { data: profiles }] = await Promise.all([
            supabase.from("re_propietarios").select("id, name, email").order("name"),
            supabase.from("re_agentes").select("*").order("name"),
            supabase.from("profiles").select("id, role").in("role", ["admin", "agent"]).order("role"),
        ]);
        return NextResponse.json({
            propietarios: propietarios ?? [],
            agentes: agentes ?? [],
            authProfiles: profiles ?? []
        });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Error al cargar datos" }, { status: 500 });
    }
}
