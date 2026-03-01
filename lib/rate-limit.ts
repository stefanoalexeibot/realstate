import { NextResponse } from "next/server";

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

// In-memory store — resets on server restart.
// For production at scale, use Redis or Supabase.
const store = new Map<string, RateLimitEntry>();

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5; // max 5 requests per minute per IP

/**
 * Simple in-memory rate limiter for public form endpoints.
 * Returns null if allowed, or a NextResponse 429 if rate limited.
 */
export function checkRateLimit(req: Request): NextResponse | null {
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";
    const now = Date.now();

    const entry = store.get(ip);

    if (!entry || now > entry.resetAt) {
        store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
        return null;
    }

    if (entry.count >= MAX_REQUESTS) {
        return NextResponse.json(
            { error: "Demasiadas solicitudes. Intenta en un momento." },
            { status: 429 }
        );
    }

    entry.count++;
    return null;
}

/**
 * Checks for honeypot field — if filled, it's a bot.
 * Returns true if it's a bot (field was filled).
 */
export function isHoneypotFilled(body: Record<string, unknown>): boolean {
    // The "website" field should never be filled by real users
    return !!body.website;
}
