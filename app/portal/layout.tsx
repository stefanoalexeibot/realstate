import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PortalNav from "@/components/portal/nav";

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

  return (
    <div className="min-h-screen bg-cima-bg">
      <PortalNav propName={prop.name} />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}
