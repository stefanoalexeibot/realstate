import type { Metadata } from "next";
import { VendeLanding } from "@/components/vende/vende-landing";

export const metadata: Metadata = {
  title: "Vende tu Casa en Menos de 30 Días | Lic. Jair — CIMA Propiedades",
  description: "¿Quieres vender tu casa rápido y al mejor precio? Contáctame, Lic. Jair de CIMA Propiedades. Vendemos casas en Monterrey en menos de 30 días.",
};

export default function VendeJairPage() {
  return (
    <VendeLanding
      agent={{
        name: "Lic. Jair Pedraza",
        waRaw: "8115030492",
        waDisplay: "811 503 0492",
        slotsLeft: 4,
        slotsTotal: 8,
      }}
    />
  );
}
