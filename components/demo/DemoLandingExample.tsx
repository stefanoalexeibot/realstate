"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Home, Phone, MapPin, BedDouble, Bath, Ruler,
    Camera, Calendar, Shield, Star, ArrowRight, CheckCircle2
} from "lucide-react";

/**
 * Generic example landing page for live demos.
 * Uses neutral branding — no mention of Cima Propiedades.
 * Shows what a property landing page looks like for the agent's clients.
 */
export default function DemoLandingExample() {
    return (
        <div className="min-h-screen bg-[#0A0A0B] text-white">
            {/* ── Hero ──────────────────────────────────── */}
            <div className="relative overflow-hidden">
                {/* Background image placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-[#0A0A0B] to-[#0A0A0B]" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

                <div className="relative max-w-6xl mx-auto px-6 pt-8 pb-16">
                    {/* Nav */}
                    <div className="flex items-center justify-between mb-16">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center">
                                <Home className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-sm font-bold tracking-tight">Tu Marca Aquí</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-xs text-white/40 hidden sm:block">Asesor Certificado</span>
                            <button className="bg-white text-black px-4 py-2 rounded-lg text-xs font-bold">
                                Contactar
                            </button>
                        </div>
                    </div>

                    {/* Hero Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-[9px] font-bold text-green-400 uppercase tracking-widest mb-4">
                                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                                    Disponible
                                </span>
                                <h1 className="text-3xl md:text-4xl font-heading font-black tracking-tight leading-tight mb-4">
                                    Residencia Premium
                                    <br />
                                    <span className="text-white/40">Colinas de San Jerónimo</span>
                                </h1>
                                <p className="text-lg font-heading font-bold text-blue-400 mb-6">$8,500,000 MXN</p>
                                <p className="text-sm text-white/40 leading-relaxed mb-8 max-w-md">
                                    Hermosa residencia de 320m² en una de las zonas más exclusivas.
                                    Acabados de lujo, jardín privado y vista panorámica a la montaña.
                                </p>
                            </motion.div>

                            {/* Stats */}
                            <div className="grid grid-cols-4 gap-3 mb-8">
                                {[
                                    { icon: BedDouble, value: "4", label: "Recámaras" },
                                    { icon: Bath, value: "3.5", label: "Baños" },
                                    { icon: Ruler, value: "320", label: "m²" },
                                    { icon: Camera, value: "24", label: "Fotos" },
                                ].map((stat, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 + i * 0.1 }}
                                        className="bg-white/[0.03] border border-white/5 rounded-xl p-3 text-center"
                                    >
                                        <stat.icon className="h-4 w-4 text-white/20 mx-auto mb-1" />
                                        <p className="text-sm font-bold text-white">{stat.value}</p>
                                        <p className="text-[7px] text-white/30 uppercase font-bold tracking-wider">{stat.label}</p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* CTA */}
                            <div className="flex gap-3">
                                <button className="flex-1 flex items-center justify-center gap-2 bg-white text-black px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-blue-400 transition-all">
                                    <Calendar className="h-4 w-4" />
                                    Agendar Visita
                                </button>
                                <button className="flex items-center gap-2 border border-white/10 bg-white/5 text-white/60 px-5 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all">
                                    <Phone className="h-4 w-4" />
                                    Llamar
                                </button>
                            </div>
                        </div>

                        {/* Image grid */}
                        <div className="hidden lg:grid grid-cols-2 gap-3">
                            {["/cocina-despues.png", "/estancia-despues.png", "/recamara-despues.png", "/cocina-despues.png"].map((img, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 + i * 0.1 }}
                                    className={`rounded-xl overflow-hidden border border-white/5 ${i === 0 ? "col-span-2 aspect-video" : "aspect-square"}`}
                                >
                                    <img src={img} alt={`Foto ${i + 1}`} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Features / Trust ──────────────────────── */}
            <div className="max-w-6xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
                    {[
                        { icon: Shield, title: "Garantía de 30 días", desc: "Si no vendemos tu propiedad, te devolvemos tu inversión" },
                        { icon: Camera, title: "Fotografía profesional", desc: "Sesión HDR completa + video tour + drone aéreo" },
                        { icon: Star, title: "Portal del propietario", desc: "Sigue el progreso de tu venta en tiempo real, 24/7" },
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                            className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all"
                        >
                            <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                                <feature.icon className="h-5 w-5 text-blue-400" />
                            </div>
                            <h3 className="text-sm font-bold text-white mb-2">{feature.title}</h3>
                            <p className="text-xs text-white/40 leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Lead capture form */}
                <div className="max-w-md mx-auto">
                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
                        <h2 className="text-lg font-heading font-bold text-center mb-2">¿Te interesa esta propiedad?</h2>
                        <p className="text-xs text-white/40 text-center mb-6">Déjanos tus datos y te contactamos en menos de 1 hora</p>

                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="Tu nombre"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-blue-400/40 transition-all"
                                readOnly
                            />
                            <input
                                type="tel"
                                placeholder="81 1234 5678"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-blue-400/40 transition-all"
                                readOnly
                            />
                            <input
                                type="email"
                                placeholder="tu@email.com"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-blue-400/40 transition-all"
                                readOnly
                            />
                            <button className="w-full flex items-center justify-center gap-2 bg-white text-black px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-blue-400 transition-all">
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
                    Esta es una landing de ejemplo · Tu marca y propiedades aparecerán aquí
                </p>
            </div>
        </div>
    );
}
