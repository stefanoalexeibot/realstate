import React from "react";
import { DEMO_PLANS, type PlanTier } from "@/lib/config/demo-plans";
import DemoPortal from "@/components/demo/DemoPortal";

export default function DemoPortalPage({
    params,
}: {
    params: { plan: string };
}) {
    const { plan } = params;
    const planConfig = DEMO_PLANS[plan as PlanTier];

    return <DemoPortal plan={planConfig} />;
}
