/**
 * CONFIGURACIÓN DE DEMOS POR PAQUETE
 * Controla qué features están habilitadas en cada tier.
 */

export type PlanTier = "basico" | "profesional" | "premium";

export interface PlanConfig {
    tier: PlanTier;
    name: string;
    price: string;
    tagline: string;
    maxProperties: number; // -1 = ilimitado
    color: string; // accent color
    features: {
        landing: {
            animations: boolean;
            aurora: boolean;
            gallery: "static" | "interactive" | "premium";
            socialProof: boolean;
            roiCalculator: boolean;
        };
        admin: {
            analytics: boolean;
            messages: boolean;
            visits: boolean;
            multiAgent: boolean;
        };
        portal: {
            feedback: boolean;
            documents: boolean;
            evidence: boolean;
            sharing: boolean;
            marketSentiment: boolean;
        };
    };
}

export const DEMO_PLANS: Record<PlanTier, PlanConfig> = {
    basico: {
        tier: "basico",
        name: "Starter",
        price: "$14,900",
        tagline: "Para asesores independientes",
        maxProperties: 1,
        color: "#9CA3AF", // gray
        features: {
            landing: {
                animations: false,
                aurora: false,
                gallery: "static",
                socialProof: false,
                roiCalculator: false,
            },
            admin: {
                analytics: false,
                messages: false,
                visits: false,
                multiAgent: false,
            },
            portal: {
                feedback: false,
                documents: false,
                evidence: false,
                sharing: false,
                marketSentiment: false,
            },
        },
    },
    profesional: {
        tier: "profesional",
        name: "Professional",
        price: "$29,900",
        tagline: "Para asesores top y equipos",
        maxProperties: 5,
        color: "#C8A96E", // cima-gold
        features: {
            landing: {
                animations: true,
                aurora: true,
                gallery: "interactive",
                socialProof: false,
                roiCalculator: false,
            },
            admin: {
                analytics: true,
                messages: true,
                visits: true,
                multiAgent: false,
            },
            portal: {
                feedback: true,
                documents: true,
                evidence: false,
                sharing: false,
                marketSentiment: true,
            },
        },
    },
    premium: {
        tier: "premium",
        name: "Team / Agency",
        price: "$49,900",
        tagline: "Para inmobiliarias locales",
        maxProperties: -1,
        color: "#C8A96E", // cima-gold
        features: {
            landing: {
                animations: true,
                aurora: true,
                gallery: "premium",
                socialProof: true,
                roiCalculator: true,
            },
            admin: {
                analytics: true,
                messages: true,
                visits: true,
                multiAgent: true,
            },
            portal: {
                feedback: true,
                documents: true,
                evidence: true,
                sharing: true,
                marketSentiment: true,
            },
        },
    },
};

export const VALID_PLANS: PlanTier[] = ["basico", "profesional", "premium"];
