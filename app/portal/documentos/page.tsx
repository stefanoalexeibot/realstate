import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { FileText, Download, Calendar } from "lucide-react";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-MX", {
    timeZone: "America/Monterrey",
    day: "2-digit", month: "long", year: "numeric",
  });
}

const DOC_TYPE_LABELS: Record<string, string> = {
  contract:  "Contrato de comisión",
  addendum:  "Addendum",
  valuation: "Valuación",
  other:     "Documento",
};

export default async function PortalDocumentos() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

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
        <p className="font-mono text-[10px] tracking-[0.2em] text-cima-gold uppercase mb-1">Portal</p>
        <h1 className="font-heading font-bold text-2xl text-cima-text">Mis documentos</h1>
        <p className="text-sm text-cima-text-muted mt-1">Contratos y documentos compartidos por tu agente de Cima.</p>
      </div>

      {!docs || docs.length === 0 ? (
        <div className="rounded-2xl border border-cima-border bg-cima-card p-16 text-center">
          <FileText className="h-8 w-8 text-cima-text-dim mx-auto mb-3" />
          <p className="font-medium text-cima-text mb-1">Sin documentos aún</p>
          <p className="text-sm text-cima-text-muted">Tu agente compartirá los contratos aquí cuando estén listos.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-cima-border bg-cima-card overflow-hidden">
          <div className="divide-y divide-cima-border">
            {docs.map((doc) => (
              <div key={doc.id} className="px-5 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 shrink-0 rounded-lg bg-cima-gold/10 border border-cima-gold/20 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-cima-gold" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-cima-text truncate">{doc.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-mono text-cima-text-dim">
                        {DOC_TYPE_LABELS[doc.type] ?? doc.type}
                      </span>
                      <span className="text-[10px] text-cima-text-dim">·</span>
                      <span className="flex items-center gap-1 text-[10px] text-cima-text-dim">
                        <Calendar className="h-2.5 w-2.5" />
                        {formatDate(doc.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cima-border bg-cima-surface text-xs text-cima-text-muted hover:text-cima-gold hover:border-cima-gold/40 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  Descargar
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
