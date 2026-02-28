"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    ArrowRight, Sparkles, Phone, Star, MapPin,
    Camera, Shield, TrendingUp, Clock, CheckCircle2,
    Bed, Bath, Maximize, Car
} from "lucide-react";
import type { PlanConfig } from "@/lib/config/demo-plans";

interface DemoLandingProps {
    plan: PlanConfig;
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
                        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-cima-gold/10 rounded-full blur-[120px] animate-pulse" />
                        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
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
                        <div key={i} className={`rounded-2xl overflow-hidden border transition-all group ${f.animations
                                ? "bg-white/[0.03] border-white/10 hover:border-cima-gold/40 hover:shadow-xl hover:shadow-cima-gold/5"
                                : "bg-white/[0.02] border-white/5"
                            }`}>
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
                        </div>
                    ))}
                </div>
            </section>

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
                                <div key={i} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-left">
                                    <div className="flex gap-0.5 mb-3">
                                        {[...Array(t.stars)].map((_, j) => (
                                            <Star key={j} className="h-3 w-3 text-cima-gold fill-cima-gold" />
                                        ))}
                                    </div>
                                    <p className="text-sm text-white/60 italic mb-4">&quot;{t.text}&quot;</p>
                                    <p className="text-xs font-bold text-white/80">{t.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="px-6 py-12 border-t border-white/5 text-center">
                <p className="text-xs text-white/20">© 2025 Demo — Powered by Cima Propiedades</p>
            </footer>
        </div>
    );
}
