"use client";

import { useState } from "react";
import Link from "next/link";
import { UserCheck, Phone, Home, Circle, CheckCircle2 } from "lucide-react";
import AdminSearch from "./admin-search";
import DeleteOwnerButton from "./delete-owner-button";

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

export default function AdminOwnersList({
    initialOwners,
    initialProperties
}: {
    initialOwners: Propietario[];
    initialProperties: Property[];
}) {
    const [search, setSearch] = useState("");

    const propMap = new Map<string, Property>();
    initialProperties.forEach((p) => { if (p.propietario_id) propMap.set(p.propietario_id, p); });

    const filtered = initialOwners.filter((o) =>
        o.name.toLowerCase().includes(search.toLowerCase()) ||
        o.email.toLowerCase().includes(search.toLowerCase()) ||
        (o.phone || "").includes(search)
    );

    return (
        <>
            <AdminSearch
                placeholder="Buscar por nombre, email o teléfono..."
                value={search}
                onChange={setSearch}
            />

            {filtered.length === 0 ? (
                <div className="rounded-xl border border-cima-border bg-cima-card p-12 sm:p-16 text-center">
                    <UserCheck className="h-8 w-8 text-cima-text-dim mx-auto mb-3" />
                    <p className="text-sm text-cima-text-muted mb-4">No se encontraron propietarios.</p>
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="text-cima-gold text-xs mt-2 hover:underline"
                        >
                            Limpiar búsqueda
                        </button>
                    )}
                </div>
            ) : (
                <div className="rounded-xl border border-cima-border bg-cima-card overflow-hidden">
                    {/* Table header (Desktop Only) */}
                    <div className="hidden sm:grid grid-cols-[1fr_160px_180px_100px_100px] gap-4 px-5 py-3 border-b border-cima-border bg-cima-bg">
                        {["Propietario", "Email / Teléfono", "Propiedad vinculada", "Portal", ""].map((h) => (
                            <p key={h} className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">{h}</p>
                        ))}
                    </div>

                    <div className="divide-y divide-cima-border">
                        {filtered.map((prop) => {
                            const linked = propMap.get(prop.id);
                            const hasAccess = !!prop.auth_id;

                            return (
                                <div
                                    key={prop.id}
                                    className="flex flex-col sm:grid sm:grid-cols-[1fr_160px_180px_100px_100px] gap-4 px-4 sm:px-5 py-5 sm:py-4 items-start sm:items-center hover:bg-cima-surface/20 transition-colors"
                                >
                                    <div className="w-full sm:min-w-0 flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="font-semibold sm:font-medium text-sm text-cima-text truncate">{prop.name}</p>
                                            <p className="text-[10px] text-cima-text-dim mt-0.5 sm:mt-0">{formatDate(prop.created_at)}</p>
                                        </div>
                                        <div className="sm:hidden shrink-0">
                                            {hasAccess ? (
                                                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    Activo
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-[10px] text-cima-text-dim font-mono bg-cima-surface px-2 py-0.5 rounded border border-cima-border">
                                                    <Circle className="h-3 w-3" />
                                                    Sin acceso
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="w-full sm:min-w-0 border-t border-cima-border/50 sm:border-0 pt-3 sm:pt-0">
                                        <p className="sm:hidden text-[9px] text-cima-text-dim font-mono uppercase mb-1">Contacto</p>
                                        <p className="text-xs text-cima-text-muted truncate mb-1 sm:mb-0.5">{prop.email}</p>
                                        {prop.phone && (
                                            <a
                                                href={`https://wa.me/52${prop.phone.replace(/\D/g, "")}?text=Hola ${encodeURIComponent(prop.name)}, te contactamos de Cima`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center gap-1 text-[10px] text-[#25D366] hover:underline"
                                            >
                                                <Phone className="h-3 w-3" />{prop.phone}
                                            </a>
                                        )}
                                    </div>

                                    <div className="w-full sm:min-w-0 border-t border-cima-border/50 sm:border-0 pt-3 sm:pt-0">
                                        <p className="sm:hidden text-[9px] text-cima-text-dim font-mono uppercase mb-1">Propiedad</p>
                                        {linked ? (
                                            <div>
                                                <Link
                                                    href={`/admin/propiedades/${linked.id}/editar`}
                                                    className="flex items-center gap-1.5 text-xs text-cima-text hover:text-cima-gold transition-colors truncate font-medium sm:font-normal"
                                                >
                                                    <Home className="h-3.5 w-3.5 shrink-0 text-cima-gold" />
                                                    <span className="truncate">{linked.title}</span>
                                                </Link>
                                                {linked.neighborhood && (
                                                    <p className="text-[10px] text-cima-text-dim mt-0.5 truncate pl-5">
                                                        {linked.neighborhood}
                                                    </p>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-cima-text-dim italic pl-0 sm:pl-0">Sin vincular</span>
                                        )}
                                    </div>

                                    <div className="hidden sm:block">
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

                                    <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 border-t border-cima-border/50 sm:border-0 pt-4 sm:pt-0">
                                        <Link
                                            href={`/admin/propietarios/${prop.id}`}
                                            className="text-xs font-medium text-cima-text-muted hover:text-cima-gold transition-colors flex items-center gap-1 bg-cima-surface px-3 py-1.5 rounded-lg border border-cima-border sm:bg-transparent sm:px-0 sm:py-0 sm:border-0 sm:font-normal"
                                        >
                                            Ver perfil <span className="hidden sm:inline">→</span>
                                        </Link>
                                        <div className="sm:border-l sm:border-cima-border sm:pl-2">
                                            <DeleteOwnerButton ownerId={prop.id} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </>
    );
}
