"use client";

import { useState, useMemo } from "react";
import { Calculator } from "lucide-react";

function calcMonthly(price: number, downPct: number, years: number): number {
  const principal = price * (1 - downPct / 100);
  const r = 10.5 / 100 / 12;
  const n = years * 12;
  return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

function fmt(n: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency", currency: "MXN", maximumFractionDigits: 0,
  }).format(n);
}

export default function MortgageCalculator({ price }: { price: number }) {
  const [downPct, setDownPct] = useState(20);
  const [years, setYears]     = useState(20);

  const monthly = useMemo(() => calcMonthly(price, downPct, years), [price, downPct, years]);
  const down    = price * downPct / 100;
  const loan    = price - down;

  return (
    <div className="rounded-xl border border-cima-border bg-cima-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="h-4 w-4 text-cima-gold" />
        <h3 className="font-heading font-semibold text-sm text-cima-text">Calculadora de mensualidad</h3>
      </div>

      {/* Enganche */}
      <div className="mb-4">
        <div className="flex justify-between text-[10px] font-mono text-cima-text-muted mb-1.5">
          <span>Enganche</span>
          <span className="text-cima-gold">{downPct}% — {fmt(down)}</span>
        </div>
        <input
          type="range" min={10} max={40} step={5} value={downPct}
          onChange={(e) => setDownPct(Number(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-[#C8A96E]"
          style={{ background: `linear-gradient(to right, #C8A96E ${(downPct - 10) / 30 * 100}%, #2a2a2a ${(downPct - 10) / 30 * 100}%)` }}
        />
        <div className="flex justify-between text-[9px] font-mono text-cima-text-dim mt-1">
          <span>10%</span><span>40%</span>
        </div>
      </div>

      {/* Plazo */}
      <div className="mb-5">
        <p className="text-[10px] font-mono text-cima-text-muted mb-1.5">Plazo</p>
        <div className="flex gap-2">
          {[10, 15, 20].map((y) => (
            <button
              key={y}
              onClick={() => setYears(y)}
              className={`flex-1 py-1.5 rounded-lg text-[11px] font-mono border transition-colors ${
                years === y
                  ? "bg-cima-gold text-cima-bg border-cima-gold font-semibold"
                  : "border-cima-border text-cima-text-muted hover:border-cima-gold/40 hover:text-cima-text"
              }`}
            >
              {y} años
            </button>
          ))}
        </div>
      </div>

      {/* Resultado */}
      <div className="rounded-lg bg-cima-surface border border-cima-border/60 px-4 py-3 text-center">
        <p className="text-[10px] font-mono text-cima-text-dim uppercase tracking-widest mb-0.5">
          Mensualidad estimada
        </p>
        <p className="font-heading font-bold text-2xl text-cima-gold">{fmt(monthly)}</p>
        <p className="text-[10px] text-cima-text-dim mt-1">
          Crédito de {fmt(loan)} · Tasa ref. 10.5% anual
        </p>
      </div>
    </div>
  );
}
