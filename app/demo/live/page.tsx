import type { Metadata } from "next";
import LiveDemoClient from "@/components/demo/LiveDemoClient";

export const metadata: Metadata = {
    title: "Demo en Vivo | Cima Propiedades",
    description: "Demostración en vivo de la plataforma Cima Propiedades para asesores inmobiliarios.",
    robots: "noindex, nofollow",
};

export default function LiveDemoPage() {
    return <LiveDemoClient />;
}
