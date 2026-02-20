import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const {
      title, description, price, operation_type, property_type,
      bedrooms, bathrooms, area_m2, parking, neighborhood, city,
      state, features, status, featured, agent_notes,
    } = body;

    if (!title || !price || !operation_type || !property_type) {
      return NextResponse.json({ error: "Campos requeridos incompletos" }, { status: 400 });
    }

    const supabase = createServiceClient();

    const { error } = await supabase
      .from("re_properties")
      .update({
        title,
        description: description || null,
        price: Number(price),
        operation_type,
        property_type,
        bedrooms: Number(bedrooms) || 0,
        bathrooms: Number(bathrooms) || 0,
        area_m2: area_m2 ? Number(area_m2) : null,
        parking: Number(parking) || 0,
        neighborhood: neighborhood || null,
        city: city || "Monterrey",
        state: state || "Nuevo León",
        features: features ? features.split(",").map((f: string) => f.trim()).filter(Boolean) : [],
        status: status || "active",
        featured: featured || false,
        agent_notes: agent_notes || null,
      })
      .eq("id", params.id);

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error desconocido";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
