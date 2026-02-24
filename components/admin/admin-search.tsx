"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

interface AdminSearchProps {
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    status?: string;
    onStatusChange?: (status: string) => void;
    statusOptions?: { value: string; label: string }[];
}

export default function AdminSearch({
    placeholder = "Buscar...",
    value,
    onChange,
    status,
    onStatusChange,
    statusOptions,
}: AdminSearchProps) {
    const [localValue, setLocalValue] = useState(value);

    // Debounce logic
    useEffect(() => {
        const timer = setTimeout(() => {
            onChange(localValue);
        }, 300);
        return () => clearTimeout(timer);
    }, [localValue, onChange]);

    return (
        <div className="flex flex-col sm:flex-row gap-3 w-full mb-6">
            <div className="relative flex-1 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cima-text-dim group-focus-within:text-cima-gold transition-colors" />
                <input
                    type="text"
                    placeholder={placeholder}
                    value={localValue}
                    onChange={(e) => setLocalValue(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 bg-cima-card border border-cima-border rounded-xl text-sm text-cima-text placeholder:text-cima-text-dim focus:outline-none focus:border-cima-gold/50 focus:ring-1 focus:ring-cima-gold/20 transition-all"
                />
                {localValue && (
                    <button
                        onClick={() => setLocalValue("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-cima-surface text-cima-text-dim hover:text-cima-text transition-colors"
                    >
                        <X className="h-3 w-3" />
                    </button>
                )}
            </div>

            {statusOptions && onStatusChange && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
                    {statusOptions.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => onStatusChange(opt.value)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-mono whitespace-nowrap border transition-all ${status === opt.value
                                    ? "bg-cima-gold text-cima-bg border-cima-gold font-bold shadow-sm shadow-cima-gold/20"
                                    : "border-cima-border text-cima-text-dim hover:border-cima-gold/40 hover:text-cima-text bg-cima-card/50"
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
