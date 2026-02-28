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

    const agencyPrice = carValue * 0.8; // Agencia suele tomar al 80% o menos
    const cimaPrice = carValue * 0.96; // Cima cobra comisión baja, vendedor se lleva más
    const profitDifference = cimaPrice - agencyPrice;

    return (
        <section className="relative py-24 sm:py-32 overflow-hidden bg-[#020617]">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    {/* Left: Content & Inputs */}
                    <div className="lg:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium mb-6"
                        >
                            <TrendingUp className="w-4 h-4" />
                            <span>MAXIMIZA TU UTILIDAD</span>
                        </motion.div>

                        <h2 className="text-4xl sm:text-6xl font-bold text-white mb-8 tracking-tight">
                            Deja de <span className="text-red-500">regalar</span> tu inversión a las agencias.
                        </h2>

                        <p className="text-gray-400 text-lg mb-12">
                            Las agencias compran barato para revender caro. Con Cima Auto, accedes al precio real del mercado eliminando intermediarios costosos.
                        </p>

                        <div className="space-y-8 bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-xl">
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <label className="text-gray-300 font-medium">Valor Estimado del Auto (Libre)</label>
                                    <span className="text-2xl font-bold text-blue-400">
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
                                <div className="flex justify-between mt-2 text-[10px] text-gray-500 font-mono tracking-widest">
                                    <span>$100K</span>
                                    <span>$2M</span>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setIsComparison(true)}
                                    className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${isComparison ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 text-gray-400 border border-white/10'}`}
                                >
                                    VS AGENCIA
                                </button>
                                <button
                                    onClick={() => setIsComparison(false)}
                                    className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${!isComparison ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 text-gray-400 border border-white/10'}`}
                                >
                                    DIRECTO
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Visualization */}
                    <div className="lg:w-1/2 w-full">
                        <div className="relative p-8 sm:p-12 rounded-[2.5rem] bg-gradient-to-br from-gray-900 to-black border border-gray-800 shadow-2xl overflow-hidden">
                            {/* Comparison Animation */}
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
                                            <div className="flex justify-between text-sm font-mono tracking-wider">
                                                <span className="text-gray-500 italic">TOMA EN AGENCIA (EST.)</span>
                                                <span className="text-red-400">-${(carValue - agencyPrice).toLocaleString()} LEAKAGE</span>
                                            </div>
                                            <div className="h-14 w-full bg-gray-800/30 rounded-2xl overflow-hidden border border-gray-800 p-1">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: "80%" }}
                                                    className="h-full bg-red-500/20 rounded-xl border border-red-500/30 flex items-center px-4"
                                                >
                                                    <span className="text-red-400 font-bold font-mono">${agencyPrice.toLocaleString()}</span>
                                                </motion.div>
                                            </div>
                                        </div>

                                        {/* Divider with Icon */}
                                        <div className="flex items-center gap-4 text-gray-700">
                                            <div className="h-px flex-1 bg-current opacity-20" />
                                            <Wallet className="w-5 h-5 opacity-40" />
                                            <div className="h-px flex-1 bg-current opacity-20" />
                                        </div>

                                        {/* Cima Bar */}
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm font-mono tracking-wider">
                                                <span className="text-blue-400 font-bold">MODELO CIMA AUTO</span>
                                                <span className="text-green-400 font-bold group-hover:animate-pulse">RECUO TOTAL</span>
                                            </div>
                                            <div className="h-14 w-full bg-blue-500/5 rounded-2xl overflow-hidden border border-blue-500/20 p-1">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: "96%" }}
                                                    className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl flex items-center px-4 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                                                >
                                                    <span className="text-white font-bold font-mono">${cimaPrice.toLocaleString()}</span>
                                                </motion.div>
                                            </div>
                                        </div>

                                        {/* Profit Box */}
                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            className="bg-green-500/10 border border-green-500/20 p-6 rounded-2xl flex items-center justify-between"
                                        >
                                            <div>
                                                <p className="text-[10px] text-green-500 font-bold uppercase tracking-[0.2em] mb-1">Diferencia Neta a tu Favor</p>
                                                <h3 className="text-3xl font-bold text-white">${profitDifference.toLocaleString()}</h3>
                                            </div>
                                            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
                                                <ArrowUpRight className="w-6 h-6 text-white" />
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="direct-mode"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="h-full flex flex-col justify-center items-center py-12 text-center"
                                    >
                                        <div className="w-24 h-24 rounded-full bg-blue-500/10 flex items-center justify-center mb-8 border border-blue-500/20">
                                            <Gauge className="w-12 h-12 text-blue-400" />
                                        </div>
                                        <h3 className="text-3xl font-bold text-white mb-4">Velocidad de Retorno</h3>
                                        <p className="text-gray-400 max-w-xs mb-8">
                                            El 85% de nuestros vehículos certificados se venden en menos de 14 días al precio deseado.
                                        </p>
                                        <div className="grid grid-cols-2 gap-4 w-full">
                                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Costo Cima</p>
                                                <p className="text-xl font-bold text-white">4%</p>
                                            </div>
                                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Costo Agencia</p>
                                                <p className="text-xl font-bold text-red-400">20%+</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Decorative Blobs */}
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full" />
                            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AutoROI;
