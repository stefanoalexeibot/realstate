"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Home, TrendingUp, FileText, Camera, Share2,
    Star, MessageSquare, Clock, CheckCircle2,
    AlertCircle, ThumbsUp, ThumbsDown, Minus,
    Facebook, Send, Calendar, Eye, Shield, User
} from "lucide-react";
import type { PlanConfig } from "@/lib/config/demo-plans";
import UpgradeBanner from "./UpgradeBanner";

interface DemoPortalProps {
    plan: PlanConfig;
}

type TabId = "dashboard" | "feedback" | "documents" | "evidence";

export default function DemoPortal({ plan }: DemoPortalProps) {
    const f = plan.features.portal;
    const [activeTab, setActiveTab] = useState<TabId>("dashboard");

    const tabs: { id: TabId; label: string; icon: React.ElementType; available: boolean; requiredTier?: "profesional" | "premium" }[] = [
        { id: "dashboard", label: "Dashboard", icon: Home, available: true },
        { id: "feedback", label: "Seguimiento", icon: MessageSquare, available: f.feedback, requiredTier: "profesional" },
        { id: "documents", label: "Documentos", icon: FileText, available: f.documents, requiredTier: "profesional" },
        { id: "evidence", label: "Evidencia", icon: Camera, available: f.evidence, requiredTier: "premium" },
    ];

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-white pb-20 sm:pb-0">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-2xl bg-cima-gold/10 border border-cima-gold/20 flex items-center justify-center">
                            <Home className="h-5 w-5 text-cima-gold" />
                        </div>
                        <div>
                            <h1 className="text-lg font-heading font-black tracking-tight">Portal del Propietario</h1>
                            <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest">Residencia Las Misiones • {plan.name}</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-1 mb-8 bg-white/[0.03] p-1 rounded-xl border border-white/5">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => tab.available && setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all ${activeTab === tab.id
                                ? "bg-cima-gold text-black shadow-lg shadow-cima-gold/20"
                                : tab.available
                                    ? "text-white/40 hover:text-white/60 hover:bg-white/5"
                                    : "text-white/10 cursor-not-allowed"
                                }`}
                        >
                            <tab.icon className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">{tab.label}</span>
                            {!tab.available && <span className="text-[6px] opacity-60">🔒</span>}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === "dashboard" && <DashboardTab plan={plan} />}
                {activeTab === "feedback" && (f.feedback ? <FeedbackTab plan={plan} /> : <UpgradeBanner currentTier={plan.tier} requiredTier="profesional" featureName="Seguimiento y Feedback" />)}
                {activeTab === "documents" && (f.documents ? <DocumentsTab /> : <UpgradeBanner currentTier={plan.tier} requiredTier="profesional" featureName="Expediente Digital" />)}
                {activeTab === "evidence" && (f.evidence ? <EvidenceTab plan={plan} /> : <UpgradeBanner currentTier={plan.tier} requiredTier="premium" featureName="Evidencia Fotográfica" />)}
            </div>
        </div>
    );
}

/* ─── Dashboard Tab ─────────────────────────────────────────── */
function DashboardTab({ plan }: { plan: PlanConfig }) {
    const stages = [
        { label: "Publicada", complete: true },
        { label: "Visitas", complete: true },
        { label: "Oferta", complete: false, active: true },
        { label: "Negociación", complete: false },
        { label: "Cierre", complete: false },
    ];

    const daysActive = 12;
    const daysGuarantee = 30;

    return (
        <div className="space-y-6">
            {/* Days Active Counter */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 bg-gradient-to-r from-green-500/5 to-transparent border border-green-500/10 rounded-2xl px-5 py-3"
            >
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-green-400" />
                    <div>
                        <p className="text-xs font-bold text-white">
                            <span className="text-green-400 font-heading text-lg">{daysActive}</span> días activos
                        </p>
                        <p className="text-[8px] text-white/30">de {daysGuarantee} días de garantía</p>
                    </div>
                </div>
                {/* Mini progress bar */}
                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(daysActive / daysGuarantee) * 100}%` }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="h-full bg-gradient-to-r from-green-500/60 to-green-400 rounded-full"
                    />
                </div>
                <span className="text-[8px] font-black text-green-400 uppercase bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20 shrink-0">
                    En Garantía
                </span>
            </motion.div>

            {/* Welcome Card with Advisor Photo */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <p className="text-xs text-white/40 mb-1">Bienvenido</p>
                        <h2 className="text-xl font-heading font-bold">Familia García</h2>
                        {/* Advisor with photo */}
                        <div className="flex items-center gap-2 mt-2">
                            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-cima-gold/30 to-cima-gold/10 border border-cima-gold/20 flex items-center justify-center overflow-hidden">
                                <User className="h-3.5 w-3.5 text-cima-gold" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-white/60">Carlos Martínez</p>
                                <p className="text-[8px] text-white/20">Tu asesor asignado</p>
                            </div>
                            <div className="h-2 w-2 rounded-full bg-green-500 ml-1" />
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[8px] text-white/20 uppercase font-bold tracking-widest mb-1">Precio</p>
                        <p className="text-lg font-heading font-bold text-cima-gold">$12,400,000</p>
                    </div>
                </div>

                {/* Property Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { label: "Recámaras", value: "4", icon: "🛏️" },
                        { label: "Baños", value: "3", icon: "🚿" },
                        { label: "m² Terreno", value: "320", icon: "📐" },
                        { label: "Tipo", value: "Residencial", icon: "🏠" },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white/[0.03] border border-white/5 rounded-xl p-3 text-center">
                            <span className="text-lg mb-1 block">{stat.icon}</span>
                            <p className="text-sm font-bold text-white">{stat.value}</p>
                            <p className="text-[7px] text-white/30 uppercase font-bold tracking-wider">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sale Timeline */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                <h3 className="text-xs font-black uppercase tracking-wider text-white/60 mb-6 flex items-center gap-2">
                    <TrendingUp className="h-3.5 w-3.5 text-cima-gold" />
                    Etapa de Venta
                </h3>
                <div className="flex items-center justify-between gap-1">
                    {stages.map((stage, i) => (
                        <div key={i} className="flex-1 flex items-center gap-1">
                            <div className="flex flex-col items-center flex-1">
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: i * 0.15 }}
                                    className={`h-8 w-8 rounded-full flex items-center justify-center mb-2 transition-all ${stage.complete
                                        ? "bg-cima-gold text-black shadow-lg shadow-cima-gold/20"
                                        : stage.active
                                            ? "bg-cima-gold/20 border-2 border-cima-gold text-cima-gold animate-pulse"
                                            : "bg-white/5 border border-white/10 text-white/20"
                                        }`}>
                                    {stage.complete ? (
                                        <CheckCircle2 className="h-4 w-4" />
                                    ) : (
                                        <span className="text-[8px] font-bold">{i + 1}</span>
                                    )}
                                </motion.div>
                                <span className={`text-[7px] font-bold uppercase tracking-wider text-center ${stage.complete ? "text-cima-gold" : stage.active ? "text-white/60" : "text-white/20"
                                    }`}>
                                    {stage.label}
                                </span>
                            </div>
                            {i < stages.length - 1 && (
                                <div className={`h-0.5 flex-1 rounded-full -mt-5 ${stage.complete ? "bg-cima-gold/40" : "bg-white/5"
                                    }`} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Marketing Plan Badge */}
            <div className="bg-gradient-to-r from-cima-gold/10 to-transparent border border-cima-gold/20 rounded-2xl p-5 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-cima-gold/20 flex items-center justify-center shrink-0">
                    <Shield className="h-6 w-6 text-cima-gold" />
                </div>
                <div>
                    <p className="text-xs font-black text-white uppercase tracking-wider mb-1">Plan de Marketing Activo</p>
                    <p className="text-[10px] text-white/40">Portales inmobiliarios + Redes sociales + Landing dedicada</p>
                </div>
                <div className="ml-auto px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-lg shrink-0">
                    <span className="text-[8px] font-black text-green-400 uppercase">Activo</span>
                </div>
            </div>
        </div>
    );
}

/* ─── Feedback Tab ──────────────────────────────────────────── */
function FeedbackTab({ plan }: { plan: PlanConfig }) {
    const sentiments = [
        { label: "Le encantó", count: 3, icon: ThumbsUp, color: "text-green-400 bg-green-500/10 border-green-500/20" },
        { label: "Lo pensará", count: 2, icon: Minus, color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" },
        { label: "Precio alto", count: 1, icon: ThumbsDown, color: "text-red-400 bg-red-500/10 border-red-500/20" },
    ];

    const prospects = [
        { name: "Familia Rodríguez", date: "25 Feb", rating: 5, comment: "Excelente ubicación, les encantó la cocina y el jardín.", sentiment: "positive" },
        { name: "Ing. Luis Garza", date: "23 Feb", rating: 4, comment: "Interesado pero quiere negociar el precio. Volverá con oferta.", sentiment: "neutral" },
        { name: "Sra. Ana Treviño", date: "20 Feb", rating: 5, comment: "Le fascinó la distribución, pidió segunda visita con su esposo.", sentiment: "positive" },
        { name: "Lic. Pedro Salazar", date: "18 Feb", rating: 3, comment: "Buscaba algo más pequeño, pero agradece la visita.", sentiment: "negative" },
    ];

    return (
        <div className="space-y-6">
            {/* Market Sentiment */}
            {plan.features.portal.marketSentiment && (
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                    <h3 className="text-xs font-black uppercase tracking-wider text-white/60 mb-4 flex items-center gap-2">
                        <TrendingUp className="h-3.5 w-3.5 text-cima-gold" />
                        Sentimiento del Mercado
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                        {sentiments.map((s, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className={`border rounded-xl p-4 text-center ${s.color}`}
                            >
                                <s.icon className="h-5 w-5 mx-auto mb-2" />
                                <p className="text-lg font-heading font-bold">{s.count}</p>
                                <p className="text-[8px] font-bold uppercase tracking-wider opacity-70">{s.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Individual Feedback */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                <h3 className="text-xs font-black uppercase tracking-wider text-white/60 mb-4 flex items-center gap-2">
                    <MessageSquare className="h-3.5 w-3.5 text-cima-gold" />
                    Opiniones de Prospectos
                </h3>
                <div className="space-y-3">
                    {prospects.map((p, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + i * 0.1 }}
                            className="bg-white/[0.02] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-all"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[8px] font-bold ${p.sentiment === "positive"
                                        ? "bg-green-500/20 text-green-400"
                                        : p.sentiment === "neutral"
                                            ? "bg-yellow-500/20 text-yellow-400"
                                            : "bg-red-500/20 text-red-400"
                                        }`}>
                                        {p.name.charAt(0)}
                                    </div>
                                    <span className="text-xs font-bold text-white">{p.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, j) => (
                                            <Star key={j} className={`h-2.5 w-2.5 ${j < p.rating ? "text-cima-gold fill-cima-gold" : "text-white/10"}`} />
                                        ))}
                                    </div>
                                    <span className="text-[8px] text-white/20 font-mono">{p.date}</span>
                                </div>
                            </div>
                            <p className="text-xs text-white/50 italic leading-relaxed">&quot;{p.comment}&quot;</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ─── Documents Tab ─────────────────────────────────────────── */
function DocumentsTab() {
    const documents = [
        { name: "Escrituras de Propiedad", status: "verified", date: "15 Ene 2025" },
        { name: "Predial 2025", status: "pending", date: "Pendiente" },
        { name: "Certificado de Libertad de Gravamen", status: "verified", date: "20 Ene 2025" },
        { name: "Acta de Matrimonio", status: "verified", date: "15 Ene 2025" },
        { name: "INE / Identificación Oficial", status: "verified", date: "15 Ene 2025" },
        { name: "CFE / Agua / Gas", status: "pending", date: "Pendiente" },
    ];

    return (
        <div className="space-y-6">
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                <h3 className="text-xs font-black uppercase tracking-wider text-white/60 mb-4 flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-cima-gold" />
                    Expediente Digital
                </h3>
                <div className="space-y-2">
                    {documents.map((doc, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/10 transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${doc.status === "verified"
                                    ? "bg-green-500/10 border border-green-500/20"
                                    : "bg-yellow-500/10 border border-yellow-500/20"
                                    }`}>
                                    {doc.status === "verified" ? (
                                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                                    ) : (
                                        <AlertCircle className="h-4 w-4 text-yellow-400" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white">{doc.name}</p>
                                    <p className="text-[8px] text-white/30 font-mono">{doc.date}</p>
                                </div>
                            </div>
                            <span className={`px-2 py-1 rounded-lg text-[7px] font-black uppercase tracking-widest ${doc.status === "verified"
                                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                                }`}>
                                {doc.status === "verified" ? "✓ Recibido" : "⏳ Pendiente"}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Progress */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] font-black uppercase tracking-wider text-white/40">Progreso del Expediente</span>
                    <span className="text-sm font-heading font-bold text-cima-gold">67%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "67%" }}
                        transition={{ delay: 0.3, duration: 1 }}
                        className="h-full bg-gradient-to-r from-cima-gold/60 to-cima-gold rounded-full shadow-[0_0_8px_rgba(200,169,110,0.3)]"
                    />
                </div>
                <p className="text-[8px] text-white/20 mt-2">4 de 6 documentos verificados</p>
            </div>
        </div>
    );
}

/* ─── Evidence Tab ──────────────────────────────────────────── */
function EvidenceTab({ plan }: { plan: PlanConfig }) {
    const visits = [
        {
            date: "25 Feb 2025",
            prospect: "Familia Rodríguez",
            photos: ["/cocina-despues.png", "/estancia-despues.png", "/recamara-despues.png"],
        },
        {
            date: "23 Feb 2025",
            prospect: "Ing. Luis Garza",
            photos: ["/estancia-despues.png", "/recamara-despues.png"],
        },
    ];

    return (
        <div className="space-y-6">
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                <h3 className="text-xs font-black uppercase tracking-wider text-white/60 mb-4 flex items-center gap-2">
                    <Camera className="h-3.5 w-3.5 text-cima-gold" />
                    Evidencia Fotográfica de Visitas
                </h3>

                <div className="space-y-6">
                    {visits.map((visit, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.2 }}
                            className="bg-white/[0.02] border border-white/5 rounded-xl p-4"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-3.5 w-3.5 text-cima-gold" />
                                    <span className="text-xs font-bold text-white">{visit.prospect}</span>
                                </div>
                                <span className="text-[8px] text-white/30 font-mono">{visit.date}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {visit.photos.map((photo, j) => (
                                    <div key={j} className="aspect-video rounded-lg overflow-hidden border border-white/5 group">
                                        <img
                                            src={photo}
                                            alt={`Evidencia ${j + 1}`}
                                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                                        />
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Sharing - Premium only */}
            {plan.features.portal.sharing && (
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                    <h3 className="text-xs font-black uppercase tracking-wider text-white/60 mb-4 flex items-center gap-2">
                        <Share2 className="h-3.5 w-3.5 text-cima-gold" />
                        Compartir en Redes
                    </h3>
                    <div className="flex gap-3">
                        <a
                            href="https://wa.me/?text=Mira%20esta%20propiedad%20en%20venta%3A%20Residencia%20Las%20Misiones%20-%20%2412%2C400%2C000%20MXN%20%F0%9F%8F%A0"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600/20 border border-green-600/30 rounded-xl text-green-400 text-xs font-bold uppercase hover:bg-green-600/30 transition-all"
                        >
                            <Send className="h-4 w-4" />
                            WhatsApp
                        </a>
                        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600/20 border border-blue-600/30 rounded-xl text-blue-400 text-xs font-bold uppercase hover:bg-blue-600/30 transition-all">
                            <Facebook className="h-4 w-4" />
                            Facebook
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
