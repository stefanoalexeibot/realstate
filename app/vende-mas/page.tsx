"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    BarChart3, Users, Layout, Zap,
    ArrowRight, ShieldCheck, Cpu,
    MessageSquare, Sparkles, Smartphone,
    Target, TrendingUp, ShieldAlert,
    Clock, CheckCircle2, X, Bell,
    MousePointer2, Camera, FileText,
    Share2, Rocket, Briefcase, Plus,
    Settings, Key, Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MotionDiv, MotionSpan } from "@/components/landing/motion-wrapper";
import TiltCard from "@/components/landing/tilt-card";
import FadeIn from "@/components/landing/fade-in";

// --- Components ---

function LiveActivityFeed() {
    const activities = [
        { name: "Carlos R.", loc: "Monterrey", action: "cerró una exclusiva de $8M", time: "hace 2 min" },
        { name: "Inmobiliaria Elite", loc: "CDMX", action: "activó 5 portales nuevos", time: "hace 15 min" },
        { name: "Lucía M.", loc: "Guadalajara", action: "digitalizó su inventario", time: "hace 45 min" },
        { name: "Roberto G.", loc: "Querétaro", action: "recibió feedback positivo de cliente", time: "hace 1 hora" }
    ];

    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % activities.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [activities.length]);

    return (
        <div className="fixed bottom-8 left-8 z-50 hidden md:block w-72">
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -20, scale: 0.95 }}
                    className="bg-cima-card/80 backdrop-blur-xl border border-cima-gold/20 p-4 rounded-2xl shadow-2xl flex items-center gap-4"
                >
                    <div className="h-10 w-10 rounded-full bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center shrink-0">
                        <Bell className="h-5 w-5 text-cima-gold" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-cima-gold uppercase tracking-widest">{activities[index].loc}</p>
                        <p className="text-[11px] text-white/80 leading-tight">
                            <span className="font-bold text-white">{activities[index].name}</span> {activities[index].action}
                        </p>
                        <p className="text-[9px] text-white/30 mt-1 font-mono">{activities[index].time}</p>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

function PortalPreviewSystem() {
    const [activeTab, setActiveTab] = useState(0);

    const tabs = [
        {
            id: 0,
            label: "Dashboard Real-Time",
            icon: Layout,
            title: "Toda la visibilidad, cero llamadas.",
            desc: "Tu cliente ve el avance paso a paso: desde la toma de fotos hasta el cierre.",
            mock: (
                <div className="space-y-4">
                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
                        <div className="flex gap-3 items-center">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs font-bold">Estado: Promoción Activa</span>
                        </div>
                        <span className="text-[10px] font-mono text-white/40">Día 12</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                            <p className="text-[9px] text-white/40 uppercase mb-1">Visitas</p>
                            <p className="text-xl font-bold">24</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                            <p className="text-[9px] text-white/40 uppercase mb-1">Interesados</p>
                            <p className="text-xl font-bold">12</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 1,
            label: "Evidencia Física",
            icon: Camera,
            title: "Prueba visual de tu trabajo.",
            desc: "Sube fotos de las visitas y notas de feedback. El propietario sabe que estás moviendo su propiedad.",
            mock: (
                <div className="grid grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="aspect-video bg-white/5 border border-white/10 rounded-lg flex items-center justify-center relative overflow-hidden group">
                            <Camera className="h-6 w-6 text-white/10" />
                            <div className="absolute bottom-1 right-1 bg-green-500 rounded-full p-0.5">
                                <CheckCircle2 className="h-2 w-2 text-black" />
                            </div>
                        </div>
                    ))}
                </div>
            )
        },
        {
            id: 2,
            label: "Inteligencia de Datos",
            icon: BarChart3,
            title: "Feedback que cierra tratos.",
            desc: "Deja que los datos hablen. Genera reportes de mercado que justifican ajustes de precio con un clic.",
            mock: (
                <div className="space-y-3">
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-cima-gold w-[70%]" />
                    </div>
                    <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-cima-gold">Sentimiento Positivo</span>
                        <span className="text-white/40">70%</span>
                    </div>
                    <p className="text-[10px] text-white/40 italic p-3 bg-white/[0.02] rounded-lg border border-white/5">
                        "El feedback indica que el precio está 5% arriba del mercado actual..."
                    </p>
                </div>
            )
        }
    ];

    return (
        <div className="bg-white/[0.02] border border-white/10 rounded-[40px] overflow-hidden backdrop-blur-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                {/* Selector */}
                <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-white/10 p-8 space-y-4">
                    <p className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-[0.3em] mb-8">Interacción Dueño</p>
                    {tabs.map((tab, i) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(i)}
                            className={`w-full flex items-center gap-4 p-5 rounded-2xl transition-all duration-500 text-left group ${activeTab === i ? "bg-cima-gold text-black shadow-xl shadow-cima-gold/20" : "hover:bg-white/5 text-white/40 hover:text-white"}`}
                        >
                            <tab.icon className={`h-5 w-5 ${activeTab === i ? "text-black" : "text-cima-gold/50 group-hover:text-cima-gold"}`} />
                            <span className="text-xs font-bold uppercase tracking-widest">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Visualizer */}
                <div className="lg:col-span-8 p-8 md:p-12 lg:p-20 flex flex-col justify-center bg-gradient-to-br from-white/[0.01] to-transparent">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5, ease: "circOut" }}
                            className="max-w-xl"
                        >
                            <h3 className="text-3xl md:text-4xl font-heading font-black mb-6 leading-tight">
                                {tabs[activeTab].title}
                            </h3>
                            <p className="text-white/50 text-base mb-12 leading-relaxed">
                                {tabs[activeTab].desc}
                            </p>

                            {/* The "Portal" Mockup */}
                            <div className="relative group max-w-sm">
                                <div className="absolute -inset-10 bg-cima-gold/10 blur-[60px] rounded-full opacity-50" />
                                <div className="relative border-4 border-white/10 rounded-[2.5rem] aspect-[9/16] bg-[#0c0c0d] overflow-hidden shadow-2xl p-6">
                                    {/* Phone notch */}
                                    <div className="mx-auto w-24 h-4 bg-white/10 rounded-full mb-8" />

                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="h-8 w-8 rounded-full bg-cima-gold/20 border border-cima-gold/40" />
                                        <div className="flex-1">
                                            <div className="h-2 w-20 bg-white/10 rounded-full mb-1" />
                                            <div className="h-1.5 w-12 bg-white/5 rounded-full" />
                                        </div>
                                    </div>

                                    {tabs[activeTab].mock}

                                    <div className="absolute bottom-10 left-6 right-6 space-y-3">
                                        <div className="h-8 w-full bg-cima-gold/20 border border-cima-gold/40 rounded-lg flex items-center justify-center">
                                            <MessageSquare className="h-3 w-3 text-cima-gold" />
                                        </div>
                                        <div className="h-8 w-full bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
                                            <Share2 className="h-3 w-3 text-white/20" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

function AgentCommandCenterPreview() {
    return (
        <div className="bg-[#0c0c0d] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-cima-gold/[0.03] to-transparent pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-3 border-r border-white/5 p-6 bg-black/40">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="h-8 w-8 rounded bg-cima-gold flex items-center justify-center">
                            <Briefcase className="h-4 w-4 text-black" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Agent Command</span>
                    </div>

                    <nav className="space-y-2">
                        {[
                            { icon: Layout, label: "Mis Propiedades", active: true },
                            { icon: Users, label: "Clientes / Dueños", active: false },
                            { icon: Target, label: "Visitas Registradas", active: false },
                            { icon: TrendingUp, label: "Analíticos", active: false },
                            { icon: Settings, label: "Configuración", active: false }
                        ].map((item, i) => (
                            <div key={i} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${item.active ? "bg-cima-gold/10 text-cima-gold border border-cima-gold/20" : "text-white/20 hover:text-white/40"}`}>
                                <item.icon className="h-4 w-4" />
                                <span className="text-[10px] font-bold uppercase">{item.label}</span>
                            </div>
                        ))}
                    </nav>

                    <div className="mt-20 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                        <p className="text-[9px] text-cima-gold font-bold mb-2 uppercase tracking-tight">Capacidad de Cuenta</p>
                        <div className="h-1 w-full bg-white/5 rounded-full mb-2">
                            <div className="h-full bg-cima-gold w-[40%]" />
                        </div>
                        <p className="text-[8px] text-white/30 uppercase">4/10 propiedades activas</p>
                    </div>
                </div>

                <div className="lg:col-span-9 p-8 md:p-12">
                    <div className="flex justify-between items-center mb-10">
                        <h4 className="text-xl font-heading font-black">Mis Propiedades en Venta</h4>
                        <button className="flex items-center gap-2 bg-cima-gold text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter hover:scale-105 transition-all shadow-lg shadow-cima-gold/10">
                            <Plus className="h-3.5 w-3.5" /> Nueva Propiedad
                        </button>
                    </div>

                    <div className="space-y-4">
                        {[
                            { name: "Residencia Las Misiones", price: "$12.4M", status: "En Venta", owner: "Familia García" },
                            { name: "Departamento Torre LOVFT", price: "$4.2M", status: "Exclusiva", owner: "Ing. Roberto M." }
                        ].map((prop, i) => (
                            <div key={i} className="bg-white/[0.03] border border-white/10 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 hover:border-cima-gold/30 transition-all group/item">
                                <div className="flex items-center gap-5">
                                    <div className="h-12 w-16 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center text-white/20 font-mono text-[10px]">PHOTO</div>
                                    <div>
                                        <p className="text-xs font-bold text-white group-hover/item:text-cima-gold transition-colors">{prop.name}</p>
                                        <div className="flex gap-4 mt-1">
                                            <span className="text-[9px] text-white/30 font-mono uppercase tracking-tighter">{prop.price}</span>
                                            <span className="text-[9px] text-cima-gold font-bold uppercase tracking-widest">{prop.status}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right hidden md:block">
                                        <p className="text-[8px] text-white/20 uppercase font-black tracking-widest mb-1">Dueño asignado</p>
                                        <p className="text-[10px] text-white/60 font-medium">{prop.owner}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-cima-gold/10 hover:border-cima-gold/40 transition-all cursor-pointer">
                                            <Eye className="h-3.5 w-3.5 text-white/40" />
                                        </div>
                                        <div className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-cima-gold/10 hover:border-cima-gold/40 transition-all cursor-pointer">
                                            <Target className="h-3.5 w-3.5 text-white/40" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 p-8 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center text-center">
                        <div className="h-10 w-10 bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <Plus className="h-5 w-5 text-white/20" />
                        </div>
                        <p className="text-[10px] text-white/30 uppercase font-black tracking-[0.2em]">Sube tu inventario y deja que el sistema trabaje por ti.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ZeroFrictionTimeline() {
    return (
        <div className="relative py-20">
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-white/10 hidden md:block" />

            <div className="space-y-24">
                {[
                    { step: "01", title: "Configuración Relámpago", desc: "Eliges tu plan y personalizas tu marca en menos de 10 minutos. No necesitas saber código.", icon: MousePointer2 },
                    { step: "02", title: "Lanzamiento Instantáneo", desc: "Tu infraestructura se despliega en nuestros servidores de alto rendimiento. Estás live en 24h.", icon: Rocket },
                    { step: "03", title: "Domina tu Mercado", desc: "Empiezas a captar exclusivas con tecnología que tus competidores ni siquiera sueñan tener.", icon: Target }
                ].map((item, i) => (
                    <div key={item.step} className={`relative flex flex-col md:flex-row gap-12 items-center ${i % 2 !== 0 ? "md:flex-row-reverse" : ""}`}>
                        <div className="flex-1 text-center md:text-right">
                            {i % 2 === 0 ? (
                                <>
                                    <h4 className="text-2xl font-heading font-black mb-4">{item.title}</h4>
                                    <p className="text-white/40 text-sm max-w-sm ml-auto">{item.desc}</p>
                                </>
                            ) : (
                                <div className="h-32 w-32 rounded-3xl bg-white/[0.02] border border-white/10 flex items-center justify-center ml-auto">
                                    <item.icon className="h-12 w-12 text-cima-gold/50" />
                                </div>
                            )}
                        </div>

                        <div className="relative z-10 flex items-center justify-center">
                            <div className="h-16 w-16 rounded-full bg-cima-card border-2 border-cima-gold flex items-center justify-center shadow-2xl shadow-cima-gold/20">
                                <span className="text-cima-gold font-mono font-black">{item.step}</span>
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            {i % 2 !== 0 ? (
                                <>
                                    <h4 className="text-2xl font-heading font-black mb-4">{item.title}</h4>
                                    <p className="text-white/40 text-sm max-w-sm">{item.desc}</p>
                                </>
                            ) : (
                                <div className="h-32 w-32 rounded-3xl bg-white/[0.02] border border-white/10 flex items-center justify-center mr-auto">
                                    <item.icon className="h-12 w-12 text-cima-gold/50" />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function MasterRoiCalculator() {
    const [price, setPrice] = useState(5000000);
    const [monthlyProp, setMonthlyProp] = useState(1);

    // Master Template costs (average between plans)
    const investment = 29900;
    const commission = 0.05; // 5% average

    const singleCommission = price * commission;
    const monthlyGain = singleCommission * monthlyProp;
    const annualGain = monthlyGain * 12;
    const roi = Math.round((annualGain / investment));

    return (
        <div className="bg-white/[0.02] border border-white/10 rounded-[40px] p-8 md:p-12 backdrop-blur-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                    <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-[0.3em] mb-4 block">Simulador de Impacto</span>
                    <h3 className="text-3xl font-heading font-bold mb-6">Tu tecnología se paga con <span className="text-cima-gold">un solo cierre.</span></h3>
                    <p className="text-white/50 mb-10 text-sm leading-relaxed">
                        ¿Cuánto vale tu tiempo y tu imagen? Calcula el retorno de inversión al digitalizar tu proceso con la Master Template.
                    </p>

                    <div className="space-y-8">
                        <div>
                            <label className="text-[10px] uppercase font-bold text-white/40 block mb-4">Valor promedio de tus propiedades</label>
                            <input
                                type="range" min="1000000" max="15000000" step="500000"
                                value={price} onChange={(e) => setPrice(Number(e.target.value))}
                                className="w-full accent-cima-gold"
                            />
                            <div className="flex justify-between mt-2 text-[10px] font-mono text-white/30 uppercase">
                                <span>$1M</span>
                                <span className="text-cima-gold font-bold">${(price / 1000000).toFixed(1)}M MXN</span>
                                <span>$15M</span>
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] uppercase font-bold text-white/40 block mb-4">Propiedades cerradas al año</label>
                            <div className="flex gap-3">
                                {[3, 6, 12, 24].map(val => (
                                    <button
                                        key={val}
                                        onClick={() => setMonthlyProp(val / 12)}
                                        className={`flex-1 py-3 rounded-xl border text-xs font-bold transition-all ${Math.round(monthlyProp * 12) === val ? "bg-cima-gold text-black border-cima-gold" : "bg-white/5 border-white/10 text-white/40 hover:border-cima-gold/30"}`}
                                    >
                                        {val}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-cima-gold/5 rounded-3xl p-8 border border-cima-gold/20 relative overflow-hidden">
                    <div className="relative z-10 space-y-8">
                        <div>
                            <p className="text-[10px] uppercase font-bold text-cima-gold tracking-[0.2em] mb-2">Comisión estimada por venta</p>
                            <p className="text-3xl font-heading font-bold text-white">${new Intl.NumberFormat().format(singleCommission)}</p>
                        </div>
                        <div className="pt-6 border-t border-white/5">
                            <p className="text-[10px] uppercase font-bold text-white/40 tracking-[0.2em] mb-2">Ingreso Anual Proyectado</p>
                            <p className="text-2xl font-heading font-bold text-white/90">${new Intl.NumberFormat().format(annualGain)}</p>
                        </div>
                        <div className="pt-6 border-t border-white/5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] uppercase font-black text-cima-gold tracking-[0.3em] mb-1 italic">ROI Anual estimado</p>
                                    <p className="text-5xl font-heading font-black text-cima-gold">{roi}x</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] text-cima-gold/60 leading-tight">Tu plataforma se paga <br /> {roi} veces en un año.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const FEATURES = [
    {
        icon: Layout,
        title: "Landing Page de Élite",
        desc: "Olvida los sitios lentos. Una página con estética de ultra-lujo que enamora a los propietarios de inmediato."
    },
    {
        icon: Users,
        title: "Portal Propietario",
        desc: "Transparencia total. Tus clientes ven el avance de su venta en tiempo real, eliminando la ansiedad del '¿cómo va mi casa?'."
    },
    {
        icon: BarChart3,
        title: "Reportes con Data Real",
        desc: "Genera feedback automático basado en visitas reales. Usa datos, no opiniones, para ajustar precios o estrategias."
    },
    {
        icon: Zap,
        title: "Despliegue Relámpago",
        desc: "Tu plataforma lista en menos de 24 horas. Sin programadores, sin meses de espera, sin dolores de cabeza."
    }
];

export default function VendeMasPage() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        setMousePos({ x: e.clientX, y: e.clientY });
    };

    return (
        <div
            onMouseMove={handleMouseMove}
            className="min-h-screen bg-[#0A0A0B] text-white selection:bg-cima-gold/30 scroll-smooth relative"
        >
            {/* Searchlight Effect */}
            <div
                className="pointer-events-none fixed inset-0 z-30 transition-opacity opacity-0 md:opacity-100"
                style={{
                    background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(200, 169, 110, 0.03), transparent 80%)`
                }}
            />

            <LiveActivityFeed />

            {/* Navbar Minimalista */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-xl bg-black/20">
                <div className="mx-auto max-w-7xl h-16 px-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center">
                            <Cpu className="h-4 w-4 text-cima-gold" />
                        </div>
                        <span className="font-heading font-bold tracking-tight text-white/90">Master Template <span className="text-cima-gold italic font-medium ml-1">Pro</span></span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="hidden md:flex items-center gap-2 text-[10px] font-mono text-white/40 uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            Solo 2 cupos en Monterrey
                        </span>
                        <Link
                            href="/onboarding"
                            className="flex items-center gap-2 bg-cima-gold text-black px-4 py-1.5 rounded-full text-xs font-bold hover:bg-white transition-all shadow-lg shadow-cima-gold/10"
                        >
                            Asegurar mi lugar
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-40 pb-24 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-cima-gold/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="relative mx-auto max-w-5xl text-center">
                    <FadeIn>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            <ShieldAlert className="h-3.5 w-3.5 text-cima-gold" />
                            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-cima-gold">Disponibilidad Limitada por Ciudad</span>
                        </div>
                    </FadeIn>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold tracking-tight mb-8 leading-[1.05]">
                        Deja de ser un asesor común. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cima-gold via-white to-cima-gold-light">
                            Conviértete en Plataforma.
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto mb-12 leading-relaxed">
                        El 90% de los asesores pierden exclusivas porque sus herramientas parecen de los 90s. La Master Template te da la estética y el sistema de las agencias que captan propiedades de millones de dólares.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link
                            href="/onboarding"
                            className="w-full sm:w-auto px-10 py-5 bg-cima-gold text-black font-heading font-bold rounded-2xl hover:scale-105 transition-all shadow-[0_20px_40px_-10px_rgba(200,169,110,0.3)] relative group overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            <span className="relative z-10">Lanzar mi plataforma hoy</span>
                        </Link>
                        <a
                            href="#roi"
                            className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 font-heading font-bold rounded-2xl hover:bg-white/10 transition-all text-sm uppercase tracking-widest"
                        >
                            Ver ROI estimado
                        </a>
                    </div>
                </div>
            </section>

            {/* The Pain Points Section */}
            <section className="py-24 px-6 border-y border-white/5 bg-[#070708]">
                <div className="mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <FadeIn direction="right">
                            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-8 leading-tight">
                                Por qué los propietarios <br />
                                <span className="text-white/40 italic font-medium text-2xl md:text-4xl">dicen que no a otros asesores...</span>
                            </h2>
                            <p className="text-white/50 text-lg mb-10">
                                Enviar un PDF por WhatsApp ya no es suficiente. El cliente de hoy busca **certeza, diseño y transparencia**.
                            </p>
                            <div className="space-y-6">
                                {[
                                    { p: "No hay reportes de avance", s: "Portal Propietario 24/7" },
                                    { p: "Imagen poco profesional", s: "Diseño Elite de Ultra-Lujo" },
                                    { p: "Feedback de visitas perdido", s: "Sistema IA de Seguimiento" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                        <div className="p-2 bg-red-500/10 rounded-lg">
                                            <X className="h-4 w-4 text-red-500/50" />
                                        </div>
                                        <span className="text-xs text-white/40 line-through flex-1">{item.p}</span>
                                        <ArrowRight className="h-3 w-3 text-white/20" />
                                        <div className="p-2 bg-cima-gold/10 rounded-lg">
                                            <CheckCircle2 className="h-4 w-4 text-cima-gold" />
                                        </div>
                                        <span className="text-xs text-cima-gold font-bold">{item.s}</span>
                                    </div>
                                ))}
                            </div>
                        </FadeIn>

                        <FadeIn direction="left">
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-cima-gold/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full pointer-events-none" />
                                <div className="relative bg-white/[0.03] border border-white/10 rounded-[40px] p-8 md:p-12 backdrop-blur-md">
                                    <Smartphone className="h-10 w-10 text-cima-gold mb-8" />
                                    <h3 className="text-2xl font-heading font-bold mb-6">"El 73% de los propietarios eligen al asesor que les ofrece seguimiento digital."</h3>
                                    <p className="text-white/40 text-sm italic">
                                        — Fuente: Reporte de Tendencias Inmobiliarias 2025.
                                    </p>
                                    <div className="mt-10 pt-10 border-t border-white/10">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-full bg-cima-gold/20 flex items-center justify-center">
                                                <TrendingUp className="h-6 w-6 text-cima-gold" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-white text-sm">Aumento en exclusivas</p>
                                                <p className="text-cima-gold font-mono text-xl font-black">+42%</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* Agents Dashboard Section - THE NEW CONTROL CENTER PREVIEW */}
            <section className="py-24 px-6 relative bg-black/40 border-b border-white/5 overflow-hidden">
                <div className="mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <FadeIn direction="right">
                            <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-[0.4em] mb-4 block">El Motor de tu Negocio</span>
                            <h2 className="text-4xl md:text-5xl font-heading font-black mb-8 tracking-tight">Agent Command Center</h2>
                            <p className="text-white/60 text-lg mb-8 leading-relaxed">
                                No solo les das un portal a tus clientes; tú obtienes un **centro de comando inteligente** para gestionar todo tu inventario.
                            </p>
                            <ul className="space-y-6 mb-10">
                                {[
                                    { t: "Gestión Centralizada", d: "Sube y actualiza propiedades en segundos.", icon: Layout },
                                    { t: "Generador de Portales", d: "Un clic para activar el portal del dueño.", icon: Key },
                                    { t: "Tracking de Visitas", d: "Registra feedback real y genera reportes IA.", icon: Target }
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-4 group">
                                        <div className="h-10 w-10 rounded-xl bg-cima-gold/10 border border-cima-gold/20 flex items-center justify-center group-hover:bg-cima-gold/20 transition-all shrink-0">
                                            <item.icon className="h-5 w-5 text-cima-gold" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-sm">{item.t}</p>
                                            <p className="text-white/40 text-xs mt-1">{item.d}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </FadeIn>

                        <FadeIn direction="left">
                            <AgentCommandCenterPreview />
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* Interactive Portal Preview Section (Dueño) */}
            <section className="py-24 px-6 relative overflow-hidden">
                <div className="mx-auto max-w-6xl">
                    <div className="text-center mb-20">
                        <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-[0.4em] mb-4 block">Lo que ve tu Cliente</span>
                        <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 tracking-tight">Portal del Propietario</h2>
                        <p className="text-white/40 max-w-2xl mx-auto">La herramienta que te hará ganar más exclusivas al darles transparencia total.</p>
                    </div>

                    <PortalPreviewSystem />
                </div>
            </section>

            {/* ROI Calculator Section */}
            <section id="roi" className="py-24 px-6 relative bg-[#070708]">
                <div className="mx-auto max-w-6xl">
                    <MasterRoiCalculator />
                </div>
            </section>

            {/* Zero Friction Timeline */}
            <section className="py-24 px-6">
                <div className="mx-auto max-w-6xl">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 tracking-tight">De Cero a Pro en 24 Horas</h2>
                        <p className="text-white/40">Fricción eliminada. Eficiencia maximizada.</p>
                    </div>
                    <ZeroFrictionTimeline />
                </div>
            </section>

            {/* Bento Features */}
            <section className="py-24 px-6 bg-[#070708]">
                <div className="mx-auto max-w-6xl">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">Ecosistema Propietario-Asesor</h2>
                        <p className="text-white/40 max-w-2xl mx-auto">Toda la potencia de Cima Pro, empaquetada para tu crecimiento personal.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {FEATURES.map((f, i) => (
                            <FadeIn key={f.title} delay={i * 0.1}>
                                <TiltCard className="h-full">
                                    <div className="h-full bg-white/[0.02] border border-white/5 p-10 rounded-[32px] hover:border-cima-gold/40 transition-all group flex flex-col items-center text-center">
                                        <div className="h-16 w-16 rounded-2xl bg-cima-gold/10 border border-cima-gold/20 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-cima-gold/20 transition-all duration-500 shadow-xl shadow-cima-gold/5">
                                            <f.icon className="h-8 w-8 text-cima-gold" />
                                        </div>
                                        <h3 className="text-xl font-heading font-bold mb-4 tracking-tight">{f.title}</h3>
                                        <p className="text-sm text-white/50 leading-relaxed font-medium">{f.desc}</p>
                                    </div>
                                </TiltCard>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* Comparison Table */}
            <section className="py-24 px-6 relative">
                <div className="mx-auto max-w-5xl">
                    <div className="text-center mb-16">
                        <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-[0.4em] mb-4 block">Análisis de Mercado</span>
                        <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">¿Por qué Master Template?</h2>
                        <p className="text-white/40">Comparativa contra el desarrollo tradicional y plataformas genéricas.</p>
                    </div>

                    <div className="rounded-[40px] border border-white/10 overflow-hidden bg-white/[0.01]">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 border-b border-white/10">
                                <tr>
                                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/40">Característica</th>
                                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/40">Tradicional</th>
                                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-cima-gold bg-cima-gold/5">Master Template</th>
                                </tr>
                            </thead>
                            <tbody className="text-xs md:text-sm font-medium">
                                {[
                                    { f: "Costo de Inicio", t: "$150,000 MXN+", m: "Desde $14,900 MXN", good: true },
                                    { f: "Tiempo de Entrega", t: "3–6 meses", m: "< 24 horas", good: true },
                                    { f: "Portal Propietario", t: "No incluido / Manual", m: "Nativo Automatizado", good: true },
                                    { f: "Mantenimiento", t: "$5,000/mes+", m: "Incluido en tu plan", good: true },
                                    { f: "IA e Inteligencia", t: "Costo extra masivo", m: "Integrado en el core", good: true }
                                ].map((row, i) => (
                                    <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                        <td className="p-6 text-white/80">{row.f}</td>
                                        <td className="p-6 text-white/30">{row.t}</td>
                                        <td className="p-6 text-cima-gold font-bold bg-cima-gold/[0.02]">{row.m}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-24 px-6 bg-[#0A0A0B] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cima-gold/5 rounded-full blur-[150px] -mr-96 -mt-96 pointer-events-none" />

                <div className="mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-6xl font-heading font-bold mb-4 tracking-tight">Elige tu Nivel de Servicio</h2>
                        <p className="text-white/40 max-w-2xl mx-auto italic font-medium">Solo aceptamos 3 asesores por zona para garantizar exclusividad tecnológica.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                        {[
                            {
                                name: "Starter",
                                price: "$14,900",
                                desc: "Para el asesor que busca diferenciarse hoy mismo.",
                                features: ["Landing Page Elite", "1 Portal Propietario Activo", "QR de Venta Inteligente", "Hosting Incluido"],
                                cta: "Comenzar hoy mismo",
                                popular: false
                            },
                            {
                                name: "Professional",
                                price: "$29,900",
                                desc: "Para el asesor Top manejando exclusivas constantes.",
                                features: ["Todo en Starter", "5 Portales Propietarios", "Feedback IA Automatico", "Soporte VIP WhatsApp"],
                                highlight: true,
                                popular: true,
                                cta: "Activar mi Licencia Pro"
                            },
                            {
                                name: "Team / Agency",
                                price: "$49,900",
                                desc: "La estructura para inmobiliarias que dominan zonas.",
                                features: ["Todo en Pro", "Multi-Asesores (Hasta 3)", "Inventario Ilimitado", "Dominio .com Propio"],
                                cta: "Escalar mi Agencia",
                                popular: false
                            }
                        ].map((plan, i) => (
                            <div
                                key={plan.name}
                                className={`p-10 rounded-[50px] border flex flex-col h-full transition-all duration-700 relative overflow-hidden group ${plan.highlight ? "bg-cima-card border-cima-gold shadow-[0_50px_100px_-20px_rgba(200,169,110,0.2)] lg:scale-105 z-10" : "bg-white/[0.02] border-white/5"}`}
                            >
                                {plan.popular && (
                                    <div className="absolute top-6 right-10 bg-cima-gold text-black text-[9px] font-black uppercase tracking-widest py-1.5 px-4 rounded-full animate-bounce">Más Popular</div>
                                )}
                                <h3 className="text-xl font-heading font-bold mb-2 group-hover:text-cima-gold transition-colors">{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mb-8">
                                    <span className="text-5xl font-black text-cima-gold tracking-tighter">{plan.price}</span>
                                    <span className="text-xs text-white/40 font-mono font-bold uppercase tracking-widest">MXN</span>
                                </div>
                                <p className="text-sm text-white/50 mb-10 leading-relaxed h-12 font-medium">{plan.desc}</p>
                                <ul className="space-y-5 mb-12 flex-1">
                                    {plan.features.map(f => (
                                        <li key={f} className="flex items-center gap-4 text-xs font-bold text-white/70">
                                            <div className="h-5 w-5 rounded-full bg-cima-gold/10 flex items-center justify-center shrink-0">
                                                <CheckCircle2 className="h-3 w-3 text-cima-gold " />
                                            </div>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href="/onboarding"
                                    className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-center transition-all duration-500 shadow-xl overflow-hidden relative group/btn ${plan.highlight ? "bg-cima-gold text-black hover:scale-105" : "bg-white/5 text-white hover:bg-white/10"}`}
                                >
                                    <div className="absolute inset-0 bg-white/20 translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300" />
                                    <span className="relative z-10">{plan.cta}</span>
                                </Link>

                                {/* Availability Note */}
                                <div className="mt-6 flex items-center justify-center gap-2 opacity-50 text-[9px] font-mono font-bold uppercase tracking-widest">
                                    <Clock className="h-3 w-3" />
                                    Entrega en 24h
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Enterprise Bridge */}
            <section className="py-24 px-6 border-y border-white/5 bg-gradient-to-b from-transparent to-cima-gold/[0.02] relative">
                <div className="mx-auto max-w-4xl text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8">
                        <Cpu className="h-3.5 w-3.5 text-cima-gold-light" />
                        <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-cima-gold-light">Nivel Enterprise</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-heading font-bold mb-8 text-white tracking-tight">¿Necesitas algo a medida?</h2>
                    <p className="text-white/50 mb-12 text-lg leading-relaxed max-w-2xl mx-auto font-medium">
                        Si eres una franquicia con +10 asesores, necesitas tu propia base de datos, integraciones CRM profundas e IA propietaria entrenada con tus datos.
                    </p>
                    <Link
                        href="/pro"
                        className="group inline-flex items-center gap-4 text-cima-gold font-black text-xs md:text-sm uppercase tracking-[0.3em] hover:gap-6 transition-all bg-cima-gold/5 border border-cima-gold/20 px-10 py-5 rounded-2xl shadow-2xl"
                    >
                        Explorar Cima Pro <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 px-6 border-t border-white/5 relative z-10">
                <div className="mx-auto max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 justify-between items-center gap-12 mb-20">
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <Cpu className="h-6 w-6 text-cima-gold" />
                                <span className="text-lg font-black uppercase tracking-[0.2em]">Master Template <span className="text-cima-gold">Pro</span></span>
                            </div>
                            <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.35em] max-w-xs leading-relaxed">
                                Infraestructura de Grado Industrial para el Asesor que no se conforma.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-8 md:justify-end text-[10px] font-black uppercase tracking-widest text-white/40">
                            <Link href="/" className="hover:text-cima-gold transition-colors">Volver a Cima</Link>
                            <Link href="/onboarding" className="hover:text-cima-gold transition-colors">Onboarding</Link>
                            <Link href="/pro" className="hover:text-cima-gold transition-colors">Enterprise</Link>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-10 border-t border-white/5">
                        <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest">© {new Date().getFullYear()} Cima Tech Ecosystem. All rights reserved.</p>
                        <div className="flex items-center gap-4 opacity-40">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            <span className="text-[9px] font-mono uppercase tracking-widest">System Online</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
