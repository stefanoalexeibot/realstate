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
    return (
        <div className="w-full h-full relative overflow-hidden bg-slate-950 rounded-[inherit] flex items-center justify-center p-12">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

            <div className="relative z-10 w-full max-w-sm">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-blue-500/10 border border-blue-500/30 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(59,130,246,0.1)]">
                        <ShieldCheck className="w-10 h-10 text-blue-400 animate-pulse" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Bóveda Digital Blindada</h3>
                    <p className="text-sm text-slate-500">Documentos con certificación notarial en blockchain y encriptación de grado militar.</p>
                </div>

                <div className="space-y-3">
                    {[
                        { name: "Escritura_Publica_45.pdf", size: "2.4 MB", securityValue: "AES-256" },
                        { name: "Anexo_Pruebas_Video.mp4", size: "156 MB", securityValue: "Encrypted" },
                        { name: "Sentencia_Definitiva.doc", size: "1.1 MB", securityValue: "Signed" },
                    ].map((doc, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-sm hover:bg-white/[0.05] transition-all cursor-pointer group">
                            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:border-blue-500/30 transition-colors text-slate-500 group-hover:text-blue-400">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <span className="text-[11px] font-bold text-white block truncate">{doc.name}</span>
                                <span className="text-[9px] text-slate-500 uppercase tracking-widest">{doc.size}</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 font-mono text-[8px] text-blue-400 font-bold">
                                <Lock className="w-2.5 h-2.5" />
                                {doc.securityValue}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 pt-8 border-t border-slate-800 flex justify-between items-center text-[9px] font-mono text-slate-500 uppercase tracking-[0.2em]">
                    <span>Node: Secure-Legal-A1</span>
                    <span className="text-blue-500 font-bold">Status: Synchronized</span>
                </div>
            </div>
        </div>
    );
}

const tabs = [
    { id: "admin", label: "Gestión Jurídica", tag: "CONTROL TOTAL", accentFrom: "from-blue-500/15", component: "admin" },
    { id: "client", label: "Expediente en Vivo", tag: "TRANSPARENCIA", accentFrom: "from-slate-500/10", component: "client" },
    { id: "vault", label: "Bóveda Digital", tag: "SEGURIDAD", accentFrom: "from-emerald-500/10", component: "vault" },
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                {tabs.map((tab, i) => (
                    <button
                        key={tab.id}
                        onClick={() => { setActive(i); setPaused(true); }}
                        className={`relative text-left px-5 py-6 rounded-2xl border transition-all duration-500 overflow-hidden ${active === i
                            ? "border-blue-500/40 bg-blue-500/5"
                            : "border-white/5 bg-white/[0.02] hover:border-white/10"
                            }`}
                    >
                        <span className={`text-[8px] font-black uppercase tracking-[0.25em] block mb-2 ${active === i ? "text-blue-400" : "text-slate-600"}`}>
                            {tab.tag}
                        </span>
                        <span className={`text-sm font-bold block mb-1 ${active === i ? "text-white" : "text-slate-500"}`}>
                            {tab.label}
                        </span>
                        {active === i && !paused && (
                            <motion.div
                                layoutId="legal-loader"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 10, ease: "linear" }}
                                className="absolute bottom-0 left-0 h-0.5 bg-blue-500"
                            />
                        )}
                    </button>
                ))}
            </div>

            <div
                className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-[#020617]"
                style={{ aspectRatio: isMobile ? "1/1" : "16/9" }}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
            >
                <div className={`absolute inset-0 bg-gradient-to-br ${tabs[active].accentFrom} to-transparent z-0 transition-all duration-1000`} />

                <AnimatePresence mode="wait">
                    <motion.div
                        key={active}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.99 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 z-10"
                    >
                        {active === 0 && <LegalAdminPreview />}
                        {active === 1 && <ClientCasePreview />}
                        {active === 2 && <LegalVaultPreview />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
