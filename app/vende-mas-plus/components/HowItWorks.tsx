'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Sparkles, Camera, Globe, BarChart3, CheckCircle2, ArrowRight } from 'lucide-react';

const steps = [
    {
        number: '01',
        icon: Sparkles,
        title: 'Onboarding VIP',
        subtitle: 'Día 1',
        description: 'En menos de 24 horas, tu asesor activa el ecosistema. Recibes el link del Portal del Propietario con tu propiedad ya cargada.',
        detail: 'Sin esfuerzo de tu parte. Nosotros configuramos todo.',
        color: 'from-cima-gold/20 to-amber-500/10',
        border: 'border-cima-gold/30',
        iconColor: 'text-cima-gold',
    },
    {
        number: '02',
        icon: Camera,
        title: 'Sesión Fotográfica 4K',
        subtitle: 'Día 2-3',
        description: 'Fotógrafo profesional llega a tu propiedad. Las imágenes se suben directamente a tu portal y a todos los portales de venta.',
        detail: 'Cobertura en 8+ plataformas simultáneamente.',
        color: 'from-blue-500/20 to-cyan-500/10',
        border: 'border-blue-500/30',
        iconColor: 'text-blue-400',
    },
    {
        number: '03',
        icon: Globe,
        title: 'Lanzamiento Masivo',
        subtitle: 'Día 5',
        description: 'Tu propiedad se publica en Inmuebles24, Lamudi, Vivanuncios y más. Tus redes sociales también se activan con contenido premium.',
        detail: 'Máxima exposición desde el primer día.',
        color: 'from-purple-500/20 to-violet-500/10',
        border: 'border-purple-500/30',
        iconColor: 'text-purple-400',
    },
    {
        number: '04',
        icon: BarChart3,
        title: 'Reportes en Tiempo Real',
        subtitle: 'Semana 1+',
        description: 'Desde tu portal, puedes ver quién visitó la propiedad, qué les pareció y cuántas personas la tienen en favoritos en cada plataforma.',
        detail: 'Sin llamadas ansiosas. Todo en tu pantalla.',
        color: 'from-green-500/20 to-emerald-500/10',
        border: 'border-green-500/30',
        iconColor: 'text-green-400',
    },
    {
        number: '05',
        icon: MessageSquare,
        title: 'Feedback con IA',
        subtitle: 'Por visita',
        description: 'Después de cada visita, el comprador recibe una encuesta automática. La IA analiza su sentimiento y te da un resumen de objeciones.',
        detail: 'Sabes exactamente qué le falta a tu propiedad.',
        color: 'from-cima-gold/20 to-orange-500/10',
        border: 'border-cima-gold/30',
        iconColor: 'text-cima-gold',
    },
];

export const HowItWorks = () => {
    return (
        <section className="py-24 md:py-40 px-4 bg-[#020308] relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20 md:mb-32">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-[0.4em] mb-6 block"
                    >
                        El Proceso Aurum
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-8"
                    >
                        De firmar la exclusiva <br className="hidden md:block" />
                        <span className="text-cima-gold">al cierre en tiempo récord.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-white/40 max-w-2xl mx-auto text-lg leading-relaxed"
                    >
                        Cinco pasos. Sistema comprobado. Resultados garantizados.
                    </motion.p>
                </div>

                <div className="relative">
                    {/* Vertical connecting line */}
                    <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent hidden md:block" />

                    <div className="space-y-12 md:space-y-0">
                        {steps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className={`relative flex flex-col md:flex-row gap-8 md:gap-20 items-center ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                            >
                                {/* Number indicator on the line */}
                                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-[#020308] border border-white/10 items-center justify-center z-10">
                                    <span className="text-sm font-black text-white/40 font-mono">{step.number}</span>
                                </div>

                                {/* Card */}
                                <div className={`flex-1 ${i % 2 === 1 ? 'md:text-right' : ''}`}>
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className={`p-8 md:p-10 rounded-[32px] bg-gradient-to-br ${step.color} border ${step.border} relative overflow-hidden`}
                                    >
                                        <div className={`flex items-start gap-6 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                                            <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0`}>
                                                <step.icon className={`h-7 w-7 md:h-8 md:w-8 ${step.iconColor}`} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-3 flex-wrap">
                                                    <span className="text-[9px] font-black font-mono text-white/20 uppercase tracking-[0.3em]">{step.number}</span>
                                                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 border border-white/10 ${step.iconColor}`}>
                                                        {step.subtitle}
                                                    </span>
                                                </div>
                                                <h3 className="text-xl md:text-2xl font-black text-white mb-3">{step.title}</h3>
                                                <p className="text-white/50 text-sm md:text-base leading-relaxed mb-4">{step.description}</p>
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle2 className={`h-4 w-4 ${step.iconColor} shrink-0`} />
                                                    <span className="text-xs font-bold text-white/30">{step.detail}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Empty side (alternating layout) */}
                                <div className="flex-1 hidden md:block" />
                            </motion.div>
                        ))}
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-20 md:mt-32 text-center"
                >
                    <button className="inline-flex items-center gap-4 px-10 py-5 bg-cima-gold text-black font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl text-sm">
                        Ver mi Portal en Acción <ArrowRight className="h-5 w-5" />
                    </button>
                </motion.div>
            </div>
        </section>
    );
};
