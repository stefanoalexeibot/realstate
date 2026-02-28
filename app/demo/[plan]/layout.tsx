import React from "react";
import { notFound } from "next/navigation";
import { DEMO_PLANS, VALID_PLANS, type PlanTier } from "@/lib/config/demo-plans";
import DemoNavbar from "@/components/demo/DemoNavbar";

export default async function DemoLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ plan: string }>;
}) {
    const { plan } = await params;

    if (!VALID_PLANS.includes(plan as PlanTier)) {
        notFound();
    }

    const planConfig = DEMO_PLANS[plan as PlanTier];

    return (
        <div className="min-h-screen bg-[#0A0A0B]">
            <DemoNavbar plan={planConfig} />
            <div className="pt-12">
                {children}
            </div>
        </div>
    );
}
