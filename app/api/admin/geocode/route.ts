import { createServiceClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = createServiceClient();

  const { data: properties } = await supabase
    .from("re_properties")
    .select("id, neighborhood, city")
    .is("lat", null)
    .not("neighborhood", "is", null)
    .limit(25);

  if (!properties?.length) {
    return NextResponse.json({ geocoded: 0, message: "No hay propiedades sin coordenadas." });
  }

  let geocoded = 0;
  let failed = 0;

  for (const prop of properties) {
    const q = `${prop.neighborhood}, ${prop.city ?? "Monterrey"}, Nuevo León, México`;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`,
        {
          headers: { "User-Agent": "CimaPropiedades/1.0 (admin geocoder)" },
          signal: AbortSignal.timeout(8000),
        }
      );
      const data = await res.json();
      if (data[0]?.lat) {
        await supabase
          .from("re_properties")
          .update({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) })
          .eq("id", prop.id);
        geocoded++;
      } else {
        failed++;
      }
    } catch {
      failed++;
    }
    // Nominatim rate limit: max 1 req/sec
    await new Promise((r) => setTimeout(r, 1150));
  }

  return NextResponse.json({
    geocoded,
    failed,
    remaining: (properties.length - geocoded - failed),
    message: `${geocoded} geocodificadas, ${failed} sin resultado.`,
  });
}
