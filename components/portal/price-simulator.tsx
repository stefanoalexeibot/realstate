"use client";

import React, { useState, useEffect } from "react";
import { Info, Target, TrendingDown, TrendingUp, BarChart3, Calculator, Sparkles } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface PriceSimulatorProps {
    initialPrice: number;
    areaM2: number;
    avgMarketPricePerM2: number | null;
    neighborhood?: string;
}

export default function PriceSimulator({ initialPrice, areaM2, avgMarketPricePerM2, neighborhood }: PriceSimulatorProps) {
    const [simPrice, setSimPrice] = useState(initialPrice);

    // Calculate stats
    const simPricePerM2 = areaM2 > 0 ? simPrice / areaM2 : 0;
    const diff = avgMarketPricePerM2 ? ((simPricePerM2 - avgMarketPricePerM2) / avgMarketPricePerM2) * 100 : 0;
    const absDiff = Math.abs(diff);

    // Score calculation (0-100)
    // 0% diff = 100 score (perfect market match)
    // > 20% diff = lower score
    const getCompetitivenessScore = () => {
        if (diff > 15) return { label: "Baja", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", progress: "w-1/3" };
        if (diff > 5) return { label: "Media-Baja", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", progress: "w-1/2" };
        if (diff > -5) return { label: "Alta", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", progress: "w-[90%]" };
        return { label: "Muy Alta (Oportunidad)", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", progress: "w-full" };
    };

    const [aiReport, setAiReport] = useState<string | null>(null);
    const [aiLoading, setAiLoading] = useState(false);

    const score = getCompetitivenessScore();

    async function generateAiReport() {
        setAiLoading(true);
        try {
            const res = await fetch("/api/ai-appraisal", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    zone: neighborhood || "Monterrey",
                    m2: areaM2,
                    bedrooms: 3, // Fallback
                    propertyType: 'casa',
                    mode: 'detailed'
                }),
            });
            const data = await res.json();
            if (data.insight) setAiReport(data.insight);
        } catch (err) {
            console.error(err);
        } finally {
            setAiLoading(false);
        }
    }

    return (
        <div className="rounded-2xl border border-cima-border bg-cima-card p-6 space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-cima-gold" />
                    <h2 className="font-heading font-bold text-lg text-cima-text">Simulador de Precio</h2>
                </div>
                <div className={`px-2.5 py-1 rounded-full border text-[10px] font-mono uppercase tracking-wider ${score.bg} ${score.border} ${score.color}`}>
                    Competitividad: {score.label}
                </div>
            </div>

            <p className="text-xs text-cima-text-muted">
                Ajusta el precio para ver cómo impacta tu posición frente al mercado de la zona.
            </p>

            {/* Slider / Input */}
            <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                    <span className="font-mono text-cima-text-dim text-[10px] uppercase">Precio Simulado</span>
                    <span className="font-heading font-bold text-cima-gold text-lg">{formatPrice(simPrice)}</span>
                </div>
                <input
                    type="range"
                    min={initialPrice * 0.7}
                    max={initialPrice * 1.3}
                    step={50000}
                    value={simPrice}
                    onChange={(e) => setSimPrice(Number(e.target.value))}
                    className="w-full h-1.5 bg-cima-surface rounded-lg appearance-none cursor-pointer accent-cima-gold"
                />
                <div className="flex justify-between text-[9px] font-mono text-cima-text-dim uppercase tracking-tighter">
                    <span>-30%</span>
                    <span>Precio Actual</span>
                    <span>+30%</span>
                </div>
            </div>

            {/* Market Comparison Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl bg-cima-surface border border-cima-border p-4 space-y-1">
                    <p className="text-[10px] text-cima-text-dim font-mono uppercase">Tu $/m² Simulado</p>
                    <p className="text-lg font-bold text-cima-text">{formatPrice(simPricePerM2)}/m²</p>
                    <div className="flex items-center gap-1.5 pt-1">
                        {diff > 0 ? (
                            <TrendingUp className="h-3 w-3 text-red-400" />
                        ) : (
                            <TrendingDown className="h-3 w-3 text-emerald-400" />
                        )}
                        <span className={`text-[10px] font-bold ${diff > 0 ? "text-red-400" : "text-emerald-400"}`}>
                            {diff > 0 ? "+" : ""}{diff.toFixed(1)}% vs zona
                        </span>
                    </div>
                </div>

                <div className="rounded-xl bg-cima-surface border border-cima-border p-4 space-y-1">
                    <p className="text-[10px] text-cima-text-dim font-mono uppercase">Promedio de la Zona</p>
                    <p className="text-lg font-bold text-cima-text">{formatPrice(avgMarketPricePerM2 ?? 0)}/m²</p>
                    <p className="text-[10px] text-cima-text-muted pt-1 italic">
                        Calculado con propiedades similares.
                    </p>
                </div>
            </div>

            {/* AI Report Section */}
            <div className="p-4 rounded-xl border border-cima-gold/15 bg-cima-gold/5 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-cima-gold" />
                        <p className="text-xs font-semibold text-cima-text">Análisis de Mercado con IA</p>
                    </div>
                    {!aiReport && (
                        <button
                            onClick={generateAiReport}
                            disabled={aiLoading}
                            className="text-[10px] font-mono uppercase tracking-widest text-cima-gold hover:text-cima-gold-light disabled:opacity-50 transition-colors"
                        >
                            {aiLoading ? "Generando..." : "Generar Reporte"}
                        </button>
                    )}
                </div>

                {aiReport ? (
                    <div className="text-[11px] text-cima-text-muted leading-relaxed whitespace-pre-wrap animate-in fade-in slide-in-from-top-1 duration-500">
                        {aiReport}
                        <div className="mt-3 pt-3 border-t border-cima-gold/10">
                            <button
                                onClick={() => setAiReport(null)}
                                className="text-[9px] uppercase tracking-tighter text-cima-text-dim hover:text-cima-gold transition-colors"
                            >
                                ← Cerrar y volver a recomendación básica
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex gap-3">
                        <div className="space-y-1">
                            <p className="text-[11px] text-cima-text-muted leading-relaxed">
                                {diff > 10 ?
                                    "Tu precio está significativamente arriba del mercado. Esto puede retrasar la venta más de 6 meses." :
                                    diff > 0 ?
                                        "Estás en un rango premium. La propiedad debe destacar frente a la competencia." :
                                        "Tienes un precio altamente competitivo. Esto generará visitas pronto."
                                }
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <div className="pt-2">
                <button
                    onClick={() => setSimPrice(initialPrice)}
                    className="w-full py-2.5 rounded-lg border border-cima-border text-[10px] font-mono uppercase tracking-widest text-cima-text-dim hover:text-cima-gold hover:border-cima-gold/30 transition-all"
                >
                    Restablecer al precio real
                </button>
            </div>
        </div>
    );
}
