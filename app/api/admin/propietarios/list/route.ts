import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { verifyAdminStatus } from "@/lib/auth-utils";

// GET /api/admin/propietarios/list — returns propietarios + their properties
export async function GET() {
  try {
    const auth = await verifyAdminStatus();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const supabase = createAdminClient();

    const [{ data: propietarios }, { data: properties }] = await Promise.all([
      supabase.from("re_propietarios").select("id, name, email, phone").order("name"),
      supabase.from("re_properties")
        .select("propietario_id, title, address, neighborhood, city, price, operation_type, bedrooms, bathrooms, area_m2, parking")
        .order("created_at", { ascending: false }),
    ]);

    return NextResponse.json({
      propietarios: propietarios ?? [],
      properties: properties ?? [],
    });
  } catch {
    return NextResponse.json({ error: "Error al obtener propietarios" }, { status: 500 });
  }
}
