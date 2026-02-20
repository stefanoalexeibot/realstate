export type ZoneConfig = {
  slug: string;
  name: string;
  tag: string;
  description: string;
  priceRange: string;
};

export const ZONES: ZoneConfig[] = [
  {
    slug: "san-pedro-garza-garcia",
    name: "San Pedro Garza García",
    tag: "Premium",
    description: "La zona residencial más exclusiva del área metropolitana de Monterrey. Fraccionamientos privados, amenidades de lujo y la mayor plusvalía de la región.",
    priceRange: "$5M–$30M MXN",
  },
  {
    slug: "valle-oriente",
    name: "Valle Oriente",
    tag: "Ejecutivo",
    description: "Corredor empresarial y residencial de alto nivel. Departamentos modernos, torres corporativas y acceso privilegiado a servicios premium.",
    priceRange: "$3M–$15M MXN",
  },
  {
    slug: "cumbres",
    name: "Cumbres",
    tag: "Familiar",
    description: "La zona familiar por excelencia en Monterrey. Colegios reconocidos, parques, centros comerciales y alta densidad de servicios para familias en crecimiento.",
    priceRange: "$2M–$8M MXN",
  },
  {
    slug: "obispado",
    name: "Obispado",
    tag: "Histórico",
    description: "Zona céntrica con carácter histórico y cultural. Mezcla de residencias tradicionales y departamentos modernos cerca del Cerro del Obispado.",
    priceRange: "$1.5M–$6M MXN",
  },
  {
    slug: "san-jeronimo",
    name: "San Jerónimo",
    tag: "Residencial",
    description: "Zona residencial consolidada con amplio inventario de casas. Tranquilidad, seguridad y buena conectividad hacia San Pedro y el centro de Monterrey.",
    priceRange: "$2M–$9M MXN",
  },
  {
    slug: "monterrey-centro",
    name: "Monterrey Centro",
    tag: "Inversión",
    description: "El centro histórico y financiero de Monterrey. Alta demanda de renta, buena plusvalía en desarrollos nuevos y cercanía a todos los servicios de la ciudad.",
    priceRange: "$1M–$5M MXN",
  },
];

export function getZoneBySlug(slug: string): ZoneConfig | undefined {
  return ZONES.find((z) => z.slug === slug);
}

export function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}
