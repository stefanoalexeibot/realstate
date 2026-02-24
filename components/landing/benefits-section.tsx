"use client";

import React from "react";
import { Clock, Percent, Zap, Camera, Users, Target } from "lucide-react";
import FadeIn from "./fade-in";
import SectionHeader from "./section-header";
import TiltCard from "./tilt-card";

const BENEFITS = [
    {
        icon: Clock,
        title: "Garantía de 30 Días",
        desc: "Si no vendemos tu propiedad en menos de 30 días, no cobramos comisión. Así de seguros estamos de nuestro método.",
        tag: "Rapidez"
    },
    {
        icon: Percent,
        title: "Comisión desde 6%",
        desc: "Sin letras chiquitas ni gastos ocultos. Solo pagas al escriturar, garantizándote la mayor ganancia neta por tu venta.",
        tag: "Ahorro"
    },
    {
        icon: Zap,
        title: "Tecnología de Punta (IA)",
        desc: "Usamos inteligencia artificial para remodelar virtualmente tu casa y predecir el precio exacto de venta.",
        tag: "Innovación"
    },
    {
        icon: Camera,
        title: "Marketing Premium",
        desc: "Fotografía profesional, video con drone y tours 3D incluidos para destacar en los portales más importantes.",
        tag: "Visibilidad"
    },
    {
        icon: Target,
        title: "Compradores Calificados",
        desc: "Filtramos solo prospectos con crédito aprobado o liquidez inmediata. No perdemos el tiempo en visitas sin futuro.",
        tag: "Seguridad"
    },
    {
        icon: Users,
        title: "Asesoría Legal Total",
        desc: "Te acompañamos desde la valuación hasta la firma en notaría, resolviendo cualquier traba jurídica en el camino.",
        tag: "Expertise"
    }
];

export default function BenefitsSection() {
    return (
        <section className="px-6 py-24 bg-cima-surface/30 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cima-gold/5 rounded-full blur-[100px] -mr-64 -mt-64" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cima-gold/5 rounded-full blur-[80px] -ml-32 -mb-32" />

            <div className="mx-auto max-w-6xl relative z-10">
                <div className="mb-16">
                    <SectionHeader
                        tag="Por qué elegirnos"
                        title="Beneficios de vender con Cima"
                        subtitle="Combinamos tecnología de vanguardia con un servicio humano excepcional para vender tu casa al mejor precio."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {BENEFITS.map((b, i) => (
                        <FadeIn key={b.title} delay={i * 0.1}>
                            <TiltCard className="h-full">
                                <div className="group h-full bg-cima-card border border-cima-border p-8 rounded-2xl hover:border-cima-gold/40 transition-all duration-300 flex flex-col">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="h-12 w-12 rounded-xl bg-cima-gold/10 border border-cima-gold/20 flex items-center justify-center group-hover:bg-cima-gold/20 transition-colors">
                                            <b.icon className="h-6 w-6 text-cima-gold" />
                                        </div>
                                        <span className="font-mono text-[10px] uppercase tracking-widest text-cima-gold/50">{b.tag}</span>
                                    </div>
                                    <h3 className="font-heading font-bold text-xl text-cima-text mb-3">{b.title}</h3>
                                    <p className="text-cima-text-muted text-sm leading-relaxed flex-1">
                                        {b.desc}
                                    </p>
                                </div>
                            </TiltCard>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
