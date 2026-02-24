"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin } from "lucide-react";

const PROOFS = [
  { zone: "San Pedro Garza García", action: "solicitó valuación", time: "hace 2 min" },
  { zone: "Valle Oriente",          action: "agendó una visita",  time: "hace 5 min" },
  { zone: "Cumbres",                action: "solicitó valuación", time: "hace 9 min" },
  { zone: "Obispado",               action: "contactó un asesor", time: "hace 12 min" },
  { zone: "San Jerónimo",           action: "solicitó valuación", time: "hace 18 min" },
  { zone: "Monterrey Centro",       action: "agendó una visita",  time: "hace 21 min" },
];

export default function SocialProofToast() {
  const [visible, setVisible] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    // First appearance after 5s
    const first = setTimeout(() => {
      setVisible(true);
      setTimeout(() => setVisible(false), 4500);
    }, 5000);

    // Cycle every 12s after that
    const interval = setInterval(() => {
      setIdx((prev) => (prev + 1) % PROOFS.length);
      setVisible(true);
      setTimeout(() => setVisible(false), 4500);
    }, 12000);

    return () => {
      clearTimeout(first);
      clearInterval(interval);
    };
  }, []);

  const proof = PROOFS[idx];

  return (
    <div className="fixed bottom-24 left-4 z-40 pointer-events-none">
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, x: -16, y: 8 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex items-center gap-3 rounded-xl border border-cima-border bg-cima-card px-4 py-3 shadow-2xl max-w-[260px]"
          >
            <div className="h-8 w-8 rounded-full bg-cima-gold/10 border border-cima-gold/20 flex items-center justify-center shrink-0">
              <MapPin className="h-3.5 w-3.5 text-cima-gold" />
            </div>
            <div>
              <p className="text-xs font-medium text-cima-text leading-snug">
                Propietario en {proof.zone}
              </p>
              <p className="text-[10px] text-cima-text-muted font-mono mt-0.5">
                {proof.action} · {proof.time}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
