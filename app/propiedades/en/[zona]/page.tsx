export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2, MapPin, TrendingUp, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import PropertyCard from "@/components/landing/property-card";
import CompareBar from "@/components/landing/compare-bar";
import { ZONES, getZoneBySlug } from "@/lib/zones";
import { formatPrice } from "@/lib/utils";
import type { Property } from "@/lib/types";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return ZONES.map((z) => ({ zona: z.slug }));
}

export async function generateMetadata({ params }: { params: { zona: string } }): Promise<Metadata> {
  const zone = getZoneBySlug(params.zona);
  if (!zone) return { title: "Zona no encontrada" };
  return {
    title: `Propiedades en ${zone.name} | Cima Propiedades`,
    description: `Casas, departamentos y terrenos en ${zone.name}. ${zone.description} ${zone.priceRange}.`,
    openGraph: {
      title: `Propiedades en ${zone.name} | Cima Propiedades`,
      description: zone.description,
    },
  };
}

export default async function ZonaPage({ params }: { params: { zona: string } }) {
  const zone = getZoneBySlug(params.zona);
  if (!zone) notFound();

  const supabase = createClient();

  const { data } = await supabase
    .from("re_properties")
    .select("*")
    .eq("status", "active")
    .ilike("neighborhood", `%${zone.name.split(" ")[0]}%`)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  const properties = (data ?? []) as Property[];

  // Avg price for zone header
  const avgPrice = properties.length > 0
    ? Math.round(properties.reduce((s, p) => s + p.price, 0) / properties.length)
    : null;

  return (
    <div className="min-h-screen bg-cima-bg">
      {/* Nav */}
      <header className="border-b border-cima-border/50 bg-cima-bg/90 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center">
              <Building2 className="h-4 w-4 text-cima-gold" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-heading font-bold text-sm text-cima-text">Cima</span>
              <span className="font-mono text-[9px] tracking-[0.2em] text-cima-text-muted uppercase">Propiedades</span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-xs text-cima-text-muted font-mono">
            {ZONES.filter((z) => z.slug !== params.zona).slice(0, 4).map((z) => (
              <Link key={z.slug} href={`/propiedades/en/${z.slug}`} className="hover:text-cima-text transition-colors">
                {z.name.split(" ")[0]}
              </Link>
            ))}
          </nav>
          <Link href="/propiedades" className="text-xs text-cima-text-muted hover:text-cima-text transition-colors">
            ← Catálogo
          </Link>
        </div>
      </header>

      {/* Zone Hero */}
      <div className="relative border-b border-cima-border/50 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[300px] bg-cima-gold/[0.04] rounded-full blur-[80px]" />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 py-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[11px] font-mono text-cima-text-dim mb-5">
            <Link href="/" className="hover:text-cima-text transition-colors">Inicio</Link>
            <span>/</span>
            <Link href="/propiedades" className="hover:text-cima-text transition-colors">Propiedades</Link>
            <span>/</span>
            <span className="text-cima-gold">{zone.name}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-4 w-4 text-cima-gold" />
                <span className="font-mono text-[10px] tracking-[0.2em] text-cima-gold uppercase">{zone.tag}</span>
              </div>
              <h1 className="font-heading font-bold text-3xl sm:text-4xl text-cima-text mb-3">
                Propiedades en<br />{zone.name}
              </h1>
              <p className="text-sm text-cima-text-muted leading-relaxed max-w-xl">{zone.description}</p>
            </div>

            {/* Stats */}
            <div className="flex sm:flex-col gap-4 sm:gap-3 shrink-0">
              <div className="rounded-xl border border-cima-border bg-cima-card px-5 py-4 text-center min-w-[120px]">
                <p className="font-heading font-bold text-xl text-cima-gold">{properties.length}</p>
                <p className="font-mono text-[9px] text-cima-text-dim uppercase tracking-widest mt-0.5">disponibles</p>
              </div>
              {avgPrice && (
                <div className="rounded-xl border border-cima-border bg-cima-card px-5 py-4 text-center min-w-[120px]">
                  <p className="font-heading font-bold text-base text-cima-gold leading-tight">{formatPrice(avgPrice)}</p>
                  <p className="font-mono text-[9px] text-cima-text-dim uppercase tracking-widest mt-0.5">precio promedio</p>
                </div>
              )}
              <div className="rounded-xl border border-cima-border bg-cima-card px-5 py-4 text-center min-w-[120px]">
                <p className="font-heading font-bold text-base text-cima-gold leading-tight">{zone.priceRange}</p>
                <p className="font-mono text-[9px] text-cima-text-dim uppercase tracking-widest mt-0.5">rango de zona</p>
              </div>
            </div>
          </div>

          {/* Sell CTA */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_CIMA_WA}?text=Hola,%20quiero%20vender%20mi%20propiedad%20en%20${encodeURIComponent(zone.name)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl bg-cima-gold px-5 py-2.5 font-heading font-bold text-sm text-cima-bg hover:bg-cima-gold-light transition-colors w-fit"
            >
              <TrendingUp className="h-4 w-4" />
              Vender en {zone.name.split(" ")[0]}
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
            <Link
              href={`/propiedades/en/${params.zona}?vista=mapa`}
              className="flex items-center gap-2 rounded-xl border border-cima-border px-5 py-2.5 font-heading font-semibold text-sm text-cima-text-muted hover:border-cima-gold/40 hover:text-cima-text transition-colors w-fit"
            >
              <MapPin className="h-4 w-4" />
              Ver en mapa
            </Link>
          </div>
        </div>
      </div>

      {/* Properties */}
      <div className="mx-auto max-w-6xl px-6 py-10">
        {properties.length === 0 ? (
          <div className="rounded-xl border border-cima-border bg-cima-card p-16 text-center">
            <Building2 className="h-8 w-8 text-cima-text-dim mx-auto mb-3" />
            <p className="text-cima-text-muted mb-1">No hay propiedades activas en {zone.name} en este momento.</p>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_CIMA_WA}?text=Hola,%20me%20interesa%20una%20propiedad%20en%20${encodeURIComponent(zone.name)}`}
              target="_blank" rel="noreferrer"
              className="text-sm text-cima-gold hover:underline mt-1 inline-block"
            >
              Notificarme cuando haya disponibles →
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}

        {/* Other zones */}
        <div className="mt-14">
          <p className="font-mono text-[10px] tracking-[0.2em] text-cima-text-dim uppercase mb-4">Otras zonas</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {ZONES.filter((z) => z.slug !== params.zona).map((z) => (
              <Link
                key={z.slug}
                href={`/propiedades/en/${z.slug}`}
                className="rounded-lg border border-cima-border bg-cima-card px-4 py-3 hover:border-cima-gold/40 hover:bg-cima-surface transition-all group text-center"
              >
                <p className="text-sm font-medium text-cima-text group-hover:text-cima-gold transition-colors leading-snug">{z.name.split(" ")[0]}</p>
                <p className="font-mono text-[9px] text-cima-text-dim uppercase mt-0.5">{z.tag}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <CompareBar />
    </div>
  );
}
