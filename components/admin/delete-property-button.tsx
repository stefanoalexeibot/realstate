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
            className="p-1.5 rounded-lg text-cima-text-dim hover:text-red-400 hover:bg-red-400/10 transition-colors"
            title="Eliminar propiedad"
        >
            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
        </button>
    );
}
