"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, X, Loader2, Building2, ImagePlus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const PROP_TYPES = ["casa", "departamento", "terreno", "local", "oficina"] as const;
const STATUS_OPTS = ["active", "sold", "rented", "inactive"] as const;
const STATUS_LABELS: Record<string, string> = { active: "Activa", sold: "Vendida", rented: "Rentada", inactive: "Inactiva" };

interface PhotoPreview { file: File; url: string }

export default function NuevaPropiedad() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<PhotoPreview[]>([]);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    operation_type: "venta" as "venta" | "renta",
    property_type: "casa" as typeof PROP_TYPES[number],
    bedrooms: "0",
    bathrooms: "0",
    area_m2: "",
    parking: "0",
    neighborhood: "",
    city: "Monterrey",
    state: "Nuevo León",
    features: "",
    status: "active" as typeof STATUS_OPTS[number],
    featured: false,
  });

  function set(key: string, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const newPreviews: PhotoPreview[] = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, 20 - photos.length)
      .map((file) => ({ file, url: URL.createObjectURL(file) }));
    setPhotos((prev) => [...prev, ...newPreviews]);
  }

  function removePhoto(idx: number) {
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[idx].url);
      return prev.filter((_, i) => i !== idx);
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.price || !form.operation_type || !form.property_type) {
      setError("Completa los campos requeridos (título, precio, tipo).");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const photoUrls: string[] = [];

      // Upload photos
      if (photos.length > 0) {
        for (let i = 0; i < photos.length; i++) {
          setUploadProgress(`Subiendo foto ${i + 1} de ${photos.length}…`);
          const { file } = photos[i];
          const ext = file.name.split(".").pop();
          const path = `properties/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
          const { data: uploaded, error: uploadErr } = await supabase.storage
            .from("cima-photos")
            .upload(path, file, { cacheControl: "3600", upsert: false });
          if (uploadErr) throw uploadErr;
          const { data: { publicUrl } } = supabase.storage.from("cima-photos").getPublicUrl(uploaded.path);
          photoUrls.push(publicUrl);
        }
      }
      setUploadProgress("Guardando propiedad…");

      const res = await fetch("/api/propiedades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          bedrooms: Number(form.bedrooms),
          bathrooms: Number(form.bathrooms),
          area_m2: form.area_m2 ? Number(form.area_m2) : null,
          parking: Number(form.parking),
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
      setUploadProgress(null);
    }
  }

  return (
    <div className="p-6 sm:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/propiedades" className="p-1.5 rounded-lg text-cima-text-muted hover:bg-cima-surface transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <p className="font-mono text-[10px] tracking-[0.2em] text-cima-gold uppercase mb-0.5">Catálogo</p>
          <h1 className="font-heading font-bold text-2xl text-cima-text">Nueva propiedad</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <div className="rounded-xl border border-cima-border bg-cima-card p-6 space-y-4">
          <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">Información básica</p>

          <div>
            <label className="block text-xs font-medium text-cima-text-muted mb-1.5">Título *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Casa en Cumbres, 3 recámaras"
              className="w-full rounded-lg bg-cima-surface border border-cima-border px-3 py-2.5 text-sm text-cima-text placeholder-cima-text-dim focus:outline-none focus:border-cima-gold/50 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-cima-text-muted mb-1.5">Operación *</label>
              <select
                value={form.operation_type}
                onChange={(e) => set("operation_type", e.target.value)}
                className="w-full rounded-lg bg-cima-surface border border-cima-border px-3 py-2.5 text-sm text-cima-text focus:outline-none focus:border-cima-gold/50 transition-colors"
              >
                <option value="venta">Venta</option>
                <option value="renta">Renta</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-cima-text-muted mb-1.5">Tipo *</label>
              <select
                value={form.property_type}
                onChange={(e) => set("property_type", e.target.value)}
                className="w-full rounded-lg bg-cima-surface border border-cima-border px-3 py-2.5 text-sm text-cima-text focus:outline-none focus:border-cima-gold/50 transition-colors"
              >
                {PROP_TYPES.map((t) => (
                  <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-cima-text-muted mb-1.5">Precio (MXN) *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-cima-text-muted">$</span>
              <input
                type="number"
                required
                min="0"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="3500000"
                className="w-full rounded-lg bg-cima-surface border border-cima-border pl-6 pr-3 py-2.5 text-sm text-cima-text placeholder-cima-text-dim focus:outline-none focus:border-cima-gold/50 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-cima-text-muted mb-1.5">Descripción</label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              placeholder="Describe la propiedad con sus características principales…"
              className="w-full rounded-lg bg-cima-surface border border-cima-border px-3 py-2.5 text-sm text-cima-text placeholder-cima-text-dim focus:outline-none focus:border-cima-gold/50 transition-colors resize-none"
            />
          </div>
        </div>

        {/* Details */}
        <div className="rounded-xl border border-cima-border bg-cima-card p-6 space-y-4">
          <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">Detalles</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {([
              { key: "bedrooms",  label: "Recámaras",  min: 0 },
              { key: "bathrooms", label: "Baños",      min: 0 },
              { key: "parking",   label: "Cajones",    min: 0 },
              { key: "area_m2",   label: "Área (m²)",  min: 0 },
            ] as const).map(({ key, label, min }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-cima-text-muted mb-1.5">{label}</label>
                <input
                  type="number"
                  min={min}
                  value={form[key]}
                  onChange={(e) => set(key, e.target.value)}
                  className="w-full rounded-lg bg-cima-surface border border-cima-border px-3 py-2.5 text-sm text-cima-text focus:outline-none focus:border-cima-gold/50 transition-colors"
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-cima-text-muted mb-1.5">Colonia / Fracc.</label>
              <input
                type="text"
                value={form.neighborhood}
                onChange={(e) => set("neighborhood", e.target.value)}
                placeholder="Cumbres"
                className="w-full rounded-lg bg-cima-surface border border-cima-border px-3 py-2.5 text-sm text-cima-text placeholder-cima-text-dim focus:outline-none focus:border-cima-gold/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-cima-text-muted mb-1.5">Ciudad</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                className="w-full rounded-lg bg-cima-surface border border-cima-border px-3 py-2.5 text-sm text-cima-text focus:outline-none focus:border-cima-gold/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-cima-text-muted mb-1.5">Estado</label>
              <input
                type="text"
                value={form.state}
                onChange={(e) => set("state", e.target.value)}
                className="w-full rounded-lg bg-cima-surface border border-cima-border px-3 py-2.5 text-sm text-cima-text focus:outline-none focus:border-cima-gold/50 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-cima-text-muted mb-1.5">Características (separadas por coma)</label>
            <input
              type="text"
              value={form.features}
              onChange={(e) => set("features", e.target.value)}
              placeholder="Alberca, Jardín, Cuarto de servicio, Roof garden"
              className="w-full rounded-lg bg-cima-surface border border-cima-border px-3 py-2.5 text-sm text-cima-text placeholder-cima-text-dim focus:outline-none focus:border-cima-gold/50 transition-colors"
            />
          </div>
        </div>

        {/* Status & flags */}
        <div className="rounded-xl border border-cima-border bg-cima-card p-6 space-y-4">
          <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">Estado</p>
          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <label className="block text-xs font-medium text-cima-text-muted mb-1.5">Estado de publicación</label>
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
                className="rounded-lg bg-cima-surface border border-cima-border px-3 py-2.5 text-sm text-cima-text focus:outline-none focus:border-cima-gold/50 transition-colors"
              >
                {STATUS_OPTS.map((s) => (
                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-2.5 cursor-pointer mt-4">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set("featured", e.target.checked)}
                className="h-4 w-4 rounded border-cima-border bg-cima-surface accent-cima-gold cursor-pointer"
              />
              <span className="text-sm text-cima-text-muted">Destacar en inicio</span>
            </label>
          </div>
        </div>

        {/* Photos */}
        <div className="rounded-xl border border-cima-border bg-cima-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">Fotos</p>
            <span className="text-[10px] text-cima-text-dim font-mono">{photos.length}/20</span>
          </div>

          {/* Dropzone */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full rounded-xl border-2 border-dashed border-cima-border hover:border-cima-gold/40 bg-cima-surface/30 hover:bg-cima-gold/5 transition-colors py-8 flex flex-col items-center gap-3 group"
          >
            <div className="h-10 w-10 rounded-full bg-cima-gold/10 border border-cima-gold/20 flex items-center justify-center group-hover:bg-cima-gold/15 transition-colors">
              <ImagePlus className="h-5 w-5 text-cima-gold" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-cima-text">Seleccionar fotos</p>
              <p className="text-xs text-cima-text-dim mt-0.5">JPG, PNG, WEBP · Máx. 10MB por foto</p>
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />

          {/* Previews */}
          {photos.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {photos.map((p, i) => (
                <div key={p.url} className="relative group aspect-square rounded-lg overflow-hidden border border-cima-border">
                  <Image src={p.url} alt="" fill className="object-cover" />
                  {i === 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-cima-gold/90 text-center py-0.5">
                      <span className="font-mono text-[9px] text-cima-bg uppercase tracking-wider">Portada</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pb-8">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cima-gold text-cima-bg text-sm font-semibold hover:bg-cima-gold-light disabled:opacity-60 transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {uploadProgress ?? "Guardando…"}
              </>
            ) : (
              <>
                <Building2 className="h-4 w-4" />
                Publicar propiedad
              </>
            )}
          </button>
          <Link
            href="/admin/propiedades"
            className="px-5 py-2.5 rounded-lg border border-cima-border text-sm text-cima-text-muted hover:bg-cima-surface transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
