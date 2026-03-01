"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Home, Phone, MapPin, BedDouble, Bath, Ruler,
    Camera, Calendar, Shield, Star, ArrowRight, CheckCircle2,
    TrendingUp, Users, Zap, ChevronLeft, ChevronRight, MessageSquare, Award
} from "lucide-react";
import type { PlanConfig } from "@/lib/config/demo-plans";

/**
 * Tier-aware example landing. Starter=basic, Pro=animated, Team=premium.
 */
export default function DemoLandingExample({ plan }: { plan: PlanConfig }) {
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

    const Wrapper = f.animations ? motion.div : "div";
    const anim = f.animations ? { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } } : {};
    const delayAnim = (d: number) => f.animations ? { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 }, transition: { delay: d } } : {};

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-white relative overflow-hidden">
            {/* ── Aurora BG (Team only) ───────────────────── */}
            {f.aurora && (
                <>
                    <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cima-gold/[0.04] rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-blue-500/[0.03] rounded-full blur-[100px]" />
                </>
            )}

            {/* ── Hero ──────────────────────────────────── */}
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
                            <span className="text-sm font-bold tracking-tight">Tu Marca Aquí</span>
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
                                    <span className="text-white/40">Colinas de San Jerónimo</span>
                                </h1>
                                <p className={`text-lg font-heading font-bold ${accentText} mb-6`}>$8,500,000 MXN</p>
                                <p className="text-sm text-white/40 leading-relaxed mb-8 max-w-md">
                                    {isStarter
                                        ? "Hermosa residencia de 320m² con acabados de lujo."
                                        : "Hermosa residencia de 320m² en una de las zonas más exclusivas. Acabados de lujo, jardín privado y vista panorámica a la montaña."
                                    }
                                </p>
                            </Wrapper>

                            {/* Stats */}
                            <div className="grid grid-cols-4 gap-3 mb-8">
                                {[
                                    { icon: BedDouble, value: "4", label: "Recámaras" },
                                    { icon: Bath, value: "3.5", label: "Baños" },
                                    { icon: Ruler, value: "320", label: "m²" },
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
                                <button className={`flex-1 flex items-center justify-center gap-2 ${isTeam ? "bg-cima-gold text-black hover:bg-white" : "bg-white text-black hover:bg-blue-400"} px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all`}>
                                    <Calendar className="h-4 w-4" />
                                    Agendar Visita
                                </button>
                                <button className="flex items-center gap-2 border border-white/10 bg-white/5 text-white/60 px-5 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all">
                                    <Phone className="h-4 w-4" />
                                    Llamar
                                </button>
                            </div>
                        </div>

                        {/* Image grid — interactive for Pro/Team, static for Starter */}
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

            {/* ── Antes vs Después (Pro/Team only) ────────── */}
            {(isPro || isTeam) && (
                <div className="max-w-6xl mx-auto px-6 py-20 border-t border-white/5">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl font-heading font-black mb-4">Diferénciate de la competencia</h2>
                        <p className="text-sm text-white/40 max-w-lg mx-auto">
                            Transformamos un anuncio genérico en una experiencia premium que genera confianza.
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
                                    <p className="text-[10px] font-bold text-white/60">❌ Diseño genérico y poco profesional</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Después: Landing Pro */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className={`${isTeam ? "border-cima-gold/40 shadow-[0_0_30px_rgba(200,169,110,0.1)]" : "border-blue-500/40 shadow-[0_0_30px_rgba(59,130,246,0.1)]"} bg-white/[0.03] border-2 rounded-2xl p-6 relative overflow-hidden`}
                        >
                            <div className={`${isTeam ? "bg-cima-gold text-black" : "bg-blue-500 text-white"} absolute top-4 right-4 text-[8px] font-black px-2 py-1 rounded uppercase tracking-wider`}>
                                Después: Cima Pro
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
                                <p className="text-[10px] font-bold text-white">✅ Atrae leads de alto valor</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}

            {/* ── Social Proof (Team only) ────────────────── */}
            {f.socialProof && (
                <div className="max-w-6xl mx-auto px-6 py-12 border-t border-white/5">
                    <div className="flex items-center justify-center gap-8 mb-8">
                        {[
                            { value: "98%", label: "Clientes satisfechos" },
                            { value: "+250", label: "Propiedades vendidas" },
                            { value: "< 30 días", label: "Tiempo promedio" },
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
                        <p className="text-sm text-white/60 italic mb-3">&quot;Vendieron nuestra casa en 21 días. El portal del propietario nos mantuvo informados en todo momento.&quot;</p>
                        <p className="text-xs font-bold text-white">Familia Treviño</p>
                        <p className="text-[8px] text-white/30">Residencia Carretera Nacional</p>
                    </div>
                </div>
            )}

            {/* ── Features / Trust ──────────────────────── */}
            <div className="max-w-6xl mx-auto px-6 py-16">
                <div className={`grid grid-cols-1 ${isStarter ? "md:grid-cols-2" : "md:grid-cols-3"} gap-4 mb-16`}>
                    {[
                        { icon: Shield, title: "Garantía de 30 días", desc: "Si no vendemos tu propiedad, te devolvemos tu inversión" },
                        { icon: Camera, title: "Fotografía profesional", desc: "Sesión HDR completa + video tour + drone aéreo" },
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

                {/* ── ROI Section (Team only) ────────────────── */}
                {f.roiCalculator && (
                    <div className="mb-16">
                        <div className="text-center mb-8">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cima-gold/10 border border-cima-gold/20 text-[8px] font-bold text-cima-gold uppercase tracking-widest mb-3">
                                <TrendingUp className="h-3 w-3" /> Retorno de inversión
                            </span>
                            <h2 className="text-xl font-heading font-bold">Tu inversión se paga sola</h2>
                        </div>
                        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
                            {[
                                { icon: Zap, label: "Venta tradicional", value: "90+ días", sublabel: "Promedio sin marketing" },
                                { icon: TrendingUp, label: "Con plataforma", value: "< 30 días", sublabel: "Con estrategia digital" },
                                { icon: Award, label: "Ahorro neto", value: "+$150K", sublabel: "Vs. comisiones altas" },
                            ].map((item, i) => (
                                <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 + i * 0.1 }}
                                    className="bg-cima-gold/[0.03] border border-cima-gold/10 rounded-xl p-4 text-center">
                                    <item.icon className="h-5 w-5 text-cima-gold mx-auto mb-2" />
                                    <p className="text-xs text-white/30 mb-1">{item.label}</p>
                                    <p className="text-lg font-heading font-bold text-cima-gold">{item.value}</p>
                                    <p className="text-[7px] text-white/20">{item.sublabel}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Lead capture form */}
                <div className="max-w-md mx-auto">
                    <div className={`${isTeam ? "bg-cima-gold/[0.02] border-cima-gold/10" : "bg-white/[0.03] border-white/10"} border rounded-2xl p-8`}>
                        <h2 className="text-lg font-heading font-bold text-center mb-2">¿Te interesa esta propiedad?</h2>
                        <p className="text-xs text-white/40 text-center mb-6">Déjanos tus datos y te contactamos en menos de 1 hora</p>

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

            {/* ── Footer ───────────────────────────────── */}
            <div className="border-t border-white/5 py-6 text-center">
                <p className="text-[9px] text-white/20 uppercase tracking-widest">
                    {isTeam
                        ? "Landing Premium · Diseño exclusivo con tu marca"
                        : isPro
                            ? "Landing Profesional · Incluida con tu plan"
                            : "Landing Básica · Actualiza a Pro para más funciones"
                    }
                </p>
            </div>
        </div>
    );
}
