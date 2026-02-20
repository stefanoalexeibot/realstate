"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Users, Phone, Key, X, Loader2, Check } from "lucide-react";
import type { PipelineStage } from "@/lib/types";

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

const PIPELINE_LABELS: Record<PipelineStage, { label: string; color: string }> = {
  prospecto:   { label: "Prospecto",   color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  contactado:  { label: "Contactado",  color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  valuacion:   { label: "Valuación",   color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  publicado:   { label: "Publicado",   color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  negociacion: { label: "Negociación", color: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
  vendido:     { label: "Vendido",     color: "bg-green-500/10 text-green-400 border-green-500/20" },
  perdido:     { label: "Perdido",     color: "bg-red-500/10 text-red-400 border-red-500/20" },
};

const STAGES: PipelineStage[] = ["prospecto","contactado","valuacion","publicado","negociacion","vendido","perdido"];

type LeadRow = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  neighborhood: string | null;
  operation_type: string;
  estimated_price: number | null;
  pipeline_stage: PipelineStage;
  created_at: string;
};

type InviteState = {
  leadId: string;
  name: string;
  phone: string;
  email: string;
  password: string;
};

function genPassword() {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export default function LeadsAdmin() {
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [invite, setInvite] = useState<InviteState | null>(null);
  const [inviting, setInviting] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState<{ propId: string; pass: string } | null>(null);

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("re_seller_leads")
      .select("*")
      .order("created_at", { ascending: false });
    setLeads((data ?? []) as LeadRow[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function movePipeline(id: string, stage: PipelineStage) {
    setUpdating(id);
    try {
      await fetch(`/api/seller-leads/${id}/pipeline`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pipeline_stage: stage }),
      });
      setLeads((prev) => prev.map((l) => l.id === id ? { ...l, pipeline_stage: stage } : l));
    } finally {
      setUpdating(null);
    }
  }

  function openInvite(lead: LeadRow) {
    setInviteSuccess(null);
    setInvite({
      leadId: lead.id,
      name: lead.name,
      phone: lead.phone,
      email: lead.email ?? "",
      password: genPassword(),
    });
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!invite) return;
    setInviting(true);
    try {
      const res = await fetch("/api/portal/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: invite.email,
          name: invite.name,
          phone: invite.phone,
          temp_password: invite.password,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Error");
      setInviteSuccess({ propId: json.propietario_id, pass: invite.password });
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error al invitar");
    } finally {
      setInviting(false);
    }
  }

  const total    = leads.length;
  const thisWeek = leads.filter((l) => Date.now() - new Date(l.created_at).getTime() < 7 * 24 * 60 * 60 * 1000).length;
  const newLeads = leads.filter((l) => l.pipeline_stage === "prospecto").length;

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-cima-gold" />
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2.5 mb-1">
          <Users className="h-5 w-5 text-cima-gold" />
          <h1 className="font-heading font-bold text-2xl text-cima-text">Propietarios / Leads</h1>
        </div>
        <p className="text-sm text-cima-text-muted">Personas que quieren vender o rentar su propiedad.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total leads",  value: total,    color: "text-cima-text" },
          { label: "Esta semana",  value: thisWeek, color: "text-blue-400" },
          { label: "Prospectos",   value: newLeads, color: "text-cima-gold" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-cima-border bg-cima-card p-5">
            <p className={`font-heading font-bold text-3xl leading-none ${s.color} mb-1`}>{s.value}</p>
            <p className="text-xs text-cima-text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      {leads.length === 0 ? (
        <div className="rounded-xl border border-cima-border bg-cima-card p-16 text-center">
          <Users className="h-8 w-8 text-cima-text-dim mx-auto mb-3" />
          <p className="text-cima-text-muted">Sin propietarios registrados aún.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-cima-border bg-cima-card overflow-hidden">
          <div className="hidden sm:grid grid-cols-[1fr_1fr_110px_110px_140px_90px] gap-4 px-5 py-3 border-b border-cima-border bg-cima-bg">
            {["Nombre", "Contacto", "Operación", "Pipeline", "Fecha", ""].map((h) => (
              <p key={h} className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">{h}</p>
            ))}
          </div>
          <div className="divide-y divide-cima-border">
            {leads.map((l) => {
              const pl = PIPELINE_LABELS[l.pipeline_stage] ?? PIPELINE_LABELS.prospecto;
              const isUpdating = updating === l.id;
              return (
                <div key={l.id} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_110px_110px_140px_90px] gap-3 sm:gap-4 px-5 py-4 items-start sm:items-center hover:bg-cima-surface/30 transition-colors">
                  {/* Name */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cima-gold/10 border border-cima-gold/20">
                      <span className="font-bold text-xs text-cima-gold">{l.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-cima-text truncate">{l.name}</p>
                      <p className="text-xs text-cima-text-muted">{l.neighborhood ?? "—"}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <p className="text-sm text-cima-text-muted">{l.phone}</p>
                    {l.email && <p className="text-xs text-cima-text-dim truncate">{l.email}</p>}
                  </div>

                  {/* Operation */}
                  <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-mono border w-fit ${
                    l.operation_type === "venta"
                      ? "bg-cima-gold/10 text-cima-gold border-cima-gold/20"
                      : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                  }`}>
                    {l.operation_type === "venta" ? "Venta" : "Renta"}
                  </span>

                  {/* Pipeline stage */}
                  <div className="flex items-center gap-1.5 min-w-0">
                    <select
                      value={l.pipeline_stage}
                      disabled={isUpdating}
                      onChange={(e) => movePipeline(l.id, e.target.value as PipelineStage)}
                      className={`text-[10px] font-mono border rounded px-1.5 py-0.5 bg-transparent focus:outline-none cursor-pointer disabled:opacity-50 ${pl.color}`}
                    >
                      {STAGES.map((s) => (
                        <option key={s} value={s}>{PIPELINE_LABELS[s].label}</option>
                      ))}
                    </select>
                    {isUpdating && <Loader2 className="h-3 w-3 animate-spin text-cima-text-dim shrink-0" />}
                  </div>

                  {/* Date */}
                  <div>
                    <p className="text-xs text-cima-text-muted">{formatDate(l.created_at)}</p>
                    <p className="text-[10px] text-cima-text-dim mt-0.5">{timeAgo(l.created_at)}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <a
                      href={`https://wa.me/52${l.phone.replace(/\D/g, "")}?text=Hola ${encodeURIComponent(l.name)}, te contactamos de Cima Propiedades para tu solicitud de ${l.operation_type}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] text-[10px] hover:bg-[#25D366]/20 transition-colors"
                    >
                      <Phone className="h-3 w-3" />
                      WA
                    </a>
                    <button
                      onClick={() => openInvite(l)}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg bg-cima-gold/10 border border-cima-gold/20 text-cima-gold text-[10px] hover:bg-cima-gold/20 transition-colors"
                      title="Invitar al portal"
                    >
                      <Key className="h-3 w-3" />
                      Portal
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {invite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-cima-border bg-cima-card p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-[10px] tracking-[0.15em] text-cima-gold uppercase mb-1">Portal del propietario</p>
                <h2 className="font-heading font-bold text-xl text-cima-text">Crear acceso</h2>
              </div>
              <button onClick={() => { setInvite(null); setInviteSuccess(null); }} className="p-1.5 rounded-lg text-cima-text-muted hover:bg-cima-surface">
                <X className="h-4 w-4" />
              </button>
            </div>

            {inviteSuccess ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Check className="h-4 w-4 text-emerald-400" />
                    <p className="text-sm font-medium text-emerald-400">Acceso creado correctamente</p>
                  </div>
                  <p className="text-xs text-cima-text-muted mb-2">Comparte estas credenciales con el propietario:</p>
                  <div className="rounded-lg bg-cima-bg border border-cima-border p-3 font-mono text-xs space-y-1">
                    <p><span className="text-cima-text-dim">URL:</span> <span className="text-cima-text">propiedades-mty.vercel.app/portal</span></p>
                    <p><span className="text-cima-text-dim">Email:</span> <span className="text-cima-text">{invite.email}</span></p>
                    <p><span className="text-cima-text-dim">Clave:</span> <span className="text-cima-gold font-bold">{inviteSuccess.pass}</span></p>
                  </div>
                </div>
                <button
                  onClick={() => { setInvite(null); setInviteSuccess(null); }}
                  className="w-full py-2.5 rounded-lg bg-cima-gold text-cima-bg text-sm font-semibold hover:bg-cima-gold-light transition-colors"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <form onSubmit={handleInvite} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-cima-text-muted mb-1.5">Nombre</label>
                  <input
                    type="text"
                    required
                    value={invite.name}
                    onChange={(e) => setInvite((i) => i ? { ...i, name: e.target.value } : i)}
                    className="w-full rounded-lg bg-cima-surface border border-cima-border px-3 py-2.5 text-sm text-cima-text focus:outline-none focus:border-cima-gold/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-cima-text-muted mb-1.5">Email *</label>
                  <input
                    type="email"
                    required
                    value={invite.email}
                    onChange={(e) => setInvite((i) => i ? { ...i, email: e.target.value } : i)}
                    placeholder="propietario@email.com"
                    className="w-full rounded-lg bg-cima-surface border border-cima-border px-3 py-2.5 text-sm text-cima-text placeholder-cima-text-dim focus:outline-none focus:border-cima-gold/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-cima-text-muted mb-1.5">Contraseña temporal</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={invite.password}
                      onChange={(e) => setInvite((i) => i ? { ...i, password: e.target.value } : i)}
                      className="flex-1 rounded-lg bg-cima-surface border border-cima-border px-3 py-2.5 text-sm text-cima-text font-mono focus:outline-none focus:border-cima-gold/50"
                    />
                    <button
                      type="button"
                      onClick={() => setInvite((i) => i ? { ...i, password: genPassword() } : i)}
                      className="px-3 py-2 rounded-lg border border-cima-border bg-cima-surface text-xs text-cima-text-muted hover:text-cima-gold hover:border-cima-gold/40 transition-colors"
                    >
                      Nueva
                    </button>
                  </div>
                </div>
                <p className="text-xs text-cima-text-dim">Se creará una cuenta en el portal con estas credenciales. Compártelas directamente con el propietario.</p>
                <button
                  type="submit"
                  disabled={inviting}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-cima-gold text-cima-bg text-sm font-semibold hover:bg-cima-gold-light disabled:opacity-60 transition-colors"
                >
                  {inviting ? <><Loader2 className="h-4 w-4 animate-spin" /> Creando acceso…</> : <><Key className="h-4 w-4" /> Crear acceso al portal</>}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
