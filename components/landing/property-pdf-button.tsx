"use client";

import { useState, useRef } from "react";
import { FileText, Download, Loader2, BedDouble, Bath, Maximize2, Car, MapPin } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Property } from "@/lib/types";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface PropertyPDFButtonProps {
    property: Property;
    photos: { url: string }[];
}

export default function PropertyPDFButton({ property, photos }: PropertyPDFButtonProps) {
    const [loading, setLoading] = useState(false);
    const templateRef = useRef<HTMLDivElement>(null);

    const generatePDF = async () => {
        if (!templateRef.current) return;
        setLoading(true);

        try {
            // Configuraciones de jsPDF
            const pdf = new jsPDF("p", "mm", "a4");
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            // Renderizar el contenedor oculto
            const capture = templateRef.current;

            // Asegurarse de que el elemento sea visible para html2canvas
            capture.style.display = "block";
            capture.style.position = "fixed";
            capture.style.left = "-9999px";
            capture.style.top = "0";
            capture.style.width = "800px"; // Ancho base para el canvas

            // Capturar Página 1 (Portada y Datos)
            const canvas1 = await html2canvas(capture.querySelector("#pdf-page-1") as HTMLElement, {
                scale: 2,
                useCORS: true,
                backgroundColor: "#0F172A",
                logging: false,
            });

            const imgData1 = canvas1.toDataURL("image/jpeg", 0.95);
            pdf.addImage(imgData1, "JPEG", 0, 0, pageWidth, pageHeight);

            // Capturar Páginas de Galería (si existen)
            const galleryPages = capture.querySelectorAll(".pdf-gallery-page");
            for (let i = 0; i < galleryPages.length; i++) {
                pdf.addPage();
                const canvasG = await html2canvas(galleryPages[i] as HTMLElement, {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: "#0F172A",
                    logging: false,
                });
                const imgDataG = canvasG.toDataURL("image/jpeg", 0.9);
                pdf.addImage(imgDataG, "JPEG", 0, 0, pageWidth, pageHeight);
            }

            // Ocultar de nuevo
            capture.style.display = "none";

            pdf.save(`Ficha-${property.slug}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
        } finally {
            setLoading(false);
        }
    };

    // Dividir fotos en grupos de 6 para las páginas de galería
    const photoGroups = [];
    const galleryPhotos = photos.filter(p => p.url !== property.cover_photo);
    for (let i = 0; i < galleryPhotos.length; i += 6) {
        photoGroups.push(galleryPhotos.slice(i, i + 6));
    }

    return (
        <>
            <button
                onClick={generatePDF}
                disabled={loading}
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-cima-surface border border-cima-border px-4 py-3 text-sm font-medium text-cima-text hover:bg-cima-surface/80 hover:border-cima-gold/40 transition-all shadow-lg shadow-black/20"
            >
                {loading ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generando Ficha Premium...
                    </>
                ) : (
                    <>
                        <FileText className="h-4 w-4 text-cima-gold" />
                        Descargar Ficha Técnica PDF
                    </>
                )}
            </button>

            {/* ── Template Oculto para PDF ── */}
            <div ref={templateRef} style={{ display: "none" }} className="font-sans">

                {/* PÁGINA 1: PORTADA Y DATOS */}
                <div id="pdf-page-1" className="bg-[#0F172A] text-white w-[800px] h-[1132px] relative overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="p-12 pb-6 border-b border-white/10 flex justify-between items-end">
                        <div>
                            <h1 className="text-[#C8A96E] text-4xl font-bold tracking-tighter mb-1">CIMA PROPIEDADES</h1>
                            <p className="text-white/40 text-xs tracking-[0.3em] font-light uppercase">Excelencia Inmobiliaria</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[#C8A96E] text-sm font-mono uppercase tracking-widest">Ficha Técnica Oficial</p>
                            <p className="text-white/30 text-[10px] mt-1 italic">Monterrey, Nuevo León</p>
                        </div>
                    </div>

                    <div className="flex-1 p-12 flex flex-col">
                        {/* Hero Image */}
                        <div className="w-full aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative mb-10">
                            {property.cover_photo && (
                                <img src={property.cover_photo} alt="" className="w-full h-full object-cover" />
                            )}
                            <div className="absolute top-6 left-6 flex gap-3">
                                <span className="bg-[#C8A96E] text-[#0F172A] px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest">
                                    {property.operation_type === "renta" ? "En Renta" : "En Venta"}
                                </span>
                                <span className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest">
                                    {property.property_type}
                                </span>
                            </div>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-2 gap-12 mb-10">
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-3xl font-bold leading-tight mb-2 uppercase">{property.title}</h2>
                                    <div className="flex items-center gap-2 text-white/60">
                                        <MapPin className="h-4 w-4 text-[#C8A96E]" />
                                        <span className="text-sm">{property.neighborhood}, {property.city}</span>
                                    </div>
                                </div>

                                <div className="text-5xl font-black text-[#C8A96E]">
                                    {formatPrice(property.price)}
                                    {property.operation_type === "renta" && <span className="text-lg text-white/40 font-normal ml-2">/ mensual</span>}
                                </div>
                            </div>

                            {/* Stats Badge */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                                    <BedDouble className="h-5 w-5 text-[#C8A96E] mx-auto mb-1" />
                                    <p className="text-xl font-bold">{property.bedrooms}</p>
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest">Recámaras</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                                    <Bath className="h-5 w-5 text-[#C8A96E] mx-auto mb-1" />
                                    <p className="text-xl font-bold">{property.bathrooms}</p>
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest">Baños</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                                    <Maximize2 className="h-5 w-5 text-[#C8A96E] mx-auto mb-1" />
                                    <p className="text-xl font-bold">{property.area_m2}m²</p>
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest">Construcción</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                                    <Car className="h-5 w-5 text-[#C8A96E] mx-auto mb-1" />
                                    <p className="text-xl font-bold">{property.parking}</p>
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest">Estacionamiento</p>
                                </div>
                            </div>
                        </div>

                        {/* Descripción */}
                        <div className="flex-1 bg-white/5 rounded-2xl p-8 border border-white/10 relative">
                            <h3 className="text-[#C8A96E] text-xs font-bold uppercase tracking-[0.2em] mb-4">Descripción de la Propiedad</h3>
                            <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line line-clamp-[12]">
                                {property.description}
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-12 py-8 bg-[#C8A96E] text-[#0F172A] flex justify-between items-center font-bold">
                        <span className="text-sm">www.cimapropiedades.com</span>
                        <span className="text-xs uppercase tracking-widest">Propiedad ID: {property.slug.slice(0, 8)}</span>
                    </div>
                </div>

                {/* PÁGINAS DE GALERÍA (Se generan según cantidad de fotos) */}
                {photoGroups.map((group, pageIdx) => (
                    <div key={pageIdx} className="pdf-gallery-page bg-[#0F172A] text-white w-[800px] h-[1132px] p-12 flex flex-col">
                        <h3 className="text-[#C8A96E] text-xs font-bold uppercase tracking-[0.3em] mb-10 text-center">Galería de Imágenes (Hoja {pageIdx + 1})</h3>
                        <div className="flex-1 grid grid-cols-2 gap-8">
                            {group.map((img, i) => (
                                <div key={i} className="rounded-xl overflow-hidden border border-white/10 bg-white/5 aspect-[4/3]">
                                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                        <div className="mt-12 text-center text-white/20 text-[10px] tracking-widest uppercase">
                            Imágenes referenciales de la propiedad
                        </div>
                    </div>
                ))}

            </div>
        </>
    );
}
