"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { CAMPAIGN_MUNICIPALITIES, SALE_TIMELINES } from "@/lib/buyer-config";
import { buyerWhatsAppUrl, type BuyerAttribution } from "@/lib/buyer-whatsapp";

const situations = ["Necesita reparaciones", "Tiene crédito Infonavit o hipoteca", "Tiene adeudos de servicios o predial", "Está desocupada o ya no la utilizo", "Otra situación / quiero orientación"];
const field = "mt-2 w-full rounded-xl border border-cima-border bg-cima-bg px-4 py-3 text-base text-cima-text focus:outline-none focus:ring-2 focus:ring-cima-gold";

export default function QuickBuyerForm(attribution: BuyerAttribution) {
  const [municipality, setMunicipality] = useState("");
  const [otherMunicipality, setOtherMunicipality] = useState("");
  const [colonia, setColonia] = useState("");
  const [situation, setSituation] = useState("");
  const [timeline, setTimeline] = useState("");
  const [opened, setOpened] = useState(false);
  const message = [
    "Hola Cima, quiero que revisen mi casa para una posible compra.",
    `Municipio: ${municipality === "otro" ? otherMunicipality.trim() : municipality}, Nuevo León`,
    colonia.trim() ? `Colonia: ${colonia.trim()}` : "Colonia: por confirmar",
    `Situación: ${situation}`,
    `Me gustaría vender: ${SALE_TIMELINES.find((option) => option.value === timeline)?.label ?? timeline}`,
  ].join("\n");
  const whatsappUrl = buyerWhatsAppUrl(message, attribution);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setOpened(true);
    window.location.assign(whatsappUrl);
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border border-cima-gold/25 bg-cima-card p-5 sm:p-8 space-y-5">
      <div className="flex items-center gap-3 border-b border-cima-border pb-5">
        <MessageCircle className="h-6 w-6 shrink-0 text-cima-gold" aria-hidden="true" />
        <p className="text-sm text-cima-text-muted">Primero conocemos tu casa.<br /><span className="text-cima-text">Los detalles los conversamos contigo.</span></p>
      </div>
      <label htmlFor="quick-municipality" className="block text-sm font-medium">¿En qué municipio está? <span className="text-cima-gold">*</span>
        <select id="quick-municipality" required className={field} value={municipality} onChange={(event) => setMunicipality(event.target.value)}>
          <option value="">Selecciona el municipio</option>
          {CAMPAIGN_MUNICIPALITIES.map((name) => <option key={name}>{name}</option>)}
          <option value="otro">Otro municipio de Nuevo León</option>
        </select>
      </label>
      {municipality === "otro" && <label htmlFor="quick-other" className="block text-sm font-medium">Nombre del municipio
        <input id="quick-other" required pattern=".*\S.*" maxLength={80} className={field} value={otherMunicipality} onChange={(event) => setOtherMunicipality(event.target.value)} />
        <span className="mt-2 block text-xs text-cima-text-muted">Revisaremos si podemos atender esa ubicación.</span>
      </label>}
      <label htmlFor="quick-colonia" className="block text-sm font-medium">Colonia o fraccionamiento <span className="font-normal text-cima-text-muted">(opcional)</span>
        <input id="quick-colonia" maxLength={100} placeholder="Escribe la colonia de tu casa" className={field} value={colonia} onChange={(event) => setColonia(event.target.value)} />
      </label>
      <label htmlFor="quick-situation" className="block text-sm font-medium">¿Qué situación quieres resolver? <span className="text-cima-gold">*</span>
        <select id="quick-situation" required className={field} value={situation} onChange={(event) => setSituation(event.target.value)}>
          <option value="">Elige la situación principal</option>
          {situations.map((item) => <option key={item}>{item}</option>)}
        </select>
      </label>
      <label htmlFor="quick-timeline" className="block text-sm font-medium">¿Cuándo te gustaría vender? <span className="text-cima-gold">*</span>
        <select id="quick-timeline" required className={field} value={timeline} onChange={(event) => setTimeline(event.target.value)}>
          <option value="">Selecciona un plazo</option>
          {SALE_TIMELINES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
      </label>
      <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-cima-gold px-4 py-4 font-semibold text-cima-bg hover:bg-cima-gold-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cima-gold">
        Continuar en WhatsApp <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
      </button>
      <p className="text-center text-xs leading-relaxed text-cima-text-muted">Se abrirá tu mensaje listo para revisar. Pulsa Enviar en WhatsApp para hacérnoslo llegar. Solicitar una revisión no garantiza una oferta ni te obliga a vender.</p>
      {opened && <p role="status" className="text-sm text-cima-gold">¿No se abrió WhatsApp? <a className="underline" href={whatsappUrl}>Abre tu mensaje aquí</a>.</p>}
      <details id="datos" className="scroll-mt-20 border-t border-cima-border pt-4 text-xs text-cima-text-muted">
        <summary className="cursor-pointer">Cómo se comparten tus datos</summary>
        <p className="mt-3 leading-relaxed">Este formulario prepara un mensaje en tu dispositivo; no guarda la solicitud en esta página. Al continuar, los datos que escribiste se incluyen en un enlace a WhatsApp. Cima recibe el mensaje cuando lo envías allí y puede responderte por ese medio. No incluyas documentos, números de crédito ni datos bancarios.</p>
        {process.env.NEXT_PUBLIC_PRIVACY_URL && <a className="mt-3 inline-block text-cima-gold underline" href={process.env.NEXT_PUBLIC_PRIVACY_URL} target="_blank" rel="noreferrer">Consultar aviso de privacidad</a>}
      </details>
    </form>
  );
}
