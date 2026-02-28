"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    ShieldCheck,
    Gavel,
    Clock,
    CheckCircle2,
    FileText,
    Eye,
    Lock,
    Scale,
    Search,
    Bell,
    TrendingUp,
    TrendingDown,
    Sparkles
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

// ── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ to, duration = 1.5 }: { to: number; duration?: number }) {
    const [count, setCount] = useState(0);
    const hasRun = useRef(false);
    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;
        let start = 0;
        const steps = Math.ceil(duration * 60);
        const increment = to / steps;
        const timer = setInterval(() => {
            start = Math.min(start + increment, to);
            setCount(Math.floor(start));
            if (start >= to) clearInterval(timer);
        }, 1000 / 60);
        return () => clearInterval(timer);
    }, [to, duration]);
    return <span>{count.toLocaleString()}</span>;
}

// ── Typing Animation ──────────────────────────────────────────────────────────
function TypingText({ texts, className }: { texts: string[]; className?: string }) {
    const [textIdx, setTextIdx] = useState(0);
    const [displayed, setDisplayed] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const full = texts[textIdx];
        let timer: ReturnType<typeof setTimeout>;
        if (!isDeleting && displayed.length < full.length) {
            timer = setTimeout(() => setDisplayed(full.slice(0, displayed.length + 1)), 60);
        } else if (!isDeleting && displayed.length === full.length) {
            timer = setTimeout(() => setIsDeleting(true), 2000);
        } else if (isDeleting && displayed.length > 0) {
            timer = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 30);
        } else if (isDeleting && displayed.length === 0) {
            setIsDeleting(false);
            setTextIdx((textIdx + 1) % texts.length);
        }
        return () => clearTimeout(timer);
    }, [displayed, isDeleting, textIdx, texts]);

    return (
        <span className={className}>
            {displayed}<span className="animate-pulse">|</span>
        </span>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PORTAL DEL ABOGADO / NOTARIO
// ═══════════════════════════════════════════════════════════════════════════════
function LegalAdminPreview() {
    const cases = [
        { name: "Exp. 452/2023", client: "Constructora Delta", status: "Audiencia", tag: "URGENTE", color: "text-red-400", bg: "bg-red-500/10 border-red-500/30" },
        { name: "Poder Notarial 12", client: "Inversiones Garza", status: "En Firma", tag: "LISTO", color: "text-green-400", bg: "bg-green-500/10 border-green-500/30" },
        { name: "Juicio Mercantil", client: "Roberto Kuri", status: "Pruebas", tag: "NUEVO", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30" },
    ];

    return (
        <div className="w-full h-full relative overflow-hidden bg-[#0F172A] rounded-[inherit] p-6">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#334155 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                            <Scale className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 block">Gestión Jurídica · V2</span>
                            <h3 className="text-sm font-bold text-white">Dashboard de Control</h3>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                        { label: "Casos Activos", val: 24, icon: Gavel },
                        { label: "Alertas Hoy", val: 5, icon: Bell },
                        { label: "Documentos", val: 1420, icon: FileText },
                    ].map((s, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                            <s.icon className="w-4 h-4 text-blue-400 mb-2" />
                            <div className="text-xl font-bold text-white"><AnimatedCounter to={s.val} /></div>
                            <div className="text-[8px] uppercase font-bold text-slate-500 tracking-widest mt-1">{s.label}</div>
                        </div>
                    ))}
                </div>

                <div className="flex-1 space-y-3">
                    <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest block mb-2">Expedientes Prioritarios</span>
                    {cases.map((c, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                {c.name.split(' ')[0][0]}
                            </div>
                            <div className="flex-1">
                                <span className="text-[11px] font-bold text-white block">{c.name}</span>
                                <span className="text-[9px] text-slate-500">{c.client}</span>
                            </div>
                            <div className="text-right">
                                <span className={`text-[8px] font-black px-2 py-0.5 rounded border mb-1 block ${c.bg} ${c.color}`}>{c.tag}</span>
                                <span className="text-[9px] text-slate-400">{c.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PORTAL DEL CLIENTE (TRANSPARENCIA)
// ═══════════════════════════════════════════════════════════════════════════════
function ClientCasePreview() {
    const steps = [
        { label: "Demanda Presentada", date: "15 Oct", done: true },
        { label: "Admisión de Pruebas", date: "22 Nov", done: true },
        { label: "Audiencia de Ley", date: "Hoy 11:00", done: false, active: true },
        { label: "Sentencia", date: "Pendiente", done: false },
    ];

    return (
        <div className="w-full h-full relative overflow-hidden bg-[#020617] rounded-[inherit] p-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full" />

            <div className="relative z-10 flex flex-col h-full">
                <div className="mb-8">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 block mb-2">Expediente en Vivo · Transparencia</span>
                    <h3 className="text-2xl font-bold text-white leading-tight">Materia Mercantil<br />Vs Grupo Industrial S.A.</h3>
                </div>

                <div className="space-y-6 flex-1">
                    {steps.map((s, i) => (
                        <div key={i} className="flex items-start gap-6 relative">
                            <div className="mt-1.5 flex flex-col items-center">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${s.done ? "bg-green-500 border-green-500" : s.active ? "bg-blue-500 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "bg-transparent border-slate-700"}`}>
                                    {s.done && <CheckCircle2 className="w-3 h-3 text-white" />}
                                    {s.active && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                                </div>
                                {i < steps.length - 1 && <div className="w-0.5 h-10 bg-slate-800" />}
                            </div>
                            <div>
                                <span className={`text-sm font-bold block mb-1 ${s.active ? "text-blue-400" : s.done ? "text-white" : "text-slate-600"}`}>
                                    {s.label}
                                </span>
                                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{s.date}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-blue-400" />
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                        <strong className="text-white block mb-0.5">IA Insight:</strong>
                        El juzgado ha admitido el 90% de nuestras pruebas. La probabilidad de resolución favorable es alta.
                    </p>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BÓVEDA DIGITAL (VAULT)
// ═══════════════════════════════════════════════════════════════════════════════
function LegalVaultPreview() {
    const [isLocked, setIsLocked] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLocked(false), 800);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="w-full h-full relative overflow-hidden bg-[#020617] rounded-[inherit] flex items-center justify-center p-8 md:p-12">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(#3b82f6 0.1px, transparent 0.1px), linear-gradient(90deg, #3b82f6 0.1px, transparent 0.1px)", backgroundSize: "30px 30px" }} />

            <motion.div
                initial={false}
                animate={{ opacity: isLocked ? 1 : 0.05, filter: isLocked ? "blur(0px)" : "blur(10px)" }}
                className="absolute inset-0 z-20 flex items-center justify-center bg-[#020617]/40 backdrop-blur-md pointer-events-none"
            >
                <motion.div
                    animate={{ scale: isLocked ? 1 : 1.5, rotate: isLocked ? 0 : 90 }}
                    transition={{ duration: 0.8, ease: "circIn" }}
                >
                    <Lock className="w-20 h-20 text-blue-500/40" />
                </motion.div>
            </motion.div>

            <div className="relative z-10 w-full max-w-lg">
                <div className="flex items-center gap-6 mb-10">
                    <div className="w-16 h-16 rounded-3xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.15)]">
                        <ShieldCheck className="w-8 h-8 text-blue-400" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic">Bóveda Blindada</h3>
                        <p className="text-[10px] font-mono text-blue-400 font-black tracking-[0.3em] uppercase">AES-256 Quantum Resistant</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {[
                        { name: "Escritura_Publica_45.pdf", size: "2.4 MB", status: "VERIFIED" },
                        { name: "Certificado_Notarial.doc", size: "1.1 MB", status: "SIGNED" },
                        { name: "Anexo_Evidencia_Alpha.mp4", size: "156 MB", status: "ENCRYPTED" },
                    ].map((doc, i) => (
                        <motion.div
                            key={i}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 + (i * 0.1) }}
                            className="flex items-center gap-5 p-5 rounded-2xl bg-white/[0.03] border border-white/5 group hover:bg-white/[0.05] hover:border-blue-500/20 transition-all cursor-pointer"
                        >
                            <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center group-hover:bg-blue-600/10 transition-colors">
                                <FileText className="w-5 h-5 text-slate-500 group-hover:text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <span className="text-[11px] font-black text-white block truncate tracking-tight uppercase">{doc.name}</span>
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{doc.size}</span>
                            </div>
                            <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[8px] font-black text-blue-400 tracking-widest">
                                {doc.status}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ComparisonPreview() {
    return (
        <div className="w-full h-full relative overflow-hidden bg-[#020617] rounded-[inherit] flex flex-col p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                <div className="p-8 rounded-[32px] bg-red-500/[0.02] border border-red-500/10 flex flex-col">
                    <div className="flex items-center gap-3 mb-8">
                        <TrendingDown className="w-5 h-5 text-red-400" />
                        <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">Despacho Tradicional</span>
                    </div>
                    <div className="space-y-6 flex-1 opacity-40">
                        {['Llamadas interminables', 'Reportes manuales', 'Incertidumbre total', 'Archivos perdidos'].map((text, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <Scale className="w-3 h-3 text-slate-600" />
                                <span className="text-xs text-slate-400 font-medium">{text}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 p-4 rounded-xl bg-red-500/5 text-[10px] text-red-300 font-bold uppercase tracking-tight text-center">
                        Eficiencia: ~35%
                    </div>
                </div>

                <div className="p-8 rounded-[32px] bg-blue-500/[0.05] border border-blue-500/20 flex flex-col relative overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full translate-x-1/2 translate-y-1/2" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                            <TrendingUp className="w-5 h-5 text-blue-400" />
                            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Cima Legal Node</span>
                        </div>
                        <div className="space-y-6 flex-1">
                            {['Monitoreo Judicial 24/7', 'Portal de Clientes Pro', 'Seguridad Blockchain', 'Firma Distribuida'].map((text, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <CheckCircle2 className="w-3 h-3 text-blue-400" />
                                    <span className="text-xs text-white font-bold">{text}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 p-4 rounded-xl bg-blue-600 text-[10px] text-white font-black uppercase tracking-[0.2em] text-center shadow-lg shadow-blue-500/20">
                            Eficiencia: 100%
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const tabs = [
    { id: "comparison", label: "Cima vs Tradicional", tag: "COMPARATIVA", accentFrom: "from-slate-500/10", component: "comparison" },
    { id: "admin", label: "Gestión Elite", tag: "CONTROL TOTAL", accentFrom: "from-blue-500/15", component: "admin" },
    { id: "client", label: "Portal Transparente", tag: "EXPERIENCIA", accentFrom: "from-indigo-500/10", component: "client" },
    { id: "vault", label: "Bóveda Blindada", tag: "SEGURIDAD", accentFrom: "from-blue-600/10", component: "vault" },
];

export default function LegalShowcase() {
    const [active, setActive] = useState(0);
    const [paused, setPaused] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (paused) return;
        const t = setInterval(() => setActive(p => (p + 1) % tabs.length), 10000);
        return () => clearInterval(t);
    }, [paused]);

    return (
        <div className="w-full">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {tabs.map((tab, i) => (
                    <button
                        key={tab.id}
                        onClick={() => { setActive(i); setPaused(true); }}
                        className={`relative text-left px-5 py-6 rounded-3xl border transition-all duration-500 overflow-hidden ${active === i
                            ? "border-blue-500/40 bg-blue-500/5 shadow-2xl shadow-blue-500/10"
                            : "border-white/5 bg-white/[0.02] hover:border-white/10"
                            }`}
                    >
                        <span className={`text-[9px] font-black uppercase tracking-[0.2em] block mb-2 ${active === i ? "text-blue-400" : "text-slate-600"}`}>
                            {tab.tag}
                        </span>
                        <span className={`text-xs md:text-sm font-black block leading-tight ${active === i ? "text-white" : "text-slate-500"}`}>
                            {tab.label}
                        </span>
                        {active === i && !paused && (
                            <motion.div
                                layoutId="legal-loader"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 10, ease: "linear" }}
                                className="absolute bottom-0 left-0 h-1 bg-blue-600"
                            />
                        )}
                    </button>
                ))}
            </div>

            <div
                className="relative rounded-[40px] overflow-hidden border border-white/5 shadow-2xl bg-[#020617]"
                style={{ aspectRatio: isMobile ? "1/1" : "16/9" }}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
            >
                <div className={`absolute inset-0 bg-gradient-to-br ${tabs[active].accentFrom} to-transparent z-0 transition-all duration-1000`} />

                <AnimatePresence mode="wait">
                    <motion.div
                        key={active}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0 z-10"
                    >
                        {active === 0 && <ComparisonPreview />}
                        {active === 1 && <LegalAdminPreview />}
                        {active === 2 && <ClientCasePreview />}
                        {active === 3 && <LegalVaultPreview />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
