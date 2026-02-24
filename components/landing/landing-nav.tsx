"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Building2, Phone, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const WA = process.env.NEXT_PUBLIC_CIMA_WA ?? "";

const NAV_LINKS = [
  { href: "#garantia",    label: "Garantía" },
  { href: "#calculadora", label: "Calculadora" },
  { href: "/propiedades", label: "Propiedades" },
];

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  // Close menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const waHref = `https://wa.me/${WA}?text=Hola,%20quiero%20vender%20mi%20casa%20con%20Cima`;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 border-b border-cima-border/50 backdrop-blur-md transition-all duration-300 ${
          scrolled || open
            ? "bg-cima-bg/98 shadow-[0_8px_32px_rgba(0,0,0,0.45)]"
            : "bg-cima-bg/90"
        }`}
      >
        <div
          className={`mx-auto max-w-6xl px-6 flex items-center justify-between transition-all duration-300 ${
            scrolled ? "h-13" : "h-16"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
            <div className="h-8 w-8 rounded-lg bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center">
              <Building2 className={`text-cima-gold transition-all duration-300 ${scrolled ? "h-3.5 w-3.5" : "h-4 w-4"}`} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-heading font-bold text-sm text-cima-text">Cima</span>
              <span className="font-mono text-[9px] tracking-[0.2em] text-cima-text-muted uppercase">Propiedades</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="text-sm text-cima-text-muted hover:text-cima-text transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Desktop WA button */}
          <a
            href={waHref}
            target="_blank"
            rel="noreferrer"
            className="hidden md:flex items-center gap-1.5 rounded-lg bg-cima-gold/10 border border-cima-gold/30 px-3 py-1.5 text-xs font-mono text-cima-gold hover:bg-cima-gold/20 transition-colors"
          >
            <Phone className="h-3 w-3" />
            WhatsApp
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden flex items-center justify-center h-8 w-8 rounded-lg border border-cima-border text-cima-text-muted hover:text-cima-text hover:border-cima-gold/40 transition-colors"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="overflow-hidden border-t border-cima-border/50 md:hidden"
            >
              <nav className="flex flex-col px-6 py-4 gap-1">
                {NAV_LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="py-3 text-sm text-cima-text-muted hover:text-cima-text border-b border-cima-border/40 last:border-0 transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
                <a
                  href={waHref}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setOpen(false)}
                  className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-cima-gold/10 border border-cima-gold/30 px-4 py-2.5 text-sm font-mono text-cima-gold hover:bg-cima-gold/20 transition-colors"
                >
                  <Phone className="h-3.5 w-3.5" />
                  Contactar por WhatsApp
                </a>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
