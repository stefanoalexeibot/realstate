"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layout, Settings, Users, Sparkles, ChevronRight, Check, X } from "lucide-react";
import type { PlanConfig } from "@/lib/config/demo-plans";
import { DEMO_PLANS } from "@/lib/config/demo-plans";

interface DemoNavbarProps {
    plan: PlanConfig;
}

export default function DemoNavbar({ plan }: DemoNavbarProps) {
    const pathname = usePathname();
    const base = `/demo/${plan.tier}`;
    const [showTooltip, setShowTooltip] = useState(false);

    const tabs = [
        { href: base, label: "Landing Page", shortLabel: "Landing", icon: Sparkles },
        { href: `${base}/admin`, label: "Panel Admin", shortLabel: "Admin", icon: Settings },
        { href: `${base}/portal`, label: "Portal Dueño", shortLabel: "Portal", icon: Users },
    ];

    const tierColors: Record<string, string> = {
        basico: "bg-gray-500/20 text-gray-400 border-gray-500/30",
        profesional: "bg-cima-gold/20 text-cima-gold border-cima-gold/30",
        premium: "bg-cima-gold/20 text-cima-gold border-cima-gold/30",
    };

    const tierBadge: Record<string, string> = {
        basico: "STARTER",
        profesional: "PRO",
        premium: "AGENCY",
    };

    // Features list for tooltip
    const featuresList = [
        { label: "Animaciones y Aurora", key: "landing" as const, check: (p: PlanConfig) => p.features.landing.animations },
        { label: "Analíticos", key: "admin" as const, check: (p: PlanConfig) => p.features.admin.analytics },
        { label: "Mensajería", key: "admin" as const, check: (p: PlanConfig) => p.features.admin.messages },
        { label: "Feedback del Mercado", key: "portal" as const, check: (p: PlanConfig) => p.features.portal.feedback },
        { label: "Expediente Digital", key: "portal" as const, check: (p: PlanConfig) => p.features.portal.documents },
        { label: "Evidencia Fotográfica", key: "portal" as const, check: (p: PlanConfig) => p.features.portal.evidence },
        { label: "Compartir Redes", key: "portal" as const, check: (p: PlanConfig) => p.features.portal.sharing },
    ];

    return (
        <>
            {/* Desktop navbar */}
            <div className="fixed top-0 left-0 right-0 z-[60] bg-black/90 backdrop-blur-xl border-b border-white/10">
                <div className="mx-auto max-w-7xl px-4 h-12 flex items-center justify-between gap-4">
                    {/* Left: Plan badge with tooltip */}
                    <div className="flex items-center gap-3 shrink-0 relative">
                        <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-lg bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center">
                                <Layout className="h-3 w-3 text-cima-gold" />
                            </div>
                            <span className="text-[10px] font-black text-white uppercase tracking-wider hidden sm:inline">Demo</span>
                        </div>
                        <button
                            onClick={() => setShowTooltip(!showTooltip)}
                            className={`px-2 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-widest cursor-pointer hover:scale-105 transition-all ${tierColors[plan.tier]}`}
                        >
                            {tierBadge[plan.tier]}
                        </button>
                        <span className="text-[10px] font-mono text-white/30 hidden md:inline">{plan.price} MXN</span>

                        {/* Features tooltip */}
                        {showTooltip && (
                            <div className="absolute top-full left-0 mt-2 w-64 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl z-[70]">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[9px] font-black text-white uppercase tracking-wider">
                                        Plan {plan.name}
                                    </span>
                                    <button onClick={() => setShowTooltip(false)} className="text-white/30 hover:text-white">
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                                <div className="space-y-1.5">
                                    {featuresList.map((feat, i) => {
                                        const enabled = feat.check(plan);
                                        return (
                                            <div key={i} className="flex items-center gap-2">
                                                <div className={`h-3.5 w-3.5 rounded-full flex items-center justify-center ${enabled ? "bg-green-500/20" : "bg-white/5"
                                                    }`}>
                                                    {enabled ? (
                                                        <Check className="h-2 w-2 text-green-400" />
                                                    ) : (
                                                        <X className="h-2 w-2 text-white/10" />
                                                    )}
                                                </div>
                                                <span className={`text-[9px] ${enabled ? "text-white/70" : "text-white/20"}`}>
                                                    {feat.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                                {/* Compare link */}
                                {plan.tier !== "premium" && (
                                    <Link
                                        href={`/demo/${plan.tier === "basico" ? "profesional" : "premium"}`}
                                        className="mt-3 flex items-center justify-center gap-1 px-3 py-2 bg-cima-gold/10 border border-cima-gold/20 rounded-lg text-[8px] font-black text-cima-gold uppercase tracking-wider hover:bg-cima-gold/20 transition-all"
                                        onClick={() => setShowTooltip(false)}
                                    >
                                        Comparar con {plan.tier === "basico" ? "Pro" : "Premium"}
                                        <ChevronRight className="h-3 w-3" />
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Center: Tabs */}
                    <div className="flex items-center gap-1 bg-white/5 rounded-lg p-0.5">
                        {tabs.map((tab) => {
                            const isActive = pathname === tab.href;
                            return (
                                <Link
                                    key={tab.href}
                                    href={tab.href}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all ${isActive
                                        ? "bg-cima-gold text-black shadow-lg shadow-cima-gold/20"
                                        : "text-white/40 hover:text-white/70 hover:bg-white/5"
                                        }`}
                                >
                                    <tab.icon className="h-3 w-3" />
                                    <span className="hidden sm:inline">{tab.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right: Upgrade CTA */}
                    {plan.tier !== "premium" && (
                        <Link
                            href={`/demo/${plan.tier === "basico" ? "profesional" : "premium"}`}
                            className="flex items-center gap-1 px-3 py-1.5 bg-cima-gold/10 border border-cima-gold/20 rounded-lg text-[8px] font-black text-cima-gold uppercase tracking-wider hover:bg-cima-gold/20 transition-all shrink-0"
                        >
                            Ver {plan.tier === "basico" ? "Pro" : "Premium"}
                            <ChevronRight className="h-3 w-3" />
                        </Link>
                    )}
                    {plan.tier === "premium" && (
                        <span className="px-3 py-1.5 bg-cima-gold/10 border border-cima-gold/20 rounded-lg text-[8px] font-black text-cima-gold uppercase tracking-wider shrink-0">
                            ✦ Plan Completo
                        </span>
                    )}
                </div>
            </div>

            {/* Mobile bottom tab bar */}
            <div className="fixed bottom-0 left-0 right-0 z-[60] bg-black/95 backdrop-blur-xl border-t border-white/10 sm:hidden">
                <div className="flex items-center justify-around h-14">
                    {tabs.map((tab) => {
                        const isActive = pathname === tab.href;
                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={`flex flex-col items-center gap-1 py-1.5 px-4 rounded-xl transition-all ${isActive
                                        ? "text-cima-gold"
                                        : "text-white/30"
                                    }`}
                            >
                                <tab.icon className={`h-4 w-4 ${isActive ? "drop-shadow-[0_0_6px_rgba(200,169,110,0.5)]" : ""}`} />
                                <span className="text-[7px] font-bold uppercase tracking-wider">{tab.shortLabel}</span>
                                {isActive && (
                                    <div className="absolute bottom-1 h-0.5 w-6 bg-cima-gold rounded-full" />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Click-away overlay for tooltip */}
            {showTooltip && (
                <div className="fixed inset-0 z-[59]" onClick={() => setShowTooltip(false)} />
            )}
        </>
    );
}
