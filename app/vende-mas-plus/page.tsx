'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Cpu,
    ArrowRight,
    MessageSquare,
    CheckCircle2,
    Clock,
    Sparkles,
    ChevronDown,
    ShieldCheck,
    Smartphone,
    TrendingUp,
    Rocket
} from 'lucide-react';

// Import modular components
import { Hero } from './components/Hero';
import { Comparison } from './components/Comparison';
import { DashboardPreviews } from './components/DashboardPreviews';
import { RoiCalculator } from './components/RoiCalculator';
import { Pricing } from './components/Pricing';
import { PortalMarquee } from './components/PortalMarquee';
import { HowItWorks } from './components/HowItWorks';
import { Testimonials } from './components/Testimonials';
import { Features } from './components/Features';

/* ─── Live Activity Feed (Toast-style) ───────────────────────────── */
function LiveActivityFeed() {
    const [activities, setActivities] = useState<{ id: number, text: string, icon: any }[]>([]);

    useEffect(() => {
        const feed = [
            "Claudia R. generó un expediente digital en Monterrey.",
            "Nuevo Lead 'High-Value' capturado en Lomas del Sol.",
            "Asesor Premium activó Portal Propietario en San Pedro.",
            "Venta cerrada: Casa Contemporánea (Vía Aurum System).",
            "Solicitud de Onboarding VIP: Inmobiliaria Elite MTY.",
            "Interés 40% superior detectado en propiedad MLS: 45A2.",
            "Nuevo registro: 2 cupos restantes en preventa."
        ];

        let id = 0;
        const interval = setInterval(() => {
            const text = feed[Math.floor(Math.random() * feed.length)];
            const newActivity = { id: id++, text, icon: Sparkles };
            setActivities(prev => [newActivity, ...prev.slice(0, 2)]);
            setTimeout(() => {
                setActivities(prev => prev.filter(a => a.id !== newActivity.id));
            }, 5000);
        }, 8000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed bottom-24 right-6 md:bottom-10 md:right-10 z-[60] pointer-events-none flex flex-col gap-3 items-end">
            <AnimatePresence>
                {activities.map((activity) => (
                    <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: 50, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.9 }}
                        className="bg-black/60 backdrop-blur-2xl border border-white/10 px-6 py-4 rounded-3xl flex items-center gap-4 shadow-2xl"
                    >
                        <div className="p-2 bg-cima-gold/10 rounded-xl">
                            <activity.icon className="h-3.5 w-3.5 text-cima-gold" />
                        </div>
                        <span className="text-[10px] md:text-xs font-bold text-white/70 max-w-[200px]">
                            {activity.text}
                        </span>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}

const Footer = () => (
    <footer className="py-24 md:py-40 px-6 border-t border-white/5 relative z-10 bg-black">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-20 items-center">
                <div className="text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-cima-gold flex items-center justify-center">
                            <Cpu className="w-6 h-6 text-black" />
                        </div>
                        <span className="text-2xl font-black uppercase tracking-[0.2em] text-white">Aurum <span className="text-cima-gold">Plus</span></span>
                    </div>
                    <p className="text-white/30 text-xs md:text-sm font-bold uppercase tracking-[0.4em] max-w-sm mx-auto lg:mx-0 leading-relaxed">
                        Infraestructura de Grado Industrial para el Asesor que no se conforma.
                    </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
                    <div>
                        <p className="text-[10px] font-black text-cima-gold uppercase tracking-widest mb-6">Plataforma</p>
                        <ul className="space-y-4 text-xs font-bold text-white/30 uppercase tracking-widest">
                            <li><Link href="/" className="hover:text-white transition-colors">Volver a Cima</Link></li>
                            <li><Link href="/onboarding" className="hover:text-white transition-colors">Onboarding</Link></li>
                            <li><Link href="/demo-live" className="hover:text-white transition-colors">Demo en Vivo</Link></li>
                        </ul>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-cima-gold uppercase tracking-widest mb-6">Empresa</p>
                        <ul className="space-y-4 text-xs font-bold text-white/30 uppercase tracking-widest">
                            <li><Link href="#" className="hover:text-white transition-colors">Sobre Aurum</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Contacto</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Soporte</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">© {new Date().getFullYear()} Aurum Tech Ecosystem. Made in México.</p>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span className="text-[10px] font-mono text-white/30 uppercase">System Online</span>
                    </div>
                    <span className="text-[10px] font-mono text-white/30 uppercase">v4.2.1 Stable</span>
                </div>
            </div>
        </div>
    </footer>
);

export default function VendeMasPlusPage() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        setMousePos({ x: e.clientX, y: e.clientY });
    };

    return (
        <div
            onMouseMove={handleMouseMove}
            className="min-h-screen bg-[#000] text-white selection:bg-cima-gold/30 scroll-smooth relative overflow-x-hidden"
        >
            {/* Searchlight Effect */}
            <div
                className="pointer-events-none fixed inset-0 z-50 transition-opacity opacity-0 md:opacity-100"
                style={{
                    background: `radial-gradient(800px at ${mousePos.x}px ${mousePos.y}px, rgba(200, 169, 110, 0.05), transparent 80%)`
                }}
            />

            <LiveActivityFeed />

            {/* Navbar Premium */}
            <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-white/5 backdrop-blur-2xl bg-black/40">
                <div className="mx-auto max-w-7xl h-20 px-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cima-gold flex items-center justify-center">
                            <Cpu className="w-5 h-5 text-black" />
                        </div>
                        <span className="text-xl font-black uppercase tracking-[0.2em] hidden sm:block">Aurum <span className="text-cima-gold">Plus</span></span>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-[9px] font-black font-mono text-red-500 uppercase tracking-widest">Solo 2 cupos en Monterrey</span>
                        </div>
                        <Link
                            href="/onboarding"
                            className="bg-cima-gold text-black px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-lg shadow-cima-gold/10"
                        >
                            Asegurar lugar
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Content Assembly */}
            <main>
                <Hero />

                {/* Simple Stats Transition */}
                <div className="py-20 bg-[#020308] border-y border-white/5">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-wrap justify-center md:justify-between gap-12 font-black text-center">
                            <div>
                                <p className="text-4xl md:text-6xl text-white tracking-tighter mb-2">320+</p>
                                <p className="text-[10px] text-white/30 uppercase tracking-[0.3em]">Asesores Elite</p>
                            </div>
                            <div>
                                <p className="text-4xl md:text-6xl text-cima-gold tracking-tighter mb-2">$850M+</p>
                                <p className="text-[10px] text-white/30 uppercase tracking-[0.3em]">Valor Gestionado</p>
                            </div>
                            <div>
                                <p className="text-4xl md:text-6xl text-white tracking-tighter mb-2">98%</p>
                                <p className="text-[10px] text-white/30 uppercase tracking-[0.3em]">Éxito en Exclusivas</p>
                            </div>
                        </div>
                    </div>
                </div>

                <PortalMarquee />
                <Comparison />
                <HowItWorks />
                <Features />
                <DashboardPreviews />
                <RoiCalculator />
                <Testimonials />
                <Pricing />

                {/* Final CTA Bridge */}
                <section className="py-32 md:py-48 px-6 bg-gradient-to-t from-cima-gold/10 to-transparent relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cima-gold/20 blur-[150px] rounded-full pointer-events-none" />
                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="mb-10">
                            <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                                <Rocket className="w-12 h-12 text-cima-gold mx-auto mb-8" />
                            </motion.div>
                            <h2 className="text-4xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-[0.9]">
                                El futuro no espera.<br />
                                <span className="text-cima-gold">Tus cierres tampoco.</span>
                            </h2>
                            <p className="text-lg md:text-2xl text-white/50 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                                En 24 horas, tu negocio inmobiliario puede pasar de "común" a "infraestructura de ultra-lujo".
                            </p>
                            <Link
                                href="/onboarding"
                                className="inline-flex items-center gap-4 px-12 py-6 bg-cima-gold text-black font-black uppercase tracking-[0.3em] rounded-3xl hover:scale-105 transition-all shadow-[0_30px_60px_-15px_rgba(200,169,110,0.4)] text-xs md:text-sm"
                            >
                                Activar mi Ecosystem <ArrowRight className="h-5 w-5" />
                            </Link>
                            <p className="mt-8 text-[10px] font-mono text-white/20 uppercase tracking-widest">Sin contratos de permanencia · Resultados garantizados en el Onboarding</p>
                        </motion.div>
                    </div>
                </section>
            </main>

            <Footer />

            {/* Mobile Bottom Bar */}
            <div className="fixed bottom-0 inset-x-0 z-[100] md:hidden">
                <div className="bg-[#0A0A0B]/80 backdrop-blur-2xl border-t border-white/10 p-5 flex items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            <p className="text-[9px] font-black text-cima-gold uppercase tracking-widest">Preventa Alpha</p>
                        </div>
                        <p className="text-xs font-black text-white uppercase tracking-tighter">Solo 2 cupos libres</p>
                    </div>
                    <Link
                        href="/onboarding"
                        className="px-6 py-3 bg-cima-gold text-black text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-cima-gold/20"
                    >
                        Asegurar
                    </Link>
                </div>
            </div>
        </div>
    );
}
