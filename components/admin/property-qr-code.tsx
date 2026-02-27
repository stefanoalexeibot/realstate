"use client";

import { QRCodeSVG } from "qrcode.react";
import { Download, QrCode } from "lucide-react";
import { useRef } from "react";

interface PropertyQRCodeProps {
    slug: string;
    title: string;
}

export default function PropertyQRCode({ slug, title }: PropertyQRCodeProps) {
    const qrRef = useRef<SVGSVGElement>(null);
    const url = `${window.location.origin}/propiedades/${slug}`;

    const downloadQR = () => {
        const svg = qrRef.current;
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new window.Image();

        img.onload = () => {
            canvas.width = 1000; // Alta resolución para lonas
            canvas.height = 1000;
            if (ctx) {
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 50, 50, 900, 900);

                const pngFile = canvas.toDataURL("image/png");
                const downloadLink = document.createElement("a");
                downloadLink.download = `QR-${slug}.png`;
                downloadLink.href = pngFile;
                downloadLink.click();
            }
        };

        img.src = "data:image/svg+xml;base64," + btoa(svgData);
    };

    return (
        <div className="flex flex-col items-center gap-4 p-6 bg-cima-card border border-cima-border rounded-2xl">
            <div className="bg-white p-4 rounded-xl shadow-inner">
                <QRCodeSVG
                    ref={qrRef}
                    value={url}
                    size={200}
                    level="H"
                    includeMargin={false}
                    imageSettings={{
                        src: "/logo-circular.png", // Asumiendo que existe un logo circular para el centro del QR
                        x: undefined,
                        y: undefined,
                        height: 40,
                        width: 40,
                        excavate: true,
                    }}
                />
            </div>

            <div className="text-center">
                <p className="text-sm font-semibold text-cima-text">Código QR para Lona</p>
                <p className="text-[10px] text-cima-text-muted mt-1 uppercase tracking-widest font-mono">
                    Escanea para ver detalles
                </p>
            </div>

            <button
                onClick={downloadQR}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-cima-gold text-cima-bg text-xs font-bold hover:bg-cima-gold-light transition-colors"
            >
                <Download className="h-3.5 w-3.5" />
                Descargar en Alta (PNG)
            </button>
        </div>
    );
}
