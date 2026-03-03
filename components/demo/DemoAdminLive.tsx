"use client";

import React, { useState, useEffect, useCallback } from "react";
// Vercel Redeploy Trigger: Phase 5 - Digital Vault
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
import NextImage from "next/image";
import type { PlanConfig } from "@/lib/config/demo-plans";
import { type LiveLead, type LiveMessage } from "./LiveDemoClient";

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
    { name: "Townhouse San Pedro", price: "$7.2M", status: "Venta", owner: "Lic. Cavazos", img: "/recamara-despues.png", hits: 92, trend: [25, 30, 28, 38, 45, 42, 55], beds: 3, baths: 3, m2: 175, address: "San Pedro Garza García, Zona Valle" },
    { name: "Loft Barrio Antiguo", price: "$2.9M", status: "Venta", owner: "Dis. Ramírez", img: "/cocina-despues.png", hits: 110, trend: [35, 42, 38, 50, 58, 55, 70], beds: 1, baths: 1, m2: 65, address: "Barrio Antiguo, Calle Morelos 412" },
    { name: "Casa Bosques del Valle", price: "$9.7M", status: "Venta", owner: "Dr. González", img: "/estancia-despues.png", hits: 73, trend: [18, 25, 22, 30, 38, 35, 42], beds: 4, baths: 3, m2: 290, address: "Bosques del Valle, Priv. Roble" },
    { name: "Pent. Distrito Tec", price: "$6.8M", status: "Exclusiva", owner: "Ing. Salinas", img: "/recamara-despues.png", hits: 156, trend: [42, 50, 45, 62, 70, 65, 82], beds: 2, baths: 2, m2: 130, address: "Blvd. Díaz Ordaz, Torre Altus, P.H." },
    { name: "Residencia Chipinque", price: "$22.0M", status: "Exclusiva", owner: "Fam. Garza", img: "/cocina-despues.png", hits: 225, trend: [55, 65, 60, 78, 88, 82, 95], beds: 5, baths: 5, m2: 550, address: "Paseo de Chipinque 100, San Pedro" },
];

// (Moved to shared state in LiveDemoClient)
// const LEADS = [...]

const VISITS = [
    { prospect: "Familia Rodríguez", property: "Residencia Las Misiones", date: "Hoy", time: "11:00 AM", status: "confirmada", sentiment: "positive" },
    { prospect: "Ing. Luis Garza", property: "Depto. Torre LOVFT", date: "Hoy", time: "4:30 PM", status: "pendiente", sentiment: null },
    { prospect: "Sra. Ana Treviño", property: "Residencia Las Misiones", date: "Mañana", time: "10:00 AM", status: "confirmada", sentiment: null },
    { prospect: "Carlos López", phone: "81 9876 5432", source: "Marketplace", sourceIcon: Facebook, status: "contactado", date: "Hace 1 hora", property: "Depto. Torre LOVFT", color: "text-blue-400 bg-blue-500/10" },
    { prospect: "María Elena Ramos", property: "Residencia Contry Sol", date: "28 Feb", time: "11:30 AM", status: "realizada", sentiment: "positive" },
    { prospect: "Roberto Treviño", property: "Pent. Santa María", date: "27 Feb", time: "5:00 PM", status: "realizada", sentiment: "neutral" },
    { prospect: "Lic. Pérez (familiar)", property: "Casa Valle Poniente", date: "26 Feb", time: "3:00 PM", status: "cancelada", sentiment: null },
];

// (Moved to shared state in LiveDemoClient)
// const MESSAGES = [...]

const NOTIFICATIONS = [
    { icon: Zap, text: "Nuevo lead desde Instagram", sub: "Ana Martínez — Residencia Las Misiones", color: "text-pink-400 bg-pink-500/20" },
    { icon: Calendar, text: "Visita agendada para mañana", sub: "Sra. Treviño — 10:00 AM", color: "text-blue-400 bg-blue-500/20" },
    { icon: MessageSquare, text: "Nuevo mensaje", sub: "Familia Rodríguez quiere reagendar", color: "text-purple-400 bg-purple-500/20" },
    { icon: Target, text: "Oferta recibida", sub: "$11.8M — Residencia Las Misiones", color: "text-green-400 bg-green-500/20" },
    { icon: Eye, text: "Tu propiedad tiene 50 vistas hoy", sub: "Pent. Santa María — récord semanal", color: "text-amber-400 bg-amber-500/20" },
    { icon: Phone, text: "Lead por WhatsApp", sub: "Familia Rodríguez — Mar del Plata 123", color: "text-green-400 bg-green-500/20" },
];

const STATUS_MAP: Record<string, { label: string; class: string }> = {
    nuevo: { label: "Nuevo", class: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
    contactado: { label: "Contactado", class: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
    calificado: { label: "Calificado", class: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
    visita_agendada: { label: "Visita", class: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
    en_negociacion: { label: "Negociación", class: "bg-cima-gold/20 text-cima-gold border-cima-gold/30" },
};

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

/* ─── Animated Counter ─────────────────────────────────────── */
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

/* ─── Rotating Notification Toast ──────────────────────────── */
function RotatingToast({ onClick }: { onClick?: () => void }) {
    const [index, setIndex] = useState(0);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Show first notification after 3s
        const firstTimer = setTimeout(() => setVisible(true), 3000);

        const interval = setInterval(() => {
            setVisible(false);
            setTimeout(() => {
                setIndex((i) => (i + 1) % NOTIFICATIONS.length);
                setVisible(true);
            }, 500);
        }, 12000); // Rotate every 12 seconds

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
                    className="fixed bottom-24 right-6 z-[100] bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl max-w-xs cursor-pointer hover:border-cima-gold/40 transition-all group"
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
                                Click para ver detalle <ChevronRight className="h-2 w-2" />
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/* ─── Bar Chart Component ──────────────────────────────────── */
function BarChart({ data, labels, isDarkMode }: { data: number[]; labels: string[]; isDarkMode: boolean }) {
    const max = Math.max(...data);
    return (
        <div className="flex items-end gap-2 h-32">
            {data.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className={`text-[8px] font-mono ${isDarkMode ? "text-white/40" : "text-gray-400"}`}>{v}</span>
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(v / max) * 100}%` }}
                        transition={{ delay: i * 0.08, duration: 0.5 }}
                        className="w-full bg-gradient-to-t from-cima-gold/40 to-cima-gold rounded-t-lg min-h-[4px]"
                    />
                    <span className={`text-[7px] font-bold uppercase ${isDarkMode ? "text-white/30" : "text-gray-500"}`}>{labels[i]}</span>
                </div>
            ))}
        </div>
    );
}

/* ═══ MAIN COMPONENT ═══════════════════════════════════════ */
export default function DemoAdminLive({
    plan,
    leads,
    onUpdateLeadStatus,
    newLeadId,
    agentName,
    onNavigateToLeads,
    externalTab,
    messages,
    onAddMessage,
    isDarkMode = true,
    setIsDarkMode
}: DemoAdminLiveProps) {
    const f = plan.features.admin;
    const [activeTab, setActiveTab] = useState<SidebarTab>("propiedades");
    const [isMobilePreview, setIsMobilePreview] = useState(false);
    const [isDND, setIsDND] = useState(false);

    // Reset to propiedades if current tab becomes unavailable
    // OR if externalTab changes (Auto Demo)
    React.useEffect(() => {
        if (externalTab) {
            setActiveTab(externalTab);
            return;
        }
        if (activeTab === "leads" || activeTab === "visitas" && !f.visits) setActiveTab("propiedades");
        if (activeTab === "analiticos" && !f.analytics) setActiveTab("propiedades");
        if (activeTab === "mensajes" && !f.messages) setActiveTab("propiedades");
        setSelectedProperty(null);
    }, [plan.tier, externalTab]);

    const maxProps = plan.maxProperties === -1 ? PROPERTIES.length : plan.maxProperties;
    const visibleProps = PROPERTIES.slice(0, maxProps);
    const canEdit = plan.tier === "profesional" || plan.tier === "premium";
    const [selectedProperty, setSelectedProperty] = useState<number | null>(null);

    const PLAN_LABELS: Record<string, string> = {
        basico: "Starter",
        profesional: "Professional",
        premium: "Team / Agency",
    };

    const navItems: { id: SidebarTab; icon: React.ElementType; label: string; badge?: string; locked: boolean }[] = [
        { id: "propiedades", icon: Layout, label: "Propiedades", locked: false },
        { id: "leads", icon: Users, label: "Leads", badge: "7", locked: false },
        { id: "visitas", icon: Target, label: "Visitas", badge: "2", locked: !f.visits },
        { id: "analiticos", icon: TrendingUp, label: "Analíticos", locked: !f.analytics },
        { id: "mensajes", icon: MessageSquare, label: "Mensajes", badge: messages.filter(m => m.unread).length > 0 ? messages.filter(m => m.unread).length.toString() : undefined, locked: !f.messages },
        { id: "ia_studio", icon: Wand2, label: "IA Studio", locked: plan.tier === "basico" },
        { id: "documentos", icon: ShieldCheck, label: "Documentos", locked: plan.tier === "basico" },
        { id: "contratos", icon: FileSignature, label: "Contratos", locked: plan.tier === "basico" },
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

    const STATS = tierStats[plan.tier] || tierStats.premium;

    return (
        <div className={`transition-all duration-500 min-h-screen ${isDarkMode ? "bg-[#0A0A0B] text-white" : "bg-gray-50 text-gray-900"}`}>
            <div className={`flex h-screen overflow-hidden ${isDarkMode ? "bg-[#0A0A0B]" : "bg-white"}`}>
                {/* ── Sidebar ─────────────────────────────── */}
                <div className={`hidden lg:flex flex-col w-56 min-h-screen border-r transition-colors duration-500 ${isDarkMode ? "border-white/5 bg-black/40" : "border-gray-200 bg-gray-50/50"} p-5`}>
                    <div className="flex items-center gap-2.5 mb-10">
                        <div className="h-8 w-8 rounded-lg bg-cima-gold flex items-center justify-center shadow-lg shadow-cima-gold/20 shrink-0">
                            <Layout className="h-4 w-4 text-black" />
                        </div>
                        <div className="flex flex-col">
                            <span className={`text-[10px] font-black uppercase tracking-wider ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                                {agentName ? `Panel de ${agentName.split(' ')[0]} ` : "Panel"}
                            </span>
                            <span className="text-[8px] font-mono text-cima-gold uppercase tracking-widest">{PLAN_LABELS[plan.tier] || plan.name}</span>
                        </div>
                    </div>

                    <nav className="space-y-1.5 flex-1">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => !item.locked && setActiveTab(item.id)}
                                className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all ${item.locked
                                    ? isDarkMode ? "text-white/10 cursor-not-allowed" : "text-gray-200 cursor-not-allowed"
                                    : activeTab === item.id
                                        ? "bg-cima-gold/10 text-cima-gold border border-cima-gold/20"
                                        : isDarkMode ? "text-white/30 hover:bg-white/[0.03] hover:text-white/60" : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <item.icon className="h-3.5 w-3.5 shrink-0" />
                                    <span className="text-[9px] font-bold uppercase tracking-tight">{item.label}</span>
                                </div>
                                {item.locked ? (
                                    <Lock className="h-3 w-3 text-white/10" />
                                ) : item.badge ? (
                                    <span className="relative h-4 w-4 rounded-full bg-cima-gold text-black text-[7px] font-black flex items-center justify-center">
                                        {item.badge}
                                        <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-500 animate-ping" />
                                        <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-500" />
                                    </span>
                                ) : null}
                            </button>
                        ))}

                        {/* Config (static) */}
                        <div className="text-white/15 p-2.5 flex items-center gap-2 cursor-default">
                            <Settings className="h-3.5 w-3.5" />
                            <span className="text-[9px] font-bold uppercase tracking-tight">Config</span>
                        </div>
                    </nav>

                    {/* Capacity */}
                    <div className="p-3 bg-white/[0.03] border border-white/10 rounded-xl">
                        <p className="text-[7px] text-cima-gold font-black mb-2 uppercase tracking-widest">Capacidad</p>
                        <div className="h-1.5 w-full bg-white/5 rounded-full mb-2">
                            <div className="h-full bg-cima-gold rounded-full shadow-[0_0_8px_rgba(200,169,110,0.4)]" style={{ width: `${Math.min((visibleProps.length / 5) * 100, 100)}%` }} />
                        </div>
                        <p className="text-[7px] text-white/40 font-mono">{visibleProps.length}/{maxProps === PROPERTIES.length ? "∞" : maxProps}</p>
                    </div>
                </div>

                {/* ── Main Content Area (Wrappable for Mobile) ─────────── */}
                <div className={`flex-1 transition-all duration-700 flex flex-col items-center ${isMobilePreview ? "py-10 bg-[#050505]" : "p-0"}`}>
                    <motion.div
                        layout
                        initial={false}
                        animate={{
                            width: isMobilePreview ? 414 : "100%",
                            height: isMobilePreview ? 850 : "auto",
                        }}
                        className={`transition-all duration-700 relative flex flex-col ${isMobilePreview
                            ? "border-[12px] border-[#1A1A1C] rounded-[3.5rem] shadow-[0_0_100px_rgba(200,169,110,0.1)] overflow-hidden bg-[#0A0A0B] ring-1 ring-white/10"
                            : "min-h-screen"}`}
                    >
                        {/* Smartphone Notch / Top Bar */}
                        {isMobilePreview && (
                            <div className="h-10 w-full bg-[#1A1A1C] flex items-center justify-center relative">
                                <div className="h-4 w-24 bg-black rounded-full" />
                                <div className="absolute right-6 flex items-center gap-1.5 opacity-40">
                                    <div className="h-2 w-2 rounded-[1px] bg-white" />
                                    <div className="h-2 w-3 rounded-[1px] bg-white" />
                                    <div className="h-2 w-4 rounded-[1px] bg-white" />
                                </div>
                            </div>
                        )}

                        <div className={`flex-1 overflow-y-auto custom-scrollbar ${isMobilePreview ? "p-4" : "p-6 lg:p-8"}`}>
                            {/* Mobile tabs */}
                            <div className="lg:hidden flex gap-1 mb-6 overflow-x-auto pb-2">
                                {navItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => !item.locked && setActiveTab(item.id)}
                                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[8px] font-bold uppercase whitespace-nowrap transition-all ${item.locked
                                            ? "bg-white/5 text-white/15 cursor-not-allowed"
                                            : activeTab === item.id
                                                ? "bg-cima-gold text-black"
                                                : "bg-white/5 text-white/40"
                                            }`}
                                    >
                                        {item.locked ? <Lock className="h-3 w-3" /> : <item.icon className="h-3 w-3" />}
                                        {item.label}
                                        {!item.locked && item.badge && (
                                            <span className="h-3.5 w-3.5 rounded-full bg-red-500 text-white text-[6px] font-black flex items-center justify-center">{item.badge}</span>
                                        )}
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
                                        {activeTab === "mensajes" && "Mensajes"}
                                        {activeTab === "ia_studio" && "IA Studio"}
                                        {activeTab === "documentos" && "Documentos"}
                                        {activeTab === "contratos" && "Contratos"}
                                    </h1>
                                    <p className={`text-xs ${isDarkMode ? "text-white/40" : "text-gray-500"}`}>
                                        {activeTab === "propiedades" && <>Gestionando <span className={`${isDarkMode ? "text-white" : "text-gray-900"} font-bold`}>{visibleProps.length} activos</span>{maxProps < PROPERTIES.length && <span className={isDarkMode ? "text-white/20" : "text-gray-300"}> · Límite: {maxProps}</span>}</>}
                                        {activeTab === "leads" && <>Tienes <span className={`${isDarkMode ? "text-white" : "text-gray-900"} font-bold`}>7 leads</span> esta semana</>}
                                        {activeTab === "visitas" && <>Próximas <span className={`${isDarkMode ? "text-white" : "text-gray-900"} font-bold`}>4 visitas</span> esta semana</>}
                                        {activeTab === "analiticos" && <>Rendimiento de los <span className={`${isDarkMode ? "text-white" : "text-gray-900"} font-bold`}>últimos 30 días</span></>}
                                        {activeTab === "mensajes" && <><span className={`${isDarkMode ? "text-white" : "text-gray-900"} font-bold`}>{messages.filter(m => m.unread).length} sin leer</span> · {messages.length} conversaciones</>}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`relative p-2.5 border rounded-xl transition-all cursor-pointer ${isDarkMode ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-gray-100 border-gray-200 hover:bg-gray-200"}`}>
                                        <Bell className={`h-3.5 w-3.5 ${isDarkMode ? "text-white/40" : "text-gray-400"}`} />
                                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[7px] font-black text-white flex items-center justify-center">5</span>
                                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 animate-ping opacity-30" />
                                    </div>

                                    {/* Mobile Preview Toggle */}
                                    <button
                                        onClick={() => setIsMobilePreview(!isMobilePreview)}
                                        className={`p-2.5 border rounded-xl transition-all flex items-center gap-2 group ${isMobilePreview ? "bg-cima-gold border-cima-gold text-black shadow-lg shadow-cima-gold/20" : isDarkMode ? "bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white" : "bg-gray-100 border-gray-200 text-gray-400 hover:bg-gray-200 hover:text-gray-600"}`}
                                        title={isMobilePreview ? "Volver a Escritorio" : "Ver en Móvil"}
                                    >
                                        {isMobilePreview ? <Monitor className="h-3.5 w-3.5" /> : <Smartphone className="h-3.5 w-3.5" />}
                                        <span className="text-[8px] font-black uppercase tracking-widest hidden md:inline">
                                            {isMobilePreview ? "Escritorio" : "Móvil"}
                                        </span>
                                    </button>

                                    {/* DND Toggle */}
                                    <button
                                        onClick={() => setIsDND(!isDND)}
                                        className={`p-2.5 border rounded-xl transition-all flex items-center gap-2 group ${isDND ? "bg-cima-gold border-cima-gold text-black shadow-lg shadow-cima-gold/20" : isDarkMode ? "bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white" : "bg-gray-100 border-gray-200 text-gray-400 hover:bg-gray-200 hover:text-gray-600"}`}
                                        title={isDND ? "Desactivar No Molestar" : "Activar No Molestar"}
                                    >
                                        {isDND ? <MoonStar className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
                                        <span className="text-[8px] font-black uppercase tracking-widest hidden md:inline">
                                            {isDND ? "Activo" : "Silencio"}
                                        </span>
                                    </button>

                                    <button className="flex items-center gap-2 bg-cima-gold text-black px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-wider hover:bg-white transition-all shadow-lg shrink-0">
                                        <Plus className="h-3.5 w-3.5" /> Nueva
                                    </button>
                                </div>
                            </div>

                            {/* Analytics Row — always visible */}
                            <div className={`grid transition-all duration-500 ${isMobilePreview ? "grid-cols-1 gap-2" : "grid-cols-2 md:grid-cols-4 gap-3"} mb-8`} key={plan.tier}>
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
                                        <div className="flex items-end justify-between gap-2">
                                            <div>
                                                <div className={`font-heading font-black ${isDarkMode ? "text-white" : "text-gray-900"} ${isMobilePreview ? "text-base" : "text-xl"}`}>
                                                    <Counter
                                                        value={stat.value}
                                                        suffix={stat.label === "Conversión" ? "%" : ""}
                                                    />
                                                </div>
                                                <p className={`text-[8px] uppercase font-black tracking-widest ${isDarkMode ? "text-white/30" : "text-gray-400"}`}>{stat.label}</p>
                                            </div>
                                            {!isMobilePreview && <MiniChart data={stat.data} />}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* ── Tab Content ──────────────────────── */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {activeTab === "propiedades" && (
                                        selectedProperty !== null && canEdit ? (
                                            <PropertyDetailPanel
                                                property={visibleProps[selectedProperty]}
                                                onBack={() => setSelectedProperty(null)}
                                                isTeam={plan.tier === "premium"}
                                                plan={plan}
                                                isDarkMode={isDarkMode}
                                            />
                                        ) : (
                                            <PropertiesView
                                                properties={visibleProps}
                                                canEdit={canEdit}
                                                onSelect={(i) => setSelectedProperty(i)}
                                                plan={plan}
                                                isDarkMode={isDarkMode}
                                            />
                                        )
                                    )}
                                    {activeTab === "leads" && (
                                        <LeadsView
                                            leads={leads}
                                            newLeadId={newLeadId}
                                            onUpdateStatus={onUpdateLeadStatus}
                                            tier={plan.tier}
                                            isDarkMode={isDarkMode}
                                        />
                                    )}
                                    {activeTab === "visitas" && !navItems.find(n => n.id === "visitas")?.locked && <VisitsView isDarkMode={isDarkMode} />}
                                    {activeTab === "analiticos" && !navItems.find(n => n.id === "analiticos")?.locked && <AnalyticsView isDarkMode={isDarkMode} />}
                                    {activeTab === "mensajes" && !navItems.find(n => n.id === "mensajes")?.locked && <MessagesView messages={messages} isDarkMode={isDarkMode} />}
                                    {activeTab === "ia_studio" && !navItems.find(n => n.id === "ia_studio")?.locked && <IaStudioView isDarkMode={isDarkMode} />}
                                    {activeTab === "documentos" && !navItems.find(n => n.id === "documentos")?.locked && <DocumentsView isDarkMode={isDarkMode} />}
                                    {activeTab === "contratos" && !navItems.find(n => n.id === "contratos")?.locked && <ContractGeneratorView isMobilePreview={isMobilePreview} isDarkMode={isDarkMode} />}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </motion.div>
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

/* ═══ VIEWS ════════════════════════════════════════════════ */

/* ── Diffusion Button (for PropertiesView) ─────────────────── */
function DiffusionButton({ propertyName, tier }: { propertyName: string; tier: string }) {
    const [loading, setLoading] = useState(false);
    const [upgradeAlert, setUpgradeAlert] = useState(false);
    const isStarter = tier === "basico";

    const handleClick = () => {
        if (isStarter) {
            setUpgradeAlert(true);
            setTimeout(() => setUpgradeAlert(false), 3000);
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            alert(`Propiedad "${propertyName}" difundida con éxito!`);
        }, 1500);
    };

    return (
        <div className="relative">
            <button
                onClick={handleClick}
                disabled={loading}
                className={`flex-1 flex items-center justify-center gap-2 bg-cima-gold text-black py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${isStarter ? "opacity-50 cursor-not-allowed" : "hover:bg-white shadow-lg"}`}
            >
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                Difundir
            </button>
            <AnimatePresence>
                {upgradeAlert && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute -top-10 left-1/2 -translate-x-1/2 z-50 bg-cima-gold text-black px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest shadow-2xl flex items-center gap-1 whitespace-nowrap"
                    >
                        <Lock className="h-2.5 w-2.5" /> Disponible en planes Pro / Team
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

/* ── Properties View ───────────────────────────────────────── */
function PropertiesView({ properties, canEdit, onSelect, plan, isDarkMode }: { properties: typeof PROPERTIES; canEdit: boolean; onSelect: (i: number) => void; plan: PlanConfig; isDarkMode: boolean }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {properties.map((prop, i) => (
                <motion.div
                    key={i}
                    layoutId={`prop-${i}`}
                    onClick={() => onSelect(i)}
                    className={`group cursor-pointer border rounded-2xl overflow-hidden transition-all duration-500 flex flex-col h-full ${isDarkMode ? "bg-white/[0.03] border-white/5 hover:border-cima-gold/30 hover:bg-white/[0.05]" : "bg-white border-gray-200 hover:border-cima-gold/40 hover:shadow-xl hover:shadow-gray-200/20"}`}
                >
                    <div className="relative h-36 w-full overflow-hidden">
                        <img src={prop.img} alt={prop.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-cima-gold text-[8px] font-black uppercase tracking-widest">
                            {prop.status}
                        </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className={`font-heading font-black text-sm group-hover:text-cima-gold transition-colors ${isDarkMode ? "text-white" : "text-gray-900"}`}>{prop.name}</h3>
                            <span className="text-[10px] font-black text-cima-gold tracking-tighter">{prop.price}</span>
                        </div>
                        <p className={`text-[9px] font-medium mb-4 line-clamp-1 ${isDarkMode ? "text-white/40" : "text-gray-500"}`}>{prop.address}</p>

                        <div className={`grid grid-cols-3 gap-2 py-3 border-y mb-4 ${isDarkMode ? "border-white/5" : "border-gray-100"}`}>
                            <div className="text-center">
                                <p className={`text-[8px] font-black uppercase tracking-widest leading-none mb-1 ${isDarkMode ? "text-white/20" : "text-gray-400"}`}>Hab</p>
                                <p className={`text-[10px] font-bold ${isDarkMode ? "text-white/70" : "text-gray-700"}`}>{prop.beds}</p>
                            </div>
                            <div className="text-center">
                                <p className={`text-[8px] font-black uppercase tracking-widest leading-none mb-1 ${isDarkMode ? "text-white/20" : "text-gray-400"}`}>Baños</p>
                                <p className={`text-[10px] font-bold ${isDarkMode ? "text-white/70" : "text-gray-700"}`}>{prop.baths}</p>
                            </div>
                            <div className="text-center">
                                <p className={`text-[8px] font-black uppercase tracking-widest leading-none mb-1 ${isDarkMode ? "text-white/20" : "text-gray-400"}`}>m²</p>
                                <p className={`text-[10px] font-bold ${isDarkMode ? "text-white/70" : "text-gray-700"}`}>{prop.m2}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-auto">
                            <div className={`flex items-center gap-1.5 ${canEdit ? "" : "ml-auto"}`}>
                                <div className={`p-1.5 rounded-lg border transition-all cursor-pointer ${isDarkMode ? "bg-white/5 border-white/10 hover:bg-cima-gold/20" : "bg-gray-50 border-gray-200 hover:bg-gray-100"}`}>
                                    <Settings className={`h-3 w-3 ${isDarkMode ? "text-white/40" : "text-gray-400"}`} />
                                </div>
                                <div className={`p-1.5 rounded-lg border transition-all cursor-pointer ${isDarkMode ? "bg-cima-gold/10 border-cima-gold/20 hover:bg-cima-gold" : "bg-cima-gold/10 border-cima-gold/20 hover:bg-cima-gold"}`}>
                                    <Layout className={`h-3 w-3 ${isDarkMode ? "text-cima-gold" : "text-cima-gold"}`} />
                                </div>
                                <div className={`p-1.5 rounded-lg border transition-all cursor-pointer ${isDarkMode ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-gray-50 border-gray-200 hover:bg-gray-100"}`}>
                                    <Share2 className={`h-3 w-3 ${isDarkMode ? "text-white/20" : "text-gray-400"}`} />
                                </div>
                            </div>
                            {canEdit && (
                                <span className={`text-[7px] font-bold uppercase tracking-widest flex items-center gap-1 ${isDarkMode ? "text-white/20" : "text-gray-400"}`}>
                                    <Edit3 className="h-2.5 w-2.5" /> Editar
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                            <button className={`flex-1 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${isDarkMode ? "bg-white/[0.05] hover:bg-white/10 text-white/60 hover:text-white border border-white/5" : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 border border-gray-200"}`}>
                                Editar
                            </button>
                            <DiffusionButton propertyName={prop.name} tier={plan.tier} />
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

/* ── Mock Agents (Team tier) ───────────────────────────────── */
const AGENTS = [
    { name: "Carlos Mendoza", role: "Asesor Senior", avatar: "CM", color: "bg-blue-500", props: 5 },
    { name: "María González", role: "Asesora Comercial", avatar: "MG", color: "bg-pink-500", props: 4 },
    { name: "Roberto Treviño", role: "Coordinador", avatar: "RT", color: "bg-emerald-500", props: 3 },
    { name: "Sofía Villarreal", role: "Asesora Jr.", avatar: "SV", color: "bg-purple-500", props: 1 },
];

/* ── Property Detail Panel ─────────────────────────────────── */
function PropertyDetailPanel({ property, onBack, isTeam, plan, isDarkMode }: { property: (typeof PROPERTIES)[0]; onBack: () => void; isTeam: boolean; plan: PlanConfig; isDarkMode: boolean }) {
    const [activeSection, setActiveSection] = useState<"general" | "marketing" | "owner" | "visits" | "legal">("general");
    const [isPublished, setIsPublished] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiText, setAiText] = useState("");
    const [selectedAgent, setSelectedAgent] = useState(0);
    const [agentDropdownOpen, setAgentDropdownOpen] = useState(false);
    const [editedName, setEditedName] = useState(property.name);
    const [editedPrice, setEditedPrice] = useState(property.price);
    const [editedAddress, setEditedAddress] = useState(property.address);

    const FULL_AI_TEXT = `Descubre esta impresionante ${property.name.toLowerCase()} ubicada en ${property.address}. Con ${property.beds} amplias recámaras, ${property.baths} baños de lujo y ${property.m2} m² de construcción, esta propiedad ofrece el espacio ideal para tu familia.Acabados de primera calidad, iluminación natural excepcional y una ubicación privilegiada que garantiza plusvalía.Agenda tu visita hoy.`;

    function handleAIGenerate() {
        setIsGenerating(true);
        setAiText("");
        let idx = 0;
        const interval = setInterval(() => {
            idx++;
            setAiText(FULL_AI_TEXT.slice(0, idx));
            if (idx >= FULL_AI_TEXT.length) {
                clearInterval(interval);
                setIsGenerating(false);
            }
        }, 15);
    }

    return (
        <div className="space-y-6">
            <button
                onClick={onBack}
                className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors mb-4 ${isDarkMode ? "text-white/40 hover:text-white" : "text-gray-400 hover:text-gray-900"}`}
            >
                <ChevronLeft className="h-4 w-4" /> Volver a lista
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Image and Quick Stats */}
                <div className="lg:col-span-1 space-y-6">
                    <div className={`rounded-3xl border overflow-hidden p-3 ${isDarkMode ? "bg-white/[0.03] border-white/5" : "bg-white border-gray-200 shadow-xl shadow-gray-200/20"}`}>
                        <div className="relative aspect-square rounded-2xl overflow-hidden mb-4">
                            <img src={property.img} alt={property.name} className="w-full h-full object-cover" />
                            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-cima-gold text-[8px] font-black uppercase tracking-widest">
                                {property.status}
                            </div>
                        </div>
                        <h2 className={`font-heading font-black text-xl mb-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>{property.name}</h2>
                        <p className={`text-xs mb-4 ${isDarkMode ? "text-white/40" : "text-gray-500"}`}>{property.address}</p>
                        <div className="flex items-center justify-between py-4 border-t border-white/5">
                            <span className="text-cima-gold font-black text-2xl tracking-tighter">{property.price}</span>
                            <div className="flex gap-2">
                                <div className={`p-2 rounded-lg border ${isDarkMode ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"}`}>
                                    <Share2 className={`h-3.5 w-3.5 ${isDarkMode ? "text-white/40" : "text-gray-400"}`} />
                                </div>
                                <div className={`p-2 rounded-lg border ${isDarkMode ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"}`}>
                                    <Trash2 className="h-3.5 w-3.5 text-red-500/50" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Specs */}
                    <div className={`grid grid-cols-3 gap-3 p-3 rounded-3xl border ${isDarkMode ? "bg-white/[0.03] border-white/5" : "bg-white border-gray-200 shadow-xl shadow-gray-200/20"}`}>
                        <div className="text-center">
                            <BedDouble className={`h-4 w-4 mx-auto mb-1 ${isDarkMode ? "text-white/20" : "text-gray-400"}`} />
                            <p className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{property.beds}</p>
                            <p className={`text-[7px] uppercase font-bold tracking-wider ${isDarkMode ? "text-white/30" : "text-gray-500"}`}>Recámaras</p>
                        </div>
                        <div className="text-center">
                            <Bath className={`h-4 w-4 mx-auto mb-1 ${isDarkMode ? "text-white/20" : "text-gray-400"}`} />
                            <p className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{property.baths}</p>
                            <p className={`text-[7px] uppercase font-bold tracking-wider ${isDarkMode ? "text-white/30" : "text-gray-500"}`}>Baños</p>
                        </div>
                        <div className="text-center">
                            <Ruler className={`h-4 w-4 mx-auto mb-1 ${isDarkMode ? "text-white/20" : "text-gray-400"}`} />
                            <p className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{property.m2}</p>
                            <p className={`text-[7px] uppercase font-bold tracking-wider ${isDarkMode ? "text-white/30" : "text-gray-500"}`}>m²</p>
                        </div>
                    </div>

                    {/* Owner info */}
                    <div className={`rounded-3xl border p-3 ${isDarkMode ? "bg-white/[0.03] border-white/5" : "bg-white border-gray-200 shadow-xl shadow-gray-200/20"}`}>
                        <p className={`text-[7px] font-bold uppercase tracking-widest mb-2 ${isDarkMode ? "text-white/30" : "text-gray-500"}`}>Propietario</p>
                        <p className={`text-xs font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{property.owner}</p>
                        <p className={`text-[9px] mt-0.5 ${isDarkMode ? "text-white/30" : "text-gray-500"}`}>{property.status} · {property.address.split(",").pop()?.trim()}</p>
                    </div>
                </div>

                {/* Right Column: Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${isDarkMode ? "bg-white/5 border-white/10" : "bg-gray-100 border-gray-200"}`}>
                                <span className={`text-[8px] font-bold uppercase ${isDarkMode ? "text-white/40" : "text-gray-500"}`}>Publicada</span>
                                <button onClick={() => setIsPublished(!isPublished)} className="relative">
                                    <div className={`w-8 h-4 rounded-full transition-all ${isPublished ? "bg-green-500" : (isDarkMode ? "bg-white/10" : "bg-gray-300")}`}>
                                        <div className={`absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition-all ${isPublished ? "left-[18px]" : "left-0.5"}`} />
                                    </div>
                                </button>
                            </div>
                            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-cima-gold text-black rounded-lg text-[8px] font-black uppercase tracking-wider hover:bg-white transition-all shadow-lg shrink-0">
                                <ExternalLink className="h-3 w-3" /> Ver Landing
                            </button>
                        </div>
                    </div>

                    {/* Section Navigation */}
                    <div className={`flex items-center gap-2 p-1 rounded-xl border ${isDarkMode ? "bg-white/5 border-white/10" : "bg-gray-100 border-gray-200"}`}>
                        {[
                            { id: "general", label: "General" },
                            { id: "marketing", label: "Marketing" },
                            { id: "owner", label: "Propietario" },
                            { id: "visits", label: "Visitas" },
                            { id: "legal", label: "Legal" },
                        ].map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id as any)}
                                className={`flex-1 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-wider transition-all ${activeSection === section.id
                                    ? "bg-white text-gray-900 shadow-sm"
                                    : isDarkMode
                                        ? "text-white/40 hover:text-white hover:bg-white/5"
                                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                    }`}
                            >
                                {section.label}
                            </button>
                        ))}
                    </div>

                    {/* AI Description */}
                    <div className={`rounded-3xl border p-3 ${isDarkMode ? "bg-white/[0.03] border-white/5" : "bg-white border-gray-200 shadow-xl shadow-gray-200/20"}`}>
                        <div className="flex items-center justify-between mb-3">
                            <p className={`text-[7px] font-bold uppercase tracking-widest ${isDarkMode ? "text-white/30" : "text-gray-500"}`}>Descripción con IA</p>
                            <button
                                onClick={handleAIGenerate}
                                disabled={isGenerating}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-[7px] font-black text-purple-400 uppercase tracking-wider hover:bg-purple-500/20 transition-all disabled:opacity-50"
                            >
                                <Sparkles className={`h-3 w-3 ${isGenerating ? "animate-spin" : ""}`} />
                                {isGenerating ? "Generando…" : "Generar con IA"}
                            </button>
                        </div>
                        <textarea
                            className={`w-full border rounded-lg px-3 py-2.5 text-xs outline-none focus:border-cima-gold/40 transition-all resize-none h-28 ${isDarkMode ? "bg-white/5 border-white/10 text-white/60" : "bg-gray-50 border-gray-200 text-gray-600"}`}
                            value={aiText || `Hermosa propiedad en ${property.address}. Contacta para más información.`}
                            readOnly
                        />
                    </div>
                </div>
            </div>

            {/* Right: Photos & Actions */}
            <div className="space-y-4">
                {/* Photos */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-[7px] text-white/30 font-bold uppercase tracking-widest">Galería de Fotos</label>
                        <span className="text-[7px] text-white/20 font-mono">4 fotos</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {[property.img, "/estancia-despues.png", "/recamara-despues.png", "/cocina-despues.png"].map((img, j) => (
                            <div key={j} className="aspect-square rounded-lg overflow-hidden border border-white/10 relative group/photo">
                                <img src={img} alt="" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center gap-1">
                                    <Edit3 className="h-3 w-3 text-white" />
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-2 flex items-center justify-center gap-1.5 px-3 py-2.5 border border-dashed border-white/10 rounded-lg text-[8px] font-bold text-white/30 uppercase tracking-wider hover:border-cima-gold/30 hover:text-cima-gold transition-all">
                        <Upload className="h-3 w-3" /> Subir más fotos
                    </button>
                </div>

                {/* Quick actions */}
                <div className="space-y-2">
                    <p className="text-[7px] text-white/30 font-bold uppercase tracking-widest">Acciones</p>
                    {[
                        { icon: FileText, label: "Generar ficha PDF", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
                        { icon: Share2, label: "Compartir WhatsApp", color: "text-green-400 bg-green-500/10 border-green-500/20" },
                        { icon: ImageIcon, label: "Generar anuncio redes", color: "text-pink-400 bg-pink-500/10 border-pink-500/20" },
                        { icon: Sparkles, label: "Llenado completo con IA", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
                    ].map((action, j) => (
                        <button key={j} className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border text-[8px] font-bold uppercase tracking-wider transition-all hover:scale-[1.02] ${action.color}`}>
                            <action.icon className="h-3.5 w-3.5 shrink-0" />
                            {action.label}
                        </button>
                    ))}
                </div>

                {/* Agent selector (Team only) */}
                {isTeam && (
                    <div>
                        <p className="text-[7px] text-white/30 font-bold uppercase tracking-widest mb-2">Asesor Asignado</p>
                        <div className="relative">
                            <button
                                onClick={() => setAgentDropdownOpen(!agentDropdownOpen)}
                                className="w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl hover:border-cima-gold/30 transition-all"
                            >
                                <div className="flex items-center gap-2">
                                    <div className={`h-7 w-7 rounded-lg ${AGENTS[selectedAgent].color} flex items-center justify-center text-[8px] font-black text-white`}>
                                        {AGENTS[selectedAgent].avatar}
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] font-bold text-white">{AGENTS[selectedAgent].name}</p>
                                        <p className="text-[7px] text-white/30">{AGENTS[selectedAgent].role} · {AGENTS[selectedAgent].props} propiedades</p>
                                    </div>
                                </div>
                                <ChevronDown className={`h-3.5 w-3.5 text-white/30 transition-transform ${agentDropdownOpen ? "rotate-180" : ""}`} />
                            </button>
                            <AnimatePresence>
                                {agentDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -5, height: 0 }}
                                        animate={{ opacity: 1, y: 0, height: "auto" }}
                                        exit={{ opacity: 0, y: -5, height: 0 }}
                                        className="absolute top-full left-0 right-0 z-20 mt-1 bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-2xl"
                                    >
                                        {AGENTS.map((agent, j) => (
                                            <button
                                                key={j}
                                                onClick={() => { setSelectedAgent(j); setAgentDropdownOpen(false); }}
                                                className={`w-full flex items-center gap-2 px-3 py-2.5 hover:bg-white/5 transition-all ${j === selectedAgent ? "bg-cima-gold/5 border-l-2 border-cima-gold" : "border-l-2 border-transparent"
                                                    }`}
                                            >
                                                <div className={`h-6 w-6 rounded-lg ${agent.color} flex items-center justify-center text-[7px] font-black text-white shrink-0`}>
                                                    {agent.avatar}
                                                </div>
                                                <div className="text-left flex-1">
                                                    <p className="text-[9px] font-bold text-white">{agent.name}</p>
                                                    <p className="text-[7px] text-white/30">{agent.role}</p>
                                                </div>
                                                <span className="text-[7px] text-white/20 font-mono">{agent.props} props</span>
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                )}

                {/* Owner info */}
                <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
                    <p className="text-[7px] text-white/30 font-bold uppercase tracking-widest mb-2">Propietario</p>
                    <p className="text-xs font-bold text-white">{property.owner}</p>
                    <p className="text-[9px] text-white/30 mt-0.5">{property.status} · {property.address.split(",").pop()?.trim()}</p>
                </div>
            </div>
        </div>
    );
}

/* ── Leads View ────────────────────────────────────────────── */
function LeadsView({ leads, newLeadId, onUpdateStatus, tier, isDarkMode }: {
    leads: LiveLead[];
    newLeadId?: string;
    onUpdateStatus: (id: string, s: string) => void;
    tier: string;
    isDarkMode: boolean;
}) {
    const isStarter = tier === "basico";
    const [upgradeAlert, setUpgradeAlert] = useState(false);

    const handleStageClick = (leadId: string, currentStatus: string) => {
        if (isStarter) {
            setUpgradeAlert(true);
            setTimeout(() => setUpgradeAlert(false), 3000);
            return;
        }

        // Cycle through statuses for demo simplicity
        const statuses = Object.keys(STATUS_MAP);
        const currentIndex = statuses.indexOf(currentStatus);
        const nextStatus = statuses[(currentIndex + 1) % statuses.length];
        onUpdateStatus(leadId, nextStatus);
    };

    return (
        <div className="space-y-3 relative">
            {/* Upgrade Alert Overlay */}
            <AnimatePresence>
                {upgradeAlert && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-x-0 top-0 z-50 flex justify-center py-4"
                    >
                        <div className="bg-cima-gold text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl flex items-center gap-2">
                            <Lock className="h-3 w-3" /> Función disponible en planes Pro / Team
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Pipeline summary */}
            <div className="grid grid-cols-5 gap-2 mb-4">
                {[
                    { id: "nuevo", label: "Nuevos", color: "bg-blue-500/20 border-blue-500/30 text-blue-400" },
                    { id: "contactado", label: "Contactados", color: "bg-yellow-500/20 border-yellow-500/30 text-yellow-400" },
                    { id: "calificado", label: "Calificados", color: "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" },
                    { id: "visita_agendada", label: "Visita", color: "bg-purple-500/20 border-purple-500/30 text-purple-400" },
                    { id: "en_negociacion", label: "Negociación", color: "bg-cima-gold/20 border-cima-gold/30 text-cima-gold" },
                ].map((stage, i) => {
                    const count = leads.filter(l => l.status === stage.id).length;
                    return (
                        <div key={i} className={`p-2 rounded-lg border flex flex-col items-center transition-all ${stage.color}`}>
                            <span className="text-[10px] font-black">{count}</span>
                            <span className="text-[7px] uppercase font-bold tracking-tighter opacity-70">{stage.label}</span>
                        </div>
                    );
                })}
            </div>

            {/* Leads list */}
            <div className="space-y-3">
                {leads.map((lead, i) => (
                    <motion.div
                        key={lead.id}
                        initial={lead.id === newLeadId ? { opacity: 0, scale: 0.9, y: -20 } : { opacity: 0, x: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                        transition={{ duration: 0.4, delay: lead.id === newLeadId ? 0 : i * 0.05 }}
                        className={`border rounded-2xl p-4 transition-all group ${lead.id === newLeadId ? "ring-2 ring-cima-gold ring-offset-4 ring-offset-black shadow-2xl shadow-cima-gold/20" : ""} ${isDarkMode ? "bg-white/[0.03] border-white/5 hover:border-white/10" : "bg-white border-gray-200 shadow-sm hover:shadow-md"}`}
                    >
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className={`h-10 w-10 border rounded-xl flex items-center justify-center font-black text-xs ${isDarkMode ? "bg-white/5 border-white/10 text-white" : "bg-gray-100 border-gray-200 text-gray-900"}`}>
                                    {lead.name.split(" ").map(n => n[0]).join("")}
                                    {lead.id === newLeadId && <span className="absolute -top-1 -right-1 h-3 w-3 bg-cima-gold rounded-full border-2 border-black animate-pulse" />}
                                </div>
                                <div>
                                    <h4 className={`text-sm font-bold group-hover:text-cima-gold transition-colors ${isDarkMode ? "text-white" : "text-gray-900"}`}>{lead.name}</h4>
                                    <p className={`text-[10px] ${isDarkMode ? "text-white/40" : "text-gray-500"}`}>{lead.property} · {lead.source}</p>
                                </div>
                            </div>

                            <div className="hidden md:flex flex-col items-end gap-1.5">
                                <div className={`px-2 py-1 rounded-lg border text-[8px] font-black uppercase tracking-wider ${STATUS_MAP[lead.status as keyof typeof STATUS_MAP]?.class ||
                                    (isDarkMode ? "bg-white/5 text-white/40 border-white/10" : "bg-gray-100 text-gray-600 border-gray-200")
                                    }`}>
                                    {STATUS_MAP[lead.status as keyof typeof STATUS_MAP]?.label || lead.status}
                                </div>
                                <span className={`text-[9px] font-mono ${isDarkMode ? "text-white/20" : "text-gray-400"}`}>{lead.date}</span>
                            </div>
                        </div>

                        <div className={`mt-4 pt-4 border-t flex items-center justify-between gap-4 ${isDarkMode ? "border-white/5" : "border-gray-100"}`}>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => handleStageClick(lead.id, lead.status)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-widest transition-all ${isDarkMode ? "bg-white/5 border-white/10 text-white/40 hover:text-white" : "bg-gray-50 border-gray-200 text-gray-500 hover:text-gray-900"}`}
                                >
                                    <Zap className="h-3 w-3" /> Avanzar Pipeline
                                </button>
                                <div className="flex gap-1">
                                    <div className={`p-1.5 border rounded-lg transition-all cursor-pointer ${isDarkMode ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-gray-50 border-gray-200 hover:bg-gray-100"}`}>
                                        <Phone className={`h-3 w-3 ${isDarkMode ? "text-white/30" : "text-gray-400"}`} />
                                    </div>
                                    <div className={`p-1.5 border rounded-lg transition-all cursor-pointer ${isDarkMode ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-gray-50 border-gray-200 hover:bg-gray-100"}`}>
                                        <Mail className={`h-3 w-3 ${isDarkMode ? "text-white/30" : "text-gray-400"}`} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-1.5">
                                <span className={`text-[10px] font-bold ${isDarkMode ? "text-cima-gold" : "text-cima-gold"}`}>ROI: $12k+</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

/* ── Visits View ───────────────────────────────────────────── */
function VisitsView({ isDarkMode }: { isDarkMode: boolean }) {
    const grouped: Record<string, typeof VISITS> = {};
    VISITS.forEach((v) => {
        if (!grouped[v.date]) grouped[v.date] = [];
        grouped[v.date].push(v);
    });

    const statusStyle: Record<string, string> = {
        confirmada: isDarkMode ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-green-50 text-green-700 border-green-200",
        pendiente: isDarkMode ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" : "bg-yellow-50 text-yellow-700 border-yellow-200",
        realizada: isDarkMode ? "bg-white/5 text-white/30 border-white/10" : "bg-gray-100 text-gray-500 border-gray-200",
        cancelada: isDarkMode ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-red-50 text-red-700 border-red-200",
    };

    return (
        <div className="space-y-6">
            {Object.entries(grouped).map(([date, visits], gi) => (
                <div key={date}>
                    <div className="flex items-center gap-2 mb-3 px-1">
                        <Calendar className="h-3.5 w-3.5 text-cima-gold" />
                        <span className={`text-xs font-black uppercase tracking-wider ${date === "Hoy" ? "text-cima-gold" : isDarkMode ? "text-white/30" : "text-gray-400"}`}>
                            {date}
                        </span>
                        {date === "Hoy" && (
                            <span className="text-[7px] font-bold bg-cima-gold/10 text-cima-gold px-2 py-0.5 rounded-full border border-cima-gold/20">
                                {visits.length} visitas
                            </span>
                        )}
                    </div>
                    <div className="space-y-2">
                        {visits.map((visit, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -15 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: gi * 0.1 + i * 0.06 }}
                                className={`border rounded-xl p-4 transition-all ${visit.status === "confirmada" || visit.status === "pendiente"
                                    ? isDarkMode ? "bg-white/[0.03] border-white/10 hover:border-cima-gold/30" : "bg-white border-gray-200 shadow-sm hover:border-cima-gold/40 hover:shadow-md"
                                    : isDarkMode ? "bg-white/[0.01] border-white/5 opacity-60" : "bg-gray-50 border-gray-100 opacity-60"
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-10 w-10 rounded-xl border flex flex-col items-center justify-center shrink-0 ${isDarkMode ? "bg-white/[0.05] border-white/10" : "bg-gray-100 border-gray-200"}`}>
                                            <Clock className="h-3 w-3 text-cima-gold mb-0.5" />
                                            <span className={`text-[8px] font-bold ${isDarkMode ? "text-white/60" : "text-gray-500"}`}>{visit.time?.split(" ")[0]}</span>
                                        </div>
                                        <div>
                                            <h4 className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{visit.prospect}</h4>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <div className="flex items-center gap-1 text-[9px] text-cima-gold/80 font-medium">
                                                    <MapPin className="h-2.5 w-2.5" />
                                                    <span className="truncate max-w-[120px]">{visit.property}</span>
                                                </div>
                                                <span className={`text-[9px] ${isDarkMode ? "text-white/20" : "text-gray-300"}`}>•</span>
                                                <span className={`text-[9px] ${isDarkMode ? "text-white/40" : "text-gray-500"}`}>{visit.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {visit.sentiment === "positive" && (
                                            <span className={`text-[7px] font-bold px-1.5 py-0.5 rounded-full border ${isDarkMode ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-green-50 text-green-700 border-green-200"
                                                }`}>
                                                ❤️ Le encantó
                                            </span>
                                        )}
                                        {visit.status && (
                                            <span className={`px-2 py-1 rounded-lg text-[7px] font-black uppercase tracking-wide border ${statusStyle[visit.status as keyof typeof statusStyle] || ""}`}>
                                                {visit.status}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ── Analytics View ────────────────────────────────────────── */
function AnalyticsView({ isDarkMode }: { isDarkMode: boolean }) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-1">
                <div>
                    <h3 className={`text-[14px] font-black uppercase tracking-tighter ${isDarkMode ? "text-white" : "text-gray-900"}`}>Reportes Elite</h3>
                    <p className={`text-[10px] font-medium ${isDarkMode ? "text-white/40" : "text-gray-500"}`}>Rendimiento histórico de su portafolio</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: "Ingresos mes", value: "$847K", change: "+23%", up: true },
                    { label: "Leads totales", value: "142", change: "+15%", up: true },
                    { label: "Visitas/Cierre", value: "12%", change: "-2%", up: false },
                    { label: "Retorno IA", value: "3.4x", change: "+0.8", up: true },
                ].map((stat, i) => (
                    <div key={i} className={`p-4 rounded-2xl border transition-all ${isDarkMode ? "bg-white/[0.03] border-white/5" : "bg-white border-gray-200 shadow-sm"}`}>
                        <p className={`text-[8px] font-black uppercase tracking-widest mb-1 ${isDarkMode ? "text-white/30" : "text-gray-400"}`}>{stat.label}</p>
                        <div className="flex items-end justify-between">
                            <h3 className="text-xl font-black font-heading tracking-tighter">{stat.value}</h3>
                            <span className={`text-[8px] font-bold ${stat.up ? "text-green-500" : "text-red-500"}`}>{stat.change}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`border rounded-xl p-5 ${isDarkMode ? "bg-white/[0.03] border-white/5" : "bg-white border-gray-200 shadow-sm"}`}>
                    <h3 className={`text-[9px] font-black uppercase tracking-wider mb-4 flex items-center gap-2 ${isDarkMode ? "text-white/40" : "text-gray-500"}`}>
                        <Eye className="h-3 w-3 text-cima-gold" /> Vistas por Propiedad
                    </h3>
                    <BarChart
                        data={[142, 89, 56, 34, 201]}
                        labels={["Misiones", "LOVFT", "Contry", "Valle P.", "Santa M."]}
                        isDarkMode={isDarkMode}
                    />
                </div>
                <div className={`border rounded-xl p-5 ${isDarkMode ? "bg-white/[0.03] border-white/5" : "bg-white border-gray-200 shadow-sm"}`}>
                    <h3 className={`text-[9px] font-black uppercase tracking-wider mb-4 flex items-center gap-2 ${isDarkMode ? "text-white/40" : "text-gray-500"}`}>
                        <Target className="h-3 w-3 text-cima-gold" /> Leads por Fuente
                    </h3>
                    <BarChart
                        data={[12, 8, 5, 3, 2]}
                        labels={["Instagram", "Marketplace", "Landing", "Referido", "Google"]}
                        isDarkMode={isDarkMode}
                    />
                </div>
            </div>

            {/* Source breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`col-span-1 md:col-span-2 p-6 rounded-3xl border ${isDarkMode ? "bg-white/[0.02] border-white/5" : "bg-white border-gray-100 shadow-sm"}`}>
                    <div className="flex items-center justify-between mb-6">
                        <p className={`text-[9px] font-black uppercase tracking-widest ${isDarkMode ? "text-white/30" : "text-gray-400"}`}>Alcance por Red Social</p>
                        <div className="flex gap-2">
                            <div className="flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-full bg-cima-gold" />
                                <span className={`text-[8px] font-bold ${isDarkMode ? "text-white/40" : "text-gray-500"}`}>Vistas</span>
                            </div>
                        </div>
                    </div>
                    <BarChart data={[45, 78, 92, 64, 88]} labels={["IG", "FB", "WEB", "TIK", "ADS"]} isDarkMode={isDarkMode} />
                </div>

                <div className={`p-6 rounded-3xl border ${isDarkMode ? "bg-white/[0.02] border-white/5" : "bg-white border-gray-100 shadow-sm"}`}>
                    <p className={`text-[9px] font-black uppercase tracking-widest mb-6 ${isDarkMode ? "text-white/30" : "text-gray-400"}`}>Eficiencia Legal</p>
                    <div className="space-y-5">
                        {[
                            { label: "Contratos generados", val: "12", pct: 85 },
                            { label: "Validación IA", val: "94%", pct: 94 },
                            { label: "Promedio cierre", val: "3 días", pct: 70 },
                        ].map((item, i) => (
                            <motion.div key={i} className="space-y-2">
                                <div className="flex justify-between text-[9px] font-bold">
                                    <span className={isDarkMode ? "text-white/40" : "text-gray-500"}>{item.label}</span>
                                    <span className={isDarkMode ? "text-white" : "text-gray-900"}>{item.val}</span>
                                </div>
                                <div className={`h-1 rounded-full overflow-hidden ${isDarkMode ? "bg-white/5" : "bg-gray-100"}`}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.pct}%` }}
                                        transition={{ delay: 0.3 + i * 0.08, duration: 0.6 }}
                                        className="h-full bg-gradient-to-r from-cima-gold/60 to-cima-gold rounded-full"
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            <div className={`border rounded-xl p-5 ${isDarkMode ? "bg-white/[0.03] border-white/5" : "bg-white border-gray-200 shadow-sm"}`}>
                <h3 className={`text-[9px] font-black uppercase tracking-wider mb-4 flex items-center gap-2 ${isDarkMode ? "text-white/40" : "text-gray-500"}`}>
                    <BarChart3 className="h-3 w-3 text-cima-gold" /> Rendimiento por propiedad
                </h3>
                <div className="space-y-3">
                    {PROPERTIES.map((prop, i) => {
                        const pct = Math.round((prop.hits / 201) * 100);
                        return (
                            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className={`text-[10px] font-bold ${isDarkMode ? "text-white/60" : "text-gray-700"}`}>{prop.name}</span>
                                    <span className={`text-[10px] font-mono ${isDarkMode ? "text-white/30" : "text-gray-400"}`}>{prop.hits} vistas</span>
                                </div>
                                <div className={`h-1.5 rounded-full overflow-hidden ${isDarkMode ? "bg-white/5" : "bg-gray-100"}`}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${pct}%` }}
                                        transition={{ delay: 0.3 + i * 0.08, duration: 0.6 }}
                                        className="h-full bg-gradient-to-r from-cima-gold/60 to-cima-gold rounded-full"
                                    />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// ── IA Studio View ────────────────────────────────────────── */
function IaStudioView({ isDarkMode }: { isDarkMode: boolean }) {
    const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "ready">("idle");
    const [mode, setMode] = useState<"clean" | "stage" | "remodel">("stage");
    const [progress, setProgress] = useState(0);

    const MODES = [
        { id: "clean", label: "Limpiar Espacio", icon: Sparkles, desc: "Elimina objetos y desorden" },
        { id: "stage", label: "Amueblar (Staging)", icon: Home, desc: "Añade muebles y decoración" },
        { id: "remodel", label: "Remodelar", icon: Wand2, desc: "Cambia acabados y estilo" },
    ];

    const handleProcess = () => {
        setStatus("processing");
        setProgress(0);
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setStatus("ready");
                    return 100;
                }
                return prev + 2;
            });
        }, 50);
    };

    const handleReset = () => {
        setStatus("idle");
        setProgress(0);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-1">
                <div>
                    <h3 className={`text-[14px] font-black uppercase tracking-tighter ${isDarkMode ? "text-white" : "text-gray-900"}`}>IA Studio</h3>
                    <p className={`text-[10px] font-medium ${isDarkMode ? "text-white/40" : "text-gray-500"}`}>Transformación de espacios en un clic</p>
                </div>
                {status === "ready" && (
                    <button
                        onClick={handleReset}
                        className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-[9px] font-bold transition-all ${isDarkMode ? "bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10" : "bg-gray-50 border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-100"}`}
                    >
                        <RotateCcw className="h-3 w-3" /> Reiniciar
                    </button>
                )}
            </div>

            {status === "idle" && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`aspect-video border border-dashed rounded-3xl flex flex-col items-center justify-center gap-4 group cursor-pointer transition-all ${isDarkMode ? "bg-white/[0.02] border-white/10 hover:bg-white/[0.04]" : "bg-gray-50 border-gray-300 hover:bg-gray-100"}`}
                    onClick={() => setStatus("uploading")}
                >
                    <div className={`h-16 w-16 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:text-cima-gold transition-all ${isDarkMode ? "bg-white/5 text-white/20" : "bg-white text-gray-300 shadow-sm"}`}>
                        <Upload className="h-8 w-8" />
                    </div>
                    <div className="text-center">
                        <p className={`text-xs font-bold ${isDarkMode ? "text-white/60" : "text-gray-500"}`}>Haz clic para subir una foto</p>
                        <p className={`text-[8px] uppercase font-black tracking-widest mt-1 ${isDarkMode ? "text-white/20" : "text-gray-400"}`}>Soporte: JPG, PNG · Max 10MB</p>
                    </div>
                </motion.div>
            )}

            {status === "uploading" && (
                <div className="space-y-6">
                    <div className={`aspect-video border rounded-3xl overflow-hidden relative ${isDarkMode ? "bg-white/[0.02] border-white/5" : "bg-gray-100 border-gray-200"}`}>
                        <img src="/cocina-antes.png" alt="Original" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-[8px] font-black text-white uppercase tracking-widest">Foto Original</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {MODES.map((m) => (
                            <button
                                key={m.id}
                                onClick={() => setMode(m.id as any)}
                                className={`p-4 rounded-2xl border transition-all text-left ${mode === m.id
                                    ? "bg-cima-gold/10 border-cima-gold shadow-lg shadow-cima-gold/5"
                                    : isDarkMode ? "bg-white/[0.02] border-white/5 hover:border-white/20" : "bg-white border-gray-200 hover:border-cima-gold/40 shadow-sm"
                                    }`}
                            >
                                <m.icon className={`h-5 w-5 mb-3 ${mode === m.id ? "text-cima-gold" : isDarkMode ? "text-white/40" : "text-gray-400"}`} />
                                <p className={`text-[11px] font-black mb-1 ${mode === m.id ? isDarkMode ? "text-white" : "text-gray-900" : isDarkMode ? "text-white/60" : "text-gray-600"}`}>{m.label}</p>
                                <p className={`text-[9px] leading-tight ${isDarkMode ? "text-white/30" : "text-gray-400"}`}>{m.desc}</p>
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleProcess}
                        className="w-full py-4 bg-cima-gold text-black rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-cima-gold/20"
                    >
                        <Sparkles className="h-4 w-4" /> Transformar con IA
                    </button>
                </div>
            )}

            {status === "processing" && (
                <div className="flex flex-col items-center justify-center py-12 space-y-6">
                    <div className="relative">
                        <div className={`h-24 w-24 rounded-full border-4 border-t-cima-gold animate-spin ${isDarkMode ? "border-white/5" : "border-gray-100"}`} />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Sparkles className="h-8 w-8 text-cima-gold animate-pulse" />
                        </div>
                    </div>
                    <div className="text-center">
                        <p className={`text-sm font-black uppercase tracking-tighter mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Procesando {mode === "clean" ? "Limpieza" : mode === "stage" ? "Amueblado" : "Remodelación"}</p>
                        <div className={`w-48 h-1.5 rounded-full overflow-hidden mx-auto ${isDarkMode ? "bg-white/5" : "bg-gray-100"}`}>
                            <motion.div
                                className="h-full bg-cima-gold"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className={`text-[10px] font-mono mt-3 uppercase tracking-widest ${isDarkMode ? "text-white/30" : "text-gray-400"}`}>Generando nuevas capas visuales...</p>
                    </div>
                </div>
            )}

            {status === "ready" && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4"
                >
                    <div className={`aspect-video border rounded-3xl overflow-hidden relative group ${isDarkMode ? "bg-white/5 border-white/10" : "bg-gray-100 border-gray-200"}`}>
                        <img src="/cocina-despues.png" alt="Result" className="w-full h-full object-cover" />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

                        <div className="absolute bottom-6 left-6 flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-cima-gold/10 flex items-center justify-center text-cima-gold shadow-lg shadow-cima-gold/5">
                                <ImageIcon className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-white uppercase tracking-widest">Resultado Final</p>
                                <p className="text-[8px] text-cima-gold/80 font-bold uppercase tracking-widest">Generado con Cima IA engine</p>
                            </div>
                        </div>

                        <div className="absolute top-6 right-6 flex items-center gap-2">
                            <div className="bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2">
                                <span className="text-[8px] font-black text-white/40 uppercase">IA Studio</span>
                                <div className="h-1 w-8 bg-cima-gold/30 rounded-full" />
                                <span className="text-[8px] font-black text-cima-gold uppercase">Éxito</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button className={`flex-1 py-3 border rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 ${isDarkMode ? "bg-white/5 border-white/10 text-white/60 hover:bg-white/10" : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"}`}>
                            <Download className="h-3 w-3" /> Descargar HD
                        </button>
                        <button className={`flex-1 py-3 border rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 ${isDarkMode ? "bg-white/5 border-white/10 text-white/60 hover:bg-white/10" : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"}`}>
                            <Share2 className="h-3 w-3" /> Compartir
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

/* ── Documents View ────────────────────────────────────────── */
function DocumentsView({ isDarkMode }: { isDarkMode: boolean }) {
    const [docs, setDocs] = useState([
        { id: 1, name: "Escritura_Residencia_Magnolia.pdf", type: "Escritura", date: "12/02/2026", status: "verificado", size: "4.2 MB" },
        { id: 2, name: "ID_Propietario_Vargas.jpg", type: "Identificación", date: "15/02/2026", status: "pendiente", size: "1.8 MB" },
        { id: 3, name: "Predial_2026_Pagado.pdf", type: "Impuestos", date: "18/02/2026", status: "advertencia", size: "0.9 MB" },
        { id: 4, name: "Contrato_Exclusividad_Cima.doc", type: "Contrato", date: "20/02/2026", status: "verificando", size: "2.1 MB" },
    ]);

    const [verifyingId, setVerifyingId] = useState<number | null>(null);

    const handleVerify = (id: number) => {
        setVerifyingId(id);
        // Simular proceso de IA
        setTimeout(() => {
            setDocs(prev => prev.map(d =>
                d.id === id ? { ...d, status: "verificado" } : d
            ));
            setVerifyingId(null);
        }, 3000);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-1">
                <div>
                    <h3 className={`text-[14px] font-black uppercase tracking-tighter ${isDarkMode ? "text-white" : "text-gray-900"}`}>Bóveda Digital</h3>
                    <p className={`text-[10px] font-medium ${isDarkMode ? "text-white/40" : "text-gray-500"}`}>Gestión documental con respaldo jurídico e IA</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-cima-gold text-black rounded-lg text-[9px] font-bold uppercase hover:bg-white transition-all shadow-lg">
                        <Plus className="h-3 w-3" /> Nuevo Documento
                    </button>
                </div>
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: "Integridad", val: "94%", color: "text-green-500" },
                    { label: "Pendientes", val: "2", color: "text-amber-500" },
                    { label: "Almacenado", val: "12.8 GB", color: isDarkMode ? "text-white/40" : "text-gray-400" },
                ].map((s, i) => (
                    <div key={i} className={`border p-3 rounded-2xl transition-all ${isDarkMode ? "bg-white/[0.02] border-white/5" : "bg-white border-gray-200 shadow-sm"}`}>
                        <p className={`text-[7px] font-black uppercase tracking-widest mb-1 ${isDarkMode ? "text-white/20" : "text-gray-400"}`}>{s.label}</p>
                        <p className={`text-sm font-black ${s.color}`}>{s.val}</p>
                    </div>
                ))}
            </div>

            {/* Document List */}
            <div className="space-y-2">
                {docs.map((doc, i) => (
                    <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`group flex items-center gap-4 p-4 border rounded-2xl transition-all ${isDarkMode
                            ? "bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]"
                            : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-md"
                            }`}
                    >
                        <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${doc.status === "verificado" ? "bg-green-500/10 text-green-500" :
                            doc.status === "advertencia" ? "bg-red-500/10 text-red-500" :
                                isDarkMode ? "bg-white/5 text-white/20" : "bg-gray-100 text-gray-300"
                            }`}>
                            <FileCheck className="h-5 w-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className={`text-[11px] font-bold truncate ${isDarkMode ? "text-white/90" : "text-gray-900"}`}>{doc.name}</span>
                                <span className={`text-[7px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest ${isDarkMode ? "bg-white/5 text-white/40" : "bg-gray-100 text-gray-500"}`}>{doc.type}</span>
                            </div>
                            <div className={`flex items-center gap-3 text-[9px] font-medium ${isDarkMode ? "text-white/25" : "text-gray-400"}`}>
                                <span>{doc.date}</span>
                                <span>•</span>
                                <span>{doc.size}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                            <div className="text-right">
                                {verifyingId === doc.id ? (
                                    <div className="flex items-center gap-2 text-cima-gold">
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                        <span className="text-[8px] font-black uppercase tracking-widest animate-pulse">Analizando IA...</span>
                                    </div>
                                ) : (
                                    <div className={`flex items-center gap-1.5 ${doc.status === "verificado" ? "text-green-500" :
                                        doc.status === "advertencia" ? "text-red-500" :
                                            isDarkMode ? "text-white/20" : "text-gray-300"
                                        }`}>
                                        {doc.status === "verificado" ? <ShieldCheck className="h-3.5 w-3.5" /> :
                                            doc.status === "advertencia" ? <ShieldAlert className="h-3.5 w-3.5" /> :
                                                <FileSearch className="h-3.5 w-3.5" />}
                                        <span className="text-[8px] font-black uppercase tracking-widest">
                                            {doc.status === "verificado" ? "Verificado" :
                                                doc.status === "advertencia" ? "Vencido" :
                                                    "Pendiente"}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {doc.status !== "verificado" && verifyingId !== doc.id && (
                                <button
                                    onClick={() => handleVerify(doc.id)}
                                    className="p-2 bg-cima-gold/10 border border-cima-gold/20 rounded-lg group-hover:bg-cima-gold group-hover:text-black transition-all text-cima-gold shadow-sm"
                                    title="Verificar con IA"
                                >
                                    <Sparkles className="h-3.5 w-3.5" />
                                </button>
                            )}

                            <button className={`p-2 border rounded-lg opacity-0 group-hover:opacity-100 transition-all ${isDarkMode ? "bg-white/5 border-white/5 text-white/40 hover:bg-white/10" : "bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100 hover:text-gray-600"}`}>
                                <ExternalLink className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* AI Trust Message */}
            <div className={`p-4 rounded-2xl border flex gap-3 ${isDarkMode ? "bg-cima-gold/5 border-cima-gold/20" : "bg-cima-gold/10 border-cima-gold/30 shadow-sm"}`}>
                <div className="h-8 w-8 rounded-lg bg-cima-gold flex items-center justify-center shrink-0 shadow-lg shadow-cima-gold/20">
                    <ShieldCheck className="h-4 w-4 text-black" />
                </div>
                <div>
                    <h4 className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Cima Legal Compliance · ON</h4>
                    <p className={`text-[9px] leading-relaxed font-medium ${isDarkMode ? "text-white/50" : "text-gray-600"}`}>Todos los documentos son analizados mediante **Integridad Biométrica** y **OCR Inteligente** para garantizar transacciones de ultra-lujo sin riesgos legales.</p>
                </div>
            </div>
        </div>
    );
}

/* ── Contract Generator View ───────────────────────────────── */
function ContractGeneratorView({ isMobilePreview, isDarkMode }: { isMobilePreview: boolean; isDarkMode: boolean }) {
    const [step, setStep] = useState<"select" | "data" | "generating" | "result">("select");
    const [template, setTemplate] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        propiedad: "Residencia Las Misiones",
        cliente: "Carlos Vargas",
        precio: "$12,500,000",
        comision: "5%",
        fecha: new Date().toLocaleDateString()
    });
    const [progress, setProgress] = useState(0);
    const [showPreview, setShowPreview] = useState(false);

    const TEMPLATES = [
        { id: "exclusividad", label: "Contrato de Exclusividad", icon: FileSignature, desc: "Para captación de propiedades Premium" },
        { id: "arrendamiento", label: "Contrato de Arrendamiento", icon: ScrollText, desc: "Renta residencial y comercial" },
        { id: "intencion", label: "Carta de Intención de Compra", icon: FilePenLine, desc: "Cierre rápido de ofertas" },
        { id: "aviso", label: "Aviso de Privacidad", icon: Briefcase, desc: "Cumplimiento legal de datos" },
    ];

    const handleGenerate = () => {
        setStep("generating");
        setProgress(0);
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setStep("result");
                    return 100;
                }
                return prev + 4;
            });
        }, 80);
    };

    const handleReset = () => {
        setStep("select");
        setTemplate(null);
        setProgress(0);
        setShowPreview(false);
    };

    if (showPreview) {
        const selectedT = TEMPLATES.find(t => t.id === template);
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[500px] border transition-all ${isDarkMode ? "bg-white border-white/10" : "bg-white border-gray-200 shadow-xl"}`}
            >
                <div className={`p-4 border-b flex items-center justify-between transition-all ${isDarkMode ? "bg-slate-50 border-slate-200" : "bg-gray-50 border-gray-100"}`}>
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-cima-gold flex items-center justify-center">
                            <FileText className="h-4 w-4 text-black" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-900 uppercase tracking-tighter shrink-0">Vista Previa: {selectedT?.label}</p>
                            <p className="text-[8px] text-slate-500 font-medium whitespace-nowrap">Documento generado por Cima Sign</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowPreview(false)}
                        className="h-8 w-8 rounded-full hover:bg-slate-200 flex items-center justify-center transition-all shrink-0"
                    >
                        <X className="h-4 w-4 text-slate-400" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 sm:p-12 bg-white space-y-8 select-none custom-scrollbar-light">
                    <div className="flex justify-between items-start border-b-2 border-slate-50 pb-8">
                        <div className="h-10 w-24 bg-cima-gold/10 rounded flex items-center justify-center border border-cima-gold/20">
                            <span className="text-[9px] font-heading font-black text-cima-gold italic uppercase">Cima Pro</span>
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] font-black uppercase text-slate-900">Folio: CS-2024-089</p>
                            <p className="text-[8px] text-slate-400">Fecha: {new Date().toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-center font-heading text-lg font-black text-slate-800 underline decoration-cima-gold/30 underline-offset-8 uppercase tracking-widest">{selectedT?.label}</h2>

                        <div className="space-y-4 text-slate-700 leading-relaxed text-[10px] text-justify font-heading">
                            <p>En la ciudad de Monterrey, Nuevo León, comparecen por una parte el <span className="text-slate-900 font-bold border-b border-cima-gold/40 px-1">{formData.cliente || "[Nombre del Cliente]"}</span> y por la otra parte <span className="text-slate-900 font-bold border-b border-cima-gold/40 px-1">CIMA PRO S.A. DE C.V.</span> representado por <span className="text-slate-900 font-bold border-b border-cima-gold/40 px-1">Asesor Elite</span>.</p>

                            <p>Las partes acuerdan establecer el precio de la operación en la cantidad de <span className="text-slate-900 font-bold border-b border-cima-gold/40 px-1">${formData.precio || "0.00"} MXN</span>, bajo los términos de exclusividad profesional para la propiedad <span className="text-slate-900 font-bold border-b border-cima-gold/40 px-1">{formData.propiedad || "la ubicación indicada"}</span>.</p>

                            <div className="p-4 bg-slate-50 border-l-4 border-cima-gold rounded-r-xl">
                                <p className="text-[8px] font-black uppercase text-slate-500 mb-1 italic">Cláusula de Honorarios</p>
                                <p className="font-bold text-slate-900">Se pacta una comisión del {formData.comision || "0"}% sobre el valor total de la transacción, pagadera al momento de la firma ante Fedatario Público.</p>
                            </div>

                            <p>Ambas partes manifiestan su conformidad y voluntad para la firma del presente instrumento digital, validado mediante la infraestructura tecnológica de Cima Sign...</p>
                        </div>
                    </div>

                    <div className="pt-12 grid grid-cols-2 gap-8 border-t border-slate-50 mt-12">
                        <div className="text-center space-y-2">
                            <div className="h-12 w-full bg-slate-50 rounded-lg border border-dashed border-slate-200 flex items-center justify-center">
                                <span className="text-[7px] text-slate-300 font-mono uppercase tracking-widest">Firma Cliente</span>
                            </div>
                            <p className="text-[8px] font-bold text-slate-900 uppercase truncate px-2">{formData.cliente || "EL CLIENTE"}</p>
                        </div>
                        <div className="text-center space-y-2">
                            <div className="h-12 w-full bg-cima-gold/5 rounded-lg border border-cima-gold/20 flex items-center justify-center relative overflow-hidden">
                                <Sparkles className="absolute -right-1 -bottom-1 h-8 w-8 text-cima-gold/10" />
                                <span className="text-[7px] text-cima-gold font-mono font-black uppercase tracking-tighter">CIMA SIGN</span>
                            </div>
                            <p className="text-[8px] font-bold text-slate-900 uppercase">CIMA PRO ELITE</p>
                        </div>
                    </div>
                </div>

                <div className={`p-4 border-t flex justify-end gap-3 transition-all ${isDarkMode ? "bg-slate-50 border-slate-200" : "bg-gray-50 border-gray-200"}`}>
                    <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase hover:bg-black transition-all flex items-center gap-2">
                        <Download className="h-3 w-3" /> Descargar PDF
                    </button>
                    <button className="px-4 py-2 bg-cima-gold text-black rounded-xl text-[10px] font-black uppercase hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-cima-gold/20">
                        <Send className="h-3 w-3" /> Enviar a Firma
                    </button>
                </div>
            </motion.div>
        );
    }
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-1">
                <div>
                    <h3 className={`text-[14px] font-black uppercase tracking-tighter ${isDarkMode ? "text-white" : "text-gray-900"}`}>Cima Legal Sign</h3>
                    <p className={`text-[10px] font-medium ${isDarkMode ? "text-white/40" : "text-gray-500"}`}>Generación y firma digital de contratos con validez legal</p>
                </div>
                {step !== "select" && (
                    <button
                        onClick={handleReset}
                        className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-[9px] font-bold transition-all ${isDarkMode ? "bg-white/5 border-white/10 text-white/60 hover:text-white" : "bg-gray-50 border-gray-200 text-gray-500 hover:text-gray-900"}`}
                    >
                        <RotateCcw className="h-3 w-3" /> Reiniciar
                    </button>
                )}
            </div>

            {step === "select" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {TEMPLATES.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => { setTemplate(t.id); setStep("data"); }}
                            className={`p-5 rounded-2xl border transition-all text-left group flex gap-4 ${isDarkMode ? "bg-white/[0.02] border-white/5 hover:border-cima-gold/40" : "bg-white border-gray-100 hover:border-cima-gold/40 shadow-sm"}`}
                        >
                            <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-all ${isDarkMode ? "bg-white/5 text-cima-gold" : "bg-gray-50 text-cima-gold"}`}>
                                <t.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <p className={`text-[11px] font-black mb-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>{t.label}</p>
                                <p className={`text-[9px] leading-tight ${isDarkMode ? "text-white/30" : "text-gray-400"}`}>{t.desc}</p>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {step === "data" && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-6 rounded-3xl border ${isDarkMode ? "bg-white/[0.02] border-white/5" : "bg-white border-gray-200 shadow-sm"}`}
                >
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="space-y-1.5">
                            <label className={`text-[8px] font-black uppercase tracking-widest ${isDarkMode ? "text-white/20" : "text-gray-400"}`}>Cliente</label>
                            <input
                                type="text"
                                value={formData.cliente}
                                onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                                className={`w-full bg-transparent border rounded-xl px-3 py-2 text-xs font-bold focus:border-cima-gold transition-all outline-none ${isDarkMode ? "border-white/10 text-white" : "border-gray-200 text-gray-900"}`}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className={`text-[8px] font-black uppercase tracking-widest ${isDarkMode ? "text-white/20" : "text-gray-400"}`}>Propiedad</label>
                            <input
                                type="text"
                                value={formData.propiedad}
                                onChange={(e) => setFormData({ ...formData, propiedad: e.target.value })}
                                className={`w-full bg-transparent border rounded-xl px-3 py-2 text-xs font-bold focus:border-cima-gold transition-all outline-none ${isDarkMode ? "border-white/10 text-white" : "border-gray-200 text-gray-900"}`}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className={`text-[8px] font-black uppercase tracking-widest ${isDarkMode ? "text-white/20" : "text-gray-400"}`}>Precio</label>
                            <input
                                type="text"
                                value={formData.precio}
                                onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                                className={`w-full bg-transparent border rounded-xl px-3 py-2 text-xs font-bold focus:border-cima-gold transition-all outline-none ${isDarkMode ? "border-white/10 text-white" : "border-gray-200 text-gray-900"}`}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className={`text-[8px] font-black uppercase tracking-widest ${isDarkMode ? "text-white/20" : "text-gray-400"}`}>Comisión</label>
                            <input
                                type="text"
                                value={formData.comision}
                                onChange={(e) => setFormData({ ...formData, comision: e.target.value })}
                                className={`w-full bg-transparent border rounded-xl px-3 py-2 text-xs font-bold focus:border-cima-gold transition-all outline-none ${isDarkMode ? "border-white/10 text-white" : "border-gray-200 text-gray-900"}`}
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        className="w-full py-4 bg-cima-gold text-black rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-cima-gold/20"
                    >
                        <Zap className="h-4 w-4" /> Generar Documento Legal
                    </button>
                </motion.div>
            )}

            {step === "generating" && (
                <div className="flex flex-col items-center justify-center py-12 space-y-6">
                    <div className="relative">
                        <div className={`h-20 w-20 rounded-full border-4 border-t-cima-gold animate-spin ${isDarkMode ? "border-white/5" : "border-gray-100"}`} />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <FileSignature className="h-6 w-6 text-cima-gold animate-pulse" />
                        </div>
                    </div>
                    <div className="text-center">
                        <p className={`text-sm font-black uppercase tracking-tighter mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Redactando con IA Jurídica</p>
                        <div className={`w-40 h-1 rounded-full overflow-hidden mx-auto ${isDarkMode ? "bg-white/5" : "bg-gray-100"}`}>
                            <motion.div
                                className="h-full bg-cima-gold"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className={`text-[9px] font-mono mt-3 uppercase tracking-widest ${isDarkMode ? "text-white/30" : "text-gray-400"}`}>{progress}% - Validando cláusulas...</p>
                    </div>
                </div>
            )}

            {step === "result" && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-6 rounded-3xl border flex flex-col items-center text-center gap-4 ${isDarkMode ? "bg-white/[0.04] border-cima-gold/20" : "bg-cima-gold/5 border-cima-gold/20"}`}
                >
                    <div className="h-16 w-16 rounded-full bg-cima-gold flex items-center justify-center text-black shadow-lg shadow-cima-gold/30">
                        <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <div>
                        <p className={`text-base font-black uppercase tracking-tighter ${isDarkMode ? "text-white" : "text-gray-900"}`}>Contrato Listo para Firma</p>
                        <p className={`text-[10px] ${isDarkMode ? "text-white/40" : "text-gray-500"}`}>El documento ha sido validado jurídicamente mediante Cima IA.</p>
                    </div>
                    <div className="flex gap-2 w-full max-w-sm mt-2">
                        <button
                            onClick={() => setShowPreview(true)}
                            className={`flex-1 py-3 border rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 ${isDarkMode ? "bg-white/5 border-white/10 text-white hover:bg-white/10" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"}`}
                        >
                            <Eye className="h-3 w-3" /> Ver Vista Previa
                        </button>
                        <button className="flex-1 py-3 bg-cima-gold text-black rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 hover:scale-[1.02] shadow-lg shadow-cima-gold/20">
                            <Send className="h-3 w-3" /> Enviar a Cliente
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

/* ── Messages View ─────────────────────────────────────────── */
/* ── Typing Indicator ─────────────────────────────────────── */
function TypingIndicator() {
    return (
        <div className="flex gap-1 items-center px-1 py-2">
            <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 0.6 }}
                className="h-1 w-1 rounded-full bg-cima-gold"
            />
            <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                className="h-1 w-1 rounded-full bg-cima-gold"
            />
            <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                className="h-1 w-1 rounded-full bg-cima-gold"
            />
        </div>
    );
}

/* ── Messages View ─────────────────────────────────────────── */
function MessagesView({ messages, isDarkMode }: { messages: LiveMessage[]; isDarkMode: boolean }) {
    const [isNurturing, setIsNurturing] = useState(false);
    const [nurtureStep, setNurtureStep] = useState(0);
    const [isTyping, setIsTyping] = useState(false);

    const startNurtureSimulation = () => {
        setIsNurturing(true);
        setNurtureStep(0);
        setIsTyping(true);

        // Step 1: Typing -> Message 1
        setTimeout(() => {
            setIsTyping(false);
            setNurtureStep(1);
        }, 2000);

        // Step 2: Delay -> Typing -> Message 2
        setTimeout(() => {
            setIsTyping(true);
        }, 4000);

        setTimeout(() => {
            setIsTyping(false);
            setNurtureStep(2);
        }, 6000);

        // Step 3: Success
        setTimeout(() => setNurtureStep(3), 8000);

        setTimeout(() => {
            setIsNurturing(false);
            setNurtureStep(0);
        }, 11000);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-2 px-1">
                <h3 className={`font-heading text-[18px] font-black tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}>Bandeja de Entrada</h3>
                <div className="flex gap-2">
                    <button
                        onClick={startNurtureSimulation}
                        disabled={isNurturing}
                        className={`px-3 py-1.5 rounded-full flex items-center gap-2 text-[8px] font-black uppercase tracking-widest transition-all ${isNurturing ? "bg-cima-gold/50 text-black animate-pulse cursor-not-allowed" : "bg-cima-gold text-black hover:bg-white shadow-lg shadow-cima-gold/20"}`}
                    >
                        <Sparkles className="h-3 w-3" />
                        {isNurturing ? "Nutriendo Lead..." : "Simular Nutrición IA"}
                    </button>
                    <span className={`px-3 py-1.5 rounded-full border text-[8px] font-black uppercase tracking-widest ${isDarkMode ? "bg-white/5 border-white/10 text-white/40" : "bg-gray-100 border-gray-200 text-gray-400"
                        }`}>
                        {messages.filter(m => m.unread).length} No leídos
                    </span>
                </div>
            </div>

            {/* AI Nurture Simulator Banner */}
            <AnimatePresence>
                {isNurturing && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -20, height: 0 }}
                        className="bg-cima-gold/10 border border-cima-gold/30 rounded-2xl p-6 overflow-hidden relative group"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Sparkles className="h-20 w-20 text-cima-gold" />
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="h-10 w-10 rounded-full bg-cima-gold flex items-center justify-center shadow-lg shadow-cima-gold/40 shrink-0">
                                <Zap className="h-5 w-5 text-black animate-pulse" />
                            </div>
                            <div className="flex-1 space-y-3">
                                <div>
                                    <h4 className={`font-heading font-bold text-sm ${isDarkMode ? "text-white" : "text-gray-900"}`}>Cima AI Nurture en Proceso</h4>
                                    <p className={`text-[10px] font-medium ${isDarkMode ? "text-cima-gold/60" : "text-cima-gold"}`}>Automatizando el cierre con Roberto G.</p>
                                </div>

                                <div className="space-y-2">
                                    {isTyping && <TypingIndicator />}
                                    <div className={`p-3 rounded-xl rounded-tl-none border transition-all duration-500 ${nurtureStep >= 1 ? "bg-white/10 border-white/20 opacity-100" : "opacity-0 absolute pointer-events-none"}`}>
                                        <p className={`text-[11px] italic ${isDarkMode ? "text-white/80" : "text-gray-700"}`}>"Hola Roberto, vi que te interesó el Penthouse. El asesor está en camino a una firma, ¿te gustaría que te agende una visita hoy mismo?"</p>
                                    </div>
                                    <div className={`p-3 rounded-xl rounded-tr-none border ml-auto max-w-[80%] transition-all duration-500 ${nurtureStep >= 2 ? "bg-cima-gold/20 border-cima-gold/40 opacity-100 translate-x-0" : "opacity-0 translate-x-4 absolute pointer-events-none"}`}>
                                        <p className="text-[11px] text-cima-gold font-bold">"¡Excelente! A las 5:00 PM me queda perfecto."</p>
                                    </div>
                                    <div className={`p-3 rounded-xl rounded-tl-none border bg-green-500/20 border-green-500/40 transition-all duration-500 ${nurtureStep >= 3 ? "opacity-100" : "opacity-0 absolute pointer-events-none"}`}>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-3 w-3 text-green-500" />
                                            <p className="text-[11px] text-green-500 font-black uppercase">¡Cita Agendada y sincronizada!</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid gap-3">
                {messages.map((msg, i) => (
                    <motion.div
                        key={msg.id || i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className={`p-5 rounded-2xl transition-all cursor-pointer group shadow-2xl shadow-black/20 ${msg.unread
                            ? "bg-cima-gold/[0.03] border border-cima-gold/20 hover:border-cima-gold/40"
                            : isDarkMode ? "bg-white/[0.02] border border-white/5 hover:border-white/10 opacity-70" : "bg-gray-50 border-gray-100 hover:border-gray-200 opacity-70"
                            }`}
                    >
                        <div className="flex items-start gap-4">
                            <div className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${msg.unread ? "bg-cima-gold text-black" : "bg-white/5 text-white/20"}`}>
                                {msg.isAi ? <Sparkles className="h-5 w-5" /> : <span className="text-sm font-bold">{msg.from.charAt(0)}</span>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1.5">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[13px] font-bold ${msg.unread ? (isDarkMode ? "text-white" : "text-gray-900") : (isDarkMode ? "text-white/50" : "text-gray-400")}`}>{msg.from}</span>
                                        {msg.isAi && <span className="text-[8px] font-black text-cima-gold uppercase bg-cima-gold/10 px-2 py-0.5 rounded border border-cima-gold/20">Cima AI</span>}
                                    </div>
                                    <span className={`text-[9px] font-medium whitespace-nowrap ${isDarkMode ? "text-white/20" : "text-gray-300"}`}>{msg.time}</span>
                                </div>
                                <p className={`text-[12px] leading-relaxed line-clamp-2 ${msg.unread ? (isDarkMode ? "text-white/70 font-medium" : "text-gray-600 font-medium") : (isDarkMode ? "text-white/30" : "text-gray-400")}`}>{msg.message}</p>
                            </div>
                            {msg.unread && (
                                <div className="flex flex-col items-center gap-3 mt-1">
                                    <div className="h-2.5 w-2.5 rounded-full bg-cima-gold shadow-[0_0_12px_rgba(200,169,110,1)]" />
                                    {msg.isAi && <Zap className="h-3 w-3 text-cima-gold animate-pulse" />}
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
