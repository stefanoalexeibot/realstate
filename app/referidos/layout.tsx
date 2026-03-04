import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Gana $1,490 por Referido | Programa de Afiliados — Aurum",
    description: "Recomienda Aurum a asesores inmobiliarios en Monterrey y gana el 10% de cada venta cerrada. Sin ser cliente, sin inversión, sin límite de referidos.",
    openGraph: {
        title: "Gana $1,490 por cada asesor que refieras a Aurum",
        description: "Programa de afiliados abierto para todos. Comparte tu link, gana comisión. Sin límites.",
        type: "website",
        locale: "es_MX",
        siteName: "Aurum",
    },
};

export default function ReferidosLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
