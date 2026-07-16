"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Building2, Check, ArrowRight, DollarSign, Users,
    Copy, CheckCircle2, ChevronDown, Zap, Gift,
    TrendingUp, Share2, MessageSquare, ShieldCheck, Clock, MapPin, Link as LinkIcon, Sparkles
} from "lucide-react";
import Link from "next/link";

const AVERAGE_COMMISSION = 3750; // Midpoint for $2.5k - $5k commission range

const ADVISORS = [
    { id: "alejandro", name: "Alejandro L.", phone: "528121980008" },
    { id: "darien", name: "Darien G.", phone: "528140053979" },
    { id: "jair", name: "Jair P.", phone: "528115030492" }
];

// Slug helper for referral links
function toSlug(name: string) {
    return name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s]/g, "")
        .trim()
        .replace(/\s+/g, "-");
}

// Phone validation helper
function validatePhone(phone: string) {
    const clean = phone.replace(/\D/g, "");
    return clean.length === 10;
}

// ─── Earnings Calculator ───────────────────────────────────────────────────
function EarningsCalculator() {
    const [count, setCount] = useState(3);
    const earnings = count * AVERAGE_COMMISSION;

    return (
        <div className="bg-cima-card border border-cima-border rounded-[32px] p-6 md:p-10 relative overflow-hidden shadow-2xl gold-glow">
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-cima-gold/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-cima-gold/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10">
                <p className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-[0.3em] mb-4">
                    Simulador de ganancias
                </p>
                <h3 className="text-2xl md:text-3xl font-heading font-black mb-8 text-cima-text">
                    ¿Cuánto puedes ganar al año?
                </h3>

                <div className="mb-10">
                    <div className="flex justify-between items-center mb-4">
                        <label className="text-[10px] uppercase font-bold text-cima-text-muted tracking-widest">
                            Referidos concretados al año
                        </label>
                        <span className="text-lg font-mono font-bold text-cima-gold">{count} {count === 10 ? "o más" : ""}</span>
                    </div>
                    
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={count}
                        onChange={(e) => setCount(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-cima-border rounded-lg appearance-none cursor-pointer np-slider"
                    />
                    
                    <div className="flex justify-between text-[9px] font-mono text-cima-text-dim mt-2 px-1">
                        <span>1 Propiedad</span>
                        <span>5 Propiedades</span>
                        <span>10 Propiedades</span>
                    </div>
                </div>

                <div className="bg-cima-gold/5 border border-cima-gold/20 rounded-[20px] p-8 text-center relative overflow-hidden">
                    <p className="text-[10px] uppercase font-bold text-cima-gold/80 tracking-[0.25em] mb-3">
                        Comisión Total Estimada
                    </p>
                    <motion.p
                        key={earnings}
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-4xl md:text-6xl font-heading font-black text-cima-text relative z-10"
                    >
                        ${new Intl.NumberFormat("es-MX").format(earnings)}
                        <span className="text-cima-gold text-2xl md:text-3xl"> MXN</span>
                    </motion.p>
                    <p className="text-[10px] text-cima-text-muted font-mono mt-3">
                        Simulación basada en una comisión promedio de ${new Intl.NumberFormat("es-MX").format(AVERAGE_COMMISSION)} MXN (Comisiones reales de $2,500 a $5,000 MXN por propiedad vendida)
                    </p>
                </div>
            </div>
        </div>
    );
}

// ─── FAQ ───────────────────────────────────────────────────────────────────
function Faq() {
    const faqs = [
        {
            q: "¿Quién puede participar en el programa?",
            a: "Cualquier persona. No necesitas ser cliente de CIMA ni tener experiencia inmobiliaria. Si conoces a alguien que quiere vender su propiedad en Monterrey, puedes pasarnos su contacto o compartirle tu link y ganar."
        },
        {
            q: "¿De cuánto es la comisión por referir?",
            a: "La comisión es de $2,500 a $5,000 MXN por propiedad referida y cerrada. El monto final depende del valor comercial de la propiedad recomendada."
        },
        {
            q: "¿Cuándo y cómo recibo mi comisión?",
            a: "La comisión se transfiere directamente a tu cuenta bancaria en el momento en que se escritura la venta de la propiedad y nosotros cobramos nuestra respectiva comisión."
        },
        {
            q: "¿Cómo aseguran que la casa se venderá?",
            a: "CIMA Propiedades ofrece una garantía de venta en menos de 30 días. Esto hace que sea sumamente atractivo para tus conocidos darnos su exclusiva."
        },
        {
            q: "¿Qué pasa si otra persona refiere al mismo propietario?",
            a: "La atribución se otorga al primer referente que registre el contacto de forma completa en el sistema o a quien esté asociado el enlace único de referido visitado por el propietario."
        }
    ];
    const [open, setOpen] = useState<number | null>(null);

    return (
        <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((f, i) => (
                <div key={i} className="rounded-2xl border border-cima-border bg-cima-card/50 overflow-hidden hover:border-cima-gold/30 transition-all">
                    <button
                        onClick={() => setOpen(open === i ? null : i)}
                        className="w-full p-5 text-left flex items-center justify-between gap-4"
                    >
                        <span className="text-sm font-bold text-cima-text/90">{f.q}</span>
                        <div className={`h-6 w-6 rounded-full border border-cima-border flex items-center justify-center shrink-0 transition-transform duration-300 ${open === i ? "rotate-180 bg-cima-gold border-cima-gold" : ""}`}>
                            <ChevronDown className={`h-3 w-3 ${open === i ? "text-cima-bg" : "text-cima-gold"}`} />
                        </div>
                    </button>
                    <AnimatePresence>
                        {open === i && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="px-5 pb-5 text-sm text-cima-text-muted leading-relaxed border-t border-cima-border pt-4">
                                    {f.a}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    );
}

// ─── Referral Form ─────────────────────────────────────────────────────────
interface ReferralFormProps {
    defaultAdvisorId: string;
}

function ReferralForm({ defaultAdvisorId }: ReferralFormProps) {
    const [step, setStep] = useState(1);
    const [selectedAdvisor, setSelectedAdvisor] = useState(ADVISORS[0]);
    const [form, setForm] = useState({
        referenteNombre: "",
        referenteWhatsapp: "",
        propietarioNombre: "",
        propietarioWhatsapp: "",
        propiedadColonia: "",
        comentarios: ""
    });
    const [loading, setLoading] = useState(false);
    const [submittedLead, setSubmittedLead] = useState(false);
    const [copied, setCopied] = useState(false);
    const [origin, setOrigin] = useState("https://cima.mx");
    const [error, setError] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            setOrigin(window.location.origin);
        }
    }, []);

    // Load default advisor if passed via URL
    useEffect(() => {
        if (defaultAdvisorId) {
            const adv = ADVISORS.find(a => a.id === defaultAdvisorId.toLowerCase());
            if (adv) {
                setSelectedAdvisor(adv);
            }
        }
    }, [defaultAdvisorId]);

    const slug = toSlug(form.referenteNombre);
    const personalReferralLink = `${origin}/vende?ref=${slug}&asesor=${selectedAdvisor.id}`;

    const handleNextStep1 = () => {
        if (!form.referenteNombre || !form.referenteWhatsapp) {
            setError("Por favor completa tus datos.");
            return;
        }
        if (!validatePhone(form.referenteWhatsapp)) {
            setError("Tu WhatsApp debe tener 10 dígitos numéricos.");
            return;
        }
        setError("");
        setStep(2);
    };

    const handleDirectSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.propietarioNombre || !form.propietarioWhatsapp) {
            setError("Por favor ingresa los datos de tu conocido.");
            return;
        }
        if (!validatePhone(form.propietarioWhatsapp)) {
            setError("El WhatsApp del propietario debe tener 10 dígitos.");
            return;
        }
        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/seller-leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.propietarioNombre,
                    phone: form.propietarioWhatsapp,
                    neighborhood: form.propiedadColonia || null,
                    message: `Asesor asignado: ${selectedAdvisor.name}. ` + (form.comentarios ? `Nota: ${form.comentarios}` : ""),
                    referrer: `${form.referenteNombre} (WhatsApp: ${form.referenteWhatsapp})`
                })
            });

            if (!response.ok) throw new Error("Server error");
            setSubmittedLead(true);
        } catch (err) {
            setError("Hubo un error al registrar el referido. Por favor intenta de nuevo.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const copyLink = async () => {
        await navigator.clipboard.writeText(personalReferralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareLinkWhatsApp = () => {
        const text = `Hola, te recomiendo CIMA Propiedades para vender tu casa. Son súper profesionales, garantizan vender en menos de 30 días y me asignaron a mi asesor de confianza ${selectedAdvisor.name}. Puedes agendar una asesoría gratuita desde este link:\n\n${personalReferralLink}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    };

    const openWhatsAppDirectLead = () => {
        const msg = `Hola ${selectedAdvisor.name}, acabo de registrar un referido de venta en la web 🏆\n\n*Mis Datos (Referente):*\n- Nombre: ${form.referenteNombre}\n- WhatsApp: ${form.referenteWhatsapp}\n\n*Datos de mi conocido (Propietario):*\n- Nombre: ${form.propietarioNombre}\n- WhatsApp: ${form.propietarioWhatsapp}\n- Ubicación: ${form.propiedadColonia || "No especificada"}\n- Nota: ${form.comentarios || "Ninguna"}`;
        window.open(`https://wa.me/${selectedAdvisor.phone}?text=${encodeURIComponent(msg)}`, "_blank");
    };

    if (submittedLead) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 md:p-10 text-center"
            >
                <div className="h-16 w-16 rounded-full bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-8 w-8 text-cima-gold" />
                </div>
                <h3 className="text-2xl font-heading font-black text-cima-text mb-3">
                    ¡Referido Guardado!
                </h3>
                <p className="text-cima-text-muted text-sm mb-8 max-w-sm mx-auto leading-relaxed">
                    Hemos guardado los datos de tu recomendado. Para asegurar su seguimiento de inmediato con <strong>{selectedAdvisor.name}</strong>, por favor haz clic abajo para enviarle la confirmación directamente a su WhatsApp personal.
                </p>

                <div className="space-y-3">
                    <button
                        onClick={openWhatsAppDirectLead}
                        className="w-full py-4 bg-cima-gold text-cima-bg rounded-2xl font-heading font-black text-xs uppercase tracking-widest hover:scale-[1.02] hover:bg-cima-gold-light transition-all flex items-center justify-center gap-3 shadow-[0_20px_40px_-15px_rgba(200,169,110,0.4)]"
                    >
                        Contactar a {selectedAdvisor.name}
                        <MessageSquare className="h-4 w-4" />
                    </button>
                    
                    <button
                        onClick={() => {
                            setSubmittedLead(false);
                            setStep(2);
                            setForm(prev => ({ ...prev, propietarioNombre: "", propietarioWhatsapp: "", propiedadColonia: "", comentarios: "" }));
                        }}
                        className="w-full py-3.5 bg-cima-surface border border-cima-border text-cima-text-muted hover:text-cima-text rounded-2xl font-heading font-black text-xs uppercase tracking-widest transition-all"
                    >
                        Referir a alguien más
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="p-6 md:p-10">
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-xl text-xs font-mono text-center mb-6">
                    {error}
                </div>
            )}

            {/* STEP 1: REFERRER & ADVISOR SELECTION */}
            {step === 1 && (
                <div className="space-y-5">
                    <div className="text-center mb-6">
                        <h3 className="text-2xl md:text-3xl font-heading font-black text-cima-text mb-2">
                            Regístrate Gratis
                        </h3>
                        <p className="text-cima-text-muted text-sm">
                            Asocia tus comisiones y selecciona a tu asesor.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {/* Advisor selector */}
                        <div>
                            <label className="block text-[9px] font-bold uppercase tracking-widest text-cima-text-muted mb-2">
                                ¿Qué asesor te invitó / te atenderá?
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {ADVISORS.map(adv => (
                                    <button
                                        key={adv.id}
                                        type="button"
                                        onClick={() => setSelectedAdvisor(adv)}
                                        className={`py-3 rounded-xl border text-xs font-bold transition-all ${selectedAdvisor.id === adv.id
                                            ? "bg-cima-gold text-cima-bg border-cima-gold shadow-md"
                                            : "bg-cima-surface border-cima-border text-cima-text-muted hover:border-cima-gold/25"
                                            }`}
                                    >
                                        {adv.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-[9px] font-bold uppercase tracking-widest text-cima-text-muted mb-2">Tu Nombre Completo</label>
                            <input
                                type="text"
                                placeholder="Ej. Juan Pérez"
                                required
                                value={form.referenteNombre}
                                onChange={e => setForm(prev => ({ ...prev, referenteNombre: e.target.value }))}
                                className="w-full bg-cima-surface border border-cima-border rounded-xl px-4 py-3 text-sm text-cima-text placeholder-cima-text-dim focus:border-cima-gold/40 focus:bg-cima-surface/80 transition-all outline-none"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-[9px] font-bold uppercase tracking-widest text-cima-text-muted mb-2">Tu WhatsApp (10 dígitos)</label>
                            <input
                                type="tel"
                                placeholder="8112345678"
                                required
                                value={form.referenteWhatsapp}
                                onChange={e => setForm(prev => ({ ...prev, referenteWhatsapp: e.target.value.replace(/\D/g, "") }))}
                                className="w-full bg-cima-surface border border-cima-border rounded-xl px-4 py-3 text-sm text-cima-text placeholder-cima-text-dim focus:border-cima-gold/40 focus:bg-cima-surface/80 transition-all outline-none"
                            />
                        </div>
                        
                        {form.referenteNombre.length > 2 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-cima-gold/5 border border-cima-gold/20 rounded-xl p-3 text-center animate-fade-in"
                            >
                                <p className="text-[8px] font-bold text-cima-gold uppercase tracking-widest mb-1">Tu enlace personalizado enlazado a {selectedAdvisor.name}:</p>
                                <p className="text-[10px] text-cima-text-muted font-mono break-all">{personalReferralLink}</p>
                            </motion.div>
                        )}

                        <button
                            type="button"
                            onClick={handleNextStep1}
                            className="w-full py-4 bg-cima-gold text-cima-bg rounded-2xl font-heading font-black text-xs uppercase tracking-widest hover:scale-[1.02] hover:bg-cima-gold-light transition-all flex items-center justify-center gap-3 shadow-[0_20px_40px_-15px_rgba(200,169,110,0.4)] group/btn"
                        >
                            Siguiente paso
                            <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 2: CHOOSE REFERRAL METHOD */}
            {step === 2 && (
                <div className="space-y-6">
                    <div className="text-center">
                        <h3 className="text-xl md:text-2xl font-heading font-black text-cima-text mb-2">
                            ¡Listo, {form.referenteNombre.split(" ")[0]}!
                        </h3>
                        <p className="text-cima-text-muted text-xs">
                            Tu asesor asignado es: <strong>{selectedAdvisor.name}</strong>
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {/* Option A: Share Link */}
                        <div className="bg-cima-surface/50 border border-cima-border rounded-2xl p-5 hover:border-cima-gold/30 transition-all">
                            <h4 className="text-sm font-bold text-cima-text flex items-center gap-2 mb-2">
                                <Share2 className="h-4 w-4 text-cima-gold" />
                                Compartir mi enlace único
                            </h4>
                            <p className="text-[11px] text-cima-text-muted mb-4 leading-relaxed">
                                Envía este link a tus conocidos. Si agendan su asesoría desde aquí, la venta se te atribuirá a ti y le llegará a <strong>{selectedAdvisor.name}</strong>.
                            </p>

                            <div className="bg-cima-bg border border-cima-border rounded-xl p-3 mb-3 flex items-center justify-between">
                                <span className="text-[10px] font-mono text-cima-text-muted truncate mr-2">{personalReferralLink}</span>
                                <button
                                    onClick={copyLink}
                                    className={`p-1.5 rounded-lg border transition-all shrink-0 ${copied
                                        ? "bg-green-500/10 border-green-500/30 text-green-400"
                                        : "bg-cima-surface border-cima-border text-cima-text-muted hover:text-cima-text"
                                        }`}
                                >
                                    {copied ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                                </button>
                            </div>

                            <button
                                onClick={shareLinkWhatsApp}
                                className="w-full py-2.5 bg-[#25D366]/10 border border-[#25D366]/35 text-[#25D366] font-bold text-xs uppercase tracking-widest hover:bg-[#25D366]/20 transition-all rounded-xl flex items-center justify-center gap-2"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                                Enviar a un Amigo
                            </button>
                        </div>

                        {/* Option B: Enter Details Direct */}
                        <div className="bg-cima-surface/50 border border-cima-border rounded-2xl p-5 hover:border-cima-gold/30 transition-all">
                            <h4 className="text-sm font-bold text-cima-text flex items-center gap-2 mb-2">
                                <LinkIcon className="h-4 w-4 text-cima-gold" />
                                Registrar datos directamente
                            </h4>
                            <p className="text-[11px] text-cima-text-muted mb-4 leading-relaxed">
                                Si ya tienes los datos de tu conocido, captúralos directamente para asignárselos a <strong>{selectedAdvisor.name}</strong> de inmediato.
                            </p>

                            <button
                                onClick={() => setStep(3)}
                                className="w-full py-2.5 bg-cima-gold text-cima-bg font-bold text-xs uppercase tracking-widest hover:bg-cima-gold-light transition-all rounded-xl flex items-center justify-center gap-2"
                            >
                                Registrar Datos Ahora
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={() => setStep(1)}
                        className="w-full py-3 text-cima-text-dim hover:text-cima-text-muted text-[10px] font-mono uppercase tracking-widest text-center"
                    >
                        ← Volver y cambiar de asesor o editar datos
                    </button>
                </div>
            )}

            {/* STEP 3: DIRECT REFERRAL DATA FORM */}
            {step === 3 && (
                <form onSubmit={handleDirectSubmit} className="space-y-4">
                    <div className="text-center mb-6">
                        <h3 className="text-xl md:text-2xl font-heading font-black text-cima-text mb-2">
                            Datos del Propietario
                        </h3>
                        <p className="text-cima-text-muted text-xs">
                            Se registrará bajo el seguimiento de <strong>{selectedAdvisor.name}</strong>.
                        </p>
                    </div>

                    <div>
                        <label className="block text-[9px] font-bold uppercase tracking-widest text-cima-text-muted mb-2">Nombre de tu Conocido</label>
                        <input
                            type="text"
                            placeholder="Ej. Pedro Rodríguez"
                            required
                            value={form.propietarioNombre}
                            onChange={e => setForm(prev => ({ ...prev, propietarioNombre: e.target.value }))}
                            className="w-full bg-cima-surface border border-cima-border rounded-xl px-4 py-3 text-sm text-cima-text placeholder-cima-text-dim focus:border-cima-gold/40 focus:bg-cima-surface/80 transition-all outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-[9px] font-bold uppercase tracking-widest text-cima-text-muted mb-2">WhatsApp del Propietario (10 dígitos)</label>
                        <input
                            type="tel"
                            placeholder="8187654321"
                            required
                            value={form.propietarioWhatsapp}
                            onChange={e => setForm(prev => ({ ...prev, propietarioWhatsapp: e.target.value.replace(/\D/g, "") }))}
                            className="w-full bg-cima-surface border border-cima-border rounded-xl px-4 py-3 text-sm text-cima-text placeholder-cima-text-dim focus:border-cima-gold/40 focus:bg-cima-surface/80 transition-all outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-[9px] font-bold uppercase tracking-widest text-cima-text-muted mb-2">Ubicación / Colonia de la Propiedad</label>
                        <input
                            type="text"
                            placeholder="Ej. San Pedro, San Jerónimo, Cumbres"
                            value={form.propiedadColonia}
                            onChange={e => setForm(prev => ({ ...prev, propiedadColonia: e.target.value }))}
                            className="w-full bg-cima-surface border border-cima-border rounded-xl px-4 py-3 text-sm text-cima-text placeholder-cima-text-dim focus:border-cima-gold/40 focus:bg-cima-surface/80 transition-all outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-[9px] font-bold uppercase tracking-widest text-cima-text-muted mb-2">Nota adicional (opcional)</label>
                        <textarea
                            placeholder="Ej. Desea vender rápido. CIMA ofrece garantía de venta de menos de 30 días."
                            rows={2}
                            value={form.comentarios}
                            onChange={e => setForm(prev => ({ ...prev, comentarios: e.target.value }))}
                            className="w-full bg-cima-surface border border-cima-border rounded-xl px-4 py-3 text-sm text-cima-text placeholder-cima-text-dim focus:border-cima-gold/40 focus:bg-cima-surface/80 transition-all outline-none resize-none"
                        />
                    </div>

                    <div className="flex gap-2.5 pt-2">
                        <button
                            type="button"
                            onClick={() => setStep(2)}
                            className="w-1/3 py-4 bg-cima-surface border border-cima-border text-cima-text-muted rounded-2xl font-heading font-black text-xs uppercase tracking-widest hover:text-cima-text transition-all"
                        >
                            Volver
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-2/3 py-4 bg-cima-gold text-cima-bg rounded-2xl font-heading font-black text-xs uppercase tracking-widest hover:scale-[1.02] hover:bg-cima-gold-light transition-all flex items-center justify-center gap-3 shadow-[0_20px_40px_-15px_rgba(200,169,110,0.4)] disabled:opacity-50"
                        >
                            {loading ? "Enviando..." : "Enviar Referido"}
                            <Check className="h-4 w-4" />
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

// ─── MAIN CONTENT COMPONENT WITH SUSPENSE ──────────────────────────────────
function GanaPageContent() {
    const searchParams = useSearchParams();
    const defaultAdvisorId = searchParams.get("asesor") || "";

    const scrollToForm = () => {
        document.getElementById("form-referidos")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="min-h-screen bg-cima-bg text-cima-text selection:bg-cima-gold/30 overflow-x-hidden relative">
            {/* ── Global dot-grid overlay ── */}
            <div className="fixed inset-0 dot-grid pointer-events-none z-0 opacity-60" />

            {/* ── Floating ambient orbs (fixed) ── */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[8%] left-[5%] w-[500px] h-[500px] bg-cima-gold/8 blur-[140px] rounded-full orb-float" />
                <div className="absolute top-[40%] right-[3%] w-[400px] h-[400px] bg-cima-gold/6 blur-[120px] rounded-full orb-float-rev" />
                <div className="absolute bottom-[15%] left-[15%] w-[350px] h-[350px] bg-cima-gold/5 blur-[100px] rounded-full orb-float-slow" />
                <div className="absolute top-[60%] right-[20%] w-[250px] h-[250px] bg-cima-gold/7 blur-[80px] rounded-full orb-float" style={{ animationDelay: '4s' }} />
            </div>

            {/* ── All page content above the backgrounds ── */}
            <div className="relative z-10">

            {/* NAV */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-cima-border/50 backdrop-blur-xl bg-cima-bg/85">
                <div className="mx-auto max-w-6xl h-16 px-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center">
                            <Building2 className="text-cima-gold h-4 w-4" />
                        </div>
                        <div className="flex flex-col leading-none text-left">
                            <span className="font-heading font-bold text-sm text-cima-text">Cima</span>
                            <span className="font-mono text-[9px] tracking-[0.2em] text-cima-text-muted uppercase">Propiedades</span>
                        </div>
                    </Link>
                    <button
                        onClick={scrollToForm}
                        className="bg-cima-gold text-cima-bg px-5 py-2 rounded-full text-xs font-black uppercase tracking-tight hover:bg-cima-gold-light transition-all shadow-lg shadow-cima-gold/10"
                    >
                        Referir Ahora →
                    </button>
                </div>
            </nav>

            {/* HERO */}
            <section className="relative pt-36 md:pt-44 pb-16 md:pb-24 px-6 overflow-hidden hero-mesh">
                {/* Architectural SVG city-skyline silhouette */}
                <div className="absolute bottom-0 left-0 right-0 h-40 md:h-64 pointer-events-none opacity-[0.04]">
                    <svg viewBox="0 0 1440 220" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax slice" className="w-full h-full fill-cima-gold">
                        <path d="M0,220 L0,160 L40,160 L40,100 L60,100 L60,80 L80,80 L80,100 L100,100 L100,60 L120,60 L120,40 L140,40 L140,60 L160,60 L160,100 L180,100 L180,140 L200,140 L200,90 L220,90 L220,70 L240,70 L240,50 L260,50 L260,70 L280,70 L280,90 L300,90 L300,120 L320,120 L320,80 L360,80 L360,50 L380,50 L380,30 L400,30 L400,50 L420,50 L420,80 L440,80 L440,110 L480,110 L480,70 L510,70 L510,40 L530,40 L530,20 L550,20 L550,40 L570,40 L570,70 L600,70 L600,100 L630,100 L630,60 L660,60 L660,40 L680,40 L680,20 L700,20 L700,40 L720,40 L720,60 L750,60 L750,90 L780,90 L780,50 L810,50 L810,30 L830,30 L830,10 L850,10 L850,30 L870,30 L870,50 L900,50 L900,80 L930,80 L930,110 L960,110 L960,70 L990,70 L990,50 L1010,50 L1010,30 L1030,30 L1030,50 L1050,50 L1050,70 L1080,70 L1080,100 L1110,100 L1110,60 L1140,60 L1140,40 L1160,40 L1160,60 L1200,60 L1200,90 L1240,90 L1240,120 L1280,120 L1280,80 L1320,80 L1320,100 L1360,100 L1360,140 L1400,140 L1400,160 L1440,160 L1440,220 Z" />
                    </svg>
                </div>

                {/* Radial hero glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full md:w-[1000px] h-[600px] bg-cima-gold/8 blur-[140px] rounded-full pointer-events-none" />

                <div className="relative mx-auto max-w-4xl text-center">
                    <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-cima-gold/10 border border-cima-gold/20 mb-8">
                        <Sparkles className="h-4 w-4 text-cima-gold animate-pulse" />
                        <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-widest">
                            Programa de Embajadores CIMA
                        </span>
                    </div>

                    <div className="mb-6">
                        <p className="text-[11px] md:text-xs font-mono text-cima-text-muted uppercase tracking-[0.3em] mb-4">Gana de</p>
                        <h1 className="text-5xl md:text-8xl lg:text-9xl font-heading font-black text-cima-gold leading-none tracking-tight">
                            $2,500 a $5,000
                        </h1>
                        <p className="text-xl md:text-3xl font-heading text-cima-text/90 mt-4 font-bold">
                            MXN por recomendar a un propietario
                        </p>
                    </div>

                    {/* Value prop callout */}
                    <div className="bg-cima-gold/5 border border-cima-gold/25 rounded-2xl px-6 py-4 max-w-lg mx-auto mb-10 text-xs font-medium text-cima-text flex items-center justify-center gap-3">
                        <Zap className="h-5 w-5 text-cima-gold shrink-0 animate-bounce" />
                        <span><strong>Nuestro valor agregado:</strong> ¡Garantizamos vender la propiedad en <strong>menos de 30 días</strong>!</span>
                    </div>

                    <p className="text-sm md:text-lg text-cima-text-muted max-w-2xl mx-auto mb-12 leading-relaxed">
                        ¿Tienes conocidos, amigos o vecinos que quieran vender su propiedad en Monterrey rápido y al mejor precio? Pásanos su contacto o compártele tu enlace único. Si los ayudamos a vender con nuestro plan de 30 días, tú ganas una gran comisión.
                    </p>

                    <button
                        onClick={scrollToForm}
                        className="inline-flex items-center gap-3 px-10 py-5 bg-cima-gold text-cima-bg font-heading font-black rounded-2xl hover:scale-105 transition-all shadow-[0_20px_40px_-15px_rgba(200,169,110,0.4)] text-sm uppercase tracking-widest group"
                    >
                        Comenzar a Referir
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="text-[11px] text-cima-text-dim font-mono mt-4">Transparente · Seguro · Directo a tu cuenta bancaria</p>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="py-16 md:py-24 px-6 bg-cima-card/40 relative line-pattern">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cima-border to-transparent" />
                <div className="mx-auto max-w-5xl">
                    <div className="text-center mb-14">
                        <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-[0.4em] mb-4 block">Fácil y sin rodeos</span>
                        <h2 className="text-3xl md:text-5xl font-heading font-bold tracking-tight text-cima-text">
                            ¿Cómo funciona el programa?
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                num: "01",
                                icon: Share2,
                                title: "Pásanos el contacto o comparte link",
                                desc: "Selecciona a tu asesor CIMA de confianza (Alejandro, Darien o Jair) y regístrate para pasarle el contacto o enviarle tu link único.",
                            },
                            {
                                num: "02",
                                icon: Zap,
                                title: "Vendemos en menos de 30 días",
                                desc: "Aplicamos nuestro plan de marketing acelerado premium para concretar la venta de la propiedad de tu conocido rápidamente.",
                            },
                            {
                                num: "03",
                                icon: DollarSign,
                                title: "Recibes tu comisión",
                                desc: "Una vez escriturada la propiedad y cobrada nuestra comisión de venta, te transferimos de $2,500 a $5,000 MXN de inmediato.",
                            },
                        ].map((step, i) => (
                            <div key={i} className="bg-cima-card border border-cima-border rounded-[24px] p-8 relative group hover:border-cima-gold/30 transition-all hover:-translate-y-1 duration-300">
                                <div className="absolute top-6 right-6 text-[10px] font-mono text-cima-text-dim font-black">{step.num}</div>
                                <div className="h-12 w-12 rounded-2xl bg-cima-gold/10 border border-cima-gold/25 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-cima-gold/20 transition-all">
                                    <step.icon className="h-6 w-6 text-cima-gold" />
                                </div>
                                <h3 className="text-lg font-heading font-bold mb-3 text-cima-text">{step.title}</h3>
                                <p className="text-sm text-cima-text-muted leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* EARNINGS CALCULATOR */}
            <section className="py-16 md:py-24 px-6 relative">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cima-gold/15 to-transparent" />
                <div className="mx-auto max-w-3xl">
                    <EarningsCalculator />
                </div>
            </section>

            {/* BENEFITS */}
            <section className="py-12 px-6 bg-cima-card/50 relative">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cima-border to-transparent" />
                <div className="mx-auto max-w-5xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { icon: ShieldCheck, title: "100% Confidencial", desc: "Tus datos y los del propietario están protegidos." },
                            { icon: Users,       title: "Sin Límites",       desc: "Recomienda todos los contactos que desees." },
                            { icon: Zap,         title: "Seguimiento Ágil",  desc: "Te notificamos el avance del contacto." },
                            { icon: TrendingUp,  title: "Alta Conversión",   desc: "CIMA vende en promedio en menos de 30 días." },
                        ].map((item, i) => (
                            <div key={i} className="bg-cima-card/70 border border-cima-border rounded-2xl p-5 text-center group hover:border-cima-gold/20 transition-all">
                                <div className="h-10 w-10 rounded-full bg-cima-gold/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                    <item.icon className="h-5 w-5 text-cima-gold" />
                                </div>
                                <p className="text-xs font-bold text-cima-text mb-1">{item.title}</p>
                                <p className="text-[10px] text-cima-text-muted leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FORM */}
            <section id="form-referidos" className="py-16 md:py-24 px-6 relative">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cima-gold/15 to-transparent" />
                <div className="mx-auto max-w-lg">
                    <div className="bg-cima-card border-2 border-cima-gold/20 rounded-[32px] overflow-hidden relative shadow-[0_40px_100px_-20px_rgba(200,169,110,0.15)] gold-glow">
                        <div className="absolute -top-16 -right-16 w-48 h-48 bg-cima-gold/20 blur-[80px] rounded-full pointer-events-none" />
                        <div className="relative z-10">
                            <ReferralForm defaultAdvisorId={defaultAdvisorId} />
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-16 md:py-24 px-6 bg-cima-card/30 relative">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cima-border to-transparent" />
                <div className="mx-auto max-w-5xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-5xl font-heading font-bold tracking-tight mb-4 text-cima-text">Preguntas Frecuentes</h2>
                    </div>
                    <Faq />
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-10 px-6 bg-cima-bg border-t border-cima-border">
                <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-lg bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center">
                            <Building2 className="h-3 w-3 text-cima-gold" />
                        </div>
                        <span className="font-heading font-bold text-cima-text/90 text-sm">CIMA Propiedades</span>
                    </div>
                    <p className="text-[10px] text-cima-text-dim font-mono uppercase tracking-widest text-center">
                        © {new Date().getFullYear()} CIMA Propiedades · Monterrey, NL · Programa de Embajadores
                    </p>
                    <Link
                        href="/"
                        className="text-[10px] text-cima-gold/50 hover:text-cima-gold font-mono uppercase tracking-widest transition-colors"
                    >
                        Ver portal →
                    </Link>
                </div>
            </footer>
            </div>{/* end z-10 wrapper */}
        </div>
    );
}

export default function GanaPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-cima-bg text-cima-text flex items-center justify-center">Cargando...</div>}>
            <GanaPageContent />
        </Suspense>
    );
}
