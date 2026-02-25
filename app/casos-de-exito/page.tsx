export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Building2, MapPin, BedDouble, Bath, Maximize2, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Property } from "@/lib/types";
import FadeIn from "@/components/landing/fade-in";
import AnimatedCounter from "@/components/landing/animated-counter";

const PROP_LABELS: Record<string, string> = {
    casa: "Casa", departamento: "Departamento", terreno: "Terreno",
    local: "Local", oficina: "Oficina",
};

function daysLabel(days: number | null): string {
    if (!days) return "";
    if (days === 1) return "Cerrada en 1 día";
    if (days <= 7) return `Cerrada en ${days} días`;
    if (days <= 30) return `Cerrada en ${Math.round(days / 7)} semana${Math.round(days / 7) === 1 ? "" : "s"}`;
    const months = Math.round(days / 30);
    return `Cerrada en ${months} mes${months === 1 ? "" : "es"}`;
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
    const totalCerradas = totalVendidas + totalRentadas;

    return (
        <div className="min-h-screen bg-cima-bg">
            {/* ── Hero Header ── */}
            <div className="relative border-b border-cima-border overflow-hidden">
                {/* Fondo decorativo */}
                <div className="absolute inset-0 bg-gradient-to-br from-cima-gold/5 via-transparent to-blue-500/5 pointer-events-none" />
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cima-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
                    {/* Nav */}
                    <div className="flex items-center justify-between mb-8 sm:mb-12">
                        <Link href="/" className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-lg bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center">
                                <Building2 className="h-4 w-4 text-cima-gold" />
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="font-heading font-bold text-sm text-cima-text">Cima</span>
                                <span className="font-mono text-[9px] tracking-[0.2em] text-cima-text-muted uppercase">Propiedades</span>
                            </div>
                        </Link>
                        <Link href="/propiedades" className="text-xs text-cima-text-muted hover:text-cima-text transition-colors">← Catálogo</Link>
                    </div>

                    <FadeIn>
                        <p className="font-mono text-[10px] tracking-[0.3em] text-cima-gold uppercase mb-3 flex items-center gap-2">
                            <TrendingUp className="h-3 w-3" />
                            Trayectoria Comprobada
                        </p>
                        <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-cima-text mb-3 leading-[1.05]">
                            Casos de<br />
                            <span className="text-cima-gold">Éxito</span>
                        </h1>
                        <p className="text-sm sm:text-base text-cima-text-muted max-w-md mt-4">
                            Propiedades que ya encontraron a su dueño. Resultados reales, clientes satisfechos.
                        </p>
                    </FadeIn>

                    {/* Stats con AnimatedCounter ── */}
                    {totalCerradas > 0 && (
                        <FadeIn delay={0.15}>
                            <div className="flex flex-wrap gap-6 sm:gap-12 mt-8 sm:mt-10">
                                {totalVendidas > 0 && (
                                    <div className="flex flex-col">
                                        <p className="font-heading font-black text-4xl sm:text-5xl leading-none">
                                            <AnimatedCounter
                                                to={totalVendidas}
                                                duration={1.6}
                                                className="text-cima-gold"
                                            />
                                        </p>
                                        <p className="font-mono text-[10px] text-cima-text-dim uppercase tracking-[0.2em] mt-1.5">Propiedades vendidas</p>
                                    </div>
                                )}
                                {totalRentadas > 0 && (
                                    <div className="flex flex-col">
                                        <p className="font-heading font-black text-4xl sm:text-5xl leading-none">
                                            <AnimatedCounter
                                                to={totalRentadas}
                                                duration={1.6}
                                                className="text-blue-400"
                                            />
                                        </p>
                                        <p className="font-mono text-[10px] text-cima-text-dim uppercase tracking-[0.2em] mt-1.5">Propiedades rentadas</p>
                                    </div>
                                )}
                                {avgDays && (
                                    <div className="flex flex-col">
                                        <p className="font-heading font-black text-4xl sm:text-5xl leading-none">
                                            <AnimatedCounter
                                                to={avgDays}
                                                duration={2}
                                                suffix=" días"
                                                className="text-emerald-400"
                                            />
                                        </p>
                                        <p className="font-mono text-[10px] text-cima-text-dim uppercase tracking-[0.2em] mt-1.5">Promedio de cierre</p>
                                    </div>
                                )}
                            </div>
                        </FadeIn>
                    )}
                </div>
            </div>

            {/* ── Grid de propiedades ── */}
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
                                <FadeIn key={p.id} delay={Math.min(i * 0.08, 0.5)}>
                                    <Link
                                        href={`/propiedades/${p.slug}`}
                                        className="group block rounded-2xl border border-cima-border bg-cima-card overflow-hidden hover:border-cima-gold/50 hover:shadow-2xl hover:shadow-black/30 transition-all duration-500"
                                    >
                                        {/* ── Imagen: B&W en reposo → color en hover ── */}
                                        <div className="relative aspect-[4/3] bg-cima-surface overflow-hidden">
                                            {p.cover_photo ? (
                                                <Image
                                                    src={p.cover_photo}
                                                    alt={p.title}
                                                    fill
                                                    className="object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Building2 className="h-12 w-12 text-cima-gold/20" />
                                                </div>
                                            )}

                                            {/* Overlay oscuro que se aclara en hover */}
                                            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/20 transition-colors duration-500" />

                                            {/* Sello VENDIDA / RENTADA — se achica en hover */}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className={`
                                                    flex items-center gap-2 px-4 py-2 rounded-full font-mono font-bold text-sm tracking-widest uppercase
                                                    border-2 rotate-[-8deg] shadow-lg
                                                    transition-all duration-500
                                                    group-hover:scale-75 group-hover:opacity-60
                                                    ${isSold
                                                        ? "bg-cima-gold/95 text-cima-bg border-cima-gold"
                                                        : "bg-blue-500/95 text-white border-blue-400"
                                                    }
                                                `}>
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    {isSold ? "Vendida" : "Rentada"}
                                                </div>
                                            </div>

                                            {/* Badge tiempo — aparece en hover */}
                                            {label && (
                                                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/80 text-white text-[10px] font-mono px-2.5 py-1 rounded-full backdrop-blur-sm
                                                    opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                                                    <Clock className="h-3 w-3 text-emerald-400" />
                                                    {label}
                                                </div>
                                            )}

                                            {/* Precio flotante en hover */}
                                            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                                                <span className="bg-cima-bg/90 text-cima-gold font-heading font-black text-sm px-3 py-1.5 rounded-lg backdrop-blur-sm border border-cima-gold/30">
                                                    {formatPrice(p.price)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Card body */}
                                        <div className="p-4 sm:p-5">
                                            <p className="font-mono text-[9px] tracking-[0.15em] text-cima-text-dim uppercase mb-1.5">
                                                {PROP_LABELS[p.property_type] ?? p.property_type}
                                                {p.neighborhood && ` · ${p.neighborhood}`}
                                            </p>
                                            <h2 className="font-heading font-bold text-sm sm:text-base text-cima-text leading-snug mb-3 line-clamp-2 group-hover:text-cima-gold transition-colors duration-300">
                                                {p.title}
                                            </h2>

                                            <div className="flex items-center justify-between">
                                                <p className="font-heading font-black text-lg text-cima-gold">
                                                    {formatPrice(p.price)}
                                                    {p.operation_type === "renta" && <span className="font-mono font-normal text-xs text-cima-text-muted">/mes</span>}
                                                </p>

                                                {/* Mini stats */}
                                                <div className="flex items-center gap-2.5 text-cima-text-dim">
                                                    {p.bedrooms > 0 && (
                                                        <span className="flex items-center gap-1 text-[11px]">
                                                            <BedDouble className="h-3 w-3" />{p.bedrooms}
                                                        </span>
                                                    )}
                                                    {p.bathrooms > 0 && (
                                                        <span className="flex items-center gap-1 text-[11px]">
                                                            <Bath className="h-3 w-3" />{p.bathrooms}
                                                        </span>
                                                    )}
                                                    {p.area_m2 && (
                                                        <span className="flex items-center gap-1 text-[11px]">
                                                            <Maximize2 className="h-3 w-3" />{p.area_m2}m²
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Separador y días si existen */}
                                            {p.days_to_sell && (
                                                <div className="mt-3 pt-3 border-t border-cima-border/60 flex items-center gap-1.5">
                                                    <Clock className="h-3 w-3 text-emerald-500" />
                                                    <span className="text-[10px] font-mono text-cima-text-dim">{daysLabel(p.days_to_sell)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                </FadeIn>
                            );
                        })}
                    </div>
                )}

                {/* ── CTA ── */}
                <FadeIn delay={0.1}>
                    <div className="mt-16 rounded-2xl border border-cima-gold/20 bg-gradient-to-br from-cima-gold/10 via-cima-gold/5 to-transparent p-8 sm:p-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cima-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                        <div className="relative text-center">
                            <p className="font-mono text-[10px] tracking-[0.3em] text-cima-gold uppercase mb-3 flex items-center justify-center gap-2">
                                <TrendingUp className="h-3 w-3" />
                                ¿Tu propiedad podría ser el próximo caso de éxito?
                            </p>
                            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-cima-text mb-3">
                                Vende o renta con nosotros
                            </h2>
                            <p className="text-sm text-cima-text-muted mb-7 max-w-sm mx-auto">
                                Asesores expertos en Monterrey y área metropolitana.{avgDays ? ` Tiempo promedio de cierre: ${avgDays} días.` : ""}
                            </p>
                            <Link
                                href="/#contacto"
                                className="inline-flex items-center gap-2 rounded-xl bg-cima-gold text-cima-bg px-7 py-4 font-heading font-bold text-sm hover:bg-cima-gold-light transition-all hover:shadow-lg hover:shadow-cima-gold/20 hover:-translate-y-0.5"
                            >
                                <MapPin className="h-4 w-4" />
                                Quiero vender mi propiedad
                            </Link>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
}
