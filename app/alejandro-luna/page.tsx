import type { Metadata } from "next";
import AlejandroLanding from "@/components/asesores/alejandro-landing";

const title = "Alejandro Luna | Venta tradicional y compra directa";
const description = "Vende tu casa con Alejandro Luna de Cima Propiedades. Compara la venta tradicional y la compra directa en Nuevo León y elige con asesoría personal.";
const url = "https://www.cimapropiedades.com/alejandro-luna";

export const metadata: Metadata = {
  title: { absolute: `${title} | Cima Propiedades` },
  description,
  alternates: { canonical: url },
  openGraph: { title, description, url, type: "website", locale: "es_MX", siteName: "Cima Propiedades" },
  twitter: { card: "summary", title, description },
};

export default function AlejandroLunaPage({ searchParams }: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)?.slice(0, 120) ?? null;
  return <AlejandroLanding attribution={{
    utmSource: first(searchParams.utm_source),
    utmMedium: first(searchParams.utm_medium),
    utmCampaign: first(searchParams.utm_campaign),
    utmContent: first(searchParams.utm_content),
  }} />;
}
