"use client";

import Link from "next/link";
import Image from "next/image";
import {
    ShieldCheck, Zap, Globe, MessageCircle, BarChart3,
    ArrowRight, Sparkles, Building2, UserCheck, Layout
} from "lucide-react";
import { motion } from "framer-motion";
import FadeIn from "@/components/landing/fade-in";
import { useState } from "react";

function RoiCalculator() {
    const [price, setPrice] = useState(5000000);
    const [commission, setCommission] = useState(5);
    const [monthlyProp, setMonthlyProp] = useState(2);

    const totalComm = (price * (commission / 100));
    const monthlyIncome = totalComm * monthlyProp;
    const timeSavedValue = (monthlyProp * 15 * 500); // 15 horas x propiedad x $500/hr

    return (
        <div className="bg-cima-bg/60 border border-cima-border rounded-2xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
            <h3 className="font-heading font-bold text-xl text-cima-gold mb-8 text-center sm:text-left">Calculadora de Impacto Financiero</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                    <div>
                        <label className="text-[10px] uppercase tracking-widest font-bold text-cima-text-dim block mb-3">Precio promedio propiedad</label>
                        <input
                            type="range" min="1000000" max="20000000" step="100000"
                            value={price} onChange={(e) => setPrice(Number(e.target.value))}
                            className="w-full accent-cima-gold bg-cima-border rounded-lg h-2"
                        />
                        <div className="flex justify-between mt-2 font-mono text-xs text-cima-gold font-bold">
                            <span>$1M</span>
                            <span>${(price / 1000000).toFixed(1)}M</span>
                            <span>$20M</span>
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] uppercase tracking-widest font-bold text-cima-text-dim block mb-3">% Comisión de Agencia</label>
                        <div className="flex gap-4">
                            {[3, 4, 5, 6].map(val => (
                                <button
                                    key={val}
                                    onClick={() => setCommission(val)}
                                    className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-all ${commission === val ? "bg-cima-gold text-cima-bg border-cima-gold" : "bg-cima-card border-cima-border text-cima-text-muted hover:border-cima-gold/30"}`}
                                >
                                    {val}%
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] uppercase tracking-widest font-bold text-cima-text-dim block mb-3">Propiedades por mes</label>
                        <input
                            type="number" value={monthlyProp} onChange={(e) => setMonthlyProp(Number(e.target.value))}
                            className="w-full bg-cima-card border border-cima-border rounded-xl p-3 text-cima-text font-bold text-sm focus:border-cima-gold outline-none transition-colors"
                        />
                    </div>
                </div>

                <div className="bg-cima-gold/5 rounded-2xl p-6 sm:p-8 border border-cima-gold/10 flex flex-col justify-center">
                    <div className="space-y-6">
                        <div>
                            <p className="text-[10px] uppercase font-bold text-cima-gold tracking-widest mb-1 italic">Potencial de Ingresos al mes</p>
                            <p className="text-3xl sm:text-4xl font-heading font-extrabold text-cima-text">
                                ${new Intl.NumberFormat().format(monthlyIncome)}
                            </p>
                        </div>
                        <div className="pt-6 border-t border-cima-gold/10">
                            <p className="text-[10px] uppercase font-bold text-cima-text-dim tracking-widest mb-1">Valor de tiempo ahorrado x mes</p>
                            <p className="text-xl font-bold text-cima-gold">
                                ${new Intl.NumberFormat().format(timeSavedValue)} +
                            </p>
                            <p className="text-[9px] text-cima-text-dim mt-2 italic">* Calculado basado en 15hrs de ahorro operativo por propiedad.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const FEATURES = [
    {
        icon: <UserCheck className="h-6 w-6 text-cima-gold" />,
        title: "Portal de Propietarios",
        description: "Gana exclusivas ofreciendo transparencia total. Tus clientes ven el progreso de su venta en tiempo real.",
        badge: "Diferenciador #1"
    },
    {
        icon: <Zap className="h-6 w-6 text-cima-gold" />,
        title: "Automatización 1-Click",
        description: "Sube una propiedad y genera al instante su landing page, ficha técnica PDF y notificaciones de leads.",
        badge: "Eficiencia"
    },
    {
        icon: <Sparkles className="h-6 w-6 text-cima-gold" />,
        title: "Cima Intelligence AI",
        description: "Análisis automático del entorno (colegios, hospitales, comercio) procesado por IA para argumentos de venta.",
        badge: "Innovación"
    },
    {
        icon: <Layout className="h-6 w-6 text-cima-gold" />,
        title: "Landings de Ultra-Lujo",
        description: "Diseño premium tipo SaaS que retiene la atención y posiciona tu marca por encima de la competencia.",
        badge: "Estatus"
    }
];

export default function CimaProPage() {
    return (
        <div className="min-h-screen bg-cima-bg text-cima-text selection:bg-cima-gold selection:text-cima-bg">
            {/* Nav sutil */}
            <nav className="fixed top-0 inset-x-0 h-16 border-b border-cima-border bg-cima-bg/80 backdrop-blur-xl z-50">
                <div className="max-w-7xl mx-auto h-full px-4 sm:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-cima-gold rounded-lg flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-cima-bg" />
                        </div>
                        <span className="font-heading font-bold text-lg tracking-tight">Cima <span className="text-cima-gold">Pro</span></span>
                    </div>
                    <Link
                        href="https://wa.me/528116307133"
                        className="text-[11px] font-bold uppercase tracking-widest text-cima-gold hover:text-cima-gold-light transition-colors"
                    >
                        Agendar Demo
                    </Link>
                </div>
            </nav>

            <main className="pt-32 pb-20">
                {/* Hero */}
                <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-32">
                    <FadeIn>
                        <div className="max-w-3xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cima-gold/10 border border-cima-gold/20 mb-6">
                                <Sparkles className="h-3 w-3 text-cima-gold" />
                                <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-widest">El Sistema Definitivo para Inmobiliarias</span>
                            </div>
                            <h1 className="font-heading font-bold text-4xl sm:text-6xl lg:text-7xl leading-[1.1] mb-8">
                                No solo vendas casas. <br />
                                <span className="text-cima-gold">Domina el mercado.</span>
                            </h1>
                            <p className="text-lg sm:text-xl text-cima-text-dim mb-10 leading-relaxed max-w-2xl">
                                Convierte tu agencia en una potencia tecnológica. Atrae propietarios, cierra exclusivas y gestiona leads con el ecosistema inmobiliario más avanzado de Monterrey.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <Link
                                    href="https://wa.me/528116307133"
                                    className="w-full sm:w-auto px-8 py-4 rounded-xl bg-cima-gold text-cima-bg font-bold text-sm hover:bg-cima-gold-light transition-all flex items-center justify-center gap-2 shadow-lg shadow-cima-gold/20"
                                >
                                    Solicitar Implementación
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                                <Link
                                    href="/admin/propiedades"
                                    className="w-full sm:w-auto px-8 py-4 rounded-xl bg-cima-card border border-cima-border text-cima-text font-bold text-sm hover:border-cima-gold/30 transition-all text-center"
                                >
                                    Ver Ecosistema
                                </Link>
                            </div>
                        </div>
                    </FadeIn>
                </section>

                {/* Features Grid */}
                <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-32">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {FEATURES.map((feature, i) => (
                            <FadeIn key={i} delay={i * 0.1}>
                                <div className="p-8 rounded-2xl bg-cima-card border border-cima-border hover:border-cima-gold/30 transition-all group relative overflow-hidden h-full">
                                    <div className="absolute top-0 right-0 p-4">
                                        <span className="text-[9px] font-mono font-bold text-cima-gold/50 uppercase tracking-widest">{feature.badge}</span>
                                    </div>
                                    <div className="w-12 h-12 rounded-xl bg-cima-bg border border-cima-border flex items-center justify-center mb-6 group-hover:border-cima-gold/30 transition-colors">
                                        {feature.icon}
                                    </div>
                                    <h3 className="font-heading font-bold text-xl text-cima-text mb-4">{feature.title}</h3>
                                    <p className="text-cima-text-dim leading-relaxed text-sm">
                                        {feature.description}
                                    </p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </section>

                {/* ROI Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-32">
                    <FadeIn>
                        <RoiCalculator />
                    </FadeIn>
                </section>

                {/* Closing Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-8">
                    <div className="rounded-3xl bg-cima-gold p-8 sm:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />

                        <div className="relative z-10 max-w-xl">
                            <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-cima-bg mb-6">
                                Diseñado para cerrar tratos de +$100k
                            </h2>
                            <ul className="space-y-4 mb-10">
                                {[
                                    "Control total de la marca y exclusivas",
                                    "Ahorro de hasta 15 horas semanales por asesor",
                                    "Leads calificados directo a tu WhatsApp",
                                    "Soporte y actualizaciones constantes"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-cima-bg font-bold text-sm">
                                        <div className="w-5 h-5 rounded-full bg-cima-bg/10 flex items-center justify-center">
                                            <ShieldCheck className="h-3 w-3 text-cima-bg" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="https://wa.me/528116307133"
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-cima-bg text-cima-gold font-bold text-sm hover:opacity-90 transition-opacity"
                            >
                                Contactar Especialista
                                <MessageCircle className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Ecosystem Showcase */}
                <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-32">
                    <FadeIn>
                        <div className="text-center mb-16">
                            <h2 className="font-heading font-bold text-3xl sm:text-5xl mb-6">Un Ecosistema, <span className="text-cima-gold">Tres Experiencias</span></h2>
                            <p className="text-cima-text-dim max-w-2xl mx-auto">Una plataforma integrada que conecta a tu equipo, tus clientes y tus prospectos en un solo flujo profesional.</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {[
                                {
                                    title: "Portal del Asesor",
                                    desc: "Control total de inventario, leads y generación de fichas en segundos.",
                                    img: "https://pdtpjyawfnhqlypifshn.supabase.co/storage/v1/object/public/web-assets/admin-mockup.png", // Usaré un placeholder o descripción si no tengo el path exacto de la UI real aquí
                                    link: "/admin"
                                },
                                {
                                    title: "Portal del Propietario",
                                    desc: "La herramienta definitiva para ganar exclusivas con transparencia total.",
                                    img: "/C:/Users/brand/.gemini/antigravity/brain/b46c03a3-d364-4a87-a7ec-1812a44c8172/cima_owner_portal_mockup_1772221658445.png",
                                    link: "#"
                                },
                                {
                                    title: "Landing de Propiedad",
                                    desc: "El escaparate de lujo que tus mejores casas merecen.",
                                    img: "/C:/Users/brand/.gemini/antigravity/brain/b46c03a3-d364-4a87-a7ec-1812a44c8172/cima_mosaic_hero_mockup_1772215908635.png",
                                    link: "/propiedades"
                                }
                            ].map((item, i) => (
                                <div key={i} className="group cursor-pointer">
                                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-cima-border bg-cima-card mb-6 mb-6 transform transition-transform group-hover:-translate-y-2">
                                        <Image
                                            src={item.img}
                                            alt={item.title}
                                            fill
                                            className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-cima-bg via-transparent to-transparent opacity-60" />
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cima-gold text-cima-bg text-[10px] font-bold uppercase tracking-widest translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                                                Explorar Demo
                                                <ArrowRight className="h-3 w-3" />
                                            </div>
                                        </div>
                                    </div>
                                    <h4 className="font-heading font-bold text-xl text-cima-text group-hover:text-cima-gold transition-colors mb-2">{item.title}</h4>
                                    <p className="text-sm text-cima-text-dim leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </FadeIn>
                </section>

            </main>

            <footer className="border-t border-cima-border py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <p className="text-xs text-cima-text-dim">© 2026 Cima Propiedades. Software de Alto Rendimiento Inmobiliario.</p>
                    <div className="flex items-center gap-6">
                        <Link href="/" className="text-[10px] font-bold uppercase tracking-widest text-cima-text-muted hover:text-cima-gold transition-colors">Landing Principal</Link>
                        <Link href="/admin" className="text-[10px] font-bold uppercase tracking-widest text-cima-text-muted hover:text-cima-gold transition-colors">Portal Admin</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
