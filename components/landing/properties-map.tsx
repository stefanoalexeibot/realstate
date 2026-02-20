"use client";

import { useEffect, useRef } from "react";
import type { Property } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

interface Props {
  properties: (Property & { lat: number | null; lng: number | null })[];
}

// Monterrey center
const DEFAULT_CENTER: [number, number] = [25.6866, -100.3161];
const DEFAULT_ZOOM = 11;

export default function PropertiesMap({ properties }: Props) {
  const mapRef    = useRef<HTMLDivElement>(null);
  const mapInst   = useRef<ReturnType<typeof import("leaflet")["map"]> | null>(null);

  const withCoords = properties.filter((p) => p.lat != null && p.lng != null);

  useEffect(() => {
    if (!mapRef.current || mapInst.current) return;

    // Dynamically import leaflet to avoid SSR issues
    import("leaflet").then((L) => {
      // Fix default icon paths (broken with Next.js bundler)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://openstreetmap.org">OSM</a>',
        maxZoom: 19,
      }).addTo(map);

      // Custom gold pin icon
      const goldIcon = L.divIcon({
        className: "",
        html: `<div style="
          width:32px;height:32px;border-radius:50% 50% 50% 0;
          background:#C8A96E;border:2px solid #9a7a3f;
          transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,0.4);
        "></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -34],
      });

      withCoords.forEach((p) => {
        const isRenta = p.operation_type === "renta";
        L.marker([p.lat!, p.lng!], { icon: goldIcon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family:sans-serif;min-width:180px;">
              <p style="font-size:11px;color:#888;margin:0 0 4px;text-transform:uppercase;letter-spacing:.05em;">
                ${isRenta ? "Renta" : "Venta"} · ${p.property_type}
              </p>
              <p style="font-size:13px;font-weight:600;margin:0 0 4px;color:#111;line-height:1.3;">${p.title}</p>
              <p style="font-size:15px;font-weight:700;color:#C8A96E;margin:0 0 8px;">
                ${formatPrice(p.price)}${isRenta ? "/mes" : ""}
              </p>
              <a href="/propiedades/${p.slug}" style="
                display:block;text-align:center;background:#C8A96E;color:#090A0D;
                border-radius:6px;padding:6px 12px;font-size:11px;font-weight:700;
                text-decoration:none;
              ">Ver propiedad →</a>
            </div>
          `, { maxWidth: 220 });
      });

      // Fit bounds if there are markers
      if (withCoords.length > 0) {
        const bounds = L.latLngBounds(withCoords.map((p) => [p.lat!, p.lng!]));
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      }

      mapInst.current = map;
    });

    return () => {
      mapInst.current?.remove();
      mapInst.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="rounded-xl overflow-hidden border border-cima-border relative">
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      <div ref={mapRef} className="w-full h-[520px] bg-cima-surface" />
      {withCoords.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-cima-bg/80 backdrop-blur-sm">
          <p className="text-sm text-cima-text-muted mb-1">No hay propiedades con coordenadas aún.</p>
          <p className="text-xs text-cima-text-dim">Agrega lat/lng en el panel admin para mostrarlas aquí.</p>
        </div>
      )}
    </div>
  );
}
