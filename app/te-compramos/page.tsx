import type { Metadata } from "next";
import CompraDirectaLanding from "@/components/compra-directa/compra-directa-landing";

// ── SEO Metadata ───────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Cima te compra tu casa directamente | Monterrey",
  description:
    "¿Quieres vender tu propiedad en Monterrey sin intermediarios? Cima Propiedades te hace una oferta directa. Revisamos hipotecas, reparaciones y documentación. Sin publicación, sin comisiones.",
  alternates: {
    canonical: "/te-compramos",
  },
  openGraph: {
    title: "Cima te compra tu casa directamente — sin intermediarios",
    description:
      "Vende tu propiedad directamente a Cima Propiedades en Monterrey. Sin publicación, sin visitas de desconocidos. Solicita revisión gratis.",
    type: "website",
    locale: "es_MX",
    siteName: "Cima Propiedades",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cima te compra tu casa directamente | Monterrey",
    description:
      "Cima Propiedades compra directamente en el AMM. Sin intermediarios ni comisiones de venta.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// ── Page ───────────────────────────────────────────────────────────────────
// searchParams captura UTMs del servidor (sin acceso a localStorage ni cookies)
interface PageProps {
  searchParams: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    [key: string]: string | undefined;
  };
}

export default function TeCompramosPage({ searchParams }: PageProps) {
  return (
    <CompraDirectaLanding
      utmSource={searchParams.utm_source ?? null}
      utmMedium={searchParams.utm_medium ?? null}
      utmCampaign={searchParams.utm_campaign ?? null}
    />
  );
}
