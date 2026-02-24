"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import InvitePropietarioModal from "@/components/admin/invite-propietario-modal";

interface Props {
    showAsEmptyState?: boolean;
}

export default function PropietariosClientActions({ showAsEmptyState }: Props) {
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();

    function handleCreated() {
        // Server component revalidates on navigation — just refresh the page
        router.refresh();
    }

    if (showAsEmptyState) {
        return (
            <>
                <button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cima-gold/10 border border-cima-gold/30 text-cima-gold text-sm hover:bg-cima-gold/20 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Crear el primero
                </button>
                {showModal && (
                    <InvitePropietarioModal
                        onClose={() => setShowModal(false)}
                        onCreated={handleCreated}
                    />
                )}
            </>
        );
    }

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cima-gold text-cima-bg text-xs font-semibold hover:bg-cima-gold-light transition-colors"
            >
                <Plus className="h-3.5 w-3.5" />
                Nuevo propietario
            </button>
            {showModal && (
                <InvitePropietarioModal
                    onClose={() => setShowModal(false)}
                    onCreated={handleCreated}
                />
            )}
        </>
    );
}
