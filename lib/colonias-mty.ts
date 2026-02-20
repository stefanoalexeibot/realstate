/**
 * Colonias y fraccionamientos del Área Metropolitana de Monterrey, Nuevo León.
 * Formato: "Colonia — Municipio"
 */
export interface Colonia {
  name: string;
  municipality: string;
}

export const COLONIAS_MTY: Colonia[] = [
  // ── Monterrey ────────────────────────────────────────────────────────────
  { name: "Centro", municipality: "Monterrey" },
  { name: "Obispado", municipality: "Monterrey" },
  { name: "Mitras Centro", municipality: "Monterrey" },
  { name: "Mitras Norte", municipality: "Monterrey" },
  { name: "Mitras Sur", municipality: "Monterrey" },
  { name: "Mitras Poniente", municipality: "Monterrey" },
  { name: "Del Valle", municipality: "Monterrey" },
  { name: "Colinas del Valle", municipality: "Monterrey" },
  { name: "Jardines del Valle", municipality: "Monterrey" },
  { name: "Cumbres 1er Sector", municipality: "Monterrey" },
  { name: "Cumbres 2do Sector", municipality: "Monterrey" },
  { name: "Cumbres 3er Sector", municipality: "Monterrey" },
  { name: "Cumbres 4to Sector", municipality: "Monterrey" },
  { name: "Cumbres 5to Sector", municipality: "Monterrey" },
  { name: "Cumbres 6to Sector", municipality: "Monterrey" },
  { name: "Cumbres 7mo Sector", municipality: "Monterrey" },
  { name: "Cumbres 8vo Sector", municipality: "Monterrey" },
  { name: "Cumbres Elite", municipality: "Monterrey" },
  { name: "Cumbres Platino", municipality: "Monterrey" },
  { name: "Cumbres de Juárez", municipality: "Monterrey" },
  { name: "San Jerónimo", municipality: "Monterrey" },
  { name: "La Huasteca", municipality: "Monterrey" },
  { name: "Contry", municipality: "Monterrey" },
  { name: "Country La Silla", municipality: "Monterrey" },
  { name: "Contry Sol", municipality: "Monterrey" },
  { name: "Contry Tesoro", municipality: "Monterrey" },
  { name: "Linda Vista", municipality: "Monterrey" },
  { name: "Loma Linda", municipality: "Monterrey" },
  { name: "Lomas del Valle", municipality: "Monterrey" },
  { name: "Lomas de San Francisco", municipality: "Monterrey" },
  { name: "Roma", municipality: "Monterrey" },
  { name: "Las Puentes", municipality: "Monterrey" },
  { name: "Estadio", municipality: "Monterrey" },
  { name: "Chepevera", municipality: "Monterrey" },
  { name: "San Bernabé", municipality: "Monterrey" },
  { name: "Valle Oriente", municipality: "Monterrey" },
  { name: "Valle Alto", municipality: "Monterrey" },
  { name: "Valle de San Ángel", municipality: "Monterrey" },
  { name: "Valle de las Palmas", municipality: "Monterrey" },
  { name: "Colinas de San Jerónimo", municipality: "Monterrey" },
  { name: "Ciudad Satélite", municipality: "Monterrey" },
  { name: "La Fe", municipality: "Monterrey" },
  { name: "Garza Sada", municipality: "Monterrey" },
  { name: "Tecnológico", municipality: "Monterrey" },
  { name: "Loma Larga", municipality: "Monterrey" },
  { name: "Del Nogalar", municipality: "Monterrey" },
  { name: "Ancira", municipality: "Monterrey" },
  { name: "Fierro", municipality: "Monterrey" },
  { name: "Independencia", municipality: "Monterrey" },
  { name: "Terminal", municipality: "Monterrey" },
  { name: "Treviño", municipality: "Monterrey" },
  { name: "Villa del Sol", municipality: "Monterrey" },
  { name: "Fomerrey 1", municipality: "Monterrey" },
  { name: "Pedreras", municipality: "Monterrey" },
  { name: "Nuevo Repueblo", municipality: "Monterrey" },
  { name: "Simón Bolívar", municipality: "Monterrey" },
  { name: "Buenos Aires", municipality: "Monterrey" },
  { name: "Vista Hermosa", municipality: "Monterrey" },

  // ── San Pedro Garza García ───────────────────────────────────────────────
  { name: "Del Valle", municipality: "San Pedro Garza García" },
  { name: "Fuentes del Valle", municipality: "San Pedro Garza García" },
  { name: "Zona Valle", municipality: "San Pedro Garza García" },
  { name: "Jardines del Canadá", municipality: "San Pedro Garza García" },
  { name: "Residencial San Agustín", municipality: "San Pedro Garza García" },
  { name: "Real San Agustín", municipality: "San Pedro Garza García" },
  { name: "Villas de San Agustín", municipality: "San Pedro Garza García" },
  { name: "Sierra Nevada", municipality: "San Pedro Garza García" },
  { name: "Palmeras", municipality: "San Pedro Garza García" },
  { name: "Las Misiones", municipality: "San Pedro Garza García" },
  { name: "Carrizalejo", municipality: "San Pedro Garza García" },
  { name: "Bosques del Valle", municipality: "San Pedro Garza García" },
  { name: "La Rioja", municipality: "San Pedro Garza García" },
  { name: "El Ojo de Agua", municipality: "San Pedro Garza García" },
  { name: "Acueducto", municipality: "San Pedro Garza García" },
  { name: "Hacienda San Agustín", municipality: "San Pedro Garza García" },
  { name: "Colonia del Valle (San Pedro)", municipality: "San Pedro Garza García" },
  { name: "La Fama", municipality: "San Pedro Garza García" },
  { name: "Contry Club", municipality: "San Pedro Garza García" },
  { name: "Cumbres de San Pedro", municipality: "San Pedro Garza García" },
  { name: "Pedregal del Valle", municipality: "San Pedro Garza García" },
  { name: "Loreto y Peña Colorada", municipality: "San Pedro Garza García" },
  { name: "San Patricio", municipality: "San Pedro Garza García" },
  { name: "Punta Contry", municipality: "San Pedro Garza García" },
  { name: "Rincón del Pedregal", municipality: "San Pedro Garza García" },
  { name: "La Estanzuela", municipality: "San Pedro Garza García" },

  // ── San Nicolás de los Garza ─────────────────────────────────────────────
  { name: "Nogalar", municipality: "San Nicolás de los Garza" },
  { name: "Linda Vista (San Nicolás)", municipality: "San Nicolás de los Garza" },
  { name: "Del Norte", municipality: "San Nicolás de los Garza" },
  { name: "Anáhuac", municipality: "San Nicolás de los Garza" },
  { name: "Las Puentes (San Nicolás)", municipality: "San Nicolás de los Garza" },
  { name: "San Nicolás Centro", municipality: "San Nicolás de los Garza" },
  { name: "Industrial del Norte", municipality: "San Nicolás de los Garza" },
  { name: "Residencial Anáhuac", municipality: "San Nicolás de los Garza" },
  { name: "Villas del Oriente", municipality: "San Nicolás de los Garza" },
  { name: "San Gilberto", municipality: "San Nicolás de los Garza" },
  { name: "Primavera", municipality: "San Nicolás de los Garza" },
  { name: "Benito Juárez", municipality: "San Nicolás de los Garza" },
  { name: "Lomas de Vidrieros", municipality: "San Nicolás de los Garza" },
  { name: "Villa Mitras", municipality: "San Nicolás de los Garza" },

  // ── Guadalupe ────────────────────────────────────────────────────────────
  { name: "Guadalupe Centro", municipality: "Guadalupe" },
  { name: "Cuesta Blanca", municipality: "Guadalupe" },
  { name: "Colinas de la Fe", municipality: "Guadalupe" },
  { name: "Lázaro Garza Ayala", municipality: "Guadalupe" },
  { name: "Valle del Roble", municipality: "Guadalupe" },
  { name: "Contry Sol (Guadalupe)", municipality: "Guadalupe" },
  { name: "Las Puentes Sector 1", municipality: "Guadalupe" },
  { name: "Las Puentes Sector 10", municipality: "Guadalupe" },
  { name: "Villas de Guadalupe", municipality: "Guadalupe" },
  { name: "Los Girasoles", municipality: "Guadalupe" },
  { name: "San Rafael", municipality: "Guadalupe" },
  { name: "Hacienda la Silla", municipality: "Guadalupe" },
  { name: "Paseo de San Jemo", municipality: "Guadalupe" },
  { name: "El Barro", municipality: "Guadalupe" },
  { name: "Balcones de la Silla", municipality: "Guadalupe" },

  // ── Apodaca ──────────────────────────────────────────────────────────────
  { name: "Apodaca Centro", municipality: "Apodaca" },
  { name: "Cumbres del Sur", municipality: "Apodaca" },
  { name: "Las Villas", municipality: "Apodaca" },
  { name: "Real Palmas", municipality: "Apodaca" },
  { name: "Las Palmas", municipality: "Apodaca" },
  { name: "Portal del Norte", municipality: "Apodaca" },
  { name: "Villas del Río", municipality: "Apodaca" },
  { name: "Privadas de Apodaca", municipality: "Apodaca" },
  { name: "Hacienda los Morales", municipality: "Apodaca" },
  { name: "San Francisco", municipality: "Apodaca" },
  { name: "Del Bosque", municipality: "Apodaca" },

  // ── General Escobedo ─────────────────────────────────────────────────────
  { name: "Cuauhtémoc", municipality: "General Escobedo" },
  { name: "Escobedo Centro", municipality: "General Escobedo" },
  { name: "Cortijo del Río", municipality: "General Escobedo" },
  { name: "Privadas del Bosque", municipality: "General Escobedo" },
  { name: "El Fraile", municipality: "General Escobedo" },
  { name: "Los Reales", municipality: "General Escobedo" },
  { name: "Las Torres", municipality: "General Escobedo" },

  // ── Santa Catarina ───────────────────────────────────────────────────────
  { name: "Santa Catarina Centro", municipality: "Santa Catarina" },
  { name: "San Rafael (Santa Catarina)", municipality: "Santa Catarina" },
  { name: "Bosques de Santa Catarina", municipality: "Santa Catarina" },
  { name: "Colinas de Santa Catarina", municipality: "Santa Catarina" },
  { name: "Las Quintas", municipality: "Santa Catarina" },
  { name: "Villas de San Cristóbal", municipality: "Santa Catarina" },
  { name: "La Mesa", municipality: "Santa Catarina" },

  // ── García ───────────────────────────────────────────────────────────────
  { name: "García Centro", municipality: "García" },
  { name: "Villas de García", municipality: "García" },
  { name: "Portal de García", municipality: "García" },

  // ── Juárez ───────────────────────────────────────────────────────────────
  { name: "Juárez Centro", municipality: "Juárez" },
  { name: "Colinas del Aeropuerto", municipality: "Juárez" },
  { name: "Hacienda los Morales (Juárez)", municipality: "Juárez" },

  // ── Santiago ─────────────────────────────────────────────────────────────
  { name: "Santiago Centro", municipality: "Santiago" },
  { name: "La Boca", municipality: "Santiago" },
  { name: "El Barrial", municipality: "Santiago" },
  { name: "San Cristóbal", municipality: "Santiago" },
  { name: "El Cercado", municipality: "Santiago" },
  { name: "Las Adjuntas", municipality: "Santiago" },
];

/** Devuelve la lista ordenada alfabéticamente */
export const COLONIAS_SORTED = [...COLONIAS_MTY].sort((a, b) =>
  a.name.localeCompare(b.name, "es")
);

/** Busca colonias que coincidan con el texto (case-insensitive) */
export function searchColonias(query: string): Colonia[] {
  const q = query.toLowerCase().trim();
  if (!q) return COLONIAS_SORTED;
  return COLONIAS_SORTED.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.municipality.toLowerCase().includes(q)
  ).slice(0, 12);
}
