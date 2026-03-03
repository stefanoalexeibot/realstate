"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Home, Phone, MapPin, BedDouble, Bath, Ruler,
    Camera, Calendar, Shield, Star, ArrowRight, CheckCircle2,
    TrendingUp, Users as UsersIcon, Zap, ChevronLeft, ChevronRight, MessageSquare, Award, Eye, X, Send, Sparkles
} from "lucide-react";
import type { PlanConfig } from "@/lib/config/demo-plans";
import { type LiveMessage } from "./LiveDemoClient";

/**
 * Social proof component for Pro/Team plans
 */
function SocialProofToast({ tier }: { tier: string }) {
    const [visible, setVisible] = useState(false);
    const [count, setCount] = useState(12);

    useEffect(() => {
        if (tier === "basico") return;

        const timer = setTimeout(() => {
            setCount(Math.floor(8 + Math.random() * 8));
            setVisible(true);
        }, 3000);

        return () => clearTimeout(timer);
    }, [tier]);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="fixed bottom-6 left-6 z-[100] bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl flex items-center gap-3 max-w-[200px]"
                >
                    <div className="h-10 w-10 rounded-full bg-cima-gold/20 flex items-center justify-center shrink-0">
                        <UsersIcon className="h-5 w-5 text-cima-gold" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-white leading-tight">
                            <span className="text-cima-gold">{count} personas</span> viendo esta propiedad ahora
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[7px] text-white/40 font-bold uppercase tracking-widest">En tiempo real</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setVisible(false)}
                        className="absolute top-2 right-2 text-white/20 hover:text-white transition-colors"
                    >
                        <Zap className="h-2 w-2" />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/**
 * Tier-aware example landing. Starter=basic, Pro=animated, Team=premium.
 */
export default function DemoLandingExample({
    plan,
    onLeadCapture,
    onSendMessage,
    messages
}: {
    plan: PlanConfig;
    onLeadCapture?: (data: any) => void;
    onSendMessage?: (from: string, text: string, isAi?: boolean) => void;
    messages?: LiveMessage[];
}) {
    const f = plan.features.landing;
    const isTeam = plan.tier === "premium";
    const isPro = plan.tier === "profesional";
    const isStarter = plan.tier === "basico";

    // Accent color
    const accent = isTeam ? "cima-gold" : isPro ? "blue-400" : "gray-400";
    const accentBg = isTeam ? "bg-cima-gold" : isPro ? "bg-blue-400" : "bg-gray-400";
    const accentText = isTeam ? "text-cima-gold" : isPro ? "text-blue-400" : "text-gray-400";
    const accentBorder = isTeam ? "border-cima-gold/20" : isPro ? "border-blue-400/20" : "border-gray-400/20";

    const [activePhoto, setActivePhoto] = useState(0);
    const photos = ["/cocina-despues.png", "/estancia-despues.png", "/recamara-despues.png", "/cocina-despues.png"];

    // ROI Calculator State
    const [propertyValue, setPropertyValue] = useState(8500000);
    const commissionTraditional = propertyValue * 0.05;
    const commissionCima = propertyValue * 0.03;
    const savings = commissionTraditional - commissionCima;

    const handleTriggerLead = () => {
        if (onLeadCapture) {
            onLeadCapture({
                name: "Lead de Prueba (Demo)",
                phone: "81 0000 " + Math.floor(1000 + Math.random() * 9000),
                property: "Residencia Premium ΓÇö " + plan.name
            });
        }
    };

    const Wrapper = f.animations ? motion.div : "div";
    const anim = f.animations ? { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } } : {};
    const delayAnim = (d: number) => f.animations ? { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 }, transition: { delay: d } } : {};

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-white relative overflow-hidden">
            {/* ΓöÇΓöÇ Aurora BG (Team only) ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */}
            {f.aurora && (
                <>
                    <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cima-gold/[0.04] rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-blue-500/[0.03] rounded-full blur-[100px]" />
                </>
            )}

            {/* ΓöÇΓöÇ Hero ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */}
            <div className="relative">
                {/* Simple gradient bg for non-aurora */}
                {!f.aurora && (
                    <div className={`absolute inset-0 bg-gradient-to-br ${isPro ? "from-blue-900/30" : "from-gray-800/20"} via-[#0A0A0B] to-[#0A0A0B]`} />
                )}

                <div className="relative max-w-6xl mx-auto px-6 pt-8 pb-16">
                    {/* Nav */}
                    <div className="flex items-center justify-between mb-12 lg:mb-16">
                        <div className="flex items-center gap-2">
                            <div className={`h-8 w-8 rounded-lg ${isTeam ? "bg-cima-gold/10 border border-cima-gold/20" : "bg-white/10"} flex items-center justify-center`}>
                                <Home className={`h-4 w-4 ${isTeam ? "text-cima-gold" : "text-white"}`} />
                            </div>
                            <span className="text-sm font-bold tracking-tight">Tu Marca Aqu├¡</span>
                        </div>
                        <div className="flex items-center gap-4">
                            {!isStarter && <span className="text-xs text-white/40 hidden sm:block">Asesor Certificado</span>}
                            <button className={`${isTeam ? "bg-cima-gold text-black" : "bg-white text-black"} px-4 py-2 rounded-lg text-xs font-bold hover:scale-105 transition-all`}>
                                Contactar
                            </button>
                        </div>
                    </div>

                    {/* Hero Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <Wrapper {...anim}>
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${isTeam ? "bg-cima-gold/10 border border-cima-gold/20" : "bg-green-500/10 border border-green-500/20"} text-[9px] font-bold ${isTeam ? "text-cima-gold" : "text-green-400"} uppercase tracking-widest mb-4`}>
                                    <span className={`h-1.5 w-1.5 rounded-full ${isTeam ? "bg-cima-gold" : "bg-green-500"} animate-pulse`} />
                                    Disponible
                                </span>
                                <h1 className="text-3xl md:text-4xl font-heading font-black tracking-tight leading-tight mb-4">
                                    Residencia Premium
                                    <br />
                                    <span className="text-white/40">Colinas de San Jer├│nimo</span>
                                </h1>
                                <p className={`text-lg font-heading font-bold ${accentText} mb-6`}>$8,500,000 MXN</p>
                                <p className="text-sm text-white/40 leading-relaxed mb-8 max-w-md">
                                    {isStarter
                                        ? "Hermosa residencia de 320m┬▓ con acabados de lujo."
                                        : "Hermosa residencia de 320m┬▓ en una de las zonas m├ís exclusivas. Acabados de lujo, jard├¡n privado y vista panor├ímica a la monta├▒a."
                                    }
                                </p>
                            </Wrapper>

                            {/* Stats */}
                            <div className="grid grid-cols-4 gap-3 mb-8">
                                {[
                                    { icon: BedDouble, value: "4", label: "Rec├ímaras" },
                                    { icon: Bath, value: "3.5", label: "Ba├▒os" },
                                    { icon: Ruler, value: "320", label: "m┬▓" },
                                    { icon: Camera, value: "24", label: "Fotos" },
                                ].map((stat, i) => (
                                    <Wrapper key={i} {...delayAnim(0.2 + i * 0.1)}
                                        className={`${isTeam ? "bg-cima-gold/[0.03] border-cima-gold/10" : "bg-white/[0.03] border-white/5"} border rounded-xl p-3 text-center`}
                                    >
                                        <stat.icon className={`h-4 w-4 ${isTeam ? "text-cima-gold/30" : "text-white/20"} mx-auto mb-1`} />
                                        <p className="text-sm font-bold text-white">{stat.value}</p>
                                        <p className="text-[7px] text-white/30 uppercase font-bold tracking-wider">{stat.label}</p>
                                    </Wrapper>
                                ))}
                            </div>

                            {/* CTA */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleTriggerLead}
                                    className={`flex-1 flex items-center justify-center gap-2 ${isTeam ? "bg-cima-gold text-black hover:bg-white" : "bg-white text-black hover:bg-blue-400"} px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg active:scale-95`}
                                >
                                    <Zap className="h-4 w-4" />
                                    Generar Lead Pruebas
                                </button>
                                <button className="flex items-center gap-2 border border-white/10 bg-white/5 text-white/60 px-5 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all">
                                    <Phone className="h-4 w-4" />
                                    Llamar
                                </button>
                            </div>
                        </div>

                        {/* Image grid ΓÇö interactive for Pro/Team, static for Starter */}
                        <div className="hidden lg:block">
                            {f.gallery === "static" ? (
                                /* Starter: single static image */
                                <div className="rounded-xl overflow-hidden border border-white/5 aspect-[4/3]">
                                    <img src="/cocina-despues.png" alt="Propiedad" className="w-full h-full object-cover opacity-70" />
                                </div>
                            ) : (
                                /* Pro/Team: interactive gallery */
                                <div className="relative">
                                    <div className={`rounded-xl overflow-hidden border ${isTeam ? "border-cima-gold/10" : "border-white/5"} aspect-[4/3] relative`}>
                                        <AnimatePresence mode="wait">
                                            <motion.img
                                                key={activePhoto}
                                                src={photos[activePhoto]}
                                                alt={`Foto ${activePhoto + 1}`}
                                                className="w-full h-full object-cover"
                                                initial={{ opacity: 0, scale: 1.05 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        </AnimatePresence>
                                        {/* Nav arrows */}
                                        <button onClick={() => setActivePhoto((p) => (p - 1 + photos.length) % photos.length)}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full backdrop-blur-sm hover:bg-black/70 transition-all">
                                            <ChevronLeft className="h-4 w-4 text-white" />
                                        </button>
                                        <button onClick={() => setActivePhoto((p) => (p + 1) % photos.length)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full backdrop-blur-sm hover:bg-black/70 transition-all">
                                            <ChevronRight className="h-4 w-4 text-white" />
                                        </button>
                                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                                            {photos.map((_, i) => (
                                                <button key={i} onClick={() => setActivePhoto(i)}
                                                    className={`h-1.5 rounded-full transition-all ${i === activePhoto ? `w-6 ${accentBg}` : "w-1.5 bg-white/30"}`} />
                                            ))}
                                        </div>
                                    </div>
                                    {/* Thumbnails (Team only) */}
                                    {isTeam && (
                                        <div className="grid grid-cols-4 gap-2 mt-2">
                                            {photos.map((img, i) => (
                                                <button key={i} onClick={() => setActivePhoto(i)}
                                                    className={`rounded-lg overflow-hidden border-2 transition-all ${i === activePhoto ? "border-cima-gold" : "border-transparent opacity-60 hover:opacity-100"}`}>
                                                    <img src={img} alt="" className="w-full aspect-square object-cover" />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ΓöÇΓöÇ Antes vs Despu├⌐s (Pro/Team only) ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */}
            {(isPro || isTeam) && (
                <div className="max-w-6xl mx-auto px-6 py-20 border-t border-white/5">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl font-heading font-black mb-4">Difer├⌐nciate de la competencia</h2>
                        <p className="text-sm text-white/40 max-w-lg mx-auto">
                            Transformamos un anuncio gen├⌐rico en una experiencia premium que genera confianza.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                        {/* Antes: Marketplace */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 relative overflow-hidden group"
                        >
                            <div className="absolute top-4 right-4 bg-red-500/10 text-red-500 text-[8px] font-black px-2 py-1 rounded uppercase tracking-wider border border-red-500/20">
                                Antes: Marketplace
                            </div>
                            <div className="space-y-4 opacity-40 group-hover:opacity-60 transition-opacity">
                                <div className="aspect-video bg-white/5 rounded-lg overflow-hidden grayscale">
                                    <img src="/cocina-despues.png" alt="Marketplace" className="w-full h-full object-cover blur-[2px]" />
                                </div>
                                <div className="space-y-2">
                                    <div className="h-4 w-3/4 bg-white/10 rounded" />
                                    <div className="h-4 w-1/4 bg-white/10 rounded" />
                                    <div className="space-y-1 pt-2">
                                        <div className="h-2 w-full bg-white/5 rounded" />
                                        <div className="h-2 w-full bg-white/5 rounded" />
                                        <div className="h-2 w-2/3 bg-white/5 rounded" />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="h-8 flex-1 bg-blue-600/30 rounded-lg" />
                                    <div className="h-8 flex-1 bg-white/5 rounded-lg" />
                                </div>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl">
                                    <p className="text-[10px] font-bold text-white/60">Γ¥î Dise├▒o gen├⌐rico y poco profesional</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Despu├⌐s: Landing Pro */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className={`${isTeam ? "border-cima-gold/40 shadow-[0_0_30px_rgba(200,169,110,0.1)]" : "border-blue-500/40 shadow-[0_0_30px_rgba(59,130,246,0.1)]"} bg-white/[0.03] border-2 rounded-2xl p-6 relative overflow-hidden`}
                        >
                            <div className={`${isTeam ? "bg-cima-gold text-black" : "bg-blue-500 text-white"} absolute top-4 right-4 text-[8px] font-black px-2 py-1 rounded uppercase tracking-wider`}>
                                Despu├⌐s: Cima Pro
                            </div>
                            <div className="space-y-4">
                                <div className="aspect-video rounded-lg overflow-hidden border border-white/10 shadow-lg">
                                    <img src="/cocina-despues.png" alt="Pro" className="w-full h-full object-cover" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                        Residencia Premium
                                        <CheckCircle2 className={`h-3 w-3 ${isTeam ? "text-cima-gold" : "text-blue-400"}`} />
                                    </h3>
                                    <p className={`text-xs font-bold ${accentText}`}>$8,500,000 MXN</p>
                                    <div className="grid grid-cols-4 gap-2 py-2">
                                        {[BedDouble, Bath, Ruler, Camera].map((Icon, i) => (
                                            <div key={i} className="h-6 bg-white/5 border border-white/10 rounded-md flex items-center justify-center">
                                                <Icon className="h-2.5 w-2.5 text-white/30" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <div className={`${accentBg} h-8 flex-1 rounded-lg flex items-center justify-center`}>
                                        <span className="text-[8px] font-black text-black">AGENDAR VISITA</span>
                                    </div>
                                    <div className="h-8 w-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
                                        <Phone className="h-3 w-3 text-white/40" />
                                    </div>
                                </div>
                            </div>
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center pb-4">
                                <p className="text-[10px] font-bold text-white">Γ£à Atrae leads de alto valor</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}

            {/* ΓöÇΓöÇ Social Proof (Team only) ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */}
            {f.socialProof && (
                <div className="max-w-6xl mx-auto px-6 py-12 border-t border-white/5">
                    <div className="flex items-center justify-center gap-8 mb-8">
                        {[
                            { value: "98%", label: "Clientes satisfechos" },
                            { value: "+250", label: "Propiedades vendidas" },
                            { value: "< 30 d├¡as", label: "Tiempo promedio" },
                        ].map((stat, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.1 }}
                                className="text-center">
                                <p className="text-2xl font-heading font-black text-cima-gold">{stat.value}</p>
                                <p className="text-[8px] text-white/30 uppercase font-bold tracking-wider">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                    {/* Testimonial */}
                    <div className="max-w-lg mx-auto bg-cima-gold/[0.03] border border-cima-gold/10 rounded-2xl p-6 text-center">
                        <MessageSquare className="h-5 w-5 text-cima-gold/30 mx-auto mb-3" />
                        <p className="text-sm text-white/60 italic mb-3">&quot;Vendieron nuestra casa en 21 d├¡as. El portal del propietario nos mantuvo informados en todo momento.&quot;</p>
                        <p className="text-xs font-bold text-white">Familia Trevi├▒o</p>
                        <p className="text-[8px] text-white/30">Residencia Carretera Nacional</p>
                    </div>
                </div>
            )}

            {/* ΓöÇΓöÇ Features / Trust ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */}
            <div className="max-w-6xl mx-auto px-6 py-16">
                <div className={`grid grid-cols-1 ${isStarter ? "md:grid-cols-2" : "md:grid-cols-3"} gap-4 mb-16`}>
                    {[
                        { icon: Shield, title: "Garant├¡a de 30 d├¡as", desc: "Si no vendemos tu propiedad, te devolvemos tu inversi├│n" },
                        { icon: Camera, title: "Fotograf├¡a profesional", desc: "Sesi├│n HDR completa + video tour + drone a├⌐reo" },
                        ...(!isStarter ? [{ icon: Star, title: "Portal del propietario", desc: "Sigue el progreso de tu venta en tiempo real, 24/7" }] : []),
                    ].map((feature, i) => (
                        <Wrapper key={i} {...delayAnim(0.5 + i * 0.1)}
                            className={`${isTeam ? "bg-cima-gold/[0.02] border-cima-gold/10" : "bg-white/[0.03] border-white/5"} border rounded-2xl p-6 hover:border-white/10 transition-all`}
                        >
                            <div className={`h-10 w-10 rounded-xl ${isTeam ? "bg-cima-gold/10 border-cima-gold/20" : isPro ? "bg-blue-500/10 border-blue-500/20" : "bg-white/5 border-white/10"} border flex items-center justify-center mb-4`}>
                                <feature.icon className={`h-5 w-5 ${isTeam ? "text-cima-gold" : isPro ? "text-blue-400" : "text-white/40"}`} />
                            </div>
                            <h3 className="text-sm font-bold text-white mb-2">{feature.title}</h3>
                            <p className="text-xs text-white/40 leading-relaxed">{feature.desc}</p>
                        </Wrapper>
                    ))}
                </div>

                {/* ΓöÇΓöÇ ROI Section (Team only) ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */}
                {f.roiCalculator && (
                    <div className="mb-16">
                        <div className="text-center mb-10">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cima-gold/10 border border-cima-gold/20 text-[8px] font-bold text-cima-gold uppercase tracking-widest mb-3">
                                <TrendingUp className="h-3 w-3" /> Calculadora de Impacto
                            </span>
                            <h2 className="text-xl font-heading font-bold">Tu inversi├│n se paga sola</h2>
                        </div>

                        <div className="max-w-xl mx-auto mb-10 bg-white/[0.02] border border-white/10 rounded-2xl p-6">
                            <div className="flex justify-between mb-4">
                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Valor de tu propiedad</label>
                                <span className="text-sm font-bold text-cima-gold font-heading">${(propertyValue / 1000000).toFixed(1)}M</span>
                            </div>
                            <input
                                type="range"
                                min="1000000"
                                max="25000000"
                                step="500000"
                                value={propertyValue}
                                onChange={(e) => setPropertyValue(Number(e.target.value))}
                                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cima-gold mb-6"
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/[0.03] border border-white/5 rounded-lg p-3">
                                    <p className="text-[7px] text-white/30 uppercase font-black mb-1">Ahorro en Comisiones</p>
                                    <p className="text-lg font-heading font-bold text-green-400">${(savings / 1000).toFixed(0)}k</p>
                                </div>
                                <div className="bg-white/[0.03] border border-white/5 rounded-lg p-3">
                                    <p className="text-[7px] text-white/30 uppercase font-black mb-1">Ahorro en Tiempo</p>
                                    <p className="text-lg font-heading font-bold text-cima-gold">-60 d├¡as</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
                            {[
                                { icon: Zap, label: "Venta tradicional", value: "90+ d├¡as", sublabel: "Sin estrategia digital", color: "text-white/40" },
                                { icon: TrendingUp, label: "Con Cima Pro", value: "< 30 d├¡as", sublabel: "Marketing Predictivo", color: "text-cima-gold" },
                                { icon: Award, label: "Inversi├│n Neta", value: "Nivel Pro", sublabel: "Retorno 10x garantizado", color: "text-green-400" },
                            ].map((item, i) => (
                                <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 + i * 0.1 }}
                                    className="bg-cima-gold/[0.03] border border-cima-gold/10 rounded-xl p-4 text-center">
                                    <item.icon className={`h-5 w-5 ${item.color} mx-auto mb-2`} />
                                    <p className="text-[8px] text-white/30 mb-1 uppercase font-bold">{item.label}</p>
                                    <p className={`text-sm font-heading font-bold ${item.color}`}>{item.value}</p>
                                    <p className="text-[6px] text-white/20 mt-1">{item.sublabel}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Lead capture form */}
                <div className="max-w-md mx-auto">
                    <div className={`${isTeam ? "bg-cima-gold/[0.02] border-cima-gold/10" : "bg-white/[0.03] border-white/10"} border rounded-2xl p-8`}>
                        <h2 className="text-lg font-heading font-bold text-center mb-2">┬┐Te interesa esta propiedad?</h2>
                        <p className="text-xs text-white/40 text-center mb-6">D├⌐janos tus datos y te contactamos en menos de 1 hora</p>

                        <div className="space-y-3">
                            <input type="text" placeholder="Tu nombre"
                                className={`w-full bg-white/5 border ${isTeam ? "border-cima-gold/10 focus:border-cima-gold/40" : "border-white/10 focus:border-blue-400/40"} rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-all`}
                                readOnly />
                            <input type="tel" placeholder="81 1234 5678"
                                className={`w-full bg-white/5 border ${isTeam ? "border-cima-gold/10 focus:border-cima-gold/40" : "border-white/10 focus:border-blue-400/40"} rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-all`}
                                readOnly />
                            {!isStarter && (
                                <input type="email" placeholder="tu@email.com"
                                    className={`w-full bg-white/5 border ${isTeam ? "border-cima-gold/10 focus:border-cima-gold/40" : "border-white/10 focus:border-blue-400/40"} rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-all`}
                                    readOnly />
                            )}
                            <button className={`w-full flex items-center justify-center gap-2 ${isTeam ? "bg-cima-gold text-black hover:bg-white" : "bg-white text-black hover:bg-blue-400"} px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all`}>
                                <ArrowRight className="h-4 w-4" />
                                Quiero agendar una visita
                            </button>
                        </div>

                        <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-white/5">
                            {[
                                { icon: CheckCircle2, text: "Sin compromiso" },
                                { icon: Shield, text: "Datos protegidos" },
                            ].map((badge, i) => (
                                <div key={i} className="flex items-center gap-1.5">
                                    <badge.icon className="h-3 w-3 text-green-400" />
                                    <span className="text-[8px] text-white/30 uppercase font-bold tracking-wider">{badge.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ΓöÇΓöÇ Footer ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */}
            <div className="h-40 bg-black border-t border-white/5 flex flex-col items-center justify-center gap-2">
                <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.2em]">Cima Propiedades ┬╖ {new Date().getFullYear()}</p>
                <div className="h-1 w-20 bg-cima-gold/20 rounded-full" />
            </div>

            {/* Chat Widget */}
            <ChatWidget onSendMessage={onSendMessage} messages={messages || []} />

            {/* ΓöÇΓöÇ Social Proof (Pro/Team only) ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */}
            {!isStarter && <SocialProofToast tier={plan.tier} />}
        </div>
    );
}

/**
 * Interactive Chat Widget with AI Simulation
 */
function ChatWidget({ onSendMessage, messages }: { onSendMessage?: (f: string, t: string, ai?: boolean) => void; messages: LiveMessage[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = () => {
        if (!inputValue.trim() || !onSendMessage) return;
        onSendMessage("Interesado (T├║)", inputValue);
        setInputValue("");
    };

    return (
        <div className="fixed bottom-6 right-6 z-[110]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="absolute bottom-20 right-0 w-80 bg-black border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 bg-cima-gold flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-black/20 flex items-center justify-center">
                                    <Sparkles className="h-4 w-4 text-black" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-black uppercase tracking-tighter">Asistente Cima AI</p>
                                    <div className="flex items-center gap-1">
                                        <div className="h-1.5 w-1.5 rounded-full bg-black/60 animate-pulse" />
                                        <span className="text-[7px] text-black/60 font-bold uppercase">En l├¡nea ahora</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-black/40 hover:text-black p-1">
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div
                            ref={scrollRef}
                            className="h-72 overflow-y-auto p-4 space-y-3 bg-white/[0.02] flex flex-col"
                        >
                            <div className="text-center py-4 mb-2">
                                <span className="text-[8px] text-white/20 font-bold uppercase tracking-widest px-2 py-1 border border-white/5 rounded-full">Chat Privado con IA</span>
                            </div>

                            {messages.map((msg, i) => (
                                <motion.div
                                    key={msg.id || i}
                                    initial={{ opacity: 0, x: msg.from.includes("T├║") ? 10 : -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex ${msg.from.includes("T├║") ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-[10px] ${msg.from.includes("T├║")
                                        ? "bg-cima-gold text-black font-medium rounded-tr-none shadow-lg shadow-cima-gold/10"
                                        : "bg-white/5 text-white/80 border border-white/10 rounded-tl-none"
                                        }`}>
                                        <p className="leading-relaxed">{msg.message}</p>
                                        <span className={`text-[7px] mt-1 block opacity-40 ${msg.from.includes("T├║") ? "text-right" : ""}`}>{msg.time}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-white/5 bg-black">
                            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-2 pl-4 focus-within:border-cima-gold/30 transition-all">
                                <input
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                    placeholder="Escribe tu duda..."
                                    className="flex-1 bg-transparent border-none outline-none text-[10px] text-white placeholder:text-white/20"
                                />
                                <button
                                    onClick={handleSend}
                                    className="h-8 w-8 rounded-xl bg-cima-gold flex items-center justify-center text-black hover:scale-105 transition-all shadow-lg shadow-cima-gold/20"
                                >
                                    <Send className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`h-14 w-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all relative ${isOpen ? "bg-white text-black" : "bg-cima-gold text-black shadow-cima-gold/20"
                    }`}
            >
                {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full border-2 border-black flex items-center justify-center text-[10px] font-black text-white animate-bounce">
                        1
                    </span>
                )}
            </motion.button>
        </div>
    );
}
