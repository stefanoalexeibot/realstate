export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2, BedDouble, Bath, Maximize2, Car, MapPin, Phone, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import VisitForm from "@/components/landing/visit-form";
import PhotoGallery from "@/components/landing/photo-gallery";
import { formatPrice } from "@/lib/utils";
import type { Property } from "@/lib/types";
import Image from "next/image";
import MortgageCalculator from "@/components/landing/mortgage-calculator";
import ShareProperty from "@/components/landing/share-property";
import StickyPropertyHeader from "@/components/landing/sticky-property-header";
import MobileActionBar from "@/components/landing/mobile-action-bar";
import FadeIn from "@/components/landing/fade-in";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data } = await supabase
    .from("re_properties")
    .select("title, neighborhood, price, operation_type, cover_photo")
    .eq("slug", params.slug)
    .single();

  if (!data) return { title: "Propiedad no encontrada" };

  const desc = `${data.title} en ${data.neighborhood ?? "Monterrey"}. ${formatPrice(data.price)}${data.operation_type === "renta" ? "/mes" : ""} en ${data.operation_type}.`;

  return {
    title: `${data.title} | Cima Propiedades`,
    description: desc,
    openGraph: {
      title: `${data.title} | Cima Propiedades`,
      description: desc,
      ...(data.cover_photo ? { images: [{ url: data.cover_photo, width: 1200, height: 630, alt: data.title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.title} | Cima Propiedades`,
      description: desc,
      ...(data.cover_photo ? { images: [data.cover_photo] } : {}),
    },
  };
}

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  casa: "Casa",
  departamento: "Departamento",
  terreno: "Terreno",
  local: "Local",
  oficina: "Oficina",
};

export default async function PropertyDetailPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();

  const { data } = await supabase
    .from("re_properties")
    .select("*, re_photos(id, url, order, is_cover)")
    .eq("slug", params.slug)
    .eq("status", "active")
    .single();

  if (!data) notFound();

  const property = data as Property & { re_photos: { id: string; url: string; order: number; is_cover: boolean }[] };
  const photos = (property.re_photos ?? []).sort((a, b) => a.order - b.order);
  const isRenta = property.operation_type === "renta";

  // Increment views (total + daily)
  const today = new Date().toISOString().slice(0, 10);
  await supabase.rpc("increment_property_view", {
    p_property_id: property.id,
    p_date: today,
  });

  // Related properties
  const { data: related } = await supabase
    .from("re_properties")
    .select("id, title, slug, price, neighborhood, property_type, operation_type, cover_photo")
    .eq("status", "active")
    .neq("id", property.id)
    .or(`property_type.eq.${property.property_type},neighborhood.eq.${property.neighborhood ?? ""}`)
    .limit(3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description ?? `${property.title} en ${property.neighborhood ?? property.city}`,
    url: `https://propiedades-mty.vercel.app/propiedades/${params.slug}`,
    numberOfRooms: property.bedrooms || undefined,
    floorSize: property.area_m2 ? { "@type": "QuantitativeValue", value: property.area_m2, unitCode: "MTK" } : undefined,
    address: {
      "@type": "PostalAddress",
      addressLocality: property.neighborhood ?? property.city,
      addressRegion: "Nuevo León",
      addressCountry: "MX",
    },
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: "MXN",
      availability: "https://schema.org/InStock",
    },
    image: property.cover_photo ?? undefined,
  };

  return (
    <div className="min-h-screen bg-cima-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <StickyPropertyHeader
        title={property.title}
        price={property.price}
        isRenta={isRenta}
        targetId="agendar-visita"
      />

      <MobileActionBar
        title={property.title}
        targetId="agendar-visita"
      />
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
          <Link href="/propiedades" className="text-xs text-cima-text-muted hover:text-cima-text transition-colors">← Volver al catálogo</Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          {/* Left */}
          <div>
            {/* Photo gallery */}
            <FadeIn>
              {photos.length > 0 ? (
                <PhotoGallery photos={photos} title={property.title} />
              ) : (
                <div className="rounded-xl overflow-hidden border border-cima-border mb-6 h-[300px] property-placeholder relative flex items-center justify-center">
                  <div className="text-center">
                    <Building2 className="h-12 w-12 text-cima-gold/30 mx-auto mb-2" />
                    <p className="text-xs text-cima-text-dim font-mono">Sin fotos disponibles</p>
                  </div>
                  <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "repeating-linear-gradient(0deg, #C8A96E 0px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #C8A96E 0px, transparent 1px, transparent 40px)" }} />
                </div>
              )}
            </FadeIn>

            {/* Badges + price */}
            <div className="flex items-center gap-3 flex-wrap mb-4">
              <span className={`px-3 py-1 rounded-md text-[10px] font-mono font-semibold tracking-widest uppercase ${isRenta
                ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                : "bg-cima-gold/20 text-cima-gold border border-cima-gold/30"
                }`}>
                {isRenta ? "Renta" : "Venta"}
              </span>
              <span className="px-3 py-1 rounded-md text-[10px] font-mono tracking-widest uppercase bg-cima-surface text-cima-text-muted border border-cima-border">
                {PROPERTY_TYPE_LABELS[property.property_type] ?? property.property_type}
              </span>
              {property.featured && (
                <span className="px-3 py-1 rounded-md text-[10px] font-mono font-semibold tracking-widest uppercase bg-cima-gold text-cima-bg">
                  Destacado
                </span>
              )}
            </div>

            <FadeIn delay={0.1}>
              <h1 className="font-heading font-bold text-2xl sm:text-3xl text-cima-text mb-2 leading-tight">{property.title}</h1>

              {property.neighborhood && (
                <div className="flex items-center gap-2 mb-5 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-cima-gold" />
                    <span className="text-sm text-cima-text-muted">{property.neighborhood}, {property.city}</span>
                  </div>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(`${property.neighborhood}, ${property.city}, Nuevo León, México`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-cima-border bg-cima-card text-[10px] font-mono text-cima-text-muted hover:border-cima-gold/40 hover:text-cima-gold transition-colors"
                  >
                    <MapPin className="h-2.5 w-2.5" />
                    Ver en mapa
                  </a>
                </div>
              )}
            </FadeIn>

            {/* Price */}
            <FadeIn delay={0.2}>
              <div className="rounded-xl border border-cima-gold/20 bg-cima-gold/5 px-6 py-5 mb-6 inline-flex items-baseline gap-2 shadow-lg shadow-cima-gold/5 backdrop-blur-sm">
                <span className="font-heading font-black text-4xl text-cima-gold">{formatPrice(property.price)}</span>
                {isRenta && <span className="text-sm text-cima-text-muted font-mono">/mes</span>}
              </div>
            </FadeIn>

            {/* Stats grid */}
            <FadeIn delay={0.3}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                {property.bedrooms > 0 && (
                  <div className="rounded-xl border border-cima-border bg-cima-card/50 backdrop-blur-sm p-4 text-center hover:border-cima-gold/30 transition-colors group">
                    <BedDouble className="h-5 w-5 text-cima-gold/70 group-hover:text-cima-gold mx-auto mb-1 transition-colors" />
                    <p className="font-heading font-bold text-lg text-cima-text">{property.bedrooms}</p>
                    <p className="font-mono text-[10px] text-cima-text-dim uppercase tracking-widest">Recámaras</p>
                  </div>
                )}
                {property.bathrooms > 0 && (
                  <div className="rounded-xl border border-cima-border bg-cima-card/50 backdrop-blur-sm p-4 text-center hover:border-cima-gold/30 transition-colors group">
                    <Bath className="h-5 w-5 text-cima-gold/70 group-hover:text-cima-gold mx-auto mb-1 transition-colors" />
                    <p className="font-heading font-bold text-lg text-cima-text">{property.bathrooms}</p>
                    <p className="font-mono text-[10px] text-cima-text-dim uppercase tracking-widest">Baños</p>
                  </div>
                )}
                {property.area_m2 && (
                  <div className="rounded-xl border border-cima-border bg-cima-card/50 backdrop-blur-sm p-4 text-center hover:border-cima-gold/30 transition-colors group">
                    <Maximize2 className="h-5 w-5 text-cima-gold/70 group-hover:text-cima-gold mx-auto mb-1 transition-colors" />
                    <p className="font-heading font-bold text-lg text-cima-text">{property.area_m2}</p>
                    <p className="font-mono text-[10px] text-cima-text-dim uppercase tracking-widest">m²</p>
                  </div>
                )}
                {property.parking > 0 && (
                  <div className="rounded-xl border border-cima-border bg-cima-card/50 backdrop-blur-sm p-4 text-center hover:border-cima-gold/30 transition-colors group">
                    <Car className="h-5 w-5 text-cima-gold/70 group-hover:text-cima-gold mx-auto mb-1 transition-colors" />
                    <p className="font-heading font-bold text-lg text-cima-text">{property.parking}</p>
                    <p className="font-mono text-[10px] text-cima-text-dim uppercase tracking-widest">Cajones</p>
                  </div>
                )}
              </div>
            </FadeIn>

            {/* Description */}
            {property.description && (
              <div className="mb-8">
                <h2 className="font-heading font-semibold text-lg text-cima-text mb-3">Descripción</h2>
                <p className="text-sm text-cima-text-muted leading-relaxed whitespace-pre-line">{property.description}</p>
              </div>
            )}

            {/* Features */}
            {property.features && property.features.length > 0 && (
              <div>
                <h2 className="font-heading font-semibold text-lg text-cima-text mb-3">Características</h2>
                <div className="flex flex-wrap gap-2">
                  {property.features.map((f) => (
                    <span key={f} className="px-3 py-1 rounded-full border border-cima-border bg-cima-card text-xs text-cima-text-muted">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Related properties */}
            {related && related.length > 0 && (
              <div className="mt-10">
                <h2 className="font-heading font-semibold text-lg text-cima-text mb-4">Propiedades similares</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {related.map((rel) => {
                    const relIsRenta = rel.operation_type === "renta";
                    return (
                      <Link key={rel.id} href={`/propiedades/${rel.slug}`}
                        className="rounded-xl border border-cima-border bg-cima-card overflow-hidden hover:border-cima-gold/40 transition-colors group">
                        <div className="relative aspect-[4/3] bg-cima-surface">
                          {rel.cover_photo ? (
                            <Image src={rel.cover_photo} alt={rel.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Building2 className="h-8 w-8 text-cima-gold/20" />
                            </div>
                          )}
                          <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-mono font-semibold tracking-widest uppercase ${relIsRenta
                            ? "bg-blue-500/80 text-blue-100"
                            : "bg-cima-gold/90 text-cima-bg"
                            }`}>
                            {relIsRenta ? "Renta" : "Venta"}
                          </span>
                        </div>
                        <div className="p-3">
                          <p className="text-sm font-medium text-cima-text leading-snug line-clamp-2 mb-1">{rel.title}</p>
                          {rel.neighborhood && (
                            <p className="text-[11px] text-cima-text-dim mb-2 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />{rel.neighborhood}
                            </p>
                          )}
                          <p className="text-sm font-bold text-cima-gold">{formatPrice(rel.price)}{relIsRenta ? "/mes" : ""}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right — visit form + contact */}
          <div className="space-y-4">
            <FadeIn delay={0.4}>
              <div id="agendar-visita" className="rounded-2xl border border-cima-border bg-cima-card/40 backdrop-blur-xl p-8 sticky top-24 shadow-2xl relative overflow-hidden group">
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 h-48 w-48 bg-cima-gold/5 rounded-full blur-3xl group-hover:bg-cima-gold/10 transition-colors" />

                <div className="flex items-center gap-2.5 mb-6">
                  <div className="h-8 w-8 rounded-lg bg-cima-gold/10 flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-cima-gold" />
                  </div>
                  <h3 className="font-heading font-bold text-cima-text text-lg">Agendar visita</h3>
                </div>
                <VisitForm propertyId={property.id} propertyTitle={property.title} />
              </div>
            </FadeIn>

            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_CIMA_WA}?text=Hola,%20me%20interesa%20la%20propiedad:%20${encodeURIComponent(property.title)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 px-4 py-3 text-sm font-medium text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
            >
              <Phone className="h-4 w-4" />
              Preguntar por WhatsApp
            </a>

            {/* Share */}
            <ShareProperty title={property.title} price={formatPrice(property.price)} slug={params.slug} />

            {/* Mortgage calculator */}
            {property.operation_type === "venta" && (
              <MortgageCalculator price={property.price} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
