"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

const KEY = "cima-favorites";

export function getFavs(): string[] {
  try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); } catch { return []; }
}

export default function FavoriteButton({ propertyId }: { propertyId: string }) {
  const [fav, setFav] = useState(false);

  useEffect(() => {
    setFav(getFavs().includes(propertyId));
  }, [propertyId]);

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const favs = getFavs();
    const next = favs.includes(propertyId)
      ? favs.filter((id) => id !== propertyId)
      : [...favs, propertyId];
    localStorage.setItem(KEY, JSON.stringify(next));
    setFav(next.includes(propertyId));
  }

  return (
    <button
      onClick={toggle}
      className={`absolute bottom-3 right-3 h-7 w-7 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 ${
        fav
          ? "bg-red-500/90 text-white border border-red-400/50 scale-110"
          : "bg-black/40 text-cima-text-muted border border-cima-border hover:text-red-400 hover:border-red-400/40"
      }`}
      aria-label={fav ? "Quitar de favoritos" : "Guardar en favoritos"}
    >
      <Heart className={`h-3.5 w-3.5 transition-all ${fav ? "fill-current" : ""}`} />
    </button>
  );
}
