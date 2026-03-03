import React from "react";
import { DEMO_PLANS, type PlanTier } from "@/lib/config/demo-plans";
import DemoLanding from "@/components/demo/DemoLanding";

export async function generateStaticParams() {
    return [
        { plan: "basico" },
        { plan: "profesional" },
        { plan: "premium" },
    ];
}

export default async function DemoLandingPage({
    params,
}: {
    params: Promise<{ plan: string }>;
}) {
    const { plan } = await params;
    const planConfig = DEMO_PLANS[plan as PlanTier];

    return <DemoLanding plan={planConfig} />;
}
