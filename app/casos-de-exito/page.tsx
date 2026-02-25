export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Building2, MapPin, BedDouble, Bath, Maximize2, CheckCircle2, Clock } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Property } from "@/lib/types";
import FadeIn from "@/components/landing/fade-in";

const PROP_LABELS: Record<string, string> = {
    casa: "Casa", departamento: "Departamento", terreno: "Terreno",
    local: "Local", oficina: "Oficina",
};

function daysLabel(days: number | null): string {
    if (!days) return "";
    if (days === 1) return "Vendida en 1 día";
    if (days <= 7) return `Vendida en ${days} días`;
    if (days <= 30) return `Vendida en ${Math.round(days / 7)} semana${Math.round(days / 7) === 1 ? "" : "s"}`;
    const months = Math.round(days / 30);
    return `Vendida en ${months} mes${months === 1 ? "" : "es"}`;
}

export const metadata = {
    title: "Casos de Éxito | Cima Propiedades",
    description: "Propiedades vendidas y rentadas por Cima Propiedades en Monterrey y área metropolitana.",
};

export default async function CasosDeExitoPage() {
    const supabase = createClient();

    const { data } = await supabase
        .from("re_properties")
        .select("id, title, slug, price, operation_type, property_type, neighborhood, city, bedrooms, bathrooms, area_m2, cover_photo, status, sold_at, days_to_sell, created_at")
        .in("status", ["sold", "rented"])
        .order("sold_at", { ascending: false, nullsFirst: false });

    const properties = (data ?? []) as Pick<Property,
        "id" | "title" | "slug" | "price" | "operation_type" | "property_type" |
        "neighborhood" | "city" | "bedrooms" | "bathrooms" | "area_m2" |
        "cover_photo" | "status" | "sold_at" | "days_to_sell" | "created_at"
    >[];

    // Stats
    const totalVendidas = properties.filter(p => p.status === "sold").length;
    const totalRentadas = properties.filter(p => p.status === "rented").length;
    const avgDays = (() => {
        const withDays = properties.filter(p => p.days_to_sell);
        if (!withDays.length) return null;
        return Math.round(withDays.reduce((s, p) => s + (p.days_to_sell ?? 0), 0) / withDays.length);
    })();

    return (
        <div className="min-h-screen bg-cima-bg">
            {/* ── Header ── */}
            <div className="border-b border-cima-border bg-cima-surface/30">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                    <FadeIn>
                        <p className="font-mono text-[10px] tracking-[0.25em] text-cima-gold uppercase mb-2">
                            Trayectoria
                        </p>
                        <h1 className="font-heading font-black text-3xl sm:text-4xl text-cima-text mb-2">
                            Casos de Éxito
                        </h1>
                        <p className="text-sm sm:text-base text-cima-text-muted max-w-xl">
                            Propiedades que ya encontraron a su dueño. Resultados reales, clientes satisfechos.
                        </p>
                    </FadeIn>

                    {/* Stats row */}
                    {(totalVendidas > 0 || totalRentadas > 0) && (
                        <FadeIn delay={0.1}>
                            <div className="flex flex-wrap gap-4 sm:gap-8 mt-6">
                                {totalVendidas > 0 && (
                                    <div>
                                        <p className="font-heading font-black text-3xl text-cima-gold leading-none">{totalVendidas}</p>
                                        <p className="font-mono text-[10px] text-cima-text-dim uppercase tracking-widest mt-0.5">Vendidas</p>
                                    </div>
                                )}
                                {totalRentadas > 0 && (
                                    <div>
                                        <p className="font-heading font-black text-3xl text-blue-400 leading-none">{totalRentadas}</p>
                                        <p className="font-mono text-[10px] text-cima-text-dim uppercase tracking-widest mt-0.5">Rentadas</p>
                                    </div>
                                )}
                                {avgDays && (
                                    <div>
                                        <p className="font-heading font-black text-3xl text-emerald-400 leading-none">{avgDays}</p>
                                        <p className="font-mono text-[10px] text-cima-text-dim uppercase tracking-widest mt-0.5">Días promedio</p>
                                    </div>
                                )}
                            </div>
                        </FadeIn>
                    )}
                </div>
            </div>

            {/* ── Grid ── */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                {properties.length === 0 ? (
                    <div className="text-center py-24">
                        <Building2 className="h-10 w-10 text-cima-text-dim mx-auto mb-3" />
                        <p className="text-cima-text-muted">Aún no hay propiedades cerradas.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                        {properties.map((p, i) => {
                            const isSold = p.status === "sold";
                            const label = daysLabel(p.days_to_sell);
                            return (
                                <FadeIn key={p.id} delay={i * 0.04}>
                                    <Link
                                        href={`/propiedades/${p.slug}`}
                                        className="group block rounded-2xl border border-cima-border bg-cima-card overflow-hidden hover:border-cima-gold/40 hover:shadow-xl hover:shadow-black/20 transition-all duration-300"
                                    >
                                        {/* Image with overlay */}
                                        <div className="relative aspect-[4/3] bg-cima-surface overflow-hidden">
                                            {p.cover_photo ? (
                                                <Image
                                                    src={p.cover_photo}
                                                    alt={p.title}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-105 grayscale-[20%]"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Building2 className="h-12 w-12 text-cima-gold/20" />
                                                </div>
                                            )}

                                            {/* Dark overlay */}
                                            <div className="absolute inset-0 bg-black/30" />

                                            {/* VENDIDA / RENTADA stamp */}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className={`
                                                    flex items-center gap-2 px-4 py-2 rounded-full font-mono font-bold text-sm tracking-widest uppercase
                                                    border-2 rotate-[-8deg] shadow-lg
                                                    ${isSold
                                                        ? "bg-cima-gold/90 text-cima-bg border-cima-gold"
                                                        : "bg-blue-500/90 text-white border-blue-400"
                                                    }
                                                `}>
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    {isSold ? "Vendida" : "Rentada"}
                                                </div>
                                            </div>

                                            {/* Days badge */}
                                            {label && (
                                                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/70 text-white text-[10px] font-mono px-2.5 py-1 rounded-full backdrop-blur-sm">
                                                    <Clock className="h-3 w-3 text-emerald-400" />
                                                    {label}
                                                </div>
                                            )}
                                        </div>

                                        {/* Card body */}
                                        <div className="p-4">
                                            <p className="font-mono text-[9px] tracking-[0.15em] text-cima-text-dim uppercase mb-1">
                                                {PROP_LABELS[p.property_type] ?? p.property_type}
                                                {p.neighborhood && ` · ${p.neighborhood}`}
                                            </p>
                                            <h2 className="font-heading font-bold text-sm text-cima-text leading-snug mb-2 line-clamp-2 group-hover:text-cima-gold transition-colors">
                                                {p.title}
                                            </h2>
                                            <p className="font-heading font-black text-lg text-cima-gold">
                                                {formatPrice(p.price)}
                                                {p.operation_type === "renta" && <span className="font-mono font-normal text-xs text-cima-text-muted">/mes</span>}
                                            </p>

                                            {/* Mini stats */}
                                            <div className="flex items-center gap-3 mt-2 text-cima-text-dim">
                                                {p.bedrooms > 0 && (
                                                    <span className="flex items-center gap-1 text-xs">
                                                        <BedDouble className="h-3 w-3" />{p.bedrooms}
                                                    </span>
                                                )}
                                                {p.bathrooms > 0 && (
                                                    <span className="flex items-center gap-1 text-xs">
                                                        <Bath className="h-3 w-3" />{p.bathrooms}
                                                    </span>
                                                )}
                                                {p.area_m2 && (
                                                    <span className="flex items-center gap-1 text-xs">
                                                        <Maximize2 className="h-3 w-3" />{p.area_m2} m²
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                </FadeIn>
                            );
                        })}
                    </div>
                )}

                {/* CTA */}
                <div className="mt-16 rounded-2xl border border-cima-border bg-gradient-to-br from-cima-gold/10 to-transparent p-8 sm:p-10 text-center">
                    <p className="font-mono text-[10px] tracking-[0.25em] text-cima-gold uppercase mb-2">¿Quieres resultados así?</p>
                    <h2 className="font-heading font-bold text-2xl text-cima-text mb-3">
                        Vende o renta tu propiedad con nosotros
                    </h2>
                    <p className="text-sm text-cima-text-muted mb-6 max-w-md mx-auto">
                        Nuestro equipo de asesores expertos en Monterrey y área metropolitana.
                    </p>
                    <Link
                        href="/#contacto"
                        className="inline-flex items-center gap-2 rounded-xl bg-cima-gold text-cima-bg px-6 py-3.5 font-heading font-bold text-sm hover:bg-cima-gold-light transition-colors"
                    >
                        <MapPin className="h-4 w-4" />
                        Quiero vender mi propiedad
                    </Link>
                </div>
            </div>
        </div>
    );
}
