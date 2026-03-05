'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Home, Eye, BarChart3, MessageSquare, Shield, TrendingUp, Sparkles, Zap, Smartphone, Target, ArrowRight } from 'lucide-react';

const FloatingIcon = ({ icon: Icon, color, delay, label, x, y }: { icon: any, color: string, delay: number, label: string, x: string, y: string }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
            opacity: 1,
            scale: 1,
            y: [0, -15, 0],
            rotate: [0, 5, -5, 0]
        }}
        transition={{
            opacity: { delay, duration: 0.8 },
            scale: { delay, duration: 0.8 },
            y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: delay * 2 },
            rotate: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: delay * 2 }
        }}
        className="absolute hidden md:flex flex-col items-center gap-2 pointer-events-none"
        style={{ left: x, top: y }}
    >
        <div className={`p-4 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl ${color}`}>
            <Icon className="w-6 h-6" />
        </div>
        <div className="px-3 py-1 rounded-full bg-white/5 backdrop-blur-md border border-white/10">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{label}</span>
        </div>
    </motion.div>
);

// Grou-style highlight word component
const Highlight = ({ children }: { children: React.ReactNode }) => (
    <span className="relative inline-block">
        <span className="relative z-10">{children}</span>
        <span className="absolute inset-0 -skew-x-2 bg-cima-gold/20 rounded-md" />
    </span>
);

export const Hero = () => {
    return (
        <section className="relative min-h-[95vh] flex flex-col items-center justify-center pt-32 pb-20 px-4 overflow-hidden">
            {/* Animated Dot Grid Background (Grou style) */}
            <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                    backgroundImage: 'radial-gradient(circle, rgba(200,169,110,0.3) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />
            {/* Background Glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-cima-gold/8 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Floating Icons (Grou style) */}
            <FloatingIcon icon={Home} color="text-cima-gold" delay={0.2} label="Propiedades" x="12%" y="25%" />
            <FloatingIcon icon={Eye} color="text-blue-400" delay={0.4} label="Visitas" x="82%" y="28%" />
            <FloatingIcon icon={BarChart3} color="text-purple-400" delay={0.6} label="Analíticos" x="15%" y="65%" />
            <FloatingIcon icon={MessageSquare} color="text-green-400" delay={0.8} label="Feedback" x="80%" y="68%" />
            <FloatingIcon icon={Shield} color="text-cima-gold" delay={1.0} label="Seguridad" x="5%" y="45%" />
            <FloatingIcon icon={Zap} color="text-amber-400" delay={1.2} label="Automatización" x="90%" y="48%" />

            {/* Content */}
            <div className="relative z-10 max-w-6xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
                >
                    <Sparkles className="w-4 h-4 text-cima-gold" />
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-cima-gold">
                        El Nuevo Estándar de Venta Inmobiliaria
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.1 }}
                    className="text-5xl md:text-8xl lg:text-[110px] font-black text-white tracking-tighter leading-[0.88] mb-8"
                >
                    No vendas casas.<br />
                    Vende{' '}<Highlight>Certeza.</Highlight>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed"
                >
                    La infraestructura digital de ultra-lujo que convierte a los asesores comunes en <strong className="text-white font-bold">plataformas tecnológicas</strong> de alto rendimiento.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <button className="group w-full sm:w-auto px-10 py-5 bg-cima-gold text-black font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-[0_20px_40px_-10px_rgba(200,169,110,0.4)] flex items-center justify-center gap-3">
                        Lanzar mi plataforma
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 text-white font-bold text-sm rounded-2xl hover:bg-white/10 transition-all">
                        Ver simulador de impacto →
                    </button>
                </motion.div>

                {/* Sub-text stats / trust */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                    className="mt-20 flex flex-wrap justify-center gap-10 opacity-30 grayscale"
                >
                    <div className="flex items-center gap-3">
                        <Target className="w-5 h-5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">+42% Cierres</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Mobile First</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <TrendingUp className="w-5 h-5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">12x ROI</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
