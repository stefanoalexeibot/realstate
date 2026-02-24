"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { FileText, Printer, ChevronDown, Save, Loader2, Check, User } from "lucide-react";
import { formatPrice } from "@/lib/utils";

/* ─── Template types ─────────────────────────────────────────────────────── */
type TemplateKey = "exclusividad" | "ficha" | "oferta" | "visita";

const TEMPLATE_TO_DOC_TYPE: Record<TemplateKey, string> = {
  exclusividad: "contract",
  ficha:        "other",
  oferta:       "addendum",
  visita:       "other",
};

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

type PropietarioOption = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  property: {
    title: string | null;
    address: string | null;
    neighborhood: string | null;
    city: string | null;
    price: number | null;
    operation_type: string | null;
    bedrooms: number | null;
    bathrooms: number | null;
    area_m2: number | null;
    parking: number | null;
  } | null;
};

/* ─── Templates definition ───────────────────────────────────────────────── */
const TEMPLATES: Template[] = [
  {
    key: "exclusividad",
    label: "Contrato de Exclusividad",
    description: "Autorización para comercialización exclusiva de la propiedad.",
    fields: [
      { key: "fecha",           label: "Fecha",                      type: "date",     required: true },
      { key: "propietario",     label: "Nombre del propietario",     type: "text",     placeholder: "Nombre completo", required: true },
      { key: "domicilio_prop",  label: "Domicilio del propietario",  type: "text",     placeholder: "Calle, número, colonia" },
      { key: "descripcion",     label: "Descripción de la propiedad",type: "textarea", placeholder: "Casa de 3 recámaras, 2 baños, 180 m², Cumbres..." },
      { key: "direccion",       label: "Dirección de la propiedad",  type: "text",     placeholder: "Calle, número, colonia, ciudad" },
      { key: "precio",          label: "Precio de lista (MXN)",      type: "number",   placeholder: "3500000" },
      { key: "operacion",       label: "Tipo de operación",          type: "select",   options: ["Venta", "Renta"] },
      { key: "vigencia",        label: "Vigencia (días)",            type: "select",   options: ["90", "120", "180"] },
      { key: "comision",        label: "Comisión (%)",               type: "select",   options: ["3", "3.5", "4", "4.5", "5", "6"] },
      { key: "agente",          label: "Nombre del agente",          type: "text",     placeholder: "Tu nombre completo" },
    ],
  },
  {
    key: "ficha",
    label: "Ficha Técnica",
    description: "Resumen completo de la propiedad para compradores.",
    fields: [
      { key: "titulo",          label: "Título de la propiedad",     type: "text",     placeholder: "Casa en Cumbres 5to Sector", required: true },
      { key: "direccion",       label: "Dirección",                  type: "text",     placeholder: "Calle, número, colonia" },
      { key: "precio",          label: "Precio (MXN)",               type: "number",   placeholder: "3500000" },
      { key: "operacion",       label: "Operación",                  type: "select",   options: ["Venta", "Renta"] },
      { key: "tipo",            label: "Tipo de propiedad",          type: "select",   options: ["Casa", "Departamento", "Terreno", "Local", "Oficina"] },
      { key: "m2_const",        label: "m² construcción",            type: "number",   placeholder: "180" },
      { key: "m2_terreno",      label: "m² terreno",                 type: "number",   placeholder: "220" },
      { key: "recamaras",       label: "Recámaras",                  type: "select",   options: ["1", "2", "3", "4", "5+"] },
      { key: "banos",           label: "Baños",                      type: "select",   options: ["1", "1.5", "2", "2.5", "3", "4+"] },
      { key: "estacionamiento", label: "Estacionamientos",           type: "select",   options: ["0", "1", "2", "3", "4+"] },
      { key: "antiguedad",      label: "Antigüedad",                 type: "text",     placeholder: "5 años / Obra nueva" },
      { key: "descripcion",     label: "Descripción / amenidades",   type: "textarea", placeholder: "Cocina integral, jardín, alberca..." },
      { key: "agente",          label: "Agente de contacto",         type: "text",     placeholder: "Nombre y teléfono" },
    ],
  },
  {
    key: "oferta",
    label: "Carta de Oferta",
    description: "Oferta formal de compra para presentar al propietario.",
    fields: [
      { key: "fecha",           label: "Fecha",                        type: "date",     required: true },
      { key: "comprador",       label: "Nombre del comprador",         type: "text",     placeholder: "Nombre completo", required: true },
      { key: "propietario",     label: "Nombre del propietario",       type: "text",     placeholder: "Nombre completo" },
      { key: "descripcion",     label: "Descripción de la propiedad",  type: "text",     placeholder: "Casa en Cumbres, Monterrey" },
      { key: "precio_lista",    label: "Precio de lista (MXN)",        type: "number",   placeholder: "3500000" },
      { key: "precio_oferta",   label: "Precio ofrecido (MXN)",        type: "number",   placeholder: "3200000", required: true },
      { key: "forma_pago",      label: "Forma de pago",                type: "select",   options: ["Contado", "Crédito hipotecario", "Infonavit", "Fovissste", "Mixto"] },
      { key: "anticipo",        label: "Anticipo propuesto (MXN)",     type: "number",   placeholder: "100000" },
      { key: "fecha_entrega",   label: "Fecha de entrega deseada",     type: "date" },
      { key: "vigencia_oferta", label: "Vigencia de la oferta",        type: "select",   options: ["24 horas", "48 horas", "72 horas", "1 semana"] },
      { key: "condiciones",     label: "Condiciones / observaciones",  type: "textarea", placeholder: "Sujeto a avalúo, incluye muebles..." },
      { key: "agente",          label: "Agente intermediario",         type: "text",     placeholder: "Nombre y teléfono" },
    ],
  },
  {
    key: "visita",
    label: "Constancia de Visita",
    description: "Registro formal de visita para propiedades en exclusividad.",
    fields: [
      { key: "fecha",           label: "Fecha de visita",              type: "date",     required: true },
      { key: "hora",            label: "Hora",                         type: "text",     placeholder: "11:00 AM" },
      { key: "propiedad",       label: "Propiedad visitada",           type: "text",     placeholder: "Dirección completa", required: true },
      { key: "propietario",     label: "Propietario",                  type: "text",     placeholder: "Nombre completo" },
      { key: "visitante",       label: "Nombre del visitante",         type: "text",     placeholder: "Nombre completo", required: true },
      { key: "telefono",        label: "Teléfono del visitante",       type: "text",     placeholder: "+52 81 XXXX XXXX" },
      { key: "agente",          label: "Agente que realizó la visita", type: "text",     placeholder: "Nombre completo" },
      { key: "observaciones",   label: "Observaciones",                type: "textarea", placeholder: "Interés del visitante, preguntas, seguimiento..." },
    ],
  },
];

/* ─── Auto-fill map: which template fields get filled from propietario data ─ */
function getAutofill(template: TemplateKey, p: PropietarioOption): Record<string, string> {
  const prop = p.property;
  const addr = prop
    ? [prop.neighborhood, prop.city].filter(Boolean).join(", ")
    : "";
  const desc = prop
    ? [
        prop.bedrooms ? `${prop.bedrooms} rec` : null,
        prop.bathrooms ? `${prop.bathrooms} baños` : null,
        prop.area_m2 ? `${prop.area_m2} m²` : null,
        prop.neighborhood ?? null,
      ].filter(Boolean).join(", ")
    : "";
  const opMap: Record<string, string> = { venta: "Venta", renta: "Renta" };
  const op = prop?.operation_type ? (opMap[prop.operation_type] ?? "") : "";

  if (template === "exclusividad") return {
    propietario: p.name,
    descripcion: desc,
    direccion:   prop?.address ?? addr,
    precio:      prop?.price?.toString() ?? "",
    operacion:   op,
  };
  if (template === "ficha") return {
    titulo:      prop?.title ?? "",
    direccion:   prop?.address ?? addr,
    precio:      prop?.price?.toString() ?? "",
    operacion:   op,
    m2_const:    prop?.area_m2?.toString() ?? "",
    recamaras:   prop?.bedrooms?.toString() ?? "",
    banos:       prop?.bathrooms?.toString() ?? "",
    estacionamiento: prop?.parking?.toString() ?? "",
  };
  if (template === "oferta") return {
    propietario:  p.name,
    descripcion:  prop?.title ?? desc,
    precio_lista: prop?.price?.toString() ?? "",
  };
  if (template === "visita") return {
    propiedad:   prop?.address ?? addr,
    propietario: p.name,
  };
  return {};
}

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

  // Propietario selector
  const [propietarios, setPropietarios] = useState<PropietarioOption[]>([]);
  const [selectedProp, setSelectedProp] = useState<string>("");
  const [loadingProps, setLoadingProps] = useState(true);

  // Save to portal state
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const template = TEMPLATES.find((t) => t.key === selectedKey)!;
  const preview = buildPreview(template, values);

  useEffect(() => {
    async function loadPropietarios() {
      const supabase = createClient();
      const { data: props } = await supabase
        .from("re_propietarios")
        .select("id, name, email, phone")
        .order("name");

      const { data: properties } = await supabase
        .from("re_properties")
        .select("propietario_id, title, address, neighborhood, city, price, operation_type, bedrooms, bathrooms, area_m2, parking")
        .order("created_at", { ascending: false });

      const options: PropietarioOption[] = (props ?? []).map((p) => ({
        id: p.id,
        name: p.name,
        email: p.email,
        phone: p.phone,
        property: (properties ?? []).find((pr) => pr.propietario_id === p.id) ?? null,
      }));

      setPropietarios(options);
      setLoadingProps(false);
    }
    loadPropietarios();
  }, []);

  function set(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleTemplateChange(key: TemplateKey) {
    setSelectedKey(key);
    setValues({});
    setSaved(false);
    setSaveError(null);
    // Re-apply autofill for new template if propietario selected
    if (selectedProp) {
      const p = propietarios.find((x) => x.id === selectedProp);
      if (p) setValues(getAutofill(key, p));
    }
  }

  function handlePropietarioChange(propId: string) {
    setSelectedProp(propId);
    setSaved(false);
    setSaveError(null);
    if (!propId) { setValues({}); return; }
    const p = propietarios.find((x) => x.id === propId);
    if (p) setValues((prev) => ({ ...prev, ...getAutofill(selectedKey, p) }));
  }

  function handlePrint() {
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
            body { font-family: 'Courier New', monospace; font-size: 11pt; line-height: 1.6; color: #111; padding: 2.5cm 2cm; background: white; }
            pre { white-space: pre-wrap; word-break: break-word; font-family: inherit; font-size: inherit; }
            @media print { body { padding: 1.5cm; } }
          </style>
        </head>
        <body>
          <pre>${preview.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
          <script>window.onload = function() { window.print(); }<\/script>
        </body>
      </html>
    `);
    w.document.close();
  }

  async function handleSaveToPortal() {
    if (!selectedProp) { setSaveError("Selecciona un propietario primero."); return; }
    setSaving(true);
    setSaveError(null);
    setSaved(false);

    try {
      const supabase = createClient();
      const propietario = propietarios.find((x) => x.id === selectedProp)!;

      // Upload text file to cima-docs bucket
      const fileName = `${selectedKey}-${propietario.name.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.txt`;
      const blob = new Blob([preview], { type: "text/plain; charset=utf-8" });

      const { data: uploaded, error: uploadErr } = await supabase.storage
        .from("cima-docs")
        .upload(fileName, blob, { cacheControl: "3600", upsert: false });

      if (uploadErr) throw uploadErr;

      const { data: { publicUrl } } = supabase.storage.from("cima-docs").getPublicUrl(uploaded.path);

      // Save record in re_propietario_docs
      const docName = `${template.label} — ${new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })}`;
      const { error: insertErr } = await supabase.from("re_propietario_docs").insert({
        propietario_id: selectedProp,
        name: docName,
        url: publicUrl,
        type: TEMPLATE_TO_DOC_TYPE[selectedKey],
      });

      if (insertErr) throw insertErr;
      setSaved(true);
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
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
        <p className="text-sm text-cima-text-muted mt-1">Genera documentos inmobiliarios y envíalos al portal del propietario.</p>
      </div>

      {/* Propietario selector */}
      <div className="rounded-xl border border-cima-border bg-cima-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <User className="h-3.5 w-3.5 text-cima-gold" />
          <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">Propietario (opcional — auto-llena campos)</p>
        </div>
        <select
          value={selectedProp}
          onChange={(e) => handlePropietarioChange(e.target.value)}
          disabled={loadingProps}
          className="w-full sm:max-w-sm rounded-lg bg-cima-surface border border-cima-border px-3 py-2.5 text-sm text-cima-text focus:outline-none focus:border-cima-gold/50 transition-colors"
        >
          <option value="">— Sin propietario específico —</option>
          {propietarios.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}{p.property ? ` · ${p.property.neighborhood ?? p.property.city ?? ""}` : ""}
            </option>
          ))}
        </select>
        {selectedProp && (
          <p className="text-[10px] text-cima-gold mt-2 flex items-center gap-1">
            <Check className="h-3 w-3" />
            Campos auto-llenados desde los datos del propietario
          </p>
        )}
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
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-cima-border gap-2 flex-wrap">
              <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">Vista previa</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cima-border bg-cima-surface text-xs text-cima-text-muted hover:text-cima-text hover:border-cima-gold/30 transition-colors"
                >
                  <Printer className="h-3.5 w-3.5" />
                  Imprimir / PDF
                </button>
                <button
                  onClick={handleSaveToPortal}
                  disabled={saving || !selectedProp}
                  title={!selectedProp ? "Selecciona un propietario primero" : "Guardar en el portal del propietario"}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cima-gold text-cima-bg text-xs font-semibold hover:bg-cima-gold-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {saving
                    ? <><Loader2 className="h-3.5 w-3.5 animate-spin" />Guardando…</>
                    : saved
                    ? <><Check className="h-3.5 w-3.5" />Guardado</>
                    : <><Save className="h-3.5 w-3.5" />Guardar en portal</>
                  }
                </button>
              </div>
            </div>

            {/* Save feedback */}
            {saved && (
              <div className="px-5 py-2.5 border-b border-cima-border bg-emerald-500/5 flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <p className="text-xs text-emerald-400">
                  Documento guardado. El propietario puede descargarlo desde su portal en <span className="font-mono">/portal/documentos</span>.
                </p>
              </div>
            )}
            {saveError && (
              <div className="px-5 py-2.5 border-b border-cima-border bg-red-500/5">
                <p className="text-xs text-red-400">{saveError}</p>
              </div>
            )}

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
