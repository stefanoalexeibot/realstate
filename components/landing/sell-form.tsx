"use client";

import { useState } from "react";
import { Loader2, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type FormState = "idle" | "loading" | "success" | "error";

export default function SellForm() {
  const [state, setState] = useState<FormState>("idle");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    neighborhood: "",
    property_type: "",
    operation_type: "venta",
    message: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    setState("loading");
    try {
      const res = await fetch("/api/seller-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setState("success");
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
        <div className="h-12 w-12 rounded-full bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center">
          <CheckCircle className="h-6 w-6 text-cima-gold" />
        </div>
        <p className="font-heading font-semibold text-cima-text text-lg">¡Recibimos tu solicitud!</p>
        <p className="text-sm text-cima-text-muted max-w-xs">
          Un asesor de Cima Propiedades se pondrá en contacto contigo en breve.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-mono text-cima-text-muted uppercase tracking-widest">Nombre</label>
        <input
          required
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="Tu nombre completo"
          className="rounded-lg border border-cima-border bg-cima-surface px-3.5 py-2.5 text-sm text-cima-text placeholder:text-cima-text-dim focus:outline-none focus:border-cima-gold/50 transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-mono text-cima-text-muted uppercase tracking-widest">WhatsApp / Teléfono</label>
        <input
          required
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          placeholder="81 0000 0000"
          className="rounded-lg border border-cima-border bg-cima-surface px-3.5 py-2.5 text-sm text-cima-text placeholder:text-cima-text-dim focus:outline-none focus:border-cima-gold/50 transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-mono text-cima-text-muted uppercase tracking-widest">Colonia / Zona</label>
        <input
          value={form.neighborhood}
          onChange={(e) => setForm((f) => ({ ...f, neighborhood: e.target.value }))}
          placeholder="San Pedro, Valle Oriente…"
          className="rounded-lg border border-cima-border bg-cima-surface px-3.5 py-2.5 text-sm text-cima-text placeholder:text-cima-text-dim focus:outline-none focus:border-cima-gold/50 transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-mono text-cima-text-muted uppercase tracking-widest">Tipo de operación</label>
        <select
          value={form.operation_type}
          onChange={(e) => setForm((f) => ({ ...f, operation_type: e.target.value }))}
          className="rounded-lg border border-cima-border bg-cima-surface px-3.5 py-2.5 text-sm text-cima-text focus:outline-none focus:border-cima-gold/50 transition-colors"
        >
          <option value="venta">Quiero vender</option>
          <option value="renta">Quiero rentar</option>
        </select>
      </div>

      <div className="sm:col-span-2 flex flex-col gap-1.5">
        <label className="text-xs font-mono text-cima-text-muted uppercase tracking-widest">Mensaje (opcional)</label>
        <textarea
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          placeholder="Cuéntanos más sobre tu propiedad…"
          rows={3}
          className="rounded-lg border border-cima-border bg-cima-surface px-3.5 py-2.5 text-sm text-cima-text placeholder:text-cima-text-dim focus:outline-none focus:border-cima-gold/50 transition-colors resize-none"
        />
      </div>

      {state === "error" && (
        <p className="sm:col-span-2 text-xs text-red-400">
          Hubo un error. Intenta de nuevo o escríbenos directo al WhatsApp.
        </p>
      )}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={state === "loading"}
          className={cn(
            "w-full flex items-center justify-center gap-2 rounded-lg px-6 py-3 font-heading font-semibold text-sm text-cima-bg bg-cima-gold hover:bg-cima-gold-light transition-colors",
            state === "loading" && "opacity-70 cursor-not-allowed"
          )}
        >
          {state === "loading" ? (
            <><Loader2 className="h-4 w-4 animate-spin" />Enviando…</>
          ) : (
            "Solicitar valuación gratuita"
          )}
        </button>
      </div>
    </form>
  );
}
