"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Target, Camera, Megaphone, Handshake, CheckCircle2,
  MessageCircle, ArrowRight, Star, TrendingUp, Shield,
  Clock, ChevronDown, Zap, Award, Users, Phone,
  AlertCircle, X, Home, Calendar, BadgeCheck,
} from "lucide-react";

/* ══════════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════════ */
export interface AgentConfig {
  /** Nombre visible del asesor — se muestra en el hero y footer */
  name: string;
  /** Número WA sin código de país. Ej: "8121980008" */
  waRaw: string;
  /** Número formateado para mostrar. Ej: "812 198 0008" */
  waDisplay: string;
  /** Cupos restantes del mes (escasez) */
  slotsLeft?: number;
  /** Total de cupos del mes */
  slotsTotal?: number;
}

/* ══════════════════════════════════════════════════════════
   STATIC DATA
══════════════════════════════════════════════════════════ */
const TOASTS = [
  { name: "Roberto M.", area: "San Pedro",          days: 18 },
  { name: "Claudia R.", area: "Cumbres",            days: 24 },
  { name: "Eduardo F.", area: "Valle Oriente",      days: 27 },
  { name: "Sofía L.",   area: "Cumbres Elite",      days: 15 },
  { name: "Marco A.",   area: "Carretera Nacional", days: 22 },
];

const PROCESS_STEPS = [
  { icon: Phone,     step: "01", title: "Llamada gratuita",       desc: "Agendamos una llamada de 15 min sin compromiso para conocer tu propiedad.", badge: "GRATIS" },
  { icon: Home,      step: "02", title: "Valuación y estrategia", desc: "Visitamos, valuamos y diseñamos el plan de venta personalizado.", badge: null },
  { icon: Camera,    step: "03", title: "Producción profesional", desc: "Fotografía, video tour y staging digital para enamorar compradores.", badge: null },
  { icon: Megaphone, step: "04", title: "Máxima exposición",      desc: "Publicamos en 15+ portales, redes sociales y nuestra base de 2,000+ compradores.", badge: null },
  { icon: Handshake, step: "05", title: "Cierre y firma",         desc: "Gestionamos la negociación, contratos y cierre. Tú solo firmas.", badge: null },
];

const TESTIMONIALS = [
  { name: "Roberto M.", area: "San Pedro Garza García", days: 18, price: "al precio que pedí",    text: "Vendí mi casa en 18 días y sin regateos. Las fotos que hicieron eran increíbles, los compradores llegaron solos. 100% recomendado.", stars: 5, initials: "RM" },
  { name: "Claudia R.", area: "Cumbres, Monterrey",     days: 24, price: "5% más de lo esperado", text: "Llevaba 4 meses intentando vender sola. CIMA lo logró en 24 días y a mejor precio del que yo pedía. Atención impecable.",          stars: 5, initials: "CR" },
  { name: "Eduardo F.", area: "Valle Oriente",           days: 27, price: "sin regateos",          text: "Confié en el proceso y valió la pena. El equipo estuvo presente en cada paso. Mi tranquilidad valió todo.",                         stars: 5, initials: "EF" },
];

const FAQS = [
  { q: "¿Cuánto cobran por sus servicios?",     a: "Nuestra comisión está dentro del estándar del mercado y la definimos en la primera reunión gratuita. No pagas nada hasta que vendemos." },
  { q: "¿Qué pasa si no se vende en 30 días?",  a: "Seguimos trabajando tu propiedad sin costos adicionales hasta cerrar la venta. Tu éxito es nuestro éxito." },
  { q: "¿Necesito hacer reparaciones antes?",    a: "Te decimos exactamente qué vale la pena hacer y qué no. Maximizamos tu ganancia sin gastos innecesarios." },
  { q: "¿Cómo funciona la valuación gratuita?", a: "Agendas, visitamos tu propiedad y te entregamos un reporte de valor de mercado. Sin costo y sin obligación de contratarnos." },
  { q: "¿En qué zonas de Monterrey trabajan?",  a: "Trabajamos en todo el área metropolitana de Monterrey: San Pedro, Valle, Cumbres, Carretera Nacional, Santa Catarina y más." },
];

/* ══════════════════════════════════════════════════════════
   HOOKS
══════════════════════════════════════════════════════════ */
function useCountUp(target: number, duration = 1800) {
  const [count, setCount] = useState(0);
  const ref   = useRef<HTMLSpanElement>(null);
  const fired = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !fired.current) {
        fired.current = true;
        const steps = 60;
        let i = 0;
        const timer = setInterval(() => {
          i++;
          setCount(Math.round((target / steps) * i));
          if (i >= steps) { setCount(target); clearInterval(timer); }
        }, duration / steps);
      }
    }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration]);
  return { count, ref };
}

function useCountdown(targetDate: Date) {
  const calc = useCallback(() => {
    const diff = targetDate.getTime() - Date.now();
    if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 };
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    };
  }, [targetDate]);
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const t = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(t);
  }, [calc]);
  return time;
}

/* ══════════════════════════════════════════════════════════
   SUB-COMPONENTS
══════════════════════════════════════════════════════════ */

function CountdownBanner() {
  const deadline = new Date();
  deadline.setMonth(deadline.getMonth() + 1, 1);
  deadline.setHours(0, 0, 0, 0);
  const { d, h, m, s } = useCountdown(deadline);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="bg-gradient-to-r from-[#7A4F1A] via-[#C8A96E] to-[#7A4F1A] py-2 px-4 text-center text-[#090A0D]">
      <div className="flex items-center justify-center gap-2 flex-wrap text-xs sm:text-sm font-bold">
        <Zap className="h-3.5 w-3.5 shrink-0" />
        <span>Oferta especial de julio — Valuación GRATIS + comisión preferencial</span>
        <span className="font-mono bg-[#090A0D]/20 rounded px-2 py-0.5 tabular-nums">
          {pad(d)}d {pad(h)}h {pad(m)}m {pad(s)}s
        </span>
      </div>
    </div>
  );
}

function SlotMeter({ slotsLeft, slotsTotal }: { slotsLeft: number; slotsTotal: number }) {
  const pct = ((slotsTotal - slotsLeft) / slotsTotal) * 100;
  return (
    <div className="rounded-2xl border border-[#C8A96E]/25 bg-[#C8A96E]/5 p-4 sm:p-5">
      <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
        <span className="flex items-center gap-1.5 text-xs font-bold text-[#C8A96E]">
          <AlertCircle className="h-3.5 w-3.5" />
          Cupos disponibles este mes
        </span>
        <span className="font-mono text-xs font-black text-[#F0EDE8]">
          <span className="text-[#C8A96E] text-base">{slotsLeft}</span> / {slotsTotal} restantes
        </span>
      </div>
      <div className="h-2 rounded-full bg-[#23252F] overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#C8A96E] to-[#E2C99A] transition-all duration-1000"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-[10px] text-[#9A9490] mt-2">
        Solo aceptamos {slotsTotal} propiedades nuevas por mes para garantizar resultados.
      </p>
    </div>
  );
}

function Stat({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const { count, ref } = useCountUp(target);
  return (
    <div className="text-center">
      <p className="font-heading font-black text-3xl sm:text-4xl text-[#C8A96E] leading-none mb-1">
        <span ref={ref}>{count}</span>{suffix}
      </p>
      <p className="font-mono text-[10px] tracking-widest uppercase text-[#56524E]">{label}</p>
    </div>
  );
}

function FaqItem({ q, a, defaultOpen = false }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`border rounded-xl overflow-hidden transition-colors duration-200 ${open ? "border-[#C8A96E]/30 bg-[#0F1116]" : "border-[#23252F] bg-transparent"}`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left gap-4" aria-expanded={open}>
        <span className="font-semibold text-sm sm:text-base text-[#F0EDE8] leading-snug">{q}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-[#C8A96E] transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}>
        <p className="px-5 pb-5 text-sm text-[#9A9490] leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

function SocialToast() {
  const [visible,   setVisible]   = useState(false);
  const [idx,       setIdx]       = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const show = setTimeout(() => setVisible(true), 4000);
    return () => clearTimeout(show);
  }, [dismissed]);

  useEffect(() => {
    if (!visible || dismissed) return;
    const hide = setTimeout(() => {
      setVisible(false);
      const next = setTimeout(() => {
        setIdx((i) => (i + 1) % TOASTS.length);
        setVisible(true);
      }, 4000);
      return () => clearTimeout(next);
    }, 5000);
    return () => clearTimeout(hide);
  }, [visible, idx, dismissed]);

  const t = TOASTS[idx];
  return (
    <div className={`fixed bottom-20 left-4 z-50 max-w-[280px] transition-all duration-500 sm:bottom-24 sm:left-6
                    ${visible && !dismissed ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"}`}>
      <div className="rounded-2xl border border-[#23252F] bg-[#0F1116]/95 backdrop-blur-xl p-3.5 shadow-2xl shadow-black/60 flex gap-3 items-start">
        <div className="h-9 w-9 shrink-0 rounded-full bg-[#25D366]/15 border border-[#25D366]/30 flex items-center justify-center">
          <Home className="h-4 w-4 text-[#25D366]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-[#F0EDE8] leading-tight">{t.name} — {t.area}</p>
          <p className="text-[10px] text-[#9A9490] mt-0.5">Vendió su casa en <span className="text-[#25D366] font-bold">{t.days} días</span> 🏠</p>
          <p className="text-[9px] text-[#56524E] mt-0.5">hace unos minutos</p>
        </div>
        <button onClick={() => setDismissed(true)} className="text-[#56524E] hover:text-[#9A9490] shrink-0 mt-0.5" aria-label="Cerrar">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

function StickyNav({ waUrl, waDisplay }: { waUrl: string; waDisplay: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const handler = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return (
    <div className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"}`}>
      <div className="bg-[#090A0D]/90 backdrop-blur-xl border-b border-[#23252F] px-4 py-2.5 flex items-center justify-between max-w-screen-lg mx-auto gap-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-[#C8A96E]" />
          <span className="font-heading font-bold text-sm text-[#F0EDE8] hidden sm:block">CIMA Propiedades</span>
        </div>
        <div className="flex items-center gap-2">
          <a href={waUrl} target="_blank" rel="noreferrer" id="sticky-wa"
             className="flex items-center gap-1.5 text-[11px] font-semibold text-[#25D366] border border-[#25D366]/30 bg-[#25D366]/10 rounded-lg px-3 py-1.5 hover:bg-[#25D366]/20 transition-colors">
            <MessageCircle className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{waDisplay}</span>
            <span className="sm:hidden">WA</span>
          </a>
          <a href="#cotiza" id="sticky-cta"
             className="inline-flex items-center gap-1.5 rounded-lg bg-[#C8A96E] text-[#090A0D] font-bold px-4 py-1.5 text-[11px] hover:bg-[#E2C99A] transition-colors">
            Valuar gratis <ArrowRight className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
}

function LeadForm({ waNumber, waDisplay }: { waNumber: string; waDisplay: string }) {
  const [step,   setStep]   = useState(1);
  const [form,   setForm]   = useState({ name: "", phone: "", area: "", type: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const msg = encodeURIComponent(
      `Hola, quiero vender mi propiedad con CIMA.\n\n👤 Nombre: ${form.name}\n📱 Teléfono: ${form.phone}${form.area ? `\n📍 Zona: ${form.area}` : ""}${form.type ? `\n🏠 Tipo: ${form.type}` : ""}`
    );
    await new Promise((r) => setTimeout(r, 700));
    setStatus("done");
    window.open(`https://wa.me/${waNumber}?text=${msg}`, "_blank");
  }

  if (status === "done") return (
    <div className="text-center py-10 px-4">
      <div className="h-16 w-16 rounded-full bg-[#25D366]/15 border border-[#25D366]/30 flex items-center justify-center mx-auto mb-5">
        <CheckCircle2 className="h-8 w-8 text-[#25D366]" />
      </div>
      <p className="font-heading font-black text-xl text-[#F0EDE8] mb-2">¡Listo, {form.name.split(" ")[0]}!</p>
      <p className="text-sm text-[#9A9490] max-w-xs mx-auto">
        Te abrimos WhatsApp para continuar. Si no abrió, escríbenos al{" "}
        <a href={`https://wa.me/${waNumber}`} className="text-[#25D366] font-semibold underline">{waDisplay}</a>.
      </p>
    </div>
  );

  return (
    <form onSubmit={submit} className="space-y-4">
      {/* Step indicators */}
      <div className="flex items-center gap-2 mb-5">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-300
              ${step >= s ? "bg-[#C8A96E] text-[#090A0D]" : "bg-[#23252F] text-[#56524E]"}`}>
              {step > s ? <CheckCircle2 className="h-3.5 w-3.5" /> : s}
            </div>
            <span className={`text-[10px] font-mono hidden sm:block transition-colors ${step >= s ? "text-[#C8A96E]" : "text-[#56524E]"}`}>
              {s === 1 ? "TUS DATOS" : "TU PROPIEDAD"}
            </span>
            {s < 2 && <div className={`h-px w-8 sm:w-12 transition-colors ${step > s ? "bg-[#C8A96E]" : "bg-[#23252F]"}`} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-3 animate-fade-up">
          <div>
            <label className="block text-[10px] font-mono tracking-widest text-[#9A9490] uppercase mb-1.5">Tu nombre *</label>
            <input id="lead-name" value={form.name} onChange={(e) => set("name", e.target.value)}
              placeholder="Ej. María González" required
              className="w-full rounded-xl bg-[#090A0D] border border-[#23252F] px-4 py-3.5 text-sm text-[#F0EDE8] placeholder:text-[#56524E] focus:outline-none focus:border-[#C8A96E] focus:ring-1 focus:ring-[#C8A96E]/20 transition-all" />
          </div>
          <div>
            <label className="block text-[10px] font-mono tracking-widest text-[#9A9490] uppercase mb-1.5">WhatsApp *</label>
            <input id="lead-phone" value={form.phone} onChange={(e) => set("phone", e.target.value)}
              placeholder="Ej. 81 2345 6789" type="tel" required
              className="w-full rounded-xl bg-[#090A0D] border border-[#23252F] px-4 py-3.5 text-sm text-[#F0EDE8] placeholder:text-[#56524E] focus:outline-none focus:border-[#C8A96E] focus:ring-1 focus:ring-[#C8A96E]/20 transition-all" />
          </div>
          <button type="button" onClick={() => { if (form.name && form.phone) setStep(2); }}
            className="w-full rounded-xl bg-[#C8A96E] text-[#090A0D] font-black py-4 text-sm tracking-wide hover:bg-[#E2C99A] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 mt-1">
            Continuar <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3 animate-fade-up">
          <div>
            <label className="block text-[10px] font-mono tracking-widests text-[#9A9490] uppercase mb-1.5">Zona / Colonia</label>
            <input id="lead-area" value={form.area} onChange={(e) => set("area", e.target.value)}
              placeholder="Ej. San Pedro, Cumbres, Valle..."
              className="w-full rounded-xl bg-[#090A0D] border border-[#23252F] px-4 py-3.5 text-sm text-[#F0EDE8] placeholder:text-[#56524E] focus:outline-none focus:border-[#C8A96E] focus:ring-1 focus:ring-[#C8A96E]/20 transition-all" />
          </div>
          <div>
            <label className="block text-[10px] font-mono tracking-widest text-[#9A9490] uppercase mb-1.5">Tipo de propiedad</label>
            <div className="grid grid-cols-3 gap-2">
              {["Casa", "Departamento", "Terreno"].map((t) => (
                <button key={t} type="button" onClick={() => set("type", t)}
                  className={`rounded-xl border py-2.5 text-xs font-semibold transition-all
                    ${form.type === t ? "border-[#C8A96E] bg-[#C8A96E]/15 text-[#C8A96E]" : "border-[#23252F] text-[#56524E] hover:border-[#C8A96E]/40"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 mt-1">
            <button type="button" onClick={() => setStep(1)}
              className="rounded-xl border border-[#23252F] text-[#9A9490] font-semibold px-4 py-4 text-sm hover:border-[#C8A96E]/30 transition-colors">
              ← Atrás
            </button>
            <button id="lead-submit" type="submit" disabled={status === "sending"}
              className="flex-1 rounded-xl bg-[#C8A96E] text-[#090A0D] font-black py-4 text-sm tracking-wide hover:bg-[#E2C99A] active:scale-95 transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2">
              {status === "sending"
                ? <span className="h-4 w-4 border-2 border-[#090A0D] border-t-transparent rounded-full animate-spin" />
                : <><MessageCircle className="h-4 w-4" /> Quiero mi valuación gratis</>}
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center gap-3 pt-1">
        <Shield className="h-3 w-3 text-[#56524E]" />
        <p className="text-[10px] text-[#56524E]">Sin spam · Sin compromiso · 100% confidencial</p>
      </div>
    </form>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN LANDING COMPONENT
══════════════════════════════════════════════════════════ */
export function VendeLanding({ agent }: { agent: AgentConfig }) {
  const waNumber  = `52${agent.waRaw.replace(/^52/, "")}`;
  const waDefault = encodeURIComponent("Hola, vi su anuncio y me interesa vender mi propiedad con CIMA Propiedades. ¿Me pueden dar más información?");
  const waUrl     = `https://wa.me/${waNumber}?text=${waDefault}`;
  const slotsLeft  = agent.slotsLeft  ?? 3;
  const slotsTotal = agent.slotsTotal ?? 8;

  return (
    <div className="min-h-screen bg-[#090A0D] text-[#F0EDE8] overflow-x-hidden" style={{ fontFamily: "var(--font-sans, DM Sans, sans-serif)" }}>

      {/* Urgency countdown banner */}
      <CountdownBanner />

      {/* Sticky nav */}
      <StickyNav waUrl={waUrl} waDisplay={agent.waDisplay} />

      {/* WhatsApp FAB */}
      <a href={waUrl} target="_blank" rel="noreferrer" id="wa-fab" aria-label="Contactar por WhatsApp"
         className="fixed bottom-5 right-4 z-50 flex items-center gap-2 rounded-full bg-[#25D366] text-white
                    px-4 py-3.5 text-sm font-bold shadow-xl shadow-[#25D366]/40
                    hover:bg-[#1eb85a] hover:scale-105 active:scale-95 transition-all sm:bottom-6 sm:right-6 sm:px-5">
        <MessageCircle className="h-4 w-4 shrink-0" />
        <span className="hidden sm:inline">{agent.waDisplay}</span>
      </a>

      {/* Social proof toast */}
      <SocialToast />

      {/* ══ HERO ══ */}
      <section id="hero" className="relative flex flex-col items-center justify-center min-h-screen px-4 pt-8 pb-20 text-center overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] opacity-20"
               style={{ background: "radial-gradient(ellipse at center, #C8A96E 0%, transparent 70%)" }} />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] opacity-10"
               style={{ background: "radial-gradient(ellipse at bottom-left, #C8A96E 0%, transparent 60%)" }} />
          <div className="absolute inset-0 opacity-[0.025]"
               style={{ backgroundImage: "linear-gradient(#C8A96E 1px, transparent 1px), linear-gradient(90deg, #C8A96E 1px, transparent 1px)", backgroundSize: "70px 70px" }} />
        </div>

        {/* Brand */}
        <div className="relative flex items-center gap-2.5 mb-8">
          <div className="h-9 w-9 rounded-xl bg-[#C8A96E]/15 border border-[#C8A96E]/30 flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-[#C8A96E]" />
          </div>
          <div className="leading-none text-left">
            <p className="font-heading font-black text-base text-[#F0EDE8] tracking-tight">CIMA</p>
            <p className="font-mono text-[8px] tracking-[0.3em] text-[#56524E] uppercase">Propiedades</p>
          </div>
        </div>

        {/* Badges */}
        <div className="relative flex flex-wrap justify-center gap-2 mb-7">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-[#C8A96E]/10 border border-[#C8A96E]/25 text-[#C8A96E]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C8A96E] animate-pulse" />
            Vendemos casas, no promesas
          </span>
          {agent.name && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-[#23252F] border border-[#23252F] text-[#9A9490]">
              <BadgeCheck className="h-3 w-3 text-[#C8A96E]" />
              Asesor: {agent.name}
            </span>
          )}
        </div>

        {/* Headline */}
        <div className="relative max-w-3xl mx-auto mb-5">
          <h1 className="font-heading font-black leading-[0.88] tracking-tight mb-5" style={{ fontSize: "clamp(2.8rem, 8vw, 5.5rem)" }}>
            <span className="text-[#F0EDE8]">Vende tu Casa</span>
            <br />
            <span className="bg-gradient-to-r from-[#C8A96E] via-[#E2C99A] to-[#C8A96E] bg-clip-text text-transparent">en Menos de</span>
            <br />
            <span className="relative inline-block">
              <span className="text-[#F0EDE8]">30 </span>
              <span className="text-[#C8A96E]">Días</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                <path d="M4 8 Q150 2 296 8" stroke="#C8A96E" strokeWidth="3" strokeLinecap="round" opacity="0.6"/>
              </svg>
            </span>
            <span className="text-[#C8A96E] align-super" style={{ fontSize: "0.4em" }}>*</span>
          </h1>
          <p className="text-[#9A9490] text-lg sm:text-xl leading-relaxed max-w-xl mx-auto">
            En <strong className="text-[#C8A96E]">CIMA Propiedades</strong> tenemos un plan probado para vender tu casa{" "}
            <strong className="text-[#F0EDE8]">rápido y al mejor precio del mercado.</strong>
          </p>
        </div>

        {/* CTAs */}
        <div className="relative flex flex-col sm:flex-row gap-3 mb-10">
          <a href="#cotiza" id="hero-cta-primary"
             className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-[#C8A96E] text-[#090A0D] font-black px-8 py-4 text-sm tracking-wide
                        hover:bg-[#E2C99A] active:scale-95 transition-all duration-200 shadow-xl shadow-[#C8A96E]/30">
            <Calendar className="h-4 w-4" />
            Valuación gratis — 15 min
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a href={waUrl} target="_blank" rel="noreferrer" id="hero-cta-wa"
             className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#25D366]/40 bg-[#25D366]/10 text-[#25D366] font-bold px-8 py-4 text-sm
                        hover:bg-[#25D366]/20 active:scale-95 transition-all duration-200">
            <MessageCircle className="h-4 w-4" />
            Hablar por WhatsApp
          </a>
        </div>

        {/* Trust strip */}
        <div className="relative flex flex-wrap justify-center gap-6 sm:gap-8">
          {[
            { icon: Clock,   text: "Vendemos en ≤30 días" },
            { icon: Award,   text: "Mejor precio garantizado" },
            { icon: Shield,  text: "Sin pago hasta vender" },
            { icon: Users,   text: "2,000+ compradores activos" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-xs text-[#9A9490]">
              <Icon className="h-3.5 w-3.5 text-[#C8A96E] shrink-0" />
              {text}
            </div>
          ))}
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[#56524E] animate-bounce">
          <ChevronDown className="h-5 w-5" />
        </div>
      </section>

      {/* ══ STATS BAR ══ */}
      <section className="border-y border-[#23252F] bg-[#0F1116]">
        <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
          <Stat target={30}  suffix=" días" label="Promedio de venta" />
          <Stat target={200} suffix="+"     label="Casas vendidas" />
          <Stat target={98}  suffix="%"     label="Clientes satisfechos" />
          <Stat target={12}  suffix=" años" label="De experiencia" />
        </div>
      </section>

      {/* ══ WHY CIMA ══ */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#C8A96E] mb-3">¿Por qué elegirnos?</p>
            <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-[#F0EDE8]">Lo que nos hace diferentes</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { icon: Zap,        color: "#C8A96E", title: "Velocidad real",  sub: "Promedio de 22 días",        desc: "No solo prometemos rapidez. Tenemos un sistema de marketing probado que conecta tu propiedad con compradores calificados desde el día uno." },
              { icon: TrendingUp, color: "#25D366", title: "Mejor precio",    sub: "+5–12% vs venta directa",    desc: "Nuestra estrategia de presentación profesional y negociación experta logra precios superiores al mercado, no solo vender rápido." },
              { icon: Shield,     color: "#6EA8FE", title: "Cero riesgo",     sub: "Sin pago hasta vender",      desc: "No cobramos si no vendemos. Sin costos ocultos. Sin letra chica. Tu tranquilidad es nuestra prioridad desde el primer día." },
            ].map(({ icon: Icon, color, title, sub, desc }) => (
              <div key={title} className="group relative rounded-2xl border border-[#23252F] bg-[#0F1116] p-7 overflow-hidden transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                     style={{ background: `radial-gradient(ellipse at top left, ${color}08 0%, transparent 60%)` }} />
                <div className="relative">
                  <div className="h-12 w-12 rounded-2xl flex items-center justify-center mb-5" style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}>
                    <Icon className="h-6 w-6" style={{ color }} />
                  </div>
                  <p className="font-heading font-black text-xl text-[#F0EDE8] mb-1">{title}</p>
                  <p className="font-mono text-[10px] tracking-widest uppercase mb-3" style={{ color }}>{sub}</p>
                  <p className="text-sm text-[#9A9490] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PROCESS ══ */}
      <section id="como-funciona" className="py-20 px-4 border-t border-[#23252F] bg-[#0F1116]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#C8A96E] mb-3">Proceso simple</p>
            <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-[#F0EDE8]">
              De llamada a escrituras<br /><span className="text-[#C8A96E]">en 5 pasos</span>
            </h2>
          </div>
          <div className="space-y-3">
            {PROCESS_STEPS.map(({ icon: Icon, step, title, desc, badge }, i) => (
              <div key={step} className="group flex gap-5 items-start rounded-2xl border border-[#23252F] bg-[#090A0D] p-5 sm:p-6 hover:border-[#C8A96E]/25 transition-all duration-300">
                <div className="relative shrink-0">
                  <div className="h-12 w-12 rounded-xl bg-[#C8A96E]/10 border border-[#C8A96E]/20 flex items-center justify-center group-hover:bg-[#C8A96E]/15 transition-colors">
                    <Icon className="h-5 w-5 text-[#C8A96E]" />
                  </div>
                  {i < PROCESS_STEPS.length - 1 && <div className="absolute top-12 left-1/2 -translate-x-1/2 w-px h-3 bg-[#23252F]" />}
                </div>
                <div className="flex-1 pt-1">
                  <span className="font-mono text-[9px] tracking-widest text-[#56524E]">PASO {step}</span>
                  <h3 className="font-heading font-bold text-base sm:text-lg text-[#F0EDE8] mb-1">{title}</h3>
                  <p className="text-sm text-[#9A9490] leading-relaxed">{desc}</p>
                </div>
                {badge && (
                  <span className="shrink-0 self-center hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#25D366]/10 border border-[#25D366]/25 text-[9px] font-mono font-bold uppercase text-[#25D366]">
                    {badge}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SOCIAL PROOF BANNER ══ */}
      <section className="py-12 px-4 border-y border-[#C8A96E]/15" style={{ background: "linear-gradient(135deg, rgba(200,169,110,0.07) 0%, transparent 60%)" }}>
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-6 sm:gap-10 text-center sm:text-left">
          <div className="h-16 w-16 shrink-0 rounded-2xl bg-[#C8A96E]/10 border border-[#C8A96E]/25 flex items-center justify-center">
            <BadgeCheck className="h-8 w-8 text-[#C8A96E]" />
          </div>
          <div className="flex-1">
            <p className="font-heading font-black text-2xl sm:text-3xl text-[#F0EDE8] mb-1">Resultados que hablan por sí solos</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-2">
              {["Casas vendidas más rápido", "Mejores precios", "Clientes 100% satisfechos"].map((t) => (
                <span key={t} className="flex items-center gap-1.5 text-xs text-[#9A9490]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#25D366]" /> {t}
                </span>
              ))}
            </div>
          </div>
          <a href="#cotiza" id="proof-cta"
             className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-[#C8A96E] text-[#090A0D] font-black px-6 py-3.5 text-sm hover:bg-[#E2C99A] active:scale-95 transition-all whitespace-nowrap shadow-lg shadow-[#C8A96E]/20">
            Empezar ahora <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section id="testimonios" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#C8A96E] mb-3">Testimonios reales</p>
            <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-[#F0EDE8]">
              Ellos ya vendieron,<br /><span className="text-[#C8A96E]">tú puedes ser el siguiente</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {TESTIMONIALS.map(({ name, area, days, price, text, stars, initials }) => (
              <div key={name} className="relative rounded-2xl border border-[#23252F] bg-[#0F1116] p-6 hover:border-[#C8A96E]/20 transition-all duration-300 hover:-translate-y-0.5 flex flex-col">
                <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#25D366]/10 border border-[#25D366]/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#25D366]" />
                  <span className="text-[9px] font-mono font-bold text-[#25D366]">VENDIDA</span>
                </div>
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: stars }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-[#C8A96E] text-[#C8A96E]" />)}
                </div>
                <p className="text-sm text-[#9A9490] leading-relaxed mb-5 flex-1">&ldquo;{text}&rdquo;</p>
                <div className="rounded-xl bg-[#090A0D] border border-[#23252F] p-3 mb-4 flex items-center gap-3">
                  <Clock className="h-4 w-4 text-[#C8A96E] shrink-0" />
                  <div>
                    <p className="font-heading font-black text-base text-[#C8A96E] leading-none">{days} días</p>
                    <p className="text-[10px] text-[#56524E]">{price}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-[#C8A96E]/15 border border-[#C8A96E]/30 flex items-center justify-center font-heading font-black text-xs text-[#C8A96E]">
                    {initials}
                  </div>
                  <div>
                    <p className="font-heading font-bold text-sm text-[#F0EDE8]">{name}</p>
                    <p className="font-mono text-[10px] text-[#56524E]">{area}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ LEAD FORM ══ */}
      <section id="cotiza" className="py-20 px-4 border-t border-[#23252F]"
               style={{ background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(200,169,110,0.07) 0%, transparent 70%), #090A0D" }}>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#C8A96E] mb-3">Da el primer paso</p>
            <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-[#F0EDE8] mb-4">
              Vende tu casa{" "}<span className="bg-gradient-to-r from-[#C8A96E] to-[#E2C99A] bg-clip-text text-transparent">hoy mismo</span>
            </h2>
            <p className="text-[#9A9490] text-sm max-w-md mx-auto">
              Déjanos tus datos y tu asesor te contactará en minutos. Es gratis y sin compromiso.
            </p>
          </div>

          <div className="grid sm:grid-cols-[1fr_260px] gap-5 items-start">
            {/* Form */}
            <div className="rounded-2xl border border-[#23252F] bg-[#0F1116] p-6 sm:p-8 shadow-2xl shadow-black/60">
              <div className="flex items-center gap-2 mb-6">
                <span className="h-2 w-2 rounded-full bg-[#C8A96E] animate-pulse block" />
                <p className="font-mono text-[10px] tracking-[0.15em] text-[#C8A96E] uppercase">Valuación gratuita disponible ahora</p>
              </div>
              <LeadForm waNumber={waNumber} waDisplay={agent.waDisplay} />
            </div>

            {/* Side panel */}
            <div className="space-y-4">
              <SlotMeter slotsLeft={slotsLeft} slotsTotal={slotsTotal} />
              <div className="rounded-2xl border border-[#23252F] bg-[#0F1116] p-5 space-y-3">
                <p className="font-mono text-[9px] tracking-widest uppercase text-[#56524E]">Incluye sin costo</p>
                {["Valuación profesional", "Plan de venta personalizado", "Fotografía profesional", "Publicación en 15+ portales", "Asesor dedicado 24/7"].map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-[#25D366] shrink-0" />
                    <span className="text-xs text-[#9A9490]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="text-center text-[11px] text-[#56524E] mt-6">
            *Aplican condiciones. Nuestro objetivo es vender tu casa en menos de 30 días.
          </p>
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section id="preguntas" className="py-16 px-4 border-t border-[#23252F] bg-[#0F1116]">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#C8A96E] mb-3">FAQ</p>
            <h2 className="font-heading font-black text-3xl text-[#F0EDE8]">Preguntas frecuentes</h2>
          </div>
          <div className="space-y-2.5">
            {FAQS.map((faq, i) => <FaqItem key={faq.q} {...faq} defaultOpen={i === 0} />)}
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ══ */}
      <section className="py-20 px-4"
               style={{ background: "linear-gradient(160deg, rgba(200,169,110,0.12) 0%, rgba(200,169,110,0.03) 60%)", borderTop: "1px solid rgba(200,169,110,0.15)" }}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C8A96E]/10 border border-[#C8A96E]/20 mb-6">
            <Award className="h-4 w-4 text-[#C8A96E]" />
            <span className="font-mono text-[10px] tracking-widest uppercase text-[#C8A96E]">Nuestro compromiso</span>
          </div>
          <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-[#F0EDE8] mb-4">
            Tu propiedad en las mejores manos.
            <br />
            <span className="text-[#C8A96E]">Tu tranquilidad, nuestra prioridad.</span>
          </h2>
          <p className="text-[#9A9490] text-sm sm:text-base mb-10 max-w-md mx-auto">
            No vendemos ilusiones. Vendemos resultados. Más de 200 familias ya confiaron en nosotros.
            <strong className="text-[#F0EDE8]"> ¿Estás listo para ser el siguiente?</strong>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#cotiza" id="final-cta-primary"
               className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-[#C8A96E] text-[#090A0D] font-black px-9 py-4 text-sm tracking-wide hover:bg-[#E2C99A] active:scale-95 transition-all shadow-xl shadow-[#C8A96E]/30">
              <Calendar className="h-4 w-4" />
              Agenda tu valuación gratis
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href={waUrl} target="_blank" rel="noreferrer" id="final-cta-wa"
               className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#25D366]/30 bg-[#25D366]/10 text-[#25D366] font-bold px-9 py-4 text-sm hover:bg-[#25D366]/20 active:scale-95 transition-all">
              <MessageCircle className="h-4 w-4" />
              Escríbenos ahora
            </a>
          </div>
          <div className="mt-8 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#23252F] border border-[#23252F]">
            <AlertCircle className="h-3.5 w-3.5 text-[#C8A96E] shrink-0" />
            <p className="text-[11px] text-[#9A9490]">
              Solo <strong className="text-[#C8A96E]">{slotsLeft} cupos disponibles</strong> este mes. Actúa antes de que se llenen.
            </p>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="border-t border-[#23252F] py-8 px-4 bg-[#0F1116]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-[#C8A96E]/10 border border-[#C8A96E]/30 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-[#C8A96E]" />
            </div>
            <div className="leading-none">
              <p className="font-heading font-black text-sm text-[#F0EDE8]">CIMA Propiedades</p>
              {agent.name && <p className="font-mono text-[8px] tracking-[0.2em] text-[#56524E] uppercase">Asesor: {agent.name}</p>}
            </div>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-[#56524E] font-mono">
            <a href={waUrl} target="_blank" rel="noreferrer" className="hover:text-[#9A9490] transition-colors">{agent.waDisplay}</a>
            <span>·</span>
            <a href="https://www.cimapropiedades.com" className="hover:text-[#9A9490] transition-colors">cimapropiedades.com</a>
          </div>
          <p className="font-mono text-[10px] text-[#56524E]">*Aplican condiciones.</p>
        </div>
      </footer>
    </div>
  );
}
