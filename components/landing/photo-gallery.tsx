"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type Photo = { id: string; url: string; order: number };

export default function PhotoGallery({ photos, title }: { photos: Photo[]; title: string }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const prev = useCallback(() => setActive((i) => Math.max(0, i - 1)), []);
  const next = useCallback(() => setActive((i) => Math.min(photos.length - 1, i + 1)), [photos.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Escape") setLightbox(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, prev, next]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightbox) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [lightbox]);

  if (photos.length === 0) return null;

  return (
    <>
      {/* Main photo */}
      <div
        className="relative h-[300px] sm:h-[420px] lg:h-[480px] rounded-xl overflow-hidden border border-cima-border mb-3 cursor-zoom-in group"
        onClick={() => setLightbox(true)}
      >
        <Image
          src={photos[active].url}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          priority
        />
        {/* Overlay controls */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="bg-black/60 text-white text-[10px] font-mono px-2 py-1 rounded-full backdrop-blur-sm">
            {active + 1} / {photos.length}
          </span>
          <div className="bg-black/60 text-white p-1.5 rounded-full backdrop-blur-sm">
            <ZoomIn className="h-3.5 w-3.5" />
          </div>
        </div>
        {/* Arrow nav on main */}
        {photos.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              disabled={active === 0}
              className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white disabled:opacity-0 hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              disabled={active === photos.length - 1}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white disabled:opacity-0 hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 mb-6 scrollbar-thin">
          {photos.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setActive(i)}
              className={cn(
                "shrink-0 h-16 w-24 rounded-lg overflow-hidden border-2 transition-all hover:opacity-90",
                i === active ? "border-cima-gold ring-1 ring-cima-gold/30" : "border-cima-border/50 opacity-60 hover:opacity-80"
              )}
            >
              <Image src={p.url} alt="" width={96} height={64} className="object-cover w-full h-full" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setLightbox(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Galería de fotos"
          >
            {/* Close */}
            <button
              onClick={() => setLightbox(false)}
              className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
              aria-label="Cerrar galería"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Counter */}
            <span className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-xs font-mono">
              {active + 1} / {photos.length}
            </span>

            {/* Keyboard hint */}
            <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 text-white/30 text-[10px] font-mono hidden sm:flex items-center gap-3">
              <span>← → navegar</span>
              <span>ESC cerrar</span>
            </div>

            {/* Prev */}
            {active > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-4 h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}

            {/* Image */}
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="relative max-w-5xl max-h-[85vh] w-full px-16"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={photos[active].url}
                alt={title}
                width={1200}
                height={800}
                className="w-full h-full object-contain max-h-[85vh]"
              />
            </motion.div>

            {/* Next */}
            {active < photos.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-4 h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}

            {/* Thumbnail strip in lightbox */}
            {photos.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 overflow-x-auto max-w-sm px-2" onClick={(e) => e.stopPropagation()}>
                {photos.map((p, i) => (
                  <button
                    key={p.id}
                    onClick={() => setActive(i)}
                    className={cn(
                      "shrink-0 h-10 w-14 rounded overflow-hidden border transition-all",
                      i === active ? "border-cima-gold opacity-100" : "border-white/20 opacity-50 hover:opacity-80"
                    )}
                  >
                    <Image src={p.url} alt="" width={56} height={40} className="object-cover w-full h-full" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
