"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Calendar, Phone, Loader2, MessageSquare, Check,
  Camera, ImagePlus, X, ZoomIn, Star, AlertCircle,
  Trash2, Home, MapPin, CheckCircle2, Plus
} from "lucide-react";
import type { VisitStatus } from "@/lib/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("es-MX", {
    timeZone: "America/Monterrey",
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `Hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Hace ${hrs}h`;
  return `Hace ${Math.floor(hrs / 24)}d`;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "Pendiente", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  confirmed: { label: "Confirmada", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  done: { label: "Realizada", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  cancelled: { label: "Cancelada", color: "bg-red-500/10 text-red-400 border-red-500/20" },
};

const FEEDBACK_TAGS = [
  "Precio alto", "Precio justo", "Le encantó", "Lo pensará",
  "Zona ruidosa", "Buena zona", "Requiere remodelar", "Excelente estado",
  "Falta espacio", "Muy amplio"
];

type VisitPhoto = { id: string; url: string; created_at: string };

type VisitRow = {
  id: string;
  name: string;
  phone: string;
  status: VisitStatus;
  created_at: string;
  preferred_date: string | null;
  agent_notes: string | null;
  interest_level: number | null;
  feedback_tags: string[] | null;
  re_properties: {
    id: string;
    title: string;
    neighborhood: string | null;
    slug: string;
    cover_photo: string | null;
  } | null;
};

export default function VisitasAdmin() {
  const [visits, setVisits] = useState<VisitRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [savingNote, setSavingNote] = useState(false);

  // Photo states
  const [visitPhotos, setVisitPhotos] = useState<Record<string, VisitPhoto[]>>({});
  const [uploadingPhoto, setUploadingPhoto] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Manual visit modal
  const [showNewModal, setShowNewModal] = useState(false);
  const [properties, setProperties] = useState<{ id: string, title: string, neighborhood: string }[]>([]);
  const [newVisit, setNewVisit] = useState({
    property_id: "", name: "", phone: "", email: "", preferred_date: "",
  });
  const [savingNew, setSavingNew] = useState(false);
  const [newError, setNewError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const supabase = createClient();

      const { data, error } = await supabase
        .from("re_visits")
        .select(`
          id, name, phone, status, created_at, preferred_date, 
          agent_notes, interest_level, feedback_tags, 
          re_properties(id, title, neighborhood, slug, cover_photo)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Visits fetch error:", error);
        setVisits([]);
      } else {
        setVisits(data as unknown as VisitRow[]);
      }

      const { data: propsData } = await supabase
        .from("re_properties")
        .select("id, title, neighborhood")
        .eq("status", "active")
        .order("title");

      setProperties((propsData ?? []) as any);

    } catch (err) {
      console.error("Unexpected error in load():", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (visits.length === 0) return;
    Promise.all(
      visits.map((v) =>
        fetch(`/api/visit-photos?visit_id=${v.id}`)
          .then((r) => r.json())
          .then(({ photos }) => ({ id: v.id, photos: photos ?? [] }))
          .catch(() => ({ id: v.id, photos: [] }))
      )
    ).then((results) => {
      const map: Record<string, VisitPhoto[]> = {};
      results.forEach(({ id, photos }) => { map[id] = photos; });
      setVisitPhotos(map);
    });
  }, [visits]);

  async function deleteVisit(id: string) {
    if (!confirm("¿Estás seguro de eliminar esta visita?")) return;
    setUpdating(id);
    try {
      const res = await fetch(`/api/visitas/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar");
      setVisits((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      alert("No se pudo eliminar la visita.");
    } finally {
      setUpdating(null);
    }
  }

  async function updateStatus(id: string, status: VisitStatus) {
    setUpdating(id);
    try {
      await fetch(`/api/visitas/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setVisits((prev) => prev.map((v) => v.id === id ? { ...v, status } : v));
    } finally {
      setUpdating(null);
    }
  }

  async function saveNote(id: string) {
    setSavingNote(true);
    try {
      await fetch(`/api/visitas/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent_notes: noteText.trim() || null,
          interest_level: rating,
          feedback_tags: selectedTags
        }),
      });
      setVisits((prev) => prev.map((v) => v.id === id ? {
        ...v,
        agent_notes: noteText.trim() || null,
        interest_level: rating,
        feedback_tags: selectedTags
      } : v));
      setEditingNote(null);
    } finally {
      setSavingNote(false);
    }
  }

  async function handlePhotoUpload(visitId: string, files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploadingPhoto(visitId);
    try {
      const newPhotos: VisitPhoto[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith("image/")) continue;
        const fd = new FormData();
        fd.append("visit_id", visitId);
        fd.append("file", file);
        const res = await fetch("/api/visit-photos", { method: "POST", body: fd });
        const json = await res.json();
        if (res.ok && json.photo) newPhotos.push(json.photo);
      }
      setVisitPhotos((prev) => ({ ...prev, [visitId]: [...(prev[visitId] ?? []), ...newPhotos] }));
    } finally {
      setUploadingPhoto(null);
      const ref = fileRefs.current[visitId];
      if (ref) ref.value = "";
    }
  }

  async function saveManualVisit() {
    if (!newVisit.property_id || !newVisit.name || !newVisit.phone) return;
    setSavingNew(true);
    try {
      setNewError(null);
      const res = await fetch("/api/admin/visitas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVisit),
      });
      const data = await res.json();
      if (res.ok) {
        setShowNewModal(false);
        setNewVisit({ property_id: "", name: "", phone: "", email: "", preferred_date: "" });
        load();
      } else {
        setNewError(data.error || "Error al registrar la visita");
      }
    } catch (err) {
      setNewError("Error de conexión");
    } finally {
      setSavingNew(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-cima-gold" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-cima-text">Gestión de Visitas</h1>
          <p className="text-cima-text-dim text-sm mt-1">Administra las visitas y el feedback de tus propiedades.</p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cima-gold text-cima-bg text-sm font-bold hover:bg-cima-gold-light transition-all active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Registrar Visita Manual
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total", value: visits.length, color: "text-cima-text" },
          { label: "Pendientes", value: visits.filter(v => v.status === "pending").length, color: "text-amber-400" },
          { label: "Realizadas", value: visits.filter(v => v.status === "done").length, color: "text-emerald-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-cima-border bg-cima-card p-3 sm:p-5 text-center">
            <p className={`font-heading font-bold text-xl sm:text-3xl leading-none ${s.color} mb-1`}>{s.value}</p>
            <p className="text-[10px] sm:text-xs text-cima-text-muted uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      {visits.length === 0 ? (
        <div className="rounded-xl border border-cima-border bg-cima-card p-12 text-center">
          <Calendar className="h-8 w-8 text-cima-text-dim mx-auto mb-3" />
          <p className="text-cima-text-muted">Sin solicitudes de visita aún.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-cima-border bg-cima-card overflow-hidden">
          <div className="hidden sm:grid grid-cols-[1fr_1fr_120px_120px_200px] gap-4 px-5 py-3 border-b border-cima-border bg-cima-bg">
            {["Contacto", "Propiedad", "Día Pref.", "Registro", ""].map((h) => (
              <p key={h} className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">{h}</p>
            ))}
          </div>

          <div className="divide-y divide-cima-border">
            {visits.map((v) => {
              const st = STATUS_LABELS[v.status] ?? STATUS_LABELS.pending;
              const isUpdating = updating === v.id;
              const isEditingThisNote = editingNote === v.id;
              const photos = visitPhotos[v.id] ?? [];
              const isUploadingThisVisit = uploadingPhoto === v.id;
              const prop = v.re_properties;

              return (
                <div key={v.id} className="hover:bg-cima-surface/30 transition-colors">
                  {/* Desktop View */}
                  <div className="hidden sm:grid grid-cols-[1fr_1fr_120px_120px_200px] gap-4 px-5 py-4 items-center">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm text-cima-text truncate">{v.name}</p>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono border ${st.color}`}>{st.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-3 w-3 text-cima-text-dim" />
                        <p className="text-xs text-cima-text-muted">{v.phone}</p>
                      </div>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-start gap-1.5">
                        <Home className="h-3.5 w-3.5 text-cima-gold shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <p className="text-sm text-cima-text truncate">{prop?.title ?? "—"}</p>
                          <p className="text-xs text-cima-text-dim truncate">{prop?.neighborhood ?? "—"}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-cima-text-muted">{v.preferred_date ? formatDate(v.preferred_date) : "—"}</p>
                    </div>

                    <div>
                      <p className="text-xs text-cima-text-muted">{formatDate(v.created_at)}</p>
                      <p className="text-[10px] text-cima-text-dim mt-0.5">{timeAgo(v.created_at)}</p>
                    </div>

                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => updateStatus(v.id, "confirmed")} className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20"><CheckCircle2 className="h-4 w-4" /></button>
                      <button onClick={() => updateStatus(v.id, "done")} className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"><CheckCircle2 className="h-4 w-4" /></button>
                      <button onClick={() => { setEditingNote(v.id); setNoteText(v.agent_notes ?? ""); setSelectedTags(v.feedback_tags ?? []); setRating(v.interest_level); }} className="p-2 rounded-lg bg-cima-gold/10 border border-cima-gold/20 text-cima-gold hover:bg-cima-gold/20"><Plus className="h-4 w-4" /></button>
                      <button onClick={() => deleteVisit(v.id)} className="p-2 rounded-lg text-cima-text-dim hover:text-red-400 hover:bg-red-400/10"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>

                  {/* Mobile View */}
                  <div className="sm:hidden p-4 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-base text-cima-text truncate">{v.name}</p>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono border ${st.color}`}>{st.label}</span>
                        </div>
                        <p className="text-xs text-cima-text-muted">{v.phone}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[11px] font-bold text-cima-gold uppercase tracking-tight">Día Pref.</p>
                        <p className="text-[13px] font-bold text-cima-text">{v.preferred_date ? formatDate(v.preferred_date).split(",")[0] : "—"}</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-cima-surface/50 border border-cima-border/40">
                      <p className="font-medium text-xs text-cima-text truncate">{prop?.title ?? "Sin propiedad"}</p>
                      <p className="text-[10px] text-cima-text-dim truncate">{prop?.neighborhood ?? "—"}</p>
                    </div>

                    <div className="flex gap-2">
                      <button onClick={() => updateStatus(v.id, "confirmed")} className="flex-1 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold transition-all"><CheckCircle2 className="h-4 w-4 mx-auto mb-1" />Confirmar</button>
                      <button onClick={() => updateStatus(v.id, "done")} className="flex-1 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold transition-all"><CheckCircle2 className="h-4 w-4 mx-auto mb-1" />Realizada</button>
                    </div>

                    <div className="flex gap-2">
                      <button onClick={() => { setEditingNote(v.id); setNoteText(v.agent_notes ?? ""); setSelectedTags(v.feedback_tags ?? []); setRating(v.interest_level); }} className="flex-1 py-2.5 rounded-xl bg-cima-gold/10 border border-cima-gold/20 text-cima-gold text-xs font-bold"><Plus className="h-4 w-4 mx-auto mb-1" />Notas / Fotos</button>
                      <button onClick={() => deleteVisit(v.id)} className="px-4 rounded-xl bg-cima-surface border border-cima-border text-red-400"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>

                  {/* Note Editor */}
                  {isEditingThisNote && (
                    <div className="m-4 p-4 rounded-xl border border-cima-gold/30 bg-cima-gold/5 space-y-4 shadow-inner">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-cima-gold uppercase tracking-widest">Detalle de Visita</h3>
                        <button onClick={() => setEditingNote(null)}><X className="h-4 w-4 text-cima-text-dim" /></button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-[10px] font-mono text-cima-text-dim uppercase mb-2">Interés</p>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(s => (
                              <button key={s} onClick={() => setRating(s)} className={`p-1 ${rating && rating >= s ? "text-cima-gold" : "text-cima-text-dim"}`}><Star className={`h-6 w-6 ${rating && rating >= s ? "fill-current" : ""}`} /></button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-[10px] font-mono text-cima-text-dim uppercase mb-2">Feedback</p>
                          <div className="flex flex-wrap gap-1.5">
                            {FEEDBACK_TAGS.map(t => {
                              const active = selectedTags.includes(t);
                              return <button key={t} onClick={() => setSelectedTags(prev => active ? prev.filter(x => x !== t) : [...prev, t])} className={`px-2.5 py-1 rounded-full text-[10px] border ${active ? "bg-cima-gold border-cima-gold text-cima-bg" : "border-cima-border text-cima-text-muted"}`}>{t}</button>
                            })}
                          </div>
                        </div>

                        <textarea value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Agrega un comentario..." className="w-full h-24 rounded-lg bg-cima-surface border border-cima-border p-3 text-xs text-white focus:outline-none focus:border-cima-gold/50" />

                        <div className="flex gap-2">
                          <button onClick={() => saveNote(v.id)} disabled={savingNote} className="flex-1 py-3 rounded-xl bg-cima-gold text-cima-bg text-sm font-bold flex items-center justify-center gap-2">{savingNote ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Guardar Cambios</button>
                          <button onClick={() => fileRefs.current[v.id]?.click()} className="px-4 rounded-xl bg-cima-surface border border-cima-border text-cima-gold leading-none flex items-center justify-center"><Camera className="h-5 w-5" /></button>
                          <input type="file" multiple className="hidden" ref={el => { fileRefs.current[v.id] = el; }} onChange={e => handlePhotoUpload(v.id, e.target.files)} />
                        </div>
                      </div>

                      {photos.length > 0 && (
                        <div className="pt-4 border-t border-cima-border/30">
                          <p className="text-[10px] font-mono text-cima-text-dim uppercase mb-3 flex items-center gap-2 text-cima-gold"><ImagePlus className="h-3.5 w-3.5" /> Evidencias ({photos.length})</p>
                          <div className="flex flex-wrap gap-2">
                            {photos.map(p => (
                              <div key={p.id} className="relative h-16 w-16 min-w-[64px] rounded-lg overflow-hidden group">
                                <img src={p.url} alt="" className="h-full w-full object-cover" />
                                <button onClick={() => setLightbox(p.url)} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><ZoomIn className="h-4 w-4 text-white" /></button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {!isEditingThisNote && (v.agent_notes || v.interest_level || (v.feedback_tags && v.feedback_tags.length > 0)) && (
                    <div className="px-4 py-3 bg-cima-gold/5 border-t border-cima-gold/10 flex flex-col gap-2">
                      <div className="flex gap-2 items-center flex-wrap">
                        {v.interest_level && <div className="flex gap-0.5 text-cima-gold">{[1, 2, 3, 4, 5].map(s => <Star key={s} className={`h-2.5 w-2.5 ${v.interest_level && v.interest_level >= s ? "fill-current" : "opacity-20"}`} />)}</div>}
                        {v.feedback_tags?.map(t => <span key={t} className="px-1.5 py-0.5 rounded-full bg-cima-surface text-[9px] text-cima-text-dim border border-cima-border">{t}</span>)}
                      </div>
                      {v.agent_notes && <p className="text-xs text-cima-text-muted italic">"{v.agent_notes}"</p>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 animate-in fade-in duration-300" onClick={() => setLightbox(null)}>
          <button className="absolute top-6 right-6 p-3 text-white/50 hover:text-white"><X className="h-8 w-8" /></button>
          <img src={lightbox} alt="" className="max-w-full max-h-full rounded-lg shadow-2xl scale-in-95" />
        </div>
      )}

      {/* Manual Visit Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-cima-border bg-cima-card p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading font-bold text-lg text-cima-text">Nueva Visita Manual</h3>
              <button onClick={() => { setShowNewModal(false); setNewError(null); }} className="p-2 text-cima-text-dim hover:text-cima-text"><X className="h-5 w-5" /></button>
            </div>
            {newError && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2"><AlertCircle className="h-4 w-4" />{newError}</div>}
            <div className="space-y-4">
              <div><label className="block text-xs font-medium text-cima-text-muted mb-1.5">Propiedad *</label><select value={newVisit.property_id} onChange={e => setNewVisit(v => ({ ...v, property_id: e.target.value }))} className="w-full rounded-lg bg-cima-surface border border-cima-border px-3 py-2 text-sm text-cima-text focus:outline-none focus:border-cima-gold/50"><option value="">Selecciona propiedad</option>{properties.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}</select></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium text-cima-text-muted mb-1.5">Nombre *</label><input value={newVisit.name} onChange={e => setNewVisit(v => ({ ...v, name: e.target.value }))} className="w-full rounded-lg bg-cima-surface border border-cima-border px-3 py-2 text-sm text-cima-text" /></div>
                <div><label className="block text-xs font-medium text-cima-text-muted mb-1.5">Teléfono *</label><input value={newVisit.phone} onChange={e => setNewVisit(v => ({ ...v, phone: e.target.value }))} className="w-full rounded-lg bg-cima-surface border border-cima-border px-3 py-2 text-sm text-cima-text" /></div>
              </div>
              <div>
                <label className="block text-xs font-medium text-cima-text-muted mb-1.5">Fecha de Visita</label>
                <input
                  type="date"
                  value={newVisit.preferred_date}
                  onChange={e => setNewVisit(v => ({ ...v, preferred_date: e.target.value }))}
                  className="w-full rounded-lg bg-cima-surface border border-cima-border px-3 py-2 text-sm text-cima-text focus:outline-none focus:border-cima-gold/50"
                />
              </div>
              <button onClick={saveManualVisit} disabled={savingNew} className="w-full py-3 rounded-xl bg-cima-gold text-cima-bg font-bold flex items-center justify-center gap-2">{savingNew ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
