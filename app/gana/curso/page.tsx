"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Building2, Check, ArrowRight, DollarSign, Users,
    Copy, CheckCircle2, ChevronDown, Zap, Gift,
    TrendingUp, Share2, MessageSquare, ShieldCheck, Clock,
    Sparkles, BookOpen, GraduationCap, ArrowLeft, Lightbulb,
    HelpCircle, PhoneCall, FileText, Target, Play, Image, Download, Palette
} from "lucide-react";
import Link from "next/link";

const AVERAGE_COMMISSION = 3750;

const ADVISORS = [
    { id: "alejandro", name: "Alejandro L.", phone: "528121980008" },
    { id: "darien", name: "Darien G.", phone: "528140053979" },
    { id: "jair", name: "Jair P.", phone: "528115030492" }
];

// Helper to copy text to clipboard with feedback
function CopyButton({ text, label = "Copiar Script" }: { text: string; label?: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Error al copiar text", err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold font-mono transition-all border ${
                copied
                    ? "bg-green-500/10 border-green-500/30 text-green-400"
                    : "bg-cima-gold/10 border-cima-gold/30 text-cima-gold hover:bg-cima-gold hover:text-cima-bg"
            }`}
        >
            {copied ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? "¡Copiado al portapapeles!" : label}</span>
        </button>
    );
}

// ─── INTERACTIVE DECISION TREE ──────────────────────────────────────────────
function InteractiveScriptSimulator() {
    const [selectedScenario, setSelectedScenario] = useState<number | null>(0);

    const scenarios = [
        {
            title: '✅ "Sí, mi amigo / vecino / familiar quiere vender"',
            answer: '¡Buenísimo! Fíjate que estoy colaborando con CIMA Propiedades. Ellos tienen un programa de venta acelerada garantizada en menos de 30 días con marketing digital masivo. Pásame su nombre y su WhatsApp, y le pido a uno de sus asesores senior que le mande una valuación comercial gratuita y la estrategia sin ningún compromiso. Si se vende, ¡hasta te invito a cenar!',
            tip: "Acción inmediata: Pídele el contacto y regístralo de inmediato en la web o crea un grupo de WhatsApp de 3 vías."
        },
        {
            title: '🏠 "Yo mismo estoy pensando en vender mi casa"',
            answer: '¡Excelente oportunidad! No le busques más. CIMA Propiedades maneja un sistema acelerado que garantiza la venta en menos de 30 días con publicidad digital agresiva y fotos profesionales. Te voy a conectar directo con Alejandro/Darien/Jair de CIMA para que te visite o te llame hoy mismo y te haga el análisis de precio 100% gratis.',
            tip: "Acción inmediata: Dile que el estudio de mercado no lo compromete a nada y que le dará mucha claridad de cuánto vale su propiedad."
        },
        {
            title: '❓ "¿Por qué preguntas? / ¿Ahora te dedicas a eso?"',
            answer: 'No soy agente a tiempo completo, pero soy Embajador Oficial de CIMA Propiedades. Tienen un sistema de venta rápida en menos de 30 días y aprecio mucho recomendar a empresas serias que sí le invierten a la publicidad. Si sabes de alguien que traiga la inquietud de vender, avísame y los apoyamos.',
            tip: "Acción inmediata: Muestra profesionalismo y resalta que CIMA invierte su propio dinero en pauta digital."
        },
        {
            title: '🛑 "Las inmobiliarias no sirven / Ya la tengo con un asesor y nada"',
            answer: 'Te entiendo perfecto, hay mucho improvisado allá afuera que solo cuelga una lona y espera un milagro. CIMA es diferente porque ellos invierten presupuesto en publicidad digital pagada para promover la propiedad activamente todos los días. Por eso ofrecen la garantía de menos de 30 días. Dile a tu conocido que no pierde nada con pedir una segunda opinión gratuita.',
            tip: "Acción inmediata: Destaca la garantía de 30 días y la pauta digital como diferenciador único."
        }
    ];

    return (
        <div className="bg-cima-card border border-cima-border rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-cima-gold" />
                </div>
                <div>
                    <h3 className="text-lg font-heading font-black text-cima-text">Simulador de Respuestas en Vivo</h3>
                    <p className="text-xs text-cima-text-muted">Haz clic en lo que te contestó la persona para ver el script exacto de respuesta.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {scenarios.map((sc, idx) => (
                    <button
                        key={idx}
                        onClick={() => setSelectedScenario(idx)}
                        className={`p-4 rounded-2xl border text-left text-xs font-bold transition-all flex items-center justify-between gap-3 ${
                            selectedScenario === idx
                                ? "bg-cima-gold text-cima-bg border-cima-gold shadow-lg"
                                : "bg-cima-surface border-cima-border text-cima-text-muted hover:border-cima-gold/30 hover:text-cima-text"
                        }`}
                    >
                        <span>{sc.title}</span>
                        <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${selectedScenario === idx ? "rotate-[270deg]" : ""}`} />
                    </button>
                ))}
            </div>

            {selectedScenario !== null && (
                <motion.div
                    key={selectedScenario}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-cima-surface/80 border border-cima-gold/25 rounded-2xl p-6 relative"
                >
                    <div className="flex items-center justify-between gap-4 mb-3">
                        <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-widest">Lo que debes contestar:</span>
                        <CopyButton text={scenarios[selectedScenario].answer} />
                    </div>
                    <p className="text-sm text-cima-text leading-relaxed font-medium mb-4 italic">
                        "{scenarios[selectedScenario].answer}"
                    </p>
                    <div className="bg-cima-gold/5 border border-cima-gold/20 rounded-xl p-3 text-[11px] text-cima-gold flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 shrink-0" />
                        <span><strong>Tip Pro:</strong> {scenarios[selectedScenario].tip}</span>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

// ─── CARD GENERATOR ──────────────────────────────────────────────────────────
function CardGenerator() {
    const [nombre, setNombre] = useState("");
    const [colorScheme, setColorScheme] = useState<"gold" | "dark" | "luxury">("gold");
    const [downloaded, setDownloaded] = useState(false);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    const schemes = {
        gold:    { bg: "#090A0D", accent: "#C8A96E", text: "#F0EDE8", sub: "#7A6A4F" },
        dark:    { bg: "#0D0D0D", accent: "#FFFFFF", text: "#FFFFFF", sub: "#888888" },
        luxury:  { bg: "#1A0A00", accent: "#E8B84B", text: "#FFF8E7", sub: "#A07A30" },
    };

    const drawCard = React.useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const W = 1080, H = 1920;
        canvas.width = W;
        canvas.height = H;
        const s = schemes[colorScheme];

        // Background
        ctx.fillStyle = s.bg;
        ctx.fillRect(0, 0, W, H);

        // Subtle dot grid
        ctx.fillStyle = s.accent + "18";
        for (let x = 32; x < W; x += 64) {
            for (let y = 32; y < H; y += 64) {
                ctx.beginPath();
                ctx.arc(x, y, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Top gradient glow
        const glow = ctx.createRadialGradient(W / 2, 0, 0, W / 2, 0, 900);
        glow.addColorStop(0, s.accent + "22");
        glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, W, H);

        // Large decorative circle
        ctx.beginPath();
        ctx.arc(W / 2, H * 0.38, 320, 0, Math.PI * 2);
        ctx.strokeStyle = s.accent + "30";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(W / 2, H * 0.38, 240, 0, Math.PI * 2);
        ctx.strokeStyle = s.accent + "18";
        ctx.lineWidth = 1;
        ctx.stroke();

        // House emoji / icon as text
        ctx.font = "200px serif";
        ctx.textAlign = "center";
        ctx.fillText("🏠", W / 2, H * 0.42);

        // Divider line
        ctx.strokeStyle = s.accent;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(W * 0.15, H * 0.52);
        ctx.lineTo(W * 0.85, H * 0.52);
        ctx.stroke();

        // Main headline
        ctx.font = `bold 88px sans-serif`;
        ctx.fillStyle = s.text;
        ctx.textAlign = "center";
        ctx.fillText("¿Quieres vender", W / 2, H * 0.58);
        ctx.fillText("tu casa en Mty?", W / 2, H * 0.64);

        // Gold accent line
        ctx.font = `bold 72px sans-serif`;
        ctx.fillStyle = s.accent;
        ctx.fillText("< 30 DÍAS", W / 2, H * 0.71);

        // Sub text
        ctx.font = `48px sans-serif`;
        ctx.fillStyle = s.sub;
        ctx.fillText("Plan de marketing acelerado.", W / 2, H * 0.76);
        ctx.fillText("Garantizado. Sin costo inicial.", W / 2, H * 0.80);

        // Second divider
        ctx.strokeStyle = s.accent + "60";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(W * 0.25, H * 0.85);
        ctx.lineTo(W * 0.75, H * 0.85);
        ctx.stroke();

        // Referrer name
        if (nombre.trim()) {
            ctx.font = `bold 56px sans-serif`;
            ctx.fillStyle = s.accent;
            ctx.textAlign = "center";
            ctx.fillText(nombre.trim().toUpperCase(), W / 2, H * 0.90);
            ctx.font = `40px sans-serif`;
            ctx.fillStyle = s.sub;
            ctx.fillText("Embajador Oficial CIMA Propiedades", W / 2, H * 0.94);
        } else {
            ctx.font = `bold 52px sans-serif`;
            ctx.fillStyle = s.accent;
            ctx.fillText("CIMA Propiedades", W / 2, H * 0.90);
            ctx.font = `40px sans-serif`;
            ctx.fillStyle = s.sub;
            ctx.fillText("Monterrey · cimapropiedades.com", W / 2, H * 0.94);
        }

        // CTA box
        ctx.fillStyle = s.accent + "20";
        ctx.strokeStyle = s.accent;
        ctx.lineWidth = 3;
        const bx = W * 0.08, by = H * 0.955, bw = W * 0.84, bh = 80;
        ctx.beginPath();
        (ctx as CanvasRenderingContext2D & { roundRect?: Function }).roundRect
            ? (ctx as CanvasRenderingContext2D & { roundRect: Function }).roundRect(bx, by, bw, bh, 24)
            : ctx.rect(bx, by, bw, bh);
        ctx.fill();
        ctx.stroke();
        ctx.font = `bold 42px sans-serif`;
        ctx.fillStyle = s.text;
        ctx.textAlign = "center";
        ctx.fillText("Escríbeme un DM · La asesoría es GRATIS", W / 2, by + 52);
    }, [nombre, colorScheme]);

    // Redraw on changes
    React.useEffect(() => { drawCard(); }, [drawCard]);

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement("a");
        link.download = `cima-story-${nombre.trim().toLowerCase().replace(/\s+/, "-") || "embajador"}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        setDownloaded(true);
        setTimeout(() => setDownloaded(false), 3000);
    };

    return (
        <div className="space-y-6">
            {/* Controls */}
            <div className="bg-cima-card border border-cima-border rounded-3xl p-6 space-y-5">
                <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-xl bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center">
                        <Palette className="h-5 w-5 text-cima-gold" />
                    </div>
                    <div>
                        <h3 className="text-base font-heading font-black text-cima-text">Personaliza tu Tarjeta</h3>
                        <p className="text-xs text-cima-text-muted">La imagen se genera en 1080x1920px, lista para Stories e Instagram.</p>
                    </div>
                </div>

                <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-cima-text-muted mb-2">Tu Nombre (aparecerá en la tarjeta)</label>
                    <input
                        type="text"
                        value={nombre}
                        onChange={e => setNombre(e.target.value)}
                        placeholder="Ej. Juan Pérez"
                        className="w-full bg-cima-surface border border-cima-border rounded-xl px-4 py-3 text-sm text-cima-text placeholder-cima-text-dim focus:border-cima-gold/40 outline-none transition-all"
                    />
                </div>

                <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-cima-text-muted mb-3">Esquema de Color</label>
                    <div className="grid grid-cols-3 gap-3">
                        {(["gold", "dark", "luxury"] as const).map(sc => (
                            <button
                                key={sc}
                                onClick={() => setColorScheme(sc)}
                                className={`py-3 rounded-xl border text-xs font-bold capitalize transition-all ${
                                    colorScheme === sc
                                        ? "bg-cima-gold text-cima-bg border-cima-gold"
                                        : "bg-cima-surface border-cima-border text-cima-text-muted hover:border-cima-gold/30"
                                }`}
                            >
                                {sc === "gold" ? "✨ Dorado" : sc === "dark" ? "⬛ Oscuro" : "👑 Luxury"}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={handleDownload}
                    className={`w-full py-4 rounded-2xl font-heading font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                        downloaded
                            ? "bg-green-500/10 border border-green-500/30 text-green-400"
                            : "bg-cima-gold text-cima-bg hover:scale-[1.02] shadow-lg shadow-cima-gold/20"
                    }`}
                >
                    {downloaded ? <><CheckCircle2 className="h-4 w-4" /> ¡Descargada! Súbela a tus Stories</> : <><Download className="h-4 w-4" /> Descargar PNG para Stories (1080x1920)</>}
                </button>

                <p className="text-[10px] text-cima-text-dim font-mono text-center">
                    El archivo PNG se guarda directo en tu dispositivo. Luego súbelo a tus Stories de Instagram o Estado de WhatsApp.
                </p>
            </div>

            {/* Preview */}
            <div className="bg-cima-card border border-cima-border rounded-3xl p-5">
                <p className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-widest mb-3">Vista Previa (escala reducida)</p>
                <div className="flex justify-center">
                    <canvas
                        ref={canvasRef}
                        className="rounded-2xl border border-cima-border"
                        style={{ width: "240px", height: "auto" }}
                    />
                </div>
            </div>
        </div>
    );
}

export default function MiniCursoPage() {
    const [activeTab, setActiveTab] = useState(1);

    const modules = [
        { id: 1, name: "1. Oportunidad & Comisiones", icon: DollarSign },
        { id: 2, name: "2. El Gancho (30 Días)", icon: Zap },
        { id: 3, name: "3. La Pregunta Mágica", icon: MessageSquare },
        { id: 4, name: "4. Calificación Rápida", icon: Target },
        { id: 5, name: "5. Scripts Copiar & Pegar", icon: Copy },
        { id: 6, name: "6. Traspaso & Cobro", icon: CheckCircle2 },
        { id: 7, name: "7. Tarjeta para Stories", icon: Image }
    ];

    return (
        <div className="min-h-screen bg-cima-bg text-cima-text selection:bg-cima-gold/30 overflow-x-hidden relative">
            {/* Background pattern */}
            <div className="fixed inset-0 dot-grid pointer-events-none z-0 opacity-60" />
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-cima-gold/8 blur-[150px] rounded-full pointer-events-none z-0" />

            <div className="relative z-10">

                {/* TOP NAVIGATION */}
                <nav className="fixed top-0 left-0 right-0 z-50 border-b border-cima-border/50 backdrop-blur-xl bg-cima-bg/85">
                    <div className="mx-auto max-w-6xl h-16 px-6 flex items-center justify-between">
                        <Link href="/gana" className="flex items-center gap-2 text-cima-text-muted hover:text-cima-gold transition-colors text-xs font-mono font-bold">
                            <ArrowLeft className="h-4 w-4" />
                            Volver a Embajadores
                        </Link>
                        <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-lg bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center">
                                <GraduationCap className="text-cima-gold h-4 w-4" />
                            </div>
                            <span className="font-heading font-bold text-sm text-cima-text">Academy CIMA</span>
                        </div>
                    </div>
                </nav>

                {/* HERO HEADER */}
                <header className="pt-28 md:pt-36 pb-12 px-6 text-center max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cima-gold/10 border border-cima-gold/20 mb-6">
                        <GraduationCap className="h-4 w-4 text-cima-gold" />
                        <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-widest">
                            Mini Curso Gratuito de Capacitación
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-6xl font-heading font-black text-cima-text tracking-tight mb-4 leading-tight">
                        Aprende a Referir Propiedades y Gana de <span className="text-cima-gold">$2,500 a $5,000 MXN</span>
                    </h1>

                    <p className="text-sm md:text-lg text-cima-text-muted max-w-2xl mx-auto leading-relaxed mb-8">
                        Guía paso a paso: qué preguntar, qué responder, cómo utilizar nuestra garantía de venta en menos de 30 días y cómo cobrar tus comisiones de forma segura.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 text-xs font-mono text-cima-text-dim">
                        <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-cima-gold" /> Lectura: 6 min</span>
                        <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-cima-gold" /> 100% Práctico</span>
                        <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-cima-gold" /> Scripts incluidos</span>
                    </div>
                </header>

                {/* COURSE MODULES NAV TABS */}
                <div className="max-w-5xl mx-auto px-6 mb-12">
                    <div className="flex overflow-x-auto gap-2 p-1.5 bg-cima-card border border-cima-border rounded-2xl scrollbar-none">
                        {modules.map((m) => {
                            const Icon = m.icon;
                            return (
                                <button
                                    key={m.id}
                                    onClick={() => setActiveTab(m.id)}
                                    className={`px-4 py-3 rounded-xl text-xs font-bold font-heading whitespace-nowrap transition-all flex items-center gap-2.5 ${
                                        activeTab === m.id
                                            ? "bg-cima-gold text-cima-bg shadow-md"
                                            : "text-cima-text-muted hover:text-cima-text hover:bg-cima-surface/50"
                                    }`}
                                >
                                    <Icon className="h-4 w-4 shrink-0" />
                                    <span>{m.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* MODULE CONTENT DISPLAY */}
                <main className="max-w-4xl mx-auto px-6 pb-24">
                    <AnimatePresence mode="wait">
                        {activeTab === 1 && (
                            <motion.div
                                key={1}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                <div className="bg-cima-card border border-cima-border rounded-3xl p-6 md:p-10 space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-2xl bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center">
                                            <DollarSign className="h-6 w-6 text-cima-gold" />
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-widest">Módulo 1</span>
                                            <h2 className="text-2xl font-heading font-black text-cima-text">La Oportunidad y Cuánto Puedes Ganar</h2>
                                        </div>
                                    </div>

                                    <p className="text-sm text-cima-text-muted leading-relaxed">
                                        No necesitas ser cliente de CIMA ni tener cédula inmobiliaria. Tu único rol es ser el conector entre personas que quieren vender su propiedad en Monterrey y nuestro equipo de asesores expertos.
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                        <div className="bg-cima-surface border border-cima-border rounded-2xl p-5">
                                            <p className="text-xs font-mono font-bold text-cima-gold uppercase tracking-widest mb-1">Comisión por Cierre</p>
                                            <p className="text-3xl font-heading font-black text-cima-text">$2,500 – $5,000 <span className="text-sm font-normal text-cima-gold">MXN</span></p>
                                            <p className="text-[11px] text-cima-text-muted mt-2">Pagado por cada propiedad que nos refieras y que se venda y escriture exitosamente.</p>
                                        </div>
                                        <div className="bg-cima-surface border border-cima-border rounded-2xl p-5">
                                            <p className="text-xs font-mono font-bold text-cima-gold uppercase tracking-widest mb-1">Método de Pago</p>
                                            <p className="text-xl font-heading font-bold text-cima-text">Transferencia SPEI Directa</p>
                                            <p className="text-[11px] text-cima-text-muted mt-2">Sin demoras ni trabas. Se transfiere el día de la firma de escrituras ante notario público.</p>
                                        </div>
                                    </div>

                                    <div className="border-t border-cima-border pt-6">
                                        <h4 className="text-sm font-heading font-bold text-cima-text mb-4">Tabla de Proyección de Ganancias Anuales:</h4>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left text-xs border-collapse">
                                                <thead>
                                                    <tr className="border-b border-cima-border text-cima-gold font-mono text-[10px] uppercase">
                                                        <th className="py-3 px-4">Casas Referidas al Año</th>
                                                        <th className="py-3 px-4">Ganancia Total Estimada</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-cima-border text-cima-text-muted">
                                                    <tr><td className="py-3 px-4 font-bold text-cima-text">1 Propiedad</td><td className="py-3 px-4">$2,500 – $5,000 MXN</td></tr>
                                                    <tr><td className="py-3 px-4 font-bold text-cima-text">3 Propiedades</td><td className="py-3 px-4 font-bold text-cima-gold">$11,250 MXN (Promedio)</td></tr>
                                                    <tr><td className="py-3 px-4 font-bold text-cima-text">5 Propiedades</td><td className="py-3 px-4 font-bold text-cima-gold">$18,750 MXN</td></tr>
                                                    <tr><td className="py-3 px-4 font-bold text-cima-text">10 Propiedades</td><td className="py-3 px-4 font-bold text-cima-gold">$37,500 MXN+</td></tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 2 && (
                            <motion.div
                                key={2}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                <div className="bg-cima-card border border-cima-border rounded-3xl p-6 md:p-10 space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-2xl bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center">
                                            <Zap className="h-6 w-6 text-cima-gold" />
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-widest">Módulo 2</span>
                                            <h2 className="text-2xl font-heading font-black text-cima-text">La Oferta Irresistible (Tu Gancho de Venta)</h2>
                                        </div>
                                    </div>

                                    <p className="text-sm text-cima-text-muted leading-relaxed">
                                        Para lograr que la persona acepte darte el contacto o hablar con CIMA, necesitas presentar la razón por la que CIMA es totalmente superior a cualquier otra inmobiliaria en Monterrey.
                                    </p>

                                    <div className="bg-cima-gold/10 border border-cima-gold/30 rounded-2xl p-6 text-center space-y-3">
                                        <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-[0.2em]">Tu Gancho Principal</span>
                                        <h3 className="text-xl md:text-2xl font-heading font-black text-cima-text">
                                            "CIMA garantiza la venta de la propiedad en MENOS DE 30 DÍAS con un plan de marketing acelerado."
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                                        {[
                                            { title: "Publicidad Pagada", desc: "No nos quedamos esperando. Invertimos presupuesto diario en Facebook, Instagram y Google Ads para atraer compradores reales." },
                                            { title: "0 Riesgo para el Dueño", desc: "La valuación comercial, sesión fotográfica HD y contratos son 100% GRATIS para el propietario. Solo paga si vendemos." },
                                            { title: "Atención Senior", desc: "Asesoría personalizada brindada por directores de cuenta como Alejandro L., Darien G. o Jair P." }
                                        ].map((item, idx) => (
                                            <div key={idx} className="bg-cima-surface border border-cima-border rounded-2xl p-5">
                                                <h4 className="text-sm font-heading font-bold text-cima-gold mb-2">{item.title}</h4>
                                                <p className="text-xs text-cima-text-muted leading-relaxed">{item.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 3 && (
                            <motion.div
                                key={3}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                <div className="bg-cima-card border border-cima-border rounded-3xl p-6 md:p-10 space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-2xl bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center">
                                            <MessageSquare className="h-6 w-6 text-cima-gold" />
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-widest">Módulo 3</span>
                                            <h2 className="text-2xl font-heading font-black text-cima-text">La Pregunta Mágica y Simulador de Diálogo</h2>
                                        </div>
                                    </div>

                                    <p className="text-sm text-cima-text-muted leading-relaxed">
                                        Todo empieza con una pregunta rompehielos súper sencilla en tus pláticas cotidianas o por mensaje casual de WhatsApp:
                                    </p>

                                    <div className="bg-cima-surface border border-cima-gold/30 rounded-2xl p-6 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-widest">La Pregunta Rompehielos:</span>
                                            <CopyButton text="Oye, de pura casualidad... ¿conoces a alguien que ande queriendo vender su casa o departamento aquí en Monterrey?" label="Copiar Pregunta" />
                                        </div>
                                        <p className="text-base md:text-lg font-heading font-bold text-cima-text">
                                            "Oye [Nombre], de pura casualidad... ¿conoces a alguien que ande queriendo vender su casa o departamento aquí en Monterrey?"
                                        </p>
                                    </div>

                                    {/* SIMULATOR */}
                                    <InteractiveScriptSimulator />
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 4 && (
                            <motion.div
                                key={4}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                <div className="bg-cima-card border border-cima-border rounded-3xl p-6 md:p-10 space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-2xl bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center">
                                            <Target className="h-6 w-6 text-cima-gold" />
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-widest">Módulo 4</span>
                                            <h2 className="text-2xl font-heading font-black text-cima-text">Las 4 Preguntas de Calificación Rápida</h2>
                                        </div>
                                    </div>

                                    <p className="text-sm text-cima-text-muted leading-relaxed">
                                        Antes de pasarle el contacto al asesor de CIMA, intenta obtener estos 4 datos clave para asegurar una atención hiper-personalizada:
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            { num: "01", q: "¿En qué colonia o zona se ubica la propiedad?", desc: "Ej. San Pedro, San Jerónimo, Cumbres, Apodaca, Carretera Nacional." },
                                            { num: "02", q: "¿Qué tipo de propiedad es?", desc: "Casa habitación, departamento, terreno residencial o comercial, local." },
                                            { num: "03", q: "¿Qué tan urgente es vender?", desc: "¿Necesitan vender de inmediato este mes o están explorando sin prisa?" },
                                            { num: "04", q: "¿Está la papelería libre de gravamen?", desc: "Saber si cuenta con hipoteca o adeudo permite al asesor preparar la estrategia legal." }
                                        ].map((item, idx) => (
                                            <div key={idx} className="bg-cima-surface border border-cima-border rounded-2xl p-5 relative">
                                                <span className="absolute top-4 right-4 text-xs font-mono font-bold text-cima-gold/40">{item.num}</span>
                                                <h4 className="text-sm font-heading font-bold text-cima-text mb-2 pr-6">{item.q}</h4>
                                                <p className="text-xs text-cima-text-muted">{item.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 5 && (
                            <motion.div
                                key={5}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                <div className="bg-cima-card border border-cima-border rounded-3xl p-6 md:p-10 space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-2xl bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center">
                                            <Copy className="h-6 w-6 text-cima-gold" />
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-widest">Módulo 5</span>
                                            <h2 className="text-2xl font-heading font-black text-cima-text">Scripts Listos para Copiar y Pegar</h2>
                                        </div>
                                    </div>

                                    <p className="text-sm text-cima-text-muted leading-relaxed">
                                        Utiliza estos mensajes exactos para tus redes sociales, estados de WhatsApp o mensajes directos.
                                    </p>

                                    {/* SCRIPT 1 */}
                                    <div className="bg-cima-surface border border-cima-border rounded-2xl p-5 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xs font-mono font-bold text-cima-gold uppercase tracking-widest">Script 1: Para enviar a un amigo por WhatsApp</h4>
                                            <CopyButton text={`¡Hola! 👋 Oye, rápido... ¿de casualidad sabes de alguien que ande queriendo vender su casa o departamento aquí en Mty? 🏠\n\nEstoy colaborando con CIMA Propiedades y traen una garantía increíble de venta en menos de 30 días con marketing digital pagado.\n\nSi conoces a alguien me dices para conectarlo con su asesor senior y que le hagan el análisis sin costo. ¡Un abrazo!`} />
                                        </div>
                                        <div className="bg-cima-bg border border-cima-border rounded-xl p-4 text-xs font-mono text-cima-text-muted leading-relaxed">
                                            ¡Hola! 👋 Oye, rápido... ¿de casualidad sabes de alguien que ande queriendo vender su casa o departamento aquí en Mty? 🏠<br/><br/>
                                            Estoy colaborando con CIMA Propiedades y traen una garantía increíble de venta en menos de 30 días con marketing digital pagado.<br/><br/>
                                            Si conoces a alguien me dices para conectarlo con su asesor senior y que le hagan el análisis sin costo. ¡Un abrazo!
                                        </div>
                                    </div>

                                    {/* SCRIPT 2 */}
                                    <div className="bg-cima-surface border border-cima-border rounded-2xl p-5 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xs font-mono font-bold text-cima-gold uppercase tracking-widest">Script 2: Para Estado de WhatsApp / Story Instagram</h4>
                                            <CopyButton text={`🏠 ¿Quieres vender tu casa en Monterrey al mejor precio y en menos de 30 DÍAS? 🚀\n\nJunto con CIMA Propiedades garantizamos la estrategia de venta acelerada con marketing digital profesional.\n\nSi tú o algún conocido quiere vender, envíame un mensaje privado y les consigo una valuación 100% GRATIS hoy mismo. 📲👇`} />
                                        </div>
                                        <div className="bg-cima-bg border border-cima-border rounded-xl p-4 text-xs font-mono text-cima-text-muted leading-relaxed">
                                            🏠 ¿Quieres vender tu casa en Monterrey al mejor precio y en menos de 30 DÍAS? 🚀<br/><br/>
                                            Junto con CIMA Propiedades garantizamos la estrategia de venta acelerada con marketing digital profesional.<br/><br/>
                                            Si tú o algún conocido quiere vender, envíame un mensaje privado y les consigo una valuación 100% GRATIS hoy mismo. 📲👇
                                        </div>
                                    </div>

                                    {/* SCRIPT 3 */}
                                    <div className="bg-cima-surface border border-cima-border rounded-2xl p-5 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xs font-mono font-bold text-cima-gold uppercase tracking-widest">Script 3: Presentación Grupo WhatsApp 3 Vías</h4>
                                            <CopyButton text={`Hola [Nombre del Propietario], te presento a [Asesor] de CIMA Propiedades. Él es el especialista que te comenté que ayuda a vender casas en menos de 30 días en Monterrey. Los dejo conectados para que [Asesor] te comparta la propuesta de valor y valuación sin compromiso. ¡Mucho éxito a ambos!`} />
                                        </div>
                                        <div className="bg-cima-bg border border-cima-border rounded-xl p-4 text-xs font-mono text-cima-text-muted leading-relaxed">
                                            Hola [Nombre del Propietario], te presento a [Asesor] de CIMA Propiedades. Él es el especialista que te comenté que ayuda a vender casas en menos de 30 días en Monterrey. Los dejo conectados para que [Asesor] te comparta la propuesta de valor y valuación sin compromiso. ¡Mucho éxito a ambos!
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 6 && (
                            <motion.div
                                key={6}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                <div className="bg-cima-card border border-cima-border rounded-3xl p-6 md:p-10 space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-2xl bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center">
                                            <CheckCircle2 className="h-6 w-6 text-cima-gold" />
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-widest">Módulo 6</span>
                                            <h2 className="text-2xl font-heading font-black text-cima-text">Traspaso del Prospecto y Cobro</h2>
                                        </div>
                                    </div>

                                    <p className="text-sm text-cima-text-muted leading-relaxed">
                                        Tienes dos formas facilísimas de entregar el contacto y congelar tu atribución en el CRM de CIMA Propiedades:
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-cima-surface border border-cima-gold/30 rounded-2xl p-6 space-y-4">
                                            <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-widest">Método 1</span>
                                            <h4 className="text-base font-heading font-bold text-cima-text">Registro Web Directo</h4>
                                            <p className="text-xs text-cima-text-muted leading-relaxed">
                                                Ve al formulario en <strong>cimapropiedades.com/gana</strong>, ingresa tus datos y los del propietario. El sistema le asigna el prospecto inmediatamente al asesor seleccionado.
                                            </p>
                                            <Link
                                                href="/gana#form-referidos"
                                                className="inline-flex items-center gap-2 text-xs font-bold font-mono text-cima-gold hover:underline"
                                            >
                                                Ir al Formulario Web →
                                            </Link>
                                        </div>

                                        <div className="bg-cima-surface border border-cima-gold/30 rounded-2xl p-6 space-y-4">
                                            <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-widest">Método 2</span>
                                            <h4 className="text-base font-heading font-bold text-cima-text">Grupo de WhatsApp 3 Vías</h4>
                                            <p className="text-xs text-cima-text-muted leading-relaxed">
                                                Crea un grupo de WhatsApp entre tú, el propietario y el asesor asignado (Alejandro, Darien o Jair) y envía el Script 3 del Módulo 5.
                                            </p>
                                            <span className="inline-block text-[10px] font-mono text-cima-text-dim">
                                                ⭐ Recomendado para cierres más rápidos
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-cima-gold/10 border border-cima-gold/30 rounded-2xl p-6 text-center space-y-4">
                                        <h3 className="text-lg font-heading font-black text-cima-text">¿Listo para comenzar a referir tu primer contacto?</h3>
                                        <p className="text-xs text-cima-text-muted max-w-lg mx-auto">
                                            Regístrate ahora como Embajador CIMA para obtener tu enlace personal y asociar tus futuras comisiones.
                                        </p>
                                        <Link
                                            href="/gana#form-referidos"
                                            className="inline-flex items-center gap-3 px-8 py-4 bg-cima-gold text-cima-bg font-heading font-black rounded-2xl text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-cima-gold/20"
                                        >
                                            Registrarme como Embajador CIMA
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        {activeTab === 7 && (
                            <motion.div
                                key={7}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                <div className="bg-cima-card border border-cima-border rounded-3xl p-6 md:p-10 space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-2xl bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center">
                                            <Image className="h-6 w-6 text-cima-gold" />
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-widest">Módulo 7 · Bonus</span>
                                            <h2 className="text-2xl font-heading font-black text-cima-text">Generador de Tarjeta Digital para Stories</h2>
                                        </div>
                                    </div>
                                    <p className="text-sm text-cima-text-muted leading-relaxed">
                                        Crea en segundos tu imagen personalizada para subir a tus <strong>Stories de Instagram</strong> o <strong>Estado de WhatsApp</strong>. Pon tu nombre y descarga el PNG listo para compartir.
                                    </p>
                                    <CardGenerator />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
