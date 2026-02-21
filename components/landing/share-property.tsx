"use client";

import { useState } from "react";
import { Share2, Link2, Check, MessageCircle } from "lucide-react";

interface SharePropertyProps {
    title: string;
    price: string;
    slug: string;
}

export default function ShareProperty({ title, price, slug }: SharePropertyProps) {
    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const url = typeof window !== "undefined"
        ? `${window.location.origin}/propiedades/${slug}`
        : `/propiedades/${slug}`;

    const text = `${title} — ${price}`;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`;

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback
            const el = document.createElement("textarea");
            el.value = url;
            document.body.appendChild(el);
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cima-border text-xs font-mono text-cima-text-muted hover:text-cima-text hover:border-cima-gold/40 transition-colors"
                aria-label="Compartir propiedad"
            >
                <Share2 className="h-3.5 w-3.5" />
                Compartir
            </button>

            {open && (
                <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

                    {/* Dropdown */}
                    <div className="absolute right-0 top-full mt-2 z-50 w-52 rounded-xl border border-cima-border bg-cima-card shadow-xl overflow-hidden animate-fade-in">
                        <a
                            href={waUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-3 text-sm hover:bg-cima-surface transition-colors"
                        >
                            <MessageCircle className="h-4 w-4 text-[#25D366]" />
                            <span className="text-cima-text">WhatsApp</span>
                        </a>

                        <button
                            onClick={copyLink}
                            className="flex items-center gap-2.5 px-4 py-3 text-sm hover:bg-cima-surface transition-colors w-full text-left"
                        >
                            {copied ? (
                                <>
                                    <Check className="h-4 w-4 text-emerald-400" />
                                    <span className="text-emerald-400">¡Copiado!</span>
                                </>
                            ) : (
                                <>
                                    <Link2 className="h-4 w-4 text-cima-text-muted" />
                                    <span className="text-cima-text">Copiar enlace</span>
                                </>
                            )}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
