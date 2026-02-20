"use client";

import { useState, useEffect } from "react";
import { GitCompare } from "lucide-react";

const KEY   = "cima-compare";
const EVENT = "cima:compare-change";
const MAX   = 3;

export function getCompare(): string[] {
  try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); } catch { return []; }
}

function setCompare(ids: string[]) {
  localStorage.setItem(KEY, JSON.stringify(ids));
  window.dispatchEvent(new CustomEvent(EVENT));
}

export default function CompareButton({ propertyId }: { propertyId: string }) {
  const [selected, setSelected] = useState(false);
  const [atMax, setAtMax]       = useState(false);

  useEffect(() => {
    const sync = () => {
      const ids = getCompare();
      setSelected(ids.includes(propertyId));
      setAtMax(ids.length >= MAX && !ids.includes(propertyId));
    };
    sync();
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, [propertyId]);

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const ids = getCompare();
    if (ids.includes(propertyId)) {
      setCompare(ids.filter((id) => id !== propertyId));
    } else if (ids.length < MAX) {
      setCompare([...ids, propertyId]);
    }
  }

  if (atMax) return null;

  return (
    <button
      onClick={toggle}
      title={selected ? "Quitar del comparador" : "Agregar al comparador"}
      className={`absolute bottom-3 left-3 h-7 w-7 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 ${
        selected
          ? "bg-blue-500/90 text-white border border-blue-400/50 scale-110"
          : "bg-black/40 text-cima-text-muted border border-cima-border hover:text-blue-400 hover:border-blue-400/40"
      }`}
    >
      <GitCompare className="h-3.5 w-3.5" />
    </button>
  );
}
