"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Save, Send, ArrowRight, ArrowLeft, Camera, Phone, Type, Layout } from "lucide-react";

export default function OnboardingPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        companyName: "",
        companyType: "Propiedades",
        primaryColor: "#C8A96E",
        whatsapp: "",
        headline: "Vendemos tu casa",
        subheadline: "en menos de 30 días.",
        guarantee: "Garantizado.",
        commission: "6%",
        zones: "San Pedro, Monterrey, Cumbres",
    });

    const nextStep = () => setStep(s => Math.min(s + 1, 4));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const generateWhatsAppLink = () => {
        const text = `🎉 *Nuevo Registro de Inmobiliaria* \n\n` +
            `🏢 *Nombre:* ${formData.companyName} ${formData.companyType}\n` +
            `🎨 *Color:* ${formData.primaryColor}\n` +
            `📞 *WhatsApp:* ${formData.whatsapp}\n` +
            `🏠 *Título:* ${formData.headline} ${formData.subheadline}\n` +
            `📍 *Zonas:* ${formData.zones}\n` +
            `💰 *Comisión:* ${formData.commission}`;

        return `https://wa.me/528112345678?text=${encodeURIComponent(text)}`;
    };

    return (
        <div className="min-h-screen bg-cima-bg flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cima-gold/5 via-cima-bg to-cima-bg">
            <div className="max-w-xl w-full">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cima-gold/10 border border-cima-gold/30 mb-4">
                        <Layout className="h-6 w-6 text-cima-gold" />
                    </div>
                    <h1 className="text-3xl font-heading font-bold text-cima-text">Configura tu Plataforma</h1>
                    <p className="text-cima-text-muted mt-2">Danos los detalles para personalizar tu sitio en minutos.</p>
                </div>

                {/* Progress Bar */}
                <div className="flex gap-2 mb-8">
                    {[1, 2, 3, 4].map(s => (
                        <div
                            key={s}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= s ? "bg-cima-gold shadow-[0_0_12px_rgba(200,169,110,0.4)]" : "bg-cima-border/30"}`}
                        />
                    ))}
                </div>

                {/* Content */}
                <div className="bg-cima-card border border-cima-border rounded-3xl p-8 shadow-2xl backdrop-blur-sm">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="h-8 w-8 rounded-lg bg-cima-gold/10 flex items-center justify-center">
                                        <Building2 className="h-4 w-4 text-cima-gold" />
                                    </div>
                                    <h2 className="text-xl font-heading font-semibold text-cima-text">Identidad Visual</h2>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-mono text-cima-text-dim uppercase tracking-widest mb-2">Nombre de la Inmobiliaria</label>
                                        <input
                                            type="text"
                                            placeholder="Ej. Cima, Elite, etc."
                                            className="w-full bg-cima-surface border border-cima-border rounded-xl px-4 py-3 text-cima-text focus:border-cima-gold/50 outline-none transition-all"
                                            value={formData.companyName}
                                            onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-mono text-cima-text-dim uppercase tracking-widest mb-2">Tipo de Negocio</label>
                                        <input
                                            type="text"
                                            placeholder="Ej. Propiedades, Real Estate, Inmobiliaria"
                                            className="w-full bg-cima-surface border border-cima-border rounded-xl px-4 py-3 text-cima-text focus:border-cima-gold/50 outline-none transition-all"
                                            value={formData.companyType}
                                            onChange={e => setFormData({ ...formData, companyType: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="h-8 w-8 rounded-lg bg-cima-gold/10 flex items-center justify-center">
                                        <Phone className="h-4 w-4 text-cima-gold" />
                                    </div>
                                    <h2 className="text-xl font-heading font-semibold text-cima-text">Contacto</h2>
                                </div>

                                <div>
                                    <label className="block text-xs font-mono text-cima-text-dim uppercase tracking-widest mb-2">WhatsApp (10 dígitos)</label>
                                    <input
                                        type="tel"
                                        placeholder="8112345678"
                                        className="w-full bg-cima-surface border border-cima-border rounded-xl px-4 py-3 text-cima-text focus:border-cima-gold/50 outline-none transition-all"
                                        value={formData.whatsapp}
                                        onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                                    />
                                    <p className="text-[10px] text-cima-text-dim mt-2 italic">A este número llegarán los leads y los mensajes de clientes.</p>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="h-8 w-8 rounded-lg bg-cima-gold/10 flex items-center justify-center">
                                        <Type className="h-4 w-4 text-cima-gold" />
                                    </div>
                                    <h2 className="text-xl font-heading font-semibold text-cima-text">Presencia Online</h2>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-mono text-cima-text-dim uppercase tracking-widest mb-2">Título Principal (Hero)</label>
                                        <input
                                            type="text"
                                            className="w-full bg-cima-surface border border-cima-border rounded-xl px-4 py-3 text-cima-text focus:border-cima-gold/50 outline-none transition-all"
                                            value={formData.headline}
                                            onChange={e => setFormData({ ...formData, headline: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-mono text-cima-text-dim uppercase tracking-widest mb-2">Zonas de Cobertura (Separadas por coma)</label>
                                        <textarea
                                            className="w-full bg-cima-surface border border-cima-border rounded-xl px-4 py-3 text-cima-text focus:border-cima-gold/50 outline-none transition-all h-24"
                                            value={formData.zones}
                                            onChange={e => setFormData({ ...formData, zones: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="text-center space-y-6"
                            >
                                <div className="h-16 w-16 rounded-full bg-cima-gold/20 border border-cima-gold/40 flex items-center justify-center mx-auto mb-4">
                                    <Send className="h-8 w-8 text-cima-gold" />
                                </div>
                                <h2 className="text-2xl font-heading font-bold text-cima-text">¡Todo listo!</h2>
                                <p className="text-cima-text-muted">
                                    Haz clic en el botón de abajo para enviarme tu configuración por WhatsApp.
                                    Configuraremos tu sitio basándonos en esta información.
                                </p>
                                <div className="pt-4">
                                    <a
                                        href={generateWhatsAppLink()}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-full flex items-center justify-center gap-3 bg-cima-gold text-cima-bg font-heading font-bold py-4 px-6 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_8px_32px_rgba(200,169,110,0.3)]"
                                    >
                                        Enviar Configuración <ArrowRight className="h-5 w-5" />
                                    </a>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    {step < 4 && (
                        <div className="flex justify-between mt-10 pt-6 border-t border-cima-border/50">
                            <button
                                onClick={prevStep}
                                disabled={step === 1}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${step === 1 ? "opacity-0" : "text-cima-text-muted hover:text-cima-text"}`}
                            >
                                <ArrowLeft className="h-4 w-4" /> Anterior
                            </button>
                            <button
                                onClick={nextStep}
                                className="flex items-center gap-2 bg-cima-gold/10 border border-cima-gold/30 text-cima-gold px-6 py-2 rounded-xl text-sm font-bold hover:bg-cima-gold/20 transition-all"
                            >
                                Siguiente <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Support */}
                <p className="text-center mt-8 text-xs text-cima-text-dim">
                    ¿Necesitas ayuda? <a href={`https://wa.me/528112345678`} className="text-cima-gold hover:underline">Habla con soporte</a>
                </p>
            </div>
        </div>
    );
}
