"use client";

import Link from "next/link";
import Image from "next/image";
import { BedDouble, Bath, Maximize2, Car, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { cn, formatPrice } from "@/lib/utils";
import type { Property } from "@/lib/types";
import FavoriteButton from "@/components/landing/favorite-button";
import CompareButton from "@/components/landing/compare-button";

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  casa: "Casa",
  departamento: "Depto",
  terreno: "Terreno",
  local: "Local",
  oficina: "Oficina",
};

interface PropertyCardProps {
  property: Property;
  index?: number;
  className?: string;
}

export default function PropertyCard({ property, index = 0, className }: PropertyCardProps) {
  const isRenta = property.operation_type === "renta";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn("h-full", className)}
    >
      <Link
        href={`/propiedades/${property.slug}`}
        className={cn(
          "group flex flex-col h-full rounded-2xl border border-cima-border bg-cima-card overflow-hidden",
          "hover:border-cima-gold/40 hover:shadow-[0_12px_40px_-12px_rgba(200,169,110,0.12)] transition-all duration-300"
        )}
      >
        {/* Image */}
        <div className="relative h-52 overflow-hidden property-placeholder">
          {property.cover_photo ? (
            <Image
              src={property.cover_photo}
              alt={property.title}
              fill
              priority={index < 2}
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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

          {/* Favorite & Compare buttons */}
          <FavoriteButton propertyId={property.id} />
          <CompareButton propertyId={property.id} />
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
    </motion.div>
  );
}
