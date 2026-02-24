"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronsLeftRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Slides data ──────────────────────────────────────────────────────────── */
const SLIDES = [
  {
    tag: "Decoración IA",
    title: "Sin muebles, sin problema",
    desc: "Decoramos tu casa vacía con inteligencia artificial para que los interesados la vean amueblada y acogedora.",
    beforeLabel: "Casa vacía",
    afterLabel: "Decorada con IA",
    beforeUrl: "/estancia-antes.png",
    afterUrl: "/estancia-despues.png",
    beforeFilter: "none",
  },
  {
    tag: "Recámara IA",
    title: "Confort visual inmediato",
    desc: "Transformamos habitaciones frías en espacios cálidos y listos para habitar, aumentando el valor percibido.",
    beforeLabel: "Estado real",
    afterLabel: "Confort con IA",
    beforeUrl: "/recamara-antes.png",
    afterUrl: "/recamara-despues.png",
    beforeFilter: "none",
  },
  {
    tag: "Remodelación IA",
    title: "Remodelada de lujo con IA",
    desc: "Transformamos tu propiedad de forma virtual a un acabado lujoso. Cero obra, cero inversión — solo resultados.",
    beforeLabel: "Original",
    afterLabel: "Remodelada con IA",
    beforeUrl: "/cocina-antes.png",
    afterUrl: "/cocina-despues.png",
    beforeFilter: "none",
  },
] as const;

/* ── Slider sub-component ─────────────────────────────────────────────────── */
function SlideSlider({
  slide,
  isInitial,
}: {
  slide: (typeof SLIDES)[number];
  isInitial?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [split, setSplit] = useState(42);
  const dragging = useRef(false);

  const calcPct = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return split;
    return Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100));
  }, [split]);

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!dragging.current) return;
      setSplit(calcPct(e.clientX));
    }
    function onTouchMove(e: TouchEvent) {
      if (!dragging.current) return;
      setSplit(calcPct(e.touches[0].clientX));
    }
    function stopDrag() {
      dragging.current = false;
    }

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
  }, [calcPct]);

  // Demo scanning animation on first load or slide change
  useEffect(() => {
    if (isInitial) {
      const timeout = setTimeout(() => {
        setSplit(15);
        setTimeout(() => setSplit(85), 800);
        setTimeout(() => setSplit(42), 1600);
      }, 500);
      return () => clearTimeout(timeout);
    } else {
      setSplit(42);
    }
  }, [slide, isInitial]);

  return (
    <div
      ref={containerRef}
      className="relative rounded-2xl overflow-hidden aspect-[16/9] cursor-ew-resize select-none shadow-2xl border border-cima-border group"
      onMouseDown={(e) => {
        dragging.current = true;
        setSplit(calcPct(e.clientX));
      }}
      onTouchStart={(e) => {
        dragging.current = true;
        setSplit(calcPct(e.touches[0].clientX));
      }}
    >
      {/* After — full background */}
      <motion.div
        key={`after-${slide.tag}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${slide.afterUrl})` }}
      />

      {/* After label */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cima-gold/90 backdrop-blur-sm shadow-lg shadow-cima-gold/20"
      >
        <Sparkles className="h-3 w-3 text-cima-bg" />
        <span className="font-mono text-[10px] font-bold text-cima-bg uppercase tracking-widest">
          {slide.afterLabel}
        </span>
      </motion.div>

      {/* Before — clipped */}
      <motion.div
        key={`before-${slide.tag}`}
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          clipPath: `inset(0 ${100 - split}% 0 0)`,
        }}
        transition={{
          opacity: { duration: 0.5 },
          clipPath: {
            type: "spring",
            bounce: 0,
            duration: dragging.current ? 0 : 0.8
          }
        }}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${slide.beforeUrl})`,
          filter: slide.beforeFilter,
        }}
      />

      {/* Before label */}
      <motion.div
        animate={{ opacity: split > 15 ? 1 : 0, x: split > 15 ? 0 : -10 }}
        className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm"
      >
        <span className="font-mono text-[10px] font-bold text-white/80 uppercase tracking-widest">
          {slide.beforeLabel}
        </span>
      </motion.div>

      {/* Divider line */}
      <motion.div
        animate={{ left: `${split}%` }}
        transition={{ type: "spring", bounce: 0, duration: dragging.current ? 0 : 0.8 }}
        className="absolute top-0 bottom-0 w-px bg-white/70 shadow-[0_0_15px_rgba(255,255,255,0.5)]"
      />

      {/* Handle */}
      <motion.div
        animate={{ left: `${split}%` }}
        transition={{ type: "spring", bounce: 0, duration: dragging.current ? 0 : 0.8 }}
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 h-11 w-11 rounded-full bg-white shadow-2xl flex items-center justify-center cursor-ew-resize"
      >
        <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-20 group-hover:hidden" />
        <ChevronsLeftRight className="h-5 w-5 text-cima-gold" />
      </motion.div>
    </div>
  );
}

/* ── Main export ──────────────────────────────────────────────────────────── */
export default function BeforeAfterSlider() {
  const [active, setActive] = useState(0);
  const [isInitial, setIsInitial] = useState(true);

  const prev = () => {
    setIsInitial(false);
    setActive((a) => (a === 0 ? SLIDES.length - 1 : a - 1));
  };
  const next = () => {
    setIsInitial(false);
    setActive((a) => (a === SLIDES.length - 1 ? 0 : a + 1));
  };

  const slide = SLIDES[active];

  return (
    <section className="px-6 py-20 border-t border-cima-border/50 overflow-hidden">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-[10px] tracking-[0.25em] text-cima-gold uppercase mb-3"
          >
            Tecnología IA
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-heading font-bold text-3xl sm:text-4xl text-cima-text mb-4"
          >
            IA al servicio de tu venta
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-cima-text-muted max-w-xl mx-auto text-sm leading-relaxed"
          >
            Usamos inteligencia artificial para presentar tu propiedad de la mejor manera posible,{" "}
            <span className="text-cima-text font-medium">sin costo adicional</span>.
          </motion.p>
        </div>

        {/* Slide tabs */}
        <div className="flex gap-2 justify-center mb-10 flex-wrap relative">
          {SLIDES.map((s, i) => (
            <button
              key={s.tag}
              onClick={() => {
                setIsInitial(false);
                setActive(i);
              }}
              className={`relative px-5 py-2 rounded-full font-mono text-[10px] tracking-widest uppercase transition-colors duration-300 z-10 ${active === i ? "text-cima-bg" : "text-cima-text-muted hover:text-cima-text"
                }`}
            >
              {active === i && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-cima-gold rounded-full -z-10 shadow-lg shadow-cima-gold/20"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {s.tag}
            </button>
          ))}
        </div>

        {/* Slide info */}
        <div className="text-center mb-8 h-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="font-heading font-bold text-xl text-cima-text mb-1 flex items-center justify-center gap-2">
                <Sparkles className="h-4 w-4 text-cima-gold" />
                {slide.title}
              </h3>
              <p className="text-sm text-cima-text-muted max-w-lg mx-auto leading-relaxed">
                {slide.desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slider */}
        <div className="relative">
          <SlideSlider slide={slide} isInitial={isInitial} />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={prev}
            className="h-11 w-11 rounded-full border border-cima-border flex items-center justify-center text-cima-text-muted hover:border-cima-gold/40 hover:text-cima-gold transition-all duration-200 hover:scale-110 active:scale-95 bg-cima-bg/50 backdrop-blur-sm"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Dots */}
          <div className="flex gap-3">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setIsInitial(false);
                  setActive(i);
                }}
                className="group relative h-4 w-4 flex items-center justify-center"
                aria-label={`Slide ${i + 1}`}
              >
                <div className={`h-1.5 rounded-full transition-all duration-500 ${active === i ? "w-6 bg-cima-gold" : "w-1.5 bg-cima-border group-hover:bg-cima-gold/40"
                  }`} />
              </button>
            ))}
          </div>

          <button
            onClick={next}
            className="h-11 w-11 rounded-full border border-cima-border flex items-center justify-center text-cima-text-muted hover:border-cima-gold/40 hover:text-cima-gold transition-all duration-200 hover:scale-110 active:scale-95 bg-cima-bg/50 backdrop-blur-sm"
            aria-label="Siguiente"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-[10px] text-cima-text-dim font-mono mt-6 tracking-widest uppercase"
        >
          Arrastra para comparar · Procesado en Tiempo Real con Cima AI
        </motion.p>
      </div>
    </section>
  );
}
