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
                <div id="pdf-page-1" className="bg-[#090A0D] text-white w-[800px] min-h-[1132px] relative overflow-hidden flex flex-col font-sans">

                    {/* Header con Branding Real */}
                    <div className="p-10 pb-8 border-b border-white/5 flex justify-between items-center bg-[#0C0D12]">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-xl bg-[#C8A96E]/10 border border-[#C8A96E]/30 flex items-center justify-center shadow-lg shadow-[#C8A96E]/5">
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

                    <div className="p-10 flex flex-col gap-10">
                        {/* Hero Image Section */}
                        <div className="relative">
                            <div className="w-full aspect-[16/9] rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-[#12141C]">
                                {property.cover_photo && (
                                    <img src={property.cover_photo} alt="" className="w-full h-full object-cover" />
                                )}
                                <div className="absolute top-6 left-6 flex gap-3">
                                    <div className="bg-[#C8A96E] text-[#090A0D] px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-widest shadow-xl">
                                        {property.operation_type === "renta" ? "En Renta" : "En Venta"}
                                    </div>
                                    <div className="bg-[#090A0D]/60 backdrop-blur-xl text-white border border-white/20 px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-widest shadow-xl">
                                        {property.property_type}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Title & Price Row */}
                        <div className="flex justify-between items-start gap-8">
                            <div className="flex-1">
                                <h2 className="text-4xl font-bold leading-[1.1] text-white font-heading uppercase tracking-tight mb-4">
                                    {property.title}
                                </h2>
                                <div className="flex items-center gap-2 text-white/50 bg-white/5 self-start px-3 py-1.5 rounded-lg border border-white/5">
                                    <MapPin className="h-4 w-4 text-[#C8A96E]" />
                                    <span className="text-sm font-medium">{property.neighborhood}, {property.city}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-mono text-[#C8A96E] uppercase tracking-[0.3em] mb-1 font-bold">Inversión</p>
                                <div className="text-5xl font-black text-[#C8A96E] font-heading flex flex-col items-end">
                                    {formatPrice(property.price)}
                                    {property.operation_type === "renta" && <span className="text-sm text-white/40 font-normal uppercase tracking-widest mt-1">Mensuales</span>}
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid Refined V4 */}
                        <div className="grid grid-cols-4 gap-4">
                            {[
                                { label: "Recámaras", value: property.bedrooms, icon: BedDouble },
                                { label: "Baños", value: property.bathrooms, icon: Bath },
                                { label: "Área m²", value: property.area_m2, icon: Maximize2 },
                                { label: "Cajones", value: property.parking, icon: Car },
                            ].map((stat, i) => (
                                <div key={i} className="bg-[#12141C] border border-white/5 rounded-[2rem] p-6 text-center flex flex-col items-center justify-center gap-2 shadow-inner group">
                                    <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center mb-1">
                                        <stat.icon className="h-5 w-5 text-[#C8A96E]" />
                                    </div>
                                    <p className="text-2xl font-black text-white font-heading">{stat.value}</p>
                                    <p className="text-[9px] text-white/40 uppercase tracking-[0.2em] font-bold">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Descripción Section */}
                        <div className="bg-[#0C0D12] rounded-[2.5rem] p-10 border border-white/5 relative shadow-2xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C8A96E]/20" />
                                <h3 className="text-[#C8A96E] text-[10px] font-black uppercase tracking-[0.4em]">Descripción Detallada</h3>
                                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C8A96E]/20" />
                            </div>
                            <p className="text-base text-white/70 leading-relaxed font-sans whitespace-pre-line text-justify px-4">
                                {property.description}
                            </p>
                        </div>
                    </div>

                    {/* Footer V4 */}
                    <div className="mt-auto p-10 py-8 bg-[#C8A96E] text-[#090A0D] flex justify-between items-center rounded-t-[3rem]">
                        <div className="flex flex-col">
                            <span className="text-sm font-bold font-heading uppercase tracking-widest">CIMA PROPIEDADES</span>
                            <span className="text-[10px] font-medium opacity-80">www.cimapropiedades.com</span>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-0.5">ID de Referencia</p>
                            <p className="text-sm font-black font-mono">{property.slug.slice(0, 8).toUpperCase()}</p>
                        </div>
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
