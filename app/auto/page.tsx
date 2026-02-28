"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    ChevronRight,
    Play,
    Star,
    ShieldCheck,
    Zap,
    Car,
    Award
} from "lucide-react";
import AutoROI from "@/components/auto/AutoROI";
import AutoVault from "@/components/auto/AutoVault";
import AutoEcosystem from "@/components/auto/AutoEcosystem";
import AutoJourney from "@/components/auto/AutoJourney";
import AutoTestimonials from "@/components/auto/AutoTestimonials";
import LandingNav from "@/components/landing/landing-nav";

export default function CimaAutoPage() {
    const [quickValue, setQuickValue] = React.useState(550000);

    return (
        <main className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30">
            {/* High-Performance Aurora Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                {/* Aurora Blobs */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 50, 0],
                        y: [0, 30, 0]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-blue-600/15 blur-[140px] rounded-full"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        x: [0, -30, 0],
                        y: [0, 50, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-indigo-600/15 blur-[140px] rounded-full"
                />
                <motion.div
                    animate={{
                        opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[40%] h-[40%] bg-blue-400/5 blur-[120px] rounded-full"
                />

                {/* Refined Noise / Grain Surface */}
                <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
            </div>

            <LandingNav />

            {/* Hero Section - Elite Performance */}
            <section className="relative pt-32 pb-20 sm:pt-48 sm:pb-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
                    <div className="flex flex-col items-center text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8"
                        >
                            <Award className="w-4 h-4" />
                            <span>EL ESTÁNDAR ELITE EN COMPRA-VENTA</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl sm:text-8xl font-black tracking-tight mb-8 leading-[0.9]"
                        >
                            Vende tu auto <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-200 to-white text-glow">
                                al precio de mercado.
                            </span>
                        </motion.h1>

                        {/* Instant Valuator Tool Inside Hero */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="w-full max-w-xl bg-white/5 border border-white/10 p-6 sm:p-8 rounded-[2.5rem] backdrop-blur-2xl mb-12 shadow-2xl relative group"
                        >
                            {/* Inner Glow */}
                            <div className="absolute inset-0 bg-blue-500/5 rounded-[2.5rem] pointer-events-none group-hover:bg-blue-500/10 transition-colors" />

                            <div className="relative z-10 space-y-6 text-left">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] font-mono text-blue-400 uppercase tracking-widest mb-1">Precio Libre Deseado</p>
                                        <h3 className="text-3xl sm:text-4xl font-black tabular-nums">${quickValue.toLocaleString()}</h3>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Pérdida en Agencia</p>
                                        <p className="text-xl font-bold text-red-500">-${(quickValue * 0.2).toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="relative py-4">
                                    <input
                                        type="range"
                                        min="200000"
                                        max="3000000"
                                        step="20000"
                                        value={quickValue}
                                        onChange={(e) => setQuickValue(parseInt(e.target.value))}
                                        className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-400"
                                    />
                                    {/* Visual feedback pulses on move */}
                                    <motion.div
                                        animate={{ opacity: [0, 0.4, 0], scale: [0.8, 1.2, 0.8] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                        className="absolute -inset-4 bg-blue-500/10 blur-xl rounded-full pointer-events-none"
                                    />
                                </div>

                                <div className="flex items-center gap-4 pt-2 border-t border-white/5">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-6 h-6 rounded-full border border-gray-900 bg-gray-800 overflow-hidden">
                                                <img src={`https://i.pravatar.cc/50?u=${i}`} alt="user" className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-medium">
                                        <span className="text-blue-400 font-bold">+24 ofertas</span> recibidas en Monterrey hoy
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-col sm:flex-row gap-4 sm:gap-6"
                        >
                            <button className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-lg transition-all shadow-[0_0_40px_rgba(37,99,235,0.4)] flex items-center justify-center gap-3 group">
                                Listar mi Auto Ahora
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="px-10 py-5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-bold text-lg transition-all backdrop-blur-md flex items-center justify-center gap-3">
                                <Play className="w-5 h-5 fill-current" />
                                Ver Proceso de Venta
                            </button>
                        </motion.div>

                        {/* Social Proof / Stats */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mt-20 flex flex-wrap justify-center gap-12 border-t border-white/5 pt-12"
                        >
                            {[
                                { label: "Ventas Exitosas", val: "+1,200", icon: Car },
                                { label: "Ahorro Promedio", val: "$45K MXN", icon: Zap },
                                { label: "Satisfacción", val: "4.9/5.0", icon: Star }
                            ].map((stat, i) => (
                                <div key={i} className="flex flex-col items-center">
                                    <div className="flex items-center gap-2 text-blue-400 mb-1">
                                        <stat.icon className="w-5 h-5" />
                                        <span className="text-2xl font-bold text-white tracking-tight">{stat.val}</span>
                                    </div>
                                    <span className="text-xs text-gray-500 uppercase tracking-widest font-medium">{stat.label}</span>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>

                {/* Decorative Grid Lines */}
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
            </section>

            {/* Integrated Elite Components */}
            <AutoROI />
            <div className="relative">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/10 to-transparent" />
                <AutoVault />
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/10 to-transparent" />
            </div>
            <AutoJourney />
            <AutoEcosystem />
            <AutoTestimonials />

            {/* Final CTA Section */}
            <section className="py-24 sm:py-32 relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <div className="p-12 sm:p-20 rounded-[3rem] bg-gradient-to-br from-blue-600 to-indigo-700 relative overflow-hidden shadow-2xl">
                        <div className="relative z-10">
                            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">¿Listo para recuperar tu inversión?</h2>
                            <p className="text-blue-100 text-lg mb-10 opacity-90">Únete a la nueva era del comercio automotriz independiente.</p>
                            <button className="px-10 py-5 bg-white text-blue-600 rounded-2xl font-bold text-xl hover:scale-105 transition-transform shadow-xl">
                                Empezar ahora
                            </button>
                        </div>
                        {/* Abstract Background for CTA */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
                    </div>
                </div>
            </section>

            {/* Footer Refinement */}
            <footer className="py-12 border-t border-white/5 text-center text-gray-600 text-sm">
                <p>© 2026 Cima Auto. Tecnología de vanguardia para vendedores independientes.</p>
            </footer>
        </main>
    );
}
