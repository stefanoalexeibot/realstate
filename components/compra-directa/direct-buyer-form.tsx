"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Send, MapPin } from "lucide-react";
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
const WHATSAPP_NUMBER = "528121980008";

// ── Tipos ──────────────────────────────────────────────────────────────────
interface FormData {
  name: string;
  phone: string;
  municipality: string;
  colonia: string;
  property_address: string;
  property_latitude: number | null;
  property_longitude: number | null;
  property_type: string;
  bedrooms: string;
  is_owner: boolean | null;
  property_condition: string;
  property_situations: string[];
  timeline: string;
  visit_requested: boolean;
  preferred_visit_date: string;
  preferred_visit_time: string;
  consent: boolean;
}

const STEPS = ["Contacto", "Propiedad", "Detalles", "Confirmación"];
const TOTAL = STEPS.length;

const INITIAL: FormData = {
  name: "",
  phone: "",
  municipality: "",
  colonia: "",
  property_address: "",
  property_latitude: null,
  property_longitude: null,
  property_type: "",
  bedrooms: "",
  is_owner: null,
  property_condition: "",
  property_situations: [],
  timeline: "",
  visit_requested: false,
  preferred_visit_date: "",
  preferred_visit_time: "",
  consent: false,
};

function getLocalDateValue() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Monterrey",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const value = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return `${value("year")}-${value("month")}-${value("day")}`;
}

function formatDateForMessage(value: string) {
  const [year, month, day] = value.split("-");
  return year && month && day ? `${day}/${month}/${year}` : value;
}

function buildWhatsAppUrl(
  data: FormData,
  attribution: { utmSource?: string | null; utmMedium?: string | null; utmCampaign?: string | null }
) {
  const propertyType =
    PROPERTY_TYPES.find((option) => option.value === data.property_type)?.label ??
    data.property_type;
  const condition =
    PROPERTY_CONDITIONS.find((option) => option.value === data.property_condition)?.label ??
    data.property_condition;
  const situations = data.property_situations
    .map((value) => PROPERTY_SITUATIONS.find((option) => option.value === value)?.label ?? value)
    .join(", ");
  const timeline =
    SALE_TIMELINES.find((option) => option.value === data.timeline)?.label ??
    data.timeline;
  const mapUrl =
    data.property_latitude !== null && data.property_longitude !== null
      ? `https://maps.google.com/?q=${data.property_latitude},${data.property_longitude}`
      : "";

  const message = [
    "Hola Cima, quiero solicitar una oferta para mi propiedad.",
    "",
    "*Mis datos*",
    `Nombre: ${data.name.trim()}`,
    `Teléfono / WhatsApp: ${data.phone.trim()}`,
    "",
    "*Datos de la propiedad*",
    `Municipio: ${data.municipality}`,
    data.colonia ? `Colonia: ${data.colonia}` : null,
    data.property_address.trim() ? `Dirección: ${data.property_address.trim()}` : null,
    mapUrl ? `Ubicación en mapa: ${mapUrl}` : null,
    `¿Es propietario?: ${data.is_owner ? "Sí" : "No"}`,
    `Tipo de inmueble: ${propertyType}`,
    data.bedrooms !== "" ? `Recámaras: ${data.bedrooms === "0" ? "Estudio" : data.bedrooms}` : null,
    `Estado: ${condition}`,
    `Situación: ${situations || "Sin especificar"}`,
    `Plazo para vender: ${timeline}`,
    data.visit_requested
      ? `Visita solicitada: ${formatDateForMessage(data.preferred_visit_date)} a las ${data.preferred_visit_time} (horario sujeto a confirmación)`
      : "Visita: No solicitada",
    attribution.utmSource ? `Origen: ${attribution.utmSource}` : null,
    attribution.utmMedium ? `Medio: ${attribution.utmMedium}` : null,
    attribution.utmCampaign ? `Campaña: ${attribution.utmCampaign}` : null,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

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
  visitRequestIntent?: boolean;
}

export default function DirectBuyerForm({
  utmSource,
  utmMedium,
  utmCampaign,
  visitRequestIntent = false,
}: Props) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  useEffect(() => {
    if (visitRequestIntent) {
      setData((prev) => ({ ...prev, visit_requested: true }));
    }
  }, [visitRequestIntent]);

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
        if (data.bedrooms !== "") {
          const bedrooms = Number(data.bedrooms);
          if (!Number.isInteger(bedrooms) || bedrooms < 0 || bedrooms > 20) {
            e.bedrooms = "Indica un número entre 0 y 20, o deja el campo vacío";
          }
        }
      }

      if (s === 2) {
        if (data.is_owner === null)
          e.is_owner = "Indica si eres propietario";
        if (!data.property_condition)
          e.property_condition = "Selecciona el estado";
        if (data.property_situations.length === 0)
          e.property_situations = "Selecciona al menos una opción";
        if (!data.timeline) e.timeline = "Selecciona un plazo";
        if (data.visit_requested && !data.preferred_visit_date)
          e.preferred_visit_date = "Elige una fecha preferida";
        if (data.visit_requested && !data.preferred_visit_time)
          e.preferred_visit_time = "Elige una hora preferida";
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
  const submit = () => {
    if (!validate(3)) return;
    window.location.assign(
      buildWhatsAppUrl(data, { utmSource, utmMedium, utmCampaign })
    );
  };

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
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-cima-gold text-cima-bg font-semibold text-sm py-3 px-6 hover:bg-cima-gold-light transition-all active:scale-95"
          >
            <Send className="h-4 w-4" /> Enviar solicitud
          </button>
        )}
      </div>

      <p className="mt-4 text-center text-xs text-cima-text-dim">
        Al tocar “Enviar solicitud”, se abrirá WhatsApp con tu mensaje y tus datos listos. Para enviarlo a Cima, confirma con el botón Enviar de WhatsApp.
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
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);

  const shareCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage("Tu navegador no permite compartir ubicación. Puedes escribir la dirección.");
      return;
    }

    setIsRequestingLocation(true);
    setLocationMessage(null);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setData((prev) => ({
          ...prev,
          property_latitude: Number(coords.latitude.toFixed(6)),
          property_longitude: Number(coords.longitude.toFixed(6)),
        }));
        setIsRequestingLocation(false);
        setLocationMessage("Ubicación agregada. Cima recibirá un enlace al mapa cuando envíes la solicitud.");
      },
      () => {
        setIsRequestingLocation(false);
        setLocationMessage("No pudimos obtener tu ubicación. Puedes escribir la dirección manualmente.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const clearCurrentLocation = () => {
    setData((prev) => ({
      ...prev,
      property_latitude: null,
      property_longitude: null,
    }));
    setLocationMessage(null);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-heading font-bold text-cima-text mb-1">
          Cuéntanos sobre la propiedad
        </h3>
        <p className="text-sm text-cima-text-muted">
          Municipio y tipo de inmueble. La dirección y ubicación son opcionales.
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
        <label htmlFor="db-property-address" className={labelClass()}>
          Dirección de la propiedad <span className="normal-case text-cima-text-dim">(opcional)</span>
        </label>
        <input
          id="db-property-address"
          type="text"
          autoComplete="street-address"
          maxLength={240}
          placeholder="Calle y número, edificio o referencias"
          value={data.property_address}
          onChange={(e) => setData((prev) => ({ ...prev, property_address: e.target.value }))}
          className={fieldClass()}
        />
        <p className="mt-2 text-xs text-cima-text-dim">
          Si estás en la propiedad, también puedes compartir tu ubicación actual. Tu navegador te pedirá permiso.
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={shareCurrentLocation}
            disabled={isRequestingLocation || data.property_latitude !== null}
            className="inline-flex items-center gap-2 rounded-lg border border-cima-border px-3 py-2 text-xs text-cima-text-muted hover:border-cima-gold/40 hover:text-cima-text disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
          >
            <MapPin className="h-3.5 w-3.5" />
            {isRequestingLocation
              ? "Obteniendo ubicación…"
              : data.property_latitude !== null
                ? "Ubicación actual agregada"
                : "Compartir mi ubicación actual"}
          </button>
          {data.property_latitude !== null && (
            <button
              type="button"
              onClick={clearCurrentLocation}
              className="text-xs text-cima-text-dim underline underline-offset-2 hover:text-cima-text"
            >
              Quitar ubicación
            </button>
          )}
        </div>
        {locationMessage && (
          <p className="mt-2 text-xs text-cima-text-muted" role="status">
            {locationMessage}
          </p>
        )}
        <p className="mt-2 text-[11px] text-cima-text-dim">
          Solo se comparte con Cima al enviar el formulario.
        </p>
      </div>
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
      <div>
        <label htmlFor="db-bedrooms" className={labelClass()}>
          Número de recámaras <span className="normal-case text-cima-text-dim">(opcional)</span>
        </label>
        <input
          id="db-bedrooms"
          type="number"
          inputMode="numeric"
          min={0}
          max={20}
          step={1}
          placeholder="Ej. 3"
          value={data.bedrooms}
          onChange={(e) => setData((p) => ({ ...p, bedrooms: e.target.value }))}
          className={fieldClass(!!errors.bedrooms)}
        />
        <p className="mt-1 text-xs text-cima-text-dim">Escribe 0 si es tipo estudio.</p>
        {errors.bedrooms && (
          <p className="mt-1 text-xs text-red-400">{errors.bedrooms}</p>
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
        <label className={labelClass()}>¿Puedes autorizar la venta de la propiedad?</label>
        <div className="flex gap-3">
          {[
            { val: true, label: "Sí" },
            { val: false, label: "No, necesito consultarlo" },
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

      <div className="rounded-2xl border border-cima-border bg-cima-surface/60 p-4 sm:p-5">
        <div className="mb-3">
          <h4 className="text-sm font-semibold text-cima-text">
            ¿Quieres que vayamos a verla?
          </h4>
          <p className="mt-1 text-xs text-cima-text-muted">
            Propón día y hora. Cima confirmará la disponibilidad por WhatsApp.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            { value: true, label: "Sí, solicitar una visita" },
            { value: false, label: "Primero quiero hablar" },
          ].map((option) => (
            <button
              key={String(option.value)}
              type="button"
              aria-pressed={data.visit_requested === option.value}
              onClick={() =>
                setData((prev) => ({
                  ...prev,
                  visit_requested: option.value,
                  preferred_visit_date: option.value ? prev.preferred_visit_date : "",
                  preferred_visit_time: option.value ? prev.preferred_visit_time : "",
                }))
              }
              className={`rounded-xl border px-3 py-3 text-sm text-left transition-colors ${
                data.visit_requested === option.value
                  ? "border-cima-gold bg-cima-gold/10 text-cima-gold font-semibold"
                  : "border-cima-border bg-cima-card text-cima-text-muted hover:border-cima-gold/30"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        {data.visit_requested && (
          <div className="mt-4 grid sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="db-visit-date" className={labelClass()}>
                Fecha preferida
              </label>
              <input
                id="db-visit-date"
                type="date"
                min={getLocalDateValue()}
                value={data.preferred_visit_date}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, preferred_visit_date: e.target.value }))
                }
                className={fieldClass(!!errors.preferred_visit_date)}
              />
              {errors.preferred_visit_date && (
                <p className="mt-1 text-xs text-red-400">{errors.preferred_visit_date}</p>
              )}
            </div>
            <div>
              <label htmlFor="db-visit-time" className={labelClass()}>
                Hora preferida
              </label>
              <input
                id="db-visit-time"
                type="time"
                value={data.preferred_visit_time}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, preferred_visit_time: e.target.value }))
                }
                className={fieldClass(!!errors.preferred_visit_time)}
              />
              {errors.preferred_visit_time && (
                <p className="mt-1 text-xs text-red-400">{errors.preferred_visit_time}</p>
              )}
            </div>
            <p className="sm:col-span-2 text-xs text-cima-text-dim">
              La visita queda solicitada, no confirmada, hasta que Cima te contacte.
            </p>
          </div>
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
            data.property_address.trim() ? ["Dirección", data.property_address.trim()] : null,
            data.property_latitude !== null && data.property_longitude !== null ? ["Ubicación exacta", "Compartida; se enviará un enlace al mapa"] : null,
            ["Tipo", PROPERTY_TYPES.find((p) => p.value === data.property_type)?.label ?? data.property_type],
            data.bedrooms !== "" ? ["Recámaras", data.bedrooms === "0" ? "Estudio" : data.bedrooms] : null,
            ["Estado inmueble", PROPERTY_CONDITIONS.find((c) => c.value === data.property_condition)?.label ?? data.property_condition],
            ["Plazo", SALE_TIMELINES.find((t) => t.value === data.timeline)?.label ?? data.timeline],
            data.visit_requested ? ["Visita solicitada", `${data.preferred_visit_date} · ${data.preferred_visit_time}`] : null,
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
