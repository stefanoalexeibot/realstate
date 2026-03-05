'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, DollarSign, Target, ArrowRight, Info } from 'lucide-react';

export const RoiCalculator = () => {
    const [propertyValue, setPropertyValue] = useState(3000000); // 3M MXN
    const [commission, setCommission] = useState(5); // 5%
    const [exclusivesMonth, setExclusivesMonth] = useState(1);

    const yearlyRevenueBase = (propertyValue * (commission / 100)) * exclusivesMonth * 12;
    const aurumLift = 0.42; // 42% increase from analysis
    const yearlyRevenueAurum = yearlyRevenueBase * (1 + aurumLift);
    const netGain = yearlyRevenueAurum - yearlyRevenueBase;

    const formatter = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        maximumFractionDigits: 0,
    });

    return (
        <section id="roi" className="py-24 md:py-40 px-4 bg-black relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-cima-gold/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6"
                        >
                            <Calculator className="h-3 w-3 text-cima-gold" />
                            <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-widest">Simulador de Impacto</span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-8 leading-[0.9]"
                        >
                            El costo de <br />
                            <span className="text-cima-gold">no transformarte.</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-white/40 text-lg md:text-xl leading-relaxed mb-10 max-w-lg"
                        >
                            Grou-style clarity check: Si sigues usando herramientas tradicionales, estás dejando el 42% de tus posibles exclusivas sobre la mesa.
                        </motion.p>

                        <div className="space-y-8 max-w-md">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/40">
                                    <span>Valor Promedio Propiedad</span>
                                    <span className="text-white font-mono">{formatter.format(propertyValue)}</span>
                                </div>
                                <input
                                    type="range" min="1000000" max="20000000" step="500000"
                                    value={propertyValue} onChange={(e) => setPropertyValue(Number(e.target.value))}
                                    className="w-full h-1 bg-white/10 rounded-full appearance-none accent-cima-gold cursor-pointer"
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/40">
                                    <span>Comisión Promedio (%)</span>
                                    <span className="text-white font-mono">{commission}%</span>
                                </div>
                                <input
                                    type="range" min="1" max="10" step="0.5"
                                    value={commission} onChange={(e) => setCommission(Number(e.target.value))}
                                    className="w-full h-1 bg-white/10 rounded-full appearance-none accent-cima-gold cursor-pointer"
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/40">
                                    <span>Exclusivas por Mes</span>
                                    <span className="text-white font-mono">{exclusivesMonth}</span>
                                </div>
                                <input
                                    type="range" min="1" max="10" step="1"
                                    value={exclusivesMonth} onChange={(e) => setExclusivesMonth(Number(e.target.value))}
                                    className="w-full h-1 bg-white/10 rounded-full appearance-none accent-cima-gold cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="bg-cima-card border border-cima-gold/30 rounded-[40px] p-8 md:p-12 shadow-2xl relative"
                    >
                        <div className="absolute -top-6 -right-6 flex flex-col items-center gap-2">
                            <div className="p-4 bg-cima-gold text-black rounded-3xl shadow-xl">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                            <span className="text-[10px] font-black uppercase text-cima-gold tracking-widest">+42% Power Lift</span>
                        </div>

                        <div className="mb-12">
                            <p className="text-[10px] md:text-xs font-bold text-white/20 uppercase tracking-[0.3em] mb-4">Potencial de Ingresos Anuales</p>
                            <p className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-2">{formatter.format(yearlyRevenueAurum)}</p>
                            <div className="flex items-center gap-2 text-green-500 text-sm font-bold">
                                <Target className="h-4 w-4" />
                                <span>Incremento Ganado con Aurum</span>
                            </div>
                        </div>

                        <div className="space-y-6 pt-10 border-t border-white/5">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">
                                        <DollarSign className="h-4 w-4 text-white/40" />
                                    </div>
                                    <span className="text-xs md:text-sm font-bold text-white/40">Ingreso Actual (Proyectado)</span>
                                </div>
                                <span className="text-sm font-mono text-white/30">{formatter.format(yearlyRevenueBase)}</span>
                            </div>
                            <div className="flex justify-between items-center p-6 rounded-2xl bg-cima-gold/5 border border-cima-gold/20">
                                <span className="text-xs md:text-sm font-black text-cima-gold uppercase tracking-widest">Utilidad Extra Anual</span>
                                <span className="text-xl md:text-2xl font-black text-white">{formatter.format(netGain)}</span>
                            </div>
                        </div>

                        <div className="mt-10">
                            <button className="w-full py-5 bg-cima-gold text-black font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-all">
                                Capturar este Potencial <ArrowRight className="h-5 w-5" />
                            </button>
                            <p className="text-center text-[8px] md:text-[9px] text-white/20 font-mono uppercase tracking-widest mt-6 flex items-center justify-center gap-2">
                                <Info className="h-3 w-3" /> Basado en incrementos promedio de conversión en CRM Inmobiliarios 2024
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
