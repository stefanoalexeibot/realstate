"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Loader2, KeyRound, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function UniversalLogin() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const supabase = createClient();

        try {
            // 1. Authenticate
            const { error: authError, data } = await supabase.auth.signInWithPassword({ email, password });

            if (authError) {
                setError("Email o contraseña incorrectos.");
                setLoading(false);
                return;
            }

            if (!data.user) {
                setError("Error inesperado. Inténtalo de nuevo.");
                setLoading(false);
                return;
            }

            // 2. Fetch profile to determine role
            const { data: profile } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", data.user.id)
                .single();

            // 3. Smart Redirect
            if (profile?.role === "admin" || profile?.role === "agent") {
                router.push("/admin");
            } else {
                // Default to portal for clients or undefined roles
                router.push("/portal");
            }

            router.refresh();
        } catch (err) {
            console.error("Login error:", err);
            setError("Error al conectar con el servidor.");
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-cima-bg flex items-center justify-center p-4">
            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cima-gold/5 blur-[120px]" />
            </div>

            <div className="relative w-full max-w-sm">
                {/* Header */}
                <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-cima-gold/10 border border-cima-gold/20 mb-6 gold-glow transition-transform hover:scale-105 duration-300">
                        <Building2 className="h-8 w-8 text-cima-gold" />
                    </div>
                    <h1 className="font-heading font-bold text-3xl text-cima-text tracking-tight">Cima Propiedades</h1>
                    <p className="text-sm text-cima-text-muted mt-2">
                        Acceso unificado para asesores y clientes
                    </p>
                </div>

                {/* Card */}
                <div className="rounded-3xl border border-cima-border bg-cima-card/50 backdrop-blur-xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-500 delay-150 fill-mode-both">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-mono text-cima-gold uppercase tracking-[0.2em] ml-1">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-cima-text-dim group-focus-within:text-cima-gold transition-colors" />
                                <input
                                    type="email"
                                    required
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="ejemplo@cima.mx"
                                    className="w-full rounded-xl bg-cima-surface border border-cima-border pl-10 pr-4 py-3 text-sm text-cima-text placeholder-cima-text-dim transition-all focus:outline-none focus:border-cima-gold/50 focus:ring-1 focus:ring-cima-gold/20"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-mono text-cima-gold uppercase tracking-[0.2em] ml-1">Contraseña</label>
                            <div className="relative group">
                                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-cima-text-dim group-focus-within:text-cima-gold transition-colors" />
                                <input
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full rounded-xl bg-cima-surface border border-cima-border pl-10 pr-4 py-3 text-sm text-cima-text placeholder-cima-text-dim transition-all focus:outline-none focus:border-cima-gold/50 focus:ring-1 focus:ring-cima-gold/20"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-400 animate-in shake-in duration-300">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-cima-gold text-cima-bg text-sm font-bold hover:bg-cima-gold-light disabled:opacity-60 transition-all active:scale-[0.98] mt-2 shadow-lg shadow-cima-gold/10"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Verificando…</span>
                                </>
                            ) : (
                                <span>Entrar al Portal</span>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-[10px] text-cima-text-dim mt-8 font-mono uppercase tracking-widest italic animate-in fade-in duration-1000 delay-300 fill-mode-both">
                    © 2026 Cima Propiedades · Exclusividad y Resultados
                </p>
            </div>
        </div>
    );
}
