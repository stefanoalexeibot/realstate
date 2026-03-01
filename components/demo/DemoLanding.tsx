"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    ArrowRight, Sparkles, Phone, Star, MapPin,
    Camera, Shield, TrendingUp, Clock, CheckCircle2,
    Bed, Bath, Maximize, Car, Calculator, Rocket,
    Zap, MessageCircle, BarChart3
} from "lucide-react";
import type { PlanConfig } from "@/lib/config/demo-plans";

interface DemoLandingProps {
    plan: PlanConfig;
}

/* ─── ROI Calculator ─────────────────────────────────────────── */
function ROICalculator() {
    const [propertyValue, setPropertyValue] = useState(8);

    const commission = propertyValue * 0.06;
    const traditionalMonths = 6;
    const cimaMonths = 1;
    const monthsSaved = traditionalMonths - cimaMonths;
    const monthlyCost = propertyValue * 0.003;
    const savedMoney = monthlyCost * monthsSaved;

    return (
        <section className="px-6 py-16 border-t border-white/5">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-10"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cima-gold/10 border border-cima-gold/20 mb-4">
                        <Calculator className="h-3.5 w-3.5 text-cima-gold" />
                        <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-cima-gold">calculadora de impacto</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-heading font-bold mb-3">¿Cuánto ahorras con nosotros?</h2>
                    <p className="text-sm text-white/40">Ajusta el valor de tu propiedad y ve el impacto financiero</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/[0.03] border border-white/10 rounded-2xl p-8"
                >
                    {/* Slider */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Valor de la propiedad</span>
                            <span className="text-xl font-heading font-bold text-cima-gold">${propertyValue}M MXN</span>
                        </div>
                        <input
                            type="range"
                            min={2}
                            max={30}
                            step={0.5}
                            value={propertyValue}
                            onChange={(e) => setPropertyValue(parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cima-gold [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-cima-gold/30 [&::-webkit-slider-thumb]:cursor-grab"
                        />
                        <div className="flex justify-between text-[8px] text-white/20 font-mono mt-1">
                            <span>$2M</span>
                            <span>$30M</span>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 text-center">
                            <Clock className="h-4 w-4 text-cima-gold mx-auto mb-2" />
                            <p className="text-2xl font-heading font-bold text-white">{monthsSaved}</p>
                            <p className="text-[7px] text-white/30 uppercase font-bold tracking-wider">Meses Ahorrados</p>
                        </div>
                        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 text-center">
                            <TrendingUp className="h-4 w-4 text-green-400 mx-auto mb-2" />
                            <p className="text-2xl font-heading font-bold text-green-400">${savedMoney.toFixed(1)}M</p>
                            <p className="text-[7px] text-white/30 uppercase font-bold tracking-wider">Ahorro Estimado</p>
                        </div>
                        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 text-center col-span-2 md:col-span-1">
                            <Zap className="h-4 w-4 text-cima-gold mx-auto mb-2" />
                            <p className="text-2xl font-heading font-bold text-cima-gold">${commission.toFixed(1)}M</p>
                            <p className="text-[7px] text-white/30 uppercase font-bold tracking-wider">Comisión 6%</p>
                        </div>
                    </div>

                    <div className="mt-6 p-3 bg-green-500/5 border border-green-500/10 rounded-xl text-center">
                        <p className="text-[10px] text-green-400 font-bold">
                            💡 Tu inversión se recupera en ahorro de mantenimiento y tiempo de mercado
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

/* ─── Onboarding Section ─────────────────────────────────────── */
function OnboardingSection() {
    const steps = [
        { icon: MessageCircle, label: "Agendar Cita", desc: "Nos contactas por WhatsApp o formulario", time: "5 min" },
        { icon: Camera, label: "Sesión Fotográfica", desc: "Fotos profesionales y tour virtual", time: "Día 1" },
        { icon: Rocket, label: "Publicación", desc: "Landing propia + portales + redes sociales", time: "Día 2" },
        { icon: BarChart3, label: "Seguimiento", desc: "Dashboard y portal del propietario activo", time: "Día 3" },
    ];

    return (
        <section className="px-6 py-16 border-t border-white/5">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-2xl md:text-3xl font-heading font-bold mb-3">¿Cómo empezamos?</h2>
                    <p className="text-sm text-white/40">En 3 días tu propiedad está en el mercado con tecnología premium</p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15 }}
                            className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-center hover:border-cima-gold/30 transition-all group"
                        >
                            <div className="h-12 w-12 rounded-xl bg-cima-gold/10 border border-cima-gold/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-cima-gold/20 transition-all">
                                <step.icon className="h-5 w-5 text-cima-gold" />
                            </div>
                            <span className="text-[8px] text-cima-gold font-mono uppercase tracking-widest">{step.time}</span>
                            <h3 className="text-xs font-bold text-white mt-1 mb-2">{step.label}</h3>
                            <p className="text-[10px] text-white/30 leading-relaxed">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default function DemoLanding({ plan }: DemoLandingProps) {
    const f = plan.features.landing;

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-white">
            {/* Hero */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden min-h-[80vh] flex items-center">
                {/* Aurora BG - only pro/premium */}
                {f.aurora && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <motion.div
                            className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-cima-gold/10 rounded-full blur-[120px]"
                            animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                            transition={{ duration: 6, repeat: Infinity }}
                        />
                        <motion.div
                            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]"
                            animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.8, 0.5] }}
                            transition={{ duration: 8, repeat: Infinity }}
                        />
                    </div>
                )}

                <div className="relative mx-auto max-w-5xl text-center">
                    {/* Badge */}
                    {f.animations ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cima-gold/10 border border-cima-gold/20 mb-8"
                        >
                            <Sparkles className="h-4 w-4 text-cima-gold" />
                            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-cima-gold">Garantía de 30 días</span>
                        </motion.div>
                    ) : (
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8">
                            <Sparkles className="h-4 w-4 text-white/40" />
                            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/40">Asesor Inmobiliario</span>
                        </div>
                    )}

                    {/* Title */}
                    {f.animations ? (
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold tracking-tight mb-8 leading-[1]"
                        >
                            <span className="block">Vendemos tu casa</span>
                            <span className="block text-cima-gold">en menos de 30 días.</span>
                            <span className="block text-white/40">Garantizado.</span>
                        </motion.h1>
                    ) : (
                        <h1 className="text-4xl md:text-6xl font-heading font-bold tracking-tight mb-8 leading-[1.1]">
                            <span className="block">Vendemos tu casa</span>
                            <span className="block text-white/60">con profesionalismo.</span>
                        </h1>
                    )}

                    {/* Description */}
                    <p className={`text-base md:text-lg max-w-2xl mx-auto mb-12 leading-relaxed ${f.animations ? "text-white/60" : "text-white/40"}`}>
                        Comisión desde 6%, se paga al escriturar. Exclusiva de 60 días con dedicación total.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button className={`w-full sm:w-auto px-8 py-4 font-heading font-bold rounded-2xl transition-all ${f.animations
                            ? "bg-cima-gold text-black hover:scale-105 shadow-xl shadow-cima-gold/20"
                            : "bg-white/10 text-white border border-white/20 hover:bg-white/20"
                            }`}>
                            Solicitar Valuación
                        </button>
                        <button className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-heading font-bold rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                            <Phone className="h-4 w-4" /> Contactar
                        </button>
                    </div>
                </div>
            </section>

            {/* Property Cards Section */}
            <section className="px-6 py-16 max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className={`text-2xl md:text-3xl font-heading font-bold mb-3 ${f.animations ? "" : "text-white/80"}`}>
                        Propiedades Exclusivas
                    </h2>
                    <p className="text-sm text-white/40">Portafolio actual de propiedades en venta</p>
                </div>

                <div className={`grid gap-6 ${f.gallery === "premium" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : f.gallery === "interactive" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 max-w-lg mx-auto"}`}>
                    {[
                        { name: "Residencia Las Misiones", price: "$12,400,000", beds: 4, baths: 3, m2: 320, img: "/cocina-despues.png" },
                        { name: "Depto. Torre LOVFT", price: "$4,200,000", beds: 2, baths: 2, m2: 120, img: "/estancia-despues.png" },
                        { name: "Residencia Contry Sol", price: "$8,900,000", beds: 3, baths: 3, m2: 250, img: "/recamara-despues.png" },
                    ].slice(0, f.gallery === "static" ? 1 : f.gallery === "interactive" ? 2 : 3).map((prop, i) => (
                        <motion.div
                            key={i}
                            initial={f.animations ? { opacity: 0, y: 20 } : {}}
                            whileInView={f.animations ? { opacity: 1, y: 0 } : {}}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15 }}
                            className={`rounded-2xl overflow-hidden border transition-all group ${f.animations
                                ? "bg-white/[0.03] border-white/10 hover:border-cima-gold/40 hover:shadow-xl hover:shadow-cima-gold/5"
                                : "bg-white/[0.02] border-white/5"
                                }`}
                        >
                            <div className="aspect-video relative overflow-hidden">
                                <img src={prop.img} alt={prop.name} className={`w-full h-full object-cover ${f.animations ? "group-hover:scale-105 transition-transform duration-500" : ""}`} />
                                {f.animations && (
                                    <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10">
                                        <span className="text-[8px] font-black text-cima-gold uppercase">Exclusiva</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-5">
                                <h3 className={`font-bold mb-1 ${f.animations ? "text-white text-base" : "text-white/70 text-sm"}`}>{prop.name}</h3>
                                <p className={`text-lg font-heading font-bold mb-4 ${f.animations ? "text-cima-gold" : "text-white/50"}`}>{prop.price}</p>
                                <div className="flex items-center gap-4 text-xs text-white/40">
                                    <span className="flex items-center gap-1"><Bed className="h-3 w-3" /> {prop.beds}</span>
                                    <span className="flex items-center gap-1"><Bath className="h-3 w-3" /> {prop.baths}</span>
                                    <span className="flex items-center gap-1"><Maximize className="h-3 w-3" /> {prop.m2}m²</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ROI Calculator - Premium only */}
            {f.roiCalculator && <ROICalculator />}

            {/* Social Proof - Premium only */}
            {f.socialProof && (
                <section className="px-6 py-16 border-t border-white/5">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-2xl font-heading font-bold mb-10">Lo que dicen nuestros clientes</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { name: "Familia García", text: "Vendieron nuestra casa en 18 días. Increíble experiencia.", stars: 5 },
                                { name: "Ing. Roberto M.", text: "El portal del propietario me mantuvo informado en todo momento.", stars: 5 },
                                { name: "Dra. Sofía L.", text: "Profesionalismo y tecnología. Los recomiendo al 100%.", stars: 5 },
                            ].map((t, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-left hover:border-white/20 transition-all"
                                >
                                    <div className="flex gap-0.5 mb-3">
                                        {[...Array(t.stars)].map((_, j) => (
                                            <Star key={j} className="h-3 w-3 text-cima-gold fill-cima-gold" />
                                        ))}
                                    </div>
                                    <p className="text-sm text-white/60 italic mb-4">&quot;{t.text}&quot;</p>
                                    <p className="text-xs font-bold text-white/80">{t.name}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Onboarding - Premium only */}
            {f.roiCalculator && <OnboardingSection />}

            {/* Footer */}
            <footer className="px-6 py-12 border-t border-white/5 text-center">
                <p className="text-xs text-white/20">© 2025 Demo — Powered by Cima Propiedades</p>
            </footer>
        </div>
    );
}
