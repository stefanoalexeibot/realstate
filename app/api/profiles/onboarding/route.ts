import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST() {
    try {
        const supabase = createServiceClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        await supabase
            .from("profiles")
            .update({ onboarding_completed: true })
            .eq("id", user.id);

        return NextResponse.json({ ok: true });
    } catch (e) {
        return NextResponse.json({ error: "Error" }, { status: 500 });
    }
}
