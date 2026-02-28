import React from "react";
import TemplateNav from "@/components/template/TemplateNav";
import TemplateHero from "@/components/template/TemplateHero";

export default function DemoPage() {
    return (
        <main className="bg-[#0A0A0B] min-h-screen">
            <TemplateNav />
            <TemplateHero />

            {/* Sección Informativa Demo */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-3 rounded-full flex items-center gap-4 shadow-2xl">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-medium text-white/80">Modo Demo: Editando `brand.ts` verás los cambios aquí.</span>
                </div>
            </div>
        </main>
    );
}
