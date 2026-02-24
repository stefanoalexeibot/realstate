"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { X, Loader2, CheckCircle2, Copy, Check } from "lucide-react";
import type { Property } from "@/lib/types";

function genPassword() {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

export default function InvitePropietarioModal({ onClose, onCreated }: Props) {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", property_id: "",
    temp_password: genPassword(),
  });
  const [properties, setProperties] = useState<Pick<Property, "id" | "title" | "neighborhood">[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/admin/people")
      .then((r) => r.json())
      .then(({ propietarios: _ }) => {
        // We need properties, not people — load via service API
      });
    // Load active properties via dedicated route (bypasses RLS)
    fetch("/api/propiedades-list")
      .then((r) => r.json())
      .then(({ properties: list }) => {
        setProperties((list ?? []) as Pick<Property, "id" | "title" | "neighborhood">[]);
      })
      .catch(() => {
        // Fallback: try direct (may be empty if RLS blocks)
        createClient()
          .from("re_properties")
          .select("id, title, neighborhood")
          .eq("status", "active")
          .order("created_at", { ascending: false })
          .then(({ data }) => setProperties((data ?? []) as Pick<Property, "id" | "title" | "neighborhood">[]));
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/portal/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error desconocido");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear propietario");
    } finally {
      setLoading(false);
    }
  }

  function copyPassword() {
    navigator.clipboard.writeText(form.temp_password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-cima-border bg-cima-card p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-heading font-bold text-lg text-cima-text">Crear propietario</h2>
            <p className="text-xs text-cima-text-muted mt-0.5">Acceso al portal del propietario</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-cima-text-muted hover:bg-cima-surface hover:text-cima-text transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {done ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <div>
                <p className="font-medium text-cima-text text-sm">Propietario creado</p>
                <p className="text-xs text-cima-text-muted mt-0.5">Comparte estas credenciales de forma segura</p>
              </div>
            </div>

            <div className="rounded-xl border border-cima-border bg-cima-surface p-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-cima-text-muted font-mono uppercase tracking-widest">Email</p>
                <p className="text-sm text-cima-text font-medium">{form.email}</p>
              </div>
              <div className="h-px bg-cima-border" />
              <div className="flex items-center justify-between">
                <p className="text-xs text-cima-text-muted font-mono uppercase tracking-widest">Contraseña temporal</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-cima-gold font-mono font-bold">{form.temp_password}</p>
                  <button onClick={copyPassword} className="p-1 rounded text-cima-text-dim hover:text-cima-gold transition-colors">
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            </div>
            <p className="text-xs text-cima-text-dim">El propietario puede cambiar su contraseña desde el portal en Configuración.</p>
            <button
              onClick={() => { onCreated(); onClose(); }}
              className="w-full rounded-xl bg-cima-gold px-4 py-2.5 text-sm font-semibold text-cima-bg hover:bg-cima-gold-light transition-colors"
            >
              Listo
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: "name", label: "Nombre completo", placeholder: "Nombre del propietario", type: "text", required: true },
              { key: "email", label: "Email", placeholder: "correo@ejemplo.com", type: "email", required: true },
              { key: "phone", label: "WhatsApp", placeholder: "81 0000 0000", type: "tel", required: false },
            ].map(({ key, label, placeholder, type, required }) => (
              <div key={key}>
                <label className="block text-[10px] font-mono text-cima-text-muted uppercase tracking-widest mb-1">{label}</label>
                <input
                  required={required}
                  type={type}
                  placeholder={placeholder}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  className="w-full rounded-lg border border-cima-border bg-cima-surface px-3 py-2.5 text-sm text-cima-text placeholder:text-cima-text-dim focus:outline-none focus:border-cima-gold/50 transition-colors"
                />
              </div>
            ))}

            {/* Property select */}
            <div>
              <label className="block text-[10px] font-mono text-cima-text-muted uppercase tracking-widest mb-1">Vincular propiedad</label>
              <select
                value={form.property_id}
                onChange={(e) => setForm((f) => ({ ...f, property_id: e.target.value }))}
                className="w-full rounded-lg border border-cima-border bg-cima-surface px-3 py-2.5 text-sm text-cima-text focus:outline-none focus:border-cima-gold/50 transition-colors"
              >
                <option value="">— Sin vincular —</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}{p.neighborhood ? ` · ${p.neighborhood}` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Temp password */}
            <div>
              <label className="block text-[10px] font-mono text-cima-text-muted uppercase tracking-widest mb-1">Contraseña temporal</label>
              <div className="flex gap-2">
                <input
                  required
                  value={form.temp_password}
                  onChange={(e) => setForm((f) => ({ ...f, temp_password: e.target.value }))}
                  className="flex-1 rounded-lg border border-cima-border bg-cima-surface px-3 py-2.5 text-sm text-cima-text font-mono focus:outline-none focus:border-cima-gold/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, temp_password: genPassword() }))}
                  className="px-3 py-2 rounded-lg border border-cima-border bg-cima-surface text-xs text-cima-text-muted hover:text-cima-gold hover:border-cima-gold/40 transition-colors"
                >
                  Nueva
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-sm text-red-400">{error}</div>
            )}

            <div className="flex gap-3 pt-1">
              <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-cima-border px-4 py-2.5 text-sm text-cima-text-muted hover:bg-cima-surface transition-colors">
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-cima-gold px-4 py-2.5 text-sm font-semibold text-cima-bg hover:bg-cima-gold-light disabled:opacity-60 transition-colors"
              >
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Creando…</> : "Crear propietario"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
