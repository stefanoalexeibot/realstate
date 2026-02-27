"use client";

import { useState, useRef } from "react";
import { FileText, Download, Loader2, BedDouble, Bath, Maximize2, Car, MapPin, Building2 } from "lucide-react";
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
            <div className="grid grid-cols-1 gap-3 w-full">
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

                <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                        `Hola, me gustaría compartirte esta propiedad de Cima Propiedades: \n\n*${property.title}*\nPrecio: ${formatPrice(property.price)}${property.operation_type === "renta" ? "/mes" : ""}\n\nVer más detalles aquí: ${window.location.origin}/propiedades/${property.slug}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 px-4 py-3 text-sm font-medium text-[#25D366] hover:bg-[#25D366]/20 transition-all shadow-lg shadow-black/10"
                >
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-1.557-.594-2.186-1.15-.291-.258-.517-.552-.705-.826a4.803 4.803 0 0 1-.806-1.879c-.066-.37-.024-.658.114-.853.116-.164.249-.234.364-.325l.182-.136c.115-.084.183-.109.265-.109.083 0 .15.011.216.14.066.128.261.636.299.715.038.079.063.173.013.272s-.075.161-.15.249c-.075.088-.158.177-.226.242s-.088.136.013.31c.219.38.544.757.886 1.045.334.281.677.477 1.077.625.114.043.208.031.282-.05.074-.081.332-.387.42-.519.088-.131.183-.11.312-.062l.853.405c.13.062.213.099.255.161.041.063.041.365-.103.77z" />
                    </svg>
                    Enviar por WhatsApp
                </a>
            </div>

            {/* ── Template Oculto para PDF ── */}
            <div ref={templateRef} style={{ display: "none" }} className="font-sans">

                {/* PÁGINA 1: PORTADA Y DATOS */}
                <div id="pdf-page-1" className="bg-[#0F172A] text-white w-[800px] h-[1132px] relative overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="p-12 pb-6 border-b border-white/10 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-[#C8A96E]/10 border border-[#C8A96E]/30 flex items-center justify-center">
                                <Building2 className="h-5 w-5 text-[#C8A96E]" />
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="text-xl font-bold text-white">CIMA</span>
                                <span className="text-[10px] tracking-[0.2em] text-white/40 uppercase">Propiedades</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[#C8A96E] text-sm font-mono uppercase tracking-widest">Ficha Técnica Oficial</p>
                            <p className="text-white/30 text-[10px] mt-1 italic">Excelencia Inmobiliaria</p>
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
                            <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line">
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
