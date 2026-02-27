import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  Audio,
  staticFile,
} from "remotion";

// ─── Tipos ────────────────────────────────────────────────────────────────────
export interface PropertyCardProps {
  title: string;
  price: number;
  operation_type: "venta" | "renta";
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  area_m2: number | null;
  parking: number;
  neighborhood: string | null;
  city: string;
  cover_photo: string | null;
}

export const propertyCardDefaultProps: PropertyCardProps = {
  title: "Casa en Sierra Alta con alberca y jardín",
  price: 4800000,
  operation_type: "venta",
  property_type: "casa",
  bedrooms: 4,
  bathrooms: 3,
  area_m2: 380,
  parking: 2,
  neighborhood: "Sierra Alta",
  city: "Monterrey",
  cover_photo: null,
};

// ─── Colores Cima ─────────────────────────────────────────────────────────────
const C = {
  bg: "#0D0D0F",
  gold: "#C8A96E",
  goldLight: "#D4B87A",
  goldDim: "rgba(200,169,110,0.15)",
  surface: "#161618",
  card: "#1A1A1C",
  border: "rgba(200,169,110,0.2)",
  text: "#F5F4F1",
  textMuted: "#8B8985",
  textDim: "#555350",
};

// ─── Utils ─────────────────────────────────────────────────────────────────────
function formatPrice(n: number): string {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return `$${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M`;
  }
  if (n >= 1_000) {
    return `$${(n / 1_000).toFixed(0)}K`;
  }
  return `$${n.toLocaleString("es-MX")}`;
}

const PROP_LABELS: Record<string, string> = {
  casa: "CASA",
  departamento: "DEPTO",
  terreno: "TERRENO",
  local: "LOCAL",
  oficina: "OFICINA",
};

// ─── Componentes de animación ──────────────────────────────────────────────────

/** Fade in simple */
function FadeIn({
  children,
  from,
  duration = 20,
  delay = 0,
}: {
  children: React.ReactNode;
  from: number;
  duration?: number;
  delay?: number;
}) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [from + delay, from + delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <div style={{ opacity }}>{children}</div>;
}

/** Slide up + fade */
function SlideUp({
  children,
  from,
  duration = 25,
  delay = 0,
  distance = 40,
}: {
  children: React.ReactNode;
  from: number;
  duration?: number;
  delay?: number;
  distance?: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - from - delay,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });
  const opacity = interpolate(frame, [from + delay, from + delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const translateY = interpolate(progress, [0, 1], [distance, 0]);
  return (
    <div style={{ opacity, transform: `translateY(${translateY}px)` }}>
      {children}
    </div>
  );
}

/** Scale + fade (para el logo) */
function ScaleFade({
  children,
  from,
  duration = 30,
}: {
  children: React.ReactNode;
  from: number;
  duration?: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - from,
    fps,
    config: { damping: 12, stiffness: 80 },
  });
  const opacity = interpolate(frame, [from, from + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(progress, [0, 1], [0.7, 1]);
  return (
    <div style={{ opacity, transform: `scale(${scale})` }}>
      {children}
    </div>
  );
}

// ─── Icono SVG inline ──────────────────────────────────────────────────────────
function BedIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7v13M21 7v13M3 12h18M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2" />
      <path d="M9 12v-2a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

function BathIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
      <line x1="10" y1="5" x2="8" y2="7" />
      <path d="M5 17v4M19 17v4" />
      <path d="M14 6h1a2 2 0 0 1 2 2v3a4 4 0 0 1-4 4H5" />
    </svg>
  );
}

function AreaIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h6v6M14 10l6-7M9 21H3v-6M10 14l-7 7" />
    </svg>
  );
}

function CarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-2" />
      <circle cx="7.5" cy="17.5" r="1.5" />
      <circle cx="17.5" cy="17.5" r="1.5" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 13-8 13s-8-7-8-13a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v8h4" />
      <path d="M18 9h2a2 2 0 0 1 2 2v11h-4" />
      <path d="M10 6h4M10 10h4M10 14h4M10 18h4" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.61 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.52 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

// ─── Stat pill ────────────────────────────────────────────────────────────────
function StatPill({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 16,
        padding: "20px 24px",
        minWidth: 110,
        flex: 1,
      }}
    >
      {icon}
      <span style={{ fontFamily: "serif", fontWeight: 700, fontSize: 28, color: C.text, lineHeight: 1 }}>
        {value}
      </span>
      <span style={{ fontFamily: "monospace", fontSize: 11, color: C.textDim, textTransform: "uppercase", letterSpacing: "0.15em" }}>
        {label}
      </span>
    </div>
  );
}

// ─── Logo Cima ─────────────────────────────────────────────────────────────────
function CimaLogo({ size = 1 }: { size?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 * size }}>
      <div
        style={{
          width: 44 * size,
          height: 44 * size,
          borderRadius: 12 * size,
          background: C.goldDim,
          border: `1px solid ${C.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ transform: `scale(${size})` }}>
          <BuildingIcon />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontFamily: "serif", fontWeight: 700, fontSize: 22 * size, color: C.text, lineHeight: 1 }}>
          Cima
        </span>
        <span style={{ fontFamily: "monospace", fontSize: 9 * size, letterSpacing: "0.25em", color: C.textMuted, textTransform: "uppercase" }}>
          Propiedades
        </span>
      </div>
    </div>
  );
}

// ─── Componente principal ──────────────────────────────────────────────────────
export const PropertyCard: React.FC<PropertyCardProps> = ({
  title,
  price,
  operation_type,
  property_type,
  bedrooms,
  bathrooms,
  area_m2,
  parking,
  neighborhood,
  city,
  cover_photo,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isStory = height > width; // 9:16

  // ── Ken Burns en la foto ──────────────────────────────────────────────────
  const photoScale = interpolate(frame, [40, 420], [1, 1.12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Fade del overlay ──────────────────────────────────────────────────────
  const overlayOpacity = interpolate(frame, [40, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Price counter ─────────────────────────────────────────────────────────
  const priceProgress = interpolate(frame, [160, 210], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const animatedPrice = Math.floor(price * priceProgress);

  // ── Stats individual delays ───────────────────────────────────────────────
  const statsStart = 220;
  const stats = [
    bedrooms > 0 && { icon: <BedIcon />, value: bedrooms, label: "Recámaras" },
    bathrooms > 0 && { icon: <BathIcon />, value: bathrooms, label: "Baños" },
    area_m2 && { icon: <AreaIcon />, value: `${area_m2}`, label: "m²" },
    parking > 0 && { icon: <CarIcon />, value: parking, label: "Cajones" },
  ].filter(Boolean) as { icon: React.ReactNode; value: string | number; label: string }[];

  // ── Fade out final ────────────────────────────────────────────────────────
  const finalFade = interpolate(frame, [400, 420], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const padding = isStory ? 60 : 80;
  const contentWidth = isStory ? width - padding * 2 : Math.min(width - padding * 2, 960);
  const contentX = (width - contentWidth) / 2;

  return (
    <AbsoluteFill style={{ background: C.bg, opacity: finalFade }}>

      {/* ── Foto de fondo con Ken Burns ─────────────────────────────────── */}
      <Sequence from={40}>
        <AbsoluteFill style={{ overflow: "hidden" }}>
          {cover_photo ? (
            <Img
              src={cover_photo}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: `scale(${photoScale})`,
                transformOrigin: "center center",
              }}
            />
          ) : (
            /* Placeholder si no hay foto */
            <div
              style={{
                width: "100%",
                height: "100%",
                background: `linear-gradient(135deg, ${C.surface} 0%, #1a1208 50%, ${C.surface} 100%)`,
                transform: `scale(${photoScale})`,
                transformOrigin: "center center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ opacity: 0.08, transform: "scale(8)" }}>
                <BuildingIcon />
              </div>
              {/* Grid pattern */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0.04,
                  backgroundImage: `repeating-linear-gradient(0deg, ${C.gold} 0px, transparent 1px, transparent 80px), repeating-linear-gradient(90deg, ${C.gold} 0px, transparent 1px, transparent 80px)`,
                }}
              />
            </div>
          )}
        </AbsoluteFill>
      </Sequence>

      {/* ── Gradient overlay ────────────────────────────────────────────── */}
      <Sequence from={40}>
        <AbsoluteFill
          style={{
            opacity: overlayOpacity,
            background: isStory
              ? `linear-gradient(to bottom, rgba(13,13,15,0.2) 0%, rgba(13,13,15,0.1) 30%, rgba(13,13,15,0.85) 65%, rgba(13,13,15,0.98) 100%)`
              : `linear-gradient(to right, rgba(13,13,15,0.97) 0%, rgba(13,13,15,0.85) 50%, rgba(13,13,15,0.3) 100%)`,
          }}
        />
      </Sequence>

      {/* ── Intro: Logo fade ────────────────────────────────────────────── */}
      <Sequence from={0} durationInFrames={50}>
        <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ScaleFade from={0} duration={25}>
            <CimaLogo size={2} />
          </ScaleFade>
        </AbsoluteFill>
      </Sequence>

      {/* ── Contenido principal ─────────────────────────────────────────── */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: isStory ? "flex-end" : "center",
          padding: isStory ? `0 ${padding}px ${padding + 40}px` : `0 ${padding}px`,
          left: isStory ? 0 : contentX,
          width: contentWidth,
          right: "auto",
        }}
      >

        {/* Badge tipo operación + tipo propiedad */}
        <Sequence from={80}>
          <SlideUp from={80} delay={0} distance={20}>
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              <span
                style={{
                  padding: "6px 16px",
                  borderRadius: 8,
                  fontSize: 11,
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  background: operation_type === "renta" ? "rgba(59,130,246,0.2)" : C.goldDim,
                  color: operation_type === "renta" ? "#93c5fd" : C.gold,
                  border: `1px solid ${operation_type === "renta" ? "rgba(59,130,246,0.3)" : C.border}`,
                }}
              >
                {operation_type}
              </span>
              <span
                style={{
                  padding: "6px 16px",
                  borderRadius: 8,
                  fontSize: 11,
                  fontFamily: "monospace",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  background: C.card,
                  color: C.textMuted,
                  border: `1px solid ${C.border}`,
                }}
              >
                {PROP_LABELS[property_type] ?? property_type}
              </span>
            </div>
          </SlideUp>
        </Sequence>

        {/* Título */}
        <Sequence from={100}>
          <SlideUp from={100} delay={0} distance={30}>
            <h1
              style={{
                fontFamily: "serif",
                fontWeight: 700,
                fontSize: isStory ? 52 : 56,
                color: C.text,
                lineHeight: 1.1,
                margin: "0 0 28px 0",
                maxWidth: isStory ? "100%" : 700,
              }}
            >
              {title}
            </h1>
          </SlideUp>
        </Sequence>

        {/* Ubicación */}
        <Sequence from={130}>
          <FadeIn from={130} duration={20}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32 }}>
              <MapPinIcon />
              <span style={{ fontFamily: "sans-serif", fontSize: 18, color: C.textMuted }}>
                {neighborhood ? `${neighborhood}, ${city}` : city}
              </span>
            </div>
          </FadeIn>
        </Sequence>

        {/* Precio animado */}
        <Sequence from={160}>
          <SlideUp from={160} delay={0} distance={20}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "baseline",
                gap: 10,
                background: `linear-gradient(135deg, rgba(200,169,110,0.08) 0%, rgba(200,169,110,0.03) 100%)`,
                border: `1px solid rgba(200,169,110,0.25)`,
                borderRadius: 16,
                padding: "20px 32px",
                marginBottom: 36,
                boxShadow: `0 0 60px rgba(200,169,110,0.08)`,
              }}
            >
              <span
                style={{
                  fontFamily: "serif",
                  fontWeight: 900,
                  fontSize: isStory ? 72 : 80,
                  color: C.gold,
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                }}
              >
                {formatPrice(animatedPrice)}
              </span>
              {operation_type === "renta" && (
                <span style={{ fontFamily: "monospace", fontSize: 20, color: C.textMuted }}>/mes</span>
              )}
            </div>
          </SlideUp>
        </Sequence>

        {/* Stats */}
        <Sequence from={statsStart}>
          <div style={{ display: "flex", gap: 12, marginBottom: 40 }}>
            {stats.map((s, i) => (
              <SlideUp key={i} from={statsStart} delay={i * 8} distance={20}>
                <StatPill icon={s.icon} value={s.value} label={s.label} />
              </SlideUp>
            ))}
          </div>
        </Sequence>

        {/* CTA */}
        <Sequence from={310}>
          <FadeIn from={310} duration={25}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: "#25D366",
                  border: "none",
                  borderRadius: 12,
                  padding: "14px 28px",
                  cursor: "pointer",
                }}
              >
                <PhoneIcon />
                <span style={{ fontFamily: "sans-serif", fontWeight: 600, fontSize: 18, color: "white" }}>
                  Preguntar por WhatsApp
                </span>
              </div>
            </div>
          </FadeIn>
        </Sequence>
      </AbsoluteFill>

      {/* ── Logo esquina superior izquierda ─────────────────────────────── */}
      <Sequence from={80}>
        <div
          style={{
            position: "absolute",
            top: padding,
            left: isStory ? padding : contentX + (width - contentWidth) / 2,
          }}
        >
          <FadeIn from={80} duration={20}>
            <CimaLogo size={isStory ? 0.9 : 1} />
          </FadeIn>
        </div>
      </Sequence>

      {/* ── URL esquina superior derecha ─────────────────────────────────── */}
      <Sequence from={310}>
        <div
          style={{
            position: "absolute",
            top: padding + 12,
            right: padding,
          }}
        >
          <FadeIn from={310} duration={20}>
            <span style={{ fontFamily: "monospace", fontSize: 13, color: C.textDim, letterSpacing: "0.1em" }}>
              propiedades-mty.vercel.app
            </span>
          </FadeIn>
        </div>
      </Sequence>

    </AbsoluteFill>
  );
};
