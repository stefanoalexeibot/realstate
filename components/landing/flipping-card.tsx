"use client";

import Link from "next/link";
import Image from "next/image";
import { TrendingUp, Hammer, MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn, formatPrice } from "@/lib/utils";
import type { Property } from "@/lib/types";

interface FlippingCardProps {
    property: Property;
    index?: number;
}

export default function FlippingCard({ property, index = 0 }: FlippingCardProps) {
    // Estimated ROI logic (for demo, we'll randomize or calculate based on price)
    const estimatedRoi = 18 + (index % 5) * 2;
    const purchasePrice = property.price;
    const arv = purchasePrice + (purchasePrice * (estimatedRoi / 100)) + 200000;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group"
        >
            <div className="rounded-2xl border border-cima-border bg-cima-card overflow-hidden hover:border-cima-gold/40 transition-all duration-300 shadow-lg hover:shadow-cima-gold/5">
                {/* Visual Header */}
                <div className="relative h-48 overflow-hidden bg-cima-surface">
                    {property.cover_photo ? (
                        <Image
                            src={property.cover_photo}
                            alt={property.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Hammer className="h-10 w-10 text-cima-gold/20" />
                        </div>
                    )}
                    <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold tracking-widest uppercase bg-cima-gold text-cima-bg">
                            Oportunidad
                        </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cima-bg/90 to-transparent p-4">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-northpeak-green" />
                            <span className="text-xl font-heading font-black text-cima-text italic">+{estimatedRoi}% ROI</span>
                        </div>
                    </div>
                </div>

                {/* Info */}
                <div className="p-5">
                    <h3 className="font-heading font-bold text-base text-cima-text mb-2 line-clamp-1 group-hover:text-cima-gold transition-colors">
                        {property.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mb-4 text-cima-text-dim">
                        <MapPin className="h-3 w-3" />
                        <span className="text-xs">{property.neighborhood || "Monterrey, N.L."}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-5 border-y border-cima-border py-4">
                        <div>
                            <p className="text-[9px] font-mono text-cima-text-dim uppercase mb-1">Precio Compra</p>
                            <p className="text-sm font-bold text-cima-text">{formatPrice(purchasePrice)}</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-mono text-cima-text-dim uppercase mb-1">Venta Proyectada</p>
                            <p className="text-sm font-bold text-northpeak-green">{formatPrice(arv)}</p>
                        </div>
                    </div>

                    <Link
                        href={`/propiedades/${property.slug}`}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-cima-gold/30 text-cima-gold text-xs font-bold hover:bg-cima-gold hover:text-cima-bg transition-all"
                    >
                        Ver análisis de inversión <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
