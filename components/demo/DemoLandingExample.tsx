"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Home, Phone, MapPin, BedDouble, Bath, Ruler,
    Camera, Calendar, Shield, Star, ArrowRight, CheckCircle2,
    TrendingUp, Users as UsersIcon, Zap, ChevronLeft, ChevronRight,
    MessageSquare, Award, Eye, X, Send, Sparkles, Car,
    MessageCircle, Building2, Lock
} from "lucide-react";
import type { PlanConfig } from "@/lib/config/demo-plans";
import { type LiveMessage } from "./LiveDemoClient";

/* ─────────────────────────────────────────────
   Social Proof Toast (Pro / Team only)
───────────────────────────────────────────── */
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
                    className="fixed bottom-6 left-6 z-[100] bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl flex items-center gap-3 max-w-[210px]"
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
                    <button onClick={() => setVisible(false)} className="absolute top-2 right-2 text-white/20 hover:text-white transition-colors p-1">
                        <X className="h-3 w-3" />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/* ─────────────────────────────────────────────
   Main Landing Component
───────────────────────────────────────────── */
export default function DemoLandingExample({
    plan,
    onLeadCapture,
    onSendMessage,
    messages,
    customization,
}: {
    plan: PlanConfig;
    onLeadCapture?: (data: any) => void;
    onSendMessage?: (from: string, text: string, isAi?: boolean) => void;
    messages?: LiveMessage[];
    customization?: { clientName: string; propertyName: string; propertyPrice: string };
}) {
    const f = plan.features.landing;
    const propName = customization?.propertyName || "Residencia Premium";
    const propPrice = customization?.propertyPrice || "8,500,000";
    const isTeam = plan.tier === "premium";
    const isPro = plan.tier === "profesional";
    const isStarter = plan.tier === "basico";

    // Accent tokens — Pro upgraded to indigo for more premium feel
    const accentBg = isTeam ? "bg-cima-gold" : isPro ? "bg-indigo-500" : "bg-white";
    const accentText = isTeam ? "text-cima-gold" : isPro ? "text-indigo-400" : "text-white";
    const accentBorder = isTeam ? "border-cima-gold/20" : isPro ? "border-indigo-500/20" : "border-white/20";
    const accentMuted = isTeam ? "bg-cima-gold/10" : isPro ? "bg-indigo-500/10" : "bg-white/10";
    const accentGlow = isTeam ? "shadow-cima-gold/20" : isPro ? "shadow-indigo-500/20" : "shadow-white/10";
    const accentCtaTextColor = (isTeam || isPro) ? "text-black" : "text-black";

    const [activePhoto, setActivePhoto] = useState(0);
    const photos = ["/cocina-despues.png", "/estancia-despues.png", "/recamara-despues.png", "/estancia-despues.png"];

    const [propertyValue, setPropertyValue] = useState(8500000);
    const commissionTraditional = propertyValue * 0.05;
    const commissionCima = propertyValue * 0.03;
    const savings = commissionTraditional - commissionCima;

    const handleTriggerLead = () => {
        if (onLeadCapture) {
            onLeadCapture({
                name: "Lead de Landing (Demo)",
                phone: "81 0000 " + Math.floor(1000 + Math.random() * 9000),
                property: "Residencia Premium — " + plan.name,
            });
        }
    };

    // Animation helpers
    const Wrapper = f.animations ? motion.div : "div";
    const anim = f.animations ? { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } } : {};
    const viewAnim = f.animations
        ? { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } as any }
        : {};
    const delayAnim = (d: number) =>
        f.animations ? { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 }, transition: { delay: d } } : {};

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-white relative overflow-hidden">

            {/* ── Aurora BG (Pro/Team) ── */}
            {f.aurora && (
                <>
                    <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cima-gold/[0.04] rounded-full blur-[120px] animate-pulse pointer-events-none" />
                    <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-blue-500/[0.03] rounded-full blur-[100px] pointer-events-none" />
                    {isPro && <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-indigo-500/[0.03] rounded-full blur-[80px] pointer-events-none" />}
                </>
            )}

            {/* ══════════════════════════════════════════════
                HERO SECTION
            ══════════════════════════════════════════════ */}
            <div className="relative">
                {/* Subtle full-bleed image bg */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <img src="/estancia-despues.png" alt="" className="w-full h-full object-cover opacity-[0.06]" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0B]/50 via-[#0A0A0B]/80 to-[#0A0A0B]" />
                </div>

                <div className="relative max-w-6xl mx-auto px-6 pt-8 pb-16">
                    {/* ── Nav ── */}
                    <nav className="flex items-center justify-between mb-12 lg:mb-16">
                        <div className="flex items-center gap-2.5">
                            <div className={`h-8 w-8 rounded-lg ${accentMuted} border ${accentBorder} flex items-center justify-center`}>
                                <Home className={`h-4 w-4 ${accentText}`} />
                            </div>
                            <div>
                                <p className="text-sm font-bold tracking-tight text-white">Tu Marca Aquí</p>
                                {!isStarter && <p className="text-[8px] text-white/30 font-bold uppercase tracking-widest">Asesor Certificado</p>}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className={`${accentBg} ${accentCtaTextColor} px-4 py-2 rounded-lg text-xs font-bold hover:scale-105 transition-all`}>
                                Contactar
                            </button>
                        </div>
                    </nav>

                    {/* ── Hero Grid: Content + Photos ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                        {/* LEFT: Content */}
                        <div>
                            <Wrapper {...anim}>
                                {/* Available badge */}
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${isTeam ? "bg-cima-gold/10 border border-cima-gold/20 text-cima-gold" : "bg-green-500/10 border border-green-500/20 text-green-400"} text-[9px] font-bold uppercase tracking-widest mb-5 select-none`}>
                                    <span className={`h-1.5 w-1.5 rounded-full ${isTeam ? "bg-cima-gold" : "bg-green-500"} animate-pulse`} />
                                    Disponible
                                </span>

                                <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tight leading-none mb-2">
                                    {propName}
                                </h1>
                                <p className="text-xl md:text-2xl font-heading text-white/35 mb-3 font-medium">
                                    Colinas de San Jerónimo
                                </p>

                                {/* Location */}
                                <div className="flex items-center gap-1.5 mb-5">
                                    <MapPin className="h-3 w-3 text-white/25 shrink-0" />
                                    <span className="text-xs text-white/30">San Pedro Garza García, Nuevo León</span>
                                </div>

                                {/* Big Price */}
                                <div className="mb-7">
                                    <span className={`text-4xl font-heading font-black ${accentText}`}>${propPrice}</span>
                                    <span className="text-base text-white/35 font-medium ml-2">MXN</span>
                                </div>
                            </Wrapper>

                            {/* Stat Pills */}
                            <Wrapper {...delayAnim(0.1)}>
                                <div className="flex flex-wrap gap-2 mb-7">
                                    {[
                                        { icon: BedDouble, value: "4", label: "Recámaras" },
                                        { icon: Bath, value: "3.5", label: "Baños" },
                                        { icon: Ruler, value: "320m²", label: "Const." },
                                        { icon: Car, value: "2", label: "Cajones" },
                                    ].map((stat, i) => (
                                        <div key={i} className={`flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] hover:border-white/15 transition-all cursor-default`}>
                                            <stat.icon className={`h-3 w-3 ${accentText} opacity-60`} />
                                            <span className="text-xs font-bold text-white">{stat.value}</span>
                                            <span className="text-[9px] text-white/30">{stat.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </Wrapper>

                            {/* Description */}
                            <Wrapper {...delayAnim(0.2)}>
                                <p className="text-sm text-white/45 leading-relaxed mb-8 max-w-md">
                                    {isStarter
                                        ? "Hermosa residencia de 320m² con acabados de lujo, jardín privado y ubicación privilegiada en una de las mejores zonas."
                                        : "Hermosa residencia de 320m² en una de las zonas más exclusivas. Acabados de lujo, jardín privado, cocina gourmet y vista panorámica a la montaña."
                                    }
                                </p>
                            </Wrapper>

                            {/* Double CTA */}
                            <Wrapper {...delayAnim(0.3)}>
                                <div className="flex gap-3 flex-wrap">
                                    <button
                                        onClick={handleTriggerLead}
                                        className={`flex items-center justify-center gap-2 ${accentBg} ${accentCtaTextColor} px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-${accentGlow} hover:scale-[1.02] hover:brightness-110 active:scale-95`}
                                    >
                                        <Calendar className="h-4 w-4" />
                                        Agendar Visita
                                    </button>
                                    <button className="flex items-center gap-2 bg-green-500/10 border border-green-500/25 text-green-400 px-5 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-green-500/20 transition-all">
                                        <MessageCircle className="h-4 w-4" />
                                        WhatsApp
                                    </button>
                                </div>
                            </Wrapper>
                        </div>

                        {/* RIGHT: Photos */}
                        <div className="hidden lg:block">
                            {isStarter ? (
                                /* Starter: Composed 2-photo stack */
                                <div className="relative">
                                    <div className="grid grid-cols-5 gap-2.5 h-[420px]">
                                        {/* Main photo — 3/5 */}
                                        <div className="col-span-3 rounded-2xl overflow-hidden border border-white/[0.06] group cursor-pointer">
                                            <img
                                                src="/cocina-despues.png"
                                                alt="Cocina"
                                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                                            />
                                        </div>
                                        {/* Two stacked photos — 2/5 */}
                                        <div className="col-span-2 flex flex-col gap-2.5">
                                            <div className="flex-1 rounded-2xl overflow-hidden border border-white/[0.06] group cursor-pointer">
                                                <img
                                                    src="/estancia-despues.png"
                                                    alt="Estancia"
                                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                                                />
                                            </div>
                                            <div className="flex-1 rounded-2xl overflow-hidden border border-white/[0.06] group cursor-pointer relative">
                                                <img
                                                    src="/recamara-despues.png"
                                                    alt="Recámara"
                                                    className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
                                                />
                                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                                    <span className="text-[9px] font-black text-white uppercase tracking-wider bg-black/50 px-2 py-1 rounded-lg">+12 más</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Count badge */}
                                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm border border-white/10 rounded-lg px-2.5 py-1">
                                        <Camera className="h-3 w-3 text-white/40" />
                                        <span className="text-[9px] font-bold text-white/60">24 fotos profesionales</span>
                                    </div>
                                </div>
                            ) : (
                                /* Pro/Team: Interactive gallery */
                                <div className="relative">
                                    <div className={`rounded-2xl overflow-hidden border ${isTeam ? "border-cima-gold/15" : "border-indigo-500/15"} aspect-[4/3] relative shadow-2xl`}>
                                        <AnimatePresence mode="wait">
                                            <motion.img
                                                key={activePhoto}
                                                src={photos[activePhoto]}
                                                alt={`Foto ${activePhoto + 1}`}
                                                className="w-full h-full object-cover"
                                                initial={{ opacity: 0, scale: 1.05 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.4 }}
                                            />
                                        </AnimatePresence>
                                        {/* Arrows */}
                                        <button onClick={() => setActivePhoto((p) => (p - 1 + photos.length) % photos.length)}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full backdrop-blur-sm hover:bg-black/80 transition-all">
                                            <ChevronLeft className="h-4 w-4 text-white" />
                                        </button>
                                        <button onClick={() => setActivePhoto((p) => (p + 1) % photos.length)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full backdrop-blur-sm hover:bg-black/80 transition-all">
                                            <ChevronRight className="h-4 w-4 text-white" />
                                        </button>
                                        {/* Dots */}
                                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                                            {photos.map((_, i) => (
                                                <button key={i} onClick={() => setActivePhoto(i)}
                                                    className={`h-1.5 rounded-full transition-all ${i === activePhoto ? `w-6 ${accentBg}` : "w-1.5 bg-white/30"}`} />
                                            ))}
                                        </div>
                                        {/* Virtual Tour badge */}
                                        <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg ${isTeam ? "bg-cima-gold/90 text-black" : "bg-indigo-600/90 text-white"} backdrop-blur-sm text-[9px] font-black uppercase tracking-wider shadow-lg`}>
                                            <Eye className="h-3 w-3" />
                                            Tour Virtual 360°
                                        </div>
                                        {/* Count */}
                                        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1">
                                            <Camera className="h-2.5 w-2.5 text-white/40" />
                                            <span className="text-[8px] font-bold text-white/60">{activePhoto + 1}/{photos.length}</span>
                                        </div>
                                    </div>
                                    {/* Thumbnails (Team only) */}
                                    {isTeam && (
                                        <div className="grid grid-cols-4 gap-2 mt-2">
                                            {photos.map((img, i) => (
                                                <button key={i} onClick={() => setActivePhoto(i)}
                                                    className={`rounded-xl overflow-hidden border-2 transition-all ${i === activePhoto ? "border-cima-gold shadow-lg shadow-cima-gold/20" : "border-transparent opacity-50 hover:opacity-90"}`}>
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

            {/* ══════════════════════════════════════════════
                FEATURES SECTION — all tiers
            ══════════════════════════════════════════════ */}
            <div className="max-w-6xl mx-auto px-6 py-14 border-t border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        {
                            icon: Camera,
                            title: "Fotografía Profesional",
                            desc: isStarter
                                ? "Sesión HDR completa con iluminación profesional que destaca cada espacio."
                                : "Sesión HDR + drone aéreo + video tour cinematográfico incluidos.",
                        },
                        {
                            icon: Eye,
                            title: "Visita Virtual 360°",
                            desc: isStarter
                                ? "Tour virtual interactivo para que compradores exploren sin salir de casa."
                                : "Tour virtual inmersivo con puntos de interés y plano de planta interactivo.",
                            badge: isPro || isTeam ? "IA Incluida" : undefined,
                        },
                        {
                            icon: Phone,
                            title: "Contacto Directo",
                            desc: isStarter
                                ? "Formulario de contacto con respuesta garantizada en menos de 1 hora."
                                : "IA que califica leads 24/7 y agenda visitas automáticamente en tu calendario.",
                            badge: isTeam ? "Automatizado" : undefined,
                        },
                    ].map((feature, i) => (
                        <Wrapper key={i} {...delayAnim(0.4 + i * 0.1)}
                            className={`${accentMuted} border ${accentBorder} rounded-2xl p-6 hover:border-white/10 transition-all group relative`}
                        >
                            <div className={`h-10 w-10 rounded-xl ${accentMuted} border ${accentBorder} flex items-center justify-center mb-4 group-hover:scale-110 transition-all`}>
                                <feature.icon className={`h-5 w-5 ${accentText}`} />
                            </div>
                            <h3 className="text-sm font-bold text-white mb-2">{feature.title}</h3>
                            <p className="text-xs text-white/40 leading-relaxed">{feature.desc}</p>
                            {feature.badge && (
                                <span className={`absolute top-4 right-4 text-[7px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${accentMuted} ${accentText} border ${accentBorder}`}>
                                    {feature.badge}
                                </span>
                            )}
                        </Wrapper>
                    ))}
                </div>
            </div>

            {/* ══════════════════════════════════════════════
                PRO+: AGENT SECTION
            ══════════════════════════════════════════════ */}
            {(isPro || isTeam) && (
                <div className="max-w-6xl mx-auto px-6 py-10 border-t border-white/5">
                    <Wrapper {...viewAnim}>
                        <div className={`${accentMuted} border ${accentBorder} rounded-3xl p-8`}>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                                {/* Avatar */}
                                <div className={`h-20 w-20 rounded-2xl ${accentMuted} border ${accentBorder} flex items-center justify-center shrink-0`}>
                                    <UsersIcon className={`h-10 w-10 ${accentText} opacity-50`} />
                                </div>
                                {/* Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-lg font-heading font-bold text-white">Lic. María Fernández</h3>
                                        <CheckCircle2 className={`h-4 w-4 ${accentText}`} />
                                    </div>
                                    <p className="text-xs text-white/40 mb-3">Asesora Senior · Certificada AMPI · 8 años de experiencia</p>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-0.5">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star key={s} className={`h-3.5 w-3.5 ${accentText} fill-current`} />
                                            ))}
                                            <span className="text-xs font-bold text-white ml-1.5">4.9</span>
                                        </div>
                                        <span className="text-[9px] text-white/30">·</span>
                                        <span className="text-[9px] text-white/40">124 reseñas verificadas</span>
                                    </div>
                                </div>
                                {/* WhatsApp CTA */}
                                <button className="flex items-center gap-2 bg-green-500/10 border border-green-500/25 text-green-400 px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-green-500/20 transition-all shrink-0">
                                    <MessageCircle className="h-4 w-4" />
                                    WhatsApp Directo
                                </button>
                            </div>
                        </div>
                    </Wrapper>
                </div>
            )}

            {/* ══════════════════════════════════════════════
                PRO+: NEIGHBORHOOD SECTION
            ══════════════════════════════════════════════ */}
            {(isPro || isTeam) && (
                <div className="max-w-6xl mx-auto px-6 py-10 border-t border-white/5">
                    <Wrapper {...viewAnim} className="mb-6">
                        <h2 className="text-lg font-heading font-bold mb-1">Sobre la Zona</h2>
                        <p className="text-xs text-white/35">San Pedro Garza García · Una de las colonias más exclusivas de Monterrey</p>
                    </Wrapper>
                    <div className="flex flex-wrap gap-3">
                        {[
                            { label: "Escuelas Privadas", distance: "5 min", icon: "🏫" },
                            { label: "Supermercado", distance: "3 min", icon: "🛒" },
                            { label: "Hospital Ángeles", distance: "10 min", icon: "🏥" },
                            { label: "Centro Comercial", distance: "7 min", icon: "🏬" },
                            { label: "Autopista MTY", distance: "8 min", icon: "🚗" },
                            { label: "Parque La Encomienda", distance: "2 min", icon: "🌳" },
                        ].map((item, i) => (
                            <Wrapper key={i} {...delayAnim(0.05 * i)}
                                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl ${accentMuted} border ${accentBorder} hover:border-white/15 transition-all`}
                            >
                                <span className="text-base">{item.icon}</span>
                                <div>
                                    <p className="text-xs font-bold text-white">{item.label}</p>
                                    <p className="text-[9px] text-white/30">{item.distance}</p>
                                </div>
                            </Wrapper>
                        ))}
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════
                PRO+: BEFORE / AFTER
            ══════════════════════════════════════════════ */}
            {(isPro || isTeam) && (
                <div className="max-w-6xl mx-auto px-6 py-20 border-t border-white/5">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl font-heading font-black mb-4">Diferénciate de la competencia</h2>
                        <p className="text-sm text-white/40 max-w-lg mx-auto">
                            Transformamos un anuncio genérico en una experiencia premium que genera confianza y acelera el cierre.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                        {/* Antes */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 relative overflow-hidden group"
                        >
                            <div className="absolute top-4 right-4 bg-red-500/10 text-red-400 text-[8px] font-black px-2 py-1 rounded uppercase tracking-wider border border-red-500/20">
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
                                    <p className="text-[10px] font-bold text-white/60">❌ Diseño genérico y poco profesional</p>
                                </div>
                            </div>
                        </motion.div>
                        {/* Después */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className={`${isTeam ? "border-cima-gold/40 shadow-[0_0_30px_rgba(200,169,110,0.1)]" : "border-indigo-500/40 shadow-[0_0_30px_rgba(99,102,241,0.1)]"} bg-white/[0.03] border-2 rounded-2xl p-6 relative overflow-hidden`}
                        >
                            <div className={`${isTeam ? "bg-cima-gold text-black" : "bg-indigo-500 text-white"} absolute top-4 right-4 text-[8px] font-black px-2 py-1 rounded uppercase tracking-wider`}>
                                Después: Cima Pro
                            </div>
                            <div className="space-y-4">
                                <div className="aspect-video rounded-lg overflow-hidden border border-white/10 shadow-lg">
                                    <img src="/cocina-despues.png" alt="Pro" className="w-full h-full object-cover" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                        Residencia Premium
                                        <CheckCircle2 className={`h-3 w-3 ${accentText}`} />
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
                                <p className="text-[10px] font-bold text-white">✅ Atrae leads de alto valor</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════
                TEAM: TESTIMONIALS
            ══════════════════════════════════════════════ */}
            {isTeam && (
                <div className="max-w-6xl mx-auto px-6 py-14 border-t border-white/5">
                    <Wrapper {...viewAnim} className="text-center mb-10">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cima-gold/10 border border-cima-gold/20 text-[8px] font-bold text-cima-gold uppercase tracking-widest mb-4">
                            <Star className="h-3 w-3" /> Lo que dicen nuestros clientes
                        </span>
                        <h2 className="text-2xl font-heading font-black">Resultados que hablan por sí solos</h2>
                    </Wrapper>

                    {/* Stats row */}
                    <div className="flex items-center justify-center gap-10 mb-10">
                        {[
                            { value: "98%", label: "Clientes satisfechos" },
                            { value: "+250", label: "Propiedades vendidas" },
                            { value: "< 30 días", label: "Tiempo promedio" },
                        ].map((stat, i) => (
                            <motion.div key={i}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 * i }}
                                className="text-center"
                            >
                                <p className="text-2xl font-heading font-black text-cima-gold">{stat.value}</p>
                                <p className="text-[8px] text-white/30 uppercase font-bold tracking-wider mt-0.5">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Testimonial cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            {
                                name: "Familia Treviño",
                                role: "Casa vendida en 21 días",
                                quote: "El portal del propietario nos mantuvo informados en todo momento. Nunca tuvimos que llamar para saber cómo iba la venta.",
                                rating: 5,
                            },
                            {
                                name: "Ing. Carlos Montoya",
                                role: "3 propiedades vendidas",
                                quote: "Usé la plataforma para mis 3 propiedades. Los resultados superaron todas mis expectativas. La mejor inversión de mi año.",
                                rating: 5,
                            },
                        ].map((t, i) => (
                            <motion.div key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-cima-gold/[0.03] border border-cima-gold/10 rounded-2xl p-7"
                            >
                                <div className="flex items-center gap-0.5 mb-4">
                                    {Array.from({ length: t.rating }).map((_, s) => (
                                        <Star key={s} className="h-3.5 w-3.5 text-cima-gold fill-cima-gold" />
                                    ))}
                                </div>
                                <p className="text-sm text-white/60 italic leading-relaxed mb-5">"{t.quote}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-full bg-cima-gold/20 flex items-center justify-center">
                                        <UsersIcon className="h-4 w-4 text-cima-gold/60" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-white">{t.name}</p>
                                        <p className="text-[8px] text-white/30">{t.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════
                TEAM: MARKET DATA WIDGET
            ══════════════════════════════════════════════ */}
            {isTeam && (
                <div className="max-w-6xl mx-auto px-6 py-10 border-t border-white/5">
                    <Wrapper {...viewAnim} className="mb-6">
                        <h2 className="text-lg font-heading font-bold mb-1">Análisis de Mercado</h2>
                        <p className="text-xs text-white/35">Datos del mercado inmobiliario · San Pedro Garza García</p>
                    </Wrapper>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { icon: TrendingUp, title: "Tiempo de Venta", value: "28 días", sublabel: "Promedio en la zona", color: "text-green-400", bg: "bg-green-500/5 border-green-500/15" },
                            { icon: Building2, title: "Precio/m² Zona", value: "$26,562", sublabel: "MXN · Actualizado hoy", color: "text-cima-gold", bg: "bg-cima-gold/5 border-cima-gold/15" },
                            { icon: Eye, title: "Interesados Activos", value: "142", sublabel: "Compradores calificados", color: "text-blue-400", bg: "bg-blue-500/5 border-blue-500/15" },
                        ].map((item, i) => (
                            <motion.div key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className={`${item.bg} border rounded-2xl p-6`}
                            >
                                <item.icon className={`h-6 w-6 ${item.color} mb-3`} />
                                <p className="text-[8px] text-white/30 uppercase font-black tracking-wider mb-1">{item.title}</p>
                                <p className={`text-2xl font-heading font-black ${item.color}`}>{item.value}</p>
                                <p className="text-[9px] text-white/30 mt-1">{item.sublabel}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════
                TEAM: ROI CALCULATOR
            ══════════════════════════════════════════════ */}
            {f.roiCalculator && (
                <div className="max-w-6xl mx-auto px-6 py-14 border-t border-white/5">
                    <div className="text-center mb-10">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cima-gold/10 border border-cima-gold/20 text-[8px] font-bold text-cima-gold uppercase tracking-widest mb-4">
                            <TrendingUp className="h-3 w-3" /> Calculadora de Impacto
                        </span>
                        <h2 className="text-xl font-heading font-bold">Tu inversión se paga sola</h2>
                    </div>

                    <div className="max-w-xl mx-auto mb-10 bg-white/[0.02] border border-white/10 rounded-2xl p-6">
                        <div className="flex justify-between mb-4">
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Valor de tu propiedad</label>
                            <span className="text-sm font-bold text-cima-gold font-heading">${(propertyValue / 1000000).toFixed(1)}M</span>
                        </div>
                        <input
                            type="range" min="1000000" max="25000000" step="500000"
                            value={propertyValue}
                            onChange={(e) => setPropertyValue(Number(e.target.value))}
                            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cima-gold mb-6"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/[0.03] border border-white/5 rounded-lg p-3">
                                <p className="text-[7px] text-white/30 uppercase font-black mb-1">Ahorro en Comisiones</p>
                                <p className="text-xl font-heading font-bold text-green-400">${(savings / 1000).toFixed(0)}k</p>
                            </div>
                            <div className="bg-white/[0.03] border border-white/5 rounded-lg p-3">
                                <p className="text-[7px] text-white/30 uppercase font-black mb-1">Tiempo Ahorrado</p>
                                <p className="text-xl font-heading font-bold text-cima-gold">−60 días</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
                        {[
                            { icon: Zap, label: "Venta tradicional", value: "90+ días", sublabel: "Sin estrategia digital", color: "text-white/40" },
                            { icon: TrendingUp, label: "Con Cima Pro", value: "< 30 días", sublabel: "Marketing Predictivo", color: "text-cima-gold" },
                            { icon: Award, label: "Retorno Neto", value: "10x", sublabel: "ROI garantizado", color: "text-green-400" },
                        ].map((item, i) => (
                            <motion.div key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 * i }}
                                className="bg-cima-gold/[0.03] border border-cima-gold/10 rounded-xl p-4 text-center"
                            >
                                <item.icon className={`h-5 w-5 ${item.color} mx-auto mb-2`} />
                                <p className="text-[8px] text-white/30 mb-1 uppercase font-bold">{item.label}</p>
                                <p className={`text-sm font-heading font-bold ${item.color}`}>{item.value}</p>
                                <p className="text-[6px] text-white/20 mt-1">{item.sublabel}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════
                TEAM: AGENCY SECTION
            ══════════════════════════════════════════════ */}
            {isTeam && (
                <div className="max-w-6xl mx-auto px-6 py-14 border-t border-white/5">
                    <div className="bg-cima-gold/[0.02] border border-cima-gold/10 rounded-3xl p-8">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="h-20 w-20 rounded-2xl bg-cima-gold/10 border border-cima-gold/20 flex items-center justify-center shrink-0">
                                <Building2 className="h-10 w-10 text-cima-gold/50" />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-xl font-heading font-black text-white mb-1">Cima Propiedades</h3>
                                <p className="text-xs text-white/40 mb-5">La agencia inmobiliaria líder en Monterrey con más de 10 años de experiencia</p>
                                <div className="flex flex-wrap justify-center md:justify-start gap-6">
                                    {[
                                        { value: "500+", label: "Propiedades vendidas" },
                                        { value: "25", label: "Asesores certificados" },
                                        { value: "10+", label: "Años de experiencia" },
                                    ].map((s, i) => (
                                        <div key={i} className="text-center md:text-left">
                                            <p className="text-xl font-heading font-black text-cima-gold">{s.value}</p>
                                            <p className="text-[8px] text-white/30 uppercase font-bold tracking-wider">{s.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════
                CONTACT FORM — all tiers
            ══════════════════════════════════════════════ */}
            <div className="max-w-6xl mx-auto px-6 pb-20">
                <div className="max-w-md mx-auto">
                    <div className={`${accentMuted} border ${accentBorder} rounded-3xl p-8`}>
                        <h2 className="text-xl font-heading font-bold text-center mb-2">¿Te interesa esta propiedad?</h2>
                        <p className="text-xs text-white/40 text-center mb-7">Déjanos tus datos y te contactamos en menos de 1 hora</p>
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="Tu nombre completo"
                                className={`w-full bg-white/5 border ${accentBorder} focus:border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-all`}
                                readOnly
                            />
                            <input
                                type="tel"
                                placeholder="81 1234 5678"
                                className={`w-full bg-white/5 border ${accentBorder} focus:border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-all`}
                                readOnly
                            />
                            {!isStarter && (
                                <input
                                    type="email"
                                    placeholder="tu@email.com"
                                    className={`w-full bg-white/5 border ${accentBorder} focus:border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-all`}
                                    readOnly
                                />
                            )}
                            <button
                                onClick={handleTriggerLead}
                                className={`w-full flex items-center justify-center gap-2 ${accentBg} ${accentCtaTextColor} px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all hover:brightness-110 active:scale-[0.98]`}
                            >
                                <ArrowRight className="h-4 w-4" />
                                Quiero agendar una visita
                            </button>
                        </div>
                        <div className="flex items-center justify-center gap-5 mt-6 pt-5 border-t border-white/5">
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

            {/* ══════════════════════════════════════════════
                FOOTER
            ══════════════════════════════════════════════ */}
            <div className="bg-black border-t border-white/5 py-12 flex flex-col items-center justify-center gap-3">
                <div className="flex items-center gap-2.5">
                    <div className={`h-6 w-6 rounded-lg ${accentMuted} border ${accentBorder} flex items-center justify-center`}>
                        <Home className={`h-3 w-3 ${accentText}`} />
                    </div>
                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.2em]">
                        Cima Propiedades · {new Date().getFullYear()}
                    </p>
                </div>
                <div className={`h-0.5 w-16 ${accentBg} opacity-20 rounded-full`} />
                {isTeam && (
                    <p className="text-[7px] text-white/15 font-bold uppercase tracking-widest">
                        Powered by Cima Pro Technology
                    </p>
                )}
            </div>

            {/* Chat Widget */}
            <ChatWidget onSendMessage={onSendMessage} messages={messages || []} />

            {/* Social Proof (Pro/Team only) */}
            {!isStarter && <SocialProofToast tier={plan.tier} />}
        </div>
    );
}

/* ─────────────────────────────────────────────
   Chat Widget
───────────────────────────────────────────── */
function ChatWidget({ onSendMessage, messages }: { onSendMessage?: (f: string, t: string, ai?: boolean) => void; messages: LiveMessage[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = () => {
        if (!inputValue.trim() || !onSendMessage) return;
        onSendMessage("Interesado (Tú)", inputValue);
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
                        <div className="p-4 bg-cima-gold flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-black/20 flex items-center justify-center">
                                    <Sparkles className="h-4 w-4 text-black" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-black uppercase tracking-tighter">Asistente Cima AI</p>
                                    <div className="flex items-center gap-1">
                                        <div className="h-1.5 w-1.5 rounded-full bg-black/60 animate-pulse" />
                                        <span className="text-[7px] text-black/60 font-bold uppercase">En línea ahora</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-black/40 hover:text-black p-1">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <div ref={scrollRef} className="h-72 overflow-y-auto p-4 space-y-3 bg-white/[0.02] flex flex-col">
                            <div className="text-center py-4 mb-2">
                                <span className="text-[8px] text-white/20 font-bold uppercase tracking-widest px-2 py-1 border border-white/5 rounded-full">Chat Privado con IA</span>
                            </div>
                            {messages.map((msg, i) => (
                                <motion.div key={msg.id || i}
                                    initial={{ opacity: 0, x: msg.from.includes("Tú") ? 10 : -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex ${msg.from.includes("Tú") ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-[10px] ${msg.from.includes("Tú")
                                        ? "bg-cima-gold text-black font-medium rounded-tr-none shadow-lg shadow-cima-gold/10"
                                        : "bg-white/5 text-white/80 border border-white/10 rounded-tl-none"}`}>
                                        <p className="leading-relaxed">{msg.message}</p>
                                        <span className={`text-[7px] mt-1 block opacity-40 ${msg.from.includes("Tú") ? "text-right" : ""}`}>{msg.time}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        <div className="p-4 border-t border-white/5 bg-black">
                            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-2 pl-4 focus-within:border-cima-gold/30 transition-all">
                                <input
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                    placeholder="Escribe tu duda..."
                                    className="flex-1 bg-transparent border-none outline-none text-[10px] text-white placeholder:text-white/20"
                                />
                                <button onClick={handleSend}
                                    className="h-8 w-8 rounded-xl bg-cima-gold flex items-center justify-center text-black hover:scale-105 transition-all shadow-lg shadow-cima-gold/20">
                                    <Send className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`h-14 w-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all relative ${isOpen ? "bg-white text-black" : "bg-cima-gold text-black shadow-cima-gold/20"}`}
            >
                {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full border-2 border-black flex items-center justify-center text-[10px] font-black text-white animate-bounce">1</span>
                )}
            </motion.button>
        </div>
    );
}
