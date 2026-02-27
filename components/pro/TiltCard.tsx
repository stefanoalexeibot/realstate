"use client";

import { useRef, useState, useCallback, useEffect } from "react";

interface TiltCardProps {
    children: React.ReactNode;
    className?: string;
    intensity?: number;
    glowEffect?: boolean;
}

export default function TiltCard({
    children,
    className = "",
    intensity = 10,
    glowEffect = true,
}: TiltCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [style, setStyle] = useState<React.CSSProperties>({});
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
        checkDesktop();
        window.addEventListener('resize', checkDesktop);
        return () => window.removeEventListener('resize', checkDesktop);
    }, []);

    const handleMove = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (!ref.current || !isDesktop) return;
            const rect = ref.current.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            const rotateX = (0.5 - y) * intensity;
            const rotateY = (x - 0.5) * intensity;

            setStyle({
                transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
                ...(glowEffect
                    ? {
                        background: `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(234,179,8,0.1) 0%, transparent 70%)`,
                    }
                    : {}),
            });
        },
        [intensity, glowEffect, isDesktop]
    );

    const handleLeave = useCallback(() => {
        setStyle({
            transform:
                "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
            background: "transparent",
        });
    }, []);

    return (
        <div
            ref={ref}
            className={`${className} transition-all duration-500 ease-out`}
            style={{
                transformStyle: "preserve-3d",
                ...style,
            }}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
        >
            {children}
        </div>
    );
}
