import type { Metadata } from "next";
import CompraDirectaLanding from "@/components/compra-directa/compra-directa-landing";

// ── SEO Metadata ───────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Compramos casas en Nuevo León | Cima",
  description:
    "Compra directa de casas en Cadereyta Jiménez, García, Salinas Victoria y Juárez, Nuevo León. Revisamos casas con adeudos o reparaciones. Cuéntanos tu caso por WhatsApp.",
  alternates: {
    canonical: "https://www.cimapropiedades.com/te-compramos",
  },
  openGraph: {
    title: "Cima te compra tu casa directamente — sin intermediarios",
    description:
      "¿Tu casa necesita reparaciones o tiene adeudos? Revisamos tu caso en Cadereyta Jiménez, García, Salinas Victoria y Juárez, Nuevo León.",
    url: "https://www.cimapropiedades.com/te-compramos",
    type: "website",
    locale: "es_MX",
    siteName: "Cima Propiedades",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compramos casas en Nuevo León | Cima",
    description:
      "Compra directa en Cadereyta Jiménez, García, Salinas Victoria y Juárez, Nuevo León. Solicita una revisión por WhatsApp.",
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
    utm_content?: string;
    [key: string]: string | undefined;
  };
}

export default function TeCompramosPage({ searchParams }: PageProps) {
  return (
    <CompraDirectaLanding
      utmSource={searchParams.utm_source ?? null}
      utmMedium={searchParams.utm_medium ?? null}
      utmCampaign={searchParams.utm_campaign ?? null}
      utmContent={searchParams.utm_content ?? null}
    />
  );
}
