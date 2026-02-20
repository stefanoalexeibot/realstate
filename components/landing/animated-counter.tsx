"use client";

import { useEffect, useRef, useState } from "react";

export default function AnimatedCounter({
  to,
  from = 0,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1.8,
  className = "",
}: {
  to: number;
  from?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(from);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let startTime: number | null = null;

          const animate = (ts: number) => {
            if (!startTime) startTime = ts;
            const elapsed = ts - startTime;
            const progress = Math.min(elapsed / (duration * 1000), 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(from + (to - from) * eased);
            if (progress < 1) requestAnimationFrame(animate);
            else setValue(to);
          };

          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [to, from, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{value.toFixed(decimals)}{suffix}
    </span>
  );
}
