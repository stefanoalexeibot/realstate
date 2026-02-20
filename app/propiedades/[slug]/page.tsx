import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2, BedDouble, Bath, Maximize2, Car, MapPin, Phone, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import VisitForm from "@/components/landing/visit-form";
import { formatPrice } from "@/lib/utils";
import type { Property } from "@/lib/types";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data } = await supabase
    .from("re_properties")
    .select("title, neighborhood, price, operation_type")
    .eq("slug", params.slug)
    .single();

  if (!data) return { title: "Propiedad no encontrada" };

  return {
    title: `${data.title} | Cima Propiedades`,
    description: `${data.title} en ${data.neighborhood ?? "Monterrey"}. ${formatPrice(data.price)}${data.operation_type === "renta" ? "/mes" : ""} en ${data.operation_type}.`,
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
    .select("*")
    .eq("slug", params.slug)
    .eq("status", "active")
    .single();

  if (!data) notFound();

  const property = data as Property;
  const isRenta = property.operation_type === "renta";

  // Increment views
  await supabase
    .from("re_properties")
    .update({ views: (property.views ?? 0) + 1 })
    .eq("id", property.id);

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
          <Link href="/propiedades" className="text-xs text-cima-text-muted hover:text-cima-text transition-colors">← Volver al catálogo</Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          {/* Left */}
          <div>
            {/* Image */}
            <div className="rounded-xl overflow-hidden border border-cima-border mb-6 h-[320px] sm:h-[420px] property-placeholder relative">
              {property.cover_photo ? (
                <img src={property.cover_photo} alt={property.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <Building2 className="h-12 w-12 text-cima-gold/30 mx-auto mb-2" />
                    <p className="text-xs text-cima-text-dim font-mono">Sin fotos disponibles</p>
                  </div>
                  <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                      backgroundImage: "repeating-linear-gradient(0deg, #C8A96E 0px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #C8A96E 0px, transparent 1px, transparent 40px)",
                    }}
                  />
                </div>
              )}
            </div>

            {/* Badges + price */}
            <div className="flex items-center gap-3 flex-wrap mb-4">
              <span className={`px-3 py-1 rounded-md text-[10px] font-mono font-semibold tracking-widest uppercase ${
                isRenta
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

            <h1 className="font-heading font-bold text-2xl sm:text-3xl text-cima-text mb-2">{property.title}</h1>

            {property.neighborhood && (
              <div className="flex items-center gap-1.5 mb-5">
                <MapPin className="h-3.5 w-3.5 text-cima-gold" />
                <span className="text-sm text-cima-text-muted">{property.neighborhood}, {property.city}</span>
              </div>
            )}

            {/* Price */}
            <div className="rounded-xl border border-cima-gold/20 bg-cima-gold/5 px-5 py-4 mb-6 inline-flex items-baseline gap-1.5">
              <span className="font-heading font-bold text-3xl text-cima-gold">{formatPrice(property.price)}</span>
              {isRenta && <span className="text-sm text-cima-text-muted font-mono">/mes</span>}
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {property.bedrooms > 0 && (
                <div className="rounded-xl border border-cima-border bg-cima-card p-4 text-center">
                  <BedDouble className="h-5 w-5 text-cima-gold mx-auto mb-1" />
                  <p className="font-heading font-bold text-lg text-cima-text">{property.bedrooms}</p>
                  <p className="font-mono text-[10px] text-cima-text-dim uppercase tracking-widest">Recámaras</p>
                </div>
              )}
              {property.bathrooms > 0 && (
                <div className="rounded-xl border border-cima-border bg-cima-card p-4 text-center">
                  <Bath className="h-5 w-5 text-cima-gold mx-auto mb-1" />
                  <p className="font-heading font-bold text-lg text-cima-text">{property.bathrooms}</p>
                  <p className="font-mono text-[10px] text-cima-text-dim uppercase tracking-widest">Baños</p>
                </div>
              )}
              {property.area_m2 && (
                <div className="rounded-xl border border-cima-border bg-cima-card p-4 text-center">
                  <Maximize2 className="h-5 w-5 text-cima-gold mx-auto mb-1" />
                  <p className="font-heading font-bold text-lg text-cima-text">{property.area_m2}</p>
                  <p className="font-mono text-[10px] text-cima-text-dim uppercase tracking-widest">m²</p>
                </div>
              )}
              {property.parking > 0 && (
                <div className="rounded-xl border border-cima-border bg-cima-card p-4 text-center">
                  <Car className="h-5 w-5 text-cima-gold mx-auto mb-1" />
                  <p className="font-heading font-bold text-lg text-cima-text">{property.parking}</p>
                  <p className="font-mono text-[10px] text-cima-text-dim uppercase tracking-widest">Cajones</p>
                </div>
              )}
            </div>

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
          </div>

          {/* Right — visit form + contact */}
          <div className="space-y-4">
            <div className="rounded-xl border border-cima-border bg-cima-card p-6 sticky top-6">
              <div className="flex items-center gap-2 mb-5">
                <Calendar className="h-4 w-4 text-cima-gold" />
                <h3 className="font-heading font-semibold text-cima-text">Agendar visita</h3>
              </div>
              <VisitForm propertyId={property.id} propertyTitle={property.title} />
            </div>

            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_CIMA_WA}?text=Hola,%20me%20interesa%20la%20propiedad:%20${encodeURIComponent(property.title)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 px-4 py-3 text-sm font-medium text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
            >
              <Phone className="h-4 w-4" />
              Preguntar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
