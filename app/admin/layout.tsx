import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/sidebar";
import AdminRealtimeToasts from "@/components/admin/realtime-toasts";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  try {
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
        <AdminRealtimeToasts />
      </div>
    );
  } catch (error) {
    // Re-throw redirect errors (Next.js uses NEXT_REDIRECT internally)
    if (error instanceof Error && error.message === "NEXT_REDIRECT") throw error;
    // Also check the digest property that Next.js uses
    if (typeof error === "object" && error !== null && "digest" in error) {
      const digest = (error as { digest: string }).digest;
      if (digest?.startsWith("NEXT_REDIRECT")) throw error;
    }
    console.error("Admin layout error:", error);
    return (
      <div className="min-h-screen bg-[#090A0D] flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <p className="font-bold text-lg text-red-400 mb-2">Error al cargar el admin</p>
          <p className="text-sm text-gray-400 mb-4">
            No se pudo inicializar la sesión. Verifica las variables de entorno de Supabase.
          </p>
          <p className="font-mono text-xs text-red-400/60">{error instanceof Error ? error.message : "Error desconocido"}</p>
          <a href="/admin/login" className="inline-block mt-4 px-4 py-2 rounded-lg bg-amber-500 text-black text-sm font-bold">
            Ir al login
          </a>
        </div>
      </div>
    );
  }
}
