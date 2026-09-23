import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { checkRateLimit, isHoneypotFilled } from "@/lib/rate-limit";
import {
  classifyLead,
  NOTIFY_WA_ON_STATUSES,
  type PropertyType,
  type PropertyCondition,
  type PropertySituation,
  type SaleTimeline,
} from "@/lib/buyer-config";
import { notifyDirectBuyerLead } from "@/lib/whatsapp";

function todayInMonterrey() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Monterrey",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const value = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return `${value("year")}-${value("month")}-${value("day")}`;
}

export async function POST(req: Request) {
  try {
    // ── 1. Rate limiting ────────────────────────────────────────────────────
    const rateLimited = checkRateLimit(req);
    if (rateLimited) return rateLimited;

    // ── 2. Parse body ───────────────────────────────────────────────────────
    const body = await req.json();

    // ── 3. Honeypot (anti-spam) ─────────────────────────────────────────────
    if (isHoneypotFilled(body)) {
      // Respuesta 200 falsa para no alertar al bot
      return NextResponse.json({ ok: true, status: "qualified" });
    }

    // ── 4. Campos requeridos ────────────────────────────────────────────────
    const {
      name,
      phone,
      municipality,
      colonia,
      property_address,
      property_latitude,
      property_longitude,
      property_type,
      property_condition,
      property_situations,
      is_owner,
      timeline,
      bedrooms,
      visit_requested,
      preferred_visit_date,
      preferred_visit_time,
      utm_source,
      utm_medium,
      utm_campaign,
      // website — honeypot (ya manejado arriba)
    } = body;

    if (!name || !phone || !municipality || !property_type || !property_condition || !timeline) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // Sanitización básica
    const cleanName = String(name).slice(0, 120).trim();
    const cleanPhone = String(phone).replace(/[^\d+\-() ]/g, "").slice(0, 20);
    const cleanMunicipality = String(municipality).slice(0, 80).trim();
    const cleanColonia = colonia ? String(colonia).slice(0, 80).trim() : null;
    const cleanPropertyAddress = property_address
      ? String(property_address).trim().slice(0, 240) || null
      : null;
    const parseCoordinate = (value: unknown) =>
      value == null || String(value).trim() === "" ? null : Number(value);
    const cleanLatitude = parseCoordinate(property_latitude);
    const cleanLongitude = parseCoordinate(property_longitude);
    const hasAnyCoordinate = cleanLatitude !== null || cleanLongitude !== null;
    if (
      hasAnyCoordinate &&
      (cleanLatitude === null ||
        cleanLongitude === null ||
        !Number.isFinite(cleanLatitude) ||
        !Number.isFinite(cleanLongitude) ||
        cleanLatitude < -90 ||
        cleanLatitude > 90 ||
        cleanLongitude < -180 ||
        cleanLongitude > 180)
    ) {
      return NextResponse.json(
        { error: "La ubicación compartida no es válida" },
        { status: 400 }
      );
    }
    const cleanBedrooms = bedrooms === "" || bedrooms == null ? null : Number(bedrooms);
    if (
      cleanBedrooms !== null &&
      (!Number.isInteger(cleanBedrooms) || cleanBedrooms < 0 || cleanBedrooms > 20)
    ) {
      return NextResponse.json(
        { error: "El número de recámaras debe estar entre 0 y 20" },
        { status: 400 }
      );
    }

    const cleanVisitRequested = visit_requested === true;
    const cleanVisitDate = cleanVisitRequested
      ? String(preferred_visit_date ?? "").slice(0, 10)
      : null;
    const cleanVisitTime = cleanVisitRequested
      ? String(preferred_visit_time ?? "").slice(0, 5)
      : null;

    if (
      cleanVisitRequested &&
      (!cleanVisitDate ||
        !/^\d{4}-\d{2}-\d{2}$/.test(cleanVisitDate) ||
        cleanVisitDate < todayInMonterrey() ||
        !cleanVisitTime ||
        !/^([01]\d|2[0-3]):[0-5]\d$/.test(cleanVisitTime))
    ) {
      return NextResponse.json(
        { error: "Revisa la fecha y hora preferidas para la visita" },
        { status: 400 }
      );
    }

    const cleanSituations: PropertySituation[] = Array.isArray(property_situations)
      ? (property_situations as string[]).slice(0, 10).map((s) => String(s)) as PropertySituation[]
      : [];

    // ── 5. Clasificación ────────────────────────────────────────────────────
    const qualification_status = classifyLead({
      municipality: cleanMunicipality,
      property_type: property_type as PropertyType,
      property_situations: cleanSituations,
      timeline: timeline as SaleTimeline,
      is_owner: !!is_owner,
    });

    // ── 6. Guardar en Supabase ──────────────────────────────────────────────
    const supabase = createAdminClient();

    const { error: dbError } = await supabase
      .from("re_direct_buyer_leads")
      .insert({
        name: cleanName,
        phone: cleanPhone,
        municipality: cleanMunicipality,
        colonia: cleanColonia,
        property_address: cleanPropertyAddress,
        property_latitude: cleanLatitude,
        property_longitude: cleanLongitude,
        property_type: property_type as PropertyType,
        property_condition: property_condition as PropertyCondition,
        property_situations: cleanSituations,
        is_owner: !!is_owner,
        timeline: timeline as SaleTimeline,
        bedrooms: cleanBedrooms,
        visit_requested: cleanVisitRequested,
        preferred_visit_date: cleanVisitDate,
        preferred_visit_time: cleanVisitTime,
        qualification_status,
        utm_source: utm_source ?? null,
        utm_medium: utm_medium ?? null,
        utm_campaign: utm_campaign ?? null,
        source: "te-compramos-landing",
      });

    if (dbError) {
      console.error("[direct-buyer] DB error:", dbError);
      // No bloqueamos — notificación puede seguir si DB falla
    }

    // ── 7. Notificación WhatsApp ────────────────────────────────────────────
    let waResult: { ok: boolean; fallback: boolean; waFallbackUrl?: string } = {
      ok: false,
      fallback: false,
    };

    if (NOTIFY_WA_ON_STATUSES.includes(qualification_status)) {
      waResult = await notifyDirectBuyerLead({
        name: cleanName,
        phone: cleanPhone,
        municipality: cleanMunicipality,
        colonia: cleanColonia,
        property_address: cleanPropertyAddress,
        property_latitude: cleanLatitude,
        property_longitude: cleanLongitude,
        property_type: property_type as string,
        property_condition: property_condition as string,
        property_situations: cleanSituations,
        timeline: timeline as string,
        bedrooms: cleanBedrooms,
        visit_requested: cleanVisitRequested,
        preferred_visit_date: cleanVisitDate,
        preferred_visit_time: cleanVisitTime,
        qualification_status,
        utm_source: utm_source ?? null,
        utm_medium: utm_medium ?? null,
        utm_campaign: utm_campaign ?? null,
      });
    }

    // ── 8. Respuesta ────────────────────────────────────────────────────────
    // Nunca incluimos tokens ni datos internos en la respuesta
    return NextResponse.json({
      ok: true,
      status: qualification_status,
      // Si WhatsApp falló, damos la URL de respaldo al cliente
      waFallback: waResult.fallback ? waResult.waFallbackUrl : undefined,
    });
  } catch (e: unknown) {
    console.error("[direct-buyer] Unexpected error:", e);
    return NextResponse.json(
      { error: "Error al procesar tu solicitud. Intenta de nuevo." },
      { status: 500 }
    );
  }
}
