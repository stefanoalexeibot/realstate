import type { Metadata } from "next";
import { VendeLanding } from "@/components/vende/vende-landing";

export const metadata: Metadata = {
  title: "Vende tu Casa en Menos de 30 Días | Asesor Alejandro — CIMA Propiedades",
  description: "¿Quieres vender tu casa rápido y al mejor precio? Contáctame, Alejandro de CIMA Propiedades. Vendemos casas en Monterrey en menos de 30 días.",
};

export default function VendeAlejandroPage() {
  return (
    <VendeLanding
      agent={{
        name: "Alejandro",
        waRaw: "8121980008",
        waDisplay: "812 198 0008",
        slotsLeft: 3,
        slotsTotal: 8,
      }}
    />
  );
}
