'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Globe, BarChart3, MessageSquare, Shield, Key, Camera, FileText, Zap, Smartphone, Users, QrCode, Star } from 'lucide-react';

const features = [
    { icon: Globe, title: 'Landing Page Premium', desc: 'Diseño Ultra-Lujo con animaciones y galería interactiva que deja boquiabierto a cualquier comprador.', size: 'large', color: 'from-cima-gold/10 to-amber-500/5', border: 'border-cima-gold/20' },
    { icon: BarChart3, title: 'Analíticos en Vivo', desc: 'Dashboard con datos de clics, tiempo de visita y zonas de interés de cada prospecto.', size: 'small', color: 'from-blue-500/10 to-cyan-500/5', border: 'border-blue-500/20' },
    { icon: MessageSquare, title: 'IA Feedback', desc: 'La IA analiza el sentimiento del comprador después de cada visita física y te da recomendaciones.', size: 'small', color: 'from-purple-500/10 to-violet-500/5', border: 'border-purple-500/20' },
    { icon: Shield, title: 'Portal Privado 24/7', desc: 'El dueño ve todo en tiempo real. Nunca más una llamada a las 10PM.', size: 'small', color: 'from-green-500/10 to-emerald-500/5', border: 'border-green-500/20' },
    { icon: Camera, title: 'Sesión 4K Incluida', desc: 'Fotógrafo profesional con equipo de gama alta para maximizar el impacto visual.', size: 'small', color: 'from-pink-500/10 to-rose-500/5', border: 'border-pink-500/20' },
    { icon: FileText, title: 'Contratos PDF', desc: '4 tipos de contratos generados en segundos. Sin abrir Word jamás.', size: 'small', color: 'from-orange-500/10 to-red-500/5', border: 'border-orange-500/20' },
    { icon: QrCode, title: 'QR Inteligente', desc: 'Imprime códigos QR para Open Houses que redirigen a tu Landing de ultra-lujo.', size: 'small', color: 'from-teal-500/10 to-cyan-500/5', border: 'border-teal-500/20' },
    { icon: Users, title: 'Multi-Agentes', desc: 'Gestiona un equipo completo de asesores desde un solo panel centralizado.', size: 'large', color: 'from-indigo-500/10 to-blue-500/5', border: 'border-indigo-500/20' },
];

export const Features = () => {
    return (
        <section className="py-24 md:py-40 px-4 bg-[#020308] relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20 md:mb-32">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-[0.4em] mb-6 block"
                    >
                        Ecosistema Completo
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-8"
                    >
                        Todo lo que necesitas. <br className="hidden md:block" />
                        <span className="text-white/20">Nada de lo que no.</span>
                    </motion.h2>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] gap-4 md:gap-6">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: i * 0.05 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.03 }}
                            className={`p-6 md:p-8 rounded-[24px] md:rounded-[32px] bg-gradient-to-br ${f.color} border ${f.border} cursor-default relative overflow-hidden group transition-all ${f.size === 'large' ? 'col-span-2' : 'col-span-1'
                                }`}
                        >
                            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.02] transition-colors duration-500 pointer-events-none" />
                            <div className="h-full flex flex-col justify-between relative z-10">
                                <div className="p-3 w-fit rounded-2xl bg-white/5 border border-white/10 mb-4">
                                    <f.icon className="h-5 w-5 md:h-6 md:w-6 text-white/60 group-hover:text-white transition-colors" />
                                </div>
                                <div>
                                    <h3 className="font-black text-white text-sm md:text-base mb-2">{f.title}</h3>
                                    <p className="text-white/40 text-xs leading-relaxed">{f.desc}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
