"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, CheckCircle2, AlertCircle, Send, MessageCircle } from "lucide-react";
import {
  PROPERTY_TYPES,
  PROPERTY_CONDITIONS,
  PROPERTY_SITUATIONS,
  SALE_TIMELINES,
} from "@/lib/buyer-config";
import { COLONIAS_MTY } from "@/lib/colonias-mty";

// ── Municipios únicos ──────────────────────────────────────────────────────
const MUNICIPALITIES = Array.from(
  new Set(COLONIAS_MTY.map((c) => c.municipality))
).sort((a, b) => a.localeCompare(b, "es"));

// ── Tipos ──────────────────────────────────────────────────────────────────
interface FormData {
  name: string;
  phone: string;
  municipality: string;
  colonia: string;
  property_type: string;
  is_owner: boolean | null;
  property_condition: string;
  property_situations: string[];
  timeline: string;
  consent: boolean;
}

interface SubmitResult {
  status: "qualified" | "manual_review" | "out_of_coverage";
  waFallback?: string;
}

const STEPS = ["Contacto", "Propiedad", "Detalles", "Confirmación"];
const TOTAL = STEPS.length;

const INITIAL: FormData = {
  name: "",
  phone: "",
  municipality: "",
  colonia: "",
  property_type: "",
  is_owner: null,
  property_condition: "",
  property_situations: [],
  timeline: "",
  consent: false,
};

// ── Helpers ────────────────────────────────────────────────────────────────
function fieldClass(error?: boolean) {
  return `w-full rounded-xl border px-4 py-3 bg-cima-surface text-cima-text text-sm placeholder:text-cima-text-dim focus:outline-none focus:ring-2 transition-all ${
    error
      ? "border-red-500/70 focus:ring-red-500/30"
      : "border-cima-border focus:border-cima-gold/50 focus:ring-cima-gold/20"
  }`;
}

function labelClass() {
  return "block text-xs font-mono text-cima-text-muted mb-1.5 uppercase tracking-wider";
}

// ── Component ──────────────────────────────────────────────────────────────
interface Props {
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
}

export default function DirectBuyerForm({ utmSource, utmMedium, utmCampaign }: Props) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  // ── Colonias filtradas por municipio ────────────────────────────────────
  const colonias = data.municipality
    ? COLONIAS_MTY.filter((c) => c.municipality === data.municipality).sort(
        (a, b) => a.name.localeCompare(b.name, "es")
      )
    : [];

  // ── Toggle situación ────────────────────────────────────────────────────
  const toggleSituation = useCallback(
    (val: string) => {
      setData((prev) => {
        if (val === "ninguna") {
          return { ...prev, property_situations: ["ninguna"] };
        }
        const without = prev.property_situations.filter(
          (s) => s !== "ninguna"
        );
        return {
          ...prev,
          property_situations: without.includes(val)
            ? without.filter((s) => s !== val)
            : [...without, val],
        };
      });
    },
    []
  );

  // ── Validación por paso ─────────────────────────────────────────────────
  const validate = useCallback(
    (s: number): boolean => {
      const e: Partial<Record<keyof FormData, string>> = {};

      if (s === 0) {
        if (!data.name.trim()) e.name = "Escribe tu nombre";
        if (!data.phone.replace(/\D/g, "")) e.phone = "Escribe tu teléfono";
        else if (data.phone.replace(/\D/g, "").length < 10)
          e.phone = "Mínimo 10 dígitos";
      }

      if (s === 1) {
        if (!data.municipality) e.municipality = "Selecciona un municipio";
        if (!data.property_type) e.property_type = "Selecciona el tipo";
      }

      if (s === 2) {
        if (data.is_owner === null)
          e.is_owner = "Indica si eres propietario";
        if (!data.property_condition)
          e.property_condition = "Selecciona el estado";
        if (data.property_situations.length === 0)
          e.property_situations = "Selecciona al menos una opción";
        if (!data.timeline) e.timeline = "Selecciona un plazo";
      }

      if (s === 3) {
        if (!data.consent)
          e.consent = "Debes aceptar el aviso de privacidad";
      }

      setErrors(e);
      return Object.keys(e).length === 0;
    },
    [data]
  );

  const next = () => {
    if (!validate(step)) return;
    setStep((s) => Math.min(s + 1, TOTAL - 1));
  };
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  // ── Submit ──────────────────────────────────────────────────────────────
  const submit = async () => {
    if (!validate(3)) return;
    setLoading(true);
    setServerError(null);

    try {
      const res = await fetch("/api/direct-buyer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
          // Honeypot — siempre vacío en envíos legítimos
          website: "",
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setServerError(json.error ?? "Error al enviar. Intenta de nuevo.");
        return;
      }

      setResult({
        status: json.status,
        waFallback: json.waFallback,
      });
    } catch {
      setServerError(
        "Sin conexión. Revisa tu internet e intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen ───────────────────────────────────────────────────────
  if (result) {
    return (
      <SuccessScreen
        result={result}
        name={data.name}
        phone={data.phone}
      />
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          {STEPS.map((label, i) => (
            <span
              key={label}
              className={`text-[10px] font-mono uppercase tracking-wider transition-colors ${
                i <= step ? "text-cima-gold" : "text-cima-text-dim"
              }`}
            >
              {label}
            </span>
          ))}
        </div>
        <div className="h-1 bg-cima-border rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cima-gold-dim to-cima-gold rounded-full"
            animate={{ width: `${((step + 1) / TOTAL) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Steps */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          {step === 0 && <Step0 data={data} setData={setData} errors={errors} />}
          {step === 1 && (
            <Step1
              data={data}
              setData={setData}
              errors={errors}
              colonias={colonias}
              municipalities={MUNICIPALITIES}
            />
          )}
          {step === 2 && (
            <Step2
              data={data}
              setData={setData}
              errors={errors}
              toggleSituation={toggleSituation}
            />
          )}
          {step === 3 && <Step3 data={data} setData={setData} errors={errors} />}
        </motion.div>
      </AnimatePresence>

      {/* Server error */}
      {serverError && (
        <p className="mt-3 text-sm text-red-400 flex items-center gap-1.5">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {serverError}
        </p>
      )}

      {/* Navigation */}
      <div className="mt-6 flex gap-3">
        {step > 0 && (
          <button
            type="button"
            onClick={prev}
            className="flex items-center gap-1.5 rounded-xl border border-cima-border px-4 py-3 text-sm text-cima-text-muted hover:border-cima-gold/40 hover:text-cima-text transition-all"
          >
            <ChevronLeft className="h-4 w-4" /> Anterior
          </button>
        )}

        {step < TOTAL - 1 ? (
          <button
            type="button"
            onClick={next}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-cima-gold text-cima-bg font-semibold text-sm py-3 px-6 hover:bg-cima-gold-light transition-all active:scale-95"
          >
            Siguiente <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-cima-gold text-cima-bg font-semibold text-sm py-3 px-6 hover:bg-cima-gold-light transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-cima-bg/40 border-t-cima-bg animate-spin" />
                Enviando…
              </>
            ) : (
              <>
                <Send className="h-4 w-4" /> Solicitar revisión
              </>
            )}
          </button>
        )}
      </div>

      <p className="mt-4 text-center text-xs text-cima-text-dim">
        Al enviar, aceptas que Cima Propiedades revise tu solicitud y te contacte.
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 0 — Contacto
// ─────────────────────────────────────────────────────────────────────────────
function Step0({
  data,
  setData,
  errors,
}: {
  data: FormData;
  setData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: Partial<Record<keyof FormData, string>>;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-heading font-bold text-cima-text mb-1">
          ¿Cómo podemos contactarte?
        </h3>
        <p className="text-sm text-cima-text-muted">
          Solo necesitamos tu nombre y WhatsApp o teléfono.
        </p>
      </div>
      <div>
        <label className={labelClass()}>Nombre completo</label>
        <input
          id="db-name"
          type="text"
          placeholder="Ej. Ana García"
          value={data.name}
          onChange={(e) => setData((p) => ({ ...p, name: e.target.value }))}
          className={fieldClass(!!errors.name)}
          autoComplete="name"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-400">{errors.name}</p>
        )}
      </div>
      <div>
        <label className={labelClass()}>Teléfono / WhatsApp</label>
        <input
          id="db-phone"
          type="tel"
          placeholder="Ej. 81 1234 5678"
          value={data.phone}
          onChange={(e) => setData((p) => ({ ...p, phone: e.target.value }))}
          className={fieldClass(!!errors.phone)}
          autoComplete="tel"
        />
        {errors.phone && (
          <p className="mt-1 text-xs text-red-400">{errors.phone}</p>
        )}
      </div>
      {/* Honeypot oculto */}
      <input type="text" name="website" className="hidden" tabIndex={-1} aria-hidden />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 1 — Propiedad
// ─────────────────────────────────────────────────────────────────────────────
function Step1({
  data,
  setData,
  errors,
  colonias,
  municipalities,
}: {
  data: FormData;
  setData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: Partial<Record<keyof FormData, string>>;
  colonias: { name: string; municipality: string }[];
  municipalities: string[];
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-heading font-bold text-cima-text mb-1">
          Cuéntanos sobre la propiedad
        </h3>
        <p className="text-sm text-cima-text-muted">
          Municipio, colonia (opcional) y tipo de inmueble.
        </p>
      </div>
      <div>
        <label className={labelClass()}>Municipio</label>
        <select
          id="db-municipality"
          value={data.municipality}
          onChange={(e) =>
            setData((p) => ({ ...p, municipality: e.target.value, colonia: "" }))
          }
          className={fieldClass(!!errors.municipality)}
        >
          <option value="">Selecciona un municipio…</option>
          {municipalities.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        {errors.municipality && (
          <p className="mt-1 text-xs text-red-400">{errors.municipality}</p>
        )}
      </div>
      {colonias.length > 0 && (
        <div>
          <label className={labelClass()}>Colonia / Fraccionamiento (opcional)</label>
          <select
            id="db-colonia"
            value={data.colonia}
            onChange={(e) => setData((p) => ({ ...p, colonia: e.target.value }))}
            className={fieldClass()}
          >
            <option value="">Selecciona una colonia…</option>
            {colonias.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <div>
        <label className={labelClass()}>Tipo de propiedad</label>
        <div className="grid grid-cols-2 gap-2">
          {PROPERTY_TYPES.map((pt) => (
            <button
              key={pt.value}
              type="button"
              id={`db-pt-${pt.value}`}
              onClick={() =>
                setData((p) => ({ ...p, property_type: pt.value }))
              }
              className={`rounded-xl border px-3 py-2.5 text-sm text-left transition-all ${
                data.property_type === pt.value
                  ? "border-cima-gold bg-cima-gold/10 text-cima-gold font-semibold"
                  : "border-cima-border bg-cima-surface text-cima-text-muted hover:border-cima-gold/30"
              }`}
            >
              {pt.label}
            </button>
          ))}
        </div>
        {errors.property_type && (
          <p className="mt-1 text-xs text-red-400">{errors.property_type}</p>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 2 — Detalles
// ─────────────────────────────────────────────────────────────────────────────
function Step2({
  data,
  setData,
  errors,
  toggleSituation,
}: {
  data: FormData;
  setData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: Partial<Record<keyof FormData, string>>;
  toggleSituation: (val: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-heading font-bold text-cima-text mb-1">
          Detalles del inmueble
        </h3>
        <p className="text-sm text-cima-text-muted">
          Esta información nos ayuda a preparar una revisión adecuada.
        </p>
      </div>

      {/* ¿Eres propietario? */}
      <div>
        <label className={labelClass()}>¿Eres propietario o estás autorizado para vender?</label>
        <div className="flex gap-3">
          {[
            { val: true, label: "Sí, soy propietario" },
            { val: false, label: "Estoy autorizado" },
          ].map(({ val, label }) => (
            <button
              key={String(val)}
              type="button"
              id={`db-owner-${val}`}
              onClick={() => setData((p) => ({ ...p, is_owner: val }))}
              className={`flex-1 rounded-xl border px-3 py-2.5 text-sm transition-all ${
                data.is_owner === val
                  ? "border-cima-gold bg-cima-gold/10 text-cima-gold font-semibold"
                  : "border-cima-border bg-cima-surface text-cima-text-muted hover:border-cima-gold/30"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {errors.is_owner && (
          <p className="mt-1 text-xs text-red-400">{errors.is_owner}</p>
        )}
      </div>

      {/* Estado general */}
      <div>
        <label className={labelClass()}>Estado general de la propiedad</label>
        <div className="space-y-2">
          {PROPERTY_CONDITIONS.map((pc) => (
            <button
              key={pc.value}
              type="button"
              id={`db-cond-${pc.value}`}
              onClick={() =>
                setData((p) => ({ ...p, property_condition: pc.value }))
              }
              className={`w-full rounded-xl border px-4 py-3 text-sm text-left transition-all ${
                data.property_condition === pc.value
                  ? "border-cima-gold bg-cima-gold/10 text-cima-gold font-semibold"
                  : "border-cima-border bg-cima-surface text-cima-text-muted hover:border-cima-gold/30"
              }`}
            >
              {pc.label}
            </button>
          ))}
        </div>
        {errors.property_condition && (
          <p className="mt-1 text-xs text-red-400">{errors.property_condition}</p>
        )}
      </div>

      {/* Situaciones */}
      <div>
        <label className={labelClass()}>
          Situaciones del inmueble{" "}
          <span className="text-cima-text-dim normal-case">(selecciona todas las que apliquen)</span>
        </label>
        <div className="space-y-2">
          {PROPERTY_SITUATIONS.map((sit) => {
            const active = data.property_situations.includes(sit.value);
            return (
              <button
                key={sit.value}
                type="button"
                id={`db-sit-${sit.value}`}
                onClick={() => toggleSituation(sit.value)}
                className={`w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-sm text-left transition-all ${
                  active
                    ? "border-cima-gold bg-cima-gold/10 text-cima-gold"
                    : "border-cima-border bg-cima-surface text-cima-text-muted hover:border-cima-gold/30"
                }`}
              >
                <span className="text-base">{sit.icon}</span>
                <span className={active ? "font-semibold" : ""}>{sit.label}</span>
              </button>
            );
          })}
        </div>
        {errors.property_situations && (
          <p className="mt-1 text-xs text-red-400">{errors.property_situations}</p>
        )}
      </div>

      {/* Plazo */}
      <div>
        <label className={labelClass()}>¿En qué plazo quieres vender?</label>
        <div className="space-y-2">
          {SALE_TIMELINES.map((tl) => (
            <button
              key={tl.value}
              type="button"
              id={`db-tl-${tl.value}`}
              onClick={() => setData((p) => ({ ...p, timeline: tl.value }))}
              className={`w-full rounded-xl border px-4 py-3 text-sm text-left transition-all ${
                data.timeline === tl.value
                  ? "border-cima-gold bg-cima-gold/10 text-cima-gold font-semibold"
                  : "border-cima-border bg-cima-surface text-cima-text-muted hover:border-cima-gold/30"
              }`}
            >
              {tl.label}
            </button>
          ))}
        </div>
        {errors.timeline && (
          <p className="mt-1 text-xs text-red-400">{errors.timeline}</p>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 3 — Confirmación
// ─────────────────────────────────────────────────────────────────────────────
function Step3({
  data,
  setData,
  errors,
}: {
  data: FormData;
  setData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: Partial<Record<keyof FormData, string>>;
}) {
  const privacyUrl =
    process.env.NEXT_PUBLIC_PRIVACY_URL ?? "/legal/privacidad";

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-heading font-bold text-cima-text mb-1">
          Casi listo — confirma tu solicitud
        </h3>
        <p className="text-sm text-cima-text-muted">
          Revisa tu información y acepta el aviso de privacidad.
        </p>
      </div>

      {/* Resumen */}
      <div className="rounded-xl border border-cima-border bg-cima-surface/50 divide-y divide-cima-border/50 text-sm">
        {(
          [
            ["Nombre", data.name],
            ["Teléfono", data.phone],
            ["Municipio", data.municipality],
            data.colonia ? ["Colonia", data.colonia] : null,
            ["Tipo", PROPERTY_TYPES.find((p) => p.value === data.property_type)?.label ?? data.property_type],
            ["Estado inmueble", PROPERTY_CONDITIONS.find((c) => c.value === data.property_condition)?.label ?? data.property_condition],
            ["Plazo", SALE_TIMELINES.find((t) => t.value === data.timeline)?.label ?? data.timeline],
          ] as (string[] | null)[]
        )
          .filter((row): row is string[] => row !== null)
          .map(([key, val]) => (
            <div key={key} className="flex justify-between px-4 py-2.5 gap-4">
              <span className="text-cima-text-muted shrink-0">{key}</span>
              <span className="text-cima-text text-right">{val}</span>
            </div>
          ))}
      </div>

      {/* Consentimiento */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <div className="mt-0.5 shrink-0">
          <input
            id="db-consent"
            type="checkbox"
            checked={data.consent}
            onChange={(e) =>
              setData((p) => ({ ...p, consent: e.target.checked }))
            }
            className="sr-only"
          />
          <div
            onClick={() => setData((p) => ({ ...p, consent: !p.consent }))}
            className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-all ${
              data.consent
                ? "border-cima-gold bg-cima-gold"
                : "border-cima-border group-hover:border-cima-gold/50"
            }`}
          >
            {data.consent && (
              <svg className="h-3 w-3 text-cima-bg" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        </div>
        <p className="text-sm text-cima-text-muted leading-relaxed">
          Acepto que Cima Propiedades use mis datos para revisar mi solicitud y
          contactarme. Consulta el{" "}
          <a
            href={privacyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cima-gold underline underline-offset-2"
          >
            Aviso de Privacidad
          </a>
          .
        </p>
      </label>
      {errors.consent && (
        <p className="text-xs text-red-400">{errors.consent}</p>
      )}

      <p className="text-xs text-cima-text-dim leading-relaxed">
        Completar este formulario no garantiza una oferta ni aprobación. Cima
        revisará tu información y te contactará si la propiedad aplica.
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Success Screen
// ─────────────────────────────────────────────────────────────────────────────
function SuccessScreen({
  result,
  name,
  phone,
}: {
  result: SubmitResult;
  name: string;
  phone: string;
}) {
  if (result.status === "out_of_coverage") {
    return (
      <div className="text-center py-8 px-4">
        <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
          <AlertCircle className="h-7 w-7 text-yellow-500" />
        </div>
        <h3 className="text-xl font-heading font-bold text-cima-text mb-2">
          Por ahora fuera de cobertura
        </h3>
        <p className="text-sm text-cima-text-muted max-w-sm mx-auto">
          Actualmente Cima no cubre esa zona o tipo de propiedad para compra
          directa. Gracias por tu interés, {name.split(" ")[0]}.
        </p>
      </div>
    );
  }

  if (result.status === "manual_review") {
    return (
      <div className="text-center py-8 px-4">
        <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
          <AlertCircle className="h-7 w-7 text-blue-400" />
        </div>
        <h3 className="text-xl font-heading font-bold text-cima-text mb-2">
          Solicitud recibida — revisión manual
        </h3>
        <p className="text-sm text-cima-text-muted max-w-sm mx-auto mb-4">
          Tu caso requiere que un asesor de Cima lo revise personalmente. Te
          contactaremos en los próximos días hábiles al{" "}
          <span className="text-cima-text font-medium">{phone}</span>.
        </p>
        {result.waFallback && (
          <FallbackBanner url={result.waFallback} />
        )}
      </div>
    );
  }

  // qualified
  return (
    <div className="text-center py-8 px-4">
      <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center">
        <CheckCircle2 className="h-7 w-7 text-cima-gold" />
      </div>
      <h3 className="text-xl font-heading font-bold text-cima-text mb-2">
        ¡Solicitud enviada!
      </h3>
      <p className="text-sm text-cima-text-muted max-w-sm mx-auto mb-4">
        Hola {name.split(" ")[0]}, recibimos tu solicitud. Un asesor de Cima
        revisará tu propiedad y te contactará al{" "}
        <span className="text-cima-text font-medium">{phone}</span> para
        continuar el proceso.
      </p>
      <p className="text-xs text-cima-text-dim max-w-xs mx-auto mb-5">
        Esto no es una oferta ni una aprobación. La oferta real depende de la
        evaluación presencial de Cima.
      </p>
      {result.waFallback && (
        <FallbackBanner url={result.waFallback} />
      )}
    </div>
  );
}

function FallbackBanner({ url }: { url: string }) {
  return (
    <div className="rounded-xl border border-cima-border bg-cima-surface/50 p-4 text-left mt-2">
      <p className="text-xs text-cima-text-muted mb-2 leading-relaxed">
        <span className="text-yellow-400 font-medium">Nota:</span> No pudimos
        confirmar el envío automático de tu solicitud a Cima en este momento.
        Puedes escribirles directamente en WhatsApp con la información ya
        precargada — solo presiona Enviar.
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 rounded-lg bg-[#25D366]/10 border border-[#25D366]/30 px-4 py-2.5 text-sm text-[#25D366] font-semibold hover:bg-[#25D366]/20 transition-all"
      >
        <MessageCircle className="h-4 w-4" />
        Abrir WhatsApp
      </a>
    </div>
  );
}
