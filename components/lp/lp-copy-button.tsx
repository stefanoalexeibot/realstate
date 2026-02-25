"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function LpCopyButton({ slug }: { slug: string }) {
    const [copied, setCopied] = useState(false);

    function copy() {
        const url = `${window.location.origin}/lp/${slug}`;
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }

    return (
        <button
            onClick={copy}
            className="flex items-center gap-1.5 text-xs text-cima-text-muted hover:text-cima-gold transition-colors"
        >
            {copied ? <Check className="h-3.5 w-3.5 text-cima-gold" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Link copiado" : "Copiar link"}
        </button>
    );
}
