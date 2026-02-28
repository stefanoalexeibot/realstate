import React from "react";
import { DEMO_PLANS, type PlanTier } from "@/lib/config/demo-plans";
import DemoAdmin from "@/components/demo/DemoAdmin";

export default async function DemoAdminPage({
    params,
}: {
    params: Promise<{ plan: string }>;
}) {
    const { plan } = await params;
    const planConfig = DEMO_PLANS[plan as PlanTier];

    return <DemoAdmin plan={planConfig} />;
}
