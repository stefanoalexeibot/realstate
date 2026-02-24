"use client";

import { useState, useMemo } from "react";
import { Calculator, Copy, Phone, Check, TrendingDown, CheckCircle2 } from "lucide-react";

const IVA = 0.16;

function fmt(n: number) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n);
}

// ─── Commission tiers ────────────────────────────────────────────────────────

const PRICE_TIERS = [
  { label: "Hasta $1,000,000", max: 1_000_000, pct: 6 },
  { label: "$1,000,001 – $3,000,000", max: 3_000_000, pct: 5 },
  { label: "$3,000,001 – $6,000,000", max: 6_000_000, pct: 4.5 },
  { label: "$6,000,001 – $10,000,000", max: 10_000_000, pct: 4 },
  { label: "Más de $10,000,000", max: Infinity, pct: 3.5 }, // midpoint of 3-4%
];

const INCLUDED_SERVICES = [
  "Sesión fotográfica y video profesional",
  "Decoración, limpieza y remodelación virtual con IA",
  "Publicidad digital pagada en todos los portales",
  "Asesoría legal completa hasta notaría",
  "Garantía: 30 días o comisión cero*",
];

function suggestedPct(price: number): number {
  const tier = PRICE_TIERS.find((t) => price <= t.max);
  return tier?.pct ?? 3.5;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function CotizadorPage() {
  const [price, setPrice] = useState("");
  const [commPct, setCommPct] = useState("5");
  const [opType, setOpType] = useState<"venta" | "renta">("venta");
  const [ivaEnabled, setIvaEnabled] = useState(true);
  const [splitEnabled, setSplitEnabled] = useState(false);
  const [agentCount, setAgentCount] = useState<2 | 3>(2);
  const [captadorPct, setCaptadorPct] = useState("50");
  const [cerradorPct, setCerradorPct] = useState("25"); // Only for 3 agents
  const [copied, setCopied] = useState(false);

  const priceNum = Number(price.replace(/,/g, "")) || 0;
  const suggested = priceNum > 0 ? suggestedPct(priceNum) : null;

  const nums = useMemo(() => {
    const p = priceNum;
    const pct = Number(commPct) / 100;
    const gross = opType === "venta" ? p * pct : p;
    const iva = ivaEnabled ? gross * IVA : 0;
    const net = gross + iva;

    // Splits
    let agents: { role: string; pct: number; net: number }[] = [];
    if (splitEnabled) {
      if (agentCount === 2) {
        const cPct = Number(captadorPct);
        const vPct = 100 - cPct;
        const cAmount = gross * (cPct / 100);
        const vAmount = gross - cAmount;
        agents = [
          { role: "Captador", pct: cPct, net: cAmount + (ivaEnabled ? cAmount * IVA : 0) },
          { role: "Vendedor", pct: vPct, net: vAmount + (ivaEnabled ? vAmount * IVA : 0) },
        ];
      } else {
        const cPct = Number(captadorPct);
        const zPct = Number(cerradorPct);
        const vPct = 100 - cPct - zPct;
        const cAmount = gross * (cPct / 100);
        const zAmount = gross * (zPct / 100);
        const vAmount = gross - cAmount - zAmount;
        agents = [
          { role: "Captador", pct: cPct, net: cAmount + (ivaEnabled ? cAmount * IVA : 0) },
          { role: "Cerrador", pct: zPct, net: zAmount + (ivaEnabled ? zAmount * IVA : 0) },
          { role: "Vendedor", pct: vPct, net: vAmount + (ivaEnabled ? vAmount * IVA : 0) },
        ];
      }
    }

    return { p, gross, iva, net, agents };
  }, [priceNum, commPct, opType, ivaEnabled, splitEnabled, agentCount, captadorPct, cerradorPct]);

  function buildText() {
    const lines = [
      `🏠 Cotización Cima Propiedades`,
      ``,
      `Operación: ${opType === "venta" ? "Venta" : "Renta"}`,
      opType === "venta" ? `Precio de venta: ${fmt(nums.p)}` : `Renta mensual: ${fmt(nums.p)}`,
      opType === "venta" ? `Comisión (${commPct}%): ${fmt(nums.gross)}` : `Comisión (1 mes): ${fmt(nums.gross)}`,
      ivaEnabled ? `IVA (16%): ${fmt(nums.iva)}` : null,
      `Total comisión: ${fmt(nums.net)}`,
      ``,
      `* Comisión se paga al momento de escriturar.`,
    ].filter(Boolean);
    if (splitEnabled) {
      lines.push(``, `División entre agentes:`);
      nums.agents.forEach(a => {
        lines.push(`  ${a.role} (${a.pct}%): ${fmt(a.net)}`);
      });
    }
    return lines.join("\n");
  }

  async function copyText() {
    await navigator.clipboard.writeText(buildText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function shareWA() {
    window.open(`https://wa.me/?text=${encodeURIComponent(buildText())}`, "_blank");
  }

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-8">

      {/* Header */}
      <div>
        <p className="font-mono text-[10px] tracking-[0.2em] text-cima-gold uppercase mb-1">Herramienta</p>
        <h1 className="font-heading font-bold text-2xl text-cima-text flex items-center gap-2.5">
          <Calculator className="h-5 w-5 text-cima-gold" />
          Cotizador de comisiones
        </h1>
        <p className="text-sm text-cima-text-muted mt-1">Calcula la comisión estimada de cualquier operación. Comisión se paga al escriturar.</p>
      </div>

      {/* Reference tables */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* By price */}
        <div className="rounded-xl border border-cima-border bg-cima-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="h-3.5 w-3.5 text-cima-gold" />
            <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">Comisión por valor de venta</p>
          </div>
          <div className="space-y-2">
            {PRICE_TIERS.map((t) => (
              <div key={t.label} className="flex items-center justify-between gap-2">
                <span className="text-xs text-cima-text-muted">{t.label}</span>
                <span className={`font-mono font-bold text-sm shrink-0 ${suggested === t.pct && priceNum > 0 ? "text-cima-gold" : "text-cima-text"
                  }`}>
                  {t.pct}%
                  {suggested === t.pct && priceNum > 0 && (
                    <span className="ml-1 text-[9px] font-normal text-cima-gold/70">← sugerida</span>
                  )}
                </span>
              </div>
            ))}
            <p className="text-[10px] text-cima-text-dim pt-1 border-t border-cima-border">Todo % es negociable. Se paga al escriturar.</p>
          </div>
        </div>

        {/* Included services */}
        <div className="rounded-xl border border-cima-gold/20 bg-cima-gold/5 p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="h-3.5 w-3.5 text-cima-gold" />
            <p className="font-mono text-[10px] tracking-[0.15em] text-cima-gold uppercase">Incluido en toda exclusiva</p>
          </div>
          <div className="space-y-2">
            {INCLUDED_SERVICES.map((s) => (
              <div key={s} className="flex items-start gap-2">
                <CheckCircle2 className="h-3 w-3 text-cima-gold shrink-0 mt-0.5" />
                <span className="text-xs text-cima-text-muted leading-snug">{s}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-lg bg-cima-surface/50 border border-cima-border px-3 py-2">
            <p className="text-[10px] text-cima-text-dim leading-relaxed">
              *Garantía sujeta a colaboración oportuna del propietario (llaves, docs, escrituras sin adeudos).
            </p>
          </div>
        </div>
      </div>

      {/* Calculator */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

        {/* Inputs */}
        <div className="rounded-xl border border-cima-border bg-cima-card p-5 space-y-4">
          <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">Calculadora</p>

          {/* Operation type */}
          <div>
            <label className="block text-xs font-medium text-cima-text-muted mb-2">Tipo de operación</label>
            <div className="flex rounded-lg overflow-hidden border border-cima-border">
              {(["venta", "renta"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => { setOpType(t); if (t === "renta") setCommPct("100"); else setCommPct("5"); }}
                  className={`flex-1 py-2 text-xs font-medium transition-colors ${opType === t ? "bg-cima-gold text-cima-bg" : "bg-cima-surface text-cima-text-muted hover:text-cima-text"
                    }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-medium text-cima-text-muted mb-1.5">
              {opType === "venta" ? "Precio de venta (MXN)" : "Renta mensual (MXN)"}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-cima-text-muted">$</span>
              <input
                type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)}
                placeholder="2,500,000"
                className="w-full rounded-lg bg-cima-surface border border-cima-border pl-6 pr-3 py-2.5 text-sm text-cima-text focus:outline-none focus:border-cima-gold/50 transition-colors"
              />
            </div>
            {/* Auto-suggest */}
            {suggested !== null && opType === "venta" && (
              <button
                onClick={() => setCommPct(suggested.toString())}
                className="mt-1.5 text-[11px] text-cima-gold hover:underline"
              >
                Usar comisión sugerida: {suggested}%
              </button>
            )}
          </div>

          {/* Commission % (only for venta) */}
          {opType === "venta" && (
            <div>
              <label className="block text-xs font-medium text-cima-text-muted mb-1.5">
                Comisión (%) — <span className="text-cima-gold font-bold">{commPct}%</span>
              </label>
              <input
                type="range" min="1" max="10" step="0.5" value={commPct}
                onChange={(e) => setCommPct(e.target.value)}
                className="w-full accent-cima-gold"
              />
              <div className="flex justify-between text-[10px] text-cima-text-dim font-mono mt-1">
                <span>1%</span><span>5%</span><span>10%</span>
              </div>
            </div>
          )}
          {opType === "renta" && (
            <div className="rounded-lg bg-cima-surface border border-cima-border px-3 py-2.5">
              <p className="text-xs text-cima-text-muted">Comisión de renta: <span className="text-cima-gold font-bold">1 mes de renta</span></p>
            </div>
          )}

          {/* IVA */}
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={ivaEnabled} onChange={(e) => setIvaEnabled(e.target.checked)}
              className="h-4 w-4 rounded border-cima-border bg-cima-surface accent-cima-gold" />
            <span className="text-sm text-cima-text-muted">Incluir IVA 16%</span>
          </label>

          {/* Split */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={splitEnabled} onChange={(e) => setSplitEnabled(e.target.checked)}
                  className="h-4 w-4 rounded border-cima-border bg-cima-surface accent-cima-gold" />
                <span className="text-sm font-medium text-cima-text">Dividir entre agentes</span>
              </label>
              {splitEnabled && (
                <div className="flex bg-cima-surface rounded-md border border-cima-border p-0.5">
                  {[2, 3].map(n => (
                    <button
                      key={n}
                      onClick={() => setAgentCount(n as 2 | 3)}
                      className={`px-3 py-1 text-[10px] font-bold rounded ${agentCount === n ? "bg-cima-gold text-cima-bg" : "text-cima-text-muted"}`}
                    >
                      {n} AGENTES
                    </button>
                  ))}
                </div>
              )}
            </div>

            {splitEnabled && (
              <div className="space-y-4 pl-6 border-l border-cima-gold/20">
                {/* Agent 1: Captador */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <label className="text-xs text-cima-text-muted">Captador</label>
                    <span className="text-xs font-bold text-cima-gold">{captadorPct}%</span>
                  </div>
                  <input
                    type="range" min="0" max={agentCount === 3 ? 100 - Number(cerradorPct) : 100} step="5" value={captadorPct}
                    onChange={(e) => setCaptadorPct(e.target.value)}
                    className="w-full accent-cima-gold"
                  />
                </div>

                {/* Agent 2: Cerrador (only if 3 agents) */}
                {agentCount === 3 && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <label className="text-xs text-cima-text-muted">Cerrador</label>
                      <span className="text-xs font-bold text-cima-gold">{cerradorPct}%</span>
                    </div>
                    <input
                      type="range" min="0" max={100 - Number(captadorPct)} step="5" value={cerradorPct}
                      onChange={(e) => setCerradorPct(e.target.value)}
                      className="w-full accent-cima-gold"
                    />
                  </div>
                )}

                {/* Agent 3 / Rest: Vendedor */}
                <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-cima-surface border border-cima-border">
                  <span className="text-xs text-cima-text-muted">Vendedor / Acompañante</span>
                  <span className="text-xs font-bold text-cima-text-dim">
                    {agentCount === 2 ? 100 - Number(captadorPct) : 100 - Number(captadorPct) - Number(cerradorPct)}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="rounded-xl border border-cima-gold/20 bg-cima-gold/5 p-5 space-y-3">
            <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">Desglose</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-cima-text-muted">
                  {opType === "venta" ? `Comisión (${commPct}%)` : "Comisión (1 mes)"}
                </span>
                <span className="font-mono font-bold text-cima-text">{fmt(nums.gross)}</span>
              </div>
              {ivaEnabled && (
                <div className="flex justify-between">
                  <span className="text-cima-text-muted">IVA (16%)</span>
                  <span className="font-mono text-cima-text-muted">{fmt(nums.iva)}</span>
                </div>
              )}
              <div className="border-t border-cima-gold/20 pt-2 flex justify-between">
                <span className="font-medium text-cima-text">Total comisión</span>
                <span className="font-heading font-bold text-xl text-cima-gold">{fmt(nums.net)}</span>
              </div>
              <p className="text-[10px] text-cima-text-dim pt-1">Se paga al escriturar.</p>
            </div>
          </div>

          {splitEnabled && (
            <div className="rounded-xl border border-cima-border bg-cima-card p-5 space-y-3">
              <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">División por agente</p>
              <div className="space-y-4">
                {nums.agents.map((a) => (
                  <div key={a.role} className="flex items-center gap-3">
                    <div className="flex-1">
                      <p className="text-xs font-medium text-cima-text">{a.role}</p>
                      <p className="text-[10px] text-cima-text-dim">{a.pct}% de la comisión</p>
                    </div>
                    <p className="font-mono font-bold text-sm text-cima-gold">{fmt(a.net)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={copyText}
              disabled={!nums.p}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-cima-border bg-cima-surface text-sm text-cima-text-muted hover:text-cima-text hover:border-cima-gold/40 disabled:opacity-40 transition-colors"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copiado" : "Copiar"}
            </button>
            <button
              onClick={shareWA}
              disabled={!nums.p}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#25D366]/10 border border-[#25D366]/20 text-sm text-[#25D366] hover:bg-[#25D366]/20 disabled:opacity-40 transition-colors"
            >
              <Phone className="h-4 w-4" />
              WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
