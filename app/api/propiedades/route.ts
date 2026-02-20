import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title, description, price, operation_type, property_type,
      bedrooms, bathrooms, area_m2, parking, neighborhood, city,
      state, features, status, featured, photos, propietario_id, agent_notes,
    } = body;

    if (!title || !price || !operation_type || !property_type) {
      return NextResponse.json({ error: "Campos requeridos incompletos" }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Generate unique slug
    const baseSlug = slugify(`${title}-${neighborhood ?? "mty"}`);
    const slug = `${baseSlug}-${Date.now().toString(36)}`;

    const { data: property, error } = await supabase
      .from("re_properties")
      .insert({
        title, description: description || null,
        price: Number(price), operation_type, property_type,
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
        cover_photo: photos?.[0] ?? null,
        slug,
        propietario_id: propietario_id || null,
        agent_notes: agent_notes || null,
      })
      .select()
      .single();

    if (error) throw error;

    // Insert photos
    if (photos && photos.length > 0) {
      await supabase.from("re_photos").insert(
        photos.map((url: string, i: number) => ({
          property_id: property.id,
          url,
          order: i,
          is_cover: i === 0,
        }))
      );
    }

    return NextResponse.json({ ok: true, slug: property.slug, id: property.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error al crear propiedad" }, { status: 500 });
  }
}
