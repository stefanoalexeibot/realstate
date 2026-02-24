"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Phone } from "lucide-react";

type Toast = {
  id: number;
  name: string;
  phone: string;
  operation: string;
  neighborhood: string | null;
};

export default function AdminRealtimeToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  function push(toast: Omit<Toast, "id">) {
    const id = Date.now();
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 7000);
  }

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("admin-new-leads")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "re_seller_leads" },
        (payload) => {
          const r = payload.new;
          push({
            name:         r.name ?? "Sin nombre",
            phone:        r.phone ?? "",
            operation:    r.operation_type ?? "venta",
            neighborhood: r.neighborhood ?? null,
          });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <div className="fixed bottom-6 right-4 z-50 space-y-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 24, y: 8 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-auto flex items-start gap-3 rounded-xl border border-cima-gold/25 bg-cima-card/95 backdrop-blur-sm px-4 py-3 shadow-2xl max-w-[300px]"
          >
            <div className="shrink-0 mt-0.5 h-7 w-7 rounded-full flex items-center justify-center bg-cima-gold/10 border border-cima-gold/30">
              <UserPlus className="h-3.5 w-3.5 text-cima-gold" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-cima-gold">Nuevo lead entrante</p>
              <p className="text-sm font-medium text-cima-text leading-snug mt-0.5 truncate">{t.name}</p>
              {t.neighborhood && (
                <p className="text-[10px] text-cima-text-muted">{t.neighborhood} · {t.operation === "venta" ? "Venta" : "Renta"}</p>
              )}
              {t.phone && (
                <a
                  href={`https://wa.me/52${t.phone.replace(/\D/g, "")}?text=Hola ${encodeURIComponent(t.name)}, te contactamos de Cima Propiedades`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-mono text-[#25D366] hover:underline"
                >
                  <Phone className="h-2.5 w-2.5" />
                  {t.phone}
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
