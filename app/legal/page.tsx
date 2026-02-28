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
    Briefcase,
    Search
} from "lucide-react";
import { motion } from "framer-motion";
import FadeIn from "@/components/landing/fade-in";
import { useState } from "react";
import LegalActivityFeed from "@/components/legal/LegalActivityFeed";
import LegalEcosystem from "@/components/legal/LegalEcosystem";
import LegalShowcase from "@/components/legal/LegalShowcase";
import LegalROI from "@/components/legal/LegalROI";
import LegalVault from "@/components/legal/LegalVault";

export default function CimaLegalPage() {
    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-blue-500 selection:text-white overflow-x-hidden pt-12 md:pt-0">
            {/* Ultra-Premium Background Decor */}
            <div className="fixed inset-0 pointer-events-none z-0">
                {/* Dynamic Radial Glows */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[160px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[140px]"
                />

                {/* Technical Grid with Pulse */}
                <div className="absolute inset-0 opacity-[0.03] space-y-[60px]" style={{ backgroundImage: "linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)", backgroundSize: "60px 60px" }}>
                    <motion.div
                        animate={{ y: ["0%", "100%"] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="h-[2px] w-full bg-gradient-to-r from-transparent via-blue-500/50 to-transparent blur-sm"
                    />
                </div>

                {/* Grainy Texture Overlay */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
            </div>

            {/* Premium Navigation */}
            <nav className="fixed top-0 inset-x-0 h-20 border-b border-white/5 bg-[#020617]/40 backdrop-blur-2xl z-50">
                <div className="max-w-7xl mx-auto h-full px-6 md:px-12 flex items-center justify-between">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-2xl shadow-blue-500/20 group-hover:scale-110 transition-transform">
                            <Scale className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-heading font-black text-xl tracking-tight text-white leading-none">Cima <span className="text-blue-500 text-shadow-blue">Legal</span></span>
                            <span className="text-[8px] font-mono text-blue-400/60 uppercase tracking-[0.3em] mt-1">Foundational Node</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-10">
                        <div className="hidden md:flex items-center gap-8">
                            {['Ecosistema', 'Seguridad', 'Transparencia'].map((item) => (
                                <Link key={item} href="#" className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 hover:text-blue-400 transition-colors">
                                    {item}
                                </Link>
                            ))}
                        </div>
                        <Link
                            href="https://wa.me/528121980008"
                            className="relative group overflow-hidden px-8 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all"
                        >
                            <span className="relative z-10 text-[10px] font-black uppercase tracking-widest text-white group-hover:text-blue-400">Solicitar Demo</span>
                            <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300 opacity-10" />
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="relative z-10 pt-32 md:pt-48 pb-32">
                {/* Hero section refined */}
                <section className="max-w-7xl mx-auto px-6 md:px-12 mb-40 md:mb-60">
                    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr,0.9fr] gap-20 items-center">
                        <FadeIn direction="right">
                            <div className="relative">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-blue-500/5 border border-blue-500/20 mb-10"
                                >
                                    <span className="relative flex h-2 w-2">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-75" />
                                        <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
                                    </span>
                                    <span className="font-mono text-[9px] text-blue-400 font-black tracking-[0.3em] uppercase">Protocol Elite · 2024</span>
                                </motion.div>

                                <h1 className="font-heading font-black text-4xl sm:text-6xl lg:text-8xl mb-10 leading-[0.95] tracking-tighter text-white">
                                    La Firma <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-400 drop-shadow-sm">Imbatible</span>
                                </h1>

                                <p className="text-slate-400 text-lg md:text-xl leading-relaxed mb-14 max-w-xl font-medium">
                                    No gestionamos casos, operamos infraestructura de confianza. Cima Legal es el estándar de oro para despachos y notarías que exigen <strong className="text-white">superioridad técnica</strong> y transparencia total.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-8 items-center">
                                    <Link
                                        href="https://wa.me/528121980008"
                                        className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-blue-600 text-white font-black text-sm hover:bg-blue-500 hover:scale-[1.05] active:scale-[0.98] transition-all flex items-center justify-center gap-4 group shadow-[0_20px_50px_rgba(37,99,235,0.3)]"
                                    >
                                        Implementar Infraestructura
                                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </Link>

                                    <div className="flex items-center gap-5 p-4 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
                                        <div className="flex -space-x-4">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="w-12 h-12 rounded-2xl border-2 border-[#020617] bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-[10px] font-black text-blue-400 shadow-xl">
                                                    {['SC', 'JD', 'RM'][i - 1]}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[11px] font-black text-white uppercase tracking-widest leading-none mb-1">Socios Elite</p>
                                            <div className="flex items-center gap-2">
                                                <div className="flex gap-0.5">
                                                    {[1, 2, 3, 4, 5].map(s => <Sparkles key={s} className="w-2.5 h-2.5 text-blue-400 fill-blue-400" />)}
                                                </div>
                                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Verified Nodes</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>

                        <FadeIn direction="up" delay={0.2}>
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-blue-500/10 rounded-[40px] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                <div className="relative">
                                    <LegalActivityFeed />

                                    {/* Floating Stats Card */}
                                    <motion.div
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        className="absolute -bottom-10 -left-10 hidden xl:flex flex-col p-6 rounded-3xl bg-slate-900/80 backdrop-blur-3xl border border-white/10 shadow-2xl"
                                    >
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                                <ShieldCheck className="w-4 h-4 text-green-400" />
                                            </div>
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest">SLA de Respuesta</span>
                                        </div>
                                        <div className="flex items-end gap-2">
                                            <span className="text-3xl font-black text-white leading-none">99.9%</span>
                                            <span className="text-[9px] text-green-400 font-bold uppercase tracking-tighter mb-1">Uptime Jurídico</span>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </section>

                {/* ROI / Value Section */}
                <LegalROI />

                {/* Vault Section - New Premium Component */}
                <LegalVault />

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
