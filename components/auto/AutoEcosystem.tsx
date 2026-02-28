"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
    Car,
    Share2,
    TrendingUp,
    ShieldCheck,
    Zap,
    Globe,
    Smartphone,
    CreditCard,
    Target
} from "lucide-react";

interface NodeProps {
    icon: React.ElementType;
    label: string;
    x: number;
    y: number;
    delay?: number;
    isMain?: boolean;
}

const Node = ({ icon: Icon, label, x, y, delay = 0, isMain = false }: NodeProps) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{
            duration: 0.6,
            delay,
            type: "spring",
            stiffness: 100
        }}
        style={{ left: `${x}%`, top: `${y}%` }}
        className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
    >
        <div className={`relative flex flex-col items-center gap-3`}>
            {/* Glow Effect */}
            <div className={`absolute inset-0 blur-2xl rounded-full transition-all duration-500 ${isMain ? "bg-blue-500/30 group-hover:bg-blue-500/50" : "bg-blue-400/10 group-hover:bg-blue-400/30"
                }`} />

            {/* Icon Container */}
            <motion.div
                whileHover={{ scale: 1.1 }}
                className={`relative z-10 p-4 rounded-2xl border flex items-center justify-center transition-all duration-300 ${isMain
                    ? "w-20 h-20 bg-blue-600 border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.5)]"
                    : "w-16 h-16 bg-white/5 border-white/10 hover:border-blue-500/40 backdrop-blur-xl"
                    }`}
            >
                <Icon className={`w-8 h-8 ${isMain ? "text-white" : "text-blue-400"}`} />

                {isMain && (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute -inset-2 rounded-full border border-dashed border-blue-400/30"
                    />
                )}
            </motion.div>

            {/* Label */}
            <span className={`text-xs font-bold uppercase tracking-widest transition-colors ${isMain ? "text-white" : "text-gray-400 group-hover:text-blue-400"
                }`}>
                {label}
            </span>
        </div>
    </motion.div>
);

const DataPacket = ({ startX, startY, endX, endY, delay = 0 }: { startX: number, startY: number, endX: number, endY: number, delay?: number }) => (
    <motion.div
        initial={{ left: `${startX}%`, top: `${startY}%`, opacity: 0 }}
        animate={{
            left: [`${startX}%`, `${endX}%`],
            top: [`${startY}%`, `${endY}%`],
            opacity: [0, 1, 0]
        }}
        transition={{
            duration: 3,
            repeat: Infinity,
            delay,
            ease: "easeInOut"
        }}
        className="absolute w-1.5 h-1.5 bg-blue-400 rounded-full blur-[2px] z-10 shadow-[0_0_8px_rgba(96,165,250,0.8)]"
    />
);

const AutoEcosystem = () => {
    const nodes = [
        { id: 'main', icon: Car, label: "Protocolo Cima", x: 50, y: 50, isMain: true },
        { id: 'mkt', icon: Share2, label: "Marketplaces", x: 20, y: 30 },
        { id: 'val', icon: Target, label: "Peritaje Digital", x: 80, y: 30 },
        { id: 'fin', icon: CreditCard, label: "Financiamiento", x: 20, y: 70 },
        { id: 'legal', icon: ShieldCheck, label: "Cierre Seguro", x: 80, y: 70 },
    ];

    return (
        <section className="relative py-24 sm:py-32 overflow-hidden bg-[#020617]">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6"
                    >
                        <Zap className="w-4 h-4" />
                        <span>ECOSISTEMA AUTOMOTRIZ 3.0</span>
                    </motion.div>
                    <h2 className="text-4xl sm:text-6xl font-bold text-white mb-6">
                        Una Red de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 text-glow">Venta Inteligente</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Conectamos tu vehículo con compradores finales, financiamiento y seguridad legal en una sola plataforma sincronizada.
                    </p>
                </div>

                <div className="relative h-[500px] w-full max-w-4xl mx-auto">
                    {/* Central Orbital Rings */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-blue-500/5 rounded-full" />
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-blue-500/10 rounded-full" />

                    {/* Connections with energetic flush */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                        {nodes.map((node, i) => {
                            if (i === 0) return null;
                            const center = nodes[0];
                            return (
                                <g key={i}>
                                    <motion.line
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        whileInView={{ pathLength: 1, opacity: 1 }}
                                        transition={{ duration: 1.5, delay: i * 0.2 }}
                                        x1={`${center.x}%`} y1={`${center.y}%`}
                                        x2={`${node.x}%`} y2={`${node.y}%`}
                                        stroke="rgba(59,130,246,0.15)"
                                        strokeWidth="2"
                                        strokeDasharray="4 4"
                                    />
                                    {/* Fluorescent flux pulse */}
                                    <motion.line
                                        animate={{ pathOffset: [0, 1] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                        x1={`${center.x}%`} y1={`${center.y}%`}
                                        x2={`${node.x}%`} y2={`${node.y}%`}
                                        stroke="url(#energyGradient)"
                                        strokeWidth="3"
                                        strokeDasharray="0.1 0.9"
                                        strokeDashoffset="0"
                                        pathLength="1"
                                    />
                                </g>
                            );
                        })}
                        <defs>
                            <linearGradient id="energyGradient" gradientUnits="userSpaceOnUse" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="transparent" />
                                <stop offset="50%" stopColor="#3b82f6" fillOpacity="1" />
                                <stop offset="100%" stopColor="transparent" />
                            </linearGradient>
                        </defs>
                    </svg>
                    {/* Animated Data Packets */}
                    {nodes.filter(n => !n.isMain).map((node, i) => (
                        <DataPacket
                            key={`packet-${node.id}`}
                            startX={50} startY={50}
                            endX={node.x} endY={node.y}
                            delay={i * 0.6}
                        />
                    ))}

                    {/* Nodes */}
                    {nodes.map((node, i) => (
                        <Node
                            key={node.id}
                            {...node}
                            delay={i * 0.1}
                        />
                    ))}
                </div>

                <div className="grid sm:grid-cols-3 gap-8 mt-24">
                    {[
                        { title: "Multicanal", desc: "Publicación simultánea en Facebook, ML y sitios premium.", icon: Globe },
                        { title: "Smart-Price", desc: "Algoritmos que ajustan el precio según demanda real.", icon: TrendingUp },
                        { title: "Gestión-Mobile", desc: "Sigue todo el proceso desde tu celular en tiempo real.", icon: Smartphone }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.2 }}
                            className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/20 transition-all group"
                        >
                            <item.icon className="w-10 h-10 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                            <h4 className="text-white font-bold mb-2">{item.title}</h4>
                            <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Background Decorative Mesh */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%233b82f6' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3C/g%3E%3C/svg%3E")` }} />
        </section>
    );
};

export default AutoEcosystem;
