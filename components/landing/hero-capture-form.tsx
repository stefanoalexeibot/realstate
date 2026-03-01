"use client";

import { useState } from "react";
import { Loader2, CheckCircle, ArrowRight, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUtmParams } from "@/hooks/useUtmParams";

type State = "idle" | "loading" | "success" | "error";

export default function HeroCaptureForm() {
  const [state, setState] = useState<State>("idle");
  const [form, setForm] = useState({ name: "", phone: "", estimated_price: "" });
  const utm = useUtmParams();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    setState("loading");
    try {
      const res = await fetch("/api/seller-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          estimated_price: form.estimated_price
            ? parseInt(form.estimated_price.replace(/\D/g, ""))
            : null,
          operation_type: "venta",
          message: "Lead desde hero — 30 días",
          ...utm,
        }),
      });
      if (!res.ok) throw new Error();
      setState("success");
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="rounded-2xl border border-cima-gold/30 bg-cima-gold/5 p-6 text-center">
        <div className="h-12 w-12 rounded-full bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-6 w-6 text-cima-gold" />
        </div>
        <p className="font-heading font-bold text-cima-text text-lg mb-1">¡Listo! Te contactamos hoy.</p>
        <p className="text-sm text-cima-text-muted mb-4">Un asesor de Cima te llamará en menos de 2 horas.</p>
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_CIMA_WA}?text=Hola,%20acabo%20de%20dejar%20mis%20datos%20en%20la%20web%20de%20Cima%20para%20vender%20mi%20casa`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] text-sm hover:bg-[#25D366]/20 transition-colors"
        >
          <Phone className="h-4 w-4" />
          También puedes escribirnos directo
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="rounded-2xl border border-cima-border bg-cima-card/80 backdrop-blur-sm p-5 shadow-2xl">
        <p className="font-mono text-[10px] tracking-[0.2em] text-cima-gold uppercase mb-4">
          Solicita tu valuación gratuita
        </p>

        <div className="space-y-3">
          <input
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Tu nombre"
            className="w-full rounded-xl border border-cima-border bg-cima-surface px-4 py-3 text-sm text-cima-text placeholder:text-cima-text-dim focus:outline-none focus:border-cima-gold/50 transition-colors"
          />
          <input
            required
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder="Tu WhatsApp · 81 0000 0000"
            className="w-full rounded-xl border border-cima-border bg-cima-surface px-4 py-3 text-sm text-cima-text placeholder:text-cima-text-dim focus:outline-none focus:border-cima-gold/50 transition-colors"
          />
          <input
            value={form.estimated_price}
            onChange={(e) => setForm((f) => ({ ...f, estimated_price: e.target.value }))}
            placeholder="Precio aprox. de tu propiedad (opcional)"
            className="w-full rounded-xl border border-cima-border bg-cima-surface px-4 py-3 text-sm text-cima-text placeholder:text-cima-text-dim focus:outline-none focus:border-cima-gold/50 transition-colors"
          />

          {state === "error" && (
            <p className="text-xs text-red-400">Error al enviar. Intenta de nuevo.</p>
          )}

          <button
            type="submit"
            disabled={state === "loading"}
            className={cn(
              "w-full flex items-center justify-center gap-2 rounded-xl bg-cima-gold px-5 py-3.5 font-heading font-bold text-sm text-cima-bg hover:bg-cima-gold-light transition-all",
              state === "loading" && "opacity-70 cursor-not-allowed"
            )}
          >
            {state === "loading" ? (
              <><Loader2 className="h-4 w-4 animate-spin" />Enviando…</>
            ) : (
              <>Quiero vender en 30 días <ArrowRight className="h-4 w-4" /></>
            )}
          </button>
        </div>

        <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
          {["Valuación gratis", "Sin contratos largos", "Fotos pro incluidas"].map((t) => (
            <div key={t} className="flex items-center gap-1.5">
              <div className="h-1 w-1 rounded-full bg-cima-gold" />
              <span className="text-[10px] text-cima-text-dim">{t}</span>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
