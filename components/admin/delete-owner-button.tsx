"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
    ownerId: string;
}

export default function DeleteOwnerButton({ ownerId }: Props) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleDelete() {
        if (!confirm("¿Estás seguro de eliminar este propietario? Esta acción romperá su acceso al portal.")) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/admin/propietarios/${ownerId}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Error al eliminar");

            router.refresh(); // Refresh server component
        } catch (err) {
            alert("No se pudo eliminar al propietario.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="p-1.5 rounded-lg text-cima-text-dim hover:text-red-400 hover:bg-red-400/10 transition-colors"
            title="Eliminar propietario"
        >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </button>
    );
}
