"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Building2, ArrowLeft, Search, CheckCircle2, Clock,
    FileText, TrendingUp, DollarSign, Home, Phone,
    MapPin, AlertCircle, Loader2, ChevronRight, Trophy
} from "lucide-react";
import Link from "next/link";

// Pipeline stages ordered
const STAGES: Record<string, { label: string; color: string; icon: React.ElementType; step: number }> = {
    prospecto:      { label: "Contacto Inicial",        color: "text-blue-400",   icon: Phone,       step: 1 },
    valuacion:      { label: "Valuación Agendada",      color: "text-yellow-400", icon: Home,        step: 2 },
    exclusiva:      { label: "Exclusiva Firmada",       color: "text-orange-400", icon: FileText,    step: 3 },
    vendido:        { label: "¡Propiedad Vendida! 🎉",  color: "text-green-400",  icon: DollarSign,  step: 4 },
    no_califica:    { label: "No Calificó",             color: "text-cima-text-dim", icon: AlertCircle, step: 0 },
};

function formatDate(iso: string) {
    return new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));
}

interface Lead {
    id: string;
    name: string;
    neighborhood: string | null;
    pipeline_stage: string;
    created_at: string;
    message: string | null;
}

function LeadCard({ lead }: { lead: Lead }) {
    const stage = STAGES[lead.pipeline_stage] ?? STAGES.prospecto;
    const StageIcon = stage.icon;
    const isClosed = lead.pipeline_stage === "vendido";
    const isDiscard = lead.pipeline_stage === "no_califica";

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl border p-5 transition-all ${
                isClosed
                    ? "bg-green-500/5 border-green-500/25"
                    : isDiscard
                    ? "bg-cima-surface/40 border-cima-border/40 opacity-60"
                    : "bg-cima-card border-cima-border"
            }`}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-bold text-cima-text truncate">{lead.name}</p>
                        {isClosed && <span className="text-[10px] bg-green-500/15 text-green-400 font-mono font-bold px-2 py-0.5 rounded-full">COMISIÓN ENVIADA</span>}
                    </div>
                    {lead.neighborhood && (
                        <p className="text-xs text-cima-text-muted flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {lead.neighborhood}
                        </p>
                    )}
                    <p className="text-[10px] text-cima-text-dim font-mono mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Referido el {formatDate(lead.created_at)}
                    </p>
                </div>
                <div className={`flex flex-col items-end gap-1.5 shrink-0`}>
                    <div className={`flex items-center gap-1.5 ${stage.color}`}>
                        <StageIcon className="h-4 w-4" />
                        <span className="text-[11px] font-bold">{stage.label}</span>
                    </div>
                </div>
            </div>

            {/* Progress bar */}
            {!isDiscard && (
                <div className="mt-4">
                    <div className="flex gap-1">
                        {[1, 2, 3, 4].map((s) => (
                            <div
                                key={s}
                                className={`h-1 flex-1 rounded-full transition-all ${
                                    s <= stage.step
                                        ? isClosed ? "bg-green-400" : "bg-cima-gold"
                                        : "bg-cima-border"
                                }`}
                            />
                        ))}
                    </div>
                    <div className="flex justify-between mt-1 text-[8px] font-mono text-cima-text-dim">
                        <span>Contacto</span>
                        <span>Valuación</span>
                        <span>Exclusiva</span>
                        <span>Vendido</span>
                    </div>
                </div>
            )}
        </motion.div>
    );
}

function StatsBar({ leads }: { leads: Lead[] }) {
    const total = leads.length;
    const vendidos = leads.filter(l => l.pipeline_stage === "vendido").length;
    const enProceso = leads.filter(l => !["vendido", "no_califica"].includes(l.pipeline_stage)).length;
    const comision = vendidos * 3750;

    return (
        <div className="grid grid-cols-3 gap-3 mb-8">
            {[
                { label: "Total Referidos", value: total, icon: Home, color: "text-cima-text" },
                { label: "En Proceso", value: enProceso, icon: TrendingUp, color: "text-yellow-400" },
                { label: "Comisiones Ganadas", value: `$${new Intl.NumberFormat("es-MX").format(comision)} MXN`, icon: DollarSign, color: "text-green-400" },
            ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                    <div key={i} className="bg-cima-card border border-cima-border rounded-2xl p-4 text-center">
                        <Icon className={`h-5 w-5 mx-auto mb-2 ${stat.color}`} />
                        <p className={`text-lg font-heading font-black ${stat.color}`}>{stat.value}</p>
                        <p className="text-[10px] text-cima-text-dim font-mono mt-0.5">{stat.label}</p>
                    </div>
                );
            })}
        </div>
    );
}

export default function MiPortalPage() {
    const [nombre, setNombre] = useState("");
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (nombre.trim().length < 2) {
            setError("Escribe al menos 2 letras de tu nombre.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`/api/seller-leads/by-referrer?nombre=${encodeURIComponent(nombre.trim())}`);
            const json = await res.json();
            if (!res.ok) throw new Error(json.error ?? "Error");
            setLeads(json.data ?? []);
            setSearched(true);
        } catch (err) {
            setError("No se pudo cargar. Intenta de nuevo.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const vendidos = leads.filter(l => l.pipeline_stage === "vendido").length;
    const tierLabel =
        vendidos >= 5 ? "🥇 Embajador Oro (VIP)" :
        vendidos >= 3 ? "🥈 Embajador Plata" :
        vendidos >= 1 ? "🥉 Embajador Bronce" :
        "⭐ Embajador Activo";

    return (
        <div className="min-h-screen bg-cima-bg text-cima-text selection:bg-cima-gold/30 overflow-x-hidden relative">
            <div className="fixed inset-0 dot-grid pointer-events-none z-0 opacity-50" />
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-cima-gold/6 blur-[150px] rounded-full pointer-events-none z-0" />

            <div className="relative z-10">
                {/* NAV */}
                <nav className="fixed top-0 left-0 right-0 z-50 border-b border-cima-border/50 backdrop-blur-xl bg-cima-bg/85">
                    <div className="mx-auto max-w-4xl h-16 px-6 flex items-center justify-between">
                        <Link href="/gana" className="flex items-center gap-2 text-cima-text-muted hover:text-cima-gold transition-colors text-xs font-mono font-bold">
                            <ArrowLeft className="h-4 w-4" />
                            Programa Embajadores
                        </Link>
                        <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-lg bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center">
                                <Building2 className="text-cima-gold h-3.5 w-3.5" />
                            </div>
                            <span className="font-heading font-bold text-sm text-cima-text">Mi Portal</span>
                        </div>
                    </div>
                </nav>

                <div className="pt-28 pb-24 px-6 max-w-3xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cima-gold/10 border border-cima-gold/20 mb-5">
                            <Trophy className="h-4 w-4 text-cima-gold" />
                            <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-widest">Seguimiento de Referidos</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-heading font-black text-cima-text mb-3">
                            Mi Portal de Embajador
                        </h1>
                        <p className="text-sm text-cima-text-muted max-w-lg mx-auto">
                            Consulta en tiempo real el avance de todas las propiedades que has referido a CIMA Propiedades.
                        </p>
                    </div>

                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="bg-cima-card border border-cima-border rounded-3xl p-6 md:p-8 mb-8 shadow-2xl gold-glow">
                        <p className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-widest mb-3">Búsqueda por nombre</p>
                        <h2 className="text-lg font-heading font-black text-cima-text mb-5">¿Cuál es tu nombre?</h2>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                placeholder="Ej. Juan Pérez"
                                value={nombre}
                                onChange={e => setNombre(e.target.value)}
                                className="flex-1 bg-cima-surface border border-cima-border rounded-xl px-4 py-3 text-sm text-cima-text placeholder-cima-text-dim focus:border-cima-gold/40 outline-none transition-all"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-5 py-3 bg-cima-gold text-cima-bg rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-cima-gold-light transition-all disabled:opacity-50 flex items-center gap-2"
                            >
                                {loading
                                    ? <Loader2 className="h-4 w-4 animate-spin" />
                                    : <Search className="h-4 w-4" />
                                }
                                {loading ? "Buscando..." : "Buscar"}
                            </button>
                        </div>
                        {error && (
                            <p className="mt-3 text-xs text-red-400 font-mono flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" /> {error}
                            </p>
                        )}
                    </form>

                    {/* Results */}
                    <AnimatePresence mode="wait">
                        {searched && (
                            <motion.div
                                key="results"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                {leads.length === 0 ? (
                                    <div className="text-center py-16 text-cima-text-muted">
                                        <Home className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                        <p className="text-sm font-bold">No encontramos referidos con ese nombre.</p>
                                        <p className="text-xs mt-2 opacity-60">¿Ya registraste tu primer referido en <Link href="/gana" className="text-cima-gold hover:underline">cimapropiedades.com/gana</Link>?</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Tier badge */}
                                        <div className="flex items-center justify-between mb-5">
                                            <div>
                                                <p className="text-xs font-mono font-bold text-cima-gold uppercase tracking-widest">{tierLabel}</p>
                                                <p className="text-2xl font-heading font-black text-cima-text">Hola, {nombre.trim().split(" ")[0]} 👋</p>
                                            </div>
                                            <Link href="/gana#form-referidos" className="flex items-center gap-1.5 text-xs font-bold font-mono text-cima-gold hover:underline">
                                                + Referir más <ChevronRight className="h-3.5 w-3.5" />
                                            </Link>
                                        </div>

                                        {/* Stats */}
                                        <StatsBar leads={leads} />

                                        {/* Lead cards */}
                                        <div className="space-y-4">
                                            {leads.map(lead => (
                                                <LeadCard key={lead.id} lead={lead} />
                                            ))}
                                        </div>

                                        {/* Referral CTA */}
                                        <div className="mt-10 bg-cima-gold/10 border border-cima-gold/25 rounded-2xl p-6 text-center">
                                            <p className="text-sm font-heading font-bold text-cima-text mb-2">¿Conoces a alguien más que quiera vender?</p>
                                            <p className="text-xs text-cima-text-muted mb-4">Gana de $2,500 a $5,000 MXN por cada propiedad que nos refieras y se venda.</p>
                                            <Link href="/gana#form-referidos" className="inline-flex items-center gap-2 px-6 py-3 bg-cima-gold text-cima-bg font-bold text-xs uppercase tracking-widest rounded-xl hover:scale-105 transition-all">
                                                Referir Ahora →
                                            </Link>
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
