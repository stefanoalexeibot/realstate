"use client";

import { useState } from "react";
import { MapPin, Loader2 } from "lucide-react";

export default function GeocodeButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setResult(null);
    try {
      const res  = await fetch("/api/admin/geocode", { method: "POST" });
      const data = await res.json();
      setResult(data.message ?? "Listo.");
    } catch {
      setResult("Error al geocodificar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={run}
        disabled={loading}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cima-border text-xs text-cima-text-muted hover:border-cima-gold/40 hover:text-cima-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading
          ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
          : <MapPin className="h-3.5 w-3.5" />
        }
        {loading ? "Geocodificando…" : "Geocodificar"}
      </button>
      {result && (
        <p className="text-xs text-cima-text-muted font-mono">{result}</p>
      )}
    </div>
  );
}
