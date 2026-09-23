/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  CIMA COMPRA DIRECTA — Configuración central de calificación
 *
 *  Edita ESTE archivo para cambiar las reglas de negocio sin tocar otros módulos.
 *  Todos los valores marcados con "TODO: Cima" deben ser confirmados antes de
 *  publicar en producción.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── Tipos de calificación ──────────────────────────────────────────────────
export type QualificationStatus = "qualified" | "manual_review" | "out_of_coverage";

// ── Tipos de propiedad ─────────────────────────────────────────────────────
export const PROPERTY_TYPES = [
  { value: "casa", label: "Casa" },
  { value: "departamento", label: "Departamento" },
  { value: "terreno", label: "Terreno" },
  { value: "local_comercial", label: "Local comercial" },
  { value: "otro", label: "Otro" },
] as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number]["value"];

// ── Estado general de la propiedad ─────────────────────────────────────────
export const PROPERTY_CONDITIONS = [
  { value: "excelente", label: "Excelente — lista para habitar" },
  { value: "bueno", label: "Buena — mantenimiento menor" },
  { value: "regular", label: "Regular — requiere reparaciones medianas" },
  { value: "deteriorado", label: "Deteriorada — reparaciones mayores" },
] as const;

export type PropertyCondition = (typeof PROPERTY_CONDITIONS)[number]["value"];

// ── Situaciones del inmueble ────────────────────────────────────────────────
// Cima puede revisar estas situaciones; no son automáticamente descalificantes.
export const PROPERTY_SITUATIONS = [
  {
    value: "reparaciones",
    label: "Necesita reparaciones o remodelación",
    icon: "🔧",
  },
  {
    value: "hipoteca_infonavit",
    label: "Tiene hipoteca activa (banco o Infonavit)",
    icon: "🏦",
  },
  {
    value: "predial_atrasado",
    label: "Predial o servicios con adeudo",
    icon: "📋",
  },
  {
    value: "mantenimiento_atrasado",
    label: "Cuotas de mantenimiento pendientes",
    icon: "🏘️",
  },
  {
    value: "documentacion_irregular",
    label: "Documentación incompleta o en proceso",
    icon: "📄",
  },
  {
    value: "intestado_sucesion",
    label: "Proceso de sucesión o intestado",
    icon: "⚖️",
  },
  {
    value: "ninguna",
    label: "Ninguna de las anteriores",
    icon: "✅",
  },
] as const;

export type PropertySituation = (typeof PROPERTY_SITUATIONS)[number]["value"];

// ── Plazos para vender ─────────────────────────────────────────────────────
export const SALE_TIMELINES = [
  { value: "urgente", label: "Lo antes posible (menos de 1 mes)" },
  { value: "1_3_meses", label: "1 a 3 meses" },
  { value: "3_6_meses", label: "3 a 6 meses" },
  { value: "mas_6_meses", label: "Más de 6 meses" },
  { value: "explorando", label: "Solo estoy explorando opciones" },
] as const;

export type SaleTimeline = (typeof SALE_TIMELINES)[number]["value"];

// ── Municipios cubiertos ───────────────────────────────────────────────────
// TODO: Cima debe confirmar cuáles municipios acepta actualmente.
// Agrega o quita municipios de esta lista para controlar la cobertura.
// Los municipios fuera de esta lista generarán status "out_of_coverage".
export const COVERED_MUNICIPALITIES: string[] = [
  "Monterrey",
  "San Pedro Garza García",
  "San Nicolás de los Garza",
  "Guadalupe",
  "Apodaca",
  "General Escobedo",
  "Santa Catarina",
  "García",
  "Juárez",
  "Santiago",
  // TODO: ¿Incluir municipios más lejanos como Cadereyta o Pesquería?
];

// ── Tipos de propiedad que Cima acepta directamente ────────────────────────
// TODO: Cima debe confirmar qué tipos acepta en compra directa.
export const ACCEPTED_PROPERTY_TYPES: PropertyType[] = [
  "casa",
  "departamento",
  "terreno",
  // "local_comercial",  // TODO: ¿Cima compra comerciales directamente?
];

// ── Situaciones que convierten en "revisión manual" ────────────────────────
// (en lugar de rechazarlo automáticamente)
// TODO: Cima debe definir qué situaciones son aceptables sin revisión adicional.
export const SITUATIONS_REQUIRING_MANUAL_REVIEW: PropertySituation[] = [
  "intestado_sucesion",
  "documentacion_irregular",
];

// ── Plazos que califican automáticamente ──────────────────────────────────
// TODO: Confirmar si Cima quiere priorizar los urgentes.
export const QUALIFYING_TIMELINES: SaleTimeline[] = [
  "urgente",
  "1_3_meses",
  "3_6_meses",
];

// ── Notificación WhatsApp ──────────────────────────────────────────────────
// Controla para qué estados se envía la notificación a Cima.
// TODO: Cima debe confirmar si quiere recibir también los de "manual_review".
export const NOTIFY_WA_ON_STATUSES: QualificationStatus[] = [
  "qualified",
  "manual_review",
];

// ── Lógica de calificación ─────────────────────────────────────────────────
export interface LeadData {
  municipality: string;
  property_type: PropertyType;
  property_situations: PropertySituation[];
  timeline: SaleTimeline;
  is_owner: boolean;
}

export function classifyLead(data: LeadData): QualificationStatus {
  // 1. Confirmar autoridad requiere revisión, pero no descartar al contacto.
  if (!data.is_owner) return "manual_review";

  // 2. Cobertura geográfica
  if (!COVERED_MUNICIPALITIES.includes(data.municipality)) {
    return "out_of_coverage";
  }

  // 3. Tipo de propiedad
  if (!ACCEPTED_PROPERTY_TYPES.includes(data.property_type)) {
    return "out_of_coverage";
  }

  // 4. Situaciones que requieren revisión manual
  const needsManualReview = data.property_situations.some((s) =>
    SITUATIONS_REQUIRING_MANUAL_REVIEW.includes(s)
  );
  if (needsManualReview) return "manual_review";

  // 5. Plazo — si es "solo explorar", revisión manual
  if (data.timeline === "explorando") return "manual_review";

  // 6. Si pasa todos los filtros → calificado
  return "qualified";
}
