"use client";

import React from "react";
import { motion } from "framer-motion";
import { Lock, ArrowRight, Sparkles } from "lucide-react";
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
            {/* Animated shimmer background */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
            </div>

            {/* Blurred background effect */}
            <div className="absolute inset-0 backdrop-blur-[2px] bg-black/40 z-10" />

            {/* Content */}
            <div className="relative z-20 flex flex-col items-center justify-center text-center py-8">
                {/* Animated lock icon */}
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="relative mb-4"
                >
                    <div className="h-14 w-14 rounded-2xl bg-cima-gold/10 border border-cima-gold/20 flex items-center justify-center">
                        <motion.div
                            animate={{ rotateY: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        >
                            <Lock className="h-6 w-6 text-cima-gold" />
                        </motion.div>
                    </div>
                    {/* Glow ring */}
                    <motion.div
                        className="absolute inset-0 rounded-2xl border-2 border-cima-gold/30"
                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </motion.div>

                <motion.h4
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-sm font-black text-white uppercase tracking-wider mb-2"
                >
                    {featureName}
                </motion.h4>
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-xs text-white/40 mb-6 max-w-xs"
                >
                    Esta función está disponible en el plan <span className="text-cima-gold font-bold">{planNames[requiredTier]}</span>
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Link
                        href={`/demo/${requiredTier}`}
                        className="group flex items-center gap-2 px-5 py-2.5 bg-cima-gold text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:scale-105 transition-all shadow-lg shadow-cima-gold/20"
                    >
                        <Sparkles className="h-3 w-3 group-hover:animate-spin" />
                        Ver Demo {planNames[requiredTier]}
                        <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
