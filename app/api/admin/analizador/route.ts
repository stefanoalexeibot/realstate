import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { verifyAdminStatus } from "@/lib/auth-utils";

// GET /api/admin/analizador?property_type=casa&operation_type=venta&neighborhood=cumbres&bedrooms=3
export async function GET(req: Request) {
  try {
    const auth = await verifyAdminStatus();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const property_type = searchParams.get("property_type") ?? "casa";
    const operation_type = searchParams.get("operation_type") ?? "venta";
    const neighborhood = searchParams.get("neighborhood") ?? "";
    const bedrooms = searchParams.get("bedrooms") ?? "";

    const supabase = createAdminClient();
    let query = supabase
      .from("re_properties")
      .select("id, title, slug, price, area_m2, bedrooms, bathrooms, neighborhood, status, operation_type")
      .eq("property_type", property_type)
      .eq("operation_type", operation_type)
      .in("status", ["active", "sold", "rented"]);

    if (neighborhood.trim()) {
      query = query.ilike("neighborhood", `%${neighborhood.trim()}%`);
    }
    if (bedrooms) {
      query = query
        .gte("bedrooms", Number(bedrooms) - 1)
        .lte("bedrooms", Number(bedrooms) + 1);
    }

    const { data, error } = await query.order("price").limit(20);

    if (error) {
      console.error("Analizador query error:", error);
      throw error;
    }

    return NextResponse.json({ data: data ?? [] });
  } catch {
    return NextResponse.json({ error: "Error al analizar comparables" }, { status: 500 });
  }
}
