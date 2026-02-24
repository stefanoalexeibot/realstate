"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import PropertyCard from "@/components/landing/property-card";
import Link from "next/link";
import { Building2, Heart } from "lucide-react";
import type { Property } from "@/lib/types";

const KEY = "cima-favorites";

export default function FavoritosPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    const ids: string[] = (() => {
      try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); } catch { return []; }
    })();

    if (ids.length === 0) { setLoading(false); return; }

    createClient()
      .from("re_properties")
      .select("*")
      .in("id", ids)
      .eq("status", "active")
      .then(({ data }) => {
        setProperties((data ?? []) as Property[]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-cima-bg">
      {/* Nav */}
      <header className="border-b border-cima-border/50 bg-cima-bg/90 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center">
              <Building2 className="h-4 w-4 text-cima-gold" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-heading font-bold text-sm text-cima-text">Cima</span>
              <span className="font-mono text-[9px] tracking-[0.2em] text-cima-text-muted uppercase">Propiedades</span>
            </div>
          </Link>
          <Link href="/propiedades" className="text-xs text-cima-text-muted hover:text-cima-text transition-colors">
            ← Catálogo
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex items-center gap-3">
          <Heart className="h-5 w-5 text-red-400 fill-current" />
          <div>
            <h1 className="font-heading font-bold text-2xl text-cima-text">Tus favoritos</h1>
            <p className="text-sm text-cima-text-muted mt-0.5">Propiedades que guardaste en este dispositivo</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-72 rounded-xl bg-cima-card border border-cima-border animate-pulse" />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="rounded-xl border border-cima-border bg-cima-card p-16 text-center">
            <Heart className="h-8 w-8 text-cima-text-dim mx-auto mb-3" />
            <p className="text-sm text-cima-text-muted mb-1">No tienes propiedades guardadas todavía.</p>
            <p className="text-xs text-cima-text-dim mb-5">
              Toca el corazón en cualquier propiedad para guardarla aquí.
            </p>
            <Link href="/propiedades" className="text-sm text-cima-gold hover:underline">
              Explorar propiedades →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
