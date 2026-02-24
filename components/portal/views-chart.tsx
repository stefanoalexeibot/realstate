"use client";

type DayData = { date: string; count: number };

function Sparkline({ data }: { data: DayData[] }) {
  if (data.length < 2) return null;

  const W = 400;
  const H = 72;
  const max = Math.max(...data.map((d) => d.count), 1);

  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - (d.count / max) * (H - 8);
    return { x, y };
  });

  const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${W} ${H} L 0 ${H} Z`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className="w-full h-full"
    >
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C8A96E" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#C8A96E" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#sparkGrad)" />
      <path d={linePath} fill="none" stroke="#C8A96E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Last point dot */}
      <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="3" fill="#C8A96E" />
    </svg>
  );
}

export default function ViewsChart({ data }: { data: DayData[] }) {
  const total = data.reduce((s, d) => s + d.count, 0);
  const last7 = data.slice(-7).reduce((s, d) => s + d.count, 0);
  const prev7 = data.slice(-14, -7).reduce((s, d) => s + d.count, 0);
  const trend = prev7 > 0 ? Math.round(((last7 - prev7) / prev7) * 100) : null;

  if (total === 0) {
    return (
      <div className="rounded-2xl border border-cima-border bg-cima-card p-5">
        <p className="font-mono text-[10px] tracking-[0.2em] text-cima-gold uppercase mb-1">Vistas por día</p>
        <p className="text-xs text-cima-text-dim mt-2">
          Las vistas diarias comenzarán a registrarse a partir de hoy.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-cima-border bg-cima-card p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="font-mono text-[10px] tracking-[0.2em] text-cima-gold uppercase mb-1">Vistas · últimos 30 días</p>
          <p className="font-heading font-bold text-3xl text-cima-text leading-none">{total}</p>
        </div>
        {trend !== null && (
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-mono ${
            trend >= 0
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-red-500/10 text-red-400 border-red-500/20"
          }`}>
            {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}% vs sem. anterior
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="h-16 w-full">
        <Sparkline data={data} />
      </div>

      <div className="flex justify-between mt-2">
        <span className="font-mono text-[9px] text-cima-text-dim">{data[0]?.date.slice(5)}</span>
        <span className="font-mono text-[9px] text-cima-text-dim">{data[data.length - 1]?.date.slice(5)}</span>
      </div>
    </div>
  );
}
