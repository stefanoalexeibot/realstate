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
                            scale: [1, 1.05, 1],
                            rotate: [0, 5, -5, 0]
                        }}
                        transition={{
                            duration: isMobile ? 4 : 10,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="w-16 h-16 sm:w-20 md:w-32 md:h-32 rounded-full bg-blue-500/10 border border-blue-500/30 backdrop-blur-3xl flex items-center justify-center relative shadow-[0_0_50px_rgba(59,130,246,0.2)]"
                    >
                        <div className="absolute inset-0 rounded-full animate-ping bg-blue-500/20 opacity-20" style={{ animationDuration: '3s' }} />
                        <Gavel className="h-5 w-5 sm:h-6 sm:w-6 md:h-10 md:w-10 text-blue-400" />
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                            <span className="font-mono text-[8px] md:text-[10px] font-black text-blue-400 tracking-[0.4em] uppercase">Protocol AI</span>
                        </div>
                    </motion.div>
                </div>

                {/* Connecting Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <line x1="50" y1="50" x2="50" y2="20" stroke="currentColor" strokeWidth="0.2" className="text-blue-500" />
                    <line x1="50" y1="50" x2="20" y2="50" stroke="currentColor" strokeWidth="0.2" className="text-blue-500" />
                    <line x1="50" y1="50" x2="80" y2="50" stroke="currentColor" strokeWidth="0.2" className="text-blue-500" />
                    <line x1="50" y1="50" x2="50" y2="80" stroke="currentColor" strokeWidth="0.2" className="text-blue-500" />
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
                            transform: "translate(-50%, -50%)",
                            willChange: "transform, opacity"
                        }}
                    >
                        <div className="flex flex-col items-center gap-1 sm:gap-2 md:gap-4">
                            <div
                                className="w-8 h-8 sm:w-10 sm:h-10 md:w-16 md:h-16 rounded-lg sm:rounded-xl md:rounded-2xl bg-slate-900/50 border border-slate-700/50 backdrop-blur-md flex items-center justify-center transition-all duration-500 md:group-hover:scale-110 group-hover:border-[currentColor] shadow-2xl overflow-hidden relative"
                                style={{ color: node.color }}
                            >
                                <div className="absolute inset-0 bg-[currentColor] opacity-0 group-hover:opacity-10 transition-opacity" />
                                {React.cloneElement(node.icon as React.ReactElement, { className: "h-4 w-4 md:h-6 md:w-6" })}
                            </div>
                            <div className="text-center max-w-[60px] md:max-w-[120px] transition-all duration-500 md:group-hover:translate-y-[-4px]">
                                <p className="text-[7px] md:text-[11px] font-black text-white uppercase tracking-wider mb-0.5 md:mb-1 leading-tight">{node.title}</p>
                                <p className="text-[9px] text-slate-400 leading-tight opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
                                    {node.description}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {/* Orbitals */}
                <div className="absolute inset-0 pointer-events-none opacity-20 md:opacity-100">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] md:w-[80%] md:h-[80%] border border-dashed border-blue-500/10 rounded-full"
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[65%] h-[65%] md:w-[60%] md:h-[60%] border border-dashed border-blue-500/10 rounded-full"
                    />
                </div>
            </div>
        </div>
    );
}
