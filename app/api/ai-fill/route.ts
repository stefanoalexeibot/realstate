import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY no configurada en .env.local" }, { status: 503 });
  }

  const { text } = await req.json();
  if (!text?.trim()) return NextResponse.json({ error: "Texto vacío" }, { status: 400 });

  const prompt = `Extrae la información de esta propiedad inmobiliaria y devuelve SOLO un JSON válido sin texto adicional.

Texto del anuncio:
"""
${text.slice(0, 3000)}
"""

Devuelve este JSON (usa null para campos no encontrados):
{
  "title": "string — título descriptivo de la propiedad",
  "description": "string — descripción completa",
  "price": number — precio numérico sin comas ni símbolo $,
  "operation_type": "venta" | "renta",
  "property_type": "casa" | "departamento" | "terreno" | "local" | "oficina",
  "bedrooms": number,
  "bathrooms": number,
  "area_m2": number | null,
  "parking": number,
  "neighborhood": "string — colonia o fraccionamiento",
  "city": "string — ciudad, default Monterrey",
  "state": "string — estado, default Nuevo León",
  "address": "string | null — calle y número si se menciona",
  "features": "string — características separadas por coma (alberca, jardín, etc.)",
  "construction_year": number | null
}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    const raw = data?.content?.[0]?.text ?? "";

    // Extract JSON from response
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON in response");

    const parsed = JSON.parse(match[0]);
    return NextResponse.json({ ok: true, data: parsed });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error al procesar con IA" }, { status: 500 });
  }
}
