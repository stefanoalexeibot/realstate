"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    BarChart3, Users, Layout, Zap, ArrowRight, ShieldCheck,
    MessageSquare, Smartphone, Target, TrendingUp,
    ShieldAlert, CheckCircle2, X, Clock, Bell,
    Globe, Heart, ChevronDown, Check,
    MinusCircle, Rocket, MousePointer2, Key, Gem,
    FileText, Building2, DollarSign
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { MotionDiv } from "@/components/landing/motion-wrapper";
import TiltCard from "@/components/landing/tilt-card";
import FadeIn from "@/components/landing/fade-in";

// ─── Live Activity Feed ────────────────────────────────────────────────────
function LiveActivityFeed() {
    const activities = [
        { name: "Carlos R.", loc: "San Pedro", action: "agendó su demo gratuita", time: "hace 3 min" },
        { name: "Laura M.", loc: "Monterrey", action: "activó su portal de propietario", time: "hace 8 min" },
        { name: "Diego V.", loc: "Cumbres", action: "cerró exclusiva de $8.5M con Cima", time: "hace 15 min" },
        { name: "Ana P.", loc: "Valle", action: "captó mansión en San Agustín", time: "hace 20 min" },
        { name: "Marco S.", loc: "Garza García", action: "generó ficha técnica PDF en 12 seg", time: "hace 28 min" },
        { name: "Elena V.", loc: "Contry", action: "recibió 4 leads desde su portal", time: "hace 35 min" },
        { name: "Roberto G.", loc: "Santa Catarina", action: "firmó contrato de exclusiva vía Cima", time: "hace 40 min" },
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

// ─── Success Metrics ───────────────────────────────────────────────────────
function SuccessMetrics() {
    const metrics = [
        { label: "Asesores Activos", value: "+40", icon: Users },
        { label: "Entrega Garantizada", value: "7 días", icon: Clock },
        { label: "ROI Promedio", value: "12×", icon: TrendingUp },
        { label: "Satisfacción", value: "99%", icon: Heart },
    ];
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {metrics.map((m, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl text-center group hover:border-cima-gold/30 transition-all">
                    <div className="h-10 w-10 rounded-full bg-cima-gold/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <m.icon className="h-5 w-5 text-cima-gold" />
                    </div>
                    <p className="text-2xl font-black text-white mb-1">{m.value}</p>
                    <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{m.label}</p>
                </div>
            ))}
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
                        Ajusta el valor de tus propiedades y cuántas cierras al año. Ve cuántas veces recuperas tu inversión en Cima Pro.
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

// ─── Portal Preview (simplified tab) ──────────────────────────────────────
function PortalPreview() {
    const [tab, setTab] = useState(0);
    const tabs = [
        { label: "Portal Propietario", icon: Users },
        { label: "Seguimiento", icon: BarChart3 },
        { label: "Fichas PDF", icon: FileText },
    ];
    return (
        <div className="bg-white/[0.02] border border-white/10 rounded-[20px] md:rounded-[32px] overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-white/5 overflow-x-auto no-scrollbar">
                {tabs.map((t, i) => (
                    <button
                        key={i}
                        onClick={() => setTab(i)}
                        className={`flex items-center gap-2 px-5 md:px-8 py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${tab === i ? "text-cima-gold border-b-2 border-cima-gold bg-cima-gold/5" : "text-white/30 hover:text-white/60"}`}
                    >
                        <t.icon className="h-3.5 w-3.5" />
                        {t.label}
                    </button>
                ))}
            </div>
            {/* Content */}
            <div className="p-6 md:p-10 min-h-[280px]">
                <AnimatePresence mode="wait">
                    {tab === 0 && (
                        <motion.div key="0" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-[8px] font-black text-cima-gold uppercase tracking-widest mb-1">Mi Portal</p>
                                        <h5 className="text-sm font-bold text-white">Hola, PEDRO</h5>
                                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 font-bold uppercase mt-1 inline-block">● Exclusiva Activa</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[8px] text-white/30 uppercase font-bold">Precio</p>
                                        <p className="text-base font-black text-white">$4.2M</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 mb-4">
                                    {[{ l: "Visitas", v: "14" }, { l: "Leads", v: "3" }, { l: "Semana", v: "3/8" }].map((s, i) => (
                                        <div key={i} className="bg-white/5 border border-white/5 rounded-lg p-2 text-center">
                                            <p className="text-[7px] text-white/30 uppercase font-bold mb-0.5">{s.l}</p>
                                            <p className="text-xs font-black text-white">{s.v}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between p-2 rounded-lg bg-cima-gold/5 border border-cima-gold/10">
                                    <span className="text-[9px] font-bold text-white/60 uppercase">Plan de marketing activo</span>
                                    <ArrowRight className="h-3 w-3 text-cima-gold animate-pulse" />
                                </div>
                            </div>
                            <p className="text-xs text-white/30 text-center font-mono">Tu propietario ve esto en tiempo real — sin llamarte.</p>
                        </motion.div>
                    )}
                    {tab === 1 && (
                        <motion.div key="1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
                            <p className="text-[10px] font-black text-cima-gold uppercase tracking-widest mb-4">Sentimiento de visitas — Semana 3</p>
                            {[{ l: "Precio alto", v: 3, c: "bg-red-500" }, { l: "Les encantó", v: 1, c: "bg-green-500" }, { l: "Lo pensarán", v: 2, c: "bg-cima-gold" }].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                                    <span className="text-xs font-bold text-white/70">{item.l}</span>
                                    <div className="flex items-center gap-3">
                                        <div className="h-1.5 rounded-full bg-white/10" style={{ width: 60 }}>
                                            <div className={`h-full rounded-full ${item.c}`} style={{ width: `${(item.v / 3) * 100}%` }} />
                                        </div>
                                        <span className="text-xs font-black text-white">{item.v}</span>
                                    </div>
                                </div>
                            ))}
                            <p className="text-xs text-white/30 text-center font-mono mt-2">Usas datos reales para defender o ajustar el precio.</p>
                        </motion.div>
                    )}
                    {tab === 2 && (
                        <motion.div key="2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
                            <p className="text-[10px] font-black text-cima-gold uppercase tracking-widest mb-4">Ficha Técnica · Generada en 12 seg</p>
                            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 flex gap-4">
                                <div className="w-16 h-20 rounded-lg bg-gradient-to-b from-cima-gold/20 to-cima-gold/5 border border-cima-gold/20 shrink-0 flex items-center justify-center">
                                    <FileText className="h-6 w-6 text-cima-gold/50" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-black text-white mb-1">Casa Valle del Campestre</p>
                                    <p className="text-[9px] text-white/40 mb-3">220 m² · 3 rec · $4.2M MXN</p>
                                    <div className="flex gap-2">
                                        <span className="text-[8px] px-2 py-0.5 rounded-full bg-cima-gold/10 border border-cima-gold/20 text-cima-gold font-bold">PDF A4</span>
                                        <span className="text-[8px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/40 font-bold">Con tu marca</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs text-white/30 text-center font-mono">Sin Word. Sin Canva. Sin perder 2 horas.</p>
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
        { q: "¿Qué pasa si ya tengo un CRM?", a: "Cima Pro puede funcionar de forma independiente o conectarse a tus flujos actuales. No tienes que abandonar nada que ya funcione." },
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
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
                { id: "email", label: "Correo electrónico", type: "email", placeholder: "tu@correo.com", required: true },
                { id: "agencia", label: "Agencia o zona donde trabajas", type: "text", placeholder: "Ej. San Pedro, independiente, ERA...", required: false },
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

            <button
                type="submit"
                className="w-full py-5 bg-cima-gold text-black rounded-2xl font-heading font-black text-xs uppercase tracking-widest text-center shadow-[0_20px_40px_-15px_rgba(200,169,110,0.4)] hover:scale-[1.02] hover:bg-white transition-all flex items-center justify-center gap-3 group/btn mt-2"
            >
                Agendar mi Demo Gratis
                <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>

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

// ─── PAGE ──────────────────────────────────────────────────────────────────
export default function AgendaPage() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const scrollToForm = () => {
        document.getElementById("form-section")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div
            onMouseMove={e => setMousePos({ x: e.clientX, y: e.clientY })}
            className="min-h-screen bg-[#0A0A0B] text-white selection:bg-cima-gold/30 scroll-smooth relative overflow-x-hidden"
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
                    <div className="flex items-center gap-2">
                        <div className="h-7 w-7 md:h-8 md:w-8 rounded-lg bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center shrink-0">
                            <Building2 className="h-3.5 w-3.5 md:h-4 md:w-4 text-cima-gold" />
                        </div>
                        <span className="font-heading font-bold tracking-tight text-white/90 text-sm md:text-base">
                            Cima <span className="text-cima-gold italic font-medium ml-0.5 hidden sm:inline">Pro</span>
                        </span>
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
                            Cima Pro convierte tu gestión en la plataforma más sofisticada de Monterrey.{" "}
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

            {/* ─── PORTAL PREVIEW ─── */}
            <section className="py-16 md:py-24 px-4 md:px-6 relative overflow-hidden">
                <div className="mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <FadeIn direction="right">
                            <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-[0.4em] mb-4 block">Lo que ven tus clientes</span>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-black mb-6 md:mb-8 tracking-tight">
                                La herramienta que gana exclusivas
                            </h2>
                            <p className="text-white/60 text-sm md:text-lg mb-8 md:mb-10 leading-relaxed">
                                No solo tienes una plataforma bonita. Tu propietario entra a su portal personalizado y ve todo lo que estás haciendo. La confianza se construye sola.
                            </p>
                            <ul className="space-y-4 md:space-y-6 mb-10">
                                {[
                                    { t: "Dashboard en tiempo real", d: "Visitas, feedback, leads — todo visible sin que llamen.", icon: BarChart3 },
                                    { t: "Expediente digital", d: "Contratos, fotos, documentos. Sin caos de PDFs.", icon: FileText },
                                    { t: "Un clic = portal activo", d: "Captás exclusiva → activás portal → propietario encantado.", icon: Key },
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-4 group items-start">
                                        <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-xl bg-cima-gold/10 border border-cima-gold/20 flex items-center justify-center group-hover:bg-cima-gold/20 transition-all shrink-0 mt-0.5">
                                            <item.icon className="h-4 w-4 md:h-5 md:w-5 text-cima-gold" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-white text-[11px] md:text-sm">{item.t}</p>
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
                            <PortalPreview />
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
            <section className="py-16 md:py-24 px-4 md:px-6 bg-[#070708]">
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
                            Cima <span className="text-cima-gold italic font-medium">Pro</span>
                        </span>
                    </div>
                    <p className="text-[10px] text-white/20 font-mono uppercase tracking-widest text-center">
                        © 2025 Cima Pro · Monterrey, NL · Todos los derechos reservados
                    </p>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5">
                        <ShieldCheck className="h-3.5 w-3.5 text-cima-gold" />
                        <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Datos seguros SSL</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
