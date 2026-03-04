"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Building2, Check, ArrowRight, DollarSign, Users,
    Copy, CheckCircle2, ChevronDown, Zap, Gift,
    TrendingUp, Share2, MessageSquare, ShieldCheck, Clock
} from "lucide-react";
import FadeIn from "@/components/landing/fade-in";

const WA_NUMBER = "528121980008";
const PLAN_PRICE = 14900;
const COMMISSION = PLAN_PRICE * 0.10; // 1490

// ─── Slug generator ────────────────────────────────────────────────────────
function toSlug(name: string) {
    return name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s]/g, "")
        .trim()
        .replace(/\s+/g, "-");
}

// ─── Earnings Calculator ───────────────────────────────────────────────────
function EarningsCalculator() {
    const [count, setCount] = useState(3);
    const earnings = count * COMMISSION;

    return (
        <div className="bg-white/[0.02] border border-white/10 rounded-[24px] p-6 md:p-10">
            <p className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-[0.3em] mb-4">
                Simulador de ganancias
            </p>
            <h3 className="text-xl md:text-2xl font-heading font-bold mb-8">
                ¿Cuánto puedes ganar?
            </h3>

            <div className="mb-8">
                <label className="text-[9px] uppercase font-bold text-white/40 block mb-4">
                    Asesores que refieres al mes
                </label>
                <div className="grid grid-cols-4 gap-2">
                    {[1, 3, 5, 10].map(val => (
                        <button
                            key={val}
                            onClick={() => setCount(val)}
                            className={`py-3 rounded-xl border text-sm font-black transition-all ${count === val
                                ? "bg-cima-gold text-black border-cima-gold shadow-lg shadow-cima-gold/20"
                                : "bg-white/5 border-white/10 text-white/40 hover:border-cima-gold/30"
                                }`}
                        >
                            {val}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-cima-gold/5 border border-cima-gold/20 rounded-2xl p-6 text-center relative overflow-hidden">
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-cima-gold/10 blur-[40px] rounded-full" />
                <p className="text-[9px] uppercase font-bold text-cima-gold/60 tracking-[0.2em] mb-2">
                    Ganancia mensual estimada
                </p>
                <motion.p
                    key={earnings}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-4xl md:text-5xl font-heading font-black text-white relative z-10"
                >
                    ${new Intl.NumberFormat("es-MX").format(earnings)}
                    <span className="text-cima-gold"> MXN</span>
                </motion.p>
                <p className="text-[10px] text-white/30 font-mono mt-2">
                    {count} referido{count > 1 ? "s" : ""} × ${new Intl.NumberFormat("es-MX").format(COMMISSION)} c/u
                </p>
            </div>
        </div>
    );
}

// ─── FAQ ───────────────────────────────────────────────────────────────────
function Faq() {
    const faqs = [
        {
            q: "¿Necesito ser cliente de Aurum?",
            a: "No. El programa está abierto para cualquier persona. Si conoces a alguien en bienes raíces, puedes participar y ganar."
        },
        {
            q: "¿Cuándo me pagan?",
            a: "Cuando el asesor que referiste cierra su contrato con Aurum y realiza su pago, te transferimos tu 10% directo a tu cuenta. Normalmente en menos de 48 horas."
        },
        {
            q: "¿Cómo saben que el referido es mío?",
            a: "Cada vez que alguien agenda su demo usando tu link, su solicitud llega a nosotros con tu nombre incluido automáticamente. No hay confusión posible."
        },
        {
            q: "¿Hay límite de referidos?",
            a: "Ninguno. Puedes referir a todos los asesores que quieras. El único límite es el número de asesores que conozcas."
        },
        {
            q: "¿Qué pasa si el asesor no cierra?",
            a: "Solo se paga cuando hay cierre. Si agendaron demo pero no contrataron, no hay comisión — pero tampoco pierdes nada."
        },
    ];
    const [open, setOpen] = useState<number | null>(null);

    return (
        <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((f, i) => (
                <div key={i} className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden hover:border-cima-gold/20 transition-all">
                    <button
                        onClick={() => setOpen(open === i ? null : i)}
                        className="w-full p-5 text-left flex items-center justify-between gap-4"
                    >
                        <span className="text-sm font-bold text-white/80">{f.q}</span>
                        <div className={`h-6 w-6 rounded-full border border-white/10 flex items-center justify-center shrink-0 transition-transform duration-300 ${open === i ? "rotate-180 bg-cima-gold border-cima-gold" : ""}`}>
                            <ChevronDown className={`h-3 w-3 ${open === i ? "text-black" : "text-cima-gold"}`} />
                        </div>
                    </button>
                    <AnimatePresence>
                        {open === i && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="px-5 pb-5 text-sm text-white/50 leading-relaxed border-t border-white/5 pt-4">
                                    {f.a}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    );
}

// ─── Referral Form ─────────────────────────────────────────────────────────
function ReferralForm() {
    const [form, setForm] = useState({ nombre: "", whatsapp: "" });
    const [submitted, setSubmitted] = useState(false);
    const [copied, setCopied] = useState(false);
    const [origin, setOrigin] = useState("https://aurum.mx");

    useEffect(() => {
        setOrigin(window.location.origin);
    }, []);

    const slug = toSlug(form.nombre);
    const referralLink = `${origin}/agenda?ref=${slug}`;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        const msg = `Hola, quiero unirme al programa de afiliados de Aurum 🏆\n\n*Nombre:* ${form.nombre}\n*WhatsApp:* ${form.whatsapp}\n\nMi link de referido sería:\n${referralLink}`;
        window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
    };

    const copyLink = async () => {
        await navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    const shareWA = () => {
        const msg = `🏆 Te recomiendo Aurum — la plataforma más premium para asesores inmobiliarios en Monterrey.\n\nGestiona tus exclusivas, envía fichas PDF profesionales y dale un portal en tiempo real a tus propietarios.\n\nAgenda tu demo gratis (15 min, sin compromiso):\n${referralLink}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
    };

    if (submitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 md:p-10"
            >
                <div className="text-center mb-8">
                    <div className="h-16 w-16 rounded-full bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="h-8 w-8 text-cima-gold" />
                    </div>
                    <h3 className="text-2xl font-heading font-black text-white mb-2">
                        ¡Bienvenido, {form.nombre.split(" ")[0]}!
                    </h3>
                    <p className="text-white/40 text-sm">
                        Este es tu link personal. Cada vez que alguien lo use para agendar demo, la solicitud llega con tu nombre.
                    </p>
                </div>

                {/* Link display */}
                <div className="bg-black/40 border border-cima-gold/30 rounded-2xl p-4 mb-4">
                    <p className="text-[9px] font-bold text-cima-gold uppercase tracking-widest mb-2">Tu link de referido</p>
                    <p className="text-xs text-white/70 font-mono break-all leading-relaxed">{referralLink}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                    <button
                        onClick={copyLink}
                        className={`flex items-center justify-center gap-2 py-3.5 rounded-xl border font-bold text-xs uppercase tracking-widest transition-all ${copied
                            ? "bg-green-500/10 border-green-500/30 text-green-400"
                            : "bg-white/5 border-white/10 text-white/60 hover:border-cima-gold/30"
                            }`}
                    >
                        {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copied ? "¡Copiado!" : "Copiar link"}
                    </button>
                    <button
                        onClick={shareWA}
                        className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] font-bold text-xs uppercase tracking-widest hover:bg-[#25D366]/20 transition-all"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                        Compartir
                    </button>
                </div>

                <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <Clock className="h-3.5 w-3.5 text-cima-gold shrink-0" />
                    <p className="text-[10px] text-white/40">Te avisamos por WhatsApp cada vez que alguien use tu link y cuando se cierre una venta.</p>
                </div>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-5">
            <div className="text-center mb-6">
                <h3 className="text-2xl md:text-3xl font-heading font-black text-white mb-2">
                    Obtén tu link gratis
                </h3>
                <p className="text-white/40 text-sm">
                    30 segundos. Sin contraseñas. Sin compromisos.
                </p>
            </div>

            {[
                { id: "nombre", label: "Nombre completo", type: "text", placeholder: "Ej. María López", required: true },
                { id: "whatsapp", label: "Tu WhatsApp", type: "tel", placeholder: "81 1234 5678", required: true },
            ].map(f => (
                <div key={f.id}>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">{f.label}</label>
                    <input
                        type={f.type}
                        placeholder={f.placeholder}
                        required={f.required}
                        value={form[f.id as keyof typeof form]}
                        onChange={e => setForm(prev => ({ ...prev, [f.id]: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:border-cima-gold/40 focus:bg-white/[0.07] transition-all outline-none"
                    />
                </div>
            ))}

            {/* Link preview */}
            {form.nombre.length > 2 && (
                <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-cima-gold/5 border border-cima-gold/20 rounded-xl p-3"
                >
                    <p className="text-[8px] font-bold text-cima-gold uppercase tracking-widest mb-1">Tu link quedará así:</p>
                    <p className="text-[11px] text-white/60 font-mono break-all">{referralLink}</p>
                </motion.div>
            )}

            <button
                type="submit"
                className="w-full py-4 bg-cima-gold text-black rounded-2xl font-heading font-black text-xs uppercase tracking-widest hover:scale-[1.02] hover:bg-white transition-all flex items-center justify-center gap-3 shadow-[0_20px_40px_-15px_rgba(200,169,110,0.4)] group/btn"
            >
                Obtener mi link gratis
                <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>

            <p className="text-center text-[10px] text-white/20">
                Sin costo · Sin tarjeta · Sin contraseña
            </p>
        </form>
    );
}

// ─── PAGE ──────────────────────────────────────────────────────────────────
export default function ReferidosPage() {
    const scrollToForm = () => {
        document.getElementById("form-referidos")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-white selection:bg-cima-gold/30 overflow-x-hidden">

            {/* NAV */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-xl bg-black/20">
                <div className="mx-auto max-w-7xl h-16 px-4 md:px-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-lg bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center">
                            <Building2 className="h-3.5 w-3.5 text-cima-gold" />
                        </div>
                        <span className="font-heading font-bold tracking-tight text-white/90 text-sm">Aurum</span>
                    </div>
                    <button
                        onClick={scrollToForm}
                        className="bg-cima-gold text-black px-4 py-2 rounded-full text-xs font-black uppercase tracking-tight hover:bg-white transition-all shadow-lg shadow-cima-gold/10"
                    >
                        Obtener mi link →
                    </button>
                </div>
            </nav>

            {/* HERO */}
            <section className="relative pt-32 md:pt-40 pb-16 md:pb-24 px-4 md:px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full md:w-[900px] h-[500px] bg-cima-gold/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="relative mx-auto max-w-4xl text-center">
                    <FadeIn>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cima-gold/10 border border-cima-gold/20 mb-8">
                            <Gift className="h-3.5 w-3.5 text-cima-gold" />
                            <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-widest">
                                Programa de Afiliados · Aurum
                            </span>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.1}>
                        <div className="mb-6">
                            <p className="text-[11px] md:text-xs font-mono text-white/30 uppercase tracking-[0.3em] mb-3">Gana</p>
                            <p className="text-6xl md:text-8xl lg:text-9xl font-heading font-black text-cima-gold leading-none">
                                $1,490
                            </p>
                            <p className="text-lg md:text-2xl font-heading text-white/60 mt-3">
                                por cada asesor que refieras
                            </p>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.2}>
                        <p className="text-sm md:text-lg text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
                            No necesitas ser cliente de Aurum. Si conoces a alguien en bienes raíces en Monterrey, puedes ganar <span className="text-white font-medium">10% de comisión</span> cuando contraten la plataforma.
                        </p>
                    </FadeIn>

                    <FadeIn delay={0.3}>
                        <button
                            onClick={scrollToForm}
                            className="inline-flex items-center gap-3 px-10 py-5 bg-cima-gold text-black font-heading font-black rounded-2xl hover:scale-105 transition-all shadow-[0_20px_40px_-15px_rgba(200,169,110,0.4)] text-sm uppercase tracking-widest group"
                        >
                            Obtener mi link gratis
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <p className="text-[11px] text-white/20 font-mono mt-4">Sin costo · Sin tarjeta · Listo en 30 segundos</p>
                    </FadeIn>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="py-16 md:py-24 px-4 md:px-6 bg-[#070708] relative">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                <div className="mx-auto max-w-5xl">
                    <FadeIn>
                        <div className="text-center mb-14">
                            <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-[0.4em] mb-4 block">Así de simple</span>
                            <h2 className="text-3xl md:text-5xl font-heading font-bold tracking-tight">
                                3 pasos para ganar
                            </h2>
                        </div>
                    </FadeIn>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                num: "01",
                                icon: Share2,
                                title: "Obtén tu link único",
                                desc: "Registra tu nombre y WhatsApp. En 30 segundos tienes tu link personal de referido.",
                            },
                            {
                                num: "02",
                                icon: MessageSquare,
                                title: "Compártelo con asesores",
                                desc: "Mándalo por WhatsApp a cualquier asesor inmobiliario que conozcas en Monterrey.",
                            },
                            {
                                num: "03",
                                icon: DollarSign,
                                title: "Cobra tu $1,490",
                                desc: "Cuando el asesor contrata Aurum, te transferimos tu 10% directo. Sin esperas raras.",
                            },
                        ].map((step, i) => (
                            <FadeIn key={i} delay={i * 0.1}>
                                <div className="bg-white/[0.02] border border-white/5 rounded-[24px] p-8 relative group hover:border-cima-gold/20 transition-all">
                                    <div className="absolute top-6 right-6 text-[10px] font-mono text-white/10 font-black">{step.num}</div>
                                    <div className="h-12 w-12 rounded-2xl bg-cima-gold/10 border border-cima-gold/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-cima-gold/20 transition-all">
                                        <step.icon className="h-6 w-6 text-cima-gold" />
                                    </div>
                                    <h3 className="text-lg font-heading font-bold mb-3">{step.title}</h3>
                                    <p className="text-sm text-white/50 leading-relaxed">{step.desc}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* EARNINGS CALCULATOR */}
            <section className="py-16 md:py-24 px-4 md:px-6 relative">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cima-gold/10 to-transparent" />
                <div className="mx-auto max-w-3xl">
                    <EarningsCalculator />
                </div>
            </section>

            {/* TRUST SIGNALS */}
            <section className="py-12 px-4 md:px-6 bg-[#070708] relative">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                <div className="mx-auto max-w-5xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { icon: ShieldCheck, title: "Pago garantizado", desc: "Te pagamos en menos de 48h después del cierre" },
                            { icon: Users,       title: "Sin límite",        desc: "Refiere a todos los asesores que quieras" },
                            { icon: Zap,         title: "Sin inversión",     desc: "Gratis para participar. Ganas cuando otros cierran" },
                            { icon: TrendingUp,  title: "10% real",          desc: "$1,490 MXN por cada cierre. Sin letra chica" },
                        ].map((item, i) => (
                            <FadeIn key={i} delay={i * 0.08}>
                                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 text-center group hover:border-cima-gold/20 transition-all">
                                    <div className="h-10 w-10 rounded-full bg-cima-gold/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                        <item.icon className="h-5 w-5 text-cima-gold" />
                                    </div>
                                    <p className="text-xs font-bold text-white mb-1">{item.title}</p>
                                    <p className="text-[10px] text-white/40 leading-relaxed">{item.desc}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* FORM */}
            <section id="form-referidos" className="py-16 md:py-24 px-4 md:px-6 relative">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cima-gold/10 to-transparent" />
                <div className="mx-auto max-w-lg">
                    <FadeIn>
                        <div className="bg-cima-gold/5 border-2 border-cima-gold/30 rounded-[32px] overflow-hidden relative shadow-[0_40px_100px_-20px_rgba(200,169,110,0.15)]">
                            <div className="absolute -top-16 -right-16 w-48 h-48 bg-cima-gold/20 blur-[80px] rounded-full pointer-events-none" />
                            <div className="relative z-10">
                                <ReferralForm />
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-16 md:py-24 px-4 md:px-6 bg-[#070708] relative">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                <div className="mx-auto max-w-5xl">
                    <FadeIn>
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-heading font-bold tracking-tight mb-4">Preguntas frecuentes</h2>
                        </div>
                    </FadeIn>
                    <Faq />
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-10 px-4 md:px-6 bg-black/40 border-t border-white/5">
                <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-lg bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center">
                            <Building2 className="h-3 w-3 text-cima-gold" />
                        </div>
                        <span className="font-heading font-bold text-white/90 text-sm">Aurum</span>
                    </div>
                    <p className="text-[10px] text-white/20 font-mono uppercase tracking-widest text-center">
                        © 2025 Aurum · Monterrey, NL · Programa de Afiliados
                    </p>
                    <a
                        href="/agenda"
                        className="text-[10px] text-cima-gold/50 hover:text-cima-gold font-mono uppercase tracking-widest transition-colors"
                    >
                        Ver plataforma →
                    </a>
                </div>
            </footer>
        </div>
    );
}
