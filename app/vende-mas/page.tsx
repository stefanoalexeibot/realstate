"use client";

import React from "react";
import Link from "next/link";
import {
    BarChart3, Users, Layout, Zap,
    ArrowRight, ShieldCheck, Cpu,
    MessageSquare, Sparkles, Smartphone,
    Target, TrendingUp
} from "lucide-react";
import { motion } from "framer-motion";
import { MotionDiv, MotionSpan } from "@/components/landing/motion-wrapper";
import TiltCard from "@/components/landing/tilt-card";
import FadeIn from "@/components/landing/fade-in";

const FEATURES = [
    {
        icon: Layout,
        title: "Landing Page de Élite",
        desc: "Una presencia digital que proyecta confianza instantánea con diseño premium y optimización de conversión."
    },
    {
        icon: Users,
        title: "Portal de Propietarios",
        desc: "Tus clientes ven el avance de su venta en tiempo real. Notas, fotos y feedback centralizado."
    },
    {
        icon: Zap,
        title: "Automatización Total",
        desc: "Menos reportes manuales, más tiempo para cerrar. Todo el flujo de trabajo digitalizado."
    },
    {
        icon: BarChart3,
        title: "Métricas de Mercado",
        desc: "Análisis inteligente de visitas y feedback para justificar precios y estrategias ante tus clientes."
    }
];

export default function VendeMasPage() {
    return (
        <div className="min-h-screen bg-[#0A0A0B] text-white selection:bg-cima-gold/30">
            {/* Navbar Minimalista */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-xl bg-black/20">
                <div className="mx-auto max-w-7xl h-16 px-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center">
                            <Cpu className="h-4 w-4 text-cima-gold" />
                        </div>
                        <span className="font-heading font-bold tracking-tight text-white/90">Master Template <span className="text-cima-gold italic font-medium ml-1">Pro</span></span>
                    </div>
                    <Link
                        href="/onboarding"
                        className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-xs font-medium hover:bg-white/10 transition-all"
                    >
                        Empezar Onboarding <ArrowRight className="h-3 w-3" />
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-24 px-6 overflow-hidden">
                {/* Gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-cima-gold/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="relative mx-auto max-w-5xl text-center">
                    <FadeIn>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8">
                            <Sparkles className="h-3.5 w-3.5 text-cima-gold" />
                            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-cima-gold-light">Para Inmobiliarias & Asesores</span>
                        </div>
                    </FadeIn>

                    <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight mb-8 leading-[1.1]">
                        Transforma tu inmobiliaria en una
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cima-gold via-white to-cima-gold-light">
                            Plataforma de Alto Nivel
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed">
                        Deja de enviar PDFs estáticos. Dale a tus propietarios un portal digital, seguimiento en tiempo real y una landing page que captura clientes mientras duermes.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/onboarding"
                            className="w-full sm:w-auto px-8 py-4 bg-cima-gold text-black font-heading font-bold rounded-2xl hover:scale-105 transition-all shadow-[0_20px_40px_-10px_rgba(200,169,110,0.3)]"
                        >
                            Quiero mi plataforma hoy
                        </Link>
                        <a
                            href="https://wa.me/528112345678?text=Hola,%20vi%20la%20Master%20Template%20y%20quiero%20info"
                            target="_blank"
                            rel="noreferrer"
                            className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 font-heading font-bold rounded-2xl hover:bg-white/10 transition-all"
                        >
                            Hablar con un experto
                        </a>
                    </div>
                </div>
            </section>

            {/* Bento Grid Features */}
            <section className="py-24 px-6 bg-[#070708]">
                <div className="mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Todo lo que necesitas para escalar</h2>
                        <p className="text-white/40">El mismo sistema que usan las agencias de élite para vender propiedades en tiempo récord.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {FEATURES.map((f, i) => (
                            <FadeIn key={f.title} delay={i * 0.1}>
                                <div className="h-full bg-white/[0.02] border border-white/5 p-8 rounded-3xl hover:border-cima-gold/20 transition-all group">
                                    <div className="h-12 w-12 rounded-2xl bg-cima-gold/10 border border-cima-gold/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <f.icon className="h-6 w-6 text-cima-gold" />
                                    </div>
                                    <h3 className="text-xl font-heading font-bold mb-3">{f.title}</h3>
                                    <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* Visual Teaser */}
            <section className="py-24 px-6 relative">
                <div className="absolute inset-0 bg-cima-gold/5 blur-[150px] pointer-events-none" />
                <div className="mx-auto max-w-6xl">
                    <div className="rounded-[40px] border border-white/10 bg-black/40 backdrop-blur-md p-8 md:p-16 overflow-hidden relative">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6 leading-tight">
                                    Más que una web, <br />
                                    <span className="text-cima-gold">un sistema de cierre.</span>
                                </h2>
                                <ul className="space-y-4 mb-10">
                                    {[
                                        "Portal dinámico para dueños de propiedades",
                                        "Sistema de feedback automático post-visita",
                                        "Galería de evidencias y comparativa de mercado",
                                        "Optimizado para móviles (Mobile-First)",
                                        "Despliegue en menos de 24 horas"
                                    ].map((item) => (
                                        <li key={item} className="flex items-center gap-3 text-white/70">
                                            <ShieldCheck className="h-5 w-5 text-cima-gold shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href="/onboarding"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-heading font-bold rounded-xl hover:bg-cima-gold transition-colors"
                                >
                                    Empezar ahora <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>

                            <div className="relative">
                                {/* Visual Representation of Portal */}
                                <div className="aspect-square bg-gradient-to-br from-cima-gold/20 to-transparent rounded-3xl border border-cima-gold/30 p-1 relative overflow-hidden shadow-2xl">
                                    <div className="bg-[#0A0A0B] h-full w-full rounded-[20px] p-6">
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="h-6 w-24 bg-white/5 rounded-md" />
                                            <div className="h-8 w-8 rounded-full bg-cima-gold/20" />
                                        </div>
                                        <div className="space-y-4">
                                            <div className="h-32 w-full bg-white/[0.03] rounded-2xl border border-white/5" />
                                            <div className="grid grid-cols-3 gap-3">
                                                <div className="h-16 bg-white/[0.02] rounded-xl" />
                                                <div className="h-16 bg-white/[0.02] rounded-xl" />
                                                <div className="h-16 bg-white/[0.02] rounded-xl" />
                                            </div>
                                            <div className="h-20 w-full bg-white/[0.02] rounded-2xl" />
                                        </div>
                                    </div>
                                    {/* Floating elements */}
                                    <motion.div
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ duration: 4, repeat: Infinity }}
                                        className="absolute top-1/4 -right-4 bg-cima-gold rounded-2xl p-4 shadow-xl shadow-cima-gold/20 text-black hidden md:block"
                                    >
                                        <TrendingUp className="h-6 w-6" />
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-24 px-6 bg-[#0A0A0B] relative">
                <div className="mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4 tracking-tight">Elige tu Plan de Crecimiento</h2>
                        <p className="text-white/40 max-w-2xl mx-auto">Una inversión que se paga sola con tu primera exclusiva lograda.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Starter",
                                price: "$14,900",
                                desc: "Ideal para el asesor que empieza a digitalizarse.",
                                features: ["Landing Page Elite", "Portal Propietario (1 activo)", "QR de Venta", "QR en Letrero"],
                                cta: "Empezar Starter"
                            },
                            {
                                name: "Professional",
                                price: "$29,900",
                                desc: "Para asesores Top que manejan inventario exclusivo.",
                                features: ["Todo en Starter", "Hasta 5 Portales Activos", "Reportes de Feedback IA", "Soporte Prioritario"],
                                highlight: true,
                                cta: "Ir Pro"
                            },
                            {
                                name: "Team / Agency",
                                price: "$49,900",
                                desc: "Para inmobiliarias que quieren dominar su zona.",
                                features: ["Todo en Pro", "Multi-perfil (3 asesores)", "Inventario Ilimitado", "Dominio Propio (.com)"],
                                cta: "Contactar Agencia"
                            }
                        ].map((plan, i) => (
                            <div
                                key={plan.name}
                                className={`p-10 rounded-[40px] border flex flex-col h-full transition-all duration-500 ${plan.highlight ? "bg-cima-gold/5 border-cima-gold shadow-[0_40px_100px_-20px_rgba(200,169,110,0.15)] scale-105 z-10" : "bg-white/[0.02] border-white/5"}`}
                            >
                                <h3 className="text-xl font-heading font-bold mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mb-6">
                                    <span className="text-4xl font-black text-cima-gold">{plan.price}</span>
                                    <span className="text-xs text-white/40 font-mono">MXN</span>
                                </div>
                                <p className="text-sm text-white/50 mb-8 leading-relaxed h-12">{plan.desc}</p>
                                <ul className="space-y-4 mb-10 flex-1">
                                    {plan.features.map(f => (
                                        <li key={f} className="flex items-center gap-3 text-xs text-white/70">
                                            <ShieldCheck className="h-4 w-4 text-cima-gold shrink-0" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href="/onboarding"
                                    className={`w-full py-4 rounded-2xl font-heading font-bold text-center transition-all ${plan.highlight ? "bg-cima-gold text-black hover:bg-white" : "bg-white/5 text-white hover:bg-white/10"}`}
                                >
                                    {plan.cta}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Enterprise Bridge */}
            <section className="py-24 px-6 border-y border-white/5 bg-gradient-to-b from-transparent to-cima-gold/[0.02]">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="text-2xl md:text-3xl font-heading font-bold mb-6">¿Eres una agencia consolidada?</h2>
                    <p className="text-white/60 mb-10 leading-relaxed">
                        Si manejas una franquicia o un equipo de +10 asesores, necesitas infraestructura dedicada, IA personalizada y soberanía tecnológica total.
                    </p>
                    <Link
                        href="/pro"
                        className="inline-flex items-center gap-2 text-cima-gold font-bold hover:gap-4 transition-all"
                    >
                        Conoce Cima Pro (Enterprise) <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-white/5 mt-12">
                <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6 opacity-40 hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-2">
                        <Cpu className="h-4 w-4" />
                        <span className="text-sm font-bold">Master Template Pro</span>
                    </div>
                    <p className="text-xs font-mono">© {new Date().getFullYear()} Solución impulsada por Cima Tech</p>
                    <div className="flex gap-6 text-xs underline underline-offset-4">
                        <Link href="/">Volver a Cima</Link>
                        <Link href="/onboarding">Onboarding</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
