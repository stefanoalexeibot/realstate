"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Users2, Plus, Loader2, Phone, Mail, Check, X, Edit2, Trash2 } from "lucide-react";

type Agente = {
  id: string;
  auth_id: string | null;
  name: string;
  phone: string | null;
  email: string | null;
  specialty: "venta" | "renta" | "both";
  active: boolean;
  created_at: string;
  _props?: number;
  _closed?: number;
};

type Profile = { id: string; role: string; full_name: string | null };

const SPECIALTY_LABELS = { venta: "Venta", renta: "Renta", both: "Venta + Renta" };
const SPECIALTY_COLORS: Record<string, string> = {
  venta: "bg-cima-gold/10 text-cima-gold border-cima-gold/20",
  renta: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  both: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

const EMPTY: { auth_id: string; name: string; phone: string; email: string; specialty: "venta" | "renta" | "both" } = { auth_id: "", name: "", phone: "", email: "", specialty: "both" };

export default function AgentesPage() {
  const [agentes, setAgentes] = useState<Agente[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Agente | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data: ag } = await supabase.from("re_agentes").select("*").order("name");
    const { data: props } = await supabase.from("re_properties").select("agent_id, status");

    const res = await fetch("/api/admin/people");
    const json = await res.json();
    setProfiles(json.authProfiles ?? []);

    const agWithStats = (ag ?? []).map((a) => ({
      ...a,
      _props: props?.filter((p) => p.agent_id === a.id && p.status === "active").length ?? 0,
      _closed: props?.filter((p) => p.agent_id === a.id && ["sold", "rented"].includes(p.status)).length ?? 0,
    }));
    setAgentes(agWithStats as Agente[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  function openNew() {
    setEditing(null);
    setForm(EMPTY);
    setError(null);
    setShowForm(true);
  }

  function openEdit(a: Agente) {
    setEditing(a);
    setForm({ auth_id: a.auth_id ?? "", name: a.name, phone: a.phone ?? "", email: a.email ?? "", specialty: a.specialty });
    setError(null);
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    setError(null);
    const supabase = createClient();
    try {
      const payload = {
        name: form.name.trim(),
        auth_id: form.auth_id || null,
        phone: form.phone.trim() || null,
        email: form.email.trim() || null,
        specialty: form.specialty,
      };
      if (editing) {
        const { error: err } = await supabase.from("re_agentes").update(payload).eq("id", editing.id);
        if (err) throw err;
      } else {
        const { error: err } = await supabase.from("re_agentes").insert(payload);
        if (err) throw err;
      }
      setShowForm(false);
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(a: Agente) {
    const supabase = createClient();
    await supabase.from("re_agentes").update({ active: !a.active }).eq("id", a.id);
    setAgentes((prev) => prev.map((x) => x.id === a.id ? { ...x, active: !a.active } : x));
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este agente? Las propiedades asignadas quedarán sin agente.")) return;
    setDeleting(id);
    const supabase = createClient();
    await supabase.from("re_agentes").delete().eq("id", id);
    setAgentes((prev) => prev.filter((a) => a.id !== id));
    setDeleting(null);
  }

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-cima-gold" />
    </div>
  );

  const active = agentes.filter((a) => a.active);
  const totalProps = agentes.reduce((s, a) => s + (a._props ?? 0), 0);
  const totalClosed = agentes.reduce((s, a) => s + (a._closed ?? 0), 0);

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <p className="font-mono text-[10px] tracking-[0.2em] text-cima-gold uppercase mb-1">Equipo</p>
          <h1 className="font-heading font-bold text-2xl text-cima-text flex items-center gap-2.5">
            <Users2 className="h-5 w-5 text-cima-gold" />
            Agentes
          </h1>
          <p className="text-sm text-cima-text-muted mt-1">Asesores inmobiliarios del equipo.</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-cima-gold text-cima-bg text-sm font-semibold hover:bg-cima-gold-light transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          Nuevo agente
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Agentes activos", value: active.length, color: "text-cima-gold" },
          { label: "Propiedades activas", value: totalProps, color: "text-emerald-400" },
          { label: "Operaciones cerradas", value: totalClosed, color: "text-blue-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-cima-border bg-cima-card p-5">
            <p className={`font-heading font-bold text-3xl leading-none ${s.color} mb-1`}>{s.value}</p>
            <p className="text-xs text-cima-text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      {/* List */}
      {agentes.length === 0 ? (
        <div className="rounded-xl border border-cima-border bg-cima-card p-16 text-center">
          <Users2 className="h-8 w-8 text-cima-text-dim mx-auto mb-3" />
          <p className="text-cima-text-muted mb-4">Sin agentes registrados.</p>
          <button onClick={openNew} className="px-4 py-2 rounded-lg bg-cima-gold text-cima-bg text-sm font-semibold">
            Agregar primer agente
          </button>
        </div>
      ) : (
        <div className="rounded-xl border border-cima-border bg-cima-card overflow-hidden">
          <div className="hidden sm:grid grid-cols-[1fr_1fr_100px_80px_80px_80px] gap-4 px-5 py-3 border-b border-cima-border bg-cima-bg">
            {["Nombre", "Contacto", "Especialidad", "Activas", "Cerradas", ""].map((h) => (
              <p key={h} className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">{h}</p>
            ))}
          </div>
          <div className="divide-y divide-cima-border">
            {agentes.map((a) => (
              <div key={a.id} className={`grid grid-cols-1 sm:grid-cols-[1fr_1fr_100px_80px_80px_80px] gap-3 sm:gap-4 px-5 py-4 items-center hover:bg-cima-surface/20 transition-colors ${!a.active ? "opacity-50" : ""}`}>
                {/* Name */}
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 shrink-0 rounded-full bg-cima-gold/10 border border-cima-gold/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-cima-gold">{a.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-cima-text">{a.name}</p>
                    {!a.active && <span className="font-mono text-[9px] text-cima-text-dim">Inactivo</span>}
                  </div>
                </div>

                {/* Contact */}
                <div className="space-y-0.5">
                  {a.phone && (
                    <a href={`tel:${a.phone}`} className="flex items-center gap-1.5 text-xs text-cima-text-muted hover:text-cima-gold transition-colors">
                      <Phone className="h-3 w-3" />{a.phone}
                    </a>
                  )}
                  {a.email && (
                    <a href={`mailto:${a.email}`} className="flex items-center gap-1.5 text-xs text-cima-text-muted hover:text-cima-gold transition-colors truncate">
                      <Mail className="h-3 w-3" />{a.email}
                    </a>
                  )}
                </div>

                {/* Specialty */}
                <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-mono border w-fit ${SPECIALTY_COLORS[a.specialty]}`}>
                  {SPECIALTY_LABELS[a.specialty]}
                </span>

                {/* Active props */}
                <p className="font-mono text-sm font-bold text-cima-text">{a._props ?? 0}</p>

                {/* Closed */}
                <p className="font-mono text-sm font-bold text-emerald-400">{a._closed ?? 0}</p>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button onClick={() => toggleActive(a)} title={a.active ? "Desactivar" : "Activar"}
                    className="p-1.5 rounded-lg text-cima-text-dim hover:bg-cima-surface hover:text-cima-text transition-colors">
                    {a.active ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <X className="h-3.5 w-3.5" />}
                  </button>
                  <button onClick={() => openEdit(a)} className="p-1.5 rounded-lg text-cima-text-dim hover:bg-cima-surface hover:text-cima-gold transition-colors">
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => handleDelete(a.id)} disabled={deleting === a.id}
                    className="p-1.5 rounded-lg text-cima-text-dim hover:bg-cima-surface hover:text-red-400 disabled:opacity-50 transition-colors">
                    {deleting === a.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-cima-border bg-cima-card p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-[10px] tracking-[0.15em] text-cima-gold uppercase mb-1">Equipo</p>
                <h2 className="font-heading font-bold text-xl text-cima-text">{editing ? "Editar agente" : "Nuevo agente"}</h2>
              </div>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg text-cima-text-muted hover:bg-cima-surface">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {[
                { key: "name", label: "Nombre *", type: "text", required: true },
                { key: "phone", label: "Teléfono", type: "tel", required: false },
                { key: "email", label: "Email", type: "email", required: false },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-xs font-medium text-cima-text-muted mb-1.5">{f.label}</label>
                  <input
                    type={f.type}
                    required={f.required}
                    value={(form as Record<string, string>)[f.key]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                    className="w-full rounded-lg bg-cima-surface border border-cima-border px-3 py-2.5 text-sm text-cima-text focus:outline-none focus:border-cima-gold/50 transition-colors"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-cima-text-muted mb-1.5">Vincular con Usuario Auth</label>
                <select
                  value={form.auth_id}
                  onChange={(e) => setForm((p) => ({ ...p, auth_id: e.target.value }))}
                  className="w-full rounded-lg bg-cima-surface border border-cima-border px-3 py-2.5 text-sm text-cima-text focus:outline-none focus:border-cima-gold/50"
                >
                  <option value="">— Sin vincular —</option>
                  {profiles.map((p) => (
                    <option key={p.id} value={p.id}>{p.full_name || p.id} ({p.role})</option>
                  ))}
                </select>
                <p className="text-[10px] text-cima-text-dim mt-1">Permite que el asesor entre al portal con su propio correo.</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-cima-text-muted mb-1.5">Especialidad</label>
                <select
                  value={form.specialty}
                  onChange={(e) => setForm((p) => ({ ...p, specialty: e.target.value as typeof form.specialty }))}
                  className="w-full rounded-lg bg-cima-surface border border-cima-border px-3 py-2.5 text-sm text-cima-text focus:outline-none focus:border-cima-gold/50"
                >
                  {Object.entries(SPECIALTY_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              {error && <p className="text-sm text-red-400 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2">{error}</p>}
              <button type="submit" disabled={saving}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-cima-gold text-cima-bg text-sm font-semibold hover:bg-cima-gold-light disabled:opacity-60 transition-colors">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {editing ? "Guardar cambios" : "Crear agente"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
