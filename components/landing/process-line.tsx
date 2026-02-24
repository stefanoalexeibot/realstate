"use client";

import { motion } from "framer-motion";

export default function ProcessLine() {
  return (
    <motion.div
      className="absolute top-[22px] left-[10%] right-[10%] h-px origin-left"
      style={{
        background: "linear-gradient(to right, rgba(200,169,110,0.15), rgba(200,169,110,0.6), rgba(200,169,110,0.15))",
      }}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1.4, ease: "easeOut", delay: 0.15 }}
    />
  );
}
