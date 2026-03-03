"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Instagram, Facebook, Globe, Users as UsersIcon, Timer, QrCode, Play, Pause, RotateCcw, Pencil, PlayCircle, StopCircle, Layout, Home, ChevronRight, Monitor, Maximize2, Eye } from "lucide-react";
import DemoAdminLive from "@/components/demo/DemoAdminLive";
import DemoPortal from "@/components/demo/DemoPortal";
import DemoLandingExample from "@/components/demo/DemoLandingExample";
import { DEMO_PLANS, type PlanTier } from "@/lib/config/demo-plans";

export interface LiveLead {
    id: string;
    name: string;
    phone: string;
    source: string;
    sourceIcon: any;
    status: string;
    date: string;
    property: string;
    color: string;
    score?: number;
    isAiQualified?: boolean;
}

export interface LiveMessage {
    id: string;
    from: string;
    message: string;
    time: string;
    unread: boolean;
    isAi?: boolean;
}

const INITIAL_LEADS: LiveLead[] = [
    { id: "1", name: "Ana Martínez", phone: "81 2345 6789", source: "Instagram", sourceIcon: Instagram, status: "nuevo", date: "Hace 12 min", property: "Residencia Las Misiones", color: "text-pink-400 bg-pink-500/10", score: 98, isAiQualified: true },
    { id: "2", name: "Carlos López", phone: "81 9876 5432", source: "Marketplace", sourceIcon: Facebook, status: "contactado", date: "Hace 1 hora", property: "Depto. Torre LOVFT", color: "text-blue-400 bg-blue-500/10", score: 85 },
    { id: "3", name: "María Garza", phone: "81 5555 1234", source: "Landing", sourceIcon: Globe, status: "calificado", date: "Hace 3 horas", property: "Residencia Contry Sol", color: "text-emerald-400 bg-emerald-500/10", score: 92, isAiQualified: true },
    { id: "4", name: "Roberto Treviño", phone: "81 4444 9876", source: "Referido", sourceIcon: UsersIcon, status: "visita_agendada", date: "Ayer", property: "Pent. Santa María", color: "text-amber-400 bg-amber-500/10", score: 78 },
    { id: "5", name: "Sofía Villarreal", phone: "81 3333 5678", source: "Instagram", sourceIcon: Instagram, status: "en_negociacion", date: "Hace 2 días", property: "Casa Valle Poniente", color: "text-pink-400 bg-pink-500/10", score: 95, isAiQualified: true },
    { id: "6", name: "Familia Rodríguez", phone: "81 2222 3456", source: "Marketplace", sourceIcon: Facebook, status: "nuevo", date: "Hace 5 min", property: "Residencia Las Misiones", color: "text-blue-400 bg-blue-500/10", score: 64 },
    { id: "7", name: "Ing. Pedro Salazar", phone: "81 1111 7890", source: "Landing", sourceIcon: Globe, status: "contactado", date: "Hace 4 horas", property: "Depto. Torre LOVFT", color: "text-emerald-400 bg-emerald-500/10", score: 88 },
];

const INITIAL_MESSAGES: LiveMessage[] = [
    { id: "1", from: "Familia Rodríguez", message: "Hola, ¿podemos reagendar la visita para las 12?", time: "Hace 5 min", unread: true },
    { id: "2", from: "Ing. Roberto M.", message: "Ya firmé el contrato, ¿cuándo hacemos las fotos?", time: "Hace 20 min", unread: true },
    { id: "3", from: "Dra. Sofía L.", message: "¿Hubo alguna oferta nueva por la casa?", time: "Hace 1 hora", unread: true },
    { id: "4", from: "Carlos López", message: "Me interesa mucho, ¿pueden bajar un poco el precio?", time: "Hace 3 horas", unread: false },
    { id: "5", from: "Sr. Hernández", message: "Gracias por las fotos, se ven increíbles 🙌", time: "Ayer", unread: false },
];

const NARRATIVE: Record<View, { title: string; desc: string }> = {
    landing: {
        title: "Captación Automática",
        desc: "Cada propiedad tiene su propia Landing Page de alto impacto diseñada para convertir visitantes en leads cualificados."
    },
    admin: {
        title: "Control Total de Operaciones",
        desc: "El centro neurálgico del asesor. Aquí se gestiona el pipeline de ventas, los analíticos y la comunicación con el cliente."
    },
    portal: {
        title: "Transparencia que Enamora",
        desc: "El Portal del Dueño reduce el estrés del cliente y las llamadas de seguimiento, mostrando el progreso real 24/7."
    }
};

type View = "admin" | "portal" | "landing";

/* ΓöÇΓöÇΓöÇ Presentation Timer ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
function PresentationTimer() {
    const [seconds, setSeconds] = useState(0);
    const [running, setRunning] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (running) {
            intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [running]);

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const isOvertime = seconds > 300; // 5 min

    return (
        <div className="flex items-center gap-1">
            <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all ${isOvertime
                ? "bg-red-500/10 border-red-500/20"
                : "bg-white/5 border-white/10"
                }`}>
                <Timer className={`h-3 w-3 ${isOvertime ? "text-red-400" : "text-white/40"}`} />
                <span className={`text-[10px] font-mono font-bold tabular-nums ${isOvertime ? "text-red-400" : "text-white/50"}`}>
                    {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
                </span>
            </div>
            <button
                onClick={() => setRunning(!running)}
                className="p-1.5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all"
                title={running ? "Pausar" : "Iniciar"}
            >
                {running
                    ? <Pause className="h-3 w-3 text-white/40" />
                    : <Play className="h-3 w-3 text-white/40" />
                }
            </button>
            {seconds > 0 && (
                <button
                    onClick={() => { setSeconds(0); setRunning(false); }}
                    className="p-1.5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all"
                    title="Reiniciar"
                >
                    <RotateCcw className="h-3 w-3 text-white/40" />
                </button>
            )}
        </div>
    );
}

/* ΓöÇΓöÇΓöÇ QR Code (SVG pattern) ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
function QROverlay({ onClose, title, desc }: { onClose: () => void; title?: string; desc?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 text-center"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-[0_0_50px_rgba(200,169,110,0.3)] border border-cima-gold/20"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-6 relative">
                    <div className="absolute inset-0 bg-cima-gold/10 blur-3xl rounded-full" />
                    <div className="h-56 w-56 mx-auto bg-white border border-gray-100 rounded-3xl flex items-center justify-center relative shadow-inner p-4">
                        <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent("https://propiedades-mty.vercel.app/vende-mas")}&margin=10&color=C8A96E`}
                            alt="QR Code"
                            className="w-full h-full"
                        />
                        <div className="absolute inset-0 border-[12px] border-white pointer-events-none rounded-[1.4rem]" />
                    </div>
                </div>
                <h3 className="text-lg font-heading font-black text-gray-900 mb-2">{title || "Mobile Mirroring"}</h3>
                <p className="text-xs text-gray-500 leading-relaxed opacity-80">{desc || "Escanea este código para ver cómo se adapta la experiencia a un dispositivo móvil en tiempo real."}</p>

                <button
                    onClick={onClose}
                    className="mt-8 w-full bg-black text-white py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-900 transition-all border border-transparent active:scale-95"
                >
                    Entiendo, cerrar
                </button>
                <p className="mt-4 text-[8px] text-gray-400 font-bold uppercase tracking-widest">Powered by Cima Pro Technology</p>
            </motion.div>
        </motion.div>
    );
}

/* === MAIN COMPONENT ========================================================================================= */
export default function LiveDemoClient() {
    const [view, setView] = useState<View>("admin");
    const [tier, setTier] = useState<PlanTier>("premium");
    const [showQR, setShowQR] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [upgradeFlash, setUpgradeFlash] = useState(false);
    const [agentName, setAgentName] = useState("");
    const [editingName, setEditingName] = useState(false);
    const [autoDemo, setAutoDemo] = useState(false);
    const [focusMode, setFocusMode] = useState(false);
    const autoDemoRef = useRef<NodeJS.Timeout | null>(null);
    const [autoDemoStep, setAutoDemoStep] = useState(0);
    const plan = DEMO_PLANS[tier];
    const nameInputRef = useRef<HTMLInputElement>(null);

    // Shared State
    const [leads, setLeads] = useState<LiveLead[]>(INITIAL_LEADS);
    const [messages, setMessages] = useState<LiveMessage[]>(INITIAL_MESSAGES);
    const [lastLeadId, setLastLeadId] = useState("");

    const handleAddLead = useCallback((newLeadData?: Partial<LiveLead>) => {
        const id = Math.random().toString(36).substr(2, 9);
        const sourceOptions = [
            { name: "Instagram", icon: Instagram, color: "text-pink-400 bg-pink-500/10" },
            { name: "Marketplace", icon: Facebook, color: "text-blue-400 bg-blue-500/10" },
            { name: "Landing", icon: Globe, color: "text-emerald-400 bg-emerald-500/10" }
        ];
        const source = sourceOptions[Math.floor(Math.random() * sourceOptions.length)];

        const lead: LiveLead = {
            id,
            name: newLeadData?.name || "Nuevo Interesado",
            phone: newLeadData?.phone || "81 0000 0000",
            source: source.name,
            sourceIcon: source.icon,
            status: "nuevo",
            date: "Justo ahora",
            property: "Residencia Las Misiones",
            color: source.color,
            score: Math.floor(75 + Math.random() * 24), // Random high score for new leads
            isAiQualified: Math.random() > 0.3,
            ...newLeadData
        };

        setLeads(prev => [lead, ...prev]);
        setLastLeadId(id);

        // Automaticaly clear last lead ID after some time
        setTimeout(() => setLastLeadId(""), 5000);
    }, []);

    const handleUpdateLeadStatus = useCallback((leadId: string, newStatus: string) => {
        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    }, []);

    const handleAddMessage = useCallback((from: string, text: string, isAi: boolean = false) => {
        const newMessage: LiveMessage = {
            id: Math.random().toString(36).substr(2, 9),
            from,
            message: text,
            time: "Justo ahora",
            unread: !isAi,
            isAi
        };
        setMessages(prev => [newMessage, ...prev]);

        // Simulated AI Response if it was a user message
        if (!isAi) {
            setTimeout(() => {
                const aiResponse: LiveMessage = {
                    id: Math.random().toString(36).substr(2, 9),
                    from: "Cima AI Assistant",
                    message: `┬íHola ${from}! Gracias por tu inter├⌐s. Un asesor se pondr├í en contacto contigo pronto. ┬┐Te gustar├¡a agendar una visita guiada?`,
                    time: "Justo ahora",
                    unread: true,
                    isAi: true
                };
                setMessages(prev => [aiResponse, ...prev]);
            }, 2000);
        }
    }, []);

    const TIER_ORDER: PlanTier[] = ["basico", "profesional", "premium"];

    // Auto-demo sequence
    const AUTO_STEPS: { view: View; tab?: any; duration: number; label: string }[] = [
        { view: "landing", duration: 5000, label: "Landing" },
        { view: "admin", tab: "propiedades", duration: 5000, label: "Propiedades" },
        { view: "admin", tab: "leads", duration: 4000, label: "Leads" },
        { view: "admin", tab: "analiticos", duration: 4000, label: "Anal├¡ticos" },
        { view: "portal", duration: 5000, label: "Portal" },
    ];

    const startAutoDemo = useCallback(() => {
        setAutoDemo(true);
        setAutoDemoStep(0);
        setView(AUTO_STEPS[0].view);
    }, []);

    const stopAutoDemo = useCallback(() => {
        setAutoDemo(false);
        if (autoDemoRef.current) clearTimeout(autoDemoRef.current);
    }, []);

    useEffect(() => {
        if (!autoDemo) return;
        const step = AUTO_STEPS[autoDemoStep];
        if (!step) { setAutoDemo(false); return; }
        setView(step.view);
        autoDemoRef.current = setTimeout(() => {
            if (autoDemoStep < AUTO_STEPS.length - 1) {
                setAutoDemoStep(s => s + 1);
            } else {
                setAutoDemo(false);
            }
        }, step.duration);
        return () => { if (autoDemoRef.current) clearTimeout(autoDemoRef.current); };
    }, [autoDemo, autoDemoStep]);

    function switchTier(newTier: PlanTier) {
        const oldIdx = TIER_ORDER.indexOf(tier);
        const newIdx = TIER_ORDER.indexOf(newTier);
        setTier(newTier);
        if (newIdx > oldIdx) {
            setUpgradeFlash(true);
            setTimeout(() => setUpgradeFlash(false), 600);
        }
    }

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    }

    function handleNavigateToLeads() {
        setView("admin");
    }

    useEffect(() => {
        if (editingName && nameInputRef.current) nameInputRef.current.focus();
    }, [editingName]);

    const VIEW_LABELS: Record<View, string> = {
        admin: "≡ƒæ¿ΓÇì≡ƒÆ╝ Esto es lo que VE EL ASESOR ΓÇö gesti├│n de propiedades, leads, visitas y anal├¡ticos",
        portal: "≡ƒÅá Esto es lo que VE EL PROPIETARIO ΓÇö transparencia total sobre el progreso de venta",
        landing: "≡ƒîÉ Esta es la LANDING PAGE para cada propiedad ΓÇö captura de leads autom├ítica",
    };

    return (
        <div className={`min-h-screen bg-black text-white selection:bg-cima-gold selection:text-black font-sans ${focusMode ? "pb-0" : "pb-20"}`}>
            {/* Upgrade flash overlay */}
            <AnimatePresence>
                {upgradeFlash && (
                    <motion.div
                        initial={{ opacity: 0.7 }}
                        animate={{ opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        className="fixed inset-0 z-[60] bg-cima-gold/5 pointer-events-none"
                    />
                )}
            </AnimatePresence>

            {/* ΓöÇΓöÇ Top Bar / Controls ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */}
            <AnimatePresence>
                {!focusMode && (
                    <motion.div
                        initial={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="sticky top-0 z-[100] bg-black/80 backdrop-blur-xl border-b border-white/5"
                    >
                        <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="h-7 w-7 rounded-lg bg-cima-gold flex items-center justify-center shadow-lg shadow-cima-gold/20">
                                    <Monitor className="h-3.5 w-3.5 text-black" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-white">Demo en Vivo</span>
                                    {editingName ? (
                                        <input
                                            ref={nameInputRef}
                                            value={agentName}
                                            onChange={(e) => setAgentName(e.target.value)}
                                            onBlur={() => setEditingName(false)}
                                            onKeyDown={(e) => e.key === "Enter" && setEditingName(false)}
                                            placeholder="Nombre del asesor"
                                            className="text-[8px] font-mono text-cima-gold uppercase tracking-widest bg-transparent border-b border-cima-gold/30 outline-none w-32 pb-0.5"
                                        />
                                    ) : (
                                        <button
                                            onClick={() => setEditingName(true)}
                                            className="flex items-center gap-1 text-[8px] font-mono text-cima-gold uppercase tracking-widest hover:text-white transition-all text-left"
                                        >
                                            {agentName || "Plataforma Inmobiliaria"}
                                            <Pencil className="h-2 w-2 opacity-30" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* 3-way Toggle */}
                            <div className="flex items-center gap-0.5 bg-white/[0.05] p-1 rounded-xl border border-white/10">
                                {([
                                    { id: "landing" as View, icon: Globe, label: "Landing", mobileLabel: "Landing" },
                                    { id: "admin" as View, icon: Layout, label: "Panel del Asesor", mobileLabel: "Asesor" },
                                    { id: "portal" as View, icon: Home, label: "Portal Propietario", mobileLabel: "Portal" },
                                ]).map((tab, i) => (
                                    <React.Fragment key={tab.id}>
                                        {i > 0 && <ChevronRight className="h-3 w-3 text-white/10 mx-0.5 hidden sm:block" />}
                                        <button
                                            onClick={() => setView(tab.id)}
                                            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-[8px] sm:text-[9px] font-bold uppercase tracking-wider transition-all ${view === tab.id
                                                ? "bg-cima-gold text-black shadow-lg shadow-cima-gold/20"
                                                : "text-white/40 hover:text-white/60 hover:bg-white/5"
                                                }`}
                                        >
                                            <tab.icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                            <span className="hidden sm:inline">{tab.label}</span>
                                            <span className="sm:hidden">{tab.mobileLabel}</span>
                                        </button>
                                    </React.Fragment>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                {/* Plan Selector */}
                                <div className="hidden md:flex items-center gap-0.5 bg-white/[0.03] p-0.5 rounded-lg border border-white/10">
                                    {([
                                        { id: "basico" as PlanTier, label: "Starter", price: plan.tier === "basico" ? plan.price : DEMO_PLANS.basico.price },
                                        { id: "profesional" as PlanTier, label: "Pro", price: plan.tier === "profesional" ? plan.price : DEMO_PLANS.profesional.price },
                                        { id: "premium" as PlanTier, label: "Team", price: plan.tier === "premium" ? plan.price : DEMO_PLANS.premium.price },
                                    ]).map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => switchTier(t.id)}
                                            className={`px-2.5 py-1.5 rounded-md text-[8px] font-bold uppercase tracking-wider transition-all ${tier === t.id
                                                ? "bg-cima-gold text-black shadow-lg shadow-cima-gold/20"
                                                : "text-white/30 hover:text-white/50 hover:bg-white/5"
                                                }`}
                                        >
                                            <span>{t.label}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Timer */}
                                <div className="hidden xl:flex">
                                    <PresentationTimer />
                                </div>

                                {/* QR */}
                                <button
                                    onClick={() => setShowQR(true)}
                                    className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all"
                                    title="Mostrar QR"
                                >
                                    <QrCode className="h-3.5 w-3.5 text-white/40" />
                                </button>

                                {/* Auto Demo */}
                                <button
                                    onClick={autoDemo ? stopAutoDemo : startAutoDemo}
                                    className={`hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[8px] font-bold uppercase tracking-wider transition-all ${autoDemo
                                        ? "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
                                        : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white"
                                        }`}
                                    title={autoDemo ? "Detener Auto Demo" : "Iniciar Auto Demo"}
                                >
                                    {autoDemo ? <StopCircle className="h-3 w-3" /> : <PlayCircle className="h-3 w-3" />}
                                    {autoDemo ? `Auto` : "Auto Demo"}
                                </button>

                                {/* Fullscreen */}
                                <button
                                    onClick={toggleFullscreen}
                                    className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all"
                                    title="Pantalla completa"
                                >
                                    <Maximize2 className="h-3.5 w-3.5 text-white/40" />
                                </button>
                            </div>
                        </div>

                        {/* Context bar */}
                        <div className="border-t border-white/5 px-4 py-1.5 flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                <span className="text-[7px] text-white/20 uppercase font-bold tracking-widest">Paquete:</span>
                                <span className="text-[8px] font-bold text-cima-gold">{plan.name}</span>
                                <span className="text-[7px] text-white/15">ΓÇó</span>
                                <span className="text-[7px] text-white/20">{plan.price}</span>
                                <span className="text-[7px] text-white/15">ΓÇó</span>
                                <span className="text-[7px] text-white/20">{plan.deliveryDays}d</span>
                            </div>
                        </div>

                        {/* ΓöÇΓöÇ Narrative Caption ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */}
                        <div className="bg-cima-gold/5 border-b border-cima-gold/10 px-4 py-2 relative overflow-hidden">
                            <motion.div
                                key={view}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-baseline gap-3"
                            >
                                <span className="text-[10px] font-black text-cima-gold uppercase tracking-tighter whitespace-nowrap">
                                    {NARRATIVE[view].title}
                                </span>
                                <span className="text-[9px] text-white/60 font-medium leading-tight">
                                    {NARRATIVE[view].desc}
                                </span>
                            </motion.div>
                            {/* Animated scanning line */}
                            <motion.div
                                initial={{ left: "-10%" }}
                                animate={{ left: "110%" }}
                                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                                className="absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-cima-gold/10 to-transparent skew-x-12"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Focus Toggle (Always visible but subtle) */}
            <button
                onClick={() => setFocusMode(!focusMode)}
                className={`fixed top-20 right-6 z-[101] p-3 rounded-2xl border transition-all ${focusMode
                    ? "bg-cima-gold text-black border-cima-gold shadow-2xl scale-110"
                    : "bg-black/40 backdrop-blur-md border-white/5 text-white/20 hover:text-white hover:border-white/20"
                    }`}
                title={focusMode ? "Salir de Modo Enfoque" : "Modo Enfoque (Ocultar UI)"}
            >
                {focusMode ? <Eye className="h-4 w-4" /> : <Eye className="h-4 w-4 opacity-50" />}
            </button>
            {/* ΓöÇΓöÇ Content Area ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={view}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    {view === "admin" && (
                        <DemoAdminLive
                            plan={plan}
                            agentName={agentName}
                            onNavigateToLeads={handleNavigateToLeads}
                            externalTab={AUTO_STEPS[autoDemoStep]?.tab}
                            leads={leads}
                            onUpdateLeadStatus={handleUpdateLeadStatus}
                            newLeadId={lastLeadId}
                            messages={messages}
                            onAddMessage={handleAddMessage}
                        />
                    )}
                    {view === "portal" && <DemoPortal plan={plan} />}
                    {view === "landing" && (
                        <DemoLandingExample
                            plan={plan}
                            onLeadCapture={handleAddLead}
                            onSendMessage={handleAddMessage}
                            messages={messages}
                        />
                    )}
                </motion.div>
            </AnimatePresence>

            {/* ΓöÇΓöÇ Bottom CTA bar ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */}
            {view !== "landing" && !focusMode && (
                <div className="fixed bottom-0 inset-x-0 z-50 bg-gradient-to-t from-black via-black/90 to-transparent pt-8 pb-4 px-4 pointer-events-none">
                    <div className="max-w-lg mx-auto flex items-center gap-3 pointer-events-auto">
                        <a
                            href={`https://wa.me/${process.env.NEXT_PUBLIC_CIMA_WA || "528100000000"}?text=${encodeURIComponent(`Hola, vi el demo en vivo y me interesa el plan ${plan.name} (${plan.price}). ${agentName ? `Soy ${agentName}.` : ""}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 bg-cima-gold text-black px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-white transition-all shadow-lg shadow-cima-gold/20"
                        >
                            Activar mi cuenta ┬╖ {plan.name}
                        </a>
                        <button
                            onClick={() => setShowQR(true)}
                            className="flex items-center gap-2 border border-white/10 bg-white/5 text-white/60 px-5 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-white/10 hover:text-white transition-all"
                        >
                            <QrCode className="h-3.5 w-3.5" />
                            QR
                        </button>
                    </div>
                </div>
            )}

            {/* ΓöÇΓöÇ QR Overlay ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */}
            <AnimatePresence>
                {showQR && (
                    <QROverlay
                        onClose={() => setShowQR(false)}
                        title={view === "landing" ? "Vista Móvil del Comprador" : view === "admin" ? "Notificaciones en tu Móvil" : "Portal para el Dueño (Móvil)"}
                        desc={view === "landing"
                            ? "Escanea con tu celular para ver cómo interactúa un comprador real con esta propiedad."
                            : view === "admin"
                                ? "Manten el control de tus propiedades y recibe alertas de nuevos leads estés donde estés."
                                : "Tu cliente podríá seguir el progreso de su venta cómodamente desde su smartphone."
                        }
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
