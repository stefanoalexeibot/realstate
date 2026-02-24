"use client";

import { useState } from "react";
import { X, CheckCircle2, ShieldCheck, BarChart3, Share2, ArrowRight } from "lucide-react";

const SLIDES = [
    {
        icon: ShieldCheck,
        title: "Expediente Digital",
        desc: "Carga tus escrituras y recibos de forma segura. Agilizamos el proceso notarial desde el día uno.",
        color: "text-blue-400",
        bg: "bg-blue-500/10"
    },
    {
        icon: BarChart3,
        title: "Simulador de Mercado",
        desc: "Ajusta el precio y observa cómo cambia tu competitividad. Tú tienes el control de tu estrategia.",
        color: "text-cima-gold",
        bg: "bg-cima-gold/10"
    },
    {
        icon: Share2,
        title: "Comparte y Gana",
        desc: "Promueve tu propiedad en tus redes sociales. Cada vista cuenta para encontrar al comprador ideal.",
        color: "text-emerald-400",
        bg: "bg-emerald-500/10"
    }
];

export default function OnboardingModal() {
    const [open, setOpen] = useState(true);
    const [step, setStep] = useState(0);
    const [marking, setMarking] = useState(false);

    if (!open) return null;

    const current = SLIDES[step];

    async function finish() {
        setMarking(true);
        try {
            await fetch("/api/profiles/onboarding", { method: "POST" });
            setOpen(false);
        } catch (e) {
            setOpen(false);
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-cima-border bg-cima-card p-8 text-center shadow-2xl">
                <button
                    onClick={() => setOpen(false)}
                    className="absolute top-4 right-4 p-2 text-cima-text-dim hover:text-cima-text transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${current.bg} border border-white/10 transition-colors duration-500`}>
                    <current.icon className={`h-8 w-8 ${current.color}`} />
                </div>

                <h2 className="mb-2 font-heading text-xl font-bold text-cima-text animate-in slide-in-from-bottom-2 duration-500">
                    {current.title}
                </h2>
                <p className="mb-8 text-sm leading-relaxed text-cima-text-muted animate-in slide-in-from-bottom-3 duration-700">
                    {current.desc}
                </p>

                <div className="flex items-center justify-center gap-2 mb-8">
                    {SLIDES.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1 rounded-full transition-all duration-300 ${i === step ? "w-6 bg-cima-gold" : "w-1.5 bg-cima-border"}`}
                        />
                    ))}
                </div>

                {step < SLIDES.length - 1 ? (
                    <button
                        onClick={() => setStep(s => s + 1)}
                        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-cima-gold py-3 text-sm font-bold text-cima-bg hover:bg-cima-gold-light transition-all"
                    >
                        Siguiente
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                ) : (
                    <button
                        onClick={finish}
                        disabled={marking}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-cima-gold py-3 text-sm font-bold text-cima-bg hover:bg-cima-gold-light transition-all"
                    >
                        {marking ? "Finalizando..." : "Comenzar ahora"}
                        <CheckCircle2 className="h-4 w-4" />
                    </button>
                )}
            </div>
        </div>
    );
}
