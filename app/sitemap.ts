import { createClient } from "@/lib/supabase/server";
import type { MetadataRoute } from "next";

const BASE = "https://propiedades-mty.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();
  const { data } = await supabase
    .from("re_properties")
    .select("slug, updated_at")
    .eq("status", "active");

  const properties: MetadataRoute.Sitemap = (data ?? []).map((p) => ({
    url: `${BASE}/propiedades/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    { url: BASE,                        lastModified: new Date(), changeFrequency: "daily",  priority: 1   },
    { url: `${BASE}/propiedades`,       lastModified: new Date(), changeFrequency: "daily",  priority: 0.9 },
    ...properties,
  ];
}
