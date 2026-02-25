import type { ReactNode } from "react";

export default function LpLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-cima-bg">
            {children}
        </div>
    );
}
