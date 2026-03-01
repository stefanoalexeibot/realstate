"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Layout, Home, Globe, ChevronRight, Monitor, Maximize2, Eye,
    Timer, QrCode, Play, Pause, RotateCcw, Pencil, PlayCircle, StopCircle
} from "lucide-react";
import DemoAdminLive from "@/components/demo/DemoAdminLive";
import DemoPortal from "@/components/demo/DemoPortal";
import DemoLandingExample from "@/components/demo/DemoLandingExample";
import { DEMO_PLANS, type PlanTier } from "@/lib/config/demo-plans";

type View = "admin" | "portal" | "landing";

/* ─── Presentation Timer ───────────────────────────────────── */
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

/* ─── QR Code (SVG pattern) ────────────────────────────────── */
function QROverlay({ onClose }: { onClose: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99] bg-black/80 backdrop-blur-sm flex items-center justify-center"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-3xl p-8 text-center max-w-xs"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-4">
                    {/* Simple QR-like visual pointing to vende-mas */}
                    <div className="h-48 w-48 mx-auto bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center relative overflow-hidden">
                        <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent("https://propiedades-mty.vercel.app/vende-mas")}&margin=10`}
                            alt="QR Code"
                            className="w-full h-full"
                        />
                    </div>
                </div>
                <p className="text-sm font-bold text-gray-900 mb-1">Escanea para más información</p>
                <p className="text-xs text-gray-500">Planes y precios disponibles</p>
            </motion.div>
        </motion.div>
    );
}

/* ═══ MAIN COMPONENT ═══════════════════════════════════════ */
export default function LiveDemoClient() {
    const [view, setView] = useState<View>("admin");
    const [tier, setTier] = useState<PlanTier>("premium");
    const [showQR, setShowQR] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [upgradeFlash, setUpgradeFlash] = useState(false);
    const [agentName, setAgentName] = useState("");
    const [editingName, setEditingName] = useState(false);
    const [autoDemo, setAutoDemo] = useState(false);
    const autoDemoRef = useRef<NodeJS.Timeout | null>(null);
    const [autoDemoStep, setAutoDemoStep] = useState(0);
    const plan = DEMO_PLANS[tier];
    const nameInputRef = useRef<HTMLInputElement>(null);

    const TIER_ORDER: PlanTier[] = ["basico", "profesional", "premium"];

    // Auto-demo sequence
    const AUTO_STEPS: { view: View; tab?: any; duration: number; label: string }[] = [
        { view: "landing", duration: 5000, label: "Landing" },
        { view: "admin", tab: "propiedades", duration: 5000, label: "Propiedades" },
        { view: "admin", tab: "leads", duration: 4000, label: "Leads" },
        { view: "admin", tab: "analiticos", duration: 4000, label: "Analíticos" },
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
        admin: "👨‍💼 Esto es lo que VE EL ASESOR — gestión de propiedades, leads, visitas y analíticos",
        portal: "🏠 Esto es lo que VE EL PROPIETARIO — transparencia total sobre el progreso de venta",
        landing: "🌐 Esta es la LANDING PAGE para cada propiedad — captura de leads automática",
    };

    return (
        <div className="min-h-screen bg-[#0A0A0B] relative">
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

            {/* ── Presenter Toolbar ─────────────────────── */}
            <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2.5">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
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

                        {/* Price & delivery badge */}
                        <div className="hidden lg:flex flex-col items-end">
                            <span className="text-[10px] font-bold text-white">{plan.price}</span>
                            <span className="text-[7px] text-white/30 font-mono">{plan.deliveryDays} días entrega</span>
                        </div>

                        {/* Timer */}
                        <div className="hidden xl:flex">
                            <PresentationTimer />
                        </div>

                        {/* Live badge */}
                        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
                            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[8px] font-bold text-green-400 uppercase tracking-widest">En Vivo</span>
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
                            {autoDemo ? `Auto (${AUTO_STEPS[autoDemoStep]?.label})` : "Auto Demo"}
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
                    <div className="flex items-center gap-2">
                        <Eye className="h-3 w-3 text-white/20" />
                        <p className="text-[9px] text-white/30">{VIEW_LABELS[view]}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-[7px] text-white/20 uppercase font-bold tracking-widest">Paquete:</span>
                        <span className="text-[8px] font-bold text-cima-gold">{plan.name}</span>
                        <span className="text-[7px] text-white/15">•</span>
                        <span className="text-[7px] text-white/20">{plan.price}</span>
                        <span className="text-[7px] text-white/15">•</span>
                        <span className="text-[7px] text-white/20">{plan.deliveryDays}d</span>
                    </div>
                </div>
            </div>

            {/* ── Content Area ──────────────────────────── */}
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
                        />
                    )}
                    {view === "portal" && <DemoPortal plan={plan} />}
                    {view === "landing" && <DemoLandingExample plan={plan} />}
                </motion.div>
            </AnimatePresence>

            {/* ── Bottom CTA bar ──────────────────────── */}
            {view !== "landing" && (
                <div className="fixed bottom-0 inset-x-0 z-50 bg-gradient-to-t from-black via-black/90 to-transparent pt-8 pb-4 px-4 pointer-events-none">
                    <div className="max-w-lg mx-auto flex items-center gap-3 pointer-events-auto">
                        <a
                            href={`https://wa.me/${process.env.NEXT_PUBLIC_CIMA_WA || "528100000000"}?text=${encodeURIComponent(`Hola, vi el demo en vivo y me interesa el plan ${plan.name} (${plan.price}). ${agentName ? `Soy ${agentName}.` : ""}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 bg-cima-gold text-black px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-white transition-all shadow-lg shadow-cima-gold/20"
                        >
                            Activar mi cuenta · {plan.name}
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

            {/* ── QR Overlay ──────────────────────────── */}
            <AnimatePresence>
                {showQR && <QROverlay onClose={() => setShowQR(false)} />}
            </AnimatePresence>
        </div>
    );
}
