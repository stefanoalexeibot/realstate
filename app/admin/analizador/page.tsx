"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { BarChart2, Search, Loader2, MapPin, Building2, TrendingUp } from "lucide-react";
import { formatPrice } from "@/lib/utils";

const PROP_TYPES = ["casa", "departamento", "terreno", "local", "oficina"] as const;

type Comparable = {
  id: string;
  title: string;
  slug: string;
  price: number;
  area_m2: number | null;
  bedrooms: number;
  bathrooms: number;
  neighborhood: string | null;
  status: string;
  operation_type: string;
  price_per_m2?: number;
};

type Results = {
  comparables: Comparable[];
  avgPrice: number;
  avgPriceM2: number | null;
  minPrice: number;
  maxPrice: number;
  conservative: number;
  market: number;
  premium: number;
};

export default function AnalizadorPage() {
  const [form, setForm] = useState({
    neighborhood: "",
    property_type: "casa",
    operation_type: "venta",
    area_m2: "",
    bedrooms: "",
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Results | null>(null);
  const [searched, setSearched] = useState(false);

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSearched(true);

    const supabase = createClient();
    let query = supabase
      .from("re_properties")
      .select("id, title, slug, price, area_m2, bedrooms, bathrooms, neighborhood, status, operation_type")
      .eq("property_type", form.property_type)
      .eq("operation_type", form.operation_type)
      .in("status", ["active", "sold", "rented"]);

    if (form.neighborhood.trim()) {
      query = query.ilike("neighborhood", `%${form.neighborhood.trim()}%`);
    }
    if (form.bedrooms) {
      query = query.gte("bedrooms", Number(form.bedrooms) - 1).lte("bedrooms", Number(form.bedrooms) + 1);
    }

    const { data } = await query.order("price").limit(20);
    const raw = (data ?? []) as Comparable[];

    if (raw.length === 0) {
      setResults({ comparables: [], avgPrice: 0, avgPriceM2: null, minPrice: 0, maxPrice: 0, conservative: 0, market: 0, premium: 0 });
      setLoading(false);
      return;
    }

    // Price per m²
    const withArea = raw.filter((p) => p.area_m2 && p.area_m2 > 0);
    const mapped = raw.map((p) => ({ ...p, price_per_m2: p.area_m2 ? p.price / p.area_m2 : undefined }));

    const prices = raw.map((p) => p.price);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    let avgPriceM2: number | null = null;
    if (withArea.length > 0) {
      const priceM2s = withArea.map((p) => p.price / (p.area_m2 ?? 1));
      avgPriceM2 = priceM2s.reduce((a, b) => a + b, 0) / priceM2s.length;
    }

    // Suggested ranges based on area_m2 input
    const targetArea = form.area_m2 ? Number(form.area_m2) : null;
    const base = avgPriceM2 && targetArea ? avgPriceM2 * targetArea : avgPrice;

    setResults({
      comparables: mapped,
      avgPrice,
      avgPriceM2,
      minPrice,
      maxPrice,
      conservative: base * 0.90,
      market: base,
      premium: base * 1.15,
    });
    setLoading(false);
  }

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <p className="font-mono text-[10px] tracking-[0.2em] text-cima-gold uppercase mb-1">Herramienta</p>
        <h1 className="font-heading font-bold text-2xl text-cima-text flex items-center gap-2.5">
          <BarChart2 className="h-5 w-5 text-cima-gold" />
          Analizador CMA
        </h1>
        <p className="text-sm text-cima-text-muted mt-1">Análisis comparativo de mercado para determinar el precio correcto de una propiedad.</p>
      </div>

      {/* Search form */}
      <div className="rounded-xl border border-cima-border bg-cima-card p-5">
        <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase mb-4">Parámetros de búsqueda</p>
        <form onSubmit={handleSearch} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 items-end">
          <div className="col-span-2 sm:col-span-1 lg:col-span-2">
            <label className="block text-xs font-medium text-cima-text-muted mb-1.5">Colonia / Fracc.</label>
            <input
              type="text" value={form.neighborhood} onChange={(e) => set("neighborhood", e.target.value)}
              placeholder="Cumbres, Contry..."
              className="w-full rounded-lg bg-cima-surface border border-cima-border px-3 py-2.5 text-sm text-cima-text placeholder-cima-text-dim focus:outline-none focus:border-cima-gold/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-cima-text-muted mb-1.5">Tipo</label>
            <select value={form.property_type} onChange={(e) => set("property_type", e.target.value)}
              className="w-full rounded-lg bg-cima-surface border border-cima-border px-3 py-2.5 text-sm text-cima-text focus:outline-none focus:border-cima-gold/50">
              {PROP_TYPES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-cima-text-muted mb-1.5">Operación</label>
            <select value={form.operation_type} onChange={(e) => set("operation_type", e.target.value)}
              className="w-full rounded-lg bg-cima-surface border border-cima-border px-3 py-2.5 text-sm text-cima-text focus:outline-none focus:border-cima-gold/50">
              <option value="venta">Venta</option>
              <option value="renta">Renta</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-cima-text-muted mb-1.5">m² objetivo</label>
            <input type="number" min="0" value={form.area_m2} onChange={(e) => set("area_m2", e.target.value)}
              placeholder="150"
              className="w-full rounded-lg bg-cima-surface border border-cima-border px-3 py-2.5 text-sm text-cima-text placeholder-cima-text-dim focus:outline-none focus:border-cima-gold/50" />
          </div>
          <div>
            <label className="block text-xs font-medium text-cima-text-muted mb-1.5">Recámaras</label>
            <input type="number" min="0" value={form.bedrooms} onChange={(e) => set("bedrooms", e.target.value)}
              placeholder="3"
              className="w-full rounded-lg bg-cima-surface border border-cima-border px-3 py-2.5 text-sm text-cima-text placeholder-cima-text-dim focus:outline-none focus:border-cima-gold/50" />
          </div>
          <div className="col-span-2 sm:col-span-3 lg:col-span-5">
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-cima-gold text-cima-bg text-sm font-semibold hover:bg-cima-gold-light disabled:opacity-60 transition-colors">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              {loading ? "Buscando comparables…" : "Analizar mercado"}
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      {searched && results && (
        results.comparables.length === 0 ? (
          <div className="rounded-xl border border-cima-border bg-cima-card p-16 text-center">
            <Building2 className="h-8 w-8 text-cima-text-dim mx-auto mb-3" />
            <p className="text-cima-text-muted">Sin propiedades comparables en la BD con esos criterios.</p>
            <p className="text-xs text-cima-text-dim mt-1">Prueba con una colonia más amplia o quita filtros.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Price range suggestion */}
            <div className="rounded-xl border border-cima-gold/20 bg-cima-gold/5 p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-4 w-4 text-cima-gold" />
                <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">
                  Precio sugerido — {results.comparables.length} comparables
                  {form.area_m2 && results.avgPriceM2 ? ` · ${formatPrice(results.avgPriceM2)}/m²` : ""}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Conservador", value: results.conservative, sub: "Venta rápida", color: "text-blue-400" },
                  { label: "Precio de mercado", value: results.market, sub: "Recomendado", color: "text-cima-gold" },
                  { label: "Premium", value: results.premium, sub: "Mayor margen", color: "text-emerald-400" },
                ].map((r) => (
                  <div key={r.label} className={`text-center rounded-xl border border-cima-border bg-cima-card p-4 ${r.label === "Precio de mercado" ? "border-cima-gold/30 bg-cima-gold/5" : ""}`}>
                    <p className="font-mono text-[9px] text-cima-text-dim uppercase tracking-wider mb-2">{r.label}</p>
                    <p className={`font-heading font-bold text-xl ${r.color}`}>{formatPrice(r.value)}</p>
                    <p className="text-[10px] text-cima-text-dim mt-1">{r.sub}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-4 text-xs text-cima-text-muted">
                <span>Min: <span className="text-cima-text font-mono">{formatPrice(results.minPrice)}</span></span>
                <span>Promedio: <span className="text-cima-text font-mono">{formatPrice(results.avgPrice)}</span></span>
                <span>Max: <span className="text-cima-text font-mono">{formatPrice(results.maxPrice)}</span></span>
                {results.avgPriceM2 && (
                  <span>Precio/m²: <span className="text-cima-gold font-mono">{formatPrice(results.avgPriceM2)}</span></span>
                )}
              </div>
            </div>

            {/* Comparable properties */}
            <div className="rounded-xl border border-cima-border bg-cima-card overflow-hidden">
              <div className="px-5 py-4 border-b border-cima-border">
                <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">Propiedades comparables</p>
              </div>
              <div className="divide-y divide-cima-border">
                {results.comparables.map((c) => (
                  <div key={c.id} className="px-5 py-3 flex items-center justify-between gap-4 hover:bg-cima-surface/20 transition-colors">
                    <div className="min-w-0 flex-1">
                      <a href={`/propiedades/${c.slug}`} target="_blank" rel="noreferrer"
                        className="text-sm font-medium text-cima-text hover:text-cima-gold transition-colors line-clamp-1">
                        {c.title}
                      </a>
                      <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                        {c.neighborhood && (
                          <span className="flex items-center gap-1 text-[10px] text-cima-text-dim">
                            <MapPin className="h-2.5 w-2.5" />{c.neighborhood}
                          </span>
                        )}
                        {c.area_m2 && <span className="text-[10px] text-cima-text-dim">{c.area_m2}m²</span>}
                        {c.bedrooms > 0 && <span className="text-[10px] text-cima-text-dim">{c.bedrooms} rec</span>}
                        {c.bathrooms > 0 && <span className="text-[10px] text-cima-text-dim">{c.bathrooms} baños</span>}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-heading font-bold text-sm text-cima-gold">{formatPrice(c.price)}</p>
                      {c.price_per_m2 && (
                        <p className="text-[10px] text-cima-text-dim font-mono">{formatPrice(c.price_per_m2)}/m²</p>
                      )}
                      <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-mono border mt-0.5 ${
                        c.status === "active" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-cima-surface text-cima-text-dim border-cima-border"
                      }`}>
                        {c.status === "active" ? "Activa" : c.status === "sold" ? "Vendida" : "Rentada"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
