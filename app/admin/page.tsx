import { createClient } from "@/lib/supabase/server";
import { Building2, Calendar, Users } from "lucide-react";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("es-MX", {
    timeZone: "America/Monterrey",
    day: "2-digit", month: "short", year: "numeric",
  });
}

export default async function AdminDashboard() {
  const supabase = createClient();

  const [
    { count: totalProps },
    { count: activeProps },
    { count: totalVisits },
    { count: pendingVisits },
    { count: totalLeads },
    { data: recentVisits },
    { data: recentLeads },
  ] = await Promise.all([
    supabase.from("re_properties").select("*", { count: "exact", head: true }),
    supabase.from("re_properties").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("re_visits").select("*", { count: "exact", head: true }),
    supabase.from("re_visits").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("re_seller_leads").select("*", { count: "exact", head: true }),
    supabase.from("re_visits").select("*, re_properties(title, neighborhood)").order("created_at", { ascending: false }).limit(5),
    supabase.from("re_seller_leads").select("*").order("created_at", { ascending: false }).limit(5),
  ]);

  const stats = [
    { label: "Propiedades activas", value: activeProps ?? 0, total: totalProps ?? 0, icon: Building2, color: "text-cima-gold" },
    { label: "Visitas pendientes",  value: pendingVisits ?? 0, total: totalVisits ?? 0, icon: Calendar, color: "text-blue-400" },
    { label: "Leads de propietarios", value: totalLeads ?? 0, total: null, icon: Users, color: "text-emerald-400" },
  ];

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-[0.2em] text-cima-gold uppercase mb-1">Panel principal</p>
        <h1 className="font-heading font-bold text-2xl text-cima-text">Dashboard</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-cima-border bg-cima-card p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-cima-text-muted">{s.label}</p>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </div>
            <p className={`font-heading font-bold text-3xl leading-none ${s.color}`}>{s.value}</p>
            {s.total !== null && (
              <p className="text-xs text-cima-text-dim mt-1">{s.total} total</p>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent visits */}
        <div className="rounded-xl border border-cima-border bg-cima-card overflow-hidden">
          <div className="px-5 py-4 border-b border-cima-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-cima-gold" />
              <h2 className="font-heading font-semibold text-sm text-cima-text">Visitas recientes</h2>
            </div>
            <a href="/admin/visitas" className="text-xs text-cima-text-dim hover:text-cima-gold transition-colors">Ver todas →</a>
          </div>
          <div className="divide-y divide-cima-border">
            {(recentVisits ?? []).length === 0 ? (
              <p className="px-5 py-8 text-sm text-cima-text-muted text-center">Sin visitas aún</p>
            ) : (
              (recentVisits ?? []).map((v: { id: string; name: string; status: string; created_at: string; re_properties: { title: string } | null }) => (
                <div key={v.id} className="px-5 py-3">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="font-medium text-sm text-cima-text">{v.name}</p>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      v.status === "pending" ? "bg-amber-500/10 text-amber-400" :
                      v.status === "confirmed" ? "bg-blue-500/10 text-blue-400" :
                      "bg-cima-surface text-cima-text-dim"
                    }`}>
                      {v.status}
                    </span>
                  </div>
                  <p className="text-xs text-cima-text-muted truncate">{v.re_properties?.title ?? "Propiedad eliminada"}</p>
                  <p className="text-[10px] text-cima-text-dim mt-0.5">{formatDate(v.created_at)}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent leads */}
        <div className="rounded-xl border border-cima-border bg-cima-card overflow-hidden">
          <div className="px-5 py-4 border-b border-cima-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-cima-gold" />
              <h2 className="font-heading font-semibold text-sm text-cima-text">Propietarios recientes</h2>
            </div>
            <a href="/admin/leads" className="text-xs text-cima-text-dim hover:text-cima-gold transition-colors">Ver todos →</a>
          </div>
          <div className="divide-y divide-cima-border">
            {(recentLeads ?? []).length === 0 ? (
              <p className="px-5 py-8 text-sm text-cima-text-muted text-center">Sin leads aún</p>
            ) : (
              (recentLeads ?? []).map((l: { id: string; name: string; phone: string; neighborhood: string | null; created_at: string }) => (
                <div key={l.id} className="px-5 py-3 flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-cima-text">{l.name}</p>
                    <p className="text-xs text-cima-text-muted">{l.phone} · {l.neighborhood ?? "—"}</p>
                    <p className="text-[10px] text-cima-text-dim mt-0.5">{formatDate(l.created_at)}</p>
                  </div>
                  <a
                    href={`https://wa.me/52${l.phone.replace(/\D/g, "")}?text=Hola ${encodeURIComponent(l.name)}, te contactamos de Cima Propiedades`}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-3 shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] text-xs hover:bg-[#25D366]/20 transition-colors"
                  >
                    WA
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
