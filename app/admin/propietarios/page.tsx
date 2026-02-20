"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { UserCheck, Plus, Phone, Home, Circle, CheckCircle2 } from "lucide-react";
import InvitePropietarioModal from "@/components/admin/invite-propietario-modal";

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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-MX", {
    day: "2-digit", month: "short", year: "numeric", timeZone: "America/Monterrey",
  });
}

export default function AdminPropietariosPage() {
  const [propietarios, setPropietarios] = useState<Propietario[]>([]);
  const [properties, setProperties]     = useState<Property[]>([]);
  const [loading, setLoading]           = useState(true);
  const [showModal, setShowModal]       = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const [{ data: props }, { data: propes }] = await Promise.all([
      supabase.from("re_propietarios").select("*").order("created_at", { ascending: false }),
      supabase.from("re_properties").select("id, title, slug, status, neighborhood, propietario_id").not("propietario_id", "is", null),
    ]);
    setPropietarios((props ?? []) as Propietario[]);
    setProperties((propes ?? []) as Property[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // Map propietario_id → property
  const propMap = new Map<string, Property>();
  properties.forEach((p) => { if (p.propietario_id) propMap.set(p.propietario_id, p); });

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-[10px] tracking-[0.2em] text-cima-gold uppercase mb-1">Portal</p>
          <h1 className="font-heading font-bold text-2xl text-cima-text">Propietarios</h1>
          <p className="text-sm text-cima-text-muted mt-0.5">Acceso al portal del cliente</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cima-gold text-cima-bg text-xs font-semibold hover:bg-cima-gold-light transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Nuevo propietario
        </button>
      </div>

      {loading ? (
        <div className="rounded-xl border border-cima-border bg-cima-card p-16 text-center">
          <div className="h-6 w-6 rounded-full border-2 border-cima-gold border-t-transparent animate-spin mx-auto" />
        </div>
      ) : propietarios.length === 0 ? (
        <div className="rounded-xl border border-cima-border bg-cima-card p-16 text-center">
          <UserCheck className="h-8 w-8 text-cima-text-dim mx-auto mb-3" />
          <p className="text-cima-text-muted mb-4">No hay propietarios registrados.</p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cima-gold/10 border border-cima-gold/30 text-cima-gold text-sm hover:bg-cima-gold/20 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Crear el primero
          </button>
        </div>
      ) : (
        <div className="rounded-xl border border-cima-border bg-cima-card overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_160px_180px_80px_100px] gap-4 px-5 py-3 border-b border-cima-border bg-cima-bg">
            {["Propietario", "Email / Teléfono", "Propiedad vinculada", "Portal", ""].map((h) => (
              <p key={h} className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">{h}</p>
            ))}
          </div>

          {/* Rows */}
          <div className="divide-y divide-cima-border">
            {propietarios.map((prop) => {
              const linked = propMap.get(prop.id);
              const hasAccess = !!prop.auth_id;

              return (
                <div
                  key={prop.id}
                  className="grid grid-cols-[1fr_160px_180px_80px_100px] gap-4 px-5 py-4 items-center hover:bg-cima-surface/20 transition-colors"
                >
                  {/* Name */}
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-cima-text truncate">{prop.name}</p>
                    <p className="text-[10px] text-cima-text-dim mt-0.5">{formatDate(prop.created_at)}</p>
                  </div>

                  {/* Email / phone */}
                  <div className="min-w-0">
                    <p className="text-xs text-cima-text-muted truncate">{prop.email}</p>
                    {prop.phone && (
                      <a
                        href={`https://wa.me/52${prop.phone.replace(/\D/g, "")}?text=Hola ${encodeURIComponent(prop.name)}, te contactamos de Cima`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-[10px] text-[#25D366] hover:underline mt-0.5"
                      >
                        <Phone className="h-2.5 w-2.5" />{prop.phone}
                      </a>
                    )}
                  </div>

                  {/* Linked property */}
                  <div className="min-w-0">
                    {linked ? (
                      <div>
                        <Link
                          href={`/admin/propiedades/${linked.id}/editar`}
                          className="flex items-center gap-1 text-xs text-cima-text hover:text-cima-gold transition-colors truncate"
                        >
                          <Home className="h-3 w-3 shrink-0" />
                          <span className="truncate">{linked.title}</span>
                        </Link>
                        {linked.neighborhood && (
                          <p className="text-[10px] text-cima-text-dim mt-0.5 truncate">{linked.neighborhood}</p>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-cima-text-dim italic">Sin vincular</span>
                    )}
                  </div>

                  {/* Portal status */}
                  <div>
                    {hasAccess ? (
                      <span className="flex items-center gap-1 text-xs text-emerald-400 font-mono">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Activo
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-cima-text-dim font-mono">
                        <Circle className="h-3.5 w-3.5" />
                        Sin acceso
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/propietarios/${prop.id}`}
                      className="text-xs text-cima-text-muted hover:text-cima-gold transition-colors"
                    >
                      Ver →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showModal && (
        <InvitePropietarioModal
          onClose={() => setShowModal(false)}
          onCreated={load}
        />
      )}
    </div>
  );
}
