"use client";

import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only on desktop
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const el = glowRef.current;
    if (!el) return;

    let rafId: number;
    let targetX = -500;
    let targetY = -500;
    let currentX = -500;
    let currentY = -500;

    function onMove(e: MouseEvent) {
      targetX = e.clientX;
      targetY = e.clientY;
    }

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t;
    }

    function tick() {
      currentX = lerp(currentX, targetX, 0.1);
      currentY = lerp(currentY, targetY, 0.1);
      el!.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
      rafId = requestAnimationFrame(tick);
    }

    window.addEventListener("mousemove", onMove);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed top-0 left-0 z-0 h-[500px] w-[500px] rounded-full opacity-[0.035] blur-[100px] bg-cima-gold hidden md:block"
      aria-hidden
    />
  );
}
