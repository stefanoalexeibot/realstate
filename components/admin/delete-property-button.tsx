"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
    propertyId: string;
}

export default function DeletePropertyButton({ propertyId }: Props) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleDelete() {
        if (!confirm("¿Estás seguro de eliminar esta propiedad? Esta acción eliminará también sus fotos asociadas en la base de datos.")) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/propiedades/${propertyId}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Error al eliminar");

            router.refresh();
        } catch (err) {
            alert("No se pudo eliminar la propiedad.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            title="Eliminar propiedad"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:text-white hover:bg-red-500 border border-red-500/30 hover:border-red-500 disabled:opacity-50 transition-colors"
        >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
            Eliminar
        </button>
    );
}
