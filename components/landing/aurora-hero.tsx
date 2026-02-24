"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function useIsMobile() {
  const [mobile, setMobile] = useState(true);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768 || window.matchMedia("(pointer: coarse)").matches);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return mobile;
}

export default function AuroraHero() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(200,169,110,0.06) 0%, transparent 70%)" }}
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Layer 1 — warm gold drift */}
      <motion.div
        className="absolute"
        style={{
          width: "140%", height: "140%",
          left: "-20%", top: "-20%",
          background: "radial-gradient(ellipse at 40% 50%, rgba(200,169,110,0.12), rgba(180,130,60,0.04) 40%, transparent 70%)",
          filter: "blur(100px)",
        }}
        animate={{
          x: [0, 60, -30, 0],
          y: [0, -40, 20, 0],
          scale: [1, 1.1, 0.95, 1],
          opacity: [0.7, 0.9, 0.7]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Layer 2 — deeper amber */}
      <motion.div
        className="absolute"
        style={{
          width: "120%", height: "120%",
          left: "-10%", top: "-10%",
          background: "radial-gradient(ellipse at 70% 30%, rgba(212,164,55,0.08), transparent 60%)",
          filter: "blur(110px)",
        }}
        animate={{
          x: [0, -50, 40, 0],
          y: [0, 30, -50, 0],
          scale: [0.9, 1.05, 0.9],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      {/* Layer 3 — subtle gold highlight */}
      <motion.div
        className="absolute"
        style={{
          width: "80%", height: "80%",
          left: "10%", top: "10%",
          background: "radial-gradient(circle at 50% 50%, rgba(200,169,110,0.06), transparent 50%)",
          filter: "blur(80px)",
        }}
        animate={{
          x: [0, 30, -40, 0],
          y: [0, -30, 40, 0],
          scale: [1, 1.15, 1]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
