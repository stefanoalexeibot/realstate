"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, X, Loader2, Building2, ImagePlus, Sparkles, ChevronDown,
  MapPin, Plus, Check,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { searchColonias, type Colonia } from "@/lib/colonias-mty";

/* ─── Constants ─────────────────────────────────────────────────────────── */
const PROP_TYPES = [
  { key: "casa", label: "Casa" },
  { key: "departamento", label: "Departamento" },
  { key: "terreno", label: "Terreno" },
  { key: "local", label: "Local comercial" },
  { key: "oficina", label: "Oficina" },
] as const;

const STATUS_OPTS = [
  { key: "active", label: "Activa — visible en catálogo" },
  { key: "draft", label: "Borrador — no visible aún" },
  { key: "inactive", label: "Inactiva — oculta al público" },
  { key: "sold", label: "Vendida" },
  { key: "rented", label: "Rentada" },
] as const;

type PropType = typeof PROP_TYPES[number]["key"];
type Status = typeof STATUS_OPTS[number]["key"];

interface PhotoPreview { file: File; url: string }
interface Propietario { id: string; name: string; email: string | null }
interface Agente { id: string; name: string }

const EMPTY_FORM = {
  title: "",
  description: "",
  price: "",
  operation_type: "venta" as "venta" | "renta",
  property_type: "casa" as PropType,
  bedrooms: "",
  bathrooms: "",
  area_m2: "",
  terrain_m2: "",
  construction_m2: "",
  parking: "",
  neighborhood: "",
  city: "Monterrey",
  state: "Nuevo León",
  address: "",
  construction_year: "",
  features: [] as string[],
  status: "active" as Status,
  featured: false,
  propietario_id: "",
  agent_id: "",
  agent_notes: "",
  days_to_sell: "",
  sold_at: "",
};

/* ─── Component ─────────────────────────────────────────────────────────── */
export default function NuevaPropiedad() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string | null>(null);
  const [photos, setPhotos] = useState<PhotoPreview[]>([]);

  // People
  const [propietarios, setPropietarios] = useState<Propietario[]>([]);
  const [agentes, setAgentes] = useState<Agente[]>([]);

  // Form
  const [form, setForm] = useState(EMPTY_FORM);
  const [featureInput, setFeatureInput] = useState("");

  // Neighborhood combobox
  const [coloniaQuery, setColoniaQuery] = useState("");
  const [coloniaResults, setColoniaResults] = useState<Colonia[]>([]);
  const [showColonias, setShowColonias] = useState(false);
  const coloniaRef = useRef<HTMLDivElement>(null);

  // AI fill
  const [showAI, setShowAI] = useState(false);
  const [aiText, setAiText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  /* Load propietarios + agentes via server API (bypasses RLS) */
  const loadPeople = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/people");
      const json = await res.json();
      setPropietarios((json.propietarios ?? []) as Propietario[]);
      setAgentes((json.agentes ?? []) as Agente[]);
    } catch { /* ignore */ }
  }, []);
  useEffect(() => { loadPeople(); }, [loadPeople]);

  /* Close colonia dropdown on outside click */
  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (coloniaRef.current && !coloniaRef.current.contains(e.target as Node)) {
        setShowColonias(false);
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  /* ─── Helpers ─────────────────────────────────────────────────────────── */
  function set(key: string, value: string | boolean | string[]) {
    setForm((f) => {
      const next = { ...f, [key]: value };
      // Auto-set sold_at if status changes to sold/rented and it's empty
      if (key === "status" && (value === "sold" || value === "rented") && !f.sold_at) {
        next.sold_at = new Date().toISOString().split("T")[0];
      }
      return next;
    });
  }

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const added: PhotoPreview[] = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, 20 - photos.length)
      .map((file) => ({ file, url: URL.createObjectURL(file) }));
    setPhotos((prev) => [...prev, ...added]);
  }

  function removePhoto(idx: number) {
    setPhotos((prev) => { URL.revokeObjectURL(prev[idx].url); return prev.filter((_, i) => i !== idx); });
  }

  /* ─── Colonia combobox ────────────────────────────────────────────────── */
  function handleColoniaInput(val: string) {
    setColoniaQuery(val);
    set("neighborhood", val);
    setColoniaResults(searchColonias(val));
    setShowColonias(true);
  }

  function selectColonia(c: Colonia) {
    setColoniaQuery(c.name);
    set("neighborhood", c.name);
    // Auto-fill city based on municipality
    const cityMap: Record<string, string> = {
      "San Pedro Garza García": "San Pedro Garza García",
      "San Nicolás de los Garza": "San Nicolás de los Garza",
      "Guadalupe": "Guadalupe",
      "Apodaca": "Apodaca",
      "General Escobedo": "General Escobedo",
      "Santa Catarina": "Santa Catarina",
      "García": "García",
      "Juárez": "Juárez",
      "Santiago": "Santiago",
    };
    const city = cityMap[c.municipality] ?? "Monterrey";
    set("city", city);
    setShowColonias(false);
  }

  /* ─── Feature tags ────────────────────────────────────────────────────── */
  function addFeature() {
    const val = featureInput.trim();
    if (!val || form.features.includes(val)) return;
    set("features", [...form.features, val]);
    setFeatureInput("");
  }

  function removeFeature(f: string) {
    set("features", form.features.filter((x) => x !== f));
  }

  /* ─── AI fill ─────────────────────────────────────────────────────────── */
  async function handleAiFill() {
    if (!aiText.trim()) return;
    setAiLoading(true);
    setAiError(null);
    try {
      const res = await fetch("/api/ai-fill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: aiText }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Error al procesar");
      const d = json.data;
      setForm((prev) => ({
        ...prev,
        title: d.title ?? prev.title,
        description: d.description ?? prev.description,
        price: d.price ? String(d.price) : prev.price,
        operation_type: ["venta", "renta"].includes(d.operation_type) ? d.operation_type : prev.operation_type,
        property_type: ["casa", "departamento", "terreno", "local", "oficina"].includes(d.property_type) ? d.property_type : prev.property_type,
        bedrooms: d.bedrooms != null ? String(d.bedrooms) : prev.bedrooms,
        bathrooms: d.bathrooms != null ? String(d.bathrooms) : prev.bathrooms,
        area_m2: d.area_m2 != null ? String(d.area_m2) : prev.area_m2,
        parking: d.parking != null ? String(d.parking) : prev.parking,
        neighborhood: d.neighborhood ?? prev.neighborhood,
        city: d.city ?? prev.city,
        state: d.state ?? prev.state,
        address: d.address ?? prev.address,
        construction_year: d.construction_year != null ? String(d.construction_year) : prev.construction_year,
        features: d.features ? d.features.split(",").map((f: string) => f.trim()).filter(Boolean) : prev.features,
      }));
      if (d.neighborhood) setColoniaQuery(d.neighborhood);
      setShowAI(false);
      setAiText("");
    } catch (e) {
      setAiError(e instanceof Error ? e.message : "Error");
    } finally {
      setAiLoading(false);
    }
  }

  /* ─── Submit ──────────────────────────────────────────────────────────── */
  async function handleSubmit(e: React.FormEvent, overrideStatus?: Status) {
    if (e) e.preventDefault();
    if (!form.title || !form.price || !form.operation_type || !form.property_type) {
      setError("Completa los campos requeridos (título, precio, tipo).");
      return;
    }
    setLoading(true);
    setError(null);

    const targetStatus = overrideStatus || form.status;

    try {
      const photoUrls: string[] = [];

      // Upload photos via server route (uses service client)
      for (let i = 0; i < photos.length; i++) {
        setProgress(`Subiendo foto ${i + 1} de ${photos.length}…`);
        const fd = new FormData();
        fd.append("file", photos[i].file);
        const res = await fetch("/api/photos/upload", { method: "POST", body: fd });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Error al subir foto");
        photoUrls.push(json.url);
      }

      setProgress("Guardando propiedad…");

      const res = await fetch("/api/propiedades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          status: targetStatus,
          price: Number(form.price),
          bedrooms: Number(form.bedrooms) || 0,
          bathrooms: Number(form.bathrooms) || 0,
          area_m2: form.area_m2 ? Number(form.area_m2) : null,
          terrain_m2: form.terrain_m2 ? Number(form.terrain_m2) : null,
          construction_m2: form.construction_m2 ? Number(form.construction_m2) : null,
          parking: Number(form.parking) || 0,
          construction_year: form.construction_year ? Number(form.construction_year) : null,
          features: form.features.join(","),
          photos: photoUrls,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Error al guardar");
      router.push("/admin/propiedades");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
      setProgress(null);
    }
  }

  /* ─── Shared input class ─────────────────────────────────────────────── */
  const inp = "w-full rounded-lg bg-cima-surface border border-cima-border px-3 py-2.5 text-sm text-cima-text placeholder-cima-text-dim focus:outline-none focus:border-cima-gold/50 transition-colors";
  const sel = "w-full rounded-lg bg-cima-surface border border-cima-border px-3 py-2.5 text-sm text-cima-text focus:outline-none focus:border-cima-gold/50 transition-colors";

  /* ─── Render ─────────────────────────────────────────────────────────── */
  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/propiedades" className="p-1.5 rounded-lg text-cima-text-muted hover:bg-cima-surface transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1">
          <p className="font-mono text-[10px] tracking-[0.2em] text-cima-gold uppercase mb-0.5">Catálogo</p>
          <h1 className="font-heading font-bold text-2xl text-cima-text">Nueva propiedad</h1>
        </div>
        <button
          type="button"
          onClick={() => { setShowAI(true); setAiError(null); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-cima-gold/30 bg-cima-gold/5 text-sm font-semibold text-cima-gold hover:bg-cima-gold/10 transition-colors"
        >
          <Sparkles className="h-4 w-4" />
          Llenar con IA
        </button>
      </div>

      {/* AI Modal */}
      {showAI && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-cima-border bg-cima-card p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="h-4 w-4 text-cima-gold" />
                  <p className="font-mono text-[10px] tracking-[0.15em] text-cima-gold uppercase">Inteligencia artificial</p>
                </div>
                <h2 className="font-heading font-bold text-xl text-cima-text">Llenar datos con IA</h2>
                <p className="text-xs text-cima-text-muted mt-1">Pega la descripción o anuncio de la propiedad y la IA extrae los datos automáticamente.</p>
              </div>
              <button onClick={() => setShowAI(false)} className="p-1.5 rounded-lg text-cima-text-muted hover:bg-cima-surface">
                <X className="h-4 w-4" />
              </button>
            </div>
            <textarea
              rows={8}
              value={aiText}
              onChange={(e) => setAiText(e.target.value)}
              placeholder={"Casa en venta en Cumbres 3er Sector, Monterrey. 3 recámaras, 2.5 baños, 180 m² construcción, 220 m² terreno. Alberca, jardín, 2 cajones. Precio $3,800,000. Tel: 81 1234 5678…"}
              className="w-full rounded-lg bg-cima-surface border border-cima-border px-3 py-2.5 text-sm text-cima-text placeholder-cima-text-dim focus:outline-none focus:border-cima-gold/50 transition-colors resize-none"
            />
            {aiError && <p className="text-sm text-red-400 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2">{aiError}</p>}
            <div className="flex gap-2">
              <button
                onClick={handleAiFill}
                disabled={aiLoading || !aiText.trim()}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-cima-gold text-cima-bg text-sm font-semibold hover:bg-cima-gold-light disabled:opacity-60 transition-colors"
              >
                {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {aiLoading ? "Procesando…" : "Extraer datos"}
              </button>
              <button onClick={() => setShowAI(false)} className="px-4 py-2.5 rounded-lg border border-cima-border text-sm text-cima-text-muted hover:bg-cima-surface transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── Operación y tipo ── */}
        <div className="rounded-xl border border-cima-border bg-cima-card p-6 space-y-5">
          <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">Tipo de operación</p>

          {/* Operación toggle */}
          <div className="flex rounded-xl overflow-hidden border border-cima-border">
            {(["venta", "renta"] as const).map((op) => (
              <button
                key={op}
                type="button"
                onClick={() => set("operation_type", op)}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${form.operation_type === op
                  ? "bg-cima-gold text-cima-bg"
                  : "bg-cima-surface text-cima-text-muted hover:text-cima-text"
                  }`}
              >
                {op === "venta" ? "Venta" : "Renta"}
              </button>
            ))}
          </div>

          {/* Tipo de propiedad */}
          <div>
            <label className="block text-xs font-medium text-cima-text-muted mb-2">Tipo de propiedad</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {PROP_TYPES.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => set("property_type", t.key)}
                  className={`py-2.5 px-2 rounded-lg text-xs font-medium transition-colors ${form.property_type === t.key
                    ? "bg-cima-gold/15 border border-cima-gold/50 text-cima-gold"
                    : "border border-cima-border text-cima-text-muted hover:border-cima-gold/30 hover:text-cima-text"
                    }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Información básica ── */}
        <div className="rounded-xl border border-cima-border bg-cima-card p-6 space-y-4">
          <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">Información básica</p>

          <div>
            <label className="block text-xs font-medium text-cima-text-muted mb-1.5">Título *</label>
            <input type="text" required value={form.title} onChange={(e) => set("title", e.target.value)}
              placeholder="Casa en Cumbres 3er Sector — 3 recámaras" className={inp} />
          </div>

          <div>
            <label className="block text-xs font-medium text-cima-text-muted mb-1.5">
              Precio (MXN) * {form.operation_type === "renta" && <span className="text-cima-text-dim font-normal">— por mes</span>}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-cima-text-muted">$</span>
              <input
                type="text"
                inputMode="numeric"
                required
                value={form.price}
                onChange={(e) => set("price", e.target.value.replace(/[^0-9.]/g, ""))}
                placeholder={form.operation_type === "venta" ? "3500000" : "15000"}
                className={`${inp} pl-6`}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-cima-text-muted mb-1.5">Descripción</label>
            <textarea rows={4} value={form.description} onChange={(e) => set("description", e.target.value)}
              placeholder="Describe la propiedad: distribución, acabados, amenidades, ubicación, puntos destacados…"
              className={`${inp} resize-none`} />
          </div>
        </div>

        {/* ── Ubicación ── */}
        <div className="rounded-xl border border-cima-border bg-cima-card p-6 space-y-4">
          <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">Ubicación</p>

          {/* Neighborhood combobox */}
          <div ref={coloniaRef} className="relative">
            <label className="block text-xs font-medium text-cima-text-muted mb-1.5">
              <MapPin className="inline h-3 w-3 mr-1" />
              Colonia / Fraccionamiento
            </label>
            <div className="relative">
              <input
                type="text"
                value={coloniaQuery}
                onChange={(e) => handleColoniaInput(e.target.value)}
                onFocus={() => { setColoniaResults(searchColonias(coloniaQuery)); setShowColonias(true); }}
                placeholder="Buscar colonia… (Cumbres, Contry, San Pedro…)"
                className={inp}
              />
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-cima-text-dim pointer-events-none" />
            </div>
            {showColonias && coloniaResults.length > 0 && (
              <div className="absolute z-30 top-full left-0 right-0 mt-1 rounded-lg border border-cima-border bg-cima-card shadow-xl overflow-hidden max-h-52 overflow-y-auto">
                {coloniaResults.map((c) => (
                  <button
                    key={`${c.name}-${c.municipality}`}
                    type="button"
                    onClick={() => selectColonia(c)}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-cima-surface transition-colors"
                  >
                    <span className="text-sm text-cima-text">{c.name}</span>
                    <span className="text-[10px] text-cima-text-dim font-mono ml-2 shrink-0">{c.municipality}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-cima-text-muted mb-1.5">Dirección (calle y número)</label>
            <input type="text" value={form.address} onChange={(e) => set("address", e.target.value)}
              placeholder="Av. Vasconcelos 1234" className={inp} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-cima-text-muted mb-1.5">Ciudad</label>
              <input type="text" value={form.city} onChange={(e) => set("city", e.target.value)} className={inp} />
            </div>
            <div>
              <label className="block text-xs font-medium text-cima-text-muted mb-1.5">Estado</label>
              <input type="text" value={form.state} onChange={(e) => set("state", e.target.value)} className={inp} />
            </div>
          </div>
        </div>

        {/* ── Detalles ── */}
        <div className="rounded-xl border border-cima-border bg-cima-card p-6 space-y-4">
          <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">Detalles de la propiedad</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {form.property_type !== "terreno" && (
              <>
                <div>
                  <label className="block text-xs font-medium text-cima-text-muted mb-1.5">Recámaras</label>
                  <select value={form.bedrooms} onChange={(e) => set("bedrooms", e.target.value)} className={sel}>
                    {["0", "1", "2", "3", "4", "5", "6+"].map((v) => <option key={v} value={v === "6+" ? "6" : v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-cima-text-muted mb-1.5">Baños</label>
                  <select value={form.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} className={sel}>
                    {["0", "1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5"].map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-cima-text-muted mb-1.5">Cajones</label>
                  <select value={form.parking} onChange={(e) => set("parking", e.target.value)} className={sel}>
                    {["0", "1", "2", "3", "4", "5"].map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
              </>
            )}
            <div>
              <label className="block text-xs font-medium text-cima-text-muted mb-1.5">Área total m²</label>
              <input type="text" inputMode="numeric" value={form.area_m2} onChange={(e) => set("area_m2", e.target.value.replace(/[^0-9.]/g, ""))}
                placeholder="220" className={inp} />
            </div>
          </div>

          {/* m² terreno y construcción */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-cima-text-muted mb-1.5">m² de terreno</label>
              <input type="text" inputMode="numeric" value={form.terrain_m2} onChange={(e) => set("terrain_m2", e.target.value.replace(/[^0-9.]/g, ""))}
                placeholder="220" className={inp} />
            </div>
            <div>
              <label className="block text-xs font-medium text-cima-text-muted mb-1.5">m² de construcción</label>
              <input type="text" inputMode="numeric" value={form.construction_m2} onChange={(e) => set("construction_m2", e.target.value.replace(/[^0-9.]/g, ""))}
                placeholder="180" className={inp} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-cima-text-muted mb-1.5">Año de construcción</label>
              <input type="text" inputMode="numeric" value={form.construction_year}
                onChange={(e) => set("construction_year", e.target.value.replace(/[^0-9]/g, ""))} placeholder="2015" className={inp} />
            </div>
          </div>
        </div>

        {/* ── Características ── */}
        <div className="rounded-xl border border-cima-border bg-cima-card p-6 space-y-4">
          <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">Características / amenidades</p>

          <div className="flex gap-2">
            <input
              type="text"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addFeature(); } }}
              placeholder="Alberca, jardín, cuarto de servicio…"
              className={`${inp} flex-1`}
            />
            <button type="button" onClick={addFeature}
              className="px-3 py-2.5 rounded-lg bg-cima-gold/10 border border-cima-gold/30 text-cima-gold hover:bg-cima-gold/20 transition-colors">
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Quick adds */}
          <div className="flex flex-wrap gap-1.5">
            {["Alberca", "Jardín", "Terraza", "Roof garden", "Cuarto de servicio", "Bodega", "Seguridad 24h",
              "Gimnasio", "Área de juegos", "Salón de eventos", "Elevador", "Vigilancia"].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => { if (!form.features.includes(f)) set("features", [...form.features, f]); }}
                  className={`px-2.5 py-1 rounded-md text-[11px] border transition-colors ${form.features.includes(f)
                    ? "bg-cima-gold/15 border-cima-gold/40 text-cima-gold"
                    : "border-cima-border text-cima-text-dim hover:border-cima-gold/30 hover:text-cima-text-muted"
                    }`}
                >
                  {form.features.includes(f) && <Check className="inline h-2.5 w-2.5 mr-1" />}
                  {f}
                </button>
              ))}
          </div>

          {form.features.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1 border-t border-cima-border">
              {form.features.map((f) => (
                <span key={f} className="flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-md bg-cima-gold/10 border border-cima-gold/20 text-xs text-cima-gold">
                  {f}
                  <button type="button" onClick={() => removeFeature(f)} className="ml-0.5 hover:text-cima-gold-light">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ── Propietario y agente ── */}
        <div className="rounded-xl border border-cima-border bg-cima-card p-6 space-y-4">
          <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">Propietario y agente</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-cima-text-muted mb-1.5">Propietario</label>
              <select value={form.propietario_id} onChange={(e) => set("propietario_id", e.target.value)} className={sel}>
                <option value="">— Sin asignar —</option>
                {propietarios.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}{p.email ? ` (${p.email})` : ""}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-cima-text-muted mb-1.5">Agente responsable</label>
              <select value={form.agent_id} onChange={(e) => set("agent_id", e.target.value)} className={sel}>
                <option value="">— Sin asignar —</option>
                {agentes.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-cima-text-muted mb-1.5">Notas internas (solo admin)</label>
            <textarea rows={2} value={form.agent_notes} onChange={(e) => set("agent_notes", e.target.value)}
              placeholder="Urgencia, condiciones del propietario, situación legal…"
              className={`${inp} resize-none`} />
          </div>
        </div>

        {/* ── Estado ── */}
        <div className="rounded-xl border border-cima-border bg-cima-card p-6 space-y-4">
          <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">Publicación</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {STATUS_OPTS.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => set("status", s.key)}
                className={`rounded-lg border px-3 py-2.5 text-left transition-colors ${form.status === s.key
                  ? "border-cima-gold/50 bg-cima-gold/10 text-cima-gold"
                  : "border-cima-border text-cima-text-muted hover:border-cima-gold/30"
                  }`}
              >
                <p className="text-xs font-semibold">{s.key === "active" ? "Activa" : s.key === "draft" ? "Borrador" : s.key === "inactive" ? "Inactiva" : s.key === "sold" ? "Vendida" : "Rentada"}</p>
                <p className="text-[10px] text-cima-text-dim mt-0.5 leading-tight">
                  {s.key === "active" ? "Visible en catálogo" : s.key === "draft" ? "No visible aún" : s.key === "inactive" ? "Oculta al público" : s.key === "sold" ? "Operación cerrada" : "Renta concluida"}
                </p>
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)}
              className="h-4 w-4 rounded border-cima-border bg-cima-surface accent-cima-gold cursor-pointer" />
            <span className="text-sm text-cima-text-muted">⭐ Destacar en inicio</span>
          </label>

          {/* Campos de cierre (solo si es Vendida o Rentada) */}
          {(form.status === "sold" || form.status === "rented") && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-cima-border">
              <div>
                <label className="block text-xs font-medium text-cima-text-muted mb-1.5">
                  Días para {form.status === "sold" ? "vender" : "rentar"}
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.days_to_sell}
                  onChange={(e) => set("days_to_sell", e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="Ej. 15"
                  className={inp}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-cima-text-muted mb-1.5">Fecha de cierre</label>
                <input
                  type="date"
                  value={form.sold_at}
                  onChange={(e) => set("sold_at", e.target.value)}
                  className={inp}
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Fotos ── */}
        <div className="rounded-xl border border-cima-border bg-cima-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">Fotos</p>
            <span className="text-[10px] text-cima-text-dim font-mono">{photos.length}/20</span>
          </div>

          <button type="button" onClick={() => fileInputRef.current?.click()}
            className="w-full rounded-xl border-2 border-dashed border-cima-border hover:border-cima-gold/40 bg-cima-surface/30 hover:bg-cima-gold/5 transition-colors py-10 flex flex-col items-center gap-3 group">
            <div className="h-12 w-12 rounded-full bg-cima-gold/10 border border-cima-gold/20 flex items-center justify-center group-hover:bg-cima-gold/15 transition-colors">
              <ImagePlus className="h-5 w-5 text-cima-gold" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-cima-text">Seleccionar fotos</p>
              <p className="text-xs text-cima-text-dim mt-0.5">JPG, PNG, WEBP · Máx. 10 MB por foto · La primera será la portada</p>
            </div>
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
            onChange={(e) => handleFiles(e.target.files)} />

          {photos.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {photos.map((p, i) => (
                <div key={p.url} className="relative group aspect-square rounded-lg overflow-hidden border border-cima-border">
                  <Image src={p.url} alt="" fill className="object-cover" unoptimized />
                  {i === 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-cima-gold/90 text-center py-0.5">
                      <span className="font-mono text-[9px] text-cima-bg uppercase tracking-wider">Portada</span>
                    </div>
                  )}
                  <button type="button" onClick={() => removePhoto(i)}
                    className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pb-8">
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cima-gold text-cima-bg text-sm font-semibold hover:bg-cima-gold-light disabled:opacity-60 transition-colors">
            {loading && !progress?.includes("borrador") ? <><Loader2 className="h-4 w-4 animate-spin" />{progress ?? "Guardando…"}</> : <><Building2 className="h-4 w-4" />Publicar propiedad</>}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleSubmit(null as any, "draft")}
            className="px-5 py-2.5 rounded-lg border border-cima-border text-sm text-cima-text hover:bg-cima-surface hover:border-cima-gold/30 transition-all"
          >
            {loading && progress?.includes("borrador") ? <Loader2 className="h-4 w-4 animate-spin" /> : "Guardar como borrador"}
          </button>
          <Link href="/admin/propiedades"
            className="px-5 py-2.5 rounded-lg border border-cima-border text-sm text-cima-text-muted hover:bg-cima-surface transition-colors">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
