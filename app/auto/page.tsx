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
import LandingNav from "@/components/landing/landing-nav";

export default function CimaAutoPage() {
    return (
        <main className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30">
            {/* High-Performance Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full" />

                {/* Subtle Carbon Fiber Pattern Overlay */}
                <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zm1 5v1H5z'/%3E%3C/g%3E%3C/svg%3E")` }} />
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
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl sm:text-8xl font-bold tracking-tight mb-8"
                        >
                            Vende tu auto como un <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500 text-glow">
                                Profesional del Futuro.
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-gray-400 text-xl max-w-3xl mb-12 leading-relaxed"
                        >
                            Cima Auto elimina las comisiones abusivas de las agencias y la inseguridad de los tratos directos. Tecnología, transparencia y el mejor precio del mercado.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4 sm:gap-6"
                        >
                            <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 group">
                                Valuar mi Auto Gratis
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-bold text-lg transition-all backdrop-blur-md flex items-center justify-center gap-2">
                                <Play className="w-5 h-5 fill-current" />
                                Ver Demo Elite
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
            <AutoVault />
            <AutoEcosystem />

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
