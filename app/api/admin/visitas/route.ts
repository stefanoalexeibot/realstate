import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { verifyAdminStatus } from "@/lib/auth-utils";

export async function POST(req: Request) {
    try {
        const auth = await verifyAdminStatus();
        if (!auth.authorized) {
            return NextResponse.json({ error: auth.error }, { status: 401 });
        }

        const body = await req.json();
        const { property_id, name, phone, email, preferred_date, message } = body;

        if (!property_id || !name || !phone) {
            return NextResponse.json({ error: "Faltan campos obligatorios (Propiedad, Nombre y Teléfono)" }, { status: 400 });
        }

        const supabase = createAdminClient();

        // Register the visit
        const { data, error } = await supabase
            .from("re_visits")
            .insert({
                property_id,
                name,
                phone,
                email: email || null,
                preferred_date: preferred_date || null,
                message: message || "Registro manual por asesor",
                status: "confirmed"
            })
            .select();

        if (error) {
            console.error("Supabase manual visit error:", error);
            return NextResponse.json({ error: `Error de base de datos: ${error.message}` }, { status: 500 });
        }

        return NextResponse.json({ ok: true, visit: data?.[0] });
    } catch (e: any) {
        console.error("Manual visit route error:", e);
        return NextResponse.json({ error: `Error interno: ${e.message || "Desconocido"}` }, { status: 500 });
    }
}
