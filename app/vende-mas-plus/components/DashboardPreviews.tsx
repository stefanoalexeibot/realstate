'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Smartphone, Layout, Users, PieChart, Bell, Settings, Search, MoreHorizontal, User, Key, Eye, TrendingUp, Sparkles, MessageSquare } from 'lucide-react';

const WindowFrame = ({ children, title }: { children: React.ReactNode, title: string }) => (
    <div className="relative rounded-2xl md:rounded-3xl border border-white/10 bg-[#0A0A0B] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Toolbar */}
        <div className="h-10 md:h-12 bg-white/[0.03] border-b border-white/5 flex items-center px-4 md:px-6 justify-between">
            <div className="flex gap-1.5 md:gap-2">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500/20 border border-red-500/40" />
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500/20 border border-green-500/40" />
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 px-4 py-1 rounded-lg bg-white/5 border border-white/5 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cima-gold animate-pulse" />
                <span className="text-[8px] md:text-[9px] font-mono text-white/30 uppercase tracking-widest">{title}</span>
            </div>
            <div className="w-16" />
        </div>
        {children}
    </div>
);

const AdminMockup = () => (
    <div className="flex h-[400px] md:h-[600px] bg-black">
        {/* Sidebar */}
        <div className="w-16 md:w-20 border-r border-white/5 flex flex-col items-center py-6 gap-6 shrink-0">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-cima-gold/10 border border-cima-gold/20 flex items-center justify-center">
                <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-cima-gold" />
            </div>
            <div className="flex flex-col gap-4 mt-4">
                {[Layout, Users, Key, PieChart, Settings].map((Icon, i) => (
                    <div key={i} className={`p-2.5 md:p-3 rounded-xl ${i === 0 ? 'bg-cima-gold text-black' : 'text-white/20 hover:bg-white/5'}`}>
                        <Icon className="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                ))}
            </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 md:p-10 overflow-hidden">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h4 className="text-xl md:text-2xl font-black text-white tracking-tight mb-2">Command Center</h4>
                    <p className="text-[10px] md:text-xs text-white/30 uppercase tracking-widest font-bold">Resumen de Operaciones · 12 Mar 2025</p>
                </div>
                <div className="flex gap-3">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40">
                        <Search className="h-4 w-4" />
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40">
                        <Bell className="h-4 w-4" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Leads Activos', val: '124', change: '+12%', icon: Users },
                    { label: 'Visitas Pendientes', val: '08', change: 'En curso', icon: Eye },
                    { label: 'ROI Estimado (12m)', val: '$4.2M', change: '+8.4%', icon: TrendingUp }
                ].map((stat, i) => (
                    <div key={i} className="p-5 md:p-6 rounded-2xl md:rounded-3xl bg-white/[0.03] border border-white/10">
                        <div className="flex justify-between items-start mb-4">
                            <stat.icon className="h-5 w-5 md:h-6 md:w-6 text-cima-gold/50" />
                            <span className="text-[8px] md:text-[9px] font-mono text-cima-gold font-bold uppercase py-0.5 px-2 bg-cima-gold/10 rounded-full">{stat.change}</span>
                        </div>
                        <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                        <p className="text-2xl md:text-3xl font-black text-white">{stat.val}</p>
                    </div>
                ))}
            </div>

            <div className="mt-8 p-6 md:p-8 rounded-3xl bg-gradient-to-br from-cima-gold/5 to-transparent border border-white/10">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-cima-gold/10 rounded-2xl">
                        <Layout className="h-5 w-5 text-cima-gold" />
                    </div>
                    <p className="font-bold text-white text-sm md:text-base">Gestión de Inventario Premium</p>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/5 overflow-hidden border border-white/10">
                                    <div className="w-full h-full bg-gradient-to-br from-white/10 to-white/5" />
                                </div>
                                <div>
                                    <p className="text-[11px] md:text-xs font-bold text-white">Residencia Lomas del Sol 0{i}</p>
                                    <p className="text-[9px] text-white/30 uppercase tracking-widest font-mono">MLS: 48{i}92</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                <span className="text-[8px] font-bold text-green-500/60 uppercase tracking-widest">Activo</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const OwnerMockup = () => (
    <div className="flex h-[400px] md:h-[600px] bg-[#020308] justify-center items-center relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute inset-0 opacity-50" style={{ background: 'radial-gradient(ellipse at center, rgba(200,169,110,0.08) 0%, transparent 70%)' }} />

        {/* Phone Mockup (Floating) */}
        <div className="relative w-[280px] md:w-[320px] h-[520px] md:h-[580px] bg-black rounded-[45px] md:rounded-[55px] border-[8px] md:border-[10px] border-[#1A1B1E] shadow-2xl overflow-hidden z-20">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#1A1B1E] rounded-b-[20px] z-30" />

            <div className="h-full flex flex-col">
                <div className="p-6 md:p-8 pt-12 md:pt-14 bg-gradient-to-b from-white/5 to-transparent">
                    <p className="text-[10px] font-bold text-cima-gold uppercase tracking-[0.2em] mb-2">Tu Propiedad</p>
                    <h5 className="text-xl font-black text-white leading-tight">Casa Contemporánea San Pedro</h5>
                    <div className="mt-4 flex items-center gap-3">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-black bg-white/10" />)}
                        </div>
                        <span className="text-[9px] text-white/40 uppercase tracking-widest font-bold">14 Prospectos Calificados</span>
                    </div>
                </div>

                <div className="flex-1 p-6 md:p-8 space-y-6">
                    <div>
                        <div className="flex justify-between items-end mb-3">
                            <p className="text-[11px] font-bold text-white">Ventas en Progreso</p>
                            <span className="text-[10px] text-cima-gold font-mono">75%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: '75%' }} transition={{ duration: 1.5, delay: 0.5 }} className="h-full bg-cima-gold" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {[
                            { step: 'Onboarding Completado', sub: 'Ayer, 09:40 AM', done: true },
                            { step: 'Sesión Fotográfica 4K', sub: 'Hoy, 14:15 PM', done: true },
                            { step: 'Lanzamiento a Portales', sub: 'Programado: Mañana', done: false }
                        ].map((item, i) => (
                            <div key={i} className={`flex items-start gap-4 p-4 rounded-2xl border ${item.done ? 'bg-cima-gold/5 border-cima-gold/20' : 'bg-transparent border-white/5 opacity-40'}`}>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${item.done ? 'bg-cima-gold text-black' : 'bg-white/5 border border-white/10 text-white/20'}`}>
                                    <Key className="h-3 w-3" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold text-white leading-none mb-1">{item.step}</p>
                                    <p className="text-[9px] text-white/30 tracking-wide uppercase">{item.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/5">
                        <div className="flex items-center gap-3 mb-4">
                            <MessageSquare className="h-4 w-4 text-cima-gold" />
                            <p className="text-[10px] font-bold text-white uppercase tracking-widest">Último Feedback</p>
                        </div>
                        <p className="text-[11px] text-white/60 leading-relaxed italic">"El comprador amó la doble altura, pero solicitó una segunda visita para confirmar acabados de cocina."</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Floating elements behind phone */}
        <div className="absolute top-1/4 -right-10 md:right-10 w-48 h-32 bg-cima-card border border-cima-gold/20 rounded-[40px] p-6 shadow-2xl z-10 backdrop-blur-xl hidden md:block">
            <TrendingUp className="h-6 w-6 text-cima-gold mb-3" />
            <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">Índice de Interés</p>
            <p className="text-xl font-black text-white">+84%</p>
        </div>
    </div>
);

export const DashboardPreviews = () => {
    const [view, setView] = useState<'admin' | 'owner'>('admin');

    return (
        <section className="py-24 md:py-40 px-4 relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 md:mb-24">
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="flex justify-center gap-4 mb-10">
                        <button
                            onClick={() => setView('admin')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-[10px] md:text-sm uppercase tracking-widest transition-all ${view === 'admin' ? 'bg-cima-gold text-black' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                        >
                            <Monitor className="h-4 w-4" /> Agent Command Center
                        </button>
                        <button
                            onClick={() => setView('owner')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-[10px] md:text-sm uppercase tracking-widest transition-all ${view === 'owner' ? 'bg-cima-gold text-black' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                        >
                            <Smartphone className="h-4 w-4" /> Portal del Propietario
                        </button>
                    </motion.div>

                    <h2 className="text-3xl md:text-7xl font-black text-white tracking-tighter mb-8 max-w-4xl mx-auto">
                        Más que un servicio, <br />
                        <span className="text-cima-gold">es tu mejor activo.</span>
                    </h2>
                    <p className="text-white/40 max-w-xl mx-auto text-sm md:text-lg">
                        Clarity check: Tú controlas todo desde el Command Center, tu cliente recibe transparencia extrema en su móvil.
                    </p>
                </div>

                <div className="relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={view}
                            initial={{ opacity: 0, y: 40, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -40, scale: 0.95 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <WindowFrame title={view === 'admin' ? 'AURUM - ADVISOR OS V4.0' : 'AURUM - OWNER PORTAL'}>
                                {view === 'admin' ? <AdminMockup /> : <OwnerMockup />}
                            </WindowFrame>
                        </motion.div>
                    </AnimatePresence>

                    {/* Captions */}
                    <motion.p className="text-center text-[9px] md:text-[10px] font-mono text-white/20 uppercase tracking-[0.3em] mt-10 md:mt-16">
                        {view === 'admin'
                            ? 'Software real desarrollado para CBH Aurum · UX/UI Propietaria'
                            : 'Acceso seguro vía link dinámico · Sin apps pesadas para el cliente'}
                    </motion.p>
                </div>
            </div>
        </section>
    );
};
