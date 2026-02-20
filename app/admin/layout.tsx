import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Propietarios must not access admin — send them to their portal
  const { data: prop } = await supabase
    .from("re_propietarios")
    .select("id")
    .eq("auth_id", user.id)
    .maybeSingle();

  if (prop) {
    redirect("/portal");
  }

  return (
    <div className="min-h-screen bg-cima-bg">
      <AdminSidebar />
      {/* Desktop: offset for sidebar; Mobile: offset for top bar */}
      <main className="lg:pl-60 pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
