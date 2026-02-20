import { createClient } from "@/lib/supabase/server";
import { Building2, Eye } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import type { Property } from "@/lib/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("es-MX", {
    timeZone: "America/Monterrey",
    day: "2-digit", month: "short", year: "numeric",
  });
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  active:   { label: "Activa",   color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  sold:     { label: "Vendida",  color: "bg-red-500/10 text-red-400 border-red-500/20" },
  rented:   { label: "Rentada",  color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  inactive: { label: "Inactiva", color: "bg-cima-surface text-cima-text-dim border-cima-border" },
};

export default async function PropiedadesAdmin() {
  const supabase = createClient();
  const { data } = await supabase
    .from("re_properties")
    .select("*")
    .order("created_at", { ascending: false });

  const properties = (data ?? []) as Property[];

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-[10px] tracking-[0.2em] text-cima-gold uppercase mb-1">Catálogo</p>
          <h1 className="font-heading font-bold text-2xl text-cima-text">Propiedades</h1>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-xs text-cima-text-muted">{properties.length} propiedades</p>
        </div>
      </div>

      {properties.length === 0 ? (
        <div className="rounded-xl border border-cima-border bg-cima-card p-16 text-center">
          <Building2 className="h-8 w-8 text-cima-text-dim mx-auto mb-3" />
          <p className="text-cima-text-muted">No hay propiedades registradas.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-cima-border bg-cima-card overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[1fr_120px_100px_100px_80px] gap-4 px-5 py-3 border-b border-cima-border bg-cima-bg">
            {["Propiedad", "Precio", "Tipo", "Estado", ""].map((h) => (
              <p key={h} className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">{h}</p>
            ))}
          </div>

          {/* Rows */}
          <div className="divide-y divide-cima-border">
            {properties.map((p) => {
              const st = STATUS_LABELS[p.status] ?? STATUS_LABELS.inactive;
              return (
                <div key={p.id} className="grid grid-cols-[1fr_120px_100px_100px_80px] gap-4 px-5 py-4 items-center hover:bg-cima-surface/30 transition-colors">
                  {/* Title + neighborhood */}
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-cima-text truncate">{p.title}</p>
                    <p className="text-xs text-cima-text-muted">{p.neighborhood ?? "—"} · {formatDate(p.created_at)}</p>
                  </div>

                  {/* Price */}
                  <p className="text-sm text-cima-gold font-mono">
                    {formatPrice(p.price)}{p.operation_type === "renta" ? "/mes" : ""}
                  </p>

                  {/* Type */}
                  <p className="text-xs text-cima-text-muted capitalize">{p.property_type}</p>

                  {/* Status */}
                  <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-mono border w-fit ${st.color}`}>
                    {st.label}
                  </span>

                  {/* Actions */}
                  <Link
                    href={`/propiedades/${p.slug}`}
                    target="_blank"
                    className="flex items-center gap-1 text-xs text-cima-text-muted hover:text-cima-gold transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Ver
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
