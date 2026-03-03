"use client";

import React, { useState, useMemo } from "react";
import {
    motion,
    AnimatePresence
} from "framer-motion";
import {
    ChevronRight,
    ChevronLeft,
    Calendar,
    Sparkles,
    Zap,
    ShieldCheck,
    Send,
    Star,
    MapPin,
    Target,
    Layout,
    TrendingUp,
    Palette,
    Clock,
    Check,
    Copy,
    CreditCard,
    Building2,
    Users,
    Crown,
    FileText
} from "lucide-react";
import Link from "next/link";

/* ─── Types ─── */
type OnboardingData = {
    clientName: string;
    agencyName: string;
    phone: string;
    specialty: string;
    inventorySize: string;
    mainPainPoint: string;
    colors: string;
    growthGoal: string;
    clientEmail: string;
    selectedPlan: "starter" | "professional" | "team";
};

type PlanInfo = {
    name: string;
    setup: number;
    monthly: number;
    tag: string;
    icon: React.ElementType;
    features: string[];
};

const PLANS: Record<string, PlanInfo> = {
    starter: {
        name: "Starter",
        setup: 14900,
        monthly: 4900,
        tag: "Profesionalízate",
        icon: Star,
        features: ["Landing de Lujo", "Panel Admin", "Portal del Dueño", "Soporte Email"]
    },
    professional: {
        name: "Professional",
        setup: 29900,
        monthly: 4900,
        tag: "El Más Elegido",
        icon: Crown,
        features: ["Todo de Starter", "IA Nurture de Leads", "Contratos IA", "Soporte VIP"]
    },
    team: {
        name: "Team / Agency",
        setup: 49900,
        monthly: 4900,
        tag: "Domina tu Zona",
        icon: Users,
        features: ["Todo de Professional", "Multi-Agente", "Reportes ROI", "Asesor de Estrategia"]
    }
};

/* ─── Utilities ─── */
function formatMoney(n: number) {
    return "$" + n.toLocaleString("es-MX");
}

function getSessionDates(): { title: string; date: string; time: string; icon: React.ElementType }[] {
    const now = new Date();
    const s1 = new Date(now); s1.setDate(s1.getDate() + 3);
    const s2 = new Date(now); s2.setDate(s2.getDate() + 8);
    const s3 = new Date(now); s3.setDate(s3.getDate() + 12);

    const fmt = (d: Date) =>
        d.toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" });

    return [
        { title: "Sesión 1: Branding & Landing", date: fmt(s1), time: "10:00 AM", icon: Palette },
        { title: "Sesión 2: Integración IA & CRM", date: fmt(s2), time: "11:30 AM", icon: Zap },
        { title: "Sesión 3: Lanzamiento & Estrategia", date: fmt(s3), time: "09:00 AM", icon: TrendingUp }
    ];
}

/* ─── Confetti ─── */
function Confetti() {
    const particles = useMemo(() =>
        [...Array(60)].map((_, i) => ({
            id: i,
            x: (Math.random() - 0.5) * 1200,
            y: (Math.random() - 0.5) * 1200,
            rotate: Math.random() * 720,
            scale: Math.random() * 2,
            color: ["bg-cima-gold", "bg-white", "bg-yellow-400", "bg-green-400"][i % 4],
            delay: Math.random() * 0.3
        })), []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center overflow-hidden">
            {particles.map(p => (
                <motion.div
                    key={p.id}
                    initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                    animate={{ opacity: 0, scale: p.scale, x: p.x, y: p.y, rotate: p.rotate }}
                    transition={{ duration: 2.5, ease: "easeOut", delay: p.delay }}
                    className={`absolute h-2.5 w-2.5 rounded-sm ${p.color}`}
                />
            ))}
        </div>
    );
}

/* ─── Main Page ─── */
export default function OnboardingPortal() {
    const [step, setStep] = useState<"plan" | "questions" | "scheduling" | "finish">("plan");
    const [qIndex, setQIndex] = useState(0);
    const [copied, setCopied] = useState(false);
    const [data, setData] = useState<OnboardingData>({
        clientName: "",
        agencyName: "",
        phone: "",
        specialty: "",
        inventorySize: "",
        mainPainPoint: "",
        colors: "Dorado y Negro (Cima Standard)",
        growthGoal: "",
        clientEmail: "",
        selectedPlan: "professional"
    });
    const [showConfetti, setShowConfetti] = useState(false);

    const questions = [
        { id: "clientName", q: "¿Cuál es tu nombre completo?", placeholder: "Ej. Carlos Roberto Vargas", icon: Target },
        { id: "agencyName", q: "¿Cómo se llama tu Agencia o Marca Personal?", placeholder: "Ej. Elite Real Estate Monterrey", icon: Building2 },
        { id: "phone", q: "¿Cuál es tu número de WhatsApp?", placeholder: "Ej. 81 1234 5678", icon: Send },
        { id: "specialty", q: "¿En qué zona o tipo de propiedad te orientas?", placeholder: "Ej. Lujo en San Pedro Garza García", icon: MapPin },
        { id: "inventorySize", q: "¿Cuántas propiedades tienes activas hoy?", placeholder: "Ej. 15 propiedades", icon: Layout },
        {
            id: "mainPainPoint", q: "¿Cuál es tu mayor reto hoy?",
            options: ["Captar exclusivas", "Filtrar leads de calidad", "Seguimiento automático", "Imagen profesional"], icon: Zap
        },
        {
            id: "colors", q: "¿Qué estilo visual prefieres para tu plataforma?",
            options: ["Dorado y Negro (Cima Standard)", "Azul Corporativo", "Blanco Minimalista", "Ya tengo mi manual de marca"], icon: Palette
        },
        { id: "growthGoal", q: "¿Qué quieres lograr en los próximos 6 meses?", placeholder: "Ej. Cerrar 3 ventas mensuales automáticas", icon: TrendingUp },
        { id: "clientEmail", q: "¿A qué correo enviamos tu acceso de administrador?", placeholder: "correo@ejemplo.com", icon: Send },
    ];

    const handleNext = () => {
        if (qIndex < questions.length - 1) {
            setQIndex(qIndex + 1);
        } else {
            setStep("scheduling");
        }
    };

    const handleBack = () => {
        if (qIndex > 0) {
            setQIndex(qIndex - 1);
        } else {
            setStep("plan");
        }
    };

    const finishOnboarding = () => {
        setShowConfetti(true);
        setStep("finish");
    };

    const copyClabe = () => {
        navigator.clipboard.writeText("638180010141018767");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const currentPlan = PLANS[data.selectedPlan] || PLANS.professional;
    const anticipo = Math.round(currentPlan.setup * 0.3);
    const sessions = getSessionDates();
    const today = new Date().toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });
    const invoiceNum = `NV-${Date.now().toString().slice(-6)}`;

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-white selection:bg-cima-gold selection:text-black font-sans overflow-hidden">
            {showConfetti && <Confetti />}

            {/* Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cima-gold/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 blur-[120px] rounded-full" />
            </div>

            {/* Nav */}
            <nav className="relative z-50 px-6 py-5 border-b border-white/5 bg-black/20 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 bg-cima-gold rounded-xl flex items-center justify-center shadow-lg shadow-cima-gold/20">
                            <Star className="text-black h-5 w-5 fill-current" />
                        </div>
                        <span className="font-heading font-black tracking-tighter text-xl uppercase italic">CIMA <span className="text-cima-gold">PRO</span></span>
                    </div>
                    <div className="hidden md:flex items-center gap-6">
                        <div className="flex flex-col items-end">
                            <p className="text-[10px] font-black uppercase tracking-widest text-cima-gold">Portal de Onboarding</p>
                            <p className="text-[9px] text-white/40 uppercase tracking-widest">{today}</p>
                        </div>
                        {/* Step Indicator */}
                        <div className="flex items-center gap-2">
                            {["Plan", "Datos", "Agenda", "Listo"].map((s, i) => {
                                const stepMap = ["plan", "questions", "scheduling", "finish"];
                                const isActive = stepMap.indexOf(step) >= i;
                                return (
                                    <div key={s} className="flex items-center gap-2">
                                        <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[8px] font-black transition-all ${isActive ? "bg-cima-gold text-black" : "bg-white/5 text-white/20"}`}>
                                            {stepMap.indexOf(step) > i ? <Check className="h-3 w-3" /> : i + 1}
                                        </div>
                                        {i < 3 && <div className={`w-6 h-px ${isActive ? "bg-cima-gold/40" : "bg-white/5"}`} />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </nav>

            <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 pb-28">

                {/* Left: Interactive Flow */}
                <div className="lg:col-span-7 flex flex-col justify-center min-h-[520px]">
                    <AnimatePresence mode="wait">

                        {/* ─── Plan Selection ─── */}
                        {step === "plan" && (
                            <motion.div key="plan" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
                                <div className="space-y-3">
                                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                                        className="text-[10px] md:text-[12px] font-mono font-bold text-cima-gold uppercase tracking-[0.4em] block">
                                        Paso 1 de 3
                                    </motion.span>
                                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-black tracking-tight leading-[0.9]">
                                        ELIGE TU <span className="text-cima-gold">PLAN ELITE.</span>
                                    </h1>
                                    <p className="text-white/50 text-sm md:text-base max-w-lg">Selecciona el nivel de tecnología que potenciará tu negocio inmobiliario.</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {(Object.entries(PLANS) as [string, PlanInfo][]).map(([key, plan]) => {
                                        const isSelected = data.selectedPlan === key;
                                        return (
                                            <button
                                                key={key}
                                                onClick={() => setData({ ...data, selectedPlan: key as OnboardingData["selectedPlan"] })}
                                                className={`relative p-5 rounded-2xl border text-left transition-all ${isSelected
                                                    ? "bg-cima-gold/10 border-cima-gold shadow-lg shadow-cima-gold/10 scale-[1.02]"
                                                    : "bg-white/[0.02] border-white/10 hover:border-white/20"}`}
                                            >
                                                {key === "professional" && (
                                                    <div className="absolute -top-2.5 left-4 bg-cima-gold text-black text-[7px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
                                                        Recomendado
                                                    </div>
                                                )}
                                                <plan.icon className={`h-5 w-5 mb-3 ${isSelected ? "text-cima-gold" : "text-white/30"}`} />
                                                <p className={`text-[9px] font-bold uppercase tracking-widest mb-1 ${isSelected ? "text-cima-gold" : "text-white/30"}`}>{plan.tag}</p>
                                                <p className={`font-heading font-black text-lg ${isSelected ? "text-white" : "text-white/60"}`}>{plan.name}</p>
                                                <p className={`font-mono text-xl font-black mt-1 ${isSelected ? "text-cima-gold" : "text-white/40"}`}>{formatMoney(plan.setup)}</p>
                                                <ul className="mt-3 space-y-1">
                                                    {plan.features.map(f => (
                                                        <li key={f} className={`text-[9px] flex items-center gap-1.5 ${isSelected ? "text-white/60" : "text-white/20"}`}>
                                                            <Check className="h-2.5 w-2.5 text-cima-gold shrink-0" /> {f}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={() => setStep("questions")}
                                    className="group w-full sm:w-auto bg-cima-gold text-black px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-white transition-all shadow-[0_20px_40px_rgba(200,169,110,0.2)]"
                                >
                                    Continuar <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </motion.div>
                        )}

                        {/* ─── Questions ─── */}
                        {step === "questions" && (
                            <motion.div key="questions" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="h-1.5 bg-cima-gold/20 flex-1 rounded-full overflow-hidden">
                                        <motion.div className="h-full bg-cima-gold rounded-full" initial={{ width: 0 }}
                                            animate={{ width: `${((qIndex + 1) / questions.length) * 100}%` }}
                                            transition={{ type: "spring", stiffness: 100, damping: 15 }} />
                                    </div>
                                    <span className="text-[10px] font-mono font-bold text-cima-gold whitespace-nowrap">{qIndex + 1} / {questions.length}</span>
                                </div>

                                <AnimatePresence mode="wait">
                                    <motion.div key={qIndex} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }} className="space-y-6">
                                        <div className="h-12 w-12 rounded-2xl bg-cima-gold/10 border border-cima-gold/20 flex items-center justify-center text-cima-gold">
                                            {React.createElement(questions[qIndex].icon, { className: "h-6 w-6" })}
                                        </div>
                                        <h2 className="text-2xl md:text-4xl font-heading font-bold leading-tight">{questions[qIndex].q}</h2>

                                        {questions[qIndex].options ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {questions[qIndex].options!.map(opt => (
                                                    <button key={opt}
                                                        onClick={() => setData({ ...data, [questions[qIndex].id]: opt })}
                                                        className={`p-4 rounded-2xl border text-left transition-all ${data[questions[qIndex].id as keyof OnboardingData] === opt
                                                            ? "bg-cima-gold border-cima-gold text-black shadow-lg shadow-cima-gold/20"
                                                            : "bg-white/5 border-white/10 text-white/60 hover:border-white/20"}`}>
                                                        <span className="text-xs font-bold uppercase tracking-widest">{opt}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <input autoFocus type="text"
                                                value={data[questions[qIndex].id as keyof OnboardingData]}
                                                onChange={e => setData({ ...data, [questions[qIndex].id]: e.target.value })}
                                                onKeyDown={e => e.key === "Enter" && handleNext()}
                                                placeholder={questions[qIndex].placeholder}
                                                className="w-full bg-transparent border-b-2 border-white/10 py-4 text-xl md:text-2xl font-medium outline-none focus:border-cima-gold transition-all placeholder:text-white/10" />
                                        )}
                                    </motion.div>
                                </AnimatePresence>

                                <div className="flex items-center gap-4 pt-6">
                                    <button onClick={handleBack}
                                        className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all shrink-0">
                                        <ChevronLeft />
                                    </button>
                                    <button onClick={handleNext}
                                        className="flex-1 bg-white text-black py-4 rounded-full font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-cima-gold transition-all shadow-xl">
                                        {qIndex === questions.length - 1 ? "Ir a Agendar Sesiones" : "Siguiente"} <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* ─── Scheduling ─── */}
                        {step === "scheduling" && (
                            <motion.div key="scheduling" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
                                <div className="space-y-3">
                                    <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-[0.4em]">Paso 3 de 3</span>
                                    <h2 className="text-3xl md:text-4xl font-heading font-black">Reserva tus <span className="text-cima-gold">Sesiones</span></h2>
                                    <p className="text-white/50 text-sm">Tu proyecto se divide en 3 entregables. Estas son las fechas sugeridas:</p>
                                </div>

                                <div className="space-y-3">
                                    {sessions.map((s, i) => (
                                        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                                            className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 group hover:border-cima-gold/30 transition-all">
                                            <div className="h-12 w-12 rounded-xl bg-cima-gold/10 flex items-center justify-center text-cima-gold group-hover:bg-cima-gold group-hover:text-black transition-all shrink-0">
                                                <s.icon className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">{s.title}</p>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar className="h-3 w-3 text-cima-gold" />
                                                        <span className="text-sm font-bold">{s.date}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock className="h-3 w-3 text-cima-gold" />
                                                        <span className="text-sm font-bold">{s.time}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                                                <Check className="h-4 w-4" />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="flex items-center gap-4 pt-4">
                                    <button onClick={() => { setStep("questions"); setQIndex(questions.length - 1); }}
                                        className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all shrink-0">
                                        <ChevronLeft />
                                    </button>
                                    <button onClick={finishOnboarding}
                                        className="flex-1 bg-cima-gold text-black py-5 rounded-full font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-white transition-all shadow-[0_20px_40px_rgba(200,169,110,0.3)]">
                                        Confirmar Lanzamiento <Sparkles className="h-5 w-5" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* ─── Finish ─── */}
                        {step === "finish" && (
                            <motion.div key="finish" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-8 py-12">
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                                    className="h-28 w-28 rounded-full bg-green-500/20 border-2 border-green-500/40 flex items-center justify-center mx-auto shadow-[0_0_60px_rgba(34,197,94,0.3)]">
                                    <Check className="h-14 w-14 text-green-500" />
                                </motion.div>
                                <div className="space-y-4">
                                    <h2 className="text-4xl md:text-6xl font-heading font-black tracking-tight">¡BIENVENIDO<br /><span className="text-cima-gold">AL CLUB!</span></h2>
                                    <p className="text-white/50 text-base max-w-md mx-auto">
                                        {data.clientName ? `${data.clientName}, tu` : "Tu"} proyecto con <strong className="text-white">Cima Pro {currentPlan.name}</strong> está en marcha.
                                        Nos vemos en la primera sesión de diseño.
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                                    <Link href="/demo/live" className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-3 rounded-full text-white/60 font-bold uppercase tracking-widest text-[10px] hover:border-cima-gold/30 transition-all">
                                        <Layout className="h-4 w-4" /> Ver Demo Admin
                                    </Link>
                                    <Link href="/vende-mas" className="inline-flex items-center gap-2 text-cima-gold font-black uppercase tracking-widest text-[10px] hover:text-white transition-all">
                                        Volver a Inicio <ChevronRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right: Live Invoice */}
                <div className="lg:col-span-5">
                    <div className="lg:sticky lg:top-8">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                            className="bg-white rounded-3xl md:rounded-[2.5rem] p-7 md:p-9 text-black shadow-2xl relative overflow-hidden">

                            {/* Watermark */}
                            <div className="absolute top-8 right-8 opacity-[0.03] select-none pointer-events-none">
                                <Star className="h-56 w-56 fill-current rotate-12" />
                            </div>

                            <div className="relative z-10 space-y-7">
                                {/* Header */}
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <FileText className="h-3.5 w-3.5 text-gray-400" />
                                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">{invoiceNum}</p>
                                        </div>
                                        <h3 className="text-lg font-heading font-black italic">CIMA <span className="text-cima-gold">PRO</span></h3>
                                        <p className="text-[8px] text-gray-400 mt-0.5">{today}</p>
                                    </div>
                                    <div className={`px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${step === "finish"
                                        ? "bg-green-50 text-green-600 border border-green-200"
                                        : "bg-amber-50 text-amber-600 border border-amber-200"}`}>
                                        {step === "finish" ? "✓ Confirmado" : "Pendiente Anticipo"}
                                    </div>
                                </div>

                                {/* Client Info */}
                                <div>
                                    <p className="text-[7px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">CONTRATANTE</p>
                                    <div className="space-y-0.5">
                                        <p className="text-lg font-bold tracking-tight">{data.clientName || "Nombre del cliente"}</p>
                                        <p className="text-xs text-gray-700 font-medium">{data.agencyName || "Nombre de Agencia"}</p>
                                        <p className="text-[10px] text-gray-400">{data.clientEmail || "correo@ejemplo.com"} · {data.phone || "Teléfono"}</p>
                                        <p className="text-[10px] text-gray-400 italic">Zona: {data.specialty || "Por definir"}</p>
                                    </div>
                                </div>

                                <div className="h-px bg-gray-100 w-full" />

                                {/* Plan Detail */}
                                <div className="space-y-3">
                                    <p className="text-[7px] font-black uppercase tracking-[0.2em] text-gray-400">DETALLE DE INVERSIÓN</p>
                                    <div className="space-y-2.5">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <currentPlan.icon className="h-3.5 w-3.5 text-cima-gold" />
                                                <span className="text-xs font-bold uppercase tracking-wider text-gray-800">Plan {currentPlan.name}</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] text-gray-500">Setup Personalizado (Diseño + Programación)</span>
                                            <span className="font-mono text-xs font-bold">{formatMoney(currentPlan.setup)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] text-gray-500">Mantenimiento Mensual (Servidores + IA)</span>
                                            <span className="font-mono text-[10px] text-gray-400">{formatMoney(currentPlan.monthly)}/mes</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="bg-gray-50 p-5 rounded-2xl space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-black uppercase tracking-widest">Total Setup</span>
                                        <span className="text-2xl font-black font-heading tracking-tighter text-cima-gold">{formatMoney(currentPlan.setup)}</span>
                                    </div>
                                    <div className="h-px bg-gray-200" />
                                    <div className="flex justify-between items-center">
                                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Anticipo Hoy (30%)</span>
                                        <span className="text-lg font-black text-black">{formatMoney(anticipo)}</span>
                                    </div>
                                </div>

                                {/* Payment Info - REAL */}
                                <div className="space-y-3">
                                    <p className="text-[7px] font-black uppercase tracking-[0.2em] text-gray-400">MÉTODO DE PAGO</p>
                                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 p-5 rounded-2xl space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 bg-purple-600 rounded-lg flex items-center justify-center">
                                                    <CreditCard className="h-4 w-4 text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-700">Nu México</p>
                                                    <p className="text-[8px] text-gray-400">Transferencia SPEI / CLABE</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-xl p-3 border border-gray-200">
                                            <p className="text-[7px] font-black uppercase tracking-widest text-gray-400 mb-1">CLABE Interbancaria</p>
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="font-mono text-sm font-bold text-gray-800 tracking-wider">6381 8001 0141 0187 67</p>
                                                <button onClick={copyClabe}
                                                    className={`h-7 w-7 rounded-lg flex items-center justify-center transition-all ${copied ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400 hover:bg-gray-200"}`}>
                                                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex justify-between text-[9px]">
                                                <span className="text-gray-500 font-medium">Beneficiario</span>
                                                <span className="text-gray-800 font-bold">José Alejandro Luna de León</span>
                                            </div>
                                            <div className="flex justify-between text-[9px]">
                                                <span className="text-gray-500 font-medium">Banco</span>
                                                <span className="text-gray-800 font-bold">Nu México</span>
                                            </div>
                                            <div className="flex justify-between text-[9px]">
                                                <span className="text-gray-500 font-medium">Concepto</span>
                                                <span className="text-gray-800 font-bold">Anticipo Cima {currentPlan.name}</span>
                                            </div>
                                            <div className="flex justify-between text-[9px]">
                                                <span className="text-gray-500 font-medium">Monto Anticipo</span>
                                                <span className="text-cima-gold font-black">{formatMoney(anticipo)} MXN</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Legal */}
                                <p className="text-[6px] text-gray-400 text-center uppercase tracking-widest leading-relaxed pt-2">
                                    Al procesar el pago, confirmas la reserva de tu zona exclusiva y aceptas los términos de servicio de Cima Pro.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <div className="fixed bottom-0 left-0 right-0 z-50 px-6 py-3 bg-black/60 backdrop-blur-xl border-t border-white/5">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-widest">Plataforma Activa</span>
                        </div>
                        <div className="h-3 w-px bg-white/10" />
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-3.5 w-3.5 text-cima-gold" />
                            <span className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-widest">Encriptación SSL 256-bit</span>
                        </div>
                    </div>
                    <span className="text-[9px] font-bold text-white/15 uppercase tracking-[0.2em]">Cima Pro v3.0 · © 2025</span>
                </div>
            </div>
        </div>
    );
}
