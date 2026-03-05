'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle2, ChevronRight, ArrowRight, ShieldAlert, Zap } from 'lucide-react';

const ComparisonCard = ({ title, items, type }: { title: string, items: { text: string, sub: string }[], type: 'traditional' | 'aurum' }) => (
    <div className={`p-8 md:p-12 rounded-[40px] border relative overflow-hidden h-full ${type === 'traditional'
            ? 'bg-white/[0.02] border-white/5 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700'
            : 'bg-cima-card border-cima-gold shadow-[0_40px_100px_-20px_rgba(200,169,110,0.15)] z-10 scale-[1.02]'
        }`}>
        {type === 'aurum' && (
            <div className="absolute top-8 right-10 flex items-center gap-2 bg-cima-gold text-black px-4 py-1.5 rounded-full">
                <Zap className="h-3 w-3 fill-black" />
                <span className="text-[10px] font-black uppercase tracking-widest">El Nuevo Estándar</span>
            </div>
        )}

        <h3 className={`text-2xl md:text-3xl font-black mb-10 tracking-tight ${type === 'traditional' ? 'text-white/40' : 'text-white'}`}>
            {title}
        </h3>

        <div className="space-y-8">
            {items.map((item, i) => (
                <div key={i} className="flex gap-5 group">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-1 ${type === 'traditional' ? 'bg-red-500/10 border border-red-500/20' : 'bg-cima-gold/10 border border-cima-gold/20'
                        }`}>
                        {type === 'traditional' ? <X className="h-5 w-5 text-red-500" /> : <CheckCircle2 className="h-5 w-5 text-cima-gold" />}
                    </div>
                    <div>
                        <p className={`text-base md:text-lg font-bold mb-1 ${type === 'traditional' ? 'text-white/40' : 'text-white'}`}>
                            {item.text}
                        </p>
                        <p className={`text-xs md:text-sm leading-relaxed ${type === 'traditional' ? 'text-white/20' : 'text-white/40'}`}>
                            {item.sub}
                        </p>
                    </div>
                </div>
            ))}
        </div>

        <div className="mt-12 pt-10 border-t border-white/5 flex items-center justify-between">
            <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${type === 'traditional' ? 'text-white/20' : 'text-cima-gold'}`}>
                {type === 'traditional' ? 'Bajo Rendimiento' : 'Alta Conversión'}
            </span>
            {type === 'aurum' && <ArrowRight className="h-5 w-5 text-cima-gold animate-bounce-x" />}
        </div>
    </div>
);

export const Comparison = () => {
    const traditionalItems = [
        { text: "PDFs Estáticos por WhatsApp", sub: "El cliente los olvida a los 5 minutos o se pierden en el chat." },
        { text: "Imagen de 'Asesor Común'", sub: "Sin herramientas que griten profesionalismo y tecnología." },
        { text: "Cero Transparencia", sub: "El dueño pregunta '¿cómo va mi propiedad?' a las 10 PM." },
        { text: "Reportes Mensuales", sub: "Lentos, aburridos y a menudo ignorados por el cliente." }
    ];

    const aurumItems = [
        { text: "Portal Interactivo 24/7", sub: "Experiencia de ultra-lujo que el cliente presume con sus amigos." },
        { text: "Marca de Autoridad", sub: "Te posicionas como el experto tech que domina la zona." },
        { text: "Transparencia Total", sub: "Timeline en vivo de cada actividad, visita y feedback." },
        { text: "Analíticos en Tiempo Real", sub: "Datos irrefutables de interés, clics e intención de compra." }
    ];

    return (
        <section className="py-24 md:py-40 px-4 bg-[#020308] relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20 md:mb-32">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-[10px] md:text-xs font-mono font-bold text-cima-gold uppercase tracking-[0.4em] mb-6 block"
                    >
                        Análisis de Conversión
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-8"
                    >
                        El Problema de ser <br className="hidden md:block" />
                        <span className="text-white/20">"Solo un Asesor"</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-white/40 max-w-2xl mx-auto text-lg leading-relaxed italic"
                    >
                        "Casi todos los asesores pierden exclusivas porque sus herramientas no están a la altura del valor de la propiedad que pretenden vender."
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 relative">
                    {/* Background line connecting both */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-[1px] bg-cima-gold/20 hidden lg:block" />

                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <ComparisonCard title="Método Tradicional" items={traditionalItems} type="traditional" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <ComparisonCard title="Ecosistema Aurum" items={aurumItems} type="aurum" />
                    </motion.div>
                </div>

                <div className="mt-24 text-center">
                    <div className="inline-flex items-center gap-4 p-6 bg-white/5 border border-white/10 rounded-3xl max-w-xl">
                        <div className="p-3 bg-cima-gold/10 rounded-2xl">
                            <ShieldAlert className="h-6 w-6 text-cima-gold" />
                        </div>
                        <p className="text-left text-sm text-white/60 leading-relaxed font-medium">
                            <span className="text-white font-bold">Dato Clave:</span> El 85% de los propietarios está dispuesto a dar la exclusiva si el asesor demuestra un nivel tecnológico superior.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};
