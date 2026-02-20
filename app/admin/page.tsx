import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  Building2, Calendar, Users, Eye, Plus,
  AlertCircle, Phone, Home, MapPin,
  CheckCircle2, Clock,
} from "lucide-react";
import MiniBarChart from "@/components/admin/charts/mini-bar-chart";

const PIPELINE_STAGES = [
  { key: "prospecto",   label: "Prospecto",   dot: "bg-amber-400",    seg: "bg-amber-500/70" },
  { key: "contactado",  label: "Contactado",  dot: "bg-blue-400",     seg: "bg-blue-500/70" },
  { key: "valuacion",   label: "Valuación",   dot: "bg-purple-400",   seg: "bg-purple-500/70" },
  { key: "publicado",   label: "Publicado",   dot: "bg-emerald-400",  seg: "bg-emerald-500/70" },
  { key: "negociacion", label: "Negociación", dot: "bg-orange-400",   seg: "bg-orange-500/70" },
  { key: "vendido",     label: "Vendido",     dot: "bg-green-400",    seg: "bg-green-500/70" },
  { key: "perdido",     label: "Perdido",     dot: "bg-red-400",      seg: "bg-red-500/70" },
];

const VISIT_STATUS: Record<string, { label: string; color: string }> = {
  pending:   { label: "Pendiente",  color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  confirmed: { label: "Confirmada", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  done:      { label: "Realizada",  color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  cancelled: { label: "Cancelada",  color: "bg-cima-surface text-cima-text-dim border-cima-border" },
};

function greeting() {
  const h = new Date().toLocaleString("es-MX", { hour: "numeric", hour12: false, timeZone: "America/Monterrey" });
  const n = Number(h);
  if (n < 12) return "Buenos días";
  if (n < 19) return "Buenas tardes";
  return "Buenas noches";
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `Hace ${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Hace ${hrs}h`;
  return `Hace ${Math.floor(hrs / 24)}d`;
}

export default async function AdminDashboard() {
  const supabase = createClient();

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [
    { data: propsByStatus },
    { data: allViews },
    { count: leadsThisWeek },
    { count: pendingVisits },
    { data: pipelineData },
    { data: recentVisits },
    { data: recentLeads },
    { data: leadsHistory },
    { data: visitsHistory },
    { data: propsByType },
  ] = await Promise.all([
    supabase.from("re_properties").select("status"),
    supabase.from("re_properties").select("views"),
    supabase.from("re_seller_leads")
      .select("id", { count: "exact", head: true })
      .gte("created_at", weekAgo.toISOString()),
    supabase.from("re_visits")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase.from("re_seller_leads").select("pipeline_stage"),
    supabase.from("re_visits")
      .select("id, name, phone, status, created_at, re_properties(title, neighborhood)")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("re_seller_leads")
      .select("id, name, phone, neighborhood, operation_type, pipeline_stage, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("re_seller_leads")
      .select("created_at")
      .gte("created_at", sixMonthsAgo.toISOString()),
    supabase.from("re_visits")
      .select("created_at")
      .gte("created_at", sixMonthsAgo.toISOString()),
    supabase.from("re_properties").select("property_type").eq("status", "active"),
  ]);

  // --- Process data ---
  const activeProps = propsByStatus?.filter((p) => p.status === "active").length ?? 0;
  const soldProps   = propsByStatus?.filter((p) => p.status === "sold").length ?? 0;
  const totalProps  = propsByStatus?.length ?? 0;
  const totalViews  = allViews?.reduce((s, p) => s + (p.views ?? 0), 0) ?? 0;

  // Pipeline
  const pipelineCounts: Record<string, number> = Object.fromEntries(
    PIPELINE_STAGES.map((s) => [s.key, 0])
  );
  pipelineData?.forEach((l) => {
    if (l.pipeline_stage in pipelineCounts) pipelineCounts[l.pipeline_stage]++;
  });
  const pipelineTotal = Object.values(pipelineCounts).reduce((a, b) => a + b, 0);
  const uncontacted   = pipelineCounts["prospecto"] ?? 0;

  // Property type breakdown
  const typeCounts: Record<string, number> = {};
  propsByType?.forEach((p) => {
    typeCounts[p.property_type] = (typeCounts[p.property_type] ?? 0) + 1;
  });
  const typeLabels: Record<string, string> = {
    casa: "Casas", departamento: "Deptos", terreno: "Terrenos", local: "Locales", oficina: "Oficinas",
  };

  // Monthly charts (last 6 months)
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    return {
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: d.toLocaleDateString("es-MX", { month: "short" }),
    };
  });

  function agg(items: { created_at: string }[] | null) {
    const counts: Record<string, number> = Object.fromEntries(months.map((m) => [m.key, 0]));
    (items ?? []).forEach((item) => {
      const d = new Date(item.created_at);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (key in counts) counts[key]++;
    });
    return months.map((m) => ({ label: m.label, value: counts[m.key] }));
  }

  const leadsChart  = agg(leadsHistory);
  const visitsChart = agg(visitsHistory);

  const todayStr = new Date().toLocaleDateString("es-MX", {
    weekday: "long", day: "numeric", month: "long", timeZone: "America/Monterrey",
  });

  type VisitRow = {
    id: string; name: string; phone: string; status: string; created_at: string;
    re_properties: { title: string; neighborhood: string | null } | null;
  };
  type LeadRow = {
    id: string; name: string; phone: string; neighborhood: string | null;
    operation_type: string; pipeline_stage: string; created_at: string;
  };

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto space-y-6">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-[0.2em] text-cima-gold uppercase mb-1 capitalize">
            {todayStr}
          </p>
          <h1 className="font-heading font-bold text-2xl text-cima-text">{greeting()}, Cima Propiedades</h1>
          <p className="text-sm text-cima-text-muted mt-1">
            {activeProps} propiedades activas · {pipelineTotal} propietarios en pipeline · {leadsThisWeek ?? 0} leads esta semana
          </p>
        </div>
        <Link
          href="/admin/propiedades/nueva"
          className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-lg bg-cima-gold text-cima-bg text-sm font-semibold hover:bg-cima-gold-light transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          Nueva propiedad
        </Link>
      </div>

      {/* ── Alerts ── */}
      {((pendingVisits ?? 0) > 0 || uncontacted > 0) && (
        <div className="flex flex-wrap gap-3">
          {(pendingVisits ?? 0) > 0 && (
            <Link
              href="/admin/visitas"
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 transition-colors"
            >
              <Clock className="h-4 w-4 text-amber-400 shrink-0" />
              <span className="text-sm text-amber-300">
                <span className="font-bold">{pendingVisits}</span>{" "}
                {pendingVisits === 1 ? "visita pendiente de confirmar" : "visitas pendientes de confirmar"}
              </span>
            </Link>
          )}
          {uncontacted > 0 && (
            <Link
              href="/admin/leads"
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 transition-colors"
            >
              <AlertCircle className="h-4 w-4 text-blue-400 shrink-0" />
              <span className="text-sm text-blue-300">
                <span className="font-bold">{uncontacted}</span>{" "}
                {uncontacted === 1 ? "propietario sin contactar" : "propietarios sin contactar"}
              </span>
            </Link>
          )}
        </div>
      )}

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Propiedades activas",
            value: activeProps,
            sub: `${totalProps} total · ${soldProps} vendidas`,
            icon: Building2,
            color: "text-cima-gold",
            border: "border-cima-gold/20",
            bg: "bg-cima-gold/5",
          },
          {
            label: "Visitas pendientes",
            value: pendingVisits ?? 0,
            sub: "esperan confirmación",
            icon: Calendar,
            color: (pendingVisits ?? 0) > 0 ? "text-amber-400" : "text-cima-text-muted",
            border: (pendingVisits ?? 0) > 0 ? "border-amber-500/20" : "border-cima-border",
            bg: (pendingVisits ?? 0) > 0 ? "bg-amber-500/5" : "bg-cima-card",
            href: "/admin/visitas",
          },
          {
            label: "Leads esta semana",
            value: leadsThisWeek ?? 0,
            sub: `${pipelineTotal} en pipeline`,
            icon: Users,
            color: "text-emerald-400",
            border: "border-emerald-500/20",
            bg: "bg-emerald-500/5",
            href: "/admin/leads",
          },
          {
            label: "Vistas totales",
            value: totalViews,
            sub: "en todas las propiedades",
            icon: Eye,
            color: "text-purple-400",
            border: "border-purple-500/20",
            bg: "bg-purple-500/5",
          },
        ].map((kpi) => {
          const inner = (
            <div className={`rounded-xl border ${kpi.border} ${kpi.bg} p-5 h-full transition-colors ${kpi.href ? "hover:opacity-80 cursor-pointer" : ""}`}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-cima-text-muted">{kpi.label}</p>
                <kpi.icon className={`h-4 w-4 ${kpi.color} shrink-0`} />
              </div>
              <p className={`font-heading font-bold text-3xl leading-none ${kpi.color}`}>
                {kpi.value.toLocaleString("es-MX")}
              </p>
              <p className="text-xs text-cima-text-dim mt-1.5">{kpi.sub}</p>
            </div>
          );
          return kpi.href
            ? <Link key={kpi.label} href={kpi.href}>{inner}</Link>
            : <div key={kpi.label}>{inner}</div>;
        })}
      </div>

      {/* ── Quick actions ── */}
      <div className="flex gap-2 flex-wrap">
        {[
          { label: "+ Nueva propiedad", href: "/admin/propiedades/nueva", primary: true },
          { label: "Pipeline",    href: "/admin/pipeline" },
          { label: "Visitas",     href: "/admin/visitas" },
          { label: "Leads",       href: "/admin/leads" },
          { label: "Propiedades", href: "/admin/propiedades" },
        ].map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className={`flex items-center px-3.5 py-2 rounded-lg border text-xs font-medium transition-colors ${
              a.primary
                ? "bg-cima-gold/10 border-cima-gold/30 text-cima-gold hover:bg-cima-gold/20"
                : "border-cima-border text-cima-text-muted hover:bg-cima-surface hover:text-cima-text"
            }`}
          >
            {a.label}
          </Link>
        ))}
      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-cima-border bg-cima-card p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">Leads por mes</p>
              <p className="text-xs text-cima-text-muted mt-0.5">Propietarios que contactaron</p>
            </div>
            <Users className="h-4 w-4 text-cima-gold" />
          </div>
          <MiniBarChart data={leadsChart} color="bg-cima-gold/50 hover:bg-cima-gold/70" />
        </div>

        <div className="rounded-xl border border-cima-border bg-cima-card p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">Visitas por mes</p>
              <p className="text-xs text-cima-text-muted mt-0.5">Solicitudes de compradores</p>
            </div>
            <Calendar className="h-4 w-4 text-blue-400" />
          </div>
          <MiniBarChart data={visitsChart} color="bg-blue-500/40 hover:bg-blue-500/60" />
        </div>
      </div>

      {/* ── Pipeline + Propiedades por tipo ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">

        {/* Pipeline snapshot */}
        <div className="rounded-xl border border-cima-border bg-cima-card p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">Pipeline de propietarios</p>
              <p className="text-xs text-cima-text-muted mt-0.5">{pipelineTotal} propietarios en proceso</p>
            </div>
            <Link href="/admin/pipeline" className="text-xs text-cima-text-dim hover:text-cima-gold transition-colors">
              Ver kanban →
            </Link>
          </div>

          {pipelineTotal > 0 ? (
            <>
              {/* Segmented bar */}
              <div className="flex h-3 rounded-full overflow-hidden gap-px mb-5 bg-cima-surface">
                {PIPELINE_STAGES.map((stage) => {
                  const pct = (pipelineCounts[stage.key] / pipelineTotal) * 100;
                  return pct > 0 ? (
                    <div
                      key={stage.key}
                      style={{ width: `${pct}%` }}
                      className={`${stage.seg} h-full first:rounded-l-full last:rounded-r-full transition-all`}
                      title={`${stage.label}: ${pipelineCounts[stage.key]}`}
                    />
                  ) : null;
                })}
              </div>

              {/* Stage legend with bars */}
              <div className="space-y-2">
                {PIPELINE_STAGES.map((stage) => {
                  const count = pipelineCounts[stage.key];
                  const pct = pipelineTotal > 0 ? (count / pipelineTotal) * 100 : 0;
                  return (
                    <div key={stage.key} className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 w-24 shrink-0">
                        <div className={`h-2 w-2 rounded-full ${stage.dot} shrink-0`} />
                        <span className="text-xs text-cima-text-muted truncate">{stage.label}</span>
                      </div>
                      <div className="flex-1 h-1.5 rounded-full bg-cima-surface overflow-hidden">
                        <div
                          className={`h-full ${stage.seg} rounded-full transition-all duration-500`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className={`font-mono text-xs w-4 text-right shrink-0 ${count > 0 ? "text-cima-text" : "text-cima-text-dim"}`}>
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <p className="text-sm text-cima-text-dim py-4">Sin propietarios en pipeline aún.</p>
          )}
        </div>

        {/* Properties by type */}
        <div className="rounded-xl border border-cima-border bg-cima-card p-5">
          <div className="mb-5">
            <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">Catálogo activo</p>
            <p className="text-xs text-cima-text-muted mt-0.5">Propiedades por tipo</p>
          </div>
          <div className="space-y-3">
            {Object.entries(typeCounts).length === 0 ? (
              <p className="text-sm text-cima-text-dim">Sin propiedades activas.</p>
            ) : (
              Object.entries(typeCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([type, count]) => (
                  <div key={type} className="flex items-center gap-3">
                    <Home className="h-3.5 w-3.5 text-cima-gold/60 shrink-0" />
                    <span className="text-xs text-cima-text-muted flex-1 capitalize">
                      {typeLabels[type] ?? type}
                    </span>
                    <div className="flex-1 h-1.5 rounded-full bg-cima-surface overflow-hidden">
                      <div
                        className="h-full bg-cima-gold/50 rounded-full transition-all duration-500"
                        style={{ width: `${(count / activeProps) * 100}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs text-cima-text font-bold w-4 text-right shrink-0">{count}</span>
                  </div>
                ))
            )}
          </div>

          <div className="mt-5 pt-4 border-t border-cima-border grid grid-cols-2 gap-3">
            <div className="text-center">
              <p className="font-heading font-bold text-2xl text-cima-gold">{activeProps}</p>
              <p className="font-mono text-[9px] text-cima-text-dim uppercase tracking-wider mt-0.5">Activas</p>
            </div>
            <div className="text-center">
              <p className="font-heading font-bold text-2xl text-cima-text">{soldProps}</p>
              <p className="font-mono text-[9px] text-cima-text-dim uppercase tracking-wider mt-0.5">Vendidas</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Recent activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-4">

        {/* Recent visits */}
        <div className="rounded-xl border border-cima-border bg-cima-card overflow-hidden">
          <div className="px-5 py-4 border-b border-cima-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-cima-gold" />
              <h2 className="font-heading font-semibold text-sm text-cima-text">Visitas recientes</h2>
            </div>
            <Link href="/admin/visitas" className="text-xs text-cima-text-dim hover:text-cima-gold transition-colors">
              Ver todas →
            </Link>
          </div>
          <div className="divide-y divide-cima-border">
            {(recentVisits ?? []).length === 0 ? (
              <div className="px-5 py-10 text-center">
                <CheckCircle2 className="h-6 w-6 text-cima-text-dim mx-auto mb-2" />
                <p className="text-sm text-cima-text-muted">Sin visitas aún</p>
              </div>
            ) : (
              (recentVisits as unknown as VisitRow[]).map((v) => {
                const st = VISIT_STATUS[v.status] ?? VISIT_STATUS.pending;
                return (
                  <div key={v.id} className="px-5 py-3 flex items-start justify-between gap-3 hover:bg-cima-surface/20 transition-colors">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <p className="font-medium text-sm text-cima-text">{v.name}</p>
                        <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-mono border ${st.color}`}>
                          {st.label}
                        </span>
                      </div>
                      {v.re_properties?.title && (
                        <div className="flex items-center gap-1 mb-0.5">
                          <MapPin className="h-2.5 w-2.5 text-cima-text-dim shrink-0" />
                          <p className="text-xs text-cima-text-muted truncate">{v.re_properties.title}</p>
                        </div>
                      )}
                      <p className="text-[10px] text-cima-text-dim">{timeAgo(v.created_at)}</p>
                    </div>
                    <a
                      href={`https://wa.me/52${v.phone.replace(/\D/g, "")}?text=Hola ${encodeURIComponent(v.name)}, te contactamos de Cima para confirmar tu visita`}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] text-[10px] font-medium hover:bg-[#25D366]/20 transition-colors"
                    >
                      <Phone className="h-3 w-3" />
                      WA
                    </a>
                  </div>
                );
              })
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
            <Link href="/admin/leads" className="text-xs text-cima-text-dim hover:text-cima-gold transition-colors">
              Ver todos →
            </Link>
          </div>
          <div className="divide-y divide-cima-border">
            {(recentLeads ?? []).length === 0 ? (
              <div className="px-5 py-10 text-center">
                <Users className="h-6 w-6 text-cima-text-dim mx-auto mb-2" />
                <p className="text-sm text-cima-text-muted">Sin leads aún</p>
              </div>
            ) : (
              (recentLeads as LeadRow[]).map((l) => {
                const stage = PIPELINE_STAGES.find((s) => s.key === l.pipeline_stage);
                return (
                  <div key={l.id} className="px-5 py-3 flex items-center justify-between gap-3 hover:bg-cima-surface/20 transition-colors">
                    <div className="min-w-0 flex items-center gap-2.5">
                      <div className="h-8 w-8 shrink-0 rounded-full bg-cima-gold/10 border border-cima-gold/20 flex items-center justify-center">
                        <span className="text-xs font-bold text-cima-gold">{l.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-medium text-sm text-cima-text truncate">{l.name}</p>
                          {stage && <div className={`h-1.5 w-1.5 rounded-full ${stage.dot} shrink-0`} title={stage.label} />}
                        </div>
                        <p className="text-xs text-cima-text-muted truncate">
                          {l.neighborhood ?? "—"} · {l.operation_type === "venta" ? "Venta" : "Renta"}
                        </p>
                        <p className="text-[10px] text-cima-text-dim">{timeAgo(l.created_at)}</p>
                      </div>
                    </div>
                    <a
                      href={`https://wa.me/52${l.phone.replace(/\D/g, "")}?text=Hola ${encodeURIComponent(l.name)}, te contactamos de Cima Propiedades`}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] text-[10px] font-medium hover:bg-[#25D366]/20 transition-colors"
                    >
                      <Phone className="h-3 w-3" />
                      WA
                    </a>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
