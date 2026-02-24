import { NextResponse } from "next/server";
import { verifyAdminStatus } from "@/lib/auth-utils";

export async function POST(req: Request) {
    try {
        const auth = await verifyAdminStatus();
        if (!auth.authorized) {
            return NextResponse.json({ error: auth.error }, { status: 401 });
        }

        const { image, mode, analysis } = await req.json();

        if (!image || !mode || !analysis) {
            return NextResponse.json({ error: "Faltan datos (imagen, modo o análisis)" }, { status: 400 });
        }

        const falKey = process.env.FAL_KEY;
        if (!falKey) {
            return NextResponse.json({
                error: "FAL_KEY no configurada. Por favor, añádela a las variables de entorno.",
                code: "CONFIG_MISSING"
            }, { status: 500 });
        }

        // Map modes to prompts and models
        const basePrompt = analysis.target_prompt;

        // Back to the reliable general model for all modes as requested by user
        let model = "fal-ai/flux/dev/image-to-image";
        let input: any = {
            image_url: image, // Return to direct string format
            prompt: basePrompt,
            strength: 0.85,
            guidance_scale: 8.5,
            num_inference_steps: 35,
        };

        if (mode === 'cleanup') {
            input.strength = 0.8; // Maintain structure for cleanup
        } else if (mode === 'furnish' || mode === 'remodel') {
            input.strength = 0.88; // Higher strength to allow more creative furnishing
            input.guidance_scale = 10;
        }

        console.log(`Calling Fal.ai model ${model} with mode: ${mode}`);

        // Call Fal.ai directly
        const response = await fetch(`https://fal.run/${model}`, {
            method: "POST",
            headers: {
                "Authorization": `Key ${falKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(input)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Fal.ai API Error Details:", JSON.stringify(errorData, null, 2));

            // Extract a readable error message
            let errorMessage = response.statusText;
            if (errorData) {
                if (typeof errorData.detail === 'string') errorMessage = errorData.detail;
                else if (Array.isArray(errorData.detail)) errorMessage = JSON.stringify(errorData.detail);
                else if (errorData.message) errorMessage = errorData.message;
                else errorMessage = JSON.stringify(errorData);
            }

            return NextResponse.json({
                error: `Error de Fal.ai (${response.status}): ${errorMessage}`,
                details: errorData
            }, { status: response.status });
        }

        const data = await response.json();
        const imageUrl = data.images?.[0]?.url || data.image?.url || data.output?.url;

        if (!imageUrl) {
            console.error("No image URL in Fal.ai response:", data);
            throw new Error("La IA no devolvió una URL de imagen válida.");
        }

        return NextResponse.json({ result: imageUrl, provider: "Fal.ai" });

    } catch (error: any) {
        console.error("Transform Property Exception:", error);
        return NextResponse.json({
            error: error.message || "Fallo inesperado en la generación de imagen.",
            details: error.stack
        }, { status: 500 });
    }
}
