"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GitCompare, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getCompare } from "@/components/landing/compare-button";

const EVENT = "cima:compare-change";

export default function CompareBar() {
  const [ids, setIds]   = useState<string[]>([]);
  const router          = useRouter();

  useEffect(() => {
    const sync = () => setIds(getCompare());
    sync();
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, []);

  function clear() {
    localStorage.setItem("cima-compare", "[]");
    window.dispatchEvent(new CustomEvent(EVENT));
  }

  return (
    <AnimatePresence>
      {ids.length > 0 && (
        <motion.div
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          exit={{ y: 80 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-2xl border border-cima-gold/30 bg-cima-card/95 backdrop-blur-md px-5 py-3 shadow-2xl"
        >
          <GitCompare className="h-4 w-4 text-cima-gold shrink-0" />
          <span className="text-sm font-medium text-cima-text whitespace-nowrap">
            {ids.length} propiedad{ids.length > 1 ? "es" : ""} seleccionada{ids.length > 1 ? "s" : ""}
          </span>
          <button
            onClick={() => router.push(`/comparar?ids=${ids.join(",")}`)}
            disabled={ids.length < 2}
            className="rounded-lg bg-cima-gold px-4 py-1.5 text-xs font-bold text-cima-bg hover:bg-cima-gold-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          >
            Comparar
          </button>
          <button onClick={clear} className="text-cima-text-dim hover:text-cima-text transition-colors">
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
