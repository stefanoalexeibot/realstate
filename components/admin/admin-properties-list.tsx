"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Pencil, User, Building2, Home, Link2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import AdminSearch from "./admin-search";
import DeletePropertyButton from "./delete-property-button";
import type { Property } from "@/lib/types";

// Inline copy button — copies the /lp/[slug] link to clipboard
function CopyLpButton({ slug }: { slug: string }) {
    const [copied, setCopied] = useState(false);
    function copy() {
        const url = `${window.location.origin}/lp/${slug}`;
        navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
    }
    return (
        <button onClick={copy} title="Copiar link de landing page" className="flex items-center gap-1 text-xs text-cima-text-muted hover:text-cima-gold transition-colors">
            {copied ? <span className="text-cima-gold text-[10px] font-mono">✓ LP link</span> : <><Link2 className="h-3.5 w-3.5" /> LP</>}
        </button>
    );
}

type PropertyWithAgent = Property & { re_agentes: { name: string } | null };

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    active: { label: "Activa", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    draft: { label: "Borrador", color: "bg-cima-gold/10 text-cima-gold border-cima-gold/20" },
    sold: { label: "Vendida", color: "bg-red-500/10 text-red-400 border-red-500/20" },
    rented: { label: "Rentada", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
    inactive: { label: "Inactiva", color: "bg-cima-surface text-cima-text-dim border-cima-border" },
};

const STATUS_OPTIONS = [
    { value: "all", label: "Todas" },
    { value: "active", label: "Activas" },
    { value: "draft", label: "Borradores" },
    { value: "sold", label: "Vendidas" },
    { value: "inactive", label: "Inactivas" },
];

function formatDate(iso: string) {
    return new Date(iso).toLocaleString("es-MX", {
        timeZone: "America/Monterrey",
        day: "2-digit", month: "short", year: "numeric",
    });
}

export default function AdminPropertiesList({ initialProperties }: { initialProperties: PropertyWithAgent[] }) {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");

    const filtered = initialProperties.filter((p) => {
        const matchesSearch =
            p.title.toLowerCase().includes(search.toLowerCase()) ||
            (p.neighborhood || "").toLowerCase().includes(search.toLowerCase());

        const matchesStatus = status === "all" || p.status === status;

        return matchesSearch && matchesStatus;
    });

    return (
        <>
            <AdminSearch
                placeholder="Buscar por nombre o colonia..."
                value={search}
                onChange={setSearch}
                status={status}
                onStatusChange={setStatus}
                statusOptions={STATUS_OPTIONS}
            />

            {filtered.length === 0 ? (
                <div className="rounded-xl border border-cima-border bg-cima-card p-12 sm:p-16 text-center">
                    <Building2 className="h-8 w-8 text-cima-text-dim mx-auto mb-3" />
                    <p className="text-sm text-cima-text-muted">No se encontraron propiedades con esos filtros.</p>
                    {(search || status !== "all") && (
                        <button
                            onClick={() => { setSearch(""); setStatus("all"); }}
                            className="text-cima-gold text-xs mt-2 hover:underline"
                        >
                            Limpiar búsqueda
                        </button>
                    )}
                </div>
            ) : (
                <div className="rounded-xl border border-cima-border bg-cima-card overflow-hidden">
                    {/* Contenedor de tabla con scroll solo en desktop si es necesario */}
                    <div className="overflow-x-auto sm:overflow-x-auto">
                        <div className="min-w-full sm:min-w-[1000px]">
                            {/* Header (Desktop Only) */}
                            <div className="hidden sm:grid grid-cols-[1fr_110px_70px_80px_110px_90px_160px] gap-4 px-5 py-3 border-b border-cima-border bg-cima-bg">
                                {["Propiedad", "Precio", "Vistas", "Tipo", "Asesor", "Estado", ""].map((h) => (
                                    <p key={h} className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">{h}</p>
                                ))}
                            </div>

                            <div className="divide-y divide-cima-border">
                                {filtered.map((p) => {
                                    const st = STATUS_LABELS[p.status] ?? STATUS_LABELS.inactive;
                                    const agentName = p.re_agentes?.name;
                                    return (
                                        <div key={p.id} className="flex flex-col sm:grid sm:grid-cols-[1fr_110px_70px_80px_110px_90px_160px] gap-4 px-4 sm:px-5 py-5 sm:py-4 items-start sm:items-center hover:bg-cima-surface/30 transition-colors">
                                            <div className="w-full sm:min-w-0 flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="font-semibold sm:font-medium text-sm text-cima-text truncate">{p.title}</p>
                                                    <p className="text-xs text-cima-text-muted mt-0.5 sm:mt-0">{p.neighborhood ?? "—"} · {formatDate(p.created_at)}</p>
                                                </div>
                                                <span className={`sm:hidden inline-flex px-2 py-0.5 rounded text-[10px] font-mono border shrink-0 ${st.color}`}>
                                                    {st.label}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 w-full sm:hidden border-t border-cima-border/50 pt-3">
                                                <div>
                                                    <p className="text-[9px] text-cima-text-dim font-mono uppercase mb-0.5">Precio</p>
                                                    <p className="text-sm text-cima-gold font-mono">
                                                        {formatPrice(p.price)}{p.operation_type === "renta" ? "/mes" : ""}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] text-cima-text-dim font-mono uppercase mb-0.5">Tipo / Vistas</p>
                                                    <p className="text-xs text-cima-text">
                                                        <span className="capitalize">{p.property_type}</span> · {p.views ?? 0}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="hidden sm:block">
                                                <p className="text-sm text-cima-gold font-mono whitespace-nowrap">
                                                    {formatPrice(p.price)}{p.operation_type === "renta" ? "/mes" : ""}
                                                </p>
                                            </div>

                                            <div className="hidden sm:block">
                                                <p className="text-xs text-cima-text-muted font-mono">{p.views ?? 0} vistas</p>
                                            </div>

                                            <div className="hidden sm:block">
                                                <p className="text-xs text-cima-text-muted capitalize">{p.property_type}</p>
                                            </div>

                                            <div className="w-full sm:min-w-0 flex items-center justify-between sm:block border-t border-cima-border/50 sm:border-0 pt-3 sm:pt-0">
                                                <p className="sm:hidden text-[9px] text-cima-text-dim font-mono uppercase">Asesor</p>
                                                {agentName ? (
                                                    <span className="flex items-center gap-1.5 text-xs text-cima-text-muted truncate">
                                                        <User className="h-3.5 w-3.5 shrink-0 text-cima-gold" />
                                                        {agentName}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-cima-text-dim italic">Sin asignar</span>
                                                )}
                                            </div>

                                            <div className="hidden sm:block">
                                                <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-mono border w-fit ${st.color}`}>
                                                    {st.label}
                                                </span>
                                            </div>

                                            {/* ── Acciones ── */}
                                            <div className="flex items-center gap-1.5 w-full sm:w-auto border-t border-cima-border/50 sm:border-0 pt-4 sm:pt-0 flex-wrap sm:flex-nowrap">
                                                <Link
                                                    href={`/admin/propiedades/${p.id}/editar`}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-cima-text-muted hover:text-cima-gold hover:bg-cima-gold/10 border border-cima-border hover:border-cima-gold/30 transition-colors"
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                    Editar
                                                </Link>
                                                <Link
                                                    href={`/propiedades/${p.slug}`}
                                                    target="_blank"
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-cima-text-muted hover:text-cima-text hover:bg-cima-surface border border-cima-border transition-colors"
                                                >
                                                    <Eye className="h-3.5 w-3.5" />
                                                    Ver
                                                </Link>
                                                <CopyLpButton slug={p.slug} />
                                                <DeletePropertyButton propertyId={p.id} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
