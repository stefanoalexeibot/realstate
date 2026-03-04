"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
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
    Smartphone, Monitor
} from "lucide-react";
import NextImage from "next/image";
import type { PlanConfig } from "@/lib/config/demo-plans";
import { type LiveLead, type LiveMessage } from "./LiveDemoClient";

/* --- Types ------------------------------------------------------------------------------------------------------ */
type SidebarTab = "propiedades" | "leads" | "visitas" | "analiticos" | "mensajes" | "ia_studio" | "documentos" | "contratos";

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
    notificationsMuted?: boolean;
}

/* --- Mock Data ------------------------------------------------------------------------------------------------- */
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

/* --- Mini Sparkline ------------------------------------------------------------------------------------------ */
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

/* --------- Animated Counter --------------------------------------------------------------------------------------------------------------------- */
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

/* --------- Rotating Notification Toast ------------------------------------------------------------------------------------ */
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

/* --------- Bar Chart Component ------------------------------------------------------------------------------------------------------------ */
function BarChart({ data, labels }: { data: number[]; labels: string[] }) {
    const max = Math.max(...data);
    return (
        <div className="flex items-end gap-2 h-32">
            {data.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[8px] text-white/40 font-mono">{v}</span>
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(v / max) * 100}%` }}
                        transition={{ delay: i * 0.08, duration: 0.5 }}
                        className="w-full bg-gradient-to-t from-cima-gold/40 to-cima-gold rounded-t-lg min-h-[4px]"
                    />
                    <span className="text-[7px] text-white/30 font-bold uppercase">{labels[i]}</span>
                </div>
            ))}
        </div>
    );
}

/* === MAIN COMPONENT ========================================================================================= */
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
    notificationsMuted
}: DemoAdminLiveProps) {
    const f = plan.features.admin;
    const [activeTab, setActiveTab] = useState<SidebarTab>("propiedades");
    const [isMobilePreview, setIsMobilePreview] = useState(false);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);

    // Live leads counter
    const [liveLeadBonus, setLiveLeadBonus] = useState(0);
    const [flashLead, setFlashLead] = useState(false);

    useEffect(() => {
        const id = setInterval(() => {
            setLiveLeadBonus(b => b + 1);
            setFlashLead(true);
            setTimeout(() => setFlashLead(false), 2000);
        }, 30000);
        return () => clearInterval(id);
    }, []);

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
    const [liveProperties, setLiveProperties] = useState(PROPERTIES);
    const visibleProps = liveProperties.slice(0, maxProps);
    const canEdit = plan.tier === "profesional" || plan.tier === "premium";
    const [selectedProperty, setSelectedProperty] = useState<number | null>(null);
    const [showNewPropWizard, setShowNewPropWizard] = useState(false);
    const [newPropHighlight, setNewPropHighlight] = useState<number | null>(null);

    const PLAN_LABELS: Record<string, string> = {
        basico: "Starter",
        profesional: "Professional",
        premium: "Team / Agency",
    };

    const navItems: { id: SidebarTab; icon: React.ElementType; label: string; badge?: string; locked: boolean }[] = [
        { id: "propiedades", icon: Layout, label: "Propiedades", locked: false },
        { id: "leads", icon: Users, label: "Leads", badge: "7", locked: false },
        { id: "visitas", icon: Target, label: "Visitas", badge: "2", locked: !f.visits },
        { id: "analiticos", icon: TrendingUp, label: "Anal-ticos", locked: !f.analytics },
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
            { label: "Conversi-n", value: "0.8%", change: "+0.2%", icon: TrendingUp, data: [0.4, 0.5, 0.6, 0.5, 0.7, 0.7, 0.8] },
        ],
        profesional: [
            { label: "Vistas Totales", value: "589", change: "+8%", icon: Eye, data: [100, 120, 110, 150, 140, 170, 190] },
            { label: "Leads Activos", value: "12", change: "+3", icon: Users, data: [4, 6, 5, 8, 7, 10, 12] },
            { label: "Visitas Mes", value: "8", change: "+2", icon: Target, data: [2, 3, 3, 5, 4, 6, 8] },
            { label: "Conversi-n", value: "2.1%", change: "+0.5%", icon: TrendingUp, data: [1.2, 1.4, 1.6, 1.5, 1.8, 1.9, 2.1] },
        ],
        premium: [
            { label: "Vistas Totales", value: "1247", change: "+12%", icon: Eye, data: [180, 220, 195, 310, 280, 350, 420] },
            { label: "Leads Activos", value: "23", change: "+5", icon: Users, data: [8, 10, 12, 15, 14, 18, 23] },
            { label: "Visitas Mes", value: "18", change: "+3", icon: Target, data: [5, 7, 6, 9, 11, 14, 18] },
            { label: "Conversi-n", value: "4.2%", change: "+0.8%", icon: TrendingUp, data: [2.1, 2.5, 3.0, 2.8, 3.4, 3.8, 4.2] },
        ]
    };

    const STATS = tierStats[plan.tier] || tierStats.premium;

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-white">
            <div className="flex">
                {/* ------ Sidebar --------------------------------------------------------------------------------------------- */}
                <div className="hidden lg:flex flex-col w-56 min-h-screen border-r border-white/5 bg-black/40 p-5">
                    <div className="flex items-center gap-2.5 mb-10">
                        <div className="h-8 w-8 rounded-lg bg-cima-gold flex items-center justify-center shadow-lg shadow-cima-gold/20">
                            <Layout className="h-4 w-4 text-black" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-wider text-white">
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
                                    ? "text-white/10 cursor-not-allowed"
                                    : activeTab === item.id
                                        ? "bg-cima-gold/10 text-cima-gold border border-cima-gold/20"
                                        : "text-white/30 hover:bg-white/[0.03] hover:text-white/60"
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
                        <p className="text-[7px] text-white/40 font-mono">{visibleProps.length}/{maxProps === PROPERTIES.length ? "---" : maxProps}</p>
                    </div>
                </div>

                {/* ------ Main Content Area (Wrappable for Mobile) --------------------------------- */}
                <div className={`flex-1 transition-all duration-700 flex flex-col items-center ${isMobilePreview ? "py-10 bg-[#050505]" : "p-0"}`}>
                    <motion.div
                        layout
                        initial={false}
                        animate={{
                            width: isMobilePreview ? 375 : "100%",
                            height: isMobilePreview ? 760 : "auto",
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
                                    <h1 className={`font-heading font-black tracking-tight mb-1 transition-all ${isMobilePreview ? "text-lg" : "text-2xl"}`}>
                                        {activeTab === "propiedades" && "Mis Propiedades"}
                                        {activeTab === "leads" && "Leads Recientes"}
                                        {activeTab === "visitas" && "Agenda de Visitas"}
                                        {activeTab === "analiticos" && "Anal-ticos"}
                                        {activeTab === "mensajes" && "Mensajes"}
                                        {activeTab === "ia_studio" && "IA Studio"}
                                        {activeTab === "documentos" && "Documentos"}
                                        {activeTab === "contratos" && "Contratos"}
                                    </h1>
                                    <p className="text-xs text-white/40">
                                        {activeTab === "propiedades" && <>Gestionando <span className="text-white font-bold">{visibleProps.length} activos</span>{maxProps < PROPERTIES.length && <span className="text-white/20"> - L-mite: {maxProps}</span>}</>}
                                        {activeTab === "leads" && <>Tienes <span className="text-white font-bold">7 leads</span> esta semana</>}
                                        {activeTab === "visitas" && <>Pr-ximas <span className="text-white font-bold">4 visitas</span> esta semana</>}
                                        {activeTab === "analiticos" && <>Rendimiento de los <span className="text-white font-bold">-ltimos 30 d-as</span></>}
                                        {activeTab === "mensajes" && <><span className="text-white font-bold">{messages.filter(m => m.unread).length} sin leer</span> - {messages.length} conversaciones</>}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-2 pr-2 border-r border-white/10">
                                        <div className="relative p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all cursor-pointer">
                                            <Bell className="h-3.5 w-3.5 text-white/40" />
                                            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[7px] font-black text-white flex items-center justify-center">5</span>
                                            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 animate-ping opacity-30" />
                                        </div>

                                        {/* Mobile Preview Toggle */}
                                        <button
                                            onClick={() => setIsMobilePreview(!isMobilePreview)}
                                            className={`p-2.5 border rounded-xl transition-all flex items-center gap-2 group ${isMobilePreview ? "bg-cima-gold border-cima-gold text-black shadow-lg shadow-cima-gold/20" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white"}`}
                                            title={isMobilePreview ? "Volver a Escritorio" : "Ver en M-vil"}
                                        >
                                            {isMobilePreview ? <Monitor className="h-3.5 w-3.5" /> : <Smartphone className="h-3.5 w-3.5" />}
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-2 px-1">
                                        {/* Checkout / Close Sale Button */}
                                        <button
                                            onClick={() => setShowCheckoutModal(true)}
                                            className="flex items-center gap-2 bg-cima-gold text-black px-4 py-2.5 rounded-xl hover:bg-white transition-all shadow-lg shadow-cima-gold/20 active:scale-95 shrink-0"
                                        >
                                            <Zap className="h-3.5 w-3.5 fill-black" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Cerrar Venta</span>
                                        </button>

                                        <button className="flex items-center gap-2 bg-white/10 text-white px-4 py-2.5 rounded-xl hover:bg-white/20 transition-all border border-white/10 shrink-0">
                                            <Plus className="h-3.5 w-3.5" />
                                            <span className="text-[9px] font-bold uppercase tracking-widest hidden sm:inline">Nueva</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Analytics Row --- always visible */}
                            <div className={`grid transition-all duration-500 ${isMobilePreview ? "grid-cols-1 gap-2" : "grid-cols-2 md:grid-cols-4 gap-3"} mb-8`} key={plan.tier}>
                                {STATS.map((stat, i) => {
                                    const isLeads = stat.label === "Leads Activos";
                                    const displayValue = isLeads && liveLeadBonus > 0
                                        ? String(parseInt(stat.value) + liveLeadBonus)
                                        : stat.value;
                                    return (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className={`border rounded-2xl hover:border-cima-gold/20 transition-all shadow-2xl shadow-black/40 ${isMobilePreview ? "p-3" : "p-4"} ${isLeads && flashLead
                                                ? "bg-green-500/5 border-green-500/40 ring-2 ring-green-500/20"
                                                : "bg-white/[0.03] border-white/5 hover:bg-white/[0.05]"
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <stat.icon className="h-3.5 w-3.5 text-cima-gold/40" />
                                                <div className="flex items-center gap-1">
                                                    {isLeads && liveLeadBonus > 0 && (
                                                        <span className="flex items-center gap-0.5 text-[7px] font-black text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded-full">
                                                            <span className="h-1 w-1 rounded-full bg-green-400 animate-pulse inline-block" />
                                                            +{liveLeadBonus} en vivo
                                                        </span>
                                                    )}
                                                    <span className="text-[8px] font-bold text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded-full">{stat.change}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-end justify-between gap-2">
                                                <div>
                                                    <div className={`font-heading font-black text-white ${isMobilePreview ? "text-base" : "text-xl"}`}>
                                                        <Counter
                                                            value={displayValue}
                                                            suffix={stat.label === "Conversi-n" ? "%" : ""}
                                                        />
                                                    </div>
                                                    <p className="text-[8px] text-white/30 uppercase font-black tracking-widest">{stat.label}</p>
                                                </div>
                                                {!isMobilePreview && <MiniChart data={stat.data} />}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* ------ Tab Content ------------------------------------------------------------------------ */}
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
                                            />
                                        ) : (
                                            <PropertiesView
                                                properties={visibleProps}
                                                canEdit={canEdit}
                                                onSelect={(i) => setSelectedProperty(i)}
                                                plan={plan}
                                                onNewProperty={() => setShowNewPropWizard(true)}
                                                highlightId={newPropHighlight}
                                            />
                                        )
                                    )}
                                    {activeTab === "leads" && (
                                        <LeadsView
                                            leads={leads}
                                            newLeadId={newLeadId}
                                            onUpdateStatus={onUpdateLeadStatus}
                                            tier={plan.tier}
                                        />
                                    )}
                                    {activeTab === "visitas" && !navItems.find(n => n.id === "visitas")?.locked && <VisitsView />}
                                    {activeTab === "analiticos" && !navItems.find(n => n.id === "analiticos")?.locked && <AnalyticsView />}
                                    {activeTab === "mensajes" && !navItems.find(n => n.id === "mensajes")?.locked && <MessagesView messages={messages} />}
                                    {activeTab === "ia_studio" && !navItems.find(n => n.id === "ia_studio")?.locked && <IaStudioView />}
                                    {activeTab === "documentos" && !navItems.find(n => n.id === "documentos")?.locked && <DocumentsView />}
                                    {activeTab === "contratos" && !navItems.find(n => n.id === "contratos")?.locked && <ContractGeneratorView isMobilePreview={isMobilePreview} />}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </div>

            {!notificationsMuted && (
                <RotatingToast onClick={() => {
                    setActiveTab("leads");
                    if (onNavigateToLeads) onNavigateToLeads();
                }} />
            )}

            <CheckoutModal
                isOpen={showCheckoutModal}
                onClose={() => setShowCheckoutModal(false)}
            />

            {showNewPropWizard && (
                <NewPropertyWizard
                    onClose={() => setShowNewPropWizard(false)}
                    onPublish={(newProp) => {
                        setLiveProperties(prev => [newProp, ...prev]);
                        setNewPropHighlight(0);
                        setTimeout(() => setNewPropHighlight(null), 4000);
                    }}
                />
            )}
        </div>
    );
}

/* ------ New Property Wizard --------------------------------------------------------------------------------------------- */
const PROP_PHOTOS = ["/cocina-despues.png", "/estancia-despues.png", "/recamara-despues.png"];
const AMENITY_LIST = ["Alberca", "Jardín", "Gimnasio", "Roof Garden", "Seguridad 24h", "Cuarto de Servicio", "Vista Panorámica", "Elevador", "Bodega", "Estudio", "Cocina Integral", "Smart Home"];
const PROP_TYPES = [{ label: "Casa", icon: "🏠" }, { label: "Depto", icon: "🏢" }, { label: "Local", icon: "🏪" }, { label: "Terreno", icon: "🌿" }];
const OP_TYPES = ["Venta", "Renta", "Exclusiva"];

function NewPropertyWizard({ onClose, onPublish }: { onClose: () => void; onPublish: (prop: (typeof PROPERTIES)[0]) => void }) {
    const [step, setStep] = useState(1);
    const [propType, setPropType] = useState("Casa");
    const [opType, setOpType] = useState("Venta");
    const [precio, setPrecio] = useState("6,500,000");
    const [nombre, setNombre] = useState("Residencia Valle Oriente");
    const [direccion, setDireccion] = useState("Valle Oriente 120, San Pedro G.G.");
    const [recamaras, setRecamaras] = useState(3);
    const [banos, setBanos] = useState(2);
    const [estacionamientos, setEstacionamientos] = useState(2);
    const [m2, setM2] = useState("180");
    const [descripcion, setDescripcion] = useState("Hermosa residencia con acabados de primera y vista panorámica. Ideal para familia en zona premium.");
    const [amenities, setAmenities] = useState<string[]>(["Alberca", "Jardín", "Seguridad 24h"]);
    const [publishStage, setPublishStage] = useState(0);
    const [published, setPublished] = useState(false);

    const STAGES = ["Preparando datos...", "Generando landing page...", "Activando IA Cima...", "¡Publicado!"];

    const toggleAmenity = (a: string) => {
        setAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
    };

    const startPublish = () => {
        setStep(4);
        setPublishStage(0);
        let stage = 0;
        const iv = setInterval(() => {
            stage++;
            setPublishStage(stage);
            if (stage >= 3) {
                clearInterval(iv);
                setTimeout(() => setPublished(true), 400);
            }
        }, 500);
    };

    const Stepper = ({ label, value, onDec, onInc, min, max }: { label: string; value: number; onDec: () => void; onInc: () => void; min: number; max: number }) => (
        <div className="space-y-1.5">
            <label className="text-[8px] font-black text-white/20 uppercase tracking-widest">{label}</label>
            <div className="flex items-center gap-2 bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2">
                <button onClick={onDec} disabled={value <= min} className="h-6 w-6 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 disabled:opacity-30 transition-all font-black text-sm">−</button>
                <span className="flex-1 text-center text-xs font-black text-white">{value}</span>
                <button onClick={onInc} disabled={value >= max} className="h-6 w-6 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 disabled:opacity-30 transition-all font-black text-sm">+</button>
            </div>
        </div>
    );

    const randomPhoto = PROP_PHOTOS[Math.floor(Math.random() * PROP_PHOTOS.length)];

    return (
        <div
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-lg flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-[#0F0F10] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-tighter">Nueva Propiedad</h3>
                        {step < 4 && <p className="text-[9px] text-white/30 mt-0.5">Paso {step} de 3</p>}
                    </div>
                    <button onClick={onClose} className="h-8 w-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-all">
                        <X className="h-4 w-4 text-white/40" />
                    </button>
                </div>

                {/* Step indicator */}
                {step < 4 && (
                    <div className="flex gap-1 px-6 pt-4">
                        {[1, 2, 3].map(s => (
                            <div key={s} className={`h-1 flex-1 rounded-full transition-all ${s <= step ? "bg-cima-gold" : "bg-white/10"}`} />
                        ))}
                    </div>
                )}

                {/* Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                                <div>
                                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-3">Tipo de Propiedad</p>
                                    <div className="grid grid-cols-4 gap-2">
                                        {PROP_TYPES.map(({ label, icon }) => (
                                            <button key={label} onClick={() => setPropType(label)}
                                                className={`py-3 rounded-xl border text-center transition-all ${propType === label ? "border-cima-gold bg-cima-gold/10 text-cima-gold" : "border-white/10 bg-white/[0.03] text-white/40 hover:border-white/20"}`}>
                                                <div className="text-lg mb-1">{icon}</div>
                                                <div className="text-[9px] font-black">{label}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-3">Operación</p>
                                    <div className="flex gap-2">
                                        {OP_TYPES.map(op => (
                                            <button key={op} onClick={() => setOpType(op)}
                                                className={`flex-1 py-2.5 rounded-xl border text-[10px] font-black transition-all ${opType === op ? "border-cima-gold bg-cima-gold text-black" : "border-white/10 text-white/40 hover:border-white/20"}`}>
                                                {op}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-2">Precio (MXN)</p>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cima-gold font-black text-sm">$</span>
                                        <input value={precio} onChange={e => setPrecio(e.target.value)}
                                            className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 pl-7 text-sm font-black text-white focus:border-cima-gold/50 transition-all outline-none" />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[8px] font-black text-white/20 uppercase tracking-widest">Nombre de la Propiedad</label>
                                    <input value={nombre} onChange={e => setNombre(e.target.value)}
                                        className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-cima-gold/50 transition-all outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[8px] font-black text-white/20 uppercase tracking-widest">Dirección</label>
                                    <input value={direccion} onChange={e => setDireccion(e.target.value)}
                                        className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-cima-gold/50 transition-all outline-none" />
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <Stepper label="Recámaras" value={recamaras} min={1} max={6} onDec={() => setRecamaras(v => Math.max(1, v - 1))} onInc={() => setRecamaras(v => Math.min(6, v + 1))} />
                                    <Stepper label="Baños" value={banos} min={1} max={5} onDec={() => setBanos(v => Math.max(1, v - 1))} onInc={() => setBanos(v => Math.min(5, v + 1))} />
                                    <Stepper label="Estac." value={estacionamientos} min={0} max={4} onDec={() => setEstacionamientos(v => Math.max(0, v - 1))} onInc={() => setEstacionamientos(v => Math.min(4, v + 1))} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[8px] font-black text-white/20 uppercase tracking-widest">M² Construidos</label>
                                    <input value={m2} onChange={e => setM2(e.target.value)}
                                        className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-cima-gold/50 transition-all outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[8px] font-black text-white/20 uppercase tracking-widest">Descripción</label>
                                    <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} rows={3}
                                        className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-cima-gold/50 transition-all outline-none resize-none" />
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                                <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Selecciona las amenidades</p>
                                <div className="grid grid-cols-3 gap-2">
                                    {AMENITY_LIST.map(a => (
                                        <button key={a} onClick={() => toggleAmenity(a)}
                                            className={`py-2.5 px-2 rounded-xl border text-[9px] font-bold transition-all text-center ${amenities.includes(a) ? "border-cima-gold bg-cima-gold/10 text-cima-gold" : "border-white/10 text-white/30 hover:border-white/20"}`}>
                                            {amenities.includes(a) && <span className="mr-1">✓</span>}{a}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div key="step4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-4 space-y-6">
                                {!published ? (
                                    <div className="space-y-6 text-center">
                                        <div className="relative mx-auto w-20 h-20">
                                            <div className="absolute inset-0 rounded-full border-4 border-white/5 border-t-cima-gold animate-spin" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Sparkles className="h-8 w-8 text-cima-gold animate-pulse" />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-white uppercase tracking-tighter mb-1">{STAGES[Math.min(publishStage, 3)]}</p>
                                            <div className="w-48 h-1.5 bg-white/5 rounded-full mx-auto overflow-hidden">
                                                <motion.div className="h-full bg-cima-gold rounded-full" animate={{ width: `${(publishStage / 3) * 100}%` }} transition={{ duration: 0.4 }} />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-5">
                                        <div className="text-center">
                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-full mb-3">
                                                <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                                                <span className="text-[9px] font-black text-green-400 uppercase tracking-wider">En Vivo</span>
                                            </div>
                                            <p className="text-sm font-black text-white">¡Propiedad publicada!</p>
                                            <p className="text-[10px] text-white/30 mt-1">Ya está disponible en tu portal y marketplaces</p>
                                        </div>
                                        {/* Preview card */}
                                        <div className="bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden">
                                            <img src={randomPhoto} alt={nombre} className="w-full h-28 object-cover" />
                                            <div className="p-3">
                                                <p className="text-xs font-black text-white">{nombre}</p>
                                                <p className="text-[10px] text-cima-gold font-bold mt-0.5">${precio} MXN</p>
                                                <div className="flex items-center gap-2 mt-1 text-[8px] text-white/30">
                                                    <span>{recamaras} rec.</span>
                                                    <span>·</span>
                                                    <span>{banos} baños</span>
                                                    <span>·</span>
                                                    <span>{m2} m²</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={onClose} className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white/50 uppercase tracking-wider hover:bg-white/10 transition-all">
                                                Cerrar
                                            </button>
                                            <button onClick={onClose} className="flex-1 py-3 bg-cima-gold text-black rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-white transition-all">
                                                Ver Propiedad
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer buttons */}
                {step < 4 && (
                    <div className="p-6 pt-0 flex gap-3">
                        {step > 1 && (
                            <button onClick={() => setStep(s => s - 1)} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white/50 uppercase hover:bg-white/10 transition-all">
                                Atrás
                            </button>
                        )}
                        <button
                            onClick={() => {
                                if (step < 3) setStep(s => s + 1);
                                else {
                                    const newProp = {
                                        name: nombre,
                                        price: `$${precio}`,
                                        status: opType,
                                        owner: "Nuevo Propietario",
                                        img: randomPhoto,
                                        hits: 0,
                                        trend: [0, 0, 0, 0, 0, 0, 1],
                                        beds: recamaras,
                                        baths: banos,
                                        m2: parseInt(m2) || 180,
                                        address: direccion,
                                    };
                                    startPublish();
                                    onPublish(newProp);
                                }
                            }}
                            className="flex-1 py-3 bg-cima-gold text-black rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-white transition-all shadow-lg shadow-cima-gold/20"
                        >
                            {step < 3 ? "Continuar" : "Publicar Propiedad"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function CheckoutModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [step, setStep] = useState<"select" | "details" | "success">("select");
    const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
    const [commission, setCommission] = useState("5");
    const [finalPrice, setFinalPrice] = useState("");

    const handleReset = () => {
        setStep("select");
        setSelectedLeads([]);
        setCommission("5");
        setFinalPrice("");
    };

    const handleClose = () => {
        handleReset();
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-[#0A0A0B] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-cima-gold flex items-center justify-center text-black shadow-lg shadow-cima-gold/20">
                                    <Briefcase className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-white uppercase tracking-tight">Cerrar Venta</h3>
                                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Finalizar proceso comercial</p>
                                </div>
                            </div>
                            <button onClick={handleClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                                <X className="h-5 w-5 text-white/40" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {step === "select" && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-[10px] font-black text-cima-gold uppercase tracking-widest">1. Seleccionar Lead Comprador</p>
                                        <span className="text-[8px] text-white/20 font-mono">7 leads disponibles</span>
                                    </div>
                                    <div className="grid gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                        {["Carlos L-pez", "Ana Mart-nez", "Roberto Garc-a", "Elena Ramos", "Miguel S-nchez", "Sof-a Luna", "H-ctor D-az"].map((lead) => (
                                            <button
                                                key={lead}
                                                onClick={() => setSelectedLeads([lead])}
                                                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${selectedLeads.includes(lead)
                                                    ? "bg-cima-gold/10 border-cima-gold text-cima-gold"
                                                    : "bg-white/5 border-white/5 text-white/60 hover:border-white/20"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-[10px] font-black ${selectedLeads.includes(lead) ? "bg-cima-gold text-black" : "bg-white/10 text-white/40"}`}>
                                                        {lead.charAt(0)}
                                                    </div>
                                                    <span className="text-xs font-bold">{lead}</span>
                                                </div>
                                                {selectedLeads.includes(lead) && <CheckCircle2 className="h-4 w-4" />}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        disabled={selectedLeads.length === 0}
                                        onClick={() => setStep("details")}
                                        className="w-full mt-4 py-4 bg-cima-gold text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white transition-all shadow-lg disabled:opacity-50"
                                    >
                                        Siguiente Paso
                                    </button>
                                </div>
                            )}

                            {step === "details" && (
                                <div className="space-y-6">
                                    <p className="text-[10px] font-black text-cima-gold uppercase tracking-widest">2. Detalles Econ-micos</p>
                                    <div className="grid gap-4">
                                        <div>
                                            <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest block mb-2">Precio de Venta Final</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 font-bold">$</span>
                                                <input
                                                    type="text"
                                                    placeholder="12,400,000"
                                                    value={finalPrice}
                                                    onChange={(e) => setFinalPrice(e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-8 pr-4 text-white outline-none focus:border-cima-gold/40 transition-all font-mono"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest block mb-2">Comisi-n %</label>
                                                <select
                                                    value={commission}
                                                    onChange={(e) => setCommission(e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white outline-none focus:border-cima-gold/40 transition-all appearance-none"
                                                >
                                                    <option value="3">3%</option>
                                                    <option value="4">4%</option>
                                                    <option value="5">5%</option>
                                                    <option value="6">6%</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest block mb-2">Total Comisi-n</label>
                                                <div className="w-full bg-cima-gold/5 border border-cima-gold/20 rounded-2xl py-4 px-4 text-cima-gold font-mono font-bold">
                                                    $620,000
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setStep("select")}
                                            className="flex-1 py-4 bg-white/5 border border-white/10 text-white/60 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
                                        >
                                            Atr-s
                                        </button>
                                        <button
                                            onClick={() => setStep("success")}
                                            className="flex-[2] py-4 bg-cima-gold text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white transition-all shadow-lg shadow-cima-gold/20"
                                        >
                                            Confirmar Cierre
                                        </button>
                                    </div>
                                </div>
                            )}

                            {step === "success" && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-10 space-y-6"
                                >
                                    <div className="relative inline-block">
                                        <div className="h-24 w-24 rounded-full bg-cima-gold flex items-center justify-center text-black mx-auto relative z-10">
                                            <CheckCircle2 className="h-12 w-12" />
                                        </div>
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1.5, opacity: 0 }}
                                            transition={{ repeat: Infinity, duration: 1.5 }}
                                            className="absolute inset-0 bg-cima-gold rounded-full"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">-Venta Cerrada!</h4>
                                        <p className="text-sm text-white/60">Felicidades, la propiedad ha sido marcada como vendida y los anal-ticos se han actualizado.</p>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 inline-block w-full">
                                        <p className="text-[10px] text-white/20 uppercase font-black tracking-widest mb-1">Impacto en Anal-ticos</p>
                                        <p className="text-cima-gold font-bold">+ $620,000 en comisiones proyectadas</p>
                                    </div>
                                    <button
                                        onClick={handleClose}
                                        className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-cima-gold transition-all"
                                    >
                                        Volver al Panel
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

/* === VIEWS ==================================================================================================== */

/* ------ Diffusion Button (for PropertiesView) --------------------------------------------------------- */
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
            alert(`Propiedad "${propertyName}" difundida con -xito!`);
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

/* ------ Properties View --------------------------------------------------------------------------------------------------------------------------- */
function PropertiesView({ properties, canEdit, onSelect, plan, onNewProperty, highlightId }: { properties: typeof PROPERTIES; canEdit: boolean; onSelect: (i: number) => void; plan: PlanConfig; onNewProperty?: () => void; highlightId?: number | null }) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{properties.length} propiedades</p>
                {onNewProperty && (
                    <button
                        onClick={onNewProperty}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-cima-gold text-black rounded-lg text-[9px] font-black uppercase hover:bg-white transition-all"
                    >
                        <Plus className="h-3.5 w-3.5" /> Nueva Propiedad
                    </button>
                )}
            </div>
            {properties.map((prop, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(i * 0.05, 0.5) }}
                    onClick={() => canEdit && onSelect(i)}
                    className={`bg-white/[0.03] border p-3 rounded-xl hover:border-cima-gold/30 hover:bg-white/[0.05] transition-all group ${canEdit ? "cursor-pointer" : ""} ${highlightId === i ? "border-green-500/50 ring-2 ring-green-500/40 bg-green-500/[0.04]" : "border-white/5"}`}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-14 bg-black border border-white/10 rounded-lg overflow-hidden shrink-0">
                            <img src={prop.img} alt={prop.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 mb-0.5">
                                <p className="text-[11px] font-bold text-white group-hover:text-cima-gold transition-colors truncate">{prop.name}</p>
                                <span className="px-1 py-px rounded bg-cima-gold/10 border border-cima-gold/20 text-[6px] font-black text-cima-gold uppercase shrink-0">{prop.status}</span>
                            </div>
                            <div className="flex items-center gap-3 text-[9px] font-mono">
                                <span className="text-white/60 font-bold">{prop.price}</span>
                                <span className="text-white/30">•</span>
                                <span className="text-white/30">{prop.hits} vistas</span>
                                <span className="text-white/30">•</span>
                                <span className="text-white/40">{prop.owner}</span>
                            </div>
                        </div>
                        <div className="hidden md:block shrink-0">
                            <MiniChart data={prop.trend} height={24} />
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        {canEdit && (
                            <span className="text-[7px] text-white/20 font-bold uppercase tracking-widest flex items-center gap-1">
                                <Edit3 className="h-2.5 w-2.5" /> Click para editar
                            </span>
                        )}
                        <div className={`flex items-center gap-1.5 ${canEdit ? "" : "ml-auto"}`}>
                            <div className="p-1.5 bg-white/5 border border-white/10 rounded-lg hover:bg-cima-gold/20 transition-all cursor-pointer">
                                <Settings className="h-3 w-3 text-white/40" />
                            </div>
                            <div className="p-1.5 bg-cima-gold/10 border border-cima-gold/20 rounded-lg hover:bg-cima-gold transition-all cursor-pointer">
                                <Layout className="h-3 w-3 text-cima-gold" />
                            </div>
                            <div className="p-1.5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all cursor-pointer">
                                <Share2 className="h-3 w-3 text-white/20" />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                        <button className="flex-1 bg-white/[0.05] hover:bg-white/10 text-white/60 hover:text-white border border-white/5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all">
                            Editar
                        </button>
                        <DiffusionButton propertyName={prop.name} tier={plan.tier} />
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

/* ------ Property Detail Panel --------------------------------------------------------------------------------------------------------- */
function PropertyDetailPanel({ property, onBack, isTeam, plan }: { property: (typeof PROPERTIES)[0]; onBack: () => void; isTeam: boolean; plan: PlanConfig }) {
    const [isPublished, setIsPublished] = useState(true);
    const [aiGenerating, setAiGenerating] = useState(false);
    const [aiText, setAiText] = useState("");
    const [selectedAgent, setSelectedAgent] = useState(0);
    const [agentDropdownOpen, setAgentDropdownOpen] = useState(false);
    const [editedName, setEditedName] = useState(property.name);
    const [editedPrice, setEditedPrice] = useState(property.price);
    const [editedAddress, setEditedAddress] = useState(property.address);

    const FULL_AI_TEXT = `Descubre esta impresionante ${property.name.toLowerCase()} ubicada en ${property.address}. Con ${property.beds} amplias recámaras, ${property.baths} baños de lujo y ${property.m2} m² de construcción, esta propiedad ofrece el espacio ideal para tu familia.Acabados de primera calidad, iluminación natural excepcional y una ubicación privilegiada que garantiza plusvalía.Agenda tu visita hoy.`;

    function handleAIGenerate() {
        setAiGenerating(true);
        setAiText("");
        let idx = 0;
        const interval = setInterval(() => {
            idx++;
            setAiText(FULL_AI_TEXT.slice(0, idx));
            if (idx >= FULL_AI_TEXT.length) {
                clearInterval(interval);
                setAiGenerating(false);
            }
        }, 15);
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <button onClick={onBack} className="flex items-center gap-2 text-[9px] font-bold text-white/40 uppercase tracking-wider hover:text-white transition-all">
                    <ChevronRight className="h-3.5 w-3.5 rotate-180" />
                    Volver a propiedades
                </button>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                        <span className="text-[8px] text-white/40 font-bold uppercase">Publicada</span>
                        <button onClick={() => setIsPublished(!isPublished)} className="relative">
                            <div className={`w-8 h-4 rounded-full transition-all ${isPublished ? "bg-green-500" : "bg-white/10"}`}>
                                <div className={`absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition-all ${isPublished ? "left-[18px]" : "left-0.5"}`} />
                            </div>
                        </button>
                    </div>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-cima-gold text-black rounded-lg text-[8px] font-black uppercase tracking-wider hover:bg-white transition-all shadow-lg shrink-0">
                        <ExternalLink className="h-3 w-3" /> Ver Landing
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Form */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Hero image */}
                    <div className="relative h-48 rounded-xl overflow-hidden border border-white/10">
                        <img src={property.img} alt={property.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-3 left-3 flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-lg text-[7px] font-black uppercase ${isPublished ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}>
                                {isPublished ? "En línea" : "Borrador"}
                            </span>
                            <span className="text-[8px] text-white/60 font-mono">{property.hits} vistas</span>
                        </div>
                    </div>

                    {/* Form fields */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-[7px] text-white/30 font-bold uppercase tracking-widest mb-1 block">Nombre</label>
                            <input
                                className={`w-full bg-white/5 border rounded-lg px-3 py-2.5 text-xs text-white font-bold outline-none transition-all ${isTeam ? "border-cima-gold/20 focus:border-cima-gold/60" : "border-white/10 focus:border-cima-gold/40"}`}
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                readOnly={!isTeam}
                            />
                        </div>
                        <div>
                            <label className="text-[7px] text-white/30 font-bold uppercase tracking-widest mb-1 block">Precio</label>
                            <input
                                className={`w-full bg-white/5 border rounded-lg px-3 py-2.5 text-xs text-white font-bold outline-none transition-all ${isTeam ? "border-cima-gold/20 focus:border-cima-gold/60" : "border-white/10 focus:border-cima-gold/40"}`}
                                value={editedPrice}
                                onChange={(e) => setEditedPrice(e.target.value)}
                                readOnly={!isTeam}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-[7px] text-white/30 font-bold uppercase tracking-widest mb-1 block">Dirección</label>
                        <input
                            className={`w-full bg-white/5 border rounded-lg px-3 py-2.5 text-xs text-white outline-none transition-all ${isTeam ? "border-cima-gold/20 focus:border-cima-gold/60" : "border-white/10 focus:border-cima-gold/40"}`}
                            value={editedAddress}
                            onChange={(e) => setEditedAddress(e.target.value)}
                            readOnly={!isTeam}
                        />
                    </div>

                    {isTeam && (
                        <p className="text-[7px] text-cima-gold/40 font-bold uppercase tracking-widest flex items-center gap-1">
                            <Edit3 className="h-2.5 w-2.5" /> Los campos son editables en tiempo real
                        </p>
                    )}

                    {/* Specs */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3 text-center">
                            <BedDouble className="h-4 w-4 text-white/20 mx-auto mb-1" />
                            <p className="text-sm font-bold text-white">{property.beds}</p>
                            <p className="text-[7px] text-white/30 uppercase font-bold tracking-wider">Recámaras</p>
                        </div>
                        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3 text-center">
                            <Bath className="h-4 w-4 text-white/20 mx-auto mb-1" />
                            <p className="text-sm font-bold text-white">{property.baths}</p>
                            <p className="text-[7px] text-white/30 uppercase font-bold tracking-wider">Baños</p>
                        </div>
                        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3 text-center">
                            <Ruler className="h-4 w-4 text-white/20 mx-auto mb-1" />
                            <p className="text-sm font-bold text-white">{property.m2}</p>
                            <p className="text-[7px] text-white/30 uppercase font-bold tracking-wider">m²</p>
                        </div>
                    </div>

                    {/* Description with AI */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="text-[7px] text-white/30 font-bold uppercase tracking-widest">Descripción</label>
                            <button
                                onClick={handleAIGenerate}
                                disabled={aiGenerating}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-[7px] font-black text-purple-400 uppercase tracking-wider hover:bg-purple-500/20 transition-all disabled:opacity-50"
                            >
                                <Sparkles className={`h-3 w-3 ${aiGenerating ? "animate-spin" : ""}`} />
                                {aiGenerating ? "Generando..." : "Generar con IA"}
                            </button>
                        </div>
                        <textarea
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white/60 outline-none focus:border-cima-gold/40 transition-all resize-none h-28"
                            value={aiText || `Hermosa propiedad en ${property.address}. Contacta para más información.`}
                            readOnly
                        />
                    </div>
                </div>

                {/* Right: Photos & Actions */}
                <div className="space-y-4">
                    {/* Photos */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-[7px] text-white/30 font-bold uppercase tracking-widest">Galer--a de Fotos</label>
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
                            <Upload className="h-3 w-3" /> Subir m--s fotos
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
                                            <p className="text-[7px] text-white/30">{AGENTS[selectedAgent].role} -- {AGENTS[selectedAgent].props} propiedades</p>
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
                        <p className="text-[9px] text-white/30 mt-0.5">{property.status} -- {property.address.split(",").pop()?.trim()}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

/* --- Checkout Modal -------------------------------------------------------------------------------------------- */
function LeadsView({ leads, newLeadId, onUpdateStatus, tier }: {
    leads: LiveLead[];
    newLeadId?: string;
    onUpdateStatus: (id: string, s: string) => void;
    tier: string;
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
                            <Lock className="h-3 w-3" /> Funci--n disponible en planes Pro / Team
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
                    { id: "en_negociacion", label: "Negociaci--n", color: "bg-cima-gold/20 border-cima-gold/30 text-cima-gold" },
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
            <div className="space-y-2">
                {leads.map((lead) => (
                    <motion.div
                        key={lead.id}
                        layout
                        initial={lead.id === newLeadId ? { scale: 0.9, opacity: 0 } : false}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`p-3 rounded-xl border transition-all ${lead.id === newLeadId
                            ? "bg-cima-gold/10 border-cima-gold shadow-[0_0_15px_rgba(200,169,110,0.2)]"
                            : "bg-white/[0.03] border-white/5 hover:border-white/10"
                            }`}
                    >
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 text-left">
                                <div className={`h-8 w-8 rounded-lg ${lead.color} flex items-center justify-center shrink-0`}>
                                    <lead.sourceIcon className="h-4 w-4" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <p className="text-[11px] font-bold text-white">
                                            {lead.name}
                                        </p>
                                        {lead.id === newLeadId && (
                                            <span className="text-[6px] bg-cima-gold text-black px-1 rounded font-black animate-pulse shrink-0">JUSTO AHORA</span>
                                        )}
                                        {lead.score && tier !== "basico" && (
                                            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-cima-gold/10 border border-cima-gold/20 rounded-md shrink-0">
                                                <Sparkles className="h-2 w-2 text-cima-gold" />
                                                <span className="text-[8px] font-black text-cima-gold">{lead.score}</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-[8px] text-white/30 font-mono italic">{lead.property}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="hidden sm:block text-right">
                                    <p className="text-[9px] text-white/40 font-mono">{lead.phone}</p>
                                    <p className="text-[7px] text-white/20 uppercase font-bold tracking-widest">{lead.date}</p>
                                </div>

                                <button
                                    onClick={() => handleStageClick(lead.id, lead.status)}
                                    className={`px-3 py-1.5 rounded-lg border text-[8px] font-black uppercase tracking-wider transition-all min-w-[100px] text-center ${STATUS_MAP[lead.status].class} ${!isStarter ? "hover:scale-105 active:scale-95 cursor-pointer shadow-lg shadow-black/20" : "cursor-default opacity-80"}`}
                                >
                                    {STATUS_MAP[lead.status].label}
                                    {!isStarter && <span className="ml-2 opacity-30 text-[6px]">Siguiente etapa ---</span>}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

/* ------ Visits View --------------------------------------------------------------------------------------------------------------------------------------- */
function VisitsView() {
    const grouped: Record<string, typeof VISITS> = {};
    VISITS.forEach((v) => {
        if (!grouped[v.date]) grouped[v.date] = [];
        grouped[v.date].push(v);
    });

    const statusStyle: Record<string, string> = {
        confirmada: "bg-green-500/10 text-green-400 border-green-500/20",
        pendiente: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
        realizada: "bg-white/5 text-white/30 border-white/10",
        cancelada: "bg-red-500/10 text-red-400 border-red-500/20",
    };

    return (
        <div className="space-y-6">
            {Object.entries(grouped).map(([date, visits], gi) => (
                <div key={date}>
                    <div className="flex items-center gap-2 mb-3">
                        <Calendar className="h-3.5 w-3.5 text-cima-gold" />
                        <span className={`text-xs font-black uppercase tracking-wider ${date === "Hoy" ? "text-cima-gold" : date === "Ma--ana" ? "text-white/60" : "text-white/30"}`}>
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
                                className={`bg-white/[0.03] border rounded-xl p-4 transition-all ${visit.status === "confirmada" || visit.status === "pendiente"
                                    ? "border-white/10 hover:border-cima-gold/30"
                                    : "border-white/5 opacity-60"
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-white/[0.05] border border-white/10 flex flex-col items-center justify-center shrink-0">
                                            <Clock className="h-3 w-3 text-cima-gold mb-0.5" />
                                            <span className="text-[8px] font-bold text-white/60">{visit.time?.split(" ")[0]}</span>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-white">{visit.prospect}</p>
                                            <div className="flex items-center gap-2 text-[9px]">
                                                <span className="text-white/30 flex items-center gap-1">
                                                    <MapPin className="h-2.5 w-2.5" /> {visit.property}
                                                </span>
                                                <span className="text-white/20">---</span>
                                                <span className="text-white/20">{visit.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {visit.sentiment === "positive" && (
                                            <span className="text-[7px] font-bold bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded-full border border-green-500/20">
                                                ------ Le encant--
                                            </span>
                                        )}
                                        {visit.sentiment === "neutral" && (
                                            <span className="text-[7px] font-bold bg-yellow-500/10 text-yellow-400 px-1.5 py-0.5 rounded-full border border-yellow-500/20">
                                                ---- Lo piensa
                                            </span>
                                        )}
                                        <span className={`px-2 py-1 rounded-lg text-[7px] font-black uppercase tracking-wide border ${statusStyle[visit.status]}`}>
                                            {visit.status}
                                        </span>
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

/* ------ Analytics View ------------------------------------------------------------------------------------------------------------------------------ */
function AnalyticsView() {
    return (
        <div className="space-y-6">
            {/* Big numbers */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: "Ingresos mes", value: "$847K", change: "+23%", up: true },
                    { label: "Ticket promedio", value: "$6.8M", change: "+$400K", up: true },
                    { label: "D--as promedio venta", value: "18", change: "-4 d--as", up: true },
                    { label: "Tasa de cierre", value: "34%", change: "+6%", up: true },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white/[0.03] border border-white/5 rounded-xl p-5"
                    >
                        <p className="text-[8px] text-white/30 uppercase font-bold tracking-wider mb-2">{stat.label}</p>
                        <p className="text-2xl font-heading font-bold text-white mb-1">{stat.value}</p>
                        <div className="flex items-center gap-1">
                            {stat.up
                                ? <ArrowUpRight className="h-3 w-3 text-green-400" />
                                : <ArrowDownRight className="h-3 w-3 text-red-400" />
                            }
                            <span className={`text-[9px] font-bold ${stat.up ? "text-green-400" : "text-red-400"}`}>{stat.change}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
                    <h3 className="text-[9px] font-black uppercase tracking-wider text-white/40 mb-4 flex items-center gap-2">
                        <Eye className="h-3 w-3 text-cima-gold" /> Vistas por Propiedad
                    </h3>
                    <BarChart
                        data={[142, 89, 56, 34, 201]}
                        labels={["Misiones", "LOVFT", "Contry", "Valle P.", "Santa M."]}
                    />
                </div>
                <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
                    <h3 className="text-[9px] font-black uppercase tracking-wider text-white/40 mb-4 flex items-center gap-2">
                        <Target className="h-3 w-3 text-cima-gold" /> Leads por Fuente
                    </h3>
                    <BarChart
                        data={[12, 8, 5, 3, 2]}
                        labels={["Instagram", "Marketplace", "Landing", "Referido", "Google"]}
                    />
                </div>
            </div>

            {/* Source breakdown */}
            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
                <h3 className="text-[9px] font-black uppercase tracking-wider text-white/40 mb-4 flex items-center gap-2">
                    <BarChart3 className="h-3 w-3 text-cima-gold" /> Rendimiento por propiedad
                </h3>
                <div className="space-y-3">
                    {PROPERTIES.map((prop, i) => {
                        const pct = Math.round((prop.hits / 201) * 100);
                        return (
                            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-[10px] text-white/60 font-bold">{prop.name}</span>
                                    <span className="text-[10px] text-white/30 font-mono">{prop.hits} vistas</span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
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

/* ------ IA Studio View ------------------------------------------------------------------------------------------------------------------------------ */
function IaStudioView() {
    const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "ready">("idle");
    const [mode, setMode] = useState<"clean" | "stage" | "remodel">("stage");
    const [progress, setProgress] = useState(0);

    const MODES = [
        { id: "clean", label: "Limpiar Espacio", icon: Sparkles, desc: "Elimina objetos y desorden" },
        { id: "stage", label: "Amueblar (Staging)", icon: Home, desc: "A--ade muebles y decoraci--n" },
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
                    <h3 className="text-[14px] font-black text-white uppercase tracking-tighter">IA Studio</h3>
                    <p className="text-[10px] text-white/40 font-medium">Transformación de espacios en un clic</p>
                </div>
                {status === "ready" && (
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[9px] font-bold text-white/60 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <RotateCcw className="h-3 w-3" /> Reiniciar
                    </button>
                )}
            </div>

            {status === "idle" && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="aspect-video bg-white/[0.02] border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center gap-4 group cursor-pointer hover:bg-white/[0.04] transition-all"
                    onClick={() => setStatus("uploading")}
                >
                    <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover:scale-110 group-hover:text-cima-gold transition-all">
                        <Upload className="h-8 w-8" />
                    </div>
                    <div className="text-center">
                        <p className="text-xs font-bold text-white/60">Haz clic para subir una foto</p>
                        <p className="text-[8px] text-white/20 uppercase font-black tracking-widest mt-1">Soporte: JPG, PNG · Max 10MB</p>
                    </div>
                </motion.div>
            )}

            {status === "uploading" && (
                <div className="space-y-6">
                    <div className="aspect-video bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden relative">
                        <NextImage src="/cocina-antes.png" alt="Original" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-[8px] font-black text-white uppercase tracking-widest">Foto Original</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {MODES.map((m) => (
                            <button
                                key={m.id}
                                onClick={() => setMode(m.id as any)}
                                className={`p-4 rounded-2xl border transition-all text-left ${mode === m.id ? "bg-cima-gold/10 border-cima-gold shadow-lg shadow-cima-gold/5" : "bg-white/[0.02] border-white/5 hover:border-white/20"}`}
                            >
                                <m.icon className={`h-5 w-5 mb-3 ${mode === m.id ? "text-cima-gold" : "text-white/40"}`} />
                                <p className={`text-[11px] font-black mb-1 ${mode === m.id ? "text-white" : "text-white/60"}`}>{m.label}</p>
                                <p className="text-[9px] text-white/30 leading-tight">{m.desc}</p>
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
                        <div className="h-24 w-24 rounded-full border-4 border-white/5 border-t-cima-gold animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Sparkles className="h-8 w-8 text-cima-gold animate-pulse" />
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-black text-white uppercase tracking-tighter mb-2">Procesando {mode === "clean" ? "Limpieza" : mode === "stage" ? "Amueblado" : "Remodelación"}</p>
                        <div className="w-48 h-1.5 bg-white/5 rounded-full overflow-hidden mx-auto">
                            <motion.div
                                className="h-full bg-cima-gold"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="text-[10px] text-white/30 font-mono mt-3 uppercase tracking-widest">Generando nuevas capas visuales...</p>
                    </div>
                </div>
            )}

            {status === "ready" && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4"
                >
                    <div className="aspect-video bg-white/5 border border-white/10 rounded-3xl overflow-hidden relative group">
                        <NextImage src="/cocina-despues.png" alt="Result" fill className="object-cover" />

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

                        {/* Comparative Badge */}
                        <div className="absolute top-6 right-6 flex items-center gap-2">
                            <div className="bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2">
                                <span className="text-[8px] font-black text-white/40 uppercase">IA Studio</span>
                                <div className="h-1 w-8 bg-cima-gold/30 rounded-full" />
                                <span className="text-[8px] font-black text-cima-gold uppercase">Éxito</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white/60 uppercase hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                            <Download className="h-3 w-3" /> Descargar HD
                        </button>
                        <button className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white/60 uppercase hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                            <Share2 className="h-3 h-3" /> Compartir
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

/* ------ Documents View ------------------------------------------------------------------------------------------------------------------------------ */
function DocumentsView() {
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
                    <h3 className="text-[14px] font-black text-white uppercase tracking-tighter">Bóveda Digital</h3>
                    <p className="text-[10px] text-white/40 font-medium">Gestión documental con respaldo jurídico e IA</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-cima-gold text-black rounded-lg text-[9px] font-bold uppercase hover:bg-white transition-all">
                        <Plus className="h-3 w-3" /> Nuevo Documento
                    </button>
                </div>
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: "Integridad", val: "94%", color: "text-green-400" },
                    { label: "Pendientes", val: "2", color: "text-amber-400" },
                    { label: "Almacenado", val: "12.8 GB", color: "text-white/40" },
                ].map((s, i) => (
                    <div key={i} className="bg-white/[0.02] border border-white/5 p-3 rounded-2xl">
                        <p className="text-[7px] font-black uppercase tracking-widest text-white/20 mb-1">{s.label}</p>
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
                        className="group flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-white/10 hover:bg-white/[0.04] transition-all"
                    >
                        <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${doc.status === "verificado" ? "bg-green-500/10 text-green-400" :
                            doc.status === "advertencia" ? "bg-red-500/10 text-red-400" :
                                "bg-white/5 text-white/20"
                            }`}>
                            <FileCheck className="h-5 w-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-[11px] font-bold text-white/90 truncate">{doc.name}</span>
                                <span className="text-[7px] font-black px-1.5 py-0.5 rounded bg-white/5 text-white/40 uppercase tracking-widest">{doc.type}</span>
                            </div>
                            <div className="flex items-center gap-3 text-[9px] text-white/25 font-medium">
                                <span>{doc.date}</span>
                                <span>---</span>
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
                                    <div className={`flex items-center gap-1.5 ${doc.status === "verificado" ? "text-green-400" :
                                        doc.status === "advertencia" ? "text-red-400" :
                                            "text-white/20"
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
                                    className="p-2 bg-cima-gold/10 border border-cima-gold/20 rounded-lg group-hover:bg-cima-gold group-hover:text-black transition-all text-cima-gold"
                                    title="Verificar con IA"
                                >
                                    <Sparkles className="h-3.5 w-3.5" />
                                </button>
                            )}

                            <button className="p-2 bg-white/5 border border-white/5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-all text-white/40">
                                <ExternalLink className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* AI Trust Message */}
            <div className="p-4 rounded-2xl bg-cima-gold/5 border border-cima-gold/20 flex gap-3">
                <div className="h-8 w-8 rounded-lg bg-cima-gold flex items-center justify-center shrink-0 shadow-lg shadow-cima-gold/20">
                    <ShieldCheck className="h-4 w-4 text-black" />
                </div>
                <div>
                    <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-1">Cima Legal Compliance · ON</h4>
                    <p className="text-[9px] text-white/50 leading-relaxed font-medium">Todos los documentos son analizados mediante **Integridad Biométrica** y **OCR Inteligente** para garantizar transacciones de ultra-lujo sin riesgos legales.</p>
                </div>
            </div>
        </div>
    );
}

/* ------ Contract Generator View --------------------------------------------------------------------------------------------------- */

const TEMPLATE_CONTENT: Record<string, { sections: { title: string; text: string }[] }> = {
    exclusividad: {
        sections: [
            { title: "ANTECEDENTES", text: "Las partes se reconocen mutuamente la capacidad jurídica suficiente para celebrar el presente Contrato de Exclusividad Inmobiliaria y manifiestan su voluntad de quedar obligadas en los términos y condiciones que se establecen a continuación." },
            { title: "PRIMERA — VIGENCIA", text: "El presente contrato tendrá una vigencia de NOVENTA (90) días naturales, contados a partir de la fecha de firma. Durante este período, el PROPIETARIO se compromete a no realizar gestiones de venta a través de terceros distintos a CIMA PRO." },
            { title: "SEGUNDA — COMISIÓN", text: "En caso de concretarse la venta del inmueble, el PROPIETARIO se obliga a pagar a CIMA PRO una comisión equivalente al porcentaje pactado sobre el precio de cierre de la operación, más el Impuesto al Valor Agregado (IVA) correspondiente." },
            { title: "TERCERA — OBLIGACIONES", text: "CIMA PRO se compromete a promover activamente el inmueble en sus plataformas digitales, redes sociales, portales inmobiliarios y base de datos de clientes calificados, generando un mínimo de 5 visitas calificadas durante la vigencia del contrato." },
            { title: "CUARTA — EXCLUSIVIDAD", text: "Durante la vigencia del presente instrumento, el PROPIETARIO se obliga a canalizar a CIMA PRO cualquier prospecto interesado en la adquisición del inmueble, con el fin de que sea atendido bajo los lineamientos profesionales de la empresa." },
            { title: "QUINTA — RESCISIÓN", text: "Cualquiera de las partes podrá dar por terminado el presente contrato mediante aviso por escrito con 15 días de anticipación. En caso de rescisión imputable al PROPIETARIO, deberá cubrir los gastos de promoción ya efectuados por CIMA PRO." },
        ]
    },
    arrendamiento: {
        sections: [
            { title: "OBJETO DEL ARRENDAMIENTO", text: "El ARRENDADOR da en arrendamiento al ARRENDATARIO el inmueble descrito, para uso exclusivamente habitacional. El ARRENDATARIO se obliga a destinar el inmueble únicamente para dicho fin, sin poder subarrendarlo total o parcialmente sin autorización escrita del ARRENDADOR." },
            { title: "RENTA MENSUAL", text: "El ARRENDATARIO se obliga a pagar al ARRENDADOR como renta mensual la cantidad convenida en el presente instrumento, misma que deberá ser cubierta los primeros cinco días de cada mes en la cuenta bancaria que el ARRENDADOR designe." },
            { title: "DEPÓSITO DE GARANTÍA", text: "El ARRENDATARIO entrega en este acto la cantidad equivalente a dos meses de renta como depósito de garantía, el cual le será devuelto al término del contrato, previa verificación del estado del inmueble y siempre que no existan adeudos." },
            { title: "OBLIGACIONES DEL ARRENDATARIO", text: "El ARRENDATARIO se obliga a conservar el inmueble en las mismas condiciones en que lo recibe, efectuando las reparaciones menores que se ocasionen por el uso normal del mismo. Las reparaciones mayores serán responsabilidad del ARRENDADOR." },
        ]
    },
    intencion: {
        sections: [
            { title: "APARTADO", text: "El COMPRADOR entrega en este acto la cantidad convenida como apartado del inmueble, con el propósito de demostrar su seriedad e intención de adquirir el bien inmueble objeto de la presente carta, quedando el mismo reservado por el plazo pactado." },
            { title: "CONDICIONES SUSPENSIVAS", text: "La formalización de la operación está sujeta a las siguientes condiciones: (i) obtención de financiamiento bancario por parte del COMPRADOR, (ii) aprobación del avalúo comercial del inmueble, y (iii) presentación de documentación completa por parte del VENDEDOR." },
            { title: "PLAZO DE CIERRE FORMAL", text: "Las partes acuerdan que la firma del contrato definitivo de compraventa ante Fedatario Público deberá realizarse en un plazo no mayor a 45 días naturales contados a partir de la firma de la presente carta de intención." },
            { title: "DEVOLUCIÓN DE APARTADO", text: "En caso de que el VENDEDOR decida no concretar la operación o no cumpla con las condiciones pactadas, deberá devolver al COMPRADOR el doble del apartado recibido. Si el COMPRADOR desiste sin causa justificada, perderá el apartado entregado." },
        ]
    },
    aviso: {
        sections: [
            { title: "RESPONSABLE", text: "CIMA PRO S.A. DE C.V. es responsable del tratamiento de sus datos personales. Con domicilio en Av. Constitución 444, Col. Centro, Monterrey, N.L., C.P. 64000. Tel: (81) 8000-0000. Correo: privacidad@cimapro.mx" },
            { title: "FINALIDADES DEL TRATAMIENTO", text: "Sus datos personales serán utilizados para las siguientes finalidades primarias: (i) Prestación del servicio de intermediación inmobiliaria, (ii) Envío de información sobre propiedades de su interés, (iii) Elaboración de contratos y documentos legales." },
            { title: "TRANSFERENCIAS", text: "Sus datos podrán ser transferidos a: notarios públicos para la formalización de operaciones, instituciones financieras para tramitar créditos hipotecarios, autoridades competentes cuando sea requerido por ley. En todos los casos se garantiza la confidencialidad de su información." },
            { title: "DERECHOS ARCO", text: "Usted tiene derecho de Acceso, Rectificación, Cancelación y Oposición (ARCO) respecto a sus datos personales. Para ejercer dichos derechos, envíe su solicitud por escrito al correo privacidad@cimapro.mx, adjuntando identificación oficial vigente." },
        ]
    },
};

function ContractGeneratorView({ isMobilePreview }: { isMobilePreview: boolean }) {
    const [step, setStep] = useState<"select" | "data" | "generating" | "result">("select");
    const [template, setTemplate] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        propiedad: "Residencia Las Misiones",
        cliente: "Carlos Vargas",
        propietario: "Fam. García Treviño",
        telefono: "81 2345 6789",
        precio: "$12,500,000",
        comision: "5%",
        vigencia: "90",
        fecha: new Date().toLocaleDateString("es-MX"),
    });
    const [progress, setProgress] = useState(0);
    const [showPreview, setShowPreview] = useState(false);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const previewRef = useRef<HTMLDivElement>(null);

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

    const handleDownloadPDF = async () => {
        if (!previewRef.current) return;
        setIsGeneratingPDF(true);
        try {
            const canvas = await html2canvas(previewRef.current, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
            const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(canvas.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, imgWidth, imgHeight);
            pdf.save(`contrato-${template}-demo.pdf`);
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    if (showPreview) {
        const selectedT = TEMPLATES.find(t => t.id === template);
        const content = TEMPLATE_CONTENT[template || "exclusividad"];
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-white/10"
                style={{ maxHeight: "80vh" }}
            >
                {/* Toolbar */}
                <div className="p-4 bg-slate-900 border-b border-white/10 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-cima-gold flex items-center justify-center">
                            <FileText className="h-4 w-4 text-black" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-white uppercase tracking-tighter">{selectedT?.label}</p>
                            <p className="text-[8px] text-white/30 font-medium">Folio CS-2024-089 · Borrador de demostración</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleDownloadPDF}
                            disabled={isGeneratingPDF}
                            className="flex items-center gap-1.5 px-4 py-2 bg-cima-gold text-black rounded-xl text-[9px] font-black uppercase tracking-wider hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cima-gold/20"
                        >
                            {isGeneratingPDF ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                            {isGeneratingPDF ? "Generando..." : "Descargar PDF"}
                        </button>
                        <button
                            onClick={() => setShowPreview(false)}
                            className="h-8 w-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-all"
                        >
                            <X className="h-4 w-4 text-white/40" />
                        </button>
                    </div>
                </div>

                {/* A4 Preview scroll */}
                <div className="flex-1 overflow-y-auto bg-slate-200 p-6">
                    {/* The div captured by html2canvas */}
                    <div
                        ref={previewRef}
                        className="bg-white mx-auto shadow-2xl relative overflow-hidden"
                        style={{ width: "595px", minHeight: "842px", padding: "40px" }}
                    >
                        {/* Watermark */}
                        <div style={{
                            position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                            pointerEvents: "none", zIndex: 1, transform: "rotate(-45deg)", fontSize: "72px",
                            fontWeight: 900, color: "#f1f1f1", opacity: 0.07, userSelect: "none", whiteSpace: "nowrap"
                        }}>
                            BORRADOR DE EJEMPLO
                        </div>

                        {/* Content above watermark */}
                        <div style={{ position: "relative", zIndex: 2 }}>
                            {/* Membrete */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #f0ebe0", paddingBottom: "24px", marginBottom: "28px" }}>
                                <div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                                        <div style={{ width: "32px", height: "32px", background: "#C8A96E", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <span style={{ color: "black", fontSize: "10px", fontWeight: 900 }}>CP</span>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: "14px", fontWeight: 900, color: "#C8A96E", letterSpacing: "2px" }}>CIMA PRO</div>
                                            <div style={{ fontSize: "8px", color: "#888", letterSpacing: "1px", textTransform: "uppercase" }}>Plataforma Inmobiliaria Premium</div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <div style={{ fontSize: "9px", fontWeight: 900, color: "#333", textTransform: "uppercase", letterSpacing: "1px" }}>Folio: CS-2024-089</div>
                                    <div style={{ fontSize: "8px", color: "#888", marginTop: "4px" }}>Fecha: {formData.fecha}</div>
                                    <div style={{ fontSize: "8px", color: "#C8A96E", marginTop: "2px", fontWeight: 700 }}>Vigencia: {formData.vigencia} días</div>
                                </div>
                            </div>

                            {/* Title */}
                            <h2 style={{ textAlign: "center", fontFamily: "serif", fontSize: "16px", fontWeight: 900, color: "#1a1a1a", textTransform: "uppercase", letterSpacing: "3px", marginBottom: "24px", textDecoration: "underline", textDecorationColor: "#C8A96E", textUnderlineOffset: "6px" }}>
                                {selectedT?.label}
                            </h2>

                            {/* Intro paragraph */}
                            <p style={{ fontSize: "9px", color: "#444", lineHeight: "1.8", fontFamily: "serif", textAlign: "justify", marginBottom: "20px" }}>
                                En la ciudad de Monterrey, Nuevo León, a {formData.fecha}, comparecen por una parte{" "}
                                <strong style={{ color: "#1a1a1a", borderBottom: "1px solid #C8A96E" }}>{formData.cliente}</strong>, en su carácter de CLIENTE, y por la otra parte{" "}
                                <strong style={{ color: "#1a1a1a", borderBottom: "1px solid #C8A96E" }}>CIMA PRO S.A. DE C.V.</strong>, representado por Asesor Certificado, a fin de celebrar el presente instrumento bajo los siguientes términos:
                            </p>

                            {/* Sections / Clauses */}
                            {content.sections.map((section, i) => (
                                <div key={i} style={{ marginBottom: "18px" }}>
                                    <div style={{ fontSize: "8px", fontWeight: 900, color: "#C8A96E", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "6px" }}>
                                        {section.title}
                                    </div>
                                    <p style={{ fontSize: "9px", color: "#444", lineHeight: "1.75", fontFamily: "serif", textAlign: "justify" }}>
                                        {section.text}
                                    </p>
                                    {/* Data highlights */}
                                    {i === 0 && (
                                        <div style={{ marginTop: "10px", background: "#fdfaf5", border: "1px solid #f0ebe0", borderLeft: "4px solid #C8A96E", borderRadius: "0 8px 8px 0", padding: "10px 14px" }}>
                                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "8px" }}>
                                                <div><span style={{ color: "#888", fontWeight: 700 }}>Propiedad: </span><span style={{ color: "#1a1a1a", fontWeight: 900 }}>{formData.propiedad}</span></div>
                                                <div><span style={{ color: "#888", fontWeight: 700 }}>Propietario: </span><span style={{ color: "#1a1a1a", fontWeight: 900 }}>{formData.propietario}</span></div>
                                                <div><span style={{ color: "#888", fontWeight: 700 }}>Precio: </span><span style={{ color: "#C8A96E", fontWeight: 900 }}>{formData.precio}</span></div>
                                                <div><span style={{ color: "#888", fontWeight: 700 }}>Comisión: </span><span style={{ color: "#1a1a1a", fontWeight: 900 }}>{formData.comision}</span></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Signature block */}
                            <div style={{ marginTop: "40px", paddingTop: "24px", borderTop: "1px solid #f0ebe0", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
                                {[
                                    { label: "CLIENTE", name: formData.cliente },
                                    { label: "ASESOR CIMA", name: "Asesor Certificado" },
                                    { label: "TESTIGO", name: "________________" },
                                ].map((sig) => (
                                    <div key={sig.label} style={{ textAlign: "center" }}>
                                        <div style={{ height: "48px", borderBottom: "2px dashed #ddd", marginBottom: "8px" }} />
                                        <div style={{ fontSize: "8px", fontWeight: 900, color: "#1a1a1a", textTransform: "uppercase" }}>{sig.name}</div>
                                        <div style={{ fontSize: "7px", color: "#aaa", marginTop: "2px" }}>{sig.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer */}
                            <div style={{ marginTop: "32px", paddingTop: "12px", borderTop: "1px solid #f5f5f5", textAlign: "center", fontSize: "7px", color: "#bbb" }}>
                                Folio CS-2024-089 · Validado por Cima Sign Technology · Documento generado para demostración
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-1">
                <div>
                    <h3 className="text-[14px] font-black text-white uppercase tracking-tighter">Generador de Contratos</h3>
                    <p className="text-[10px] text-white/40 font-medium">Crea documentos legales en segundos sin salir de Cima</p>
                </div>
                {step === "result" && (
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[9px] font-bold text-white/60 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <RotateCcw className="h-3 w-3" /> Crear Otro
                    </button>
                )}
            </div>

            {step === "select" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {TEMPLATES.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => { setTemplate(t.id); setStep("data"); }}
                            className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:border-cima-gold/40 hover:bg-white/[0.05] transition-all text-left flex gap-4 group"
                        >
                            <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover:bg-cima-gold group-hover:text-black transition-all">
                                <t.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="text-xs font-black text-white mb-1">{t.label}</h4>
                                <p className="text-[9px] text-white/30 leading-relaxed">{t.desc}</p>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {step === "data" && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 space-y-6"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-8 w-8 rounded-lg bg-cima-gold/10 flex items-center justify-center text-cima-gold">
                            <FilePenLine className="h-4 w-4" />
                        </div>
                        <h4 className="text-[11px] font-black text-white uppercase tracking-widest">Datos del Documento</h4>
                    </div>

                    {/* Section: Datos de la Propiedad */}
                    <div>
                        <p className="text-[8px] font-black text-white/20 uppercase tracking-[3px] mb-4 border-b border-white/5 pb-2">Datos de la Propiedad</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[8px] font-black text-white/20 uppercase tracking-widest ml-1">Propiedad</label>
                                <input type="text" value={formData.propiedad} onChange={(e) => setFormData({ ...formData, propiedad: e.target.value })}
                                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-cima-gold/50 transition-all outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[8px] font-black text-white/20 uppercase tracking-widest ml-1">Precio de Cierre</label>
                                <input type="text" value={formData.precio} onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-cima-gold/50 transition-all outline-none" />
                            </div>
                        </div>
                    </div>

                    {/* Section: Partes del Contrato */}
                    <div>
                        <p className="text-[8px] font-black text-white/20 uppercase tracking-[3px] mb-4 border-b border-white/5 pb-2">Partes del Contrato</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[8px] font-black text-white/20 uppercase tracking-widest ml-1">Nombre del Comprador / Cliente</label>
                                <input type="text" value={formData.cliente} onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-cima-gold/50 transition-all outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[8px] font-black text-white/20 uppercase tracking-widest ml-1">Nombre del Vendedor / Dueño</label>
                                <input type="text" value={formData.propietario} onChange={(e) => setFormData({ ...formData, propietario: e.target.value })}
                                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-cima-gold/50 transition-all outline-none" />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-[8px] font-black text-white/20 uppercase tracking-widest ml-1">Teléfono de Contacto</label>
                                <input type="text" value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-cima-gold/50 transition-all outline-none" />
                            </div>
                        </div>
                    </div>

                    {/* Section: Condiciones Comerciales */}
                    <div>
                        <p className="text-[8px] font-black text-white/20 uppercase tracking-[3px] mb-4 border-b border-white/5 pb-2">Condiciones Comerciales</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[8px] font-black text-white/20 uppercase tracking-widest ml-1">Comisión Pactada</label>
                                <input type="text" value={formData.comision} onChange={(e) => setFormData({ ...formData, comision: e.target.value })}
                                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-cima-gold/50 transition-all outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[8px] font-black text-white/20 uppercase tracking-widest ml-1">Vigencia (días)</label>
                                <input type="text" value={formData.vigencia} onChange={(e) => setFormData({ ...formData, vigencia: e.target.value })}
                                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-cima-gold/50 transition-all outline-none" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button onClick={() => setStep("select")}
                            className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-xs text-white/40 uppercase tracking-widest hover:bg-white/10 transition-all">
                            Cancelar
                        </button>
                        <button onClick={handleGenerate}
                            className="flex-[2] py-4 bg-cima-gold text-black rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-cima-gold/20 hover:scale-[1.02] active:scale-95 transition-all">
                            Generar PDF Profesional
                        </button>
                    </div>
                </motion.div>
            )}

            {step === "generating" && (
                <div className="flex flex-col items-center justify-center py-20 space-y-8">
                    <div className="relative">
                        <div className="h-32 w-32 rounded-full border-4 border-white/5 border-t-cima-gold animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Sparkles className="h-10 w-10 text-cima-gold animate-pulse" />
                        </div>
                    </div>
                    <div className="text-center space-y-4">
                        <p className="text-sm font-black text-white uppercase tracking-tighter">Renderizando Contrato Legal</p>
                        <div className="w-64 h-2 bg-white/5 rounded-full overflow-hidden mx-auto">
                            <motion.div
                                className="h-full bg-cima-gold shadow-[0_0_15px_rgba(200,169,110,0.5)]"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="text-[9px] text-white/30 font-mono uppercase tracking-widest">Inyectando datos con arquitectura Cima-Sign...</p>
                    </div>
                </div>
            )}

            {step === "result" && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    <div className="bg-gradient-to-br from-cima-gold/20 to-transparent border border-cima-gold/30 rounded-3xl p-10 flex flex-col items-center text-center space-y-6">
                        <div className="h-20 w-16 bg-white rounded-lg shadow-2xl relative overflow-hidden group">
                            <div className="p-2 space-y-1">
                                <div className="h-1 w-full bg-slate-200 rounded" />
                                <div className="h-1 w-3/4 bg-slate-200 rounded" />
                                <div className="h-1 w-full bg-slate-200 rounded" />
                                <div className="h-4 w-full bg-cima-gold/20 rounded mt-4" />
                                <div className="h-1 w-1/2 bg-slate-200 rounded mt-4 ml-auto" />
                            </div>
                            <div className="absolute inset-0 bg-cima-gold/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        <div>
                            <h4 className="text-lg font-black text-white mb-2">¡Documento Generado con Éxito!</h4>
                            <p className="text-[10px] text-white/40 font-medium">El archivo PDF está listo para descarga y firma digital.</p>
                        </div>

                        <div className={`w-full max-w-sm grid transition-all ${isMobilePreview ? "grid-cols-1 gap-2" : "grid-cols-2 gap-4"}`}>
                            <button
                                onClick={() => setShowPreview(true)}
                                className="py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white/60 uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                            >
                                <Eye className="h-4 w-4" /> Previsualizar
                            </button>
                            <button
                                onClick={() => { setShowPreview(true); setTimeout(handleDownloadPDF, 300); }}
                                className="py-4 bg-cima-gold text-black rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-cima-gold/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                            >
                                <Download className="h-4 w-4" /> Descargar PDF
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-bold text-white/40 hover:text-white hover:bg-white/[0.05] transition-all">
                            <Globe className="h-4 w-4" /> Enviar por Correo
                        </button>
                        <button className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-bold text-white/40 hover:text-white hover:bg-white/[0.05] transition-all">
                            <MessageSquare className="h-4 w-4" /> Enviar WhatsApp
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

/* ·· Messages View ········································· */
/* ·· Messages View ········································· */
function MessagesView({ messages }: { messages: LiveMessage[] }) {
    const [isNurturing, setIsNurturing] = useState(false);
    const [nurtureStep, setNurtureStep] = useState(0);

    const startNurtureSimulation = () => {
        setIsNurturing(true);
        setNurtureStep(1);
        setTimeout(() => setNurtureStep(2), 2000);
        setTimeout(() => setNurtureStep(3), 4500);
        setTimeout(() => {
            setIsNurturing(false);
            setNurtureStep(0);
        }, 7000);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-2 px-1">
                <h3 className="font-serif text-[18px] font-black text-white tracking-tight">Bandeja de Entrada</h3>
                <div className="flex gap-2">
                    <button
                        onClick={startNurtureSimulation}
                        disabled={isNurturing}
                        className={`px-3 py-1.5 rounded-full flex items-center gap-2 text-[8px] font-black uppercase tracking-widest transition-all ${isNurturing ? "bg-cima-gold/50 text-black animate-pulse cursor-not-allowed" : "bg-cima-gold text-black hover:bg-white shadow-lg shadow-cima-gold/20"}`}
                    >
                        <Sparkles className="h-3 w-3" />
                        {isNurturing ? "Nutriendo Lead..." : "Simular Nutrición IA"}
                    </button>
                    <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[8px] font-black text-white/40 uppercase tracking-widest">
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
                                    <h4 className="font-serif text-white font-bold text-sm">Cima AI Nurture en Proceso</h4>
                                    <p className="text-[10px] text-cima-gold/60 font-medium">Automatizando el cierre con Roberto G.</p>
                                </div>

                                <div className="space-y-2">
                                    <div className={`p-3 rounded-xl rounded-tl-none border transition-all duration-500 ${nurtureStep >= 1 ? "bg-white/10 border-white/20 opacity-100" : "opacity-0"}`}>
                                        <p className="text-[11px] text-white/80 italic">"Hola Roberto, vi que te interesó el Penthouse. El asesor está en camino a una firma, ¿te gustaría que te agende una visita hoy mismo?"</p>
                                    </div>
                                    <div className={`p-3 rounded-xl rounded-tr-none border ml-auto max-w-[80%] transition-all duration-500 ${nurtureStep >= 2 ? "bg-cima-gold/20 border-cima-gold/40 opacity-100 translate-x-0" : "opacity-0 translate-x-4"}`}>
                                        <p className="text-[11px] text-cima-gold font-bold">"¡Excelente! A las 5:00 PM me queda perfecto."</p>
                                    </div>
                                    <div className={`p-3 rounded-xl rounded-tl-none border bg-green-500/20 border-green-500/40 transition-all duration-500 ${nurtureStep >= 3 ? "opacity-100" : "opacity-0"}`}>
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
                            : "bg-white/[0.02] border border-white/5 hover:border-white/10 opacity-70"
                            }`}
                    >
                        <div className="flex items-start gap-4">
                            <div className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${msg.unread ? "bg-cima-gold text-black" : "bg-white/5 text-white/20"}`}>
                                {msg.isAi ? <Sparkles className="h-5 w-5" /> : <span className="text-sm font-bold">{msg.from.charAt(0)}</span>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1.5">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[13px] font-bold ${msg.unread ? "text-white" : "text-white/50"}`}>{msg.from}</span>
                                        {msg.isAi && <span className="text-[8px] font-black text-cima-gold uppercase bg-cima-gold/10 px-2 py-0.5 rounded border border-cima-gold/20">Cima AI</span>}
                                    </div>
                                    <span className="text-[9px] font-medium text-white/20 whitespace-nowrap">{msg.time}</span>
                                </div>
                                <p className={`text-[12px] leading-relaxed line-clamp-2 ${msg.unread ? "text-white/70 font-medium" : "text-white/30"}`}>{msg.message}</p>
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
