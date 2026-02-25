export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";
import {
    BedDouble, Bath, Maximize2, Car, MapPin, Building2, Phone,
} from "lucide-react";
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

    // Join con el asesor para obtener su teléfono
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

    // Usar teléfono del asesor asignado; fallback al global
    const agentPhone = (property.re_agentes as AgentInfo)?.phone?.replace(/\D/g, "") ?? null;
    const waPhone = agentPhone ? `52${agentPhone.replace(/^52/, "")}` : globalWa;

    const photos = (property.re_photos ?? []).sort((a, b) => a.order - b.order);
    const isRenta = property.operation_type === "renta";
    const coverPhoto = photos.find((p) => p.is_cover)?.url ?? photos[0]?.url ?? property.cover_photo;

    const waMessage = encodeURIComponent(`Hola, me interesa la propiedad: *${property.title}*. ¿Podría darme más información?`);
    const waUrl = `https://wa.me/${waPhone}?text=${waMessage}`;

    const stats = [
        property.bedrooms > 0 && { icon: BedDouble, value: property.bedrooms, label: "Recámaras" },
        property.bathrooms > 0 && { icon: Bath, value: property.bathrooms, label: "Baños" },
        property.area_m2 && { icon: Maximize2, value: `${property.area_m2}`, label: "m²" },
        property.parking > 0 && { icon: Car, value: property.parking, label: "Cajones" },
    ].filter(Boolean) as { icon: React.ElementType; value: string | number; label: string }[];

    return (
        // overflow-x-hidden evita que el hero o sticky button ensanche la página
        <div className="min-h-screen bg-cima-bg overflow-x-hidden">

            {/* ── WhatsApp sticky button ── */}
            <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                id="wa-sticky"
                className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#25D366] text-white px-4 py-3 text-sm font-bold shadow-2xl shadow-[#25D366]/40 hover:bg-[#1eb85a] transition-all hover:scale-105 active:scale-95"
            >
                <Phone className="h-4 w-4" />
                WhatsApp
            </a>

            {/* ── Hero (max-w contenido pero imagen full) ── */}
            <div className="relative w-full h-[60vh] min-h-[360px] max-h-[560px] bg-cima-surface">
                {coverPhoto ? (
                    <Image
                        src={coverPhoto}
                        alt={property.title}
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Building2 className="h-16 w-16 text-cima-gold/20" />
                    </div>
                )}
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                {/* Hero content centrado */}
                <div className="absolute inset-x-0 bottom-0 max-w-3xl mx-auto px-6 pb-8">
                    <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`px-3 py-1 rounded-md text-[10px] font-mono font-bold tracking-widest uppercase ${isRenta ? "bg-blue-500 text-white" : "bg-cima-gold text-cima-bg"}`}>
                            {isRenta ? "Renta" : "Venta"}
                        </span>
                        <span className="px-3 py-1 rounded-md text-[10px] font-mono font-semibold tracking-widest uppercase bg-white/15 text-white border border-white/25 backdrop-blur-sm">
                            {PROP_LABELS[property.property_type] ?? property.property_type}
                        </span>
                    </div>
                    <h1 className="font-heading font-black text-2xl sm:text-4xl text-white leading-tight mb-2 drop-shadow-lg">
                        {property.title}
                    </h1>
                    {property.neighborhood && (
                        <div className="flex items-center gap-1.5 text-white/80 text-sm">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />
                            {property.neighborhood}, {property.city}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Main content ── */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">

                    {/* ── Left column ── */}
                    <div className="space-y-7">

                        {/* Price */}
                        <div className="flex items-baseline gap-2">
                            <span className="font-heading font-black text-4xl sm:text-5xl text-cima-gold">
                                {formatPrice(property.price)}
                            </span>
                            {isRenta && <span className="text-cima-text-muted text-sm font-mono">/mes</span>}
                        </div>

                        {/* Stats */}
                        {stats.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {stats.map(({ icon: Icon, value, label }) => (
                                    <div key={label} className="rounded-xl border border-cima-border bg-cima-card p-4 text-center">
                                        <Icon className="h-5 w-5 text-cima-gold mx-auto mb-1.5" />
                                        <p className="font-heading font-bold text-lg text-cima-text">{value}</p>
                                        <p className="font-mono text-[10px] text-cima-text-dim uppercase tracking-widest">{label}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Description */}
                        {property.description && (
                            <div className="rounded-xl border border-cima-border bg-cima-card p-5">
                                <h2 className="font-heading font-semibold text-cima-text mb-3">Descripción</h2>
                                <p className="text-sm text-cima-text-muted leading-relaxed whitespace-pre-line">
                                    {property.description}
                                </p>
                            </div>
                        )}

                        {/* Features */}
                        {property.features && property.features.length > 0 && (
                            <div>
                                <h2 className="font-heading font-semibold text-cima-text mb-3">Características</h2>
                                <div className="flex flex-wrap gap-2">
                                    {property.features.map((f) => (
                                        <span key={f} className="px-3 py-1.5 rounded-full border border-cima-border bg-cima-card text-xs text-cima-text-muted">
                                            {f}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Photo gallery */}
                        {photos.length > 1 && (
                            <div>
                                <h2 className="font-heading font-semibold text-cima-text mb-3">Galería de fotos</h2>
                                <PhotoGallery photos={photos} title={property.title} />
                            </div>
                        )}

                        {/* Mobile CTA */}
                        <div className="lg:hidden rounded-2xl border border-cima-border bg-cima-card p-6">
                            <p className="font-mono text-[10px] tracking-[0.15em] text-cima-gold uppercase mb-1">¿Te interesa?</p>
                            <h2 className="font-heading font-bold text-xl text-cima-text mb-5">Déjanos tus datos</h2>
                            <LpLeadForm
                                propertyId={property.id}
                                propertyTitle={property.title}
                                propertySlug={params.slug}
                                operationType={property.operation_type}
                                neighborhood={property.neighborhood}
                                waPhone={waPhone}
                            />
                        </div>

                        {/* Urgency banner */}
                        <div className="rounded-2xl bg-gradient-to-r from-cima-gold/10 to-cima-gold/5 border border-cima-gold/20 p-6 text-center">
                            <p className="font-heading font-bold text-cima-text text-lg mb-1">
                                ¿Listo para dar el siguiente paso?
                            </p>
                            <p className="text-sm text-cima-text-muted mb-4">
                                Habla con un asesor y agenda tu visita sin compromiso.
                            </p>
                            <a
                                href={waUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] text-white px-6 py-3.5 font-heading font-bold text-sm hover:bg-[#1eb85a] transition-colors"
                            >
                                <Phone className="h-4 w-4" />
                                Contactar por WhatsApp
                            </a>
                        </div>
                    </div>

                    {/* ── Right column — sticky desktop ── */}
                    <div className="hidden lg:block">
                        <div className="sticky top-6 rounded-2xl border border-cima-border bg-cima-card/60 backdrop-blur-xl p-6 shadow-2xl">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="h-1.5 w-1.5 rounded-full bg-cima-gold animate-pulse" />
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

            {/* ── Mini footer ── */}
            <footer className="border-t border-cima-border mt-12 py-6">
                <div className="max-w-3xl mx-auto px-6 flex items-center justify-between">
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
