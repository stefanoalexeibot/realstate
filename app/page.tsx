import Link from "next/link";
import {
  Building2, MapPin, Phone, Star, ArrowRight,
  ChevronRight, Shield, Clock, Percent, Camera,
  Users, FileCheck, CheckCircle2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import PropertyCard from "@/components/landing/property-card";
import SellForm from "@/components/landing/sell-form";
import HeroCaptureForm from "@/components/landing/hero-capture-form";
import ProfitCalculator from "@/components/landing/profit-calculator";
import GuaranteeFaq from "@/components/landing/guarantee-faq";
import type { Property } from "@/lib/types";

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
    title: "Firma y cobras",
    desc: "Negociamos el mejor precio. Te acompañamos hasta notaría. Depósito en tu cuenta.",
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
    title: "Solo 5% de comisión",
    desc: "Sin cuotas iniciales, sin mensualidades, sin cargos ocultos. Solo cobras cuando vendemos.",
  },
  {
    icon: Shield,
    title: "Sin exclusividad",
    desc: "Puedes trabajar con otras opciones. Nuestra confianza está en resultados, no en encerrarte.",
  },
];

const ZONES = [
  { name: "San Pedro Garza García", tag: "Premium" },
  { name: "Valle Oriente",          tag: "Ejecutivo" },
  { name: "Cumbres",                tag: "Familiar" },
  { name: "Obispado",               tag: "Histórico" },
  { name: "San Jerónimo",           tag: "Residencial" },
  { name: "Monterrey Centro",       tag: "Inversión" },
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

      {/* ── NAVBAR ─────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-cima-border/50 bg-cima-bg/90 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center">
              <Building2 className="h-4 w-4 text-cima-gold" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-heading font-bold text-sm text-cima-text">Cima</span>
              <span className="font-mono text-[9px] tracking-[0.2em] text-cima-text-muted uppercase">Propiedades</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="#garantia" className="text-sm text-cima-text-muted hover:text-cima-text transition-colors">Garantía</Link>
            <Link href="#calculadora" className="text-sm text-cima-text-muted hover:text-cima-text transition-colors">Calculadora</Link>
            <Link href="/propiedades" className="text-sm text-cima-text-muted hover:text-cima-text transition-colors">Propiedades</Link>
          </nav>

          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_CIMA_WA}?text=Hola,%20quiero%20vender%20mi%20casa%20con%20Cima`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-lg bg-cima-gold/10 border border-cima-gold/30 px-3 py-1.5 text-xs font-mono text-cima-gold hover:bg-cima-gold/20 transition-colors"
          >
            <Phone className="h-3 w-3" />
            WhatsApp
          </a>
        </div>
      </header>

      {/* ── HERO ───────────────────────────────── */}
      <section className="relative pt-28 pb-20 px-6 overflow-hidden min-h-[90vh] flex items-center">
        {/* Background FX */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px] bg-cima-gold/[0.04] rounded-full blur-[140px]" />
          <div
            className="absolute inset-0 opacity-[0.018]"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, #C8A96E 1px, transparent 0)",
              backgroundSize: "52px 52px",
            }}
          />
          {/* Diagonal architectural lines */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="100%" x2="40%" y2="0" stroke="#C8A96E" strokeWidth="1"/>
            <line x1="100%" y1="100%" x2="60%" y2="0" stroke="#C8A96E" strokeWidth="1"/>
            <line x1="50%" y1="100%" x2="50%" y2="0" stroke="#C8A96E" strokeWidth="1"/>
          </svg>
        </div>

        <div className="relative mx-auto max-w-6xl w-full">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 xl:gap-16 items-center">

            {/* Left — copy */}
            <div>
              {/* Tag */}
              <div className="inline-flex items-center gap-2 rounded-full border border-cima-gold/25 bg-cima-gold/5 px-4 py-1.5 mb-7">
                <span className="h-1.5 w-1.5 rounded-full bg-cima-gold animate-pulse" />
                <span className="font-mono text-xs text-cima-gold tracking-widest uppercase">Garantía de venta · Monterrey N.L.</span>
              </div>

              {/* Headline */}
              <h1 className="font-heading font-bold leading-[1.04] mb-6">
                <span className="text-cima-text block text-5xl sm:text-6xl lg:text-7xl">
                  Vendemos tu casa
                </span>
                <span className="text-cima-gold block text-5xl sm:text-6xl lg:text-7xl">
                  en menos de 30 días.
                </span>
                <span className="text-cima-text-muted block text-3xl sm:text-4xl lg:text-5xl mt-1">
                  Garantizado.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-cima-text-muted leading-relaxed mb-8 max-w-xl">
                Solo <span className="text-cima-text font-medium">5% de comisión</span> cuando vendemos.
                Sin exclusividades. Sin mensualidades.{" "}
                <span className="text-cima-text font-medium">Si no vendemos en 30 días, no cobramos.</span>
              </p>

              {/* Stats chips */}
              <div className="flex flex-wrap gap-2.5 mb-10">
                {[
                  { val: soldCount > 0 ? `${soldCount}+` : "85+", label: "casas vendidas" },
                  { val: `${avgDays} días`,                        label: "tiempo promedio" },
                  { val: "5%",                                     label: "comisión fija" },
                  { val: activeProps ? `${activeProps}` : "5",     label: "disponibles hoy" },
                ].map((s) => (
                  <div key={s.label} className="flex flex-col items-center rounded-xl border border-cima-border bg-cima-card px-4 py-2.5 min-w-[80px]">
                    <span className="font-heading font-bold text-lg text-cima-gold leading-none">{s.val}</span>
                    <span className="font-mono text-[9px] text-cima-text-dim uppercase tracking-widest mt-0.5">{s.label}</span>
                  </div>
                ))}
              </div>

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

            {/* Right — hero form */}
            <div className="hidden xl:block">
              <HeroCaptureForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── GUARANTEES ──────────────────────────── */}
      <section id="garantia" className="px-6 py-16 border-t border-cima-border/50">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <p className="font-mono text-[10px] tracking-[0.2em] text-cima-gold uppercase mb-2">Lo que nos diferencia</p>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-cima-text">
              Sin letras chiquitas. Sin sorpresas.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {GUARANTEES.map((g) => (
              <div
                key={g.title}
                className="group rounded-2xl border border-cima-border bg-cima-card p-7 hover:border-cima-gold/30 hover:bg-cima-surface/50 transition-all duration-300"
              >
                <div className="h-11 w-11 rounded-xl bg-cima-gold/10 border border-cima-gold/20 flex items-center justify-center mb-5 group-hover:bg-cima-gold/15 transition-colors">
                  <g.icon className="h-5 w-5 text-cima-gold" />
                </div>
                <h3 className="font-heading font-bold text-base text-cima-text mb-2">{g.title}</h3>
                <p className="text-sm text-cima-text-muted leading-relaxed">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROFIT CALCULATOR ───────────────────── */}
      <section id="calculadora" className="px-6 py-16 border-t border-cima-border/50">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left copy */}
            <div>
              <p className="font-mono text-[10px] tracking-[0.2em] text-cima-gold uppercase mb-3">Calculadora</p>
              <h2 className="font-heading font-bold text-3xl sm:text-4xl text-cima-text mb-4 leading-tight">
                ¿Cuánto recibirías por tu casa?
              </h2>
              <p className="text-sm text-cima-text-muted leading-relaxed mb-6">
                Mueve el slider y ve en tiempo real cuánto te queda a ti y cuánto
                ahorras vs. una agencia tradicional que cobra el 7% o más.
              </p>
              <div className="space-y-3">
                {[
                  "El 5% incluye fotos y video profesional",
                  "Publicidad digital pagada desde el día 1",
                  "Comisión de abogado y trámites notariales",
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

            {/* Right — calculator */}
            <ProfitCalculator />
          </div>
        </div>
      </section>

      {/* ── PROCESS TIMELINE ────────────────────── */}
      <section className="px-6 py-16 border-t border-cima-border/50">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <p className="font-mono text-[10px] tracking-[0.2em] text-cima-gold uppercase mb-2">Proceso</p>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-cima-text">
              De valuación a llave en mano
            </h2>
            <p className="text-sm text-cima-text-muted mt-2">Todo en menos de 30 días.</p>
          </div>

          {/* Desktop horizontal timeline */}
          <div className="hidden md:block relative">
            {/* Connector line */}
            <div className="absolute top-[22px] left-[10%] right-[10%] h-px bg-gradient-to-r from-cima-border via-cima-gold/40 to-cima-border" />

            <div className="grid grid-cols-4 gap-4 relative">
              {PROCESS_STEPS.map((step, i) => (
                <div key={step.title} className="flex flex-col items-center text-center">
                  {/* Circle */}
                  <div className={`relative z-10 h-11 w-11 rounded-full border-2 flex items-center justify-center mb-5 ${
                    i === 3
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
                  <div className={`h-10 w-10 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    i === 3
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

      {/* ── TESTIMONIALS ────────────────────────── */}
      <section className="px-6 py-16 border-t border-cima-border/50">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <p className="font-mono text-[10px] tracking-[0.2em] text-cima-gold uppercase mb-2">Resultados reales</p>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-cima-text">
              Lo que dicen quienes ya vendieron
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-cima-border bg-cima-card p-6 flex flex-col"
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
                    { icon: Camera,       text: "Sesión de fotos y video profesional" },
                    { icon: Users,        text: "Solo compradores pre-calificados" },
                    { icon: FileCheck,    text: "Asesoría legal incluida hasta notaría" },
                    { icon: Shield,       text: "Si no vendemos en 30 días, no cobramos" },
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
              {featured.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── ZONES ───────────────────────────────── */}
      <section className="px-6 py-16 border-t border-cima-border/50">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <p className="font-mono text-[10px] tracking-[0.2em] text-cima-gold uppercase mb-2">Cobertura</p>
            <h2 className="font-heading font-bold text-2xl text-cima-text">Zonas donde vendemos</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {ZONES.map((zone) => (
              <Link
                key={zone.name}
                href={`/propiedades?zona=${encodeURIComponent(zone.name)}`}
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

      {/* ── WA FLOATING BUTTON ─────────────────── */}
      <a
        href={`https://wa.me/${process.env.NEXT_PUBLIC_CIMA_WA}?text=Hola,%20quiero%20vender%20mi%20casa%20con%20Cima%20en%2030%20días`}
        target="_blank"
        rel="noreferrer"
        style={{ height: 54, width: 54 }}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full bg-[#25D366] shadow-[0_4px_24px_rgba(37,211,102,0.45)] hover:shadow-[0_4px_32px_rgba(37,211,102,0.65)] transition-shadow"
        aria-label="WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="white" width="27" height="27">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
}
