import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { verifyAdminStatus } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await verifyAdminStatus();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const body = await req.json();
    const {
      title, description, price, operation_type, property_type,
      bedrooms, bathrooms, area_m2, parking, neighborhood, city,
      state, features, status, featured, agent_notes, propietario_id,
      agent_id, address, construction_year,
      days_to_sell, sold_at,
      new_photos, // Array of { url, order, is_cover }
      cover_photo, // Optional manual sync
      video_url, tour_url,
    } = body;

    if (!title || !price || !operation_type || !property_type) {
      return NextResponse.json({ error: "Campos requeridos incompletos" }, { status: 400 });
    }

    const supabase = createAdminClient();

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
        propietario_id: propietario_id || null,
        agent_id: agent_id || null,
        address: address || null,
        construction_year: construction_year ? Number(construction_year) : null,
        days_to_sell: days_to_sell ? Number(days_to_sell) : null,
        sold_at: sold_at || null,
        video_url: video_url || null,
        tour_url: tour_url || null,
      })
      .eq("id", params.id);

    if (error) throw error;

    // 2. Insert new photos if any
    if (new_photos && Array.isArray(new_photos) && new_photos.length > 0) {
      const photosToInsert = new_photos.map((p: any) => ({
        property_id: params.id,
        url: p.url,
        order: p.order || 0,
        is_cover: p.is_cover || false,
      }));
      const { error: photoError } = await supabase.from("re_photos").insert(photosToInsert);
      if (photoError) throw photoError;

      // Update property cover_photo if any new photo is marked as cover
      const newCover = new_photos.find((p: any) => p.is_cover)?.url;
      if (newCover) {
        await supabase.from("re_properties").update({ cover_photo: newCover }).eq("id", params.id);
      }
    }

    if (cover_photo) {
      await supabase.from("re_properties").update({ cover_photo }).eq("id", params.id);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error desconocido";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await verifyAdminStatus();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const { id } = params;
    const supabase = createAdminClient();

    // 1. Delete associated images in re_property_photos
    await supabase.from("re_property_photos").delete().eq("property_id", id);

    // 2. Delete the property
    const { error } = await supabase
      .from("re_properties")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error al eliminar";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
