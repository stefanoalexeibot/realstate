"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, UserCheck, Layout, Zap, Database, Globe, Briefcase, ArrowRight } from "lucide-react";

const nodes = [
    {
        id: "admin",
        title: "Admin Engine",
        icon: <Database className="h-6 w-6" />,
        color: "#EAB308", // Cima Gold
        description: "Control central de inventario y agentes IA.",
        pos: { top: "20%", left: "50%" }
    },
    {
        id: "portal",
        title: "Portal de Propietarios",
        icon: <UserCheck className="h-6 w-6" />,
        color: "#60A5FA",
        description: "Transparencia total para ganar exclusivas.",
        pos: { top: "50%", left: "20%" }
    },
    {
        id: "landing",
        title: "Landing Premium",
        icon: <Layout className="h-6 w-6" />,
        color: "#A78BFA",
        description: "Conversión de alto nivel para cada propiedad.",
        pos: { top: "50%", left: "80%" }
    },
    {
        id: "global",
        title: "Red de Difusión",
        icon: <Globe className="h-6 w-6" />,
        color: "#34D399",
        description: "Sincronización masiva con portales externos.",
        pos: { top: "80%", left: "50%" }
    }
];

export default function InteractiveEcosystem() {
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div className="relative w-full overflow-visible py-10 md:py-20 group">
            {/* Scroll hint for mobile */}
            <div className="md:hidden flex items-center justify-center gap-2 mb-6 text-cima-gold/50 animate-pulse">
                <span className="text-[10px] font-black uppercase tracking-widest">Desliza para explorar el ecosistema</span>
                <ArrowRight className="h-3 w-3" />
            </div>

            <div className="relative w-full overflow-x-auto no-scrollbar pb-10 -mx-4 px-4 md:mx-0 md:px-0">
                <div className="relative aspect-square md:aspect-video min-w-[500px] md:min-w-0 max-w-[800px] mx-auto flex items-center justify-center overflow-visible">
                    {/* Background Glows */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cima-gold/5 via-transparent to-transparent opacity-50" />
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
                            className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-cima-gold/10 border border-cima-gold/30 backdrop-blur-3xl flex items-center justify-center relative shadow-[0_0_50px_rgba(234,179,8,0.2)]"
                        >
                            <div className="absolute inset-0 rounded-full animate-ping bg-cima-gold/20 opacity-20" style={{ animationDuration: '3s' }} />
                            <Zap className="h-6 w-6 md:h-10 md:w-10 text-cima-gold" />
                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                                <span className="font-mono text-[8px] md:text-[10px] font-black text-cima-gold tracking-[0.4em] uppercase">Core AI</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Connecting Lines (Simplified) */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <line x1="50" y1="50" x2="50" y2="20" stroke="currentColor" strokeWidth="0.2" className="text-cima-gold" />
                        <line x1="50" y1="50" x2="20" y2="50" stroke="currentColor" strokeWidth="0.2" className="text-cima-gold" />
                        <line x1="50" y1="50" x2="80" y2="50" stroke="currentColor" strokeWidth="0.2" className="text-cima-gold" />
                        <line x1="50" y1="50" x2="50" y2="80" stroke="currentColor" strokeWidth="0.2" className="text-cima-gold" />
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
                            <div className="flex flex-col items-center gap-2 md:gap-4">
                                <div
                                    className="w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-cima-card/50 border border-cima-border backdrop-blur-md flex items-center justify-center transition-all duration-500 md:group-hover:scale-110 group-hover:border-[currentColor] shadow-2xl overflow-hidden relative"
                                    style={{ color: node.color }}
                                >
                                    <div className="absolute inset-0 bg-[currentColor] opacity-0 group-hover:opacity-10 transition-opacity" />
                                    {React.cloneElement(node.icon as React.ReactElement, { className: "h-4 w-4 md:h-6 md:w-6" })}
                                </div>
                                <div className="text-center max-w-[70px] md:max-w-[120px] transition-all duration-500 md:group-hover:translate-y-[-4px]">
                                    <p className="text-[8px] md:text-[11px] font-black text-cima-text uppercase tracking-wider mb-1 leading-tight">{node.title}</p>
                                    <p className="text-[9px] text-cima-text-muted leading-tight opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
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
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] md:w-[80%] md:h-[80%] border border-dashed border-cima-gold/10 rounded-full"
                        />
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[65%] h-[65%] md:w-[60%] md:h-[60%] border border-dashed border-cima-gold/10 rounded-full"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
