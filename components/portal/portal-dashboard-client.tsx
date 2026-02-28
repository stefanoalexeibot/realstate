"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    Building2, Camera, Calendar, Phone, MapPin, Home,
    Eye, Clock, CheckCircle2, Circle, ChevronRight, MessageSquare, Percent, BarChart3, ZoomIn, X, Star, Share2, ShieldCheck, TrendingUp, ArrowRight
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import ViewsChart from "@/components/portal/views-chart";
import AnimatedStat from "@/components/portal/animated-stat";
import PriceSimulator from "@/components/portal/price-simulator";
import OnboardingModal from "@/components/portal/onboarding-modal";
import { type PortalDashboardData, type VisitStatus } from "@/types/portal";

const VISIT_STATUS_LABELS: Record<string, { label: string; color: string }> = {
    pending: { label: "Pendiente", color: "text-amber-400" },
    confirmed: { label: "Confirmada", color: "text-blue-400" },
    done: { label: "Realizada", color: "text-emerald-400" },
    cancelled: { label: "Cancelada", color: "text-red-400" },
};

const PROP_STATUS_LABELS: Record<string, { label: string; color: string; dot: string }> = {
    active: { label: "Activa — en publicación", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", dot: "bg-emerald-400" },
    sold: { label: "Vendida", color: "bg-red-500/10 text-red-400 border-red-500/20", dot: "bg-red-400" },
    rented: { label: "Rentada", color: "bg-purple-500/10 text-purple-400 border-purple-500/20", dot: "bg-purple-400" },
    inactive: { label: "Sin publicar", color: "bg-cima-surface text-cima-text-dim border-cima-border", dot: "bg-cima-text-dim" },
};

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("es-MX", {
        timeZone: "America/Monterrey",
        day: "2-digit", month: "long", year: "numeric",
    });
}

function getCommissionInfo(price: number): { pct: number; label: string } {
    if (price <= 1_000_000) return { pct: 6, label: "hasta $1M" };
    if (price <= 3_000_000) return { pct: 5, label: "$1M – $3M" };
    if (price <= 6_000_000) return { pct: 4.5, label: "$3M – $6M" };
    if (price <= 10_000_000) return { pct: 4, label: "$6M – $10M" };
    return { pct: 3.5, label: "más de $10M" };
}

function MarketSentiment({ visits }: { visits: PortalDashboardData["visits"] }) {
    const allTags = visits.flatMap(v => v.feedback_tags ?? []);
    if (allTags.length === 0) return null;

    const counts: Record<string, number> = {};
    allTags.forEach(t => { counts[t] = (counts[t] || 0) + 1; });

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 4);

    return (
        <div className="rounded-2xl border border-cima-gold/20 bg-cima-gold/5 p-5 mb-6">
            <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-4 w-4 text-cima-gold" />
                <h3 className="font-heading font-bold text-sm text-cima-text">Sentimiento del Mercado</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
                {sorted.map(([tag, count]) => (
                    <div key={tag} className="flex items-center justify-between p-2.5 rounded-xl bg-cima-card border border-cima-border">
                        <span className="text-[11px] text-cima-text-muted">{tag}</span>
                        <span className="text-[10px] font-mono text-cima-gold bg-cima-gold/10 px-1.5 py-0.5 rounded">{count}</span>
                    </div>
                ))}
            </div>
            <p className="text-[10px] text-cima-text-dim mt-4 italic">
                Este resumen se basa en los comentarios directos recopilados por tu asesor durante las visitas.
            </p>
        </div>
    );
}

// ─── Timeline ────────────────────────────────────────────────────────────────

type SaleStage = "captacion" | "publicacion" | "visitas" | "cierre";

const TIMELINE_STEPS = [
    { id: "captacion", label: "Captación", description: "Registrada · docs y llaves" },
    { id: "publicacion", label: "Publicación", description: "Fotos IA · portales activos" },
    { id: "visitas", label: "Visitas", description: "Compradores calificados" },
    { id: "cierre", label: "Prospecto", description: "Firmada · notaría en proceso" },
];

function getSaleStage(status: string, visitCount: number): SaleStage {
    if (status === "sold" || status === "rented") return "cierre";
    if (visitCount > 0) return "visitas";
    if (status === "active") return "publicacion";
    return "captacion";
}

function SaleTimeline({ status, visitCount }: { status: string; visitCount: number }) {
    const currentStage = getSaleStage(status, visitCount);
    const currentIdx = TIMELINE_STEPS.findIndex((s) => s.id === currentStage);

    return (
        <div className="rounded-2xl border border-cima-border bg-cima-card p-5 sm:p-6 hover:border-cima-gold/20 transition-colors duration-300">
            <div className="mb-5">
                <p className="font-mono text-[10px] tracking-[0.2em] text-cima-gold uppercase mb-0.5">Proceso</p>
                <h2 className="font-heading font-bold text-sm sm:text-base text-cima-text">Etapa de tu venta</h2>
            </div>
            <div className="relative">
                <div className="absolute top-4 left-4 right-4 h-px bg-cima-border hidden sm:block" />
                <div
                    className="absolute top-4 left-4 h-px bg-cima-gold hidden sm:block transition-all duration-700"
                    style={{ width: `${(currentIdx / (TIMELINE_STEPS.length - 1)) * 100}%` }}
                />
                <div className="flex flex-col sm:flex-row sm:justify-between gap-4 sm:gap-0">
                    {TIMELINE_STEPS.map((step, idx) => {
                        const done = idx < currentIdx;
                        const active = idx === currentIdx;
                        return (
                            <div key={step.id} className="flex sm:flex-col items-center sm:items-center gap-3 sm:gap-2 sm:flex-1 sm:text-center relative">
                                {idx < TIMELINE_STEPS.length - 1 && (
                                    <div className="absolute left-4 top-8 bottom-0 w-px bg-cima-border sm:hidden" />
                                )}
                                <div className={`relative z-10 shrink-0 h-8 w-8 rounded-full border-2 flex items-center justify-center transition-colors ${done ? "border-cima-gold bg-cima-gold" :
                                    active ? "border-cima-gold bg-cima-gold/15" : "border-cima-border bg-cima-bg"}`}>
                                    {done ? <CheckCircle2 className="h-4 w-4 text-cima-bg" /> :
                                        active ? <div className="h-2.5 w-2.5 rounded-full bg-cima-gold animate-pulse" /> :
                                            <Circle className="h-3.5 w-3.5 text-cima-border" />}
                                </div>
                                <div className="min-w-0 sm:mt-1">
                                    <p className={`text-xs font-semibold leading-tight ${done || active ? "text-cima-text" : "text-cima-text-dim"}`}>{step.label}</p>
                                    <p className={`text-[10px] leading-tight mt-0.5 hidden sm:block ${active ? "text-cima-gold" : "text-cima-text-dim"}`}>
                                        {active ? "← Etapa actual" : step.description}
                                    </p>
                                    {active && <p className="text-[10px] text-cima-gold mt-0.5 sm:hidden">← Etapa actual</p>}
                                </div>
                                {idx < TIMELINE_STEPS.length - 1 && <ChevronRight className="h-3 w-3 text-cima-border absolute right-0 top-2 sm:hidden" />}
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="mt-5 pt-4 border-t border-cima-border space-y-3">
                {currentStage === "captacion" && (
                    <div>
                        <p className="text-xs text-cima-text-muted mb-3">Tu propiedad está registrada. Para iniciar la publicación necesitamos que tengas listo:</p>
                        <div className="space-y-1.5">
                            {[
                                "Llaves disponibles para programar visitas",
                                "Sin adeudos (predial, agua, luz, hipoteca)",
                                "Escrituras disponibles y en orden",
                                "Documentación completa para notaría",
                            ].map((item) => (
                                <div key={item} className="flex items-center gap-2">
                                    <div className="h-4 w-4 rounded-full border border-cima-gold/30 bg-cima-gold/5 flex items-center justify-center shrink-0">
                                        <div className="h-1.5 w-1.5 rounded-full bg-cima-gold/50" />
                                    </div>
                                    <p className="text-xs text-cima-text-muted">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {currentStage === "publicacion" && <p className="text-xs text-cima-text-muted">Tu propiedad ya está publicada con fotografía profesional y mejoras IA. Los compradores la están viendo.</p>}
                {currentStage === "visitas" && <p className="text-xs text-cima-text-muted">Ya hay compradores interesados. Tu agente está coordinando las visitas con compradores calificados.</p>}
                {currentStage === "cierre" && <p className="text-xs text-emerald-400 font-medium">{status === "sold" ? "¡Felicidades! Prospecto encontrado — proceso notarial en curso." : "¡Felicidades! Tu propiedad fue rentada."}</p>}
            </div>
        </div>
    );
}

export default function PortalDashboardClient({ data }: { data: PortalDashboardData }) {
    const { property, visits, dailyViews, stats, market, propName } = data;
    const propStatus = property ? (PROP_STATUS_LABELS[property.status] ?? PROP_STATUS_LABELS.inactive) : null;
    const [lightbox, setLightbox] = useState<string | null>(null);

    return (
        <>
            {!data.onboarding_completed && <OnboardingModal />}
            <div className="space-y-5 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    <div>
                        <p className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em] text-cima-gold uppercase mb-1">Mi portal</p>
                        <h1 className="font-heading font-bold text-xl sm:text-2xl text-cima-text">Hola, {propName.split(" ")[0]}</h1>
                    </div>
                    <Link
                        href="/portal/documentos"
                        className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-cima-gold/10 border border-cima-gold/20 text-cima-gold text-[11px] sm:text-xs font-semibold hover:bg-cima-gold/20 transition-all active:scale-[0.98]"
                    >
                        <ShieldCheck className="h-3.5 sm:h-4 w-3.5 sm:w-4" /> Ir a mi Expediente Digital
                    </Link>
                </div>
                <p className="text-xs sm:text-sm text-cima-text-muted">Aquí puedes ver el estado de tu propiedad en tiempo real.</p>


                {!property ? (
                    <div className="rounded-2xl border border-cima-border bg-cima-card p-12 text-center">
                        <Building2 className="h-10 w-10 text-cima-text-dim mx-auto mb-4" />
                        <p className="font-medium text-cima-text mb-1">Aún no tienes una propiedad vinculada</p>
                        <p className="text-sm text-cima-text-muted">Tu agente de Cima la vinculará pronto.</p>
                        <a href="https://wa.me/528110000000" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-lg bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] text-sm hover:bg-[#25D366]/20 transition-colors">
                            <Phone className="h-4 w-4" /> Contactar a mi agente
                        </a>
                    </div>
                ) : (
                    <>
                        <div className="rounded-2xl border border-cima-border bg-cima-card p-4 sm:p-6 hover:border-cima-gold/20 transition-all duration-300">
                            <div className="flex flex-col sm:flex-row items-start justify-between gap-3 mb-4">
                                <div className="min-w-0">
                                    <h2 className="font-heading font-bold text-base sm:text-lg text-cima-text leading-tight">{property.title}</h2>
                                    {property.neighborhood && (
                                        <p className="flex items-center gap-1 text-[11px] sm:text-xs text-cima-text-muted mt-1">
                                            <MapPin className="h-3 w-3" /> {property.neighborhood}, {property.city}
                                        </p>
                                    )}
                                </div>
                                {propStatus && (
                                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border text-[10px] sm:text-xs font-mono ${propStatus.color}`}>
                                        <span className={`h-1.5 w-1.5 rounded-full ${propStatus.dot} ${property.status === "active" ? "animate-pulse" : ""}`} />
                                        {propStatus.label}
                                    </span>
                                )}
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
                                <div className="rounded-xl bg-cima-surface border border-cima-border p-2 sm:p-3 text-center">
                                    <p className="font-heading font-bold text-base sm:text-lg text-cima-gold">{formatPrice(property.price)}</p>
                                    <p className="text-[9px] sm:text-[10px] text-cima-text-dim font-mono uppercase">Precio</p>
                                </div>
                                <div className="rounded-xl bg-cima-surface border border-cima-border p-2 sm:p-3 text-center">
                                    <p className="font-heading font-bold text-base sm:text-lg text-cima-text">{property.bedrooms}</p>
                                    <p className="text-[9px] sm:text-[10px] text-cima-text-dim font-mono uppercase">Recámaras</p>
                                </div>
                                <div className="rounded-xl bg-cima-surface border border-cima-border p-2 sm:p-3 text-center">
                                    <p className="font-heading font-bold text-base sm:text-lg text-cima-text">{property.area_m2 ?? "—"}</p>
                                    <p className="text-[9px] sm:text-[10px] text-cima-text-dim font-mono uppercase">m²</p>
                                </div>
                                <div className="rounded-xl bg-cima-surface border border-cima-border p-2 sm:p-3 text-center">
                                    <p className="font-heading font-bold text-base sm:text-lg text-cima-text capitalize">{property.operation_type}</p>
                                    <p className="text-[9px] sm:text-[10px] text-cima-text-dim font-mono uppercase">Tipo</p>
                                </div>
                            </div>
                            {property.status === "active" && (
                                <Link href={`/propiedades/${property.slug}`} target="_blank" className="inline-flex items-center gap-1.5 text-xs text-cima-gold hover:text-cima-gold-light transition-colors">
                                    <Home className="h-3 w-3" /> Ver publicación en el sitio
                                </Link>
                            )}
                        </div>

                        {/* Investment Opportunity CTA */}
                        <Link
                            href="/oportunidades"
                            className="block rounded-2xl border border-northpeak-green/20 bg-northpeak-green/5 p-4 sm:p-5 hover:bg-northpeak-green/10 transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
                                <TrendingUp className="h-12 w-12 text-northpeak-green" />
                            </div>
                            <div className="relative z-10 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-northpeak-green/10 border border-northpeak-green/20 flex items-center justify-center">
                                        <TrendingUp className="h-5 sm:h-6 w-5 sm:w-6 text-northpeak-green" />
                                    </div>
                                    <div>
                                        <h3 className="font-heading font-bold text-sm sm:text-base text-cima-text">Descubre Oportunidades de Inversión</h3>
                                        <p className="text-[10px] sm:text-xs text-cima-text-muted mt-0.5">Ve propiedades seleccionadas para Flipping con ROI proyectado +20%.</p>
                                    </div>
                                </div>
                                <ArrowRight className="h-5 w-5 text-northpeak-green group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>

                        <SaleTimeline status={property.status} visitCount={stats.totalVisits} />

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                            <AnimatedStat icon={Eye} label="Vistas" value={stats.views} color="text-cima-gold" sub="en el sitio web" index={0} />
                            <AnimatedStat icon={Calendar} label="Visitas" value={stats.totalVisits} color="text-cima-text" sub={`${stats.pendingVisits} pend.`} index={1} />
                            <AnimatedStat icon={Clock} label="Días" value={stats.daysListed} color="text-blue-400" sub="en proceso" index={2} />
                            <AnimatedStat icon={Camera} label="Fotos" value={stats.photoCount} color="text-cima-text-muted" sub="subidas" index={3} />
                        </div>

                        <ViewsChart data={dailyViews} />

                        {property.area_m2 && market?.avgMarketPricePerM2 && (
                            <PriceSimulator
                                initialPrice={Number(property.price)}
                                areaM2={Number(property.area_m2)}
                                avgMarketPricePerM2={market.avgMarketPricePerM2}
                                neighborhood={property.neighborhood ?? undefined}
                            />
                        )}

                        {property.status === "active" && (
                            <div className="rounded-2xl border border-cima-border bg-cima-card p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Share2 className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-cima-gold" />
                                    <p className="font-mono text-[9px] sm:text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">Promueve tu propiedad</p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <a
                                        href={`https://wa.me/?text=${encodeURIComponent(`¡Mira esta propiedad en Cima! 🏠 ${property.title} - ${formatPrice(property.price)}. Ver más en: https://propiedades-mty.vercel.app/propiedades/${property.slug}`)}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] text-[13px] font-semibold hover:bg-[#25D366]/20 transition-all active:scale-[0.98]"
                                    >
                                        <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.431 5.63 1.432h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                        WhatsApp
                                    </a>
                                    <a
                                        href={`https://www.facebook.com/sharer/sharer.php?u=https://propiedades-mty.vercel.app/propiedades/${property.slug}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-[#1877F2]/10 border border-[#1877F2]/20 text-[#1877F2] text-[13px] font-semibold hover:bg-[#1877F2]/20 transition-all active:scale-[0.98]"
                                    >
                                        <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                        Facebook
                                    </a>
                                </div>
                                <p className="text-[10px] text-cima-text-dim text-center mt-4 italic">Al compartir tu propiedad ayudas a que más personas la vean y se venda más rápido.</p>
                            </div>
                        )}

                        {stats.views > 0 && (
                            <div className="rounded-xl border border-cima-gold/15 bg-cima-gold/5 px-4 py-3 flex items-center gap-3">
                                <Eye className="h-4 w-4 text-cima-gold shrink-0" />
                                <p className="text-xs text-cima-text-muted">
                                    <span className="text-cima-gold font-semibold">{stats.views} personas</span> han visto tu propiedad.
                                </p>
                            </div>
                        )}

                        {stats.photoCount === 0 && (
                            <div className="rounded-2xl border border-dashed border-cima-gold/30 bg-cima-gold/5 p-6 flex items-center justify-between gap-4">
                                <div>
                                    <p className="font-medium text-cima-text mb-1">Sube fotos de tu propiedad</p>
                                    <p className="text-sm text-cima-text-muted">Aumentan el interés hasta 3×.</p>
                                </div>
                                <Link href="/portal/fotos" className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-cima-gold text-cima-bg text-sm font-semibold hover:bg-cima-gold-light transition-colors">
                                    <Camera className="h-4 w-4" /> Subir fotos
                                </Link>
                            </div>
                        )}

                        {visits.length > 0 && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em] text-cima-gold uppercase mb-1">Actividad</p>
                                        <h2 className="font-heading font-bold text-lg sm:text-xl text-cima-text">Seguimiento y Feedback</h2>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-cima-text-dim uppercase tracking-wider">Total visitas</p>
                                        <p className="text-xl font-heading font-bold text-cima-text">{visits.length}</p>
                                    </div>
                                </div>

                                <MarketSentiment visits={visits} />

                                <div className="space-y-4">
                                    {visits.map((v) => {
                                        const vs = VISIT_STATUS_LABELS[v.status] ?? VISIT_STATUS_LABELS.pending;
                                        return (
                                            <div key={v.id} className="rounded-2xl border border-cima-border bg-cima-card overflow-hidden group hover:border-cima-gold/30 transition-all duration-300">
                                                <div className="p-5">
                                                    <div className="flex items-start justify-between gap-4 mb-3">
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <p className="text-sm font-bold text-cima-text">{v.name}</p>
                                                                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border border-current opacity-70 ${vs.color}`}>{vs.label}</span>
                                                            </div>
                                                            <p className="text-[11px] text-cima-text-dim">{formatDate(v.created_at)}</p>
                                                        </div>
                                                        {v.interest_level && (
                                                            <div className="flex gap-0.5 text-cima-gold bg-cima-gold/5 px-2 py-1 rounded-lg border border-cima-gold/10">
                                                                {[1, 2, 3, 4, 5].map((s) => (
                                                                    <Star key={s} className={`h-2.5 w-2.5 ${v.interest_level && v.interest_level >= s ? "fill-current" : "text-cima-text-dim opacity-20"}`} />
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        <div className="space-y-3">
                                                            {v.agent_notes && (
                                                                <div className="relative p-3 rounded-xl bg-cima-surface/50 border border-cima-border">
                                                                    <MessageSquare className="h-3 w-3 text-cima-gold absolute -top-1.5 -left-1.5" />
                                                                    <p className="text-xs text-cima-text-muted italic leading-relaxed">"{v.agent_notes}"</p>
                                                                </div>
                                                            )}

                                                            {v.feedback_tags && v.feedback_tags.length > 0 && (
                                                                <div className="flex flex-wrap gap-1.5">
                                                                    {v.feedback_tags.map((t) => (
                                                                        <span key={t} className="px-2 py-0.5 rounded-full bg-cima-bg border border-cima-border text-[9px] text-cima-text-dim">
                                                                            {t}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>

                                                        {v.photos && v.photos.length > 0 && (
                                                            <div>
                                                                <p className="font-mono text-[9px] tracking-widest text-cima-text-dim uppercase mb-2 flex items-center gap-1.5">
                                                                    <Camera className="h-3 w-3" /> Evidencias
                                                                </p>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {v.photos.map((photo) => (
                                                                        <button
                                                                            key={photo.id}
                                                                            onClick={() => setLightbox(photo.url)}
                                                                            className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-xl overflow-hidden border border-cima-border group/img"
                                                                        >
                                                                            <img src={photo.url} alt="Evidencia" className="h-full w-full object-cover transition-transform duration-500 group-hover/img:scale-110" />
                                                                            <div className="absolute inset-0 bg-cima-bg/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                                                                <ZoomIn className="h-4 w-4 text-white" />
                                                                            </div>
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {property.price && property.operation_type === "venta" && (() => {
                            const comm = getCommissionInfo(Number(property.price));
                            const gross = Number(property.price) * (comm.pct / 100);
                            const net = gross * 1.16;
                            return (
                                <div className="rounded-2xl border border-cima-border bg-cima-card p-5 space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Percent className="h-4 w-4 text-cima-gold" />
                                        <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">Comisión estimada</p>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="rounded-xl bg-cima-surface border border-cima-border p-3 text-center">
                                            <p className="font-heading font-bold text-lg text-cima-gold">{comm.pct}%</p>
                                            <p className="text-[10px] text-cima-text-dim font-mono uppercase">Tasa</p>
                                        </div>
                                        <div className="rounded-xl bg-cima-surface border border-cima-border p-3 text-center">
                                            <p className="font-heading font-bold text-base text-cima-text">{formatPrice(gross)}</p>
                                            <p className="text-[10px] text-cima-text-dim font-mono uppercase">Sin IVA</p>
                                        </div>
                                        <div className="rounded-xl bg-cima-surface border border-cima-border p-3 text-center">
                                            <p className="font-heading font-bold text-base text-cima-text">{formatPrice(net)}</p>
                                            <p className="text-[10px] text-cima-text-dim font-mono uppercase">Con IVA</p>
                                        </div>
                                    </div>
                                    <div className="pt-3 border-t border-cima-border">
                                        <p className="font-mono text-[10px] tracking-widest text-cima-gold uppercase mb-2">Incluido sin costo extra</p>
                                        <div className="space-y-1.5">
                                            {[
                                                "Fotografía y video profesional",
                                                "Decoración, limpieza y remodelación con IA",
                                                "Publicidad digital en todos los portales",
                                                "Asesoría legal completa hasta notaría",
                                                "Garantía 30 días o comisión cero",
                                            ].map((item) => (
                                                <div key={item} className="flex items-center gap-2">
                                                    <CheckCircle2 className="h-3 w-3 text-cima-gold shrink-0" />
                                                    <p className="text-xs text-cima-text-muted">{item}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                        {market.myPricePerM2 !== null && market.avgMarketPricePerM2 !== null && (() => {
                            const diff = market.diff ?? 0;
                            const absDiff = Math.abs(diff);
                            const isAbove = diff > 0;
                            let posLabel = absDiff <= 10 ? "En línea con el mercado" : isAbove ? "Por encima del mercado" : "Por debajo del mercado";
                            let posColor = absDiff <= 10 ? "text-emerald-400" : isAbove ? "text-red-400" : "text-blue-400";
                            let posBg = absDiff <= 10 ? "bg-emerald-500/10 border-emerald-500/20" : isAbove ? "bg-red-500/10 border-red-500/20" : "bg-blue-500/10 border-blue-500/20";

                            return (
                                <div className="rounded-2xl border border-cima-border bg-cima-card p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <BarChart3 className="h-4 w-4 text-cima-gold" />
                                            <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">Precio mercado</p>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-full border text-[10px] font-mono ${posBg} ${posColor}`}>{posLabel}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 mb-5">
                                        <div className="rounded-xl bg-cima-gold/5 border border-cima-gold/20 p-3 text-center">
                                            <p className="font-heading font-bold text-xl text-cima-gold">{formatPrice(Math.round(market.myPricePerM2))}</p>
                                            <p className="text-[10px] text-cima-text-dim font-mono uppercase mt-0.5">Tu precio / m²</p>
                                        </div>
                                        <div className="rounded-xl bg-cima-surface border border-cima-border p-3 text-center">
                                            <p className="font-heading font-bold text-xl text-cima-text">{formatPrice(Math.round(market.avgMarketPricePerM2))}</p>
                                            <p className="text-[10px] text-cima-text-dim font-mono uppercase mt-0.5">Promedio {market.compScope}</p>
                                        </div>
                                    </div>
                                    <div className={`rounded-lg border px-3 py-2.5 ${posBg}`}>
                                        <p className={`text-xs leading-relaxed ${posColor}`}>
                                            {absDiff <= 10 ? `Tu precio está en rango (${isAbove ? "+" : ""}${diff.toFixed(1)}%).` :
                                                isAbove ? `Tu precio está un ${diff.toFixed(1)}% sobre el promedio en ${market.compScope}.` :
                                                    `Tu precio está un ${absDiff.toFixed(1)}% bajo el promedio en ${market.compScope}.`}
                                        </p>
                                    </div>
                                </div>
                            );
                        })()}
                    </>
                )}
            </div>

            {/* Lightbox */}
            {lightbox && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setLightbox(null)}
                >
                    <button
                        onClick={() => setLightbox(null)}
                        className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                        <X className="h-5 w-5 text-white" />
                    </button>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={lightbox ?? undefined}
                        alt="Evidencia de visita"
                        className="max-w-full max-h-[90vh] rounded-xl object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </>
    );
}


