import React from "react";
import { createClient } from "@/lib/supabase/server";
import LandingNav from "@/components/landing/landing-nav";
import FlippingCard from "@/components/landing/flipping-card";
import FadeIn from "@/components/landing/fade-in";
import { Target, TrendingUp, Lightbulb } from "lucide-react";

export default async function OportunidadesPage() {
    const supabase = createClient();

    // For now, we'll list "Featured" properties as candidates for flipping
    const { data: props } = await supabase
        .from("re_properties")
        .select("*")
        .eq("status", "active")
        .limit(12);

    return (
        <div className="min-h-screen bg-cima-bg">
            <LandingNav />

            <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <FadeIn>
                        <div className="inline-flex items-center gap-2 text-cima-gold mb-3">
                            <Target className="h-5 w-5" />
                            <span className="font-mono text-xs tracking-[0.2em] uppercase">Marketplace de Inversión</span>
                        </div>
                        <h1 className="font-heading font-black text-4xl sm:text-5xl text-cima-text italic">
                            Oportunidades de <span className="text-cima-gold">Flipping.</span>
                        </h1>
                        <p className="text-cima-text-muted mt-4 max-w-xl">
                            Propiedades seleccionadas meticulosamente por nuestro equipo de expertos por su alto potencial de rentabilidad y margen de mejora.
                        </p>
                    </FadeIn>

                    <div className="flex gap-4">
                        <div className="px-4 py-3 rounded-2xl bg-cima-card border border-cima-border flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-northpeak-green/10 flex items-center justify-center text-northpeak-green">
                                <TrendingUp className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-[10px] font-mono text-cima-text-dim uppercase">ROI Promedio</p>
                                <p className="text-sm font-bold text-cima-text">+22%</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid */}
                {props && props.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {props.map((p, i) => (
                            <FlippingCard key={p.id} property={p} index={i} />
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center rounded-3xl border border-dashed border-cima-border">
                        <Lightbulb className="h-12 w-12 text-cima-text-dim mx-auto mb-4" />
                        <p className="text-cima-text-muted font-heading font-bold text-xl">No hay oportunidades activas en este momento.</p>
                        <p className="text-cima-text-dim text-sm mt-2">Estamos analizando nuevos proyectos. Vuelve pronto.</p>
                    </div>
                )}

                {/* Disclaimer */}
                <div className="mt-20 p-6 rounded-2xl border border-cima-border bg-cima-surface/30">
                    <p className="text-[10px] text-cima-text-dim leading-relaxed italic">
                        * Los cálculos de ROI y ARV son proyecciones basadas en datos históricos del mercado y el análisis de remodelación de Propiedades MTY. La inversión inmobiliaria conlleva riesgos. Te recomendamos solicitar el análisis legal y técnico completo de cada propiedad antes de invertir.
                    </p>
                </div>
            </div>
        </div>
    );
}
