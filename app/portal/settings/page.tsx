"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Lock, Check, Loader2 } from "lucide-react";

export default function PortalSettings() {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPass.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (newPass !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    // Re-authenticate to verify current password
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) { setError("Sesión inválida."); setLoading(false); return; }

    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: current,
    });
    if (signInErr) {
      setError("La contraseña actual es incorrecta.");
      setLoading(false);
      return;
    }

    const { error: updateErr } = await supabase.auth.updateUser({ password: newPass });
    if (updateErr) {
      setError(updateErr.message);
    } else {
      setSuccess(true);
      setCurrent(""); setNewPass(""); setConfirm("");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6 max-w-md">
      <div>
        <p className="font-mono text-[10px] tracking-[0.2em] text-cima-gold uppercase mb-1">Cuenta</p>
        <h1 className="font-heading font-bold text-2xl text-cima-text">Cambiar contraseña</h1>
        <p className="text-sm text-cima-text-muted mt-1">Actualiza tu contraseña de acceso al portal.</p>
      </div>

      <div className="rounded-2xl border border-cima-border bg-cima-card p-6">
        {success ? (
          <div className="flex flex-col items-center py-6 gap-3 text-center">
            <div className="h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Check className="h-6 w-6 text-emerald-400" />
            </div>
            <p className="font-medium text-cima-text">Contraseña actualizada</p>
            <p className="text-sm text-cima-text-muted">Tu nueva contraseña está activa.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-cima-text-muted mb-1.5">
                <Lock className="inline h-3 w-3 mr-1" />
                Contraseña actual
              </label>
              <input
                type="password"
                required
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg bg-cima-surface border border-cima-border px-3 py-2.5 text-sm text-cima-text placeholder-cima-text-dim focus:outline-none focus:border-cima-gold/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-cima-text-muted mb-1.5">Nueva contraseña</label>
              <input
                type="password"
                required
                minLength={8}
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                className="w-full rounded-lg bg-cima-surface border border-cima-border px-3 py-2.5 text-sm text-cima-text placeholder-cima-text-dim focus:outline-none focus:border-cima-gold/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-cima-text-muted mb-1.5">Confirmar contraseña</label>
              <input
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repite la contraseña"
                className="w-full rounded-lg bg-cima-surface border border-cima-border px-3 py-2.5 text-sm text-cima-text placeholder-cima-text-dim focus:outline-none focus:border-cima-gold/50 transition-colors"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-cima-gold text-cima-bg text-sm font-semibold hover:bg-cima-gold-light disabled:opacity-60 transition-colors"
            >
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Actualizando…</> : "Cambiar contraseña"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
