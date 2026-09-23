/**
 * WhatsApp Cloud API helper — Notificación de leads de compra directa
 *
 * Usa variables de entorno del servidor. NUNCA se expone al navegador.
 * Si las variables no están configuradas, devuelve { ok: false, fallback: true }.
 */

import type { QualificationStatus } from "./buyer-config";

// ─────────────────────────────────────────────────────────────────────────────
// Env vars (solo disponibles en el servidor / API Routes)
// ─────────────────────────────────────────────────────────────────────────────
const WA_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WA_PHONE_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WA_TEMPLATE = process.env.WHATSAPP_TEMPLATE_NAME ?? "";
const WA_NOTIFY = process.env.WHATSAPP_NOTIFY_NUMBER; // e.g. "528121980008"

const CLOUD_API = "https://graph.facebook.com/v20.0";

// ─────────────────────────────────────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────────────────────────────────────
export interface DirectBuyerNotification {
  name: string;
  phone: string;
  municipality: string;
  colonia?: string | null;
  property_address?: string | null;
  property_latitude?: number | null;
  property_longitude?: number | null;
  property_type: string;
  property_condition: string;
  property_situations: string[];
  timeline: string;
  bedrooms: number | null;
  visit_requested: boolean;
  preferred_visit_date?: string | null;
  preferred_visit_time?: string | null;
  qualification_status: QualificationStatus;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
}

function getMapUrl(data: DirectBuyerNotification) {
  const latitude = data.property_latitude;
  const longitude = data.property_longitude;
  if (
    typeof latitude !== "number" ||
    !Number.isFinite(latitude) ||
    typeof longitude !== "number" ||
    !Number.isFinite(longitude)
  ) {
    return null;
  }
  return `https://maps.google.com/?q=${latitude},${longitude}`;
}

function getLocationDetails(data: DirectBuyerNotification) {
  const details: string[] = [];
  if (data.property_address?.trim()) {
    details.push(`Dirección: ${data.property_address.trim()}`);
  }
  const mapUrl = getMapUrl(data);
  if (mapUrl) details.push(`Mapa: ${mapUrl}`);
  return details.join(" | ");
}

// ─────────────────────────────────────────────────────────────────────────────
// Envío mediante plantilla aprobada (flujo preferido)
// ─────────────────────────────────────────────────────────────────────────────
async function sendViaTemplate(
  data: DirectBuyerNotification
): Promise<boolean> {
  if (!WA_TOKEN || !WA_PHONE_ID || !WA_TEMPLATE || !WA_NOTIFY) return false;

  const statusLabel =
    data.qualification_status === "qualified"
      ? "✅ CALIFICADO"
      : "🔍 REVISIÓN MANUAL";

  const situationsText =
    data.property_situations.length > 0
      ? data.property_situations.join(", ")
      : "Ninguna";
  const propertyDetails = [
    data.bedrooms === null ? null : `${data.bedrooms} recámaras`,
    data.visit_requested
      ? `Visita solicitada: ${data.preferred_visit_date} ${data.preferred_visit_time} (por confirmar)`
      : "Sin solicitud de visita",
    getLocationDetails(data) || null,
  ]
    .filter(Boolean)
    .join(" | ");

  const utmText = [
    data.utm_source && `fuente: ${data.utm_source}`,
    data.utm_medium && `medio: ${data.utm_medium}`,
    data.utm_campaign && `campaña: ${data.utm_campaign}`,
  ]
    .filter(Boolean)
    .join(" | ");

  // Si hay plantilla configurada, usamos template message
  const body = {
    messaging_product: "whatsapp",
    to: WA_NOTIFY,
    type: "template",
    template: {
      name: WA_TEMPLATE,
      language: { code: "es_MX" },
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: statusLabel },
            { type: "text", text: data.name },
            { type: "text", text: data.phone },
            { type: "text", text: `${data.municipality}${data.colonia ? ` — ${data.colonia}` : ""}` },
            { type: "text", text: `${data.property_type}${data.bedrooms === null ? "" : ` — ${data.bedrooms} recámaras`}` },
            { type: "text", text: data.property_condition },
            { type: "text", text: `${situationsText} | ${propertyDetails}` },
            { type: "text", text: data.timeline },
            { type: "text", text: utmText || "Sin UTM" },
          ],
        },
      ],
    },
  };

  const res = await fetch(`${CLOUD_API}/${WA_PHONE_ID}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${WA_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return res.ok;
}

// ─────────────────────────────────────────────────────────────────────────────
// Envío libre (solo funciona si el número destino inició conversación en 24h)
// ─────────────────────────────────────────────────────────────────────────────
async function sendFreeText(
  data: DirectBuyerNotification
): Promise<boolean> {
  if (!WA_TOKEN || !WA_PHONE_ID || !WA_NOTIFY) return false;

  const statusLabel =
    data.qualification_status === "qualified"
      ? "✅ CALIFICADO"
      : "🔍 REVISIÓN MANUAL";

  const situationsText =
    data.property_situations.length > 0
      ? data.property_situations.join(", ")
      : "Ninguna";

  const visitText = data.visit_requested
    ? `${data.preferred_visit_date ?? "Sin fecha"} a las ${data.preferred_visit_time ?? "Sin hora"} (por confirmar)`
    : "No solicitada";
  const mapUrl = getMapUrl(data);
  const text = `*Cima Compra Directa — Nuevo Lead*\n\n*Estado:* ${statusLabel}\n*Nombre:* ${data.name}\n*Teléfono:* ${data.phone}\n*Zona:* ${data.municipality}${data.colonia ? ` — ${data.colonia}` : ""}\n*Dirección:* ${data.property_address?.trim() || "No indicada"}\n*Ubicación exacta:* ${mapUrl ?? "No compartida"}\n*Tipo:* ${data.property_type}\n*Recámaras:* ${data.bedrooms === null ? "No indicadas" : data.bedrooms}\n*Estado inmueble:* ${data.property_condition}\n*Situaciones:* ${situationsText}\n*Plazo:* ${data.timeline}\n*Visita solicitada:* ${visitText}${data.utm_source ? `\n*UTM:* ${data.utm_source}` : ""}`;

  const body = {
    messaging_product: "whatsapp",
    to: WA_NOTIFY,
    type: "text",
    text: { body: text },
  };

  const res = await fetch(`${CLOUD_API}/${WA_PHONE_ID}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${WA_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return res.ok;
}

// ─────────────────────────────────────────────────────────────────────────────
// Función principal — intenta template, luego texto libre, si ambas fallan → fallback
// ─────────────────────────────────────────────────────────────────────────────
export async function notifyDirectBuyerLead(
  data: DirectBuyerNotification
): Promise<{ ok: boolean; fallback: boolean; waFallbackUrl?: string }> {
  // Sin credenciales → siempre fallback
  if (!WA_TOKEN || !WA_PHONE_ID || !WA_NOTIFY) {
    return { ok: false, fallback: true, waFallbackUrl: buildFallbackUrl(data) };
  }

  try {
    // Primero con plantilla (si está configurada)
    if (WA_TEMPLATE) {
      const templateOk = await sendViaTemplate(data);
      if (templateOk) return { ok: true, fallback: false };
    }

    // Luego texto libre
    const freeOk = await sendFreeText(data);
    if (freeOk) return { ok: true, fallback: false };

    // Ambas fallaron — honestamente retornamos fallback
    console.error("[WA] Both template and free-text send failed");
    return { ok: false, fallback: true, waFallbackUrl: buildFallbackUrl(data) };
  } catch (e) {
    console.error("[WA] Unexpected error:", e);
    return { ok: false, fallback: true, waFallbackUrl: buildFallbackUrl(data) };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// URL de respaldo wa.me con mensaje precargado (para envío manual por el visitante)
// NOTA: Esta URL no envía el mensaje automáticamente.
// ─────────────────────────────────────────────────────────────────────────────
function buildFallbackUrl(data: DirectBuyerNotification): string {
  const cimaWa = (process.env.NEXT_PUBLIC_CIMA_WA ?? "528121980008").replace(
    /\D/g,
    ""
  );
  const situationsText =
    data.property_situations.length > 0
      ? data.property_situations.join(", ")
      : "Ninguna";

  const visitText = data.visit_requested
    ? ` Solicito visita para el ${data.preferred_visit_date} a las ${data.preferred_visit_time} (sujeta a confirmación).`
    : "";
  const bedroomsText = data.bedrooms === null ? "" : ` Recámaras: ${data.bedrooms}.`;
  const addressText = data.property_address?.trim()
    ? ` Dirección: ${data.property_address.trim()}.`
    : "";
  const mapText = getMapUrl(data) ? ` Mapa: ${getMapUrl(data)}` : "";
  const msg = `Hola Cima, soy ${data.name} y quiero saber si mi propiedad aplica para venta directa. Zona: ${data.municipality}${data.colonia ? `, ${data.colonia}` : ""}.${addressText}${mapText} Tipo: ${data.property_type}.${bedroomsText} Situaciones: ${situationsText}. Plazo: ${data.timeline}.${visitText} Mi teléfono: ${data.phone}`;
  return `https://wa.me/${cimaWa}?text=${encodeURIComponent(msg)}`;
}
