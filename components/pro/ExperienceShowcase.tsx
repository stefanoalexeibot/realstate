"use client";

import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import {
    Database, UserCheck, Zap, Search, Bell,
    TrendingUp, MessageSquare, Globe, Sparkles,
    Heart, Share2, Calendar, CheckCircle2,
    ArrowUpRight, Phone, Mail, Star, MapPin,
    BarChart2, Users, Eye, Clock
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

// ── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ to, duration = 1.5 }: { to: number; duration?: number }) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        const step = Math.ceil(to / (duration * 60));
        const timer = setInterval(() => {
            start = Math.min(start + step, to);
            setCount(start);
            if (start >= to) clearInterval(timer);
        }, 1000 / 60);
        return () => clearInterval(timer);
    }, [to, duration]);
    return <span>{count.toLocaleString()}</span>;
}

// ── ADVISOR DASHBOARD ────────────────────────────────────────────────────────
function AdvisorDashboardPreview() {
    const [activeTab, setActiveTab] = useState(0);
    const leads = [
        { name: "Roberto Kuri", score: 95, intent: "Penthouse Valle", tag: "HOT", color: "text-red-400", bg: "bg-red-500/10 border-red-500/30" },
        { name: "Ana Treviño", score: 82, intent: "Depto. San Pedro", tag: "WARM", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30" },
        { name: "Carlos Morales", score: 71, intent: "Casa Lomas", tag: "NEW", color: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/30" },
    ];

    return (
        <div className="w-full h-full bg-[#07080A] rounded-2xl border border-white/10 overflow-hidden flex flex-col">
            {/* Top bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-[#C8A96E]/20 flex items-center justify-center">
                        <Database className="w-3 h-3 text-[#C8A96E]" />
                    </div>
                    <span className="text-[11px] font-bold text-white/80 tracking-wide">Cima CRM</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                        {["Leads", "Propiedades"].map((t, i) => (
                            <button key={i} onClick={() => setActiveTab(i)}
                                className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md transition-all ${activeTab === i ? "bg-[#C8A96E]/20 text-[#C8A96E]" : "text-white/30 hover:text-white/60"}`}>
                                {t}
                            </button>
                        ))}
                    </div>
                    <Bell className="w-3.5 h-3.5 text-white/20" />
                </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-0 border-b border-white/5">
                {[
                    { label: "Leads Activos", val: 47, icon: Users },
                    { label: "Vistas Hoy", val: 1248, icon: Eye },
                    { label: "Cierres/Mes", val: 8, icon: CheckCircle2 },
                    { label: "Conv. Rate", val: "17%", icon: TrendingUp, raw: true },
                ].map((s, i) => (
                    <div key={i} className={`px-4 py-3 flex flex-col gap-1 ${i < 3 ? "border-r border-white/5" : ""}`}>
                        <span className="text-[8px] uppercase font-bold tracking-[0.15em] text-white/30">{s.label}</span>
                        <span className="text-lg font-black text-white leading-none">
                            {s.raw ? s.val : <AnimatedCounter to={s.val as number} duration={1.2} />}
                        </span>
                        <s.icon className="w-3 h-3 text-[#C8A96E]/40" />
                    </div>
                ))}
            </div>

            {/* Leads list */}
            <div className="flex-1 overflow-hidden p-4 space-y-2">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Leads IA · Prioridad</span>
                    <div className="flex items-center gap-1 bg-white/5 rounded-md px-2 py-1">
                        <Search className="w-2.5 h-2.5 text-white/30" />
                        <span className="text-[8px] text-white/20">Filtrar...</span>
                    </div>
                </div>
                {leads.map((lead, i) => (
                    <motion.div
                        key={lead.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.15 + 0.3 }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors group cursor-pointer"
                    >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-[10px] font-black text-white/60">
                            {lead.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="text-[11px] font-bold text-white/90 truncate">{lead.name}</span>
                                <span className={`text-[7px] font-black px-1.5 py-0.5 rounded border ${lead.bg} ${lead.color}`}>{lead.tag}</span>
                            </div>
                            <span className="text-[9px] text-white/30 truncate block">{lead.intent}</span>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <span className={`text-base font-black ${lead.color}`}>{lead.score}%</span>
                            <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${lead.score}%` }}
                                    transition={{ delay: i * 0.15 + 0.6, duration: 0.8 }}
                                    className="h-full bg-gradient-to-r from-[#C8A96E] to-amber-400 rounded-full"
                                />
                            </div>
                        </div>
                    </motion.div>
                ))}
                {/* IA Insight */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="mt-2 p-3 rounded-xl bg-[#C8A96E]/10 border border-[#C8A96E]/30 flex items-start gap-2"
                >
                    <Sparkles className="w-3.5 h-3.5 text-[#C8A96E] shrink-0 mt-0.5 animate-pulse" />
                    <div>
                        <span className="text-[8px] font-black uppercase tracking-widest text-[#C8A96E] block mb-1">Cima IA · Acción Sugerida</span>
                        <span className="text-[9px] text-white/70 leading-snug">Roberto K. revisó el PDF de precios 4 veces. <strong className="text-white">Llama ahora.</strong></span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

// ── OWNER PORTAL ─────────────────────────────────────────────────────────────
function OwnerPortalPreview() {
    const events = [
        { date: "Hoy 14:30", text: "Visita confirmada — Familia Rodríguez", done: false },
        { date: "Ayer", text: "PDF compartido con 3 interesados", done: true },
        { date: "24 Feb", text: "Tour virtual publicado en portales", done: true },
        { date: "22 Feb", text: "Ficha técnica generada por IA", done: true },
    ];

    return (
        <div className="w-full h-full bg-[#07080A] rounded-2xl border border-white/10 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                <div>
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#C8A96E]">Mi Propiedad</span>
                    <h3 className="text-sm font-black text-white mt-0.5">Residencia Magnolia · Torre A</h3>
                </div>
                <span className="text-[8px] font-black px-2 py-1 rounded-full bg-green-500/15 border border-green-500/30 text-green-400 uppercase tracking-widest">En Venta</span>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-3 border-b border-white/5">
                {[
                    { label: "Vistas en Portal", val: 1248, icon: Eye },
                    { label: "Leads Calificados", val: 12, icon: UserCheck },
                    { label: "Visitas Hechas", val: 5, icon: Calendar },
                ].map((kpi, i) => (
                    <div key={i} className={`px-4 py-4 ${i < 2 ? "border-r border-white/5" : ""}`}>
                        <kpi.icon className="w-3 h-3 text-[#C8A96E]/50 mb-2" />
                        <div className="text-xl font-black text-white"><AnimatedCounter to={kpi.val} /></div>
                        <div className="text-[8px] uppercase font-bold text-white/30 tracking-widest mt-0.5">{kpi.label}</div>
                    </div>
                ))}
            </div>

            {/* Timeline */}
            <div className="flex-1 p-5">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 block mb-4">Actividad Reciente</span>
                <div className="space-y-3">
                    {events.map((ev, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.12 + 0.2 }}
                            className="flex items-start gap-3 group"
                        >
                            <div className="relative mt-0.5">
                                <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${ev.done ? "bg-green-500/20 border-green-500/40" : "bg-[#C8A96E]/20 border-[#C8A96E]/60"}`}>
                                    {ev.done
                                        ? <CheckCircle2 className="w-2.5 h-2.5 text-green-400" />
                                        : <div className="w-1.5 h-1.5 rounded-full bg-[#C8A96E] animate-pulse" />}
                                </div>
                            </div>
                            <div className="flex-1 min-w-0 pb-3 border-b border-white/5 last:border-0">
                                <span className="text-[10px] font-medium text-white/80 block leading-snug">{ev.text}</span>
                                <span className="text-[8px] text-white/25 font-mono">{ev.date}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ── PROPERTY LANDING PREVIEW ─────────────────────────────────────────────────
function PropertyLandingPreview() {
    const [imgIdx, setImgIdx] = useState(0);
    const colors = ["from-slate-800 to-slate-900", "from-stone-800 to-stone-900", "from-zinc-800 to-zinc-900"];
    useEffect(() => {
        const t = setInterval(() => setImgIdx(p => (p + 1) % 3), 2500);
        return () => clearInterval(t);
    }, []);

    return (
        <div className="w-full h-full bg-[#07080A] rounded-2xl border border-white/10 overflow-hidden flex flex-col">
            {/* Fake browser bar */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5 bg-white/[0.03]">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400/50" />
                </div>
                <div className="flex-1 mx-3 bg-white/5 border border-white/5 rounded-md px-3 py-1 text-[9px] text-white/30 font-mono">
                    propiedades-mty.vercel.app/propiedades/penthouse-del-valle
                </div>
                <Share2 className="w-3 h-3 text-white/20" />
            </div>

            {/* Property body */}
            <div className="flex-1 overflow-hidden flex gap-0">
                {/* Main image area */}
                <div className="flex-1 relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={imgIdx}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6 }}
                            className={`absolute inset-0 bg-gradient-to-br ${colors[imgIdx]}`}
                        />
                    </AnimatePresence>
                    {/* Overlay info */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-end justify-between">
                            <div>
                                <span className="text-[8px] font-black text-[#C8A96E] uppercase tracking-widest block mb-1">Penthouse · Del Valle</span>
                                <span className="text-xl font-black text-white leading-none">$12,500,000</span>
                                <span className="text-[9px] text-white/50 block">MXN · disponible</span>
                            </div>
                            <motion.button
                                animate={{ y: [0, -4, 0] }}
                                transition={{ repeat: Infinity, duration: 2.5 }}
                                className="flex items-center gap-1.5 bg-[#C8A96E] text-[#07080A] px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest"
                            >
                                <MessageSquare className="w-3 h-3" />
                                Agendar
                            </motion.button>
                        </div>
                        {/* Thumbnail dots */}
                        <div className="flex gap-1 mt-2">
                            {[0, 1, 2].map(i => (
                                <div key={i} className={`h-0.5 rounded-full transition-all duration-500 ${i === imgIdx ? "w-6 bg-[#C8A96E]" : "w-2 bg-white/20"}`} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Side panel */}
                <div className="w-40 border-l border-white/5 p-3 flex flex-col gap-3">
                    <div className="text-[8px] font-black uppercase tracking-widest text-white/30 mb-1">Detalles</div>
                    {[
                        { label: "Recámaras", val: "4" },
                        { label: "Baños", val: "4.5" },
                        { label: "M²", val: "380" },
                        { label: "Nivel", val: "PH 32" },
                    ].map((d, i) => (
                        <div key={i} className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-[9px] text-white/35">{d.label}</span>
                            <span className="text-[10px] font-bold text-white">{d.val}</span>
                        </div>
                    ))}
                    {/* Contact buttons */}
                    <div className="mt-auto space-y-2">
                        <button className="w-full flex items-center justify-center gap-1.5 bg-[#C8A96E] text-[#07080A] py-2 rounded-md text-[8px] font-black">
                            <Phone className="w-2.5 h-2.5" /> Llamar
                        </button>
                        <button className="w-full flex items-center justify-center gap-1.5 border border-white/10 text-white/60 py-2 rounded-md text-[8px] font-bold">
                            <Mail className="w-2.5 h-2.5" /> Email
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── MAIN COMPONENT ───────────────────────────────────────────────────────────
const experiences = [
    {
        id: "advisor",
        label: "Portal del Asesor",
        tag: "CRM + IA",
        desc: "Leads calificados por IA, gestión de inventario y sincronización automática con portales.",
        accent: "from-amber-500/20 to-transparent",
        component: AdvisorDashboardPreview,
    },
    {
        id: "owner",
        label: "Portal Propietario",
        tag: "Transparencia",
        desc: "El diferencial que gana exclusivas. Reportes en tiempo real sin llamadas.",
        accent: "from-green-500/10 to-transparent",
        component: OwnerPortalPreview,
    },
    {
        id: "landing",
        label: "Landing de Propiedad",
        tag: "Conversión",
        desc: "Cada propiedad, una marca. Páginas de ultra-lujo generadas automáticamente.",
        accent: "from-blue-500/10 to-transparent",
        component: PropertyLandingPreview,
    },
];

export default function ExperienceShowcase() {
    const [active, setActive] = useState(0);

    // Auto-advance tabs
    useEffect(() => {
        const t = setInterval(() => setActive(p => (p + 1) % experiences.length), 6000);
        return () => clearInterval(t);
    }, []);

    const exp = experiences[active];

    return (
        <div className="w-full">
            {/* Tab Selector */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 mb-10">
                {experiences.map((e, i) => (
                    <button
                        key={e.id}
                        onClick={() => { setActive(i); }}
                        className={`relative flex-1 sm:max-w-[220px] text-left px-5 py-4 rounded-2xl border transition-all duration-500 overflow-hidden group ${active === i
                            ? "border-[#C8A96E]/50 bg-[#C8A96E]/5"
                            : "border-white/5 bg-white/[0.02] hover:border-white/10"
                            }`}
                    >
                        {active === i && (
                            <motion.div layoutId="tab-highlight" className="absolute inset-0 bg-gradient-to-br from-[#C8A96E]/10 to-transparent" />
                        )}
                        <span className={`text-[8px] font-black uppercase tracking-[0.2em] mb-1 block transition-colors ${active === i ? "text-[#C8A96E]" : "text-white/25"}`}>
                            {e.tag}
                        </span>
                        <span className={`text-sm font-black block transition-colors ${active === i ? "text-white" : "text-white/40"}`}>
                            {e.label}
                        </span>
                        {/* Progress bar */}
                        {active === i && (
                            <motion.div
                                key={active}
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 6, ease: "linear" }}
                                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#C8A96E] to-amber-300"
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Preview Area */}
            <div className="relative rounded-3xl overflow-hidden border border-white/8 shadow-[0_60px_120px_rgba(0,0,0,0.6)]">
                {/* Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${exp.accent} pointer-events-none z-0`} />

                {/* Description overlay */}
                <div className="absolute top-4 left-4 z-20">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={active}
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2 bg-black/60 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1.5"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-[#C8A96E] animate-pulse" />
                            <span className="text-[9px] font-bold text-white/70">{exp.desc}</span>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Component — must use capitalized var so React renders properly (rules of hooks) */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={active}
                        initial={{ opacity: 0, y: 20, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="relative z-10 aspect-[16/9]"
                    >
                        {active === 0 && <AdvisorDashboardPreview />}
                        {active === 1 && <OwnerPortalPreview />}
                        {active === 2 && <PropertyLandingPreview />}
                    </motion.div>
                </AnimatePresence>

                {/* Bottom nav dots */}
                <div className="absolute bottom-4 right-4 z-20 flex gap-2">
                    {experiences.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setActive(i)}
                            className={`h-1.5 rounded-full transition-all duration-400 ${active === i ? "w-6 bg-[#C8A96E]" : "w-1.5 bg-white/20 hover:bg-white/40"}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
