import { createServiceClient } from "@/lib/supabase/server";
import AdminDashboardClient from "@/components/admin/admin-dashboard-client";
import { type AdminDashboardData, type VisitRow, type LeadRow } from "@/types/admin";

const PIPELINE_STAGES_KEYS = [
  "prospecto", "contactado", "valuacion", "publicado", "negociacion", "vendido", "perdido",
];

export default async function AdminDashboard() {
  const supabase = createServiceClient();

  // 1. Get current user session and role
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user?.id).single();
  const isAgent = profile?.role === "agent";
  let agentId: string | null = null;

  if (isAgent && user) {
    const { data: agentData } = await supabase.from("re_agentes").select("id").eq("auth_id", user.id).single();
    agentId = agentData?.id ?? null;
  }

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  try {
    // Base builders
    const props = supabase.from("re_properties");
    const leads = supabase.from("re_seller_leads");
    const visits = supabase.from("re_visits");

    // Common filters
    const filterByAgent = <T extends any>(query: any) => {
      if (isAgent && agentId) {
        return query.eq("agent_id", agentId);
      }
      return query;
    };

    const results = await Promise.all([
      filterByAgent(props.select("status, views, property_type")),
      filterByAgent(leads.select("id", { count: "exact", head: true })).gte("created_at", weekAgo.toISOString()),
      filterByAgent(visits.select("id", { count: "exact", head: true })).eq("status", "pending"),
      filterByAgent(leads.select("pipeline_stage")),
      filterByAgent(visits.select("id, name, phone, status, created_at, re_properties(title, neighborhood, agent_id)"))
        .order("created_at", { ascending: false })
        .limit(5),
      filterByAgent(leads.select("id, name, phone, neighborhood, operation_type, pipeline_stage, created_at"))
        .order("created_at", { ascending: false })
        .limit(5),
      filterByAgent(leads.select("created_at")).gte("created_at", sixMonthsAgo.toISOString()),
      filterByAgent(visits.select("created_at, re_properties(agent_id)")).gte("created_at", sixMonthsAgo.toISOString()),
    ]);

    const propsData = results[0].data ?? [];
    const leadsThisWeek = results[1].count ?? 0;
    const pendingVisits = results[2].count ?? 0;
    const pipelineData = results[3].data ?? [];

    // Process visits
    const rawRecentVisits = results[4].data ?? [];
    const recentVisits = rawRecentVisits.map((v: any) => ({
      ...v,
      re_properties: Array.isArray(v.re_properties) ? v.re_properties[0] : v.re_properties,
    })) as VisitRow[];

    const recentLeads = (results[5].data ?? []) as LeadRow[];
    const leadsHistory = results[6].data ?? [];

    // Filter visits history for agents if necessary (since joined queries can be tricky)
    let visitsHistory = results[7].data ?? [];
    if (isAgent && agentId) {
      visitsHistory = visitsHistory.filter((v: any) => {
        const p = Array.isArray(v.re_properties) ? v.re_properties[0] : v.re_properties;
        return p?.agent_id === agentId;
      });
    }

    const propsByStatus = propsData;
    const allViews = propsData;
    const propsByType = propsData.filter((p: any) => p.status === 'active');

    // --- Process data ---
    const activeProps = propsByStatus.filter((p: any) => p.status === "active").length;
    const soldProps = propsByStatus.filter((p: any) => p.status === "sold").length;
    const totalProps = propsByStatus.length;
    const totalViews = allViews.reduce((s: number, p: any) => s + ((p as { views: number }).views ?? 0), 0);

    // Pipeline counts
    const pipelineCounts: Record<string, number> = Object.fromEntries(
      PIPELINE_STAGES_KEYS.map((s) => [s, 0])
    );
    pipelineData.forEach((l: any) => {
      const stage = (l as { pipeline_stage: string }).pipeline_stage;
      if (stage in pipelineCounts) pipelineCounts[stage]++;
    });
    const pipelineTotal = Object.values(pipelineCounts).reduce((a, b) => a + b, 0);
    const uncontacted = pipelineCounts["prospecto"] ?? 0;

    // Property type breakdown
    const typeCounts: Record<string, number> = {};
    propsByType.forEach((p: any) => {
      const type = (p as { property_type: string }).property_type;
      typeCounts[type] = (typeCounts[type] ?? 0) + 1;
    });

    // Monthly charts aggregation
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      return {
        key: `${d.getFullYear()}-${d.getMonth()}`,
        label: d.toLocaleDateString("es-MX", { month: "short" }),
      };
    });

    const agg = (items: { created_at: string }[]) => {
      const counts: Record<string, number> = Object.fromEntries(months.map((m: any) => [m.key, 0]));
      items.forEach((item: any) => {
        const d = new Date(item.created_at);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        if (key in counts) counts[key]++;
      });
      return months.map((m: any) => ({ label: m.label, value: counts[m.key] }));
    };

    const leadsChart = agg(leadsHistory as { created_at: string }[]);
    const visitsChart = agg(visitsHistory as { created_at: string }[]);

    const todayStr = new Date().toLocaleDateString("es-MX", {
      weekday: "long", day: "numeric", month: "long", timeZone: "America/Monterrey",
    });

    const data: AdminDashboardData = {
      activeProps, soldProps, totalProps, totalViews,
      leadsThisWeek, pendingVisits, pipelineCounts, pipelineTotal,
      uncontacted, typeCounts, leadsChart, visitsChart, todayStr,
      recentVisits, recentLeads,
    };

    return <AdminDashboardClient data={data} />;
  } catch (err) {
    console.error("Admin dashboard data fetch error:", err);
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <p className="font-heading font-bold text-lg text-red-400 mb-2">Error al cargar el dashboard</p>
          <p className="text-sm text-cima-text-muted mb-4">
            No se pudieron obtener los datos. Verifica que las variables de entorno de Supabase estén configuradas en Vercel.
          </p>
          <p className="font-mono text-xs text-red-400/60">{err instanceof Error ? err.message : "Error desconocido"}</p>
        </div>
      </div>
    );
  }
}
