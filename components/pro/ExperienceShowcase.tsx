"use client";

import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import {
    Database, UserCheck, Zap, Search, Bell,
    TrendingUp, MessageSquare, Globe, Sparkles,
    Heart, Share2, Calendar, CheckCircle2,
    Phone, Mail, Eye, Star, ArrowUpRight,
    BedDouble, Bath, Ruler, Building2, Users
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

// ── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ to, duration = 1.5 }: { to: number; duration?: number }) {
    const [count, setCount] = useState(0);
    const hasRun = useRef(false);
    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;
        let start = 0;
        const steps = Math.ceil(duration * 60);
        const increment = to / steps;
        const timer = setInterval(() => {
            start = Math.min(start + increment, to);
            setCount(Math.floor(start));
            if (start >= to) clearInterval(timer);
        }, 1000 / 60);
        return () => clearInterval(timer);
    }, [to, duration]);
    return <span>{count.toLocaleString()}</span>;
}

// ── Typing Animation ──────────────────────────────────────────────────────────
function TypingText({ texts, className }: { texts: string[]; className?: string }) {
    const [textIdx, setTextIdx] = useState(0);
    const [displayed, setDisplayed] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const full = texts[textIdx];
        let timer: ReturnType<typeof setTimeout>;
        if (!isDeleting && displayed.length < full.length) {
            timer = setTimeout(() => setDisplayed(full.slice(0, displayed.length + 1)), 60);
        } else if (!isDeleting && displayed.length === full.length) {
            timer = setTimeout(() => setIsDeleting(true), 2000);
        } else if (isDeleting && displayed.length > 0) {
            timer = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 30);
        } else if (isDeleting && displayed.length === 0) {
            setIsDeleting(false);
            setTextIdx((textIdx + 1) % texts.length);
        }
        return () => clearTimeout(timer);
    }, [displayed, isDeleting, textIdx, texts]);

    return (
        <span className={className}>
            {displayed}<span className="animate-pulse">|</span>
        </span>
    );
}

// ── Notification Toast ────────────────────────────────────────────────────────
function NotifToast({ msg, delay }: { msg: string; delay: number }) {
    const [show, setShow] = useState(false);
    useEffect(() => {
        const t1 = setTimeout(() => setShow(true), delay);
        const t2 = setTimeout(() => setShow(false), delay + 3500);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [delay]);
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, x: 40, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 40, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                    className="flex items-center gap-2 bg-[#C8A96E]/95 text-[#07080A] rounded-xl px-3 py-2 shadow-xl"
                >
                    <Sparkles className="w-3 h-3 shrink-0" />
                    <span className="text-[9px] font-black leading-tight">{msg}</span>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PORTAL DEL ASESOR
// ═══════════════════════════════════════════════════════════════════════════════
function AdvisorDashboardPreview() {
    const leads = [
        { name: "Roberto Kuri", score: 95, intent: "Penthouse Valle", tag: "HOT", color: "text-red-400", bg: "bg-red-500/10 border-red-500/30" },
        { name: "Ana Treviño", score: 82, intent: "Depto. San Pedro", tag: "WARM", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30" },
        { name: "Carlos Morales", score: 71, intent: "Casa Lomas", tag: "NEW", color: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/30" },
    ];

    return (
        <div className="w-full h-full relative overflow-hidden bg-[#07080A] rounded-[inherit]">
            {/* Real mockup as blurred background layer */}
            <div className="absolute inset-0 opacity-[0.08] pointer-events-none select-none">
                <Image src="/mockups/admin-mockup.png" alt="" fill className="object-cover" />
            </div>

            {/* UI Layer */}
            <div className="relative z-10 flex flex-col h-full">
                {/* Top bar */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-black/30 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-md bg-[#C8A96E]/20 flex items-center justify-center">
                            <Database className="w-3 h-3 text-[#C8A96E]" />
                        </div>
                        <span className="text-[11px] font-bold text-white/80">Cima CRM · Live</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 bg-white/5 rounded-lg px-3 py-1.5 w-48 border border-white/5">
                            <Search className="w-2.5 h-2.5 text-white/30 shrink-0" />
                            <TypingText
                                texts={["Roberto Kuri...", "Penthouse...", "San Pedro..."]}
                                className="text-[9px] text-white/50 font-medium"
                            />
                        </div>
                        <div className="relative">
                            <Bell className="w-3.5 h-3.5 text-white/30" />
                            <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[#C8A96E] rounded-full" />
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 border-b border-white/5">
                    {[
                        { label: "Leads Activos", val: 47, icon: Users },
                        { label: "Vistas Hoy", val: 1248, icon: Eye },
                        { label: "Cierres/Mes", val: 8, icon: CheckCircle2 },
                        { label: "Tasa Conv.", val: "17%", icon: TrendingUp, raw: true },
                    ].map((s, i) => (
                        <div key={i} className={`px-4 py-3 ${i < 3 ? "border-r border-white/5" : ""} bg-black/20`}>
                            <span className="text-[8px] uppercase font-bold tracking-[0.12em] text-white/25 block mb-1">{s.label}</span>
                            <span className="text-lg font-black text-white leading-none">
                                {s.raw ? s.val : <AnimatedCounter to={s.val as number} />}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Leads */}
                <div className="flex-1 p-4 space-y-2 overflow-hidden">
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/25 block mb-2">Leads · Prioridad IA</span>
                    {leads.map((lead, i) => (
                        <motion.div
                            key={lead.name}
                            initial={{ opacity: 0, x: -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.15 + 0.2 }}
                            className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/5 hover:border-white/15 hover:bg-white/[0.07] transition-all duration-200 cursor-pointer group"
                        >
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-xs font-black text-white/60 shrink-0">
                                {lead.name[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-[11px] font-bold text-white/90 truncate">{lead.name}</span>
                                    <span className={`text-[7px] font-black px-1.5 py-0.5 rounded border ${lead.bg} ${lead.color}`}>{lead.tag}</span>
                                </div>
                                <span className="text-[9px] text-white/30">{lead.intent}</span>
                            </div>
                            <div className="flex flex-col items-end gap-1.5 shrink-0">
                                <span className={`text-base font-black leading-none ${lead.color}`}>{lead.score}%</span>
                                <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${lead.score}%` }}
                                        transition={{ delay: i * 0.15 + 0.5, duration: 0.9, ease: "easeOut" }}
                                        className="h-full bg-gradient-to-r from-[#C8A96E] to-amber-300 rounded-full"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {/* IA Insight card */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0, duration: 0.6 }}
                        className="mt-1 p-3 rounded-xl bg-[#C8A96E]/10 border border-[#C8A96E]/30 flex items-start gap-2"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-[#C8A96E] shrink-0 mt-0.5 animate-pulse" />
                        <div>
                            <span className="text-[8px] font-black uppercase tracking-widest text-[#C8A96E] block mb-1">Cima IA · Acción Recomendada</span>
                            <span className="text-[9px] text-white/70 leading-snug">Roberto K. revisó el PDF de precios <strong className="text-white">4 veces hoy</strong>. Probabilidad de cierre: <strong className="text-green-400">87%</strong>. Llama ahora.</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Floating notifications */}
            <div className="absolute top-4 right-2 z-30 flex flex-col gap-2 items-end">
                <NotifToast msg="🔥 Nuevo lead calificado: Roberto K." delay={1800} />
                <NotifToast msg="📸 Tour virtual visto 6 veces" delay={5500} />
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PORTAL PROPIETARIO
// ═══════════════════════════════════════════════════════════════════════════════
function OwnerPortalPreview() {
    const events = [
        { date: "Hoy 14:30", text: "Visita confirmada — Familia Rodríguez", done: false },
        { date: "Ayer", text: "PDF compartido con 3 interesados", done: true },
        { date: "24 Feb", text: "Tour virtual publicado en portales", done: true },
        { date: "22 Feb", text: "Ficha generada automáticamente por IA", done: true },
    ];

    return (
        <div className="w-full h-full relative overflow-hidden bg-[#07080A] rounded-[inherit]">
            {/* Blurred real mockup background */}
            <div className="absolute inset-0 opacity-[0.08] pointer-events-none select-none">
                <Image src="/mockups/owner-portal.png" alt="" fill className="object-cover" />
            </div>

            <div className="relative z-10 flex flex-col h-full">
                {/* Header */}
                <div className="px-5 py-4 border-b border-white/5 bg-black/30 backdrop-blur-sm flex justify-between items-center shrink-0">
                    <div>
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#C8A96E] block mb-0.5">Portal Propietarios · Privado</span>
                        <h3 className="text-sm font-black text-white">Residencia Magnolia · Torre A</h3>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-[8px] font-black px-2 py-1 rounded-full bg-green-500/15 border border-green-500/30 text-green-400 uppercase tracking-widest">En Venta</span>
                        <span className="text-[7px] text-white/25 font-mono">Actualizado: hace 2min</span>
                    </div>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-3 border-b border-white/5 shrink-0">
                    {[
                        { label: "Vistas en Portal", val: 1248, icon: Eye, color: "text-blue-400" },
                        { label: "Leads Calificados", val: 12, icon: UserCheck, color: "text-green-400" },
                        { label: "Visitas Hechas", val: 5, icon: Calendar, color: "text-[#C8A96E]" },
                    ].map((kpi, i) => (
                        <div key={i} className={`px-4 py-4 bg-black/20 ${i < 2 ? "border-r border-white/5" : ""}`}>
                            <kpi.icon className={`w-3 h-3 mb-2 ${kpi.color}`} />
                            <div className={`text-2xl font-black leading-none ${kpi.color}`}><AnimatedCounter to={kpi.val} /></div>
                            <div className="text-[7px] uppercase font-bold text-white/25 tracking-widest mt-1">{kpi.label}</div>
                        </div>
                    ))}
                </div>

                {/* Timeline */}
                <div className="flex-1 p-5 overflow-hidden">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/25">Actividad en Tiempo Real</span>
                        <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-[8px] text-white/25 font-mono">Live</span>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {events.map((ev, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.12 + 0.3 }}
                                className="flex items-start gap-3 group"
                            >
                                <div className="relative mt-1 shrink-0">
                                    <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${ev.done ? "bg-green-500/20 border-green-500/40" : "bg-[#C8A96E]/20 border-[#C8A96E]/60"}`}>
                                        {ev.done
                                            ? <CheckCircle2 className="w-2.5 h-2.5 text-green-400" />
                                            : <div className="w-1.5 h-1.5 rounded-full bg-[#C8A96E] animate-pulse" />}
                                    </div>
                                    {i < events.length - 1 && <div className="absolute left-1/2 top-4 -translate-x-1/2 w-px h-5 bg-white/5" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="text-[10px] font-medium text-white/80 block leading-snug group-hover:text-white transition-colors">{ev.text}</span>
                                    <span className="text-[8px] text-white/25 font-mono">{ev.date}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Notification */}
            <div className="absolute top-4 right-2 z-30 flex flex-col gap-2 items-end">
                <NotifToast msg="📊 Nuevo reporte semanal disponible" delay={2200} />
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROPERTY LANDING
// ═══════════════════════════════════════════════════════════════════════════════
function PropertyLandingPreview() {
    const [imgIdx, setImgIdx] = useState(0);
    const [liked, setLiked] = useState(false);

    // cycle through the before/after images from public folder
    const propertyImages = [
        "/mockups/property-landing.png",
        "/estancia-despues.png",
        "/cocina-despues.png",
        "/recamara-despues.png",
    ];

    useEffect(() => {
        const t = setInterval(() => setImgIdx(p => (p + 1) % propertyImages.length), 3000);
        return () => clearInterval(t);
    }, []);

    return (
        <div className="w-full h-full bg-[#07080A] rounded-[inherit] overflow-hidden flex flex-col">
            {/* Browser bar */}
            <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 bg-black/50 shrink-0">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                </div>
                <div className="flex-1 mx-2 bg-white/5 border border-white/5 rounded px-3 py-1 text-[8px] text-white/30 font-mono truncate">
                    propiedades-mty.vercel.app/propiedades/<span className="text-[#C8A96E]/60">penthouse-del-valle</span>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setLiked(l => !l)}>
                        <Heart className={`w-3 h-3 transition-colors ${liked ? "text-red-400 fill-red-400" : "text-white/20"}`} />
                    </button>
                    <Share2 className="w-3 h-3 text-white/20" />
                </div>
            </div>

            {/* Main split layout */}
            <div className="flex-1 flex overflow-hidden">
                {/* Image gallery */}
                <div className="flex-1 relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={imgIdx}
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.7 }}
                            className="absolute inset-0"
                        >
                            <Image
                                src={propertyImages[imgIdx]}
                                alt="Property"
                                fill
                                className="object-cover"
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Bottom info */}
                    <div className="absolute bottom-4 left-4 right-4">
                        <span className="text-[8px] font-black text-[#C8A96E] uppercase tracking-widest block mb-1">Penthouse · Del Valle, MTY</span>
                        <div className="flex items-end justify-between">
                            <div>
                                <span className="text-2xl font-black text-white leading-none">$12,500,000</span>
                                <span className="text-[9px] text-white/50 block">MXN · disponible</span>
                            </div>
                            <motion.button
                                animate={{ y: [0, -3, 0] }}
                                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                                className="flex items-center gap-1.5 bg-[#C8A96E] text-[#07080A] px-3 py-2 rounded-lg text-[9px] font-black uppercase"
                            >
                                <MessageSquare className="w-3 h-3" />
                                Agendar Cita
                            </motion.button>
                        </div>

                        {/* Image dots */}
                        <div className="flex gap-1.5 mt-2">
                            {propertyImages.map((_, i) => (
                                <button key={i} onClick={() => setImgIdx(i)}
                                    className={`h-0.5 rounded-full transition-all duration-500 ${i === imgIdx ? "w-5 bg-[#C8A96E]" : "w-2 bg-white/25 hover:bg-white/50"}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Side panel */}
                <div className="w-44 border-l border-white/5 bg-black/60 backdrop-blur-sm p-3 flex flex-col shrink-0">
                    {/* Property specs */}
                    <div className="space-y-2 mb-4 pb-4 border-b border-white/5">
                        <span className="text-[7px] font-black uppercase tracking-widest text-white/25 block">Detalles</span>
                        {[
                            { icon: BedDouble, label: "Recámaras", val: "4" },
                            { icon: Bath, label: "Baños", val: "4.5" },
                            { icon: Ruler, label: "M²", val: "380" },
                            { icon: Building2, label: "Nivel", val: "PH-32" },
                        ].map((d, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <d.icon className="w-3 h-3 text-[#C8A96E]/40 shrink-0" />
                                <span className="text-[8px] text-white/35 flex-1">{d.label}</span>
                                <span className="text-[9px] font-bold text-white">{d.val}</span>
                            </div>
                        ))}
                    </div>

                    {/* Agent card */}
                    <div className="mb-3">
                        <span className="text-[7px] font-black uppercase tracking-widest text-white/25 block mb-2">Asesor</span>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#C8A96E]/40 to-[#C8A96E]/10 border border-[#C8A96E]/20 shrink-0" />
                            <div>
                                <span className="text-[9px] font-bold text-white block">María González</span>
                                <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-2 h-2 text-[#C8A96E] fill-[#C8A96E]" />)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTAs */}
                    <div className="mt-auto space-y-2">
                        <button className="w-full flex items-center justify-center gap-1.5 bg-[#C8A96E] text-[#07080A] py-2 rounded-lg text-[8px] font-black uppercase hover:bg-amber-400 transition-colors">
                            <Phone className="w-2.5 h-2.5" /> Llamar
                        </button>
                        <button className="w-full flex items-center justify-center gap-1.5 border border-white/10 text-white/50 py-2 rounded-lg text-[8px] font-bold hover:border-white/20 hover:text-white/80 transition-colors">
                            <Mail className="w-2.5 h-2.5" /> Email
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN SHOWCASE
// ═══════════════════════════════════════════════════════════════════════════════
const tabs = [
    {
        id: "advisor",
        label: "Portal del Asesor",
        tag: "CRM + IA",
        desc: "Leads calificados automáticamente. Gestión de inventario. Sincronización en tiempo real.",
        accentFrom: "from-amber-500/15",
        component: "advisor" as const,
    },
    {
        id: "owner",
        label: "Portal Propietario",
        tag: "Transparencia",
        desc: "El diferencial que cierra exclusivas. Reporte en vivo sin llamadas innecesarias.",
        accentFrom: "from-green-500/10",
        component: "owner" as const,
    },
    {
        id: "landing",
        label: "Landing de Propiedad",
        tag: "Conversión",
        desc: "Cada listado se convierte en una marca de ultra-lujo con landing propia.",
        accentFrom: "from-blue-500/10",
        component: "landing" as const,
    },
];

const TAB_DURATION = 10; // seconds per tab

export default function ExperienceShowcase() {
    const [active, setActive] = useState(0);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        if (paused) return;
        const t = setInterval(() => setActive(p => (p + 1) % tabs.length), TAB_DURATION * 1000);
        return () => clearInterval(t);
    }, [paused]);

    return (
        <div className="w-full">
            {/* Tabs */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10">
                {tabs.map((tab, i) => (
                    <button
                        key={tab.id}
                        onClick={() => { setActive(i); setPaused(true); }}
                        className={`relative flex-1 text-left px-5 py-4 rounded-2xl border transition-all duration-500 overflow-hidden ${active === i
                                ? "border-[#C8A96E]/50 bg-[#C8A96E]/5"
                                : "border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.03]"
                            }`}
                    >
                        {active === i && (
                            <motion.div
                                layoutId="tab-bg"
                                className="absolute inset-0 bg-gradient-to-br from-[#C8A96E]/10 to-transparent"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                        <span className={`relative text-[8px] font-black uppercase tracking-[0.25em] block mb-1 transition-colors ${active === i ? "text-[#C8A96E]" : "text-white/20"}`}>
                            {tab.tag}
                        </span>
                        <span className={`relative text-sm font-black block mb-1 transition-colors ${active === i ? "text-white" : "text-white/40"}`}>
                            {tab.label}
                        </span>
                        <span className={`relative text-[9px] leading-relaxed transition-colors ${active === i ? "text-white/50" : "text-white/15"}`}>
                            {tab.desc}
                        </span>
                        {/* Auto-progress bar */}
                        {active === i && !paused && (
                            <motion.div
                                key={`${active}-progress`}
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: TAB_DURATION, ease: "linear" }}
                                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#C8A96E] to-amber-300"
                            />
                        )}
                        {active === i && paused && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C8A96E]/30" />
                        )}
                    </button>
                ))}
            </div>

            {/* Preview */}
            <div
                className="relative rounded-3xl overflow-hidden border border-white/8 shadow-[0_60px_120px_rgba(0,0,0,0.7)]"
                style={{ aspectRatio: "16/9" }}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
            >
                {/* Ambient glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${tabs[active].accentFrom} to-transparent pointer-events-none z-0 transition-all duration-1000`} />

                {/* Pill label */}
                <div className="absolute top-4 left-4 z-20">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={active}
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-[#C8A96E] animate-pulse" />
                            <span className="text-[9px] font-bold text-white/60">{tabs[active].label}</span>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Pause indicator */}
                {paused && (
                    <div className="absolute top-4 right-4 z-20 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full border border-white/10">
                        <span className="text-[7px] text-white/30 font-mono">PAUSADO</span>
                    </div>
                )}

                {/* Main animated panel */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={active}
                        initial={{ opacity: 0, y: 16, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.99 }}
                        transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="absolute inset-0 z-10"
                    >
                        {active === 0 && <AdvisorDashboardPreview />}
                        {active === 1 && <OwnerPortalPreview />}
                        {active === 2 && <PropertyLandingPreview />}
                    </motion.div>
                </AnimatePresence>

                {/* Bottom navigation dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                    {tabs.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => { setActive(i); setPaused(true); }}
                            className={`h-1.5 rounded-full transition-all duration-500 ${active === i ? "w-8 bg-[#C8A96E]" : "w-2 bg-white/20 hover:bg-white/40"}`}
                        />
                    ))}
                </div>
            </div>

            {/* Hover hint */}
            <p className="text-center text-[9px] text-white/20 mt-4 font-mono">
                Pasa el cursor sobre el preview para pausar · Haz click en las pestañas para navegar
            </p>
        </div>
    );
}
