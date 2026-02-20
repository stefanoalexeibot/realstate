import { createClient } from "@/lib/supabase/server";
import { Users, Phone } from "lucide-react";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("es-MX", {
    timeZone: "America/Monterrey",
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `Hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Hace ${hrs}h`;
  return `Hace ${Math.floor(hrs / 24)}d`;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new:       { label: "Nuevo",       color: "bg-cima-gold/10 text-cima-gold border-cima-gold/20" },
  contacted: { label: "Contactado",  color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  visiting:  { label: "Visitando",   color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  listed:    { label: "Publicado",   color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  closed:    { label: "Cerrado",     color: "bg-green-500/10 text-green-400 border-green-500/20" },
  lost:      { label: "Perdido",     color: "bg-red-500/10 text-red-400 border-red-500/20" },
};

export default async function LeadsAdmin() {
  const supabase = createClient();
  const { data: leads } = await supabase
    .from("re_seller_leads")
    .select("*")
    .order("created_at", { ascending: false });

  const total = leads?.length ?? 0;
  const newLeads = leads?.filter((l) => l.status === "new").length ?? 0;
  const thisWeek = leads?.filter((l) => Date.now() - new Date(l.created_at).getTime() < 7 * 24 * 60 * 60 * 1000).length ?? 0;

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2.5 mb-1">
          <Users className="h-5 w-5 text-cima-gold" />
          <h1 className="font-heading font-bold text-2xl text-cima-text">Propietarios</h1>
        </div>
        <p className="text-sm text-cima-text-muted">Personas que quieren vender o rentar su propiedad.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total leads",  value: total,    color: "text-cima-text" },
          { label: "Esta semana",  value: thisWeek, color: "text-blue-400" },
          { label: "Nuevos",       value: newLeads, color: "text-cima-gold" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-cima-border bg-cima-card p-5">
            <p className={`font-heading font-bold text-3xl leading-none ${s.color} mb-1`}>{s.value}</p>
            <p className="text-xs text-cima-text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      {!leads || leads.length === 0 ? (
        <div className="rounded-xl border border-cima-border bg-cima-card p-16 text-center">
          <Users className="h-8 w-8 text-cima-text-dim mx-auto mb-3" />
          <p className="text-cima-text-muted">Sin propietarios registrados aún.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-cima-border bg-cima-card overflow-hidden">
          <div className="grid grid-cols-[1fr_1fr_100px_140px_100px] gap-4 px-5 py-3 border-b border-cima-border bg-cima-bg">
            {["Nombre", "Contacto", "Operación", "Fecha", ""].map((h) => (
              <p key={h} className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">{h}</p>
            ))}
          </div>
          <div className="divide-y divide-cima-border">
            {leads.map((l: { id: string; name: string; phone: string; email: string | null; neighborhood: string | null; operation_type: string; status: string; created_at: string }) => {
              const st = STATUS_LABELS[l.status] ?? STATUS_LABELS.new;
              return (
                <div key={l.id} className="grid grid-cols-[1fr_1fr_100px_140px_100px] gap-4 px-5 py-4 items-center hover:bg-cima-surface/30 transition-colors">
                  {/* Name + neighborhood */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cima-gold/10 border border-cima-gold/20">
                      <span className="font-bold text-xs text-cima-gold">{l.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-cima-text truncate">{l.name}</p>
                      <p className="text-xs text-cima-text-muted">{l.neighborhood ?? "—"}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <p className="text-sm text-cima-text-muted">{l.phone}</p>
                    {l.email && <p className="text-xs text-cima-text-dim truncate">{l.email}</p>}
                  </div>

                  {/* Operation */}
                  <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-mono border w-fit ${
                    l.operation_type === "venta"
                      ? "bg-cima-gold/10 text-cima-gold border-cima-gold/20"
                      : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                  }`}>
                    {l.operation_type === "venta" ? "Venta" : "Renta"}
                  </span>

                  {/* Date */}
                  <div>
                    <p className="text-xs text-cima-text-muted">{formatDate(l.created_at)}</p>
                    <p className="text-[10px] text-cima-text-dim mt-0.5">{timeAgo(l.created_at)}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`https://wa.me/52${l.phone.replace(/\D/g, "")}?text=Hola ${encodeURIComponent(l.name)}, te contactamos de Cima Propiedades para tu solicitud de ${l.operation_type}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] text-xs hover:bg-[#25D366]/20 transition-colors"
                    >
                      <Phone className="h-3 w-3" />
                      WA
                    </a>
                    <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-mono border ${st.color}`}>
                      {st.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
