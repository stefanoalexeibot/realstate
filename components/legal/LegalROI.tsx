"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Clock,
    TrendingDown,
    Users,
    FileText,
    Zap,
    ArrowRight,
    Scale,
    TrendingUp
} from "lucide-react";

export default function LegalROI() {
    const [hoursPerCase, setHoursPerCase] = useState(12);
    const [monthlyCases, setMonthlyCases] = useState(15);
    const [hourlyRate, setHourlyRate] = useState(2500);
    const [showComparison, setShowComparison] = useState(false);

    const timeSpent = hoursPerCase * monthlyCases;
    const timeSaved = Math.round(timeSpent * 0.65); // 65% efficiency gain
    const moneyLost = timeSpent * hourlyRate;
    const moneySaved = timeSaved * hourlyRate;

    return (
        <section className="py-24 md:py-40 relative overflow-hidden bg-[#020617]">
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-indigo-600/5 blur-[100px] rounded-full" />

            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
                    <div>
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-blue-500/5 border border-blue-500/20 mb-8">
                            <Zap className="w-3.5 h-3.5 text-blue-400" />
                            <span className="font-mono text-[10px] text-blue-400 font-black tracking-[0.2em] uppercase">Calculador de Impacto v2.0</span>
                        </div>

                        <h2 className="text-4xl md:text-7xl font-heading font-black text-white mb-8 tracking-tighter leading-[0.95]">
                            El Costo de la <br />
                            <span className="text-slate-500 italic">Invisibilidad</span>
                        </h2>

                        <p className="text-slate-400 text-lg mb-12 leading-relaxed max-w-md font-medium">
                            Las firmas tradicionales pierden hasta el 65% de su tiempo en tareas de bajo valor. <strong className="text-white">Cima Legal</strong> automatiza el flujo para recuperar ese capital.
                        </p>

                        <div className="space-y-10">
                            {[
                                { label: "Horas de gestión por caso (Personal)", val: hoursPerCase, min: 1, max: 40, set: setHoursPerCase, unit: "hrs" },
                                { label: "Casos proyectados al mes", val: monthlyCases, min: 1, max: 100, set: setMonthlyCases, unit: "unidades" },
                                { label: "Tarifa horaria promedio (MXN)", val: hourlyRate, min: 500, max: 10000, step: 500, set: setHourlyRate, unit: "$" },
                            ].map((input, i) => (
                                <div key={i} className="group">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{input.label}</span>
                                        <div className="px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                            <span className="text-blue-400 font-mono text-xs font-black">{input.unit === "$" ? `$${input.val.toLocaleString()}` : `${input.val} ${input.unit}`}</span>
                                        </div>
                                    </div>
                                    <input
                                        type="range"
                                        min={input.min}
                                        max={input.max}
                                        step={input.step || 1}
                                        value={input.val}
                                        onChange={(e) => input.set(Number(e.target.value))}
                                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        {/* Comparison Toggle */}
                        <div className="flex justify-center mb-8">
                            <div className="p-1 rounded-2xl bg-white/5 border border-white/10 flex gap-1 backdrop-blur-3xl">
                                <button
                                    onClick={() => setShowComparison(false)}
                                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!showComparison ? "bg-blue-600 text-white shadow-lg" : "text-slate-500 hover:text-white"}`}
                                >
                                    Impacto Directo
                                </button>
                                <button
                                    onClick={() => setShowComparison(true)}
                                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${showComparison ? "bg-blue-600 text-white shadow-lg" : "text-slate-500 hover:text-white"}`}
                                >
                                    VS Tradicional
                                </button>
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            {!showComparison ? (
                                <motion.div
                                    key="direct"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="p-12 rounded-[48px] bg-gradient-to-br from-blue-600 to-indigo-900 border border-white/20 shadow-[0_40px_100px_-20px_rgba(37,99,235,0.4)] overflow-hidden relative group"
                                >
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-all duration-700" />

                                    <div className="relative z-10">
                                        <div className="flex items-center gap-4 mb-10">
                                            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20">
                                                <TrendingUp className="w-7 h-7 text-white" />
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-black text-blue-100 uppercase tracking-widest block mb-1">Recuperación Mensual</span>
                                                <span className="text-[9px] font-bold text-green-300 uppercase tracking-tighter bg-green-400/20 px-2 py-0.5 rounded-full">+65% Eficiencia</span>
                                            </div>
                                        </div>

                                        <div className="mb-10">
                                            <span className="text-6xl md:text-8xl font-heading font-black text-white tracking-tighter block mb-4">
                                                ${moneySaved.toLocaleString()}
                                            </span>
                                            <p className="text-blue-100/60 text-lg font-medium">Equivalente a <strong className="text-white">{timeSaved} horas</strong> facturables recuperadas cada mes.</p>
                                        </div>

                                        <div className="pt-8 border-t border-white/10">
                                            <div className="flex items-center justify-between group/cta cursor-pointer">
                                                <span className="text-[11px] font-black text-white uppercase tracking-widest">Activar Infraestructura</span>
                                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover/cta:bg-white/20 transition-all">
                                                    <ArrowRight className="w-5 h-5 text-white" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="comparison"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="grid grid-cols-1 gap-6"
                                >
                                    <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/10 backdrop-blur-3xl">
                                        <div className="flex items-center justify-between mb-6">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sin Cima Legal</span>
                                            <TrendingDown className="w-5 h-5 text-red-400/50" />
                                        </div>
                                        <div className="flex items-end gap-3 mb-2">
                                            <span className="text-4xl font-black text-white">${moneyLost.toLocaleString()}</span>
                                            <span className="text-xs text-slate-500 mb-1">Lost Opportunity</span>
                                        </div>
                                        <p className="text-sm text-slate-500 italic">"Fuga de capital por procesos manuales y reporteo reactivo."</p>
                                    </div>

                                    <div className="p-8 rounded-[32px] bg-blue-600/10 border border-blue-500/30 backdrop-blur-3xl relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors" />
                                        <div className="relative z-10">
                                            <div className="flex items-center justify-between mb-6">
                                                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Con Cima Legal Node</span>
                                                <TrendingUp className="w-5 h-5 text-blue-400" />
                                            </div>
                                            <div className="flex items-end gap-3 mb-2">
                                                <span className="text-4xl font-black text-white">$0</span>
                                                <span className="text-xs text-blue-400 mb-1">Impacto de Fuga</span>
                                            </div>
                                            <p className="text-sm text-blue-100/70 font-medium">Automatización total del monitoreo y transparencia proactiva.</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}
