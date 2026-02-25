export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";
import { BedDouble, Bath, Maximize2, Car, MapPin, Building2, Phone } from "lucide-react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import type { Property } from "@/lib/types";
import LpLeadForm from "@/components/lp/lp-lead-form";
import LpCopyButton from "@/components/lp/lp-copy-button";
import PhotoGallery from "@/components/landing/photo-gallery";

const PROP_LABELS: Record<string, string> = {
    casa: "Casa", departamento: "Departamento", terreno: "Terreno",
    local: "Local comercial", oficina: "Oficina",
};

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const supabase = createAdminClient();
    const { data } = await supabase
        .from("re_properties")
        .select("title, neighborhood, price, operation_type, cover_photo")
        .eq("slug", params.slug)
        .single();

    if (!data) return { title: "Propiedad" };
    const desc = `${data.title} en ${data.neighborhood ?? "Monterrey"}. ${formatPrice(data.price)}${data.operation_type === "renta" ? "/mes" : ""}.`;
    return {
        title: `${data.title} | Cima Propiedades`,
        description: desc,
        openGraph: {
            title: data.title,
            description: desc,
            ...(data.cover_photo ? { images: [{ url: data.cover_photo, width: 1200, height: 630, alt: data.title }] } : {}),
        },
    };
}

export default async function LpPage({ params }: { params: { slug: string } }) {
    const supabase = createAdminClient();
    const globalWa = process.env.NEXT_PUBLIC_CIMA_WA ?? "521234567890";

    const { data } = await supabase
        .from("re_properties")
        .select("*, re_photos(id, url, order, is_cover), re_agentes!agent_id(name, phone)")
        .eq("slug", params.slug)
        .single();

    if (!data) notFound();

    type AgentInfo = { name: string; phone: string | null } | null;
    const property = data as Property & {
        re_photos: { id: string; url: string; order: number; is_cover: boolean }[];
        re_agentes: AgentInfo;
    };

    const agentPhone = (property.re_agentes as AgentInfo)?.phone?.replace(/\D/g, "") ?? null;
    const waPhone = agentPhone ? `52${agentPhone.replace(/^52/, "")}` : globalWa;

    const photos = (property.re_photos ?? []).sort((a, b) => a.order - b.order);
    const isRenta = property.operation_type === "renta";
    const coverPhoto = photos.find((p) => p.is_cover)?.url ?? photos[0]?.url ?? property.cover_photo;

    const waMessage = encodeURIComponent(`Hola, me interesa la propiedad: *${property.title}*. ¿Me puede dar más información?`);
    const waUrl = `https://wa.me/${waPhone}?text=${waMessage}`;

    const stats = [
        property.bedrooms > 0 && { icon: BedDouble, value: property.bedrooms, label: "Recámaras" },
        property.bathrooms > 0 && { icon: Bath, value: property.bathrooms, label: "Baños" },
        property.area_m2 && { icon: Maximize2, value: `${property.area_m2}`, label: "m²" },
        property.parking > 0 && { icon: Car, value: property.parking, label: "Cajones" },
    ].filter(Boolean) as { icon: React.ElementType; value: string | number; label: string }[];

    return (
        <div className="min-h-screen bg-cima-bg overflow-x-hidden">

            {/* ── WhatsApp FAB — siempre visible ── */}
            <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="fixed bottom-5 right-4 z-50 flex items-center gap-2 rounded-full bg-[#25D366] text-white
                           px-4 py-3 text-sm font-bold shadow-lg shadow-[#25D366]/30
                           hover:bg-[#1eb85a] hover:scale-105 active:scale-95 transition-all
                           sm:bottom-6 sm:right-6 sm:px-5 sm:py-3.5"
            >
                <Phone className="h-4 w-4 shrink-0" />
                <span className="hidden xs:inline sm:inline">WhatsApp</span>
            </a>

            {/* ── HERO ── */}
            {/* iPhone: 50vh | iPad: 55vh | Laptop: 60vh, cap 600px */}
            <div className="relative w-full h-[50vh] min-h-[300px] md:h-[55vh] lg:h-[60vh] lg:max-h-[600px] bg-cima-surface">
                {coverPhoto ? (
                    <Image src={coverPhoto} alt={property.title} fill className="object-cover" priority />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Building2 className="h-16 w-16 text-cima-gold/20" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                {/* Hero text — bottom aligned */}
                <div className="absolute inset-x-0 bottom-0 px-4 pb-6 sm:px-8 sm:pb-8 lg:max-w-3xl lg:mx-auto">
                    <div className="flex flex-wrap gap-2 mb-2 sm:mb-3">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-widest uppercase ${isRenta ? "bg-blue-500 text-white" : "bg-cima-gold text-cima-bg"}`}>
                            {isRenta ? "Renta" : "Venta"}
                        </span>
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-semibold tracking-widest uppercase bg-white/15 text-white border border-white/25">
                            {PROP_LABELS[property.property_type] ?? property.property_type}
                        </span>
                    </div>
                    {/* iPhone: text-2xl | iPad: text-3xl | Laptop: text-4xl */}
                    <h1 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-white leading-tight mb-1.5 drop-shadow-lg">
                        {property.title}
                    </h1>
                    {property.neighborhood && (
                        <div className="flex items-center gap-1.5 text-white/75 text-xs sm:text-sm">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />
                            {property.neighborhood}, {property.city}
                        </div>
                    )}
                </div>
            </div>

            {/* ── LAYOUT: 1 col mobile/tablet · 2 cols desktop ── */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-10">
                <div className="flex flex-col lg:grid lg:grid-cols-[1fr_300px] lg:gap-8 gap-6">

                    {/* ══ LEFT / MAIN ══ */}
                    <div className="space-y-5 sm:space-y-7 min-w-0">

                        {/* Price */}
                        <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-cima-gold leading-none">
                                {formatPrice(property.price)}
                            </span>
                            {isRenta && <span className="text-cima-text-muted text-sm font-mono">/mes</span>}
                        </div>

                        {/* Stats — 2 cols on iPhone, 4 cols on iPad+ */}
                        {stats.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                                {stats.map(({ icon: Icon, value, label }) => (
                                    <div key={label} className="rounded-xl border border-cima-border bg-cima-card px-3 py-4 text-center">
                                        <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-cima-gold mx-auto mb-1.5" />
                                        <p className="font-heading font-bold text-base sm:text-lg text-cima-text leading-none">{value}</p>
                                        <p className="font-mono text-[9px] sm:text-[10px] text-cima-text-dim uppercase tracking-widest mt-0.5">{label}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Form card — visible only on iPhone + iPad (hidden on lg) */}
                        <div className="lg:hidden rounded-2xl border border-cima-border bg-cima-card p-5 sm:p-6">
                            <p className="font-mono text-[10px] tracking-[0.15em] text-cima-gold uppercase mb-1">¿Te interesa?</p>
                            <h2 className="font-heading font-bold text-lg sm:text-xl text-cima-text mb-4">Déjanos tus datos</h2>
                            <LpLeadForm
                                propertyId={property.id}
                                propertyTitle={property.title}
                                propertySlug={params.slug}
                                operationType={property.operation_type}
                                neighborhood={property.neighborhood}
                                waPhone={waPhone}
                            />
                        </div>

                        {/* Description */}
                        {property.description && (
                            <div className="rounded-xl border border-cima-border bg-cima-card p-4 sm:p-5">
                                <h2 className="font-heading font-semibold text-base sm:text-lg text-cima-text mb-2 sm:mb-3">Descripción</h2>
                                <p className="text-sm text-cima-text-muted leading-relaxed whitespace-pre-line">
                                    {property.description}
                                </p>
                            </div>
                        )}

                        {/* Features */}
                        {property.features && property.features.length > 0 && (
                            <div>
                                <h2 className="font-heading font-semibold text-base sm:text-lg text-cima-text mb-2 sm:mb-3">Características</h2>
                                <div className="flex flex-wrap gap-2">
                                    {property.features.map((f) => (
                                        <span key={f} className="px-3 py-1.5 rounded-full border border-cima-border bg-cima-card text-xs text-cima-text-muted">
                                            {f}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Gallery — only if >1 photo */}
                        {photos.length > 1 && (
                            <div>
                                <h2 className="font-heading font-semibold text-base sm:text-lg text-cima-text mb-2 sm:mb-3">Fotos</h2>
                                <PhotoGallery photos={photos} title={property.title} />
                            </div>
                        )}

                        {/* Bottom CTA banner */}
                        <div className="rounded-2xl bg-gradient-to-br from-cima-gold/10 to-cima-gold/5 border border-cima-gold/20 p-5 sm:p-6 text-center">
                            <p className="font-heading font-bold text-cima-text text-base sm:text-lg mb-1">
                                ¿Listo para agendar tu visita?
                            </p>
                            <p className="text-xs sm:text-sm text-cima-text-muted mb-4">
                                Habla con un asesor ahora, sin compromiso.
                            </p>
                            <a
                                href={waUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] text-white px-5 py-3 sm:px-6 sm:py-3.5 font-heading font-bold text-sm hover:bg-[#1eb85a] transition-colors"
                            >
                                <Phone className="h-4 w-4" />
                                Contactar por WhatsApp
                            </a>
                        </div>
                    </div>

                    {/* ══ RIGHT — sticky form (laptop only) ══ */}
                    <div className="hidden lg:block">
                        <div className="sticky top-6 rounded-2xl border border-cima-border bg-cima-card/60 backdrop-blur-xl p-6 shadow-2xl">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-cima-gold animate-pulse block" />
                                <p className="font-mono text-[10px] tracking-[0.15em] text-cima-gold uppercase">Disponible ahora</p>
                            </div>
                            <h2 className="font-heading font-bold text-xl text-cima-text mb-5">¿Te interesa esta propiedad?</h2>
                            <LpLeadForm
                                propertyId={property.id}
                                propertyTitle={property.title}
                                propertySlug={params.slug}
                                operationType={property.operation_type}
                                neighborhood={property.neighborhood}
                                waPhone={waPhone}
                            />
                            <div className="mt-4 flex items-center gap-3">
                                <div className="h-px flex-1 bg-cima-border" />
                                <span className="text-[10px] font-mono text-cima-text-dim">O ESCRÍBENOS</span>
                                <div className="h-px flex-1 bg-cima-border" />
                            </div>
                            <a
                                href={waUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-4 flex items-center justify-center gap-2 w-full rounded-xl border border-[#25D366]/30 bg-[#25D366]/10 text-[#25D366] px-4 py-3 text-sm font-medium hover:bg-[#25D366]/20 transition-colors"
                            >
                                <Phone className="h-4 w-4" />
                                Preguntar por WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── MINI FOOTER ── */}
            <footer className="border-t border-cima-border mt-8 sm:mt-12 py-5 sm:py-6">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-lg bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center">
                            <Building2 className="h-3.5 w-3.5 text-cima-gold" />
                        </div>
                        <div className="leading-none">
                            <p className="font-heading font-bold text-sm text-cima-text">Cima</p>
                            <p className="font-mono text-[9px] tracking-[0.2em] text-cima-text-dim uppercase">Propiedades</p>
                        </div>
                    </div>
                    <LpCopyButton slug={params.slug} />
                </div>
            </footer>
        </div>
    );
}
