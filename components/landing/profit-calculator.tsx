"use client";

import { useState } from "react";
import { TrendingDown, TrendingUp, Sparkles } from "lucide-react";

const MIN = 500_000;
const MAX = 20_000_000;
const DEFAULT = 4_000_000;

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  return `$${(n / 1_000).toFixed(0)}K`;
}

function fmtFull(n: number) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n);
}

export default function ProfitCalculator() {
  const [value, setValue] = useState(DEFAULT);

  const cimaComm    = value * 0.05;
  const cimaNet     = value * 0.95;
  const tradComm    = value * 0.07;
  const tradNet     = value * 0.93;
  const savings     = tradComm - cimaComm;
  const pct         = ((value - MIN) / (MAX - MIN)) * 100;

  return (
    <div className="rounded-2xl border border-cima-gold/20 bg-cima-card p-6 sm:p-8 gold-glow">
      {/* Slider header */}
      <div className="flex items-end justify-between mb-2">
        <p className="text-sm text-cima-text-muted">Valor de tu propiedad</p>
        <p className="font-heading font-bold text-2xl text-cima-gold tabular-nums">{fmt(value)}</p>
      </div>

      {/* Slider */}
      <div className="relative mb-8">
        <input
          type="range"
          min={MIN}
          max={MAX}
          step={100_000}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer np-slider"
          style={{
            background: `linear-gradient(to right, #C8A96E ${pct}%, #23252F ${pct}%)`,
          }}
        />
        <div className="flex justify-between mt-1.5">
          <span className="font-mono text-[10px] text-cima-text-dim">$500K</span>
          <span className="font-mono text-[10px] text-cima-text-dim">$20M</span>
        </div>
      </div>

      {/* Comparison cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Cima */}
        <div className="rounded-xl border border-cima-gold/30 bg-cima-gold/5 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[10px] tracking-widest text-cima-gold uppercase">Con Cima · 5%</span>
            <TrendingUp className="h-4 w-4 text-cima-gold" />
          </div>
          <p className="font-heading font-bold text-2xl text-cima-text tabular-nums leading-none">
            {fmt(cimaNet)}
          </p>
          <p className="text-xs text-cima-text-muted mt-1.5">recibes tú</p>
          <div className="mt-3 pt-3 border-t border-cima-gold/15">
            <p className="text-xs text-cima-text-dim">
              Comisión: <span className="text-cima-text-muted">{fmtFull(cimaComm)}</span>
            </p>
          </div>
        </div>

        {/* Traditional */}
        <div className="rounded-xl border border-cima-border bg-cima-surface/50 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[10px] tracking-widest text-cima-text-dim uppercase">Agencia típica · 7%</span>
            <TrendingDown className="h-4 w-4 text-cima-text-dim" />
          </div>
          <p className="font-heading font-bold text-2xl text-cima-text-muted tabular-nums leading-none">
            {fmt(tradNet)}
          </p>
          <p className="text-xs text-cima-text-dim mt-1.5">recibirías tú</p>
          <div className="mt-3 pt-3 border-t border-cima-border">
            <p className="text-xs text-cima-text-dim">
              Comisión: <span className="text-cima-text-muted">{fmtFull(tradComm)}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Savings highlight */}
      <div className="rounded-xl bg-gradient-to-r from-cima-gold/10 to-cima-gold/5 border border-cima-gold/20 p-4 flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-cima-gold/15 flex items-center justify-center shrink-0">
          <Sparkles className="h-4 w-4 text-cima-gold" />
        </div>
        <div>
          <p className="text-sm font-heading font-semibold text-cima-text">
            Te ahorras <span className="text-cima-gold">{fmtFull(savings)}</span> con Cima
          </p>
          <p className="text-xs text-cima-text-muted">vs. una agencia que cobra el 7% de comisión</p>
        </div>
      </div>

      <p className="text-center text-[10px] text-cima-text-dim mt-4 font-mono">
        * La mayoría de inmobiliarias en MTY cobran entre 6% y 10%
      </p>
    </div>
  );
}
