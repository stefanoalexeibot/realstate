"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface Props {
    children: ReactNode;
    className?: string;
    /** Distance in pixels before the element enters the viewport to start loading */
    rootMargin?: string;
}

/**
 * Defers rendering of heavy below-the-fold sections until they are
 * about to enter the viewport. Uses IntersectionObserver for efficiency.
 */
export default function LazySection({
    children,
    className,
    rootMargin = "200px",
}: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [rootMargin]);

    return (
        <div ref={ref} className={className}>
            {visible ? children : <div style={{ minHeight: "200px" }} />}
        </div>
    );
}
