"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShieldCheck,
    Lock,
    Unlock,
    FileText,
    ShieldAlert,
    ChevronRight,
    Search
} from "lucide-react";

const DOCUMENTS = [
    { name: "Escritura_Publica_Elite_45.pdf", size: "2.4 MB", type: "PDF", date: "24 Feb 2024" },
    { name: "Acta_Constitutiva_Verified.doc", size: "1.1 MB", type: "DOC", date: "22 Feb 2024" },
    { name: "Contrato_Arrendamiento_Secure.pdf", size: "850 KB", type: "PDF", date: "20 Feb 2024" },
];

export default function LegalVault() {
    const [isLocked, setIsLocked] = useState(true);
    const [rotation, setRotation] = useState(0);
    const [status, setStatus] = useState("SECURE");

    // Handle mechanical animation sequence
    const toggleVault = () => {
        if (!isLocked) {
            setIsLocked(true);
            setRotation(0);
            setStatus("SECURE");
            return;
        }

        // Sequence: Start rotating -> Stop -> Unlock
        setStatus("AUTHORIZING");
        setRotation(360);

        setTimeout(() => {
            setIsLocked(false);
            setStatus("ACCESS GRANTED");
        }, 800);
    };

    return (
        <section className="relative py-24 px-6 overflow-hidden">
            {/* Background Texture/Glow */}
            <div className="absolute inset-0 bg-[#020617] -z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_#3b82f610_0%,_transparent_70%)] pointer-events-none" />

            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Visual Side: The Vault Mechanism */}
                    <div className="relative flex items-center justify-center min-h-[400px] md:min-h-[500px]">
                        {/* Outer Structure */}
                        <div className="absolute inset-0 border border-white/5 bg-slate-900/20 backdrop-blur-2xl rounded-[40px] shadow-2xl" />

                        {/* Mechanical Dial/Safe Interface */}
                        <div className="relative z-10 w-64 h-64 md:w-80 md:h-80 rounded-full border-[12px] border-slate-800 bg-slate-900 shadow-[inset_0_4px_20px_rgba(0,0,0,0.8),_0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden">
                            {/* Inner Gear Layout */}
                            <motion.div
                                animate={{ rotate: rotation }}
                                transition={{ duration: 0.8, ease: "circInOut" }}
                                className="absolute inset-4 border border-blue-500/20 rounded-full border-dashed"
                            />

                            {/* Central Dial */}
                            <motion.div
                                onClick={toggleVault}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative z-20 w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full shadow-2xl cursor-pointer border border-white/10 flex items-center justify-center group"
                            >
                                <div className="absolute inset-2 border-r-4 border-blue-500 rounded-full opacity-40 group-hover:opacity-100 transition-opacity" />
                                <AnimatePresence mode="wait">
                                    {isLocked ? (
                                        <motion.div
                                            key="locked"
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 1.2, opacity: 0 }}
                                        >
                                            <Lock className="w-10 h-10 text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="unlocked"
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 1.2, opacity: 0 }}
                                        >
                                            <Unlock className="w-10 h-10 text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Dial Markers */}
                                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                                    <div
                                        key={deg}
                                        className="absolute w-1 h-3 bg-slate-600"
                                        style={{
                                            transformOrigin: "center 80px", // Adjust based on dial size
                                            transform: `rotate(${deg}deg) translateY(-60px)`
                                        }}
                                    />
                                ))}
                            </motion.div>

                            {/* Status Indicator inside Dial */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                                <span className={`text-[8px] font-black font-mono tracking-[0.2em] uppercase transition-colors duration-500 ${isLocked ? "text-blue-500" : "text-green-400"}`}>
                                    {status}
                                </span>
                            </div>
                        </div>

                        {/* Floating Security Particles */}
                        <div className="absolute inset-0 pointer-events-none">
                            {[1, 2, 3, 4].map((i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        y: [0, -20, 0],
                                        opacity: [0.2, 0.5, 0.2]
                                    }}
                                    transition={{
                                        duration: 4 + i,
                                        repeat: Infinity,
                                        delay: i * 0.5
                                    }}
                                    className="absolute w-1 h-1 bg-blue-500 rounded-full"
                                    style={{
                                        top: `${20 + i * 15}%`,
                                        left: `${10 + i * 20}%`
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Content Side */}
                    <div>
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-blue-500/5 border border-blue-500/20 mb-8">
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                            <span className="font-mono text-[10px] text-blue-400 font-black tracking-[0.2em] uppercase">Ecosistema Ultra-Seguro</span>
                        </div>

                        <h2 className="text-4xl md:text-6xl font-heading font-black text-white mb-8 tracking-tighter leading-tight">
                            Bóveda Digital <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Quantum Resistant</span>
                        </h2>

                        <p className="text-slate-400 text-lg mb-12 leading-relaxed max-w-lg">
                            No solo almacenamos archivos; los blindamos. Cada documento en Cima Legal cuenta con encriptación AES-256 y sellado de tiempo en la red más segura del mundo.
                        </p>

                        <div className="space-y-4">
                            <AnimatePresence>
                                {!isLocked && DOCUMENTS.map((doc, idx) => (
                                    <motion.div
                                        key={doc.name}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 group hover:border-blue-500/30 transition-all cursor-pointer"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center group-hover:bg-blue-600/10 transition-colors">
                                            <FileText className="w-5 h-5 text-slate-500 group-hover:text-blue-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className="text-xs font-bold text-white block truncate uppercase tracking-tight">{doc.name}</span>
                                            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">{doc.size} • {doc.date}</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {isLocked && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="p-12 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center bg-white/[0.01]"
                                >
                                    <ShieldAlert className="w-12 h-12 text-blue-500/20 mb-4" />
                                    <p className="text-slate-500 text-sm font-medium italic">Acceso restringido. Pulse el selector para autorizar visualización.</p>
                                </motion.div>
                            )}
                        </div>

                        <div className="mt-12 flex flex-wrap gap-8">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">Standard</span>
                                <span className="text-white font-bold text-sm">AES-256 GCM</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">Infra</span>
                                <span className="text-white font-bold text-sm">Tier 4 Data Center</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">Auth</span>
                                <span className="text-white font-bold text-sm">MFA Protocol</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
