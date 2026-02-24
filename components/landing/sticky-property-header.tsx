"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Calendar, Building2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface StickyPropertyHeaderProps {
    title: string;
    price: number;
    isRenta: boolean;
    targetId?: string;
}

export default function StickyPropertyHeader({ title, price, isRenta, targetId }: StickyPropertyHeaderProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling 500px
            setVisible(window.scrollY > 500);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    exit={{ y: -100 }}
                    className="fixed top-0 left-0 right-0 z-40 bg-cima-bg/80 backdrop-blur-xl border-b border-cima-border/50 py-3 shadow-2xl hidden lg:block"
                >
                    <div className="mx-auto max-w-6xl px-6 flex items-center justify-between">
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="h-10 w-10 rounded-lg bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center shrink-0">
                                <Building2 className="h-5 w-5 text-cima-gold" />
                            </div>
                            <div className="min-w-0">
                                <h2 className="font-heading font-bold text-cima-text truncate text-sm">{title}</h2>
                                <p className="text-cima-gold font-mono text-xs font-bold">
                                    {formatPrice(price)}{isRenta ? "/mes" : ""}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => {
                                    if (targetId) {
                                        const el = document.getElementById(targetId);
                                        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                                    }
                                }}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cima-gold text-cima-bg text-xs font-bold hover:bg-cima-gold-light transition-colors"
                            >
                                <Calendar className="h-4 w-4" />
                                Agendar visita
                            </button>
                            <a
                                href={`https://wa.me/${process.env.NEXT_PUBLIC_CIMA_WA}?text=Hola, me interesa la propiedad: ${encodeURIComponent(title)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#25D366]/10 border border-[#25D366]/30 text-xs font-bold text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
                            >
                                <Phone className="h-4 w-4" />
                                WhatsApp
                            </a>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
