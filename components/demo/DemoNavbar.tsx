"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layout, Settings, Users, Sparkles, ChevronRight } from "lucide-react";
import type { PlanConfig } from "@/lib/config/demo-plans";

interface DemoNavbarProps {
    plan: PlanConfig;
}

export default function DemoNavbar({ plan }: DemoNavbarProps) {
    const pathname = usePathname();
    const base = `/demo/${plan.tier}`;

    const tabs = [
        { href: base, label: "Landing Page", icon: Sparkles },
        { href: `${base}/admin`, label: "Panel Admin", icon: Settings },
        { href: `${base}/portal`, label: "Portal Dueño", icon: Users },
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

    return (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-black/90 backdrop-blur-xl border-b border-white/10">
            <div className="mx-auto max-w-7xl px-4 h-12 flex items-center justify-between gap-4">
                {/* Left: Plan badge */}
                <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-lg bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center">
                            <Layout className="h-3 w-3 text-cima-gold" />
                        </div>
                        <span className="text-[10px] font-black text-white uppercase tracking-wider hidden sm:inline">Demo</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-widest ${tierColors[plan.tier]}`}>
                        {tierBadge[plan.tier]}
                    </span>
                    <span className="text-[10px] font-mono text-white/30 hidden md:inline">{plan.price} MXN</span>
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
    );
}
