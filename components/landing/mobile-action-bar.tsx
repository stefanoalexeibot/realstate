"use client";

import { Phone, Calendar } from "lucide-react";

interface MobileActionBarProps {
    title: string;
    targetId?: string;
}

export default function MobileActionBar({ title, targetId }: MobileActionBarProps) {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden p-4 bg-cima-bg/80 backdrop-blur-xl border-t border-cima-border/50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            <div className="flex gap-3">
                <button
                    onClick={() => {
                        if (targetId) {
                            const el = document.getElementById(targetId);
                            if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                        }
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-cima-gold text-cima-bg text-sm font-bold active:scale-95 transition-transform"
                >
                    <Calendar className="h-4 w-4" />
                    Agendar visita
                </button>
                <a
                    href={`https://wa.me/${process.env.NEXT_PUBLIC_CIMA_WA}?text=Hola, me interesa la propiedad: ${encodeURIComponent(title)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#25D366] text-white text-sm font-bold active:scale-95 transition-transform shadow-lg shadow-[#25D366]/20"
                >
                    <Phone className="h-4 w-4" />
                    WhatsApp
                </a>
            </div>
        </div>
    );
}
