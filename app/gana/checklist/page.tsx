"use client";

import React from "react";
import { Building2, ArrowLeft, CheckSquare, Clock, Zap, Home, Camera, DollarSign, FileText, Users, Shield, Phone, Star } from "lucide-react";
import Link from "next/link";

interface CheckItem {
    done: boolean;
    text: string;
    tip?: string;
}

const CHECKLIST_SECTIONS: { icon: React.ElementType; title: string; items: CheckItem[] }[] = [
    {
        icon: FileText,
        title: "📋 Documentación y Valuación",
        items: [
            { done: false, text: "Reunir documentos de propiedad: Escrituras, predial al corriente, agua." },
            { done: false, text: "Solicitar valuación comercial gratuita con CIMA Propiedades.", tip: "CIMA la realiza en tu domicilio sin costo. Resultado en 24 hrs." },
            { done: false, text: "Definir precio de salida al mercado con base en la valuación real." },
            { done: false, text: "Verificar que no existan hipotecas o adeudos pendientes con el banco." },
        ]
    },
    {
        icon: Camera,
        title: "📸 Presentación Visual",
        items: [
            { done: false, text: "Sesión fotográfica profesional HD de todos los espacios del inmueble.", tip: "Incluida con el plan CIMA. Fotos en hora dorada generan 3x más visitas." },
            { done: false, text: "Despersonalizar la propiedad: retirar fotos, objetos muy personales y exceso de muebles." },
            { done: false, text: "Home staging básico: iluminación, orden y neutralización de colores." },
            { done: false, text: "Video recorrido 360° o reel de Instagram para portales digitales." },
        ]
    },
    {
        icon: Zap,
        title: "🚀 Marketing y Difusión (Días 1–10)",
        items: [
            { done: false, text: "Publicar en portales digitales: Inmuebles24, Lamudi, Vivanuncios.", tip: "Con CIMA, la publicación va en los 3 portales el mismo día con fotos HD." },
            { done: false, text: "Activar pauta pagada en Facebook & Instagram (público de compradores calificados)." },
            { done: false, text: "Publicar en grupos de WhatsApp de la colonia/fraccionamiento." },
            { done: false, text: "Enviar ficha técnica profesional a base de compradores activos de CIMA." },
            { done: false, text: "Crear tour virtual o recorrido digital accesible desde el portal." },
        ]
    },
    {
        icon: Users,
        title: "🤝 Atención a Compradores (Días 10–20)",
        items: [
            { done: false, text: "Responder consultas entrantes en menos de 2 horas hábiles." },
            { done: false, text: "Agendar visitas presenciales con compradores pre-calificados.", tip: "CIMA filtra y pre-califica a los compradores antes de programar visitas." },
            { done: false, text: "Preparar la propiedad para visitas: limpieza, iluminación, temperatura." },
            { done: false, text: "Recopilar retroalimentación de visitas para ajustar estrategia si es necesario." },
        ]
    },
    {
        icon: DollarSign,
        title: "✍️ Negociación y Cierre (Días 20–30)",
        items: [
            { done: false, text: "Evaluar ofertas recibidas con soporte de tu asesor CIMA.", tip: "El asesor CIMA negocia en tu favor para maximizar el precio de venta." },
            { done: false, text: "Aceptar oferta y firmar contrato de promesa de compraventa ante notario." },
            { done: false, text: "Coordinar inspección técnica del inmueble si el comprador lo solicita." },
            { done: false, text: "Firma de escrituras ante Notario Público y transferencia del precio acordado." },
            { done: false, text: "¡Celebrar! 🎉 Propiedad vendida en menos de 30 días con CIMA." },
        ]
    },
];

const GUARANTEES = [
    { icon: Zap, text: "Venta garantizada en menos de 30 días" },
    { icon: Shield, text: "Asesoría jurídica y contrato sin costo" },
    { icon: Camera, text: "Fotografía HD y pauta digital incluidas" },
    { icon: Phone, text: "Atención personalizada de asesor senior" },
    { icon: Star, text: "Sin pagos por adelantado — pagas al vender" },
];

export default function ChecklistPage() {
    return (
        <div className="min-h-screen bg-cima-bg text-cima-text print:bg-white print:text-black">

            {/* SCREEN-ONLY nav */}
            <nav className="print:hidden fixed top-0 left-0 right-0 z-50 border-b border-cima-border/50 backdrop-blur-xl bg-cima-bg/85">
                <div className="mx-auto max-w-4xl h-16 px-6 flex items-center justify-between">
                    <Link href="/gana" className="flex items-center gap-2 text-cima-text-muted hover:text-cima-gold transition-colors text-xs font-mono font-bold">
                        <ArrowLeft className="h-4 w-4" />
                        Programa Embajadores
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="h-7 w-7 rounded-lg bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center">
                            <Building2 className="text-cima-gold h-3.5 w-3.5" />
                        </div>
                        <span className="font-heading font-bold text-sm text-cima-text">CIMA Propiedades</span>
                        <button
                            onClick={() => window.print()}
                            className="ml-4 px-4 py-2 bg-cima-gold text-cima-bg rounded-xl text-xs font-bold font-mono uppercase tracking-widest hover:bg-cima-gold-light transition-all"
                        >
                            Descargar PDF ↓
                        </button>
                    </div>
                </div>
            </nav>

            {/* MAIN CONTENT (screen + print) */}
            <main className="pt-24 print:pt-0 pb-24 print:pb-10 px-6 max-w-4xl mx-auto">

                {/* Header */}
                <header className="text-center mb-10 print:mb-8">
                    <div className="print:hidden inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cima-gold/10 border border-cima-gold/20 mb-5">
                        <CheckSquare className="h-4 w-4 text-cima-gold" />
                        <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-widest">Lead Magnet Gratuito</span>
                    </div>

                    {/* Print-visible header */}
                    <div className="hidden print:flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-yellow-400 flex items-center justify-center">
                                <Building2 className="h-5 w-5 text-black" />
                            </div>
                            <div className="text-left">
                                <p className="font-black text-lg leading-none">CIMA Propiedades</p>
                                <p className="text-xs text-gray-500 font-mono">www.cimapropiedades.com</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-400 font-mono">Plan de Venta Acelerada · Monterrey NL</p>
                            <p className="text-[11px] text-yellow-600 font-bold">GARANTÍA: &lt; 30 DÍAS O AJUSTAMOS LA ESTRATEGIA</p>
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-heading font-black text-cima-text print:text-4xl print:text-black mb-3">
                        Checklist: Vende tu Casa<br className="hidden md:block" />{" "}
                        <span className="text-cima-gold print:text-yellow-600">en Menos de 30 Días</span>
                    </h1>
                    <p className="text-sm text-cima-text-muted print:text-gray-600 max-w-xl mx-auto leading-relaxed">
                        9 pasos estratégicos comprobados que CIMA Propiedades aplica con cada propietario en Monterrey para garantizar la venta rápida y al mejor precio del mercado.
                    </p>
                </header>

                {/* Guarantees strip */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-10 p-4 bg-cima-gold/5 border border-cima-gold/20 rounded-2xl print:border print:border-yellow-300 print:bg-yellow-50">
                    {GUARANTEES.map((g, i) => {
                        const Icon = g.icon;
                        return (
                            <div key={i} className="flex items-center gap-2 text-[11px] font-bold text-cima-gold print:text-yellow-700">
                                <Icon className="h-4 w-4 shrink-0" />
                                <span>{g.text}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Checklist Sections */}
                <div className="space-y-8">
                    {CHECKLIST_SECTIONS.map((section, si) => {
                        const Icon = section.icon;
                        return (
                            <div key={si} className="bg-cima-card border border-cima-border rounded-2xl p-6 print:border print:border-gray-200 print:rounded-xl print:bg-white print:break-inside-avoid">
                                <h2 className="text-base font-heading font-black text-cima-text print:text-black mb-4 flex items-center gap-2">
                                    <Icon className="h-5 w-5 text-cima-gold print:text-yellow-600" />
                                    {section.title}
                                </h2>
                                <div className="space-y-3">
                                    {section.items.map((item, ii) => (
                                        <div key={ii} className="flex items-start gap-3 group">
                                            {/* Checkbox (printable) */}
                                            <div className="mt-0.5 h-5 w-5 rounded border-2 border-cima-gold/40 print:border-gray-400 shrink-0 flex items-center justify-center" />
                                            <div>
                                                <p className="text-sm text-cima-text print:text-black leading-snug">{item.text}</p>
                                                {item.tip && (
                                                    <p className="text-[11px] text-cima-gold print:text-yellow-700 font-mono mt-0.5">
                                                        💡 {item.tip}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* CTA / Footer */}
                <div className="mt-12 bg-cima-gold/10 border-2 border-cima-gold/30 rounded-3xl p-8 text-center print:border-2 print:border-yellow-400 print:bg-yellow-50 print:rounded-xl print:mt-8">
                    <p className="text-[10px] font-mono font-bold text-cima-gold print:text-yellow-700 uppercase tracking-widest mb-2">¿Listo para vender?</p>
                    <h3 className="text-2xl print:text-xl font-heading font-black text-cima-text print:text-black mb-3">
                        Solicita tu Asesoría Gratuita con CIMA
                    </h3>
                    <p className="text-xs text-cima-text-muted print:text-gray-600 mb-4 max-w-md mx-auto leading-relaxed">
                        Valuación comercial, fotografía HD y estrategia de venta completa <strong>sin costo inicial</strong>. Solo pagas cuando vendemos tu propiedad.
                    </p>
                    {/* Screen */}
                    <Link
                        href="/vende"
                        className="print:hidden inline-flex items-center gap-2 px-8 py-4 bg-cima-gold text-cima-bg font-heading font-black rounded-2xl text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-cima-gold/20"
                    >
                        Solicitar Asesoría Gratuita →
                    </Link>
                    {/* Print */}
                    <p className="hidden print:block text-base font-black text-yellow-700">
                        👉 www.cimapropiedades.com/vende · WhatsApp: 81 2198 0008
                    </p>
                </div>

                {/* Screen download reminder */}
                <div className="print:hidden mt-8 text-center">
                    <button
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-2 text-xs font-mono text-cima-text-muted hover:text-cima-gold transition-colors"
                    >
                        <Clock className="h-4 w-4" />
                        Guarda este checklist como PDF (Ctrl+P → Guardar como PDF)
                    </button>
                </div>
            </main>
        </div>
    );
}
