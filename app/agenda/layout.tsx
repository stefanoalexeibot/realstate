import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Agenda tu Demo Gratuita | Aurum — Plataforma para Asesores Inmobiliarios en Monterrey",
    description: "¿Cuántas exclusivas perdiste porque tu competencia se ve más profesional? Aurum convierte tu gestión en la plataforma más sofisticada de Monterrey en 7 días. Sin código. Sin complicaciones.",
    openGraph: {
        title: "Convierte tu gestión inmobiliaria en la plataforma más sofisticada de MTY",
        description: "Portal propietario, fichas PDF ultra-lujo y dashboard de exclusivas — listos en 7 días. Agenda una demo gratuita de 15 min. Solo 3 cupos por mes en Monterrey.",
        type: "website",
        locale: "es_MX",
        siteName: "Aurum",
        images: [
            {
                url: "/og-agenda.jpg",
                width: 1200,
                height: 630,
                alt: "Aurum — La plataforma más sofisticada para asesores inmobiliarios en Monterrey",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Aurum — Demo Gratuita para Asesores en Monterrey",
        description: "La plataforma que duplica tus exclusivas. Agenda en 30 segundos. Sin compromiso.",
        images: ["/og-agenda.jpg"],
    },
    keywords: [
        "asesor inmobiliario monterrey",
        "plataforma inmobiliaria monterrey",
        "software inmobiliario mexico",
        "portal propietario",
        "cima pro",
        "exclusivas inmobiliarias",
        "captación de propiedades",
    ],
};

export default function AgendaLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
