"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, CheckCircle2 } from "lucide-react";

type Toast = {
  id: number;
  message: string;
  sub: string;
  type: "new" | "confirmed";
};

export default function PortalRealtimeToasts({ propertyId }: { propertyId: string }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  function push(toast: Omit<Toast, "id">) {
    const id = Date.now();
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5500);
  }

  useEffect(() => {
    if (!propertyId) return;
    const supabase = createClient();

    const channel = supabase
      .channel(`portal-visits-${propertyId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "re_visits",
          filter: `property_id=eq.${propertyId}`,
        },
        (payload) => {
          push({
            type: "new",
            message: "Nueva solicitud de visita",
            sub: `${payload.new.name} quiere ver tu propiedad`,
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "re_visits",
          filter: `property_id=eq.${propertyId}`,
        },
        (payload) => {
          if (payload.new.status === "confirmed" && payload.old?.status !== "confirmed") {
            push({
              type: "confirmed",
              message: "¡Visita confirmada!",
              sub: `Se confirmó la visita con ${payload.new.name}`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [propertyId]);

  return (
    <div className="fixed bottom-6 left-4 z-50 space-y-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: -20, y: 8 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className={`flex items-start gap-3 rounded-xl border px-4 py-3 shadow-2xl max-w-[280px] ${
              t.type === "confirmed"
                ? "bg-emerald-950/80 border-emerald-500/30 backdrop-blur-sm"
                : "bg-cima-card/95 border-cima-border backdrop-blur-sm"
            }`}
          >
            <div className={`shrink-0 mt-0.5 h-7 w-7 rounded-full flex items-center justify-center ${
              t.type === "confirmed"
                ? "bg-emerald-500/15 border border-emerald-500/30"
                : "bg-cima-gold/10 border border-cima-gold/30"
            }`}>
              {t.type === "confirmed"
                ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                : <Calendar className="h-3.5 w-3.5 text-cima-gold" />
              }
            </div>
            <div>
              <p className={`text-xs font-semibold ${t.type === "confirmed" ? "text-emerald-300" : "text-cima-text"}`}>
                {t.message}
              </p>
              <p className="text-[10px] text-cima-text-muted mt-0.5">{t.sub}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
