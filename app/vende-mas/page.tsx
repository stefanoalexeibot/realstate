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
    Settings, Key, Eye, Menu
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
        <div className="fixed bottom-6 left-6 md:bottom-8 md:left-8 z-50 w-[calc(100%-3rem)] md:w-72 max-w-sm pointer-events-none">
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    className="bg-cima-card/80 backdrop-blur-xl border border-cima-gold/20 p-3 md:p-4 rounded-xl md:rounded-2xl shadow-2xl flex items-center gap-3 md:gap-4 pointer-events-auto"
                >
                    <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center shrink-0">
                        <Bell className="h-4 w-4 md:h-5 md:w-5 text-cima-gold" />
                    </div>
                    <div>
                        <p className="text-[8px] md:text-[10px] font-bold text-cima-gold uppercase tracking-widest">{activities[index].loc}</p>
                        <p className="text-[10px] md:text-[11px] text-white/80 leading-tight">
                            <span className="font-bold text-white">{activities[index].name}</span> {activities[index].action}
                        </p>
                        <p className="text-[8px] md:text-[9px] text-white/30 mt-0.5 md:mt-1 font-mono">{activities[index].time}</p>
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
        <div className="bg-white/[0.02] border border-white/10 rounded-[20px] md:rounded-[40px] overflow-hidden backdrop-blur-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                {/* Selector */}
                <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-white/10 p-4 md:p-8 space-y-2 md:space-y-4 max-lg:flex overflow-x-auto no-scrollbar max-lg:gap-2">
                    <p className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-[0.3em] mb-4 md:mb-8 hidden lg:block">Interacción Dueño</p>
                    {tabs.map((tab, i) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(i)}
                            className={`flex lg:w-full items-center gap-3 md:gap-4 p-3 md:p-5 rounded-xl md:rounded-2xl transition-all duration-500 text-left group whitespace-nowrap lg:whitespace-normal shrink-0 ${activeTab === i ? "bg-cima-gold text-black shadow-xl shadow-cima-gold/20" : "hover:bg-white/5 text-white/40 hover:text-white"}`}
                        >
                            <tab.icon className={`h-4 w-4 md:h-5 md:w-5 ${activeTab === i ? "text-black" : "text-cima-gold/50 group-hover:text-cima-gold"}`} />
                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Visualizer */}
                <div className="lg:col-span-8 p-6 md:p-12 lg:p-20 flex flex-col justify-center bg-gradient-to-br from-white/[0.01] to-transparent min-h-[500px] md:min-h-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5, ease: "circOut" }}
                            className="max-w-xl mx-auto lg:mx-0"
                        >
                            <h3 className="text-2xl md:text-3xl lg:text-4xl font-heading font-black mb-4 md:mb-6 leading-tight text-center lg:text-left">
                                {tabs[activeTab].title}
                            </h3>
                            <p className="text-white/50 text-sm md:text-base mb-8 md:mb-12 leading-relaxed text-center lg:text-left">
                                {tabs[activeTab].desc}
                            </p>

                            {/* The "Portal" Mockup */}
                            <div className="relative group mx-auto max-w-[280px] md:max-w-sm">
                                <div className="absolute -inset-6 bg-cima-gold/10 blur-[40px] md:blur-[60px] rounded-full opacity-50" />
                                <div className="relative border-[3px] md:border-4 border-white/10 rounded-[2rem] md:rounded-[2.5rem] aspect-[9/16] bg-[#0c0c0d] overflow-hidden shadow-2xl p-4 md:p-6">
                                    {/* Phone notch */}
                                    <div className="mx-auto w-16 md:w-24 h-3 md:h-4 bg-white/10 rounded-full mb-6 md:mb-8" />

                                    <div className="flex items-center gap-2 md:gap-3 mb-6 md:mb-8">
                                        <div className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-cima-gold/20 border border-cima-gold/40" />
                                        <div className="flex-1">
                                            <div className="h-2 w-16 md:w-20 bg-white/10 rounded-full mb-1" />
                                            <div className="h-1 w-8 md:w-12 bg-white/5 rounded-full" />
                                        </div>
                                    </div>

                                    {tabs[activeTab].mock}

                                    <div className="absolute bottom-6 md:bottom-10 left-4 md:left-6 right-4 md:right-6 space-y-2 md:space-y-3">
                                        <div className="h-7 md:h-8 w-full bg-cima-gold/20 border border-cima-gold/40 rounded-lg flex items-center justify-center">
                                            <MessageSquare className="h-3 w-3 text-cima-gold" />
                                        </div>
                                        <div className="h-7 md:h-8 w-full bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
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
        <div className="bg-[#0c0c0d] border border-white/5 rounded-[20px] md:rounded-[40px] overflow-hidden shadow-2xl relative group w-full max-w-full">
            <div className="absolute inset-0 bg-gradient-to-tr from-cima-gold/[0.03] to-transparent pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
                {/* Sidebar - Collapsible on small screens? Let's use simple layout */}
                <div className="lg:col-span-3 border-r border-white/5 p-4 md:p-6 bg-black/40 lg:flex lg:flex-col">
                    <div className="flex items-center justify-between lg:justify-start gap-3 mb-6 lg:mb-10">
                        <div className="flex items-center gap-2">
                            <div className="h-6 w-6 md:h-8 md:w-8 rounded bg-cima-gold flex items-center justify-center">
                                <Briefcase className="h-3 w-3 md:h-4 md:w-4 text-black" />
                            </div>
                            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white/80">Agent Command</span>
                        </div>
                        <Menu className="h-4 w-4 md:h-5 md:w-5 lg:hidden text-white/40" />
                    </div>

                    <nav className="space-y-1 md:space-y-2 hidden lg:block overflow-y-auto">
                        {[
                            { icon: Layout, label: "Mis Propiedades", active: true },
                            { icon: Users, label: "Clientes / Dueños", active: false },
                            { icon: Target, label: "Visitas Registradas", active: false },
                            { icon: TrendingUp, label: "Analíticos", active: false },
                            { icon: Settings, label: "Configuración", active: false }
                        ].map((item, i) => (
                            <div key={i} className={`flex items-center gap-3 p-2 md:p-3 rounded-xl transition-all ${item.active ? "bg-cima-gold/10 text-cima-gold border border-cima-gold/20" : "text-white/20 hover:text-white/40"}`}>
                                <item.icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
                                <span className="text-[8px] md:text-[10px] font-bold uppercase">{item.label}</span>
                            </div>
                        ))}
                    </nav>

                    <div className="mt-6 lg:mt-auto p-3 md:p-4 bg-white/[0.02] border border-white/5 rounded-xl md:rounded-2xl hidden lg:block overflow-hidden">
                        <p className="text-[8px] md:text-[9px] text-cima-gold font-bold mb-2 uppercase tracking-tight">Capacidad de Cuenta</p>
                        <div className="h-1 w-full bg-white/5 rounded-full mb-2">
                            <div className="h-full bg-cima-gold w-[40%]" />
                        </div>
                        <p className="text-[7px] md:text-[8px] text-white/30 uppercase">4/10 propiedades activas</p>
                    </div>
                </div>

                <div className="lg:col-span-9 p-4 md:p-8 lg:p-12 overflow-x-hidden">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 md:mb-10 text-wrap">
                        <h4 className="text-lg md:text-xl font-heading font-black">Mis Propiedades en Venta</h4>
                        <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-cima-gold text-black px-4 py-2 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-tight sm:tracking-tighter hover:scale-105 transition-all shadow-lg shadow-cima-gold/10 whitespace-nowrap">
                            <Plus className="h-3.5 w-3.5" /> Nueva Propiedad
                        </button>
                    </div>

                    <div className="space-y-3 md:space-y-4">
                        {[
                            { name: "Residencia Las Misiones", price: "$12.4M", status: "En Venta", owner: "Familia García" },
                            { name: "Departamento Torre LOVFT", price: "$4.2M", status: "Exclusiva", owner: "Ing. Roberto M." }
                        ].map((prop, i) => (
                            <div key={i} className="bg-white/[0.03] border border-white/10 p-4 md:p-6 rounded-xl md:rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 hover:border-cima-gold/30 transition-all group/item overflow-hidden">
                                <div className="flex items-center gap-3 md:gap-5 w-full md:w-auto">
                                    <div className="h-10 w-14 md:h-12 md:w-16 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center text-white/20 font-mono text-[8px] md:text-[10px] shrink-0">PHOTO</div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] md:text-xs font-bold text-white group-hover/item:text-cima-gold transition-colors truncate">{prop.name}</p>
                                        <div className="flex gap-3 md:gap-4 mt-1">
                                            <span className="text-[8px] md:text-[9px] text-white/30 font-mono uppercase tracking-tighter shrink-0">{prop.price}</span>
                                            <span className="text-[8px] md:text-[9px] text-cima-gold font-bold uppercase tracking-widest shrink-0">{prop.status}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-white/5">
                                    <div className="text-left md:text-right">
                                        <p className="text-[7px] md:text-[8px] text-white/20 uppercase font-black tracking-widest mb-0.5 md:mb-1">Dueño asignado</p>
                                        <p className="text-[9px] md:text-[10px] text-white/60 font-medium truncate">{prop.owner}</p>
                                    </div>
                                    <div className="flex gap-1.5 md:gap-2">
                                        <div className="p-1.5 md:p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-cima-gold/10 hover:border-cima-gold/40 transition-all cursor-pointer">
                                            <Eye className="h-3 md:h-3.5 w-3 md:w-3.5 text-white/40" />
                                        </div>
                                        <div className="p-1.5 md:p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-cima-gold/10 hover:border-cima-gold/40 transition-all cursor-pointer">
                                            <Target className="h-3 md:h-3.5 w-3 md:w-3.5 text-white/40" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 md:mt-12 p-6 md:p-8 border-2 border-dashed border-white/5 rounded-2xl md:rounded-3xl flex flex-col items-center text-center">
                        <div className="h-8 w-8 md:h-10 md:w-10 bg-white/5 rounded-full flex items-center justify-center mb-3 md:mb-4">
                            <Plus className="h-4 w-4 md:h-5 md:w-5 text-white/20" />
                        </div>
                        <p className="text-[8px] md:text-[10px] text-white/30 uppercase font-bold md:font-black tracking-[0.15em] md:tracking-[0.2em]">Sube tu inventario y deja que el sistema trabaje por ti.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ZeroFrictionTimeline() {
    return (
        <div className="relative py-12 md:py-20">
            <div className="absolute top-0 bottom-0 left-[2.5rem] md:left-1/2 -translate-x-[0.5px] md:-translate-x-1/2 w-[1px] bg-white/10" />

            <div className="space-y-16 md:space-y-24">
                {[
                    { step: "01", title: "Configuración Relámpago", desc: "Eliges tu plan y personalizas tu marca en menos de 10 minutos. No necesitas saber código.", icon: MousePointer2 },
                    { step: "02", title: "Lanzamiento Instantáneo", desc: "Tu infraestructura se despliega en nuestros servidores de alto rendimiento. Estás live en 24h.", icon: Rocket },
                    { step: "03", title: "Domina tu Mercado", desc: "Empiezas a captar exclusivas con tecnología que tus competidores ni siquiera sueñan tener.", icon: Target }
                ].map((item, i) => (
                    <div key={item.step} className={`relative flex flex-col md:flex-row gap-6 md:gap-12 items-start md:items-center ${i % 2 !== 0 ? "md:flex-row-reverse" : ""}`}>
                        {/* Desktop Side A */}
                        <div className="hidden md:block flex-1 text-center md:text-right">
                            {i % 2 === 0 ? (
                                <>
                                    <h4 className="text-xl lg:text-2xl font-heading font-black mb-4">{item.title}</h4>
                                    <p className="text-white/40 text-xs lg:text-sm max-w-sm ml-auto">{item.desc}</p>
                                </>
                            ) : (
                                <div className="h-28 lg:h-32 w-28 lg:w-32 rounded-2xl lg:rounded-3xl bg-white/[0.02] border border-white/10 flex items-center justify-center ml-auto">
                                    <item.icon className="h-10 lg:h-12 w-10 lg:w-12 text-cima-gold/50" />
                                </div>
                            )}
                        </div>

                        {/* Timeline Circle */}
                        <div className="relative z-10 flex ml-4 md:ml-0 items-center justify-center shrink-0">
                            <div className="h-12 w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 rounded-full bg-cima-card border-2 border-cima-gold flex items-center justify-center shadow-2xl shadow-cima-gold/20">
                                <span className="text-cima-gold text-sm md:text-base font-mono font-black">{item.step}</span>
                            </div>
                        </div>

                        {/* Mobile & Desktop Side B */}
                        <div className="flex-1 text-left ml-4 md:ml-0">
                            <div className="md:hidden flex items-center gap-4 mb-4">
                                <div className="h-10 w-10 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-center">
                                    <item.icon className="h-5 w-5 text-cima-gold/50" />
                                </div>
                                <h4 className="text-lg font-heading font-black">{item.title}</h4>
                            </div>

                            <div className="hidden md:block">
                                {i % 2 !== 0 ? (
                                    <>
                                        <h4 className="text-xl lg:text-2xl font-heading font-black mb-4">{item.title}</h4>
                                        <p className="text-white/40 text-xs lg:text-sm max-w-sm">{item.desc}</p>
                                    </>
                                ) : (
                                    <div className="h-28 lg:h-32 w-28 lg:w-32 rounded-2xl lg:rounded-3xl bg-white/[0.02] border border-white/10 flex items-center justify-center mr-auto">
                                        <item.icon className="h-10 lg:h-12 w-10 lg:w-12 text-cima-gold/50" />
                                    </div>
                                )}
                            </div>

                            <p className="md:hidden text-white/40 text-[11px] leading-relaxed max-w-xs">{item.desc}</p>
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
        <div className="bg-white/[0.02] border border-white/10 rounded-[20px] md:rounded-[40px] p-6 md:p-12 backdrop-blur-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 items-center">
                <div>
                    <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-[0.3em] mb-4 block">Simulador de Impacto</span>
                    <h3 className="text-2xl md:text-3xl font-heading font-bold mb-4 md:mb-6">Tu tecnología se paga con <span className="text-cima-gold">un solo cierre.</span></h3>
                    <p className="text-white/50 mb-8 md:mb-10 text-xs md:text-sm leading-relaxed">
                        ¿Cuánto vale tu tiempo y tu imagen? Calcula el retorno de inversión al digitalizar tu proceso con la Master Template.
                    </p>

                    <div className="space-y-6 md:space-y-8">
                        <div>
                            <label className="text-[9px] md:text-[10px] uppercase font-bold text-white/40 block mb-3 md:mb-4">Valor promedio de tus propiedades</label>
                            <input
                                type="range" min="1000000" max="15000000" step="500000"
                                value={price} onChange={(e) => setPrice(Number(e.target.value))}
                                className="w-full accent-cima-gold bg-white/10 h-1.5 rounded-full appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between mt-2 text-[9px] md:text-[10px] font-mono text-white/30 uppercase">
                                <span>$1M</span>
                                <span className="text-cima-gold font-bold text-xs">${(price / 1000000).toFixed(1)}M MXN</span>
                                <span>$15M</span>
                            </div>
                        </div>

                        <div>
                            <label className="text-[9px] md:text-[10px] uppercase font-bold text-white/40 block mb-3 md:mb-4">Propiedades cerradas al año</label>
                            <div className="grid grid-cols-4 gap-2">
                                {[3, 6, 12, 24].map(val => (
                                    <button
                                        key={val}
                                        onClick={() => setMonthlyProp(val / 12)}
                                        className={`py-2.5 rounded-xl border text-[10px] md:text-xs font-bold transition-all ${Math.round(monthlyProp * 12) === val ? "bg-cima-gold text-black border-cima-gold" : "bg-white/5 border-white/10 text-white/40 hover:border-cima-gold/30"}`}
                                    >
                                        {val}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-cima-gold/5 rounded-2xl md:rounded-3xl p-6 md:p-8 border border-cima-gold/20 relative overflow-hidden">
                    <div className="relative z-10 space-y-6 md:space-y-8">
                        <div>
                            <p className="text-[9px] md:text-[10px] uppercase font-bold text-cima-gold tracking-[0.2em] mb-1.5 md:mb-2">Comisión estimada por venta</p>
                            <p className="text-2xl md:text-3xl font-heading font-bold text-white">${new Intl.NumberFormat().format(singleCommission)}</p>
                        </div>
                        <div className="pt-4 md:pt-6 border-t border-white/5">
                            <p className="text-[9px] md:text-[10px] uppercase font-bold text-white/40 tracking-[0.2em] mb-1.5 md:mb-2">Ingreso Anual Proyectado</p>
                            <p className="text-xl md:text-2xl font-heading font-bold text-white/90">${new Intl.NumberFormat().format(annualGain)}</p>
                        </div>
                        <div className="pt-4 md:pt-6 border-t border-white/5">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-[8px] md:text-[10px] uppercase font-black text-cima-gold tracking-[0.2em] md:tracking-[0.3em] mb-1 italic">ROI Anual estimado</p>
                                    <p className="text-4xl md:text-5xl font-heading font-black text-cima-gold">{roi}x</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[8px] md:text-[9px] text-cima-gold/60 leading-tight">Tu plataforma se paga <br /> {roi} veces en un año.</p>
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
            className="min-h-screen bg-[#0A0A0B] text-white selection:bg-cima-gold/30 scroll-smooth relative overflow-x-hidden"
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
                <div className="mx-auto max-w-7xl h-16 px-4 md:px-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-7 w-7 md:h-8 md:w-8 rounded-lg bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center shrink-0">
                            <Cpu className="h-3.5 w-3.5 md:h-4 md:w-4 text-cima-gold" />
                        </div>
                        <span className="font-heading font-bold tracking-tight text-white/90 text-sm md:text-base whitespace-nowrap">Master Template <span className="text-cima-gold italic font-medium ml-1 hidden sm:inline">Pro</span></span>
                    </div>
                    <div className="flex items-center gap-3 md:gap-4">
                        <span className="hidden lg:flex items-center gap-2 text-[10px] font-mono text-white/40 uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            Solo 2 cupos en Monterrey
                        </span>
                        <Link
                            href="/onboarding"
                            className="flex items-center gap-1 md:gap-2 bg-cima-gold text-black px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[10px] md:text-xs font-black uppercase tracking-tight hover:bg-white transition-all shadow-lg shadow-cima-gold/10"
                        >
                            Asegurar lugar
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 md:pt-40 pb-16 md:pb-24 px-4 md:px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full md:w-[1000px] h-[400px] md:h-[600px] bg-cima-gold/5 blur-[80px] md:blur-[120px] rounded-full pointer-events-none" />

                <div className="relative mx-auto max-w-5xl text-center">
                    <FadeIn>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 md:mb-8 overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            <ShieldAlert className="h-3.5 w-3.5 text-cima-gold shrink-0" />
                            <span className="text-[9px] md:text-[10px] font-mono tracking-[0.15em] md:tracking-[0.2em] uppercase text-cima-gold">Disponibilidad Limitada por Ciudad</span>
                        </div>
                    </FadeIn>

                    <h1 className="text-3xl md:text-5xl lg:text-7xl xl:text-8xl font-heading font-bold tracking-tight mb-6 md:mb-8 leading-[1.1] md:leading-[1.05]">
                        Deja de ser un asesor común. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cima-gold via-white to-cima-gold-light">
                            Conviértete en Plataforma.
                        </span>
                    </h1>

                    <p className="text-sm md:text-lg lg:text-xl text-white/60 max-w-3xl mx-auto mb-10 md:mb-12 leading-relaxed">
                        El 90% de los asesores pierden exclusivas porque sus herramientas parecen de los 90s. La Master Template te da la estética y el sistema de las agencias de ultra-lujo.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
                        <Link
                            href="/onboarding"
                            className="w-full sm:w-auto px-8 py-4 md:px-10 md:py-5 bg-cima-gold text-black font-heading font-bold rounded-xl md:rounded-2xl hover:scale-105 transition-all shadow-[0_15px_30px_-10px_rgba(200,169,110,0.3)] relative group overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            <span className="relative z-10 text-xs md:text-sm uppercase tracking-widest">Lanzar mi plataforma</span>
                        </Link>
                        <a
                            href="#roi"
                            className="w-full sm:w-auto px-8 py-4 md:px-10 md:py-5 bg-white/5 border border-white/10 font-heading font-bold rounded-xl md:rounded-2xl hover:bg-white/10 transition-all text-[10px] md:text-sm uppercase tracking-widest"
                        >
                            Ver ROI estimado
                        </a>
                    </div>
                </div>
            </section>

            {/* The Pain Points Section */}
            <section className="py-16 md:py-24 px-4 md:px-6 border-y border-white/5 bg-[#070708]">
                <div className="mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <FadeIn direction="right">
                            <h2 className="text-2xl md:text-4xl lg:text-5xl font-heading font-bold mb-6 md:mb-8 leading-tight">
                                Por qué los propietarios <br className="hidden md:block" />
                                <span className="text-white/40 italic font-medium text-xl md:text-3xl lg:text-4xl">dicen que no a otros asesores...</span>
                            </h2>
                            <p className="text-white/50 text-base md:text-lg mb-8 md:mb-10">
                                Enviar un PDF por WhatsApp ya no es suficiente. El cliente de hoy busca **certeza, diseño y transparencia**.
                            </p>
                            <div className="space-y-4 md:space-y-6">
                                {[
                                    { p: "No hay reportes de avance", s: "Portal Propietario 24/7" },
                                    { p: "Imagen poco profesional", s: "Diseño Elite de Ultra-Lujo" },
                                    { p: "Feedback de visitas perdido", s: "Sistema IA de Seguimiento" }
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/[0.02] border border-white/5">
                                        <div className="flex items-center gap-3 flex-1 w-full">
                                            <div className="p-1.5 bg-red-500/10 rounded-lg shrink-0">
                                                <X className="h-3.5 w-3.5 text-red-500/50" />
                                            </div>
                                            <span className="text-[10px] md:text-xs text-white/40 line-through min-w-0 truncate">{item.p}</span>
                                        </div>
                                        <ArrowRight className="h-3 w-3 text-white/20 hidden sm:block shrink-0" />
                                        <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                                            <div className="p-1.5 bg-cima-gold/10 rounded-lg shrink-0">
                                                <CheckCircle2 className="h-3.5 w-3.5 text-cima-gold" />
                                            </div>
                                            <span className="text-[10px] md:text-xs text-cima-gold font-bold">{item.s}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </FadeIn>

                        <FadeIn direction="left">
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-cima-gold/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full pointer-events-none" />
                                <div className="relative bg-white/[0.03] border border-white/10 rounded-3xl md:rounded-[40px] p-8 md:p-12 backdrop-blur-md">
                                    <Smartphone className="h-8 w-8 md:h-10 md:w-10 text-cima-gold mb-6 md:mb-8" />
                                    <h3 className="text-xl md:text-2xl font-heading font-bold mb-4 md:mb-6 leading-tight">"El 73% de los propietarios eligen al asesor que les ofrece seguimiento digital."</h3>
                                    <p className="text-white/40 text-xs italic">
                                        — Fuente: Reporte de Tendencias Inmobiliarias 2025.
                                    </p>
                                    <div className="mt-8 md:mt-10 pt-8 md:pt-10 border-t border-white/10">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-cima-gold/20 flex items-center justify-center shrink-0">
                                                <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-cima-gold" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-white text-[10px] md:text-sm">Aumento en exclusivas</p>
                                                <p className="text-cima-gold font-mono text-lg md:text-xl font-black">+42%</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* Agents Dashboard Section - THE RECENTLY FIXED CONTROL CENTER */}
            <section className="py-16 md:py-24 px-4 md:px-6 relative bg-black/40 border-b border-white/5 overflow-hidden">
                <div className="mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <FadeIn direction="right">
                            <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-[0.4em] mb-4 block text-center lg:text-left">El Motor de tu Negocio</span>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-black mb-6 md:mb-8 tracking-tight text-center lg:text-left">Agent Command Center</h2>
                            <p className="text-white/60 text-sm md:text-lg mb-8 md:mb-10 leading-relaxed text-center lg:text-left">
                                No solo les das un portal a tus clientes; tú obtienes un **centro de comando inteligente** para gestionar todo tu inventario en un solo lugar.
                            </p>
                            <ul className="space-y-4 md:space-y-6 mb-10 max-w-md mx-auto lg:mx-0">
                                {[
                                    { t: "Gestión Centralizada", d: "Sube y actualiza propiedades en segundos.", icon: Layout },
                                    { t: "Generador de Portales", d: "Un clic para activar el portal del dueño.", icon: Key },
                                    { t: "Tracking de Visitas", d: "Registra feedback real y genera reportes IA.", icon: Target }
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-4 group items-start">
                                        <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-xl bg-cima-gold/10 border border-cima-gold/20 flex items-center justify-center group-hover:bg-cima-gold/20 transition-all shrink-0 mt-0.5">
                                            <item.icon className="h-4 w-4 md:h-5 md:w-5 text-cima-gold" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-white text-[11px] md:text-sm">{item.t}</p>
                                            <p className="text-white/40 text-[10px] md:text-xs mt-0.5 leading-relaxed">{item.d}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </FadeIn>

                        <FadeIn direction="left" className="w-full">
                            <AgentCommandCenterPreview />
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* Interactive Portal Preview Section (Dueño) */}
            <section className="py-16 md:py-24 px-4 md:px-6 relative overflow-hidden">
                <div className="mx-auto max-w-6xl">
                    <div className="text-center mb-12 md:mb-20">
                        <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-[0.4em] mb-4 block">Lo que ve tu Cliente</span>
                        <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4 tracking-tight">Portal del Propietario</h2>
                        <p className="text-white/40 text-sm md:text-base max-w-2xl mx-auto">La herramienta que te hará ganar más exclusivas al darles transparencia total.</p>
                    </div>

                    <PortalPreviewSystem />
                </div>
            </section>

            {/* ROI Calculator Section */}
            <section id="roi" className="py-16 md:py-24 px-4 md:px-6 relative bg-[#070708]">
                <div className="mx-auto max-w-6xl">
                    <MasterRoiCalculator />
                </div>
            </section>

            {/* Zero Friction Timeline */}
            <section className="py-16 md:py-24 px-4 md:px-6">
                <div className="mx-auto max-w-6xl">
                    <div className="text-center mb-12 md:mb-20">
                        <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4 tracking-tight">De Cero a Pro en 24 Horas</h2>
                        <p className="text-white/40 text-sm md:text-base">Fricción eliminada. Eficiencia maximizada.</p>
                    </div>
                    <ZeroFrictionTimeline />
                </div>
            </section>

            {/* Bento Features */}
            <section className="py-16 md:py-24 px-4 md:px-6 bg-[#070708]">
                <div className="mx-auto max-w-6xl">
                    <div className="text-center mb-16 md:mb-20">
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">Ecosistema Propietario-Asesor</h2>
                        <p className="text-white/40 text-sm md:text-base max-w-2xl mx-auto">Toda la potencia de Cima Pro, empaquetada para tu crecimiento personal.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {FEATURES.map((f, i) => (
                            <FadeIn key={f.title} delay={i * 0.1}>
                                <TiltCard className="h-full">
                                    <div className="h-full bg-white/[0.02] border border-white/5 p-6 md:p-10 rounded-2xl md:rounded-[32px] hover:border-cima-gold/40 transition-all group flex flex-col items-center text-center">
                                        <div className="h-12 w-12 md:h-16 md:w-16 rounded-xl md:rounded-2xl bg-cima-gold/10 border border-cima-gold/20 flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 group-hover:bg-cima-gold/20 transition-all duration-500 shadow-xl shadow-cima-gold/5 shrink-0">
                                            <f.icon className="h-6 w-6 md:h-8 md:w-8 text-cima-gold" />
                                        </div>
                                        <h3 className="text-lg md:text-xl font-heading font-bold mb-3 md:mb-4 tracking-tight">{f.title}</h3>
                                        <p className="text-[11px] md:text-sm text-white/50 leading-relaxed font-medium">{f.desc}</p>
                                    </div>
                                </TiltCard>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* Comparison Table */}
            <section className="py-16 md:py-24 px-4 md:px-6 relative">
                <div className="mx-auto max-w-5xl">
                    <div className="text-center mb-12 md:mb-16">
                        <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-[0.4em] mb-4 block">Análisis de Mercado</span>
                        <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">¿Por qué Master Template?</h2>
                        <p className="text-white/40 text-sm md:text-base">Comparativa contra el desarrollo tradicional y plataformas genéricas.</p>
                    </div>

                    <div className="rounded-2xl md:rounded-[40px] border border-white/10 overflow-x-auto no-scrollbar bg-white/[0.01]">
                        <table className="w-full text-left min-w-[600px]">
                            <thead className="bg-white/5 border-b border-white/10">
                                <tr>
                                    <th className="p-4 md:p-6 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/40">Característica</th>
                                    <th className="p-4 md:p-6 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/40">Tradicional</th>
                                    <th className="p-4 md:p-6 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-cima-gold bg-cima-gold/5 font-mono">Master Template</th>
                                </tr>
                            </thead>
                            <tbody className="text-[11px] md:text-sm font-medium">
                                {[
                                    { f: "Costo de Inicio", t: "$150,000 MXN+", m: "Desde $14,900 MXN", good: true },
                                    { f: "Tiempo de Entrega", t: "3–6 meses", m: "< 24 horas", good: true },
                                    { f: "Portal Propietario", t: "No incluido / Manual", m: "Nativo Automatizado", good: true },
                                    { f: "Mantenimiento", t: "$5,000/mes+", m: "Incluido en tu plan", good: true },
                                    { f: "IA e Inteligencia", t: "Costo extra masivo", m: "Integrado en el core", good: true }
                                ].map((row, i) => (
                                    <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                        <td className="p-4 md:p-6 text-white/80">{row.f}</td>
                                        <td className="p-4 md:p-6 text-white/30">{row.t}</td>
                                        <td className="p-4 md:p-6 text-cima-gold font-bold bg-cima-gold/[0.02]">{row.m}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-16 md:py-24 px-4 md:px-6 bg-[#0A0A0B] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-cima-gold/5 rounded-full blur-[100px] md:blur-[150px] -mr-48 md:-mr-96 -mt-48 md:-mt-96 pointer-events-none" />

                <div className="mx-auto max-w-6xl">
                    <div className="text-center mb-12 md:mb-16">
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold mb-4 tracking-tight">Elige tu Nivel de Servicio</h2>
                        <p className="text-white/40 max-w-2xl mx-auto italic font-medium text-sm md:text-base">Solo aceptamos 3 asesores por zona para garantizar exclusividad tecnológica.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative z-10">
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
                                cta: "Activar Licencia Pro"
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
                                className={`p-8 md:p-10 rounded-[30px] md:rounded-[50px] border flex flex-col h-full transition-all duration-700 relative overflow-hidden group ${plan.highlight ? "bg-cima-card border-cima-gold shadow-[0_30px_60px_-20px_rgba(200,169,110,0.2)] lg:scale-105 z-10" : "bg-white/[0.02] border-white/5"}`}
                            >
                                {plan.popular && (
                                    <div className="absolute top-6 right-8 md:right-10 bg-cima-gold text-black text-[8px] md:text-[9px] font-black uppercase tracking-widest py-1.5 px-3 md:px-4 rounded-full">Más Popular</div>
                                )}
                                <h3 className="text-lg md:text-xl font-heading font-bold mb-2 group-hover:text-cima-gold transition-colors">{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mb-6 md:mb-8">
                                    <span className="text-4xl md:text-5xl font-black text-cima-gold tracking-tighter">{plan.price}</span>
                                    <span className="text-[10px] md:text-xs text-white/40 font-mono font-bold uppercase tracking-widest">MXN</span>
                                </div>
                                <p className="text-xs md:text-sm text-white/50 mb-8 md:mb-10 leading-relaxed font-medium h-auto sm:h-12">{plan.desc}</p>
                                <ul className="space-y-4 md:space-y-5 mb-10 md:mb-12 flex-1">
                                    {plan.features.map(f => (
                                        <li key={f} className="flex items-center gap-3 md:gap-4 text-[10px] md:text-xs font-bold text-white/70">
                                            <div className="h-4 w-4 md:h-5 md:w-5 rounded-full bg-cima-gold/10 flex items-center justify-center shrink-0">
                                                <CheckCircle2 className="h-2.5 w-2.5 md:h-3 md:w-3 text-cima-gold " />
                                            </div>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href="/onboarding"
                                    className={`w-full py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-[0.15em] md:tracking-[0.2em] text-center transition-all duration-500 shadow-xl overflow-hidden relative group/btn ${plan.highlight ? "bg-cima-gold text-black hover:scale-105" : "bg-white/5 text-white hover:bg-white/10"}`}
                                >
                                    <div className="absolute inset-0 bg-white/20 translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300" />
                                    <span className="relative z-10">{plan.cta}</span>
                                </Link>

                                {/* Availability Note */}
                                <div className="mt-5 md:mt-6 flex items-center justify-center gap-2 opacity-50 text-[8px] md:text-[9px] font-mono font-bold uppercase tracking-widest">
                                    <Clock className="h-3 w-3" />
                                    Entrega en 24h
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Enterprise Bridge */}
            <section className="py-16 md:py-24 px-4 md:px-6 border-y border-white/5 bg-gradient-to-b from-transparent to-cima-gold/[0.02] relative">
                <div className="mx-auto max-w-4xl text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 md:mb-8 shrink-0">
                        <Cpu className="h-3.5 w-3.5 text-cima-gold-light" />
                        <span className="text-[9px] md:text-[10px] font-mono tracking-[0.15em] md:tracking-[0.2em] uppercase text-cima-gold-light">Nivel Enterprise</span>
                    </div>
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-heading font-bold mb-6 md:mb-8 text-white tracking-tight">¿Necesitas algo a medida?</h2>
                    <p className="text-white/50 mb-10 md:mb-12 text-sm md:text-lg leading-relaxed max-w-2xl mx-auto font-medium">
                        Si eres una franquicia con +10 asesores, necesitas tu propia base de datos, integraciones CRM profundas e IA propietaria entrenada con tus datos.
                    </p>
                    <Link
                        href="/pro"
                        className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 md:gap-4 text-cima-gold font-black text-[10px] md:text-sm uppercase tracking-[0.2em] md:tracking-[0.3em] hover:gap-6 transition-all bg-cima-gold/5 border border-cima-gold/20 px-8 py-4 md:px-10 md:py-5 rounded-xl md:rounded-2xl shadow-2xl"
                    >
                        Explorar Cima Pro <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 shrink-0" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 md:py-20 px-4 md:px-6 border-t border-white/5 relative z-10">
                <div className="mx-auto max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 justify-between items-center gap-10 md:gap-12 mb-12 md:mb-20">
                        <div className="text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-4 md:mb-6">
                                <Cpu className="h-5 w-5 md:h-6 md:w-6 text-cima-gold" />
                                <span className="text-base md:text-lg font-black uppercase tracking-[0.15em] md:tracking-[0.2em]">Master Template <span className="text-cima-gold">Pro</span></span>
                            </div>
                            <p className="text-[9px] md:text-[10px] text-white/30 font-bold uppercase tracking-[0.3em] md:tracking-[0.35em] max-w-xs mx-auto md:mx-0 leading-relaxed">
                                Infraestructura de Grado Industrial para el Asesor que no se conforma.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4 md:gap-8 justify-center md:justify-end text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/40">
                            <Link href="/" className="hover:text-cima-gold transition-colors">Volver a Cima</Link>
                            <Link href="/onboarding" className="hover:text-cima-gold transition-colors">Onboarding</Link>
                            <Link href="/pro" className="hover:text-cima-gold transition-colors">Enterprise</Link>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-10 border-t border-white/5">
                        <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest text-center sm:text-left">© {new Date().getFullYear()} Cima Tech Ecosystem. All rights reserved.</p>
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
