"use client";

import Link from "next/link";
import {
    Building2, Calendar, Users, Eye, Plus,
    AlertCircle, Phone, Home, MapPin,
    CheckCircle2, Clock,
} from "lucide-react";
import MiniBarChart from "@/components/admin/charts/mini-bar-chart";
import AgentTutorial from "@/components/admin/agent-tutorial";

import { type AdminDashboardData } from "@/types/admin";

const PIPELINE_STAGES = [
    { key: "prospecto", label: "Prospecto", dot: "bg-amber-400", seg: "bg-amber-500/70" },
    { key: "contactado", label: "Contactado", dot: "bg-blue-400", seg: "bg-blue-500/70" },
    { key: "valuacion", label: "Valuación", dot: "bg-purple-400", seg: "bg-purple-500/70" },
    { key: "publicado", label: "Publicado", dot: "bg-emerald-400", seg: "bg-emerald-500/70" },
    { key: "negociacion", label: "Negociación", dot: "bg-orange-400", seg: "bg-orange-500/70" },
    { key: "vendido", label: "Vendido", dot: "bg-green-400", seg: "bg-green-500/70" },
    { key: "perdido", label: "Perdido", dot: "bg-red-400", seg: "bg-red-500/70" },
];

const VISIT_STATUS: Record<string, { label: string; color: string }> = {
    pending: { label: "Pendiente", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    confirmed: { label: "Confirmada", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    done: { label: "Realizada", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    cancelled: { label: "Cancelada", color: "bg-cima-surface text-cima-text-dim border-cima-border" },
};

const typeLabels: Record<string, string> = {
    casa: "Casas", departamento: "Deptos", terreno: "Terrenos", local: "Locales", oficina: "Oficinas",
};

function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `Hace ${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `Hace ${hrs}h`;
    return `Hace ${Math.floor(hrs / 24)}d`;
}

function greeting() {
    const h = new Date().getHours();
    if (h < 12) return "Buenos días";
    if (h < 19) return "Buenas tardes";
    return "Buenas noches";
}

export default function AdminDashboardClient({ data }: { data: AdminDashboardData }) {
    const {
        activeProps, soldProps, totalProps, totalViews,
        leadsThisWeek, pendingVisits, pipelineCounts, pipelineTotal,
        uncontacted, typeCounts, leadsChart, visitsChart, todayStr,
        recentVisits, recentLeads,
    } = data;

    return (
        <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-6">

            {/* ── Header ── */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="font-mono text-[10px] tracking-[0.2em] text-cima-gold uppercase mb-1 capitalize">
                        {todayStr}
                    </p>
                    <h1 className="font-heading font-bold text-xl sm:text-2xl text-cima-text">{greeting()}, Cima Propiedades</h1>
                    <p className="text-sm text-cima-text-muted mt-1">
                        {activeProps} propiedades activas · {pipelineTotal} propietarios en pipeline · {leadsThisWeek} leads esta semana
                    </p>
                    <div className="mt-3">
                        <AgentTutorial />
                    </div>
                </div>
                <Link
                    href="/admin/propiedades/nueva"
                    className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-lg bg-cima-gold text-cima-bg text-sm font-semibold hover:bg-cima-gold-light transition-colors shrink-0"
                >
                    <Plus className="h-4 w-4" />
                    Nueva propiedad
                </Link>
            </div>

            {/* ── Alerts ── */}
            {(pendingVisits > 0 || uncontacted > 0) && (
                <div className="flex flex-wrap gap-3">
                    {pendingVisits > 0 && (
                        <Link
                            href="/admin/visitas"
                            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 transition-colors"
                        >
                            <Clock className="h-4 w-4 text-amber-400 shrink-0" />
                            <span className="text-sm text-amber-300">
                                <span className="font-bold">{pendingVisits}</span>{" "}
                                {pendingVisits === 1 ? "visita pendiente de confirmar" : "visitas pendientes de confirmar"}
                            </span>
                        </Link>
                    )}
                    {uncontacted > 0 && (
                        <Link
                            href="/admin/leads"
                            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 transition-colors"
                        >
                            <AlertCircle className="h-4 w-4 text-blue-400 shrink-0" />
                            <span className="text-sm text-blue-300">
                                <span className="font-bold">{uncontacted}</span>{" "}
                                {uncontacted === 1 ? "propietario sin contactar" : "propietarios sin contactar"}
                            </span>
                        </Link>
                    )}
                </div>
            )}

            {/* ── KPI Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    <div className="rounded-xl border border-cima-gold/20 bg-cima-gold/5 p-4 sm:p-5 h-full">
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                            <p className="text-[10px] sm:text-xs text-cima-text-muted">Propiedades activas</p>
                            <Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-cima-gold shrink-0" />
                        </div>
                        <p className="font-heading font-bold text-2xl sm:text-3xl leading-none text-cima-gold">
                            {activeProps.toLocaleString("es-MX")}
                        </p>
                        <p className="text-[10px] text-cima-text-dim mt-1.5 leading-tight">{totalProps} total · {soldProps} vendidas</p>
                    </div>
                </div>

                <Link href="/admin/visitas" className="block h-full">
                    <div className={`rounded-xl border ${pendingVisits > 0 ? "border-amber-500/20 bg-amber-500/5" : "border-cima-border bg-cima-card"} p-4 sm:p-5 h-full hover:opacity-80 cursor-pointer transition-colors`}>
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                            <p className="text-[10px] sm:text-xs text-cima-text-muted">Visitas pendientes</p>
                            <Calendar className={`h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 ${pendingVisits > 0 ? "text-amber-400" : "text-cima-text-muted"}`} />
                        </div>
                        <p className={`font-heading font-bold text-2xl sm:text-3xl leading-none ${pendingVisits > 0 ? "text-amber-400" : "text-cima-text-muted"}`}>
                            {pendingVisits.toLocaleString("es-MX")}
                        </p>
                        <p className="text-[10px] text-cima-text-dim mt-1.5 leading-tight">esperan confirmación</p>
                    </div>
                </Link>

                <Link href="/admin/leads" className="block h-full">
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 sm:p-5 h-full hover:opacity-80 cursor-pointer transition-colors">
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                            <p className="text-[10px] sm:text-xs text-cima-text-muted">Leads esta semana</p>
                            <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-400 shrink-0" />
                        </div>
                        <p className="font-heading font-bold text-2xl sm:text-3xl leading-none text-emerald-400">
                            {leadsThisWeek.toLocaleString("es-MX")}
                        </p>
                        <p className="text-[10px] text-cima-text-dim mt-1.5 leading-tight">{pipelineTotal} en pipeline</p>
                    </div>
                </Link>

                <div>
                    <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4 sm:p-5 h-full">
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                            <p className="text-[10px] sm:text-xs text-cima-text-muted">Vistas totales</p>
                            <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-400 shrink-0" />
                        </div>
                        <p className="font-heading font-bold text-2xl sm:text-3xl leading-none text-purple-400">
                            {totalViews.toLocaleString("es-MX")}
                        </p>
                        <p className="text-[10px] text-cima-text-dim mt-1.5 leading-tight">en todas las propiedades</p>
                    </div>
                </div>
            </div>

            {/* ── Quick actions ── */}
            <div className="flex gap-2 flex-wrap">
                {[
                    { label: "+ Nueva propiedad", href: "/admin/propiedades/nueva", primary: true },
                    { label: "Pipeline", href: "/admin/pipeline" },
                    { label: "Visitas", href: "/admin/visitas" },
                    { label: "Leads", href: "/admin/leads" },
                    { label: "Propiedades", href: "/admin/propiedades" },
                    { label: "Flipping ROI", href: "/flipping", primary: true },
                ].map((a) => (
                    <Link
                        key={a.href}
                        href={a.href}
                        className={`flex items-center px-3.5 py-2 rounded-lg border text-xs font-medium transition-colors ${a.primary
                            ? "bg-cima-gold/10 border-cima-gold/30 text-cima-gold hover:bg-cima-gold/20"
                            : "border-cima-border text-cima-text-muted hover:bg-cima-surface hover:text-cima-text"
                            }`}
                    >
                        {a.label}
                    </Link>
                ))}
            </div>

            {/* ── Charts ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-xl border border-cima-border bg-cima-card p-5">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">Leads por mes</p>
                            <p className="text-xs text-cima-text-muted mt-0.5">Propietarios que contactaron</p>
                        </div>
                        <Users className="h-4 w-4 text-cima-gold" />
                    </div>
                    <MiniBarChart data={leadsChart} color="bg-cima-gold/50 hover:bg-cima-gold/70" />
                </div>

                <div className="rounded-xl border border-cima-border bg-cima-card p-5">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">Visitas por mes</p>
                            <p className="text-xs text-cima-text-muted mt-0.5">Solicitudes de compradores</p>
                        </div>
                        <Calendar className="h-4 w-4 text-blue-400" />
                    </div>
                    <MiniBarChart data={visitsChart} color="bg-blue-500/40 hover:bg-blue-500/60" />
                </div>
            </div>

            {/* ── Pipeline + Propiedades por tipo ── */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">

                {/* Pipeline snapshot */}
                <div className="rounded-xl border border-cima-border bg-cima-card p-5">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">Pipeline de propietarios</p>
                            <p className="text-xs text-cima-text-muted mt-0.5">{pipelineTotal} propietarios en proceso</p>
                        </div>
                        <Link href="/admin/pipeline" className="text-xs text-cima-text-dim hover:text-cima-gold transition-colors">
                            Ver kanban →
                        </Link>
                    </div>

                    {pipelineTotal > 0 ? (
                        <>
                            {/* Segmented bar */}
                            <div className="flex h-3 rounded-full overflow-hidden gap-px mb-5 bg-cima-surface">
                                {PIPELINE_STAGES.map((stage) => {
                                    const pct = (pipelineCounts[stage.key] / pipelineTotal) * 100;
                                    return pct > 0 ? (
                                        <div
                                            key={stage.key}
                                            style={{ width: `${pct}%` }}
                                            className={`${stage.seg} h-full first:rounded-l-full last:rounded-r-full transition-all`}
                                            title={`${stage.label}: ${pipelineCounts[stage.key]}`}
                                        />
                                    ) : null;
                                })}
                            </div>

                            {/* Stage legend with bars */}
                            <div className="space-y-2">
                                {PIPELINE_STAGES.map((stage) => {
                                    const count = pipelineCounts[stage.key];
                                    const pct = pipelineTotal > 0 ? (count / pipelineTotal) * 100 : 0;
                                    return (
                                        <div key={stage.key} className="flex items-center gap-3">
                                            <div className="flex items-center gap-1.5 w-24 shrink-0">
                                                <div className={`h-2 w-2 rounded-full ${stage.dot} shrink-0`} />
                                                <span className="text-xs text-cima-text-muted truncate">{stage.label}</span>
                                            </div>
                                            <div className="flex-1 h-1.5 rounded-full bg-cima-surface overflow-hidden">
                                                <div
                                                    className={`h-full ${stage.seg} rounded-full transition-all duration-500`}
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                            <span className={`font-mono text-xs w-4 text-right shrink-0 ${count > 0 ? "text-cima-text" : "text-cima-text-dim"}`}>
                                                {count}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        <p className="text-sm text-cima-text-dim py-4">Sin propietarios en pipeline aún.</p>
                    )}
                </div>

                {/* Properties by type */}
                <div className="rounded-xl border border-cima-border bg-cima-card p-5">
                    <div className="mb-5">
                        <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">Catálogo activo</p>
                        <p className="text-xs text-cima-text-muted mt-0.5">Propiedades por tipo</p>
                    </div>
                    <div className="space-y-3">
                        {Object.entries(typeCounts).length === 0 ? (
                            <p className="text-sm text-cima-text-dim">Sin propiedades activas.</p>
                        ) : (
                            Object.entries(typeCounts)
                                .sort((a, b) => b[1] - a[1])
                                .map(([type, count]) => (
                                    <div key={type} className="flex items-center gap-3">
                                        <Home className="h-3.5 w-3.5 text-cima-gold/60 shrink-0" />
                                        <span className="text-xs text-cima-text-muted flex-1 capitalize">
                                            {typeLabels[type] ?? type}
                                        </span>
                                        <div className="flex-1 h-1.5 rounded-full bg-cima-surface overflow-hidden">
                                            <div
                                                className="h-full bg-cima-gold/50 rounded-full transition-all duration-500"
                                                style={{ width: `${activeProps > 0 ? (count / activeProps) * 100 : 0}%` }}
                                            />
                                        </div>
                                        <span className="font-mono text-xs text-cima-text font-bold w-4 text-right shrink-0">{count}</span>
                                    </div>
                                ))
                        )}
                    </div>

                    <div className="mt-5 pt-4 border-t border-cima-border grid grid-cols-2 gap-3">
                        <div className="text-center">
                            <p className="font-heading font-bold text-2xl text-cima-gold">{activeProps}</p>
                            <p className="font-mono text-[9px] text-cima-text-dim uppercase tracking-wider mt-0.5">Activas</p>
                        </div>
                        <div className="text-center">
                            <p className="font-heading font-bold text-2xl text-cima-text">{soldProps}</p>
                            <p className="font-mono text-[9px] text-cima-text-dim uppercase tracking-wider mt-0.5">Vendidas</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Recent activity ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-4">

                {/* Recent visits */}
                <div className="rounded-xl border border-cima-border bg-cima-card overflow-hidden">
                    <div className="px-5 py-4 border-b border-cima-border flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-cima-gold" />
                            <h2 className="font-heading font-semibold text-sm text-cima-text">Visitas recientes</h2>
                        </div>
                        <Link href="/admin/visitas" className="text-xs text-cima-text-dim hover:text-cima-gold transition-colors">
                            Ver todas →
                        </Link>
                    </div>
                    <div className="divide-y divide-cima-border">
                        {recentVisits.length === 0 ? (
                            <div className="px-5 py-10 text-center">
                                <CheckCircle2 className="h-6 w-6 text-cima-text-dim mx-auto mb-2" />
                                <p className="text-sm text-cima-text-muted">Sin visitas aún</p>
                            </div>
                        ) : (
                            recentVisits.map((v) => {
                                const st = VISIT_STATUS[v.status] ?? VISIT_STATUS.pending;
                                return (
                                    <div key={v.id} className="px-5 py-3 flex items-start justify-between gap-3 hover:bg-cima-surface/20 transition-colors">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                                <p className="font-medium text-sm text-cima-text">{v.name}</p>
                                                <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-mono border ${st.color}`}>
                                                    {st.label}
                                                </span>
                                            </div>
                                            {v.re_properties?.title && (
                                                <div className="flex items-center gap-1 mb-0.5">
                                                    <MapPin className="h-2.5 w-2.5 text-cima-text-dim shrink-0" />
                                                    <p className="text-xs text-cima-text-muted truncate">{v.re_properties.title}</p>
                                                </div>
                                            )}
                                            <p className="text-[10px] text-cima-text-dim">{timeAgo(v.created_at)}</p>
                                        </div>
                                        <a
                                            href={`https://wa.me/52${v.phone.replace(/\D/g, "")}?text=Hola ${encodeURIComponent(v.name)}, te contactamos de Cima para confirmar tu visita`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] text-[10px] font-medium hover:bg-[#25D366]/20 transition-colors"
                                        >
                                            <Phone className="h-3 w-3" />
                                            WA
                                        </a>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Recent leads */}
                <div className="rounded-xl border border-cima-border bg-cima-card overflow-hidden">
                    <div className="px-5 py-4 border-b border-cima-border flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-cima-gold" />
                            <h2 className="font-heading font-semibold text-sm text-cima-text">Propietarios recientes</h2>
                        </div>
                        <Link href="/admin/leads" className="text-xs text-cima-text-dim hover:text-cima-gold transition-colors">
                            Ver todos →
                        </Link>
                    </div>
                    <div className="divide-y divide-cima-border">
                        {recentLeads.length === 0 ? (
                            <div className="px-5 py-10 text-center">
                                <Users className="h-6 w-6 text-cima-text-dim mx-auto mb-2" />
                                <p className="text-sm text-cima-text-muted">Sin leads aún</p>
                            </div>
                        ) : (
                            recentLeads.map((l) => {
                                const stage = PIPELINE_STAGES.find((s) => s.key === l.pipeline_stage);
                                return (
                                    <div key={l.id} className="px-5 py-3 flex items-center justify-between gap-3 hover:bg-cima-surface/20 transition-colors">
                                        <div className="min-w-0 flex items-center gap-2.5">
                                            <div className="h-8 w-8 shrink-0 rounded-full bg-cima-gold/10 border border-cima-gold/20 flex items-center justify-center">
                                                <span className="text-xs font-bold text-cima-gold">{l.name.charAt(0).toUpperCase()}</span>
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <p className="font-medium text-sm text-cima-text truncate">{l.name}</p>
                                                    {stage && <div className={`h-1.5 w-1.5 rounded-full ${stage.dot} shrink-0`} title={stage.label} />}
                                                </div>
                                                <p className="text-xs text-cima-text-muted truncate">
                                                    {l.neighborhood ?? "—"} · {l.operation_type === "venta" ? "Venta" : "Renta"}
                                                </p>
                                                <p className="text-[10px] text-cima-text-dim">{timeAgo(l.created_at)}</p>
                                            </div>
                                        </div>
                                        <a
                                            href={`https://wa.me/52${l.phone.replace(/\D/g, "")}?text=Hola%20${encodeURIComponent(l.name)}%2C%20somos%20Cima%20Propiedades.%20Vimos%20que%20te%20interesa%20vender%20tu%20propiedad%20en%20Monterrey.%20Podemos%20venderte%20en%20menos%20de%2030%20d%C3%ADas%2C%20sin%20costo%20inicial.%20%C2%BFTienes%205%20minutos%20para%20una%20llamada%20hoy%3F`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] text-[10px] font-medium hover:bg-[#25D366]/20 transition-colors"
                                        >
                                            <Phone className="h-3 w-3" />
                                            WA
                                        </a>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}
