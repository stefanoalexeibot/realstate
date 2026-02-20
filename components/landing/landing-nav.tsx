"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Building2, Phone } from "lucide-react";

const WA = process.env.NEXT_PUBLIC_CIMA_WA ?? "";

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b border-cima-border/50 backdrop-blur-md transition-all duration-300 ${
        scrolled
          ? "bg-cima-bg/98 shadow-[0_8px_32px_rgba(0,0,0,0.45)]"
          : "bg-cima-bg/90"
      }`}
    >
      <div
        className={`mx-auto max-w-6xl px-6 flex items-center justify-between transition-all duration-300 ${
          scrolled ? "h-13" : "h-16"
        }`}
      >
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center">
            <Building2 className={`text-cima-gold transition-all duration-300 ${scrolled ? "h-3.5 w-3.5" : "h-4 w-4"}`} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-heading font-bold text-sm text-cima-text">Cima</span>
            <span className="font-mono text-[9px] tracking-[0.2em] text-cima-text-muted uppercase">Propiedades</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="#garantia"    className="text-sm text-cima-text-muted hover:text-cima-text transition-colors">Garantía</Link>
          <Link href="#calculadora" className="text-sm text-cima-text-muted hover:text-cima-text transition-colors">Calculadora</Link>
          <Link href="/propiedades" className="text-sm text-cima-text-muted hover:text-cima-text transition-colors">Propiedades</Link>
        </nav>

        <a
          href={`https://wa.me/${WA}?text=Hola,%20quiero%20vender%20mi%20casa%20con%20Cima`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 rounded-lg bg-cima-gold/10 border border-cima-gold/30 px-3 py-1.5 text-xs font-mono text-cima-gold hover:bg-cima-gold/20 transition-colors"
        >
          <Phone className="h-3 w-3" />
          WhatsApp
        </a>
      </div>
    </header>
  );
}
