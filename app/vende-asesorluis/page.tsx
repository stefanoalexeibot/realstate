import type { Metadata } from "next";
import { VendeLanding } from "@/components/vende/vende-landing";

export const metadata: Metadata = {
  title: "Vende tu Casa en Menos de 30 Días | Lic. Luis — CIMA Propiedades",
  description: "¿Quieres vender tu casa rápido y al mejor precio? Contáctame, Lic. Luis de CIMA Propiedades. Vendemos casas en Monterrey en menos de 30 días.",
};

export default function VendeLuisPage() {
  return (
    <VendeLanding
      agent={{
        name: "Lic. Luis Darien Garza",
        waRaw: "8140053979",
        waDisplay: "814 005 3979",
        slotsLeft: 2,
        slotsTotal: 8,
      }}
    />
  );
}
