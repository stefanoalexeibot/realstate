import type { Metadata, Viewport } from "next";
import { Syne, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#090A0D",
};

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
    <html lang="es" className={`${syne.variable} ${dmSans.variable} ${jetbrains.variable}`}>
      <body className="bg-cima-bg text-cima-text font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
