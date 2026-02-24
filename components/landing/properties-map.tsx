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
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInst = useRef<ReturnType<typeof import("leaflet")["map"]> | null>(null);

  const withCoords = properties.filter((p) => p.lat != null && p.lng != null);

  useEffect(() => {
    if (!mapRef.current || mapInst.current) return;

    // Dynamically import leaflet to avoid SSR issues
    import("leaflet").then((L) => {
      // Fix default icon paths
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        scrollWheelZoom: false,
      });

      // Premium Dark Theme Tiles
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      withCoords.forEach((p) => {
        const isRenta = p.operation_type === "renta";

        // Custom elegant marker
        const customIcon = L.divIcon({
          className: "custom-div-icon",
          html: `
            <div style="
              position: relative;
              width: 40px;
              height: 40px;
              background: #C8A96E;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 12px rgba(0,0,0,0.5);
              border: 2px solid white;
            ">
              <div style="
                transform: rotate(45deg);
                color: #090A0D;
                font-weight: 800;
                font-size: 10px;
                letter-spacing: -0.5px;
              ">
                ${formatPrice(p.price).replace("$", "").split(".")[0]}
              </div>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 40],
          popupAnchor: [0, -40],
        });

        const popupContent = `
          <div style="
            font-family: 'Inter', sans-serif;
            width: 200px;
            background: #090A0D;
            color: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          ">
            ${p.cover_photo ? `
              <div style="height: 100px; width: 100%; overflow: hidden;">
                <img src="${p.cover_photo}" style="width: 100%; height: 100%; object-fit: cover;" />
              </div>
            ` : ""}
            <div style="padding: 12px;">
              <p style="font-size: 9px; color: #C8A96E; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 4px;">
                ${isRenta ? "Renta" : "Venta"} · ${p.property_type}
              </p>
              <h3 style="font-size: 13px; font-weight: 700; color: white; margin: 0 0 4px; line-height: 1.2;">${p.title}</h3>
              <p style="font-size: 14px; font-weight: 800; color: #C8A96E; margin: 0 0 10px;">
                ${formatPrice(p.price)}${isRenta ? "/mes" : ""}
              </p>
              <a href="/propiedades/${p.slug}" style="
                display: block;
                text-align: center;
                background: #C8A96E;
                color: #090A0D;
                border-radius: 6px;
                padding: 8px;
                font-size: 11px;
                font-weight: 800;
                text-decoration: none;
                transition: background 0.2s;
              ">Ver propiedad</a>
            </div>
          </div>
        `;

        L.marker([p.lat!, p.lng!], { icon: customIcon })
          .addTo(map)
          .bindPopup(popupContent, {
            className: "premium-popup",
            maxWidth: 200,
            minWidth: 200,
          });
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
  }, [withCoords.length]); // Re-run when set changes

  return (
    <div className="rounded-xl overflow-hidden border border-cima-border relative shadow-2xl shadow-black/50">
      <style jsx global>{`
        .premium-popup .leaflet-popup-content-wrapper {
          background: transparent !important;
          padding: 0 !important;
          box-shadow: none !important;
        }
        .premium-popup .leaflet-popup-content {
          margin: 0 !important;
          line-height: normal !important;
        }
        .premium-popup .leaflet-popup-tip-container {
          display: none !important;
        }
        .premium-popup .leaflet-popup-close-button {
          color: white !important;
          padding: 8px !important;
        }
      `}</style>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      <div ref={mapRef} className="w-full h-[520px] bg-[#090A0D]" />
      {withCoords.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-cima-bg/80 backdrop-blur-sm">
          <p className="text-sm text-cima-text-muted mb-1">No hay propiedades con coordenadas aún.</p>
          <p className="text-xs text-cima-text-dim">Agrega lat/lng en el panel admin para mostrarlas aquí.</p>
        </div>
      )}
    </div>
  );
}
