"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    ShieldCheck,
    Gavel,
    FileSignature,
    Zap,
    Database,
    Scale,
    Clock,
    ArrowRight,
    Search
} from "lucide-react";

const nodes = [
    {
        id: "monitor",
        title: "Monitor Judicial",
        icon: <Search className="h-6 w-6" />,
        color: "#60A5FA", // Blue
        description: "Rastreo automático de acuerdos y boletines.",
        pos: { top: "20%", left: "50%" }
    },
    {
        id: "portal",
        title: "Portal de Clientes",
        icon: <FileSignature className="h-6 w-6" />,
        color: "#94A3B8", // Slate
        description: "Transparencia total en el estatus del caso.",
        pos: { top: "50%", left: "20%" }
    },
    {
        id: "vault",
        title: "Bóveda Digital",
        icon: <ShieldCheck className="h-6 w-6" />,
        color: "#34D399", // Emerald
        description: "Almacenamiento seguro de evidencias y sentencias.",
        pos: { top: "50%", left: "80%" }
    },
    {
        id: "intelligence",
        title: "IA Jurídica",
        icon: <Scale className="h-6 w-6" />,
        color: "#818CF8", // Indigo
        description: "Resúmenes automáticos de acuerdos complejos.",
        pos: { top: "80%", left: "50%" }
    }
];

const Particle = ({ delay, direction }: { delay: number; direction: 'up' | 'down' | 'left' | 'right' }) => {
    const variants = {
        up: { y: [0, -30], x: [0, 0], opacity: [0, 1, 0] },
        down: { y: [0, 30], x: [0, 0], opacity: [0, 1, 0] },
        left: { x: [0, -30], y: [0, 0], opacity: [0, 1, 0] },
        right: { x: [0, 30], y: [0, 0], opacity: [0, 1, 0] }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={variants[direction]}
            transition={{
                duration: 2,
                repeat: Infinity,
                delay: delay,
                ease: "linear"
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-blue-400 rounded-full blur-[1px] z-0"
        />
    );
};

const DataPacket = ({ angle, delay }: { angle: number; delay: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
            animate={{
                opacity: [0, 1, 1, 0],
                scale: [0, 1, 1, 0.5],
                x: [0, Math.cos(angle) * 150], // Adjust distance
                y: [0, Math.sin(angle) * 150]
            }}
            transition={{
                duration: 3,
                repeat: Infinity,
                delay: delay,
                ease: "easeInOut"
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full blur-[2px] z-10 shadow-[0_0_10px_#3b82f6]"
        />
    );
};

export default function LegalEcosystem() {
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div className="relative w-full py-10 md:py-20 group overflow-hidden">
            <div className="relative aspect-[4/3] md:aspect-video max-w-[800px] mx-auto flex items-center justify-center overflow-visible px-4">
                {/* Background Glows */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent opacity-50" />
                </div>

                {/* Central Core */}
                <div className="relative z-10">
                    <motion.div
                        animate={isMobile ? {
                            scale: [1, 1.03, 1],
                        } : {
                            scale: [1, 1.08, 1],
                            rotate: [0, 5, -5, 0]
                        }}
                        transition={{
                            duration: isMobile ? 4 : 8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="w-16 h-16 sm:w-20 md:w-32 md:h-32 rounded-[30%] bg-blue-600/10 border border-blue-500/30 backdrop-blur-3xl flex items-center justify-center relative shadow-[0_0_80px_rgba(59,130,246,0.25)]"
                    >
                        <div className="absolute inset-0 rounded-[30%] animate-pulse bg-blue-500/20 opacity-30" style={{ animationDuration: '2s' }} />
                        <Gavel className="h-5 w-5 sm:h-6 sm:w-6 md:h-12 md:w-12 text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]" />
                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap">
                            <span className="font-mono text-[8px] md:text-[10px] font-black text-blue-400 tracking-[0.5em] uppercase">Protocol AI</span>
                        </div>

                        {/* Particles flowing out */}
                        <Particle direction="right" delay={0.75} />
                        <Particle direction="right" delay={1.75} />

                        {/* Animated Data Packets to Nodes */}
                        <DataPacket angle={-Math.PI / 2} delay={0} /> {/* Monitor */}
                        <DataPacket angle={Math.PI} delay={0.5} /> {/* Portal */}
                        <DataPacket angle={0} delay={1} /> {/* Vault */}
                        <DataPacket angle={Math.PI / 2} delay={1.5} /> {/* IA */}
                    </motion.div>
                </div>

                {/* Connecting Lines with Glow */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <line x1="50" y1="50" x2="50" y2="20" stroke="url(#lineGrad)" strokeWidth="0.1" className="animate-pulse" />
                    <line x1="50" y1="50" x2="20" y2="50" stroke="url(#lineGrad)" strokeWidth="0.1" className="animate-pulse" />
                    <line x1="50" y1="50" x2="80" y2="50" stroke="url(#lineGrad)" strokeWidth="0.1" className="animate-pulse" />
                    <line x1="50" y1="50" x2="50" y2="80" stroke="url(#lineGrad)" strokeWidth="0.1" className="animate-pulse" />
                </svg>

                {/* Nodes */}
                {nodes.map((node, i) => (
                    <motion.div
                        key={node.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: isMobile ? 0.1 * i : i * 0.2, duration: 0.8 }}
                        viewport={{ once: true }}
                        className="absolute z-20 group"
                        style={{
                            top: node.pos.top,
                            left: node.pos.left,
                            transform: "rotate(45deg) translate(-50%, -50%)", // Technical rotation
                            willChange: "transform, opacity"
                        }}
                    >
                        <div className="flex flex-col items-center gap-1 sm:gap-2 md:gap-4 -rotate-[45deg]">
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className="w-10 h-10 sm:w-12 sm:h-12 md:w-20 md:h-20 rounded-2xl md:rounded-[30%] bg-slate-950/80 border border-slate-700/50 backdrop-blur-2xl flex items-center justify-center transition-all duration-500 group-hover:border-[currentColor] shadow-2xl overflow-hidden relative"
                                style={{ color: node.color }}
                            >
                                <div className="absolute inset-0 bg-[currentColor] opacity-5 group-hover:opacity-20 transition-opacity" />
                                {React.cloneElement(node.icon as React.ReactElement, { className: "h-5 w-5 md:h-8 md:w-8 drop-shadow-md" })}

                                {/* Orbiting ring on hover */}
                                <motion.div
                                    className="absolute inset-0 border border-dashed border-[currentColor] rounded-[30%] opacity-0 group-hover:opacity-40"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                />
                            </motion.div>
                            <div className="text-center max-w-[80px] md:max-w-[150px] transition-all duration-500 md:group-hover:translate-y-[-4px]">
                                <p className="text-[8px] md:text-[12px] font-black text-white uppercase tracking-wider mb-0.5 md:mb-1 leading-tight">{node.title}</p>
                                <div className="flex justify-center gap-1 mb-2 opacity-40">
                                    {[1, 2, 3].map(d => <div key={d} className="w-1 h-1 rounded-full bg-current" style={{ color: node.color }} />)}
                                </div>
                                <p className="text-[9px] text-slate-400 leading-tight opacity-0 group-hover:opacity-100 transition-opacity hidden md:block font-medium">
                                    {node.description}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {/* Orbitals */}
                <div className="absolute inset-0 pointer-events-none opacity-10 md:opacity-30">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] h-[95%] border border-[currentColor] text-blue-500/20 rounded-full"
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] h-[75%] border border-dashed border-[currentColor] text-indigo-500/20 rounded-full"
                    />
                </div>
            </div>
        </div>
    );
}
