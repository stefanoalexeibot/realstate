import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { verifyAdminStatus } from "@/lib/auth-utils";

// GET /api/admin/propiedades/[id] — returns a single property + its photos
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await verifyAdminStatus();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const supabase = createAdminClient();

    const [{ data: property, error: propError }, { data: photos }] = await Promise.all([
      supabase.from("re_properties").select("*").eq("id", params.id).single(),
      supabase.from("re_photos").select("*").eq("property_id", params.id).order("order"),
    ]);

    if (propError || !property) {
      return NextResponse.json({ error: "Propiedad no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ property, photos: photos ?? [] });
  } catch {
    return NextResponse.json({ error: "Error al obtener propiedad" }, { status: 500 });
  }
}
