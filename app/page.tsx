import React from "react";
import Link from "next/link";
import {
  Building2, MapPin, Star, ArrowRight,
  ChevronRight, Shield, Clock, Percent, Camera,
  Users, FileCheck, CheckCircle2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { MotionSpan, MotionDiv } from "@/components/landing/motion-wrapper";
import PropertyCard from "@/components/landing/property-card";
import SellForm from "@/components/landing/sell-form";
import HeroCaptureForm from "@/components/landing/hero-capture-form";
import ProfitCalculator from "@/components/landing/profit-calculator";
import GuaranteeFaq from "@/components/landing/guarantee-faq";
import SectionHeader from "@/components/landing/section-header";
import StatsMarquee from "@/components/landing/stats-marquee";
import FadeIn from "@/components/landing/fade-in";
import AnimatedCounter from "@/components/landing/animated-counter";
import AsistenteDemo from "@/components/landing/asistente-demo";
import TiltCard from "@/components/landing/tilt-card";
import SocialProofToast from "@/components/landing/social-proof-toast";
import ProcessLine from "@/components/landing/process-line";
import ScrollProgress from "@/components/landing/scroll-progress";
import ExitIntent from "@/components/landing/exit-intent";
import BeforeAfterSlider from "@/components/landing/before-after-slider";
import LandingNav from "@/components/landing/landing-nav";
import RotatingZone from "@/components/landing/rotating-zone";
import AuroraHero from "@/components/landing/aurora-hero";
import BenefitsSection from "@/components/landing/benefits-section";

import PriceEstimator from "@/components/landing/price-estimator";
import type { Property } from "@/lib/types";
import { ZONES } from "@/lib/zones";

const PROCESS_STEPS = [
  {
    day: "Día 0",
    icon: CheckCircle2,
    title: "Valuación gratuita",
    desc: "Visitamos tu propiedad, analizamos el mercado y te damos el precio óptimo para vender rápido.",
  },
  {
    day: "Días 1–2",
    icon: Camera,
    title: "Fotos & publicación",
    desc: "Sesión profesional de fotos y video. Publicamos en todos los portales y redes el mismo día.",
  },
  {
    day: "Días 3–21",
    icon: Users,
    title: "Visitas con compradores",
    desc: "Filtramos interesados serios. Coordinamos visitas y te reportamos cada semana.",
  },
  {
    day: "Antes del día 30",
    icon: FileCheck,
    title: "Prospecto encontrado",
    desc: "Presentamos al comprador calificado, negociamos el mejor precio y firmamos la promesa de compraventa. El proceso notarial inicia de inmediato.",
  },
];

const TESTIMONIALS = [
  {
    name: "María González",
    zone: "Casa en San Jerónimo",
    days: 18,
    stars: 5,
    text: "Teníamos la casa con otra inmobiliaria 4 meses sin resultado. Con Cima la vendimos en 18 días y al precio que pedimos.",
  },
  {
    name: "Carlos Ibarra",
    zone: "Departamento en Obispado",
    days: 22,
    stars: 5,
    text: "El proceso fue rapidísimo. Las fotos quedaron increíbles y a los 22 días ya teníamos comprador. Muy profesionales.",
  },
  {
    name: "Sofía Ramírez",
    zone: "Casa en Cumbres",
    days: 27,
    stars: 5,
    text: "Al principio dudé del 5%, pero con lo que me ahorro vs. la otra agencia y lo rápido que vendieron, valió cada peso.",
  },
];

const GUARANTEES = [
  {
    icon: Clock,
    title: "30 días o no cobramos",
    desc: "Si tu propiedad no se vende en 30 días desde que la publicamos, nuestra comisión es cero.",
  },
  {
    icon: Percent,
    title: "Comisión desde 6%",
    desc: "Sin cuotas iniciales, sin mensualidades, sin cargos ocultos. La comisión varía según el valor de tu propiedad y se paga al escriturar.",
  },
  {
    icon: Shield,
    title: "Exclusiva de 60 días",
    desc: "Trabajamos en exclusiva para darte dedicación total: marketing pagado, calificación de compradores y negociación profesional.",
  },
];


export default async function HomePage() {
  const supabase = createClient();

  const [
    { data: featuredProps },
    { count: activeProps },
    { data: soldData },
  ] = await Promise.all([
    supabase.from("re_properties").select("*").eq("status", "active").eq("featured", true).order("created_at", { ascending: false }).limit(3),
    supabase.from("re_properties").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("re_properties").select("days_to_sell").eq("status", "sold").not("days_to_sell", "is", null),
  ]);

  const featured = (featuredProps ?? []) as Property[];
  const soldCount = soldData?.length ?? 0;
  const avgDays = soldData && soldData.length > 0
    ? Math.round(soldData.reduce((s, p) => s + (p.days_to_sell ?? 0), 0) / soldData.length)
    : 22;

  return (
    <div className="min-h-screen bg-cima-bg">
      <ScrollProgress />

      <ExitIntent />


      {/* ── NAVBAR ─────────────────────────────── */}
      <LandingNav />

      {/* ── STATS MARQUEE ──────────────────────── */}
      <StatsMarquee />

      {/* ── HERO ───────────────────────────────── */}
      <section className="relative pt-28 pb-20 px-6 overflow-hidden min-h-[90vh] flex items-center">
        {/* Background FX */}
        <AuroraHero />
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0 opacity-[0.018]"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, #C8A96E 1px, transparent 0)",
              backgroundSize: "52px 52px",
            }}
          />
          {/* Diagonal architectural lines */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="100%" x2="40%" y2="0" stroke="#C8A96E" strokeWidth="1" />
            <line x1="100%" y1="100%" x2="60%" y2="0" stroke="#C8A96E" strokeWidth="1" />
            <line x1="50%" y1="100%" x2="50%" y2="0" stroke="#C8A96E" strokeWidth="1" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-6xl w-full">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 xl:gap-16 items-center">

            {/* Left — copy */}
            <FadeIn>
              <div>
                {/* Tag */}
                <div className="inline-flex items-center gap-2 rounded-full border border-cima-gold/25 bg-cima-gold/5 px-4 py-1.5 mb-7">
                  <span className="h-1.5 w-1.5 rounded-full bg-cima-gold animate-pulse" />
                  <span className="font-mono text-xs text-cima-gold tracking-widest uppercase">Garantía de venta · </span>
                  <RotatingZone />
                </div>

                {/* Headline */}
                <h1 className="font-heading font-bold leading-[1.04] mb-6">
                  <MotionSpan
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-cima-text block text-5xl sm:text-6xl lg:text-7xl"
                  >
                    Vendemos tu casa
                  </MotionSpan>
                  <MotionSpan
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-cima-gold block text-5xl sm:text-6xl lg:text-7xl"
                  >
                    en menos de 30 días.
                  </MotionSpan>
                  <MotionSpan
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-cima-text-muted block text-3xl sm:text-4xl lg:text-5xl mt-1"
                  >
                    Garantizado.
                  </MotionSpan>
                </h1>

                <p className="text-base sm:text-lg text-cima-text-muted leading-relaxed mb-8 max-w-xl">
                  Comisión <span className="text-cima-text font-medium">desde 6%</span>, pagadera al escriturar.
                  Exclusiva de 60 días con dedicación total.{" "}
                  <span className="text-cima-text font-medium">Si no vendemos en 30 días, no cobramos.</span>
                </p>

                {/* Stats chips */}
                <MotionDiv
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex flex-wrap gap-2.5 mb-10"
                >
                  {([
                    {
                      val: <AnimatedCounter to={soldCount > 0 ? soldCount : 85} suffix="+" className="font-heading font-bold text-lg text-cima-gold leading-none tabular-nums" />,
                      label: "casas vendidas",
                    },
                    {
                      val: <AnimatedCounter to={avgDays} suffix=" días" className="font-heading font-bold text-lg text-cima-gold leading-none tabular-nums" />,
                      label: "tiempo promedio",
                    },
                    {
                      val: <span className="font-heading font-bold text-lg text-cima-gold leading-none">Desde 6%</span>,
                      label: "de comisión",
                    },
                    {
                      val: <AnimatedCounter to={activeProps ?? 5} className="font-heading font-bold text-lg text-cima-gold leading-none tabular-nums" />,
                      label: "disponibles hoy",
                    },
                  ] as { val: React.ReactNode; label: string }[]).map((s, i) => (
                    <MotionDiv
                      key={s.label}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.5 + (i * 0.05) }}
                      className="flex flex-col items-center rounded-2xl border border-cima-border bg-cima-card px-4 py-2.5 min-w-[80px]"
                    >
                      {s.val}
                      <span className="font-mono text-[9px] text-cima-text-dim uppercase tracking-widest mt-0.5">{s.label}</span>
                    </MotionDiv>
                  ))}
                </MotionDiv>

                {/* Mobile CTA */}
                <div className="flex gap-3 xl:hidden">
                  <a
                    href="#vender"
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-cima-gold px-5 py-3 font-heading font-bold text-sm text-cima-bg hover:bg-cima-gold-light transition-colors"
                  >
                    Vender mi casa <ArrowRight className="h-4 w-4" />
                  </a>
                  <Link
                    href="/propiedades"
                    className="flex items-center gap-2 rounded-xl border border-cima-border px-5 py-3 font-heading font-semibold text-sm text-cima-text-muted hover:border-cima-gold/40 hover:text-cima-text transition-colors"
                  >
                    Ver catálogo
                  </Link>
                </div>
              </div>
            </FadeIn>

            {/* Right — hero form */}
            <FadeIn direction="left" delay={0.15} className="hidden xl:block">
              <HeroCaptureForm />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── BENEFITS SECTION ────────────────────── */}
      <BenefitsSection />

      {/* ── BEFORE / AFTER SLIDER ──────────────── */}
      <BeforeAfterSlider />

      {/* ── PRICE ESTIMATOR ─────────────────────── */}
      <PriceEstimator />

      {/* ── PROFIT CALCULATOR ───────────────────── */}
      <section id="calculadora" className="px-6 py-16 border-t border-cima-border/50">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left copy */}
            <FadeIn>
              <div>
                <p className="font-mono text-[10px] tracking-[0.2em] text-cima-gold uppercase mb-3">Calculadora</p>
                <h2 className="font-heading font-bold text-3xl sm:text-4xl text-cima-text mb-4 leading-tight">
                  ¿Cuánto recibirías por tu casa?
                </h2>
                <p className="text-sm text-cima-text-muted leading-relaxed mb-6">
                  Mueve el slider y ve en tiempo real cuánto recibes por tu casa.
                  Además, ve todo lo que está incluido sin costo adicional.
                </p>
                <div className="space-y-3">
                  {[
                    "Comisión competitiva desde 3%, se paga al escriturar",
                    "Fotografía y video profesional sin costo extra",
                    "Decoración, limpieza y remodelación virtual con IA",
                    "Publicidad digital pagada en todos los portales desde el día 1",
                    "Solo pagas si vendemos. Cero riesgo.",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2.5">
                      <div className="h-4 w-4 rounded-full bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center shrink-0 mt-0.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-cima-gold" />
                      </div>
                      <p className="text-sm text-cima-text-muted">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Right — calculator */}
            <FadeIn direction="left" delay={0.15}>
              <ProfitCalculator />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── PROCESS TIMELINE ────────────────────── */}
      <section className="px-6 py-16 border-t border-cima-border/50">
        <div className="mx-auto max-w-5xl">
          <SectionHeader tag="Proceso" title="De valuación a llave en mano" subtitle="Todo en menos de 30 días." className="mb-12" />

          {/* Desktop horizontal timeline */}
          <div className="hidden md:block relative">
            {/* Connector line — animates on scroll */}
            <ProcessLine />

            <div className="grid grid-cols-4 gap-4 relative">
              {PROCESS_STEPS.map((step, i) => (
                <div key={step.title} className="flex flex-col items-center text-center">
                  {/* Circle */}
                  <div className={`relative z-10 h-11 w-11 rounded-full border-2 flex items-center justify-center mb-5 ${i === 3
                    ? "border-cima-gold bg-cima-gold"
                    : "border-cima-gold/50 bg-cima-bg"
                    }`}>
                    <step.icon className={`h-4 w-4 ${i === 3 ? "text-cima-bg" : "text-cima-gold"}`} />
                  </div>

                  {/* Day tag */}
                  <span className="font-mono text-[10px] tracking-widest text-cima-gold uppercase mb-2">{step.day}</span>

                  {/* Title */}
                  <h3 className="font-heading font-semibold text-sm text-cima-text mb-2">{step.title}</h3>

                  {/* Desc */}
                  <p className="text-xs text-cima-text-muted leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile vertical timeline */}
          <div className="md:hidden space-y-0">
            {PROCESS_STEPS.map((step, i) => (
              <div key={step.title} className="flex gap-4">
                {/* Left: circle + line */}
                <div className="flex flex-col items-center">
                  <div className={`h-10 w-10 rounded-full border-2 flex items-center justify-center shrink-0 ${i === 3
                    ? "border-cima-gold bg-cima-gold"
                    : "border-cima-gold/50 bg-cima-bg"
                    }`}>
                    <step.icon className={`h-4 w-4 ${i === 3 ? "text-cima-bg" : "text-cima-gold"}`} />
                  </div>
                  {i < PROCESS_STEPS.length - 1 && (
                    <div className="w-px flex-1 bg-gradient-to-b from-cima-gold/30 to-cima-border mt-1 mb-1" style={{ minHeight: 40 }} />
                  )}
                </div>

                {/* Right: content */}
                <div className="pb-8 pt-1">
                  <span className="font-mono text-[10px] tracking-widest text-cima-gold uppercase">{step.day}</span>
                  <h3 className="font-heading font-semibold text-sm text-cima-text mt-1 mb-1">{step.title}</h3>
                  <p className="text-xs text-cima-text-muted leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ASISTENTE VIRTUAL ───────────────────── */}
      <AsistenteDemo />

      {/* ── TESTIMONIALS ────────────────────────── */}
      <section className="px-6 py-16 border-t border-cima-border/50">
        <div className="mx-auto max-w-5xl">
          <SectionHeader tag="Resultados reales" title="Lo que dicen quienes ya vendieron" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <FadeIn key={t.name} delay={i * 0.1} className="h-full">
                <TiltCard className="h-full">
                  <div
                    className="rounded-2xl border border-cima-border bg-cima-card p-6 flex flex-col h-full"
                  >
                    {/* Days chip — most important metric */}
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-cima-gold/10 border border-cima-gold/25 px-3 py-1 mb-5 w-fit">
                      <Clock className="h-3 w-3 text-cima-gold" />
                      <span className="font-mono text-xs text-cima-gold font-semibold">Vendida en {t.days} días</span>
                    </div>

                    {/* Stars */}
                    <div className="flex gap-0.5 mb-3">
                      {Array.from({ length: t.stars }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-cima-gold text-cima-gold" />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-sm text-cima-text-muted leading-relaxed flex-1 mb-5">
                      &ldquo;{t.text}&rdquo;
                    </p>

                    {/* Person */}
                    <div className="flex items-center gap-2.5 pt-4 border-t border-cima-border">
                      <div className="h-8 w-8 rounded-full bg-cima-gold/10 border border-cima-gold/20 flex items-center justify-center">
                        <span className="font-bold text-xs text-cima-gold">{t.name[0]}</span>
                      </div>
                      <div>
                        <p className="font-medium text-xs text-cima-text">{t.name}</p>
                        <p className="font-mono text-[10px] text-cima-text-dim">{t.zone}</p>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── SELL CTA ────────────────────────────── */}
      <section id="vender" className="px-6 py-20 border-t border-cima-border/50">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-cima-gold/20 bg-gradient-to-br from-cima-card via-cima-surface/50 to-cima-card p-8 md:p-12 gold-glow">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
              {/* Left */}
              <div>
                <p className="font-mono text-[10px] tracking-[0.2em] text-cima-gold uppercase mb-3">Empieza hoy</p>
                <h2 className="font-heading font-bold text-3xl sm:text-4xl text-cima-text mb-4 leading-tight">
                  Solicita tu valuación
                  <br />
                  <span className="text-cima-gold">gratuita y sin compromiso.</span>
                </h2>
                <p className="text-sm text-cima-text-muted leading-relaxed mb-7">
                  En menos de 24 horas un asesor de Cima visita tu propiedad, te da el precio
                  óptimo de mercado y te explica el plan de venta. Sin costo, sin firmas.
                </p>
                <div className="space-y-3">
                  {[
                    { icon: CheckCircle2, text: "Valuación comparativa de mercado gratuita" },
                    { icon: Camera, text: "Sesión de fotos y video profesional" },
                    { icon: Users, text: "Solo compradores pre-calificados" },
                    { icon: FileCheck, text: "Asesoría legal incluida hasta notaría" },
                    { icon: Shield, text: "Si no vendemos en 30 días, no cobramos" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-full bg-cima-gold/10 border border-cima-gold/25 flex items-center justify-center shrink-0">
                        <Icon className="h-2.5 w-2.5 text-cima-gold" />
                      </div>
                      <p className="text-sm text-cima-text-muted">{text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — form */}
              <div className="rounded-xl border border-cima-border bg-cima-card p-6">
                <SellForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED PROPERTIES ─────────────────── */}
      {featured.length > 0 && (
        <section className="px-6 py-16 border-t border-cima-border/50">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="font-mono text-[10px] tracking-[0.2em] text-cima-gold uppercase mb-2">Catálogo</p>
                <h2 className="font-heading font-bold text-2xl text-cima-text">Propiedades disponibles</h2>
              </div>
              <Link href="/propiedades" className="flex items-center gap-1.5 text-sm text-cima-text-muted hover:text-cima-gold transition-colors">
                Ver todas
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((p, i) => (
                <PropertyCard key={p.id} property={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── ZONES ───────────────────────────────── */}
      <section className="px-6 py-16 border-t border-cima-border/50">
        <div className="mx-auto max-w-6xl">
          <SectionHeader tag="Cobertura" title="Zonas donde vendemos" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {ZONES.map((zone) => (
              <Link
                key={zone.name}
                href={`/propiedades/en/${zone.slug}`}
                className="group rounded-xl border border-cima-border bg-cima-card px-5 py-4 hover:border-cima-gold/40 hover:bg-cima-surface transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-sm text-cima-text group-hover:text-cima-gold-light transition-colors leading-snug">{zone.name}</p>
                    <span className="font-mono text-[9px] tracking-widest text-cima-text-dim uppercase mt-1 block">{zone.tag}</span>
                  </div>
                  <MapPin className="h-3.5 w-3.5 text-cima-text-dim group-hover:text-cima-gold shrink-0 mt-0.5 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────── */}
      <section className="px-6 py-16 border-t border-cima-border/50">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-10">
            <p className="font-mono text-[10px] tracking-[0.2em] text-cima-gold uppercase mb-2">Preguntas frecuentes</p>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-cima-text">
              Sin rodeos, respuestas directas.
            </h2>
          </div>
          <GuaranteeFaq />
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────── */}
      <footer className="border-t border-cima-border px-6 py-10">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center">
              <Building2 className="h-3.5 w-3.5 text-cima-gold" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-heading font-bold text-sm text-cima-text">Cima Propiedades</span>
              <span className="font-mono text-[9px] tracking-[0.15em] text-cima-text-muted uppercase">Tu casa vendida en 30 días · Monterrey N.L.</span>
            </div>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/propiedades" className="text-xs text-cima-text-muted hover:text-cima-text transition-colors">Ver propiedades</Link>
            <Link href="#calculadora" className="text-xs text-cima-text-muted hover:text-cima-text transition-colors">Calculadora</Link>
            <Link href="#vender" className="text-xs text-cima-text-muted hover:text-cima-text transition-colors">Vender</Link>
            <Link href="/admin" className="text-xs text-cima-text-dim hover:text-cima-text-muted transition-colors">Admin</Link>
          </nav>
          <p className="font-mono text-[10px] text-cima-text-dim">
            © {new Date().getFullYear()} Cima Propiedades
          </p>
        </div>
      </footer>

      {/* ── SOCIAL PROOF TOAST ─────────────────── */}
      <SocialProofToast />


    </div>
  );
}
