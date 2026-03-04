"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Home, BedDouble, Bath, Ruler, Camera, Calendar, MapPin,
    ChevronLeft, ChevronRight, CheckCircle2, Phone, Shield, Star,
    Eye, X, Share2, MessageCircle, Lock, Car, TrendingUp,
    Building2, Copy, Play, Users as UsersIcon, ExternalLink,
    ChevronRight as Breadcrumb, Wifi, Waves, Dumbbell, TreePine,
    FileDown, Loader2
} from "lucide-react";
import type { PlanConfig } from "@/lib/config/demo-plans";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/* ──────────────────────────────────────────────────────
   Lightbox Modal (Pro / Team only)
────────────────────────────────────────────────────── */
function LightboxModal({ photos, initial, onClose }: { photos: string[]; initial: number; onClose: () => void }) {
    const [current, setCurrent] = useState(initial);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft") setCurrent((c) => (c - 1 + photos.length) % photos.length);
            if (e.key === "ArrowRight") setCurrent((c) => (c + 1) % photos.length);
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [photos.length, onClose]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-lg flex items-center justify-center"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative max-w-5xl w-full mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                <img
                    src={photos[current]}
                    alt={`Foto ${current + 1}`}
                    className="w-full max-h-[80vh] object-contain rounded-2xl"
                />
                {/* Controls */}
                <button onClick={() => setCurrent((c) => (c - 1 + photos.length) % photos.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/60 rounded-full hover:bg-black/90 transition-all">
                    <ChevronLeft className="h-5 w-5 text-white" />
                </button>
                <button onClick={() => setCurrent((c) => (c + 1) % photos.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/60 rounded-full hover:bg-black/90 transition-all">
                    <ChevronRight className="h-5 w-5 text-white" />
                </button>
                <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/60 rounded-full hover:bg-black/90 transition-all">
                    <X className="h-5 w-5 text-white" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 px-3 py-1 rounded-full text-xs text-white/70 font-bold">
                    {current + 1} / {photos.length}
                </div>
            </motion.div>
        </motion.div>
    );
}

/* ──────────────────────────────────────────────────────
   Virtual Tour Modal (Pro / Team)
────────────────────────────────────────────────────── */
function VirtualTourModal({ onClose }: { onClose: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-lg flex items-center justify-center p-6"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#111] border border-white/10 rounded-3xl p-8 max-w-lg w-full text-center"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="h-16 w-16 rounded-2xl bg-cima-gold/10 border border-cima-gold/20 flex items-center justify-center mx-auto mb-5">
                    <Eye className="h-8 w-8 text-cima-gold" />
                </div>
                <h3 className="text-lg font-heading font-black text-white mb-2">Tour Virtual 360°</h3>
                <p className="text-sm text-white/40 mb-6 leading-relaxed">
                    Explora la propiedad desde cualquier dispositivo con nuestro tour virtual inmersivo en 360 grados.
                </p>
                <div className="aspect-video bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden">
                    <img src="/estancia-despues.png" alt="Tour" className="w-full h-full object-cover opacity-30" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-16 w-16 rounded-full bg-cima-gold flex items-center justify-center shadow-2xl shadow-cima-gold/30">
                            <Play className="h-8 w-8 text-black ml-1" />
                        </div>
                    </div>
                    <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg">
                        <span className="text-[8px] font-black text-white/60 uppercase tracking-wider">Demo Preview</span>
                    </div>
                </div>
                <button onClick={onClose}
                    className="w-full bg-white/5 border border-white/10 text-white/60 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all">
                    Cerrar
                </button>
            </motion.div>
        </motion.div>
    );
}

/* ──────────────────────────────────────────────────────
   Video Tour Modal (Team only)
────────────────────────────────────────────────────── */
function VideoTourModal({ onClose }: { onClose: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-lg flex items-center justify-center p-6"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#111] border border-white/10 rounded-3xl p-8 max-w-2xl w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-heading font-black text-white">Video Tour Profesional</h3>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                        <X className="h-4 w-4 text-white/40" />
                    </button>
                </div>
                <div className="aspect-video bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center relative overflow-hidden">
                    <img src="/cocina-despues.png" alt="Video" className="w-full h-full object-cover opacity-25" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                        <div className="h-20 w-20 rounded-full bg-cima-gold flex items-center justify-center shadow-2xl shadow-cima-gold/30 cursor-pointer hover:scale-110 transition-all">
                            <Play className="h-10 w-10 text-black ml-1.5" />
                        </div>
                        <p className="text-xs text-white/40 font-bold uppercase tracking-wider">Video Tour · 3:24 min</p>
                    </div>
                </div>
                <p className="text-xs text-white/30 text-center mt-4 font-bold uppercase tracking-widest">
                    Producción cinematográfica incluida en Plan Team
                </p>
            </motion.div>
        </motion.div>
    );
}

/* ──────────────────────────────────────────────────────
   Share Modal (Team only)
────────────────────────────────────────────────────── */
function ShareModal({ onClose }: { onClose: () => void }) {
    const [copied, setCopied] = useState(false);
    const url = "https://cimapropiedades.mx/prop/residencia-colinas-12345";

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-lg flex items-center justify-center p-6"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-[#111] border border-white/10 rounded-3xl p-8 max-w-sm w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-base font-heading font-black text-white">Compartir Propiedad</h3>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                        <X className="h-4 w-4 text-white/40" />
                    </button>
                </div>
                <div className="space-y-3">
                    {[
                        { icon: MessageCircle, label: "Compartir por WhatsApp", color: "bg-green-500/10 border-green-500/20 text-green-400" },
                        { icon: ExternalLink, label: "Abrir en nueva pestaña", color: "bg-blue-500/10 border-blue-500/20 text-blue-400" },
                    ].map((item, i) => (
                        <button key={i} className={`w-full flex items-center gap-3 ${item.color} border rounded-xl p-3.5 text-sm font-bold hover:opacity-80 transition-all`}>
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </button>
                    ))}
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-3">
                        <span className="flex-1 text-[9px] text-white/30 font-mono truncate">{url}</span>
                        <button
                            onClick={handleCopy}
                            className="shrink-0 flex items-center gap-1.5 bg-cima-gold/10 border border-cima-gold/20 text-cima-gold px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider hover:bg-cima-gold/20 transition-all"
                        >
                            <Copy className="h-3 w-3" />
                            {copied ? "¡Copiado!" : "Copiar"}
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

/* ──────────────────────────────────────────────────────
   MAIN COMPONENT
────────────────────────────────────────────────────── */
export default function DemoPropertyPage({
    plan,
    onSendMessage,
    customization,
}: {
    plan: PlanConfig;
    onSendMessage?: (from: string, text: string, isAi?: boolean) => void;
    customization?: { clientName: string; propertyName: string; propertyPrice: string };
}) {
    const isTeam = plan.tier === "premium";
    const isPro = plan.tier === "profesional";
    const isStarter = plan.tier === "basico";
    const propName = customization?.propertyName || "Residencia Premium";
    const propPrice = customization?.propertyPrice || "8,500,000";

    // Accent tokens
    const accentBg = isTeam ? "bg-cima-gold" : isPro ? "bg-indigo-500" : "bg-white";
    const accentText = isTeam ? "text-cima-gold" : isPro ? "text-indigo-400" : "text-white";
    const accentBorder = isTeam ? "border-cima-gold/20" : isPro ? "border-indigo-500/20" : "border-white/15";
    const accentMuted = isTeam ? "bg-cima-gold/[0.04]" : isPro ? "bg-indigo-500/[0.04]" : "bg-white/[0.03]";
    const accentCtaBg = (isTeam || isPro) ? "text-black" : "text-black";

    // State
    const [activePhoto, setActivePhoto] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [showVirtualTour, setShowVirtualTour] = useState(false);
    const [showVideoTour, setShowVideoTour] = useState(false);
    const [showShare, setShowShare] = useState(false);
    const [generatingFicha, setGeneratingFicha] = useState(false);
    const fichaRef = useRef<HTMLDivElement>(null);

    const generateFichaPDF = async () => {
        setGeneratingFicha(true);
        try {
            const canvas = await html2canvas(fichaRef.current!, { scale: 2, useCORS: true, allowTaint: true });
            const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
            pdf.addImage(canvas.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, 210, 297);
            pdf.save(`ficha-tecnica-${propName.replace(/\s+/g, "-")}-demo.pdf`);
        } finally {
            setGeneratingFicha(false);
        }
    };

    const photos = [
        "/cocina-despues.png",
        "/estancia-despues.png",
        "/recamara-despues.png",
        "/cocina-despues.png",
        "/estancia-despues.png",
        "/recamara-despues.png",
    ];

    const openLightbox = (index: number) => {
        if (!isPro && !isTeam) return; // Pro+ only
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    // Animation helpers
    const viewAnim = (isPro || isTeam)
        ? { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } as any, transition: { duration: 0.5 } }
        : {};

    const Wrapper = (isPro || isTeam) ? motion.div : "div";

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-white relative">

            {/* Aurora (Pro/Team) */}
            {(isPro || isTeam) && (
                <>
                    <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-cima-gold/[0.03] rounded-full blur-[120px] pointer-events-none" />
                    <div className="fixed bottom-1/4 right-0 w-[400px] h-[400px] bg-blue-500/[0.02] rounded-full blur-[100px] pointer-events-none" />
                </>
            )}

            {/* ══════════════════════════════════════
                HERO — full-screen image with overlay
            ══════════════════════════════════════ */}
            <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
                <img
                    src="/estancia-despues.png"
                    alt="Residencia Premium"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/40 to-transparent" />

                {/* Pro+: Breadcrumb */}
                {(isPro || isTeam) && (
                    <div className="absolute top-6 left-6 flex items-center gap-1.5 text-[9px] font-bold text-white/40 uppercase tracking-wider">
                        <span className="hover:text-white/70 cursor-pointer transition-colors">Propiedades</span>
                        <Breadcrumb className="h-3 w-3" />
                        <span className="hover:text-white/70 cursor-pointer transition-colors">San Pedro</span>
                        <Breadcrumb className="h-3 w-3" />
                        <span className="text-white/70">Colinas de San Jerónimo</span>
                    </div>
                )}

                {/* Disponible badge */}
                <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500/30 backdrop-blur-sm">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] font-black text-green-400 uppercase tracking-widest">Disponible</span>
                </div>

                {/* Team: View count */}
                {isTeam && (
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 border border-white/10 backdrop-blur-sm">
                        <Eye className="h-3 w-3 text-white/40" />
                        <span className="text-[9px] font-bold text-white/50">142 personas lo han visto esta semana</span>
                    </div>
                )}

                {/* Hero content at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="text-3xl md:text-5xl font-heading font-black tracking-tight leading-none text-white mb-2">
                            {propName}
                        </h1>
                        <div className="flex items-center gap-2 text-white/50 mb-4">
                            <MapPin className="h-4 w-4" />
                            <span className="text-sm">Colinas de San Jerónimo · San Pedro Garza García, NL</span>
                        </div>
                        {/* Info bar */}
                        <div className="flex flex-wrap items-center gap-3 md:gap-6">
                            <span className={`text-3xl font-heading font-black ${accentText}`}>${propPrice} <span className="text-base text-white/40 font-medium">MXN</span></span>
                            <div className="h-5 w-px bg-white/15 hidden sm:block" />
                            {[
                                { icon: BedDouble, value: "4 recámaras" },
                                { icon: Bath, value: "3.5 baños" },
                                { icon: Ruler, value: "320 m²" },
                                { icon: Car, value: "2 cajones" },
                            ].map((stat, i) => (
                                <div key={i} className="flex items-center gap-1.5 text-white/60">
                                    <stat.icon className="h-4 w-4 text-white/30" />
                                    <span className="text-sm font-medium">{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════
                MAIN CONTENT
            ══════════════════════════════════════ */}
            <div className="max-w-6xl mx-auto px-6 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* ── LEFT: Main content ── */}
                    <div className="lg:col-span-2 space-y-10">

                        {/* GALLERY */}
                        <Wrapper {...viewAnim}>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-heading font-bold">Galería de Fotos</h2>
                                {(isPro || isTeam) && (
                                    <button
                                        onClick={() => setShowVirtualTour(true)}
                                        className={`flex items-center gap-2 ${accentMuted} border ${accentBorder} ${accentText} px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider hover:border-white/20 transition-all`}
                                    >
                                        <Eye className="h-3 w-3" />
                                        Tour Virtual 360°
                                    </button>
                                )}
                                {isTeam && (
                                    <button
                                        onClick={() => setShowVideoTour(true)}
                                        className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider hover:bg-red-500/20 transition-all ml-2"
                                    >
                                        <Play className="h-3 w-3" />
                                        Video Tour
                                    </button>
                                )}
                            </div>

                            {isStarter ? (
                                /* Starter: 2x2 static grid with locked "See all" */
                                <div className="space-y-2">
                                    <div className="grid grid-cols-2 gap-2">
                                        {photos.slice(0, 4).map((img, i) => (
                                            <div key={i} className="rounded-xl overflow-hidden border border-white/5 aspect-[4/3] relative group cursor-default">
                                                <img src={img} alt={`Foto ${i + 1}`} className="w-full h-full object-cover opacity-80" />
                                                {i === 3 && (
                                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                        <div className="text-center">
                                                            <Lock className="h-5 w-5 text-white/40 mx-auto mb-1" />
                                                            <span className="text-[9px] font-black text-white/50 uppercase tracking-wider">+20 fotos</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <button disabled className="w-full flex items-center justify-center gap-2 bg-white/[0.03] border border-white/5 text-white/25 py-3 rounded-xl text-xs font-bold uppercase tracking-wider cursor-not-allowed">
                                        <Lock className="h-3.5 w-3.5" />
                                        Ver todas las fotos (24)
                                    </button>
                                </div>
                            ) : isTeam ? (
                                /* Team: Masonry-style premium gallery */
                                <div className="space-y-2">
                                    <div className="grid grid-cols-12 grid-rows-2 gap-2 h-[400px]">
                                        <div
                                            className="col-span-7 row-span-2 rounded-2xl overflow-hidden border border-cima-gold/10 cursor-pointer group relative"
                                            onClick={() => openLightbox(0)}
                                        >
                                            <img src={photos[0]} alt="Main" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                                                <Eye className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-all" />
                                            </div>
                                        </div>
                                        {photos.slice(1, 5).map((img, i) => (
                                            <div
                                                key={i}
                                                className="col-span-5 rounded-xl overflow-hidden border border-cima-gold/10 cursor-pointer group relative"
                                                onClick={() => openLightbox(i + 1)}
                                            >
                                                <img src={img} alt={`Foto ${i + 2}`} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                                                {i === 3 && (
                                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                        <span className="text-xs font-black text-white">+{photos.length - 4} más</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => openLightbox(0)}
                                        className="w-full flex items-center justify-center gap-2 bg-cima-gold/5 border border-cima-gold/15 text-cima-gold py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-cima-gold/10 transition-all"
                                    >
                                        <Camera className="h-3.5 w-3.5" />
                                        Ver todas las fotos · Galería completa
                                    </button>
                                </div>
                            ) : (
                                /* Pro: Interactive gallery with lightbox */
                                <div className="space-y-2">
                                    <div className="relative rounded-2xl overflow-hidden border border-indigo-500/10 aspect-[16/9] cursor-pointer" onClick={() => openLightbox(activePhoto)}>
                                        <AnimatePresence mode="wait">
                                            <motion.img
                                                key={activePhoto}
                                                src={photos[activePhoto]}
                                                alt={`Foto ${activePhoto + 1}`}
                                                className="w-full h-full object-cover"
                                                initial={{ opacity: 0, scale: 1.05 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        </AnimatePresence>
                                        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all flex items-center justify-center">
                                            <Eye className="h-10 w-10 text-white opacity-0 hover:opacity-100 transition-all" />
                                        </div>
                                        <button onClick={(e) => { e.stopPropagation(); setActivePhoto((p) => (p - 1 + photos.length) % photos.length); }}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full backdrop-blur-sm hover:bg-black/80 transition-all">
                                            <ChevronLeft className="h-4 w-4 text-white" />
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); setActivePhoto((p) => (p + 1) % photos.length); }}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full backdrop-blur-sm hover:bg-black/80 transition-all">
                                            <ChevronRight className="h-4 w-4 text-white" />
                                        </button>
                                        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                                            <span className="text-[9px] font-bold text-white/70">{activePhoto + 1} / {photos.length}</span>
                                        </div>
                                    </div>
                                    {/* Thumbnail strip */}
                                    <div className="grid grid-cols-6 gap-1.5">
                                        {photos.map((img, i) => (
                                            <button key={i} onClick={() => setActivePhoto(i)}
                                                className={`rounded-lg overflow-hidden border-2 transition-all aspect-square ${i === activePhoto ? "border-indigo-500 shadow-lg shadow-indigo-500/20" : "border-transparent opacity-50 hover:opacity-90"}`}>
                                                <img src={img} alt="" className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Wrapper>

                        {/* DESCRIPTION */}
                        <Wrapper {...viewAnim}>
                            <h2 className="text-lg font-heading font-bold mb-4">Descripción</h2>
                            <p className="text-sm text-white/55 leading-relaxed">
                                Exclusiva residencia de lujo ubicada en una de las zonas más privilegiadas de San Pedro Garza García. Con una superficie de construcción de 320m² distribuidos en dos plantas, esta propiedad combina diseño contemporáneo con materiales de la más alta calidad.
                            </p>
                            {!isStarter && (
                                <p className="text-sm text-white/55 leading-relaxed mt-3">
                                    La planta baja cuenta con una amplia sala-comedor, cocina gourmet totalmente equipada con isla central, área de tv, cuarto de servicio y jardín privado con alberca. La planta alta alberga 4 recámaras, siendo la principal un lujoso suite master con vestidor y baño en mármol travertino.
                                </p>
                            )}
                        </Wrapper>

                        {/* SPECS TABLE */}
                        <Wrapper {...viewAnim}>
                            <h2 className="text-lg font-heading font-bold mb-4">Especificaciones</h2>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { label: "Recámaras", value: "4" },
                                    { label: "Baños completos", value: "3" },
                                    { label: "Medios baños", value: "1" },
                                    { label: "Superficie Const.", value: "320 m²" },
                                    { label: "Superficie Terreno", value: "500 m²" },
                                    { label: "Estacionamientos", value: "2 techados" },
                                    { label: "Antigüedad", value: "3 años" },
                                    { label: "Niveles", value: "2 plantas" },
                                ].map((spec, i) => (
                                    <div key={i} className={`flex items-center justify-between px-4 py-3 rounded-xl ${accentMuted} border ${accentBorder}`}>
                                        <span className="text-xs text-white/40 font-medium">{spec.label}</span>
                                        <span className="text-xs font-bold text-white">{spec.value}</span>
                                    </div>
                                ))}
                            </div>
                        </Wrapper>

                        {/* AMENITIES */}
                        <Wrapper {...viewAnim}>
                            <h2 className="text-lg font-heading font-bold mb-4">Amenidades</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {[
                                    { icon: Waves, label: "Alberca privada" },
                                    { icon: Car, label: "Garage techado" },
                                    { icon: TreePine, label: "Jardín privado" },
                                    { icon: Shield, label: "Seguridad 24/7" },
                                    { icon: Wifi, label: "Fibra óptica" },
                                    { icon: Dumbbell, label: "Gimnasio" },
                                    { icon: Building2, label: "Cuarto de servicio" },
                                    { icon: Eye, label: "CCTV integrado" },
                                    { icon: Home, label: "Cocina integral" },
                                ].map((amenity, i) => (
                                    <div key={i} className="flex items-center gap-2.5">
                                        <div className={`h-6 w-6 rounded-lg ${accentMuted} border ${accentBorder} flex items-center justify-center shrink-0`}>
                                            <amenity.icon className={`h-3 w-3 ${accentText}`} />
                                        </div>
                                        <span className="text-xs text-white/60 font-medium">{amenity.label}</span>
                                    </div>
                                ))}
                            </div>
                        </Wrapper>

                        {/* PRO+: NEIGHBORHOOD */}
                        {(isPro || isTeam) && (
                            <Wrapper {...viewAnim}>
                                <h2 className="text-lg font-heading font-bold mb-2">Sobre la Zona</h2>
                                <p className="text-xs text-white/35 mb-5">San Pedro Garza García · Colinas de San Jerónimo</p>
                                <div className="flex flex-wrap gap-2.5">
                                    {[
                                        { label: "Escuelas Privadas", distance: "5 min", icon: "🏫" },
                                        { label: "Supermercado", distance: "3 min", icon: "🛒" },
                                        { label: "Hospital Ángeles", distance: "10 min", icon: "🏥" },
                                        { label: "Centro Comercial", distance: "7 min", icon: "🏬" },
                                        { label: "Autopista MTY", distance: "8 min", icon: "🚗" },
                                        { label: "Parque La Encomienda", distance: "2 min", icon: "🌳" },
                                    ].map((item, i) => (
                                        <div key={i} className={`flex items-center gap-2 px-3.5 py-2 rounded-xl ${accentMuted} border ${accentBorder}`}>
                                            <span>{item.icon}</span>
                                            <div>
                                                <p className="text-xs font-bold text-white">{item.label}</p>
                                                <p className="text-[8px] text-white/30">{item.distance}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Wrapper>
                        )}

                        {/* TEAM: MARKET ANALYSIS */}
                        {isTeam && (
                            <Wrapper {...viewAnim}>
                                <h2 className="text-lg font-heading font-bold mb-4">Análisis de Mercado</h2>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { icon: TrendingUp, label: "Tiempo de Venta", value: "28 días", sublabel: "Promedio zona", color: "text-green-400", bg: "bg-green-500/5 border-green-500/15" },
                                        { icon: Building2, label: "Precio/m² Zona", value: "$26,562", sublabel: "MXN · Hoy", color: "text-cima-gold", bg: "bg-cima-gold/5 border-cima-gold/15" },
                                        { icon: Eye, label: "Vistas", value: "142", sublabel: "Últimos 7 días", color: "text-blue-400", bg: "bg-blue-500/5 border-blue-500/15" },
                                    ].map((item, i) => (
                                        <div key={i} className={`${item.bg} border rounded-xl p-4`}>
                                            <item.icon className={`h-5 w-5 ${item.color} mb-2`} />
                                            <p className="text-[7px] text-white/30 uppercase font-black tracking-wider">{item.label}</p>
                                            <p className={`text-xl font-heading font-black ${item.color}`}>{item.value}</p>
                                            <p className="text-[8px] text-white/30 mt-0.5">{item.sublabel}</p>
                                        </div>
                                    ))}
                                </div>
                            </Wrapper>
                        )}

                        {/* TEAM: SIMILAR PROPERTIES */}
                        {isTeam && (
                            <Wrapper {...viewAnim}>
                                <h2 className="text-lg font-heading font-bold mb-4">Propiedades Similares</h2>
                                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                    {[
                                        { img: "/cocina-despues.png", name: "Residencia Contry Sol", price: "$7,800,000", beds: 3, baths: 3, area: "280 m²", days: "Vendida hace 3 días" },
                                        { img: "/estancia-despues.png", name: "Casa Valle Poniente", price: "$9,200,000", beds: 4, baths: 4, area: "350 m²", days: "Disponible" },
                                        { img: "/recamara-despues.png", name: "Pent. Santa María", price: "$8,100,000", beds: 3, baths: 3.5, area: "310 m²", days: "Disponible" },
                                    ].map((prop, i) => (
                                        <div key={i} className="min-w-[220px] bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden hover:border-cima-gold/20 transition-all cursor-pointer group">
                                            <div className="aspect-[4/3] overflow-hidden">
                                                <img src={prop.img} alt={prop.name} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                                            </div>
                                            <div className="p-4">
                                                <p className="text-xs font-bold text-white mb-0.5 truncate">{prop.name}</p>
                                                <p className="text-sm font-black text-cima-gold mb-2">{prop.price}</p>
                                                <div className="flex items-center gap-3 text-[9px] text-white/40">
                                                    <span>{prop.beds} rec</span>
                                                    <span>{prop.baths} baños</span>
                                                    <span>{prop.area}</span>
                                                </div>
                                                <div className={`mt-2 text-[8px] font-bold uppercase tracking-wider ${prop.days.includes("Vendida") ? "text-white/30" : "text-green-400"}`}>
                                                    {prop.days}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Wrapper>
                        )}
                    </div>

                    {/* ── RIGHT: Sidebar ── */}
                    <div className="space-y-4">

                        {/* Price card + CTA */}
                        <Wrapper {...viewAnim}>
                            <div className={`${accentMuted} border ${accentBorder} rounded-2xl p-6 sticky top-24`}>
                                {/* Team: Cima badge */}
                                {isTeam && (
                                    <div className="flex items-center gap-2 mb-4 pb-4 border-b border-cima-gold/10">
                                        <div className="h-6 w-6 rounded-lg bg-cima-gold/10 border border-cima-gold/20 flex items-center justify-center">
                                            <Shield className="h-3 w-3 text-cima-gold" />
                                        </div>
                                        <span className="text-[8px] font-black text-cima-gold uppercase tracking-widest">Certificado Cima Pro</span>
                                    </div>
                                )}
                                <p className={`text-2xl font-heading font-black ${accentText} mb-1`}>${propPrice}</p>
                                <p className="text-xs text-white/30 mb-5">MXN · Precio de venta</p>

                                {/* Agent card */}
                                <div className={`flex items-center gap-3 mb-5 pb-5 border-b ${accentBorder}`}>
                                    <div className={`h-12 w-12 rounded-xl ${accentMuted} border ${accentBorder} flex items-center justify-center shrink-0`}>
                                        <UsersIcon className={`h-6 w-6 ${accentText} opacity-60`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-white truncate">Lic. María Fernández</p>
                                        <p className="text-[9px] text-white/35">Asesora Certificada AMPI</p>
                                        {(isPro || isTeam) && (
                                            <div className="flex items-center gap-0.5 mt-0.5">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star key={s} className={`h-2.5 w-2.5 ${accentText} fill-current`} />
                                                ))}
                                                <span className="text-[8px] text-white/30 ml-1">4.9</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* CTAs */}
                                <div className="space-y-2.5">
                                    <button className={`w-full flex items-center justify-center gap-2 ${accentBg} ${accentCtaBg} py-3.5 rounded-xl text-xs font-black uppercase tracking-wider hover:brightness-110 transition-all active:scale-[0.98]`}>
                                        <Calendar className="h-4 w-4" />
                                        Agendar Visita
                                    </button>
                                    <button className="w-full flex items-center justify-center gap-2 bg-green-500/10 border border-green-500/25 text-green-400 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-green-500/20 transition-all">
                                        <MessageCircle className="h-4 w-4" />
                                        WhatsApp
                                    </button>
                                    <button className="w-full flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white/50 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all">
                                        <Phone className="h-3.5 w-3.5" />
                                        Llamar
                                    </button>
                                    {(isPro || isTeam) && (
                                        <button
                                            onClick={generateFichaPDF}
                                            disabled={generatingFicha}
                                            className="w-full flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white/50 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {generatingFicha ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
                                            {generatingFicha ? "Generando..." : "Ficha Técnica PDF"}
                                        </button>
                                    )}
                                </div>

                                {/* Team: Share button */}
                                {isTeam && (
                                    <button
                                        onClick={() => setShowShare(true)}
                                        className="w-full mt-3 flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white/40 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all"
                                    >
                                        <Share2 className="h-3.5 w-3.5" />
                                        Compartir Propiedad
                                    </button>
                                )}

                                {/* Trust badges */}
                                <div className="flex items-center justify-center gap-4 mt-5 pt-4 border-t border-white/5">
                                    {[
                                        { icon: CheckCircle2, text: "Sin compromiso" },
                                        { icon: Shield, text: "Datos seguros" },
                                    ].map((badge, i) => (
                                        <div key={i} className="flex items-center gap-1">
                                            <badge.icon className="h-3 w-3 text-green-400" />
                                            <span className="text-[7px] text-white/25 uppercase font-bold tracking-wider">{badge.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Wrapper>
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════
                PRO+: Sticky floating bottom CTA
            ══════════════════════════════════════ */}
            {(isPro || isTeam) && (
                <div className="fixed bottom-0 inset-x-0 z-50 bg-gradient-to-t from-black via-black/90 to-transparent pt-8 pb-6 px-4 pointer-events-none">
                    <div className="max-w-lg mx-auto flex gap-3 pointer-events-auto">
                        <button className={`flex-1 flex items-center justify-center gap-2 ${accentBg} ${accentCtaBg} py-4 rounded-xl text-xs font-black uppercase tracking-wider hover:brightness-110 transition-all shadow-2xl active:scale-[0.98]`}>
                            <Calendar className="h-4 w-4" />
                            Agenda tu Visita — ${propPrice}
                        </button>
                        <button className="flex items-center gap-2 bg-green-500/10 border border-green-500/25 text-green-400 px-5 py-4 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-green-500/20 transition-all shadow-lg">
                            <MessageCircle className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════
                FOOTER
            ══════════════════════════════════════ */}
            <div className={`bg-black border-t border-white/5 py-10 mt-20 flex flex-col items-center justify-center gap-3`}>
                <div className="flex items-center gap-2.5">
                    <div className={`h-6 w-6 rounded-lg ${accentMuted} border ${accentBorder} flex items-center justify-center`}>
                        <Home className={`h-3 w-3 ${accentText}`} />
                    </div>
                    <p className="text-[10px] text-white/25 font-bold uppercase tracking-[0.2em]">
                        Cima Propiedades · {new Date().getFullYear()}
                    </p>
                </div>
                <div className={`h-0.5 w-12 ${accentBg} opacity-20 rounded-full`} />
                {isTeam && <p className="text-[7px] text-white/15 font-bold uppercase tracking-widest">Powered by Cima Pro Technology</p>}
            </div>

            {/* ══════════════════════════════════════
                FICHA TÉCNICA — Hidden PDF Template
            ══════════════════════════════════════ */}
            <div
                ref={fichaRef}
                style={{ position: "fixed", left: "-9999px", top: 0, width: "794px", background: "#0A0A0B", color: "white", fontFamily: "sans-serif" }}
            >
                {/* Header */}
                <div style={{ background: "#0A0A0B", borderBottom: "2px solid #C8A96E", padding: "32px 40px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <div style={{ color: "#C8A96E", fontSize: "22px", fontWeight: 900, letterSpacing: "4px", textTransform: "uppercase" }}>CIMA PRO</div>
                        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginTop: "4px" }}>Ficha Técnica de Propiedad</div>
                    </div>
                    <div style={{ textAlign: "right", color: "rgba(255,255,255,0.3)", fontSize: "10px" }}>
                        <div style={{ fontWeight: 700 }}>{new Date().toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })}</div>
                        <div style={{ color: "#C8A96E", marginTop: "4px", fontSize: "9px", letterSpacing: "1px" }}>propiedadesmty.com</div>
                    </div>
                </div>

                {/* Name & Price */}
                <div style={{ padding: "28px 40px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    <div style={{ fontSize: "26px", fontWeight: 900, color: "white", marginBottom: "8px" }}>{propName}</div>
                    <div style={{ fontSize: "28px", fontWeight: 900, color: "#C8A96E" }}>${propPrice} MXN</div>
                    <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", marginTop: "4px" }}>San Pedro Garza García · Nuevo León</div>
                </div>

                {/* Specs grid */}
                <div style={{ padding: "20px 40px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    {[
                        { label: "Recámaras", value: "4" },
                        { label: "Baños", value: "3.5" },
                        { label: "Construcción", value: "320 m²" },
                        { label: "Estacionamientos", value: "2" },
                    ].map((spec) => (
                        <div key={spec.label} style={{ background: "rgba(200,169,110,0.06)", border: "1px solid rgba(200,169,110,0.2)", borderRadius: "12px", padding: "16px", textAlign: "center" }}>
                            <div style={{ fontSize: "22px", fontWeight: 900, color: "#C8A96E" }}>{spec.value}</div>
                            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", marginTop: "4px", textTransform: "uppercase", letterSpacing: "1px" }}>{spec.label}</div>
                        </div>
                    ))}
                </div>

                {/* Description */}
                <div style={{ padding: "20px 40px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "10px" }}>Descripción</div>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", lineHeight: "1.7" }}>
                        Impresionante residencia en zona premium de Monterrey. Amplios espacios iluminados, acabados de lujo y diseño arquitectónico contemporáneo. Jardín privado, terraza panorámica y domótica integrada. La propiedad ideal para quienes buscan exclusividad y confort en una ubicación privilegiada.
                    </p>
                </div>

                {/* Amenidades */}
                <div style={{ padding: "20px 40px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "12px" }}>Amenidades</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                        {["Alberca", "Jardín privado", "Gimnasio", "Roof Garden", "Seguridad 24h", "Cuarto de servicio", "Vista panorámica", "Elevador", "Bodega", "Estudio", "Cocina integral", "Smart Home"].map((a) => (
                            <div key={a} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
                                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#C8A96E", flexShrink: 0, display: "inline-block" }} />
                                {a}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Photo */}
                <div style={{ padding: "20px 40px 16px" }}>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "12px" }}>Fotografía Principal</div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photos[0]} alt="Propiedad" crossOrigin="anonymous" style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "12px" }} />
                </div>

                {/* Gold separator */}
                <div style={{ height: "2px", background: "linear-gradient(90deg, #C8A96E, transparent)", margin: "0 40px 16px" }} />

                {/* Footer */}
                <div style={{ padding: "12px 40px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>
                        <span style={{ color: "#C8A96E", fontWeight: 700 }}>Lic. María Fernández</span> · Asesora Certificada AMPI
                    </div>
                    <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)" }}>Generado por Cima Pro · propiedadesmty.com</div>
                </div>
            </div>

            {/* ══════════════════════════════════════
                MODALS
            ══════════════════════════════════════ */}
            <AnimatePresence>
                {lightboxOpen && (
                    <LightboxModal
                        photos={photos}
                        initial={lightboxIndex}
                        onClose={() => setLightboxOpen(false)}
                    />
                )}
            </AnimatePresence>
            <AnimatePresence>
                {showVirtualTour && <VirtualTourModal onClose={() => setShowVirtualTour(false)} />}
            </AnimatePresence>
            <AnimatePresence>
                {showVideoTour && <VideoTourModal onClose={() => setShowVideoTour(false)} />}
            </AnimatePresence>
            <AnimatePresence>
                {showShare && <ShareModal onClose={() => setShowShare(false)} />}
            </AnimatePresence>
        </div>
    );
}
