import React from "react";
import { DEMO_PLANS, type PlanTier } from "@/lib/config/demo-plans";
import DemoPortal from "@/components/demo/DemoPortal";

export default async function DemoPortalPage({
    params,
}: {
    params: Promise<{ plan: string }>;
}) {
    const { plan } = await params;
    const planConfig = DEMO_PLANS[plan as PlanTier];

    return <DemoPortal plan={planConfig} />;
}
