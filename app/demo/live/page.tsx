import type { Metadata } from "next";
import LiveDemoClient from "@/components/demo/LiveDemoClient";

export const metadata: Metadata = {
    title: "Demo en Vivo | Plataforma Inmobiliaria",
    description: "Demostración en vivo de la plataforma inmobiliaria para asesores.",
    robots: "noindex, nofollow",
};

export default function LiveDemoPage() {
    return <LiveDemoClient />;
}
