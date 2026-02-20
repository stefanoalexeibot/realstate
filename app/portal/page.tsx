import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Building2, Camera, Calendar, Phone, MapPin, Home, TrendingUp } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import type { Property, VisitStatus } from "@/lib/types";

const VISIT_STATUS_LABELS: Record<VisitStatus, { label: string; color: string }> = {
  pending:   { label: "Pendiente",  color: "text-amber-400" },
  confirmed: { label: "Confirmada", color: "text-blue-400" },
  done:      { label: "Realizada",  color: "text-emerald-400" },
  cancelled: { label: "Cancelada",  color: "text-red-400" },
};

const PROP_STATUS_LABELS: Record<string, { label: string; color: string; dot: string }> = {
  active:   { label: "Activa — en publicación",   color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", dot: "bg-emerald-400" },
  sold:     { label: "Vendida",                   color: "bg-red-500/10 text-red-400 border-red-500/20",             dot: "bg-red-400" },
  rented:   { label: "Rentada",                   color: "bg-purple-500/10 text-purple-400 border-purple-500/20",    dot: "bg-purple-400" },
  inactive: { label: "Sin publicar",              color: "bg-cima-surface text-cima-text-dim border-cima-border",    dot: "bg-cima-text-dim" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-MX", {
    timeZone: "America/Monterrey",
    day: "2-digit", month: "long", year: "numeric",
  });
}

export default async function PortalDashboard() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  // Get propietario
  const { data: prop } = await supabase
    .from("re_propietarios")
    .select("*")
    .eq("auth_id", user.id)
    .single();
  if (!prop) redirect("/portal/login");

  // Get their property
  const { data: property } = await supabase
    .from("re_properties")
    .select("*, re_photos(id)")
    .eq("propietario_id", prop.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single() as { data: (Property & { re_photos: { id: string }[] }) | null };

  // Get visits for their property
  const { data: visits } = property
    ? await supabase
        .from("re_visits")
        .select("id, name, phone, status, preferred_date, created_at")
        .eq("property_id", property.id)
        .order("created_at", { ascending: false })
    : { data: [] };

  const photoCount = property?.re_photos?.length ?? 0;
  const totalVisits = visits?.length ?? 0;
  const pendingVisits = visits?.filter((v) => v.status === "pending").length ?? 0;

  const propStatus = property ? (PROP_STATUS_LABELS[property.status] ?? PROP_STATUS_LABELS.inactive) : null;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <p className="font-mono text-[10px] tracking-[0.2em] text-cima-gold uppercase mb-1">Mi portal</p>
        <h1 className="font-heading font-bold text-2xl text-cima-text">Hola, {prop.name.split(" ")[0]}</h1>
        <p className="text-sm text-cima-text-muted mt-1">Aquí puedes ver el estado de tu propiedad en tiempo real.</p>
      </div>

      {!property ? (
        /* No property linked yet */
        <div className="rounded-2xl border border-cima-border bg-cima-card p-12 text-center">
          <Building2 className="h-10 w-10 text-cima-text-dim mx-auto mb-4" />
          <p className="font-medium text-cima-text mb-1">Aún no tienes una propiedad vinculada</p>
          <p className="text-sm text-cima-text-muted">Tu agente de Cima la vinculará pronto. Si tienes dudas, contáctanos.</p>
          <a
            href="https://wa.me/528110000000?text=Hola, quiero saber el estado de mi propiedad en el portal de Cima"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-lg bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] text-sm hover:bg-[#25D366]/20 transition-colors"
          >
            <Phone className="h-4 w-4" />
            Contactar a mi agente
          </a>
        </div>
      ) : (
        <>
          {/* Property card */}
          <div className="rounded-2xl border border-cima-border bg-cima-card p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="min-w-0">
                <h2 className="font-heading font-bold text-lg text-cima-text leading-tight">{property.title}</h2>
                {property.neighborhood && (
                  <p className="flex items-center gap-1 text-xs text-cima-text-muted mt-1">
                    <MapPin className="h-3 w-3" />
                    {property.neighborhood}, {property.city}
                  </p>
                )}
              </div>
              {propStatus && (
                <span className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-mono ${propStatus.color}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${propStatus.dot} animate-pulse`} />
                  {propStatus.label}
                </span>
              )}
            </div>

            {/* Property stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="rounded-xl bg-cima-surface border border-cima-border p-3 text-center">
                <p className="font-heading font-bold text-lg text-cima-gold">{formatPrice(property.price)}</p>
                <p className="text-[10px] text-cima-text-dim font-mono uppercase">Precio</p>
              </div>
              <div className="rounded-xl bg-cima-surface border border-cima-border p-3 text-center">
                <p className="font-heading font-bold text-lg text-cima-text">{property.bedrooms}</p>
                <p className="text-[10px] text-cima-text-dim font-mono uppercase">Recámaras</p>
              </div>
              <div className="rounded-xl bg-cima-surface border border-cima-border p-3 text-center">
                <p className="font-heading font-bold text-lg text-cima-text">{property.area_m2 ?? "—"}</p>
                <p className="text-[10px] text-cima-text-dim font-mono uppercase">m²</p>
              </div>
              <div className="rounded-xl bg-cima-surface border border-cima-border p-3 text-center">
                <p className="font-heading font-bold text-lg text-cima-text capitalize">{property.operation_type}</p>
                <p className="text-[10px] text-cima-text-dim font-mono uppercase">Tipo</p>
              </div>
            </div>

            {/* Listing link */}
            {property.status === "active" && (
              <Link
                href={`/propiedades/${property.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs text-cima-gold hover:text-cima-gold-light transition-colors"
              >
                <Home className="h-3 w-3" />
                Ver publicación en el sitio
              </Link>
            )}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Calendar, label: "Total visitas",    value: totalVisits,  color: "text-cima-text" },
              { icon: TrendingUp, label: "Visitas pendientes", value: pendingVisits, color: "text-amber-400" },
              { icon: Camera, label: "Fotos subidas",     value: photoCount,   color: "text-blue-400" },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="rounded-xl border border-cima-border bg-cima-card p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`h-4 w-4 ${color}`} />
                  <p className="text-[10px] text-cima-text-dim font-mono uppercase truncate">{label}</p>
                </div>
                <p className={`font-heading font-bold text-2xl leading-none ${color}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Fotos CTA */}
          {photoCount === 0 && (
            <div className="rounded-2xl border border-dashed border-cima-gold/30 bg-cima-gold/5 p-6 flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-cima-text mb-1">Sube fotos de tu propiedad</p>
                <p className="text-sm text-cima-text-muted">Las fotos aumentan el interés de los compradores hasta 3×.</p>
              </div>
              <Link
                href="/portal/fotos"
                className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-cima-gold text-cima-bg text-sm font-semibold hover:bg-cima-gold-light transition-colors"
              >
                <Camera className="h-4 w-4" />
                Subir fotos
              </Link>
            </div>
          )}

          {/* Visits table */}
          {visits && visits.length > 0 && (
            <div className="rounded-2xl border border-cima-border bg-cima-card overflow-hidden">
              <div className="px-5 py-4 border-b border-cima-border">
                <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">Solicitudes de visita</p>
              </div>
              <div className="divide-y divide-cima-border">
                {visits.map((v) => {
                  const vs = VISIT_STATUS_LABELS[v.status as VisitStatus] ?? VISIT_STATUS_LABELS.pending;
                  return (
                    <div key={v.id} className="px-5 py-3.5 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-cima-text">{v.name}</p>
                        {v.preferred_date && (
                          <p className="text-xs text-cima-text-muted mt-0.5">Fecha preferida: {v.preferred_date}</p>
                        )}
                        <p className="text-[10px] text-cima-text-dim mt-0.5">{formatDate(v.created_at)}</p>
                      </div>
                      <span className={`text-xs font-mono shrink-0 ${vs.color}`}>{vs.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Contact agent */}
          <div className="rounded-2xl border border-cima-border bg-cima-card p-5 flex items-center justify-between gap-4">
            <div>
              <p className="font-medium text-sm text-cima-text mb-0.5">¿Tienes preguntas sobre tu propiedad?</p>
              <p className="text-xs text-cima-text-muted">Tu agente de Cima está disponible para ti.</p>
            </div>
            <a
              href="https://wa.me/528110000000?text=Hola, soy propietario en Cima y tengo una pregunta sobre mi propiedad"
              target="_blank"
              rel="noreferrer"
              className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] text-xs hover:bg-[#25D366]/20 transition-colors"
            >
              <Phone className="h-3.5 w-3.5" />
              WhatsApp
            </a>
          </div>
        </>
      )}
    </div>
  );
}
