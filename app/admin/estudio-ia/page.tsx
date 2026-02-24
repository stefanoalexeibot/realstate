"use client";

import { useState, useRef } from "react";
import {
    Sparkles, ImagePlus, Loader2, Download, Trash2,
    Wand2, Layout, Sofa, Eraser, DownloadCloud, AlertCircle, CheckCircle2
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const MODES = [
    {
        id: "cleanup",
        label: "Limpieza IA",
        icon: Eraser,
        desc: "Elimina objetos, cables y desorden automáticamente.",
        color: "text-red-400",
        bg: "bg-red-400/10"
    },
    {
        id: "furnish",
        label: "Amueblado IA",
        icon: Sofa,
        desc: "Añade muebles modernos y decoración a espacios vacíos.",
        color: "text-blue-400",
        bg: "bg-blue-400/10"
    },
    {
        id: "remodel",
        label: "Remodelación IA",
        icon: Layout,
        desc: "Cambia pisos, paredes y acabados manteniendo la estructura.",
        color: "text-amber-400",
        bg: "bg-amber-400/10"
    },
];

export default function AIStudio() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [mode, setMode] = useState("furnish");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [errorDetails, setErrorDetails] = useState<any[] | null>(null);
    const [analysis, setAnalysis] = useState<any>(null);
    const [result, setResult] = useState<string | null>(null); // URL of generated image
    const [status, setStatus] = useState<"idle" | "analyzing" | "transforming" | "done">("idle");
    const [isDemo, setIsDemo] = useState(false);
    const [demoMessage, setDemoMessage] = useState<string | null>(null);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const f = e.target.files?.[0];
        if (f) {
            setFile(f);
            const url = URL.createObjectURL(f);
            setPreview(url);
            setAnalysis(null);
            setResult(null);
            setIsDemo(false);
            setDemoMessage(null);
            setError(null);
            setErrorDetails(null);
            setStatus("idle");
        }
    }

    const compressImage = (file: File): Promise<string> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = document.createElement('img');
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 1600; // Optimal for AI without being too heavy
                    const MAX_HEIGHT = 1600;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.drawImage(img, 0, 0, width, height);
                        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                        resolve(dataUrl);
                    } else {
                        resolve(event.target?.result as string);
                    }
                };
            };
        });
    };

    async function processImage() {
        if (!file) return;

        setLoading(true);
        setError(null);
        setErrorDetails(null);
        setAnalysis(null);
        setResult(null);
        setIsDemo(false);
        setDemoMessage(null);
        setStatus("analyzing");

        try {
            // 1. Compress image client-side to avoid Vercel 4.5MB limit
            const base64 = await compressImage(file);

            // 2. Call Description API (Gemini Vision)
            const descRes = await fetch("/api/ai/describe-room", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: base64, mode }),
            });

            let descData;
            try {
                const text = await descRes.text();
                descData = JSON.parse(text);
            } catch (err: any) {
                console.error("Failed to parse describe-room response:", err);
                throw new Error(descRes.status === 413
                    ? "La imagen es demasiado pesada. El sistema la ha comprimido, pero sigue excediendo el límite. Intenta con otra foto."
                    : "Error inesperado del servidor. Por favor intenta de nuevo.");
            }

            if (!descRes.ok) {
                if (descData.details) setErrorDetails(descData.details);
                throw new Error(descData.error || "Error al analizar imagen");
            }

            setAnalysis(descData.analysis);
            setStatus("transforming");

            // 3. Call Transformation API
            const transformRes = await fetch("/api/ai/transform-property", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    image: base64,
                    mode,
                    analysis: descData.analysis
                }),
            });

            let transformData;
            try {
                const text = await transformRes.text();
                transformData = JSON.parse(text);
            } catch (err: any) {
                console.error("Failed to parse transform-property response:", err);
                throw new Error("Error en la conexión con el motor de IA. Inténtalo de nuevo.");
            }

            if (!transformRes.ok) throw new Error(transformData.error || "Error al transformar imagen");

            setResult(transformData.result);
            setStatus("done");
            if (transformData.isDemo) {
                setIsDemo(true);
                setDemoMessage(transformData.message);
            }

        } catch (err: any) {
            console.error("Process Image Error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const [downloading, setDownloading] = useState(false);

    async function downloadResult() {
        if (!result) return;
        try {
            setDownloading(true);
            const response = await fetch(result);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `cima-ai-${mode}-${Date.now()}.jpg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Error downloading image:", err);
            // Fallback to simple link if fetch fails (CORS)
            const a = document.createElement("a");
            a.href = result;
            a.target = "_blank";
            a.click();
        } finally {
            setDownloading(false);
        }
    }

    return (
        <div className="p-6 sm:p-8 max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="h-4 w-4 text-cima-gold" />
                        <span className="font-mono text-[10px] tracking-[0.2em] text-cima-gold uppercase">Estudio IA</span>
                    </div>
                    <h1 className="font-heading font-bold text-3xl text-cima-text">Staging Virtual</h1>
                    <p className="text-sm text-cima-text-muted mt-1">Transforma tus fotos con inteligencia artificial de nivel mundial.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                {/* Left: Input & Config */}
                <div className="xl:col-span-4 space-y-6">

                    {/* Upload Box */}
                    <div className="rounded-2xl border border-cima-border bg-cima-card p-6 space-y-4">
                        <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">1. Sube tu foto</p>

                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className={cn(
                                "relative aspect-video rounded-xl border-2 border-dashed border-cima-border cursor-pointer overflow-hidden transition-all group",
                                !preview && "hover:border-cima-gold/40 hover:bg-cima-gold/5 lg:py-12",
                                preview && "border-none"
                            )}
                        >
                            {preview ? (
                                <Image src={preview} alt="Preview" fill className="object-cover" />
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center p-4 text-center">
                                    <ImagePlus className="h-8 w-8 text-cima-gold mb-3 group-hover:scale-110 transition-transform" />
                                    <p className="text-sm font-medium text-cima-text">Haz clic para subir</p>
                                    <p className="text-[10px] text-cima-text-dim mt-1">Sugerencia: Fotos con luz natural y gran angular funcionan mejor.</p>
                                </div>
                            )}
                            {preview && !loading && (
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <Wand2 className="h-8 w-8 text-white" />
                                </div>
                            )}
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />

                        {preview && (
                            <button
                                onClick={() => { setFile(null); setPreview(null); setAnalysis(null); setResult(null); }}
                                className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition-colors mx-auto"
                            >
                                <Trash2 className="h-3.5 w-3.5" /> Quitar imagen
                            </button>
                        )}
                    </div>

                    {/* Mode Selection */}
                    <div className="rounded-2xl border border-cima-border bg-cima-card p-6 space-y-4">
                        <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">2. Selecciona Modo</p>

                        <div className="space-y-2">
                            {MODES.map((m) => (
                                <button
                                    key={m.id}
                                    onClick={() => setMode(m.id)}
                                    className={cn(
                                        "w-full flex items-start gap-3 p-3 rounded-xl border transition-all text-left",
                                        mode === m.id
                                            ? "border-cima-gold/50 bg-cima-gold/10 shadow-[0_0_12px_rgba(200,169,110,0.1)]"
                                            : "border-cima-border hover:border-cima-gold/30 hover:bg-cima-surface"
                                    )}
                                >
                                    <div className={cn("p-2 rounded-lg shrink-0", m.bg)}>
                                        <m.icon className={cn("h-4 w-4", m.color)} />
                                    </div>
                                    <div>
                                        <p className={cn("text-xs font-bold", mode === m.id ? "text-cima-gold" : "text-cima-text")}>
                                            {m.label}
                                        </p>
                                        <p className="text-[10px] text-cima-text-dim mt-0.5 leading-tight">{m.desc}</p>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={processImage}
                            disabled={!file || loading}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-cima-gold text-cima-bg font-bold hover:bg-cima-gold-light disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-4"
                        >
                            {loading ? (
                                <><Loader2 className="h-4 w-4 animate-spin" /> Procesando...</>
                            ) : (
                                <><Sparkles className="h-4 w-4" /> Transformar con IA</>
                            )}
                        </button>
                    </div>
                </div>

                {/* Right: Analysis & Result */}
                <div className="xl:col-span-8 space-y-6">

                    {!analysis && !loading && !result && (
                        <div className="h-full min-h-[400px] flex flex-col items-center justify-center rounded-2xl border border-cima-border border-dashed bg-cima-card/30 text-center p-12">
                            <div className="h-16 w-16 rounded-full bg-cima-gold/5 border border-cima-gold/20 flex items-center justify-center mb-4">
                                <Wand2 className="h-6 w-6 text-cima-gold/40" />
                            </div>
                            <h3 className="font-heading font-medium text-cima-text mb-2">Resultados del Estudio</h3>
                            <p className="text-sm text-cima-text-dim max-w-sm">
                                Sube una foto y selecciona un modo para ver la magia de la IA inmobiliaria.
                            </p>
                        </div>
                    )}

                    {isDemo && !loading && (
                        <div className="mb-6 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4 flex items-start gap-4 animate-in fade-in slide-in-from-top-4">
                            <Sparkles className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                            <p className="text-xs text-blue-400/80 leading-relaxed">
                                <strong>Nota:</strong> {demoMessage}
                            </p>
                        </div>
                    )}

                    {loading && (
                        <div className="h-full min-h-[400px] flex flex-col items-center justify-center rounded-2xl border border-cima-border bg-cima-card p-12 text-center">
                            <div className="relative mb-6">
                                <div className="absolute inset-0 bg-cima-gold blur-2xl opacity-20 animate-pulse" />
                                <Loader2 className="h-12 w-12 text-cima-gold animate-spin relative" />
                            </div>
                            <h3 className="font-heading font-bold text-xl text-cima-text mb-2">
                                {status === "analyzing" ? "Analizando habitación..." : "Transformando espacio..."}
                            </h3>
                            <p className="text-sm text-cima-text-muted max-w-sm mx-auto">
                                {status === "analyzing"
                                    ? "La IA está identificando la arquitectura, iluminación y estilo de tu espacio."
                                    : "Generando nueva versión con Fal.ai. Esto suele tardar entre 5 y 10 segundos."}
                            </p>

                            <div className="mt-8 w-64 mx-auto h-1.5 bg-cima-surface border border-cima-border rounded-full overflow-hidden">
                                <div
                                    className={cn(
                                        "h-full bg-cima-gold transition-all duration-[2000ms] ease-in-out",
                                        status === "analyzing" ? "w-1/3" : "w-4/5"
                                    )}
                                />
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className={cn(
                            "rounded-2xl border p-6 flex items-start gap-4",
                            error.includes("Límite") || error.includes("Quota")
                                ? "border-amber-500/20 bg-amber-500/10"
                                : "border-red-500/20 bg-red-500/10"
                        )}>
                            <AlertCircle className={cn(
                                "h-5 w-5 shrink-0 mt-0.5",
                                error.includes("Límite") || error.includes("Quota") ? "text-amber-400" : "text-red-400"
                            )} />
                            <div>
                                <p className={cn(
                                    "text-sm font-bold",
                                    error.includes("Límite") || error.includes("Quota") ? "text-amber-400" : "text-red-400"
                                )}>
                                    {error.includes("Límite") || error.includes("Quota") ? "Límite de uso excedido" : "Error en el proceso"}
                                </p>
                                <p className={cn(
                                    "text-xs mt-1",
                                    error.includes("Límite") || error.includes("Quota") ? "text-amber-400/80" : "text-red-400/80"
                                )}>{error}</p>

                                {errorDetails && (
                                    <div className="mt-4 space-y-2">
                                        <p className="text-[10px] text-cima-text-dim uppercase tracking-wider font-mono">Detalles técnicos por proveedor:</p>
                                        {errorDetails.map((detail, idx) => (
                                            <div key={idx} className="bg-black/20 p-2.5 rounded-lg border border-white/5 flex items-start gap-2">
                                                <div className="text-[10px] font-bold text-cima-text-dim min-w-[70px] uppercase">{detail.provider}:</div>
                                                <p className="text-[11px] text-cima-text-muted leading-relaxed italic">{detail.message}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {error.includes("configuración") && (
                                    <div className="mt-4 p-3 bg-black/20 rounded-lg border border-cima-gold/20">
                                        <p className="text-[10px] text-cima-gold/70 leading-relaxed uppercase tracking-wider font-mono mb-2">Sugerencia del sistema</p>
                                        <p className="text-[11px] text-cima-text-muted leading-relaxed">
                                            Parece que faltan variables de entorno en **Vercel**. Asegúrate de agregar `GROQ_API_KEY` con el valor que me pasaste en el panel de configuración de tu proyecto.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {(analysis || result) && !loading && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Analysis Sidebar */}
                            <div className="rounded-2xl border border-cima-border bg-cima-card p-6 space-y-5">
                                <div className="flex items-center gap-2">
                                    <Wand2 className="h-4 w-4 text-cima-gold" />
                                    <p className="font-mono text-[10px] tracking-[0.15em] text-cima-gold uppercase">Análisis Inteligente</p>
                                </div>

                                {analysis && (
                                    <div className="space-y-4">
                                        <div className="bg-cima-surface p-3 rounded-xl border border-cima-border">
                                            <p className="text-[10px] text-cima-text-dim uppercase mb-1">Habitación detectada</p>
                                            <p className="text-sm font-medium text-cima-text capitalize">{analysis.room_type}</p>
                                        </div>
                                        <div className="bg-cima-surface p-3 rounded-xl border border-cima-border">
                                            <p className="text-[10px] text-cima-text-dim uppercase mb-1">Estilo y Luz</p>
                                            <p className="text-sm font-medium text-cima-text">{analysis.style} · {analysis.lighting}</p>
                                        </div>
                                        <div className="bg-cima-surface p-3 rounded-xl border border-cima-border">
                                            <p className="text-[10px] text-cima-text-dim uppercase mb-1">AI Prompt Generado</p>
                                            <p className="text-[11px] text-cima-text-muted leading-relaxed font-mono mt-1">
                                                {analysis.target_prompt}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="pt-4 border-t border-cima-border">
                                    <div className="flex items-center gap-2 mb-3">
                                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                                        <span className="text-xs font-medium text-cima-text">Imagen lista para usar</span>
                                    </div>
                                    <button
                                        onClick={downloadResult}
                                        disabled={downloading}
                                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-cima-border bg-cima-surface text-sm font-semibold text-cima-text hover:bg-cima-card hover:border-cima-gold/40 transition-all disabled:opacity-50"
                                    >
                                        {downloading ? (
                                            <><Loader2 className="h-4 w-4 animate-spin" /> Descargando...</>
                                        ) : (
                                            <><DownloadCloud className="h-4 w-4 text-cima-gold" /> Descargar alta resolución</>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Result View */}
                            <div className="rounded-2xl border border-cima-border bg-cima-card overflow-hidden">
                                <div className="p-4 border-b border-cima-border bg-cima-surface/50 flex items-center justify-between">
                                    <p className="font-mono text-[10px] tracking-[0.15em] text-cima-text-dim uppercase">Resultado final</p>
                                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cima-gold/10 text-cima-gold text-[9px] font-bold uppercase">
                                        AI Enhanced
                                    </span>
                                </div>
                                <div className="relative aspect-[4/3] bg-cima-surface">
                                    {result && <Image src={result} alt="AI Result" fill className="object-cover" />}
                                </div>
                            </div>

                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
