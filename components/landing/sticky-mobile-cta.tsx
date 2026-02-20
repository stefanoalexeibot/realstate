"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const WA = process.env.NEXT_PUBLIC_CIMA_WA ?? "";

export default function StickyMobileCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > 420);
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-cima-border/60 bg-cima-bg/97 backdrop-blur-md px-4 py-3 flex gap-3"
          style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
        >
          <a
            href="#vender"
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-cima-gold px-4 py-2.5 font-heading font-bold text-sm text-cima-bg active:scale-95 transition-transform"
          >
            Vender mi casa
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
          <a
            href={`https://wa.me/${WA}?text=Hola,%20quiero%20información%20sobre%20propiedades`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1.5 rounded-xl border border-cima-border bg-cima-card px-4 py-2.5 font-heading font-semibold text-sm text-cima-text-muted active:scale-95 transition-transform"
          >
            <Phone className="h-3.5 w-3.5" />
            WA
          </a>
          <Link
            href="/propiedades"
            className="flex items-center justify-center gap-1.5 rounded-xl border border-cima-gold/30 bg-cima-gold/5 px-4 py-2.5 font-heading font-semibold text-sm text-cima-gold active:scale-95 transition-transform"
          >
            Catálogo
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
