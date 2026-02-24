"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface AnimatedStatProps {
    icon: LucideIcon;
    label: string;
    value: number | string;
    color: string;
    sub: string;
    index?: number;
}

export default function AnimatedStat({
    icon: Icon,
    label,
    value,
    color,
    sub,
    index = 0,
}: AnimatedStatProps) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-40px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.4, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="rounded-xl border border-cima-border bg-cima-card p-4 hover:border-cima-gold/30 hover:shadow-[0_0_16px_rgba(200,169,110,0.06)] transition-all duration-300"
        >
            <div className="flex items-center gap-2 mb-2">
                <Icon className={`h-3.5 w-3.5 ${color}`} />
                <p className="text-[10px] text-cima-text-dim font-mono uppercase leading-tight">{label}</p>
            </div>
            <p className={`font-heading font-bold text-2xl leading-none mb-1 ${color}`}>{value}</p>
            <p className="text-[10px] text-cima-text-dim">{sub}</p>
        </motion.div>
    );
}
