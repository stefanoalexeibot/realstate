import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { zone, m2, bedrooms, propertyType, mode } = await req.json(); // mode: 'simple' | 'detailed'

        if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
            return NextResponse.json({ error: "Falta GOOGLE_GENERATIVE_AI_API_KEY" }, { status: 500 });
        }

        const supabase = createClient();

        // 1. Fetch comparables
        const { data: comps } = await supabase
            .from("re_properties")
            .select("title, price, area_m2, bedrooms, neighborhood, property_type")
            .eq("status", "active")
            .eq("operation_type", "venta")
            .ilike("neighborhood", `%${zone.split(" ")[0]}%`)
            .limit(10);

        const compsContext = comps && comps.length > 0
            ? comps.map(c => `- ${c.title} en ${c.neighborhood}: $${c.price.toLocaleString()} MXN (${c.area_m2}m², ${c.bedrooms} rec)`).join("\n")
            : "No hay comparables exactos en esta zona, usa promedios generales de Monterrey.";

        // 1. Attempt with standard model
        // Switching to the 'gemini-flash-latest' alias which we verified is available for this key
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const systemPrompt = mode === 'detailed'
            ? `Eres un perito valuador experto en Monterrey. Genera un REPORTE TÉCNICO DETALLADO para el dueño de una propiedad con estas características: Zona ${zone}, ${m2}m², ${bedrooms} recámaras, tipo ${propertyType}.
         Contexto de mercado actual (propiedades activas):
         ${compsContext}
         
         El reporte debe incluir:
         1. Análisis de posicionamiento competitivo.
         2. Sugerencias de precio basadas en los comparables.
         3. 3 consejos específicos para aumentar el valor de venta.
         Usa un tono profesional, directo y persuasivo. Formato Markdown limitado a 3 párrafos cortos.`
            : `Eres un asistente de ventas inmobiliarias. Genera un INSIGHT RÁPIDO Y ATRACTIVO para un visitante de landing page que busca valuar su casa en ${zone}.
         Características: ${m2}m², ${bedrooms} recámaras.
         Contexto comparativo:
         ${compsContext}
         
         Genera 2 frases cortas y motivadoras sobre por qué es un buen momento para vender en esa zona basado en los datos. No des precios exactos, enfócate en la demanda y oportunidad.`;

        // Retry logic for 503/429 errors
        let text = "";
        let lastError = null;
        const maxRetries = 3;

        for (let i = 0; i < maxRetries; i++) {
            try {
                const result = await model.generateContent(systemPrompt);
                const response = await result.response;
                text = response.text();
                if (text) break; // Success
            } catch (e: any) {
                lastError = e;
                console.error(`Gemini attempt ${i + 1} failed:`, e.message);
                // If it's a 503 or 429, wait and retry
                if (e.message.includes("503") || e.message.includes("429") || i < maxRetries - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Incremental wait
                    continue;
                }
                throw e;
            }
        }

        if (!text && lastError) {
            return NextResponse.json({
                error: `La IA está saturada (Error 503). Por favor intenta de nuevo en unos segundos. Detalles: ${lastError.message}`
            }, { status: 503 });
        }

        return NextResponse.json({ insight: text });

    } catch (error: any) {
        console.error("Appraisal Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
