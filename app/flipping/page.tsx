import React from "react";
import Link from "next/link";
import {
    Calculator, TrendingUp, Shield, ArrowRight,
    CheckCircle2, Paintbrush, Hammer, DollarSign
} from "lucide-react";
import LandingNav from "@/components/landing/landing-nav";
import FlippingCalculator from "@/components/landing/flipping-calculator";
import StatsMarquee from "@/components/landing/stats-marquee";
import FadeIn from "@/components/landing/fade-in";
import AuroraHero from "@/components/landing/aurora-hero";

export default function FlippingPage() {
    return (
        <div className="min-h-screen bg-cima-bg">
            <LandingNav />
            <StatsMarquee />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden min-h-[80vh] flex items-center">
                <AuroraHero />
                <div className="relative mx-auto max-w-6xl w-full text-center">
                    <FadeIn>
                        <div className="inline-flex items-center gap-2 rounded-full border border-cima-gold/25 bg-cima-gold/5 px-4 py-1.5 mb-7">
                            <span className="h-1.5 w-1.5 rounded-full bg-cima-gold animate-pulse" />
                            <span className="font-mono text-xs text-cima-gold tracking-widest uppercase italic">Inversión Inteligente</span>
                        </div>
                        <h1 className="font-heading font-bold text-5xl sm:text-7xl text-cima-text leading-[1.05] mb-6">
                            Multiplica tu capital con <br />
                            <span className="text-cima-gold italic underline decoration-cima-gold/30">Real Estate Flipping.</span>
                        </h1>
                        <p className="text-lg text-cima-text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
                            Detectamos propiedades con potencial, coordinamos la remodelación con IA y vendemos en tiempo récord utilizando nuestro ecosistema digital.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a href="#calculadora" className="px-8 py-3.5 rounded-xl bg-cima-gold text-cima-bg font-bold hover:scale-[1.02] transition-all">
                                Simular mi primer proyecto
                            </a>
                            <Link href="/oportunidades" className="px-8 py-3.5 rounded-xl border border-cima-border text-cima-text hover:bg-cima-surface transition-all">
                                Ver oportunidades actuales
                            </Link>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* Model Section */}
            <section className="py-24 px-6 border-t border-cima-border/50">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {[
                            {
                                icon: Hammer,
                                title: "1. Adquisición",
                                desc: "Filtramos propiedades por debajo del valor de mercado con problemas estéticos o urgencia de venta."
                            },
                            {
                                icon: Paintbrush,
                                title: "2. Transformación IA",
                                desc: "Diseñamos la remodelación óptima y la visualizamos con nuestra tecnología de IA para atraer compradores antes de terminar."
                            },
                            {
                                icon: TrendingUp,
                                title: "3. Salida Rápida",
                                desc: "Nuestra garantía de 30 días y pauta publicitaria masiva aseguran que tu capital retorne con utilidad rápidamente."
                            }
                        ].map((step, i) => (
                            <FadeIn key={i} delay={i * 0.1}>
                                <div className="p-8 rounded-2xl border border-cima-border bg-cima-card/50 hover:border-cima-gold/30 transition-all group h-full">
                                    <div className="h-12 w-12 rounded-xl bg-cima-gold/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <step.icon className="h-6 w-6 text-cima-gold" />
                                    </div>
                                    <h3 className="font-heading font-bold text-xl text-cima-text mb-4">{step.title}</h3>
                                    <p className="text-cima-text-muted text-sm leading-relaxed">{step.desc}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* Calculator Section */}
            <section id="calculadora" className="py-24 px-6 bg-cima-surface/20">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h2 className="font-heading font-bold text-3xl sm:text-4xl text-cima-text mb-4">Haz los números tú mismo</h2>
                    <p className="text-cima-text-muted">A diferencia de otras inversiones, aquí el activo es tangible y la estrategia está probada.</p>
                </div>
                <FlippingCalculator />
            </section>

            {/* Commitment Section */}
            <section className="py-24 px-6 border-t border-cima-border/50">
                <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-br from-cima-card to-cima-bg border border-cima-gold/20 p-8 md:p-16 relative overflow-hidden">
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="font-heading font-bold text-3xl text-cima-text mb-6">Nuestro compromiso de 60 días</h2>
                            <p className="text-cima-text-muted mb-8 leading-relaxed">
                                Para que un proyecto de Flipping sea exitoso, necesitamos enfoque total. Por eso operamos bajo un contrato de exclusividad de 60 días donde invertimos nuestro capital en tu marketing y staging.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Inversión directa en pauta (Ads)",
                                    "Staging Virtual de alta gama",
                                    "Filtrado hipotecario de compradores",
                                    "Cierre garantizado o comisión cero"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-cima-text">
                                        <CheckCircle2 className="h-4 w-4 text-cima-gold" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-cima-bg/80 backdrop-blur p-8 rounded-2xl border border-cima-border">
                            <p className="font-mono text-[10px] tracking-widest text-cima-gold uppercase mb-6 text-center italic">¿Interesado en fondear un proyecto?</p>
                            <div className="space-y-4">
                                <input type="text" placeholder="Nombre completo" className="w-full bg-cima-card border border-cima-border rounded-lg px-4 py-3 text-sm focus:border-cima-gold outline-none" />
                                <input type="email" placeholder="Correo electrónico" className="w-full bg-cima-card border border-cima-border rounded-lg px-4 py-3 text-sm focus:border-cima-gold outline-none" />
                                <button className="w-full py-4 rounded-lg bg-cima-gold text-cima-bg font-bold hover:brightness-110 transition-all">
                                    Recibir portafolio disponible
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="py-12 border-t border-cima-border text-center">
                <p className="text-xs text-cima-text-dim font-mono tracking-widest">PROPIEDADES MTY · FLIPPING UNIT 2026</p>
            </footer>
        </div>
    );
}
