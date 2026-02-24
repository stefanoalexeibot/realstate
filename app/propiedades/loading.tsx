import { PropertyGridSkeleton } from "@/components/landing/property-skeleton";
import { Building2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="min-h-screen bg-cima-bg">
            <div className="mx-auto max-w-6xl px-6 py-10">
                {/* Header Skeleton */}
                <div className="mb-8 flex items-end justify-between gap-4 flex-wrap animate-pulse">
                    <div className="space-y-4">
                        <div className="h-4 w-24 bg-cima-surface rounded-md" />
                        <div className="h-10 w-64 bg-cima-surface rounded-md" />
                        <div className="h-4 w-48 bg-cima-surface rounded-md" />
                    </div>
                </div>

                {/* Filters Skeleton */}
                <div className="flex flex-wrap gap-3 mb-8 p-4 rounded-xl border border-cima-border bg-cima-card animate-pulse">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="h-8 w-16 bg-cima-surface rounded-lg" />
                    ))}
                </div>

                {/* Property Grid Skeleton */}
                <PropertyGridSkeleton />
            </div>
        </div>
    );
}
