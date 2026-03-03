"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Home, Phone, MapPin, BedDouble, Bath, Ruler,
    Camera, Calendar, Shield, Star, ArrowRight, CheckCircle2,
    TrendingUp, Users as UsersIcon, Zap, ChevronLeft, ChevronRight, MessageSquare, Award, Eye, X, Send, Sparkles, Smartphone, Monitor, Moon, MoonStar
} from "lucide-react";
import type { PlanConfig } from "@/lib/config/demo-plans";
import { type LiveMessage } from "./LiveDemoClient";
import { MobileFrame } from "./MobileFrame";

/**
 * Social proof component for Pro/Team plans
 */
function SocialProofToast({ tier, isDND }: { tier: string; isDND: boolean }) {
    const [visible, setVisible] = useState(false);
    const [count, setCount] = useState(12);

    useEffect(() => {
        if (tier === "basico" || isDND) {
            setVisible(false);
            return;
        }

        const timer = setTimeout(() => {
            setCount(Math.floor(8 + Math.random() * 8));
            setVisible(true);
        }, 3000);

        return () => clearTimeout(timer);
    }, [tier, isDND]);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="fixed bottom-6 left-6 z-[100] bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl flex items-center gap-3 max-w-[200px]"
                >
                    <div className="h-10 w-10 rounded-full bg-cima-gold/20 flex items-center justify-center shrink-0">
                        <UsersIcon className="h-5 w-5 text-cima-gold" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-white leading-tight">
                            <span className="text-cima-gold">{count} personas</span> viendo esta propiedad ahora
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[7px] text-white/40 font-bold uppercase tracking-widest">En tiempo real</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setVisible(false)}
                        className="absolute top-2 right-2 text-white/20 hover:text-white transition-colors"
                    >
                        <Zap className="h-2 w-2" />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/**
 * Main content of the landing page, extracted for reusability between desktop/mobile views
 */
function LandingContent({
    isTeam, isPro, isStarter, f, accentText, accentBg, accentBorder,
    activePhoto, setActivePhoto, photos, handleTriggerLead,
    propertyValue, setPropertyValue, commissionTraditional, commissionCima,
    savings, Wrapper, anim, delayAnim, onSendMessage, messages, isDND, plan, property
}: any) {
    // ─── RENDERING BY TIER ───

    // 1. STARTER: Minimalist & Clean
    if (isStarter) {
        return (
            <div className="w-full bg-white text-gray-900 min-h-screen font-sans">
                <nav className="p-6 flex justify-between items-center border-b border-gray-100">
                    <div className="font-bold flex items-center gap-2">
                        <Home className="h-5 w-5 text-gray-400" />
                        <span className="tracking-tight">Inmuebles Direct</span>
                    </div>
                </nav>
                <div className="max-w-4xl mx-auto px-6 py-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="rounded-3xl overflow-hidden aspect-video bg-gray-100 shadow-2xl border border-gray-100 relative group"
                        >
                            <img src={photos[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="Property" />
                            <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest text-blue-600 border border-blue-100">Starter Plan</div>
                        </motion.div>
                        <div className="space-y-8">
                            <div>
                                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full uppercase tracking-widest border border-blue-100">Oportunidad Única</span>
                                <h1 className="text-4xl font-black leading-tight mt-4 text-gray-900">{property?.name || "Residencia en San Jerónimo"}</h1>
                                <p className="text-2xl font-light text-gray-400 mt-2">{property?.price || "$8,500,000 MXN"}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-6 bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm"><BedDouble className="h-4 w-4" /></div>
                                    <div><p className="text-[7px] font-black uppercase text-gray-400">Recámaras</p><p className="text-xs font-bold text-gray-900">4 Unidades</p></div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm"><Ruler className="h-4 w-4" /></div>
                                    <div><p className="text-[7px] font-black uppercase text-gray-400">Dimensión</p><p className="text-xs font-bold text-gray-900">320 m² Totales</p></div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button onClick={handleTriggerLead} className="w-full py-4 bg-blue-600 text-white rounded-[1.2rem] font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-blue-600/20">
                                    Solicitar Información
                                </button>
                                <p className="text-center text-[8px] font-bold text-gray-400 uppercase tracking-widest">Respuesta en menos de 24 horas</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 2. PROFESIONAL: Modern & Data-Driven
    if (isPro) {
        return (
            <div className="w-full bg-[#0F172A] text-white min-h-screen font-sans selection:bg-blue-500">
                <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-blue-500/10 to-transparent" />
                <nav className="relative p-6 max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center text-white"><Home className="h-4 w-4" /></div>
                        <span className="font-bold tracking-tight">Cima Pro Real Estate</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-wider text-white/60">
                        <a href="#" className="hover:text-blue-400">Galería</a>
                        <a href="#" className="hover:text-blue-400">Calculadora</a>
                        <a href="#" className="hover:text-blue-400 text-white">Contactar</a>
                    </div>
                </nav>

                <div className="relative max-w-6xl mx-auto px-6 pt-12 pb-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <Wrapper {...anim}>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map(i => <div key={i} className="h-6 w-6 rounded-full border-2 border-[#0F172A] bg-gray-600" />)}
                                    </div>
                                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">+12 personas interesadas</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black leading-tight bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
                                    Vive el lujo en<br />San Jerónimo
                                </h1>
                                <div className="flex items-center gap-4 mt-6">
                                    <p className="text-3xl font-light text-white">$8,500,000</p>
                                    <div className="bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full text-[10px] font-bold text-green-400 uppercase tracking-widest">
                                        Alta Plusvalía
                                    </div>
                                </div>
                            </Wrapper>

                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { icon: BedDouble, val: "4", label: "Recámaras" },
                                    { icon: Bath, val: "3.5", label: "Baños" },
                                    { icon: Ruler, val: "320", label: "Metros" },
                                    { icon: TrendingUp, val: "10%", label: "ROI Anual" },
                                ].map((s: { icon: React.ElementType, val: string, label: string }, i: number) => (
                                    <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                                        <s.icon className="h-5 w-5 text-blue-400" />
                                        <div>
                                            {[...Array(5)].map((_: any, i: number) => (
                                                <Star key={i} className="h-2.5 w-2.5 text-cima-gold fill-cima-gold" />
                                            ))}
                                            <p className="text-[9px] font-bold text-white/30 uppercase">{s.label}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-4">
                                <button onClick={handleTriggerLead} className="flex-[2] bg-blue-500 hover:bg-blue-400 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all">
                                    Agendar Cita Ahora
                                </button>
                                <button className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                                    Llamar
                                </button>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl relative group">
                                <img src={photos[activePhoto]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent" />
                                <div className="absolute bottom-8 inset-x-8">
                                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                                            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-blue-400">Vista en Directo</p>
                                        </div>
                                        <p className="text-sm font-bold text-white line-clamp-2 leading-relaxed italic">&quot;San Jerónimo está experimentando un incremento del 12% anual en plusvalía. Esta es una inversión estratégica.&quot;</p>
                                    </div>
                                </div>
                                <div className="absolute top-8 right-8 flex flex-col gap-2">
                                    <div className="bg-black/40 backdrop-blur-md border border-white/20 h-10 w-10 rounded-2xl flex items-center justify-center text-white cursor-pointer hover:bg-blue-500 transition-colors">
                                        <Camera className="h-4 w-4" />
                                    </div>
                                    <div className="bg-black/40 backdrop-blur-md border border-white/20 h-10 w-10 rounded-2xl flex items-center justify-center text-white cursor-pointer hover:bg-blue-500 transition-colors">
                                        <MapPin className="h-4 w-4" />
                                    </div>
                                </div>
                            </div>
                            {/* ROI Calculator Preview (Improved) */}
                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="absolute -bottom-6 -left-10 bg-white p-6 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-gray-900 w-56 hidden xl:block"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none">Cima Pulse IA</p>
                                    <TrendingUp className="h-3 w-3 text-blue-600" />
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-[8px] font-black uppercase opacity-40 mb-1"><span>Mercado</span><span>Caliente</span></div>
                                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <motion.div initial={{ width: 0 }} animate={{ width: "85%" }} transition={{ delay: 1, duration: 1.5 }} className="h-full bg-blue-600 rounded-full" />
                                        </div>
                                    </div>
                                    <p className="text-2xl font-black tracking-tight">$24,500 <span className="text-[10px] font-normal text-gray-400">MXN/mes</span></p>
                                    <p className="text-[8px] font-bold text-green-600 uppercase tracking-widest">Renta sugerida optima</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 3. TEAM: Ultra-Luxury "Cima Shield" Style
    return (
        <div className="relative w-full overflow-hidden bg-[#050505] text-white selection:bg-cima-gold selection:text-black min-h-screen font-sans">
            {/* ── Aurora & Grain ───────────────────────── */}
            <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-cima-gold/[0.05] rounded-full blur-[150px] animate-pulse" />
            <div className="absolute -bottom-20 -right-20 w-[600px] h-[600px] bg-blue-500/[0.03] rounded-full blur-[120px]" />
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />

            {/* Logo / Nav Overlay */}
            <nav className="relative z-10 max-w-7xl mx-auto px-10 py-10 flex justify-between items-end">
                <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-black text-cima-gold uppercase tracking-[0.4em]">Propiedad Exclusiva</span>
                    <h2 className="text-2xl font-heading font-black tracking-tighter">CIMA ESTATE</h2>
                </div>
                <div className="flex gap-10 items-center">
                    <div className="hidden lg:flex flex-col text-right">
                        <span className="text-[7px] font-black text-white/40 uppercase tracking-widest">Atención Directa</span>
                        <span className="text-[10px] font-bold">Lunes - Domingo</span>
                    </div>
                    <button className="h-14 w-14 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-cima-gold hover:text-black transition-all group">
                        <Phone className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    </button>
                    <button onClick={handleTriggerLead} className="h-14 bg-cima-gold px-8 rounded-full text-black text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(200,169,110,0.3)] hover:bg-white transition-all">
                        Solicitar Dossier
                    </button>
                </div>
            </nav>

            <div className="relative z-10 max-w-7xl mx-auto px-10 pt-20 pb-32">
                <div className="grid grid-cols-12 gap-10 items-stretch">
                    {/* Hero Left */}
                    <div className="col-span-12 lg:col-span-5 flex flex-col justify-center">
                        <Wrapper {...anim}>
                            <div className="flex items-center gap-3 mb-8">
                                <span className="h-px w-12 bg-cima-gold" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cima-gold">Mty, San Jerónimo</span>
                            </div>
                            <h1 className="text-6xl font-heading font-black tracking-tighter leading-[0.9] mb-10">
                                THE<br />HIDDEN<br />PEAK
                            </h1>
                            <div className="space-y-6 max-w-sm mb-12">
                                <p className="text-sm text-white/60 leading-relaxed">
                                    Una obra maestra arquitectónica diseñada para quienes buscan la cima del confort y la exclusividad. 320 metros cuadrados de pura ingeniería estética.
                                </p>
                                <div className="flex items-center gap-6">
                                    <p className="text-4xl font-heading font-black text-white">$8,500,000</p>
                                    <div className="h-12 w-px bg-white/10" />
                                    <p className="text-[10px] font-bold text-white/40 uppercase leading-snug">Listo para<br />Escriturar</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-2">
                                {[BedDouble, Bath, Ruler, Award].map((Icon, i) => (
                                    <div key={i} className="aspect-square rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col items-center justify-center gap-2 group hover:border-cima-gold/40 transition-all cursor-pointer">
                                        <Icon className="h-5 w-5 text-white/30 group-hover:text-cima-gold transition-colors" />
                                    </div>
                                ))}
                            </div>
                        </Wrapper>
                    </div>

                    {/* Image Center & Right (Complex Layout) */}
                    <div className="col-span-12 lg:col-span-7 grid grid-cols-2 gap-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="col-span-2 aspect-[16/9] rounded-[3.5rem] overflow-hidden border border-white/10 relative group shadow-[0_30px_100px_rgba(0,0,0,0.5)]"
                        >
                            <img src={photos[activePhoto]} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />

                            {/* DIGITAL TWIN IA SCANNER EFFECT */}
                            <motion.div
                                className="absolute inset-0 pointer-events-none"
                                animate={{ top: ["0%", "100%", "0%"] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                            >
                                <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-cima-gold/60 to-transparent shadow-[0_0_20px_rgba(200,169,110,0.8)]" />
                            </motion.div>

                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

                            <div className="absolute bottom-10 left-10 flex gap-4">
                                {photos.map((_: any, i: number) => (
                                    <button
                                        key={i}
                                        onClick={() => setActivePhoto(i)}
                                        className={`h-1.5 rounded-full transition-all duration-500 ${activePhoto === i ? "w-12 bg-cima-gold" : "w-3 bg-white/20 hover:bg-white/40"}`}
                                    />
                                ))}
                            </div>

                            <div className="absolute top-10 right-10 flex flex-col items-end gap-3">
                                <div className="h-12 w-12 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white shadow-2xl group/btn hover:border-cima-gold transition-all">
                                    <Sparkles className="h-5 w-5 text-cima-gold animate-pulse" />
                                </div>
                                <div className="bg-black/60 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-cima-gold animate-ping" />
                                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/80">Digital Twin Activo</span>
                                </div>
                            </div>
                        </motion.div>

                        <div className="col-span-1 aspect-square rounded-[2rem] overflow-hidden border border-white/5 relative group">
                            <img src={photos[1]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all" />
                        </div>
                        <div className="col-span-1 bg-cima-gold/[0.03] border border-cima-gold/10 rounded-[2rem] p-8 flex flex-col justify-between">
                            <UsersIcon className="h-8 w-8 text-cima-gold/20" />
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-cima-gold mb-2">Social Proof IA</h3>
                                <p className="text-xs font-bold leading-relaxed text-white/80">9 personas han solicitado información en las últimas 48 horas.</p>
                            </div>
                            <button onClick={handleTriggerLead} className="text-cima-gold text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:text-white transition-colors">
                                Ver Disponibilidad <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Chat (Handled by ChatWidget at bottom) */}
            <ChatWidget onSendMessage={onSendMessage} messages={messages || []} />
            <SocialProofToast tier={plan.tier} isDND={isDND} />
        </div>
    );
}

/**
 * Main Demo Component
 */

/**
 * Main Demo Component
 */
export default function DemoLandingExample({
    plan, property, onLeadCapture, onSendMessage, messages,
    isMobilePreview = false, setIsMobilePreview,
    isDND = false, setIsDND, isDarkMode = true, setIsDarkMode
}: any) {
    const f = plan.features.landing;
    const isTeam = plan.tier === "premium";
    const isPro = plan.tier === "profesional";
    const isStarter = plan.tier === "basico";

    const accentText = isTeam ? "text-cima-gold" : isPro ? "text-blue-400" : "text-gray-400";
    const accentBg = isTeam ? "bg-cima-gold" : isPro ? "bg-blue-400" : "bg-gray-400";
    const accentBorder = isTeam ? "border-cima-gold/20" : isPro ? "border-blue-400/20" : "border-gray-400/20";

    const [activePhoto, setActivePhoto] = useState(0);
    const photos = ["/cocina-despues.png", "/estancia-despues.png", "/recamara-despues.png", "/cocina-despues.png"];

    const [propertyValue, setPropertyValue] = useState(8500000);
    const commissionTraditional = propertyValue * 0.05;
    const commissionCima = propertyValue * 0.03;
    const savings = commissionTraditional - commissionCima;

    const handleTriggerLead = () => {
        if (onLeadCapture) {
            onLeadCapture({
                name: "Lead de Prueba (Demo)",
                phone: "81 0000 " + Math.floor(1000 + Math.random() * 9000),
                property: "Residencia Premium — " + plan.name
            });
        }
    };

    const Wrapper = f.animations ? motion.div : "div";
    const anim = f.animations ? { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } } : {};
    const delayAnim = (d: number) => f.animations ? { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 }, transition: { delay: d } } : {};

    const contentProps = {
        isTeam, isPro, isStarter, f, accentText, accentBg, accentBorder,
        activePhoto, setActivePhoto, photos, handleTriggerLead,
        propertyValue, setPropertyValue, commissionTraditional, commissionCima,
        savings, Wrapper, anim, delayAnim, onSendMessage, messages, isDND, plan, property
    };

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-white flex flex-col items-center">
            {setIsMobilePreview && setIsDND && (
                <div className="w-full max-w-6xl px-6 py-4 flex justify-end gap-2 border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-[120]">
                    <button
                        onClick={() => setIsMobilePreview(!isMobilePreview)}
                        className={`p-2.5 border rounded-xl transition-all flex items-center gap-2 group ${isMobilePreview ? "bg-cima-gold border-cima-gold text-black shadow-lg shadow-cima-gold/20" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white"}`}
                    >
                        {isMobilePreview ? <Monitor className="h-3.5 w-3.5" /> : <Smartphone className="h-3.5 w-3.5" />}
                        <span className="text-[8px] font-black uppercase tracking-widest">
                            {isMobilePreview ? "Escritorio" : "Móvil"}
                        </span>
                    </button>
                    <button
                        onClick={() => setIsDND(!isDND)}
                        className={`p-2.5 border rounded-xl transition-all flex items-center gap-2 group ${isDND ? "bg-cima-gold border-cima-gold text-black shadow-lg shadow-cima-gold/20" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white"}`}
                    >
                        {isDND ? <MoonStar className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
                        <span className="text-[8px] font-black uppercase tracking-widest">
                            {isDND ? "Silencio" : "Notificar"}
                        </span>
                    </button>
                </div>
            )}

            {isMobilePreview ? (
                <div className="py-10">
                    <MobileFrame isDarkMode={isDarkMode}>
                        <LandingContent {...contentProps} />
                    </MobileFrame>
                </div>
            ) : (
                <LandingContent {...contentProps} />
            )}
        </div>
    );
}

/**
 * Interactive Chat Widget
 */
function ChatWidget({ onSendMessage, messages }: { onSendMessage?: (f: string, t: string, ai?: boolean) => void; messages: LiveMessage[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = () => {
        if (!inputValue.trim() || !onSendMessage) return;
        onSendMessage("Interesado (Tú)", inputValue);
        setInputValue("");
    };

    return (
        <div className="fixed bottom-6 right-6 z-[110]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="absolute bottom-20 right-0 w-80 bg-black border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                    >
                        <div className="p-4 bg-cima-gold flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-black/20 flex items-center justify-center">
                                    <Sparkles className="h-4 w-4 text-black" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-black uppercase tracking-tighter">Asistente Cima AI</p>
                                    <div className="flex items-center gap-1">
                                        <div className="h-1.5 w-1.5 rounded-full bg-black/60 animate-pulse" />
                                        <span className="text-[7px] text-black/60 font-bold uppercase">En línea ahora</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-black/40 hover:text-black p-1">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <div ref={scrollRef} className="h-72 overflow-y-auto p-4 space-y-3 bg-white/[0.02] flex flex-col">
                            {messages.map((msg, i) => (
                                <motion.div key={msg.id || i} className={`flex ${msg.from.includes("Tú") ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-[10px] ${msg.from.includes("Tú") ? "bg-cima-gold text-black font-medium" : "bg-white/5 text-white/80 border border-white/10"}`}>
                                        <p className="leading-relaxed">{msg.message}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        <div className="p-4 border-t border-white/5 bg-black">
                            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-2 pl-4">
                                <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} placeholder="Escribe tu duda..." className="flex-1 bg-transparent border-none outline-none text-[10px] text-white" />
                                <button onClick={handleSend} className="h-8 w-8 rounded-xl bg-cima-gold flex items-center justify-center text-black">
                                    <Send className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <button onClick={() => setIsOpen(!isOpen)} className="h-14 w-14 rounded-2xl flex items-center justify-center bg-cima-gold text-black shadow-2xl transition-all">
                {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
            </button>
        </div>
    );
}
