"use client";

import { useState } from "react";
import { HelpCircle, X, UserPlus, Link, Calendar, MessageSquare, CheckCircle2 } from "lucide-react";

export default function AgentTutorial() {
    const [open, setOpen] = useState(false);

    const steps = [
        {
            icon: UserPlus,
            title: "1. Registra al Lead",
            desc: "Ve a 'Leads' y agrega los datos del prospecto que te contactó por fuera (teléfono, nombre)."
        },
        {
            icon: Link,
            title: "2. Vincula la Propiedad",
            desc: "En el detalle del lead, asegúrate de anotar qué propiedad le interesó. Esto ayuda a segmentar tu cartera."
        },
        {
            icon: Calendar,
            title: "3. Registra la Visita",
            desc: "¡Súper importante! Ve a 'Visitas' y usa el botón 'Registrar Visita Manual' para agendar la cita."
        },
        {
            icon: MessageSquare,
            title: "4. Reporta Feedback",
            desc: "Después de la visita, entra a la lista de visitas, dale a 'Agregar Nota' y sube fotos del recorrido. Esto enamora al dueño."
        }
    ];

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cima-surface border border-cima-border text-xs text-cima-text-dim hover:text-cima-gold hover:border-cima-gold/30 transition-all"
            >
                <HelpCircle className="h-3.5 w-3.5" />
                Guía de Operación
            </button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="w-full max-w-lg rounded-2xl border border-cima-border bg-cima-card overflow-hidden shadow-2xl">
                        <div className="bg-cima-gold/10 p-6 border-b border-cima-gold/20 flex items-center justify-between">
                            <div>
                                <h3 className="font-heading font-bold text-lg text-cima-gold">Guía para Cerrar Más</h3>
                                <p className="text-xs text-cima-text-muted">Pasos básicos cuando tienes un prospecto "por fuera"</p>
                            </div>
                            <button
                                onClick={() => setOpen(false)}
                                className="p-2 text-cima-gold hover:bg-cima-gold/10 rounded-full transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {steps.map((s, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="shrink-0 h-10 w-10 rounded-xl bg-cima-surface border border-cima-border flex items-center justify-center">
                                        <s.icon className="h-5 w-5 text-cima-gold" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-cima-text mb-1">{s.title}</h4>
                                        <p className="text-xs text-cima-text-muted leading-relaxed">{s.desc}</p>
                                    </div>
                                </div>
                            ))}

                            <div className="pt-4 border-t border-cima-border">
                                <button
                                    onClick={() => setOpen(false)}
                                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-cima-gold py-3 text-sm font-bold text-cima-bg hover:bg-cima-gold-light transition-all"
                                >
                                    <CheckCircle2 className="h-4 w-4" />
                                    Entendido, ¡a vender!
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
