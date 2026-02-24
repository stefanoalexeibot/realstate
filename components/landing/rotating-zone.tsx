"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ZONES = ["San Pedro", "Cumbres", "Valle Oriente", "Obispado", "San Jerónimo", "Monterrey"];

export default function RotatingZone() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % ZONES.length), 2400);
    return () => clearInterval(t);
  }, []);

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="text-cima-text-muted font-mono text-xs tracking-widest">en</span>
      <AnimatePresence mode="wait">
        <motion.span
          key={idx}
          initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
          transition={{ duration: 0.3 }}
          className="font-mono text-xs text-cima-gold tracking-widest uppercase"
        >
          {ZONES[idx]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
