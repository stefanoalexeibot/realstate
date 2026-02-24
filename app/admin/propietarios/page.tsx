import { createAdminClient } from "@/lib/supabase/server";
import Link from "next/link";
import { UserCheck, Phone, Home, Circle, CheckCircle2 } from "lucide-react";
import PropietariosClientActions from "@/components/admin/propietarios-client-actions";
import DeleteOwnerButton from "@/components/admin/delete-owner-button";

import AdminOwnersList from "@/components/admin/admin-owners-list";

type Propietario = {
  id: string;
  created_at: string;
  auth_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  notes: string | null;
};

type Property = {
  id: string;
  title: string;
  slug: string;
  status: string;
  neighborhood: string | null;
  propietario_id: string | null;
};

export const dynamic = "force-dynamic";

export default async function AdminPropietariosPage() {
  const supabase = createAdminClient();

  const [{ data: propietarios }, { data: properties }] = await Promise.all([
    supabase.from("re_propietarios").select("*").order("created_at", { ascending: false }),
    supabase.from("re_properties")
      .select("id, title, slug, status, neighborhood, propietario_id")
      .not("propietario_id", "is", null),
  ]);

  const allPropietarios = (propietarios ?? []) as Propietario[];
  const allProperties = (properties ?? []) as Property[];

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="font-mono text-[10px] tracking-[0.2em] text-cima-gold uppercase mb-1">Portal</p>
          <h1 className="font-heading font-bold text-xl sm:text-2xl text-cima-text">Propietarios</h1>
          <p className="text-xs sm:text-sm text-cima-text-muted mt-0.5">Acceso al portal del cliente</p>
        </div>
        <PropietariosClientActions />
      </div>

      <AdminOwnersList
        initialOwners={allPropietarios}
        initialProperties={allProperties}
      />
    </div>
  );
}
