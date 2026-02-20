"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Camera, ImagePlus, X, Loader2, Trash2, Check, GripVertical } from "lucide-react";
import Image from "next/image";

type Photo = { id: string; url: string; order: number; is_cover: boolean };

export default function PortalFotos() {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [propertyId, setPropertyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savingOrder, setSavingOrder] = useState(false);

  // Drag state
  const dragIndex = useRef<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { data: prop } = await supabase
      .from("re_propietarios")
      .select("id")
      .eq("auth_id", user.id)
      .single();
    if (!prop) { setLoading(false); return; }

    const { data: property } = await supabase
      .from("re_properties")
      .select("id")
      .eq("propietario_id", prop.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    if (!property) { setLoading(false); return; }

    setPropertyId(property.id);

    const { data: photoData } = await supabase
      .from("re_photos")
      .select("*")
      .eq("property_id", property.id)
      .order("order");
    setPhotos((photoData ?? []) as Photo[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  async function handleFiles(files: FileList | null) {
    if (!files || !propertyId) return;
    setUploading(true);
    setError(null);
    const maxOrder = photos.length ? Math.max(...photos.map((p) => p.order)) + 1 : 0;

    try {
      const newPhotos: Photo[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith("image/")) continue;
        setUploadMsg(`Subiendo foto ${i + 1} de ${files.length}…`);
        const ext = file.name.split(".").pop();
        const path = `properties/${propertyId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { data: uploaded, error: uploadErr } = await supabase.storage
          .from("cima-photos")
          .upload(path, file, { cacheControl: "3600", upsert: false });
        if (uploadErr) throw uploadErr;
        const { data: { publicUrl } } = supabase.storage.from("cima-photos").getPublicUrl(uploaded.path);
        const order = maxOrder + i;
        const isCover = photos.length === 0 && i === 0;
        const { data: photoRow, error: insertErr } = await supabase
          .from("re_photos")
          .insert({ property_id: propertyId, url: publicUrl, order, is_cover: isCover })
          .select()
          .single();
        if (insertErr) throw insertErr;
        newPhotos.push(photoRow as Photo);

        if (isCover) {
          await supabase.from("re_properties").update({ cover_photo: publicUrl }).eq("id", propertyId);
        }
      }
      setPhotos((prev) => [...prev, ...newPhotos]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al subir fotos");
    } finally {
      setUploading(false);
      setUploadMsg(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDelete(photo: Photo) {
    if (!confirm("¿Eliminar esta foto?")) return;
    setDeleting(photo.id);
    try {
      const url = new URL(photo.url);
      const storagePath = url.pathname.split("/object/public/cima-photos/")[1];
      if (storagePath) {
        await supabase.storage.from("cima-photos").remove([storagePath]);
      }
      await supabase.from("re_photos").delete().eq("id", photo.id);
      const remaining = photos.filter((p) => p.id !== photo.id);
      setPhotos(remaining);

      if (photo.is_cover && remaining.length > 0 && propertyId) {
        const newCover = remaining[0];
        await supabase.from("re_photos").update({ is_cover: true }).eq("id", newCover.id);
        await supabase.from("re_properties").update({ cover_photo: newCover.url }).eq("id", propertyId);
        setPhotos((prev) => prev.map((p) => p.id === newCover.id ? { ...p, is_cover: true } : p));
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al eliminar");
    } finally {
      setDeleting(null);
    }
  }

  async function setCover(photo: Photo) {
    if (!propertyId || photo.is_cover) return;
    try {
      await supabase.from("re_photos").update({ is_cover: false }).eq("property_id", propertyId);
      await supabase.from("re_photos").update({ is_cover: true }).eq("id", photo.id);
      await supabase.from("re_properties").update({ cover_photo: photo.url }).eq("id", propertyId);
      setPhotos((prev) => prev.map((p) => ({ ...p, is_cover: p.id === photo.id })));
    } catch {
      setError("Error al actualizar portada");
    }
  }

  // ─── Drag & drop handlers ──────────────────────────────────────────────────

  function onDragStart(idx: number) {
    dragIndex.current = idx;
  }

  function onDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault();
    setDragOver(idx);
  }

  function onDragLeave() {
    setDragOver(null);
  }

  async function onDrop(dropIdx: number) {
    setDragOver(null);
    const fromIdx = dragIndex.current;
    if (fromIdx === null || fromIdx === dropIdx) { dragIndex.current = null; return; }

    const reordered = [...photos];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(dropIdx, 0, moved);

    // Assign new sequential order values
    const updated = reordered.map((p, i) => ({ ...p, order: i }));
    setPhotos(updated);
    dragIndex.current = null;

    // Persist to DB
    setSavingOrder(true);
    try {
      await Promise.all(
        updated.map((p) =>
          supabase.from("re_photos").update({ order: p.order }).eq("id", p.id)
        )
      );
      // Update cover_photo on property to match the first photo (order 0)
      const coverPhoto = updated.find((p) => p.is_cover) ?? updated[0];
      if (propertyId && coverPhoto) {
        await supabase.from("re_properties").update({ cover_photo: coverPhoto.url }).eq("id", propertyId);
      }
    } catch {
      setError("Error al guardar el orden");
      load(); // reload original order on error
    } finally {
      setSavingOrder(false);
    }
  }

  // ──────────────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-cima-gold" />
      </div>
    );
  }

  if (!propertyId) {
    return (
      <div className="rounded-2xl border border-cima-border bg-cima-card p-16 text-center">
        <Camera className="h-8 w-8 text-cima-text-dim mx-auto mb-3" />
        <p className="text-cima-text-muted">No tienes una propiedad vinculada aún.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="font-mono text-[10px] tracking-[0.2em] text-cima-gold uppercase mb-1">Galería</p>
        <h1 className="font-heading font-bold text-2xl text-cima-text">Fotos de tu propiedad</h1>
        <p className="text-sm text-cima-text-muted mt-1">
          {photos.length} foto{photos.length !== 1 ? "s" : ""} subida{photos.length !== 1 ? "s" : ""}.
          Las fotos con alta calidad atraen más compradores.
        </p>
      </div>

      {/* Upload area */}
      <div className="rounded-2xl border border-cima-border bg-cima-card p-6">
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="w-full rounded-xl border-2 border-dashed border-cima-border hover:border-cima-gold/40 bg-cima-surface/30 hover:bg-cima-gold/5 disabled:opacity-50 transition-colors py-8 flex flex-col items-center gap-3 group"
        >
          <div className="h-10 w-10 rounded-full bg-cima-gold/10 border border-cima-gold/20 flex items-center justify-center group-hover:bg-cima-gold/15 transition-colors">
            {uploading ? <Loader2 className="h-5 w-5 text-cima-gold animate-spin" /> : <ImagePlus className="h-5 w-5 text-cima-gold" />}
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-cima-text">
              {uploading ? uploadMsg ?? "Subiendo…" : "Agregar fotos"}
            </p>
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
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400 flex items-center justify-between">
          {error}
          <button onClick={() => setError(null)} className="ml-2 text-red-400/60 hover:text-red-400">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Photo grid */}
      {photos.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">
              Arrastra para reordenar · Clic en ✓ para portada
            </p>
            {savingOrder && (
              <span className="flex items-center gap-1.5 text-[10px] text-cima-text-dim">
                <Loader2 className="h-3 w-3 animate-spin" />
                Guardando orden…
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {photos.map((photo, idx) => (
              <div
                key={photo.id}
                draggable
                onDragStart={() => onDragStart(idx)}
                onDragOver={(e) => onDragOver(e, idx)}
                onDragLeave={onDragLeave}
                onDrop={() => onDrop(idx)}
                className={`relative group rounded-xl overflow-hidden border aspect-video bg-cima-surface cursor-grab active:cursor-grabbing transition-all ${
                  dragOver === idx
                    ? "border-cima-gold/60 scale-[0.97] ring-2 ring-cima-gold/30"
                    : "border-cima-border"
                }`}
              >
                <Image src={photo.url} alt="" fill className="object-cover pointer-events-none" />

                {/* Drag handle */}
                <div className="absolute top-2 right-2 p-1 rounded bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="h-3.5 w-3.5 text-white" />
                </div>

                {/* Cover badge */}
                {photo.is_cover && (
                  <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-cima-gold/90 backdrop-blur-sm">
                    <Check className="h-2.5 w-2.5 text-cima-bg" />
                    <span className="font-mono text-[9px] text-cima-bg uppercase">Portada</span>
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  {!photo.is_cover && (
                    <button
                      onClick={() => setCover(photo)}
                      className="p-2 rounded-lg bg-cima-gold/90 text-cima-bg hover:bg-cima-gold transition-colors"
                      title="Establecer como portada"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(photo)}
                    disabled={deleting === photo.id}
                    className="p-2 rounded-lg bg-red-500/90 text-white hover:bg-red-500 disabled:opacity-50 transition-colors"
                    title="Eliminar foto"
                  >
                    {deleting === photo.id
                      ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      : <Trash2 className="h-3.5 w-3.5" />
                    }
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {photos.length === 0 && !uploading && (
        <div className="rounded-2xl border border-cima-border bg-cima-card p-12 text-center">
          <Camera className="h-8 w-8 text-cima-text-dim mx-auto mb-3" />
          <p className="font-medium text-cima-text mb-1">Sin fotos aún</p>
          <p className="text-sm text-cima-text-muted">Las propiedades con fotos reciben 3× más solicitudes de visita.</p>
        </div>
      )}
    </div>
  );
}
