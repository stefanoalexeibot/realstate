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
                backgroundColor: "#090A0D",
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
                    backgroundColor: "#090A0D",
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

    // Dividir fotos en grupos de 4 para las páginas de galería (más limpio)
    const photoGroups = [];
    const galleryPhotos = photos.filter(p => p.url !== property.cover_photo);
    for (let i = 0; i < galleryPhotos.length; i += 4) {
        photoGroups.push(galleryPhotos.slice(i, i + 4));
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

                {/* FUNCIÓN PARA RENDERIZAR HEADER COMÚN */}
                {/* (Se repite manualmente en cada página del template) */}

                {/* PÁGINA 1: PORTADA Y DATOS */}
                <div id="pdf-page-1" className="bg-[#090A0D] text-white w-[800px] h-[1132px] relative overflow-hidden flex flex-col font-sans">
                    {/* Header */}
                    <div className="p-10 pb-8 border-b border-white/5 flex justify-between items-center bg-[#0C0D12]">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-xl bg-[#C8A96E]/10 border border-[#C8A96E]/30 flex items-center justify-center">
                                <Building2 className="h-6 w-6 text-[#C8A96E]" />
                            </div>
                            <div className="flex flex-col leading-tight">
                                <span className="text-2xl font-bold tracking-tight text-white font-heading">CIMA</span>
                                <span className="text-[11px] tracking-[0.3em] text-[#C8A96E] font-mono uppercase">Propiedades</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="inline-block bg-[#C8A96E]/10 border border-[#C8A96E]/20 px-3 py-1 rounded-md mb-1">
                                <p className="text-[#C8A96E] text-[10px] font-mono uppercase tracking-[0.2em] font-bold">Ficha Técnica Oficial</p>
                            </div>
                            <p className="text-white/30 text-[10px] italic">Excelencia en Bienes Raíces</p>
                        </div>
                    </div>

                    <div className="p-10 flex flex-col gap-8">
                        {/* Hero Image - Más vertical */}
                        <div className="w-full aspect-[16/10] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl bg-[#12141C]">
                            {property.cover_photo && (
                                <img src={property.cover_photo} alt="" className="w-full h-full object-cover" />
                            )}
                        </div>

                        {/* Title & Price Row */}
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="bg-[#C8A96E] text-[#090A0D] px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                                        {property.operation_type === "renta" ? "En Renta" : "En Venta"}
                                    </span>
                                    <span className="bg-white/5 text-white/60 border border-white/10 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                                        {property.property_type}
                                    </span>
                                </div>
                                <h2 className="text-4xl font-bold leading-tight text-white font-heading uppercase tracking-tight">
                                    {property.title}
                                </h2>
                                <div className="flex items-center gap-2 text-white/40 mt-3">
                                    <MapPin className="h-4 w-4 text-[#C8A96E]" />
                                    <span className="text-sm">{property.neighborhood}, {property.city}</span>
                                </div>
                            </div>

                            <div className="bg-[#12141C] p-8 rounded-[2rem] border border-white/5 flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] font-mono text-[#C8A96E] uppercase tracking-[0.3em] mb-1 font-bold">Inversión Final</p>
                                    <div className="text-5xl font-black text-[#C8A96E] font-heading">
                                        {formatPrice(property.price)}
                                        {property.operation_type === "renta" && <span className="text-lg text-white/40 font-normal ml-3 tracking-widest uppercase">/ Mes</span>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Refined */}
                        <div className="grid grid-cols-4 gap-4">
                            {[
                                { label: "Hab", value: property.bedrooms, icon: BedDouble },
                                { label: "Baños", value: property.bathrooms, icon: Bath },
                                { label: "Área m²", value: property.area_m2, icon: Maximize2 },
                                { label: "Cajones", value: property.parking, icon: Car },
                            ].map((stat, i) => (
                                <div key={i} className="bg-[#12141C] border border-white/5 rounded-3xl p-6 text-center shadow-inner">
                                    <stat.icon className="h-5 w-5 text-[#C8A96E] mx-auto mb-2 opacity-80" />
                                    <p className="text-xl font-black text-white font-heading">{stat.value}</p>
                                    <p className="text-[9px] text-white/30 uppercase tracking-widest font-bold">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Descripción */}
                        <div className="bg-[#0C0D12] rounded-[2rem] p-8 border border-white/5 flex-1">
                            <h3 className="text-[#C8A96E] text-[10px] font-black uppercase tracking-[0.4em] mb-4 text-center">Descripción de la Propiedad</h3>
                            <p className="text-sm text-white/60 leading-relaxed font-sans whitespace-pre-line text-justify">
                                {property.description}
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-auto p-10 py-6 bg-[#C8A96E] text-[#090A0D] flex justify-between items-center">
                        <span className="text-xs font-bold font-heading tracking-widest">WWW.CIMAPROPIEDADES.COM</span>
                        <span className="text-[10px] font-black font-mono">ID: {property.slug.slice(0, 8).toUpperCase()}</span>
                    </div>
                </div>

                {/* PÁGINAS DE GALERÍA UNIFICADAS */}
                {photoGroups.map((group, pageIdx) => (
                    <div key={pageIdx} className="pdf-gallery-page bg-[#090A0D] text-white w-[800px] h-[1132px] overflow-hidden flex flex-col font-sans">
                        {/* Mismo Header para consistencia */}
                        <div className="p-10 pb-8 border-b border-white/5 flex justify-between items-center bg-[#0C0D12]">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-[#C8A96E]/10 border border-[#C8A96E]/30 flex items-center justify-center">
                                    <Building2 className="h-5 w-5 text-[#C8A96E]" />
                                </div>
                                <span className="text-lg font-bold tracking-tight text-white font-heading uppercase">CIMA PROPIEDADES</span>
                            </div>
                            <p className="text-[#C8A96E] text-[10px] font-mono uppercase tracking-[0.2em] font-bold">Galería / Hoja {pageIdx + 1}</p>
                        </div>

                        <div className="flex-1 p-10 grid grid-cols-2 grid-rows-2 gap-8">
                            {group.map((img, i) => (
                                <div key={i} className="rounded-[2rem] overflow-hidden border border-white/10 bg-[#12141C] shadow-xl">
                                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>

                        <div className="p-10 py-6 bg-[#C8A96E] text-[#090A0D] flex justify-between items-center">
                            <span className="text-xs font-bold font-heading tracking-widest">WWW.CIMAPROPIEDADES.COM</span>
                            <span className="text-[10px] font-black font-mono">PÁGINA {pageIdx + 2}</span>
                        </div>
                    </div>
                ))}

            </div>
        </>
    );
}
