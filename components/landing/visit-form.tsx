"use client";

import { useState } from "react";
import { Loader2, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface VisitFormProps {
  propertyId: string;
  propertyTitle: string;
}

type FormState = "idle" | "loading" | "success" | "error";

export default function VisitForm({ propertyId, propertyTitle }: VisitFormProps) {
  const [state, setState] = useState<FormState>("idle");
  const [form, setForm] = useState({ name: "", phone: "", preferred_date: "", message: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    setState("loading");
    try {
      const res = await fetch("/api/visitas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ property_id: propertyId, ...form }),
      });
      if (!res.ok) throw new Error();
      setState("success");
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="py-6 text-center">
        <div className="h-10 w-10 rounded-full bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center mx-auto mb-3">
          <CheckCircle className="h-5 w-5 text-cima-gold" />
        </div>
        <p className="font-heading font-semibold text-cima-text text-base">¡Visita solicitada!</p>
        <p className="text-xs text-cima-text-muted mt-1">Te contactamos pronto para confirmar.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-mono text-cima-text-muted uppercase tracking-widest">Nombre</label>
        <input
          required
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="Tu nombre"
          className="rounded-lg border border-cima-border bg-cima-surface px-3 py-2.5 text-sm text-cima-text placeholder:text-cima-text-dim focus:outline-none focus:border-cima-gold/50 transition-colors"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-mono text-cima-text-muted uppercase tracking-widest">WhatsApp</label>
        <input
          required
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          placeholder="81 0000 0000"
          className="rounded-lg border border-cima-border bg-cima-surface px-3 py-2.5 text-sm text-cima-text placeholder:text-cima-text-dim focus:outline-none focus:border-cima-gold/50 transition-colors"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-mono text-cima-text-muted uppercase tracking-widest">Fecha preferida</label>
        <input
          type="date"
          value={form.preferred_date}
          onChange={(e) => setForm((f) => ({ ...f, preferred_date: e.target.value }))}
          className="rounded-lg border border-cima-border bg-cima-surface px-3 py-2.5 text-sm text-cima-text focus:outline-none focus:border-cima-gold/50 transition-colors"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-mono text-cima-text-muted uppercase tracking-widest">Mensaje</label>
        <textarea
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          placeholder={`Me interesa ${propertyTitle.substring(0, 30)}…`}
          rows={2}
          className="rounded-lg border border-cima-border bg-cima-surface px-3 py-2.5 text-sm text-cima-text placeholder:text-cima-text-dim focus:outline-none focus:border-cima-gold/50 transition-colors resize-none"
        />
      </div>
      {state === "error" && (
        <p className="text-xs text-red-400">Error al enviar. Intenta de nuevo.</p>
      )}
      <button
        type="submit"
        disabled={state === "loading"}
        className={cn(
          "w-full rounded-xl bg-cima-gold px-4 py-3 font-heading font-semibold text-sm text-cima-bg hover:bg-cima-gold-light transition-colors flex items-center justify-center gap-2",
          state === "loading" && "opacity-70 cursor-not-allowed"
        )}
      >
        {state === "loading" ? <><Loader2 className="h-4 w-4 animate-spin" />Enviando…</> : "Solicitar visita"}
      </button>
    </form>
  );
}
