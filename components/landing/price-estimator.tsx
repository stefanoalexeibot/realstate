"use client";

import { useState } from "react";
import { Calculator, TrendingUp, ArrowRight, Loader2 } from "lucide-react";

const ZONES = [
  "San Pedro Garza García",
  "Valle Oriente",
  "Cumbres",
  "Obispado",
  "San Jerónimo",
  "Monterrey Centro",
  "Del Valle",
  "Carrizalejo",
  "Chipinque",
  "Otra zona",
];

function formatMXN(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M MXN`;
  return `$${(n / 1_000).toFixed(0)}K MXN`;
}

type Result = {
  estimate: number;
  low: number;
  high: number;
  comps: number;
  zona: string;
};

export default function PriceEstimator() {
  const [zona, setZona]       = useState("");
  const [m2, setM2]           = useState("");
  const [recamaras, setRec]   = useState("3");
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<Result | null>(null);
  const [error, setError]     = useState("");

  async function estimate() {
    if (!zona || !m2 || Number(m2) < 20) {
      setError("Selecciona una zona e ingresa los m² (mínimo 20).");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(
        `/api/estimador?zona=${encodeURIComponent(zona)}&m2=${m2}&recamaras=${recamaras}`
      );
      const data = await res.json();
      setResult(data);
    } catch {
      setError("No se pudo calcular. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="estimador" className="px-6 py-16 border-t border-cima-border/50">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* Left — copy */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-cima-gold/10 border border-cima-gold/25 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-cima-gold" />
              </div>
              <p className="font-mono text-[10px] tracking-[0.2em] text-cima-gold uppercase">Valuación instantánea</p>
            </div>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-cima-text mb-4 leading-tight">
              ¿Cuánto vale<br />tu propiedad?
            </h2>
            <p className="text-cima-text-muted text-base leading-relaxed mb-6">
              Calcula un estimado de precio basado en propiedades reales activas en tu zona. En 5 segundos, sin registrarte.
            </p>
            <div className="space-y-1 text-sm text-cima-text-muted">
              {["Basado en datos reales de mercado", "Sin compromisos ni registro", "Valuación exacta gratis con nuestro agente"].map((t) => (
                <div key={t} className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-cima-gold" />
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div className="rounded-2xl border border-cima-border bg-cima-card p-6 space-y-4">
            {/* Zona */}
            <div>
              <label className="block font-mono text-[10px] text-cima-text-muted uppercase tracking-widest mb-1.5">
                Zona / Colonia
              </label>
              <select
                value={zona}
                onChange={(e) => setZona(e.target.value)}
                className="w-full rounded-lg border border-cima-border bg-cima-surface text-sm text-cima-text px-3 py-2.5 focus:outline-none focus:border-cima-gold/50 transition-colors"
              >
                <option value="">Selecciona una zona...</option>
                {ZONES.map((z) => <option key={z} value={z}>{z}</option>)}
              </select>
            </div>

            {/* M2 + Recámaras */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-mono text-[10px] text-cima-text-muted uppercase tracking-widest mb-1.5">
                  Metros² construidos
                </label>
                <input
                  type="number"
                  min={20}
                  max={2000}
                  value={m2}
                  onChange={(e) => setM2(e.target.value)}
                  placeholder="ej. 180"
                  className="w-full rounded-lg border border-cima-border bg-cima-surface text-sm text-cima-text px-3 py-2.5 focus:outline-none focus:border-cima-gold/50 transition-colors placeholder:text-cima-text-dim"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] text-cima-text-muted uppercase tracking-widest mb-1.5">
                  Recámaras
                </label>
                <select
                  value={recamaras}
                  onChange={(e) => setRec(e.target.value)}
                  className="w-full rounded-lg border border-cima-border bg-cima-surface text-sm text-cima-text px-3 py-2.5 focus:outline-none focus:border-cima-gold/50 transition-colors"
                >
                  {["1", "2", "3", "4", "5+"].map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}

            <button
              onClick={estimate}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-cima-gold px-5 py-3 font-heading font-bold text-sm text-cima-bg hover:bg-cima-gold-light active:scale-[0.98] transition-all disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Calculator className="h-4 w-4" />}
              {loading ? "Calculando..." : "Calcular estimado"}
            </button>

            {/* Result */}
            {result && (
              <div className="rounded-xl border border-cima-gold/20 bg-cima-gold/5 p-4 space-y-3">
                <div className="text-center">
                  <p className="font-mono text-[10px] text-cima-text-dim uppercase tracking-widest mb-1">
                    Valor estimado de tu propiedad
                  </p>
                  <p className="font-heading font-bold text-3xl text-cima-gold">
                    {formatMXN(result.estimate)}
                  </p>
                  <p className="text-xs text-cima-text-muted mt-0.5">
                    Rango: {formatMXN(result.low)} — {formatMXN(result.high)}
                  </p>
                  {result.comps > 0 && (
                    <p className="text-[10px] text-cima-text-dim mt-1 font-mono">
                      Basado en {result.comps} propiedades en {result.zona}
                    </p>
                  )}
                </div>
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_CIMA_WA ?? ""}?text=Hola,%20quiero%20una%20valuación%20exacta%20de%20mi%20propiedad%20en%20${encodeURIComponent(result.zona)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full rounded-lg bg-cima-gold/10 border border-cima-gold/30 px-4 py-2.5 text-sm font-medium text-cima-gold hover:bg-cima-gold/20 transition-colors"
                >
                  Solicitar valuación exacta gratis
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
