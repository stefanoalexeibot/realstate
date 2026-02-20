"use client";

import { useState } from "react";
import { FileText, Printer, ChevronDown } from "lucide-react";
import { formatPrice } from "@/lib/utils";

/* ─── Template types ─────────────────────────────────────────────────────── */
type TemplateKey = "exclusividad" | "ficha" | "oferta" | "visita";

interface Template {
  key: TemplateKey;
  label: string;
  description: string;
  fields: Field[];
}

interface Field {
  key: string;
  label: string;
  type: "text" | "number" | "date" | "textarea" | "select";
  placeholder?: string;
  options?: string[];
  required?: boolean;
}

/* ─── Templates definition ───────────────────────────────────────────────── */
const TEMPLATES: Template[] = [
  {
    key: "exclusividad",
    label: "Contrato de Exclusividad",
    description: "Autorización para comercialización exclusiva de la propiedad.",
    fields: [
      { key: "fecha",           label: "Fecha",                  type: "date",     required: true },
      { key: "propietario",     label: "Nombre del propietario", type: "text",     placeholder: "Nombre completo", required: true },
      { key: "domicilio_prop",  label: "Domicilio del propietario", type: "text",  placeholder: "Calle, número, colonia" },
      { key: "descripcion",     label: "Descripción de la propiedad", type: "textarea", placeholder: "Casa de 3 recámaras, 2 baños, 180 m², Cumbres..." },
      { key: "direccion",       label: "Dirección de la propiedad", type: "text",  placeholder: "Calle, número, colonia, ciudad" },
      { key: "precio",          label: "Precio de lista (MXN)",   type: "number",  placeholder: "3500000" },
      { key: "operacion",       label: "Tipo de operación",       type: "select",  options: ["Venta", "Renta"] },
      { key: "vigencia",        label: "Vigencia (días)",         type: "select",  options: ["90", "120", "180"] },
      { key: "comision",        label: "Comisión (%)",            type: "select",  options: ["3", "3.5", "4", "5"] },
      { key: "agente",          label: "Nombre del agente",       type: "text",    placeholder: "Tu nombre completo" },
    ],
  },
  {
    key: "ficha",
    label: "Ficha Técnica",
    description: "Resumen completo de la propiedad para compradores.",
    fields: [
      { key: "titulo",          label: "Título de la propiedad",  type: "text",    placeholder: "Casa en Cumbres 5to Sector", required: true },
      { key: "direccion",       label: "Dirección",               type: "text",    placeholder: "Calle, número, colonia" },
      { key: "precio",          label: "Precio (MXN)",            type: "number",  placeholder: "3500000" },
      { key: "operacion",       label: "Operación",               type: "select",  options: ["Venta", "Renta"] },
      { key: "tipo",            label: "Tipo de propiedad",       type: "select",  options: ["Casa", "Departamento", "Terreno", "Local", "Oficina"] },
      { key: "m2_const",        label: "m² construcción",         type: "number",  placeholder: "180" },
      { key: "m2_terreno",      label: "m² terreno",              type: "number",  placeholder: "220" },
      { key: "recamaras",       label: "Recámaras",               type: "select",  options: ["1", "2", "3", "4", "5+"] },
      { key: "banos",           label: "Baños",                   type: "select",  options: ["1", "1.5", "2", "2.5", "3", "4+"] },
      { key: "estacionamiento", label: "Estacionamientos",        type: "select",  options: ["0", "1", "2", "3", "4+"] },
      { key: "antiguedad",      label: "Antigüedad",              type: "text",    placeholder: "5 años / Obra nueva" },
      { key: "descripcion",     label: "Descripción / amenidades",type: "textarea",placeholder: "Cocina integral, jardín, alberca..." },
      { key: "agente",          label: "Agente de contacto",      type: "text",    placeholder: "Nombre y teléfono" },
    ],
  },
  {
    key: "oferta",
    label: "Carta de Oferta",
    description: "Oferta formal de compra para presentar al propietario.",
    fields: [
      { key: "fecha",           label: "Fecha",                   type: "date",    required: true },
      { key: "comprador",       label: "Nombre del comprador",    type: "text",    placeholder: "Nombre completo", required: true },
      { key: "propietario",     label: "Nombre del propietario",  type: "text",    placeholder: "Nombre completo" },
      { key: "descripcion",     label: "Descripción de la propiedad", type: "text",placeholder: "Casa en Cumbres, Monterrey" },
      { key: "precio_lista",    label: "Precio de lista (MXN)",   type: "number",  placeholder: "3500000" },
      { key: "precio_oferta",   label: "Precio ofrecido (MXN)",   type: "number",  placeholder: "3200000", required: true },
      { key: "forma_pago",      label: "Forma de pago",           type: "select",  options: ["Contado", "Crédito hipotecario", "Infonavit", "Fovissste", "Mixto"] },
      { key: "anticipo",        label: "Anticipo propuesto (MXN)",type: "number",  placeholder: "100000" },
      { key: "fecha_entrega",   label: "Fecha de entrega deseada",type: "date" },
      { key: "vigencia_oferta", label: "Vigencia de la oferta",   type: "select",  options: ["24 horas", "48 horas", "72 horas", "1 semana"] },
      { key: "condiciones",     label: "Condiciones / observaciones", type: "textarea", placeholder: "Sujeto a avalúo, incluye muebles..." },
      { key: "agente",          label: "Agente intermediario",    type: "text",    placeholder: "Nombre y teléfono" },
    ],
  },
  {
    key: "visita",
    label: "Constancia de Visita",
    description: "Registro formal de visita para propiedades en exclusividad.",
    fields: [
      { key: "fecha",           label: "Fecha de visita",         type: "date",    required: true },
      { key: "hora",            label: "Hora",                    type: "text",    placeholder: "11:00 AM" },
      { key: "propiedad",       label: "Propiedad visitada",      type: "text",    placeholder: "Dirección completa", required: true },
      { key: "propietario",     label: "Propietario",             type: "text",    placeholder: "Nombre completo" },
      { key: "visitante",       label: "Nombre del visitante",    type: "text",    placeholder: "Nombre completo", required: true },
      { key: "telefono",        label: "Teléfono del visitante",  type: "text",    placeholder: "+52 81 XXXX XXXX" },
      { key: "agente",          label: "Agente que realizó la visita", type: "text", placeholder: "Nombre completo" },
      { key: "observaciones",   label: "Observaciones",           type: "textarea",placeholder: "Interés del visitante, preguntas, seguimiento..." },
    ],
  },
];

/* ─── Preview builders ───────────────────────────────────────────────────── */
function buildPreview(template: Template, values: Record<string, string>): string {
  const v = (k: string) => values[k] || "_______________";
  const price = (k: string) => {
    const n = Number(values[k]);
    return n > 0 ? formatPrice(n) : "_______________";
  };
  const today = new Date().toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });

  if (template.key === "exclusividad") {
    const vigDays = v("vigencia");
    const vigFin = values["fecha"]
      ? new Date(new Date(values["fecha"]).getTime() + Number(vigDays) * 86400000)
          .toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })
      : "_______________";
    return `CONTRATO DE PRESTACIÓN DE SERVICIOS INMOBILIARIOS EN EXCLUSIVA

Monterrey, Nuevo León, a ${values["fecha"] ? new Date(values["fecha"] + "T12:00:00").toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" }) : today}.

El suscrito, ${v("propietario")}, con domicilio en ${v("domicilio_prop")}, en adelante denominado "EL PROPIETARIO", otorga a Cima Propiedades, en adelante "LA AGENCIA", autorización exclusiva para promover y comercializar la siguiente propiedad:

PROPIEDAD: ${v("descripcion")}
UBICACIÓN: ${v("direccion")}
PRECIO DE LISTA: ${price("precio")} (${v("operacion").toUpperCase()})

CONDICIONES:
• Vigencia del contrato: ${vigDays} días naturales (hasta el ${vigFin})
• Comisión acordada: ${v("comision")}% + IVA sobre el precio de venta/renta
• LA AGENCIA queda facultada para publicar, mostrar y negociar la propiedad dentro del precio acordado.
• EL PROPIETARIO se compromete a no negociar de forma directa con compradores que hayan sido presentados por LA AGENCIA durante la vigencia y 180 días posteriores.

Ambas partes manifiestan su conformidad con las condiciones anteriores.

______________________________          ______________________________
EL PROPIETARIO                          AGENTE RESPONSABLE
${v("propietario")}                     ${v("agente")}`;
  }

  if (template.key === "ficha") {
    return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FICHA TÉCNICA — CIMA PROPIEDADES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${v("titulo").toUpperCase()}

PRECIO: ${price("precio")}  |  OPERACIÓN: ${v("operacion")}
TIPO: ${v("tipo")}  |  UBICACIÓN: ${v("direccion")}

─────────────────────────────────────
CARACTERÍSTICAS
─────────────────────────────────────
Construcción:       ${v("m2_const")} m²
Terreno:            ${v("m2_terreno")} m²
Recámaras:          ${v("recamaras")}
Baños:              ${v("banos")}
Estacionamientos:   ${v("estacionamiento")}
Antigüedad:         ${v("antiguedad")}

─────────────────────────────────────
DESCRIPCIÓN
─────────────────────────────────────
${v("descripcion")}

─────────────────────────────────────
CONTACTO: ${v("agente")}
www.propiedades-mty.vercel.app
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
  }

  if (template.key === "oferta") {
    return `CARTA DE OFERTA DE COMPRAVENTA

Monterrey, Nuevo León, a ${values["fecha"] ? new Date(values["fecha"] + "T12:00:00").toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" }) : today}.

${v("propietario")} (El Propietario)
PRESENTE:

Por medio de la presente, ${v("comprador")} (El Comprador), presenta oferta formal de adquisición sobre la propiedad ubicada en:

${v("descripcion")}

TÉRMINOS DE LA OFERTA:
• Precio de lista:     ${price("precio_lista")}
• Precio ofrecido:     ${price("precio_oferta")}
• Forma de pago:       ${v("forma_pago")}
• Anticipo propuesto:  ${price("anticipo")}
• Entrega:             ${v("fecha_entrega") || "A convenir"}
• Vigencia:            ${v("vigencia_oferta")} a partir de la fecha

CONDICIONES ADICIONALES:
${v("condiciones")}

Esta oferta no constituye contrato vinculante hasta la firma de la promesa de compraventa correspondiente.

______________________________          ______________________________
EL COMPRADOR                            AGENTE INTERMEDIARIO
${v("comprador")}                       ${v("agente")}`;
  }

  if (template.key === "visita") {
    return `CONSTANCIA DE VISITA A PROPIEDAD

FECHA: ${values["fecha"] ? new Date(values["fecha"] + "T12:00:00").toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" }) : today}  |  HORA: ${v("hora")}

PROPIEDAD VISITADA:
${v("propiedad")}
Propietario: ${v("propietario")}

DATOS DEL VISITANTE:
Nombre: ${v("visitante")}
Teléfono: ${v("telefono")}

AGENTE QUE REALIZÓ LA VISITA:
${v("agente")}

OBSERVACIONES:
${v("observaciones")}

─────────────────────────────────────────────────────
El visitante declara haber conocido la propiedad arriba descrita en compañía del agente inmobiliario de Cima Propiedades y acepta que cualquier negociación directa con el propietario, sin la intervención de la agencia, generará el derecho a cobro de honorarios.

______________________________          ______________________________
FIRMA DEL VISITANTE                     AGENTE RESPONSABLE
${v("visitante")}                       ${v("agente")}

Cima Propiedades  |  www.propiedades-mty.vercel.app`;
  }

  return "";
}

/* ─── Component ──────────────────────────────────────────────────────────── */
export default function DocumentosPage() {
  const [selectedKey, setSelectedKey] = useState<TemplateKey>("exclusividad");
  const [values, setValues] = useState<Record<string, string>>({});

  const template = TEMPLATES.find((t) => t.key === selectedKey)!;
  const preview = buildPreview(template, values);

  function set(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleTemplateChange(key: TemplateKey) {
    setSelectedKey(key);
    setValues({});
  }

  function handlePrint() {
    const content = preview;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${template.label} — Cima Propiedades</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Courier New', monospace;
              font-size: 11pt;
              line-height: 1.6;
              color: #111;
              padding: 2.5cm 2cm;
              background: white;
            }
            pre {
              white-space: pre-wrap;
              word-break: break-word;
              font-family: inherit;
              font-size: inherit;
            }
            @media print {
              body { padding: 1.5cm; }
            }
          </style>
        </head>
        <body>
          <pre>${content.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    w.document.close();
  }

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <p className="font-mono text-[10px] tracking-[0.2em] text-cima-gold uppercase mb-1">Herramienta</p>
        <h1 className="font-heading font-bold text-2xl text-cima-text flex items-center gap-2.5">
          <FileText className="h-5 w-5 text-cima-gold" />
          Creador de Documentos
        </h1>
        <p className="text-sm text-cima-text-muted mt-1">Genera documentos inmobiliarios listos para imprimir o compartir en segundos.</p>
      </div>

      {/* Template selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {TEMPLATES.map((t) => (
          <button
            key={t.key}
            onClick={() => handleTemplateChange(t.key)}
            className={`rounded-xl border p-4 text-left transition-colors ${
              selectedKey === t.key
                ? "border-cima-gold/40 bg-cima-gold/5"
                : "border-cima-border bg-cima-card hover:border-cima-gold/20 hover:bg-cima-surface/30"
            }`}
          >
            <p className={`text-xs font-semibold mb-1 ${selectedKey === t.key ? "text-cima-gold" : "text-cima-text"}`}>
              {t.label}
            </p>
            <p className="text-[10px] text-cima-text-dim leading-tight">{t.description}</p>
          </button>
        ))}
      </div>

      {/* Editor + Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Form */}
        <div className="rounded-xl border border-cima-border bg-cima-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">Datos del documento</p>
            <ChevronDown className="h-3.5 w-3.5 text-cima-text-dim" />
          </div>

          {template.fields.map((f) => (
            <div key={f.key}>
              <label className="block text-xs font-medium text-cima-text-muted mb-1.5">
                {f.label}{f.required && <span className="text-cima-gold ml-0.5">*</span>}
              </label>
              {f.type === "textarea" ? (
                <textarea
                  rows={3}
                  value={values[f.key] ?? ""}
                  onChange={(e) => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full rounded-lg bg-cima-surface border border-cima-border px-3 py-2.5 text-sm text-cima-text placeholder-cima-text-dim focus:outline-none focus:border-cima-gold/50 transition-colors resize-none"
                />
              ) : f.type === "select" ? (
                <select
                  value={values[f.key] ?? ""}
                  onChange={(e) => set(f.key, e.target.value)}
                  className="w-full rounded-lg bg-cima-surface border border-cima-border px-3 py-2.5 text-sm text-cima-text focus:outline-none focus:border-cima-gold/50 transition-colors"
                >
                  <option value="">— Seleccionar —</option>
                  {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input
                  type={f.type}
                  value={values[f.key] ?? ""}
                  onChange={(e) => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full rounded-lg bg-cima-surface border border-cima-border px-3 py-2.5 text-sm text-cima-text placeholder-cima-text-dim focus:outline-none focus:border-cima-gold/50 transition-colors"
                />
              )}
            </div>
          ))}
        </div>

        {/* Preview + actions */}
        <div className="space-y-4">
          <div className="rounded-xl border border-cima-border bg-cima-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-cima-border">
              <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">Vista previa</p>
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cima-gold text-cima-bg text-xs font-semibold hover:bg-cima-gold-light transition-colors"
              >
                <Printer className="h-3.5 w-3.5" />
                Imprimir / PDF
              </button>
            </div>
            <div className="p-5 overflow-auto max-h-[600px]">
              <pre className="text-[11px] font-mono text-cima-text-muted whitespace-pre-wrap leading-relaxed">
                {preview}
              </pre>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
