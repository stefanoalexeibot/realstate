"use client";

interface Bar {
  label: string;
  value: number;
}

export default function MiniBarChart({ data, color }: { data: Bar[]; color: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="space-y-2">
      {/* Bars */}
      <div className="flex items-end gap-1.5 h-16">
        {data.map((bar, i) => {
          const pct = bar.value / max;
          return (
            <div key={i} className="relative flex-1 h-full flex items-end group">
              <div
                className={`w-full rounded-t-sm ${color} transition-all duration-500 ease-out`}
                style={{ height: `${Math.max(pct * 100, bar.value > 0 ? 8 : 2)}%` }}
              />
              {bar.value > 0 && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 font-mono text-[9px] text-cima-text-dim opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {bar.value}
                </span>
              )}
            </div>
          );
        })}
      </div>
      {/* Labels */}
      <div className="flex gap-1.5">
        {data.map((bar, i) => (
          <div key={i} className="flex-1 text-center">
            <span className="font-mono text-[9px] text-cima-text-dim capitalize">{bar.label}</span>
          </div>
        ))}
      </div>
      {/* Total */}
      <p className="text-[10px] text-cima-text-dim font-mono text-right">{total} total</p>
    </div>
  );
}
