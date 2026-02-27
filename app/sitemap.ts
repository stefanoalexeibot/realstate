import { MetadataRoute } from 'next';
import { createAdminClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createAdminClient();
  const baseUrl = 'https://propiedades-mty.vercel.app';

  // Fetch all active, sold, and rented properties for the sitemap
  const { data: properties } = await supabase
    .from('re_properties')
    .select('slug, updated_at');

  const propertyEntries: MetadataRoute.Sitemap = (properties ?? []).map((p) => ({
    url: `${baseUrl}/propiedades/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/propiedades`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/casos-de-exito`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  return [...routes, ...propertyEntries];
}
