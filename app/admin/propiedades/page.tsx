import { createAdminClient } from "@/lib/supabase/server";
import { Building2, Eye, Plus, Pencil, User, RotateCcw } from "lucide-react";
import Link from "next/link";
import type { Property } from "@/lib/types";
import GeocodeButton from "@/components/admin/geocode-button";
import AdminPropertiesList from "@/components/admin/admin-properties-list";

type PropertyWithAgent = Property & { re_agentes: { name: string } | null };

export const dynamic = "force-dynamic";

export default async function PropiedadesAdmin() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("re_properties")
    .select("*, re_agentes!agent_id(name)")
    .order("created_at", { ascending: false });

  const properties = (data ?? []) as PropertyWithAgent[];

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="font-mono text-[10px] tracking-[0.2em] text-cima-gold uppercase mb-1">Catálogo</p>
          <h1 className="font-heading font-bold text-xl sm:text-2xl text-cima-text">Propiedades</h1>
        </div>
        <div className="flex items-center flex-wrap gap-2 sm:gap-3">
          <p className="hidden sm:block text-xs text-cima-text-muted">{properties.length} propiedades</p>
          <GeocodeButton />
          <Link
            href="/admin/propiedades"
            className="p-1.5 rounded-lg border border-cima-border text-cima-text-muted hover:bg-cima-surface hover:text-cima-gold transition-colors"
            title="Refrescar lista"
          >
            <RotateCcw className="h-4 w-4" />
          </Link>
          <Link
            href="/admin/propiedades/nueva"
            className="flex items-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg bg-cima-gold text-cima-bg text-xs font-semibold hover:bg-cima-gold-light transition-colors"
          >
            <Plus className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
            Nueva
          </Link>
        </div>
      </div>

      <AdminPropertiesList initialProperties={properties} />
    </div>
  );
}
