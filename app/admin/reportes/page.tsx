import { createServiceClient } from "@/lib/supabase/server";
import { Building2, DollarSign, Clock, Users, MapPin, TrendingUp, TrendingDown } from "lucide-react";
import MiniBarChart from "@/components/admin/charts/mini-bar-chart";

const COMMISSION_RATE = 0.03; // 3% ventas, 1 mes renta

function fmt(n: number) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n);
}

function growth(curr: number, prev: number) {
  if (prev === 0) return null;
  return ((curr - prev) / prev) * 100;
}

export default async function ReportesPage() {
  const supabase = createServiceClient();
  const now = new Date();
  const som = new Date(now.getFullYear(), now.getMonth(), 1);          // start of this month
  const solm = new Date(now.getFullYear(), now.getMonth() - 1, 1);     // start of last month
  const eolm = new Date(now.getFullYear(), now.getMonth(), 0);         // end of last month
  const twelveAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const [
    { data: propsAll },
    { data: closedThisM },
    { data: closedLastM },
    { data: closedAll },
    { data: leadsAll },
    { data: visitsAll },
    { data: activeProps },
    { data: closingsHist },
    { data: leadsHist },
  ] = await Promise.all([
    supabase.from("re_properties").select("status, price, days_to_sell, operation_type, neighborhood"),
    supabase.from("re_properties").select("price, operation_type, days_to_sell")
      .in("status", ["sold", "rented"]).gte("sold_at", som.toISOString()),
    supabase.from("re_properties").select("price, operation_type")
      .in("status", ["sold", "rented"])
      .gte("sold_at", solm.toISOString()).lte("sold_at", eolm.toISOString()),
    supabase.from("re_properties").select("price, operation_type, days_to_sell, sold_at")
      .in("status", ["sold", "rented"]),
    supabase.from("re_seller_leads").select("pipeline_stage, created_at"),
    supabase.from("re_visits").select("status, created_at"),
    supabase.from("re_properties").select("neighborhood, operation_type").eq("status", "active"),
    supabase.from("re_properties").select("created_at, operation_type").in("status", ["sold", "rented"])
      .gte("created_at", twelveAgo.toISOString()),
    supabase.from("re_seller_leads").select("created_at").gte("created_at", twelveAgo.toISOString()),
  ]);

  // Commission helper
  function commission(items: { price: number; operation_type: string }[] | null) {
    return (items ?? []).reduce((s, p) =>
      s + (p.operation_type === "venta" ? p.price * COMMISSION_RATE : p.price), 0);
  }

  // This month
  const closedTM = closedThisM?.length ?? 0;
  const commTM = commission(closedThisM);

  // Last month
  const closedLM = closedLastM?.length ?? 0;
  const commLM = commission(closedLastM);

  // All time
  const closedTotal = closedAll?.length ?? 0;
  const commTotal = commission(closedAll);

  // Avg days to sell
  const withDays = (closedAll ?? []).filter((p) => p.days_to_sell != null);
  const avgDays = withDays.length > 0
    ? Math.round(withDays.reduce((s, p) => s + (p.days_to_sell ?? 0), 0) / withDays.length)
    : null;

  // Lead conversion
  const leadsVendido = (leadsAll ?? []).filter((l) => l.pipeline_stage === "vendido").length;
  const leadsTotal = leadsAll?.length ?? 0;
  const leadConv = leadsTotal > 0 ? Math.round((leadsVendido / leadsTotal) * 100) : 0;

  // Visit conversion
  const visitsDone = (visitsAll ?? []).filter((v) => v.status === "done").length;
  const visitsTotal = visitsAll?.length ?? 0;
  const visitConv = visitsTotal > 0 ? Math.round((visitsDone / visitsTotal) * 100) : 0;

  // Top neighborhoods (active)
  const nbCounts: Record<string, number> = {};
  (activeProps ?? []).forEach((p) => {
    if (p.neighborhood) nbCounts[p.neighborhood] = (nbCounts[p.neighborhood] ?? 0) + 1;
  });
  const topNb = Object.entries(nbCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);

  // Leads this month vs last month
  const leadsThisM = (leadsAll ?? []).filter((l) => new Date(l.created_at) >= som).length;
  const leadsLastM = (leadsAll ?? []).filter((l) => {
    const d = new Date(l.created_at);
    return d >= solm && d <= eolm;
  }).length;

  // Monthly charts (12 months)
  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
    return { key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleDateString("es-MX", { month: "short" }) };
  });
  function agg(items: { created_at: string }[] | null) {
    const c: Record<string, number> = Object.fromEntries(months.map((m) => [m.key, 0]));
    (items ?? []).forEach((x) => {
      const d = new Date(x.created_at);
      const k = `${d.getFullYear()}-${d.getMonth()}`;
      if (k in c) c[k]++;
    });
    return months.map((m) => ({ label: m.label, value: c[m.key] }));
  }

  const closingsChart = agg(closingsHist);
  const leadsChart = agg(leadsHist);

  // Properties by status
  const byStatus = { active: 0, sold: 0, rented: 0, inactive: 0 };
  (propsAll ?? []).forEach((p) => { if (p.status in byStatus) (byStatus as Record<string, number>)[p.status]++; });

  function GrowthBadge({ curr, prev }: { curr: number; prev: number }) {
    const g = growth(curr, prev);
    if (g === null) return null;
    const up = g >= 0;
    return (
      <span className={`inline-flex items-center gap-0.5 text-[10px] font-mono mt-1.5 ${up ? "text-emerald-400" : "text-red-400"}`}>
        {up ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
        {up ? "+" : ""}{g.toFixed(1)}% vs mes anterior
      </span>
    );
  }

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <p className="font-mono text-[10px] tracking-[0.2em] text-cima-gold uppercase mb-1">Inteligencia de negocio</p>
        <h1 className="font-heading font-bold text-2xl text-cima-text">Reportes</h1>
        <p className="text-sm text-cima-text-muted mt-1">
          Análisis de operaciones · Comisión base {(COMMISSION_RATE * 100).toFixed(0)}% venta · 1 mes renta
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Operaciones este mes", value: closedTM, type: "num",
            sub: `${closedLM} el mes pasado`, growth: growth(closedTM, closedLM),
            icon: Building2, color: "text-cima-gold", border: "border-cima-gold/20", bg: "bg-cima-gold/5",
          },
          {
            label: "Comisiones est. este mes", value: fmt(commTM), type: "str",
            sub: `${fmt(commLM)} el mes pasado`, growth: growth(commTM, commLM),
            icon: DollarSign, color: "text-emerald-400", border: "border-emerald-500/20", bg: "bg-emerald-500/5",
          },
          {
            label: "Días promedio en mercado", value: avgDays != null ? `${avgDays}d` : "—", type: "str",
            sub: "desde publicación a cierre", growth: null,
            icon: Clock, color: "text-blue-400", border: "border-blue-500/20", bg: "bg-blue-500/5",
          },
          {
            label: "Leads → cierre", value: `${leadConv}%`, type: "str",
            sub: `${leadsVendido} cerrados de ${leadsTotal}`, growth: null,
            icon: Users, color: "text-purple-400", border: "border-purple-500/20", bg: "bg-purple-500/5",
          },
        ].map((k) => (
          <div key={k.label} className={`rounded-xl border ${k.border} ${k.bg} p-5`}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-cima-text-muted leading-tight">{k.label}</p>
              <k.icon className={`h-4 w-4 ${k.color} shrink-0`} />
            </div>
            <p className={`font-heading font-bold text-2xl leading-none ${k.color}`}>{k.value}</p>
            <p className="text-xs text-cima-text-dim mt-1.5">{k.sub}</p>
            {k.growth !== null && <GrowthBadge curr={typeof k.value === "number" ? k.value : 0} prev={0} />}
            {k.growth !== null && (
              <span className={`inline-flex items-center gap-0.5 text-[10px] font-mono mt-1.5 ${(k.growth ?? 0) >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {(k.growth ?? 0) >= 0 ? "+" : ""}{(k.growth ?? 0).toFixed(1)}% vs mes anterior
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-cima-border bg-cima-card p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">Operaciones cerradas</p>
              <p className="text-xs text-cima-text-muted mt-0.5">Últimos 12 meses · {closedTotal} total histórico</p>
            </div>
            <Building2 className="h-4 w-4 text-cima-gold" />
          </div>
          <MiniBarChart data={closingsChart} color="bg-cima-gold/50 hover:bg-cima-gold/70" />
        </div>
        <div className="rounded-xl border border-cima-border bg-cima-card p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">Leads de propietarios</p>
              <p className="text-xs text-cima-text-muted mt-0.5">{leadsThisM} este mes · {leadsLastM} mes anterior</p>
            </div>
            <Users className="h-4 w-4 text-emerald-400" />
          </div>
          <MiniBarChart data={leadsChart} color="bg-emerald-500/40 hover:bg-emerald-500/60" />
        </div>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-cima-gold/20 bg-cima-gold/5 p-5">
          <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase mb-3">Comisiones totales estimadas</p>
          <p className="font-heading font-bold text-2xl text-cima-gold">{fmt(commTotal)}</p>
          <p className="text-xs text-cima-text-dim mt-1.5">Histórico · {closedTotal} operaciones</p>
        </div>
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5">
          <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase mb-3">Conversión visitas → cierre</p>
          <p className="font-heading font-bold text-2xl text-blue-400">{visitConv}%</p>
          <p className="text-xs text-cima-text-dim mt-1.5">{visitsDone} realizadas de {visitsTotal} total</p>
        </div>
        <div className="rounded-xl border border-cima-border bg-cima-card p-5">
          <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase mb-3">Catálogo por estado</p>
          <div className="space-y-1.5 mt-1">
            {[
              { label: "Activas", value: byStatus.active, color: "text-cima-gold" },
              { label: "Vendidas", value: byStatus.sold, color: "text-emerald-400" },
              { label: "Rentadas", value: byStatus.rented, color: "text-blue-400" },
              { label: "Inactivas", value: byStatus.inactive, color: "text-cima-text-dim" },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between">
                <span className="text-xs text-cima-text-muted">{s.label}</span>
                <span className={`font-mono text-xs font-bold ${s.color}`}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top neighborhoods */}
      <div className="rounded-xl border border-cima-border bg-cima-card p-5">
        <div className="flex items-center gap-2 mb-5">
          <MapPin className="h-4 w-4 text-cima-gold" />
          <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">Top colonias — propiedades activas</p>
        </div>
        {topNb.length === 0 ? (
          <p className="text-sm text-cima-text-dim">Sin datos.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {topNb.map(([nb, count], i) => (
              <div key={nb} className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-cima-text-dim w-4 shrink-0">#{i + 1}</span>
                <span className="text-xs text-cima-text-muted flex-1 truncate">{nb}</span>
                <div className="w-24 h-1.5 rounded-full bg-cima-surface overflow-hidden">
                  <div
                    className="h-full bg-cima-gold/60 rounded-full"
                    style={{ width: `${(count / topNb[0][1]) * 100}%` }}
                  />
                </div>
                <span className="font-mono text-xs text-cima-text font-bold w-4 text-right shrink-0">{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
