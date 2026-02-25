import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

const MODELS = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-flash-latest"];

const PROMPT = (text: string) => `
Eres un experto en bienes raíces en México. Tu tarea es extraer información estructurada de una descripción de propiedad.

Entrada de texto:
"""
${text}
"""

Extrae los siguientes campos en formato JSON. Si no encuentras un valor, usa null o el valor por defecto indicado:
- title: Un título atractivo y corto (ej. "Casa con Alberca en Cumbres").
- description: Una descripción profesional basada en el texto.
- price: El precio numérico (sin comas ni símbolos).
- operation_type: Debe ser "venta" o "renta".
- property_type: Debe ser uno de: "casa", "departamento", "terreno", "local", "oficina".
- bedrooms: Número de recámaras (entero).
- bathrooms: Número de baños (puede ser decimal ej. 2.5).
- area_m2: Área total o de construcción en metros cuadrados (numérico).
- parking: Número de cajones de estacionamiento (entero).
- neighborhood: Nombre de la colonia o zona.
- city: Ciudad (ej. Monterrey, San Pedro, etc.).
- state: Estado (ej. Nuevo León).
- address: Dirección específica si se menciona, si no null.
- construction_year: Año de construcción si se menciona (entero), si no null.
- features: Una cadena de texto con las amenidades separadas por comas (ej. "Alberca, Jardín, Clima").

Devuelve ÚNICAMENTE el objeto JSON con esta estructura:
{
  "title": string,
  "description": string,
  "price": number,
  "operation_type": "venta" | "renta",
  "property_type": "casa" | "departamento" | "terreno" | "local" | "oficina",
  "bedrooms": number,
  "bathrooms": number,
  "area_m2": number,
  "parking": number,
  "neighborhood": string,
  "city": string,
  "state": string,
  "address": string | null,
  "construction_year": number | null,
  "features": string
}
`;

async function tryGenerate(modelName: string, text: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: modelName });
  const result = await model.generateContent(PROMPT(text));
  const response = await result.response;
  return response.text();
}

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "No se proporcionó texto para procesar" }, { status: 400 });
    }

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json({ error: "Falta la clave de API de Gemini (GOOGLE_GENERATIVE_AI_API_KEY)" }, { status: 500 });
    }

    let responseText = "";
    let lastError: Error | null = null;

    // Intenta cada modelo en orden hasta que uno funcione
    for (const modelName of MODELS) {
      try {
        console.log(`AI Fill: intentando con modelo ${modelName}...`);
        responseText = await tryGenerate(modelName, text);
        if (responseText) {
          console.log(`AI Fill: éxito con modelo ${modelName}`);
          break;
        }
      } catch (e: any) {
        lastError = e;
        console.error(`AI Fill: falló con ${modelName}:`, e.message);
        // Espera breve antes del siguiente intento
        await new Promise((r) => setTimeout(r, 800));
        continue;
      }
    }

    if (!responseText) {
      return NextResponse.json(
        { error: `La IA no pudo responder. Inténtalo de nuevo en unos segundos. (${lastError?.message ?? "Error desconocido"})` },
        { status: 503 }
      );
    }

    try {
      const cleanedJson = responseText.substring(responseText.indexOf("{"), responseText.lastIndexOf("}") + 1);
      const extractedData = JSON.parse(cleanedJson);
      return NextResponse.json({ data: extractedData });
    } catch (parseError: any) {
      console.error("JSON Parse Error:", parseError, responseText);
      return NextResponse.json({ error: "Error al interpretar la respuesta de la IA. Intenta de nuevo." }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Error in AI Fill:", error);
    return NextResponse.json({ error: "Error al procesar con IA: " + error.message }, { status: 500 });
  }
}
