import Link from "next/link";
import { Building2, SlidersHorizontal, LayoutGrid, Map, CheckCircle2, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import PropertyCard from "@/components/landing/property-card";
import type { Property } from "@/lib/types";
import dynamicImport from "next/dynamic";
import CompareBar from "@/components/landing/compare-bar";
import { Suspense } from "react";
import SearchInput from "@/components/landing/search-input";

const PropertiesMap = dynamicImport(() => import("@/components/landing/properties-map"), {
  ssr: false,
  loading: () => <div className="h-[520px] rounded-xl bg-cima-card border border-cima-border animate-pulse" />,
});

interface SearchParams {
  tipo?: string;
  operacion?: string;
  zona?: string;
  precio?: string;
  vista?: string;
  q?: string;
}

const PRICE_PRESETS = [
  { label: "Hasta $2M", value: "-2000000" },
  { label: "$2M–$5M", value: "2000000-5000000" },
  { label: "$5M–$10M", value: "5000000-10000000" },
  { label: "+$10M", value: "10000000-" },
];

export const dynamic = "force-dynamic";

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

  // Fetch distinct neighborhoods for zona pills
  const { data: zonaRows } = await supabase
    .from("re_properties")
    .select("neighborhood")
    .eq("status", "active")
    .not("neighborhood", "is", null);
  const zonas = Array.from(new Set((zonaRows ?? []).map((r) => r.neighborhood as string))).sort();

  let query = supabase
    .from("re_properties")
    .select("*")
    .in("status", ["active", "sold", "rented"])
    .order("status", { ascending: true })   // active primero (~a < s)
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
  if (searchParams.precio) {
    const [rawMin, rawMax] = searchParams.precio.split("-");
    if (rawMin) query = query.gte("price", Number(rawMin));
    if (rawMax) query = query.lte("price", Number(rawMax));
  }
  if (searchParams.q) {
    const q = `%${searchParams.q}%`;
    query = query.or(`title.ilike.${q},neighborhood.ilike.${q},description.ilike.${q}`);
  }

  const { data } = await query;
  const allProperties = (data ?? []) as Property[];
  const properties = allProperties.filter(p => p.status === "active");
  const closedProperties = allProperties.filter(p => p.status === "sold" || p.status === "rented");

  const isFiltered = searchParams.operacion || searchParams.tipo || searchParams.zona || searchParams.precio || searchParams.q;

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
        <div className="mb-8 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] text-cima-gold uppercase mb-1">Catálogo</p>
            <h1 className="font-heading font-bold text-3xl text-cima-text mb-1">
              {isFiltered ? "Resultados filtrados" : "Todas las propiedades"}
            </h1>
            <p className="text-sm text-cima-text-muted">
              {properties.length} propiedad{properties.length !== 1 ? "es" : ""} disponible{properties.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <Suspense>
              <SearchInput />
            </Suspense>
            {/* Vista toggle */}
            <div className="flex items-center gap-1 rounded-lg border border-cima-border bg-cima-card p-1">
              <Link
                href={buildUrl({ ...searchParams, vista: undefined })}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${searchParams.vista !== "mapa"
                  ? "bg-cima-gold text-cima-bg font-semibold"
                  : "text-cima-text-muted hover:text-cima-text"
                  }`}
              >
                <LayoutGrid className="h-3 w-3" /> Lista
              </Link>
              <Link
                href={buildUrl({ ...searchParams, vista: "mapa" })}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${searchParams.vista === "mapa"
                  ? "bg-cima-gold text-cima-bg font-semibold"
                  : "text-cima-text-muted hover:text-cima-text"
                  }`}
              >
                <Map className="h-3 w-3" /> Mapa
              </Link>
            </div>
          </div>
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
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${(searchParams.operacion ?? "") === op
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
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${(searchParams.tipo ?? "") === t
                ? "bg-cima-gold text-cima-bg font-semibold"
                : "border border-cima-border text-cima-text-muted hover:border-cima-gold/40 hover:text-cima-text"
                }`}
            >
              {t === "" ? "Tipo" : t === "departamento" ? "Depto" : t.charAt(0).toUpperCase() + t.slice(1)}
            </Link>
          ))}

          {/* Zona */}
          {zonas.length > 0 && (
            <>
              <div className="w-px h-6 bg-cima-border self-center mx-1" />
              {zonas.map((z) => (
                <Link
                  key={z}
                  href={buildUrl({ ...searchParams, zona: searchParams.zona === z ? undefined : z })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${searchParams.zona === z
                    ? "bg-cima-gold text-cima-bg font-semibold"
                    : "border border-cima-border text-cima-text-muted hover:border-cima-gold/40 hover:text-cima-text"
                    }`}
                >
                  {z.length > 14 ? z.split(" ")[0] : z}
                </Link>
              ))}
            </>
          )}

          {/* Precio */}
          <div className="w-px h-6 bg-cima-border self-center mx-1" />
          {PRICE_PRESETS.map((p) => (
            <Link
              key={p.value}
              href={buildUrl({ ...searchParams, precio: searchParams.precio === p.value ? undefined : p.value })}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${searchParams.precio === p.value
                ? "bg-cima-gold text-cima-bg font-semibold"
                : "border border-cima-border text-cima-text-muted hover:border-cima-gold/40 hover:text-cima-text"
                }`}
            >
              {p.label}
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

        {/* Grid / Map */}
        {properties.length === 0 ? (
          <div className="rounded-xl border border-cima-border bg-cima-card p-16 text-center">
            <Building2 className="h-8 w-8 text-cima-text-dim mx-auto mb-3" />
            <p className="text-cima-text-muted">No hay propiedades con estos filtros.</p>
            <Link href="/propiedades" className="text-xs text-cima-gold mt-2 block hover:underline">Ver todas</Link>
          </div>
        ) : searchParams.vista === "mapa" ? (
          <PropertiesMap properties={properties as (Property & { lat: number | null; lng: number | null })[]} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p, i) => {
              const isClosed = p.status === "sold" || p.status === "rented";
              return (
                <div key={p.id} className="relative">
                  <PropertyCard property={p} index={i} />
                  {/* Badge encima de propiedades cerradas */}
                  {isClosed && (
                    <div className="absolute inset-x-0 top-0 flex justify-center pt-3 pointer-events-none z-10">
                      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase shadow-lg
                        ${p.status === "sold"
                          ? "bg-cima-gold text-cima-bg"
                          : "bg-blue-500 text-white"
                        }`}>
                        <CheckCircle2 className="h-3 w-3" />
                        {p.status === "sold" ? "Vendida" : "Rentada"}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── Sección Casos de Éxito ── */}
        {closedProperties.length > 0 && (
          <div className="mt-16">
            {/* Divisor con título */}
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-cima-gold/30" />
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-cima-gold/30 bg-cima-gold/5">
                <TrendingUp className="h-3.5 w-3.5 text-cima-gold" />
                <span className="font-mono text-[10px] tracking-[0.2em] text-cima-gold uppercase">Casos de Éxito</span>
                <span className="font-mono text-[10px] text-cima-text-dim">({closedProperties.length})</span>
              </div>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-cima-gold/30" />
            </div>
            <p className="text-xs text-cima-text-dim text-center mb-8 font-mono">
              Propiedades que ya cerraron su operación · <Link href="/casos-de-exito" className="text-cima-gold hover:underline">Ver página completa →</Link>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {closedProperties.map((p, i) => {
                const isSold = p.status === "sold";
                return (
                  <div key={p.id} className="group relative block rounded-2xl border border-cima-border bg-cima-card overflow-hidden hover:border-cima-gold/40 hover:shadow-xl hover:shadow-black/20 transition-all duration-500">
                    <PropertyCard property={p} index={i} />
                    {/* Badge encima */}
                    <div className="absolute inset-x-0 top-0 flex justify-center pt-3 pointer-events-none z-10">
                      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase shadow-lg
                        ${isSold ? "bg-cima-gold text-cima-bg" : "bg-blue-500 text-white"}`}>
                        <CheckCircle2 className="h-3 w-3" />
                        {isSold ? "Vendida" : "Rentada"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <CompareBar />
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
