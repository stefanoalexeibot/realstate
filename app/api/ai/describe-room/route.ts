import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { verifyAdminStatus } from "@/lib/auth-utils";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

const PROMPT_TEMPLATE = (mode: string) => `
  Actúa como un experto en diseño de interiores y staging virtual. 
  Analiza esta imagen de una propiedad inmobiliaria.
  
  MODO SELECCIONADO: ${mode} (opciones: cleanup, remodel, furnish)
  
  Tu tarea es describir detalladamente la habitación para un sistema de IA de generación de imágenes (Stable Diffusion/Flux).
  
  Debes devolver un JSON con:
  1. room_type: Tipo de habitación (sala, recámara, cocina, etc.)
  2. style: Estilo actual detectado.
  3. lighting: Descripción de la iluminación actual.
  4. clutter_description: Lista de objetos que deben removerse (si modo es cleanup).
  5. target_prompt: Un prompt técnico en INGLÉS para la transformación, asegurando realismo fotorrealista de alta gama, iluminación cinematográfica y acabados de lujo.
  
  Si el modo es "furnish", el prompt debe describir la escena FINAL con lujo: "High-end luxury interior photography of this [room_type], professionally furnished with designer modern furniture, velvet and oak textures, elegant decor accents, warm cinematic lighting, wide angle, photorealistic 8k, architectural digest style".
  Si el modo es "cleanup", el prompt debe describir el vacío perfecto: "Minimalist architectural photography of this [room_type] completely empty, pristine polished floors, clean white walls, natural daylight, spacious and airy, immaculate minimalist structure".
  Si el modo es "remodel", el prompt debe describir un cambio radical de materiales: "Modern architectural transformation of this [room_type], premium marble flooring, contemporary wall panelling, integrated designer lighting, high-end luxury finishes, sophisticated interior design overhaul, 8k resolution".
  
  Devuelve ÚNICAMENTE el JSON sin markdown ni bloques de código.
`;

async function analyzeWithGemini(image: string, mode: string, modelName: string = "gemini-2.0-flash") {
    const model = genAI.getGenerativeModel({ model: modelName });
    const prompt = PROMPT_TEMPLATE(mode);

    const result = await model.generateContent([
        prompt,
        {
            inlineData: {
                data: image.split(",")[1] || image,
                mimeType: "image/jpeg",
            },
        },
    ]);

    const response = await result.response;
    const text = response.text();
    const startIndex = text.indexOf('{');
    const endIndex = text.lastIndexOf('}') + 1;

    if (startIndex === -1 || endIndex <= startIndex) {
        throw new Error(`${modelName} devolvió un formato no válido (faltan llaves JSON).`);
    }

    const cleanedJson = text.substring(startIndex, endIndex);
    return JSON.parse(cleanedJson);
}

async function analyzeWithGroq(image: string, mode: string) {
    if (!process.env.GROQ_API_KEY) {
        throw new Error("GROQ_API_KEY no configurada en Vercel.");
    }

    const prompt = PROMPT_TEMPLATE(mode);
    const base64Data = image.split(",")[1] || image;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "meta-llama/llama-4-maverick-17b-128e-instruct",
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: prompt },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:image/jpeg;base64,${base64Data}`
                            }
                        }
                    ]
                }
            ],
            temperature: 0.1,
            max_tokens: 1024,
            response_format: { type: "json_object" }
        })
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(`Groq Error (${response.status}): ${err.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    return JSON.parse(content);
}

export async function POST(req: Request) {
    try {
        const auth = await verifyAdminStatus();
        if (!auth.authorized) {
            return NextResponse.json({ error: auth.error }, { status: 401 });
        }

        const { image, mode } = await req.json();
        if (!image) {
            return NextResponse.json({ error: "No se proporcionó imagen" }, { status: 400 });
        }

        let analysis;
        let providerUsed = "Gemini 2.0";
        const errors: any[] = [];

        try {
            // 1. Gemini 2.0
            analysis = await analyzeWithGemini(image, mode, "gemini-2.0-flash");
        } catch (geminiError: any) {
            errors.push({ provider: "Gemini 2.0", message: geminiError.message });
            console.warn("Gemini 2.0 falló:", geminiError.message);

            try {
                // 2. Groq (Llama 4 Maverick)
                analysis = await analyzeWithGroq(image, mode);
                providerUsed = "Groq (Llama 4)";
            } catch (groqError: any) {
                errors.push({ provider: "Groq", message: groqError.message });
                console.warn("Groq falló:", groqError.message);

                try {
                    // 3. Gemini 3 Flash
                    analysis = await analyzeWithGemini(image, mode, "gemini-3-flash");
                    providerUsed = "Gemini 3";
                } catch (gemini3Error: any) {
                    errors.push({ provider: "Gemini 3", message: gemini3Error.message });
                    console.error("Todos los proveedores fallaron.");

                    return NextResponse.json({
                        error: "Todos los servicios de IA están agotados. Por favor, intenta en unos minutos.",
                        details: errors
                    }, { status: 503 });
                }
            }
        }

        return NextResponse.json({ analysis, provider: providerUsed });

    } catch (error: any) {
        console.error("Error crítico en API AI:", error);
        return NextResponse.json({
            error: "Error interno del servidor.",
            details: error.message
        }, { status: 500 });
    }
}
