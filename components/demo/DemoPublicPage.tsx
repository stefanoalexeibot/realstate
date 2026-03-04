"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowRight, Globe, Layout, Home, Building2, TrendingUp,
    CheckCircle2, Zap, Users, MessageSquare, BarChart3,
    Star, Shield, DollarSign, Play, ChevronRight,
    Phone, Sparkles
} from "lucide-react";

const STATS_ROW = [
    { value: "250+", label: "Propiedades publicadas" },
    { value: "<30 días", label: "Promedio de venta" },
    { value: "98%", label: "Satisfacción del asesor" },
];

const HOW_IT_WORKS = [
    {
        num: "01",
        title: "Publica",
        desc: "Sube tus fotos y datos. En minutos tienes una landing page profesional lista para compartir.",
        icon: Globe,
    },
    {
        num: "02",
        title: "Recibe Leads",
        desc: "Los compradores llegan por Instagram, Marketplace y búsqueda. La IA los califica por ti.",
        icon: Users,
    },
    {
        num: "03",
        title: "Cierra",
        desc: "Gestiona visitas, negocia y cierra. El portal del propietario elimina el estrés del seguimiento.",
        icon: CheckCircle2,
    },
];

const VIEWS = [
    {
        icon: Globe,
        name: "Landing Page",
        desc: "Tu propiedad con diseño de lujo y conversión optimizada.",
        view: "landing",
    },
    {
        icon: Layout,
        name: "Panel del Asesor",
        desc: "Pipeline de leads, analíticos y mensajes en un solo lugar.",
        view: "admin",
    },
    {
        icon: Home,
        name: "Portal del Dueño",
        desc: "Transparencia 24/7: el propietario ve todo el avance.",
        view: "portal",
    },
    {
        icon: Building2,
        name: "Página de Propiedad",
        desc: "El comprador ve galería, specs y CTA en una URL premium.",
        view: "propiedad",
    },
];

const IMPACT_NUMBERS = [
    { value: "3×", label: "Más rápido que el promedio de mercado" },
    { value: "250+", label: "Asesores activos en Monterrey" },
    { value: "98%", label: "Clientes que renuevan cada año" },
    { value: "$0", label: "Comisión extra — precio fijo mensual" },
];

const PLANS = [
    {
        name: "Starter",
        price: "$14,900",
        sub: "pago único",
        features: ["1 propiedad publicada", "Landing Page profesional", "Panel básico de leads"],
        tier: "basico",
    },
    {
        name: "Professional",
        price: "$29,900",
        sub: "pago único",
        features: ["Hasta 5 propiedades", "IA de calificación de leads", "Portal del propietario"],
        tier: "profesional",
        highlight: true,
    },
    {
        name: "Team / Agency",
        price: "$49,900",
        sub: "pago único",
        features: ["Propiedades ilimitadas", "Multi-asesor + contratos", "Analíticos avanzados"],
        tier: "premium",
    },
];

/* ── Fade-in wrapper ── */
function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export default function DemoPublicPage() {
    const [activeView, setActiveView] = useState(0);

    // Auto-rotate views preview
    useEffect(() => {
        const id = setInterval(() => setActiveView(v => (v + 1) % VIEWS.length), 3500);
        return () => clearInterval(id);
    }, []);

    return (
        <div className="min-h-screen bg-[#080809] text-white font-sans selection:bg-cima-gold selection:text-black">

            {/* ── Navbar ───────────────────────────── */}
            <nav className="sticky top-0 z-50 bg-[#080809]/80 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex items-center justify-between max-w-6xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-cima-gold flex items-center justify-center shadow-lg shadow-cima-gold/20">
                        <Building2 className="h-3.5 w-3.5 text-black" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-white">Cima Pro</span>
                </div>
                <div className="flex items-center gap-3">
                    <a
                        href="/demo/live"
                        className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold text-white/50 hover:text-white transition-all uppercase tracking-widest"
                    >
                        Demo en vivo
                        <ChevronRight className="h-3 w-3" />
                    </a>
                    <a
                        href="/checkout/onboarding"
                        className="flex items-center gap-1.5 px-4 py-2 bg-cima-gold text-black rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-white transition-all shadow-lg shadow-cima-gold/20"
                    >
                        Comenzar
                    </a>
                </div>
            </nav>

            {/* ── 1. HERO ──────────────────────────── */}
            <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-4 pt-16 pb-24 overflow-hidden">
                {/* Background glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full bg-cima-gold/5 blur-[120px]" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative max-w-3xl mx-auto"
                >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cima-gold/10 border border-cima-gold/20 text-cima-gold text-[10px] font-black uppercase tracking-widest mb-8">
                        <Sparkles className="h-3 w-3" />
                        Plataforma #1 Inmobiliaria en Monterrey
                    </div>

                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-heading font-black tracking-tight leading-none mb-6">
                        La plataforma que vende tu propiedad{" "}
                        <span className="text-cima-gold">3× más rápido</span>
                    </h1>

                    <p className="text-base sm:text-lg text-white/50 mb-10 max-w-xl mx-auto leading-relaxed">
                        Publica, convierte leads con IA y cierra negocios — todo desde un solo panel diseñado para asesores inmobiliarios en Monterrey.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
                        <a
                            href="/demo/live"
                            className="flex items-center gap-2 px-8 py-4 bg-cima-gold text-black rounded-2xl text-sm font-black uppercase tracking-wider hover:bg-white transition-all shadow-xl shadow-cima-gold/25 hover:scale-105 active:scale-95"
                        >
                            <Play className="h-4 w-4 fill-black" />
                            Ver Demo Interactivo
                        </a>
                        <a
                            href="https://wa.me/528112345678"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl text-sm font-bold uppercase tracking-wider hover:bg-white/10 transition-all"
                        >
                            <Phone className="h-4 w-4" />
                            WhatsApp con un Asesor
                        </a>
                    </div>

                    {/* Stats row */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
                        {STATS_ROW.map((s, i) => (
                            <React.Fragment key={s.label}>
                                {i > 0 && <div className="hidden sm:block h-8 w-px bg-white/10" />}
                                <div className="text-center">
                                    <p className="text-2xl font-heading font-black text-white">{s.value}</p>
                                    <p className="text-[10px] text-white/35 font-medium uppercase tracking-widest mt-0.5">{s.label}</p>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* ── 2. CÓMO FUNCIONA ─────────────────── */}
            <section className="py-24 px-4 bg-white/[0.015] border-y border-white/5">
                <div className="max-w-5xl mx-auto">
                    <FadeIn className="text-center mb-16">
                        <p className="text-[10px] font-black text-cima-gold uppercase tracking-widest mb-3">Proceso</p>
                        <h2 className="text-4xl font-heading font-black tracking-tight">Cómo funciona</h2>
                    </FadeIn>

                    <div className="grid md:grid-cols-3 gap-8">
                        {HOW_IT_WORKS.map((step, i) => (
                            <FadeIn key={step.num} delay={i * 0.15}>
                                <div className="relative">
                                    <div className="text-[80px] font-heading font-black text-white/[0.04] leading-none mb-4 select-none">
                                        {step.num}
                                    </div>
                                    <div className="h-10 w-10 rounded-2xl bg-cima-gold/10 border border-cima-gold/20 flex items-center justify-center mb-4 -mt-8 relative">
                                        <step.icon className="h-5 w-5 text-cima-gold" />
                                    </div>
                                    <h3 className="text-xl font-heading font-black mb-2">{step.title}</h3>
                                    <p className="text-sm text-white/45 leading-relaxed">{step.desc}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 3. VISTAS DEL PRODUCTO ───────────── */}
            <section className="py-24 px-4">
                <div className="max-w-5xl mx-auto">
                    <FadeIn className="text-center mb-16">
                        <p className="text-[10px] font-black text-cima-gold uppercase tracking-widest mb-3">Producto</p>
                        <h2 className="text-4xl font-heading font-black tracking-tight">Todo en un solo lugar</h2>
                    </FadeIn>

                    <div className="grid sm:grid-cols-2 gap-4">
                        {VIEWS.map((v, i) => (
                            <FadeIn key={v.name} delay={i * 0.1}>
                                <motion.div
                                    onHoverStart={() => setActiveView(i)}
                                    className={`group relative rounded-2xl border p-6 transition-all cursor-default ${activeView === i
                                        ? "bg-cima-gold/5 border-cima-gold/30 shadow-lg shadow-cima-gold/5"
                                        : "bg-white/[0.02] border-white/5 hover:border-white/10"
                                        }`}
                                >
                                    <div className={`h-10 w-10 rounded-xl border flex items-center justify-center mb-4 transition-all ${activeView === i ? "bg-cima-gold/10 border-cima-gold/20" : "bg-white/[0.03] border-white/10"}`}>
                                        <v.icon className={`h-5 w-5 ${activeView === i ? "text-cima-gold" : "text-white/30"}`} />
                                    </div>
                                    <h3 className="text-base font-heading font-black mb-2">{v.name}</h3>
                                    <p className="text-sm text-white/40 mb-4 leading-relaxed">{v.desc}</p>
                                    <a
                                        href="/demo/live"
                                        className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider transition-all ${activeView === i ? "text-cima-gold" : "text-white/20 hover:text-white/50"}`}
                                    >
                                        Ver en Demo
                                        <ArrowRight className="h-3 w-3" />
                                    </a>
                                </motion.div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 4. NÚMEROS IMPACTANTES ───────────── */}
            <section className="py-24 px-4 bg-white/[0.015] border-y border-white/5">
                <div className="max-w-5xl mx-auto">
                    <FadeIn className="text-center mb-16">
                        <p className="text-[10px] font-black text-cima-gold uppercase tracking-widest mb-3">Resultados</p>
                        <h2 className="text-4xl font-heading font-black tracking-tight">Números que hablan</h2>
                    </FadeIn>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        {IMPACT_NUMBERS.map((n, i) => (
                            <FadeIn key={n.label} delay={i * 0.1}>
                                <div>
                                    <p className="text-5xl font-heading font-black text-cima-gold mb-2">{n.value}</p>
                                    <p className="text-xs text-white/40 leading-snug">{n.label}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 5. PLANES ────────────────────────── */}
            <section className="py-24 px-4">
                <div className="max-w-5xl mx-auto">
                    <FadeIn className="text-center mb-16">
                        <p className="text-[10px] font-black text-cima-gold uppercase tracking-widest mb-3">Precios</p>
                        <h2 className="text-4xl font-heading font-black tracking-tight">Elige tu plan</h2>
                    </FadeIn>

                    <div className="grid md:grid-cols-3 gap-6">
                        {PLANS.map((p, i) => (
                            <FadeIn key={p.name} delay={i * 0.1}>
                                <div className={`relative rounded-2xl border p-6 flex flex-col h-full transition-all ${p.highlight
                                    ? "bg-cima-gold/5 border-cima-gold/30 shadow-xl shadow-cima-gold/10"
                                    : "bg-white/[0.02] border-white/5"
                                    }`}>
                                    {p.highlight && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-cima-gold text-black text-[9px] font-black uppercase tracking-widest rounded-full">
                                            Más popular
                                        </div>
                                    )}
                                    <div className="mb-6">
                                        <h3 className="text-base font-heading font-black mb-1">{p.name}</h3>
                                        <p className="text-3xl font-heading font-black text-cima-gold">{p.price}</p>
                                        <p className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">{p.sub}</p>
                                    </div>
                                    <div className="space-y-2 mb-8 flex-1">
                                        {p.features.map((f) => (
                                            <div key={f} className="flex items-center gap-2">
                                                <CheckCircle2 className="h-3.5 w-3.5 text-cima-gold/60 shrink-0" />
                                                <span className="text-xs text-white/60">{f}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <a
                                        href="/demo/live"
                                        className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${p.highlight
                                            ? "bg-cima-gold text-black hover:bg-white shadow-lg shadow-cima-gold/20"
                                            : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
                                            }`}
                                    >
                                        Ver Demo
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </a>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 6. CTA FINAL ─────────────────────── */}
            <section className="py-24 px-4">
                <div className="max-w-2xl mx-auto">
                    <FadeIn>
                        <div className="bg-cima-gold rounded-3xl p-10 md:p-16 text-center shadow-2xl shadow-cima-gold/20">
                            <div className="h-12 w-12 rounded-2xl bg-black/10 flex items-center justify-center mx-auto mb-6">
                                <Zap className="h-6 w-6 text-black fill-black" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-heading font-black text-black tracking-tight mb-4">
                                Empieza hoy mismo
                            </h2>
                            <p className="text-sm text-black/60 mb-8 leading-relaxed">
                                Tu competencia ya está usando plataformas digitales. No pierdas más ventas por falta de presencia.
                            </p>
                            <a
                                href="/checkout/onboarding"
                                className="inline-flex items-center gap-2 px-10 py-4 bg-black text-white rounded-2xl text-sm font-black uppercase tracking-wider hover:bg-[#111] transition-all shadow-xl active:scale-95"
                            >
                                <DollarSign className="h-4 w-4" />
                                Comenzar Ahora
                                <ArrowRight className="h-4 w-4" />
                            </a>
                            <p className="text-[10px] text-black/40 mt-6 uppercase tracking-widest font-bold">
                                Sin contratos · Pago único · Entrega en días
                            </p>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 px-4 py-8 text-center">
                <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold">
                    © 2025 Cima Pro · Plataforma Inmobiliaria · Monterrey, NL
                </p>
            </footer>
        </div>
    );
}
