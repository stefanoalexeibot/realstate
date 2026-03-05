'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
    {
        name: 'Claudia Rodríguez',
        role: 'Agente Independiente · Monterrey',
        avatar: 'CR',
        color: 'from-cima-gold to-amber-600',
        stars: 5,
        quote: 'En 3 meses pasé de 1 exclusiva a 6 simultáneas. Los propietarios me llaman porque vieron el portal de sus amigos y quieren lo mismo para ellos.',
        stat: '+500% Exclusivas',
    },
    {
        name: 'Marco Herrera',
        role: 'Director · Inmobiliaria Elite MTY',
        avatar: 'MH',
        color: 'from-blue-500 to-indigo-600',
        stars: 5,
        quote: 'El portal del propietario eliminó por completo el estrés de las llamadas. Ahora mis clientes confían más en el proceso y están más tranquilos.',
        stat: '0 llamadas ansiosas',
    },
    {
        name: 'Ana Sofía Treviño',
        role: 'Asesora Senior · San Pedro Garza García',
        avatar: 'AT',
        color: 'from-purple-500 to-violet-600',
        stars: 5,
        quote: 'Las fotos en 4K y el portal de ultra-lujo me permiten cobrar comisiones más altas. Ahora mis clientes perciben el valor premium desde el primer día.',
        stat: '+35% en comisiones',
    },
    {
        name: 'Roberto Sánchez',
        role: 'Asesor · Zona Metropolitana de MTY',
        avatar: 'RS',
        color: 'from-green-500 to-emerald-600',
        stars: 5,
        quote: 'Lo que más me sorprendió fue el feedback de IA después de cada visita. Ahora sé exactamente por qué un comprador no se decidió y puedo ajustar la estrategia.',
        stat: '12 cierres en 90 días',
    },
];

export const Testimonials = () => {
    return (
        <section className="py-24 md:py-40 px-4 bg-black relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-10"
                style={{
                    backgroundImage: 'radial-gradient(circle, rgba(200,169,110,0.4) 1px, transparent 1px)',
                    backgroundSize: '60px 60px'
                }}
            />

            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20 md:mb-32">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-[0.4em] mb-6 block"
                    >
                        Testimonios Reales
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-8"
                    >
                        Asesores que ya <br className="hidden md:block" />
                        <span className="text-cima-gold">rompieron el molde.</span>
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: i * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.02, y: -4 }}
                            className="p-8 md:p-10 rounded-[32px] bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all relative overflow-hidden group"
                        >
                            {/* Subtle glow on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-cima-gold/0 to-cima-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                            <div className="flex items-start gap-6 mb-8">
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${t.color} flex items-center justify-center shrink-0 shadow-lg`}>
                                    <span className="text-white font-black text-sm">{t.avatar}</span>
                                </div>
                                <div>
                                    <p className="font-black text-white text-base mb-1">{t.name}</p>
                                    <p className="text-white/30 text-xs uppercase tracking-widest font-bold">{t.role}</p>
                                    <div className="flex gap-1 mt-2">
                                        {Array.from({ length: t.stars }).map((_, s) => (
                                            <Star key={s} className="h-3 w-3 text-cima-gold fill-cima-gold" />
                                        ))}
                                    </div>
                                </div>
                                <Quote className="h-8 w-8 text-white/5 ml-auto shrink-0 mt-1" />
                            </div>

                            <p className="text-white/60 text-sm md:text-base leading-relaxed mb-8 italic">
                                "{t.quote}"
                            </p>

                            <div className="pt-6 border-t border-white/5">
                                <span className="text-cima-gold font-black text-sm uppercase tracking-widest">{t.stat}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
