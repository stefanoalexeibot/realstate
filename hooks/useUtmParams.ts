"use client";

import { useEffect, useState } from "react";

export interface UtmParams {
    utm_source: string | null;
    utm_medium: string | null;
    utm_campaign: string | null;
    utm_content: string | null;
    utm_term: string | null;
    referrer: string | null;
}

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
const STORAGE_KEY = "cima_utm";

/**
 * Captures UTM params from the URL on first visit and persists them
 * in sessionStorage so they survive page navigations within the session.
 */
export function useUtmParams(): UtmParams {
    const [utm, setUtm] = useState<UtmParams>({
        utm_source: null,
        utm_medium: null,
        utm_campaign: null,
        utm_content: null,
        utm_term: null,
        referrer: null,
    });

    useEffect(() => {
        // Check sessionStorage first (persists through navigation)
        const stored = sessionStorage.getItem(STORAGE_KEY);
        if (stored) {
            setUtm(JSON.parse(stored));
            return;
        }

        // Capture from URL
        const params = new URLSearchParams(window.location.search);
        const captured: UtmParams = {
            utm_source: params.get("utm_source"),
            utm_medium: params.get("utm_medium"),
            utm_campaign: params.get("utm_campaign"),
            utm_content: params.get("utm_content"),
            utm_term: params.get("utm_term"),
            referrer: document.referrer || null,
        };

        // Only store if at least one UTM param exists
        const hasUtm = UTM_KEYS.some((k) => captured[k]);
        if (hasUtm || captured.referrer) {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(captured));
            setUtm(captured);
        }
    }, []);

    return utm;
}
