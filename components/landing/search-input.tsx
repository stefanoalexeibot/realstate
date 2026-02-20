"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";

export default function SearchInput() {
  const router      = useRouter();
  const pathname    = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [value, setValue] = useState(searchParams.get("q") ?? "");

  // Keep input in sync if user navigates back/forward
  useEffect(() => {
    setValue(searchParams.get("q") ?? "");
  }, [searchParams]);

  function apply(q: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (q.trim()) {
      params.set("q", q.trim());
    } else {
      params.delete("q");
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") apply(value);
  }

  function clear() {
    setValue("");
    apply("");
  }

  return (
    <div className="relative flex-1 min-w-[200px] max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-cima-text-dim pointer-events-none" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKey}
        onBlur={() => apply(value)}
        placeholder="Buscar por título, colonia…"
        className="w-full pl-9 pr-8 py-1.5 rounded-lg border border-cima-border bg-cima-surface text-sm text-cima-text placeholder:text-cima-text-dim focus:outline-none focus:border-cima-gold/50 transition-colors"
      />
      {value && (
        <button
          onClick={clear}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-cima-text-dim hover:text-cima-text transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
