"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    BarChart3, Users, Layout, Zap, ArrowRight, ShieldCheck,
    MessageSquare, Smartphone, Target, TrendingUp,
    ShieldAlert, CheckCircle2, X, Clock, Bell,
    Globe, Heart, ChevronDown, Check,
    MinusCircle, Rocket, MousePointer2, Key, Gem,
    FileText, Building2, DollarSign, Star, PhoneCall,
    CalendarCheck, Monitor
} from "lucide-react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { MotionDiv } from "@/components/landing/motion-wrapper";
import TiltCard from "@/components/landing/tilt-card";
import FadeIn from "@/components/landing/fade-in";

// ─── Config ────────────────────────────────────────────────────────────────
// TODO: Reemplaza con tu número de WhatsApp real (formato: 52 + 10 dígitos)
const WA_NUMBER = "528121980008";

// ─── Live Activity Feed ────────────────────────────────────────────────────
function LiveActivityFeed() {
    const activities = [
        { name: "Carlos R.", loc: "San Pedro", action: "agendó su demo gratuita", time: "hace 3 min" },
        { name: "Laura M.", loc: "Monterrey", action: "activó su portal de propietario", time: "hace 8 min" },
        { name: "Diego V.", loc: "Cumbres", action: "cerró exclusiva de $8.5M con Aurum", time: "hace 15 min" },
        { name: "Ana P.", loc: "Valle", action: "captó mansión en San Agustín", time: "hace 20 min" },
        { name: "Marco S.", loc: "Garza García", action: "generó ficha técnica PDF en 12 seg", time: "hace 28 min" },
        { name: "Elena V.", loc: "Contry", action: "recibió 4 leads desde su portal", time: "hace 35 min" },
        { name: "Roberto G.", loc: "Santa Catarina", action: "firmó contrato de exclusiva vía Aurum", time: "hace 40 min" },
        { name: "Sofía L.", loc: "Mitras", action: "mostró portal a propietario en presentación", time: "hace 50 min" },
        { name: "Javier M.", loc: "Loma Larga", action: "actualizó 3 exclusivas desde el celular", time: "hace 1 hora" },
        { name: "Carla B.", loc: "Monterrey Centro", action: "activó QR inteligente para open house", time: "hace 1 hora" },
    ];

    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => setIndex(prev => (prev + 1) % activities.length), 5000);
        return () => clearInterval(timer);
    }, [activities.length]);

    return (
        <div className="fixed bottom-6 left-6 md:bottom-8 md:left-8 z-50 w-[calc(100%-3rem)] md:w-72 max-w-sm pointer-events-none">
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    className="bg-cima-card/80 backdrop-blur-xl border border-cima-gold/20 p-3 md:p-4 rounded-xl md:rounded-2xl shadow-2xl flex items-center gap-3 md:gap-4 pointer-events-auto"
                >
                    <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center shrink-0">
                        <Bell className="h-4 w-4 md:h-5 md:w-5 text-cima-gold" />
                    </div>
                    <div>
                        <p className="text-[8px] md:text-[10px] font-bold text-cima-gold uppercase tracking-widest">{activities[index].loc}</p>
                        <p className="text-[10px] md:text-[11px] text-white/80 leading-tight">
                            <span className="font-bold text-white">{activities[index].name}</span> {activities[index].action}
                        </p>
                        <p className="text-[8px] md:text-[9px] text-white/30 mt-0.5 md:mt-1 font-mono">{activities[index].time}</p>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

// ─── Countdown Timer ───────────────────────────────────────────────────────
function CountdownTimer() {
    const [timeLeft, setTimeLeft] = useState({ hours: 47, minutes: 59, seconds: 59 });

    useEffect(() => {
        const storedDeadline = localStorage.getItem("cima-agenda-deadline");
        let deadline: number;
        if (storedDeadline) {
            deadline = parseInt(storedDeadline);
        } else {
            deadline = Date.now() + 48 * 60 * 60 * 1000;
            localStorage.setItem("cima-agenda-deadline", deadline.toString());
        }
        const tick = () => {
            const diff = Math.max(0, deadline - Date.now());
            setTimeLeft({
                hours: Math.floor(diff / (1000 * 60 * 60)),
                minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((diff % (1000 * 60)) / 1000),
            });
        };
        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, []);

    const pad = (n: number) => String(n).padStart(2, "0");

    return (
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-red-500/5 via-red-500/10 to-red-500/5 border border-red-500/20 rounded-2xl px-5 py-3">
            <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-red-400" />
                <span className="text-[9px] md:text-[10px] font-bold text-red-400/80 uppercase tracking-widest">Cupos disponibles hasta:</span>
            </div>
            <div className="flex items-center gap-1 font-mono">
                {[
                    { val: pad(timeLeft.hours), label: "h" },
                    { val: pad(timeLeft.minutes), label: "m" },
                    { val: pad(timeLeft.seconds), label: "s" },
                ].map((t, i) => (
                    <React.Fragment key={i}>
                        {i > 0 && <span className="text-red-500/30 text-xs font-bold">:</span>}
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-2 py-1">
                            <span className="text-sm md:text-base font-black text-red-400 tabular-nums">{t.val}</span>
                            <span className="text-[6px] text-red-400/50 uppercase ml-0.5">{t.label}</span>
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}

// ─── CountUp hook ──────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1.8, inView = false) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!inView) return;
        let start = 0;
        const step = target / (duration * 60);
        const timer = setInterval(() => {
            start += step;
            if (start >= target) { setCount(target); clearInterval(timer); }
            else setCount(Math.floor(start));
        }, 1000 / 60);
        return () => clearInterval(timer);
    }, [inView, target, duration]);
    return count;
}

// ─── Success Metrics ───────────────────────────────────────────────────────
function MetricCard({ label, num, suffix, prefix, icon: Icon, delay }: {
    label: string; num: number; suffix?: string; prefix?: string;
    icon: React.ElementType; delay: number;
}) {
    const ref = React.useRef(null);
    const inView = useInView(ref, { once: true, margin: "-60px" });
    const count = useCountUp(num, 1.6, inView);
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay, duration: 0.5 }}
            className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl text-center group hover:border-cima-gold/30 transition-all"
        >
            <div className="h-10 w-10 rounded-full bg-cima-gold/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Icon className="h-5 w-5 text-cima-gold" />
            </div>
            <p className="text-2xl font-black text-white mb-1 tabular-nums">
                {prefix}{count}{suffix}
            </p>
            <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{label}</p>
        </motion.div>
    );
}

function SuccessMetrics() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <MetricCard label="Asesores Activos"     num={40}  prefix="+" suffix=""      icon={Users}      delay={0} />
            <MetricCard label="Entrega Garantizada"  num={7}   prefix=""  suffix=" días" icon={Clock}      delay={0.1} />
            <MetricCard label="ROI Promedio"         num={12}  prefix=""  suffix="×"     icon={TrendingUp} delay={0.2} />
            <MetricCard label="Satisfacción"         num={99}  prefix=""  suffix="%"     icon={Heart}      delay={0.3} />
        </div>
    );
}

// ─── ROI Calculator (simplified) ──────────────────────────────────────────
function RoiCalculator() {
    const [price, setPrice] = useState(5000000);
    const [closings, setClosings] = useState(6);

    const commission = price * 0.05;
    const annual = commission * closings;
    const planCost = 29900;
    const roi = Math.round(annual / planCost);

    return (
        <div className="bg-white/[0.02] border border-white/10 rounded-[20px] md:rounded-[40px] p-6 md:p-12 backdrop-blur-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 items-center">
                <div>
                    <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-[0.3em] mb-4 block">Simulador de Impacto</span>
                    <h3 className="text-2xl md:text-3xl font-heading font-bold mb-4 md:mb-6">
                        Tu plataforma se paga con <span className="text-cima-gold">un solo cierre.</span>
                    </h3>
                    <p className="text-white/50 mb-8 text-xs md:text-sm leading-relaxed">
                        Ajusta el valor de tus propiedades y cuántas cierras al año. Ve cuántas veces recuperas tu inversión en Aurum.
                    </p>
                    <div className="space-y-6 md:space-y-8">
                        <div>
                            <label className="text-[9px] md:text-[10px] uppercase font-bold text-white/40 block mb-3">Valor promedio de tus propiedades</label>
                            <input
                                type="range" min="1000000" max="15000000" step="500000"
                                value={price} onChange={e => setPrice(Number(e.target.value))}
                                className="w-full accent-cima-gold bg-white/10 h-1.5 rounded-full appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between mt-2 text-[9px] md:text-[10px] font-mono text-white/30 uppercase">
                                <span>$1M</span>
                                <span className="text-cima-gold font-bold text-xs">${(price / 1000000).toFixed(1)}M MXN</span>
                                <span>$15M</span>
                            </div>
                        </div>
                        <div>
                            <label className="text-[9px] md:text-[10px] uppercase font-bold text-white/40 block mb-3">Propiedades cerradas al año</label>
                            <div className="grid grid-cols-4 gap-2">
                                {[3, 6, 12, 24].map(val => (
                                    <button
                                        key={val}
                                        onClick={() => setClosings(val)}
                                        className={`py-2.5 rounded-xl border text-[10px] md:text-xs font-bold transition-all ${closings === val ? "bg-cima-gold text-black border-cima-gold" : "bg-white/5 border-white/10 text-white/40 hover:border-cima-gold/30"}`}
                                    >
                                        {val}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-cima-gold/5 rounded-2xl md:rounded-3xl p-6 md:p-8 border border-cima-gold/20 relative overflow-hidden">
                    <div className="absolute -top-16 -right-16 w-48 h-48 bg-cima-gold/10 blur-[60px] rounded-full" />
                    <div className="relative z-10 space-y-6 md:space-y-8">
                        <div>
                            <p className="text-[9px] md:text-[10px] uppercase font-bold text-cima-gold tracking-[0.2em] mb-1.5">Comisión estimada por venta (5%)</p>
                            <p className="text-2xl md:text-3xl font-heading font-bold text-white">${new Intl.NumberFormat().format(commission)}</p>
                        </div>
                        <div className="pt-4 md:pt-6 border-t border-white/5">
                            <p className="text-[9px] md:text-[10px] uppercase font-bold text-white/40 tracking-[0.2em] mb-1.5">Ingreso Anual Proyectado</p>
                            <p className="text-xl md:text-2xl font-heading font-bold text-white/90">${new Intl.NumberFormat().format(annual)}</p>
                        </div>
                        <div className="pt-4 md:pt-6 border-t border-white/5">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-[8px] md:text-[10px] uppercase font-black text-cima-gold tracking-[0.2em] mb-1 italic">ROI Anual estimado</p>
                                    <p className="text-4xl md:text-5xl font-heading font-black text-cima-gold">{roi}×</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[8px] md:text-[9px] text-cima-gold/60 leading-tight">Tu plataforma se paga<br />{roi} veces en un año.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Portal Preview ────────────────────────────────────────────────────────
function PortalPreview() {
    const [tab, setTab] = useState(0);
    const [paused, setPaused] = useState(false);
    const tabs = [
        { label: "Portal Dueño", icon: Users },
        { label: "Feedback IA", icon: BarChart3 },
        { label: "Ficha PDF", icon: FileText },
        { label: "Pipeline", icon: TrendingUp },
    ];

    // Auto-cycle tabs every 4 seconds unless user clicked one
    useEffect(() => {
        if (paused) return;
        const t = setInterval(() => setTab(prev => (prev + 1) % tabs.length), 4000);
        return () => clearInterval(t);
    }, [paused, tabs.length]);

    return (
        <div className="bg-white/[0.02] border border-white/10 rounded-[20px] md:rounded-[32px] overflow-hidden shadow-2xl shadow-cima-gold/5 ring-1 ring-cima-gold/10">
            {/* Top bar — fake browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.01]">
                <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500/40" />
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/40" />
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500/40" />
                </div>
                <div className="flex-1 mx-3 h-5 bg-white/5 border border-white/5 rounded-md flex items-center px-2 gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-cima-gold/40" />
                    <span className="text-[8px] text-white/20 font-mono">aurum.mx/portal/pedro-garza</span>
                </div>
                <span className="text-[7px] text-white/20 font-mono uppercase tracking-widest hidden sm:block">● En vivo</span>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/5 overflow-x-auto no-scrollbar">
                {tabs.map((t, i) => (
                    <button
                        key={i}
                        onClick={() => { setTab(i); setPaused(true); }}
                        className={`relative flex items-center gap-2 px-4 md:px-6 py-3.5 text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${tab === i ? "text-cima-gold border-b-2 border-cima-gold bg-cima-gold/5" : "text-white/25 hover:text-white/50"}`}
                    >
                        <t.icon className="h-3 w-3" />
                        {t.label}
                        {/* Auto-progress bar on active tab */}
                        {tab === i && !paused && (
                            <motion.span
                                key={i}
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 4, ease: "linear" }}
                                className="absolute bottom-0 left-0 right-0 h-[2px] bg-cima-gold/40 origin-left"
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="p-5 md:p-7 min-h-[340px]">
                <AnimatePresence mode="wait">

                    {/* ── TAB 0: Portal Propietario ── */}
                    {tab === 0 && (
                        <motion.div key="portal" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
                            {/* Header */}
                            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-[7px] font-black text-cima-gold uppercase tracking-[0.2em] mb-1">Mi Portal · Aurum</p>
                                        <h5 className="text-sm font-black text-white">Hola, Pedro 👋</h5>
                                        <div className="flex items-center gap-1 mt-1">
                                            <div className="h-3 w-3 rounded-full bg-cima-gold flex items-center justify-center">
                                                <Check className="h-1.5 w-1.5 text-black" />
                                            </div>
                                            <span className="text-[7px] font-bold text-white/40 uppercase tracking-widest">Asesor verificado Aurum</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[8px] px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 font-bold uppercase">● Activa</span>
                                        <p className="text-[7px] text-white/30 uppercase mt-1.5 font-bold">Semana 4 / 8</p>
                                    </div>
                                </div>

                                {/* Stats grid */}
                                <div className="grid grid-cols-4 gap-2 mb-4">
                                    {[
                                        { l: "Precio", v: "$4.2M" },
                                        { l: "Visitas", v: "17" },
                                        { l: "Leads", v: "4" },
                                        { l: "m²", v: "220" },
                                    ].map((s, i) => (
                                        <div key={i} className="bg-white/5 border border-white/5 rounded-xl p-2 text-center">
                                            <p className="text-[6px] text-white/30 uppercase font-bold mb-0.5">{s.l}</p>
                                            <p className="text-[10px] font-black text-white">{s.v}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Progress timeline */}
                                <div className="pt-3 border-t border-white/5">
                                    <p className="text-[7px] font-bold text-white/30 uppercase mb-3 tracking-widest">Etapa de tu venta</p>
                                    <div className="relative flex justify-between">
                                        <div className="absolute top-[9px] left-0 right-0 h-[1px] bg-white/10" />
                                        {[
                                            { s: "Captación", done: true },
                                            { s: "Publicación", done: true },
                                            { s: "Visitas", active: true },
                                            { s: "Cierre", done: false },
                                        ].map((step, i) => (
                                            <div key={i} className="relative z-10 flex flex-col items-center gap-1">
                                                <div className={`h-[18px] w-[18px] rounded-full border-2 flex items-center justify-center transition-all ${step.active ? "bg-cima-gold border-cima-gold shadow-lg shadow-cima-gold/30" : step.done ? "bg-white/20 border-white/30" : "bg-black border-white/10"}`}>
                                                    {step.done && <Check className="h-2 w-2 text-white" />}
                                                    {step.active && <div className="h-1.5 w-1.5 rounded-full bg-black" />}
                                                </div>
                                                <p className={`text-[6px] font-bold uppercase truncate max-w-[40px] text-center ${step.active ? "text-cima-gold" : step.done ? "text-white/40" : "text-white/15"}`}>{step.s}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Recent activity */}
                            <div className="space-y-2">
                                <p className="text-[7px] font-bold text-white/30 uppercase tracking-widest px-1">Actividad reciente</p>
                                {[
                                    { icon: "👁", text: "Visita registrada — Juan M.", time: "Hoy 11:30", color: "text-blue-400" },
                                    { icon: "💬", text: "Feedback recibido: 'precio alto'", time: "Ayer", color: "text-yellow-400" },
                                    { icon: "📸", text: "3 fotos nuevas subidas", time: "Hace 2 días", color: "text-cima-gold" },
                                ].map((a, i) => (
                                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                                        <span className="text-sm">{a.icon}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[9px] text-white/70 font-medium truncate">{a.text}</p>
                                        </div>
                                        <span className={`text-[7px] font-bold ${a.color} shrink-0`}>{a.time}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-[9px] text-white/20 text-center font-mono pt-1">Tu propietario ve esto en tiempo real — sin llamarte.</p>
                        </motion.div>
                    )}

                    {/* ── TAB 1: Feedback IA ── */}
                    {tab === 1 && (
                        <motion.div key="feedback" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
                            <div className="flex items-center justify-between mb-1">
                                <div>
                                    <p className="text-[7px] font-black text-cima-gold uppercase tracking-[0.2em]">Análisis de Sentimiento · IA</p>
                                    <p className="text-xs font-black text-white mt-0.5">Semana 4 — 17 visitas</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[7px] text-white/30 uppercase font-bold">Score general</p>
                                    <p className="text-lg font-black text-cima-gold">6.4<span className="text-[9px] text-white/30">/10</span></p>
                                </div>
                            </div>

                            {/* Sentiment bars */}
                            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 space-y-3">
                                {[
                                    { l: "Precio alto", v: 8, pct: 47, c: "bg-red-500", dot: "bg-red-500" },
                                    { l: "Muy interesado", v: 4, pct: 24, c: "bg-green-500", dot: "bg-green-500" },
                                    { l: "Lo pensará", v: 3, pct: 18, c: "bg-cima-gold", dot: "bg-cima-gold" },
                                    { l: "No le convino", v: 2, pct: 11, c: "bg-white/30", dot: "bg-white/20" },
                                ].map((item, i) => (
                                    <div key={i} className="space-y-1">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <div className={`h-1.5 w-1.5 rounded-full ${item.dot}`} />
                                                <span className="text-[9px] font-bold text-white/70">{item.l}</span>
                                            </div>
                                            <span className="text-[9px] font-black text-white">{item.v} <span className="text-white/30 font-normal">({item.pct}%)</span></span>
                                        </div>
                                        <div className="h-1.5 rounded-full bg-white/5">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${item.pct}%` }}
                                                transition={{ delay: i * 0.1, duration: 0.6, ease: "easeOut" }}
                                                className={`h-full rounded-full ${item.c}`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* IA recommendation */}
                            <div className="bg-cima-gold/5 border border-cima-gold/20 rounded-2xl p-3 flex gap-3">
                                <div className="h-7 w-7 rounded-lg bg-cima-gold/10 flex items-center justify-center shrink-0">
                                    <Zap className="h-3.5 w-3.5 text-cima-gold" />
                                </div>
                                <div>
                                    <p className="text-[8px] font-black text-cima-gold uppercase tracking-widest mb-0.5">Recomendación IA</p>
                                    <p className="text-[9px] text-white/60 leading-relaxed">El 47% señala precio alto. Considerar ajuste de <span className="text-white font-bold">$200K–$300K</span> o agregar incentivos para cerrar en semana 5.</p>
                                </div>
                            </div>
                            <p className="text-[9px] text-white/20 text-center font-mono">Datos reales para defender o ajustar el precio con el dueño.</p>
                        </motion.div>
                    )}

                    {/* ── TAB 2: Ficha PDF ── */}
                    {tab === 2 && (
                        <motion.div key="ficha" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-[7px] font-black text-cima-gold uppercase tracking-[0.2em]">Ficha Técnica PDF · Ultra-lujo</p>
                                <span className="text-[7px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 rounded-full px-2 py-0.5">Generada en 12 seg</span>
                            </div>

                            {/* A4 paper mockup */}
                            <div className="bg-[#1a1a1f] border border-white/10 rounded-xl overflow-hidden">
                                {/* PDF header */}
                                <div className="bg-gradient-to-r from-[#0F0F12] to-[#1a1a1f] px-4 py-3 flex items-center justify-between border-b border-white/5">
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 rounded bg-cima-gold/20 flex items-center justify-center">
                                            <span className="text-[6px] font-black text-cima-gold">C</span>
                                        </div>
                                        <span className="text-[8px] font-black text-white/60 uppercase tracking-widest">Aurum · Tu Marca</span>
                                    </div>
                                    <span className="text-[7px] text-white/20 font-mono">aurum.mx</span>
                                </div>
                                {/* PDF body */}
                                <div className="p-4">
                                    {/* Property image placeholder */}
                                    <div className="w-full h-20 rounded-lg bg-gradient-to-br from-cima-gold/10 via-white/5 to-transparent border border-white/5 mb-3 flex items-center justify-center relative overflow-hidden">
                                        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_8px,rgba(200,169,110,0.03)_8px,rgba(200,169,110,0.03)_9px)]" />
                                        <div className="text-center">
                                            <p className="text-[8px] text-white/30 font-mono">Foto principal de la propiedad</p>
                                        </div>
                                        {/* Watermark */}
                                        <span className="absolute bottom-1.5 right-2 text-[6px] text-cima-gold/30 font-black uppercase tracking-widest">EXCLUSIVA · CIMA PRO</span>
                                    </div>
                                    {/* Property details */}
                                    <div className="mb-3">
                                        <p className="text-[10px] font-black text-white">Casa Valle del Campestre</p>
                                        <p className="text-[8px] text-white/40">Col. Valle del Campestre · San Pedro G.G., NL</p>
                                    </div>
                                    <div className="grid grid-cols-3 gap-1.5 mb-3">
                                        {[
                                            { l: "Precio", v: "$4,200,000" },
                                            { l: "Superficie", v: "220 m²" },
                                            { l: "Recámaras", v: "3" },
                                            { l: "Baños", v: "2.5" },
                                            { l: "Autos", v: "2" },
                                            { l: "Antigüedad", v: "5 años" },
                                        ].map((d, i) => (
                                            <div key={i} className="bg-white/5 rounded-lg p-1.5 text-center">
                                                <p className="text-[5px] text-white/30 uppercase font-bold mb-0.5">{d.l}</p>
                                                <p className="text-[8px] font-black text-white">{d.v}</p>
                                            </div>
                                        ))}
                                    </div>
                                    {/* CTA row */}
                                    <div className="flex items-center justify-between border-t border-white/5 pt-2">
                                        <span className="text-[7px] text-cima-gold/60 font-mono">Lic. Roberto García · +52 81 XXXX XXXX</span>
                                        <div className="flex items-center gap-1 bg-cima-gold/10 border border-cima-gold/20 rounded px-2 py-0.5">
                                            <ArrowRight className="h-2 w-2 text-cima-gold" />
                                            <span className="text-[6px] font-bold text-cima-gold uppercase">Descargar</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-[9px] text-white/20 text-center font-mono">Sin Word. Sin Canva. Lista para WhatsApp en segundos.</p>
                        </motion.div>
                    )}

                    {/* ── TAB 3: Pipeline ── */}
                    {tab === 3 && (
                        <motion.div key="pipeline" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-[7px] font-black text-cima-gold uppercase tracking-[0.2em]">Pipeline de Exclusivas</p>
                                <div className="flex items-center gap-1 bg-cima-gold/10 border border-cima-gold/20 rounded-full px-2 py-0.5">
                                    <TrendingUp className="h-2.5 w-2.5 text-cima-gold" />
                                    <span className="text-[7px] font-bold text-cima-gold">$24.6M activo</span>
                                </div>
                            </div>

                            {/* Kanban columns */}
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    {
                                        stage: "Captando", color: "border-blue-500/30 bg-blue-500/5", dot: "bg-blue-400",
                                        props: [
                                            { name: "Casa Cumbres", price: "$3.8M", days: "Día 2" },
                                            { name: "Depto Mitras", price: "$1.9M", days: "Día 1" },
                                        ]
                                    },
                                    {
                                        stage: "En Visitas", color: "border-cima-gold/30 bg-cima-gold/5", dot: "bg-cima-gold",
                                        props: [
                                            { name: "Casa Valle", price: "$4.2M", days: "Semana 4" },
                                            { name: "PH Contry", price: "$8.7M", days: "Semana 2" },
                                        ]
                                    },
                                    {
                                        stage: "En Cierre", color: "border-green-500/30 bg-green-500/5", dot: "bg-green-400",
                                        props: [
                                            { name: "Casa San Agustín", price: "$6.0M", days: "Oferta" },
                                        ]
                                    },
                                ].map((col, ci) => (
                                    <div key={ci} className={`border rounded-xl p-2.5 ${col.color}`}>
                                        <div className="flex items-center gap-1.5 mb-2">
                                            <div className={`h-1.5 w-1.5 rounded-full ${col.dot}`} />
                                            <p className="text-[7px] font-black text-white/50 uppercase tracking-wide">{col.stage}</p>
                                        </div>
                                        <div className="space-y-1.5">
                                            {col.props.map((p, pi) => (
                                                <div key={pi} className="bg-white/[0.04] border border-white/5 rounded-lg p-2">
                                                    <p className="text-[8px] font-bold text-white leading-tight">{p.name}</p>
                                                    <p className="text-[7px] text-cima-gold font-black">{p.price}</p>
                                                    <p className="text-[6px] text-white/25 font-mono">{p.days}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Commission tracker */}
                            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-3 flex items-center justify-between">
                                <div>
                                    <p className="text-[7px] font-bold text-white/30 uppercase tracking-widest mb-0.5">Comisión proyectada (5%)</p>
                                    <p className="text-base font-black text-white">$<span className="text-cima-gold">300,000</span> <span className="text-white/30 text-xs font-normal">este mes</span></p>
                                </div>
                                <div className="h-10 w-10 rounded-xl bg-cima-gold/10 border border-cima-gold/20 flex items-center justify-center">
                                    <DollarSign className="h-5 w-5 text-cima-gold" />
                                </div>
                            </div>
                            <p className="text-[9px] text-white/20 text-center font-mono">Todo tu inventario en un solo panel — desde el celular.</p>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
}

// ─── Admin Dashboard Preview ──────────────────────────────────────────────
function AdminDashboardPreview() {
    const [tab, setTab] = useState(0);
    const [paused, setPaused] = useState(false);
    const tabs = [
        { label: "Dashboard", icon: BarChart3 },
        { label: "Exclusivas", icon: Building2 },
        { label: "Leads",      icon: Users },
        { label: "Comisiones", icon: DollarSign },
    ];

    useEffect(() => {
        if (paused) return;
        const t = setInterval(() => setTab(prev => (prev + 1) % tabs.length), 4500);
        return () => clearInterval(t);
    }, [paused, tabs.length]);

    return (
        <div className="bg-white/[0.02] border border-white/10 rounded-[20px] md:rounded-[32px] overflow-hidden shadow-2xl shadow-cima-gold/5 ring-1 ring-cima-gold/10">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.01]">
                <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500/40" />
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/40" />
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500/40" />
                </div>
                <div className="flex-1 mx-3 h-5 bg-white/5 border border-white/5 rounded-md flex items-center px-2 gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-cima-gold/40" />
                    <span className="text-[8px] text-white/20 font-mono">aurum.mx/admin/dashboard</span>
                </div>
                <span className="text-[7px] text-green-400/60 font-mono uppercase tracking-widest hidden sm:flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse inline-block" />En vivo
                </span>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/5 overflow-x-auto no-scrollbar">
                {tabs.map((t, i) => (
                    <button
                        key={i}
                        onClick={() => { setTab(i); setPaused(true); }}
                        className={`relative flex items-center gap-2 px-4 md:px-6 py-3.5 text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${tab === i ? "text-cima-gold border-b-2 border-cima-gold bg-cima-gold/5" : "text-white/25 hover:text-white/50"}`}
                    >
                        <t.icon className="h-3 w-3" />
                        {t.label}
                        {tab === i && !paused && (
                            <motion.span
                                key={i}
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 4.5, ease: "linear" }}
                                className="absolute bottom-0 left-0 right-0 h-[2px] bg-cima-gold/40 origin-left"
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="p-5 md:p-7 min-h-[360px]">
                <AnimatePresence mode="wait">

                    {/* ── TAB 0: Dashboard ── */}
                    {tab === 0 && (
                        <motion.div key="dash" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
                            <div className="grid grid-cols-4 gap-2">
                                {[
                                    { l: "Exclusivas", v: "7",     sub: "activas",    color: "text-cima-gold",  bg: "bg-cima-gold/5  border-cima-gold/10" },
                                    { l: "Leads",      v: "14",    sub: "esta semana", color: "text-blue-400",   bg: "bg-blue-500/5   border-blue-500/10" },
                                    { l: "Comisión",   v: "$280K", sub: "proyectada",  color: "text-green-400",  bg: "bg-green-500/5  border-green-500/10" },
                                    { l: "Portales",   v: "7",     sub: "activos",     color: "text-purple-400", bg: "bg-purple-500/5 border-purple-500/10" },
                                ].map((m, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.07 }}
                                        className={`${m.bg} border rounded-xl p-2.5 text-center`}
                                    >
                                        <p className="text-[6px] text-white/30 uppercase font-bold mb-1">{m.l}</p>
                                        <p className={`text-base font-black ${m.color}`}>{m.v}</p>
                                        <p className="text-[6px] text-white/20 font-mono">{m.sub}</p>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {/* Activity feed */}
                                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 space-y-2">
                                    <p className="text-[7px] font-black text-white/30 uppercase tracking-widest mb-2">Actividad reciente</p>
                                    {[
                                        { dot: "bg-green-400",  text: "Lead nuevo · Valle",         time: "3 min" },
                                        { dot: "bg-cima-gold",  text: "Ficha PDF generada",          time: "12 min" },
                                        { dot: "bg-blue-400",   text: "Visita registrada · Cumbres", time: "1h" },
                                        { dot: "bg-purple-400", text: "Propietario revisó portal",   time: "2h" },
                                    ].map((a, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${a.dot}`} />
                                            <p className="text-[8px] text-white/50 flex-1 truncate">{a.text}</p>
                                            <span className="text-[7px] text-white/20 font-mono shrink-0">{a.time}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Bar chart */}
                                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                                    <p className="text-[7px] font-black text-white/30 uppercase tracking-widest mb-2">Exclusivas · 6 meses</p>
                                    <div className="flex items-end gap-1.5 h-16">
                                        {[3, 5, 4, 7, 6, 8].map((h, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ scaleY: 0 }}
                                                animate={{ scaleY: 1 }}
                                                transition={{ delay: i * 0.08, duration: 0.5, ease: "easeOut" }}
                                                style={{ originY: 1, height: `${(h / 8) * 100}%` }}
                                                className="flex-1 rounded-t bg-cima-gold/30 hover:bg-cima-gold/60 transition-colors"
                                            />
                                        ))}
                                    </div>
                                    <div className="flex justify-between mt-1">
                                        {["A", "S", "O", "N", "D", "E"].map(m => (
                                            <span key={m} className="text-[6px] text-white/15 font-mono flex-1 text-center">{m}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-[9px] text-white/20 text-center font-mono pt-1">Todo tu negocio en una sola pantalla — actualizado al instante.</p>
                        </motion.div>
                    )}

                    {/* ── TAB 1: Exclusivas ── */}
                    {tab === 1 && (
                        <motion.div key="excl" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-2">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-[7px] font-black text-cima-gold uppercase tracking-[0.2em]">Mis Exclusivas Activas</p>
                                <div className="flex items-center gap-1 bg-cima-gold/10 border border-cima-gold/20 rounded-full px-2 py-0.5">
                                    <TrendingUp className="h-2.5 w-2.5 text-cima-gold" />
                                    <span className="text-[7px] font-bold text-cima-gold">$32.4M portafolio</span>
                                </div>
                            </div>
                            {[
                                { name: "Casa Valle del Campestre", price: "$4.2M", stage: "En Visitas", leads: 4, days: "28d", stageColor: "text-cima-gold bg-cima-gold/10 border-cima-gold/20" },
                                { name: "PH Contry Club",           price: "$8.7M", stage: "En Cierre",  leads: 2, days: "45d", stageColor: "text-green-400 bg-green-500/10 border-green-500/20" },
                                { name: "Casa Cumbres Platinum",    price: "$3.8M", stage: "Captando",   leads: 0, days: "2d",  stageColor: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
                                { name: "Depto Mitras Centro",      price: "$1.9M", stage: "En Visitas", leads: 6, days: "14d", stageColor: "text-cima-gold bg-cima-gold/10 border-cima-gold/20" },
                                { name: "Casa San Agustín",         price: "$6.0M", stage: "En Cierre",  leads: 1, days: "62d", stageColor: "text-green-400 bg-green-500/10 border-green-500/20" },
                            ].map((prop, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.06 }}
                                    className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-cima-gold/20 transition-all"
                                >
                                    <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
                                        <Building2 className="h-3.5 w-3.5 text-white/30" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[9px] font-bold text-white truncate">{prop.name}</p>
                                        <p className="text-[8px] text-cima-gold font-black">{prop.price}</p>
                                    </div>
                                    <div className="text-right shrink-0 space-y-0.5">
                                        <span className={`inline-block text-[7px] font-bold px-1.5 py-0.5 rounded-full border ${prop.stageColor}`}>{prop.stage}</span>
                                        <p className="text-[6px] text-white/25 font-mono">{prop.leads} leads · {prop.days}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* ── TAB 2: Leads ── */}
                    {tab === 2 && (
                        <motion.div key="leads" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-2.5">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-[7px] font-black text-cima-gold uppercase tracking-[0.2em]">Bandeja de Leads</p>
                                <div className="flex items-center gap-1 bg-blue-500/10 border border-blue-500/20 rounded-full px-2 py-0.5">
                                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                                    <span className="text-[7px] font-bold text-blue-400">14 leads activos</span>
                                </div>
                            </div>
                            {[
                                { name: "Juan M.",    prop: "Casa Valle",   score: 92, time: "3 min", hot: true,  source: "Portal" },
                                { name: "Sofía G.",   prop: "PH Contry",    score: 78, time: "1h",   hot: false, source: "WhatsApp" },
                                { name: "Roberto L.", prop: "Depto Mitras", score: 65, time: "3h",   hot: false, source: "Portal" },
                                { name: "Ana P.",     prop: "Casa Cumbres", score: 45, time: "1d",   hot: false, source: "Web" },
                            ].map((lead, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.07 }}
                                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${lead.hot ? "bg-cima-gold/5 border-cima-gold/20" : "bg-white/[0.02] border-white/5"}`}
                                >
                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-[8px] font-black shrink-0 ${lead.hot ? "bg-cima-gold text-black" : "bg-white/10 text-white/50"}`}>
                                        {lead.name.split(" ").map((n: string) => n[0]).join("")}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5 mb-0.5">
                                            <p className="text-[9px] font-bold text-white">{lead.name}</p>
                                            {lead.hot && <span className="text-[6px] bg-cima-gold text-black font-black px-1 py-0.5 rounded uppercase tracking-wide">Hot</span>}
                                        </div>
                                        <p className="text-[7px] text-white/40 truncate">{lead.prop} · {lead.source}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className={`text-[10px] font-black ${lead.score >= 80 ? "text-green-400" : lead.score >= 60 ? "text-cima-gold" : "text-white/30"}`}>{lead.score}<span className="text-[6px] opacity-50">/100</span></p>
                                        <p className="text-[6px] text-white/25 font-mono">{lead.time}</p>
                                    </div>
                                </motion.div>
                            ))}
                            <p className="text-[9px] text-white/20 text-center font-mono">Score automático por IA — actúa primero en los leads más calientes.</p>
                        </motion.div>
                    )}

                    {/* ── TAB 3: Comisiones ── */}
                    {tab === 3 && (
                        <motion.div key="comis" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-[7px] font-black text-cima-gold uppercase tracking-[0.2em]">Mis Comisiones 2025</p>
                                <span className="text-[7px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 rounded-full px-2 py-0.5">+38% vs 2024</span>
                            </div>
                            <div className="bg-cima-gold/5 border border-cima-gold/15 rounded-2xl p-4 text-center">
                                <p className="text-[8px] uppercase font-bold text-cima-gold/60 tracking-widest mb-1">Comisión proyectada anual</p>
                                <p className="text-3xl font-heading font-black text-white">$1,440,000</p>
                                <p className="text-[8px] text-white/30 font-mono mt-0.5">basado en tu pipeline actual</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[7px] font-bold text-white/30 uppercase tracking-widest">Desglose mensual</p>
                                {[
                                    { month: "Noviembre", amount: "$240,000", cierres: 2, status: "cobrada" },
                                    { month: "Diciembre", amount: "$180,000", cierres: 1, status: "cobrada" },
                                    { month: "Enero",     amount: "$280,000", cierres: 2, status: "en proceso" },
                                ].map((row, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.08 }}
                                        className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5"
                                    >
                                        <div>
                                            <p className="text-[9px] font-bold text-white">{row.month}</p>
                                            <p className="text-[7px] text-white/30">{row.cierres} cierre{row.cierres > 1 ? "s" : ""}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-cima-gold">{row.amount}</p>
                                            <span className={`text-[6px] font-bold px-1.5 py-0.5 rounded-full ${row.status === "cobrada" ? "text-green-400 bg-green-500/10" : "text-yellow-400 bg-yellow-500/10"}`}>{row.status}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────
function EliteFaq() {
    const faqs = [
        { q: "¿Necesito saber de tecnología?", a: "Para nada. La plataforma es Zero Code. Nosotros configuramos todo desde el primer día. Tú solo la usas desde tu celular o computadora, como si fuera una app cualquiera." },
        { q: "¿En cuánto tiempo veo resultados?", a: "La mayoría de asesores nota diferencia en su primera presentación con propietario. La plataforma está lista y operativa en 7 días. No es exageración." },
        { q: "¿Cuánto cuesta?", a: "Tenemos planes desde $14,900 MXN (único pago). La mayoría de asesores recupera la inversión completa con una sola exclusiva adicional. En la demo te mostramos el plan ideal para tu volumen." },
        { q: "¿Qué pasa si ya tengo un CRM?", a: "Aurum puede funcionar de forma independiente o conectarse a tus flujos actuales. No tienes que abandonar nada que ya funcione." },
        { q: "¿Y si no me convence la demo?", a: "Sin compromiso. Es una llamada de 15 minutos. Si no ves el valor, no hay presión. Si contratas y en 30 días no estás satisfecho, te devolvemos tu dinero." },
    ];
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
                <div key={i} className="group rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden transition-all hover:border-cima-gold/20">
                    <button
                        onClick={() => setOpenIndex(openIndex === i ? null : i)}
                        className="w-full p-6 text-left flex items-center justify-between gap-4"
                    >
                        <span className="text-sm md:text-base font-bold text-white/80 group-hover:text-white transition-colors">{faq.q}</span>
                        <div className={`h-6 w-6 rounded-full border border-white/10 flex items-center justify-center shrink-0 transition-transform duration-300 ${openIndex === i ? "rotate-180 bg-cima-gold border-cima-gold" : ""}`}>
                            <ChevronDown className={`h-3 w-3 ${openIndex === i ? "text-black" : "text-cima-gold"}`} />
                        </div>
                    </button>
                    <AnimatePresence>
                        {openIndex === i && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="px-6 pb-6 text-sm text-white/50 leading-relaxed border-t border-white/5 pt-4">
                                    {faq.a}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    );
}

// ─── Comparison Section ────────────────────────────────────────────────────
function ComparisonSection() {
    return (
        <div className="space-y-12 md:space-y-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
                {/* Traditional */}
                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 md:p-12 relative overflow-hidden group grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                    <div className="absolute top-4 right-4 bg-red-500/10 text-red-500 text-[8px] font-black uppercase tracking-widest py-1 px-3 rounded-full border border-red-500/20">
                        Lo que usas hoy
                    </div>
                    <h4 className="text-xl md:text-2xl font-heading font-bold mb-6 text-white/60">Software Tradicional</h4>
                    <div className="grid grid-cols-2 gap-3 mb-8">
                        {[
                            { name: "EasyBroker", img: "/competitors/easybroker.png", scale: "scale-[1.56]" },
                            { name: "NOCNOK",     img: "/competitors/NOCNOK.png" },
                            { name: "Wiggot",     img: "/competitors/wiggot.png" },
                            { name: "Wasi",       img: "/competitors/wasi.png" },
                        ].map(comp => (
                            <div key={comp.name} className="flex items-center justify-center p-6 bg-white/5 border border-white/10 rounded-xl relative overflow-hidden group/comp">
                                <img
                                    src={comp.img}
                                    alt={comp.name}
                                    className={`h-8 md:h-10 w-auto object-contain brightness-0 invert opacity-40 group-hover/comp:opacity-70 transition-opacity ${comp.scale ?? ""}`}
                                />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="h-[1px] w-[80%] bg-red-500/50 rotate-[-10deg]" />
                                </div>
                            </div>
                        ))}
                    </div>
                    <ul className="space-y-3">
                        {[
                            "Sitios genéricos, sin tu marca",
                            "Sin portal para el propietario",
                            "Reportes estáticos en PDF",
                            "El asesor se ve como todos los demás",
                        ].map(text => (
                            <li key={text} className="flex items-center gap-3 text-xs text-white/30">
                                <MinusCircle className="h-4 w-4 text-red-500/30 shrink-0" />
                                {text}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Aurum */}
                <div className="bg-cima-gold/5 border-2 border-cima-gold/30 rounded-[30px] md:rounded-[50px] p-8 md:p-16 relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(200,169,110,0.15)]">
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-cima-gold/20 blur-[100px] rounded-full" />
                    <div className="absolute top-6 right-8 bg-cima-gold text-black text-[9px] font-black uppercase tracking-widest py-1.5 px-4 rounded-full shadow-lg shadow-cima-gold/20">
                        El Nuevo Estándar
                    </div>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-12 w-12 rounded-2xl bg-cima-gold flex items-center justify-center shadow-lg shadow-cima-gold/30">
                            <Zap className="h-6 w-6 text-black" />
                        </div>
                        <div>
                            <h4 className="text-2xl md:text-3xl font-heading font-black text-white">Aurum</h4>
                            <p className="text-cima-gold font-mono text-[10px] uppercase tracking-widest">Plataforma Personal</p>
                        </div>
                    </div>
                    <ul className="space-y-5 mb-10">
                        {[
                            { t: "Impacto Visual de Élite", d: "Diseño que justifica tu comisión de inmediato." },
                            { t: "Portal Propietario Nativo", d: "Transparencia que elimina la ansiedad del dueño." },
                            { t: "Ficha PDF en 12 segundos", d: "Sin Word, sin Canva, sin perder tiempo." },
                            { t: "Dashboard de Leads y Pipeline", d: "Nunca más pierdas un prospecto en un chat." },
                        ].map((item, i) => (
                            <motion.li
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex gap-4"
                            >
                                <div className="h-6 w-6 rounded-full bg-cima-gold/20 border border-cima-gold/30 flex items-center justify-center shrink-0">
                                    <Check className="h-3 w-3 text-cima-gold" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">{item.t}</p>
                                    <p className="text-[11px] text-white/50">{item.d}</p>
                                </div>
                            </motion.li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Micro comparison table */}
            <div className="rounded-[32px] border border-white/5 overflow-hidden bg-white/[0.01]">
                <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
                    {[
                        { l: "Despliegue", t: "3 Meses", c: "7 Días" },
                        { l: "Estética", t: "Genérica", c: "Ultra-Lujo" },
                        { l: "Portal Dueño", t: "No incluye", c: "Nativo" },
                        { l: "Soporte", t: "Tickets", c: "Personal VIP" },
                    ].map((item, i) => (
                        <div key={i} className="p-6 md:p-8 text-center space-y-2">
                            <p className="text-[9px] uppercase font-bold text-white/20 tracking-[0.2em]">{item.l}</p>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] text-white/20 line-through italic">{item.t}</span>
                                <span className="text-sm md:text-base font-black text-cima-gold italic">{item.c}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Features data ─────────────────────────────────────────────────────────
const FEATURES = [
    { icon: Layout, title: "Portal Propietario 24/7", desc: "Tu cliente ve visitas, feedback y avances en tiempo real. Elimina el '¿cómo va mi casa?' para siempre." },
    { icon: FileText, title: "Fichas PDF Ultra-Lujo", desc: "Generadas en segundos con tu marca. El asesor de al lado sigue en Word. Tú ya no." },
    { icon: BarChart3, title: "Dashboard de Exclusivas", desc: "Visualiza todo tu pipeline, leads y comisiones desde un solo panel. Como agencia de $10M." },
    { icon: Zap, title: "Despliegue en 7 Días", desc: "Tu plataforma lista, configurada y operativa antes de que termines la semana. Sin sorpresas." },
];

// ─── BOOKING FORM ──────────────────────────────────────────────────────────
function BookingForm() {
    const [form, setForm] = useState({ nombre: "", telefono: "", email: "", agencia: "" });
    const [submitted, setSubmitted] = useState(false);
    const [referredBy, setReferredBy] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const ref = params.get("ref");
        if (ref) setReferredBy(ref);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        const msg = `Hola, me interesa la demo gratuita de Aurum 🏠\n\n*Nombre:* ${form.nombre}\n*Teléfono:* ${form.telefono}\n*Email:* ${form.email}\n*Agencia/Zona:* ${form.agencia || "Independiente"}${referredBy ? `\n*Referido por:* ${referredBy}` : ""}\n\n¿Cuándo podemos agendar?`;
        window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
    };

    if (submitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 px-6"
            >
                <div className="h-16 w-16 rounded-full bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center mx-auto mb-6">
                    <Check className="h-8 w-8 text-cima-gold" />
                </div>
                <h3 className="text-2xl font-heading font-black text-white mb-3">
                    ¡Listo, {form.nombre.split(" ")[0]}!
                </h3>
                <p className="text-white/50 text-sm leading-relaxed max-w-sm mx-auto mb-6">
                    Revisamos tu información y te contactamos en{" "}
                    <span className="text-cima-gold font-bold">menos de 2 horas</span>{" "}
                    por WhatsApp para confirmar tu demo.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cima-gold/10 border border-cima-gold/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-cima-gold animate-pulse" />
                    <span className="text-[10px] font-mono text-cima-gold uppercase tracking-widest">Demo confirmada pendiente</span>
                </div>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5 p-6 md:p-10">
            <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-heading font-black text-white mb-2">
                    Agenda tu Demo Gratuita
                </h3>
                <p className="text-white/40 text-sm">
                    15 minutos. Sin compromisos. Solo 3 cupos/mes en MTY.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                    { id: "nombre", label: "Nombre completo", type: "text", placeholder: "Ej. Roberto García", required: true },
                    { id: "telefono", label: "WhatsApp", type: "tel", placeholder: "81 1234 5678", required: true },
                ].map(f => (
                    <div key={f.id}>
                        <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">{f.label}</label>
                        <input
                            type={f.type}
                            placeholder={f.placeholder}
                            required={f.required}
                            value={form[f.id as keyof typeof form]}
                            onChange={e => setForm(prev => ({ ...prev, [f.id]: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:border-cima-gold/40 focus:bg-white/[0.07] transition-all outline-none"
                        />
                    </div>
                ))}
            </div>

            {[
                { id: "email", label: "Correo electrónico (opcional)", type: "email", placeholder: "tu@correo.com", required: false },
                { id: "agencia", label: "Agencia o zona (opcional)", type: "text", placeholder: "Ej. San Pedro, independiente, ERA...", required: false },
            ].map(f => (
                <div key={f.id}>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-white/30 mb-2">{f.label}</label>
                    <input
                        type={f.type}
                        placeholder={f.placeholder}
                        required={f.required}
                        value={form[f.id as keyof typeof form]}
                        onChange={e => setForm(prev => ({ ...prev, [f.id]: e.target.value }))}
                        className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-white placeholder-white/15 focus:border-cima-gold/30 focus:bg-white/[0.05] transition-all outline-none"
                    />
                </div>
            ))}

            {/* "¿Qué pasa después?" mini-steps */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-2.5">
                <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.25em] mb-3">¿Qué pasa después?</p>
                {[
                    { icon: PhoneCall,    text: "Te llamamos en menos de 2 horas" },
                    { icon: CalendarCheck, text: "Agendamos tu demo de 15 minutos" },
                    { icon: Monitor,      text: "Ves la plataforma con tus propiedades" },
                ].map((s, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div className="h-6 w-6 rounded-full bg-cima-gold/10 border border-cima-gold/20 flex items-center justify-center shrink-0">
                            <s.icon className="h-3 w-3 text-cima-gold" />
                        </div>
                        <p className="text-[11px] text-white/50">{s.text}</p>
                    </div>
                ))}
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-3">
                <div className="flex -space-x-1.5">
                    {["CR", "LM", "DV"].map((init, i) => (
                        <div key={i} className="h-6 w-6 rounded-full bg-gradient-to-br from-cima-gold/30 to-cima-gold/10 border border-cima-gold/30 flex items-center justify-center text-[6px] font-black text-cima-gold">
                            {init}
                        </div>
                    ))}
                </div>
                <span className="text-[11px] text-white/25 font-mono">
                    <span className="text-cima-gold font-bold">7</span> asesores agendaron esta semana
                </span>
            </div>

            <button
                type="submit"
                className="w-full py-5 bg-cima-gold text-black rounded-2xl font-heading font-black text-xs uppercase tracking-widest text-center shadow-[0_20px_40px_-15px_rgba(200,169,110,0.4)] hover:scale-[1.02] hover:bg-white transition-all flex items-center justify-center gap-3 group/btn"
            >
                Agendar mi Demo Gratis
                <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>

            {/* WhatsApp alternative */}
            <div className="relative flex items-center gap-3 py-1">
                <div className="flex-1 h-px bg-white/5" />
                <span className="text-[9px] text-white/20 uppercase tracking-widest font-bold">o si prefieres</span>
                <div className="flex-1 h-px bg-white/5" />
            </div>
            <a
                href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hola, quiero información sobre la demo de Aurum para asesores inmobiliarios 🏠")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] rounded-2xl font-heading font-black text-xs uppercase tracking-widest text-center hover:bg-[#25D366]/20 transition-all flex items-center justify-center gap-3"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                Escribir por WhatsApp
            </a>

            <div className="flex items-center justify-center gap-6 pt-1">
                {["Sin compromiso", "15 minutos", "Respuesta en 2h"].map(t => (
                    <span key={t} className="flex items-center gap-1.5 text-[9px] font-bold text-white/20 uppercase tracking-wide">
                        <Check className="h-3 w-3 text-cima-gold/50" /> {t}
                    </span>
                ))}
            </div>
        </form>
    );
}

// ─── Exit Intent Modal ─────────────────────────────────────────────────────
function ExitIntentModal({ onClose, onCTA }: { onClose: () => void; onCTA: () => void }) {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] flex items-center justify-center p-4"
                style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: "spring", damping: 20 }}
                    onClick={e => e.stopPropagation()}
                    className="bg-[#0F1116] border border-cima-gold/30 rounded-[32px] p-8 md:p-12 max-w-md w-full relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(200,169,110,0.2)]"
                >
                    <div className="absolute -top-16 -right-16 w-48 h-48 bg-cima-gold/15 blur-[80px] rounded-full pointer-events-none" />
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
                    >
                        <X className="h-3.5 w-3.5 text-white/50" />
                    </button>

                    <div className="relative z-10">
                        <div className="text-3xl mb-4">⚡</div>
                        <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-[0.3em] mb-3 block">
                            Espera un momento
                        </span>
                        <h3 className="text-2xl md:text-3xl font-heading font-black text-white mb-3 leading-tight">
                            ¿Ya sabías que el 90% de tus competidores no tiene esto?
                        </h3>
                        <p className="text-white/50 text-sm leading-relaxed mb-8">
                            Una demo de 15 minutos puede cambiar cómo presentas exclusivas esta semana. Sin costo, sin compromisos.
                        </p>
                        <button
                            onClick={() => { onClose(); onCTA(); }}
                            className="w-full py-4 bg-cima-gold text-black rounded-2xl font-heading font-black text-xs uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-3 mb-3 shadow-[0_15px_30px_-10px_rgba(200,169,110,0.4)]"
                        >
                            Ver la Demo Gratis <ArrowRight className="h-4 w-4" />
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full text-center text-[10px] text-white/20 hover:text-white/40 transition-colors py-2"
                        >
                            No, prefiero seguir perdiendo exclusivas
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

// ─── PAGE ──────────────────────────────────────────────────────────────────
export default function AgendaPage() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [showExitIntent, setShowExitIntent] = useState(false);
    const exitShown = React.useRef(false);

    const scrollToForm = () => {
        document.getElementById("form-section")?.scrollIntoView({ behavior: "smooth" });
    };

    // Exit intent: desktop = mouse leaves top, mobile = 45s timer
    useEffect(() => {
        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0 && !exitShown.current) {
                exitShown.current = true;
                setShowExitIntent(true);
            }
        };
        document.addEventListener("mouseleave", handleMouseLeave);

        const mobileTimer = setTimeout(() => {
            if (!exitShown.current && window.innerWidth < 768) {
                exitShown.current = true;
                setShowExitIntent(true);
            }
        }, 45000);

        return () => {
            document.removeEventListener("mouseleave", handleMouseLeave);
            clearTimeout(mobileTimer);
        };
    }, []);

    return (
        <>
        {showExitIntent && (
            <ExitIntentModal
                onClose={() => setShowExitIntent(false)}
                onCTA={() => { setShowExitIntent(false); scrollToForm(); }}
            />
        )}

        {/* Sticky mobile CTA */}
        <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden p-3 bg-[#0A0A0B]/95 backdrop-blur-xl border-t border-white/10 flex gap-2">
            <button
                onClick={scrollToForm}
                className="flex-1 py-3.5 bg-cima-gold text-black rounded-xl font-heading font-black text-[11px] uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-2"
            >
                Agenda Demo Gratis <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <a
                href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hola, quiero info sobre Aurum 🏠")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-12 w-12 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 flex items-center justify-center shrink-0"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            </a>
        </div>

        <div
            onMouseMove={e => setMousePos({ x: e.clientX, y: e.clientY })}
            className="min-h-screen bg-[#0A0A0B] text-white selection:bg-cima-gold/30 scroll-smooth relative overflow-x-hidden pb-20 md:pb-0"
        >
            {/* Searchlight */}
            <div
                className="pointer-events-none fixed inset-0 z-30 transition-opacity opacity-0 md:opacity-100"
                style={{ background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(200, 169, 110, 0.03), transparent 80%)` }}
            />

            <LiveActivityFeed />

            {/* ─── NAV ─── */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-xl bg-black/20">
                <div className="mx-auto max-w-7xl h-16 px-4 md:px-6 flex items-center justify-between">
                    <div className="flex items-center">
                        <img src="/aurum-logo-horizontal.png" alt="Aurum" className="h-8 md:h-9 w-auto shrink-0" />
                    </div>
                    <div className="flex items-center gap-3 md:gap-4">
                        <span className="hidden lg:flex items-center gap-2 text-[10px] font-mono text-white/40 uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            Solo 3 demos disponibles este mes
                        </span>
                        <button
                            onClick={scrollToForm}
                            className="flex items-center gap-1 md:gap-2 bg-cima-gold text-black px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[10px] md:text-xs font-black uppercase tracking-tight hover:bg-white transition-all shadow-lg shadow-cima-gold/10"
                        >
                            Agenda tu Demo
                        </button>
                    </div>
                </div>
            </nav>

            {/* ─── HERO ─── */}
            <section className="relative pt-32 md:pt-40 pb-16 md:pb-24 px-4 md:px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full md:w-[1000px] h-[400px] md:h-[600px] bg-cima-gold/5 blur-[80px] md:blur-[120px] rounded-full pointer-events-none" />

                <div className="relative mx-auto max-w-5xl text-center">
                    <FadeIn>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 md:mb-8 relative overflow-hidden group">
                            <ShieldAlert className="h-3.5 w-3.5 text-cima-gold shrink-0" />
                            <span className="text-[9px] md:text-[10px] font-mono tracking-[0.15em] md:tracking-[0.2em] uppercase text-cima-gold">
                                Solo para Asesores en Monterrey · Cupos limitados
                            </span>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.1}>
                        <h1 className="text-3xl md:text-5xl lg:text-7xl font-heading font-bold tracking-tight mb-6 md:mb-8 leading-[1.1]">
                            ¿Cuántas exclusivas perdiste porque{" "}
                            <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cima-gold via-white to-cima-gold-light">
                                tu competencia se ve más profesional?
                            </span>
                        </h1>
                    </FadeIn>

                    <FadeIn delay={0.2}>
                        <p className="text-sm md:text-lg lg:text-xl text-white/60 max-w-3xl mx-auto mb-10 md:mb-12 leading-relaxed">
                            Aurum convierte tu gestión en la plataforma más sofisticada de Monterrey.{" "}
                            <span className="text-white font-medium">En 7 días. Sin código. Sin complicaciones.</span>
                        </p>
                    </FadeIn>

                    {/* VSL placeholder */}
                    <FadeIn delay={0.3}>
                        <div className="relative mx-auto max-w-2xl mb-10 md:mb-12 rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 bg-[#0A0A0B] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] group cursor-pointer">
                            <div className="aspect-[16/9] relative">
                                {/* Scanline effect */}
                                <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.015)_2px,rgba(255,255,255,0.015)_4px)] pointer-events-none z-10" />
                                {/* Grid */}
                                <div className="absolute inset-0 opacity-30"
                                    style={{ backgroundImage: "linear-gradient(rgba(200,169,110,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(200,169,110,0.05) 1px, transparent 1px)", backgroundSize: "40px 40px" }}
                                />
                                {/* Ambient glow */}
                                <div className="absolute inset-0 bg-gradient-to-br from-cima-gold/5 via-transparent to-transparent" />

                                {/* Center */}
                                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-5">
                                    <motion.div
                                        animate={{ y: [0, -8, 0] }}
                                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                        className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-cima-gold/10 border-2 border-cima-gold/30 flex items-center justify-center backdrop-blur-md shadow-xl shadow-cima-gold/10 group-hover:bg-cima-gold/20 group-hover:border-cima-gold/60 transition-all"
                                    >
                                        <div className="h-0 w-0 border-t-[9px] border-b-[9px] border-l-[16px] border-transparent border-l-cima-gold ml-1" />
                                    </motion.div>
                                    <div className="text-center">
                                        <p className="font-heading font-bold text-sm md:text-base text-white">Video de presentación · 2:47 min</p>
                                        <p className="text-xs text-white/40 mt-1">Mira cómo los asesores duplican sus exclusivas</p>
                                    </div>
                                </div>

                                {/* Badge */}
                                <div className="absolute top-4 left-4 z-30 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                                    <span className="w-1.5 h-1.5 rounded-full bg-cima-gold animate-pulse" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white">Demo real</span>
                                </div>
                                <div className="absolute top-4 right-4 z-30 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                                    <span className="text-[9px] font-mono text-white/60">2:47</span>
                                </div>
                            </div>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.4}>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 mb-8">
                            <button
                                onClick={scrollToForm}
                                className="w-full sm:w-auto px-8 py-4 md:px-10 md:py-5 bg-cima-gold text-black font-heading font-bold rounded-xl md:rounded-2xl hover:scale-105 transition-all shadow-[0_15px_30px_-10px_rgba(200,169,110,0.3)] relative group overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                <span className="relative z-10 text-xs md:text-sm uppercase tracking-widest">Quiero mi Demo Gratis →</span>
                            </button>
                            <a
                                href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hola, quiero agendar mi demo de Aurum para asesores en Monterrey 🏠")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto px-8 py-4 md:px-10 md:py-5 bg-[#25D366]/10 border border-[#25D366]/40 text-[#25D366] font-heading font-bold rounded-xl md:rounded-2xl hover:bg-[#25D366]/20 transition-all text-[10px] md:text-sm uppercase tracking-widest flex items-center justify-center gap-3"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                                WhatsApp
                            </a>
                            <a
                                href="#roi"
                                className="w-full sm:w-auto px-8 py-4 md:px-10 md:py-5 bg-white/5 border border-white/10 font-heading font-bold rounded-xl md:rounded-2xl hover:bg-white/10 transition-all text-[10px] md:text-sm uppercase tracking-widest"
                            >
                                Calcular mi ROI
                            </a>
                        </div>
                        <div className="flex items-center justify-center gap-6 flex-wrap">
                            {["✓ Sin compromiso", "✓ 15 minutos", "✓ Solo 3 cupos/mes en MTY"].map(t => (
                                <span key={t} className="text-[11px] text-white/25 font-mono">{t}</span>
                            ))}
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* ─── SUCCESS METRICS ─── */}
            <section className="py-12 md:py-16 px-4 md:px-6 bg-black relative">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                <div className="mx-auto max-w-6xl">
                    <SuccessMetrics />
                </div>
            </section>

            {/* ─── PAIN SECTION ─── */}
            <section className="py-16 md:py-24 px-4 md:px-6 border-y border-white/5 bg-[#070708]">
                <div className="mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <FadeIn direction="right">
                            <h2 className="text-2xl md:text-4xl lg:text-5xl font-heading font-bold mb-6 md:mb-8 leading-tight">
                                Por qué los propietarios{" "}
                                <br className="hidden md:block" />
                                <span className="text-white/40 italic font-medium text-xl md:text-3xl lg:text-4xl">
                                    dicen que no a otros asesores...
                                </span>
                            </h2>
                            <p className="text-white/50 text-base md:text-lg mb-8 md:mb-10">
                                Enviar un PDF por WhatsApp ya no es suficiente. El propietario de hoy busca certeza, diseño y transparencia.
                            </p>
                            <div className="space-y-4 md:space-y-6">
                                {[
                                    { p: "Portafolio genérico, igual que el de todos", s: "Plataforma de ultra-lujo con tu marca" },
                                    { p: "Sin reportes de avance al propietario", s: "Portal propietario 24/7 en tiempo real" },
                                    { p: "Seguimiento manual y leads que se enfrían", s: "Dashboard automático de leads y pipeline" },
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/[0.02] border border-white/5">
                                        <div className="flex items-center gap-3 flex-1 w-full">
                                            <div className="p-1.5 bg-red-500/10 rounded-lg shrink-0">
                                                <X className="h-3.5 w-3.5 text-red-500/50" />
                                            </div>
                                            <span className="text-[10px] md:text-xs text-white/40 line-through min-w-0">{item.p}</span>
                                        </div>
                                        <ArrowRight className="h-3 w-3 text-white/20 hidden sm:block shrink-0" />
                                        <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                                            <div className="p-1.5 bg-cima-gold/10 rounded-lg shrink-0">
                                                <CheckCircle2 className="h-3.5 w-3.5 text-cima-gold" />
                                            </div>
                                            <span className="text-[10px] md:text-xs text-cima-gold font-bold">{item.s}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </FadeIn>

                        <FadeIn direction="left">
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-cima-gold/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full pointer-events-none" />
                                <div className="relative bg-white/[0.03] border border-white/10 rounded-3xl md:rounded-[40px] p-8 md:p-12 backdrop-blur-md">
                                    <Smartphone className="h-8 w-8 md:h-10 md:w-10 text-cima-gold mb-6 md:mb-8" />
                                    <h3 className="text-xl md:text-2xl font-heading font-bold mb-4 md:mb-6 leading-tight">
                                        "El 73% de los propietarios eligen al asesor que les ofrece seguimiento digital."
                                    </h3>
                                    <p className="text-white/40 text-xs italic mb-10">
                                        — Reporte de Tendencias Inmobiliarias 2025
                                    </p>
                                    <div className="pt-8 border-t border-white/10">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-cima-gold/20 flex items-center justify-center shrink-0">
                                                <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-cima-gold" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-white text-[10px] md:text-sm">Aumento en exclusivas</p>
                                                <p className="text-cima-gold font-mono text-lg md:text-xl font-black">+42%</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* ─── FEATURES BENTO ─── */}
            <section className="py-16 md:py-24 px-4 md:px-6 bg-[#070708]">
                <div className="mx-auto max-w-6xl">
                    <div className="text-center mb-16 md:mb-20">
                        <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-[0.4em] mb-4 block">La solución</span>
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-heading font-bold mb-4 tracking-tight">
                            Tu plataforma personal de exclusivas
                        </h2>
                        <p className="text-white/40 text-sm md:text-base max-w-2xl mx-auto">
                            Todo lo que necesitas para parecer la agencia más avanzada de Monterrey — desde el día uno.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {FEATURES.map((f, i) => (
                            <FadeIn key={f.title} delay={i * 0.1}>
                                <TiltCard className="h-full">
                                    <div className="h-full bg-white/[0.02] border border-white/5 p-6 md:p-10 rounded-2xl md:rounded-[32px] hover:border-cima-gold/40 transition-all group flex flex-col items-center text-center">
                                        <div className="h-12 w-12 md:h-16 md:w-16 rounded-xl md:rounded-2xl bg-cima-gold/10 border border-cima-gold/20 flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 group-hover:bg-cima-gold/20 transition-all duration-500 shadow-xl shadow-cima-gold/5 shrink-0">
                                            <f.icon className="h-6 w-6 md:h-8 md:w-8 text-cima-gold" />
                                        </div>
                                        <h3 className="text-lg md:text-xl font-heading font-bold mb-3 md:mb-4 tracking-tight">{f.title}</h3>
                                        <p className="text-[11px] md:text-sm text-white/50 leading-relaxed font-medium">{f.desc}</p>
                                    </div>
                                </TiltCard>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── ADMIN MOCKUP ─── */}
            <section className="py-16 md:py-24 px-4 md:px-6 relative overflow-hidden bg-[#050507]">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
                <div className="mx-auto max-w-6xl">
                    <FadeIn>
                        <div className="text-center mb-12 md:mb-16">
                            <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-[0.4em] mb-4 block">Vista real de la plataforma</span>
                            <h2 className="text-2xl md:text-4xl lg:text-5xl font-heading font-bold mb-4 tracking-tight">
                                Tu negocio completo en un solo panel
                            </h2>
                            <p className="text-white/40 text-sm md:text-base max-w-2xl mx-auto">
                                Exclusivas activas, leads, comisiones y actividad de propietarios — todo desde tu pantalla.
                            </p>
                        </div>
                    </FadeIn>
                    <FadeIn delay={0.2}>
                        <AdminDashboardPreview />
                    </FadeIn>
                </div>
            </section>

            {/* ─── COMPARISON ─── */}
            <section className="py-16 md:py-24 px-4 md:px-6 relative">
                <div className="mx-auto max-w-6xl">
                    <div className="text-center mb-16 md:mb-24">
                        <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-[0.4em] mb-4 block">Análisis de Mercado</span>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading font-black mb-6 tracking-tight">
                            El Nuevo Estándar vs{" "}
                            <br className="hidden md:block" />
                            <span className="text-white/20">Lo Tradicional</span>
                        </h2>
                        <p className="text-white/40 text-sm md:text-lg max-w-2xl mx-auto">
                            No es solo otro software. Es una categoría diferente de tecnología inmobiliaria.
                        </p>
                    </div>
                    <ComparisonSection />
                </div>
            </section>

            {/* ─── PORTAL PREVIEW ─── */}
            <section className="py-16 md:py-24 px-4 md:px-6 relative overflow-hidden">
                <div className="mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <FadeIn direction="right">
                            <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-[0.4em] mb-4 block">Lo que ven tus clientes</span>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-black mb-4 md:mb-6 tracking-tight">
                                La herramienta que cierra exclusivas <span className="text-cima-gold">antes de la primera visita</span>
                            </h2>
                            <p className="text-white/60 text-sm md:text-lg mb-6 md:mb-8 leading-relaxed">
                                En la primera presentación abres el portal en tu celular y se lo muestras al propietario. En ese momento ya ganaste la exclusiva — antes de salir de la reunión.
                            </p>

                            {/* Mini stat */}
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-cima-gold/5 border border-cima-gold/15 mb-8">
                                <div className="h-10 w-10 rounded-xl bg-cima-gold/15 flex items-center justify-center shrink-0">
                                    <TrendingUp className="h-5 w-5 text-cima-gold" />
                                </div>
                                <div>
                                    <p className="text-cima-gold font-mono text-xl font-black">73%</p>
                                    <p className="text-white/50 text-xs leading-tight">de propietarios elige al asesor que muestra seguimiento digital en la primera reunión</p>
                                </div>
                            </div>

                            <ul className="space-y-4 md:space-y-5 mb-10">
                                {[
                                    { t: "Portal en vivo desde el día 1", d: "Tu propietario entra con su link privado y ve visitas, leads y avances en tiempo real.", icon: Users },
                                    { t: "Feedback con sentimiento IA", d: "Cada visita genera un reporte. Datos reales para defender o ajustar el precio.", icon: BarChart3 },
                                    { t: "Ficha PDF lista en 12 segundos", d: "Con tu nombre, tu logo y la propiedad formateada. Sin Word, sin Canva, sin esperar.", icon: FileText },
                                    { t: "Pipeline de exclusivas en un panel", d: "Captando / En visitas / En cierre. Tu negocio completo visible desde el celular.", icon: Target },
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-4 group items-start">
                                        <div className="h-8 w-8 md:h-9 md:w-9 rounded-lg md:rounded-xl bg-cima-gold/10 border border-cima-gold/20 flex items-center justify-center group-hover:bg-cima-gold/20 transition-all shrink-0 mt-0.5">
                                            <item.icon className="h-3.5 w-3.5 md:h-4 md:w-4 text-cima-gold" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-white text-xs md:text-sm">{item.t}</p>
                                            <p className="text-white/40 text-[10px] md:text-xs mt-0.5 leading-relaxed">{item.d}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={scrollToForm}
                                className="group bg-cima-gold text-black px-6 py-4 rounded-full font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:bg-white transition-all shadow-[0_20px_40px_rgba(200,169,110,0.2)]"
                            >
                                Ver la Demo en Vivo <Rocket className="h-4 w-4" />
                            </button>
                        </FadeIn>

                        <FadeIn direction="left" className="w-full">
                            {/* Floating notification */}
                            <div className="relative">
                                <motion.div
                                    animate={{ y: [0, -6, 0] }}
                                    transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                                    className="absolute -top-4 -right-2 z-20 flex items-center gap-2 bg-[#0F1116]/90 backdrop-blur-md border border-green-500/30 rounded-full px-3 py-1.5 shadow-lg shadow-green-500/10"
                                >
                                    <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                                    <span className="text-[9px] font-bold text-green-400 uppercase tracking-widest whitespace-nowrap">Portal activo · En vivo</span>
                                </motion.div>

                                {/* Gold glow behind card */}
                                <div className="absolute -inset-2 bg-cima-gold/5 blur-2xl rounded-[40px] pointer-events-none" />

                                <PortalPreview />

                                {/* Bottom badge */}
                                <div className="flex items-center justify-center gap-2 mt-4">
                                    <Globe className="h-3 w-3 text-white/20" />
                                    <span className="text-[9px] text-white/20 font-mono">Vista real de la plataforma · Sin ediciones</span>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* ─── ROI CALCULATOR ─── */}
            <section id="roi" className="py-16 md:py-24 px-4 md:px-6 relative bg-[#070708]">
                <div className="mx-auto max-w-6xl">
                    <RoiCalculator />
                </div>
            </section>

            {/* ─── TESTIMONIALS ─── */}
            <section className="py-16 md:py-24 px-4 md:px-6 relative">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cima-gold/10 to-transparent" />
                <div className="mx-auto max-w-6xl">
                    <div className="text-center mb-12 md:mb-16">
                        <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-[0.4em] mb-4 block">Resultados reales</span>
                        <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4 tracking-tight">
                            Asesores que ya lo usan en Monterrey
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { initials: "CR", name: "Carlos R.", role: "Asesor independiente · San Pedro", quote: "Cerré 2 exclusivas nuevas en mi primer mes. Los propietarios dicen que soy el asesor más profesional que han conocido.", result: "+2 exclusivas en 30 días" },
                            { initials: "LM", name: "Laura M.", role: "Agente independiente · Cumbres", quote: "Antes yo perseguía clientes. Ahora los propietarios me buscan a mí porque les muestro el portal desde la primera presentación.", result: "3× más referidos" },
                            { initials: "DV", name: "Diego V.", role: "ERA Inmobiliaria · Monterrey Centro", quote: "Mi conversión en presentaciones subió 40%. La ficha PDF sola ya valió la inversión desde la primera semana.", result: "40% más cierres" },
                        ].map((t, i) => (
                            <FadeIn key={i} delay={i * 0.1}>
                                <div className="bg-white/[0.02] border border-white/5 rounded-[24px] p-6 md:p-8 relative overflow-hidden group hover:border-cima-gold/20 transition-all h-full">
                                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cima-gold/30 to-transparent" />
                                    <div className="flex items-center gap-0.5 mb-3">
                                        {[...Array(5)].map((_, si) => (
                                            <Star key={si} className="h-3.5 w-3.5 text-cima-gold" fill="currentColor" />
                                        ))}
                                    </div>
                                    <div className="text-4xl text-white/10 font-serif leading-none mb-3">"</div>
                                    <p className="text-sm text-white/70 leading-relaxed mb-6 italic">{t.quote}</p>
                                    <div className="inline-flex items-center gap-2 bg-green-500/5 border border-green-500/15 rounded-full px-3 py-1.5 mb-6">
                                        <TrendingUp className="h-3 w-3 text-green-400" />
                                        <span className="text-[11px] text-green-400 font-bold">{t.result}</span>
                                    </div>
                                    <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cima-gold to-cima-gold-dim flex items-center justify-center font-heading font-black text-sm text-black shrink-0">
                                            {t.initials}
                                        </div>
                                        <div>
                                            <p className="font-heading font-bold text-sm text-white">{t.name}</p>
                                            <p className="text-[10px] text-white/30">{t.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── HOW IT WORKS ─── */}
            <section className="py-16 md:py-24 px-4 md:px-6 bg-[#070708] relative">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                <div className="mx-auto max-w-6xl">
                    <div className="text-center mb-12 md:mb-20">
                        <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4 tracking-tight">De Cero a Pro en 7 Días</h2>
                        <p className="text-white/40 text-sm md:text-base">Fricción eliminada. Resultados desde la primera semana.</p>
                    </div>
                    <div className="relative py-12 md:py-20">
                        <div className="absolute top-0 bottom-0 left-[2.5rem] md:left-1/2 -translate-x-[0.5px] md:-translate-x-1/2 w-[1px] bg-white/10" />
                        <div className="space-y-16 md:space-y-24">
                            {[
                                { step: "01", title: "Agenda tu Demo Gratuita", desc: "15 minutos por videollamada. Te mostramos la plataforma con propiedades reales de Monterrey.", icon: MousePointer2 },
                                { step: "02", title: "Recibe tu Plataforma en 7 Días", desc: "Configuramos todo: tu branding, primeras propiedades y portal listo para mostrar a clientes.", icon: Rocket },
                                { step: "03", title: "Cierra Exclusivas con Ventaja", desc: "Llega a tus presentaciones con herramientas que ningún otro asesor en tu zona tiene.", icon: Target },
                            ].map((item, i) => (
                                <div key={item.step} className={`relative flex flex-col md:flex-row gap-6 md:gap-12 items-start md:items-center ${i % 2 !== 0 ? "md:flex-row-reverse" : ""}`}>
                                    <div className="hidden md:block flex-1 text-center md:text-right">
                                        {i % 2 === 0 ? (
                                            <>
                                                <h4 className="text-xl lg:text-2xl font-heading font-black mb-4">{item.title}</h4>
                                                <p className="text-white/40 text-xs lg:text-sm max-w-sm ml-auto">{item.desc}</p>
                                            </>
                                        ) : (
                                            <div className="h-28 lg:h-32 w-28 lg:w-32 rounded-2xl lg:rounded-3xl bg-white/[0.02] border border-white/10 flex items-center justify-center ml-auto">
                                                <item.icon className="h-10 lg:h-12 w-10 lg:w-12 text-cima-gold/50" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="relative z-10 flex ml-4 md:ml-0 items-center justify-center shrink-0">
                                        <div className="h-12 w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 rounded-full bg-cima-card border-2 border-cima-gold flex items-center justify-center shadow-2xl shadow-cima-gold/20">
                                            <span className="text-cima-gold text-sm md:text-base font-mono font-black">{item.step}</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 text-left ml-4 md:ml-0">
                                        <div className="md:hidden flex items-center gap-4 mb-4">
                                            <div className="h-10 w-10 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-center">
                                                <item.icon className="h-5 w-5 text-cima-gold/50" />
                                            </div>
                                            <h4 className="text-lg font-heading font-black">{item.title}</h4>
                                        </div>
                                        <div className="hidden md:block">
                                            {i % 2 !== 0 ? (
                                                <>
                                                    <h4 className="text-xl lg:text-2xl font-heading font-black mb-4">{item.title}</h4>
                                                    <p className="text-white/40 text-xs lg:text-sm max-w-sm">{item.desc}</p>
                                                </>
                                            ) : (
                                                <div className="h-28 lg:h-32 w-28 lg:w-32 rounded-2xl lg:rounded-3xl bg-white/[0.02] border border-white/10 flex items-center justify-center mr-auto">
                                                    <item.icon className="h-10 lg:h-12 w-10 lg:w-12 text-cima-gold/50" />
                                                </div>
                                            )}
                                        </div>
                                        <p className="md:hidden text-white/40 text-[11px] leading-relaxed max-w-xs">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── FORM SECTION ─── */}
            <section id="form-section" className="py-16 md:py-24 px-4 md:px-6 relative bg-[#070708]">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cima-gold/10 to-transparent" />
                <div className="mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                        {/* Left: urgency + trust */}
                        <FadeIn direction="right">
                            <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-[0.4em] mb-4 block">Agenda tu Demo</span>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-black mb-6 tracking-tight">
                                El próximo asesor en crecer eres tú.
                            </h2>
                            <p className="text-white/50 text-sm md:text-lg leading-relaxed mb-10">
                                Solo aceptamos 3 nuevos asesores por mes en Monterrey para garantizar un onboarding de calidad. Si estás viendo esto, aún hay cupos.
                            </p>

                            {/* Countdown */}
                            <div className="mb-10">
                                <CountdownTimer />
                            </div>

                            {/* Trust signals */}
                            <ul className="space-y-4">
                                {[
                                    { t: "Demo personalizada en vivo", d: "Te mostramos la plataforma con propiedades reales de tu zona." },
                                    { t: "Sin contratos de permanencia", d: "Mes a mes. Cancela cuando quieras, sin preguntas." },
                                    { t: "Garantía 30 días", d: "Si no ves resultados en 30 días, te devolvemos tu inversión." },
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-4">
                                        <div className="h-6 w-6 rounded-full bg-cima-gold/20 border border-cima-gold/30 flex items-center justify-center shrink-0 mt-0.5">
                                            <Check className="h-3 w-3 text-cima-gold" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white">{item.t}</p>
                                            <p className="text-[11px] text-white/40 mt-0.5">{item.d}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </FadeIn>

                        {/* Right: Form */}
                        <FadeIn direction="left">
                            <div className="bg-cima-gold/5 border-2 border-cima-gold/30 rounded-[30px] md:rounded-[40px] overflow-hidden relative shadow-[0_40px_100px_-20px_rgba(200,169,110,0.15)]">
                                <div className="absolute -top-24 -right-24 w-64 h-64 bg-cima-gold/20 blur-[100px] rounded-full" />
                                <div className="relative z-10">
                                    <BookingForm />
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* ─── FAQ ─── */}
            <section className="py-16 md:py-24 px-4 md:px-6 relative border-y border-white/5">
                <div className="mx-auto max-w-6xl">
                    <div className="text-center mb-12 md:mb-16">
                        <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-[0.4em] mb-4 block">Resolviendo Dudas</span>
                        <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4 tracking-tight">Preguntas Frecuentes</h2>
                    </div>
                    <EliteFaq />

                    {/* Final CTA */}
                    <div className="text-center mt-16 md:mt-20">
                        <p className="text-white/30 text-sm mb-6">¿Tienes otra pregunta? La resolvemos en tu demo gratuita.</p>
                        <button
                            onClick={scrollToForm}
                            className="inline-flex items-center gap-3 px-10 py-5 bg-cima-gold text-black font-heading font-bold rounded-2xl hover:scale-105 transition-all shadow-[0_20px_40px_-15px_rgba(200,169,110,0.4)] text-xs md:text-sm uppercase tracking-widest"
                        >
                            Agendar mi Demo Gratuita
                            <ArrowRight className="h-4 w-4" />
                        </button>
                        <p className="text-[8px] text-white/20 font-mono uppercase tracking-widest mt-4">Sin contratos · Sin tarjeta de crédito · 15 minutos</p>
                    </div>
                </div>
            </section>

            {/* ─── FOOTER ─── */}
            <footer className="py-12 md:py-16 px-4 md:px-6 bg-black/40">
                <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-lg bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center">
                            <Building2 className="h-3.5 w-3.5 text-cima-gold" />
                        </div>
                        <span className="font-heading font-bold tracking-tight text-white/90 text-sm">
                            Aurum
                        </span>
                    </div>
                    <p className="text-[10px] text-white/20 font-mono uppercase tracking-widest text-center">
                        © 2025 Aurum · Monterrey, NL · Todos los derechos reservados
                    </p>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5">
                        <ShieldCheck className="h-3.5 w-3.5 text-cima-gold" />
                        <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Datos seguros SSL</span>
                    </div>
                </div>
            </footer>
        </div>
        </>
    );
}
