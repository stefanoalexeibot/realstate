"use client";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="es">
            <body style={{ backgroundColor: "#090A0D", color: "#fff", fontFamily: "system-ui" }}>
                <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
                    <div style={{ maxWidth: "400px", textAlign: "center" }}>
                        <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#f87171", marginBottom: "0.5rem" }}>
                            Algo salió mal
                        </h2>
                        <p style={{ fontSize: "0.875rem", color: "#9ca3af", marginBottom: "1rem" }}>
                            Ocurrió un error inesperado. Intenta recargar.
                        </p>
                        <p style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "rgba(248,113,113,0.6)", marginBottom: "1.5rem" }}>
                            {error?.message || "Error desconocido"}
                            {error?.digest && ` (${error.digest})`}
                        </p>
                        <button
                            onClick={reset}
                            style={{
                                padding: "0.5rem 1.5rem",
                                borderRadius: "0.5rem",
                                backgroundColor: "#c8a96e",
                                color: "#090A0D",
                                fontWeight: "bold",
                                fontSize: "0.875rem",
                                border: "none",
                                cursor: "pointer",
                            }}
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            </body>
        </html>
    );
}
