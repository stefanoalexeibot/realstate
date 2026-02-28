"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Search,
    Camera,
    ShieldCheck,
    Handshake,
    BadgeCheck,
    CreditCard
} from "lucide-react";

const STEPS = [
    {
        title: "Peritaje Digital",
        desc: "Valuación profesional basada en datos reales de mercado en tiempo real.",
        icon: Search,
        status: "complete"
    },
    {
        title: "Shooting Elite",
        desc: "Sesión de fotos y video 4K para resaltar cada detalle de tu auto.",
        icon: Camera,
        status: "active"
    },
    {
        title: "Blindaje Legal",
        desc: "Verificación completa de documentos y antecedentes ante autoridades.",
        icon: ShieldCheck,
        status: "pending"
    },
    {
        title: "Match Perfecto",
        desc: "Conectamos con compradores calificados y gestionamos ofertas.",
        icon: Handshake,
        status: "pending"
    },
    {
        title: "Cierre Seguro",
        desc: "Firma ante notario y transferencia bancaria inmediata protegida.",
        icon: CreditCard,
        status: "pending"
    }
];

export default function AutoJourney() {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-8">
                <div className="text-center mb-20">
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-[10px] font-mono text-blue-400 uppercase tracking-[0.3em] mb-4"
                    >
                        Metodología Cima 0-100
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl sm:text-6xl font-black tracking-tight"
                    >
                        El camino más corto <br />
                        <span className="text-gray-500">hacia tu mejor venta.</span>
                    </motion.h2>
                </div>

                <div className="relative">
                    {/* Background Progress Line */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-white/5 -translate-y-1/2 hidden lg:block" />

                    {/* Active Progress Line */}
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "35%" }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                        className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-blue-600 to-blue-400 -translate-y-1/2 hidden lg:block shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4 relative z-10">
                        {STEPS.map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="group"
                            >
                                <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                                    {/* Icon Container */}
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 relative ${step.status === 'complete' ? 'bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.3)]' :
                                            step.status === 'active' ? 'bg-white/10 border border-blue-500/40' :
                                                'bg-white/5 border border-white/5'
                                        }`}>
                                        <step.icon className={`w-7 h-7 ${step.status === 'complete' ? 'text-white' :
                                                step.status === 'active' ? 'text-blue-400' :
                                                    'text-gray-600'
                                            }`} />

                                        {step.status === 'active' && (
                                            <motion.div
                                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className="absolute -inset-2 border border-blue-500/30 rounded-3xl pointer-events-none"
                                            />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <h3 className={`text-xl font-black mb-3 ${step.status === 'pending' ? 'text-gray-500' : 'text-white'
                                        }`}>
                                        {step.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 leading-relaxed font-medium">
                                        {step.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-blue-500/10 to-transparent pointer-events-none" />
        </section>
    );
}
