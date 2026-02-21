import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PortalDashboardClient from "@/components/portal/portal-dashboard-client";
import { type PortalDashboardData } from "@/types/portal";
import { type Property } from "@/lib/types";

function getDaysListed(createdAt: string) {
  const diff = Date.now() - new Date(createdAt).getTime();
  return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

export default async function PortalDashboard() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: prop } = await supabase
    .from("re_propietarios")
    .select("*")
    .eq("auth_id", user.id)
    .single();
  if (!prop) redirect("/portal/login");

  const { data: property } = await supabase
    .from("re_properties")
    .select("*, re_photos(id)")
    .eq("propietario_id", prop.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle() as { data: (Property & { re_photos: { id: string }[] }) | null };

  const { data: visits } = property
    ? await supabase
      .from("re_visits")
      .select("id, name, phone, status, preferred_date, created_at, agent_notes")
      .eq("property_id", property.id)
      .order("created_at", { ascending: false })
    : { data: [] };

  // Daily views (last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const { data: rawDailyViews } = property
    ? await supabase
      .from("re_property_views_daily")
      .select("date, count")
      .eq("property_id", property.id)
      .gte("date", thirtyDaysAgo)
      .order("date")
    : { data: [] };

  const dailyViews: { date: string; count: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const found = (rawDailyViews ?? []).find((r) => r.date === d);
    dailyViews.push({ date: d, count: found?.count ?? 0 });
  }

  // Comps
  let marketData = {
    compScope: "",
    validCompsCount: 0,
    myPricePerM2: null as number | null,
    avgMarketPricePerM2: null as number | null,
    diff: null as number | null,
  };

  if (property?.area_m2) {
    const { data: neighborhoodComps } = property.neighborhood
      ? await supabase
        .from("re_properties")
        .select("price, area_m2")
        .eq("status", "active")
        .eq("operation_type", property.operation_type)
        .eq("neighborhood", property.neighborhood)
        .neq("id", property.id)
        .not("area_m2", "is", null)
      : { data: null };

    const hasNeighborhoodComps = (neighborhoodComps?.length ?? 0) >= 2;
    const { data: cityComps } = (!hasNeighborhoodComps)
      ? await supabase
        .from("re_properties")
        .select("price, area_m2")
        .eq("status", "active")
        .eq("operation_type", property.operation_type)
        .eq("city", property.city)
        .neq("id", property.id)
        .not("area_m2", "is", null)
      : { data: null };

    const scope = hasNeighborhoodComps ? (property.neighborhood ?? "") : (property.city ?? "");
    const allComps = hasNeighborhoodComps ? (neighborhoodComps ?? []) : (cityComps ?? []);
    const validComps = allComps.filter((c: any) => c.area_m2 && c.price > 0);

    const myP = property.price / property.area_m2;
    const avgP = validComps.length >= 2
      ? validComps.reduce((sum: number, c: any) => sum + (c.price / c.area_m2), 0) / validComps.length
      : null;

    marketData = {
      compScope: scope,
      validCompsCount: validComps.length,
      myPricePerM2: myP,
      avgMarketPricePerM2: avgP,
      diff: avgP ? ((myP - avgP) / avgP) * 100 : null,
    };
  }

  const data: PortalDashboardData = {
    propName: prop.name,
    property,
    visits: visits ?? [],
    dailyViews,
    stats: {
      photoCount: property?.re_photos?.length ?? 0,
      totalVisits: visits?.length ?? 0,
      pendingVisits: (visits ?? []).filter((v: any) => v.status === "pending").length,
      views: property?.views ?? 0,
      daysListed: property ? getDaysListed(property.created_at) : 0,
    },
    market: marketData,
  };

  return <PortalDashboardClient data={data} />;
}
