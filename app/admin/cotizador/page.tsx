"use client";

import { useState, useMemo } from "react";
import { Calculator, Copy, Phone, Check } from "lucide-react";

const IVA = 0.16;

function fmt(n: number) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n);
}

export default function CotizadorPage() {
  const [price, setPrice] = useState("");
  const [commPct, setCommPct] = useState("3");
  const [opType, setOpType] = useState<"venta" | "renta">("venta");
  const [ivaEnabled, setIvaEnabled] = useState(true);
  const [splitEnabled, setSplitEnabled] = useState(false);
  const [captadorPct, setCaptadorPct] = useState("50");
  const [copied, setCopied] = useState(false);

  const nums = useMemo(() => {
    const p = Number(price.replace(/,/g, "")) || 0;
    const pct = Number(commPct) / 100;
    const gross = opType === "venta" ? p * pct : p; // renta = 1 mes
    const iva = ivaEnabled ? gross * IVA : 0;
    const net = gross + iva;
    const captador = splitEnabled ? gross * (Number(captadorPct) / 100) : 0;
    const vendedor = splitEnabled ? gross - captador : 0;
    const captadorNet = splitEnabled ? captador + (ivaEnabled ? captador * IVA : 0) : 0;
    const vendedorNet = splitEnabled ? vendedor + (ivaEnabled ? vendedor * IVA : 0) : 0;
    return { p, gross, iva, net, captador, vendedor, captadorNet, vendedorNet };
  }, [price, commPct, opType, ivaEnabled, splitEnabled, captadorPct]);

  function buildText() {
    const lines = [
      `🏠 Cotización Cima Propiedades`,
      ``,
      `Operación: ${opType === "venta" ? "Venta" : "Renta"}`,
      opType === "venta"
        ? `Precio de venta: ${fmt(nums.p)}`
        : `Renta mensual: ${fmt(nums.p)}`,
      opType === "venta"
        ? `Comisión (${commPct}%): ${fmt(nums.gross)}`
        : `Comisión (1 mes): ${fmt(nums.gross)}`,
      ivaEnabled ? `IVA (16%): ${fmt(nums.iva)}` : null,
      `Total comisión: ${fmt(nums.net)}`,
    ].filter(Boolean);

    if (splitEnabled) {
      lines.push(``, `División:`);
      lines.push(`  Captador (${captadorPct}%): ${fmt(nums.captadorNet)}`);
      lines.push(`  Vendedor (${100 - Number(captadorPct)}%): ${fmt(nums.vendedorNet)}`);
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
    <div className="p-6 sm:p-8 max-w-3xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <p className="font-mono text-[10px] tracking-[0.2em] text-cima-gold uppercase mb-1">Herramienta</p>
        <h1 className="font-heading font-bold text-2xl text-cima-text flex items-center gap-2.5">
          <Calculator className="h-5 w-5 text-cima-gold" />
          Cotizador de comisiones
        </h1>
        <p className="text-sm text-cima-text-muted mt-1">Calcula la comisión estimada de cualquier operación al instante.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

        {/* Inputs */}
        <div className="rounded-xl border border-cima-border bg-cima-card p-5 space-y-4">
          <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">Parámetros</p>

          {/* Operation type */}
          <div>
            <label className="block text-xs font-medium text-cima-text-muted mb-2">Tipo de operación</label>
            <div className="flex rounded-lg overflow-hidden border border-cima-border">
              {(["venta", "renta"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => { setOpType(t); if (t === "renta") setCommPct("100"); else setCommPct("3"); }}
                  className={`flex-1 py-2 text-xs font-medium transition-colors ${
                    opType === t
                      ? "bg-cima-gold text-cima-bg"
                      : "bg-cima-surface text-cima-text-muted hover:text-cima-text"
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
          </div>

          {/* Commission % (only for venta) */}
          {opType === "venta" && (
            <div>
              <label className="block text-xs font-medium text-cima-text-muted mb-1.5">
                Comisión (%) — {commPct}%
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
          <div className="space-y-2">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={splitEnabled} onChange={(e) => setSplitEnabled(e.target.checked)}
                className="h-4 w-4 rounded border-cima-border bg-cima-surface accent-cima-gold" />
              <span className="text-sm text-cima-text-muted">Dividir entre agentes</span>
            </label>
            {splitEnabled && (
              <div>
                <label className="block text-xs font-medium text-cima-text-muted mb-1.5">
                  Captador — {captadorPct}% · Vendedor — {100 - Number(captadorPct)}%
                </label>
                <input
                  type="range" min="0" max="100" step="10" value={captadorPct}
                  onChange={(e) => setCaptadorPct(e.target.value)}
                  className="w-full accent-cima-gold"
                />
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
            </div>
          </div>

          {splitEnabled && (
            <div className="rounded-xl border border-cima-border bg-cima-card p-5 space-y-3">
              <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">División por agente</p>
              <div className="space-y-3">
                {[
                  { role: "Captador", pct: Number(captadorPct), net: nums.captadorNet },
                  { role: "Vendedor", pct: 100 - Number(captadorPct), net: nums.vendedorNet },
                ].map((a) => (
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

          {/* Quick reference */}
          <div className="rounded-xl border border-cima-border bg-cima-card p-4">
            <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase mb-3">Referencia rápida — 3%</p>
            <div className="space-y-1.5">
              {[500000, 1000000, 2000000, 3500000, 5000000].map((p) => (
                <div key={p} className="flex justify-between items-center">
                  <span className="text-xs text-cima-text-muted">{fmt(p)}</span>
                  <span className="font-mono text-xs text-cima-gold font-bold">
                    {fmt(p * 0.03 * (ivaEnabled ? 1.16 : 1))}
                    {ivaEnabled && <span className="text-cima-text-dim font-normal"> c/IVA</span>}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
