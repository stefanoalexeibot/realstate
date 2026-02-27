"use client";

import Link from "next/link";
import {
    ShieldCheck,
    Gavel,
    Scale,
    ArrowRight,
    Sparkles,
    Building2,
    Lock,
    FileText,
    Bell,
    CheckCircle2,
    Clock,
    UserCheck,
    Briefcase
} from "lucide-react";
import { motion } from "framer-motion";
import FadeIn from "@/components/landing/fade-in";
import { useState } from "react";
import LegalActivityFeed from "@/components/legal/LegalActivityFeed";
import LegalEcosystem from "@/components/legal/LegalEcosystem";
import LegalShowcase from "@/components/legal/LegalShowcase";

export default function CimaLegalPage() {
    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-blue-500 selection:text-white overflow-x-hidden">
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-slate-500/5 rounded-full blur-[120px]" />
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
            </div>

            {/* Navigation */}
            <nav className="fixed top-0 inset-x-0 h-20 border-b border-slate-800 bg-[#020617]/80 backdrop-blur-xl z-50">
                <div className="max-w-7xl mx-auto h-full px-4 sm:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
                            <Scale className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-heading font-black text-lg md:text-xl tracking-tight text-white">Cima <span className="text-blue-500">Legal</span></span>
                    </div>
                    <div className="flex items-center gap-4 md:gap-8">
                        <Link
                            href="https://wa.me/528121980008"
                            className="hidden md:block text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-blue-400 transition-colors"
                        >
                            Arquitectura Jurídica
                        </Link>
                        <Link
                            href="https://wa.me/528121980008"
                            className="px-6 py-2.5 rounded-full bg-blue-600 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20"
                        >
                            Solicitar Demo
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="pt-28 sm:pt-40 pb-28 relative z-10">
                {/* Hero */}
                <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-32 sm:mb-48">
                    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr,0.9fr] gap-16 lg:gap-24 items-center">
                        <FadeIn direction="right">
                            <div className="relative">
                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                    <span className="font-mono text-[10px] text-blue-400 font-bold tracking-[0.2em] uppercase">Protocol Legal · V2.0</span>
                                </span>
                                <h1 className="font-heading font-black text-4xl sm:text-6xl lg:text-7xl mb-8 leading-[1.05] tracking-tighter text-white">
                                    Soberanía Tecnológica para Despachos de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-slate-400">Élite</span>
                                </h1>
                                <p className="text-slate-400 text-lg sm:text-xl leading-relaxed mb-12 max-w-xl">
                                    Digitalizamos la confianza. Implementamos infraestructura de grado industrial para abogados y notarías que exigen transparencia total y seguridad absoluta.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-6 items-center">
                                    <Link
                                        href="https://wa.me/528121980008?text=Hola!%20Me%20interesa%20Cima%20Legal%20para%20mi%20despacho."
                                        className="w-full sm:w-auto h-16 px-10 rounded-2xl bg-blue-600 text-white font-bold text-base hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group shadow-2xl shadow-blue-900/20"
                                    >
                                        Implementar Cima Legal
                                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                    <div className="flex items-center gap-4">
                                        <div className="flex -space-x-3">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#020617] bg-slate-800 flex items-center justify-center text-[10px] font-bold text-blue-400">
                                                    {String.fromCharCode(74 + i)}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[10px] font-black text-white uppercase tracking-widest">+45 Firmas</p>
                                            <p className="text-[9px] text-slate-500 font-medium whitespace-nowrap">Nodos Jurídicos Activos</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>

                        <FadeIn direction="left" delay={0.2}>
                            <LegalActivityFeed />
                        </FadeIn>
                    </div>
                </section>

                {/* Ecosystem Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-32 sm:mb-48">
                    <div className="text-center mb-16 sm:mb-24">
                        <FadeIn>
                            <span className="text-blue-500 font-mono text-[10px] font-bold tracking-[0.3em] uppercase mb-4 block">Omni-Connected Systems</span>
                            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-black text-white mb-6 tracking-tight">
                                Arquitectura de Transparencia 360
                            </h2>
                            <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
                                Conectamos juzgados, notarias y clientes en un solo flujo de datos automatizado y en tiempo real.
                            </p>
                        </FadeIn>
                    </div>

                    <FadeIn delay={0.3}>
                        <LegalEcosystem />
                    </FadeIn>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 sm:mt-24">
                        {[
                            { title: "Monitor Judicial", desc: "Rastreo 24/7 de boletines oficiales y acuerdos publicados.", icon: Search },
                            { title: "Bóveda Segura", desc: "Encriptación AES-256 para expedientes críticos.", icon: ShieldCheck },
                            { title: "IA de Análisis", desc: "Resumen de acuerdos jurídicos complejos para clientes.", icon: Scale },
                            { title: "Sincronización RPP", desc: "Conexión con Registro Público para trámites notariales.", icon: Clock },
                        ].map((item, i) => (
                            <FadeIn key={i} delay={0.1 * i} className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-blue-500/20 transition-colors group">
                                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <item.icon className="h-6 w-6 text-blue-400" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                            </FadeIn>
                        ))}
                    </div>
                </section>

                {/* Showcase Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end mb-16">
                        <FadeIn>
                            <span className="text-blue-500 font-mono text-[10px] font-bold tracking-[0.3em] uppercase mb-4 block">Premium Interfaces</span>
                            <h2 className="text-3xl sm:text-5xl font-heading font-black text-white tracking-tight leading-tight">
                                La Experiencia del<br />Despacho Moderno
                            </h2>
                        </FadeIn>
                        <FadeIn delay={0.2}>
                            <p className="text-slate-400 text-lg max-w-md">
                                No solo resolvemos casos. Creamos una interfaz visual que enamora al cliente y da prestigio a tu firma.
                            </p>
                        </FadeIn>
                    </div>

                    <FadeIn delay={0.3}>
                        <LegalShowcase />
                    </FadeIn>
                </section>
            </main>

            {/* Sticky Footer CTA */}
            <div className="fixed bottom-6 inset-x-4 z-50 pointer-events-none">
                <div className="max-w-7xl mx-auto flex justify-center md:justify-end">
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="pointer-events-auto flex items-center gap-6 px-6 py-4 rounded-3xl bg-[#020617]/90 border border-blue-500/30 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                    >
                        <div className="hidden sm:block">
                            <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-0.5 animate-pulse">Agenda Disponible</p>
                            <p className="text-[11px] text-white font-bold">Reserva tu consultoría tecnológica</p>
                        </div>
                        <Link
                            href="https://wa.me/528121980008"
                            className="px-6 py-2.5 rounded-full bg-blue-600 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-blue-500 transition-all"
                        >
                            Solicitar Demo
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
