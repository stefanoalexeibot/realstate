import type { Metadata } from "next";
import { VendeLanding } from "@/components/vende/vende-landing";

export const metadata: Metadata = {
  title: "Vende tu Casa en Menos de 30 Días | CIMA Propiedades Monterrey",
  description: "¿Quieres vender tu casa rápido y al mejor precio? CIMA Propiedades tiene un plan probado para vender en Monterrey en menos de 30 días.",
};

export default function VendePage() {
  return (
    <VendeLanding
      agent={{
        name: "",
        waRaw: "8121980008",
        waDisplay: "812 198 0008",
        slotsLeft: 3,
        slotsTotal: 8,
      }}
    />
  );
}
