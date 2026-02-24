import { createClient, createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ExpedienteDigitalClient from "@/components/portal/expediente-digital-client";

export default async function PortalDocumentos() {
  const authSupabase = createClient();
  const { data: { user } } = await authSupabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const supabase = createServiceClient();
  const { data: prop } = await supabase
    .from("re_propietarios")
    .select("id")
    .eq("auth_id", user.id)
    .single();
  if (!prop) redirect("/portal/login");

  const { data: docs } = await supabase
    .from("re_propietario_docs")
    .select("*")
    .eq("propietario_id", prop.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[10px] tracking-[0.2em] text-cima-gold uppercase mb-1">Mi portal</p>
        <h1 className="font-heading font-bold text-2xl text-cima-text">Expediente Digital</h1>
        <p className="text-sm text-cima-text-muted mt-1">Gestiona los documentos legales de tu propiedad y avanza hacia el cierre legal.</p>
      </div>

      <ExpedienteDigitalClient
        ownerId={prop.id}
        initialDocs={docs?.map(d => ({
          ...d,
          status: d.status || "pending",
          category: d.category || "legal"
        })) ?? []}
      />
    </div>
  );
}
