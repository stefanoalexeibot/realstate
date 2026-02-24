"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) {
      setError("Credenciales incorrectas");
      setLoading(false);
    } else {
      router.push("/admin");
    }
  }

  return (
    <div className="min-h-screen bg-cima-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="h-10 w-10 rounded-xl bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-cima-gold" />
          </div>
          <div>
            <p className="font-heading font-bold text-cima-text">Cima Propiedades</p>
            <p className="font-mono text-[10px] text-cima-text-dim uppercase tracking-widest">Panel admin</p>
          </div>
        </div>

        <div className="rounded-2xl border border-cima-border bg-cima-card p-8">
          <h1 className="font-heading font-bold text-xl text-cima-text mb-6">Iniciar sesión</h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-cima-text-muted uppercase tracking-widest">Correo</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@cima.mx"
                className="rounded-lg border border-cima-border bg-cima-surface px-3.5 py-2.5 text-sm text-cima-text placeholder:text-cima-text-dim focus:outline-none focus:border-cima-gold/50 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-cima-text-muted uppercase tracking-widest">Contraseña</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="rounded-lg border border-cima-border bg-cima-surface px-3.5 py-2.5 text-sm text-cima-text placeholder:text-cima-text-dim focus:outline-none focus:border-cima-gold/50 transition-colors"
              />
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-cima-gold px-4 py-3 font-heading font-semibold text-sm text-cima-bg hover:bg-cima-gold-light transition-colors disabled:opacity-70"
            >
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Entrando…</> : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
