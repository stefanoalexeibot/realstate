import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { verifyAdminStatus } from "@/lib/auth-utils";

export async function POST(req: Request) {
  try {
    const auth = await verifyAdminStatus();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `properties/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const supabase = createAdminClient();
    const { data, error } = await supabase.storage
      .from("cima-photos")
      .upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage.from("cima-photos").getPublicUrl(data.path);
    return NextResponse.json({ url: publicUrl });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error al subir foto" }, { status: 500 });
  }
}
