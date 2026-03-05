'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, ShieldCheck, Zap, ArrowRight, MessageSquare, Star, Sparkles } from 'lucide-react';

const CountdownTimer = () => {
    const [timeLeft, setTimeLeft] = useState({ hours: 71, minutes: 59, seconds: 59 });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                const totalSeconds = prev.hours * 3600 + prev.minutes * 60 + prev.seconds - 1;
                if (totalSeconds <= 0) return { hours: 71, minutes: 59, seconds: 59 };
                return {
                    hours: Math.floor(totalSeconds / 3600),
                    minutes: Math.floor((totalSeconds % 3600) / 60),
                    seconds: totalSeconds % 60
                };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const pad = (n: number) => String(n).padStart(2, '0');

    return (
        <div className="inline-flex items-center gap-4 px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-2xl">
            <Clock className="w-4 h-4 text-red-500 animate-pulse" />
            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-red-500">
                Oferta Especial expira en:
            </span>
            <div className="flex gap-1 font-mono text-sm md:text-xl font-black text-white">
                <span>{pad(timeLeft.hours)}</span>
                <span className="opacity-30">:</span>
                <span>{pad(timeLeft.minutes)}</span>
                <span className="opacity-30">:</span>
                <span>{pad(timeLeft.seconds)}</span>
            </div>
        </div>
    );
};

const PricingCard = ({ plan, highlight }: { plan: any, highlight: boolean }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        className={`p-10 md:p-12 rounded-[40px] border flex flex-col h-full relative overflow-hidden transition-all duration-700 ${highlight
                ? 'bg-cima-card border-cima-gold shadow-[0_40px_100px_-20px_rgba(200,169,110,0.3)] z-10 scale-[1.05]'
                : 'bg-white/[0.02] border-white/5'
            }`}
    >
        {highlight && (
            <div className="absolute top-8 right-10 bg-cima-gold text-black text-[9px] font-black uppercase tracking-widest py-1.5 px-4 rounded-full">
                Más Popular
            </div>
        )}

        <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-mono font-bold text-cima-gold uppercase tracking-widest">
                    {plan.slots}
                </span>
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-white mb-2">{plan.name}</h3>
            <p className="text-xs md:text-sm text-white/40 leading-relaxed max-w-[200px]">
                {plan.desc}
            </p>
        </div>

        <div className="flex items-baseline gap-2 mb-12">
            <span className="text-5xl md:text-7xl font-black text-white tracking-tighter">{plan.price}</span>
            <span className="text-xs font-mono font-bold text-white/20 uppercase tracking-widest">MXN</span>
        </div>

        <div className="space-y-6 mb-12 flex-1 pt-10 border-t border-white/5">
            {plan.features.map((f: string, i: number) => (
                <div key={i} className="flex items-start gap-4">
                    <div className="p-1 rounded-full bg-cima-gold/10 border border-cima-gold/20 shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-cima-gold" />
                    </div>
                    <span className="text-xs md:text-sm font-bold text-white/60">{f}</span>
                </div>
            ))}
        </div>

        <div className="mt-auto">
            <div className="flex items-center gap-2 mb-6 text-[10px] text-cima-gold font-mono font-bold uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5" />
                Entrega: {plan.delivery}
            </div>
            <button className={`w-full py-5 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${highlight
                    ? 'bg-cima-gold text-black hover:scale-[1.02] shadow-xl'
                    : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
                }`}>
                {plan.cta} <ArrowRight className="h-4 w-4" />
            </button>
            {highlight && (
                <div className="mt-8 pt-8 border-t border-white/5 flex items-center gap-4 animate-pulse">
                    <div className="p-3 bg-green-500/10 rounded-2xl border border-green-500/20">
                        <MessageSquare className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-green-500 uppercase tracking-widest">Onboarding VIP</p>
                        <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest">Asesoría 1-a-1 Incluida</p>
                    </div>
                </div>
            )}
        </div>
    </motion.div>
);

export const Pricing = () => {
    const plans = [
        {
            name: "Starter",
            price: "$14,900",
            desc: "Infraestructura básica para el asesor independiente.",
            slots: "2/3 Disponibles",
            delivery: "48 Horas",
            cta: "Comenzar hoy",
            features: [
                "Landing Page Ultra-Lujo",
                "Portal del Propietario (1 activo)",
                "Generador de Contratos PDF",
                "QR Inteligente",
                "Hosting Premium 1 año"
            ]
        },
        {
            name: "Professional",
            price: "$29,900",
            desc: "Dominio total de zona para asesores de alto rendimiento.",
            slots: "¡ÚLTIMO CUPO!",
            delivery: "72 Horas",
            cta: "Activar Licencia Pro",
            features: [
                "Todo en Starter +",
                "Hasta 5 Portales Propietario",
                "Analíticos del Command Center",
                "Bandeja de Mensajes Unificada",
                "IA Nurture (Automatización)"
            ]
        },
        {
            name: "Team / Agency",
            price: "$49,900",
            desc: "La plataforma definitiva para agencias de lujo.",
            slots: "Agotado / Lista de Espera",
            delivery: "7-10 Días",
            cta: "Unirse a la lista",
            features: [
                "Todo en Professional +",
                "Propiedades Ilimitadas",
                "Multi-Agentes (hasta 4)",
                "Calculadora ROI Lead Magnet",
                "Dominio .com propio + Branding"
            ]
        }
    ];

    return (
        <section className="py-24 md:py-40 px-4 relative overflow-hidden bg-[#020308]">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cima-gold/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20 md:mb-32">
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="mb-8">
                        <CountdownTimer />
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-8"
                    >
                        Elige tu <br className="hidden md:block" />
                        <span className="text-cima-gold">Nivel de Impacto.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-white/40 max-w-2xl mx-auto text-lg leading-relaxed italic"
                    >
                        "Solo aceptamos un número limitado de asesores por zona para garantizar que la exclusividad tecnológica sea tu ventaja competitiva."
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 pb-20">
                    {plans.map((plan, i) => (
                        <PricingCard key={i} plan={plan} highlight={i === 1} />
                    ))}
                </div>

                {/* Scarcity Bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-10 p-8 rounded-[30px] bg-white/[0.02] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto"
                >
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-cima-gold/10 rounded-2xl border border-cima-gold/30">
                            <Sparkles className="h-8 w-8 text-cima-gold" />
                        </div>
                        <div className="text-left">
                            <p className="text-lg font-black text-white uppercase tracking-tighter mb-1">Impacto Aurum Certificado</p>
                            <p className="text-xs text-white/30 uppercase tracking-widest font-bold">Único sistema en México con este nivel de pulido</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-center px-8 border-x border-white/5">
                            <p className="text-2xl font-black text-white">98%</p>
                            <p className="text-[8px] text-white/30 font-bold uppercase tracking-widest">Satisfacción</p>
                        </div>
                        <div className="text-center px-8">
                            <p className="text-2xl font-black text-white">24h</p>
                            <p className="text-[8px] text-white/30 font-bold uppercase tracking-widest">Activación</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
