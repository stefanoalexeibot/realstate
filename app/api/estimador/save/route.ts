import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            name, phone, email, neighborhood,
            property_type, estimated_price, m2, recamaras
        } = body;

        if (!name || !phone || !email) {
            return NextResponse.json({ error: "Faltan datos de contacto" }, { status: 400 });
        }

        const supabase = createAdminClient();

        const { error } = await supabase
            .from("re_seller_leads")
            .insert({
                name,
                phone,
                email,
                neighborhood,
                property_type,
                estimated_price,
                message: `Appraisal report requested for ${m2}m² property with ${recamaras} bedrooms.`,
                status: "new",
                pipeline_stage: "new"
            });

        if (error) throw error;

        return NextResponse.json({ ok: true });
    } catch (e) {
        console.error("Error saving seller lead:", e);
        return NextResponse.json({ error: "Error al guardar el lead" }, { status: 500 });
    }
}
