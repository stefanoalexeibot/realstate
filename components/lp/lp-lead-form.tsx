"use client";

import { useState } from "react";
import { Loader2, CheckCircle, MessageCircle } from "lucide-react";

interface LpLeadFormProps {
    propertyId: string;
    propertyTitle: string;
    propertySlug: string;
    operationType: string;
    neighborhood?: string | null;
    waPhone: string;
}

export default function LpLeadForm({
    propertyId,
    propertyTitle,
    propertySlug,
    operationType,
    neighborhood,
    waPhone,
}: LpLeadFormProps) {
    const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [form, setForm] = useState({ name: "", phone: "", message: "" });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!form.name || !form.phone) return;
        setState("loading");

        try {
            const res = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    property_id: propertyId,
                    name: form.name,
                    phone: form.phone,
                    message: form.message || `Me interesa la propiedad: ${propertyTitle}`,
                    source: "landing-page",
                    operation_type: operationType,
                    neighborhood: neighborhood ?? null,
                }),
            });

            if (!res.ok) throw new Error();
            setState("success");

            // Abrir WhatsApp automáticamente al capturar el lead
            const msg = encodeURIComponent(
                `Hola, me interesa la propiedad: *${propertyTitle}*\nMi nombre es ${form.name}.${form.message ? `\n${form.message}` : ""}`
            );
            setTimeout(() => {
                window.open(`https://wa.me/${waPhone}?text=${msg}`, "_blank");
            }, 600);
        } catch {
            setState("error");
        }
    }

    if (state === "success") {
        return (
            <div className="py-8 text-center">
                <div className="h-14 w-14 rounded-full bg-[#25D366]/10 border border-[#25D366]/30 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-7 w-7 text-[#25D366]" />
                </div>
                <p className="font-heading font-bold text-cima-text text-lg mb-1">¡Listo! Te contactamos pronto</p>
                <p className="text-sm text-cima-text-muted">Abriendo WhatsApp para continuar la conversación…</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div>
                <label className="block text-[10px] font-mono text-cima-text-muted uppercase tracking-widest mb-1.5">
                    Tu nombre *
                </label>
                <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="¿Cómo te llamas?"
                    className="w-full rounded-lg border border-cima-border bg-cima-surface px-3 py-3 text-sm text-cima-text placeholder:text-cima-text-dim focus:outline-none focus:border-cima-gold/50 transition-colors"
                />
            </div>
            <div>
                <label className="block text-[10px] font-mono text-cima-text-muted uppercase tracking-widest mb-1.5">
                    WhatsApp *
                </label>
                <input
                    required
                    type="text"
                    inputMode="numeric"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="81 0000 0000"
                    className="w-full rounded-lg border border-cima-border bg-cima-surface px-3 py-3 text-sm text-cima-text placeholder:text-cima-text-dim focus:outline-none focus:border-cima-gold/50 transition-colors"
                />
            </div>
            <div>
                <label className="block text-[10px] font-mono text-cima-text-muted uppercase tracking-widest mb-1.5">
                    Mensaje (opcional)
                </label>
                <textarea
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    placeholder="¿Tienes alguna pregunta o comentario?"
                    rows={2}
                    className="w-full rounded-lg border border-cima-border bg-cima-surface px-3 py-3 text-sm text-cima-text placeholder:text-cima-text-dim focus:outline-none focus:border-cima-gold/50 transition-colors resize-none"
                />
            </div>
            {state === "error" && (
                <p className="text-xs text-red-400">Error al enviar. Intenta de nuevo.</p>
            )}
            <button
                type="submit"
                disabled={state === "loading"}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-4 font-heading font-bold text-white text-base hover:bg-[#1eb85a] transition-colors disabled:opacity-60"
            >
                {state === "loading" ? (
                    <><Loader2 className="h-5 w-5 animate-spin" />Enviando…</>
                ) : (
                    <><MessageCircle className="h-5 w-5" />Quiero más información</>
                )}
            </button>
            <p className="text-[10px] text-center text-cima-text-dim">
                Al enviar, un asesor te contactará por WhatsApp en breve.
            </p>
        </form>
    );
}
