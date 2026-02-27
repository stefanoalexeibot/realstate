"use client";

import Link from "next/link";
import Image from "next/image";
import {
    ShieldCheck, Zap, Globe, MessageCircle, BarChart3,
    ArrowRight, Sparkles, Building2, UserCheck, Layout, Calendar
} from "lucide-react";
import { motion } from "framer-motion";
import FadeIn from "@/components/landing/fade-in";
import { useState } from "react";
import LiveActivityFeed from "@/components/pro/LiveActivityFeed";
import InteractiveEcosystem from "@/components/pro/InteractiveEcosystem";
import TiltCard from "@/components/pro/TiltCard";
import VideoDemoBubble from "@/components/pro/VideoDemoBubble";
import ExperienceShowcase from "@/components/pro/ExperienceShowcase";
import { AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

function RoiCalculator() {
    const [price, setPrice] = useState(5000000);
    const [commission, setCommission] = useState(5);
    const [monthlyProp, setMonthlyProp] = useState(2);

    const totalComm = (price * (commission / 100));
    const monthlyIncome = totalComm * monthlyProp;
    const annualIncome = monthlyIncome * 12;
    const timeSavedValue = (monthlyProp * 15 * 500);
    const cimaROI = Math.round((annualIncome / 85000) * 100); // based on Enterprise plan

    return (
        <div>
            {/* Psychological hook */}
            <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-red-500/5 border border-red-500/15 flex flex-col sm:flex-row gap-6 items-center">
                <div className="text-4xl shrink-0">💸</div>
                <div>
                    <h4 className="font-heading font-black text-lg text-white mb-2">¿Cuánto dinero estás dejando sobre la mesa cada mes?</h4>
                    <p className="text-sm text-cima-text-dim leading-relaxed">
                        El 73% de los asesores de lujo pierden propiedades a la competencia <strong className="text-white">no por precio — sino por imagen, velocidad y tecnología.</strong> Sin un ecosistema digital de alto nivel, tus propiedades compiten con colores del Word y PDFs de los años 90.
                    </p>
                </div>
            </div>

            <div className="bg-cima-bg/60 border border-cima-border rounded-2xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <h3 className="font-heading font-bold text-xl text-cima-gold">Calculadora de Impacto Financiero</h3>
                    <span className="text-[9px] font-mono text-cima-text-dim border border-cima-border px-3 py-1.5 rounded-full uppercase tracking-widest">Mueve los controles → ve tu potencial</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        <div>
                            <label className="text-[10px] uppercase tracking-widest font-bold text-cima-text-dim block mb-1">Precio promedio de propiedad</label>
                            <span className="text-[9px] text-cima-text-dim/60 italic block mb-3">→ ¿Cuánto vale en promedio una propiedad que vendes?</span>
                            <input
                                type="range" min="1000000" max="20000000" step="100000"
                                value={price} onChange={(e) => setPrice(Number(e.target.value))}
                                className="w-full accent-cima-gold bg-cima-border rounded-lg h-2"
                            />
                            <div className="flex justify-between mt-2 font-mono text-xs text-cima-gold font-bold">
                                <span>$1M</span>
                                <span>${(price / 1000000).toFixed(1)}M</span>
                                <span>$20M</span>
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] uppercase tracking-widest font-bold text-cima-text-dim block mb-1">% Comisión de Agencia</label>
                            <span className="text-[9px] text-cima-text-dim/60 italic block mb-3">→ ¿Qué porcentaje de comisión maneja tu agencia?</span>
                            <div className="flex gap-4">
                                {[3, 4, 5, 6].map(val => (
                                    <button
                                        key={val}
                                        onClick={() => setCommission(val)}
                                        className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-all ${commission === val ? "bg-cima-gold text-cima-bg border-cima-gold" : "bg-cima-card border-cima-border text-cima-text-muted hover:border-cima-gold/30"}`}
                                    >
                                        {val}%
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] uppercase tracking-widest font-bold text-cima-text-dim block mb-1">Propiedades cerradas por mes</label>
                            <span className="text-[9px] text-cima-text-dim/60 italic block mb-3">→ ¿Cuántas operaciones completas tu agencia al mes?</span>
                            <input
                                type="number" value={monthlyProp} onChange={(e) => setMonthlyProp(Number(e.target.value))}
                                className="w-full bg-cima-card border border-cima-border rounded-xl p-3 text-cima-text font-bold text-sm focus:border-cima-gold outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div className="bg-cima-gold/5 rounded-2xl p-6 sm:p-8 border border-cima-gold/10 flex flex-col justify-center gap-6">
                        <div>
                            <p className="text-[10px] uppercase font-bold text-cima-gold tracking-widest mb-1 italic">Potencial de Ingresos / Mes</p>
                            <p className="text-3xl sm:text-4xl font-heading font-extrabold text-cima-text">
                                ${new Intl.NumberFormat().format(monthlyIncome)}
                            </p>
                        </div>

                        <div className="border-t border-cima-gold/10 pt-6">
                            <p className="text-[10px] uppercase font-bold text-cima-text-dim tracking-widest mb-1">Potencial Anual Proyectado</p>
                            <p className="text-2xl font-black text-cima-gold">
                                ${new Intl.NumberFormat().format(annualIncome)}
                            </p>
                        </div>

                        <div className="border-t border-cima-gold/10 pt-6">
                            <p className="text-[10px] uppercase font-bold text-cima-text-dim tracking-widest mb-1">Valor de tiempo ahorrado / mes</p>
                            <p className="text-xl font-bold text-white">
                                ${new Intl.NumberFormat().format(timeSavedValue)} +
                            </p>
                            <p className="text-[9px] text-cima-text-dim mt-1 italic">* 15 horas de ahorro operativo por propiedad × $500/hr</p>
                        </div>

                        {/* ROI Pill */}
                        <div className="mt-2 p-4 rounded-2xl bg-green-500/10 border border-green-500/20">
                            <p className="text-[9px] uppercase font-black text-green-400 tracking-widest mb-1">ROI sobre la inversión en Cima</p>
                            <p className="text-2xl font-black text-green-400">{cimaROI}x</p>
                            <p className="text-[9px] text-green-400/60 mt-1">Calculado vs. plan Enterprise ($85k). Tu ecosistema se paga solo en el primer cierre.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const FEATURES = [
    {
        icon: <UserCheck className="h-6 w-6 text-cima-gold" />,
        title: "Portal de Propietarios",
        description: "Gana exclusivas ofreciendo transparencia total. Tus clientes ven el progreso de su venta en tiempo real.",
        badge: "Diferenciador #1"
    },
    {
        icon: <Zap className="h-6 w-6 text-cima-gold" />,
        title: "Motor de Automatización Pro",
        description: "Sincronización masiva de inventario con generación dinámica de activos: Landings, PDFs y protocolos de leads vinculados.",
        badge: "Arquitectura"
    },
    {
        icon: <Sparkles className="h-6 w-6 text-cima-gold" />,
        title: "Cima Intelligence AI",
        description: "Análisis automático del entorno (colegios, hospitales, comercio) procesado por IA para argumentos de venta.",
        badge: "Innovación"
    },
    {
        icon: <Layout className="h-6 w-6 text-cima-gold" />,
        title: "Landings de Ultra-Lujo",
        description: "Diseño premium tipo SaaS que retiene la atención y posiciona tu marca por encima de la competencia.",
        badge: "Estatus"
    }
];

const FAQS = [
    {
        q: "¿Qué implica la implementación?",
        a: "No es un simple plugin. Realizamos un despliegue de infraestructura dedicado, configurando tu propio nodo de base de datos en Supabase y securizando tus protocolos de comunicación."
    },
    {
        q: "¿De quién es la propiedad intelectual?",
        a: "Los datos y la instancia del sistema son 100% tuyos. Implementamos sobre tu propia infraestructura cloud para garantizar soberanía tecnológica total."
    },
    {
        q: "¿Cómo se escala el sistema?",
        a: "Nuestra arquitectura distribuida permite manejar desde una agencia boutique hasta una franquicia nacional con miles de propiedades sin pérdida de rendimiento."
    },
    {
        q: "¿Por qué no contratar un desarrollador independiente más barato?",
        a: "Un freelancer puede construir partes del sistema, pero no el ecosistema. Necesitarías contratar por separado: diseñador UX, desarrollador backend, experto en CRM, especialista en IA y alguien que los integre. El proceso toma meses, los errores de integración son costosos, y cuando algo falla, nadie es responsable. Con Cima Pro tienes un solo equipo, un solo contrato y un solo punto de responsabilidad."
    },
    {
        q: "¿En cuánto tiempo comienza a generar resultados?",
        a: "La mayoría de nuestros clientes registran su primer lead calificado en los primeros 7 días post-lanzamiento. El Portal de Propietarios comienza a generar exclusivas nuevas desde la primera reunión en que lo demuestras."
    },
    {
        q: "¿Funciona si ya tengo un CRM o sitio web?",
        a: "Sí. Realizamos una auditoría de lo que ya tienes y decidimos qué migramos, qué integramos y qué reemplazamos. El objetivo es no tirar nada que funcione, sino potenciarlo dentro del ecosistema."
    },
    {
        q: "¿Qué pasa si quiero expandirme a otra ciudad?",
        a: "El sistema está diseñado para escalar geográficamente. Agregar una nueva ciudad o sucursal es una configuración de días, no meses. Ya tienes la infraestructura lista para crecer."
    }
];

export default function CimaProPage() {
    const [isTableModalOpen, setIsTableModalOpen] = useState(false);
    return (
        <div className="min-h-screen bg-cima-bg text-cima-text selection:bg-cima-gold selection:text-cima-bg overflow-x-hidden">
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-cima-gold/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#C8A96E 1px, transparent 1px), linear-gradient(90deg, #C8A96E 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
            </div>

            {/* Nav sutil */}
            <nav className="fixed top-0 inset-x-0 h-20 border-b border-cima-border bg-cima-bg/80 backdrop-blur-xl z-50">
                <div className="max-w-7xl mx-auto h-full px-4 sm:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-cima-gold rounded-xl flex items-center justify-center shadow-lg shadow-cima-gold/20">
                            <Building2 className="h-5 w-5 text-cima-bg" />
                        </div>
                        <span className="font-heading font-black text-lg md:text-xl tracking-tight">Cima <span className="text-cima-gold">Pro</span></span>
                    </div>
                    <div className="flex items-center gap-8">
                        <Link
                            href="https://wa.me/528121980008"
                            className="hidden md:block text-[11px] font-bold uppercase tracking-widest text-cima-text-muted hover:text-cima-gold transition-colors"
                        >
                            Arquitectura
                        </Link>
                        <Link
                            href="https://wa.me/528121980008"
                            className="px-6 py-2.5 rounded-full bg-cima-gold text-cima-bg text-[11px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-cima-gold/20"
                        >
                            Agendar Demo
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="pt-28 sm:pt-40 pb-28 sm:pb-20 relative z-10">
                {/* Hero */}
                <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-16 sm:mb-40">
                    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr,0.9fr] gap-10 lg:gap-32 items-center">
                        <FadeIn direction="right">
                            <div className="relative">
                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cima-gold/10 border border-cima-gold/20 mb-8">
                                    <span className="w-1.5 h-1.5 rounded-full bg-cima-gold animate-pulse" />
                                    <span className="font-mono text-[10px] text-cima-gold font-bold tracking-[0.2em] uppercase">V2 Enterprise·2026</span>
                                </span>
                                <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-7xl mb-6 sm:mb-8 leading-[1.1] md:leading-[1.05] tracking-tighter">
                                    Infraestructura Elite para Agencias de <span className="text-transparent bg-clip-text bg-gradient-to-r from-cima-gold via-cima-gold-light to-cima-gold">Alto Rendimiento</span>
                                </h1>
                                <p className="text-cima-text-dim text-base sm:text-xl leading-relaxed mb-8 sm:mb-12 max-w-xl">
                                    No estamos vendiendo una web. Estamos desplegando una infraestructura personalizada de grado empresarial que te da soberanía tecnológica total.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-6 items-center">
                                    <Link
                                        href="https://wa.me/528121980008?text=Hola!%20Me%20interesa%20solicitar%20un%20despliegue%20Enterprise%20de%20Cima%20Pro."
                                        className="w-full sm:w-auto h-14 md:h-16 px-8 md:px-10 rounded-2xl bg-cima-gold text-cima-bg font-bold text-sm md:text-base hover:bg-cima-gold-light hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group shadow-2xl shadow-cima-gold/20"
                                    >
                                        Solicitar Despliegue Enterprise
                                        <ArrowRight className="h-4 w-4 md:h-5 md:w-5 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                    <div className="flex -space-x-4 items-center">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className="w-11 h-11 rounded-full border-2 border-cima-bg bg-cima-card flex items-center justify-center text-[10px] font-bold shadow-lg">
                                                {String.fromCharCode(64 + i)}
                                            </div>
                                        ))}
                                        <div className="pl-6">
                                            <p className="text-[11px] font-black text-cima-text uppercase tracking-widest">+120 Agencias</p>
                                            <p className="text-[10px] text-cima-text-muted font-medium">Arquitecturas Desplegadas</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                        <FadeIn direction="left" className="relative">
                            <div className="absolute -inset-10 bg-cima-gold/5 blur-[100px] rounded-full pointer-events-none" />
                            <LiveActivityFeed />
                        </FadeIn>
                    </div>
                </section>

                {/* Ecosystem Section */}
                <section id="ecosistema" className="max-w-7xl mx-auto px-4 sm:px-8 mb-24 sm:mb-60 relative">
                    <div className="text-center mb-0">
                        <FadeIn>
                            <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-[0.45em] mb-4 block">Omni-Connected Systems</span>
                            <h2 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl mb-4 sm:mb-6 tracking-tight">
                                Arquitectura Integrada 360</h2>
                            <p className="text-cima-text-dim max-w-2xl mx-auto text-lg leading-relaxed">
                                Un sistema de sistemas. Conectamos cada punto de contacto de tu agencia en un solo flujo de datos automatizado y de alta conversión.
                            </p>
                        </FadeIn>
                    </div>

                    <InteractiveEcosystem />
                </section>

                {/* Features Grid */}
                <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-16 sm:mb-40">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8">
                        {FEATURES.map((feature, i) => (
                            <FadeIn key={i} delay={0.1 * i}>
                                <TiltCard className="h-full">
                                    <div className="h-full rounded-3xl bg-cima-card/30 border border-cima-border p-10 backdrop-blur-sm hover:border-cima-gold/40 transition-all group flex flex-col justify-between shadow-2xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-cima-gold/5 rounded-full blur-2xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="relative z-10">
                                            <div className="mb-8 w-14 h-14 rounded-2xl bg-cima-gold/10 border border-cima-gold/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-cima-gold/20 transition-all duration-500 shadow-lg">
                                                {feature.icon}
                                            </div>
                                            <span className="text-[10px] font-black text-cima-gold uppercase tracking-widest mb-3 block opacity-80">{feature.badge}</span>
                                            <h3 className="font-heading font-bold text-xl mb-4 group-hover:text-cima-gold transition-colors">{feature.title}</h3>
                                            <p className="text-sm text-cima-text-muted leading-relaxed font-medium">{feature.description}</p>
                                        </div>
                                    </div>
                                </TiltCard>
                            </FadeIn>
                        ))}
                    </div>
                </section>

                {/* Tech Stack / Infrastructure Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-40 relative">
                    <FadeIn>
                        <div className="rounded-3xl bg-cima-card/50 border border-cima-border p-8 sm:p-16 backdrop-blur-md relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-cima-gold/10 rounded-full blur-[120px] -mr-32 -mt-32 opacity-30" />
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                                <div className="relative z-10">
                                    <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-[0.4em] mb-6 block">Enterprise Infrastructure</span>
                                    <h2 className="font-heading font-black text-4xl sm:text-5xl mb-8 leading-tight">Tecnología de Grado <span className="text-cima-gold">Industrial Inmobiliario</span></h2>
                                    <p className="text-cima-text-dim text-lg leading-relaxed mb-10 font-medium">
                                        No usamos "website builders" genéricos. Desplegamos una arquitectura distribuida que escala contigo, garantizando tiempos de respuesta de milisegundos y seguridad absoluta.
                                    </p>
                                    <div className="grid grid-cols-2 gap-8">
                                        {[
                                            { label: "Core de Datos", val: "PostgreSQL" },
                                            { label: "Entrenamiento AI", val: "Custom Embeddings" },
                                            { label: "Protocolos", val: "API Layered / Auth0" },
                                            { label: "Hosting", val: "Global Distribution" }
                                        ].map((stat, i) => (
                                            <div key={i} className="border-l-2 border-cima-gold/40 pl-5">
                                                <p className="text-[10px] uppercase font-black text-cima-text-muted tracking-[0.2em] mb-1">{stat.label}</p>
                                                <p className="text-base font-bold text-cima-text">{stat.val}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="relative aspect-square sm:aspect-video lg:aspect-square rounded-3xl bg-cima-bg/80 border border-cima-border overflow-hidden group shadow-inner">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cima-gold/10 via-transparent to-transparent opacity-60" />
                                    <div className="absolute inset-0 flex items-center justify-center p-12">
                                        <div className="grid grid-cols-3 gap-8 sm:gap-12 w-full max-w-md">
                                            {[ShieldCheck, Zap, Globe, MessageCircle, BarChart3, UserCheck].map((Icon, i) => (
                                                <div key={i} className="aspect-square rounded-3xl bg-cima-card/80 border border-cima-border flex items-center justify-center shadow-2xl transform transition-all duration-700 hover:scale-110 hover:border-cima-gold/50 group-hover:shadow-cima-gold/10">
                                                    <Icon className="h-8 w-8 sm:h-10 sm:w-10 text-cima-gold" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </section>

                {/* Visual Showcase / Experience Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-24 md:mb-40">
                    <div className="text-center mb-24">
                        <FadeIn>
                            <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-[0.4em] mb-6 block">Premium Interfaces</span>
                            <h2 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-cima-text tracking-tight">Experiencia de Usuario de <span className="text-cima-gold">Clase Mundial</span></h2>
                            <p className="text-cima-text-dim max-w-2xl mx-auto text-lg leading-relaxed mt-4">
                                No solo diseñamos páginas. Creamos sistemas operativos visuales que facilitan el trabajo del asesor y enamoran al cliente final.
                            </p>
                        </FadeIn>
                    </div>

                    <FadeIn>
                        <ExperienceShowcase />
                    </FadeIn>
                </section>

                {/* ROI Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-40 relative">
                    <FadeIn>
                        <RoiCalculator />
                    </FadeIn>
                </section>

                {/* Process Section */}
                <section className="max-w-5xl mx-auto px-4 sm:px-8 mb-40 relative">
                    <FadeIn>
                        <div className="text-center mb-24">
                            <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-[0.5em] mb-6 block">Strategic Rollout</span>
                            <h2 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-cima-text tracking-tight">Despliegue en 3 Fases</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-20 relative">
                            {/* Dotted Line connector */}
                            <div className="hidden md:block absolute top-14 left-0 right-0 h-px border-t border-dashed border-cima-border -z-10" />

                            {[
                                { step: "01", title: "Arquitectura", desc: "Mapeo tecnológico, branding de lujo y configuración de nodo cloud." },
                                { step: "02", title: "Integración AI", desc: "Entrenamiento de algoritmos y activación de flujos de automatización n8n." },
                                { step: "03", title: "Provisioning", desc: "Sincronización, auditoría de seguridad y lanzamiento global." }
                            ].map((s, i) => (
                                <div key={i} className="flex flex-col items-center text-center group">
                                    <div className="w-28 h-28 rounded-full bg-cima-bg border-2 border-cima-border flex items-center justify-center mb-10 relative transition-all duration-500 group-hover:border-cima-gold ring-8 ring-cima-bg shadow-xl">
                                        <div className="absolute inset-0 rounded-full animate-ping bg-cima-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <span className="text-3xl font-heading font-black text-cima-gold">{s.step}</span>
                                    </div>
                                    <h4 className="font-heading font-bold text-2xl text-cima-text mb-5 tracking-tight group-hover:text-cima-gold transition-colors">{s.title}</h4>
                                    <p className="text-base text-cima-text-muted leading-relaxed font-medium">{s.desc}</p>
                                </div>
                            ))}
                        </div>
                    </FadeIn>
                </section>

                {/* Pricing Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-40 relative">
                    <FadeIn>
                        <div className="text-center mb-20">
                            <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-[0.4em] mb-6 block">Strategic Investment</span>
                            <h2 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-cima-text">Modelos de Despliegue</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {[
                                {
                                    name: "Starter Implementation",
                                    price: "$45k",
                                    desc: "Para asesores que buscan posicionarse en el mercado de ultra-lujo.",
                                    features: ["Landing Elite Individual", "Fichas Automáticas", "IA Intelligence Básica", "Soporte Vía Desk"],
                                    button: "Comenzar Setup",
                                    highlight: false,
                                    delivery: "4 – 6 semanas",
                                    deliveryNote: "Kick-off + auditoría de marca incluidos"
                                },
                                {
                                    name: "Enterprise Pro",
                                    price: "$85k",
                                    desc: "La arquitectura completa para dominar mercados locales.",
                                    features: ["Ecosistema 360 Full", "Portales de Cliente Ilimitados", "IA Pro Avanzada", "Automatización CRM", "SLA 24/7 Priority"],
                                    button: "Solicitar Despliegue",
                                    highlight: true,
                                    delivery: "8 – 12 semanas",
                                    deliveryNote: "Incluye sprints de configuración y capacitación"
                                },
                                {
                                    name: "Global Elite",
                                    price: "$120k+",
                                    desc: "Estructura masiva para agencias nacionales e internacionales.",
                                    features: ["Multimarca Dinámica", "IA de Análisis Predictivo", "Infraestructura Dedicada", "Partner Success Manager"],
                                    button: "Contactar Partners",
                                    highlight: false,
                                    delivery: "12 – 20 semanas",
                                    deliveryNote: "Discovery, arquitectura custom y despliegue escalonado"
                                }
                            ].map((plan, i) => (
                                <div key={i} className={`p-8 md:p-12 rounded-[32px] md:rounded-[40px] border transition-all duration-700 flex flex-col relative overflow-visible group ${plan.highlight ? "bg-cima-card border-cima-gold shadow-[0_40px_100px_rgba(200,169,110,0.1)] md:scale-105 z-20" : "bg-cima-bg/40 border-cima-border/50 scale-100 opacity-90 hover:opacity-100 hover:border-cima-gold/30 md:hover:scale-[1.02]"}`}>
                                    {plan.highlight && (
                                        <div className="absolute -top-4 right-8 bg-cima-gold text-cima-bg text-[10px] font-black uppercase tracking-[0.2em] py-1.5 px-5 rounded-full shadow-lg z-30">Most Scalable</div>
                                    )}
                                    <h4 className="font-heading font-bold text-xl md:text-2xl mb-2 tracking-tight group-hover:text-cima-gold transition-colors">{plan.name}</h4>
                                    <div className="mb-4">
                                        <span className="text-4xl md:text-5xl font-black text-cima-gold tracking-tighter">{plan.price}</span>
                                        <span className="text-cima-text-dim text-[10px] md:text-xs ml-3 font-mono font-bold uppercase tracking-widest opacity-60">One-Time Fee</span>
                                    </div>
                                    {/* Delivery time */}
                                    <div className="flex items-start gap-2 mb-6 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                                        <Calendar className="w-3.5 h-3.5 text-cima-gold shrink-0 mt-0.5" />
                                        <div>
                                            <span className="text-[10px] font-black text-cima-gold uppercase tracking-widest block">{plan.delivery}</span>
                                            <span className="text-[9px] text-cima-text-dim italic">{plan.deliveryNote}</span>
                                        </div>
                                    </div>
                                    <p className="text-cima-text-muted text-sm mb-8 md:mb-10 leading-relaxed font-medium min-h-[48px]">{plan.desc}</p>
                                    <ul className="space-y-4 md:space-y-5 mb-10 md:mb-12 flex-1">
                                        {plan.features.map((f, j) => (
                                            <li key={j} className="flex items-start gap-3 md:gap-4 text-xs md:text-sm text-cima-text-dim/80 font-medium">
                                                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-cima-gold/10 flex items-center justify-center shrink-0 mt-0.5">
                                                    <ShieldCheck className="h-2.5 w-2.5 md:h-3 md:w-3 text-cima-gold" />
                                                </div>
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                    <Link
                                        href={`https://wa.me/528121980008?text=Hola!%20Me%20interesa%20el%20plan%20${encodeURIComponent(plan.name)}.`}
                                        className={`w-full py-4 md:py-5 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] transition-all duration-500 shadow-xl flex items-center justify-center ${plan.highlight ? "bg-cima-gold text-cima-bg hover:bg-cima-gold-light" : "bg-cima-card border border-cima-border text-cima-text hover:border-cima-gold/30"}`}
                                    >
                                        {plan.button}
                                    </Link>
                                </div>
                            ))}
                        </div>

                        {/* Scarcity note */}
                        <div className="mt-12 flex items-center justify-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                            <p className="text-sm text-cima-text-dim font-mono font-bold text-center">
                                <span className="text-white">Cupo limitado:</span> Solo tomamos <span className="text-cima-gold">3 nuevas agencias por ciudad</span> cada mes para garantizar la calidad del despliegue.
                            </p>
                        </div>
                    </FadeIn>
                </section>

                {/* Comparison Table */}
                <section className="max-w-5xl mx-auto px-4 sm:px-8 mb-40 relative">
                    <FadeIn>
                        <div className="text-center mb-14">
                            <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-[0.4em] mb-4 block">Análisis de Valor</span>
                            <h2 className="font-heading font-black text-4xl sm:text-5xl text-cima-text tracking-tight">Cima Pro vs. La Alternativa Tradicional</h2>
                            <p className="text-cima-text-dim mt-4 text-base max-w-xl mx-auto">Lo que muchos intentan armar por su cuenta termina costando el doble y tardando 3 veces más.</p>
                        </div>

                        {/* Desktop Table (Visible on md+) */}
                        <div className="hidden md:block rounded-3xl border border-cima-border overflow-hidden">
                            <div className="w-full">
                                {/* Header */}
                                <div className="grid grid-cols-3 bg-cima-card/60">
                                    <div className="p-5 border-r border-cima-border" />
                                    <div className="p-5 border-r border-cima-border text-center">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-cima-text-dim block">Solución Tradicional</span>
                                        <span className="text-[9px] text-cima-text-dim/50">(freelancers + CRM + diseñador)</span>
                                    </div>
                                    <div className="p-5 text-center bg-cima-gold/5">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-cima-gold block">Cima Pro</span>
                                        <span className="text-[9px] text-cima-gold/50">Ecosistema Unificado</span>
                                    </div>
                                </div>
                                {/* Rows */}
                                {[
                                    { item: "Costo total estimado", trad: "$60k–$150k+ fragmentado", cima: "$45k–$120k todo incluido", cimaGood: true },
                                    { item: "Tiempo de implementación", trad: "6–18 meses", cima: "4–20 semanas", cimaGood: true },
                                    { item: "Portales de Propietarios", trad: "No existe / extra", cima: "Incluido", cimaGood: true },
                                    { item: "IA de calificación de leads", trad: "No existe", cima: "Nativa en el sistema", cimaGood: true },
                                    { item: "Landing individual por propiedad", trad: "Manual, semanas por página", cima: "Automática al publicar", cimaGood: true },
                                    { item: "Mantenimiento y actualizaciones", trad: "Pagar a distintos proveedores", cima: "Un solo punto de contacto", cimaGood: true },
                                    { item: "Propiedad de los datos", trad: "Dependiente de plataformas", cima: "100% tuya en tu cloud", cimaGood: true },
                                ].map((row, i) => (
                                    <div key={i} className={`grid grid-cols-3 border-t border-cima-border ${i % 2 === 0 ? "bg-white/[0.01]" : ""}`}>
                                        <div className="p-5 flex items-center border-r border-cima-border">
                                            <span className="text-[11px] font-bold text-cima-text">{row.item}</span>
                                        </div>
                                        <div className="p-5 flex items-center justify-center border-r border-cima-border">
                                            <span className="text-[11px] text-red-400/80 font-medium text-center">{row.trad}</span>
                                        </div>
                                        <div className="p-5 flex items-center justify-center bg-cima-gold/[0.03]">
                                            <span className="text-[11px] text-cima-gold font-bold text-center">{row.cima}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Mobile Trigger Button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsTableModalOpen(true)}
                                className="w-full p-8 rounded-3xl bg-cima-card border border-cima-gold/30 flex flex-col items-center gap-4 group active:scale-95 transition-all shadow-2xl shadow-cima-gold/5"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-cima-gold/10 flex items-center justify-center">
                                    <BarChart3 className="h-8 w-8 text-cima-gold" />
                                </div>
                                <div className="text-center">
                                    <p className="text-cima-text font-black text-xl mb-1">Ver Análisis de Valor</p>
                                    <p className="text-cima-text-dim text-xs">Comparativa Cima Pro vs Tradicional</p>
                                </div>
                                <div className="flex items-center gap-2 text-cima-gold text-[10px] font-black uppercase tracking-widest mt-2">
                                    Abrir Comparativa <ArrowRight className="h-3 w-3" />
                                </div>
                            </button>
                        </div>
                    </FadeIn>

                    {/* Fullscreen Modal Table */}
                    <AnimatePresence>
                        {isTableModalOpen && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[100] bg-cima-bg/95 backdrop-blur-2xl flex items-center justify-center p-4"
                            >
                                <motion.div
                                    initial={{ scale: 0.9, y: 20 }}
                                    animate={{ scale: 1, y: 0 }}
                                    exit={{ scale: 0.9, y: 20 }}
                                    className="w-full max-w-4xl bg-cima-card border border-cima-border rounded-[40px] shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col"
                                >
                                    <button
                                        onClick={() => setIsTableModalOpen(false)}
                                        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-500/20 hover:border-red-500/30 transition-all z-20"
                                    >
                                        <X className="h-5 w-5 text-white" />
                                    </button>

                                    <div className="p-8 border-b border-cima-border flex flex-col items-center">
                                        <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-[0.4em] mb-2 block text-center">Análisis de Valor</span>
                                        <h3 className="font-heading font-black text-2xl text-cima-text text-center">Cima Pro vs Tradicional</h3>
                                    </div>

                                    <div className="flex-1 overflow-auto p-4 sm:p-8">
                                        <div className="rounded-2xl border border-cima-border overflow-hidden min-w-[500px]">
                                            <div className="grid grid-cols-3 bg-white/5 font-black text-[10px] uppercase tracking-widest">
                                                <div className="p-4 border-r border-cima-border">Punto</div>
                                                <div className="p-4 border-r border-cima-border text-center text-red-300">Tradicional</div>
                                                <div className="p-4 text-center text-cima-gold">Cima Pro</div>
                                            </div>
                                            {[
                                                { item: "Costo total", trad: "$60k–$150k+", cima: "$45k–$120k", cimaGood: true },
                                                { item: "Implementación", trad: "6–18 meses", cima: "4–20 semanas", cimaGood: true },
                                                { item: "Portales Prop.", trad: "No existe", cima: "Incluido", cimaGood: true },
                                                { item: "Lead AI", trad: "Manual", cima: "Nativo AI", cimaGood: true },
                                                { item: "Landings", trad: "Días/Semanas", cima: "Instantáneo", cimaGood: true },
                                                { item: "Mantenimiento", trad: "Fragmentado", cima: "Unificado", cimaGood: true },
                                                { item: "Soberanía Datos", trad: "Media/Baja", cima: "100% Tuya", cimaGood: true },
                                            ].map((row, i) => (
                                                <div key={i} className="grid grid-cols-3 border-t border-cima-border text-[11px]">
                                                    <div className="p-4 border-r border-cima-border font-bold text-cima-text-dim">{row.item}</div>
                                                    <div className="p-4 border-r border-cima-border text-center text-red-200/60 font-medium">{row.trad}</div>
                                                    <div className="p-4 text-center text-cima-gold font-black bg-cima-gold/5">{row.cima}</div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-8 p-6 rounded-2xl bg-cima-gold text-cima-bg text-center">
                                            <p className="font-black text-sm uppercase tracking-widest mb-1 italic">Veredicto Final</p>
                                            <p className="text-xs font-bold font-heading">Cima Pro ofrece un ROI de +350% vs soluciones tradicionales en el primer año.</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>

                {/* FAQ Section */}
                <section className="max-w-4xl mx-auto px-4 sm:px-8 mb-40 relative">
                    <FadeIn>
                        <div className="text-center mb-16">
                            <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-[0.4em] mb-4 block">Information Node</span>
                            <h2 className="font-heading font-black text-4xl sm:text-5xl text-cima-text tracking-tight">Preguntas Frecuentes</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                            {FAQS.map((faq, i) => (
                                <div key={i} className="p-8 rounded-3xl bg-cima-card/30 border border-cima-border hover:border-cima-gold/30 transition-all duration-500 backdrop-blur-sm group">
                                    <h4 className="font-bold text-xl text-cima-text mb-4 flex items-center gap-4 transition-colors group-hover:text-cima-gold">
                                        <div className="w-2 h-2 rounded-full bg-cima-gold shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                                        {faq.q}
                                    </h4>
                                    <p className="text-cima-text-dim text-base leading-relaxed pl-6 font-medium">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </FadeIn>
                </section>

                {/* CTA Final */}
                <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-32">
                    <FadeIn>
                        <div className="rounded-[40px] bg-cima-gold p-10 sm:p-20 flex flex-col lg:flex-row items-center justify-between gap-16 overflow-hidden relative shadow-2xl shadow-cima-gold/10">
                            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/10 rounded-full blur-[120px] -mr-96 -mt-96 pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-black/5 rounded-full blur-[100px] -ml-96 -mb-96 pointer-events-none" />

                            <div className="relative z-10 max-w-2xl text-center lg:text-left">
                                <h2 className="font-heading font-black text-4xl sm:text-6xl text-cima-bg mb-8 leading-[1.1] tracking-tighter">
                                    Diseñado para cerrar tratos de +$100k
                                </h2>
                                <p className="text-cima-bg/80 text-lg sm:text-xl font-bold mb-12 max-w-xl mx-auto lg:mx-0">
                                    No compitas por precio. Domina por infraestructura. El sistema que posiciona tu agencia en el 1% del mercado inmobiliario.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
                                    <Link
                                        href="https://wa.me/528121980008"
                                        className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-cima-bg text-cima-gold font-black text-xs uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-black/20 flex items-center justify-center gap-3"
                                    >
                                        Contactar Especialista
                                        <MessageCircle className="h-5 w-5" />
                                    </Link>
                                    <p className="text-cima-bg/60 font-mono text-[10px] font-bold uppercase tracking-widest">Disponibilidad Limitada x Mes</p>
                                </div>
                            </div>

                            <div className="relative z-10 hidden lg:block">
                                <div className="p-8 rounded-[32px] bg-cima-bg/20 backdrop-blur-md border border-white/20 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-700">
                                    <div className="space-y-6">
                                        {[
                                            "Control total de la marca y exclusivas",
                                            "Ahorro de 15h semanales x asesor",
                                            "Leads Premium de alta conversión",
                                            "Arquitectura Cloud Propia"
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center gap-4 text-cima-bg font-black text-sm uppercase tracking-tighter">
                                                <div className="w-6 h-6 rounded-full bg-cima-bg/20 flex items-center justify-center border border-white/20">
                                                    <ShieldCheck className="h-4 w-4" />
                                                </div>
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </section>
            </main>

            {/* Floating UI */}
            <VideoDemoBubble />

            {/* Sticky mobile CTA */}
            <div className="fixed bottom-0 inset-x-0 z-40 sm:hidden">
                <div className="bg-cima-bg/95 backdrop-blur-xl border-t border-cima-border px-5 py-3 md:py-4 flex items-center gap-4">
                    <div className="flex-1">
                        <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-cima-gold">Cupo limitado</p>
                        <p className="text-[10px] md:text-[11px] text-white font-bold leading-tight">Solo 3 agencias por ciudad/mes</p>
                    </div>
                    <Link
                        href="https://wa.me/528121980008?text=Hola!%20Quiero%20agendar%20una%20demo%20de%20Cima%20Pro."
                        className="shrink-0 px-4 md:px-5 py-2.5 md:py-3 rounded-xl md:rounded-2xl bg-cima-gold text-cima-bg text-[10px] md:text-[11px] font-black uppercase tracking-widest"
                    >
                        Agendar Demo
                    </Link>
                </div>
            </div>

            <footer className="border-t border-cima-border py-20 bg-cima-bg relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 justify-between items-center gap-10">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <Building2 className="h-6 w-6 text-cima-gold" />
                                <span className="font-heading font-black text-xl tracking-tight text-white uppercase">Cima <span className="text-cima-gold">Pro</span></span>
                            </div>
                            <p className="text-[10px] text-cima-text-dim font-bold uppercase tracking-[0.3em] max-w-xs">
                                Software de Alto Rendimiento para el Top 1% Mobiliario en Latinoamérica.
                            </p>
                        </div>
                        <div className="flex items-center gap-8 md:justify-end">
                            <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-cima-text-muted hover:text-cima-gold transition-all">Principal</Link>
                            <Link href="/admin" className="text-[10px] font-black uppercase tracking-widest text-cima-text-muted hover:text-cima-gold transition-all">Admin Node</Link>
                            <Link href="/propiedades" className="text-[10px] font-black uppercase tracking-widest text-cima-text-muted hover:text-cima-gold transition-all">Ecosystem</Link>
                        </div>
                    </div>
                    <div className="mt-20 pt-8 border-t border-cima-border flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-[9px] text-cima-text-dim font-mono tracking-widest uppercase">© 2026 CIMA INFRASTRUCTURE. ALL RIGHTS RESERVED.</p>
                        <div className="flex gap-4">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[9px] text-cima-text-dim font-mono tracking-widest uppercase">Nodes Online · 100% Operational</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
