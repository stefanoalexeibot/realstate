"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Home, TrendingUp, FileText, Camera, Share2,
    Star, MessageSquare, Clock, CheckCircle2,
    AlertCircle, ThumbsUp, ThumbsDown, Minus,
    Facebook, Send, Calendar, Eye, Shield, User, Smartphone, Monitor, Moon, MoonStar
} from "lucide-react";
import type { PlanConfig } from "@/lib/config/demo-plans";
import UpgradeBanner from "./UpgradeBanner";
import { MobileFrame } from "./MobileFrame";

interface DemoPortalProps {
    plan: PlanConfig;
    isMobilePreview?: boolean;
    setIsMobilePreview?: (v: boolean) => void;
    isDND?: boolean;
    setIsDND?: (v: boolean) => void;
    isDarkMode?: boolean;
    setIsDarkMode?: (v: boolean) => void;
}

type TabId = "dashboard" | "feedback" | "documents" | "evidence";

function PortalContent({ plan, f, activeTab, setActiveTab, tabs }: any) {
    return (
        <div className="w-full">
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
                {tabs.map((tab: any) => (
                    <button
                        key={tab.id}
                        onClick={() => tab.available && setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-[10px] font-bold transition-all relative ${activeTab === tab.id
                            ? "bg-cima-gold text-black shadow-lg shadow-cima-gold/20"
                            : tab.available
                                ? "text-white/40 hover:bg-white/5 hover:text-white"
                                : "text-white/10 cursor-not-allowed"
                            }`}
                    >
                        <tab.icon className="h-3.5 w-3.5" />
                        <span className="hidden xs:inline">{tab.label}</span>
                        {!tab.available && (
                            <div className="absolute -top-1 -right-1">
                                <Shield className="h-2.5 w-2.5 text-white/20" />
                            </div>
                        )}
                    </button>
                ))}
            </div>

            {/* Dashboard View */}
            {activeTab === "dashboard" && (
                <div className="space-y-6">
                    {/* Status Card */}
                    <div className="bg-cima-gold/[0.03] border border-cima-gold/20 rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cima-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-[10px] font-black text-cima-gold uppercase tracking-widest">Estado de Venta</span>
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[8px] font-black text-green-400 uppercase tracking-widest">Activo</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="space-y-1">
                                <p className="text-[8px] text-white/30 uppercase font-bold tracking-wider">Visitas este mes</p>
                                <p className="text-2xl font-heading font-black text-white">24</p>
                            </div>
                            <div className="space-y-1 border-l border-white/5 pl-4">
                                <p className="text-[8px] text-white/30 uppercase font-bold tracking-wider">Interesados</p>
                                <p className="text-2xl font-heading font-black text-white">8</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-[8px] font-bold uppercase tracking-widest mb-1">
                                <span className="text-white/40">Progreso a Cierre</span>
                                <span className="text-cima-gold">65%</span>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "65%" }}
                                    className="h-full bg-cima-gold rounded-full shadow-[0_0_10px_rgba(200,169,110,0.5)]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all group">
                            <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <TrendingUp className="h-4 w-4 text-blue-400" />
                            </div>
                            <h3 className="text-xs font-bold text-white mb-1">Alcance Estimado</h3>
                            <p className="text-[10px] text-white/40 leading-relaxed mb-4">Tu propiedad ha sido vista por más de 12,400 personas en redes sociales.</p>
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="h-5 w-5 rounded-full border-2 border-[#0A0A0B] bg-white/10 overflow-hidden">
                                            <User className="h-3 w-3 m-auto text-white/20" />
                                        </div>
                                    ))}
                                </div>
                                <span className="text-[8px] text-white/20 font-bold">+24 nuevos leads hoy</span>
                            </div>
                        </div>

                        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all group">
                            <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Facebook className="h-4 w-4 text-purple-400" />
                            </div>
                            <h3 className="text-xs font-bold text-white mb-1">Campañas Meta</h3>
                            <p className="text-[10px] text-white/40 leading-relaxed mb-4">Campañas activas en Facebook e Instagram enfocadas en perfiles inversionistas.</p>
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div animate={{ x: ["-100%", "100%"] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="h-full w-1/3 bg-purple-500/40" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Locked Feedback View */}
            {activeTab === "feedback" && !f.feedback && (
                <div className="py-20 text-center">
                    <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                        <MessageSquare className="h-8 w-8 text-white/20" />
                    </div>
                    <h2 className="text-lg font-heading font-bold mb-2">Feedback de Visitas</h2>
                    <p className="text-[10px] text-white/40 max-w-xs mx-auto mb-8 leading-relaxed"> Actualízate a <b>Cima Profesional</b> para ver lo que dicen los prospectos después de cada visita.</p>
                    <UpgradeBanner currentTier={plan.tier} requiredTier="profesional" featureName="Seguimiento de Visitas" />
                </div>
            )}

            {activeTab === "feedback" && f.feedback && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-bold">Comentarios Recientes</h2>
                        <span className="text-[8px] text-cima-gold font-bold uppercase tracking-widest">8 visitas registradas</span>
                    </div>

                    {[
                        { name: "Juan Ramón", date: "Hace 2 horas", comment: "Le encantó la vista, está comparando con otra opción en la misma zona.", sentiment: "up" },
                        { name: "Ana Lucía", date: "Ayer", comment: "Preguntó si el precio era negociable. Muy interesada en agendar segunda visita.", sentiment: "up" },
                        { name: "Carlos M.", date: "Hace 2 días", comment: "El patio le pareció un poco pequeño para lo que busca.", sentiment: "down" },
                    ].map((fb, i) => (
                        <div key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex gap-4">
                            <div className={`h-8 w-8 rounded-full shrink-0 flex items-center justify-center ${fb.sentiment === "up" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                                {fb.sentiment === "up" ? <ThumbsUp className="h-4 w-4" /> : <ThumbsDown className="h-4 w-4" />}
                            </div>
                            <div className="space-y-1 flex-1">
                                <div className="flex justify-between items-center">
                                    <p className="text-[10px] font-bold text-white">{fb.name}</p>
                                    <span className="text-[7px] text-white/20 font-bold">{fb.date}</span>
                                </div>
                                <p className="text-[10px] text-white/40 leading-relaxed">{fb.comment}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Documents View */}
            {activeTab === "documents" && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-bold">Expediente Digital</h2>
                        <button className="text-[8px] text-cima-gold font-bold uppercase tracking-widest hover:underline">Solicitar Actualización</button>
                    </div>

                    {[
                        { title: "Predial 2024", status: "Validado", size: "2.4 MB" },
                        { title: "Escrituras (Copia)", status: "Validado", size: "15.8 MB" },
                        { title: "Identificación Dueño", status: "Pendiente", size: "-" },
                        { title: "Planos Arquitectónicos", status: "Validado", size: "8.1 MB" },
                    ].map((doc, i) => (
                        <div key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex items-center justify-between group cursor-pointer hover:bg-white/[0.04]">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-cima-gold/10 transition-colors">
                                    <FileText className="h-5 w-5 text-white/20 group-hover:text-cima-gold transition-colors" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-white">{doc.title}</p>
                                    <p className="text-[8px] text-white/20">{doc.size}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`text-[8px] font-black uppercase tracking-widest ${doc.status === "Validado" ? "text-green-500" : "text-cima-gold"}`}>{doc.status}</span>
                                {doc.status === "Validado" ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Clock className="h-4 w-4 text-cima-gold" />}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === "evidence" && !f.evidence && (
                <div className="py-20 text-center">
                    <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                        <Camera className="h-8 w-8 text-white/20" />
                    </div>
                    <h2 className="text-lg font-heading font-bold mb-2">Evidencia Multi-Plataforma</h2>
                    <p className="text-[10px] text-white/40 max-w-xs mx-auto mb-8 leading-relaxed">Solo en el <b>Plan Team</b>: recibe reportes fotográficos de cómo estamos promocionando tu casa en todos los portales.</p>
                    <UpgradeBanner currentTier={plan.tier} requiredTier="premium" featureName="Reportes de Evidencia" />
                </div>
            )}
        </div>
    );
}

export default function DemoPortal({
    plan,
    isMobilePreview = false,
    setIsMobilePreview,
    isDND = false,
    setIsDND,
    isDarkMode = true,
    setIsDarkMode
}: DemoPortalProps) {
    const f = plan.features.portal;
    const [activeTab, setActiveTab] = useState<TabId>("dashboard");

    const tabs: { id: TabId; label: string; icon: React.ElementType; available: boolean; requiredTier?: "profesional" | "premium" }[] = [
        { id: "dashboard", label: "Dashboard", icon: Home, available: true },
        { id: "feedback", label: "Seguimiento", icon: MessageSquare, available: f.feedback, requiredTier: "profesional" },
        { id: "documents", label: "Documentos", icon: FileText, available: f.documents, requiredTier: "profesional" },
        { id: "evidence", label: "Evidencia", icon: Camera, available: f.evidence, requiredTier: "premium" },
    ];

    const contentProps = { plan, f, activeTab, setActiveTab, tabs };

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-white flex flex-col items-center pb-20 sm:pb-0">
            {/* Header with Toggles */}
            {setIsMobilePreview && setIsDND && (
                <div className="w-full max-w-4xl px-4 py-4 flex justify-end gap-2 border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-[120]">
                    <button
                        onClick={() => setIsMobilePreview(!isMobilePreview)}
                        className={`p-2.5 border rounded-xl transition-all flex items-center gap-2 group ${isMobilePreview ? "bg-cima-gold border-cima-gold text-black shadow-lg shadow-cima-gold/20" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white"}`}
                    >
                        {isMobilePreview ? <Monitor className="h-3.5 w-3.5" /> : <Smartphone className="h-3.5 w-3.5" />}
                        <span className="text-[8px] font-black uppercase tracking-widest">
                            {isMobilePreview ? "Escritorio" : "Móvil"}
                        </span>
                    </button>
                    <button
                        onClick={() => setIsDND(!isDND)}
                        className={`p-2.5 border rounded-xl transition-all flex items-center gap-2 group ${isDND ? "bg-cima-gold border-cima-gold text-black shadow-lg shadow-cima-gold/20" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white"}`}
                    >
                        {isDND ? <MoonStar className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
                        <span className="text-[8px] font-black uppercase tracking-widest">
                            {isDND ? "Silencio" : "Notificar"}
                        </span>
                    </button>
                </div>
            )}

            {isMobilePreview ? (
                <div className="py-10">
                    <MobileFrame isDarkMode={isDarkMode}>
                        <div className="bg-[#0A0A0B] min-h-full px-4 py-8">
                            <PortalContent {...contentProps} />
                        </div>
                    </MobileFrame>
                </div>
            ) : (
                <div className="max-w-4xl mx-auto px-4 py-8 w-full">
                    <PortalContent {...contentProps} />
                </div>
            )}
        </div>
    );
}
