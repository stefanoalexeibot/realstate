"use client";

import Link from "next/link";
import Image from "next/image";
import {
    ShieldCheck, Zap, Globe, MessageCircle, BarChart3,
    ArrowRight, Sparkles, Building2, UserCheck, Layout
} from "lucide-react";
import { motion } from "framer-motion";
import FadeIn from "@/components/landing/fade-in";
import { useState } from "react";

function RoiCalculator() {
    const [price, setPrice] = useState(5000000);
    const [commission, setCommission] = useState(5);
    const [monthlyProp, setMonthlyProp] = useState(2);

    const totalComm = (price * (commission / 100));
    const monthlyIncome = totalComm * monthlyProp;
    const timeSavedValue = (monthlyProp * 15 * 500); // 15 horas x propiedad x $500/hr

    return (
        <div className="bg-cima-bg/60 border border-cima-border rounded-2xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
            <h3 className="font-heading font-bold text-xl text-cima-gold mb-8 text-center sm:text-left">Calculadora de Impacto Financiero</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                    <div>
                        <label className="text-[10px] uppercase tracking-widest font-bold text-cima-text-dim block mb-3">Precio promedio propiedad</label>
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
                        <label className="text-[10px] uppercase tracking-widest font-bold text-cima-text-dim block mb-3">% Comisión de Agencia</label>
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
                        <label className="text-[10px] uppercase tracking-widest font-bold text-cima-text-dim block mb-3">Propiedades por mes</label>
                        <input
                            type="number" value={monthlyProp} onChange={(e) => setMonthlyProp(Number(e.target.value))}
                            className="w-full bg-cima-card border border-cima-border rounded-xl p-3 text-cima-text font-bold text-sm focus:border-cima-gold outline-none transition-colors"
                        />
                    </div>
                </div>

                <div className="bg-cima-gold/5 rounded-2xl p-6 sm:p-8 border border-cima-gold/10 flex flex-col justify-center">
                    <div className="space-y-6">
                        <div>
                            <p className="text-[10px] uppercase font-bold text-cima-gold tracking-widest mb-1 italic">Potencial de Ingresos al mes</p>
                            <p className="text-3xl sm:text-4xl font-heading font-extrabold text-cima-text">
                                ${new Intl.NumberFormat().format(monthlyIncome)}
                            </p>
                        </div>
                        <div className="pt-6 border-t border-cima-gold/10">
                            <p className="text-[10px] uppercase font-bold text-cima-text-dim tracking-widest mb-1">Valor de tiempo ahorrado x mes</p>
                            <p className="text-xl font-bold text-cima-gold">
                                ${new Intl.NumberFormat().format(timeSavedValue)} +
                            </p>
                            <p className="text-[9px] text-cima-text-dim mt-2 italic">* Calculado basado en 15hrs de ahorro operativo por propiedad.</p>
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
    }
];

export default function CimaProPage() {
    return (
        <div className="min-h-screen bg-cima-bg text-cima-text selection:bg-cima-gold selection:text-cima-bg overflow-x-hidden">
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-cima-gold/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#C8A96E 1px, transparent 1px), linear-gradient(90deg, #C8A96E 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
            </div>

            {/* Nav sutil */}
            <nav className="fixed top-0 inset-x-0 h-16 border-b border-cima-border bg-cima-bg/80 backdrop-blur-xl z-50">
                <div className="max-w-7xl mx-auto h-full px-4 sm:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-cima-gold rounded-lg flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-cima-bg" />
                        </div>
                        <span className="font-heading font-bold text-lg tracking-tight">Cima <span className="text-cima-gold">Pro</span></span>
                    </div>
                    <Link
                        href="https://wa.me/528116307133"
                        className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-cima-gold hover:text-cima-gold-light transition-colors mr-2 sm:mr-0"
                    >
                        Agendar Demo
                    </Link>
                </div>
            </nav>

            <main className="pt-32 pb-20">
                {/* Hero */}
                <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-32">
                    <FadeIn>
                        <div className="max-w-3xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cima-gold/10 border border-cima-gold/20 mb-6">
                                <Sparkles className="h-3 w-3 text-cima-gold" />
                                <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-widest">El Sistema Definitivo para Inmobiliarias</span>
                            </div>
                            <h1 className="font-heading font-bold text-4xl sm:text-6xl lg:text-7xl leading-[1.1] mb-8">
                                Infraestructura Elite para <br />
                                <span className="text-cima-gold">Agencias de Alto Rendimiento.</span>
                            </h1>
                            <p className="text-lg sm:text-xl text-cima-text-dim mb-10 leading-relaxed max-w-2xl">
                                Despliegue de tecnología personalizada de grado empresarial. Una arquitectura diseñada para dominar el mercado, ganar exclusivas y proteger el activo más valioso de tu agencia: los datos.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <Link
                                    href="https://wa.me/528116307133"
                                    className="w-full sm:w-auto px-8 py-4 rounded-xl bg-cima-gold text-cima-bg font-bold text-sm hover:bg-cima-gold-light transition-all flex items-center justify-center gap-2 shadow-lg shadow-cima-gold/20"
                                >
                                    Solicitar Despliegue Enterprise
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                                <Link
                                    href="/admin/propiedades"
                                    className="w-full sm:w-auto px-8 py-4 rounded-xl bg-cima-card border border-cima-border text-cima-text font-bold text-sm hover:border-cima-gold/30 transition-all text-center"
                                >
                                    Ver Ecosistema
                                </Link>
                            </div>
                        </div>
                    </FadeIn>
                </section>

                {/* Features Grid */}
                <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-32">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {FEATURES.map((feature, i) => (
                            <FadeIn key={i} delay={i * 0.1}>
                                <div className="p-8 rounded-2xl bg-cima-card border border-cima-border hover:border-cima-gold/30 transition-all group relative overflow-hidden h-full">
                                    <div className="absolute top-0 right-0 p-4">
                                        <span className="text-[9px] font-mono font-bold text-cima-gold/50 uppercase tracking-widest">{feature.badge}</span>
                                    </div>
                                    <div className="w-12 h-12 rounded-xl bg-cima-bg border border-cima-border flex items-center justify-center mb-6 group-hover:border-cima-gold/30 transition-colors">
                                        {feature.icon}
                                    </div>
                                    <h3 className="font-heading font-bold text-xl text-cima-text mb-4">{feature.title}</h3>
                                    <p className="text-cima-text-dim leading-relaxed text-sm">
                                        {feature.description}
                                    </p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </section>

                {/* Tech Stack / Infrastructure Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-32 relative z-10">
                    <FadeIn>
                        <div className="rounded-3xl bg-cima-card/50 border border-cima-border p-8 sm:p-12 backdrop-blur-md relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-cima-gold/5 rounded-full blur-3xl -mr-20 -mt-20" />
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <div>
                                    <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-[0.4em] mb-4 block">Enterprise Tech Stack</span>
                                    <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">Infraestructura de Grado Inmobiliario Elite</h2>
                                    <p className="text-cima-text-dim leading-relaxed mb-8">
                                        Desplegamos una arquitectura distribuida que conecta bases de datos relacionales de alta seguridad con motores de automatización industrial. No es una aplicación, es una red de datos diseñada para la escalabilidad.
                                    </p>
                                    <div className="grid grid-cols-2 gap-6">
                                        {[
                                            { label: "Base de Datos", val: "PostgreSQL" },
                                            { label: "Motor AI", val: "Llama 3 / GPT-4" },
                                            { label: "Auth", val: "Google Enterprise" },
                                            { label: "Hosting", val: "Vercel Edge" }
                                        ].map((stat, i) => (
                                            <div key={i} className="border-l border-cima-gold/30 pl-4">
                                                <p className="text-[9px] uppercase font-bold text-cima-text-muted tracking-widest">{stat.label}</p>
                                                <p className="text-sm font-bold text-cima-text">{stat.val}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="relative aspect-video rounded-2xl bg-cima-bg border border-cima-border overflow-hidden group">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cima-gold/10 via-transparent to-transparent opacity-50" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="grid grid-cols-3 gap-8">
                                            {[ShieldCheck, Zap, Globe, MessageCircle, BarChart3, UserCheck].map((Icon, i) => (
                                                <div key={i} className="w-16 h-16 rounded-2xl bg-cima-card border border-cima-border flex items-center justify-center shadow-2xl transform transition-all duration-700 hover:scale-110 hover:border-cima-gold/50 group-hover:animate-pulse" style={{ animationDelay: `${i * 100}ms` }}>
                                                    <Icon className="h-8 w-8 text-cima-gold" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </section>

                {/* ROI Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-32">
                    <FadeIn>
                        <RoiCalculator />
                    </FadeIn>
                </section>

                {/* Closing Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-8">
                    <div className="rounded-3xl bg-cima-gold p-8 sm:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />

                        <div className="relative z-10 max-w-xl">
                            <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-cima-bg mb-6">
                                Diseñado para cerrar tratos de +$100k
                            </h2>
                            <ul className="space-y-4 mb-10">
                                {[
                                    "Control total de la marca y exclusivas",
                                    "Ahorro de hasta 15 horas semanales por asesor",
                                    "Leads calificados directo a tu WhatsApp",
                                    "Soporte y actualizaciones constantes"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-cima-bg font-bold text-sm">
                                        <div className="w-5 h-5 rounded-full bg-cima-bg/10 flex items-center justify-center">
                                            <ShieldCheck className="h-3 w-3 text-cima-bg" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="https://wa.me/528116307133"
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-cima-bg text-cima-gold font-bold text-sm hover:opacity-90 transition-opacity"
                            >
                                Contactar Especialista
                                <MessageCircle className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Ecosystem Showcase */}
                <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-32 relative z-10">
                    <FadeIn>
                        <div className="text-center mb-16">
                            <h2 className="font-heading font-bold text-3xl sm:text-5xl mb-6 tracking-tight">Arquitectura <span className="text-cima-gold">Integrada 360</span></h2>
                            <p className="text-cima-text-dim max-w-2xl mx-auto text-lg leading-relaxed">No es una web, es una red de sistemas interconectados que trabajan en sincronía técnica total.</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            {[
                                {
                                    title: "Portal del Asesor",
                                    desc: "Control total de inventario, leads y generación de fichas en segundos.",
                                    img: "/mockups/admin-mockup.png",
                                    link: "/admin"
                                },
                                {
                                    title: "Portal del Propietario",
                                    desc: "La herramienta definitiva para ganar exclusivas con transparencia total.",
                                    img: "/mockups/owner-portal.png",
                                    icon: <UserCheck className="h-8 w-8 text-cima-gold" />
                                },
                                {
                                    title: "Landing de Propiedad",
                                    desc: "El escaparate de lujo que tus mejores casas merecen.",
                                    img: "/mockups/property-landing.png",
                                    link: "/propiedades"
                                }
                            ].map((item, i) => (
                                <div key={i} className="group flex flex-col items-center text-center">
                                    <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border border-cima-border bg-cima-card/50 mb-8 transform transition-all duration-500 group-hover:-translate-y-3 group-hover:shadow-[0_20px_50px_rgba(200,169,110,0.15)] group-hover:border-cima-gold/30">
                                        <Image
                                            src={item.img}
                                            alt={item.title}
                                            fill
                                            className="object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-cima-bg via-transparent to-transparent opacity-80" />

                                        {/* Overlay para Items sin link real aún */}
                                        {!item.link?.startsWith('/') && (
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="p-4 rounded-2xl bg-cima-bg/90 backdrop-blur-md border border-cima-gold/20 shadow-2xl">
                                                    {item.icon || <Sparkles className="h-8 w-8 text-cima-gold" />}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <h4 className="font-heading font-bold text-2xl text-cima-text group-hover:text-cima-gold transition-colors mb-3 tracking-snug">{item.title}</h4>
                                    <p className="text-base text-cima-text-dim leading-relaxed px-4">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </FadeIn>
                </section>

                {/* Process Section */}
                <section className="max-w-5xl mx-auto px-4 sm:px-8 mb-40 relative z-10">
                    <FadeIn>
                        <div className="text-center mb-20">
                            <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-[0.4em] mb-4 block">Deployment Phase</span>
                            <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-cima-text">Despliegue Estratégico en 3 Fases</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
                            {/* Dotted Line connector */}
                            <div className="hidden md:block absolute top-12 left-0 right-0 h-px border-t-2 border-dashed border-cima-border -z-10" />

                            {[
                                { step: "01", title: "Arquitectura", desc: "Mapeo de activos, arquitectura de marca y configuración de nodo cloud dedicado." },
                                { step: "02", title: "Integración AI", desc: "Sincronización de flujos de automatización y entrenamiento de algoritmos de zona." },
                                { step: "03", title: "Provisioning", desc: "Migración de inventario, auditoría de seguridad y lanzamiento de la instancia elite." }
                            ].map((s, i) => (
                                <div key={i} className="flex flex-col items-center text-center">
                                    <div className="w-20 h-20 rounded-full bg-cima-bg border-4 border-cima-border flex items-center justify-center mb-8 relative bg-cima-bg ring-8 ring-cima-bg">
                                        <span className="text-2xl font-heading font-black text-cima-gold">{s.step}</span>
                                    </div>
                                    <h4 className="font-heading font-bold text-xl text-cima-text mb-4">{s.title}</h4>
                                    <p className="text-sm text-cima-text-dim leading-relaxed">{s.desc}</p>
                                </div>
                            ))}
                        </div>
                    </FadeIn>
                </section>

                {/* Comparison Section */}
                <section className="max-w-4xl mx-auto px-4 sm:px-8 mb-40 relative z-10">
                    <FadeIn>
                        <div className="text-center mb-16">
                            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-cima-text">Por qué las agencias eligen Cima Pro</h2>
                        </div>

                        <div className="rounded-3xl border border-cima-border bg-cima-card/30 overflow-hidden shadow-2xl backdrop-blur-md">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-cima-border bg-cima-bg/50">
                                        <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-cima-text-dim">Métrica</th>
                                        <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-cima-text-dim border-l border-cima-border">Inmuebles Tradicionales</th>
                                        <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-cima-gold border-l border-cima-border bg-cima-gold/5">Cima Pro</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {[
                                        ["Tiempo de Ficha", "2-3 Horas (Manual)", "3 Segundos (Auto)"],
                                        ["Diseño", "Genérico / Básico", "Ultra-Premium (SaaS)"],
                                        ["Transparencia", "Correos / WhatsApp", "Portal Propietario 24/7"],
                                        ["IA Entorno", "Investigación Manual", "Procesado x IA Instantáneo"],
                                        ["Conversión", "Baja (Links externos)", "Cierre 3x más rápido"]
                                    ].map((row, i) => (
                                        <tr key={i} className="border-b border-cima-border last:border-0 hover:bg-cima-gold/5 transition-colors">
                                            <td className="p-6 font-bold text-cima-text-muted">{row[0]}</td>
                                            <td className="p-6 text-cima-text-dim border-l border-cima-border">{row[1]}</td>
                                            <td className="p-6 text-cima-gold font-bold border-l border-cima-border bg-cima-gold/5">{row[2]}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </FadeIn>
                </section>

                {/* Pricing Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-40 relative z-10">
                    <FadeIn>
                        <div className="text-center mb-16">
                            <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-[0.4em] mb-4 block">Inversión Estratégica</span>
                            <h2 className="font-heading font-bold text-3xl sm:text-5xl text-cima-text">Modelos de Despliegue</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    name: "Starter Implementation",
                                    price: "$45k",
                                    desc: "Perfecto para asesores independientes de alto nivel.",
                                    features: ["Landing de Propiedad Elite", "Fichas Técnicas PDF Pro", "IA Intelligence Básica", "Soporte Estándar"],
                                    button: "Comenzar Setup",
                                    highlight: false
                                },
                                {
                                    name: "Enterprise Pro",
                                    price: "$85k",
                                    desc: "La arquitectura completa para agencias en crecimiento.",
                                    features: ["Ecosistema 360 Full", "Portal Propietario Ilimitado", "IA Nexus Avanzada", "Integración CRM via n8n", "SLA de Soporte 24/7"],
                                    button: "Solicitar Despliegue",
                                    highlight: true
                                },
                                {
                                    name: "Global Elite",
                                    price: "$120k+",
                                    desc: "Para franquicias y grupos con múltiples marcas.",
                                    features: ["Multimarca / Multi-dominio", "IA de Análisis Predictivo", "Infraestructura Cloud Dedicada", "Consultoría Estratégica", "Soporte Concierge"],
                                    button: "Contactar Partners",
                                    highlight: false
                                }
                            ].map((plan, i) => (
                                <div key={i} className={`p-10 rounded-3xl border transition-all duration-500 flex flex-col ${plan.highlight ? "bg-cima-card border-cima-gold shadow-[0_0_50px_rgba(200,169,110,0.15)] scale-105 z-20" : "bg-cima-bg/40 border-cima-border opacity-80"}`}>
                                    {plan.highlight && (
                                        <div className="bg-cima-gold text-cima-bg text-[10px] font-bold uppercase tracking-widest py-1 px-4 rounded-full w-fit mb-6 mx-auto">Recomendado</div>
                                    )}
                                    <h4 className="font-heading font-bold text-xl mb-2">{plan.name}</h4>
                                    <div className="mb-6">
                                        <span className="text-4xl font-extrabold text-cima-gold">{plan.price}</span>
                                        <span className="text-cima-text-dim text-xs ml-2 font-mono uppercase">Un Pago único</span>
                                    </div>
                                    <p className="text-cima-text-muted text-sm mb-8 leading-relaxed h-12">{plan.desc}</p>
                                    <ul className="space-y-4 mb-10 flex-1">
                                        {plan.features.map((f, j) => (
                                            <li key={j} className="flex items-start gap-3 text-xs text-cima-text-dim">
                                                <ShieldCheck className="h-4 w-4 text-cima-gold shrink-0 mt-0.5" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                    <button className={`w-full py-4 rounded-xl font-bold text-sm transition-all ${plan.highlight ? "bg-cima-gold text-cima-bg hover:opacity-90" : "bg-cima-card border border-cima-border text-cima-text hover:border-cima-gold/30"}`}>
                                        {plan.button}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </FadeIn>
                </section>

                {/* FAQ Section */}
                <section className="max-w-3xl mx-auto px-4 sm:px-8 mb-40 relative z-10">
                    <FadeIn>
                        <h2 className="font-heading font-bold text-3xl sm:text-4xl text-cima-text mb-12 text-center">Preguntas Frecuentes</h2>
                        <div className="space-y-4">
                            {FAQS.map((faq, i) => (
                                <div key={i} className="p-6 rounded-2xl bg-cima-card/30 border border-cima-border hover:border-cima-gold/20 transition-all">
                                    <h4 className="font-bold text-lg text-cima-text mb-2 flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-cima-gold" />
                                        {faq.q}
                                    </h4>
                                    <p className="text-cima-text-dim text-sm leading-relaxed pl-5">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </FadeIn>
                </section>

            </main>

            <footer className="border-t border-cima-border py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <p className="text-xs text-cima-text-dim">© 2026 Cima Propiedades. Software de Alto Rendimiento Inmobiliario.</p>
                    <div className="flex items-center gap-6">
                        <Link href="/" className="text-[10px] font-bold uppercase tracking-widest text-cima-text-muted hover:text-cima-gold transition-colors">Landing Principal</Link>
                        <Link href="/admin" className="text-[10px] font-bold uppercase tracking-widest text-cima-text-muted hover:text-cima-gold transition-colors">Portal Admin</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
