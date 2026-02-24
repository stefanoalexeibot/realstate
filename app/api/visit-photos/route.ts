import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

// GET /api/visit-photos?visit_id=xxx
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const visitId = searchParams.get("visit_id");
        if (!visitId) return NextResponse.json({ error: "visit_id requerido" }, { status: 400 });

        const supabase = createServiceClient();
        const { data, error } = await supabase
            .from("re_visit_photos")
            .select("*")
            .eq("visit_id", visitId)
            .order("created_at");

        if (error) throw error;
        return NextResponse.json({ photos: data ?? [] });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Error al obtener fotos" }, { status: 500 });
    }
}

// POST /api/visit-photos — multipart form with visit_id + file
export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const visitId = formData.get("visit_id") as string | null;
        const file = formData.get("file") as File | null;

        if (!visitId || !file) {
            return NextResponse.json({ error: "visit_id y file son requeridos" }, { status: 400 });
        }

        const supabase = createServiceClient();

        // Upload to storage
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `visits/${visitId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const buffer = await file.arrayBuffer();

        const { data: uploaded, error: uploadErr } = await supabase.storage
            .from("cima-photos")
            .upload(path, buffer, { contentType: file.type, cacheControl: "3600", upsert: false });

        if (uploadErr) throw uploadErr;

        const { data: { publicUrl } } = supabase.storage.from("cima-photos").getPublicUrl(uploaded.path);

        // Insert record
        const { data: row, error: insertErr } = await supabase
            .from("re_visit_photos")
            .insert({ visit_id: visitId, url: publicUrl, uploaded_by: "admin" })
            .select()
            .single();

        if (insertErr) throw insertErr;

        return NextResponse.json({ ok: true, photo: row });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Error al subir foto" }, { status: 500 });
    }
}
