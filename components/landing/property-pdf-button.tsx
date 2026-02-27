"use client";

import { useState } from "react";
import { FileText, Download, Loader2 } from "lucide-react";
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

    const generatePDF = async () => {
        setLoading(true);
        try {
            // Crear un contenedor temporal para el diseño del PDF
            const doc = new jsPDF("p", "mm", "a4");
            const pageWidth = doc.internal.pageSize.getWidth();

            // 1. Cabecera con Logo y Branding
            doc.setFillColor(15, 23, 42); // cima-bg (azul muy oscuro)
            doc.rect(0, 0, pageWidth, 40, "F");

            doc.setTextColor(200, 169, 110); // cima-gold
            doc.setFont("helvetica", "bold");
            doc.setFontSize(24);
            doc.text("CIMA PROPIEDADES", 20, 25);

            doc.setFontSize(8);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(255, 255, 255, 0.6);
            doc.text("EXCELENCIA INMOBILIARIA", 20, 32);

            // 2. Título y Precio
            doc.setTextColor(15, 23, 42);
            doc.setFontSize(18);
            doc.setFont("helvetica", "bold");
            doc.text(property.title.toUpperCase(), 20, 55);

            doc.setTextColor(200, 169, 110);
            doc.setFontSize(22);
            doc.text(`${formatPrice(property.price)}${property.operation_type === "renta" ? "/mes" : ""}`, 20, 70);

            // 3. Imagen Principal (si existe)
            if (property.cover_photo) {
                try {
                    const img = await loadImage(property.cover_photo);
                    const imgWidth = pageWidth - 40;
                    const imgHeight = (img.height * imgWidth) / img.width;
                    const finalHeight = Math.min(imgHeight, 80);
                    doc.addImage(property.cover_photo, "JPEG", 20, 80, imgWidth, finalHeight);
                } catch (e) {
                    console.error("Error loading cover photo for PDF", e);
                }
            }

            // 4. Detalles de la propiedad (Iconos simulados con texto)
            let yPos = 175;
            doc.setFillColor(248, 250, 252);
            doc.rect(20, yPos - 5, pageWidth - 40, 25, "F");

            doc.setFontSize(10);
            doc.setTextColor(71, 85, 105);
            doc.setFont("helvetica", "bold");

            const stats = [
                { label: "Recámaras", value: property.bedrooms || 0 },
                { label: "Baños", value: property.bathrooms || 0 },
                { label: "m2 Terreno", value: property.area_m2 || 0 },
                { label: "Cajones", value: property.parking || 0 },
            ];

            stats.forEach((stat, i) => {
                doc.text(stat.label.toUpperCase(), 25 + (i * 45), yPos + 5);
                doc.setFontSize(14);
                doc.setTextColor(15, 23, 42);
                doc.text(String(stat.value), 25 + (i * 45), yPos + 15);
                doc.setFontSize(10);
                doc.setTextColor(71, 85, 105);
            });

            // 5. Ubicación y Descripción
            yPos = 210;
            doc.setTextColor(15, 23, 42);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.text("UBICACIÓN", 20, yPos);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.text(`${property.neighborhood || ""}, ${property.city || ""}`, 20, yPos + 7);

            yPos += 25;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.text("DESCRIPCIÓN", 20, yPos);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            const splitDesc = doc.splitTextToSize(property.description || "", pageWidth - 40);
            doc.text(splitDesc, 20, yPos + 7);

            // 6. Pie de Página / Contacto
            doc.setFillColor(200, 169, 110);
            doc.rect(0, 277, pageWidth, 20, "F");
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(9);
            doc.text("Para más información contacte a su asesor Cima Propiedades", 20, 287);
            doc.text("www.cimapropiedades.com", pageWidth - 60, 287);

            doc.save(`Ficha-${property.slug}.pdf`);
        } catch (error) {
            console.error("PDF Generation error:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadImage = (url: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
            const img = new window.Image();
            img.crossOrigin = "anonymous";
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = url;
        });
    };

    return (
        <button
            onClick={generatePDF}
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-cima-surface border border-cima-border px-4 py-3 text-sm font-medium text-cima-text hover:bg-cima-surface/80 hover:border-cima-gold/40 transition-all"
        >
            {loading ? (
                <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generando Ficha...
                </>
            ) : (
                <>
                    <FileText className="h-4 w-4 text-cima-gold" />
                    Descargar Ficha Técnica PDF
                </>
            )}
        </button>
    );
}
