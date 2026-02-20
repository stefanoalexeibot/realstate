import Link from "next/link";
import { Building2, SlidersHorizontal } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import PropertyCard from "@/components/landing/property-card";
import type { Property } from "@/lib/types";

interface SearchParams {
  tipo?: string;
  operacion?: string;
  zona?: string;
}

export const metadata = {
  title: "Propiedades en Monterrey | Cima Propiedades",
  description: "Explora nuestro catálogo de casas, departamentos y terrenos en venta y renta en Monterrey, N.L.",
};

export default async function PropiedadesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const supabase = createClient();

  let query = supabase
    .from("re_properties")
    .select("*")
    .eq("status", "active")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (searchParams.operacion) {
    query = query.eq("operation_type", searchParams.operacion);
  }
  if (searchParams.tipo) {
    query = query.eq("property_type", searchParams.tipo);
  }
  if (searchParams.zona) {
    query = query.ilike("neighborhood", `%${searchParams.zona}%`);
  }

  const { data } = await query;
  const properties = (data ?? []) as Property[];

  const isFiltered = searchParams.operacion || searchParams.tipo || searchParams.zona;

  return (
    <div className="min-h-screen bg-cima-bg">
      {/* Nav */}
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
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/propiedades" className="text-sm text-cima-gold">Propiedades</Link>
            <Link href="/#vender" className="text-sm text-cima-text-muted hover:text-cima-text transition-colors">Vender</Link>
          </nav>
          <Link href="/" className="text-xs text-cima-text-muted hover:text-cima-text transition-colors">← Inicio</Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="font-mono text-[10px] tracking-[0.2em] text-cima-gold uppercase mb-1">Catálogo</p>
          <h1 className="font-heading font-bold text-3xl text-cima-text mb-1">
            {isFiltered ? "Resultados filtrados" : "Todas las propiedades"}
          </h1>
          <p className="text-sm text-cima-text-muted">{properties.length} propiedad{properties.length !== 1 ? "es" : ""} encontrada{properties.length !== 1 ? "s" : ""}</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8 p-4 rounded-xl border border-cima-border bg-cima-card">
          <div className="flex items-center gap-2 mr-2">
            <SlidersHorizontal className="h-3.5 w-3.5 text-cima-gold" />
            <span className="text-xs font-mono text-cima-text-muted uppercase tracking-widest">Filtros</span>
          </div>

          {/* Operation */}
          {(["", "venta", "renta"] as const).map((op) => (
            <Link
              key={op || "all-op"}
              href={buildUrl({ ...searchParams, operacion: op || undefined })}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                (searchParams.operacion ?? "") === op
                  ? "bg-cima-gold text-cima-bg font-semibold"
                  : "border border-cima-border text-cima-text-muted hover:border-cima-gold/40 hover:text-cima-text"
              }`}
            >
              {op === "" ? "Todo" : op === "venta" ? "Venta" : "Renta"}
            </Link>
          ))}

          <div className="w-px h-6 bg-cima-border self-center mx-1" />

          {/* Type */}
          {(["", "casa", "departamento", "terreno"] as const).map((t) => (
            <Link
              key={t || "all-type"}
              href={buildUrl({ ...searchParams, tipo: t || undefined })}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                (searchParams.tipo ?? "") === t
                  ? "bg-cima-gold text-cima-bg font-semibold"
                  : "border border-cima-border text-cima-text-muted hover:border-cima-gold/40 hover:text-cima-text"
              }`}
            >
              {t === "" ? "Tipo" : t === "departamento" ? "Depto" : t.charAt(0).toUpperCase() + t.slice(1)}
            </Link>
          ))}

          {isFiltered && (
            <>
              <div className="w-px h-6 bg-cima-border self-center mx-1" />
              <Link
                href="/propiedades"
                className="px-3 py-1.5 rounded-lg text-xs font-mono border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
              >
                Limpiar filtros ×
              </Link>
            </>
          )}
        </div>

        {/* Grid */}
        {properties.length === 0 ? (
          <div className="rounded-xl border border-cima-border bg-cima-card p-16 text-center">
            <Building2 className="h-8 w-8 text-cima-text-dim mx-auto mb-3" />
            <p className="text-cima-text-muted">No hay propiedades con estos filtros.</p>
            <Link href="/propiedades" className="text-xs text-cima-gold mt-2 block hover:underline">Ver todas</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function buildUrl(params: Record<string, string | undefined>): string {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v) q.set(k, v);
  });
  const qs = q.toString();
  return `/propiedades${qs ? `?${qs}` : ""}`;
}
