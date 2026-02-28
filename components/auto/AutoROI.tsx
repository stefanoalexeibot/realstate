"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    TrendingUp,
    DollarSign,
    ArrowRight,
    AlertCircle,
    CheckCircle2,
    Gauge,
    Wallet,
    ArrowUpRight
} from "lucide-react";

const AutoROI = () => {
    const [carValue, setCarValue] = useState(450000);
    const [isComparison, setIsComparison] = useState(true);

    const agencyPrice = carValue * 0.8;
    const cimaPrice = carValue * 0.96;
    const profitDifference = cimaPrice - agencyPrice;

    return (
        <section className="relative py-24 sm:py-32 overflow-hidden bg-[#020617]">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="bg-white/[0.03] border border-white/10 rounded-[3rem] p-8 sm:p-12 backdrop-blur-3xl shadow-2xl relative overflow-hidden group"
                >
                    {/* Background Light Pulse */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-blue-500/10 transition-colors duration-1000" />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Left: Content & Inputs */}
                        <div>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium mb-6"
                            >
                                <TrendingUp className="w-4 h-4" />
                                <span>MAXIMIZA TU UTILIDAD</span>
                            </motion.div>

                            <h2 className="text-4xl sm:text-6xl font-black text-white mb-8 tracking-tight leading-[1.1]">
                                Deja de <span className="text-red-500">regalar</span> tu inversión.
                            </h2>

                            <p className="text-gray-400 text-lg mb-12 leading-relaxed">
                                Las agencias compran barato para revender caro. Con Cima Auto, accedes al precio real del mercado eliminando intermediarios costosos.
                            </p>

                            <div className="space-y-8 bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-xl">
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="text-gray-300 font-medium">Valor del Auto (Libre)</label>
                                        <span className="text-3xl font-black text-blue-400 tabular-nums">
                                            ${carValue.toLocaleString()}
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="100000"
                                        max="2000000"
                                        step="10000"
                                        value={carValue}
                                        onChange={(e) => setCarValue(parseInt(e.target.value))}
                                        className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setIsComparison(true)}
                                        className={`flex-1 py-4 rounded-2xl font-black text-xs tracking-widest uppercase transition-all ${isComparison ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30' : 'bg-white/5 text-gray-500 border border-white/10'}`}
                                    >
                                        VS AGENCIA
                                    </button>
                                    <button
                                        onClick={() => setIsComparison(false)}
                                        className={`flex-1 py-4 rounded-2xl font-black text-xs tracking-widest uppercase transition-all ${!isComparison ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30' : 'bg-white/5 text-gray-500 border border-white/10'}`}
                                    >
                                        MÉTRICAS
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right: Visualization */}
                        <div className="w-full">
                            <div className="relative p-8 sm:p-12 rounded-[2.5rem] bg-black/40 border border-white/5 shadow-inner overflow-hidden min-h-[450px] flex flex-col justify-center">
                                <AnimatePresence mode="wait">
                                    {isComparison ? (
                                        <motion.div
                                            key="vs-mode"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="space-y-12"
                                        >
                                            {/* Agency Bar */}
                                            <div className="space-y-3">
                                                <div className="flex justify-between text-[10px] font-mono tracking-[0.2em] text-gray-500 uppercase">
                                                    <span>Toma en Agencia</span>
                                                    <span className="text-red-500">-${(carValue - agencyPrice).toLocaleString()} LEAKAGE</span>
                                                </div>
                                                <div className="h-16 w-full bg-white/5 rounded-2xl border border-white/5 p-1 relative overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: "80%" }}
                                                        className="h-full bg-red-500/20 rounded-xl border border-red-500/30 flex items-center px-4"
                                                    >
                                                        <span className="text-red-400 font-bold font-mono text-sm">${agencyPrice.toLocaleString()}</span>
                                                    </motion.div>
                                                </div>
                                            </div>

                                            {/* Divider */}
                                            <div className="flex items-center gap-4 text-gray-800">
                                                <div className="h-px flex-1 bg-current" />
                                                <Wallet className="w-5 h-5 opacity-40" />
                                                <div className="h-px flex-1 bg-current" />
                                            </div>

                                            {/* Cima Bar */}
                                            <div className="space-y-3">
                                                <div className="flex justify-between text-[10px] font-mono tracking-[0.2em] text-blue-400 uppercase">
                                                    <span>Cima Auto Elite</span>
                                                    <span className="text-green-400 font-bold">RECUO TOTAL</span>
                                                </div>
                                                <div className="h-16 w-full bg-blue-500/5 rounded-2xl border border-blue-500/20 p-1 relative overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: "96%" }}
                                                        className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl flex items-center px-4 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                                                    >
                                                        <span className="text-white font-bold font-mono text-sm">${cimaPrice.toLocaleString()}</span>
                                                    </motion.div>
                                                </div>
                                            </div>

                                            {/* Profit Differential */}
                                            <motion.div
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                className="bg-green-500/10 border border-green-500/20 p-6 rounded-2xl flex items-center justify-between"
                                            >
                                                <div>
                                                    <p className="text-[10px] text-green-500 font-bold uppercase tracking-[0.2em] mb-1">Diferencial Cima</p>
                                                    <h3 className="text-3xl font-black text-white tabular-nums">${profitDifference.toLocaleString()}</h3>
                                                </div>
                                                <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center shadow-xl shadow-green-500/40">
                                                    <ArrowUpRight className="w-7 h-7 text-white" />
                                                </div>
                                            </motion.div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="metrics-mode"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="space-y-8"
                                        >
                                            <div className="grid grid-cols-2 gap-4">
                                                {[
                                                    { label: "Comisión Cima", val: "4%", sub: "Fija y Transparente" },
                                                    { label: "Tiempo Venta", val: "14 Días", sub: "Promedio Elite" },
                                                    { label: "Ofertas Prom.", val: "5.2", sub: "Por Vehículo" },
                                                    { label: "Seguridad", val: "100%", sub: "Blindaje Legal" }
                                                ].map((stat, i) => (
                                                    <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                                                        <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mb-2">{stat.label}</p>
                                                        <p className="text-2xl font-black text-white mb-1">{stat.val}</p>
                                                        <p className="text-[10px] text-blue-400">{stat.sub}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default AutoROI;
