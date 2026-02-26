"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, X, Loader2, Building2, ImagePlus, Trash2, Check, FileUp, FileText, Download } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const PROP_TYPES = ["casa", "departamento", "terreno", "local", "oficina"] as const;
const STATUS_OPTS = ["active", "draft", "sold", "rented", "inactive"] as const;
const STATUS_LABELS: Record<string, string> = {
  active: "Activa",
  draft: "Borrador",
  sold: "Vendida",
  rented: "Rentada",
  inactive: "Inactiva"
};
const DOC_TYPE_LABELS: Record<string, string> = { contract: "Contrato", deed: "Escritura", id: "Identificación", other: "Otro" };
const DOC_TYPE_COLORS: Record<string, string> = {
  contract: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  deed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  id: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  other: "bg-cima-surface text-cima-text-muted border-cima-border",
};

type ExistingPhoto = { id: string; url: string; order: number; is_cover: boolean };
type NewPhoto = { file: File; previewUrl: string };
type Propietario = { id: string; name: string; email: string };
type Agente = { id: string; name: string };
type DocItem = { id: string; name: string; url: string; type: string; created_at: string };

export default function EditarPropiedad() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const docFileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingPhotos, setExistingPhotos] = useState<ExistingPhoto[]>([]);
  const [newPhotos, setNewPhotos] = useState<NewPhoto[]>([]);
  const [deletingPhoto, setDeletingPhoto] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [propietarios, setPropietarios] = useState<Propietario[]>([]);
  const [agentes, setAgentes] = useState<Agente[]>([]);
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  const [form, setForm] = useState({
    title: "", description: "", price: "",
    operation_type: "venta" as "venta" | "renta",
    property_type: "casa" as typeof PROP_TYPES[number],
    bedrooms: "0", bathrooms: "0", area_m2: "", parking: "0",
    neighborhood: "", city: "Monterrey", state: "Nuevo León",
    features: "", status: "active" as typeof STATUS_OPTS[number],
    featured: false, agent_notes: "",
    propietario_id: "",
    agent_id: "",
    days_to_sell: "",
    sold_at: "",
  });

  useEffect(() => {
    async function loadProperty() {
      try {
        const supabase = createClient();
        const [{ data: prop, error: propError }, { data: photos, error: photosError }, peopleRes] = await Promise.all([
          supabase.from("re_properties").select("*").eq("id", params.id).single(),
          supabase.from("re_photos").select("*").eq("property_id", params.id).order("order"),
          fetch("/api/admin/people").then((r) => r.json()),
        ]);

        if (propError || !prop) {
          console.error("Error loading property:", propError);
          router.push("/admin/propiedades");
          return;
        }

        if (photosError) console.error("Error loading photos:", photosError);

        setForm({
          title: prop.title ?? "",
          description: prop.description ?? "",
          price: String(prop.price ?? ""),
          operation_type: prop.operation_type ?? "venta",
          property_type: prop.property_type ?? "casa",
          bedrooms: String(prop.bedrooms ?? 0),
          bathrooms: String(prop.bathrooms ?? 0),
          area_m2: prop.area_m2 ? String(prop.area_m2) : "",
          parking: String(prop.parking ?? 0),
          neighborhood: prop.neighborhood ?? "",
          city: prop.city ?? "Monterrey",
          state: prop.state ?? "Nuevo León",
          features: (prop.features ?? []).join(", "),
          status: prop.status ?? "active",
          featured: prop.featured ?? false,
          agent_notes: prop.agent_notes ?? "",
          propietario_id: prop.propietario_id ?? "",
          agent_id: prop.agent_id ?? "",
          days_to_sell: prop.days_to_sell != null ? String(prop.days_to_sell) : "",
          sold_at: prop.sold_at ? prop.sold_at.split("T")[0] : "",
        });
        setExistingPhotos((photos ?? []) as ExistingPhoto[]);
        setPropietarios((peopleRes.propietarios ?? []) as Propietario[]);
        setAgentes((peopleRes.agentes ?? []) as Agente[]);

        if (prop.propietario_id) {
          await loadDocs(prop.propietario_id);
        }
      } catch (err: unknown) {
        console.error("Critical error in loadProperty:", err);
        setError("Error al cargar los datos de la propiedad. Por favor, reintenta.");
      } finally {
        setLoading(false);
      }
    }
    loadProperty();
  }, [params.id, router]);

  async function loadDocs(propietarioId: string) {
    const res = await fetch(`/api/portal/docs?propietario_id=${propietarioId}`);
    if (res.ok) {
      const json = await res.json();
      setDocs(json.docs ?? []);
    }
  }

  function set(key: string, value: string | boolean) {
    setForm((f) => {
      const next = { ...f, [key]: value };
      // Auto-set sold_at if status changes to sold/rented and it's empty
      if (key === "status" && (value === "sold" || value === "rented") && !f.sold_at) {
        next.sold_at = new Date().toISOString().split("T")[0];
      }
      return next;
    });
  }

  function handlePropietarioChange(value: string) {
    setForm((f) => ({ ...f, propietario_id: value }));
    if (value) {
      loadDocs(value);
    } else {
      setDocs([]);
    }
  }

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const previews: NewPhoto[] = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .map((file) => ({ file, previewUrl: URL.createObjectURL(file) }));
    setNewPhotos((prev) => [...prev, ...previews]);
  }

  function removeNewPhoto(idx: number) {
    setNewPhotos((prev) => {
      URL.revokeObjectURL(prev[idx].previewUrl);
      return prev.filter((_, i) => i !== idx);
    });
  }

  async function deleteExistingPhoto(photo: ExistingPhoto) {
    setDeletingPhoto(photo.id);
    try {
      const res = await fetch(`/api/photos/${photo.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar foto");
      setExistingPhotos((prev) => prev.filter((p) => p.id !== photo.id));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setDeletingPhoto(null);
    }
  }

  async function setCover(photo: ExistingPhoto) {
    const supabase = createClient();
    await supabase.from("re_photos").update({ is_cover: false }).eq("property_id", params.id);
    await supabase.from("re_photos").update({ is_cover: true }).eq("id", photo.id);
    await supabase.from("re_properties").update({ cover_photo: photo.url }).eq("id", params.id);
    setExistingPhotos((prev) => prev.map((p) => ({ ...p, is_cover: p.id === photo.id })));
  }

  async function handleDocUpload(files: FileList | null) {
    if (!files || !form.propietario_id) return;
    setUploadingDoc(true);
    try {
      const supabase = createClient();
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop();
        const path = `${form.propietario_id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { data: uploaded, error: uploadErr } = await supabase.storage
          .from("cima-docs")
          .upload(path, file, { cacheControl: "3600", upsert: false });
        if (uploadErr) throw uploadErr;
        const { data: { publicUrl } } = supabase.storage.from("cima-docs").getPublicUrl(uploaded.path);
        const type = file.name.toLowerCase().includes("contrato") ? "contract"
          : file.name.toLowerCase().includes("escritura") ? "deed"
            : file.name.toLowerCase().includes("ine") || file.name.toLowerCase().includes("id") ? "id"
              : "other";
        await fetch("/api/portal/docs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ propietario_id: form.propietario_id, name: file.name, url: publicUrl, type }),
        });
      }
      await loadDocs(form.propietario_id);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al subir documento");
    } finally {
      setUploadingDoc(false);
      if (docFileInputRef.current) docFileInputRef.current.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const uploadedPhotos: { url: string; order: number; is_cover: boolean }[] = [];

    try {
      // 1. Upload new photos to storage via our secure API
      if (newPhotos.length > 0) {
        const maxOrder = existingPhotos.length ? Math.max(...existingPhotos.map((p) => p.order)) + 1 : 0;
        for (let i = 0; i < newPhotos.length; i++) {
          setUploadProgress(`Subiendo foto ${i + 1} de ${newPhotos.length}…`);
          const { file } = newPhotos[i];
          const fd = new FormData();
          fd.append("file", file);
          const uploadRes = await fetch("/api/photos/upload", { method: "POST", body: fd });
          const uploadJson = await uploadRes.json();
          if (!uploadRes.ok) throw new Error(uploadJson.error ?? "Error al subir foto");

          uploadedPhotos.push({
            url: uploadJson.url,
            order: maxOrder + i,
            is_cover: existingPhotos.length === 0 && i === 0
          });
        }
      }

      setUploadProgress("Guardando cambios…");

      // 2. Patch property fields and include new photo URLs for secure DB insertion
      const res = await fetch(`/api/propiedades/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          bedrooms: Number(form.bedrooms),
          bathrooms: Number(form.bathrooms),
          area_m2: form.area_m2 ? Number(form.area_m2) : null,
          parking: Number(form.parking),
          days_to_sell: form.days_to_sell ? Number(form.days_to_sell) : null,
          sold_at: form.sold_at || null,
          new_photos: uploadedPhotos,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Error al guardar");

      router.push("/admin/propiedades");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setSaving(false);
      setUploadProgress(null);
    }
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-cima-gold" />
      </div>
    );
  }

  const totalPhotos = existingPhotos.length + newPhotos.length;

  return (
    <div className="p-6 sm:p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/propiedades" className="p-1.5 rounded-lg text-cima-text-muted hover:bg-cima-surface transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <p className="font-mono text-[10px] tracking-[0.2em] text-cima-gold uppercase mb-0.5">Editar</p>
          <h1 className="font-heading font-bold text-2xl text-cima-text truncate max-w-sm">{form.title || "Propiedad"}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <div className="rounded-xl border border-cima-border bg-cima-card p-6 space-y-4">
          <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">Información básica</p>

          <div>
            <label className="block text-xs font-medium text-cima-text-muted mb-1.5">Título *</label>
            <input type="text" required value={form.title} onChange={(e) => set("title", e.target.value)}
              className="w-full rounded-lg bg-cima-surface border border-cima-border px-3 py-2.5 text-sm text-cima-text focus:outline-none focus:border-cima-gold/50 transition-colors" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-cima-text-muted mb-1.5">Operación *</label>
              <select value={form.operation_type} onChange={(e) => set("operation_type", e.target.value)}
                className="w-full rounded-lg bg-cima-surface border border-cima-border px-3 py-2.5 text-sm text-cima-text focus:outline-none focus:border-cima-gold/50 transition-colors">
                <option value="venta">Venta</option>
                <option value="renta">Renta</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-cima-text-muted mb-1.5">Tipo *</label>
              <select value={form.property_type} onChange={(e) => set("property_type", e.target.value)}
                className="w-full rounded-lg bg-cima-surface border border-cima-border px-3 py-2.5 text-sm text-cima-text focus:outline-none focus:border-cima-gold/50 transition-colors">
                {PROP_TYPES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-cima-text-muted mb-1.5">Precio (MXN) *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-cima-text-muted">$</span>
              <input
                type="text"
                inputMode="numeric"
                required
                value={form.price}
                onChange={(e) => set("price", e.target.value.replace(/[^0-9.]/g, ""))}
                className="w-full rounded-lg bg-cima-surface border border-cima-border pl-6 pr-3 py-2.5 text-sm text-cima-text focus:outline-none focus:border-cima-gold/50 transition-colors" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-cima-text-muted mb-1.5">Descripción</label>
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3}
              className="w-full rounded-lg bg-cima-surface border border-cima-border px-3 py-2.5 text-sm text-cima-text focus:outline-none focus:border-cima-gold/50 transition-colors resize-none" />
          </div>
        </div>

        {/* Details */}
        <div className="rounded-xl border border-cima-border bg-cima-card p-6 space-y-4">
          <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">Detalles</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {([
              { key: "bedrooms", label: "Recámaras" }, { key: "bathrooms", label: "Baños" },
              { key: "parking", label: "Cajones" }, { key: "area_m2", label: "Área (m²)" },
            ] as const).map(({ key, label }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-cima-text-muted mb-1.5">{label}</label>
                <input type="text" inputMode="numeric" value={form[key]} onChange={(e) => set(key, e.target.value.replace(/[^0-9.]/g, ""))}
                  className="w-full rounded-lg bg-cima-surface border border-cima-border px-3 py-2.5 text-sm text-cima-text focus:outline-none focus:border-cima-gold/50 transition-colors" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {([
              { key: "neighborhood", label: "Colonia / Fracc.", placeholder: "Cumbres" },
              { key: "city", label: "Ciudad", placeholder: "Monterrey" },
              { key: "state", label: "Estado", placeholder: "Nuevo León" },
            ] as const).map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-cima-text-muted mb-1.5">{label}</label>
                <input type="text" placeholder={placeholder} value={form[key]} onChange={(e) => set(key, e.target.value)}
                  className="w-full rounded-lg bg-cima-surface border border-cima-border px-3 py-2.5 text-sm text-cima-text placeholder-cima-text-dim focus:outline-none focus:border-cima-gold/50 transition-colors" />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-xs font-medium text-cima-text-muted mb-1.5">Características (separadas por coma)</label>
            <input type="text" value={form.features} onChange={(e) => set("features", e.target.value)}
              placeholder="Alberca, Jardín, Cuarto de servicio"
              className="w-full rounded-lg bg-cima-surface border border-cima-border px-3 py-2.5 text-sm text-cima-text placeholder-cima-text-dim focus:outline-none focus:border-cima-gold/50 transition-colors" />
          </div>
        </div>

        {/* Propietario y Agente */}
        <div className="rounded-xl border border-cima-border bg-cima-card p-6 space-y-4">
          <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">Asignación</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-cima-text-muted mb-1.5">Propietario</label>
              <select
                value={form.propietario_id}
                onChange={(e) => handlePropietarioChange(e.target.value)}
                className="w-full rounded-lg bg-cima-surface border border-cima-border px-3 py-2.5 text-sm text-cima-text focus:outline-none focus:border-cima-gold/50 transition-colors"
              >
                <option value="">Sin asignar</option>
                {propietarios.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-cima-text-muted mb-1.5">Asesor responsable</label>
              <select
                value={form.agent_id}
                onChange={(e) => set("agent_id", e.target.value)}
                className="w-full rounded-lg bg-cima-surface border border-cima-border px-3 py-2.5 text-sm text-cima-text focus:outline-none focus:border-cima-gold/50 transition-colors"
              >
                <option value="">Sin asignar</option>
                {agentes.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="rounded-xl border border-cima-border bg-cima-card p-6 space-y-4">
          <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">Estado</p>
          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <label className="block text-xs font-medium text-cima-text-muted mb-1.5">Estado de publicación</label>
              <select value={form.status} onChange={(e) => set("status", e.target.value)}
                className="rounded-lg bg-cima-surface border border-cima-border px-3 py-2.5 text-sm text-cima-text focus:outline-none focus:border-cima-gold/50 transition-colors">
                {STATUS_OPTS.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>
            </div>
            <label className="flex items-center gap-2.5 cursor-pointer mt-4">
              <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)}
                className="h-4 w-4 rounded border-cima-border bg-cima-surface accent-cima-gold cursor-pointer" />
              <span className="text-sm text-cima-text-muted">Destacar en inicio</span>
            </label>
          </div>

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
                  className="w-full rounded-lg bg-cima-surface border border-cima-border px-3 py-2.5 text-sm text-cima-text focus:outline-none focus:border-cima-gold/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-cima-text-muted mb-1.5">Fecha de cierre</label>
                <input
                  type="date"
                  value={form.sold_at}
                  onChange={(e) => set("sold_at", e.target.value)}
                  className="w-full rounded-lg bg-cima-surface border border-cima-border px-3 py-2.5 text-sm text-cima-text focus:outline-none focus:border-cima-gold/50 transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-cima-text-muted mb-1.5">Notas internas (no visibles al público)</label>
            <textarea value={form.agent_notes} onChange={(e) => set("agent_notes", e.target.value)} rows={2}
              placeholder="Notas del agente…"
              className="w-full rounded-lg bg-cima-surface border border-cima-border px-3 py-2.5 text-sm text-cima-text placeholder-cima-text-dim focus:outline-none focus:border-cima-gold/50 transition-colors resize-none" />
          </div>
        </div>

        {/* Photos */}
        <div className="rounded-xl border border-cima-border bg-cima-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">Fotos</p>
            <span className="text-[10px] text-cima-text-dim font-mono">{totalPhotos} fotos</span>
          </div>

          {/* Existing photos */}
          {existingPhotos.length > 0 && (
            <div>
              <p className="text-xs text-cima-text-muted mb-2">Fotos actuales</p>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {existingPhotos.map((photo) => (
                  <div key={photo.id} className="relative group aspect-square rounded-lg overflow-hidden border border-cima-border bg-cima-surface">
                    <Image src={photo.url} alt="" fill className="object-cover" />
                    {photo.is_cover && (
                      <div className="absolute bottom-0 left-0 right-0 bg-cima-gold/90 text-center py-0.5">
                        <span className="font-mono text-[8px] text-cima-bg uppercase">Portada</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                      {!photo.is_cover && (
                        <button type="button" onClick={() => setCover(photo)}
                          className="p-1.5 rounded-lg bg-cima-gold/90 text-cima-bg hover:bg-cima-gold transition-colors" title="Hacer portada">
                          <Check className="h-3 w-3" />
                        </button>
                      )}
                      <button type="button" onClick={() => deleteExistingPhoto(photo)}
                        disabled={deletingPhoto === photo.id}
                        className="p-1.5 rounded-lg bg-red-500/90 text-white hover:bg-red-500 disabled:opacity-50 transition-colors">
                        {deletingPhoto === photo.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add new photos */}
          <button type="button" onClick={() => fileInputRef.current?.click()}
            className="w-full rounded-xl border-2 border-dashed border-cima-border hover:border-cima-gold/40 bg-cima-surface/30 hover:bg-cima-gold/5 transition-colors py-6 flex flex-col items-center gap-2 group">
            <ImagePlus className="h-5 w-5 text-cima-gold" />
            <p className="text-xs font-medium text-cima-text">Agregar más fotos</p>
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
            onChange={(e) => handleFiles(e.target.files)} />

          {/* New photo previews */}
          {newPhotos.length > 0 && (
            <div>
              <p className="text-xs text-cima-text-muted mb-2">Fotos nuevas por subir</p>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {newPhotos.map((p, i) => (
                  <div key={p.previewUrl} className="relative group aspect-square rounded-lg overflow-hidden border border-cima-gold/30 bg-cima-surface">
                    <Image src={p.previewUrl} alt="" fill className="object-cover" />
                    <button type="button" onClick={() => removeNewPhoto(i)}
                      className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="h-3 w-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Documents — only shown when a propietario is assigned */}
        {form.propietario_id && (
          <div className="rounded-xl border border-cima-border bg-cima-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">Documentos del propietario</p>
              <span className="text-[10px] text-cima-text-dim font-mono">{docs.length} docs</span>
            </div>

            {docs.length > 0 && (
              <div className="space-y-2">
                {docs.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-3 rounded-lg border border-cima-border bg-cima-surface px-3 py-2.5">
                    <FileText className="h-4 w-4 text-cima-text-dim shrink-0" />
                    <p className="text-sm text-cima-text truncate flex-1">{doc.name}</p>
                    <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-mono border shrink-0 ${DOC_TYPE_COLORS[doc.type] ?? DOC_TYPE_COLORS.other}`}>
                      {DOC_TYPE_LABELS[doc.type] ?? doc.type}
                    </span>
                    <a href={doc.url} target="_blank" rel="noreferrer"
                      className="p-1 rounded text-cima-text-dim hover:text-cima-gold transition-colors shrink-0" title="Descargar">
                      <Download className="h-3.5 w-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            )}

            <button type="button" onClick={() => docFileInputRef.current?.click()} disabled={uploadingDoc}
              className="w-full rounded-xl border-2 border-dashed border-cima-border hover:border-cima-gold/40 bg-cima-surface/30 hover:bg-cima-gold/5 transition-colors py-5 flex flex-col items-center gap-2 disabled:opacity-50">
              {uploadingDoc
                ? <><Loader2 className="h-5 w-5 animate-spin text-cima-gold" /><p className="text-xs font-medium text-cima-text">Subiendo documento…</p></>
                : <><FileUp className="h-5 w-5 text-cima-gold" /><p className="text-xs font-medium text-cima-text">Subir documento (PDF, DOCX, etc.)</p></>
              }
            </button>
            <input ref={docFileInputRef} type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp" multiple className="hidden"
              onChange={(e) => handleDocUpload(e.target.files)} />
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
        )}

        <div className="flex items-center gap-3 pb-8">
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cima-gold text-cima-bg text-sm font-semibold hover:bg-cima-gold-light disabled:opacity-60 transition-colors">
            {saving ? <><Loader2 className="h-4 w-4 animate-spin" />{uploadProgress ?? "Guardando…"}</> : <><Building2 className="h-4 w-4" />Guardar cambios</>}
          </button>
          <Link href="/admin/propiedades" className="px-5 py-2.5 rounded-lg border border-cima-border text-sm text-cima-text-muted hover:bg-cima-surface transition-colors">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
