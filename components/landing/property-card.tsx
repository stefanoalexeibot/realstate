"use client";

import Link from "next/link";
import { BedDouble, Bath, Maximize2, Car, MapPin } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import type { Property } from "@/lib/types";

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  casa: "Casa",
  departamento: "Depto",
  terreno: "Terreno",
  local: "Local",
  oficina: "Oficina",
};

interface PropertyCardProps {
  property: Property;
  className?: string;
}

export default function PropertyCard({ property, className }: PropertyCardProps) {
  const isRenta = property.operation_type === "renta";

  return (
    <Link
      href={`/propiedades/${property.slug}`}
      className={cn(
        "group block rounded-xl border border-cima-border bg-cima-card overflow-hidden",
        "hover:border-cima-gold/40 hover:shadow-[0_0_24px_rgba(200,169,110,0.08)] transition-all duration-300",
        className
      )}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden property-placeholder">
        {property.cover_photo ? (
          <img
            src={property.cover_photo}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-end p-4">
            {/* Architectural lines decoration */}
            <div className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: "repeating-linear-gradient(0deg, #C8A96E 0px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #C8A96E 0px, transparent 1px, transparent 40px)",
              }}
            />
            <div className="absolute bottom-6 left-6 right-6 h-px bg-gradient-to-r from-cima-gold/0 via-cima-gold/30 to-cima-gold/0" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className={cn(
            "px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold tracking-widest uppercase",
            isRenta
              ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
              : "bg-cima-gold/20 text-cima-gold border border-cima-gold/30"
          )}>
            {isRenta ? "Renta" : "Venta"}
          </span>
          <span className="px-2.5 py-1 rounded-md text-[10px] font-mono tracking-widest uppercase bg-black/40 text-cima-text-muted border border-cima-border backdrop-blur-sm">
            {PROPERTY_TYPE_LABELS[property.property_type] ?? property.property_type}
          </span>
        </div>

        {property.featured && (
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold tracking-widest uppercase bg-cima-gold text-cima-bg">
              Destacado
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Price */}
        <p className="font-heading font-bold text-xl text-cima-gold leading-none mb-1">
          {formatPrice(property.price)}
          {isRenta && <span className="text-xs font-mono font-normal text-cima-text-muted ml-1">/mes</span>}
        </p>

        {/* Title */}
        <p className="font-medium text-sm text-cima-text mt-2 mb-3 line-clamp-2 leading-snug group-hover:text-cima-gold-light transition-colors">
          {property.title}
        </p>

        {/* Neighborhood */}
        {property.neighborhood && (
          <div className="flex items-center gap-1 mb-3">
            <MapPin className="h-3 w-3 text-cima-text-dim shrink-0" />
            <span className="text-xs text-cima-text-muted">{property.neighborhood}</span>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-3 pt-3 border-t border-cima-border">
          {property.bedrooms > 0 && (
            <div className="flex items-center gap-1 text-cima-text-muted">
              <BedDouble className="h-3.5 w-3.5" />
              <span className="text-xs">{property.bedrooms}</span>
            </div>
          )}
          {property.bathrooms > 0 && (
            <div className="flex items-center gap-1 text-cima-text-muted">
              <Bath className="h-3.5 w-3.5" />
              <span className="text-xs">{property.bathrooms}</span>
            </div>
          )}
          {property.area_m2 && (
            <div className="flex items-center gap-1 text-cima-text-muted">
              <Maximize2 className="h-3.5 w-3.5" />
              <span className="text-xs">{property.area_m2} m²</span>
            </div>
          )}
          {property.parking > 0 && (
            <div className="flex items-center gap-1 text-cima-text-muted">
              <Car className="h-3.5 w-3.5" />
              <span className="text-xs">{property.parking}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
