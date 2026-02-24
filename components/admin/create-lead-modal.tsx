"use client";

import { useState } from "react";
import { X, Loader2, CheckCircle2, UserPlus } from "lucide-react";

interface Props {
    onClose: () => void;
    onCreated: () => void;
}

const ZONES = [
    "San Pedro Garza García",
    "Monterrey",
    "Santa Catarina",
    "San Nicolás de los Garza",
    "Guadalupe",
    "Apodaca",
    "Santiago",
    "Cumbres",
    "Carretera Nacional",
    "Otra",
];

export default function CreateLeadModal({ onClose, onCreated }: Props) {
    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: "",
        neighborhood: "",
        property_type: "casa",
        operation_type: "venta",
        message: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [done, setDone] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const res = await fetch("/api/seller-leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error ?? "Error desconocido");
            setDone(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al crear lead");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-lg rounded-2xl border border-cima-border bg-cima-card p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5 text-cima-gold" />
                        <h2 className="font-heading font-bold text-lg text-cima-text">Registrar Nuevo Lead</h2>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg text-cima-text-muted hover:bg-cima-surface transition-colors">
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {done ? (
                    <div className="py-8 text-center space-y-4">
                        <div className="flex justify-center">
                            <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                            </div>
                        </div>
                        <div>
                            <p className="font-bold text-cima-text text-xl">Lead registrado</p>
                            <p className="text-cima-text-muted mt-1">El lead aparecerá ahora en tu pipeline.</p>
                        </div>
                        <button
                            onClick={() => { onCreated(); onClose(); }}
                            className="mt-4 px-8 py-2.5 rounded-xl bg-cima-gold text-cima-bg font-semibold hover:bg-cima-gold-light transition-colors"
                        >
                            Cerrar
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-[10px] font-mono text-cima-text-muted uppercase tracking-widest mb-1.5">Nombre Completo *</label>
                                <input
                                    required
                                    placeholder="Nombre del cliente"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full rounded-lg border border-cima-border bg-cima-surface px-3 py-2 text-sm text-cima-text focus:outline-none focus:border-cima-gold/50"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-mono text-cima-text-muted uppercase tracking-widest mb-1.5">Teléfono / WhatsApp *</label>
                                <input
                                    required
                                    placeholder="81 0000 0000"
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    className="w-full rounded-lg border border-cima-border bg-cima-surface px-3 py-2 text-sm text-cima-text focus:outline-none focus:border-cima-gold/50"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-mono text-cima-text-muted uppercase tracking-widest mb-1.5">Email (Opcional)</label>
                                <input
                                    type="email"
                                    placeholder="ejemplo@correo.com"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className="w-full rounded-lg border border-cima-border bg-cima-surface px-3 py-2 text-sm text-cima-text focus:outline-none focus:border-cima-gold/50"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-mono text-cima-text-muted uppercase tracking-widest mb-1.5">Zona / Municipio</label>
                                <select
                                    value={form.neighborhood}
                                    onChange={(e) => setForm({ ...form, neighborhood: e.target.value })}
                                    className="w-full rounded-lg border border-cima-border bg-cima-surface px-3 py-2 text-sm text-cima-text focus:outline-none focus:border-cima-gold/50"
                                >
                                    <option value="">— Seleccionar zona —</option>
                                    {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-mono text-cima-text-muted uppercase tracking-widest mb-1.5">Operación</label>
                                <select
                                    value={form.operation_type}
                                    onChange={(e) => setForm({ ...form, operation_type: e.target.value })}
                                    className="w-full rounded-lg border border-cima-border bg-cima-surface px-3 py-2 text-sm text-cima-text focus:outline-none focus:border-cima-gold/50"
                                >
                                    <option value="venta">Venta</option>
                                    <option value="renta">Renta</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-mono text-cima-text-muted uppercase tracking-widest mb-1.5">Notas / Mensaje</label>
                            <textarea
                                rows={3}
                                placeholder="Detalles adicionales sobre el lead..."
                                value={form.message}
                                onChange={(e) => setForm({ ...form, message: e.target.value })}
                                className="w-full rounded-lg border border-cima-border bg-cima-surface px-3 py-2 text-sm text-cima-text focus:outline-none focus:border-cima-gold/50 resize-none"
                            />
                        </div>

                        {error && (
                            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</div>
                        )}

                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-cima-border px-4 py-2.5 text-sm text-cima-text-muted hover:bg-cima-surface transition-colors">
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-cima-gold px-4 py-2.5 text-sm font-semibold text-cima-bg hover:bg-cima-gold-light disabled:opacity-60 transition-colors"
                            >
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Guardar Lead"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
