import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { checkRateLimit, isHoneypotFilled } from "@/lib/rate-limit";

export async function POST(req: Request) {
    try {
        const rateLimited = checkRateLimit(req);
        if (rateLimited) return rateLimited;

        const body = await req.json();

        if (isHoneypotFilled(body)) {
            return NextResponse.json({ ok: true });
        }

        const { property_id, name, phone, message, source, operation_type, neighborhood } = body;

        if (!name || !phone) {
            return NextResponse.json({ error: "Nombre y teléfono son requeridos" }, { status: 400 });
        }

        const supabase = createAdminClient();

        const { error } = await supabase.from("re_seller_leads").insert({
            name,
            phone,
            message: message || null,
            property_id: property_id || null,
            source: source || "landing-page",
            operation_type: operation_type || null,
            neighborhood: neighborhood || null,
            pipeline_stage: "nuevo",
        });

        if (error) {
            console.error("Error inserting lead:", error);
            throw error;
        }

        return NextResponse.json({ ok: true });
    } catch (e: any) {
        console.error("Error in /api/leads:", e);
        return NextResponse.json({ error: "Error al registrar el contacto" }, { status: 500 });
    }
}
