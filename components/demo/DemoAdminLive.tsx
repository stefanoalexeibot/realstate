"use client";

import React, { useState, useEffect, useCallback } from "react";
// Vercel Redeploy Trigger: Phase 5 - Digital Vault
import { motion, AnimatePresence } from "framer-motion";
import {
    Layout, Home, Users, BarChart3, MessageSquare, Plus, Search,
    Filter, MoreVertical, Globe, Facebook, Instagram, Mail,
    Phone, ChevronRight, ArrowUpRight, ArrowDownRight, Clock,
    CheckCircle2, AlertCircle, Eye, Target, Calendar, Sparkles, Send, Zap, Loader2, Share2,
    Lock, X, Upload, ImageIcon, FileText, ExternalLink, Edit3, ToggleRight, BedDouble, Bath, Ruler,
    UserCircle, ChevronDown, ArrowRight, MapPin, TrendingUp, Settings, Bell, Wand2, RotateCcw, Download,
    ShieldCheck, FileSearch, ShieldAlert, FileCheck, FileSignature, FilePenLine, ScrollText, Briefcase,
    Smartphone, Monitor, Moon, MoonStar, ChevronLeft, Trash2, PieChart
} from "lucide-react";
import NextImage from "next/image";
import type { PlanConfig } from "@/lib/config/demo-plans";
import { type LiveLead, type LiveMessage } from "./LiveDemoClient";
import { MobileFrame } from "./MobileFrame";

/* ─── Types ────────────────────────────────────────────────── */
export type SidebarTab = "propiedades" | "leads" | "visitas" | "analiticos" | "mensajes" | "ia_studio" | "documentos" | "contratos";

interface DemoAdminLiveProps {
    plan: PlanConfig;
    leads: LiveLead[];
    onUpdateLeadStatus: (id: string, newStatus: string) => void;
    newLeadId?: string;
    agentName?: string;
    onNavigateToLeads?: () => void;
    externalTab?: SidebarTab;
    messages: LiveMessage[];
    onAddMessage: (from: string, text: string, isAi?: boolean) => void;
    isDarkMode?: boolean;
    setIsDarkMode?: (v: boolean) => void;
}

/* ─── Mock Data ────────────────────────────────────────────── */
const PROPERTIES = [
    { name: "Residencia Las Misiones", price: "$12.4M", status: "Venta", owner: "Fam. García", img: "/cocina-despues.png", hits: 142, trend: [30, 45, 38, 52, 60, 55, 72], beds: 4, baths: 3.5, m2: 320, address: "Av. Las Misiones 482, Col. Las Misiones" },
    { name: "Depto. Torre LOVFT", price: "$4.2M", status: "Exclusiva", owner: "Ing. Roberto M.", img: "/estancia-despues.png", hits: 89, trend: [20, 25, 35, 30, 40, 38, 45], beds: 2, baths: 2, m2: 110, address: "Torre LOVFT, Piso 12, Santa María" },
    { name: "Residencia Contry Sol", price: "$8.9M", status: "Venta", owner: "Dra. Sofía L.", img: "/recamara-despues.png", hits: 56, trend: [10, 15, 20, 25, 22, 30, 28], beds: 3, baths: 2.5, m2: 240, address: "Contry Sol 1024, Col. Contry" },
    { name: "Casa Valle Poniente", price: "$6.1M", status: "Venta", owner: "Sr. Hernández", img: "/cocina-despues.png", hits: 34, trend: [5, 8, 12, 10, 15, 18, 20], beds: 3, baths: 2, m2: 180, address: "Valle de Anáhuac 305, Valle Poniente" },
    { name: "Pent. Santa María", price: "$15.8M", status: "Exclusiva", owner: "Lic. Pérez", img: "/estancia-despues.png", hits: 201, trend: [50, 60, 55, 70, 80, 75, 90], beds: 3, baths: 3, m2: 195, address: "Penthouse, Torre Lux, Santa María" },
    { name: "Casa Cumbres Elite", price: "$5.5M", status: "Venta", owner: "Arq. Mendoza", img: "/recamara-despues.png", hits: 67, trend: [15, 22, 18, 28, 35, 32, 40], beds: 3, baths: 2.5, m2: 210, address: "Cumbres Elite 7° Sector, Priv. Ámbar" },
    { name: "Depto. Vía Cordillera", price: "$3.8M", status: "Venta", owner: "Sra. Lozano", img: "/cocina-despues.png", hits: 45, trend: [8, 12, 15, 11, 20, 18, 25], beds: 2, baths: 1, m2: 85, address: "Vía Cordillera 200, Col. Residencial" },
    { name: "Residencia Carretera Nal.", price: "$18.5M", status: "Exclusiva", owner: "Fam. Treviño", img: "/estancia-despues.png", hits: 178, trend: [40, 55, 48, 65, 72, 68, 85], beds: 5, baths: 4.5, m2: 480, address: "Carr. Nacional Km 268, La Estanzuela" },
];

const VISITS = [
    { prospect: "Familia Rodríguez", property: "Residencia Las Misiones", date: "Hoy", time: "11:00 AM", status: "confirmada", sentiment: "positive" },
    { prospect: "Ing. Luis Garza", property: "Depto. Torre LOVFT", date: "Hoy", time: "4:30 PM", status: "pendiente", sentiment: null },
    { prospect: "Sra. Ana Treviño", property: "Residencia Las Misiones", date: "Mañana", time: "10:00 AM", status: "confirmada", sentiment: null },
];

const NOTIFICATIONS = [
    { icon: Zap, text: "Nuevo lead desde Instagram", sub: "Ana Martínez — Residencia Las Misiones", color: "text-pink-400 bg-pink-500/20" },
    { icon: Calendar, text: "Visita agendada para mañana", sub: "Sra. Treviño — 10:00 AM", color: "text-blue-400 bg-blue-500/20" },
    { icon: MessageSquare, text: "Nuevo mensaje", sub: "Familia Rodríguez quiere reagendar", color: "text-purple-400 bg-purple-500/20" },
];

/* ─── Mini Sparkline ───────────────────────────────────────── */
function MiniChart({ data, color = "#C8A96E", height = 32 }: { data: number[]; color?: string; height?: number }) {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const w = 80;
    const points = data.map((v, i) => ({
        x: (i / (data.length - 1)) * w,
        y: height - ((v - min) / range) * (height - 4) - 2,
    }));
    const pathD = points.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(" ");
    return (
        <svg width={w} height={height} className="overflow-visible">
            <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/* ─── Admin Content Extracted ────────────────────────────── */
function AdminContent({
    activeTab, setActiveTab, isDarkMode, isMobilePreview,
    navItems, visibleProps, maxProps, messages, plan, leads
}: any) {
    return (
        <div className={`flex-1 overflow-y-auto custom-scrollbar ${isMobilePreview ? "p-4" : "p-6 lg:p-8"}`}>
            {/* Mobile tabs */}
            <div className="lg:hidden flex gap-1 mb-6 overflow-x-auto pb-2 scrollbar-none">
                {navItems.map((item: any) => (
                    <button
                        key={item.id}
                        onClick={() => !item.locked && setActiveTab(item.id)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[8px] font-bold uppercase whitespace-nowrap transition-all ${item.locked
                            ? "bg-white/5 text-white/15 cursor-not-allowed"
                            : activeTab === item.id
                                ? "bg-cima-gold text-black shadow-lg shadow-cima-gold/20"
                                : "bg-white/5 text-white/40 hover:bg-white/10"
                            }`}
                    >
                        {item.locked ? <Lock className="h-3 w-3" /> : <item.icon className="h-3 w-3" />}
                        {item.label}
                    </button>
                ))}
            </div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className={`font-heading font-black tracking-tight mb-1 transition-all ${isMobilePreview ? "text-lg" : "text-2xl"} ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                        {activeTab === "propiedades" && "Mis Propiedades"}
                        {activeTab === "leads" && "Leads Recientes"}
                        {activeTab === "visitas" && "Agenda de Visitas"}
                        {activeTab === "analiticos" && "Analíticos"}
                        {activeTab === "ia_studio" && "IA Studio"}
                    </h1>
                    <p className={`text-[10px] uppercase font-bold tracking-widest ${isDarkMode ? "text-white/30" : "text-gray-400"}`}>
                        Gestionando <span className={isDarkMode ? "text-cima-gold" : "text-blue-600"}>{visibleProps.length} archivos</span> • {plan.name}
                    </p>
                </div>
                {!isMobilePreview && (
                    <button className="bg-cima-gold text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-cima-gold/20 flex items-center gap-2">
                        <Plus className="h-3.5 w-3.5" /> Nueva Propiedad
                    </button>
                )}
            </div>

            {/* Content for Propiedades */}
            {activeTab === "propiedades" && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {visibleProps.map((prop: any, i: number) => (
                        <div key={i} className={`group relative rounded-2xl border transition-all overflow-hidden ${isDarkMode ? "bg-white/[0.02] border-white/5 hover:border-white/20" : "bg-white border-gray-100 shadow-sm hover:shadow-md"}`}>
                            <div className="aspect-video relative overflow-hidden">
                                <img src={prop.img} alt={prop.name} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                                <div className="absolute top-3 left-3 flex gap-2">
                                    <span className="bg-black/60 backdrop-blur-md text-white text-[8px] font-black px-2 py-1 rounded uppercase tracking-widest border border-white/10">{prop.status}</span>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className={`font-bold mb-1 group-hover:text-cima-gold transition-colors ${isMobilePreview ? "text-xs" : "text-sm"} ${isDarkMode ? "text-white" : "text-gray-900"}`}>{prop.name}</h3>
                                <p className={`text-[10px] mb-4 ${isDarkMode ? "text-white/40" : "text-gray-500"}`}>{prop.address}</p>
                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                    <p className={`font-heading font-bold ${isDarkMode ? "text-cima-gold" : "text-blue-600"}`}>{prop.price}</p>
                                    <MiniChart data={prop.trend} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Placeholder for other tabs in mobile preview */}
            {activeTab !== "propiedades" && (
                <div className="py-20 text-center opacity-40">
                    <Layout className="h-12 w-12 mx-auto mb-4" />
                    <p className="text-xs font-bold uppercase tracking-widest">Contenido Próximamente</p>
                </div>
            )}
        </div>
    );
}

/* ═══ MAIN COMPONENT ═══════════════════════════════════════ */
export default function DemoAdminLive({
    plan, leads, onUpdateLeadStatus, newLeadId, agentName, onNavigateToLeads,
    externalTab, messages, onAddMessage, isDarkMode = true, setIsDarkMode
}: DemoAdminLiveProps) {
    const f = plan.features.admin;
    const [activeTab, setActiveTab] = useState<SidebarTab>("propiedades");
    const [isMobilePreview, setIsMobilePreview] = useState(false);
    const [isDND, setIsDND] = useState(false);

    useEffect(() => {
        if (externalTab) setActiveTab(externalTab);
    }, [externalTab]);

    const maxProps = plan.maxProperties === -1 ? PROPERTIES.length : plan.maxProperties;
    const visibleProps = PROPERTIES.slice(0, maxProps);

    const navItems = [
        { id: "propiedades", label: "Propiedades", icon: Home, locked: false },
        { id: "leads", label: "Leads", icon: Users, locked: !f.analytics, badge: leads.length },
        { id: "visitas", label: "Visitas", icon: Calendar, locked: !f.visits },
        { id: "analiticos", label: "Analíticos", icon: BarChart3, locked: !f.analytics },
        { id: "ia_studio", label: "IA Studio", icon: Sparkles, locked: !f.multiAgent },
    ];

    const contentProps = {
        activeTab, setActiveTab, isDarkMode, isMobilePreview,
        navItems, visibleProps, maxProps, messages, plan, leads
    };

    return (
        <div className={`min-h-screen flex ${isDarkMode ? "bg-[#050505]" : "bg-gray-50"}`}>
            {/* Desktop Sidebar */}
            {!isMobilePreview && (
                <div className={`w-64 border-r hidden lg:flex flex-col ${isDarkMode ? "bg-[#0A0A0B] border-white/5" : "bg-white border-gray-200"}`}>
                    <div className="p-6 border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-cima-gold/10 border border-cima-gold/20 flex items-center justify-center">
                                <Layout className="h-5 w-5 text-cima-gold" />
                            </div>
                            <div>
                                <h2 className="text-xs font-black uppercase tracking-widest text-white">Cima Admin</h2>
                                <p className="text-[8px] text-white/40 font-bold uppercase">{plan.name}</p>
                            </div>
                        </div>
                    </div>
                    <nav className="flex-1 p-4 space-y-1">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => !item.locked && setActiveTab(item.id as SidebarTab)}
                                className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-[10px] font-bold uppercase transition-all ${activeTab === item.id
                                    ? "bg-cima-gold text-black shadow-lg shadow-cima-gold/20"
                                    : item.locked
                                        ? "text-white/10 cursor-not-allowed opacity-50"
                                        : "text-white/40 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className="h-4 w-4" />
                                    {item.label}
                                </div>
                                {item.locked && <Lock className="h-3 w-3" />}
                            </button>
                        ))}
                    </nav>
                </div>
            )}

            {/* Main Wrapper */}
            <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 z-50 flex items-center gap-2">
                    <button
                        onClick={() => setIsMobilePreview(!isMobilePreview)}
                        className={`p-2.5 border rounded-xl transition-all flex items-center gap-2 ${isMobilePreview ? "bg-cima-gold border-cima-gold text-black" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"}`}
                    >
                        {isMobilePreview ? <Monitor className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
                        <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline">
                            {isMobilePreview ? "Escritorio" : "Móvil"}
                        </span>
                    </button>
                    <button
                        onClick={() => setIsDarkMode && setIsDarkMode(!isDarkMode)}
                        className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white transition-all"
                    >
                        {isDarkMode ? <Sun className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
                    </button>
                </div>

                {isMobilePreview ? (
                    <div className="flex-1 flex items-center justify-center p-10">
                        <MobileFrame isDarkMode={isDarkMode}>
                            <AdminContent {...contentProps} />
                        </MobileFrame>
                    </div>
                ) : (
                    <AdminContent {...contentProps} />
                )}
            </div>
        </div>
    );
}

function Sun({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
        </svg>
    );
}

function MoonIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
    );
}
