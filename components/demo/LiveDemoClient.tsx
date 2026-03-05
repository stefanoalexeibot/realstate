"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Instagram, Facebook, Globe, Users as UsersIcon, Timer, QrCode, Play, Pause, RotateCcw, Pencil, PlayCircle, StopCircle, Layout, Home, ChevronRight, ChevronLeft, Monitor, Maximize2, Eye, DollarSign, Zap, X, ArrowRight, TrendingUp, Shield, CheckCircle2, Smartphone, FileSpreadsheet, PhoneCall, Image as ImageIcon, BarChart3, UserCheck, BellOff, Building2, SlidersHorizontal, UserPlus } from "lucide-react";
import DemoAdminLive from "@/components/demo/DemoAdminLive";
import DemoPortal from "@/components/demo/DemoPortal";
import DemoLandingExample from "@/components/demo/DemoLandingExample";
import DemoPropertyPage from "@/components/demo/DemoPropertyPage";
import { DEMO_PLANS, type PlanTier } from "@/lib/config/demo-plans";

export interface DemoCustomization {
    clientName: string;
    propertyName: string;
    propertyPrice: string;
}

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
    },
    propiedad: {
        title: "Tu Propiedad, Publicada con Lujo",
        desc: "Así ve el comprador tu propiedad: una página premium que genera confianza, destaca ante la competencia y acelera el cierre."
    }
};

type View = "admin" | "portal" | "landing" | "propiedad";

const ROI_DATA: Record<PlanTier, { avgComission: string; leadsPerMonth: string; potentialRevenue: string }> = {
    basico: { avgComission: "$150K", leadsPerMonth: "5-10", potentialRevenue: "$150K/mes" },
    profesional: { avgComission: "$300K", leadsPerMonth: "15-30", potentialRevenue: "$450K/mes" },
    premium: { avgComission: "$500K", leadsPerMonth: "30-60", potentialRevenue: "$1.2M/mes" },
};

/* --- Comparison Modal ---------------------------------------- */
function ComparisonModal({ onClose }: { onClose: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99] bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-[#111] rounded-3xl p-8 max-w-2xl w-full border border-white/10 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">¿Por qué Aurum?</h3>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 transition-all">
                        <X className="h-5 w-5 text-white/40" />
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    {/* Sin Aurum */}
                    <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-8 w-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                                <X className="h-4 w-4 text-red-400" />
                            </div>
                            <span className="text-sm font-black text-red-400 uppercase">Sin Plataforma</span>
                        </div>
                        {[
                            { icon: Smartphone, text: "Fotos por WhatsApp sin orden" },
                            { icon: FileSpreadsheet, text: "Seguimiento en Excel o papel" },
                            { icon: PhoneCall, text: "Clientes llamando cada semana" },
                            { icon: ImageIcon, text: "Sin landing page profesional" },
                            { icon: BarChart3, text: "Sin datos ni analíticos" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <item.icon className="h-4 w-4 text-red-400/60 shrink-0" />
                                <span className="text-[11px] text-white/50">{item.text}</span>
                            </div>
                        ))}
                    </div>
                    {/* Con Aurum */}
                    <div className="bg-cima-gold/5 border border-cima-gold/20 rounded-2xl p-6 space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-8 w-8 rounded-lg bg-cima-gold/20 flex items-center justify-center">
                                <CheckCircle2 className="h-4 w-4 text-cima-gold" />
                            </div>
                            <span className="text-sm font-black text-cima-gold uppercase">Con Aurum</span>
                        </div>
                        {[
                            { icon: Globe, text: "Landing profesional por propiedad" },
                            { icon: UserCheck, text: "Leads automáticos con IA" },
                            { icon: Shield, text: "Portal del dueño 24/7" },
                            { icon: TrendingUp, text: "Analíticos en tiempo real" },
                            { icon: Zap, text: "Cierre 3x más rápido" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <item.icon className="h-4 w-4 text-cima-gold/80 shrink-0" />
                                <span className="text-[11px] text-white/70 font-medium">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <a
                    href="https://propiedades-mty.vercel.app/checkout/onboarding"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 w-full flex items-center justify-center gap-2 bg-cima-gold text-black py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-cima-gold/20 active:scale-95"
                >
                    <DollarSign className="h-4 w-4" />
                    ¡Comenzar Ahora!
                </a>
            </motion.div>
        </motion.div>
    );
}

/* ── Presentation Timer ── */
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

/* ── QR Code Overlay ── */
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
                <p className="mt-4 text-[8px] text-gray-400 font-bold uppercase tracking-widest">Powered by Aurum Technology</p>
            </motion.div>
        </motion.div>
    );
}

/* ── Script Overlay ── */
interface AutoStep {
    view: string;
    tab?: string;
    duration: number;
    label: string;
    script: { title: string; points: string[] };
}

function ScriptOverlay({ step, stepIndex, totalSteps, isPaused, onPrev, onNext, onStop, onTogglePause }: {
    step: AutoStep;
    stepIndex: number;
    totalSteps: number;
    isPaused: boolean;
    onPrev: () => void;
    onNext: () => void;
    onStop: () => void;
    onTogglePause: () => void;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] w-full max-w-xl px-4 pointer-events-auto"
        >
            <div className="bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl shadow-black/60">
                {/* Header row */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 min-w-0">
                        <button
                            onClick={onPrev}
                            disabled={stepIndex === 0}
                            className="p-1 rounded-lg hover:bg-white/10 transition-all disabled:opacity-20 shrink-0"
                        >
                            <ChevronLeft className="h-3.5 w-3.5 text-white/50" />
                        </button>
                        <span className="text-[8px] font-bold text-white/30 uppercase tracking-wider shrink-0">
                            Paso {stepIndex + 1} de {totalSteps}
                        </span>
                        <span className="text-[8px] text-white/15 shrink-0">·</span>
                        <span className="text-[10px] font-black text-cima-gold truncate">{step.script.title}</span>
                    </div>
                    <button onClick={onStop} className="p-1 rounded-lg hover:bg-white/10 transition-all shrink-0 ml-2">
                        <X className="h-3.5 w-3.5 text-white/30" />
                    </button>
                </div>

                {/* Points */}
                <div className="space-y-1.5 mb-4 pl-1">
                    {step.script.points.map((point, i) => (
                        <div key={i} className="flex items-start gap-2">
                            <div className="h-1 w-1 rounded-full bg-cima-gold/50 mt-1.5 shrink-0" />
                            <p className="text-[10px] text-white/65 leading-snug">{point}</p>
                        </div>
                    ))}
                </div>

                {/* Footer row */}
                <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                        {Array.from({ length: totalSteps }).map((_, i) => (
                            <div
                                key={i}
                                className={`h-1 rounded-full transition-all duration-300 ${i === stepIndex ? "w-5 bg-cima-gold" : "w-1.5 bg-white/15"}`}
                            />
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onTogglePause}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[8px] font-bold text-white/50 hover:text-white hover:bg-white/10 transition-all"
                        >
                            {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                            {isPaused ? "Reanudar" : "Pausar"}
                        </button>
                        <button
                            onClick={onNext}
                            disabled={stepIndex === totalSteps - 1}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-cima-gold/10 border border-cima-gold/20 rounded-lg text-[8px] font-bold text-cima-gold hover:bg-cima-gold/20 transition-all disabled:opacity-30"
                        >
                            Siguiente
                            <ChevronRight className="h-3 w-3" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

interface FiredLeadInfo {
    name: string;
    source: string;
    sourceColor: string;
    score: number;
    property: string;
}

/* --- FiredLeadToast ---------------------------------------- */
function FiredLeadToast({ lead, onDismiss }: { lead: FiredLeadInfo; onDismiss: () => void }) {
    const [phase, setPhase] = useState<"incoming" | "qualified">("incoming");

    useEffect(() => {
        const t1 = setTimeout(() => setPhase("qualified"), 1500);
        const t2 = setTimeout(() => onDismiss(), 5000);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [onDismiss]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed top-20 right-4 z-[150] w-72"
        >
            <div className="bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                        {phase === "incoming" ? (
                            <div className="h-8 w-8 rounded-lg bg-cima-gold/20 flex items-center justify-center">
                                <Zap className="h-4 w-4 text-cima-gold animate-pulse" />
                            </div>
                        ) : (
                            <div className="h-8 w-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                                <CheckCircle2 className="h-4 w-4 text-green-400" />
                            </div>
                        )}
                        <div>
                            <p className="text-[10px] font-black text-white">{lead.name}</p>
                            <p className={`text-[9px] font-bold ${phase === "incoming" ? "text-cima-gold" : "text-green-400"}`}>
                                {phase === "incoming" ? "Calificando con IA..." : "¡Lead Calificado!"}
                            </p>
                        </div>
                    </div>
                    <button onClick={onDismiss} className="p-1 hover:bg-white/10 rounded-lg transition-all">
                        <X className="h-3 w-3 text-white/30" />
                    </button>
                </div>
                {phase === "incoming" ? (
                    <div className="mt-2">
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 1.5, ease: "linear" }}
                                className="h-full bg-cima-gold rounded-full"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full ${lead.sourceColor}`}>{lead.source}</span>
                            <span className="text-[9px] text-white/50 truncate max-w-[100px]">{lead.property}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-green-500/10 border border-green-500/20 rounded-lg px-2 py-0.5">
                            <span className="text-[8px] font-black text-green-400">Score {lead.score}</span>
                        </div>
                    </div>
                )}
                {phase === "qualified" && (
                    <p className="mt-2 text-[8px] text-white/30 font-bold">Aparece en tu panel → Leads</p>
                )}
            </div>
        </motion.div>
    );
}

/* --- ROICalculatorModal ---------------------------------------- */
function ROICalculatorModal({ onClose }: { onClose: () => void }) {
    const [propCount, setPropCount] = useState(3);
    const [commission, setCommission] = useState("300,000");

    const commissionNum = parseInt(commission.replace(/,/g, "")) || 0;
    const leadsPerMonth = propCount * 8;
    const closingsPerMonth = Math.max(1, Math.round(propCount * 0.4));
    const monthlyRevenue = closingsPerMonth * commissionNum;
    const yearlyRevenue = monthlyRevenue * 12;
    const recoveryClosings = commissionNum > 0 ? Math.ceil(49900 / commissionNum) : 1;

    const handleCommissionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/,/g, "");
        if (raw === "" || /^\d+$/.test(raw)) {
            const num = parseInt(raw) || 0;
            setCommission(num > 0 ? num.toLocaleString() : "");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99] bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-[#111] rounded-3xl p-8 max-w-lg w-full border border-white/10 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-black text-white uppercase tracking-tight">Calculadora ROI</h3>
                        <p className="text-[10px] text-white/40 mt-0.5">¿Cuánto puedes ganar con Aurum?</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 transition-all">
                        <X className="h-5 w-5 text-white/40" />
                    </button>
                </div>

                <div className="space-y-5 mb-6">
                    <div>
                        <label className="text-[9px] font-bold text-white/40 uppercase tracking-widest block mb-2">Propiedades activas</label>
                        <div className="flex gap-2">
                            {([1, 3, 5, 10] as const).map((n) => (
                                <button
                                    key={n}
                                    onClick={() => setPropCount(n)}
                                    className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase border transition-all ${propCount === n
                                        ? "bg-cima-gold text-black border-cima-gold"
                                        : "bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/10"
                                    }`}
                                >
                                    {n === 10 ? "10+" : n}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="text-[9px] font-bold text-white/40 uppercase tracking-widest block mb-2">Comisión promedio por venta ($)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-white/30 font-bold">$</span>
                            <input
                                value={commission}
                                onChange={handleCommissionChange}
                                placeholder="300,000"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-8 py-3 text-[13px] font-bold text-white placeholder:text-white/20 outline-none focus:border-cima-gold/40 transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 mb-5">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest mb-1">Leads / mes</p>
                            <p className="text-2xl font-black text-white">{leadsPerMonth}</p>
                        </div>
                        <div>
                            <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest mb-1">Potencial / mes</p>
                            <p className="text-2xl font-black text-white">${monthlyRevenue.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="border-t border-white/5 pt-4">
                        <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest mb-1">Potencial anual</p>
                        <p className="text-3xl font-black text-green-400">${yearlyRevenue.toLocaleString()}</p>
                    </div>
                </div>

                <div className="bg-cima-gold/5 border border-cima-gold/20 rounded-2xl p-4 mb-5">
                    <p className="text-[10px] text-cima-gold font-bold leading-relaxed">
                        Recuperas la inversión en tu{" "}
                        {recoveryClosings === 1 ? "primera venta" : `primer ${recoveryClosings} cierres`}
                        {" "}— <span className="font-black">$49,900 pago único.</span>
                    </p>
                </div>

                <a
                    href="https://propiedades-mty.vercel.app/checkout/onboarding"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-cima-gold text-black py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-cima-gold/20 active:scale-95"
                >
                    <DollarSign className="h-4 w-4" />
                    Comenzar con Aurum
                </a>
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
    const [autoDemoPaused, setAutoDemoPaused] = useState(false);
    const [focusMode, setFocusMode] = useState(false);
    const [showComparison, setShowComparison] = useState(false);
    const autoDemoRef = useRef<NodeJS.Timeout | null>(null);
    const [autoDemoStep, setAutoDemoStep] = useState(0);
    const plan = DEMO_PLANS[tier];
    const nameInputRef = useRef<HTMLInputElement>(null);

    // Customization state
    const [customization, setCustomization] = useState<DemoCustomization>({ clientName: "", propertyName: "", propertyPrice: "" });
    const [showCustomize, setShowCustomize] = useState(false);
    const [customizeDraft, setCustomizeDraft] = useState<DemoCustomization>({ clientName: "", propertyName: "", propertyPrice: "" });
    const hasCustomization = !!(customization.clientName || customization.propertyName || customization.propertyPrice);

    // Fire Lead + ROI states
    const [showROICalc, setShowROICalc] = useState(false);
    const [firedLead, setFiredLead] = useState<FiredLeadInfo | null>(null);
    const [isFiring, setIsFiring] = useState(false);
    const [pendingAdminTab, setPendingAdminTab] = useState<string | undefined>(undefined);

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
            score: Math.floor(75 + Math.random() * 24),
            isAiQualified: Math.random() > 0.3,
            ...newLeadData
        };

        setLeads(prev => [lead, ...prev]);
        setLastLeadId(id);

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

        if (!isAi) {
            setTimeout(() => {
                const aiResponse: LiveMessage = {
                    id: Math.random().toString(36).substr(2, 9),
                    from: "Aurum AI",
                    message: `¡Hola ${from}! Gracias por tu interés. Un asesor se pondrá en contacto contigo pronto.`,
                    time: "Justo ahora",
                    unread: true,
                    isAi: true
                };
                setMessages(prev => [aiResponse, ...prev]);
            }, 2000);
        }
    }, []);

    const fireDemoLead = useCallback(() => {
        const LEAD_POOL: FiredLeadInfo[] = [
            { name: "Familia Hernández", source: "Instagram", sourceColor: "text-pink-400 bg-pink-500/10", score: 92, property: "Residencia Las Misiones" },
            { name: "Ing. Diego Morales", source: "Landing", sourceColor: "text-emerald-400 bg-emerald-500/10", score: 89, property: "Torre LOVFT Depto 12B" },
            { name: "Arq. Valeria Santos", source: "Marketplace", sourceColor: "text-blue-400 bg-blue-500/10", score: 94, property: "Residencia Chipinque" },
            { name: "Dr. Ramón Gutiérrez", source: "Instagram", sourceColor: "text-pink-400 bg-pink-500/10", score: 96, property: "Casa Valle Poniente" },
            { name: "Lic. Patricia Reyes", source: "Landing", sourceColor: "text-emerald-400 bg-emerald-500/10", score: 88, property: "Pent. Santa María" },
            { name: "Familia Castillo", source: "Referido", sourceColor: "text-amber-400 bg-amber-500/10", score: 91, property: "Residencia Contry Sol" },
        ];
        const sourceIconMap: Record<string, any> = {
            Instagram, Landing: Globe, Marketplace: Facebook, Referido: UsersIcon,
        };
        const pool = LEAD_POOL[Math.floor(Math.random() * LEAD_POOL.length)];
        handleAddLead({
            name: pool.name,
            source: pool.source,
            sourceIcon: sourceIconMap[pool.source] || Globe,
            color: pool.sourceColor,
            score: pool.score,
            property: pool.property,
            isAiQualified: true,
        });
        setFiredLead(pool);
        setView("admin");
        setPendingAdminTab("leads");
        setTimeout(() => setPendingAdminTab(undefined), 500);
        setIsFiring(true);
        setTimeout(() => setIsFiring(false), 1200);
    }, [handleAddLead]);

    const TIER_ORDER: PlanTier[] = ["basico", "profesional", "premium"];

    const AUTO_STEPS: { view: View; tab?: any; duration: number; label: string; script: { title: string; points: string[] } }[] = [
        {
            view: "landing", duration: 8000, label: "Landing",
            script: {
                title: "Landing Page de Alto Impacto",
                points: [
                    "Primera impresión del comprador — diseñada para convertir",
                    "URL exclusiva por propiedad, ideal para campañas en redes",
                    "Formulario conectado directo al panel — 0 fricción",
                ]
            }
        },
        {
            view: "admin", tab: "propiedades", duration: 6000, label: "Propiedades",
            script: {
                title: "Gestión de Propiedades",
                points: [
                    "Todas tus propiedades en un solo lugar",
                    "Fotos, precio y estatus en tiempo real",
                    "Edita y publica en segundos",
                ]
            }
        },
        {
            view: "admin", tab: "leads", duration: 6000, label: "Leads",
            script: {
                title: "Pipeline de Leads",
                points: [
                    "Leads calificados por IA automáticamente",
                    "Score de intención de compra en cada lead",
                    "Seguimiento en un click",
                ]
            }
        },
        {
            view: "admin", tab: "analiticos", duration: 5000, label: "Analíticos",
            script: {
                title: "Analíticos en Tiempo Real",
                points: [
                    "Vistas, leads y conversión en un dashboard",
                    "Datos que fundamentan tu estrategia de precio",
                    "Comparativa vs el mercado",
                ]
            }
        },
        {
            view: "portal", duration: 6000, label: "Portal",
            script: {
                title: "Portal del Propietario",
                points: [
                    "Tu cliente ve el progreso 24/7 sin llamarte",
                    "Reduce fricción y genera confianza",
                    "Evidencia fotográfica de cada acción",
                ]
            }
        },
        {
            view: "propiedad", duration: 6000, label: "Propiedad",
            script: {
                title: "Página de Propiedad Premium",
                points: [
                    "Así ve el comprador la propiedad en el portal",
                    "Galería, specs y contacto en una sola URL",
                    "SEO optimizado para Google",
                ]
            }
        },
    ];

    const startAutoDemo = useCallback(() => {
        setAutoDemo(true);
        setAutoDemoPaused(false);
        setAutoDemoStep(0);
        setView(AUTO_STEPS[0].view);
    }, []);

    const stopAutoDemo = useCallback(() => {
        setAutoDemo(false);
        setAutoDemoPaused(false);
        if (autoDemoRef.current) clearTimeout(autoDemoRef.current);
    }, []);

    const goToStep = useCallback((newStep: number) => {
        if (autoDemoRef.current) clearTimeout(autoDemoRef.current);
        setAutoDemoPaused(true);
        const clamped = Math.max(0, Math.min(AUTO_STEPS.length - 1, newStep));
        setAutoDemoStep(clamped);
        setView(AUTO_STEPS[clamped].view);
    }, []);

    useEffect(() => {
        if (!autoDemo || autoDemoPaused) return;
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
    }, [autoDemo, autoDemoPaused, autoDemoStep]);

    // Keyboard navigation for ScriptOverlay
    useEffect(() => {
        if (!autoDemo) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") { e.preventDefault(); goToStep(autoDemoStep + 1); }
            if (e.key === "ArrowLeft") { e.preventDefault(); goToStep(autoDemoStep - 1); }
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [autoDemo, autoDemoStep, goToStep]);

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

    return (
        <div className="min-h-screen bg-black text-white selection:bg-cima-gold selection:text-black font-sans pb-20">
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

            {/* ── Top Bar / Controls ──────────────────────── */}
            <div className="sticky top-0 z-[100] bg-black/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <img src="/aurum-logo.png" alt="Aurum" className="h-10 w-auto shrink-0" />
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

                    <div className="flex items-center gap-0.5 bg-white/[0.05] p-1 rounded-xl border border-white/10">
                        {([
                            { id: "landing" as View, icon: Globe, label: "Landing", mobileLabel: "Landing" },
                            { id: "admin" as View, icon: Layout, label: "Panel del Asesor", mobileLabel: "Asesor" },
                            { id: "portal" as View, icon: Home, label: "Portal Propietario", mobileLabel: "Portal" },
                            { id: "propiedad" as View, icon: Building2, label: "Página de Propiedad", mobileLabel: "Propiedad" },
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

                    <div className="flex items-center gap-2">
                        <div className="hidden md:flex items-center gap-0.5 bg-white/[0.03] p-0.5 rounded-lg border border-white/10">
                            {([
                                { id: "basico" as PlanTier, label: "Starter", price: DEMO_PLANS.basico.price },
                                { id: "profesional" as PlanTier, label: "Pro", price: DEMO_PLANS.profesional.price },
                                { id: "premium" as PlanTier, label: "Team", price: DEMO_PLANS.premium.price },
                            ]).map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => switchTier(t.id)}
                                    className={`px-2.5 py-1.5 rounded-md text-[8px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 ${tier === t.id
                                        ? "bg-cima-gold text-black shadow-lg shadow-cima-gold/20"
                                        : "text-white/30 hover:text-white/50 hover:bg-white/5"
                                        }`}
                                >
                                    <span>{t.label}</span>
                                    <span className={`text-[7px] font-mono ${tier === t.id ? "text-black/60" : "text-white/20"}`}>{t.price}</span>
                                </button>
                            ))}
                        </div>

                        {/* Customize button + dropdown */}
                        <div className="relative hidden lg:block">
                            <button
                                onClick={() => {
                                    setCustomizeDraft(customization);
                                    setShowCustomize(v => !v);
                                }}
                                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[8px] font-bold uppercase tracking-wider transition-all ${hasCustomization
                                    ? "bg-cima-gold/10 border-cima-gold/40 text-cima-gold"
                                    : "bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/10"
                                    }`}
                                title="Personalizar demo"
                            >
                                <SlidersHorizontal className="h-3 w-3" />
                                {hasCustomization ? "Personalizado" : "Personalizar"}
                            </button>
                            <AnimatePresence>
                                {showCustomize && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 top-full mt-2 w-72 bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl z-[110]"
                                    >
                                        <p className="text-[9px] font-black text-cima-gold uppercase tracking-widest mb-3">Personalizar Demo</p>
                                        <div className="space-y-2.5 mb-4">
                                            {[
                                                { key: "clientName" as const, label: "Nombre del Prospecto", placeholder: "Ej: Familia García" },
                                                { key: "propertyName" as const, label: "Nombre de la Propiedad", placeholder: "Ej: Residencia Chipinque" },
                                                { key: "propertyPrice" as const, label: "Precio (solo número)", placeholder: "Ej: 12,500,000" },
                                            ].map(({ key, label, placeholder }) => (
                                                <div key={key}>
                                                    <label className="text-[8px] font-bold text-white/30 uppercase tracking-widest block mb-1">{label}</label>
                                                    <input
                                                        value={customizeDraft[key]}
                                                        onChange={e => setCustomizeDraft(d => ({ ...d, [key]: e.target.value }))}
                                                        placeholder={placeholder}
                                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-[10px] text-white placeholder:text-white/20 outline-none focus:border-cima-gold/40 transition-all"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setCustomization(customizeDraft);
                                                    setShowCustomize(false);
                                                    setUpgradeFlash(true);
                                                    setTimeout(() => setUpgradeFlash(false), 600);
                                                }}
                                                className="flex-1 bg-cima-gold text-black py-2 rounded-lg text-[9px] font-black uppercase tracking-wider hover:bg-white transition-all"
                                            >
                                                Aplicar
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setCustomization({ clientName: "", propertyName: "", propertyPrice: "" });
                                                    setCustomizeDraft({ clientName: "", propertyName: "", propertyPrice: "" });
                                                    setShowCustomize(false);
                                                }}
                                                className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-[9px] font-bold text-white/40 hover:text-white transition-all"
                                            >
                                                Limpiar
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <button
                            onClick={() => setShowComparison(true)}
                            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[8px] font-bold uppercase tracking-wider text-white/40 hover:text-white hover:bg-white/10 transition-all"
                            title="Ver comparativa"
                        >
                            <Shield className="h-3 w-3" />
                            VS
                        </button>

                        <button
                            onClick={() => setShowROICalc(true)}
                            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[8px] font-bold uppercase tracking-wider text-white/40 hover:text-green-400 hover:border-green-500/20 hover:bg-green-500/5 transition-all"
                            title="Calculadora ROI"
                        >
                            <BarChart3 className="h-3 w-3" />
                            ROI
                        </button>

                        <a
                            href="https://propiedades-mty.vercel.app/checkout/onboarding"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-cima-gold to-amber-500 text-black rounded-xl text-[9px] font-black uppercase tracking-wider hover:from-white hover:to-white hover:scale-105 active:scale-95 transition-all shadow-lg shadow-cima-gold/30 animate-pulse"
                            title="Cerrar venta"
                        >
                            <DollarSign className="h-3.5 w-3.5" />
                            ¡Lo Quiero!
                        </a>

                        <div className="hidden xl:flex">
                            <PresentationTimer />
                        </div>

                        <button
                            onClick={() => setShowQR(true)}
                            className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all"
                        >
                            <QrCode className="h-3.5 w-3.5 text-white/40" />
                        </button>

                        <button
                            onClick={autoDemo ? stopAutoDemo : startAutoDemo}
                            className={`hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[8px] font-bold uppercase tracking-wider transition-all ${autoDemo
                                ? "bg-red-500/10 border-red-500/20 text-red-400"
                                : "bg-white/5 border-white/10 text-white/40"
                                }`}
                        >
                            {autoDemo ? <StopCircle className="h-3 w-3" /> : <PlayCircle className="h-3 w-3" />}
                            {autoDemo ? `Auto` : "Auto Demo"}
                        </button>

                        <button
                            onClick={fireDemoLead}
                            disabled={isFiring}
                            className={`hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[8px] font-bold uppercase tracking-wider transition-all ${isFiring
                                ? "bg-cima-gold/20 border-cima-gold/40 text-cima-gold scale-95"
                                : "bg-white/5 border-white/10 text-white/40 hover:bg-green-500/10 hover:border-green-500/20 hover:text-green-400"
                                }`}
                            title="Simular lead entrante"
                        >
                            <UserPlus className={`h-3 w-3 ${isFiring ? "animate-bounce" : ""}`} />
                            {isFiring ? "¡Entrando!" : "Disparar Lead"}
                        </button>

                        <button
                            onClick={toggleFullscreen}
                            className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all"
                        >
                            <Maximize2 className="h-3.5 w-3.5 text-white/40" />
                        </button>

                        <button
                            onClick={() => setFocusMode(!focusMode)}
                            className={`p-2 rounded-lg border transition-all ${focusMode
                                ? "bg-cima-gold border-cima-gold text-black shadow-lg"
                                : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
                                }`}
                            title={focusMode ? "Desactivar No Molestar" : "Activar No Molestar (Silenciar Notificaciones)"}
                        >
                            <BellOff className="h-3.5 w-3.5" />
                        </button>
                    </div>
                </div>

                {/* Context bar + ROI widget */}
                <div className="border-t border-white/5 px-4 py-1.5 flex items-center justify-between relative">
                    <div className="flex items-center gap-1.5">
                        <span className="text-[7px] text-white/20 uppercase font-bold tracking-widest">Paquete:</span>
                        <span className="text-[8px] font-bold text-cima-gold">{plan.name}</span>
                        <span className="text-[7px] text-white/15">&middot;</span>
                        <span className="text-[7px] text-white/20">{plan.price}</span>
                        <span className="text-[7px] text-white/15">&middot;</span>
                        <span className="text-[7px] text-white/20">{plan.deliveryDays}d entrega</span>
                    </div>

                    {/* ROI Widget - Centered */}
                    <div className="absolute left-1/2 -translate-x-1/2 hidden sm:flex items-center gap-2">
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-green-500/10 border border-green-500/20 shadow-lg shadow-green-500/5">
                            <TrendingUp className="h-3 w-3 text-green-400" />
                            <span className="text-[8px] font-black text-green-400 uppercase tracking-wider">
                                ROI Estimado: {ROI_DATA[tier].potentialRevenue}
                            </span>
                            <span className="text-[7px] text-green-400/50 font-bold">
                                ({ROI_DATA[tier].leadsPerMonth} leads/mes)
                            </span>
                        </div>
                    </div>

                    <div className="w-[100px] hidden sm:block" />
                </div>

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
                    className="w-full"
                >
                    {view === "admin" && (
                        <DemoAdminLive
                            plan={plan}
                            agentName={agentName}
                            onNavigateToLeads={handleNavigateToLeads}
                            externalTab={pendingAdminTab || AUTO_STEPS[autoDemoStep]?.tab}
                            leads={leads}
                            onUpdateLeadStatus={handleUpdateLeadStatus}
                            newLeadId={lastLeadId}
                            messages={messages}
                            onAddMessage={handleAddMessage}
                            notificationsMuted={focusMode}
                        />
                    )}
                    {view === "portal" && <DemoPortal plan={plan} customization={customization} />}
                    {view === "landing" && (
                        <DemoLandingExample
                            plan={plan}
                            onLeadCapture={handleAddLead}
                            onSendMessage={handleAddMessage}
                            messages={messages}
                            customization={customization}
                        />
                    )}
                    {view === "propiedad" && (
                        <DemoPropertyPage
                            plan={plan}
                            onSendMessage={handleAddMessage}
                            customization={customization}
                        />
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Bottom CTA bar */}
            {view !== "landing" && view !== "propiedad" && (
                <div className="fixed bottom-0 inset-x-0 z-50 bg-gradient-to-t from-black via-black/90 to-transparent pt-8 pb-4 px-4 pointer-events-none">
                    <div className="max-w-[1600px] mx-auto px-4 w-full flex items-center justify-center gap-3 pointer-events-auto">
                        <div className="max-w-lg w-full flex gap-3">
                            <a
                                href="https://propiedades-mty.vercel.app/checkout/onboarding"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center gap-2 bg-cima-gold text-black px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-white transition-all shadow-lg"
                            >
                                <DollarSign className="h-4 w-4" />
                                ¡Lo Quiero! &middot; {plan.name}
                            </a>
                            <button
                                onClick={() => setShowQR(true)}
                                className="flex items-center gap-2 border border-white/10 bg-white/5 text-white/60 px-5 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider"
                            >
                                <QrCode className="h-3.5 w-3.5" />
                                QR
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <AnimatePresence>
                {showQR && (
                    <QROverlay
                        onClose={() => setShowQR(false)}
                        title={view === "landing" ? "Vista Móvil del Comprador" : view === "admin" ? "Notificaciones en tu Móvil" : "Portal para el Dueño (Móvil)"}
                        desc={view === "landing"
                            ? "Escanea con tu celular para ver cómo interactúa un comprador real."
                            : "Usa tu móvil para recibir alertas y gestionar tus propiedades."
                        }
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showComparison && <ComparisonModal onClose={() => setShowComparison(false)} />}
            </AnimatePresence>

            <AnimatePresence>
                {autoDemo && AUTO_STEPS[autoDemoStep] && (
                    <ScriptOverlay
                        step={AUTO_STEPS[autoDemoStep]}
                        stepIndex={autoDemoStep}
                        totalSteps={AUTO_STEPS.length}
                        isPaused={autoDemoPaused}
                        onPrev={() => goToStep(autoDemoStep - 1)}
                        onNext={() => goToStep(autoDemoStep + 1)}
                        onStop={stopAutoDemo}
                        onTogglePause={() => setAutoDemoPaused(p => !p)}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showROICalc && <ROICalculatorModal onClose={() => setShowROICalc(false)} />}
            </AnimatePresence>

            <AnimatePresence>
                {firedLead && <FiredLeadToast lead={firedLead} onDismiss={() => setFiredLead(null)} />}
            </AnimatePresence>
        </div>
    );
}
