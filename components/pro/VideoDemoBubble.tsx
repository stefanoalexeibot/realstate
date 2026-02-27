"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";

export default function VideoDemoBubble() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="fixed bottom-8 right-8 z-[100] group hidden sm:block"
        >
            <div className="relative">
                {/* Rings */}
                <div className="absolute inset-0 rounded-full animate-ping bg-cima-gold/20 opacity-40 scale-125" />
                <div className="absolute inset-0 rounded-full animate-pulse bg-cima-gold/10 opacity-20 scale-150" />

                {/* Bubble Container */}
                <div className="relative w-24 h-24 rounded-full border-2 border-cima-gold/50 bg-cima-card overflow-hidden shadow-2xl transition-all duration-500 group-hover:w-64 group-hover:rounded-2xl group-hover:h-36">
                    {/* Placeholder Video / Visual */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cima-card to-cima-bg flex items-center justify-center">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 border border-dashed border-cima-gold/20 rounded-full opacity-30 m-2 group-hover:opacity-0 transition-opacity"
                        />
                        <div className="flex flex-col items-center gap-1 group-hover:hidden">
                            <Play className="h-6 w-6 text-cima-gold fill-cima-gold/20" />
                            <span className="text-[8px] font-bold text-cima-gold uppercase tracking-tighter">Live Demo</span>
                        </div>

                        <div className="absolute inset-x-0 bottom-0 p-4 transition-all duration-500 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0">
                            <div className="text-left bg-cima-bg/90 p-3 rounded-xl border border-cima-gold/30 backdrop-blur-md shadow-2xl">
                                <p className="text-[10px] font-black text-cima-gold uppercase tracking-widest mb-1">Cima Intelligence</p>
                                <p className="text-[9px] text-cima-text leading-tight mb-2">
                                    Mira cómo nuestra IA califica leads y genera tours premium en 5 segundos.
                                </p>
                                <a
                                    href="https://wa.me/528121980008?text=Hola!%20Quiero%20ver%20la%20demo%20completa%20de%20Cima%20Pro."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block px-3 py-1 rounded-full bg-cima-gold text-cima-bg text-[10px] font-black uppercase hover:scale-105 transition-transform"
                                >
                                    Ver Demo Completa
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Notification Badge */}
                    <div className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full border-2 border-cima-card flex items-center justify-center group-hover:hidden">
                        <span className="text-[8px] font-bold text-white">1</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
