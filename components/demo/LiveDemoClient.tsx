"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout, Home, ChevronRight, Monitor, Maximize2, Eye } from "lucide-react";
import DemoAdmin from "@/components/demo/DemoAdmin";
import DemoPortal from "@/components/demo/DemoPortal";
import { DEMO_PLANS } from "@/lib/config/demo-plans";

type View = "admin" | "portal";

export default function LiveDemoClient() {
    const [view, setView] = useState<View>("admin");
    const [isFullscreen, setIsFullscreen] = useState(false);
    const plan = DEMO_PLANS.premium; // Always show full-featured Premium

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#0A0A0B]">
            {/* ── Presenter Toolbar ─────────────────────── */}
            <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2.5">
                    {/* Logo / Title */}
                    <div className="flex items-center gap-3">
                        <div className="h-7 w-7 rounded-lg bg-cima-gold flex items-center justify-center shadow-lg shadow-cima-gold/20">
                            <Monitor className="h-3.5 w-3.5 text-black" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-wider text-white">
                                Demo en Vivo
                            </span>
                            <span className="text-[8px] font-mono text-cima-gold uppercase tracking-widest">
                                Paquete {plan.name}
                            </span>
                        </div>
                    </div>

                    {/* View Toggle */}
                    <div className="flex items-center gap-1 bg-white/[0.05] p-1 rounded-xl border border-white/10">
                        <button
                            onClick={() => setView("admin")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all ${view === "admin"
                                ? "bg-cima-gold text-black shadow-lg shadow-cima-gold/20"
                                : "text-white/40 hover:text-white/60 hover:bg-white/5"
                                }`}
                        >
                            <Layout className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Panel del Asesor</span>
                            <span className="sm:hidden">Asesor</span>
                        </button>
                        <div className="flex items-center px-1">
                            <ChevronRight className="h-3 w-3 text-white/10" />
                        </div>
                        <button
                            onClick={() => setView("portal")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all ${view === "portal"
                                ? "bg-cima-gold text-black shadow-lg shadow-cima-gold/20"
                                : "text-white/40 hover:text-white/60 hover:bg-white/5"
                                }`}
                        >
                            <Home className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Portal del Propietario</span>
                            <span className="sm:hidden">Propietario</span>
                        </button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {/* Presenter hint */}
                        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
                            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[8px] font-bold text-green-400 uppercase tracking-widest">
                                En Vivo
                            </span>
                        </div>

                        {/* Fullscreen toggle */}
                        <button
                            onClick={toggleFullscreen}
                            className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all"
                            title="Pantalla completa"
                        >
                            <Maximize2 className="h-3.5 w-3.5 text-white/40" />
                        </button>
                    </div>
                </div>

                {/* Context bar — tells the viewer what they're seeing */}
                <div className="border-t border-white/5 px-4 py-1.5 flex items-center gap-2">
                    <Eye className="h-3 w-3 text-white/20" />
                    <p className="text-[9px] text-white/30">
                        {view === "admin"
                            ? "👨‍💼 Esto es lo que VE EL ASESOR — gestión de propiedades, leads, visitas y analíticos"
                            : "🏠 Esto es lo que VE EL PROPIETARIO — transparencia total sobre el progreso de venta"
                        }
                    </p>
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
                >
                    {view === "admin"
                        ? <DemoAdmin plan={plan} />
                        : <DemoPortal plan={plan} />
                    }
                </motion.div>
            </AnimatePresence>

            {/* ── Bottom CTA bar (floating) ──────────── */}
            <div className="fixed bottom-0 inset-x-0 z-50 bg-gradient-to-t from-black via-black/90 to-transparent pt-8 pb-4 px-4 pointer-events-none">
                <div className="max-w-lg mx-auto flex items-center gap-3 pointer-events-auto">
                    <a
                        href={`https://wa.me/${process.env.NEXT_PUBLIC_CIMA_WA || "528100000000"}?text=${encodeURIComponent("Hola, vi el demo en vivo y me interesa activar mi cuenta.")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 bg-cima-gold text-black px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-white transition-all shadow-lg shadow-cima-gold/20"
                    >
                        Activar mi cuenta
                    </a>
                    <a
                        href="/vende-mas"
                        target="_blank"
                        className="flex items-center gap-2 border border-white/10 bg-white/5 text-white/60 px-5 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-white/10 hover:text-white transition-all"
                    >
                        Ver planes
                        <ChevronRight className="h-3.5 w-3.5" />
                    </a>
                </div>
            </div>
        </div>
    );
}
