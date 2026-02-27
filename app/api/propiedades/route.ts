import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { verifyAdminStatus } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    const auth = await verifyAdminStatus();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const body = await req.json();
    const {
      title, description, price, operation_type, property_type,
      bedrooms, bathrooms, area_m2, terrain_m2, construction_m2,
      parking, neighborhood, city,
      state, features, status, featured, photos, propietario_id,
      agent_notes, agent_id, address, construction_year,
      days_to_sell, sold_at,
      video_url, tour_url,
    } = body;

    if (!title || !price || !operation_type || !property_type) {
      return NextResponse.json({ error: "Campos requeridos incompletos" }, { status: 400 });
    }

    const supabase = createAdminClient();

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
        terrain_m2: terrain_m2 ? Number(terrain_m2) : null,
        construction_m2: construction_m2 ? Number(construction_m2) : null,
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
        agent_id: agent_id || null,
        address: address || null,
        construction_year: construction_year ? Number(construction_year) : null,
        days_to_sell: days_to_sell ? Number(days_to_sell) : null,
        sold_at: sold_at || null,
        video_url: video_url || null,
        tour_url: tour_url || null,
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

    revalidatePath("/admin/propiedades");
    revalidatePath("/casos-de-exito");
    revalidatePath("/");

    return NextResponse.json({ ok: true, slug: property.slug, id: property.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error al crear propiedad" }, { status: 500 });
  }
}
