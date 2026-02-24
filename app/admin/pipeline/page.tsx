"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { KanbanSquare, Phone, Loader2 } from "lucide-react";
import type { SellerLead, PipelineStage } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

const STAGES: { key: PipelineStage; label: string; color: string; dot: string }[] = [
  { key: "prospecto", label: "Prospecto", color: "border-amber-500/30 bg-amber-500/5", dot: "bg-amber-400" },
  { key: "contactado", label: "Contactado", color: "border-blue-500/30 bg-blue-500/5", dot: "bg-blue-400" },
  { key: "valuacion", label: "Valuación", color: "border-purple-500/30 bg-purple-500/5", dot: "bg-purple-400" },
  { key: "publicado", label: "Publicado", color: "border-emerald-500/30 bg-emerald-500/5", dot: "bg-emerald-400" },
  { key: "negociacion", label: "Negociación", color: "border-orange-500/30 bg-orange-500/5", dot: "bg-orange-400" },
  { key: "vendido", label: "Vendido", color: "border-green-500/30 bg-green-500/5", dot: "bg-green-400" },
  { key: "perdido", label: "Perdido", color: "border-red-500/30 bg-red-500/5", dot: "bg-red-400" },
];

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

export default function PipelinePage() {
  const [leads, setLeads] = useState<SellerLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [moving, setMoving] = useState<string | null>(null);

  // Drag & drop state
  const draggingLead = useRef<SellerLead | null>(null);
  const [dragOverStage, setDragOverStage] = useState<PipelineStage | null>(null);

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("re_seller_leads")
      .select("*")
      .order("created_at", { ascending: false });
    setLeads((data ?? []) as SellerLead[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function moveStage(lead: SellerLead, newStage: PipelineStage) {
    setMoving(lead.id);
    try {
      await fetch(`/api/seller-leads/${lead.id}/pipeline`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pipeline_stage: newStage }),
      });
      setLeads((prev) => prev.map((l) => l.id === lead.id ? { ...l, pipeline_stage: newStage } : l));
    } finally {
      setMoving(null);
    }
  }

  function onCardDragStart(lead: SellerLead) {
    draggingLead.current = lead;
  }

  function onColumnDragOver(e: React.DragEvent, stage: PipelineStage) {
    e.preventDefault();
    setDragOverStage(stage);
  }

  function onColumnDrop(stage: PipelineStage) {
    setDragOverStage(null);
    const lead = draggingLead.current;
    draggingLead.current = null;
    if (!lead || lead.pipeline_stage === stage) return;
    moveStage(lead, stage);
  }

  function onDragEnd() {
    draggingLead.current = null;
    setDragOverStage(null);
  }

  const grouped = STAGES.reduce<Record<PipelineStage, SellerLead[]>>((acc, s) => {
    acc[s.key] = leads.filter((l) => l.pipeline_stage === s.key);
    return acc;
  }, {} as Record<PipelineStage, SellerLead[]>);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-cima-gold" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2.5 mb-1">
          <KanbanSquare className="h-5 w-5 text-cima-gold" />
          <h1 className="font-heading font-bold text-xl sm:text-2xl text-cima-text">Pipeline de ventas</h1>
        </div>
        <p className="text-sm text-cima-text-muted">
          {leads.length} propietarios en proceso · Desliza para ver más etapas.
        </p>
      </div>

      {/* Kanban board */}
      <div className="flex gap-4 overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
        {STAGES.map((stage, stageIdx) => {
          const cards = grouped[stage.key];
          const nextStage = stageIdx < STAGES.length - 1 ? STAGES[stageIdx + 1] : null;
          return (
            <div key={stage.key} className="flex-shrink-0 w-64 sm:w-72">
              {/* Column header */}
              <div className={`rounded-t-xl border ${stage.color} px-3 py-2 flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${stage.dot}`} />
                  <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.15em] text-cima-text uppercase">{stage.label}</span>
                </div>
                <span className="font-mono text-[10px] text-cima-text-dim">{cards.length}</span>
              </div>

              {/* Cards — drop zone */}
              <div
                className={`rounded-b-xl border border-t-0 ${stage.color} min-h-[40vh] sm:min-h-32 space-y-2 p-2 transition-all ${dragOverStage === stage.key ? "ring-2 ring-cima-gold/50 bg-cima-gold/5" : ""
                  }`}
                onDragOver={(e) => onColumnDragOver(e, stage.key)}
                onDragLeave={() => setDragOverStage(null)}
                onDrop={() => onColumnDrop(stage.key)}
              >
                {cards.length === 0 ? (
                  <div className="py-6 text-center">
                    <p className="text-[10px] text-cima-text-dim font-mono uppercase tracking-widest">
                      {dragOverStage === stage.key ? "Soltar aquí" : "Vacío"}
                    </p>
                  </div>
                ) : (
                  cards.map((lead) => (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={() => onCardDragStart(lead)}
                      onDragEnd={onDragEnd}
                      className="rounded-lg border border-cima-border bg-cima-card p-3 space-y-2.5 cursor-grab active:cursor-grabbing active:opacity-60 active:scale-[0.98] transition-all"
                    >
                      {/* Name + time */}
                      <div className="flex items-start justify-between gap-1">
                        <div className="min-w-0">
                          <p className="font-medium text-sm text-cima-text leading-none truncate">{lead.name}</p>
                          <p className="text-[10px] text-cima-text-muted mt-0.5">{lead.neighborhood ?? "Sin colonia"}</p>
                        </div>
                        <span className="font-mono text-[9px] text-cima-text-dim shrink-0">{timeAgo(lead.created_at)}</span>
                      </div>

                      {/* Operation + price */}
                      <div className="flex items-center gap-1.5">
                        <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-mono border ${lead.operation_type === "venta"
                            ? "bg-cima-gold/10 text-cima-gold border-cima-gold/20"
                            : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          }`}>
                          {lead.operation_type === "venta" ? "Venta" : "Renta"}
                        </span>
                        {lead.estimated_price && (
                          <span className="text-[10px] text-cima-text-muted font-mono">
                            {formatPrice(lead.estimated_price)}
                          </span>
                        )}
                      </div>

                      {/* Phone + WA */}
                      <a
                        href={`https://wa.me/52${lead.phone.replace(/\D/g, "")}?text=Hola ${encodeURIComponent(lead.name)}, te contactamos de Cima Propiedades`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-[10px] text-cima-text-muted hover:text-[#25D366] transition-colors"
                      >
                        <Phone className="h-2.5 w-2.5" />
                        {lead.phone}
                      </a>

                      {/* Stage selector */}
                      {stage.key !== "vendido" && stage.key !== "perdido" && (
                        <div className="flex gap-1 pt-1 border-t border-cima-border/50">
                          {nextStage && (
                            <button
                              onClick={() => moveStage(lead, nextStage.key)}
                              disabled={moving === lead.id}
                              className="flex-1 py-1 rounded text-[9px] font-mono text-cima-text-muted bg-cima-surface hover:text-cima-gold hover:bg-cima-gold/10 transition-colors disabled:opacity-50"
                            >
                              {moving === lead.id ? "…" : `→ ${nextStage.label}`}
                            </button>
                          )}
                          <button
                            onClick={() => moveStage(lead, "perdido")}
                            disabled={moving === lead.id}
                            className="py-1 px-2 rounded text-[9px] font-mono text-red-400/50 bg-cima-surface hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                          >
                            ✕
                          </button>
                        </div>
                      )}

                      {/* Move back (for vendido/perdido) */}
                      {(stage.key === "vendido" || stage.key === "perdido") && (
                        <button
                          onClick={() => moveStage(lead, "prospecto")}
                          disabled={moving === lead.id}
                          className="w-full py-1 rounded text-[9px] font-mono text-cima-text-dim bg-cima-surface hover:text-cima-text hover:bg-cima-surface/80 transition-colors"
                        >
                          ↺ Reactivar
                        </button>
                      )}

                      {/* Quick stage jump for non-terminal stages */}
                      {stage.key !== "vendido" && stage.key !== "perdido" && (
                        <select
                          value={lead.pipeline_stage}
                          onChange={(e) => moveStage(lead, e.target.value as PipelineStage)}
                          disabled={moving === lead.id}
                          className="w-full text-[9px] font-mono bg-transparent border-0 text-cima-text-dim focus:outline-none cursor-pointer"
                        >
                          {STAGES.map((s) => (
                            <option key={s.key} value={s.key}>{s.label}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
