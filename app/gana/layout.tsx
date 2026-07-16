import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Recomienda y Gana $10,000 - $15,000 MXN | CIMA Propiedades",
    description: "Recomienda a un conocido que quiera vender su casa o propiedad en Monterrey y gana una gran comisión. Sin costo, sin compromisos.",
    openGraph: {
        title: "Recomienda y Gana con CIMA Propiedades",
        description: "Gana de $10,000 a $15,000 MXN recomendando a conocidos que vendan su propiedad en Monterrey.",
        type: "website",
        locale: "es_MX",
        siteName: "CIMA Propiedades",
    },
};

export default function GanaLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
