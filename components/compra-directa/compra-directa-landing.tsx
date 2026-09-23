"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Building2, Clock, FileCheck, Home, MessageCircle,
  Phone, ShieldCheck, ChevronDown, Wrench, CreditCard, FileWarning,
  Scale, Banknote
} from "lucide-react";
import Link from "next/link";
import DirectBuyerForm from "./direct-buyer-form";

// ── Fade-up utility ────────────────────────────────────────────────────────
function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Props ──────────────────────────────────────────────────────────────────
interface Props {
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main landing component
// ─────────────────────────────────────────────────────────────────────────────
export default function CompraDirectaLanding({
  utmSource,
  utmMedium,
  utmCampaign,
}: Props) {
  const formRef = useRef<HTMLDivElement>(null);
  const [visitRequestIntent, setVisitRequestIntent] = useState(false);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const requestVisitAndScroll = () => {
    setVisitRequestIntent(true);
    scrollToForm();
  };

  const waFallback = `https://wa.me/${process.env.NEXT_PUBLIC_CIMA_WA ?? "528121980008"}?text=${encodeURIComponent("Hola Cima, quiero saber si compran mi propiedad directamente.")}`;

  return (
    <div className="min-h-screen bg-cima-bg text-cima-text">
      {/* ── Navbar ────────────────────────────────────────────────────────── */}
      <CompraNav scrollToForm={scrollToForm} waFallback={waFallback} />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <HeroSection
        scrollToForm={scrollToForm}
        requestVisit={requestVisitAndScroll}
      />

      {/* ── Trust bar ─────────────────────────────────────────────────────── */}
      <TrustBar />

      {/* ── Cómo funciona ─────────────────────────────────────────────────── */}
      <HowItWorksSection scrollToForm={scrollToForm} />

      {/* ── Qué revisamos ─────────────────────────────────────────────────── */}
      <WhatWeReviewSection scrollToForm={scrollToForm} />

      {/* ── Cómo preparamos la oferta ─────────────────────────────────────── */}
      <OfferBasisSection scrollToForm={scrollToForm} />

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <FaqSection />

      {/* ── Formulario ────────────────────────────────────────────────────── */}
      <section
        id="formulario"
        ref={formRef}
        className="py-20 px-4 bg-gradient-to-b from-cima-surface/30 to-cima-bg"
      >
        <div className="mx-auto max-w-xl">
          <FadeUp className="text-center mb-10">
            <p className="text-xs font-mono text-cima-gold uppercase tracking-widest mb-2">
              4 pasos breves
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-cima-text mb-3">
              Revisa si tu propiedad aplica
            </h2>
            <p className="text-cima-text-muted">
              Completa el formulario en menos de 3 minutos. No pedimos datos
              financieros ni documentos.
            </p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <DirectBuyerForm
              utmSource={utmSource}
              utmMedium={utmMedium}
              utmCampaign={utmCampaign}
              visitRequestIntent={visitRequestIntent}
            />
          </FadeUp>
        </div>
      </section>

      {/* ── Footer mínimo ─────────────────────────────────────────────────── */}
      <CompraFooter />

      {/* ── Sticky mobile CTA ─────────────────────────────────────────────── */}
      <MobileStickyCta scrollToForm={scrollToForm} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Navbar
// ─────────────────────────────────────────────────────────────────────────────
function CompraNav({
  scrollToForm,
  waFallback,
}: {
  scrollToForm: () => void;
  waFallback: string;
}) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-cima-border/40 backdrop-blur-md bg-cima-bg/92">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center">
            <Building2 className="h-3.5 w-3.5 text-cima-gold" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-heading font-bold text-sm text-cima-text">Cima</span>
            <span className="font-mono text-[9px] tracking-[0.2em] text-cima-text-muted uppercase">Propiedades</span>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <a
            href={waFallback}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 rounded-lg bg-cima-surface border border-cima-border px-3 py-1.5 text-xs text-cima-text-muted hover:border-cima-gold/30 hover:text-cima-text transition-all"
          >
            <Phone className="h-3 w-3" />
            WhatsApp
          </a>
          <button
            onClick={scrollToForm}
            className="rounded-lg bg-cima-gold px-4 py-1.5 text-xs font-semibold text-cima-bg hover:bg-cima-gold-light transition-all"
          >
            Solicitar oferta
          </button>
        </div>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hero
// ─────────────────────────────────────────────────────────────────────────────
function HeroSection({
  scrollToForm,
  requestVisit,
}: {
  scrollToForm: () => void;
  requestVisit: () => void;
}) {
  return (
    <section className="relative pt-28 pb-20 px-4 overflow-hidden">
      {/* Background mesh */}
      <div className="absolute inset-0 hero-mesh pointer-events-none" />
      <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />

      {/* Orbs */}
      <div className="absolute top-1/4 left-10 w-72 h-72 rounded-full bg-cima-gold/6 blur-3xl orb-float pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-56 h-56 rounded-full bg-cima-gold/4 blur-3xl orb-float-rev pointer-events-none" />

      <div className="relative mx-auto max-w-3xl text-center">
        <FadeUp>
          <span className="inline-flex items-center gap-2 rounded-full border border-cima-gold/25 bg-cima-gold/8 px-4 py-1.5 text-xs font-mono text-cima-gold uppercase tracking-wider mb-6">
            <ShieldCheck className="h-3.5 w-3.5" />
            Cima Propiedades · Comprador directo
          </span>
        </FadeUp>

        <FadeUp delay={0.08}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-cima-text leading-tight mb-5">
            ¿Necesitas vender tu casa{" "}
            <span className="text-cima-gold">aunque tenga adeudos o reparaciones?</span>
          </h1>
        </FadeUp>

        <FadeUp delay={0.15}>
          <p className="text-lg text-cima-text-muted max-w-xl mx-auto mb-8 leading-relaxed">
            En Cima revisamos propiedades en Monterrey que necesitan arreglos o
            tienen adeudos pendientes. Cuéntanos qué está pasando y, si aplica,
            te presentamos una oferta de compra directa sin compromiso.
          </p>
        </FadeUp>

        <FadeUp delay={0.22}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={scrollToForm}
              id="hero-cta-primary"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-cima-gold px-7 py-3.5 text-base font-semibold text-cima-bg hover:bg-cima-gold-light transition-all active:scale-95 shadow-[0_0_32px_rgba(200,169,110,0.25)]"
            >
              Revisar si mi propiedad aplica
            </button>
            <button
              onClick={requestVisit}
              id="hero-cta-secondary"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-cima-border px-7 py-3.5 text-sm text-cima-text-muted hover:border-cima-gold/40 hover:text-cima-text transition-all"
            >
              Solicitar visita presencial
            </button>
          </div>
        </FadeUp>

        <FadeUp delay={0.3}>
          <p className="mt-5 text-xs text-cima-text-dim">
            Sin compromiso · Sin visitas sorpresa · Cima confirma la visita por WhatsApp
          </p>
        </FadeUp>

        <FadeUp delay={0.38} className="mt-10">
          <ChevronDown className="mx-auto h-5 w-5 text-cima-text-dim animate-bounce" />
        </FadeUp>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Trust bar
// ─────────────────────────────────────────────────────────────────────────────
function TrustBar() {
  const items = [
    { icon: ShieldCheck, text: "Comprador directo" },
    { icon: Home, text: "AMM de Monterrey" },
    { icon: FileCheck, text: "Proceso documentado" },
    { icon: MessageCircle, text: "Sin spam" },
  ];

  return (
    <div className="border-y border-cima-border/60 bg-cima-card/50 py-4">
      <div className="mx-auto max-w-4xl px-4">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          {items.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-sm text-cima-text-muted">
              <Icon className="h-4 w-4 text-cima-gold shrink-0" />
              {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Cómo funciona
// ─────────────────────────────────────────────────────────────────────────────
const STEPS_HOW = [
  {
    num: "01",
    icon: FileCheck,
    title: "Comparte tu propiedad",
    desc: "Llena el formulario breve con los datos básicos de tu inmueble. Sin documentos ni información financiera en esta etapa.",
  },
  {
    num: "02",
    icon: ShieldCheck,
    title: "Cima revisa y prepara una oferta",
    desc: "Si lo prefieres, solicita una visita y propone día y hora. Cima confirma la disponibilidad por WhatsApp.",
  },
  {
    num: "03",
    icon: Banknote,
    title: "Decides si aceptas",
    desc: "La oferta de Cima es una propuesta, no una obligación. Si la aceptas, avanzamos al proceso de compraventa formal.",
  },
];

function HowItWorksSection({ scrollToForm }: { scrollToForm: () => void }) {
  return (
    <section id="como-funciona" className="py-20 px-4">
      <div className="mx-auto max-w-5xl">
        <FadeUp className="text-center mb-12">
          <p className="text-xs font-mono text-cima-gold uppercase tracking-widest mb-2">
            El proceso
          </p>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-cima-text mb-3">
            Cómo funciona la compra directa
          </h2>
          <p className="text-cima-text-muted max-w-lg mx-auto">
            Tres pasos simples. Sin publicación, sin visitas de desconocidos y
            sin comisiones de intermediación para ti.
          </p>
        </FadeUp>

        <div className="grid md:grid-cols-3 gap-6">
          {STEPS_HOW.map((s, i) => (
            <FadeUp key={s.num} delay={i * 0.1}>
              <div className="relative rounded-2xl border border-cima-border bg-cima-card p-6 h-full hover:border-cima-gold/30 transition-colors group">
                {/* Step number */}
                <span className="font-mono text-5xl font-bold text-cima-border group-hover:text-cima-gold/20 transition-colors absolute top-4 right-5 select-none">
                  {s.num}
                </span>
                <div className="mb-4 h-10 w-10 rounded-xl bg-cima-gold/10 border border-cima-gold/20 flex items-center justify-center">
                  <s.icon className="h-5 w-5 text-cima-gold" />
                </div>
                <h3 className="font-heading font-bold text-cima-text mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-cima-text-muted leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={0.3} className="mt-10 text-center">
          <button
            onClick={scrollToForm}
            id="how-cta"
            className="inline-flex items-center gap-2 rounded-xl bg-cima-gold/10 border border-cima-gold/30 px-6 py-2.5 text-sm text-cima-gold hover:bg-cima-gold/20 transition-all font-medium"
          >
            Iniciar revisión →
          </button>
        </FadeUp>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Qué revisamos
// ─────────────────────────────────────────────────────────────────────────────
const REVIEW_ITEMS = [
  {
    icon: Wrench,
    title: "Propiedades que necesitan reparaciones",
    desc: "No es necesario invertir en arreglos antes de vender. Cima evalúa el inmueble en su estado actual.",
    ok: true,
  },
  {
    icon: CreditCard,
    title: "Con hipoteca o crédito Infonavit activo",
    desc: "Si tienes un crédito vigente, podemos revisar el caso y explorar si la operación es viable.",
    ok: true,
  },
  {
    icon: FileWarning,
    title: "Predial o servicios con adeudo",
    desc: "Revisamos cada situación de forma individual para determinar si la operación puede proceder.",
    ok: true,
  },
  {
    icon: Scale,
    title: "Procesos de sucesión o intestado",
    desc: "Este tipo de casos requiere revisión manual por parte de nuestro equipo. No garantizamos solución para todos los escenarios.",
    ok: "review",
  },
  {
    icon: Clock,
    title: "Urgencia de venta",
    desc: "Cuéntanos cuándo te gustaría vender y revisaremos si Cima puede avanzar dentro de ese plazo.",
    ok: true,
  },
];

function WhatWeReviewSection({ scrollToForm }: { scrollToForm: () => void }) {
  return (
    <section id="que-revisamos" className="py-20 px-4 bg-cima-surface/20">
      <div className="mx-auto max-w-5xl">
        <FadeUp className="text-center mb-12">
          <p className="text-xs font-mono text-cima-gold uppercase tracking-widest mb-2">
            Casos que revisamos
          </p>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-cima-text mb-3">
            Situaciones que podemos revisar
          </h2>
          <p className="text-cima-text-muted max-w-lg mx-auto">
            Cada inmueble y situación se evalúa individualmente. Te diremos si
            podemos avanzar después de revisar la información.
          </p>
        </FadeUp>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {REVIEW_ITEMS.map((item, i) => (
            <FadeUp key={item.title} delay={i * 0.07}>
              <div className="rounded-2xl border border-cima-border bg-cima-card p-5 h-full hover:border-cima-gold/20 transition-colors">
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className={`shrink-0 h-8 w-8 rounded-lg flex items-center justify-center ${
                      item.ok === true
                        ? "bg-cima-gold/10 border border-cima-gold/20"
                        : "bg-blue-500/10 border border-blue-500/20"
                    }`}
                  >
                    <item.icon
                      className={`h-4 w-4 ${
                        item.ok === true ? "text-cima-gold" : "text-blue-400"
                      }`}
                    />
                  </div>
                  <div>
                    {item.ok === "review" && (
                      <span className="text-[9px] font-mono text-blue-400 uppercase tracking-widest">
                        Revisión manual
                      </span>
                    )}
                    <h3 className="text-sm font-semibold text-cima-text leading-snug">
                      {item.title}
                    </h3>
                  </div>
                </div>
                <p className="text-xs text-cima-text-muted leading-relaxed pl-11">
                  {item.desc}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={0.35} className="mt-8 text-center">
          <p className="text-sm text-cima-text-dim mb-4">
            ¿Tu caso no está en la lista? Igualmente puedes solicitar una revisión.
          </p>
          <button
            onClick={scrollToForm}
            id="review-cta"
            className="inline-flex items-center gap-2 rounded-xl bg-cima-gold text-cima-bg font-semibold text-sm px-6 py-3 hover:bg-cima-gold-light transition-all active:scale-95"
          >
            Solicitar oferta directa
          </button>
        </FadeUp>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Qué revisamos para preparar la oferta
// ─────────────────────────────────────────────────────────────────────────────
function OfferBasisSection({ scrollToForm }: { scrollToForm: () => void }) {
  const factors = [
    {
      icon: Home,
      title: "Valor en la zona",
      description: "Comparamos la propiedad con inmuebles y operaciones similares.",
    },
    {
      icon: Wrench,
      title: "Estado actual",
      description: "Consideramos las reparaciones que requiere, sin pedirte que las hagas antes.",
    },
    {
      icon: FileCheck,
      title: "Saldos y documentación",
      description: "Revisamos los adeudos y los pasos necesarios para una posible compraventa.",
    },
  ];

  return (
    <section id="como-preparamos-la-oferta" className="py-20 px-4">
      <div className="mx-auto max-w-5xl">
        <FadeUp className="text-center mb-10">
          <p className="text-xs font-mono text-cima-gold uppercase tracking-widest mb-2">
            Una oferta clara
          </p>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-cima-text mb-3">
            Qué revisamos antes de ofrecer
          </h2>
          <p className="text-cima-text-muted max-w-xl mx-auto">
            No usamos una calculadora genérica para fijar el precio. Primero
            revisamos estos puntos y después te explicamos la propuesta.
          </p>
        </FadeUp>
        <div className="grid md:grid-cols-3 gap-4">
          {factors.map(({ icon: Icon, title, description }, index) => (
            <FadeUp key={title} delay={index * 0.08}>
              <div className="h-full rounded-2xl border border-cima-border bg-cima-card p-5">
                <Icon className="h-5 w-5 text-cima-gold mb-4" />
                <h3 className="font-heading font-bold text-cima-text mb-2">{title}</h3>
                <p className="text-sm text-cima-text-muted leading-relaxed">{description}</p>
              </div>
            </FadeUp>
          ))}
        </div>
        <FadeUp delay={0.25} className="mt-8 text-center">
          <p className="text-sm text-cima-text-dim mb-4">
            Solicitar revisión no te obliga a aceptar una oferta.
          </p>
          <button
            onClick={scrollToForm}
            className="inline-flex items-center justify-center rounded-xl bg-cima-gold px-6 py-3 text-sm font-semibold text-cima-bg hover:bg-cima-gold-light transition-colors"
          >
            Revisar mi propiedad
          </button>
        </FadeUp>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "¿Cima es comprador directo o es una agencia?",
    a: "En esta modalidad, Cima actúa como comprador directo de tu propiedad. No publicamos tu casa ni buscamos compradores externos: somos nosotros quienes hacemos la oferta.",
  },
  {
    q: "¿Cómo se determina el precio de la oferta?",
    a: "Consideramos el valor de propiedades similares, el estado del inmueble, los saldos pendientes y los costos de la operación. La propuesta puede diferir del precio de venta en mercado abierto; te explicamos los factores para que decidas con claridad.",
  },
  {
    q: "¿Estoy obligado a aceptar si solicito una revisión?",
    a: "No. Completar el formulario no te compromete a nada. La oferta de Cima es una propuesta que puedes aceptar o rechazar libremente.",
  },
  {
    q: "¿Qué pasa si mi propiedad tiene hipoteca?",
    a: "Es un caso que revisamos. No garantizamos que todas las hipotecas se puedan resolver, pero sí analizamos cada situación individualmente.",
  },
  {
    q: "¿Qué no hace Cima en esta modalidad?",
    a: "No somos tu agente ni gestionamos la venta de tu propiedad a terceros. No publicamos en portales ni cobramos comisión. En esta página, Cima es el comprador directo.",
  },
];

function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 px-4 bg-cima-surface/20">
      <div className="mx-auto max-w-2xl">
        <FadeUp className="text-center mb-10">
          <p className="text-xs font-mono text-cima-gold uppercase tracking-widest mb-2">
            Preguntas frecuentes
          </p>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-cima-text">
            Lo que más nos preguntan
          </h2>
        </FadeUp>

        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <FadeUp key={i} delay={i * 0.06}>
              <div className="rounded-xl border border-cima-border bg-cima-card overflow-hidden">
                <button
                  id={`faq-${i}`}
                  className="w-full flex items-center justify-between px-5 py-4 text-left gap-4"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                >
                  <span className="text-sm font-medium text-cima-text">{faq.q}</span>
                  <ChevronDown
                    className={`shrink-0 h-4 w-4 text-cima-text-muted transition-transform duration-200 ${
                      open === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <motion.div
                  animate={{ height: open === i ? "auto" : 0 }}
                  initial={false}
                  transition={{ duration: 0.22, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-4 text-sm text-cima-text-muted leading-relaxed">
                    {faq.a}
                  </p>
                </motion.div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Footer
// ─────────────────────────────────────────────────────────────────────────────
function CompraFooter() {
  return (
    <footer className="border-t border-cima-border/50 py-8 px-4">
      <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cima-text-dim">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-cima-gold" />
          <span>Cima Propiedades · Monterrey, NL</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/legal/privacidad" className="hover:text-cima-text transition-colors">
            Aviso de Privacidad
          </Link>
          <Link href="/" className="hover:text-cima-text transition-colors">
            Inicio
          </Link>
        </div>
        <p>© {new Date().getFullYear()} Cima Propiedades</p>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Mobile sticky CTA
// ─────────────────────────────────────────────────────────────────────────────
function MobileStickyCta({ scrollToForm }: { scrollToForm: () => void }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden border-t border-cima-border bg-cima-bg/95 backdrop-blur-md px-4 py-3 safe-area-inset-bottom">
      <button
        onClick={scrollToForm}
        id="mobile-sticky-cta"
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-cima-gold text-cima-bg font-semibold text-sm py-3.5 active:scale-[0.98] transition-all"
      >
        Solicitar oferta directa
      </button>
    </div>
  );
}
