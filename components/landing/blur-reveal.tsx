"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface BlurRevealProps {
    children: string;
    className?: string;
    delay?: number;
    as?: "h2" | "h3" | "p" | "span";
}

export default function BlurReveal({
    children,
    className = "",
    delay = 0,
    as: Tag = "h2",
}: BlurRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });

    const words = children.split(" ");

    return (
        <Tag ref={ref as React.RefObject<HTMLHeadingElement>} className={className}>
            {words.map((word, i) => (
                <motion.span
                    key={`${word}-${i}`}
                    className="inline-block mr-[0.25em]"
                    initial={{ filter: "blur(8px)", opacity: 0, y: 8 }}
                    animate={
                        isInView
                            ? { filter: "blur(0px)", opacity: 1, y: 0 }
                            : { filter: "blur(8px)", opacity: 0, y: 8 }
                    }
                    transition={{
                        duration: 0.4,
                        delay: delay + i * 0.06,
                        ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                >
                    {word}
                </motion.span>
            ))}
        </Tag>
    );
}
