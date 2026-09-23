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
      property_type,
      property_condition,
      property_situations,
      is_owner,
      timeline,
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
        property_type: property_type as PropertyType,
        property_condition: property_condition as PropertyCondition,
        property_situations: cleanSituations,
        is_owner: !!is_owner,
        timeline: timeline as SaleTimeline,
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
        property_type: property_type as string,
        property_condition: property_condition as string,
        property_situations: cleanSituations,
        timeline: timeline as string,
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
