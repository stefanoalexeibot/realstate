"use client";

import { useState } from "react";
import { TrendingUp, Calculator, Home, Paintbrush, DollarSign } from "lucide-react";

// Helper for currency formatting
function fmt(n: number) {
    return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        maximumFractionDigits: 0,
    }).format(n);
}

export default function FlippingCalculator() {
    const [purchasePrice, setPurchasePrice] = useState(2000000);
    const [renovationCost, setRenovationCost] = useState(500000);
    const [arv, setArv] = useState(3200000); // After Repair Value

    const totalInvestment = purchasePrice + renovationCost;
    const rawProfit = arv - totalInvestment;
    const roi = totalInvestment > 0 ? (rawProfit / totalInvestment) * 100 : 0;

    const getRoiColor = () => {
        if (roi >= 20) return "text-northpeak-green";
        if (roi >= 10) return "text-blue-400";
        return "text-cima-gold";
    };

    return (
        <div className="rounded-2xl border border-cima-gold/20 bg-cima-card p-6 sm:p-8 gold-glow max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 rounded-xl bg-cima-gold/10 border border-cima-gold/20 flex items-center justify-center">
                    <Calculator className="h-5 w-5 text-cima-gold" />
                </div>
                <div>
                    <h3 className="font-heading font-bold text-xl text-cima-text">Simulador de Flipping</h3>
                    <p className="text-xs text-cima-text-dim">Calcula el ROI potencial de tu próximo proyecto</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="space-y-6">
                    {/* Purchase Price */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-end">
                            <label className="text-xs font-mono uppercase tracking-widest text-cima-text-dim">Compra</label>
                            <span className="font-heading font-bold text-cima-text">{fmt(purchasePrice)}</span>
                        </div>
                        <input
                            type="range"
                            min={500000}
                            max={10000000}
                            step={50000}
                            value={purchasePrice}
                            onChange={(e) => setPurchasePrice(Number(e.target.value))}
                            className="w-full h-1.5 rounded-full appearance-none cursor-pointer np-slider"
                            style={{ background: `linear-gradient(to right, #C8A96E ${((purchasePrice - 500000) / 9500000) * 100}%, #23252F 0%)` }}
                        />
                    </div>

                    {/* Renovation Cost */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-end">
                            <label className="text-xs font-mono uppercase tracking-widest text-cima-text-dim">Remodelación</label>
                            <span className="font-heading font-bold text-cima-text">{fmt(renovationCost)}</span>
                        </div>
                        <input
                            type="range"
                            min={50000}
                            max={3000000}
                            step={25000}
                            value={renovationCost}
                            onChange={(e) => setRenovationCost(Number(e.target.value))}
                            className="w-full h-1.5 rounded-full appearance-none cursor-pointer np-slider"
                            style={{ background: `linear-gradient(to right, #C8A96E ${((renovationCost - 50000) / 2950000) * 100}%, #23252F 0%)` }}
                        />
                    </div>

                    {/* ARV (Target Sale Price) */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-end">
                            <label className="text-xs font-mono uppercase tracking-widest text-cima-text-dim">Precio de Venta (ARV)</label>
                            <span className="font-heading font-bold text-cima-gold">{fmt(arv)}</span>
                        </div>
                        <input
                            type="range"
                            min={1000000}
                            max={15000000}
                            step={100000}
                            value={arv}
                            onChange={(e) => setArv(Number(e.target.value))}
                            className="w-full h-1.5 rounded-full appearance-none cursor-pointer np-slider"
                            style={{ background: `linear-gradient(to right, #C8A96E ${((arv - 1000000) / 14000000) * 100}%, #23252F 0%)` }}
                        />
                    </div>
                </div>

                <div className="flex flex-col justify-center gap-4">
                    <div className="p-5 rounded-2xl bg-cima-surface/50 border border-cima-border">
                        <div className="flex items-center gap-2 mb-2 text-cima-text-dim">
                            <TrendingUp className="h-4 w-4" />
                            <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Retorno Estimado</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className={`font-heading font-black text-5xl tracking-tighter ${getRoiColor()}`}>
                                {roi.toFixed(1)}%
                            </span>
                        </div>
                        <p className="text-xs text-cima-text-muted mt-2">
                            Utilidad neta proyectada: <span className="text-cima-text font-bold">{fmt(rawProfit)}</span>
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-4 rounded-xl border border-cima-border bg-cima-card">
                            <p className="text-[9px] font-mono text-cima-text-dim uppercase mb-1">Inversión Total</p>
                            <p className="text-sm font-bold text-cima-text">{fmt(totalInvestment)}</p>
                        </div>
                        <div className="p-4 rounded-xl border border-cima-border bg-cima-card">
                            <p className="text-[9px] font-mono text-cima-text-dim uppercase mb-1">Margen Bruto</p>
                            <p className="text-sm font-bold text-cima-text">{fmt(rawProfit)}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t border-cima-border flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-mono text-cima-text-dim uppercase">Exclusividad</span>
                        <span className="text-xs font-bold text-cima-gold">60 Días</span>
                    </div>
                    <div className="h-8 w-px bg-cima-border" />
                    <div className="flex flex-col">
                        <span className="text-[9px] font-mono text-cima-text-dim uppercase">Estrategia</span>
                        <span className="text-xs font-bold text-cima-text">AI Staging + Ads</span>
                    </div>
                </div>
                <button className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-cima-gold text-cima-bg font-bold text-sm hover:brightness-110 transition-all">
                    Ejecutar este proyecto
                </button>
            </div>
        </div>
    );
}
