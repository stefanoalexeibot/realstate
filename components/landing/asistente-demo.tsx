"use client";

import { useState, useEffect, useRef } from "react";
import { Bot, User, Phone, Send, CalendarClock } from "lucide-react";

type Message = { from: "bot" | "user"; text: string; };

const SUGGESTIONS = [
  { label: "¿Cuánto cobran?", id: "comision" },
  { label: "¿Cuánto tarda la venta?", id: "tiempo" },
  { label: "¿Necesito exclusividad?", id: "exclusiva" },
  { label: "¿En qué zonas trabajan?", id: "zonas" },
  { label: "¿Cómo es el proceso?", id: "proceso" },
  { label: "¿Cuándo puedo empezar?", id: "inicio" },
];

const ANSWERS: Record<string, string> = {
  comision: `Nuestra comisión varía según el valor de tu propiedad:

• Hasta $1,000,000 → 6%
• $1M – $3M → 5%
• $3M – $6M → 4.5%
• $6M – $10M → 4%
• Más de $10M → 6%

Todo se paga al escriturar. Cero cuotas iniciales, cero mensualidades.`,

  tiempo: `El promedio en MTY es de 22 días con Cima.

Nuestra garantía: si tu propiedad no se vende en los primeros 30 días desde que la publicamos, nuestra comisión es cero.

Esto nos obliga a trabajar rápido y con compradores serios desde el día uno.`,

  exclusiva: `Sí, trabajamos en exclusividad mínima de 60 días.

¿Por qué? Porque así podemos:
• Invertir en fotografía profesional pagada por nosotros
• Publicar en todos los portales sin restricciones
• Calificar compradores antes de cada visita
• Negociar en tu nombre con toda la información

Un agente sin exclusividad no tiene incentivo de invertir en tu propiedad.`,

  zonas: `Cubrimos toda la Zona Metropolitana de Monterrey:

📍 San Pedro Garza García
📍 Valle Oriente
📍 Cumbres (todos los sectores)
📍 Obispado
📍 San Jerónimo
📍 Monterrey Centro
📍 Y más colonias en expansión

¿En qué zona está tu propiedad?`,

  proceso: `El proceso con Cima es simple y en 4 pasos:

1️⃣ Valuación gratuita de tu propiedad
2️⃣ Fotografía profesional + publicación en portales
3️⃣ Gestión de visitas con compradores calificados
4️⃣ Cierre, escrituración y entrega

Todo coordinado por tu agente asignado. Sin que tú tengas que hacer nada más que firmar al final.`,

  inicio: `¡Hoy mismo! 🚀 No hay ningún trámite previo.

En menos de 24 horas un asesor de Cima visita tu propiedad, te da el precio óptimo de mercado y te explica el plan de venta sin costo y sin compromiso.

¿Cómo prefieres que te contactemos?`,
};

const GREETING =
  "Hola 👋 Soy el asistente virtual de Cima Propiedades. Estoy aquí para resolver tus dudas sobre vender tu casa en Monterrey.\n\n¿Qué te gustaría saber?";

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-2 w-2 rounded-full bg-cima-gold/60 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.8s" }}
        />
      ))}
    </div>
  );
}

function BotMessage({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const speed = text.length > 200 ? 12 : 18;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, 1000 / speed);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <p className="text-sm text-cima-text-muted whitespace-pre-line leading-relaxed">
      {displayed}
      {!done && <span className="inline-block w-0.5 h-3.5 bg-cima-gold/70 ml-0.5 animate-pulse align-middle" />}
    </p>
  );
}

export default function AsistenteDemo() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const [usedIds, setUsedIds] = useState<string[]>([]);
  const [showCTA, setShowCTA] = useState(false);
  const [started, setStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  // Start demo when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          setTyping(true);
          setTimeout(() => {
            setTyping(false);
            setMessages([{ from: "bot", text: GREETING }]);
          }, 1200);
        }
      },
      { threshold: 0.3 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [started]);

  // Scroll chat container to bottom on new messages (not the whole page)
  useEffect(() => {
    const el = messagesRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing]);

  function ask(id: string, label: string) {
    if (usedIds.includes(id)) return;
    setUsedIds((prev) => [...prev, id]);
    setMessages((prev) => [...prev, { from: "user", text: label }]);
    setTyping(true);

    const delay = 800 + Math.random() * 400;
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { from: "bot", text: ANSWERS[id] }]);
      if (usedIds.length >= 2) {
        setTimeout(() => setShowCTA(true), 1500);
      }
    }, delay);
  }

  const remaining = SUGGESTIONS.filter((s) => !usedIds.includes(s.id));

  return (
    <section className="px-6 py-20 border-t border-cima-border/50">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="font-mono text-[10px] tracking-[0.25em] text-cima-gold uppercase mb-3">Asesor virtual</p>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-cima-text mb-4">
            Resuelve tus dudas ahora mismo
          </h2>
          <p className="text-cima-text-muted max-w-xl mx-auto text-sm leading-relaxed">
            Prueba cómo funciona nuestra atención. Las preguntas más frecuentes de propietarios en Monterrey, respondidas al instante.
          </p>
        </div>

        {/* Chat window */}
        <div
          ref={containerRef}
          className="mx-auto max-w-2xl rounded-2xl border border-cima-border bg-cima-card overflow-hidden shadow-2xl"
        >
          {/* Chat header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-cima-border bg-cima-surface">
            <div className="relative">
              <div className="h-9 w-9 rounded-full bg-cima-gold/15 border border-cima-gold/30 flex items-center justify-center">
                <Bot className="h-4.5 w-4.5 text-cima-gold" />
              </div>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-cima-surface" />
            </div>
            <div>
              <p className="text-sm font-semibold text-cima-text">Asesor Virtual · Cima</p>
              <p className="text-[10px] text-emerald-400 font-mono">En línea ahora</p>
            </div>
            <div className="ml-auto flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className={`h-2.5 w-2.5 rounded-full ${i === 0 ? "bg-red-500/50" : i === 1 ? "bg-amber-500/50" : "bg-emerald-500/50"}`} />
              ))}
            </div>
          </div>

          {/* Messages */}
          <div ref={messagesRef} className="h-80 overflow-y-auto px-5 py-4 space-y-4 scrollbar-thin">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.from === "user" ? "flex-row-reverse" : ""}`}>
                {/* Avatar */}
                <div className={`shrink-0 h-7 w-7 rounded-full flex items-center justify-center ${msg.from === "bot"
                  ? "bg-cima-gold/15 border border-cima-gold/30"
                  : "bg-cima-surface border border-cima-border"
                  }`}>
                  {msg.from === "bot"
                    ? <Bot className="h-3.5 w-3.5 text-cima-gold" />
                    : <User className="h-3.5 w-3.5 text-cima-text-muted" />}
                </div>

                {/* Bubble */}
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.from === "bot"
                  ? "bg-cima-surface border border-cima-border rounded-tl-sm"
                  : "bg-cima-gold/10 border border-cima-gold/20 rounded-tr-sm"
                  }`}>
                  {/* Only animate the last bot message */}
                  {msg.from === "bot" && i === messages.length - 1 ? (
                    <BotMessage text={msg.text} />
                  ) : (
                    <p className="text-sm text-cima-text-muted whitespace-pre-line leading-relaxed">{msg.text}</p>
                  )}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex gap-3">
                <div className="shrink-0 h-7 w-7 rounded-full bg-cima-gold/15 border border-cima-gold/30 flex items-center justify-center">
                  <Bot className="h-3.5 w-3.5 text-cima-gold" />
                </div>
                <div className="bg-cima-surface border border-cima-border rounded-2xl rounded-tl-sm">
                  <TypingDots />
                </div>
              </div>
            )}

          </div>

          {/* Suggestion chips + input area */}
          <div className="border-t border-cima-border px-5 py-4 space-y-3 bg-cima-surface/50">
            {!showCTA && remaining.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {remaining.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => ask(s.id, s.label)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-cima-border bg-cima-surface text-xs text-cima-text-muted hover:border-cima-gold/40 hover:text-cima-gold hover:bg-cima-gold/5 transition-all duration-200"
                  >
                    <Send className="h-2.5 w-2.5" />
                    {s.label}
                  </button>
                ))}
              </div>
            )}

            {showCTA && (
              <div className="rounded-xl border border-cima-gold/20 bg-cima-gold/5 p-4 space-y-3">
                <div>
                  <p className="text-sm font-semibold text-cima-text">¿Listo para dar el siguiente paso?</p>
                  <p className="text-xs text-cima-text-muted mt-0.5">Valuación gratuita · Sin compromiso · Hoy mismo</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <a
                    href={`https://wa.me/${process.env.NEXT_PUBLIC_CIMA_WA}?text=Hola,%20me%20gustar%C3%ADa%20agendar%20una%20cita%20virtual%20para%20vender%20mi%20propiedad`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cima-gold text-cima-bg text-xs font-bold hover:bg-cima-gold-light transition-colors"
                  >
                    <CalendarClock className="h-3.5 w-3.5" />
                    Agendar cita virtual
                  </a>
                  <a
                    href={`https://wa.me/${process.env.NEXT_PUBLIC_CIMA_WA}?text=Hola,%20quiero%20que%20me%20llamen%20para%20informaci%C3%B3n%20sobre%20vender%20mi%20propiedad`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-cima-border bg-cima-surface text-cima-text-muted text-xs font-semibold hover:border-cima-gold/40 hover:text-cima-gold transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    Solicitar llamada
                  </a>
                </div>
              </div>
            )}

            {!showCTA && (
              <p className="text-[10px] text-cima-text-dim font-mono text-center">
                Selecciona una pregunta para continuar
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
