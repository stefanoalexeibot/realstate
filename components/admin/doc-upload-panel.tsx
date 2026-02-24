"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { FileText, Upload, Trash2, Loader2, Download, X, ExternalLink } from "lucide-react";

const DOC_TYPES = [
  { value: "contract",  label: "Contrato de comisión" },
  { value: "addendum",  label: "Addendum" },
  { value: "valuation", label: "Valuación" },
  { value: "other",     label: "Otro" },
];

type Doc = { id: string; name: string; url: string; type: string; created_at: string };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-MX", {
    day: "2-digit", month: "short", year: "numeric", timeZone: "America/Monterrey",
  });
}

export default function DocUploadPanel({ propietarioId }: { propietarioId: string }) {
  const [docs, setDocs]         = useState<Doc[]>([]);
  const [loading, setLoading]   = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError]       = useState<string | null>(null);
  const [docName, setDocName]   = useState("");
  const [docType, setDocType]   = useState("contract");
  const fileRef                 = useRef<HTMLInputElement>(null);
  const supabase                = createClient();

  async function loadDocs() {
    const res = await fetch(`/api/portal/docs?propietario_id=${propietarioId}`);
    const data = await res.json();
    setDocs(data.docs ?? []);
    setLoading(false);
  }

  useEffect(() => { loadDocs(); }, [propietarioId]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!docName.trim()) { setError("Escribe un nombre para el documento."); return; }

    setUploading(true);
    setError(null);
    try {
      // Upload to Supabase storage
      const ext = file.name.split(".").pop() ?? "pdf";
      const path = `documents/${propietarioId}/${Date.now()}.${ext}`;
      const { data: uploaded, error: uploadErr } = await supabase.storage
        .from("cima-photos")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (uploadErr) throw uploadErr;
      const { data: { publicUrl } } = supabase.storage.from("cima-photos").getPublicUrl(uploaded.path);

      // Save record via API
      const res = await fetch("/api/portal/docs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propietario_id: propietarioId, name: docName.trim(), url: publicUrl, type: docType }),
      });
      if (!res.ok) throw new Error("Error al guardar documento");

      setDocName("");
      setDocType("contract");
      if (fileRef.current) fileRef.current.value = "";
      await loadDocs();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir documento");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(doc: Doc) {
    if (!confirm(`¿Eliminar "${doc.name}"?`)) return;
    setDeleting(doc.id);
    try {
      // Remove from storage
      const url = new URL(doc.url);
      const storagePath = url.pathname.split("/object/public/cima-photos/")[1];
      if (storagePath) await supabase.storage.from("cima-photos").remove([storagePath]);
      // Remove from DB via direct supabase client (admin has service-role via anon in admin context)
      const { error: dbErr } = await supabase.from("re_propietario_docs").delete().eq("id", doc.id);
      if (dbErr) throw dbErr;
      setDocs((prev) => prev.filter((d) => d.id !== doc.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="rounded-2xl border border-cima-border bg-cima-card overflow-hidden">
      <div className="px-5 py-4 border-b border-cima-border flex items-center gap-2">
        <FileText className="h-4 w-4 text-cima-gold" />
        <h3 className="font-heading font-semibold text-sm text-cima-text">Documentos del portal</h3>
      </div>

      {/* Upload form */}
      <div className="p-5 border-b border-cima-border bg-cima-surface/40 space-y-3">
        <p className="text-[10px] font-mono text-cima-text-dim uppercase tracking-widest">Subir documento</p>
        <div className="flex gap-2">
          <input
            value={docName}
            onChange={(e) => setDocName(e.target.value)}
            placeholder="Nombre del documento"
            className="flex-1 rounded-lg border border-cima-border bg-cima-surface px-3 py-2 text-sm text-cima-text placeholder:text-cima-text-dim focus:outline-none focus:border-cima-gold/50 transition-colors"
          />
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            className="rounded-lg border border-cima-border bg-cima-surface px-2 py-2 text-xs text-cima-text focus:outline-none focus:border-cima-gold/50 transition-colors"
          >
            {DOC_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors cursor-pointer text-sm ${
            uploading
              ? "border-cima-border bg-cima-surface text-cima-text-dim opacity-50 cursor-not-allowed"
              : "border-cima-gold/30 bg-cima-gold/5 text-cima-gold hover:bg-cima-gold/10"
          }`}>
            {uploading
              ? <><Loader2 className="h-4 w-4 animate-spin" />Subiendo…</>
              : <><Upload className="h-4 w-4" />Seleccionar archivo</>
            }
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.doc,.docx,.png,.jpg,.webp"
              className="hidden"
              disabled={uploading}
              onChange={handleUpload}
            />
          </label>
          <p className="text-xs text-cima-text-dim">PDF, Word, Imagen</p>
        </div>
        {error && (
          <div className="flex items-center justify-between rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2">
            <p className="text-xs text-red-400">{error}</p>
            <button onClick={() => setError(null)}><X className="h-3.5 w-3.5 text-red-400/60 hover:text-red-400" /></button>
          </div>
        )}
      </div>

      {/* Document list */}
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin text-cima-gold" />
        </div>
      ) : docs.length === 0 ? (
        <div className="py-10 text-center">
          <FileText className="h-6 w-6 text-cima-text-dim mx-auto mb-2" />
          <p className="text-sm text-cima-text-muted">Sin documentos aún</p>
        </div>
      ) : (
        <div className="divide-y divide-cima-border">
          {docs.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-cima-surface/30 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-8 w-8 shrink-0 rounded-lg bg-cima-gold/10 border border-cima-gold/20 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-cima-gold" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-cima-text truncate">{doc.name}</p>
                  <p className="text-[10px] text-cima-text-dim font-mono">
                    {DOC_TYPES.find((t) => t.value === doc.type)?.label ?? doc.type} · {formatDate(doc.created_at)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg border border-cima-border text-cima-text-muted hover:text-cima-gold hover:border-cima-gold/40 transition-colors"
                  title="Ver"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <a
                  href={doc.url}
                  download
                  className="p-1.5 rounded-lg border border-cima-border text-cima-text-muted hover:text-cima-gold hover:border-cima-gold/40 transition-colors"
                  title="Descargar"
                >
                  <Download className="h-3.5 w-3.5" />
                </a>
                <button
                  onClick={() => handleDelete(doc)}
                  disabled={deleting === doc.id}
                  className="p-1.5 rounded-lg border border-cima-border text-cima-text-muted hover:text-red-400 hover:border-red-500/30 transition-colors disabled:opacity-50"
                  title="Eliminar"
                >
                  {deleting === doc.id
                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    : <Trash2 className="h-3.5 w-3.5" />
                  }
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
