import { type Property } from "@/lib/types";

export type VisitStatus = "pending" | "confirmed" | "done" | "cancelled";

export interface PortalDashboardData {
    propName: string;
    property: (Property & { re_photos: { id: string }[] }) | null;
    visits: {
        id: string;
        name: string;
        phone: string;
        status: string;
        preferred_date: string | null;
        created_at: string;
        agent_notes: string | null;
    }[];
    dailyViews: { date: string; count: number }[];
    stats: {
        photoCount: number;
        totalVisits: number;
        pendingVisits: number;
        views: number;
        daysListed: number;
    };
    market: {
        compScope: string;
        validCompsCount: number;
        myPricePerM2: number | null;
        avgMarketPricePerM2: number | null;
        diff: number | null;
    };
}
