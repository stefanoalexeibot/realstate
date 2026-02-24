"use client";

import BlurReveal from "@/components/landing/blur-reveal";

interface SectionHeaderProps {
    tag?: string;
    title: string;
    subtitle?: string;
    className?: string;
}

export default function SectionHeader({ tag, title, subtitle, className = "" }: SectionHeaderProps) {
    return (
        <div className={`text-center mb-10 ${className}`}>
            {tag && (
                <p className="font-mono text-[10px] tracking-[0.2em] text-cima-gold uppercase mb-2">{tag}</p>
            )}
            <BlurReveal className="font-heading font-bold text-2xl sm:text-3xl text-cima-text">
                {title}
            </BlurReveal>
            {subtitle && (
                <p className="text-sm text-cima-text-muted mt-2">{subtitle}</p>
            )}
        </div>
    );
}
