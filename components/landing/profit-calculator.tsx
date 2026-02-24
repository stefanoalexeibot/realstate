"use client";

import { useState } from "react";
import { TrendingUp, CheckCircle2 } from "lucide-react";

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

function getCommissionPct(v: number): number {
  if (v <= 1_000_000) return 6;
  if (v <= 3_000_000) return 5;
  if (v <= 6_000_000) return 4.5;
  if (v <= 10_000_000) return 4;
  return 3.5;
}

export default function ProfitCalculator() {
  const [value, setValue] = useState(DEFAULT);

  const commPct = getCommissionPct(value) / 100;
  const cimaComm = value * commPct;
  const cimaNet = value - cimaComm;
  const tradComm = value * 0.07;
  const tradNet = value * 0.93;
  const savings = tradComm - cimaComm;
  const pct = ((value - MIN) / (MAX - MIN)) * 100;

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

      {/* Net amount card */}
      <div className="rounded-xl border border-cima-gold/30 bg-cima-gold/5 p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[10px] tracking-widest text-cima-gold uppercase">Con Cima · {getCommissionPct(value)}% comisión</span>
          <TrendingUp className="h-4 w-4 text-cima-gold" />
        </div>
        <div className="flex items-baseline gap-3">
          <p className="font-heading font-bold text-3xl text-cima-text tabular-nums leading-none">
            {fmt(cimaNet)}
          </p>
          <p className="text-sm text-cima-text-muted">recibes tú</p>
        </div>
      </div>

      {/* Included differentiators */}
      <div className="rounded-xl border border-cima-border bg-cima-surface/50 p-5">
        <p className="font-mono text-[10px] tracking-widest text-cima-gold uppercase mb-3">Incluido sin costo extra</p>
        <div className="space-y-2.5">
          {[
            "Sesión fotográfica y video profesional",
            "Decoración, limpieza y remodelación virtual con IA",
            "Publicidad digital pagada en todos los portales",
            "Asesoría legal completa hasta notaría",
            "Garantía: 30 días o comisión cero",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-cima-gold shrink-0" />
              <p className="text-xs text-cima-text-muted">{item}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-[10px] text-cima-text-dim mt-4 font-mono">
        * Comisión varía según valor de la propiedad · pagadera al escriturar
      </p>
    </div>
  );
}
