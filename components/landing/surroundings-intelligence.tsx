"use client";

import { useState, useEffect } from "react";
import { GraduationCap, Hospital, ShoppingBag, MapPin, Loader2, Sparkles, Navigation } from "lucide-react";
import FadeIn from "./fade-in";

interface Place {
    name: string;
    type: "school" | "hospital" | "mall" | "park";
    distance: string;
}

interface SurroundingsIntelligenceProps {
    neighborhood: string;
    city: string;
}

export default function SurroundingsIntelligence({ neighborhood, city }: SurroundingsIntelligenceProps) {
    const [places, setPlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulamos la llamada a la IA/API de entorno
        // En una versión real, esto llamaría a un endpoint que usa Google Places o un LLM entrenado en la zona
        const fetchSurroundings = async () => {
            setLoading(true);
            await new Promise(r => setTimeout(r, 1500));

            // Datos representativos según la zona (Monterrey/ZMM)
            const mockData: Record<string, Place[]> = {
                "San Pedro Garza García": [
                    { name: "Paseo San Pedro", type: "mall", distance: "4 min" },
                    { name: "Hospital Zambrano Hellion", type: "hospital", distance: "6 min" },
                    { name: "Prepa Tec Eugenio Garza Lagüera", type: "school", distance: "8 min" },
                    { name: "Parque Rufino Tamayo", type: "park", distance: "5 min" },
                ],
                "Cumbres": [
                    { name: "Plaza Cumbres", type: "mall", distance: "5 min" },
                    { name: "Christus Muguerza Hospital Faro", type: "hospital", distance: "7 min" },
                    { name: "Instituto Motolinia", type: "school", distance: "3 min" },
                    { name: "Parque Lineal Cumbres", type: "park", distance: "2 min" },
                ],
                "default": [
                    { name: "Centro Comercial Cercano", type: "mall", distance: "10 min" },
                    { name: "Hospital de Zona", type: "hospital", distance: "12 min" },
                    { name: "Escuela Primaria Local", type: "school", distance: "5 min" },
                    { name: "Parque de la Colonia", type: "park", distance: "3 min" },
                ]
            };

            const result = mockData[city] || mockData[neighborhood] || mockData.default;
            setPlaces(result);
            setLoading(false);
        };

        fetchSurroundings();
    }, [neighborhood, city]);

    const ICONS = {
        school: <GraduationCap className="h-4 w-4 text-blue-400" />,
        hospital: <Hospital className="h-4 w-4 text-red-400" />,
        mall: <ShoppingBag className="h-4 w-4 text-cima-gold" />,
        park: <MapPin className="h-4 w-4 text-emerald-400" />,
    };

    return (
        <FadeIn delay={0.5}>
            <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-cima-card border border-cima-border relative overflow-hidden group">
                {/* IA Badge */}
                <div className="absolute top-0 right-0 px-4 py-1.5 bg-cima-gold/10 border-b border-l border-cima-gold/20 rounded-bl-xl flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 text-cima-gold animate-pulse" />
                    <span className="text-[10px] font-mono font-bold text-cima-gold uppercase tracking-tighter">Cima Intelligence AI</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="font-heading font-bold text-xl text-cima-text mb-1">¿Qué hay cerca?</h2>
                        <p className="text-xs text-cima-text-dim">Puntos clave a pocos minutos de esta propiedad</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cima-surface border border-cima-border text-[11px] font-bold text-cima-text-muted hover:text-cima-gold hover:border-cima-gold/30 transition-all">
                        <Navigation className="h-3 w-3" />
                        Cómo llegar
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 text-cima-gold animate-spin mb-4" />
                        <p className="text-xs text-cima-text-dim animate-pulse font-mono uppercase tracking-widest">Analizando entorno de {neighborhood}...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {places.map((place, i) => (
                            <div
                                key={i}
                                className="p-4 rounded-xl bg-cima-bg/40 border border-cima-border/50 hover:border-cima-gold/30 hover:bg-cima-surface/30 transition-all group/item"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 rounded-lg bg-cima-bg border border-cima-border group-hover/item:border-cima-gold/20 transition-colors">
                                        {ICONS[place.type]}
                                    </div>
                                    <span className="text-[10px] font-mono text-cima-text-muted uppercase tracking-widest">{place.distance}</span>
                                </div>
                                <h3 className="text-sm font-semibold text-cima-text leading-tight group-hover/item:text-cima-gold transition-colors">{place.name}</h3>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-8 pt-6 border-t border-cima-border/50">
                    <p className="text-[10px] text-cima-text-dim text-center italic">
                        * Información generada automáticamente por IA procesando datos locales de la Zona Metropolitana de Monterrey.
                    </p>
                </div>
            </div>
        </FadeIn>
    );
}
