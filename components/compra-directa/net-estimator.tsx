"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface NetRange {
  low: number;
  high: number;
}

function fmt(n: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function NetEstimator() {
  const [grossM, setGrossM] = useState(3); // en millones MXN
  const [conditionDiscount, setConditionDiscount] = useState(5); // % descuento por condición
  const [closingCosts, setClosingCosts] = useState(4); // % gastos de cierre estimados

  const gross = grossM * 1_000_000;
  const totalDiscount = (conditionDiscount + closingCosts) / 100;
  const netLow = gross * (1 - totalDiscount - 0.03); // margen adicional bajo
  const netHigh = gross * (1 - totalDiscount);

  const range: NetRange = {
    low: Math.max(0, netLow),
    high: Math.max(0, netHigh),
  };

  const barWidth = Math.min(100, ((range.low / gross) * 100));

  return (
    <div className="rounded-2xl border border-cima-border bg-cima-card p-6 md:p-8">
      <div className="mb-6">
        <p className="text-xs font-mono text-cima-gold uppercase tracking-widest mb-1">
          Estimador educativo
        </p>
        <h3 className="text-xl font-heading font-bold text-cima-text mb-1">
          ¿Cuánto podría quedarme neto?
        </h3>
        <p className="text-sm text-cima-text-muted">
          Ajusta los valores para entender los rangos típicos. Este estimador es
          orientativo — la oferta real depende de la evaluación de Cima.
        </p>
      </div>

      <div className="space-y-6">
        {/* Slider: Precio bruto estimado */}
        <SliderField
          id="est-gross"
          label="Precio bruto estimado de la propiedad"
          value={grossM}
          min={0.5}
          max={15}
          step={0.25}
          displayValue={`${fmt(grossM * 1_000_000)}`}
          onChange={setGrossM}
        />

        {/* Slider: Descuento por condición */}
        <SliderField
          id="est-condition"
          label="Descuento estimado por condición / ajuste de mercado"
          value={conditionDiscount}
          min={0}
          max={30}
          step={1}
          displayValue={`${conditionDiscount}%`}
          onChange={setConditionDiscount}
          hint="Rango típico: 5–20% dependiendo del estado de la propiedad"
        />

        {/* Slider: Gastos de cierre */}
        <SliderField
          id="est-closing"
          label="Gastos de cierre estimados"
          value={closingCosts}
          min={2}
          max={10}
          step={0.5}
          displayValue={`${closingCosts}%`}
          onChange={setClosingCosts}
          hint="Incluye escrituración, ISR, derechos notariales. Varía según el caso."
        />
      </div>

      {/* Resultado */}
      <div className="mt-8 rounded-xl border border-cima-gold/20 bg-cima-gold/5 p-5">
        <p className="text-xs font-mono text-cima-text-muted uppercase tracking-widest mb-3">
          Rango neto estimado
        </p>
        <div className="flex items-end justify-between gap-4 mb-4">
          <div>
            <p className="text-2xl font-heading font-bold text-cima-gold">
              {fmt(range.low)}
            </p>
            <p className="text-xs text-cima-text-dim mt-0.5">Estimado bajo</p>
          </div>
          <div className="text-cima-text-dim text-xl">→</div>
          <div className="text-right">
            <p className="text-2xl font-heading font-bold text-cima-gold-light">
              {fmt(range.high)}
            </p>
            <p className="text-xs text-cima-text-dim mt-0.5">Estimado alto</p>
          </div>
        </div>

        {/* Barra visual */}
        <div className="h-2 bg-cima-border rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cima-gold-dim to-cima-gold rounded-full"
            animate={{ width: `${barWidth}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-cima-text-dim">$0</span>
          <span className="text-[10px] text-cima-text-dim">{fmt(gross)}</span>
        </div>
      </div>

      <p className="mt-4 text-xs text-cima-text-dim leading-relaxed">
        ⚠️ Este estimador es puramente orientativo y no constituye una oferta.
        Los montos reales dependen de la avalúo, condiciones del inmueble,
        adeudos activos y la evaluación final de Cima Propiedades.
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Slider Field
// ─────────────────────────────────────────────────────────────────────────────
function SliderField({
  id,
  label,
  value,
  min,
  max,
  step,
  displayValue,
  onChange,
  hint,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  displayValue: string;
  onChange: (v: number) => void;
  hint?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label htmlFor={id} className="text-sm text-cima-text-muted">
          {label}
        </label>
        <span className="text-sm font-mono font-semibold text-cima-gold shrink-0 ml-4">
          {displayValue}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="np-slider w-full h-1.5 rounded-full bg-cima-border accent-[#C8A96E] cursor-pointer"
        style={{
          background: `linear-gradient(to right, #C8A96E ${((value - min) / (max - min)) * 100}%, #23252F ${((value - min) / (max - min)) * 100}%)`,
        }}
      />
      {hint && (
        <p className="mt-1.5 text-xs text-cima-text-dim">{hint}</p>
      )}
    </div>
  );
}
