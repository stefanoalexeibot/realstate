"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import * as Icons from "lucide-react";
import { Menu, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BRAND_CONFIG } from "@/lib/config/brand";

export default function TemplateNav() {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const update = () => setScrolled(window.scrollY > 60);
        window.addEventListener("scroll", update, { passive: true });
        return () => window.removeEventListener("scroll", update);
    }, []);

    const LogoIcon = (Icons as any)[BRAND_CONFIG.logo.icon] || Icons.Building2;
    const waHref = `https://wa.me/${BRAND_CONFIG.contact.whatsapp}?text=${encodeURIComponent(BRAND_CONFIG.contact.whatsappMessage.replace("{companyName}", BRAND_CONFIG.companyName))}`;

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-md transition-all duration-300 ${scrolled ? "bg-black/80 h-14" : "bg-transparent h-20"}`}>
            <div className="mx-auto max-w-7xl px-6 h-full flex items-center justify-between">
                <Link href="#" className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-xl bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center">
                        <LogoIcon className="h-5 w-5 text-cima-gold" />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="font-heading font-bold text-white">{BRAND_CONFIG.companyName}</span>
                        <span className="text-[10px] uppercase tracking-widest text-white/40">{BRAND_CONFIG.companyType}</span>
                    </div>
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    {["Vender", "Propiedades", "Calculadora"].map(item => (
                        <Link key={item} href="#" className="text-sm font-medium text-white/60 hover:text-white transition-colors">{item}</Link>
                    ))}
                </nav>

                <a
                    href={waHref}
                    className="bg-cima-gold text-black px-5 py-2 rounded-full text-xs font-bold hover:scale-105 transition-all"
                >
                    Contactar
                </a>
            </div>
        </header>
    );
}
