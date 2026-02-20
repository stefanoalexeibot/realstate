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
          width: "120%", height: "120%",
          left: "-10%", top: "-10%",
          background: "radial-gradient(ellipse at 40% 50%, rgba(200,169,110,0.09), rgba(180,130,60,0.05) 40%, transparent 65%)",
          filter: "blur(80px)",
        }}
        animate={{ x: [0, 40, -20, 0], y: [0, -30, 15, 0], scale: [1, 1.06, 0.97, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Layer 2 — deeper amber */}
      <motion.div
        className="absolute"
        style={{
          width: "100%", height: "100%",
          left: "0%", top: "0%",
          background: "radial-gradient(ellipse at 65% 40%, rgba(212,164,55,0.07), transparent 55%)",
          filter: "blur(90px)",
        }}
        animate={{ x: [0, -35, 25, 0], y: [0, 20, -35, 0], scale: [1, 0.94, 1.08, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Layer 3 — subtle highlight */}
      <motion.div
        className="absolute"
        style={{
          width: "60%", height: "60%",
          left: "20%", top: "15%",
          background: "radial-gradient(circle at 55% 45%, rgba(200,169,110,0.05), transparent 55%)",
          filter: "blur(60px)",
        }}
        animate={{ x: [0, 20, -15, 0], y: [0, -15, 20, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
