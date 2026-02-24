"use client";

import {
  Home, Clock, Star, TrendingUp, Camera, MapPin, Percent, Shield,
} from "lucide-react";

const STATS = [
  { Icon: Home, text: "85+ propiedades vendidas en MTY" },
  { Icon: Clock, text: "22 días tiempo promedio de venta" },
  { Icon: Star, text: "5 estrellas en satisfacción de clientes" },
  { Icon: Percent, text: "Comisión desde 6% · se paga al escriturar" },
  { Icon: Shield, text: "Exclusiva de 60 días · dedicación total" },
  { Icon: Camera, text: "Fotografía profesional incluida" },
  { Icon: TrendingUp, text: "Valuación gratuita · sin costo inicial" },
  { Icon: MapPin, text: "San Pedro · Valle Oriente · Cumbres · Obispado" },
];

const ITEMS = [...STATS, ...STATS];

export default function StatsMarquee() {
  return (
    <div className="relative overflow-hidden border-y border-cima-border bg-cima-card/60 py-3.5">
      {/* Fade masks */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-cima-bg to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-cima-bg to-transparent" />

      <div className="flex gap-0 animate-marquee whitespace-nowrap">
        {ITEMS.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2.5 px-8 text-xs text-cima-text-muted font-mono"
          >
            <item.Icon className="h-3 w-3 text-cima-gold shrink-0" />
            {item.text}
            <span className="text-cima-border ml-4">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
