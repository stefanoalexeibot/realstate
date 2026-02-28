"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    BarChart3, Users, Layout, Zap,
    ArrowRight, ShieldCheck, Cpu,
    MessageSquare, Sparkles, Smartphone,
    Target, TrendingUp, ShieldAlert,
    Clock, CheckCircle2, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MotionDiv, MotionSpan } from "@/components/landing/motion-wrapper";
import TiltCard from "@/components/landing/tilt-card";
import FadeIn from "@/components/landing/fade-in";

function MasterRoiCalculator() {
    const [price, setPrice] = useState(5000000);
    const [monthlyProp, setMonthlyProp] = useState(1);

    // Master Template costs (average between plans)
    const investment = 29900;
    const commission = 0.05; // 5% average

    const singleCommission = price * commission;
    const monthlyGain = singleCommission * monthlyProp;
    const annualGain = monthlyGain * 12;
    const roi = Math.round((annualGain / investment));

    return (
        <div className="bg-white/[0.02] border border-white/10 rounded-[40px] p-8 md:p-12 backdrop-blur-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                    <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-[0.3em] mb-4 block">Simulador de Impacto</span>
                    <h3 className="text-3xl font-heading font-bold mb-6">Tu tecnología se paga con <span className="text-cima-gold">un solo cierre.</span></h3>
                    <p className="text-white/50 mb-10 text-sm leading-relaxed">
                        ¿Cuánto vale tu tiempo y tu imagen? Calcula el retorno de inversión al digitalizar tu proceso con la Master Template.
                    </p>

                    <div className="space-y-8">
                        <div>
                            <label className="text-[10px] uppercase font-bold text-white/40 block mb-4">Valor promedio de tus propiedades</label>
                            <input
                                type="range" min="1000000" max="15000000" step="500000"
                                value={price} onChange={(e) => setPrice(Number(e.target.value))}
                                className="w-full accent-cima-gold"
                            />
                            <div className="flex justify-between mt-2 text-[10px] font-mono text-white/30 uppercase">
                                <span>$1M</span>
                                <span className="text-cima-gold font-bold">${(price / 1000000).toFixed(1)}M MXN</span>
                                <span>$15M</span>
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] uppercase font-bold text-white/40 block mb-4">Propiedades cerradas al año</label>
                            <div className="flex gap-3">
                                {[3, 6, 12, 24].map(val => (
                                    <button
                                        key={val}
                                        onClick={() => setMonthlyProp(val / 12)}
                                        className={`flex-1 py-3 rounded-xl border text-xs font-bold transition-all ${Math.round(monthlyProp * 12) === val ? "bg-cima-gold text-black border-cima-gold" : "bg-white/5 border-white/10 text-white/40 hover:border-cima-gold/30"}`}
                                    >
                                        {val}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-cima-gold/5 rounded-3xl p-8 border border-cima-gold/20 relative overflow-hidden">
                    <div className="relative z-10 space-y-8">
                        <div>
                            <p className="text-[10px] uppercase font-bold text-cima-gold tracking-[0.2em] mb-2">Comisión estimada por venta</p>
                            <p className="text-3xl font-heading font-bold text-white">${new Intl.NumberFormat().format(singleCommission)}</p>
                        </div>
                        <div className="pt-6 border-t border-white/5">
                            <p className="text-[10px] uppercase font-bold text-white/40 tracking-[0.2em] mb-2">Ingreso Anual Proyectado</p>
                            <p className="text-2xl font-heading font-bold text-white/90">${new Intl.NumberFormat().format(annualGain)}</p>
                        </div>
                        <div className="pt-6 border-t border-white/5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] uppercase font-black text-cima-gold tracking-[0.3em] mb-1 italic">ROI Anual estimado</p>
                                    <p className="text-5xl font-heading font-black text-cima-gold">{roi}x</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] text-cima-gold/60 leading-tight">Tu plataforma se paga <br /> {roi} veces en un año.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const FEATURES = [
    {
        icon: Layout,
        title: "Landing Page de Élite",
        desc: "Olvida los sitios lentos. Una página con estética de ultra-lujo que enamora a los propietarios de inmediato."
    },
    {
        icon: Users,
        title: "Portal Propietario",
        desc: "Transparencia total. Tus clientes ven el avance de su venta en tiempo real, eliminando la ansiedad del '¿cómo va mi casa?'."
    },
    {
        icon: BarChart3,
        title: "Reportes con Data Real",
        desc: "Genera feedback automático basado en visitas reales. Usa datos, no opiniones, para ajustar precios o estrategias."
    },
    {
        icon: Zap,
        title: "Despliegue Relámpago",
        desc: "Tu plataforma lista en menos de 24 horas. Sin programadores, sin meses de espera, sin dolores de cabeza."
    }
];

export default function VendeMasPage() {
    const [isTableModalOpen, setIsTableModalOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-white selection:bg-cima-gold/30 scroll-smooth">
            {/* Navbar Minimalista */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-xl bg-black/20">
                <div className="mx-auto max-w-7xl h-16 px-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center">
                            <Cpu className="h-4 w-4 text-cima-gold" />
                        </div>
                        <span className="font-heading font-bold tracking-tight text-white/90">Master Template <span className="text-cima-gold italic font-medium ml-1">Pro</span></span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="hidden md:flex items-center gap-2 text-[10px] font-mono text-white/40 uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            Solo 2 cupos en Monterrey
                        </span>
                        <Link
                            href="/onboarding"
                            className="flex items-center gap-2 bg-cima-gold text-black px-4 py-1.5 rounded-full text-xs font-bold hover:bg-white transition-all shadow-lg shadow-cima-gold/10"
                        >
                            Asegurar mi lugar
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-40 pb-24 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-cima-gold/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="relative mx-auto max-w-5xl text-center">
                    <FadeIn>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8">
                            <ShieldAlert className="h-3.5 w-3.5 text-cima-gold" />
                            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-cima-gold">Disponibilidad Limitada por Ciudad</span>
                        </div>
                    </FadeIn>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold tracking-tight mb-8 leading-[1.05]">
                        Deja de ser un asesor común. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cima-gold via-white to-cima-gold-light">
                            Conviértete en Plataforma.
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto mb-12 leading-relaxed">
                        El 90% de los asesores pierden exclusivas porque sus herramientas parecen de los 90s. La Master Template te da la estética y el sistema de las agencias que captan propiedades de millones de dólares.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link
                            href="/onboarding"
                            className="w-full sm:w-auto px-10 py-5 bg-cima-gold text-black font-heading font-bold rounded-2xl hover:scale-105 transition-all shadow-[0_20px_40px_-10px_rgba(200,169,110,0.3)]"
                        >
                            Lanzar mi plataforma hoy
                        </Link>
                        <a
                            href="#roi"
                            className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 font-heading font-bold rounded-2xl hover:bg-white/10 transition-all text-sm uppercase tracking-widest"
                        >
                            Ver ROI estimado
                        </a>
                    </div>
                </div>
            </section>

            {/* The Pain Points Section */}
            <section className="py-24 px-6 border-y border-white/5 bg-[#070708]">
                <div className="mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <FadeIn direction="right">
                            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-8 leading-tight">
                                Por qué los propietarios <br />
                                <span className="text-white/40 italic font-medium text-2xl md:text-4xl">dicen que no a otros asesores...</span>
                            </h2>
                            <p className="text-white/50 text-lg mb-10">
                                Enviar un PDF por WhatsApp ya no es suficiente. El cliente de hoy busca **certeza, diseño y transparencia**.
                            </p>
                            <div className="space-y-6">
                                {[
                                    { p: "No hay reportes de avance", s: "Portal Propietario 24/7" },
                                    { p: "Imagen poco profesional", s: "Diseño Elite de Ultra-Lujo" },
                                    { p: "Feedback de visitas perdido", s: "Sistema IA de Seguimiento" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                        <div className="p-2 bg-red-500/10 rounded-lg">
                                            <X className="h-4 w-4 text-red-500/50" />
                                        </div>
                                        <span className="text-xs text-white/40 line-through flex-1">{item.p}</span>
                                        <ArrowRight className="h-3 w-3 text-white/20" />
                                        <div className="p-2 bg-cima-gold/10 rounded-lg">
                                            <CheckCircle2 className="h-4 w-4 text-cima-gold" />
                                        </div>
                                        <span className="text-xs text-cima-gold font-bold">{item.s}</span>
                                    </div>
                                ))}
                            </div>
                        </FadeIn>

                        <FadeIn direction="left">
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-cima-gold/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full pointer-events-none" />
                                <div className="relative bg-white/[0.03] border border-white/10 rounded-[40px] p-8 md:p-12 backdrop-blur-md">
                                    <Smartphone className="h-10 w-10 text-cima-gold mb-8" />
                                    <h3 className="text-2xl font-heading font-bold mb-6">"El 73% de los propietarios eligen al asesor que les ofrece seguimiento digital."</h3>
                                    <p className="text-white/40 text-sm italic">
                                        — Fuente: Reporte de Tendencias Inmobiliarias 2025.
                                    </p>
                                    <div className="mt-10 pt-10 border-t border-white/10">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-full bg-cima-gold/20 flex items-center justify-center">
                                                <TrendingUp className="h-6 w-6 text-cima-gold" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-white text-sm">Aumento en exclusivas</p>
                                                <p className="text-cima-gold font-mono text-xl font-black">+42%</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* ROI Calculator Section */}
            <section id="roi" className="py-24 px-6 relative">
                <div className="mx-auto max-w-6xl">
                    <MasterRoiCalculator />
                </div>
            </section>

            {/* Bento Features */}
            <section className="py-24 px-6 bg-[#070708]">
                <div className="mx-auto max-w-6xl">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">Ecosistema Propietario-Asesor</h2>
                        <p className="text-white/40 max-w-2xl mx-auto">Toda la potencia de Cima Pro, empaquetada para tu crecimiento personal.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {FEATURES.map((f, i) => (
                            <FadeIn key={f.title} delay={i * 0.1}>
                                <TiltCard className="h-full">
                                    <div className="h-full bg-white/[0.02] border border-white/5 p-10 rounded-[32px] hover:border-cima-gold/40 transition-all group flex flex-col items-center text-center">
                                        <div className="h-16 w-16 rounded-2xl bg-cima-gold/10 border border-cima-gold/20 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-cima-gold/20 transition-all duration-500 shadow-xl shadow-cima-gold/5">
                                            <f.icon className="h-8 w-8 text-cima-gold" />
                                        </div>
                                        <h3 className="text-xl font-heading font-bold mb-4 tracking-tight">{f.title}</h3>
                                        <p className="text-sm text-white/50 leading-relaxed font-medium">{f.desc}</p>
                                    </div>
                                </TiltCard>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* Comparison Table */}
            <section className="py-24 px-6 relative">
                <div className="mx-auto max-w-5xl">
                    <div className="text-center mb-16">
                        <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-[0.4em] mb-4 block">Análisis de Mercado</span>
                        <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">¿Por qué Master Template?</h2>
                        <p className="text-white/40">Comparativa contra el desarrollo tradicional y plataformas genéricas.</p>
                    </div>

                    <div className="rounded-[40px] border border-white/10 overflow-hidden bg-white/[0.01]">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 border-b border-white/10">
                                <tr>
                                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/40">Característica</th>
                                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/40">Tradicional</th>
                                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-cima-gold bg-cima-gold/5">Master Template</th>
                                </tr>
                            </thead>
                            <tbody className="text-xs md:text-sm font-medium">
                                {[
                                    { f: "Costo de Inicio", t: "$150,000 MXN+", m: "Desde $14,900 MXN", good: true },
                                    { f: "Tiempo de Entrega", t: "3–6 meses", m: "< 24 horas", good: true },
                                    { f: "Portal Propietario", t: "No incluido / Manual", m: "Nativo Automatizado", good: true },
                                    { f: "Mantenimiento", t: "$5,000/mes+", m: "Incluido en tu plan", good: true },
                                    { f: "IA e Inteligencia", t: "Costo extra masivo", m: "Integrado en el core", good: true }
                                ].map((row, i) => (
                                    <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                        <td className="p-6 text-white/80">{row.f}</td>
                                        <td className="p-6 text-white/30">{row.t}</td>
                                        <td className="p-6 text-cima-gold font-bold bg-cima-gold/[0.02]">{row.m}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-24 px-6 bg-[#0A0A0B] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cima-gold/5 rounded-full blur-[150px] -mr-96 -mt-96 pointer-events-none" />

                <div className="mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-6xl font-heading font-bold mb-4 tracking-tight">Elige tu Nivel de Servicio</h2>
                        <p className="text-white/40 max-w-2xl mx-auto italic font-medium">Solo aceptamos 3 asesores por zona para garantizar exclusividad tecnológica.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                        {[
                            {
                                name: "Starter",
                                price: "$14,900",
                                desc: "Para el asesor que busca diferenciarse hoy mismo.",
                                features: ["Landing Page Elite", "1 Portal Propietario Activo", "QR de Venta Inteligente", "Hosting Incluido"],
                                cta: "Comenzar hoy mismo",
                                popular: false
                            },
                            {
                                name: "Professional",
                                price: "$29,900",
                                desc: "Para el asesor Top manejando exclusivas constantes.",
                                features: ["Todo en Starter", "5 Portales Propietarios", "Feedback IA Automatico", "Soporte VIP WhatsApp"],
                                highlight: true,
                                popular: true,
                                cta: "Activar mi Licencia Pro"
                            },
                            {
                                name: "Team / Agency",
                                price: "$49,900",
                                desc: "La estructura para inmobiliarias que dominan zonas.",
                                features: ["Todo en Pro", "Multi-Asesores (Hasta 3)", "Inventario Ilimitado", "Dominio .com Propio"],
                                cta: "Escalar mi Agencia",
                                popular: false
                            }
                        ].map((plan, i) => (
                            <div
                                key={plan.name}
                                className={`p-10 rounded-[50px] border flex flex-col h-full transition-all duration-700 relative overflow-hidden group ${plan.highlight ? "bg-cima-card border-cima-gold shadow-[0_50px_100px_-20px_rgba(200,169,110,0.2)] lg:scale-105 z-10" : "bg-white/[0.02] border-white/5"}`}
                            >
                                {plan.popular && (
                                    <div className="absolute top-6 right-10 bg-cima-gold text-black text-[9px] font-black uppercase tracking-widest py-1.5 px-4 rounded-full">Más Popular</div>
                                )}
                                <h3 className="text-xl font-heading font-bold mb-2 group-hover:text-cima-gold transition-colors">{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mb-8">
                                    <span className="text-5xl font-black text-cima-gold tracking-tighter">{plan.price}</span>
                                    <span className="text-xs text-white/40 font-mono font-bold uppercase tracking-widest">MXN</span>
                                </div>
                                <p className="text-sm text-white/50 mb-10 leading-relaxed h-12 font-medium">{plan.desc}</p>
                                <ul className="space-y-5 mb-12 flex-1">
                                    {plan.features.map(f => (
                                        <li key={f} className="flex items-center gap-4 text-xs font-bold text-white/70">
                                            <div className="h-5 w-5 rounded-full bg-cima-gold/10 flex items-center justify-center shrink-0">
                                                <CheckCircle2 className="h-3 w-3 text-cima-gold " />
                                            </div>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href="/onboarding"
                                    className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-center transition-all duration-500 shadow-xl ${plan.highlight ? "bg-cima-gold text-black hover:scale-105" : "bg-white/5 text-white hover:bg-white/10"}`}
                                >
                                    {plan.cta}
                                </Link>

                                {/* Availability Note */}
                                <div className="mt-6 flex items-center justify-center gap-2 opacity-50 text-[9px] font-mono font-bold uppercase tracking-widest">
                                    <Clock className="h-3 w-3" />
                                    Entrega en 24h
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Enterprise Bridge */}
            <section className="py-24 px-6 border-y border-white/5 bg-gradient-to-b from-transparent to-cima-gold/[0.02] relative">
                <div className="mx-auto max-w-4xl text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8">
                        <Cpu className="h-3.5 w-3.5 text-cima-gold-light" />
                        <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-cima-gold-light">Nivel Enterprise</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-heading font-bold mb-8 text-white tracking-tight">¿Necesitas algo a medida?</h2>
                    <p className="text-white/50 mb-12 text-lg leading-relaxed max-w-2xl mx-auto font-medium">
                        Si eres una franquicia con +10 asesores, necesitas tu propia base de datos, integraciones CRM profundas e IA propietaria entrenada con tus datos.
                    </p>
                    <Link
                        href="/pro"
                        className="group inline-flex items-center gap-4 text-cima-gold font-black text-xs md:text-sm uppercase tracking-[0.3em] hover:gap-6 transition-all bg-cima-gold/5 border border-cima-gold/20 px-10 py-5 rounded-2xl shadow-2xl"
                    >
                        Explorar Cima Pro <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 px-6 border-t border-white/5 relative z-10">
                <div className="mx-auto max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 justify-between items-center gap-12 mb-20">
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <Cpu className="h-6 w-6 text-cima-gold" />
                                <span className="text-lg font-black uppercase tracking-[0.2em]">Master Template <span className="text-cima-gold">Pro</span></span>
                            </div>
                            <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.35em] max-w-xs leading-relaxed">
                                Infraestructura de Grado Industrial para el Asesor que no se conforma.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-8 md:justify-end text-[10px] font-black uppercase tracking-widest text-white/40">
                            <Link href="/" className="hover:text-cima-gold transition-colors">Volver a Cima</Link>
                            <Link href="/onboarding" className="hover:text-cima-gold transition-colors">Onboarding</Link>
                            <Link href="/pro" className="hover:text-cima-gold transition-colors">Enterprise</Link>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-10 border-t border-white/5">
                        <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest">© {new Date().getFullYear()} Cima Tech Ecosystem. All rights reserved.</p>
                        <div className="flex items-center gap-4 opacity-40">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            <span className="text-[9px] font-mono uppercase tracking-widest">System Online</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
