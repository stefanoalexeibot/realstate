"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const FAQS = [
  {
    q: "¿Por qué el 5% si hay opciones más baratas?",
    tag: "Comisión",
    a: "El 5% incluye fotos profesionales, video, publicidad digital pagada en portales y redes, y nuestro equipo dedicado a conseguirte el mejor precio en el menor tiempo. Agencias que cobran menos generalmente dejan la foto con tu celular y esperan a que llames tú. Nosotros trabajamos activamente tu venta.",
  },
  {
    q: "¿Qué pasa si no venden en 30 días?",
    tag: "Garantía",
    a: "Si no vendemos en 30 días calendarios desde que publicamos tu propiedad, no cobramos comisión. Punto. Eso nos obliga a hacer nuestro trabajo bien desde el primer día: precio correcto, máxima exposición y compradores filtrados.",
  },
  {
    q: "¿Necesito firmar un contrato de exclusividad?",
    tag: "Contratos",
    a: "No. Puedes trabajar con otras inmobiliarias al mismo tiempo si quieres. Nuestra confianza está en los resultados, no en encerrarte en un contrato. Eso sí, te pediremos un convenio simple de comisión para formalizarla cuando se cierre la venta.",
  },
  {
    q: "¿Cómo determinan el precio de venta?",
    tag: "Valuación",
    a: "Con una valuación comparativa de mercado gratuita: analizamos propiedades similares vendidas recientemente en tu zona, el estado actual del mercado en MTY y las características específicas de tu inmueble. Te damos un rango de precio real, no uno inflado para ganar tu firma.",
  },
  {
    q: "¿Qué incluye exactamente el servicio?",
    tag: "Incluye",
    a: "Sesión de fotos y video profesional, publicación en Inmuebles24, Lamudi, Vivanuncios y redes sociales, filtrado de compradores serios (pre-calificamos su capacidad económica), coordinación de visitas, negociación de precio, y acompañamiento hasta la firma ante notario.",
  },
  {
    q: "¿Cuánto tardan en publicar mi propiedad?",
    tag: "Tiempo",
    a: "24-48 horas después de la sesión de fotos tu propiedad está publicada en todos los portales. La sesión se agenda normalmente dentro de los primeros 2 días hábiles. El reloj de los 30 días empieza cuando publicamos.",
  },
];

export default function GuaranteeFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-2">
      {FAQS.map((faq, i) => (
        <div
          key={i}
          className={`rounded-xl border transition-colors duration-200 ${
            open === i
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
            <p className={`flex-1 font-heading font-semibold text-sm transition-colors ${
              open === i ? "text-cima-text" : "text-cima-text-muted"
            }`}>
              {faq.q}
            </p>
            <div className={`shrink-0 h-5 w-5 rounded-full flex items-center justify-center border transition-colors ${
              open === i
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
