export type VisitRow = {
    id: string;
    name: string;
    phone: string;
    status: string;
    created_at: string;
    re_properties: { title: string; neighborhood: string | null } | null;
};

export type LeadRow = {
    id: string;
    name: string;
    phone: string;
    neighborhood: string | null;
    operation_type: string;
    pipeline_stage: string;
    created_at: string;
};

export interface AdminDashboardData {
    activeProps: number;
    soldProps: number;
    totalProps: number;
    totalViews: number;
    leadsThisWeek: number;
    pendingVisits: number;
    pipelineCounts: Record<string, number>;
    pipelineTotal: number;
    uncontacted: number;
    typeCounts: Record<string, number>;
    leadsChart: { label: string; value: number }[];
    visitsChart: { label: string; value: number }[];
    todayStr: string;
    recentVisits: VisitRow[];
    recentLeads: LeadRow[];
}
