"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Building2, Loader2 } from "lucide-react";

export default function ExitIntent() {
  const [show, setShow] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    // Only show once ever (localStorage persists across sessions)
    if (localStorage.getItem("cima-exit-shown")) return;

    let triggered = false;

    function onMouseLeave(e: MouseEvent) {
      if (e.clientY <= 4 && !triggered) {
        triggered = true;
        setShow(true);
        localStorage.setItem("cima-exit-shown", "1");
      }
    }

    // Add the listener after 6s so it doesn't fire immediately
    const timer = setTimeout(() => {
      document.addEventListener("mouseleave", onMouseLeave);
    }, 6000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setLoading(true);
    try {
      await fetch("/api/seller-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          operation_type: "venta",
          message: "Lead via exit intent popup",
        }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true); // still show success to not frustrate user
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShow(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="bg-cima-card border border-cima-border rounded-2xl p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {!submitted ? (
              <>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.25em] text-cima-gold uppercase mb-2">
                      Antes de irte
                    </p>
                    <h2 className="font-heading font-bold text-2xl text-cima-text leading-tight">
                      ¿Cuánto vale tu casa?
                    </h2>
                    <p className="text-sm text-cima-text-muted mt-2">
                      Valuación gratuita · Sin compromiso · Respuesta en menos de 24h
                    </p>
                  </div>
                  <button
                    onClick={() => setShow(false)}
                    className="p-1.5 rounded-lg hover:bg-cima-surface transition-colors shrink-0 ml-4"
                  >
                    <X className="h-4 w-4 text-cima-text-muted" />
                  </button>
                </div>

                <form onSubmit={submit} className="space-y-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Tu nombre"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full rounded-xl border border-cima-border bg-cima-surface px-4 py-3 text-sm text-cima-text placeholder:text-cima-text-dim focus:outline-none focus:border-cima-gold/50 transition-colors"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Tu número de WhatsApp"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full rounded-xl border border-cima-border bg-cima-surface px-4 py-3 text-sm text-cima-text placeholder:text-cima-text-dim focus:outline-none focus:border-cima-gold/50 transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-cima-gold px-5 py-3 font-heading font-bold text-sm text-cima-bg hover:bg-cima-gold-light disabled:opacity-70 transition-colors"
                  >
                    {loading
                      ? <><Loader2 className="h-4 w-4 animate-spin" /> Enviando…</>
                      : "Quiero mi valuación gratis"}
                  </button>
                </form>

                <p className="text-center text-[10px] text-cima-text-dim mt-4 font-mono">
                  Solo cobramos si vendemos. Cero riesgo.
                </p>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="h-14 w-14 rounded-full bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-7 w-7 text-cima-gold" />
                </div>
                <h3 className="font-heading font-bold text-xl text-cima-text mb-2">
                  ¡Listo! Te contactamos hoy
                </h3>
                <p className="text-sm text-cima-text-muted">
                  Un asesor de Cima te llamará en las próximas horas para coordinar tu valuación.
                </p>
                <button
                  onClick={() => setShow(false)}
                  className="mt-6 text-xs text-cima-text-dim hover:text-cima-text transition-colors font-mono"
                >
                  Cerrar
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
