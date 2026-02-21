import { createClient } from "@/lib/supabase/server";
import AdminDashboardClient, { type AdminDashboardData } from "@/components/admin/admin-dashboard-client";

const PIPELINE_STAGES_KEYS = [
  "prospecto", "contactado", "valuacion", "publicado", "negociacion", "vendido", "perdido",
];

export default async function AdminDashboard() {
  const supabase = createClient();

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  try {
    const results = await Promise.all([
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

    const propsByStatus = results[0].data ?? [];
    const allViews = results[1].data ?? [];
    const leadsThisWeek = results[2].count ?? 0;
    const pendingVisits = results[3].count ?? 0;
    const pipelineData = results[4].data ?? [];
    const recentVisits = (results[5].data ?? []) as AdminDashboardData["recentVisits"];
    const recentLeads = (results[6].data ?? []) as AdminDashboardData["recentLeads"];
    const leadsHistory = results[7].data ?? [];
    const visitsHistory = results[8].data ?? [];
    const propsByType = results[9].data ?? [];

    // --- Process data ---
    const activeProps = propsByStatus.filter((p) => p.status === "active").length;
    const soldProps = propsByStatus.filter((p) => p.status === "sold").length;
    const totalProps = propsByStatus.length;
    const totalViews = allViews.reduce((s, p) => s + ((p as { views: number }).views ?? 0), 0);

    // Pipeline
    const pipelineCounts: Record<string, number> = Object.fromEntries(
      PIPELINE_STAGES_KEYS.map((s) => [s, 0])
    );
    pipelineData.forEach((l) => {
      const stage = (l as { pipeline_stage: string }).pipeline_stage;
      if (stage in pipelineCounts) pipelineCounts[stage]++;
    });
    const pipelineTotal = Object.values(pipelineCounts).reduce((a, b) => a + b, 0);
    const uncontacted = pipelineCounts["prospecto"] ?? 0;

    // Property type breakdown
    const typeCounts: Record<string, number> = {};
    propsByType.forEach((p) => {
      const type = (p as { property_type: string }).property_type;
      typeCounts[type] = (typeCounts[type] ?? 0) + 1;
    });

    // Monthly charts (last 6 months)
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      return {
        key: `${d.getFullYear()}-${d.getMonth()}`,
        label: d.toLocaleDateString("es-MX", { month: "short" }),
      };
    });

    function agg(items: { created_at: string }[]) {
      const counts: Record<string, number> = Object.fromEntries(months.map((m) => [m.key, 0]));
      items.forEach((item) => {
        const d = new Date(item.created_at);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        if (key in counts) counts[key]++;
      });
      return months.map((m) => ({ label: m.label, value: counts[m.key] }));
    }

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
