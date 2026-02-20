import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PortalNav from "@/components/portal/nav";
import PortalRealtimeToasts from "@/components/portal/realtime-toasts";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/portal/login");
  }

  // Check if this user is a registered propietario
  const { data: prop } = await supabase
    .from("re_propietarios")
    .select("id, name")
    .eq("auth_id", user.id)
    .single();

  if (!prop) {
    // Authenticated but not a propietario — sign out and send to portal login.
    // This prevents admin sessions from leaking into the portal or vice versa.
    await supabase.auth.signOut();
    redirect("/portal/login");
  }

  // Pending visits badge — get the propietario's property then count pending visits
  const { data: property } = await supabase
    .from("re_properties")
    .select("id")
    .eq("propietario_id", prop.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let pendingVisits = 0;
  if (property) {
    const { count } = await supabase
      .from("re_visits")
      .select("id", { count: "exact", head: true })
      .eq("property_id", property.id)
      .eq("status", "pending");
    pendingVisits = count ?? 0;
  }

  return (
    <div className="min-h-screen bg-cima-bg">
      <PortalNav propName={prop.name} pendingVisits={pendingVisits} />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
      <PortalRealtimeToasts propertyId={property?.id ?? ""} />
    </div>
  );
}
