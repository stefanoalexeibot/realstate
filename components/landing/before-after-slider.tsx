"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronsLeftRight } from "lucide-react";

const BEFORE_URL =
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=900&q=55";
const AFTER_URL =
  "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=900&q=80";

export default function BeforeAfterSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [split, setSplit] = useState(42);
  const dragging = useRef(false);

  function calcPct(clientX: number) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return split;
    return Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100));
  }

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!dragging.current) return;
      setSplit(calcPct(e.clientX));
    }
    function onTouchMove(e: TouchEvent) {
      if (!dragging.current) return;
      setSplit(calcPct(e.touches[0].clientX));
    }
    function stopDrag() { dragging.current = false; }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", stopDrag);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", stopDrag);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", stopDrag);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", stopDrag);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="px-6 py-20 border-t border-cima-border/50">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="font-mono text-[10px] tracking-[0.25em] text-cima-gold uppercase mb-3">
            Fotografía profesional
          </p>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-cima-text mb-4">
            La diferencia que vende tu casa
          </h2>
          <p className="text-cima-text-muted max-w-xl mx-auto text-sm leading-relaxed">
            Incluimos sesión fotográfica profesional en cada propiedad. Las fotos de calidad
            generan <span className="text-cima-text font-medium">3× más solicitudes de visita</span>.
          </p>
        </div>

        {/* Slider */}
        <div
          ref={containerRef}
          className="relative rounded-2xl overflow-hidden aspect-[16/9] cursor-ew-resize select-none shadow-2xl border border-cima-border"
          onMouseDown={(e) => { dragging.current = true; setSplit(calcPct(e.clientX)); }}
          onTouchStart={(e) => { dragging.current = true; setSplit(calcPct(e.touches[0].clientX)); }}
        >
          {/* After (professional) — full background */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${AFTER_URL})` }}
          />

          {/* After label */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cima-gold/90 backdrop-blur-sm">
            <span className="font-mono text-[10px] font-bold text-cima-bg uppercase tracking-widest">
              Fotografía Cima
            </span>
          </div>

          {/* Before (amateur) — clipped to left */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${BEFORE_URL})`,
              clipPath: `inset(0 ${100 - split}% 0 0)`,
              filter: "brightness(0.8) saturate(0.7)",
            }}
          />

          {/* Before label */}
          <div
            className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm"
            style={{ opacity: split > 15 ? 1 : 0, transition: "opacity 0.2s" }}
          >
            <span className="font-mono text-[10px] font-bold text-white/80 uppercase tracking-widest">
              Foto de celular
            </span>
          </div>

          {/* Divider line */}
          <div
            className="absolute top-0 bottom-0 w-px bg-white/70"
            style={{ left: `${split}%` }}
          />

          {/* Handle */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 h-11 w-11 rounded-full bg-white shadow-xl flex items-center justify-center"
            style={{ left: `${split}%` }}
          >
            <ChevronsLeftRight className="h-5 w-5 text-gray-600" />
          </div>
        </div>

        <p className="text-center text-[10px] text-cima-text-dim font-mono mt-4">
          Arrastra para comparar · Sesión fotográfica incluida en toda exclusiva
        </p>
      </div>
    </section>
  );
}
