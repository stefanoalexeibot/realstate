"use client";

import { cn } from "@/lib/utils";

export default function PropertySkeleton() {
    return (
        <div className="rounded-xl border border-cima-border bg-cima-card overflow-hidden">
            {/* Image Skeleton */}
            <div className="relative h-52 bg-cima-surface overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cima-gold/5 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
            </div>

            {/* Content Skeleton */}
            <div className="p-4 space-y-4">
                {/* Price */}
                <div className="h-6 w-1/3 bg-cima-surface rounded-md animate-pulse" />

                {/* Title */}
                <div className="space-y-2">
                    <div className="h-4 w-full bg-cima-surface rounded-md animate-pulse" />
                    <div className="h-4 w-2/3 bg-cima-surface rounded-md animate-pulse" />
                </div>

                {/* Neighborhood */}
                <div className="h-3 w-1/2 bg-cima-surface rounded-md animate-pulse" />

                {/* Stats */}
                <div className="flex items-center gap-3 pt-3 border-t border-cima-border">
                    <div className="h-4 w-8 bg-cima-surface rounded-md animate-pulse" />
                    <div className="h-4 w-8 bg-cima-surface rounded-md animate-pulse" />
                    <div className="h-4 w-12 bg-cima-surface rounded-md animate-pulse" />
                </div>
            </div>
        </div>
    );
}

export function PropertyGridSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
                <PropertySkeleton key={i} />
            ))}
        </div>
    );
}
