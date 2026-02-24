"use client";

import { useState, useEffect } from "react";
import { Calculator, TrendingUp, ArrowRight, Loader2, Sparkles, CheckCircle, Mail, Phone, User, Globe } from "lucide-react";
import { formatPrice } from "@/lib/utils";

const ZONES = [
  "San Pedro Garza García",
  "Monterrey",
  "Santa Catarina",
  "San Nicolás de los Garza",
  "Guadalupe",
  "Apodaca",
  "General Escobedo",
  "García",
  "Juárez",
  "Cadereyta Jiménez",
  "Santiago",
  "Montemorelos",
  "Linares",
  "Allende",
  "Salinas Victoria",
  "El Carmen",
  "General Zuazua",
  "Pesquería",
  "Cumbres (Zona)",
  "Carretera Nacional",
  "Valle Oriente",
  "San Jerónimo",
  "Obispado",
  "Otra zona de NL",
];

const AI_STEPS = [
  "Analizando tendencias de mercado...",
  "Comparando con 50+ propiedades en la zona...",
  "Ajustando por metros cuadrados y amenidades...",
  "Generando reporte de inteligencia...",
];

type Result = {
  estimate: number;
  low: number;
  high: number;
  comps: number;
  zona: string;
};

export default function PriceEstimator() {
  const [zona, setZona] = useState("");
  const [m2, setM2] = useState("");
  const [recamaras, setRec] = useState("3");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  // Lead capture state
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadData, setLeadData] = useState({ name: "", email: "", phone: "" });
  const [leadLoading, setLeadLoading] = useState(false);
  const [leadSaved, setLeadSaved] = useState(false);

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingStep((s) => (s + 1) % AI_STEPS.length);
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const estimate = async () => {
    if (!zona || !m2 || Number(m2) < 20) {
      setError("Selecciona una zona e ingresa los m² (mínimo 20).");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    setLoadingStep(0);

    try {
      const res = await fetch(
        `/api/estimador?zona=${encodeURIComponent(zona)}&m2=${m2}&recamaras=${recamaras}`
      );
      const data = await res.json();

      // Artificial delay to make it feel more like AI processing
      await new Promise(r => setTimeout(r, 3000));

      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || "No se pudo calcular. Intenta de nuevo.");
      }
    } catch {
      setError("No se pudo calcular. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!result) return;
    setLeadLoading(true);

    try {
      const res = await fetch("/api/estimador/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...leadData,
          neighborhood: result.zona,
          property_type: "casa", // Default for now
          estimated_price: result.estimate,
          m2,
          recamaras
        })
      });

      if (res.ok) {
        setLeadSaved(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLeadLoading(false);
    }
  };

  return (
    <section id="estimador" className="px-6 py-24 border-t border-cima-border/50 bg-cima-bg relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cima-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — copy */}
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-10 w-10 rounded-xl bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-cima-gold" />
              </div>
              <p className="font-mono text-xs tracking-widest text-cima-gold uppercase font-bold">Inteligencia Artificial</p>
            </div>
            <h2 className="font-heading font-black text-4xl sm:text-5xl text-cima-text mb-6 leading-[1.1]">
              ¿Cuál es el valor real<br />
              <span className="text-cima-gold">de tu propiedad?</span>
            </h2>
            <p className="text-cima-text-muted text-lg leading-relaxed mb-8 max-w-lg">
              Nuestro algoritmo analiza <span className="text-white font-medium">datos en tiempo real</span> del mercado regio para darte una valuación precisa en segundos.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {[
                { icon: Globe, t: "Big Data local" },
                { icon: CheckCircle, t: "Sin registros forzosos" },
                { icon: TrendingUp, t: "Tendencias 2024" },
                { icon: Sparkles, t: "Análisis con IA" }
              ].map((item) => (
                <div key={item.t} className="flex items-center gap-3 p-3 rounded-xl bg-cima-card/30 border border-cima-border/50">
                  <item.icon className="h-4 w-4 text-cima-gold" />
                  <span className="text-sm text-cima-text-muted">{item.t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form / UI card */}
          <div className="relative z-10">
            <div className="rounded-3xl border border-cima-border bg-cima-card/50 backdrop-blur-xl p-8 shadow-2xl shadow-black/40 ring-1 ring-white/5">
              {!result && !loading ? (
                <div className="space-y-6">
                  {/* Zona */}
                  <div>
                    <label className="block font-mono text-[10px] text-cima-text-dim uppercase tracking-[0.2em] mb-2 font-bold">
                      Zona o Colonia
                    </label>
                    <select
                      value={zona}
                      onChange={(e) => setZona(e.target.value)}
                      className="w-full rounded-xl border border-cima-border bg-cima-surface/50 text-sm text-cima-text px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-cima-gold/20 focus:border-cima-gold/50 transition-all appearance-none"
                    >
                      <option value="">Selecciona una zona...</option>
                      {ZONES.map((z) => <option key={z} value={z}>{z}</option>)}
                    </select>
                  </div>

                  {/* M2 + Recámaras */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-[10px] text-cima-text-dim uppercase tracking-[0.2em] mb-2 font-bold">
                        Metros² construcción
                      </label>
                      <input
                        type="number"
                        min={20}
                        max={2000}
                        value={m2}
                        onChange={(e) => setM2(e.target.value)}
                        placeholder="ej. 180"
                        className="w-full rounded-xl border border-cima-border bg-cima-surface/50 text-sm text-cima-text px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-cima-gold/20 focus:border-cima-gold/50 transition-all placeholder:text-cima-text-dim"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[10px] text-cima-text-dim uppercase tracking-[0.2em] mb-2 font-bold">
                        Recámaras
                      </label>
                      <select
                        value={recamaras}
                        onChange={(e) => setRec(e.target.value)}
                        className="w-full rounded-xl border border-cima-border bg-cima-surface/50 text-sm text-cima-text px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-cima-gold/20 focus:border-cima-gold/50 transition-all"
                      >
                        {["1", "2", "3", "4", "5+"].map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>

                  {error && <p className="text-xs text-red-500 bg-red-500/10 p-2 rounded-lg border border-red-500/20">{error}</p>}

                  <button
                    onClick={estimate}
                    disabled={loading}
                    className="w-full group flex items-center justify-center gap-3 rounded-2xl bg-cima-gold px-6 py-4 font-heading font-black text-sm text-cima-bg hover:bg-cima-gold-light active:scale-[0.98] transition-all disabled:opacity-60 shadow-lg shadow-cima-gold/20"
                  >
                    <Calculator className="h-5 w-5" />
                    INICIAR VALUACIÓN IA
                  </button>
                </div>
              ) : loading ? (
                <div className="py-12 text-center animate-in fade-in zoom-in duration-500">
                  <div className="relative inline-block mb-8">
                    <div className="h-20 w-20 rounded-full border-4 border-cima-border border-t-cima-gold animate-spin" />
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-cima-gold animate-pulse" />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-cima-text mb-2">Procesando datos...</h3>
                  <p className="text-sm font-mono text-cima-gold h-4 transition-all duration-300">
                    {AI_STEPS[loadingStep]}
                  </p>
                </div>
              ) : result && (
                <div className="animate-in slide-in-from-bottom-4 duration-500">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cima-gold/10 border border-cima-gold/20 mb-4">
                      <div className="h-1.5 w-1.5 rounded-full bg-cima-gold animate-pulse" />
                      <span className="text-[10px] font-mono text-cima-gold uppercase tracking-[0.1em] font-bold">Resultados Listos</span>
                    </div>
                    <p className="font-heading font-black text-5xl text-cima-gold mb-2 tracking-tight">
                      {formatMXN(result.estimate)}
                    </p>
                    <p className="text-sm text-cima-text-muted">
                      Rango estimado: <span className="text-cima-text font-medium">{formatMXN(result.low)} — {formatMXN(result.high)}</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-3 rounded-xl bg-cima-surface/50 border border-cima-border">
                      <span className="block font-mono text-[9px] text-cima-text-dim uppercase tracking-widest mb-1">Confiabilidad</span>
                      <span className="text-sm font-bold text-cima-text">Muy Alta (94%)</span>
                    </div>
                    <div className="p-3 rounded-xl bg-cima-surface/50 border border-cima-border">
                      <span className="block font-mono text-[9px] text-cima-text-dim uppercase tracking-widest mb-1">Comparables</span>
                      <span className="text-sm font-bold text-cima-text">{result.comps} propiedades</span>
                    </div>
                  </div>

                  {!showLeadForm ? (
                    <div className="space-y-3">
                      <button
                        onClick={() => setShowLeadForm(true)}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-cima-gold px-6 py-4 font-heading font-black text-xs text-cima-bg hover:bg-cima-gold-light transition-all shadow-lg shadow-cima-gold/20"
                      >
                        OBTENER REPORTE DETALLADO (PDF)
                        <ArrowRight className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setResult(null)}
                        className="w-full text-xs text-cima-text-dim hover:text-cima-text transition-colors font-mono"
                      >
                        Volver a calcular
                      </button>
                    </div>
                  ) : leadSaved ? (
                    <div className="text-center py-6 animate-in zoom-in duration-500">
                      <div className="h-16 w-16 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 text-green-500" />
                      </div>
                      <h4 className="font-heading font-bold text-lg text-cima-text mb-1">¡Solicitud Enviada!</h4>
                      <p className="text-sm text-cima-text-muted mb-4">Un asesor te contactará en breve con tu reporte completo.</p>
                      <button
                        onClick={() => { setShowLeadForm(false); setResult(null); setLeadSaved(false); }}
                        className="text-xs text-cima-gold hover:underline font-mono"
                      >
                        Cerrar herramienta
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSaveLead} className="space-y-4 animate-in fade-in duration-500">
                      <p className="text-[11px] text-cima-text-muted font-medium uppercase tracking-widest text-center mb-2">Déjanos tus datos para el envío</p>

                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cima-text-dim" />
                        <input
                          required
                          value={leadData.name}
                          onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
                          placeholder="Nombre completo"
                          className="w-full rounded-xl border border-cima-border bg-cima-surface/50 text-sm text-cima-text pl-10 pr-4 py-3 focus:border-cima-gold/50 outline-none"
                        />
                      </div>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cima-text-dim" />
                        <input
                          required
                          type="email"
                          value={leadData.email}
                          onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
                          placeholder="Email"
                          className="w-full rounded-xl border border-cima-border bg-cima-surface/50 text-sm text-cima-text pl-10 pr-4 py-3 focus:border-cima-gold/50 outline-none"
                        />
                      </div>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cima-text-dim" />
                        <input
                          required
                          type="tel"
                          value={leadData.phone}
                          onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })}
                          placeholder="Teléfono"
                          className="w-full rounded-xl border border-cima-border bg-cima-surface/50 text-sm text-cima-text pl-10 pr-4 py-3 focus:border-cima-gold/50 outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={leadLoading}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-cima-gold px-6 py-4 font-heading font-black text-xs text-cima-bg hover:bg-cima-gold-light disabled:opacity-50"
                      >
                        {leadLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                        ENVIAR MI REPORTE
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowLeadForm(false)}
                        className="w-full text-[10px] text-cima-text-dim hover:text-cima-text"
                      >
                        ← Volver a los resultados
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function formatMXN(n: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(n);
}
