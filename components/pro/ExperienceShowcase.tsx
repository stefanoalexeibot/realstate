"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    Layout, Database, UserCheck, Zap,
    Search, Bell, Filter, MoreHorizontal,
    TrendingUp, Calendar, MessageSquare,
    Globe, Shield, Sparkles, Home,
    ChevronLeft, ChevronRight, Share2, Heart
} from "lucide-react";
import { useState, useEffect } from "react";

// --- Sub-component: Advisor Portal Preview ---
export function AdvisorDashboardPreview() {
    return (
        <div className="w-full aspect-[16/10] bg-[#0A0B0E] rounded-2xl border border-cima-border overflow-hidden flex shadow-2xl">
            {/* Sidebar */}
            <div className="w-16 border-r border-cima-border bg-cima-card/30 flex flex-col items-center py-6 gap-6">
                <div className="w-8 h-8 rounded-lg bg-cima-gold/20 flex items-center justify-center">
                    <Database className="h-4 w-4 text-cima-gold" />
                </div>
                {[Layout, UserCheck, Globe, Zap, Bell].map((Icon, i) => (
                    <Icon key={i} className="h-4 w-4 text-cima-text-muted opacity-40" />
                ))}
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col p-6 overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3 bg-cima-card/50 border border-white/5 rounded-lg px-3 py-1.5 w-64">
                        <Search className="h-3.5 w-3.5 text-cima-text-muted" />
                        <span className="text-[10px] text-cima-text-muted font-medium">Search properties, leads...</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-cima-gold/10 border border-cima-gold/20" />
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-2 gap-4 h-full">
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-cima-text uppercase tracking-widest">Active Listings</h4>
                        {[1, 2].map((i) => (
                            <div key={i} className="p-3 rounded-xl bg-cima-card/40 border border-cima-border flex gap-3 group">
                                <div className="w-12 h-12 rounded-lg bg-cima-gold/5 border border-white/5 shrink-0 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-cima-gold/10 to-transparent" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="h-2 w-20 bg-white/10 rounded mb-2" />
                                    <div className="h-1.5 w-12 bg-cima-gold/20 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Floating IA Insight */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.8 }}
                        className="bg-cima-gold/10 border border-cima-gold/30 rounded-2xl p-4 self-start relative shadow-xl shadow-cima-gold/5"
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="h-3 w-3 text-cima-gold animate-pulse" />
                            <span className="text-[9px] font-black text-cima-gold uppercase tracking-[0.2em]">Cima IA Insight</span>
                        </div>
                        <p className="text-[10px] text-cima-text leading-tight mb-3">
                            "El prospecto 'Robert K.' mostró 95% de interés en Penthouse Del Valle tras ver el tour 3D 4 veces."
                        </p>
                        <button className="w-full py-1.5 rounded-lg bg-cima-gold text-cima-bg text-[8px] font-black uppercase">
                            Generar Llamada IA
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

// --- Sub-component: Owner Portal Preview ---
export function OwnerPortalPreview() {
    return (
        <div className="w-full aspect-[16/10] bg-[#0A0B0E] rounded-2xl border border-cima-border overflow-hidden p-8 flex flex-col shadow-2xl relative">
            <div className="absolute top-0 right-0 p-6 flex gap-2">
                <div className="px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20">
                    <span className="text-[8px] font-black text-green-400 uppercase tracking-widest">En Venta</span>
                </div>
            </div>

            <h4 className="text-[10px] font-black text-cima-gold uppercase tracking-[0.3em] mb-2">Mi Propiedad</h4>
            <h3 className="text-xl font-heading font-black text-cima-text mb-8">Estatus: Residencia Magnolia</h3>

            <div className="grid grid-cols-3 gap-6 mb-8">
                {[
                    { label: "Vistas Portal", val: "1,248", icon: Globe },
                    { label: "Leads Calificados", val: "12", icon: UserCheck },
                    { label: "Cierres Proyectados", val: "2", icon: TrendingUp }
                ].map((stat, i) => (
                    <div key={i} className="p-4 rounded-xl bg-cima-card/30 border border-cima-border flex flex-col gap-1">
                        <stat.icon className="h-3 w-3 text-cima-gold/50 mb-1" />
                        <span className="text-[9px] uppercase font-bold text-cima-text-muted tracking-widest">{stat.label}</span>
                        <span className="text-xl font-black text-cima-text">{stat.val}</span>
                    </div>
                ))}
            </div>

            {/* Timeline */}
            <div className="flex-1 space-y-4">
                <span className="text-[9px] font-black text-cima-text-muted uppercase tracking-widest block mb-4">Línea de Tiempo Operativa</span>
                {[
                    { date: "Hoy", text: "Visita agendada para Inversionistas" },
                    { date: "Ayer", text: "Optimización de ficha técnica con IA completada" },
                    { date: "24 Feb", text: "Propiedad sincronizada en portales Premium" }
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 group">
                        <div className="w-2 h-2 rounded-full bg-cima-gold/40 relative">
                            {i === 0 && <div className="absolute inset-0 rounded-full animate-ping bg-cima-gold" />}
                        </div>
                        <span className="font-mono text-[9px] text-cima-gold font-bold w-12">{item.date}</span>
                        <span className="text-[10px] text-cima-text font-medium opacity-70 group-hover:opacity-100 transition-opacity">
                            {item.text}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// --- Sub-component: Property Landing Preview ---
export function PropertyLandingPreview() {
    return (
        <div className="w-full aspect-[16/10] bg-cima-bg rounded-2xl border border-cima-border overflow-hidden flex flex-col shadow-2xl group">
            {/* Browser Header */}
            <div className="h-8 bg-cima-card/50 border-b border-cima-border flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500/20" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/20" />
                    <div className="w-2 h-2 rounded-full bg-green-500/20" />
                </div>
                <div className="mx-auto w-32 h-3.5 bg-cima-bg/50 rounded-md border border-white/5" />
            </div>

            {/* Landing Body */}
            <div className="flex-1 relative overflow-hidden flex flex-col pt-6 px-8">
                {/* Hero Section */}
                <div className="flex justify-between items-start mb-10">
                    <div className="space-y-2">
                        <div className="h-3 w-16 bg-cima-gold/20 rounded" />
                        <div className="h-6 w-40 bg-white/10 rounded" />
                        <div className="h-3.5 w-32 bg-white/5 rounded" />
                    </div>
                    <div className="flex gap-4">
                        <Heart className="h-4 w-4 text-cima-gold/40" />
                        <Share2 className="h-4 w-4 text-cima-gold/40" />
                    </div>
                </div>

                {/* Gallery Preview */}
                <div className="grid grid-cols-4 gap-3 flex-1">
                    <div className="col-span-3 h-full rounded-xl bg-gradient-to-br from-cima-card to-cima-bg border border-white/5 relative group-hover:scale-[1.02] transition-transform duration-700 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        <div className="absolute bottom-4 left-4 flex gap-2">
                            <Calendar className="h-3 w-3 text-white/40" />
                            <div className="h-2 w-12 bg-white/20 rounded-full" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="h-1/2 rounded-xl bg-cima-card/50 border border-white/5" />
                        <div className="h-1/2 rounded-xl bg-cima-card/50 border border-white/5" />
                    </div>
                </div>

                {/* Floating Contact Trigger */}
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="absolute bottom-6 right-6 p-4 rounded-xl bg-cima-gold text-cima-bg shadow-2xl flex items-center gap-3"
                >
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Agendar Cita</span>
                </motion.div>
            </div>
        </div>
    );
}

// --- Combined Showcase Section Component ---
export default function ExperienceShowcase() {
    const [active, setActive] = useState(0);

    const experiences = [
        {
            id: "advisor",
            title: "Portal del Asesor",
            description: "Control central de inventario y agentes IA calificados.",
            component: AdvisorDashboardPreview
        },
        {
            id: "owner",
            title: "Portal Propietario",
            description: "Transparencia absoluta para ganar todas las exclusivas.",
            component: OwnerPortalPreview
        },
        {
            id: "landing",
            title: "Landing Elite",
            description: "Convertimos cada propiedad en una marca de ultra-lujo.",
            component: PropertyLandingPreview
        }
    ];

    return (
        <div className="space-y-20">
            {/* Desktop Version: Horizontal Switcher */}
            <div className="hidden lg:block space-y-16">
                <div className="flex justify-center gap-10">
                    {experiences.map((exp, i) => (
                        <button
                            key={exp.id}
                            onClick={() => setActive(i)}
                            className={`flex flex-col items-start gap-2 transition-all duration-500 border-l-2 pl-6 py-2 ${active === i ? "border-cima-gold opacity-100" : "border-cima-border opacity-40 hover:opacity-100"}`}
                        >
                            <span className="text-[10px] font-black uppercase tracking-widest block">{exp.title}</span>
                            <span className="text-xs text-cima-text-dim text-left max-w-[200px] leading-relaxed">{exp.description}</span>
                        </button>
                    ))}
                </div>

                <div className="relative max-w-5xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={active}
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -20 }}
                            transition={{ duration: 0.6, ease: "circOut" }}
                        >
                            {experiences[active].component()}
                        </motion.div>
                    </AnimatePresence>

                    {/* Decorative Elements */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-cima-gold/10 rounded-full blur-[80px] -z-10" />
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-[80px] -z-10" />
                </div>
            </div>

            {/* Mobile/Tablet Version: Staggered List (Similar to before but with live previews) */}
            <div className="lg:hidden space-y-32">
                {experiences.map((exp, i) => (
                    <div key={exp.id} className="space-y-8">
                        <div className="text-center">
                            <span className="text-[10px] font-black text-cima-gold uppercase tracking-[0.2em] mb-2 block">{exp.title}</span>
                            <p className="text-sm text-cima-text-dim max-w-xs mx-auto">{exp.description}</p>
                        </div>
                        <div className="px-4">
                            {exp.component()}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
