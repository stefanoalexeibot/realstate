import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { createClient as createAdmin } from "@supabase/supabase-js";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createServiceClient();

    // Get photo record
    const { data: photo, error: fetchErr } = await supabase
      .from("re_photos")
      .select("url, property_id, is_cover")
      .eq("id", params.id)
      .single();

    if (fetchErr || !photo) {
      return NextResponse.json({ error: "Foto no encontrada" }, { status: 404 });
    }

    // Delete from Supabase Storage
    const adminClient = createAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const url = new URL(photo.url);
    const storagePath = url.pathname.split("/object/public/cima-photos/")[1];
    if (storagePath) {
      await adminClient.storage.from("cima-photos").remove([storagePath]);
    }

    // Delete DB record
    await supabase.from("re_photos").delete().eq("id", params.id);

    // If it was the cover, promote next photo
    if (photo.is_cover) {
      const { data: remaining } = await supabase
        .from("re_photos")
        .select("id, url")
        .eq("property_id", photo.property_id)
        .order("order")
        .limit(1);

      if (remaining && remaining.length > 0) {
        await supabase.from("re_photos").update({ is_cover: true }).eq("id", remaining[0].id);
        await supabase.from("re_properties").update({ cover_photo: remaining[0].url }).eq("id", photo.property_id);
      } else {
        await supabase.from("re_properties").update({ cover_photo: null }).eq("id", photo.property_id);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error desconocido";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
