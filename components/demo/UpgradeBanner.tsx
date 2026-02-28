"use client";

import React from "react";
import { Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { PlanTier } from "@/lib/config/demo-plans";

interface UpgradeBannerProps {
    currentTier: PlanTier;
    requiredTier: "profesional" | "premium";
    featureName: string;
}

export default function UpgradeBanner({ currentTier, requiredTier, featureName }: UpgradeBannerProps) {
    const planNames: Record<string, string> = {
        profesional: "Professional",
        premium: "Team / Agency",
    };

    return (
        <div className="relative rounded-2xl border border-white/10 bg-white/[0.02] p-6 overflow-hidden">
            {/* Blurred background effect */}
            <div className="absolute inset-0 backdrop-blur-[2px] bg-black/40 z-10" />

            {/* Content */}
            <div className="relative z-20 flex flex-col items-center justify-center text-center py-8">
                <div className="h-12 w-12 rounded-2xl bg-cima-gold/10 border border-cima-gold/20 flex items-center justify-center mb-4">
                    <Lock className="h-5 w-5 text-cima-gold" />
                </div>
                <h4 className="text-sm font-black text-white uppercase tracking-wider mb-2">
                    {featureName}
                </h4>
                <p className="text-xs text-white/40 mb-6 max-w-xs">
                    Esta función está disponible en el plan <span className="text-cima-gold font-bold">{planNames[requiredTier]}</span>
                </p>
                <Link
                    href={`/demo/${requiredTier}`}
                    className="flex items-center gap-2 px-5 py-2.5 bg-cima-gold text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:scale-105 transition-all shadow-lg shadow-cima-gold/20"
                >
                    Ver Demo {planNames[requiredTier]}
                    <ArrowRight className="h-3 w-3" />
                </Link>
            </div>
        </div>
    );
}
