"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShieldCheck,
    Lock,
    Unlock,
    FileText,
    CheckCircle2,
    AlertCircle,
    RotateCw,
    Fingerprint,
    Gauge,
    History,
    ClipboardCheck,
    Search
} from "lucide-react";

const AutoVault = () => {
    const [isLocked, setIsLocked] = useState(true);
    const [isRotating, setIsRotating] = useState(false);
    const [authStatus, setAuthStatus] = useState("ready"); // ready, authenticating, granted
    const [vinStatus, setVinStatus] = useState("pending"); // pending, scanning, verified

    const handleUnlock = () => {
        if (!isLocked) return;

        setIsRotating(true);
        setAuthStatus("authenticating");
        setVinStatus("scanning");

        // Simular secuencia de desbloqueo mecánico
        setTimeout(() => {
            setVinStatus("verified");
        }, 1500);

        setTimeout(() => {
            setIsRotating(false);
            setAuthStatus("granted");
            setTimeout(() => {
                setIsLocked(false);
            }, 500);
        }, 2500);
    };

    const documents = [
        { id: 1, name: "Factura Original (PDF)", type: "Fiscal", status: "Verified", size: "2.4 MB" },
        { id: 2, name: "Historial REPUVE", type: "Legal", status: "Clean", size: "1.1 MB" },
        { id: 3, name: "Bitácora de Servicios", type: "Mantenimiento", status: "Updated", size: "15.8 MB" },
        { id: 4, name: "Certificación Mecánica 360", type: "Técnico", status: "Approved", size: "4.2 MB" },
    ];

    return (
        <section className="relative py-24 sm:py-32 overflow-hidden bg-[#020617]">
            {/* Background Texture (Carbon Fiber Style) */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v20H0V0zm20 20h20v20H20V20z' fill='%233b82f6' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")` }} />

            <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
                <div className="text-center mb-16 sm:mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6"
                    >
                        <ShieldCheck className="w-4 h-4" />
                        <span>EXPEDIENTE DIGITAL CERTIFICADO</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-6xl font-bold text-white mb-6 tracking-tight"
                    >
                        Bóveda de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Transparencia Total</span>
                    </motion.h2>
                    <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto">
                        Historial mecánico y legal blindado. Sin sorpresas, sin vicios ocultos, validado por Cima Auto.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Mechanical Safe Interaction */}
                    <div className="relative flex justify-center items-center py-12">
                        <div className="absolute inset-0 bg-blue-500/5 blur-[120px] rounded-full" />

                        <motion.div
                            className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full border-8 border-gray-800 bg-gradient-to-br from-gray-900 to-black shadow-2xl flex items-center justify-center overflow-hidden"
                            style={{ boxShadow: "inset 0 0 40px rgba(0,0,0,0.8), 0 0 60px rgba(59,130,246,0.1)" }}
                        >
                            {/* Internal Metallic Rings */}
                            <div className="absolute inset-4 rounded-full border-2 border-gray-800/50" />
                            <div className="absolute inset-12 rounded-full border border-gray-800/30" />

                            <AnimatePresence mode="wait">
                                {isLocked ? (
                                    <motion.div
                                        key="lock-interface"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex flex-col items-center gap-6 z-20"
                                    >
                                        {/* The Dial */}
                                        <motion.div
                                            animate={{ rotate: isRotating ? 360 : 0 }}
                                            transition={{ duration: 2.5, ease: "easeInOut" }}
                                            onClick={handleUnlock}
                                            className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border-4 border-gray-700 shadow-xl cursor-pointer group flex items-center justify-center overflow-hidden"
                                        >
                                            {/* Dial Markings */}
                                            {[...Array(12)].map((_, i) => (
                                                <div key={i} className="absolute w-1 h-3 bg-gray-600" style={{ transform: `rotate(${i * 30}deg) translateY(-85px)` }} />
                                            ))}

                                            <div className="absolute inset-8 rounded-full border-2 border-blue-500/20 group-hover:border-blue-500/40 transition-colors" />

                                            <div className="flex flex-col items-center">
                                                <motion.div
                                                    animate={{
                                                        scale: isRotating ? [1, 1.1, 1] : 1,
                                                        color: authStatus === "granted" ? "#10b981" : "#3b82f6"
                                                    }}
                                                    transition={{ repeat: isRotating ? Infinity : 0, duration: 1 }}
                                                >
                                                    {authStatus === "authenticating" ? (
                                                        <RotateCw className="w-16 h-16 animate-spin" />
                                                    ) : authStatus === "granted" ? (
                                                        <Unlock className="w-16 h-16" />
                                                    ) : (
                                                        <Fingerprint className="w-16 h-16 opacity-80 group-hover:opacity-100 transition-opacity" />
                                                    )}
                                                </motion.div>
                                                <span className="text-[10px] font-mono text-blue-400 mt-2 uppercase tracking-[0.2em]">
                                                    {authStatus === "ready" ? "Scan VIN" : authStatus}
                                                </span>
                                            </div>

                                            {/* Metallic Shimmer */}
                                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
                                        </motion.div>

                                        {/* Status Display */}
                                        <div className="flex gap-4">
                                            <div className="px-3 py-1 rounded bg-black/40 border border-gray-800 font-mono text-[10px] text-gray-500">
                                                SYSTEM: <span className={authStatus === "granted" ? "text-green-500" : "text-blue-500"}>{authStatus.toUpperCase()}</span>
                                            </div>
                                            <div className="px-3 py-1 rounded bg-black/40 border border-gray-800 font-mono text-[10px] text-gray-500">
                                                VIN: <span className={vinStatus === "verified" ? "text-green-500" : "text-yellow-500"}>{vinStatus.toUpperCase()}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="unlocked-content"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col items-center gap-4 z-20"
                                    >
                                        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30 mb-2">
                                            <CheckCircle2 className="w-10 h-10 text-green-400" />
                                        </div>
                                        <div className="text-center">
                                            <h3 className="text-white font-bold text-xl">Acceso Total</h3>
                                            <p className="text-green-400 text-sm font-mono mt-1 underline decoration-green-500/30">ID_EXP: CIM-1729-AZ</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Decorative Sliding Panels (Mechanical Look) */}
                            <motion.div
                                animate={{ x: isLocked ? 0 : "-100%" }}
                                className="absolute inset-y-0 left-0 w-1/2 bg-gray-900 border-r border-gray-800 z-10"
                                transition={{ duration: 0.8, ease: "circIn", delay: 0.2 }}
                                style={{ backgroundImage: "linear-gradient(90deg, transparent, rgba(255,255,255,0.02))" }}
                            />
                            <motion.div
                                animate={{ x: isLocked ? 0 : "100%" }}
                                className="absolute inset-y-0 right-0 w-1/2 bg-gray-900 border-l border-gray-800 z-10"
                                transition={{ duration: 0.8, ease: "circIn", delay: 0.2 }}
                                style={{ backgroundImage: "linear-gradient(-90deg, transparent, rgba(255,255,255,0.02))" }}
                            />
                        </motion.div>
                    </div>

                    {/* Documents List */}
                    <div className="flex flex-col gap-6">
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                <History className="w-6 h-6 text-blue-400" />
                                Historial Blindado
                            </h3>
                            <p className="text-gray-400">
                                Cada vehículo en Cima Auto pasa por un escrutinio de 120 puntos legales y mecánicos antes de ser listado.
                            </p>
                        </div>

                        <div className="grid gap-4">
                            {documents.map((doc, index) => (
                                <motion.div
                                    key={doc.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`group relative p-4 rounded-xl border transition-all duration-300 ${isLocked
                                            ? "bg-gray-900/50 border-gray-800 opacity-50 blur-[2px]"
                                            : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-blue-500/30"
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-lg ${isLocked ? "bg-gray-800" : "bg-blue-500/10 text-blue-400"}`}>
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-medium group-hover:text-blue-400 transition-colors">{doc.name}</h4>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-xs text-gray-500 uppercase tracking-wider">{doc.type}</span>
                                                    <span className="text-[10px] text-gray-600">•</span>
                                                    <span className="text-xs text-gray-500">{doc.size}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {isLocked ? (
                                                <Lock className="w-4 h-4 text-gray-600" />
                                            ) : (
                                                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-green-500/10 border border-green-500/20">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                                    <span className="text-[10px] font-bold text-green-500 uppercase">{doc.status}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex items-start gap-4">
                            <ClipboardCheck className="w-6 h-6 text-blue-400 shrink-0" />
                            <div>
                                <p className="text-sm text-gray-300 leading-relaxed">
                                    <span className="text-blue-400 font-bold">Certificación Cima Anti-Fraude:</span> Todos los documentos han sido validados ante las autoridades correspondientes y cotejados físicamente.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modern Grid Background */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{ backgroundImage: "linear-gradient(rgba(59,130,246,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.2) 1px, transparent 1px)", backgroundSize: "100px 100px" }} />
        </section>
    );
};

export default AutoVault;
