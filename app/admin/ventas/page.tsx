"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  BookOpen, ChevronDown, ChevronRight, MessageCircle, Phone, Check,
  AlertTriangle, TrendingUp, Users, Clock, Target,
} from "lucide-react";

/* ─── Pipeline live metrics ──────────────────────────────────────────────── */
type PipelineCount = { stage: string; count: number };

const STAGES: { key: string; label: string; color: string }[] = [
  { key: "nuevo",       label: "Nuevo",       color: "bg-cima-gold" },
  { key: "contactado",  label: "Contactado",  color: "bg-blue-500" },
  { key: "valuacion",   label: "Valuación",   color: "bg-purple-500" },
  { key: "captado",     label: "Captado",     color: "bg-emerald-500" },
  { key: "publicado",   label: "Publicado",   color: "bg-cyan-500" },
  { key: "negociacion", label: "Negociación", color: "bg-orange-500" },
  { key: "vendido",     label: "Vendido",     color: "bg-emerald-600" },
];

/* ─── Sales process steps ────────────────────────────────────────────────── */
const PROCESS = [
  {
    step: 1,
    title: "Primer contacto — Generar confianza",
    time: "Día 1",
    color: "border-cima-gold/40 bg-cima-gold/5",
    badge: "text-cima-gold bg-cima-gold/10 border-cima-gold/20",
    tips: [
      "Responde en menos de 5 minutos — el tiempo de respuesta impacta directamente la conversión.",
      "Preséntate con nombre, empresa y cargo. La credibilidad se construye desde el inicio.",
      "Pregunta abierta: ¿Qué te motivó a pensar en vender tu propiedad en este momento?",
      "Escucha activamente — toma notas. El propietario quiere sentirse escuchado.",
      "No hablar de precio en el primer contacto. Primero entender la necesidad.",
    ],
  },
  {
    step: 2,
    title: "Valuación — Anclar expectativas",
    time: "Día 2–5",
    color: "border-blue-500/40 bg-blue-500/5",
    badge: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    tips: [
      "Agenda la visita en los próximos 48 h. La demora enfría el interés.",
      "Lleva comparables impresos o en tablet. Los datos concretos generan credibilidad.",
      "Presenta 3 escenarios de precio: conservador, mercado y premium. El Analizador CMA te ayuda.",
      "Explica tu plan de marketing: fotos profesionales, portales, redes sociales, base de compradores.",
      "No regales el precio — el propietario que percibe valor acepta la comisión sin discutirla.",
    ],
  },
  {
    step: 3,
    title: "Captación — Firmar el contrato",
    time: "Día 5–10",
    color: "border-purple-500/40 bg-purple-500/5",
    badge: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    tips: [
      "Presenta el contrato de exclusividad en la misma reunión de valuación cuando el ambiente es positivo.",
      "Duración recomendada: 90–120 días. Suficiente para generar resultados reales.",
      "Enfatiza los beneficios de la exclusividad: dedicación total, marketing pagado, confidencialidad.",
      "Ten el contrato pre-llenado con los datos que ya tienes. Facilita el cierre inmediato.",
      "Si no firma en el momento, programa un follow-up en 48 h con un valor agregado (reporte de mercado).",
    ],
  },
  {
    step: 4,
    title: "Publicación — Visibilidad máxima",
    time: "Semana 2",
    color: "border-emerald-500/40 bg-emerald-500/5",
    badge: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    tips: [
      "Fotos profesionales obligatorias — las propiedades con buenas fotos se venden 32% más rápido.",
      "Video tour o reels para redes sociales aumentan la exposición orgánica.",
      "Publica en todos los portales el mismo día: Inmuebles24, Lamudi, Vivanuncios, MercadoLibre.",
      "Comparte en tu red de agentes — el 40% de las ventas se dan entre colegas.",
      "Reporta al propietario cada semana: vistas, consultas, impresiones. La transparencia genera lealtad.",
    ],
  },
  {
    step: 5,
    title: "Negociación y cierre",
    time: "Variable",
    color: "border-orange-500/40 bg-orange-500/5",
    badge: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    tips: [
      "Nunca negocies por WhatsApp — lleva las ofertas en persona o por videollamada.",
      "Presenta toda oferta, aunque sea baja. El propietario tiene derecho a decidir.",
      "Técnica del ancla inversa: empieza la contraoferta desde el precio de lista y baja con justificación.",
      "Cierra en partes: precio → forma de pago → fecha de entrega. Divide y vencerás.",
      "Usa el silencio. Después de presentar la contrapropuesta, no hables primero.",
    ],
  },
];

/* ─── Objections ─────────────────────────────────────────────────────────── */
const OBJECTIONS = [
  {
    obj: "\"El precio que me das está muy bajo\"",
    response:
      "Entiendo perfectamente. Por eso no te estoy dando un precio — te estoy mostrando lo que el mercado está pagando hoy por propiedades similares en tu colonia. La pregunta no es cuánto vale para ti, sino cuánto está dispuesto a pagar un comprador real.",
    extra: "Muestra comparables con fecha de venta. Los datos tienen más peso que tu opinión.",
  },
  {
    obj: "\"Voy a intentar venderla yo primero\"",
    response:
      "Por supuesto, es tu derecho. Muchos propietarios lo intentan. Lo que suele pasar es que los compradores perciben que no hay profesional de por medio y negocian más agresivo. ¿Me permites compartirte los números de cuánto tardan las ventas sin agente vs con agente?",
    extra: "Estadística local: propiedades sin agente tardan 2.5x más en venderse en MTY.",
  },
  {
    obj: "\"Tu comisión es muy alta\"",
    response:
      "Es una inversión, no un gasto. La comisión cubre fotografía profesional, publicidad digital, mi tiempo de cualificación de compradores, negociación y seguimiento legal. Un comprador sin calificar puede hacerte perder meses. ¿Cuánto te costaría tener la propiedad sin vender 6 meses más?",
    extra: "Usa el Cotizador para mostrar desglose de servicios vs comisión.",
  },
  {
    obj: "\"Necesito pensarlo / consultarlo con mi familia\"",
    response:
      "Claro que sí, es una decisión importante. Para facilitar la conversación familiar, ¿me permites preparar un resumen ejecutivo con el análisis de mercado y el plan de marketing que puedas compartir con ellos?",
    extra: "Esto te mantiene en el proceso y agrega valor antes del cierre.",
  },
  {
    obj: "\"Ya tengo otro agente interesado\"",
    response:
      "Excelente que tengas opciones. Te propongo algo: compara los planes de marketing en papel, los comparables que cada quien te presente y la experiencia de cierre reciente. Al final, elige quien te genere más confianza con datos reales.",
    extra: "No hables mal del competidor. Deja que tus datos hablen.",
  },
];

/* ─── WhatsApp scripts ───────────────────────────────────────────────────── */
const WA_SCRIPTS: { stage: string; label: string; script: string }[] = [
  {
    stage: "nuevo",
    label: "Primer contacto (lead nuevo)",
    script:
      "Hola [Nombre], soy [Tu nombre] de Cima Propiedades. Vi que tienes interés en vender tu propiedad en [Colonia/Ciudad]. Me gustaría conocer más detalles y ayudarte a posicionarla en el mejor precio del mercado. ¿Tienes 5 minutos para una llamada rápida esta tarde?",
  },
  {
    stage: "contactado",
    label: "Follow-up sin respuesta",
    script:
      "Hola [Nombre], espero que estés bien. Solo quería retomar nuestra conversación sobre tu propiedad. He estado revisando el mercado en [Colonia] y encontré información que creo te va a interesar. ¿Cuándo sería buen momento para platicar?",
  },
  {
    stage: "valuacion",
    label: "Confirmar cita de valuación",
    script:
      "Hola [Nombre], confirmo nuestra cita para el [Día] a las [Hora] en [Dirección]. Llevaré el análisis comparativo de mercado completo y te explicaré el plan de marketing personalizado para tu propiedad. ¡Nos vemos pronto!",
  },
  {
    stage: "captado",
    label: "Inicio de proceso (propiedad captada)",
    script:
      "Hola [Nombre], ¡excelente decisión! Esta semana comenzamos con la sesión de fotografía. Te confirmaré horario en las próximas 24 h. También iniciaré la publicación en todos los portales. Te enviaré un reporte semanal de visitas e interesados.",
  },
  {
    stage: "negociacion",
    label: "Presentar oferta al propietario",
    script:
      "Hola [Nombre], tengo una oferta formal para tu propiedad. Me gustaría presentártela en persona para revisarla juntos — hay algunos puntos que conviene analizar con calma. ¿Puedes hoy o mañana?",
  },
  {
    stage: "vendido",
    label: "Cierre exitoso / referidos",
    script:
      "Hola [Nombre], ¡felicidades por el cierre exitoso! Fue un placer trabajar contigo. Si conoces a alguien más que quiera vender o rentar una propiedad, estaré encantado de ayudarle con el mismo cuidado. ¡Muchas gracias por tu confianza!",
  },
];

/* ─── Closing signals ────────────────────────────────────────────────────── */
const SIGNALS_POS = [
  "Pregunta por la fecha de entrega o escrituración",
  "Menciona cómo va a usar el dinero de la venta",
  "Empieza a hablar en plural: \"nosotros necesitamos...\"",
  "Pregunta por detalles del proceso legal o notarial",
  "Hace referencias positivas a la propiedad a terceros presentes",
  "Pide que expliques la oferta una segunda vez",
];
const SIGNALS_NEG = [
  "Cruza los brazos o evita el contacto visual",
  "Respuestas monosilábicas: \"sí\", \"ok\", \"ya\"",
  "Mira el reloj repetidamente",
  "Cambia abruptamente el tema de conversación",
  "\"Tengo que pensarlo\" sin comprometerse a una fecha",
  "Empieza a hablar de objeciones nuevas al final",
];

/* ─── Component ──────────────────────────────────────────────────────────── */
export default function VentasPage() {
  const [pipeline, setPipeline] = useState<PipelineCount[]>([]);
  const [openObj, setOpenObj] = useState<number | null>(null);
  const [openStep, setOpenStep] = useState<number | null>(0);
  const [openScript, setOpenScript] = useState<number | null>(null);
  const [copied, setCopied] = useState<number | null>(null);

  const loadPipeline = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("re_seller_leads")
      .select("pipeline_stage");
    if (!data) return;
    const counts: Record<string, number> = {};
    data.forEach((r) => {
      counts[r.pipeline_stage] = (counts[r.pipeline_stage] ?? 0) + 1;
    });
    setPipeline(STAGES.map((s) => ({ stage: s.key, count: counts[s.key] ?? 0 })));
  }, []);

  useEffect(() => { loadPipeline(); }, [loadPipeline]);

  async function copyScript(text: string, idx: number) {
    await navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  }

  const total = pipeline.reduce((s, p) => s + p.count, 0);

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto space-y-8">

      {/* Header */}
      <div>
        <p className="font-mono text-[10px] tracking-[0.2em] text-cima-gold uppercase mb-1">Inteligencia comercial</p>
        <h1 className="font-heading font-bold text-2xl text-cima-text flex items-center gap-2.5">
          <BookOpen className="h-5 w-5 text-cima-gold" />
          Guía de Ventas
        </h1>
        <p className="text-sm text-cima-text-muted mt-1">Proceso, objeciones, scripts y señales de cierre para el equipo.</p>
      </div>

      {/* Live pipeline metrics */}
      {total > 0 && (
        <div className="rounded-xl border border-cima-border bg-cima-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-4 w-4 text-cima-gold" />
            <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">Pipeline en vivo — {total} leads</p>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
            {pipeline.map((p, i) => {
              const stage = STAGES[i];
              return (
                <div key={p.stage} className="text-center">
                  <p className={`font-heading font-bold text-2xl leading-none mb-1 ${p.count > 0 ? "text-cima-text" : "text-cima-text-dim"}`}>
                    {p.count}
                  </p>
                  <p className="font-mono text-[9px] text-cima-text-dim uppercase">{stage.label}</p>
                  <div className={`h-1 rounded-full mt-1.5 ${p.count > 0 ? stage.color : "bg-cima-surface"}`} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Process */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="h-4 w-4 text-cima-gold" />
          <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">Proceso de venta — 5 pasos</p>
        </div>

        {PROCESS.map((step, i) => (
          <div key={step.step} className={`rounded-xl border ${step.color} overflow-hidden`}>
            <button
              onClick={() => setOpenStep(openStep === i ? null : i)}
              className="w-full flex items-center gap-3 px-5 py-4 text-left"
            >
              <span className={`font-mono text-[10px] border rounded px-1.5 py-0.5 ${step.badge}`}>
                PASO {step.step}
              </span>
              <span className="flex-1 font-medium text-sm text-cima-text">{step.title}</span>
              <span className="font-mono text-[10px] text-cima-text-dim shrink-0">{step.time}</span>
              {openStep === i
                ? <ChevronDown className="h-4 w-4 text-cima-text-dim shrink-0" />
                : <ChevronRight className="h-4 w-4 text-cima-text-dim shrink-0" />}
            </button>
            {openStep === i && (
              <div className="px-5 pb-4 space-y-2 border-t border-cima-border/40">
                {step.tips.map((tip, j) => (
                  <div key={j} className="flex items-start gap-2.5 pt-2">
                    <Check className="h-3.5 w-3.5 text-cima-gold shrink-0 mt-0.5" />
                    <p className="text-sm text-cima-text-muted">{tip}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </section>

      {/* Objections */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="h-4 w-4 text-orange-400" />
          <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">Manejo de objeciones</p>
        </div>

        {OBJECTIONS.map((o, i) => (
          <div key={i} className="rounded-xl border border-cima-border bg-cima-card overflow-hidden">
            <button
              onClick={() => setOpenObj(openObj === i ? null : i)}
              className="w-full flex items-center gap-3 px-5 py-4 text-left"
            >
              <span className="flex-1 text-sm font-medium text-orange-400 italic">{o.obj}</span>
              {openObj === i
                ? <ChevronDown className="h-4 w-4 text-cima-text-dim shrink-0" />
                : <ChevronRight className="h-4 w-4 text-cima-text-dim shrink-0" />}
            </button>
            {openObj === i && (
              <div className="px-5 pb-4 border-t border-cima-border space-y-3">
                <p className="text-sm text-cima-text-muted pt-3 leading-relaxed">{o.response}</p>
                <div className="flex items-start gap-2 rounded-lg bg-cima-surface border border-cima-border px-3 py-2.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-cima-gold shrink-0 mt-0.5" />
                  <p className="text-xs text-cima-text-muted">{o.extra}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </section>

      {/* WhatsApp scripts */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <MessageCircle className="h-4 w-4 text-[#25D366]" />
          <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">Scripts de WhatsApp por etapa</p>
        </div>

        {WA_SCRIPTS.map((ws, i) => {
          const stage = STAGES.find((s) => s.key === ws.stage);
          return (
            <div key={i} className="rounded-xl border border-cima-border bg-cima-card overflow-hidden">
              <button
                onClick={() => setOpenScript(openScript === i ? null : i)}
                className="w-full flex items-center gap-3 px-5 py-4 text-left"
              >
                {stage && (
                  <span className={`h-2 w-2 rounded-full shrink-0 ${stage.color}`} />
                )}
                <span className="flex-1 text-sm font-medium text-cima-text">{ws.label}</span>
                {openScript === i
                  ? <ChevronDown className="h-4 w-4 text-cima-text-dim shrink-0" />
                  : <ChevronRight className="h-4 w-4 text-cima-text-dim shrink-0" />}
              </button>
              {openScript === i && (
                <div className="px-5 pb-4 border-t border-cima-border">
                  <p className="text-sm text-cima-text-muted pt-3 leading-relaxed whitespace-pre-line">{ws.script}</p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => copyScript(ws.script, i)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-cima-border bg-cima-surface text-cima-text-muted hover:text-cima-text hover:border-cima-gold/40 transition-colors"
                    >
                      {copied === i ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Phone className="h-3.5 w-3.5" />}
                      {copied === i ? "Copiado" : "Copiar mensaje"}
                    </button>
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(ws.script)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      Abrir en WhatsApp
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* Closing signals */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-4 w-4 text-cima-gold" />
          <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">Señales de cierre</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <p className="font-mono text-[10px] tracking-[0.15em] text-emerald-400 uppercase">Señales positivas — ¡avanza!</p>
            </div>
            <div className="space-y-2">
              {SIGNALS_POS.map((s, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-cima-text-muted">{s}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-2 w-2 rounded-full bg-red-500" />
              <p className="font-mono text-[10px] tracking-[0.15em] text-red-400 uppercase">Señales negativas — maneja primero</p>
            </div>
            <div className="space-y-2">
              {SIGNALS_NEG.map((s, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Clock className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-cima-text-muted">{s}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
