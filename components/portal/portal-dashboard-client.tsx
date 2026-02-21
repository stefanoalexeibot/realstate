"use client";

import React from "react";
import Link from "next/link";
import {
    Building2, Camera, Calendar, Phone, MapPin, Home,
    Eye, Clock, CheckCircle2, Circle, ChevronRight, MessageSquare, Percent, BarChart3,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import ViewsChart from "@/components/portal/views-chart";
import AnimatedStat from "@/components/portal/animated-stat";
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

// ─── Timeline ────────────────────────────────────────────────────────────────

type SaleStage = "captacion" | "publicacion" | "visitas" | "cierre";

const TIMELINE_STEPS = [
    { id: "captacion", label: "Captación", description: "Propiedad registrada en Cima" },
    { id: "publicacion", label: "Publicación", description: "Listada en el sitio web" },
    { id: "visitas", label: "Visitas", description: "Compradores interesados" },
    { id: "cierre", label: "Cierre", description: "Operación completada" },
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
                <h2 className="font-heading font-bold text-base text-cima-text">Etapa de tu venta</h2>
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
            <div className="mt-5 pt-4 border-t border-cima-border">
                {currentStage === "captacion" && <p className="text-xs text-cima-text-muted">Tu propiedad está registrada. Tu agente la publicará en cuanto esté lista.</p>}
                {currentStage === "publicacion" && <p className="text-xs text-cima-text-muted">Tu propiedad ya está publicada. Los compradores la están viendo.</p>}
                {currentStage === "visitas" && <p className="text-xs text-cima-text-muted">Ya hay compradores interesados. Tu agente está coordinando las visitas.</p>}
                {currentStage === "cierre" && <p className="text-xs text-emerald-400 font-medium">{status === "sold" ? "¡Felicidades! Tu propiedad fue vendida." : "¡Felicidades! Tu propiedad fue rentada."}</p>}
            </div>
        </div>
    );
}

export default function PortalDashboardClient({ data }: { data: PortalDashboardData }) {
    const { property, visits, dailyViews, stats, market, propName } = data;
    const propStatus = property ? (PROP_STATUS_LABELS[property.status] ?? PROP_STATUS_LABELS.inactive) : null;

    return (
        <div className="space-y-6">
            <div>
                <p className="font-mono text-[10px] tracking-[0.2em] text-cima-gold uppercase mb-1">Mi portal</p>
                <h1 className="font-heading font-bold text-2xl text-cima-text">Hola, {propName.split(" ")[0]}</h1>
                <p className="text-sm text-cima-text-muted mt-1">Aquí puedes ver el estado de tu propiedad en tiempo real.</p>
            </div>

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
                    <div className="rounded-2xl border border-cima-border bg-cima-card p-6 hover:border-cima-gold/20 transition-all duration-300">
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="min-w-0">
                                <h2 className="font-heading font-bold text-lg text-cima-text leading-tight">{property.title}</h2>
                                {property.neighborhood && (
                                    <p className="flex items-center gap-1 text-xs text-cima-text-muted mt-1">
                                        <MapPin className="h-3 w-3" /> {property.neighborhood}, {property.city}
                                    </p>
                                )}
                            </div>
                            {propStatus && (
                                <span className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-mono ${propStatus.color}`}>
                                    <span className={`h-1.5 w-1.5 rounded-full ${propStatus.dot} ${property.status === "active" ? "animate-pulse" : ""}`} />
                                    {propStatus.label}
                                </span>
                            )}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                            <div className="rounded-xl bg-cima-surface border border-cima-border p-3 text-center">
                                <p className="font-heading font-bold text-lg text-cima-gold">{formatPrice(property.price)}</p>
                                <p className="text-[10px] text-cima-text-dim font-mono uppercase">Precio</p>
                            </div>
                            <div className="rounded-xl bg-cima-surface border border-cima-border p-3 text-center">
                                <p className="font-heading font-bold text-lg text-cima-text">{property.bedrooms}</p>
                                <p className="text-[10px] text-cima-text-dim font-mono uppercase">Recámaras</p>
                            </div>
                            <div className="rounded-xl bg-cima-surface border border-cima-border p-3 text-center">
                                <p className="font-heading font-bold text-lg text-cima-text">{property.area_m2 ?? "—"}</p>
                                <p className="text-[10px] text-cima-text-dim font-mono uppercase">m²</p>
                            </div>
                            <div className="rounded-xl bg-cima-surface border border-cima-border p-3 text-center">
                                <p className="font-heading font-bold text-lg text-cima-text capitalize">{property.operation_type}</p>
                                <p className="text-[10px] text-cima-text-dim font-mono uppercase">Tipo</p>
                            </div>
                        </div>
                        {property.status === "active" && (
                            <Link href={`/propiedades/${property.slug}`} target="_blank" className="inline-flex items-center gap-1.5 text-xs text-cima-gold hover:text-cima-gold-light transition-colors">
                                <Home className="h-3 w-3" /> Ver publicación en el sitio
                            </Link>
                        )}
                    </div>

                    <SaleTimeline status={property.status} visitCount={stats.totalVisits} />

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <AnimatedStat icon={Eye} label="Vistas" value={stats.views} color="text-cima-gold" sub="en el sitio web" index={0} />
                        <AnimatedStat icon={Calendar} label="Visitas" value={stats.totalVisits} color="text-cima-text" sub={`${stats.pendingVisits} pendientes`} index={1} />
                        <AnimatedStat icon={Clock} label="Días" value={stats.daysListed} color="text-blue-400" sub="en proceso" index={2} />
                        <AnimatedStat icon={Camera} label="Fotos" value={stats.photoCount} color="text-cima-text-muted" sub="subidas" index={3} />
                    </div>

                    <ViewsChart data={dailyViews} />

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
                        <div className="rounded-2xl border border-cima-border bg-cima-card overflow-hidden">
                            <div className="px-5 py-4 border-b border-cima-border flex items-center justify-between">
                                <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">Solicitudes de visita</p>
                                {stats.pendingVisits > 0 && (
                                    <span className="px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-[10px] font-mono text-amber-400">
                                        {stats.pendingVisits} pendientes
                                    </span>
                                )}
                            </div>
                            <div className="divide-y divide-cima-border">
                                {visits.map((v) => {
                                    const vs = VISIT_STATUS_LABELS[v.status] ?? VISIT_STATUS_LABELS.pending;
                                    return (
                                        <div key={v.id} className="px-5 py-3.5">
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-cima-text">{v.name}</p>
                                                    {v.preferred_date && <p className="text-xs text-cima-text-muted mt-0.5">Fecha: {v.preferred_date}</p>}
                                                    <p className="text-[10px] text-cima-text-dim mt-0.5">{formatDate(v.created_at)}</p>
                                                </div>
                                                <span className={`text-xs font-mono shrink-0 ${vs.color}`}>{vs.label}</span>
                                            </div>
                                            {v.agent_notes && (
                                                <div className="mt-2 flex items-start gap-2 rounded-lg bg-cima-surface border border-cima-border px-3 py-2">
                                                    <MessageSquare className="h-3 w-3 text-cima-gold mt-0.5 shrink-0" />
                                                    <p className="text-xs text-cima-text-muted">{v.agent_notes}</p>
                                                </div>
                                            )}
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
                            <div className="rounded-2xl border border-cima-border bg-cima-card p-5">
                                <div className="flex items-center gap-2 mb-4">
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
    );
}
