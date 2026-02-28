"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { BRAND_CONFIG } from "@/lib/config/brand";
import AuroraHero from "@/components/landing/aurora-hero";

export default function TemplateHero() {
    return (
        <section className="relative pt-40 pb-32 px-6 overflow-hidden min-h-screen flex items-center bg-[#0A0A0B]">
            <AuroraHero />

            <div className="relative mx-auto max-w-5xl text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cima-gold/10 border border-cima-gold/20 mb-8"
                >
                    <Sparkles className="h-4 w-4 text-cima-gold" />
                    <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-cima-gold">Garantía de {BRAND_CONFIG.business.sellingGuaranteeDays} días</span>
                </motion.div>

                <h1 className="text-6xl md:text-8xl font-heading font-bold text-white tracking-tight mb-8 leading-[1]">
                    <span className="block">{BRAND_CONFIG.hero.title.line1}</span>
                    <span className="block text-cima-gold">{BRAND_CONFIG.hero.title.line2}</span>
                    <span className="block text-white/40">{BRAND_CONFIG.hero.title.line3}</span>
                </h1>

                <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed">
                    {BRAND_CONFIG.hero.description}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button className="w-full sm:w-auto px-8 py-4 bg-cima-gold text-black font-heading font-bold rounded-2xl hover:scale-105 transition-all">
                        Solicitar Valuación
                    </button>
                    <button className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-heading font-bold rounded-2xl hover:bg-white/10 transition-all">
                        Ver Catálogo
                    </button>
                </div>
            </div>
        </section>
    );
}
