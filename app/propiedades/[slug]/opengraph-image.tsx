import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function formatPrice(n: number) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n);
}

export default async function OGImage({ params }: { params: { slug: string } }) {
  let property: {
    title: string;
    price: number;
    neighborhood: string | null;
    operation_type: string;
    cover_photo: string | null;
    property_type: string;
  } | null = null;

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/re_properties?slug=eq.${encodeURIComponent(params.slug)}&select=title,price,neighborhood,operation_type,cover_photo,property_type`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );
    const [data] = await res.json();
    property = data ?? null;
  } catch {
    // fallback to default
  }

  const isRenta = property?.operation_type === "renta";

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          backgroundColor: "#090A0D",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background image */}
        {property?.cover_photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={property.cover_photo}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.35,
            }}
          />
        ) : (
          /* Grid pattern fallback */
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "repeating-linear-gradient(0deg, #C8A96E22 0px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, #C8A96E22 0px, transparent 1px, transparent 60px)",
            }}
          />
        )}

        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, #090A0D 50%, #090A0Daa 80%, transparent 100%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "52px 60px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {/* Badge */}
          <div style={{ display: "flex", gap: 12 }}>
            <div
              style={{
                backgroundColor: isRenta ? "#3B82F620" : "#C8A96E20",
                border: `1px solid ${isRenta ? "#3B82F650" : "#C8A96E50"}`,
                color: isRenta ? "#93C5FD" : "#C8A96E",
                fontFamily: "monospace",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                padding: "6px 14px",
                borderRadius: 6,
              }}
            >
              {isRenta ? "Renta" : "Venta"}
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              color: "#F0ECE6",
              fontSize: property?.title && property.title.length > 50 ? 40 : 52,
              fontWeight: 700,
              lineHeight: 1.1,
              maxWidth: 900,
            }}
          >
            {property?.title ?? "Cima Propiedades"}
          </div>

          {/* Location + price row */}
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {property?.neighborhood && (
              <div style={{ color: "#8A8A8E", fontSize: 22, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "#C8A96E" }}>●</span>
                {property.neighborhood}, Monterrey
              </div>
            )}
            {property?.price && (
              <div style={{ color: "#C8A96E", fontSize: 30, fontWeight: 700 }}>
                {formatPrice(property.price)}{isRenta ? "/mes" : ""}
              </div>
            )}
          </div>
        </div>

        {/* Logo top-right */}
        <div
          style={{
            position: "absolute",
            top: 48,
            right: 60,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 2,
          }}
        >
          <div
            style={{
              backgroundColor: "#C8A96E15",
              border: "1px solid #C8A96E40",
              borderRadius: 10,
              padding: "10px 16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span style={{ color: "#F0ECE6", fontSize: 18, fontWeight: 700 }}>Cima</span>
            <span style={{ color: "#C8A96E", fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", fontFamily: "monospace" }}>Propiedades</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
