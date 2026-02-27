"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Download, Loader2, BedDouble, Bath, Maximize2, Car, MapPin, Building2, MessageCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Property } from "@/lib/types";
import { getWhatsAppShareUrl } from "@/lib/share-utils";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { createClient } from "@/lib/supabase/client";

interface PropertyPDFButtonProps {
    property: Property;
    photos?: { url: string }[];
    autoShare?: boolean;
}

export default function PropertyPDFButton({ property, photos: initialPhotos, autoShare = false }: PropertyPDFButtonProps) {
    const [loading, setLoading] = useState(false);
    const [photos, setPhotos] = useState<{ url: string }[]>(initialPhotos || []);
    const templateRef = useRef<HTMLDivElement>(null);
    const [loadingPhotos, setLoadingPhotos] = useState(!initialPhotos);
    const hasFetched = useRef(false);
    const hasShared = useRef(false);

    const fetchPhotos = useCallback(async () => {
        if (initialPhotos || hasFetched.current) return;
        setLoadingPhotos(true);
        try {
            const supabase = createClient();
            const { data } = await supabase
                .from("re_photos")
                .select("url")
                .eq("property_id", property.id)
                .order("order", { ascending: true });

            if (data) setPhotos(data);
        } catch (error) {
            console.error("Error fetching photos for PDF:", error);
        } finally {
            setLoadingPhotos(false);
            hasFetched.current = true;
        }
    }, [property.id, initialPhotos]);

    useEffect(() => {
        if (!initialPhotos) {
            fetchPhotos();
        }
    }, [initialPhotos, fetchPhotos]);

    const generatePDF = async (output: "download" | "file" = "download"): Promise<File | void> => {
        if (!templateRef.current) return;
        setLoading(true);

        try {
            const pdf = new jsPDF("p", "mm", "a4");
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const capture = templateRef.current;

            capture.style.display = "block";
            capture.style.position = "fixed";
            capture.style.left = "-9999px";
            capture.style.top = "0";
            capture.style.width = "800px";

            const canvas1 = await html2canvas(capture.querySelector("#pdf-page-1") as HTMLElement, {
                scale: 2,
                useCORS: true,
                backgroundColor: "#090A0D",
                logging: false,
            });

            const imgData1 = canvas1.toDataURL("image/jpeg", 0.95);
            pdf.addImage(imgData1, "JPEG", 0, 0, pageWidth, pageHeight);

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

            capture.style.display = "none";
            const fileName = `Ficha-${property.slug}.pdf`;

            if (output === "file") {
                const pdfBlob = pdf.output("blob");
                return new File([pdfBlob], fileName, { type: "application/pdf" });
            }

            pdf.save(fileName);
        } catch (error) {
            console.error("Error generating PDF:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleShare = useCallback(async () => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (isMobile && navigator.share) {
            try {
                const file = await generatePDF("file");
                // @ts-ignore
                if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        files: [file],
                        title: `Ficha Técnica - ${property.title}`,
                        text: `Te comparto la ficha técnica de ${property.title}`,
                    });
                    return;
                }
            } catch (error) {
                console.error("Error sharing file:", error);
            }
        }

        await generatePDF("download");
        const whatsappUrl = getWhatsAppShareUrl(property, typeof window !== "undefined" ? window.location.origin : "");
        window.open(whatsappUrl, "_blank");
    }, [property, generatePDF]);

    useEffect(() => {
        if (autoShare && photos.length > 0 && !hasShared.current && !loadingPhotos) {
            hasShared.current = true;
            handleShare();
        }
    }, [autoShare, photos, loadingPhotos, handleShare]);

    const photoGroups = [];
    const galleryPhotos = photos.filter(p => p.url !== property.cover_photo);
    for (let i = 0; i < galleryPhotos.length; i += 4) {
        photoGroups.push(galleryPhotos.slice(i, i + 4));
    }

    return (
        <>
            <div className="grid grid-cols-1 gap-3 w-full">
                <button
                    onClick={() => generatePDF("download")}
                    disabled={loading || loadingPhotos}
                    className="flex items-center justify-center gap-2 w-full rounded-xl bg-cima-surface border border-cima-border px-4 py-3 text-sm font-medium text-cima-text hover:bg-cima-surface/80 hover:border-cima-gold/40 transition-all shadow-lg shadow-black/20 disabled:opacity-50"
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Generando PDF...
                        </>
                    ) : (
                        <>
                            <Download className="h-4 w-4 text-cima-gold" />
                            {loadingPhotos ? "Cargando Fotos..." : "Descargar PDF"}
                        </>
                    )}
                </button>

                <button
                    onClick={handleShare}
                    disabled={loading || loadingPhotos}
                    className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 px-4 py-3 text-sm font-medium text-[#25D366] hover:bg-[#25D366]/20 transition-all shadow-lg shadow-black/10 disabled:opacity-50"
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Preparando...
                        </>
                    ) : (
                        <>
                            <MessageCircle className="h-4 w-4" />
                            {loadingPhotos ? "Cargando..." : "Enviar a WhatsApp"}
                        </>
                    )}
                </button>
            </div>

            <div ref={templateRef} style={{ display: "none" }} className="font-sans">
                <div id="pdf-page-1" className="bg-[#090A0D] text-white w-[800px] h-[1132px] relative overflow-hidden flex flex-col font-sans">
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
                        <div className="w-full aspect-[16/10] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl bg-[#12141C]">
                            {property.cover_photo && (
                                <img src={property.cover_photo} alt="" className="w-full h-full object-cover" />
                            )}
                        </div>

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

                        <div className="bg-[#0C0D12] rounded-[2rem] p-8 border border-white/5 flex-1">
                            <h3 className="text-[#C8A96E] text-[10px] font-black uppercase tracking-[0.4em] mb-4 text-center">Descripción de la Propiedad</h3>
                            <p className="text-sm text-white/60 leading-relaxed font-sans whitespace-pre-line text-justify">
                                {property.description}
                            </p>
                        </div>
                    </div>

                    <div className="mt-auto p-10 py-6 bg-[#C8A96E] text-[#090A0D] flex justify-between items-center">
                        <span className="text-xs font-bold font-heading tracking-widest">WWW.CIMAPROPIEDADES.COM</span>
                        <span className="text-[10px] font-black font-mono">ID: {property.slug.slice(0, 8).toUpperCase()}</span>
                    </div>
                </div>

                {photoGroups.map((group, pageIdx) => (
                    <div key={pageIdx} className="pdf-gallery-page bg-[#090A0D] text-white w-[800px] h-[1132px] overflow-hidden flex flex-col font-sans">
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
