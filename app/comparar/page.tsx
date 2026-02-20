"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";
import {
  Building2, BedDouble, Bath, Maximize2, Car,
  GitCompare, CheckCircle2, XCircle,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Property } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function Row({ label, values }: { label: string; values: (string | number | null | undefined)[] }) {
  return (
    <tr className="border-t border-cima-border/50">
      <td className="px-4 py-3 text-[11px] font-mono text-cima-text-dim uppercase tracking-widest bg-cima-surface whitespace-nowrap w-28">
        {label}
      </td>
      {values.map((v, i) => (
        <td key={i} className="px-4 py-3 text-sm text-cima-text text-center">
          {v ?? <span className="text-cima-text-dim">—</span>}
        </td>
      ))}
    </tr>
  );
}

function ComparadorInner() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    const ids = (searchParams.get("ids") ?? "").split(",").filter(Boolean).slice(0, 3);
    if (!ids.length) { setLoading(false); return; }

    createClient()
      .from("re_properties")
      .select("*, re_photos(url, is_cover)")
      .in("id", ids)
      .then(({ data }) => {
        // Keep original order from URL
        const sorted = ids
          .map((id) => (data ?? []).find((p) => p.id === id))
          .filter(Boolean) as Property[];
        setProperties(sorted);
        setLoading(false);
      });
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="h-6 w-6 rounded-full border-2 border-cima-gold border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!properties.length) {
    return (
      <div className="text-center py-24">
        <GitCompare className="h-10 w-10 text-cima-text-dim mx-auto mb-3" />
        <p className="text-cima-text-muted mb-2">No hay propiedades para comparar.</p>
        <Link href="/propiedades" className="text-sm text-cima-gold hover:underline">
          Ir al catálogo →
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px]">
        <thead>
          <tr>
            <th className="w-28" />
            {properties.map((p) => (
              <th key={p.id} className="pb-4 px-4 align-top">
                <div className="rounded-xl border border-cima-border bg-cima-card overflow-hidden">
                  <div className="relative h-40 bg-cima-surface">
                    {p.cover_photo ? (
                      <Image src={p.cover_photo} alt={p.title} fill className="object-cover" sizes="300px" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Building2 className="h-8 w-8 text-cima-gold/20" />
                      </div>
                    )}
                    <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-mono font-semibold tracking-widest uppercase ${
                      p.operation_type === "renta" ? "bg-blue-500/80 text-blue-100" : "bg-cima-gold/90 text-cima-bg"
                    }`}>
                      {p.operation_type === "renta" ? "Renta" : "Venta"}
                    </span>
                  </div>
                  <div className="p-3 text-left">
                    <p className="font-heading font-bold text-cima-gold text-base">
                      {formatPrice(p.price)}{p.operation_type === "renta" ? "/mes" : ""}
                    </p>
                    <p className="text-xs text-cima-text leading-snug mt-0.5 line-clamp-2">{p.title}</p>
                    <Link
                      href={`/propiedades/${p.slug}`}
                      className="text-[10px] text-cima-gold hover:underline mt-1.5 block font-mono"
                    >
                      Ver propiedad →
                    </Link>
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <Row label="Precio"     values={properties.map((p) => `${formatPrice(p.price)}${p.operation_type === "renta" ? "/mes" : ""}`)} />
          <Row label="Tipo"       values={properties.map((p) => p.property_type)} />
          <Row label="Operación"  values={properties.map((p) => p.operation_type === "renta" ? "Renta" : "Venta")} />
          <Row label="Zona"       values={properties.map((p) => p.neighborhood ?? "—")} />
          <tr className="border-t border-cima-border/50">
            <td className="px-4 py-3 text-[11px] font-mono text-cima-text-dim uppercase tracking-widest bg-cima-surface">Recámaras</td>
            {properties.map((p) => (
              <td key={p.id} className="px-4 py-3 text-center">
                <span className={`flex items-center justify-center gap-1 text-sm ${p.bedrooms > 0 ? "text-cima-text" : "text-cima-text-dim"}`}>
                  <BedDouble className="h-3.5 w-3.5" />
                  {p.bedrooms > 0 ? p.bedrooms : "—"}
                </span>
              </td>
            ))}
          </tr>
          <tr className="border-t border-cima-border/50">
            <td className="px-4 py-3 text-[11px] font-mono text-cima-text-dim uppercase tracking-widest bg-cima-surface">Baños</td>
            {properties.map((p) => (
              <td key={p.id} className="px-4 py-3 text-center">
                <span className={`flex items-center justify-center gap-1 text-sm ${p.bathrooms > 0 ? "text-cima-text" : "text-cima-text-dim"}`}>
                  <Bath className="h-3.5 w-3.5" />
                  {p.bathrooms > 0 ? p.bathrooms : "—"}
                </span>
              </td>
            ))}
          </tr>
          <tr className="border-t border-cima-border/50">
            <td className="px-4 py-3 text-[11px] font-mono text-cima-text-dim uppercase tracking-widest bg-cima-surface">M²</td>
            {properties.map((p) => (
              <td key={p.id} className="px-4 py-3 text-center">
                <span className={`flex items-center justify-center gap-1 text-sm ${p.area_m2 ? "text-cima-text" : "text-cima-text-dim"}`}>
                  <Maximize2 className="h-3.5 w-3.5" />
                  {p.area_m2 ? `${p.area_m2} m²` : "—"}
                </span>
              </td>
            ))}
          </tr>
          <tr className="border-t border-cima-border/50">
            <td className="px-4 py-3 text-[11px] font-mono text-cima-text-dim uppercase tracking-widest bg-cima-surface">Cajones</td>
            {properties.map((p) => (
              <td key={p.id} className="px-4 py-3 text-center">
                <span className={`flex items-center justify-center gap-1 text-sm ${p.parking > 0 ? "text-cima-text" : "text-cima-text-dim"}`}>
                  <Car className="h-3.5 w-3.5" />
                  {p.parking > 0 ? p.parking : "—"}
                </span>
              </td>
            ))}
          </tr>
          <Row label="Precio/m²"  values={properties.map((p) =>
            p.area_m2 ? `${formatPrice(Math.round(p.price / p.area_m2))}` : "—"
          )} />
          <tr className="border-t border-cima-border/50">
            <td className="px-4 py-3 text-[11px] font-mono text-cima-text-dim uppercase tracking-widest bg-cima-surface">Destacada</td>
            {properties.map((p) => (
              <td key={p.id} className="px-4 py-3 text-center">
                {p.featured
                  ? <CheckCircle2 className="h-4 w-4 text-emerald-400 mx-auto" />
                  : <XCircle className="h-4 w-4 text-cima-text-dim mx-auto" />}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default function CompararPage() {
  return (
    <div className="min-h-screen bg-cima-bg">
      <header className="border-b border-cima-border/50 bg-cima-bg/90 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center">
              <Building2 className="h-4 w-4 text-cima-gold" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-heading font-bold text-sm text-cima-text">Cima</span>
              <span className="font-mono text-[9px] tracking-[0.2em] text-cima-text-muted uppercase">Propiedades</span>
            </div>
          </Link>
          <Link href="/propiedades" className="text-xs text-cima-text-muted hover:text-cima-text transition-colors">
            ← Catálogo
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <GitCompare className="h-5 w-5 text-cima-gold" />
          <div>
            <h1 className="font-heading font-bold text-2xl text-cima-text">Comparar propiedades</h1>
            <p className="text-sm text-cima-text-muted mt-0.5">Hasta 3 propiedades lado a lado</p>
          </div>
        </div>
        <Suspense fallback={<div className="h-[50vh] flex items-center justify-center"><div className="h-6 w-6 rounded-full border-2 border-cima-gold border-t-transparent animate-spin" /></div>}>
          <ComparadorInner />
        </Suspense>
      </div>
    </div>
  );
}
