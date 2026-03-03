"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Layout, Home, Users, BarChart3, MessageSquare, Plus, Search,
    Filter, MoreVertical, Globe, Facebook, Instagram, Mail,
    Phone, ChevronRight, ArrowUpRight, ArrowDownRight, Clock,
    CheckCircle2, AlertCircle, Eye, Target, Calendar, Sparkles, Send, Zap, Loader2, Share2,
    Lock, X, Upload, Image as ImageIcon, FileText, ExternalLink, Edit3, ToggleRight, BedDouble, Bath, Ruler,
    UserCircle, ChevronDown, ArrowRight, MapPin, TrendingUp, Settings, Bell, Wand2, RotateCcw, Download,
    ShieldCheck, FileSearch, ShieldAlert, FileCheck, FileSignature, FilePenLine, ScrollText, Briefcase,
    Smartphone, Monitor, Moon, MoonStar, ChevronLeft, Trash2, PieChart
} from "lucide-react";
import type { PlanConfig } from "@/lib/config/demo-plans";
import { MobileFrame } from "./MobileFrame";
import Image from "next/image";

/* ─── Types ───────────────────────────────────────────────────────────────── */
export type SidebarTab = "propiedades" | "leads" | "visitas" | "analiticos" | "mensajes" | "ia_studio" | "documentos" | "contratos";

interface DemoAdminLiveProps {
    plan: PlanConfig;
    leads?: any[];
    onUpdateLeadStatus?: (id: string, newStatus: string) => void;
    newLeadId?: string;
    agentName?: string;
    onNavigateToLeads?: () => void;
    externalTab?: SidebarTab;
    messages?: any[];
    onAddMessage?: (from: string, text: string, isAi?: boolean) => void;
    isDarkMode?: boolean;
    setIsDarkMode?: (v: boolean) => void;
    isMobilePreview?: boolean;
    setIsMobilePreview?: (v: boolean) => void;
    isDND?: boolean;
    setIsDND?: (v: boolean) => void;
}

/* ─── Mock Data ───────────────────────────────────────────────────────────── */
const PROPERTIES = [
    { id: 1, name: "Residencia Las Misiones", price: "$12.4M", status: "Venta", owner: "Fam. García", img: "/estancia-antes.png", hits: 142, trend: [30, 45, 38, 52, 60, 55, 72], beds: 4, baths: 3.5, m2: 320, address: "Av. Las Misiones 482, Col. Las Misiones" },
    { id: 2, name: "Depto. Torre LOVFT", price: "$4.2M", status: "Exclusiva", owner: "Ing. Roberto M.", img: "/loft-cima.png", hits: 89, trend: [20, 25, 35, 30, 40, 38, 45], beds: 2, baths: 2, m2: 110, address: "Torre LOVFT, Piso 12, Santa María" },
    { id: 3, name: "Penthouse Nubes", price: "$15.8M", status: "Exclusiva", owner: "Lic. Pérez", img: "/recamara-antes.png", hits: 201, trend: [50, 60, 55, 70, 80, 75, 90], beds: 3, baths: 3, m2: 195, address: "Penthouse, Torre Lux, Santa María" },
    { id: 4, name: "Casa Valle Poniente", price: "$6.1M", status: "Venta", owner: "Sr. Hernández", img: "/cocina-antes.png", hits: 34, trend: [5, 8, 12, 10, 15, 18, 20], beds: 3, baths: 2, m2: 180, address: "Valle de Anáhuac 305, Valle Poniente" },
    { id: 5, name: "Residencia Contry Sol", price: "$8.9M", status: "Venta", owner: "Dra. Sofía L.", img: "/estancia-despues.png", hits: 56, trend: [10, 15, 20, 25, 22, 30, 28], beds: 3, baths: 2.5, m2: 240, address: "Contry Sol 1024, Col. Contry" },
];

const NOTIFICATIONS = [
    { icon: Zap, text: "Lead de Instagram calificado por IA", sub: "Rodrigo Sáenz — Interés alto en Las Misiones", color: "text-pink-400 bg-pink-500/20" },
    { icon: FileText, text: "Contrato firmado electrónicamente", sub: "Familia García — Cierre exitoso", color: "text-blue-400 bg-blue-500/20" },
    { icon: MessageSquare, text: "Nueva consulta por WhatsApp", sub: "Cliente solicita segunda visita para Penthouse", color: "text-green-400 bg-green-500/20" },
    { icon: Target, text: "Oferta formal recibida", sub: "$11.95M — Depto. Torre LOVFT", color: "text-green-400 bg-green-500/20" },
    { icon: Eye, text: "Tendencia: 120 vistas extras hoy", sub: "Tu propiedad es la más vista en San Pedro", color: "text-amber-400 bg-amber-500/20" },
    { icon: TrendingUp, text: "Alerta de ROI: Precio óptimo", sub: "Sugerencia de IA: Ajuste de +2% por mercado", color: "text-blue-400 bg-blue-500/20" },
];

/* ─── Mini Sparkline ──────────────────────────────────────────────────────── */
function MiniChart({ data, color = "#C8A96E", height = 32 }: { data: number[]; color?: string; height?: number }) {
    if (!data || data.length === 0) return null;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const w = 80;
    const points = data.map((v, i) => ({
        x: (i / (data.length - 1)) * w,
        y: height - ((v - min) / range) * (height - 4) - 2,
    }));
    const pathD = points.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(" ");
    const areaD = `${pathD} L${w},${height} L0,${height} Z`;

    return (
        <svg width={w} height={height} viewBox={`0 0 ${w} ${height}`} className="overflow-visible">
            <defs>
                <linearGradient id={`grad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path
                d={areaD}
                fill={`url(#grad-${color.replace("#", "")})`}
            />
            <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                d={pathD}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

/* ─── Animated Counter ────────────────────────────────────────────────────── */
function Counter({ value, prefix = "", suffix = "" }: { value: string; prefix?: string; suffix?: string }) {
    const numericValue = parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let start = displayValue;
        const end = numericValue;
        const duration = 1000;
        let startTime: number | null = null;

        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const current = Math.floor(progress * (end - start) + start);
            setDisplayValue(current);
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [value]);

    const formatted = numericValue >= 1000
        ? displayValue.toLocaleString()
        : value.includes('.') ? displayValue.toFixed(1) : displayValue;

    return <span>{prefix}{formatted}{suffix}</span>;
}

/* ─── Rotating Notification Toast ─────────────────────────────────────────── */
function RotatingToast({ onClick }: { onClick?: () => void }) {
    const [index, setIndex] = useState(0);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const firstTimer = setTimeout(() => setVisible(true), 3000);
        const interval = setInterval(() => {
            setVisible(false);
            setTimeout(() => {
                setIndex((i) => (i + 1) % NOTIFICATIONS.length);
                setVisible(true);
            }, 500);
        }, 12000);

        return () => {
            clearTimeout(firstTimer);
            clearInterval(interval);
        };
    }, []);

    const notif = NOTIFICATIONS[index];

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, y: 20, x: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    onClick={onClick}
                    className="fixed bottom-24 lg:bottom-12 right-6 z-[200] bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl max-w-xs cursor-pointer hover:border-cima-gold/40 transition-all group"
                >
                    <div className="flex items-start gap-3">
                        <div className={`h-8 w-8 rounded-lg ${notif.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                            <notif.icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <p className="text-[10px] font-black text-white uppercase tracking-wider">{notif.text}</p>
                                <span className="text-[7px] bg-cima-gold/20 text-cima-gold px-1 rounded font-bold">NUEVO</span>
                            </div>
                            <p className="text-[9px] text-white/40">{notif.sub}</p>
                            <p className="text-[8px] text-cima-gold/60 mt-1 font-bold flex items-center gap-1">
                                Ver detalle <ChevronRight className="h-2 w-2" />
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/* ─── MAIN COMPONENT ─────────────────────────────────────────────────────── */
export default function DemoAdminLive(props: DemoAdminLiveProps) {
    const {
        plan,
        leads = [],
        onUpdateLeadStatus,
        newLeadId,
        agentName,
        onNavigateToLeads,
        externalTab,
        messages = [],
        onAddMessage,
        isDarkMode = true,
        setIsDarkMode,
        isMobilePreview = false,
        setIsMobilePreview,
        isDND = false,
        setIsDND
    } = props;

    const [activeTab, setActiveTab] = useState<SidebarTab>("propiedades");
    const f = plan.features.admin;

    React.useEffect(() => {
        if (externalTab) {
            setActiveTab(externalTab);
            return;
        }
        if ((activeTab === "analiticos" && !f.analytics) || (activeTab === "ia_studio" && !f.aiStudio)) {
            setActiveTab("propiedades");
        }
    }, [plan.tier, externalTab, f.analytics, f.aiStudio, activeTab]);

    const maxProps = plan.maxProperties === -1 ? PROPERTIES.length : plan.maxProperties;
    const visibleProps = PROPERTIES.slice(0, maxProps);

    const navItems: { id: SidebarTab; icon: React.ElementType; label: string; badge?: string; locked: boolean }[] = [
        { id: "propiedades", icon: Layout, label: "Propiedades", locked: false },
        { id: "leads", icon: Users, label: "Leads", badge: leads.length > 0 ? leads.length.toString() : "7", locked: false },
        { id: "visitas", icon: Target, label: "Visitas", badge: "2", locked: !f.visits },
        { id: "analiticos", icon: TrendingUp, label: "Analíticos", locked: !f.analytics },
        { id: "mensajes", icon: MessageSquare, label: "Mensajes", badge: messages.filter(m => m.unread).length > 0 ? messages.filter(m => m.unread).length.toString() : undefined, locked: !f.messages },
        { id: "ia_studio", icon: Wand2, label: "IA Studio", locked: !f.aiStudio },
        { id: "documentos", icon: ShieldCheck, label: "Bóveda", locked: !f.digitalVault },
        { id: "contratos", icon: FileSignature, label: "Contratos", locked: !f.digitalVault },
    ];

    const tierStats = {
        basico: [
            { label: "Vistas Totales", value: "148", change: "+5%", icon: Eye, data: [20, 35, 25, 40, 30, 45, 50] },
            { label: "Leads Activos", value: "3", change: "+1", icon: Users, data: [1, 0, 1, 2, 1, 2, 3] },
            { label: "Visitas Mes", value: "2", change: "+1", icon: Target, data: [0, 1, 0, 1, 1, 1, 2] },
            { label: "Conversión", value: "0.8%", change: "+0.2%", icon: TrendingUp, data: [0.4, 0.5, 0.6, 0.5, 0.7, 0.7, 0.8] },
        ],
        profesional: [
            { label: "Vistas Totales", value: "589", change: "+8%", icon: Eye, data: [100, 120, 110, 150, 140, 170, 190] },
            { label: "Leads Activos", value: "12", change: "+3", icon: Users, data: [4, 6, 5, 8, 7, 10, 12] },
            { label: "Visitas Mes", value: "8", change: "+2", icon: Target, data: [2, 3, 3, 5, 4, 6, 8] },
            { label: "Conversión", value: "2.1%", change: "+0.5%", icon: TrendingUp, data: [1.2, 1.4, 1.6, 1.5, 1.8, 1.9, 2.1] },
        ],
        premium: [
            { label: "Vistas Totales", value: "1247", change: "+12%", icon: Eye, data: [180, 220, 195, 310, 280, 350, 420] },
            { label: "Leads Activos", value: "23", change: "+5", icon: Users, data: [8, 10, 12, 15, 14, 18, 23] },
            { label: "Visitas Mes", value: "18", change: "+3", icon: Target, data: [5, 7, 6, 9, 11, 14, 18] },
            { label: "Conversión", value: "4.2%", change: "+0.8%", icon: TrendingUp, data: [2.1, 2.5, 3.0, 2.8, 3.4, 3.8, 4.2] },
        ]
    };

    const STATS = tierStats[plan.tier as keyof typeof tierStats] || tierStats.premium;

    const renderContent = () => (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                <div>
                    <h1 className={`font-heading font-black tracking-tight mb-1 ${isMobilePreview ? "text-lg" : "text-2xl"} ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                        {navItems.find(n => n.id === activeTab)?.label}
                    </h1>
                    <p className={`text-xs ${isDarkMode ? "text-white/40" : "text-gray-500"}`}>
                        Centro de control de {agentName || "Asesor Elite"}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 bg-cima-gold text-black px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-wider hover:bg-white transition-all shadow-lg shrink-0">
                        <Plus className="h-3.5 w-3.5" /> Nueva
                    </button>
                </div>
            </div>

            {/* Analytics Row */}
            <div className={`grid transition-all duration-500 ${isMobilePreview ? "grid-cols-2 gap-2" : "grid-cols-2 md:grid-cols-4 gap-3"} mb-8`} key={plan.tier}>
                {STATS.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`transition-all ${isDarkMode ? "bg-white/[0.03] border-white/5 shadow-black/40 hover:bg-white/[0.05]" : "bg-white border-gray-200 shadow-gray-200/20 hover:border-cima-gold/40 hover:shadow-lg"} border rounded-2xl shadow-2xl ${isMobilePreview ? "p-3" : "p-4"}`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <stat.icon className="h-3.5 w-3.5 text-cima-gold/40" />
                            <span className="text-[8px] font-bold text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded-full">{stat.change}</span>
                        </div>
                        <div className="flex items-end justify-between gap-1">
                            <div>
                                <div className={`font-heading font-black ${isDarkMode ? "text-white" : "text-gray-900"} ${isMobilePreview ? "text-sm" : "text-xl"}`}>
                                    <Counter value={stat.value} suffix={stat.label === "Conversión" ? "%" : ""} />
                                </div>
                                <p className={`text-[7px] lg:text-[8px] uppercase font-black tracking-widest ${isDarkMode ? "text-white/30" : "text-gray-400"}`}>{stat.label}</p>
                            </div>
                            {!isMobilePreview && <MiniChart data={stat.data} />}
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === "propiedades" && <PropertiesView properties={visibleProps} isDarkMode={isDarkMode} isMobilePreview={isMobilePreview} />}
                    {activeTab === "leads" && <LeadsView leads={leads} isDarkMode={isDarkMode} onUpdate={onUpdateLeadStatus} />}
                    {activeTab === "visitas" && <VisitsView isDarkMode={isDarkMode} />}
                    {activeTab === "analiticos" && <AnalyticsView isDarkMode={isDarkMode} />}
                    {activeTab === "ia_studio" && <IaStudioView isDarkMode={isDarkMode} />}
                    {activeTab === "documentos" && <DocumentsView isDarkMode={isDarkMode} />}
                    {activeTab === "contratos" && <ContractGeneratorView isDarkMode={isDarkMode} />}
                    {activeTab === "mensajes" && <MessagesView messages={messages} isDarkMode={isDarkMode} />}
                </motion.div>
            </AnimatePresence>
        </div>
    );

    return (
        <div className={`min-h-screen transition-colors duration-500 pb-20 sm:pb-0 ${isDarkMode ? "bg-[#0A0A0B] text-white" : "bg-gray-50 text-gray-900"}`}>
            {/* Control Panel Header (Fixed on Desktop, part of mobile flow) */}
            <div className="w-full px-6 py-4 flex justify-between items-center border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-[120]">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-cima-gold flex items-center justify-center">
                        <Layout className="h-4 w-4 text-black" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-xs font-black uppercase tracking-widest whitespace-nowrap">Cima Pro Admin</h1>
                        <span className="text-[8px] font-mono text-cima-gold uppercase tracking-widest leading-none">{plan.name}</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    {setIsMobilePreview && (
                        <button
                            onClick={() => setIsMobilePreview(!isMobilePreview)}
                            className={`px-3 py-1.5 border rounded-lg transition-all flex items-center gap-2 ${isMobilePreview ? "bg-cima-gold border-cima-gold text-black" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"}`}
                        >
                            {isMobilePreview ? <Monitor className="h-3 w-3" /> : <Smartphone className="h-3 w-3" />}
                            <span className="text-[8px] font-black uppercase tracking-widest hidden sm:inline">{isMobilePreview ? "Escritorio" : "Móvil"}</span>
                        </button>
                    )}
                    {setIsDND && (
                        <button
                            onClick={() => setIsDND(!isDND)}
                            className={`px-3 py-1.5 border rounded-lg transition-all flex items-center gap-2 ${isDND ? "bg-cima-gold border-cima-gold text-black" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"}`}
                        >
                            {isDND ? <MoonStar className="h-3.5 w-3.5" /> : <Bell className="h-3.5 w-3.5" />}
                            <span className="text-[8px] font-black uppercase tracking-widest hidden sm:inline">{isDND ? "Silencio" : "Alertas"}</span>
                        </button>
                    )}
                    {setIsDarkMode && (
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className="p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/40 hover:text-white transition-all px-3"
                        >
                            {isDarkMode ? <Moon className="h-3.5 w-3.5" /> : <MoonStar className="h-3.5 w-3.5" />}
                        </button>
                    )}
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto flex h-[calc(100vh-64px)] overflow-hidden">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:flex flex-col w-64 border-r border-white/5 p-6 shrink-0 bg-[#0A0A0B]/30">
                    <nav className="space-y-1 mt-2 flex-1 overflow-y-auto scrollbar-none">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => !item.locked && setActiveTab(item.id)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${activeTab === item.id
                                    ? "bg-cima-gold text-black shadow-lg shadow-cima-gold/20"
                                    : item.locked
                                        ? "opacity-20 cursor-not-allowed"
                                        : isDarkMode ? "text-white/40 hover:bg-white/5 hover:text-white" : "text-gray-400 hover:bg-gray-100 hover:text-gray-900"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className="h-4 w-4" />
                                    <span className="text-[11px] font-black uppercase tracking-wider">{item.label}</span>
                                </div>
                                {item.locked ? (
                                    <Lock className="h-3 w-3 opacity-40" />
                                ) : (
                                    item.badge && (
                                        <span className={`h-4 w-4 rounded-full text-[8px] font-black flex items-center justify-center ${activeTab === item.id ? "bg-black text-cima-gold" : "bg-cima-gold text-black"}`}>{item.badge}</span>
                                    )
                                )}
                            </button>
                        ))}
                    </nav>

                    <div className="mt-auto space-y-4 pt-6 mt-6 border-t border-white/5">
                        {/* Capacity Indicator */}
                        <div className="p-4 bg-white/[0.03] border border-white/10 rounded-2xl">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-[7px] text-cima-gold font-black uppercase tracking-widest">Capacidad</p>
                                <p className="text-[7px] text-white/40 font-mono">{visibleProps.length}/{maxProps === PROPERTIES.length ? "∞" : maxProps}</p>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-cima-gold rounded-full shadow-[0_0_8px_rgba(200,169,110,0.4)] transition-all duration-1000"
                                    style={{ width: `${(visibleProps.length / PROPERTIES.length) * 100}%` }}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 px-2">
                            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-cima-gold/40 to-cima-gold/10 border border-cima-gold/20 flex items-center justify-center overflow-hidden">
                                <Users className="h-4 w-4 text-cima-gold" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-black uppercase tracking-wider text-white/80 truncate">{agentName || "Asesor Elite"}</p>
                                <p className="text-[8px] font-bold text-cima-gold/60 uppercase">Estado: Activo</p>
                            </div>
                        </div>
                    </div>
                </aside>

                <div className="flex-1 overflow-hidden relative">
                    {isMobilePreview ? (
                        <div className="h-full w-full flex items-center justify-center bg-black/80 py-8 overflow-y-auto">
                            <MobileFrame isDarkMode={isDarkMode}>
                                <div className="bg-[#0A0A0B] min-h-full px-4 py-8 flex flex-col pt-12">
                                    {/* Mobile Nav Top Bar (Simplified) */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h1 className="text-xl font-black text-white tracking-tight">Admin</h1>
                                            <p className="text-[10px] text-cima-gold font-mono uppercase tracking-widest leading-none">{plan.name}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            {setIsDND && (
                                                <button onClick={() => setIsDND(!isDND)} className={`p-2 rounded-xl border transition-all ${isDND ? "bg-cima-gold border-cima-gold text-black" : "bg-white/5 border-white/10 text-white/40"}`}>
                                                    {isDND ? <MoonStar className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Stats Row (Always visible on mobile top) */}
                                    <div className="grid grid-cols-2 gap-2 mb-6">
                                        {STATS.slice(0, 2).map((stat, i) => (
                                            <div key={i} className="bg-white/[0.03] border border-white/5 p-3 rounded-2xl">
                                                <p className="text-[7px] uppercase font-black tracking-widest text-white/40 mb-1">{stat.label}</p>
                                                <div className="text-sm font-black text-white"><Counter value={stat.value} suffix={stat.label === "Conversión" ? "%" : ""} /></div>
                                            </div>
                                        ))}
                                    </div>

                                    {renderContent()}

                                    {/* Mobile Bottom Navigation */}
                                    <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/10 px-6 py-3 flex justify-between items-center z-[200]">
                                        {navItems.filter(item => !["documentos", "contratos", "visitas"].includes(item.id)).map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => !item.locked && setActiveTab(item.id)}
                                                className={`flex flex-col items-center gap-1 transition-all ${activeTab === item.id ? "text-cima-gold" : "text-white/40"}`}
                                            >
                                                <item.icon className={`h-5 w-5 ${activeTab === item.id ? "scale-110" : ""}`} />
                                                <span className="text-[7px] font-black uppercase tracking-tighter">{item.label}</span>
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => setActiveTab("contratos")}
                                            className={`flex flex-col items-center gap-1 transition-all ${["documentos", "contratos", "visitas"].includes(activeTab) ? "text-cima-gold" : "text-white/40"}`}
                                        >
                                            <MoreVertical className="h-5 w-5" />
                                            <span className="text-[7px] font-black uppercase tracking-tighter">Más</span>
                                        </button>
                                    </div>
                                </div>
                            </MobileFrame>
                        </div>
                    ) : (
                        <div className="h-full p-8 overflow-y-auto custom-scrollbar">
                            {renderContent()}
                        </div>
                    )}
                </div>
            </div>

            {!isDND && (
                <RotatingToast onClick={() => {
                    setActiveTab("leads");
                    if (onNavigateToLeads) onNavigateToLeads();
                }} />
            )}
        </div>
    );
}

/* ─── VIEWS ───────────────────────────────────────────────────────────────── */

function PropertiesView({ properties, isDarkMode, isMobilePreview }: any) {
    return (
        <div className={`grid gap-4 ${isMobilePreview ? "grid-cols-1" : "grid-cols-1 xl:grid-cols-2"}`}>
            {properties.map((prop: any, i: number) => (
                <motion.div
                    key={prop.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`group flex items-start gap-4 p-5 rounded-[2.5rem] border transition-all cursor-pointer relative overflow-hidden ${isMobilePreview ? "flex-col" : "flex-row"} ${isDarkMode ? "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10" : "bg-white border-gray-100 hover:shadow-xl hover:border-cima-gold/30"}`}
                >
                    <div className={`${isMobilePreview ? "h-48 w-full" : "h-32 w-32"} rounded-3xl overflow-hidden shrink-0 border border-white/10 relative shadow-2xl mb-2 sm:mb-0`}>
                        <Image src={prop.img} alt={prop.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
                        <div className="absolute bottom-2 left-2 flex gap-1">
                            <span className="bg-black/60 backdrop-blur-md text-[6px] font-black text-white px-1.5 py-0.5 rounded-md uppercase tracking-widest border border-white/10">{prop.m2}m²</span>
                        </div>
                    </div>

                    <div className="flex-1 min-w-0 pt-1">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded-full bg-cima-gold/10 text-cima-gold text-[7px] font-black uppercase tracking-widest border border-cima-gold/10">{prop.status}</span>
                                <span className={`text-[8px] font-mono opacity-40 uppercase tracking-tighter ${isDarkMode ? "text-white" : "text-gray-900"}`}>{prop.owner}</span>
                            </div>
                            <button className="h-7 w-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-cima-gold hover:text-black transition-all group/btn">
                                <Edit3 className="h-3 w-3" />
                            </button>
                        </div>

                        <h4 className={`text-[14px] font-black tracking-tight mb-1 truncate ${isDarkMode ? "text-white" : "text-gray-900"}`}>{prop.name}</h4>
                        <div className="flex items-center gap-1.5 text-cima-gold mb-3">
                            <TrendingUp className="h-3 w-3" />
                            <p className="text-[13px] font-black tracking-wider">{prop.price}</p>
                        </div>

                        <div className="flex items-center gap-3 opacity-60">
                            <div className="flex items-center gap-1 text-[9px] font-bold"><BedDouble className="h-3.5 w-3.5 text-cima-gold/60" /> {prop.beds} Rec.</div>
                            <div className="flex items-center gap-1 text-[9px] font-bold"><Bath className="h-3.5 w-3.5 text-cima-gold/60" /> {prop.baths} B.</div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                <Eye className="h-3 w-3 text-cima-gold/40" />
                                <span className="text-[9px] font-bold opacity-40">{prop.hits} vistas</span>
                            </div>
                            <button className="text-[8px] font-black uppercase tracking-widest text-cima-gold hover:text-white transition-colors flex items-center gap-1">
                                Gestionar <ChevronRight className="h-2.5 w-2.5" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            ))}

            {/* Blank slate for adding new */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`flex flex-col items-center justify-center p-8 rounded-[2.5rem] border-2 border-dashed transition-all group cursor-pointer ${isDarkMode ? "bg-white/[0.01] border-white/5 hover:bg-white/[0.03] hover:border-cima-gold/40" : "bg-gray-50 border-gray-200 hover:border-cima-gold/40"}`}
            >
                <div className="h-12 w-12 rounded-2xl bg-cima-gold/10 flex items-center justify-center text-cima-gold/40 group-hover:text-cima-gold group-hover:scale-110 transition-all mb-3">
                    <Plus className="h-6 w-6" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">Agregar Propiedad</p>
            </motion.div>
        </div>
    );
}

function LeadsView({ leads, isDarkMode, onUpdate }: any) {
    return (
        <div className="space-y-3">
            {leads.length > 0 ? leads.map((lead: any, i: number) => (
                <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${isDarkMode ? "bg-white/[0.02] border-white/5 hover:bg-white/[0.05]" : "bg-white border-gray-100 shadow-sm"}`}
                >
                    <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${lead.color}`}>
                            <lead.sourceIcon className="h-5 w-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className={`text-[12px] font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{lead.name}</h4>
                                {lead.isAiQualified && <span className="px-1.5 py-0.5 rounded bg-cima-gold/20 text-cima-gold text-[7px] font-black uppercase tracking-widest flex items-center gap-1"><Sparkles className="h-2 w-2" /> IA OK</span>}
                            </div>
                            <p className={`text-[9px] opacity-40 ${isDarkMode ? "text-white" : "text-gray-900"}`}>{lead.property} · {lead.date}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {lead.score && (
                            <div className="text-right hidden sm:block">
                                <p className="text-[10px] font-black text-cima-gold">{lead.score}%</p>
                                <p className="text-[7px] uppercase font-bold opacity-30 tracking-tighter">Match</p>
                            </div>
                        )}
                        <ChevronRight className="h-4 w-4 opacity-20" />
                    </div>
                </motion.div>
            )) : (
                <div className="flex flex-col items-center justify-center py-20 opacity-20">
                    <Users className="h-12 w-12 mb-4" />
                    <p className="text-sm font-black uppercase">No hay leads todavía</p>
                </div>
            )}
        </div>
    );
}

function VisitsView({ isDarkMode }: { isDarkMode: boolean }) {
    const VISITS = [
        { prospect: "Familia Rodríguez", property: "Residencia Las Misiones", date: "Hoy", time: "11:00 AM", status: "confirmada", color: "bg-green-500/10 text-green-500" },
        { prospect: "Ing. Luis Garza", property: "Depto. Torre LOVFT", date: "Hoy", time: "4:30 PM", status: "pendiente", color: "bg-amber-500/10 text-amber-500" },
        { prospect: "Sra. Ana Treviño", property: "Residencia Las Misiones", date: "Mañana", time: "10:00 AM", status: "confirmada", color: "bg-green-500/10 text-green-500" },
    ];

    return (
        <div className="space-y-3">
            {VISITS.map((visit, i) => (
                <div key={i} className={`p-5 rounded-3xl border ${isDarkMode ? "bg-white/[0.02] border-white/5" : "bg-white border-gray-100 shadow-sm"} flex items-center justify-between`}>
                    <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-2xl flex flex-col items-center justify-center border font-black uppercase text-[10px] ${isDarkMode ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200 text-gray-400"}`}>
                            <span className="text-cima-gold font-black">{visit.date}</span>
                            <span className="text-[7px] opacity-40 leading-none mt-0.5">{visit.time.split(' ')[1]}</span>
                        </div>
                        <div>
                            <h4 className={`text-[12px] font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{visit.prospect}</h4>
                            <p className="text-[9px] opacity-40">{visit.property} · {visit.time}</p>
                        </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${visit.color}`}>{visit.status}</span>
                </div>
            ))}
        </div>
    );
}

const BAR_CHART_PROPS = {
    data: [65, 42, 88, 56, 95, 76, 48],
    labels: ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"]
};

function BarChart({ data, labels, isDarkMode }: any) {
    const max = Math.max(...data);
    return (
        <div className="flex items-end justify-between gap-2 h-32 pt-4">
            {data.map((val: number, i: number) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="w-full relative flex flex-col justify-end h-full">
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${(val / max) * 100}%` }}
                            transition={{ delay: 0.2 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                            className="w-full bg-gradient-to-t from-cima-gold/40 to-cima-gold rounded-t-lg relative group-hover:scale-x-110 transition-transform"
                        />
                    </div>
                    <span className={`text-[7px] font-black uppercase tracking-tighter ${isDarkMode ? "text-white/20" : "text-gray-400"}`}>{labels[i]}</span>
                </div>
            ))}
        </div>
    );
}

function AnalyticsView({ isDarkMode }: { isDarkMode: boolean }) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-6 rounded-3xl border ${isDarkMode ? "bg-white/[0.02] border-white/5" : "bg-white border-gray-100 shadow-sm"}`}>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <p className={`text-[9px] font-black uppercase tracking-widest ${isDarkMode ? "text-white/30" : "text-gray-400"}`}>Interacción Semanal</p>
                            <h4 className={`text-lg font-heading font-black mt-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>482 Vistas</h4>
                        </div>
                        <TrendingUp className="h-5 w-5 text-cima-gold" />
                    </div>
                    <BarChart data={BAR_CHART_PROPS.data} labels={BAR_CHART_PROPS.labels} isDarkMode={isDarkMode} />
                </div>
                <div className={`p-6 rounded-3xl border ${isDarkMode ? "bg-white/[0.02] border-white/5" : "bg-white border-gray-100 shadow-sm"}`}>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <p className={`text-[9px] font-black uppercase tracking-widest ${isDarkMode ? "text-white/30" : "text-gray-400"}`}>Fuentes de Leads</p>
                            <h4 className={`text-lg font-heading font-black mt-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Distribución</h4>
                        </div>
                        <Users className="h-5 w-5 text-cima-gold" />
                    </div>
                    <BarChart data={[12, 8, 5, 3, 2]} labels={["IG", "FB", "WEB", "REF", "GOOG"]} isDarkMode={isDarkMode} />
                </div>
            </div>
        </div>
    );
}

function IaStudioView({ isDarkMode }: { isDarkMode: boolean }) {
    const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "ready">("idle");
    const [progress, setProgress] = useState(0);

    const handleProcess = () => {
        setStatus("processing");
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) { clearInterval(interval); setStatus("ready"); return 100; }
                return prev + 2;
            });
        }, 50);
    };

    return (
        <div className="space-y-6">
            {status === "idle" && (
                <div
                    onClick={() => setStatus("uploading")}
                    className={`aspect-video border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center gap-4 group cursor-pointer transition-all ${isDarkMode ? "bg-white/[0.02] border-white/10 hover:border-cima-gold/40 hover:bg-cima-gold/5" : "bg-gray-50 border-gray-200 hover:border-cima-gold/40"}`}
                >
                    <div className="h-16 w-16 rounded-3xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-cima-gold transition-colors">
                        <Upload className="h-8 w-8" />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-black uppercase">Subir Foto de Propiedad</p>
                        <p className="text-[10px] opacity-40 uppercase font-bold tracking-widest mt-1">Soporta: RAW, JPG, PNG</p>
                    </div>
                </div>
            )}
            {status === "uploading" && (
                <div className="space-y-6">
                    <div className="aspect-video rounded-[2.5rem] overflow-hidden border border-white/10 relative">
                        <Image src="/cocina-antes.png" alt="Before" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase text-white">Foto Original</span>
                        </div>
                    </div>
                    <button onClick={handleProcess} className="w-full py-5 bg-cima-gold text-black rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl shadow-cima-gold/20 flex items-center justify-center gap-3">
                        <Sparkles className="h-5 w-5" /> Amueblar con IA
                    </button>
                </div>
            )}
            {status === "processing" && (
                <div className="flex flex-col items-center justify-center py-20 space-y-6">
                    <div className="relative h-24 w-24">
                        <div className="absolute inset-0 border-4 border-cima-gold/20 rounded-full" />
                        <motion.div
                            className="absolute inset-0 border-4 border-t-cima-gold rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Sparkles className="h-8 w-8 text-cima-gold animate-pulse" />
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-black uppercase mb-2">Transformando Espacio...</p>
                        <div className="w-48 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div className="h-full bg-cima-gold" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
                        </div>
                    </div>
                </div>
            )}
            {status === "ready" && (
                <div className="space-y-6">
                    <div className="aspect-video rounded-[2.5rem] overflow-hidden border border-white/10 relative group">
                        <Image src="/cocina-despues.png" alt="After" fill className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                            <div>
                                <p className="text-[10px] font-black text-cima-gold uppercase tracking-widest mb-1">Cima AI Render</p>
                                <p className="text-xl font-heading font-black text-white">Resultado Final</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                            <Download className="h-4 w-4" /> Descargar
                        </button>
                        <button className="flex-1 py-4 bg-cima-gold text-black rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-cima-gold/20 flex items-center justify-center gap-2">
                            <Share2 className="h-4 w-4" /> Enviar al Cliente
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function DocumentsView({ isDarkMode }: { isDarkMode: boolean }) {
    const docs = [
        { name: "Escritura_Misiones.pdf", status: "Verificado", date: "12 Feb 2026", icon: FileCheck },
        { name: "ID_Propietario.jpg", status: "Pendiente", date: "15 Feb 2026", icon: Clock },
        { name: "Contrato_Cima.doc", status: "Verificado", date: "Activo", icon: ShieldCheck },
    ];

    return (
        <div className="space-y-3">
            {docs.map((doc, i) => (
                <div key={i} className={`p-4 rounded-2xl border flex items-center justify-between ${isDarkMode ? "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]" : "bg-white border-gray-100 shadow-sm"}`}>
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-cima-gold">
                            <doc.icon className="h-5 w-5" />
                        </div>
                        <div>
                            <h4 className={`text-[11px] font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{doc.name}</h4>
                            <p className="text-[9px] opacity-40">{doc.date}</p>
                        </div>
                    </div>
                    <span className={`text-[8px] font-black uppercase tracking-widest ${doc.status === "Verificado" ? "text-green-500" : "text-amber-500"}`}>{doc.status}</span>
                </div>
            ))}
        </div>
    );
}

function ContractGeneratorView({ isDarkMode }: { isDarkMode: boolean }) {
    const [step, setStep] = useState<"form" | "preview" | "signing" | "done">("form");
    const [formData, setFormData] = useState({
        client: "Familia García",
        property: "Residencia Las Misiones",
        price: "$12,400,000",
        date: new Date().toLocaleDateString(),
        witness: "Carlos Martínez"
    });

    const [isSigning, setIsSigning] = useState(false);

    const handleSign = () => {
        setIsSigning(true);
        setTimeout(() => {
            setStep("done");
            setIsSigning(false);
        }, 3000);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
                <div className="flex gap-2">
                    {["Formulario", "Vista Previa", "Firma"].map((s, i) => (
                        <div key={s} className="flex items-center gap-2">
                            <div className={`h-5 w-5 rounded-full flex items-center justify-center text-[8px] font-black ${(i === 0 && step === "form") || (i === 1 && step === "preview") || (i === 2 && (step === "signing" || step === "done"))
                                ? "bg-cima-gold text-black" : "bg-white/5 text-white/20"
                                }`}>
                                {i + 1}
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-widest ${(i === 0 && step === "form") || (i === 1 && step === "preview") || (i === 2 && (step === "signing" || step === "done"))
                                ? "text-white" : "text-white/20"
                                }`}>{s}</span>
                            {i < 2 && <ChevronRight className="h-3 w-3 text-white/10" />}
                        </div>
                    ))}
                </div>
                {step !== "form" && (
                    <button onClick={() => setStep("form")} className="text-[10px] font-black text-cima-gold uppercase hover:text-white transition-colors">
                        Reiniciar
                    </button>
                )}
            </div>

            <AnimatePresence mode="wait">
                {step === "form" && (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className={`p-8 rounded-[2.5rem] border ${isDarkMode ? "bg-white/[0.02] border-white/5" : "bg-white border-gray-100 shadow-xl"}`}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[8px] font-black uppercase tracking-widest text-cima-gold block mb-2">Nombre del Cliente</label>
                                    <input
                                        type="text"
                                        value={formData.client}
                                        onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:border-cima-gold outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-[8px] font-black uppercase tracking-widest text-cima-gold block mb-2">Propiedad</label>
                                    <input
                                        type="text"
                                        value={formData.property}
                                        onChange={(e) => setFormData({ ...formData, property: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:border-cima-gold outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[8px] font-black uppercase tracking-widest text-cima-gold block mb-2">Precio de Operación</label>
                                    <input
                                        type="text"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:border-cima-gold outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-[8px] font-black uppercase tracking-widest text-cima-gold block mb-2">Asesor / Testigo</label>
                                    <input
                                        type="text"
                                        value={formData.witness}
                                        onChange={(e) => setFormData({ ...formData, witness: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:border-cima-gold outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setStep("preview")}
                            className="w-full mt-8 py-4 bg-cima-gold text-black rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-cima-gold/20 flex items-center justify-center gap-2 hover:bg-white transition-all"
                        >
                            Generar Borrador <ArrowRight className="h-4 w-4" />
                        </button>
                    </motion.div>
                )}

                {step === "preview" && (
                    <motion.div
                        key="preview"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                    >
                        <div className={`aspect-[1/1.4] bg-white text-black p-12 shadow-2xl rounded-sm overflow-hidden relative group max-w-2xl mx-auto`}>
                            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-100 transition-opacity">
                                <Image src="/residencial-cima.png" width={80} height={80} alt="Cima Logo" className="grayscale" />
                            </div>
                            <h2 className="text-xl font-serif font-bold border-b-2 border-black pb-4 mb-8">CONTRATO DE EXCLUSIVIDAD INMOBILIARIA</h2>
                            <div className="space-y-4 text-[10px] leading-relaxed font-serif text-justify">
                                <p>En la ciudad de Monterrey, Nuevo León, a fecha de <strong>{formData.date}</strong>.</p>
                                <p>Por una parte <strong>CIMA PROPIEDADES</strong> y por la otra el C. <strong>{formData.client}</strong>, acuerdan la comercialización de la propiedad ubicada en <strong>{formData.property}</strong>.</p>
                                <p>El precio pactado para la presente operación es de <strong>{formData.price}</strong>, sobre el cual se aplicará la comisión vigente del 5% más IVA.</p>
                                <p>Este documento tiene validez legal inmediata tras la firma digital de ambas partes.</p>

                                <div className="mt-20 pt-10 grid grid-cols-2 gap-20 border-t border-black/10">
                                    <div className="text-center">
                                        <div className="h-px bg-black mb-2 opacity-20" />
                                        <p className="font-bold">EL PROPIETARIO</p>
                                        <p className="opacity-40">{formData.client}</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="h-px bg-black mb-2 opacity-20" />
                                        <p className="font-bold">EL ASESOR</p>
                                        <p className="opacity-40">{formData.witness}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-cima-gold/5 via-transparent to-transparent pointer-events-none" />
                        </div>
                        <div className="flex gap-4 max-w-2xl mx-auto">
                            <button
                                onClick={() => setStep("form")}
                                className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-all"
                            >
                                Editar Datos
                            </button>
                            <button
                                onClick={() => setStep("signing")}
                                className="flex-[2] py-4 bg-black text-white border border-cima-gold/40 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl flex items-center justify-center gap-2 hover:bg-cima-gold hover:text-black transition-all"
                            >
                                <FileSignature className="h-4 w-4" /> Proceder a Firma Digital
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === "signing" && (
                    <motion.div
                        key="signing"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-10 rounded-[2.5rem] border ${isDarkMode ? "bg-white/[0.02] border-white/5" : "bg-white border-gray-100"} flex flex-col items-center justify-center text-center`}
                    >
                        <div className="mb-8 relative">
                            <div className="h-32 w-64 border-b-2 border-cima-gold/40 flex items-center justify-center relative overflow-hidden bg-white/5 rounded-t-xl group">
                                {isSigning ? (
                                    <motion.svg
                                        viewBox="0 0 200 100"
                                        className="h-full w-full stroke-cima-gold fill-none stroke-[3] drop-shadow-[0_0_10px_rgba(200,169,110,0.5)]"
                                    >
                                        <motion.path
                                            d="M 20 60 C 40 20, 60 80, 80 40 C 100 0, 120 100, 140 60 C 160 20, 180 80, 190 60"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 2, ease: "easeInOut" }}
                                        />
                                    </motion.svg>
                                ) : (
                                    <Sparkles className="h-8 w-8 text-cima-gold/20 animate-pulse" />
                                )}
                                <div className="absolute top-2 right-4 text-[7px] font-black text-cima-gold/40 uppercase tracking-widest">TRAZO BIOMÉTRICO</div>
                            </div>
                            <p className="text-[8px] font-black text-cima-gold uppercase mt-4 tracking-tighter">Firma Digital Cima ShieldΓäó</p>
                        </div>

                        {!isSigning ? (
                            <div className="space-y-4">
                                <h3 className="text-sm font-black uppercase tracking-widest">Seguridad de Firma Biométrica</h3>
                                <p className="text-[10px] text-white/40 max-w-sm mx-auto">Al presionar el botón, se iniciará el proceso de encriptación y estampado de firma digital con validez legal.</p>
                                <button
                                    onClick={handleSign}
                                    className="px-12 py-5 bg-cima-gold text-black rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-cima-gold/20 flex items-center gap-3 hover:scale-105 transition-all"
                                >
                                    Firmar Documento <CheckCircle2 className="h-4 w-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-4">
                                <Loader2 className="h-8 w-8 text-cima-gold animate-spin" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-cima-gold">Sellando Documento Legales...</p>
                            </div>
                        )}
                    </motion.div>
                )}

                {step === "done" && (
                    <motion.div
                        key="done"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-12 rounded-[3.5rem] bg-gradient-to-b from-green-500/10 to-transparent border border-green-500/20 text-center space-y-6"
                    >
                        <div className="h-20 w-20 rounded-full bg-green-500 flex items-center justify-center mx-auto shadow-2xl shadow-green-500/40">
                            <CheckCircle2 className="h-10 w-10 text-black" />
                        </div>
                        <div>
                            <h2 className="text-xl font-heading font-black uppercase tracking-tight mb-2">¡Contrato Firmado!</h2>
                            <p className="text-xs text-white/40 max-w-sm mx-auto">El documento ha sido encriptado y enviado a todos los interesados. Una copia se encuentra en tu Bóveda Digital.</p>
                        </div>
                        <div className="flex gap-3 justify-center">
                            <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 transition-all">
                                <Download className="h-4 w-4" /> Descargar PDF
                            </button>
                            <button className="px-8 py-4 bg-cima-gold text-black rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2 hover:bg-white transition-all">
                                <Share2 className="h-4 w-4" /> Enviar por WhatsApp
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function MessagesView({ messages, isDarkMode }: any) {
    return (
        <div className="space-y-3">
            {messages.map((m: any, i: number) => (
                <div key={i} className={`p-4 rounded-2xl border flex gap-4 transition-all ${isDarkMode ? "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]" : "bg-white border-gray-100 shadow-sm"}`}>
                    <div className="h-10 w-10 rounded-full bg-cima-gold/10 flex items-center justify-center text-cima-gold font-black text-xs shrink-0">
                        {m.from[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                            <h4 className={`text-[11px] font-black uppercase tracking-wider ${isDarkMode ? "text-white" : "text-gray-900"}`}>{m.from}</h4>
                            <span className="text-[8px] opacity-40 font-mono">{m.time}</span>
                        </div>
                        <p className={`text-[10px] ${isDarkMode ? "text-white/60" : "text-gray-500"} line-clamp-2 leading-relaxed`}>{m.message}</p>
                        {m.unread && <span className="inline-block mt-2 h-1.5 w-1.5 rounded-full bg-cima-gold shadow-[0_0_8px_rgba(200,169,110,1)]" />}
                    </div>
                </div>
            ))}
        </div>
    );
}
