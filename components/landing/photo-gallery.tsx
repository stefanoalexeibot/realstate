"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn, Play, Map, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type Photo = { id: string; url: string; order: number };

interface PhotoGalleryProps {
  photos: Photo[];
  title: string;
  video_url?: string | null;
  tour_url?: string | null;
}

export default function PhotoGallery({ photos, title, video_url, tour_url }: PhotoGalleryProps) {
  const [activeTab, setActiveTab] = useState<"photos" | "video" | "tour">("photos");
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

  if (photos.length === 0 && !video_url && !tour_url) return null;

  // Helpers to get embed URLs
  const getYoutubeEmbed = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
  };

  const isVimeo = video_url?.includes("vimeo.com");

  return (
    <>
      <div className="relative mb-6">
        {/* Tab Switcher (only if there's more than just photos) */}
        {(video_url || tour_url) && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex p-1 bg-black/40 backdrop-blur-md rounded-full border border-white/10 shadow-2xl">
            <button
              onClick={() => setActiveTab("photos")}
              className={cn(
                "flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all",
                activeTab === "photos" ? "bg-white text-cima-bg shadow-lg" : "text-white/80 hover:text-white"
              )}
            >
              <Camera className="h-3.5 w-3.5" />
              Fotos
            </button>
            {video_url && (
              <button
                onClick={() => setActiveTab("video")}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all",
                  activeTab === "video" ? "bg-white text-cima-bg shadow-lg" : "text-white/80 hover:text-white"
                )}
              >
                <Play className="h-3.5 w-3.5" />
                Video
              </button>
            )}
            {tour_url && (
              <button
                onClick={() => setActiveTab("tour")}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all",
                  activeTab === "tour" ? "bg-white text-cima-bg shadow-lg" : "text-white/80 hover:text-white"
                )}
              >
                <Map className="h-3.5 w-3.5" />
                Tour 360
              </button>
            )}
          </div>
        )}

        {/* Content Viewer */}
        <div className="relative h-[300px] sm:h-[420px] lg:h-[520px] rounded-2xl overflow-hidden border border-cima-border bg-cima-surface/30">
          {activeTab === "photos" && (
            <div className="w-full h-full cursor-zoom-in group" onClick={() => setLightbox(true)}>
              <Image
                src={photos[active].url}
                alt={title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Overlay controls */}
              <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="bg-black/60 text-white text-[10px] font-mono px-2.5 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                  {active + 1} / {photos.length}
                </span>
                <div className="bg-black/60 text-white p-2 rounded-full backdrop-blur-md border border-white/10">
                  <ZoomIn className="h-4 w-4" />
                </div>
              </div>

              {/* Arrow navigation */}
              {photos.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); prev(); }}
                    disabled={active === 0}
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white disabled:opacity-0 hover:bg-black/80 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 border border-white/10"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); next(); }}
                    disabled={active === photos.length - 1}
                    className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white disabled:opacity-0 hover:bg-black/80 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 border border-white/10"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
          )}

          {activeTab === "video" && video_url && (
            <iframe
              src={getYoutubeEmbed(video_url)}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}

          {activeTab === "tour" && tour_url && (
            <iframe
              src={tour_url}
              className="w-full h-full"
              allowFullScreen
              allow="xr-spatial-tracking"
            />
          )}
        </div>
      </div>

      {/* Thumbnails (only for Photos tab) */}
      {activeTab === "photos" && photos.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-4 scrollbar-hide">
          {photos.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setActive(i)}
              className={cn(
                "shrink-0 h-16 w-24 rounded-xl overflow-hidden border-2 transition-all hover:brightness-110",
                i === active
                  ? "border-cima-gold ring-2 ring-cima-gold/20 scale-95"
                  : "border-transparent opacity-60 hover:opacity-100"
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
            className="fixed inset-0 z-[100] bg-black/98 flex items-center justify-center p-4"
            onClick={() => setLightbox(false)}
          >
            <button
              onClick={() => setLightbox(false)}
              className="absolute top-6 right-6 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all z-10"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="absolute top-6 left-1/2 -translate-x-1/2 text-white/70 text-sm font-mono tracking-widest">
              {active + 1} / {photos.length}
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              disabled={active === 0}
              className="absolute left-6 h-14 w-14 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white disabled:opacity-0 transition-all"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>

            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="relative w-full max-w-6xl aspect-[3/2]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={photos[active].url}
                alt={title}
                fill
                className="object-contain"
                priority
              />
            </motion.div>

            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              disabled={active === photos.length - 1}
              className="absolute right-6 h-14 w-14 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white disabled:opacity-0 transition-all"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
