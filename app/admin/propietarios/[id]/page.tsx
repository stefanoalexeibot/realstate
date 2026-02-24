import { createServiceClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, UserCheck, Mail, Phone, Home,
  Eye, Calendar, CheckCircle2, Circle,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import DocUploadPanel from "@/components/admin/doc-upload-panel";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-MX", {
    day: "2-digit", month: "long", year: "numeric", timeZone: "America/Monterrey",
  });
}

const PROP_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  active:   { label: "Activa",   color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  sold:     { label: "Vendida",  color: "bg-red-500/10 text-red-400 border-red-500/20" },
  rented:   { label: "Rentada",  color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  inactive: { label: "Inactiva", color: "bg-cima-surface text-cima-text-dim border-cima-border" },
};

export default async function PropietarioDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServiceClient();

  const { data: prop } = await supabase
    .from("re_propietarios")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!prop) notFound();

  // Linked property
  const { data: property } = await supabase
    .from("re_properties")
    .select("id, title, slug, status, neighborhood, city, price, views, created_at, operation_type")
    .eq("propietario_id", prop.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // Visit stats
  const visitStats = property
    ? await supabase
        .from("re_visits")
        .select("id, status")
        .eq("property_id", property.id)
    : { data: [] };
  const visits = visitStats.data ?? [];
  const pendingVisits = visits.filter((v) => v.status === "pending").length;

  const propStatus = property ? (PROP_STATUS_LABELS[property.status] ?? PROP_STATUS_LABELS.inactive) : null;

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-6">
      {/* Back */}
      <Link href="/admin/propietarios" className="inline-flex items-center gap-1.5 text-xs text-cima-text-muted hover:text-cima-gold transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" />
        Propietarios
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-cima-gold/10 border border-cima-gold/20 flex items-center justify-center shrink-0">
            <span className="font-bold text-lg text-cima-gold">{prop.name.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <h1 className="font-heading font-bold text-2xl text-cima-text">{prop.name}</h1>
            <p className="text-xs text-cima-text-muted mt-0.5">Registrado el {formatDate(prop.created_at)}</p>
          </div>
        </div>
        {prop.auth_id ? (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-xs font-mono text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Portal activo
          </span>
        ) : (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-cima-border bg-cima-surface text-xs font-mono text-cima-text-dim">
            <Circle className="h-3.5 w-3.5" />
            Sin acceso al portal
          </span>
        )}
      </div>

      {/* Contact info */}
      <div className="rounded-2xl border border-cima-border bg-cima-card p-5">
        <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase mb-4">Contacto</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-cima-gold shrink-0" />
            <div>
              <p className="text-[10px] text-cima-text-dim font-mono uppercase">Email</p>
              <p className="text-sm text-cima-text">{prop.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-cima-gold shrink-0" />
            <div>
              <p className="text-[10px] text-cima-text-dim font-mono uppercase">WhatsApp</p>
              {prop.phone ? (
                <a
                  href={`https://wa.me/52${prop.phone.replace(/\D/g, "")}?text=Hola ${encodeURIComponent(prop.name)}, te contactamos de Cima`}
                  target="_blank" rel="noreferrer"
                  className="text-sm text-[#25D366] hover:underline"
                >
                  {prop.phone}
                </a>
              ) : (
                <p className="text-sm text-cima-text-dim">—</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <UserCheck className="h-4 w-4 text-cima-gold shrink-0" />
            <div>
              <p className="text-[10px] text-cima-text-dim font-mono uppercase">Auth ID</p>
              <p className="text-xs text-cima-text-dim font-mono truncate max-w-[120px]">
                {prop.auth_id ? prop.auth_id.slice(0, 8) + "…" : "Sin cuenta"}
              </p>
            </div>
          </div>
        </div>
        {prop.notes && (
          <div className="mt-4 pt-4 border-t border-cima-border">
            <p className="text-[10px] text-cima-text-dim font-mono uppercase mb-1">Notas</p>
            <p className="text-sm text-cima-text-muted leading-relaxed">{prop.notes}</p>
          </div>
        )}
      </div>

      {/* Linked property */}
      <div className="rounded-2xl border border-cima-border bg-cima-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Home className="h-4 w-4 text-cima-gold" />
          <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">Propiedad vinculada</p>
        </div>
        {property ? (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-cima-text">{property.title}</p>
                {property.neighborhood && (
                  <p className="text-xs text-cima-text-muted mt-0.5">{property.neighborhood}, {property.city}</p>
                )}
              </div>
              {propStatus && (
                <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-mono border ${propStatus.color}`}>
                  {propStatus.label}
                </span>
              )}
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-cima-surface border border-cima-border p-3 text-center">
                <p className="font-heading font-bold text-lg text-cima-gold">{formatPrice(property.price)}</p>
                <p className="text-[10px] text-cima-text-dim font-mono uppercase">Precio</p>
              </div>
              <div className="rounded-xl bg-cima-surface border border-cima-border p-3 text-center">
                <p className="font-heading font-bold text-lg text-cima-text flex items-center justify-center gap-1">
                  <Eye className="h-4 w-4 text-cima-gold" />{property.views ?? 0}
                </p>
                <p className="text-[10px] text-cima-text-dim font-mono uppercase">Vistas</p>
              </div>
              <div className="rounded-xl bg-cima-surface border border-cima-border p-3 text-center">
                <p className="font-heading font-bold text-lg text-cima-text flex items-center justify-center gap-1">
                  <Calendar className="h-4 w-4 text-cima-gold" />{visits.length}
                </p>
                <p className="text-[10px] text-cima-text-dim font-mono uppercase">
                  Visitas ({pendingVisits} pend.)
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Link
                href={`/admin/propiedades/${property.id}/editar`}
                className="px-3 py-1.5 rounded-lg border border-cima-border text-xs text-cima-text-muted hover:border-cima-gold/40 hover:text-cima-gold transition-colors"
              >
                Editar propiedad
              </Link>
              <Link
                href={`/propiedades/${property.slug}`}
                target="_blank"
                className="px-3 py-1.5 rounded-lg border border-cima-border text-xs text-cima-text-muted hover:border-cima-gold/40 hover:text-cima-gold transition-colors"
              >
                Ver publicación ↗
              </Link>
            </div>
          </div>
        ) : (
          <p className="text-sm text-cima-text-dim">No hay propiedad vinculada. Edita una propiedad y asígnale este propietario.</p>
        )}
      </div>

      {/* Documents */}
      <DocUploadPanel propietarioId={prop.id} />
    </div>
  );
}
