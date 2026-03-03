"use client";

import React, { useState, useEffect } from "react";
import {
    motion,
    AnimatePresence
} from "framer-motion";
import {
    CheckCircle2,
    ChevronRight,
    ChevronLeft,
    Calendar,
    Sparkles,
    Zap,
    ShieldCheck,
    FileText,
    Download,
    Send,
    Star,
    ArrowRight,
    MapPin,
    Target,
    Layout,
    Smartphone,
    TrendingUp,
    Palette,
    Clock,
    User,
    Check
} from "lucide-react";
import Link from "next/link";

/* ─── Types ─── */
type OnboardingData = {
    agencyName: string;
    specialty: string;
    inventorySize: string;
    mainPainPoint: string;
    colors: string;
    socialMedia: string;
    growthGoal: string;
    clientEmail: string;
    selectedPlan: string;
};

const PLANS = {
    starter: { name: "Starter", setup: 14900, monthly: 4900 },
    professional: { name: "Professional", setup: 29900, monthly: 4900 },
    team: { name: "Team/Agency", setup: 49900, monthly: 4900 }
};

/* ─── Components ─── */

function Confetti() {
    return (
        <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center overflow-hidden">
            {[...Array(50)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{
                        opacity: 1,
                        scale: 0,
                        x: 0,
                        y: 0
                    }}
                    animate={{
                        opacity: 0,
                        scale: Math.random() * 1.5,
                        x: (Math.random() - 0.5) * 1000,
                        y: (Math.random() - 0.5) * 1000,
                        rotate: Math.random() * 360
                    }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className={`absolute h-2 w-2 rounded-sm ${["bg-cima-gold", "bg-white", "bg-yellow-400"][i % 3]}`}
                />
            ))}
        </div>
    );
}

export default function OnboardingPortal() {
    const [step, setStep] = useState<"welcome" | "questions" | "scheduling" | "finish">("welcome");
    const [qIndex, setQIndex] = useState(0);
    const [data, setData] = useState<OnboardingData>({
        agencyName: "",
        specialty: "",
        inventorySize: "",
        mainPainPoint: "",
        colors: "Dorado y Negro (Cima Standard)",
        socialMedia: "",
        growthGoal: "",
        clientEmail: "",
        selectedPlan: "professional"
    });
    const [showConfetti, setShowConfetti] = useState(false);

    const questions = [
        {
            id: "agencyName",
            q: "¿Cómo se llama tu Agencia o Marca Personal?",
            placeholder: "Ej. Elite Real Estate Monterrey",
            icon: Target
        },
        {
            id: "specialty",
            q: "¿En qué zona o tipo de propiedad te orientas?",
            placeholder: "Ej. Lujo en San Pedro Garza García",
            icon: MapPin
        },
        {
            id: "inventorySize",
            q: "¿Cuántas propiedades tienes activas hoy?",
            placeholder: "Ej. 15 propiedades",
            icon: Layout
        },
        {
            id: "mainPainPoint",
            q: "¿Cuál es tu mayor reto hoy?",
            options: ["Captar exclusivas", "Filtrar leads de calidad", "Seguimiento automático", "Imagen profesional"],
            icon: Zap
        },
        {
            id: "colors",
            q: "¿Qué estilo visual prefieres?",
            options: ["Dorado y Negro (Cima Standard)", "Azul Corporativo", "Blanco Minimalista", "Ya tengo mi manual de marca"],
            icon: Palette
        },
        {
            id: "growthGoal",
            q: "¿Qué quieres lograr en los próximos 6 meses?",
            placeholder: "Ej. Cerrar 3 ventas mensuales automáticas",
            icon: TrendingUp
        },
        {
            id: "clientEmail",
            q: "¿A qué correo enviamos tu acceso de administrador?",
            placeholder: "correo@ejemplo.com",
            icon: Send
        }
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
            setStep("welcome");
        }
    };

    const finishOnboarding = () => {
        setShowConfetti(true);
        setStep("finish");
    };

    const currentPlan = PLANS[data.selectedPlan as keyof typeof PLANS] || PLANS.professional;

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-white selection:bg-cima-gold selection:text-black font-sans overflow-hidden">
            {showConfetti && <Confetti />}

            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cima-gold/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 blur-[120px] rounded-full" />
            </div>

            <nav className="relative z-50 px-6 py-6 border-b border-white/5 bg-black/20 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-cima-gold rounded-lg flex items-center justify-center">
                            <Star className="text-black h-5 w-5 fill-current" />
                        </div>
                        <span className="font-heading font-black tracking-tighter text-xl uppercase italic">CIMA <span className="text-cima-gold">ELITE</span></span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex flex-col items-end">
                            <p className="text-[10px] font-black uppercase tracking-widest text-cima-gold">Portal de bienvenida</p>
                            <p className="text-[9px] text-white/40 uppercase tracking-widest">Formalización de Proyecto</p>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* Left Side: Interactive Flow */}
                <div className="lg:col-span-7 flex flex-col justify-center min-h-[500px]">
                    <AnimatePresence mode="wait">
                        {step === "welcome" && (
                            <motion.div
                                key="welcome"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-8"
                            >
                                <div className="space-y-4">
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-[10px] md:text-[12px] font-mono font-bold text-cima-gold uppercase tracking-[0.4em] block"
                                    >
                                        El inicio de tu Nueva Era
                                    </motion.span>
                                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-black tracking-tight leading-[0.9]">
                                        BIENVENIDO AL <br />
                                        <span className="text-cima-gold">CLUB ELITE.</span>
                                    </h1>
                                    <p className="text-white/60 text-base md:text-xl max-w-xl leading-relaxed">
                                        Has tomado la decisión que separa a los vendedores de los **líderes de mercado**. Vamos a configurar tu maquinaria de ventas ahora mismo.
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={() => setStep("questions")}
                                        className="group relative bg-cima-gold text-black px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-white transition-all shadow-[0_20px_40px_rgba(200,169,110,0.2)]"
                                    >
                                        Comenzar Onboarding <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="h-6 w-6 rounded-full border-2 border-black bg-gray-800" />
                                            ))}
                                        </div>
                                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">3 licencias activas hOY</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === "questions" && (
                            <motion.div
                                key="questions"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-8"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-1 bg-cima-gold/20 flex-1 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-cima-gold"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${((qIndex + 1) / questions.length) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-[10px] font-mono font-bold text-cima-gold">{qIndex + 1} / {questions.length}</span>
                                </div>

                                <div className="space-y-6">
                                    <div className="h-12 w-12 rounded-2xl bg-cima-gold/10 border border-cima-gold/20 flex items-center justify-center text-cima-gold">
                                        {React.createElement(questions[qIndex].icon, { className: "h-6 w-6" })}
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-heading font-bold leading-tight">
                                        {questions[qIndex].q}
                                    </h2>

                                    {questions[qIndex].options ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {questions[qIndex].options?.map((opt) => (
                                                <button
                                                    key={opt}
                                                    onClick={() => setData({ ...data, [questions[qIndex].id]: opt })}
                                                    className={`p-4 rounded-2xl border text-left transition-all ${data[questions[qIndex].id as keyof OnboardingData] === opt
                                                            ? "bg-cima-gold border-cima-gold text-black shadow-lg shadow-cima-gold/20"
                                                            : "bg-white/5 border-white/10 text-white/60 hover:border-white/20"
                                                        }`}
                                                >
                                                    <span className="text-xs font-bold uppercase tracking-widest">{opt}</span>
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <input
                                            autoFocus
                                            type="text"
                                            value={data[questions[qIndex].id as keyof OnboardingData]}
                                            onChange={(e) => setData({ ...data, [questions[qIndex].id]: e.target.value })}
                                            onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                                            placeholder={questions[qIndex].placeholder}
                                            className="w-full bg-transparent border-b-2 border-white/10 py-4 text-xl md:text-2xl font-medium outline-none focus:border-cima-gold transition-all placeholder:text-white/10"
                                        />
                                    )}
                                </div>

                                <div className="flex items-center gap-4 pt-10">
                                    <button
                                        onClick={handleBack}
                                        className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all"
                                    >
                                        <ChevronLeft />
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        className="flex-1 bg-white text-black py-4 rounded-full font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-cima-gold transition-all shadow-xl"
                                    >
                                        Siguiente Paso <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === "scheduling" && (
                            <motion.div
                                key="scheduling"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-8"
                            >
                                <div className="space-y-4">
                                    <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-[0.4em]">Fase de Planeación</span>
                                    <h2 className="text-3xl md:text-4xl font-heading font-bold">Reserva tus Sesiones</h2>
                                    <p className="text-white/50 text-sm">Tu proyecto se divide en 3 entregables clave. Agenda las fechas ahora.</p>
                                </div>

                                <div className="space-y-3">
                                    {[
                                        { title: "Sesión 1: Branding & Landing", date: "4 Mar, 2024", time: "10:00 AM", icon: Palette },
                                        { title: "Sesión 2: Integración IA & CRM", date: "8 Mar, 2024", time: "11:30 AM", icon: Zap },
                                        { title: "Sesión 3: Lanzamiento & Estrategia", date: "12 Mar, 2024", time: "09:00 AM", icon: Rocket }
                                    ].map((s, i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 group hover:border-cima-gold/30 transition-all cursor-pointer">
                                            <div className="h-10 w-10 rounded-xl bg-cima-gold/10 flex items-center justify-center text-cima-gold group-hover:bg-cima-gold group-hover:text-black transition-all">
                                                <s.icon className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-0.5">{s.title}</p>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-3 w-3 text-cima-gold" />
                                                    <span className="text-sm font-bold">{s.date}</span>
                                                    <Clock className="h-3 w-3 text-cima-gold ml-2" />
                                                    <span className="text-sm font-bold">{s.time}</span>
                                                </div>
                                            </div>
                                            <div className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                                <Edit3 className="h-3 w-3" />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={finishOnboarding}
                                    className="w-full bg-cima-gold text-black py-5 rounded-full font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-white transition-all shadow-[0_20px_40px_rgba(200,169,110,0.3)] mt-6"
                                >
                                    Confirmar Lanzamiento <Sparkles className="h-5 w-5" />
                                </button>
                            </motion.div>
                        )}

                        {step === "finish" && (
                            <motion.div
                                key="finish"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center space-y-8"
                            >
                                <div className="h-24 w-24 rounded-full bg-green-500/20 border-2 border-green-500/40 flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(34,197,94,0.3)]">
                                    <Check className="h-12 w-12 text-green-500" />
                                </div>
                                <div className="space-y-4">
                                    <h2 className="text-4xl md:text-5xl font-heading font-black">¡ESTAMOS LISTOS!</h2>
                                    <p className="text-white/60 text-lg max-w-sm mx-auto">
                                        Hemos enviado tu contrato y nota de venta a **{data.clientEmail}**. Nos vemos en la primera sesión.
                                    </p>
                                </div>
                                <div className="pt-8">
                                    <Link href="/demo/basico" className="inline-flex items-center gap-2 text-cima-gold font-black uppercase tracking-widest text-xs hover:text-white transition-all">
                                        Ir al Panel de Administración <ArrowUpRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right Side: Live Invoice/Contract */}
                <div className="lg:col-span-5">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-[2.5rem] p-8 md:p-10 text-black shadow-2xl relative overflow-hidden"
                    >
                        {/* Elegant Watermark */}
                        <div className="absolute top-10 right-10 opacity-[0.03] select-none pointer-events-none">
                            <Star className="h-64 w-64 fill-current rotate-12" />
                        </div>

                        <div className="relative z-10 space-y-10">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Nota de Venta #8842</p>
                                    <h3 className="text-lg font-heading font-black italic">CIMA <span className="text-cima-gold">PRO</span></h3>
                                </div>
                                <div className="bg-gray-100 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                                    Estado: <span className="text-red-500">Pendiente Anticipo</span>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">CONTRATANTE</p>
                                    <div className="space-y-1">
                                        <p className="text-xl font-bold tracking-tight">{data.agencyName || "Nombre de tu Agencia"}</p>
                                        <p className="text-xs text-gray-500">{data.clientEmail || "ejemplo@correo.com"}</p>
                                        <p className="text-xs text-gray-400 italic">Especialidad: {data.specialty || "Por definir"}</p>
                                    </div>
                                </div>

                                <div className="h-px bg-gray-100 w-full" />

                                <div className="space-y-4">
                                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400">DETALLE DE INVERSIÓN</p>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold uppercase tracking-wider text-gray-600">Plan {currentPlan.name}</span>
                                            <span className="font-mono text-sm font-bold">$0.00</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-medium text-gray-500">Inversión de Setup (Diseño/Programación)</span>
                                            <span className="font-mono text-sm font-bold">${currentPlan.setup.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-medium text-gray-500">Mantenimiento Mensual (Servidores/IA)</span>
                                            <span className="font-mono text-sm text-gray-400">${currentPlan.monthly.toLocaleString()}/mes</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-3xl space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-black uppercase tracking-widest">Total Inversión</span>
                                        <span className="text-3xl font-black font-heading tracking-tighter text-cima-gold">
                                            ${currentPlan.setup.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Anticipo (30%)</span>
                                        <span className="text-base font-black text-black">
                                            ${(currentPlan.setup * 0.3).toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400">MÉTODO DE PAGO RÁPIDO</p>
                                    <div className="flex items-center gap-4 bg-white border border-gray-100 p-4 rounded-2xl">
                                        <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                                            <div className="grid grid-cols-2 gap-1 p-1">
                                                {[1, 2, 3, 4].map(i => <div key={i} className="h-3 w-3 bg-gray-300 rounded-xs" />)}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest mb-1">Transferencia STP / CLABE</p>
                                            <p className="text-xs font-mono text-gray-500 font-bold">012 345 6789 0123 4567</p>
                                            <p className="text-[8px] text-cima-gold font-bold uppercase mt-1">Beneficiario: Cima Propiedades S.A.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex flex-col gap-3">
                                <p className="text-[7px] text-gray-400 text-center uppercase tracking-widest leading-relaxed">
                                    Al procesar el pago, aceptas los términos de servicio elite y la <br /> exclusiva para tu zona designada.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Footer Status Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50 px-6 py-4 bg-black/40 backdrop-blur-xl border-t border-white/5">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest">Servidores Operativos</span>
                        </div>
                        <div className="h-4 w-px bg-white/10" />
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-cima-gold" />
                            <span className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest">Encriptación SSL 256-bit</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
                        <span>Cima Pro Global v2.4</span>
                        <span>•</span>
                        <span>© 2024</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─── Extra Icons for Onboarding ─── */
function Rocket(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.95.12-3.5-.5-4.5l-2.5 1.5Z" />
            <path d="M11.5 4.5c1.26-1.5 5-2 5-2s-.5 3.74-2 5c-.95.71-3.5.12-4.5-.5l1.5-2.5Z" />
            <path d="M9 15l3-3" />
            <path d="M12 9l3-3" />
            <path d="M9 15h.01" />
            <path d="M12 12h.01" />
            <path d="M15 9h.01" />
            <path d="M12 15l-1.5 2.5a1 1 0 0 0 .1 1.2l1.6 1.6a1 1 0 0 0 1.2.1L16 19c.5.1 1-.1 1.2-.5L22 2l-16.5 4.8c-.4.2-.6.7-.5 1.2l1.5 2.6c.1.2.1.5 0 .7Z" />
        </svg>
    )
}

function Home(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
    )
}

function Wand2(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.21 1.21 0 0 0 1.72 0L21.64 5.36a1.21 1.21 0 0 0 0-1.72Z" />
            <path d="m14 7 3 3" />
            <path d="M5 6v1" />
            <path d="M11 2v2" />
            <path d="M2 11h2" />
            <path d="M20 20v1" />
            <path d="M15 16v2" />
            <path d="M22 15h-2" />
        </svg>
    )
}

function RotateCcw(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
        </svg>
    );
}

function Upload(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" x2="12" y1="3" y2="15" />
        </svg>
    );
}

function ExternalLink(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 22 3 22 10" />
            <line x1="10" x2="22" y1="14" y2="2" />
        </svg>
    );
}

function FileCheck(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <path d="m9 15 2 2 4-4" />
        </svg>
    );
}

function FileSearch(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4 22V4a2 2 0 0 1 2-2h8.5L20 7.5V22" />
            <polyline points="14 2 14 8 20 8" />
            <circle cx="10" cy="14" r="3" />
            <path d="m14 18-1.5-1.5" />
        </svg>
    );
}

function FileSignature(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20 19.5v.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8.5L20 7.5V11" />
            <path d="M16 42.5l3.9 3.9" />
            <path d="M8 18h1" />
            <path d="M18.42 15.61a2.1 2.1 0 1 1 2.97 2.97L13 27l-3.9 1.3 1.3-3.9Z" />
        </svg>
    )
}

function ArrowUpRight(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
        </svg>
    );
}

function Edit3(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
    );
}
