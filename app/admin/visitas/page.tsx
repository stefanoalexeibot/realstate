"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Calendar, Phone, Loader2, MessageSquare, Check } from "lucide-react";
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
  pending:   { label: "Pendiente",  color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  confirmed: { label: "Confirmada", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  done:      { label: "Realizada",  color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  cancelled: { label: "Cancelada",  color: "bg-red-500/10 text-red-400 border-red-500/20" },
};

type VisitRow = {
  id: string;
  name: string;
  phone: string;
  status: VisitStatus;
  created_at: string;
  preferred_date: string | null;
  agent_notes: string | null;
  re_properties: { title: string; neighborhood: string | null } | null;
};

export default function VisitasAdmin() {
  const [visits, setVisits] = useState<VisitRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("re_visits")
      .select("id, name, phone, status, created_at, preferred_date, agent_notes, re_properties(title, neighborhood)")
      .order("created_at", { ascending: false });
    setVisits((data ?? []) as unknown as VisitRow[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

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

  function startEditNote(v: VisitRow) {
    setEditingNote(v.id);
    setNoteText(v.agent_notes ?? "");
  }

  async function saveNote(id: string) {
    setSavingNote(true);
    const supabase = createClient();
    await supabase.from("re_visits").update({ agent_notes: noteText.trim() || null }).eq("id", id);
    setVisits((prev) => prev.map((v) => v.id === id ? { ...v, agent_notes: noteText.trim() || null } : v));
    setEditingNote(null);
    setSavingNote(false);
  }

  const total     = visits.length;
  const pending   = visits.filter((v) => v.status === "pending").length;
  const confirmed = visits.filter((v) => v.status === "confirmed").length;

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-cima-gold" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl space-y-6">
      <div>
        <p className="font-mono text-[10px] tracking-[0.2em] text-cima-gold uppercase mb-1">Módulo</p>
        <h1 className="font-heading font-bold text-2xl text-cima-text">Visitas</h1>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total solicitudes", value: total,     color: "text-cima-text" },
          { label: "Pendientes",        value: pending,   color: "text-amber-400" },
          { label: "Confirmadas",       value: confirmed, color: "text-blue-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-cima-border bg-cima-card p-5">
            <p className={`font-heading font-bold text-3xl leading-none ${s.color} mb-1`}>{s.value}</p>
            <p className="text-xs text-cima-text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      {visits.length === 0 ? (
        <div className="rounded-xl border border-cima-border bg-cima-card p-16 text-center">
          <Calendar className="h-8 w-8 text-cima-text-dim mx-auto mb-3" />
          <p className="text-cima-text-muted">Sin solicitudes de visita aún.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-cima-border bg-cima-card overflow-hidden">
          <div className="hidden sm:grid grid-cols-[1fr_1fr_120px_120px_200px] gap-4 px-5 py-3 border-b border-cima-border bg-cima-bg">
            {["Contacto", "Propiedad", "Fecha pref.", "Registrado", "Acciones"].map((h) => (
              <p key={h} className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">{h}</p>
            ))}
          </div>
          <div className="divide-y divide-cima-border">
            {visits.map((v) => {
              const st = STATUS_LABELS[v.status] ?? STATUS_LABELS.pending;
              const isUpdating = updating === v.id;
              const isEditingThisNote = editingNote === v.id;

              return (
                <div key={v.id} className="px-5 py-4 hover:bg-cima-surface/30 transition-colors">
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_120px_120px_200px] gap-3 sm:gap-4 items-start sm:items-center">
                    {/* Contact */}
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-cima-text">{v.name}</p>
                      <p className="text-xs text-cima-text-muted">{v.phone}</p>
                    </div>

                    {/* Property */}
                    <div className="min-w-0">
                      <p className="text-xs text-cima-text-muted truncate">{v.re_properties?.title ?? "—"}</p>
                      <p className="text-[10px] text-cima-text-dim">{v.re_properties?.neighborhood ?? ""}</p>
                    </div>

                    {/* Preferred date */}
                    <p className="text-xs text-cima-text-muted">{v.preferred_date ?? "—"}</p>

                    {/* Created */}
                    <div>
                      <p className="text-xs text-cima-text-muted">{formatDate(v.created_at)}</p>
                      <p className="text-[10px] text-cima-text-dim mt-0.5">{timeAgo(v.created_at)}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-mono border ${st.color}`}>
                        {st.label}
                      </span>

                      {v.status === "pending" && (
                        <>
                          <button
                            onClick={() => updateStatus(v.id, "confirmed")}
                            disabled={isUpdating}
                            className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 disabled:opacity-50 transition-colors"
                          >
                            {isUpdating ? "…" : "Confirmar"}
                          </button>
                          <button
                            onClick={() => updateStatus(v.id, "cancelled")}
                            disabled={isUpdating}
                            className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 disabled:opacity-50 transition-colors"
                          >
                            Cancelar
                          </button>
                        </>
                      )}
                      {v.status === "confirmed" && (
                        <button
                          onClick={() => updateStatus(v.id, "done")}
                          disabled={isUpdating}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-50 transition-colors"
                        >
                          {isUpdating ? "…" : "Realizada"}
                        </button>
                      )}

                      <a
                        href={`https://wa.me/52${v.phone.replace(/\D/g, "")}?text=Hola ${encodeURIComponent(v.name)}, te contactamos de Cima para confirmar tu visita`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] text-[10px] hover:bg-[#25D366]/20 transition-colors"
                      >
                        <Phone className="h-2.5 w-2.5" />
                        WA
                      </a>

                      {/* Note button */}
                      <button
                        onClick={() => isEditingThisNote ? setEditingNote(null) : startEditNote(v)}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] border transition-colors ${
                          v.agent_notes
                            ? "bg-cima-gold/10 border-cima-gold/20 text-cima-gold hover:bg-cima-gold/20"
                            : "bg-cima-surface border-cima-border text-cima-text-dim hover:text-cima-text"
                        }`}
                      >
                        <MessageSquare className="h-2.5 w-2.5" />
                        {v.agent_notes ? "Nota" : "Agregar nota"}
                      </button>
                    </div>
                  </div>

                  {/* Inline note editor */}
                  {isEditingThisNote && (
                    <div className="mt-3 flex gap-2 items-end">
                      <textarea
                        autoFocus
                        rows={2}
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Nota para el propietario (ej: Al comprador le interesó pero negoció precio)…"
                        className="flex-1 rounded-lg bg-cima-surface border border-cima-border px-3 py-2 text-xs text-cima-text placeholder-cima-text-dim focus:outline-none focus:border-cima-gold/50 resize-none transition-colors"
                      />
                      <button
                        onClick={() => saveNote(v.id)}
                        disabled={savingNote}
                        className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cima-gold text-cima-bg text-xs font-semibold hover:bg-cima-gold-light disabled:opacity-60 transition-colors"
                      >
                        {savingNote ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                        Guardar
                      </button>
                    </div>
                  )}

                  {/* Show note read-only when not editing */}
                  {!isEditingThisNote && v.agent_notes && (
                    <div className="mt-2 flex items-start gap-2 rounded-lg bg-cima-gold/5 border border-cima-gold/15 px-3 py-2">
                      <MessageSquare className="h-3 w-3 text-cima-gold mt-0.5 shrink-0" />
                      <p className="text-xs text-cima-text-muted">{v.agent_notes}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
