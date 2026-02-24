"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const FAQS = [
  {
    q: "¿Por qué su comisión varía según el valor?",
    tag: "Comisión",
    a: "Nuestra comisión es dinámica porque el esfuerzo y la inversión en marketing escalan con la propiedad. Esto incluye fotos y video profesional, staging virtual con IA, publicidad pagada en todos los portales y redes, y un equipo dedicado. A diferencia de otros, nosotros invertimos capital propio para asegurar tu venta.",
  },
  {
    q: "¿Qué sucede si no venden en 30 días?",
    tag: "Garantía",
    a: "Mantenemos nuestra garantía de '30 días o comisión cero'. Si no logramos la venta en los primeros 30 días de publicación, nuestra comisión desaparece. Esto nos impulsa a ser extremadamente agresivos con la estrategia y el filtrado de compradores desde el primer minuto.",
  },
  {
    q: "¿Requieren contrato de exclusividad?",
    tag: "Contratos",
    a: "Sí, solicitamos un contrato de exclusividad de 60 días. Esto es fundamental porque realizamos una inversión económica real en tu propiedad (fotografía profesional, staging con IA y pauta publicitaria pagada). Necesitamos este compromiso mutuo para dedicarle el 100% de nuestros recursos a tu venta.",
  },
  {
    q: "¿Cómo determinan el precio de venta?",
    tag: "Valuación",
    a: "Utilizamos una valuación comparativa de mercado avanzada: analizamos datos reales de cierres recientes en tu zona de Monterrey, tendencias actuales y las mejoras únicas de tu propiedad. No te damos el precio que quieres oír, sino el que los compradores están dispuestos a pagar hoy.",
  },
  {
    q: "¿Qué incluye exactamente el servicio?",
    tag: "Incluye",
    a: "Sesión profesional de foto y video, Staging Virtual con IA (remodelación y decoración digital), pauta pagada en Inmuebles24, Lamudi, Vivanuncios, Facebook e Instagram, agentes de IA para atención 24/7 de leads, filtrado de capacidad económica, y acompañamiento legal total.",
  },
  {
    q: "¿Cuánto tardan en publicar mi propiedad?",
    tag: "Tiempo",
    a: "Normalmente en 48-72 horas. Tras la firma del contrato, agendamos la sesión de fotos de inmediato. Una vez procesadas las imágenes y el staging con IA, lanzamos la campaña masiva. El reloj de la garantía de 30 días comienza el día de la publicación oficial.",
  },
  {
    q: "¿Qué condiciones aplican a la garantía de 30 días?",
    tag: "Legal",
    a: "La garantía aplica cuando se cumplen las condiciones básicas de colaboración: (1) Precio alineado a la valuación profesional; (2) Documentación legal en regla y disponible; (3) Facilitar el acceso para visitas programadas. El objetivo de la exclusividad de 60 días es precisamente blindar tu inversión y asegurar el cierre exitoso.",
  },
];

export default function GuaranteeFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-2">
      {FAQS.map((faq, i) => (
        <div
          key={i}
          className={`rounded-xl border transition-colors duration-200 ${open === i
            ? "border-cima-gold/30 bg-cima-card"
            : "border-cima-border bg-cima-card hover:border-cima-border"
            }`}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center gap-4 px-5 py-4 text-left"
          >
            <span className="font-mono text-[9px] tracking-widest text-cima-gold uppercase shrink-0 hidden sm:block">
              {faq.tag}
            </span>
            <p className={`flex-1 font-heading font-semibold text-sm transition-colors ${open === i ? "text-cima-text" : "text-cima-text-muted"
              }`}>
              {faq.q}
            </p>
            <div className={`shrink-0 h-5 w-5 rounded-full flex items-center justify-center border transition-colors ${open === i
              ? "border-cima-gold bg-cima-gold/10 text-cima-gold"
              : "border-cima-border text-cima-text-dim"
              }`}>
              {open === i
                ? <Minus className="h-2.5 w-2.5" />
                : <Plus className="h-2.5 w-2.5" />
              }
            </div>
          </button>

          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                key="content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 sm:pl-[calc(1.25rem+6ch+1rem)]">
                  <div className="border-l-2 border-cima-gold/30 pl-4">
                    <p className="text-sm text-cima-text-muted leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
