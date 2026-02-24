"use client";

import React, { useState } from "react";
import {
    FileText, Upload, CheckCircle2, Clock, AlertCircle,
    Download, ExternalLink, ShieldCheck, X, FileUp, Loader2
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Document {
    id: string;
    name: string;
    url: string;
    type: string;
    status: "pending" | "approved" | "rejected";
    category: string;
    created_at: string;
    admin_notes?: string;
}

interface ExpedienteDigitalClientProps {
    ownerId: string;
    initialDocs: Document[];
}

const REQUIRED_DOCS = [
    { key: "identity", label: "Identificación Oficial", description: "INE, Pasaporte o Cédula Profesional (frente y vuelta).", category: "identity" },
    { key: " escritura", label: "Escritura de Propiedad", description: "Primeras páginas y sello del Registro Público.", category: "property" },
    { key: "predial", label: "Pago de Predial", description: "Recibo del año en curso.", category: "tax" },
    { key: "domicilio", label: "Comprobante de Domicilio", description: "Recibo de Agua, Luz o Teléfono (máx. 3 meses).", category: "legal" },
    { key: "fiscal", label: "Situación Fiscal (CSF)", description: "Constancia actualizada para el cálculo de ISR.", category: "legal" },
];

export default function ExpedienteDigitalClient({ ownerId, initialDocs }: ExpedienteDigitalClientProps) {
    const [docs, setDocs] = useState<Document[]>(initialDocs);
    const [uploading, setUploading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, category: string, label: string) {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(category);
        setError(null);

        try {
            const supabase = createClient();

            // 1. Upload to storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${ownerId}/${category}_${Date.now()}.${fileExt}`;

            const { data: uploadData, error: uploadErr } = await supabase.storage
                .from("cima-docs")
                .upload(fileName, file, {
                    cacheControl: "3600",
                    upsert: true
                });

            if (uploadErr) throw uploadErr;

            const { data: { publicUrl } } = supabase.storage.from("cima-docs").getPublicUrl(uploadData.path);

            // 2. Insert record in DB
            const { data: newDoc, error: insertErr } = await supabase
                .from("re_propietario_docs")
                .insert({
                    propietario_id: ownerId,
                    name: label,
                    url: publicUrl,
                    type: "other",
                    category: category,
                    status: "pending"
                })
                .select()
                .single();

            if (insertErr) throw insertErr;

            setDocs(prev => [newDoc, ...prev]);
        } catch (err: any) {
            console.error("Upload error:", err);
            setError(err.message || "Error al subir el archivo");
        } finally {
            setUploading(null);
        }
    }

    const getDocStatus = (category: string) => {
        const doc = docs.find(d => d.category === category);
        if (!doc) return "missing";
        return doc.status;
    };

    return (
        <div className="space-y-8">
            {/* Summary Header */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="rounded-2xl border border-cima-border bg-cima-card p-4 sm:p-5 flex items-center gap-4">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-cima-gold/10 flex items-center justify-center shrink-0">
                        <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6 text-cima-gold" />
                    </div>
                    <div>
                        <p className="text-xl sm:text-2xl font-bold text-cima-text leading-tight">
                            {docs.filter(d => d.status === "approved").length} / {REQUIRED_DOCS.length}
                        </p>
                        <p className="text-[10px] sm:text-xs text-cima-text-muted">Aprobados</p>
                    </div>
                </div>

                <div className="sm:col-span-2 rounded-2xl border border-cima-gold/20 bg-cima-gold/5 p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
                    <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-cima-gold shrink-0" />
                    <p className="text-[11px] sm:text-sm text-cima-text-muted leading-snug sm:leading-relaxed">
                        Para avanzar con el cierre y notaría, necesitamos completar tu expediente digital. Estos documentos están protegidos y solo son visibles para tu asesor legal.
                    </p>
                </div>
            </div>

            {/* Checklist Section */}
            <div className="space-y-4">
                <h2 className="font-heading font-bold text-lg text-cima-text flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-cima-gold" />
                    Checklist Administrativo
                </h2>

                <div className="grid grid-cols-1 gap-3">
                    {REQUIRED_DOCS.map((req) => {
                        const status = getDocStatus(req.category);
                        const existingDoc = docs.find(d => d.category === req.category);

                        return (
                            <div key={req.key} className={`rounded-xl border transition-all duration-300 ${status === "approved" ? "border-emerald-500/30 bg-emerald-500/5" :
                                status === "pending" ? "border-amber-500/30 bg-amber-500/5" :
                                    "border-cima-border bg-cima-card hover:border-cima-gold/20"
                                } p-4`}>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-start gap-2.5 sm:gap-3">
                                        <div className={`mt-0.5 sm:mt-1 h-5 w-5 shrink-0 flex items-center justify-center rounded-full ${status === "approved" ? "bg-emerald-500 text-cima-bg" :
                                            status === "pending" ? "bg-amber-500 text-cima-bg" :
                                                "border-2 border-cima-text-dim/20 text-cima-text-dim"
                                            }`}>
                                            {status === "approved" ? <CheckCircle2 className="h-3.5 w-3.5" /> :
                                                status === "pending" ? <Clock className="h-3.5 w-3.5" /> : null}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[13px] sm:text-sm font-semibold text-cima-text">{req.label}</p>
                                            <p className="text-[10px] sm:text-xs text-cima-text-muted mt-0.5 leading-tight">{req.description}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 self-start sm:self-center ml-7 sm:ml-0">
                                        {existingDoc ? (
                                            <>
                                                <a href={existingDoc.url} target="_blank" rel="noreferrer" className="p-2 rounded-lg border border-cima-border bg-cima-surface text-cima-text-muted hover:text-cima-gold transition-colors">
                                                    <Download className="h-4 w-4" />
                                                </a>
                                                {existingDoc.status === "rejected" && (
                                                    <label className="cursor-pointer p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors">
                                                        <FileUp className="h-4 w-4" />
                                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, req.category, req.label)} accept=".pdf,.jpg,.jpeg,.png" />
                                                    </label>
                                                )}
                                            </>
                                        ) : (
                                            <label className={`cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${uploading === req.category
                                                ? "bg-cima-surface border-cima-border text-cima-text-dim opacity-50"
                                                : "bg-cima-gold text-cima-bg border-cima-gold hover:bg-cima-gold-light"
                                                }`}>
                                                {uploading === req.category ? (
                                                    <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Subiendo...</>
                                                ) : (
                                                    <><Upload className="h-3.5 w-3.5" /> Subir archivo</>
                                                )}
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    onChange={(e) => handleFileUpload(e, req.category, req.label)}
                                                    disabled={uploading !== null}
                                                    accept=".pdf,.jpg,.jpeg,.png"
                                                />
                                            </label>
                                        )}
                                    </div>
                                </div>
                                {existingDoc?.admin_notes && (
                                    <div className="mt-3 p-2.5 rounded-lg bg-cima-surface border border-red-500/20 flex items-start gap-2">
                                        <AlertCircle className="h-3.5 w-3.5 text-red-400 mt-0.5" />
                                        <p className="text-[10px] text-red-400">
                                            <span className="font-bold">Comentario del asesor:</span> {existingDoc.admin_notes}
                                        </p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* General Documents (Contracts, Valuations) */}
            <div className="space-y-4 pt-4 border-t border-cima-border">
                <h2 className="font-heading font-bold text-lg text-cima-text flex items-center gap-2">
                    <FileText className="h-5 w-5 text-cima-gold" />
                    Documentos Generales
                </h2>

                <div className="rounded-2xl border border-cima-border bg-cima-card overflow-hidden">
                    <div className="divide-y divide-cima-border">
                        {docs.filter(d => !REQUIRED_DOCS.find(r => r.category === d.category)).length === 0 ? (
                            <div className="px-5 py-8 text-center">
                                <p className="text-xs text-cima-text-dim">No hay documentos compartidos adicionales.</p>
                            </div>
                        ) : (
                            docs.filter(d => !REQUIRED_DOCS.find(r => r.category === d.category)).map((doc) => (
                                <div key={doc.id} className="px-5 py-3.5 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <FileText className="h-4 w-4 text-cima-gold shrink-0" />
                                        <p className="text-sm text-cima-text truncate">{doc.name}</p>
                                    </div>
                                    <a href={doc.url} target="_blank" rel="noreferrer" className="text-cima-text-muted hover:text-cima-gold">
                                        <Download className="h-4 w-4" />
                                    </a>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {error && (
                <div className="fixed bottom-6 right-6 p-4 rounded-xl bg-red-500 text-white shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-4">
                    <AlertCircle className="h-5 w-5" />
                    <p className="text-sm font-medium">{error}</p>
                    <button onClick={() => setError(null)} className="p-1 hover:bg-white/20 rounded-lg">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
