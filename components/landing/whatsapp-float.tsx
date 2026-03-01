"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppFloat() {
    const phone = process.env.NEXT_PUBLIC_CIMA_WA || "528100000000";
    const message = encodeURIComponent(
        "Hola, me interesa vender mi propiedad con Cima Propiedades."
    );

    return (
        <a
            href={`https://wa.me/${phone}?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contactar por WhatsApp"
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-lg shadow-[#25D366]/25 hover:bg-[#1DA851] hover:shadow-xl hover:shadow-[#25D366]/30 transition-all duration-300 hover:scale-105 group"
        >
            <MessageCircle className="h-5 w-5 fill-white" />
            <span className="text-sm font-semibold hidden sm:inline group-hover:inline transition-all">
                WhatsApp
            </span>
        </a>
    );
}
