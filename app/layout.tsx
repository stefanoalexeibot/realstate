import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Cima Propiedades | Monterrey", template: "%s | Cima Propiedades" },
  description: "Encuentra casas, departamentos y terrenos en venta y renta en Monterrey, Nuevo León. Asesoría personalizada para comprar o vender tu propiedad.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://cimapropiedades.mx"),
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: "Cima Propiedades",
    title: "Cima Propiedades | Tu hogar ideal en Monterrey",
    description: "Casas, departamentos y terrenos en venta y renta en Monterrey, Nuevo León.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cima Propiedades | Tu hogar ideal en Monterrey",
    description: "Casas, departamentos y terrenos en venta y renta en Monterrey, Nuevo León.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-cima-bg text-cima-text font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
