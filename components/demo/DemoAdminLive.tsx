"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Layout, Users, Target, TrendingUp, MessageSquare,
    Settings, Plus, Eye, Share2, BarChart3,
    Bell, Zap, Phone, Instagram, Globe, Facebook,
    Calendar, Clock, CheckCircle2, AlertCircle, MapPin,
    ArrowUpRight, ArrowDownRight, Mail, ChevronRight
} from "lucide-react";

/* ─── Types ────────────────────────────────────────────────── */
type SidebarTab = "propiedades" | "leads" | "visitas" | "analiticos" | "mensajes";

/* ─── Mock Data ────────────────────────────────────────────── */
const PROPERTIES = [
    { name: "Residencia Las Misiones", price: "$12.4M", status: "Venta", owner: "Fam. García", img: "/cocina-despues.png", hits: 142, trend: [30, 45, 38, 52, 60, 55, 72] },
    { name: "Depto. Torre LOVFT", price: "$4.2M", status: "Exclusiva", owner: "Ing. Roberto M.", img: "/estancia-despues.png", hits: 89, trend: [20, 25, 35, 30, 40, 38, 45] },
    { name: "Residencia Contry Sol", price: "$8.9M", status: "Venta", owner: "Dra. Sofía L.", img: "/recamara-despues.png", hits: 56, trend: [10, 15, 20, 25, 22, 30, 28] },
    { name: "Casa Valle Poniente", price: "$6.1M", status: "Venta", owner: "Sr. Hernández", img: "/cocina-despues.png", hits: 34, trend: [5, 8, 12, 10, 15, 18, 20] },
    { name: "Pent. Santa María", price: "$15.8M", status: "Exclusiva", owner: "Lic. Pérez", img: "/estancia-despues.png", hits: 201, trend: [50, 60, 55, 70, 80, 75, 90] },
];

const LEADS = [
    { name: "Ana Martínez", phone: "81 2345 6789", source: "Instagram", sourceIcon: Instagram, status: "nuevo", date: "Hace 12 min", property: "Residencia Las Misiones", color: "text-pink-400 bg-pink-500/10" },
    { name: "Carlos López", phone: "81 9876 5432", source: "Marketplace", sourceIcon: Facebook, status: "contactado", date: "Hace 1 hora", property: "Depto. Torre LOVFT", color: "text-blue-400 bg-blue-500/10" },
    { name: "María Garza", phone: "81 5555 1234", source: "Landing", sourceIcon: Globe, status: "calificado", date: "Hace 3 horas", property: "Residencia Contry Sol", color: "text-emerald-400 bg-emerald-500/10" },
    { name: "Roberto Treviño", phone: "81 4444 9876", source: "Referido", sourceIcon: Users, status: "visita_agendada", date: "Ayer", property: "Pent. Santa María", color: "text-amber-400 bg-amber-500/10" },
    { name: "Sofía Villarreal", phone: "81 3333 5678", source: "Instagram", sourceIcon: Instagram, status: "en_negociacion", date: "Hace 2 días", property: "Casa Valle Poniente", color: "text-pink-400 bg-pink-500/10" },
    { name: "Familia Rodríguez", phone: "81 2222 3456", source: "Marketplace", sourceIcon: Facebook, status: "nuevo", date: "Hace 5 min", property: "Residencia Las Misiones", color: "text-blue-400 bg-blue-500/10" },
    { name: "Ing. Pedro Salazar", phone: "81 1111 7890", source: "Landing", sourceIcon: Globe, status: "contactado", date: "Hace 4 horas", property: "Depto. Torre LOVFT", color: "text-emerald-400 bg-emerald-500/10" },
];

const VISITS = [
    { prospect: "Familia Rodríguez", property: "Residencia Las Misiones", date: "Hoy", time: "11:00 AM", status: "confirmada", sentiment: "positive" },
    { prospect: "Ing. Luis Garza", property: "Depto. Torre LOVFT", date: "Hoy", time: "4:30 PM", status: "pendiente", sentiment: null },
    { prospect: "Sra. Ana Treviño", property: "Residencia Las Misiones", date: "Mañana", time: "10:00 AM", status: "confirmada", sentiment: null },
    { prospect: "Carlos López", property: "Pent. Santa María", date: "Mañana", time: "2:00 PM", status: "confirmada", sentiment: null },
    { prospect: "María Elena Ramos", property: "Residencia Contry Sol", date: "28 Feb", time: "11:30 AM", status: "realizada", sentiment: "positive" },
    { prospect: "Roberto Treviño", property: "Pent. Santa María", date: "27 Feb", time: "5:00 PM", status: "realizada", sentiment: "neutral" },
    { prospect: "Lic. Pérez (familiar)", property: "Casa Valle Poniente", date: "26 Feb", time: "3:00 PM", status: "cancelada", sentiment: null },
];

const MESSAGES = [
    { from: "Familia Rodríguez", message: "Hola, ¿podemos reagendar la visita para las 12?", time: "Hace 5 min", unread: true },
    { from: "Ing. Roberto M.", message: "Ya firmé el contrato, ¿cuándo hacemos las fotos?", time: "Hace 20 min", unread: true },
    { from: "Dra. Sofía L.", message: "¿Hubo alguna oferta nueva por la casa?", time: "Hace 1 hora", unread: true },
    { from: "Carlos López", message: "Me interesa mucho, ¿pueden bajar un poco el precio?", time: "Hace 3 horas", unread: false },
    { from: "Sr. Hernández", message: "Gracias por las fotos, se ven increíbles 👏", time: "Ayer", unread: false },
];

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
            <path d={areaD} fill={`url(#grad-${color.replace("#", "")})`} />
            <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="2" fill={color} />
        </svg>
    );
}

/* ─── Rotating Notification Toast ──────────────────────────── */
function RotatingToast() {
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
                    className="fixed bottom-24 right-6 z-50 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl max-w-xs"
                >
                    <div className="flex items-start gap-3">
                        <div className={`h-8 w-8 rounded-lg ${notif.color} flex items-center justify-center shrink-0`}>
                            <notif.icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-black text-white uppercase tracking-wider mb-1">{notif.text}</p>
                            <p className="text-[9px] text-white/40">{notif.sub}</p>
                            <p className="text-[8px] text-white/20 mt-1 font-mono">Ahora mismo</p>
                        </div>
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shrink-0 mt-1" />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/* ─── Bar Chart Component ──────────────────────────────────── */
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

/* ═══ MAIN COMPONENT ═══════════════════════════════════════ */
export default function DemoAdminLive() {
    const [activeTab, setActiveTab] = useState<SidebarTab>("propiedades");

    const navItems: { id: SidebarTab; icon: React.ElementType; label: string; badge?: string }[] = [
        { id: "propiedades", icon: Layout, label: "Propiedades" },
        { id: "leads", icon: Users, label: "Leads", badge: "7" },
        { id: "visitas", icon: Target, label: "Visitas", badge: "2" },
        { id: "analiticos", icon: TrendingUp, label: "Analíticos" },
        { id: "mensajes", icon: MessageSquare, label: "Mensajes", badge: "3" },
    ];

    const STATS = [
        { label: "Vistas Totales", value: "1,247", change: "+12%", icon: Eye, data: [180, 220, 195, 310, 280, 350, 420] },
        { label: "Leads Activos", value: "23", change: "+5", icon: Users, data: [8, 10, 12, 15, 14, 18, 23] },
        { label: "Visitas Mes", value: "18", change: "+3", icon: Target, data: [5, 7, 6, 9, 11, 14, 18] },
        { label: "Conversión", value: "4.2%", change: "+0.8%", icon: TrendingUp, data: [2.1, 2.5, 3.0, 2.8, 3.4, 3.8, 4.2] },
    ];

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-white">
            <div className="flex">
                {/* ── Sidebar ─────────────────────────────── */}
                <div className="hidden lg:flex flex-col w-56 min-h-screen border-r border-white/5 bg-black/40 p-5">
                    <div className="flex items-center gap-2.5 mb-10">
                        <div className="h-8 w-8 rounded-lg bg-cima-gold flex items-center justify-center shadow-lg shadow-cima-gold/20">
                            <Layout className="h-4 w-4 text-black" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-wider text-white">Panel</span>
                            <span className="text-[8px] font-mono text-cima-gold uppercase tracking-widest">Team / Agency</span>
                        </div>
                    </div>

                    <nav className="space-y-1.5 flex-1">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all ${activeTab === item.id
                                    ? "bg-cima-gold/10 text-cima-gold border border-cima-gold/20"
                                    : "text-white/30 hover:bg-white/[0.03] hover:text-white/60"
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <item.icon className="h-3.5 w-3.5 shrink-0" />
                                    <span className="text-[9px] font-bold uppercase tracking-tight">{item.label}</span>
                                </div>
                                {item.badge && (
                                    <span className="relative h-4 w-4 rounded-full bg-cima-gold text-black text-[7px] font-black flex items-center justify-center">
                                        {item.badge}
                                        <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-500 animate-ping" />
                                        <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-500" />
                                    </span>
                                )}
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
                            <div className="h-full bg-cima-gold rounded-full shadow-[0_0_8px_rgba(200,169,110,0.4)]" style={{ width: "100%" }} />
                        </div>
                        <p className="text-[7px] text-white/40 font-mono">5/∞</p>
                    </div>
                </div>

                {/* ── Main Content ─────────────────────────── */}
                <div className="flex-1 p-6 lg:p-8">
                    {/* Mobile tabs */}
                    <div className="lg:hidden flex gap-1 mb-6 overflow-x-auto pb-2">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[8px] font-bold uppercase whitespace-nowrap transition-all ${activeTab === item.id
                                    ? "bg-cima-gold text-black"
                                    : "bg-white/5 text-white/40"
                                    }`}
                            >
                                <item.icon className="h-3 w-3" />
                                {item.label}
                                {item.badge && (
                                    <span className="h-3.5 w-3.5 rounded-full bg-red-500 text-white text-[6px] font-black flex items-center justify-center">{item.badge}</span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-xl font-heading font-black tracking-tight mb-1">
                                {activeTab === "propiedades" && "Mis Propiedades"}
                                {activeTab === "leads" && "Leads Recientes"}
                                {activeTab === "visitas" && "Agenda de Visitas"}
                                {activeTab === "analiticos" && "Analíticos"}
                                {activeTab === "mensajes" && "Mensajes"}
                            </h1>
                            <p className="text-xs text-white/40">
                                {activeTab === "propiedades" && <>Gestionando <span className="text-white font-bold">5 activos</span></>}
                                {activeTab === "leads" && <>Tienes <span className="text-white font-bold">7 leads</span> esta semana</>}
                                {activeTab === "visitas" && <>Próximas <span className="text-white font-bold">4 visitas</span> esta semana</>}
                                {activeTab === "analiticos" && <>Rendimiento de los <span className="text-white font-bold">últimos 30 días</span></>}
                                {activeTab === "mensajes" && <><span className="text-white font-bold">3 sin leer</span> · 5 conversaciones</>}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all cursor-pointer">
                                <Bell className="h-3.5 w-3.5 text-white/40" />
                                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[7px] font-black text-white flex items-center justify-center">5</span>
                                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 animate-ping opacity-30" />
                            </div>
                            <button className="flex items-center gap-2 bg-cima-gold text-black px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-wider hover:bg-white transition-all shadow-lg shrink-0">
                                <Plus className="h-3.5 w-3.5" /> Nueva
                            </button>
                        </div>
                    </div>

                    {/* Analytics Row — always visible */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                        {STATS.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white/[0.03] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-all"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <stat.icon className="h-3.5 w-3.5 text-white/20" />
                                    <span className="text-[8px] font-bold text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded-full">{stat.change}</span>
                                </div>
                                <div className="flex items-end justify-between gap-2">
                                    <div>
                                        <p className="text-lg font-heading font-bold text-white">{stat.value}</p>
                                        <p className="text-[8px] text-white/30 uppercase font-bold tracking-wider">{stat.label}</p>
                                    </div>
                                    <MiniChart data={stat.data} />
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
                            {activeTab === "propiedades" && <PropertiesView />}
                            {activeTab === "leads" && <LeadsView />}
                            {activeTab === "visitas" && <VisitsView />}
                            {activeTab === "analiticos" && <AnalyticsView />}
                            {activeTab === "mensajes" && <MessagesView />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Rotating notification toast */}
            <RotatingToast />
        </div>
    );
}

/* ═══ VIEWS ════════════════════════════════════════════════ */

/* ── Properties View ───────────────────────────────────────── */
function PropertiesView() {
    return (
        <div className="space-y-3">
            {PROPERTIES.map((prop, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-white/[0.03] border border-white/5 p-3 rounded-xl hover:border-cima-gold/30 hover:bg-white/[0.05] transition-all group"
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
                    <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-white/5">
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
                </motion.div>
            ))}
        </div>
    );
}

/* ── Leads View ────────────────────────────────────────────── */
function LeadsView() {
    return (
        <div className="space-y-3">
            {/* Pipeline summary */}
            <div className="grid grid-cols-5 gap-2 mb-4">
                {[
                    { label: "Nuevos", count: 2, color: "bg-blue-500/20 border-blue-500/30 text-blue-400" },
                    { label: "Contactados", count: 2, color: "bg-yellow-500/20 border-yellow-500/30 text-yellow-400" },
                    { label: "Calificados", count: 1, color: "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" },
                    { label: "Visita", count: 1, color: "bg-purple-500/20 border-purple-500/30 text-purple-400" },
                    { label: "Negociación", count: 1, color: "bg-cima-gold/20 border-cima-gold/30 text-cima-gold" },
                ].map((stage, i) => (
                    <div key={i} className={`border rounded-xl p-3 text-center ${stage.color}`}>
                        <p className="text-xl font-heading font-bold">{stage.count}</p>
                        <p className="text-[7px] font-bold uppercase tracking-wider opacity-70">{stage.label}</p>
                    </div>
                ))}
            </div>

            {/* Lead cards */}
            {LEADS.map((lead, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="bg-white/[0.03] border border-white/5 p-4 rounded-xl hover:border-cima-gold/30 hover:bg-white/[0.05] transition-all group"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${lead.color}`}>
                                <lead.sourceIcon className="h-4 w-4" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-0.5">
                                    <p className="text-xs font-bold text-white">{lead.name}</p>
                                    <span className={`px-1.5 py-0.5 rounded-full text-[6px] font-black uppercase border ${STATUS_MAP[lead.status].class}`}>
                                        {STATUS_MAP[lead.status].label}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-[9px]">
                                    <span className="text-white/40 flex items-center gap-1">
                                        <Phone className="h-2.5 w-2.5" /> {lead.phone}
                                    </span>
                                    <span className="text-white/20">•</span>
                                    <span className="text-white/30">{lead.source}</span>
                                    <span className="text-white/20">•</span>
                                    <span className="text-white/20 font-mono">{lead.date}</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right hidden sm:block">
                            <p className="text-[9px] text-white/30 mb-0.5">{lead.property}</p>
                            <div className="flex items-center gap-1 justify-end">
                                <Mail className="h-3 w-3 text-white/20 cursor-pointer hover:text-cima-gold transition-colors" />
                                <Phone className="h-3 w-3 text-white/20 cursor-pointer hover:text-green-400 transition-colors" />
                                <ChevronRight className="h-3 w-3 text-white/10" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

/* ── Visits View ───────────────────────────────────────────── */
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
                        <span className={`text-xs font-black uppercase tracking-wider ${date === "Hoy" ? "text-cima-gold" : date === "Mañana" ? "text-white/60" : "text-white/30"}`}>
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
                                            <span className="text-[8px] font-bold text-white/60">{visit.time.split(" ")[0]}</span>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-white">{visit.prospect}</p>
                                            <div className="flex items-center gap-2 text-[9px]">
                                                <span className="text-white/30 flex items-center gap-1">
                                                    <MapPin className="h-2.5 w-2.5" /> {visit.property}
                                                </span>
                                                <span className="text-white/20">•</span>
                                                <span className="text-white/20">{visit.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {visit.sentiment === "positive" && (
                                            <span className="text-[7px] font-bold bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded-full border border-green-500/20">
                                                ❤️ Le encantó
                                            </span>
                                        )}
                                        {visit.sentiment === "neutral" && (
                                            <span className="text-[7px] font-bold bg-yellow-500/10 text-yellow-400 px-1.5 py-0.5 rounded-full border border-yellow-500/20">
                                                🤔 Lo piensa
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

/* ── Analytics View ────────────────────────────────────────── */
function AnalyticsView() {
    return (
        <div className="space-y-6">
            {/* Big numbers */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: "Ingresos mes", value: "$847K", change: "+23%", up: true },
                    { label: "Ticket promedio", value: "$6.8M", change: "+$400K", up: true },
                    { label: "Días promedio venta", value: "18", change: "-4 días", up: true },
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

/* ── Messages View ─────────────────────────────────────────── */
function MessagesView() {
    return (
        <div className="space-y-2">
            {MESSAGES.map((msg, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className={`p-4 rounded-xl transition-all cursor-pointer ${msg.unread
                        ? "bg-cima-gold/5 border border-cima-gold/20 hover:border-cima-gold/40"
                        : "bg-white/[0.02] border border-white/5 hover:border-white/10"
                        }`}
                >
                    <div className="flex items-start gap-3">
                        <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${msg.unread ? "bg-cima-gold/20 text-cima-gold" : "bg-white/5 text-white/20"}`}>
                            <span className="text-xs font-bold">{msg.from.charAt(0)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <span className={`text-xs font-bold ${msg.unread ? "text-white" : "text-white/50"}`}>{msg.from}</span>
                                <span className="text-[8px] text-white/20 font-mono">{msg.time}</span>
                            </div>
                            <p className={`text-[11px] truncate ${msg.unread ? "text-white/60" : "text-white/30"}`}>{msg.message}</p>
                        </div>
                        {msg.unread && <div className="h-2 w-2 rounded-full bg-cima-gold shrink-0 mt-2" />}
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
