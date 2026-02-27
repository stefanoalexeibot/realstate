import React from "react";
import {
  AbsoluteFill, Img, interpolate, Easing,
  useCurrentFrame, useVideoConfig, staticFile,
} from "remotion";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { slide } from "@remotion/transitions/slide";
import { noise2D } from "@remotion/noise";
import { loadFont as loadDMSans } from "@remotion/google-fonts/DMSans";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";

// ─── Fonts ────────────────────────────────────────────────────────────────────
const { fontFamily: dmSans } = loadDMSans();
const { fontFamily: playfair } = loadPlayfair();

// ─── Paleta ───────────────────────────────────────────────────────────────────
const C = {
  bg: "#090A0D",
  gold: "#C8A96E",
  goldBright: "#E8C98E",
  goldDim: "rgba(200,169,110,0.12)",
  goldBorder: "rgba(200,169,110,0.22)",
  card: "#161820",
  text: "#F0EDE8",
  textMuted: "#8B8985",
  textDim: "#2A2825",
  red: "#FF3333",
  redSoft: "#FF6666",
};

// ─── Sistema responsivo ───────────────────────────────────────────────────────
function useSz() {
  const { width, height } = useVideoConfig();
  const S = height > width;
  const w = width;
  return {
    S, w,
    px:   Math.round(w * (S ? 0.050 : 0.055)),
    maxW: S ? w * 0.9 : Math.min(w * 0.88, 1100),
    g1:   Math.round(w * 0.012), // gap small
    g2:   Math.round(w * 0.020), // gap medium
    g3:   Math.round(w * 0.032), // gap large
    // tipografía
    disp: Math.round(w * (S ? 0.200 : 0.138)), // "30" gigante
    h1:   Math.round(w * (S ? 0.084 : 0.058)),
    h2:   Math.round(w * (S ? 0.066 : 0.044)),
    h3:   Math.round(w * (S ? 0.050 : 0.034)),
    stat: Math.round(w * (S ? 0.082 : 0.056)),
    body: Math.round(w * (S ? 0.037 : 0.020)),
    sm:   Math.round(w * (S ? 0.030 : 0.016)),
    tag:  Math.round(w * (S ? 0.026 : 0.013)),
    pill: Math.round(w * (S ? 0.028 : 0.015)),
    icon: Math.round(w * (S ? 0.042 : 0.026)),
    box:  Math.round(w * (S ? 0.062 : 0.038)), // logo box
  };
}

// ─── Easing AE-quality ────────────────────────────────────────────────────────
// easeOutExpo → sensación de After Effects
const eOut  = Easing.out(Easing.exp);
// easeOutBack → overshoot (rebote suave)
const eBack = Easing.out(Easing.back(1.4));
// easeInOutQuad → transiciones suaves
const eIO   = Easing.inOut(Easing.quad);

function eased(f: number, from: number, dur: number, ease = eOut) {
  return Math.min(1, Math.max(0, interpolate(f, [from, from + dur], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease,
  })));
}

// ─── Film Grain (animado: seed cambia cada frame) ─────────────────────────────
function FilmGrain({ frame }: { frame: number }) {
  const seed = frame % 200;
  return (
    <>
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <filter id="fg" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="3" seed={seed} stitchTiles="stitch" result="noise" />
            <feColorMatrix type="saturate" values="0" in="noise" result="gray" />
            <feBlend in="SourceGraphic" in2="gray" mode="overlay" />
          </filter>
        </defs>
      </svg>
      <div style={{ position: "absolute", inset: 0, filter: "url(#fg)", opacity: 0.045, pointerEvents: "none" }} />
    </>
  );
}

// ─── Vignette ─────────────────────────────────────────────────────────────────
function Vignette() {
  return (
    <div style={{
      position: "absolute", inset: 0, pointerEvents: "none",
      background: "radial-gradient(ellipse at 50% 50%, transparent 38%, rgba(0,0,0,0.68) 100%)",
    }} />
  );
}

// ─── Aurora noise ─────────────────────────────────────────────────────────────
function NoiseAurora({ frame }: { frame: number }) {
  const t = frame * 0.005;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {[
        { sx: "a", sy: "b", op: 0.088, rx: 70, ry: 54 },
        { sx: "c", sy: "d", op: 0.058, rx: 52, ry: 42 },
        { sx: "e", sy: "f", op: 0.046, rx: 62, ry: 36 },
      ].map((b, i) => (
        <div key={i} style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(ellipse ${b.rx}% ${b.ry}% at ${
            50 + noise2D(b.sx, t, 0) * 28
          }% ${
            45 + noise2D(b.sy, 0, t * 0.85) * 26
          }%, rgba(200,169,110,${(b.op + noise2D(b.sx + "o", t * 0.4, 0) * 0.022).toFixed(3)}) 0%, transparent 70%)`,
        }} />
      ))}
    </AbsoluteFill>
  );
}

function DotGrid() {
  return <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.014, backgroundImage: "radial-gradient(circle at 1px 1px, #C8A96E 1px, transparent 0)", backgroundSize: "52px 52px" }} />;
}

function DiagLines() {
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.018, pointerEvents: "none" }}>
      <line x1="0" y1="100%" x2="38%" y2="0" stroke="#C8A96E" strokeWidth="1" />
      <line x1="100%" y1="100%" x2="62%" y2="0" stroke="#C8A96E" strokeWidth="1" />
    </svg>
  );
}

// ─── Partículas con glow ──────────────────────────────────────────────────────
function Particles({ frame }: { frame: number }) {
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      {Array.from({ length: 32 }, (_, i) => {
        const seed = i * 137.5;
        const x = seed % 100;
        const baseY = (seed * 1.618) % 100;
        const y = ((baseY - frame * (0.03 + (i % 5) * 0.016)) % 110) - 10;
        const op = Math.min(0.35, Math.max(0.03, (Math.sin(i + frame * 0.025) + 1) * 0.18));
        const size = 1.5 + (i % 4) * 1.2;
        const glow = size > 2.5;
        return (
          <div key={i} style={{
            position: "absolute",
            left: `${x + Math.sin(i * 2.1 + frame * 0.01) * 1.6}%`,
            top: `${y}%`,
            width: size, height: size, borderRadius: "50%",
            background: C.gold, opacity: op,
            boxShadow: glow ? `0 0 ${size * 3}px ${size}px rgba(200,169,110,${op * 0.6})` : "none",
          }} />
        );
      })}
    </AbsoluteFill>
  );
}

// ─── CharReveal — char-by-char con blur (técnica icónica AE) ─────────────────
function CharReveal({ text, startAt, charDelay = 2.8, style }: {
  text: string; startAt: number; charDelay?: number; style?: React.CSSProperties;
}) {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0 0.04em", ...style }}>
      {Array.from(text).map((char, i) => {
        if (char === " ") return <span key={i} style={{ width: "0.26em" }} />;
        const p = eased(frame, startAt + i * charDelay, 18, eOut);
        const y = interpolate(p, [0, 1], [36, 0]);
        const blur = interpolate(p, [0, 1], [12, 0]);
        return (
          <span key={i} style={{
            display: "inline-block",
            transform: `translateY(${y}px)`,
            opacity: p,
            filter: `blur(${blur}px)`,
          }}>
            {char}
          </span>
        );
      })}
    </div>
  );
}

// ─── MaskedReveal — texto sube desde debajo de un contenedor (AE classic) ────
function MaskedReveal({ children, startAt, dur = 22, distance = 100, style }: {
  children: React.ReactNode; startAt: number; dur?: number; distance?: number; style?: React.CSSProperties;
}) {
  const frame = useCurrentFrame();
  const p = eased(frame, startAt, dur, eOut);
  return (
    <div style={{ overflow: "hidden", ...style }}>
      <div style={{ transform: `translateY(${interpolate(p, [0, 1], [distance, 0])}px)`, opacity: p }}>
        {children}
      </div>
    </div>
  );
}

// ─── BloomText — texto con glow en capas (bloom real) ─────────────────────────
function BloomText({ children, fontSize, color, style }: {
  children: React.ReactNode; fontSize: number; color: string; style?: React.CSSProperties;
}) {
  const base: React.CSSProperties = { fontFamily: playfair, fontWeight: 900, fontSize, color, margin: 0, lineHeight: 0.85, letterSpacing: "-0.04em", ...style };
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <p style={{ ...base, position: "absolute", inset: 0, filter: "blur(55px)", opacity: 0.5 }}>{children}</p>
      <p style={{ ...base, position: "absolute", inset: 0, filter: "blur(22px)", opacity: 0.38 }}>{children}</p>
      <p style={{ ...base, position: "absolute", inset: 0, filter: "blur(7px)",  opacity: 0.25 }}>{children}</p>
      <p style={{ ...base, position: "relative" }}>{children}</p>
    </div>
  );
}

// ─── Círculo SVG animado alrededor del "30" ───────────────────────────────────
function AnimatedCircle({ startAt, radius }: { startAt: number; radius: number }) {
  const frame = useCurrentFrame();
  const circumference = 2 * Math.PI * radius;
  const p = eased(frame, startAt, 70, eIO);
  const dashOffset = interpolate(p, [0, 1], [circumference, 0]);
  const op = eased(frame, startAt, 14, eOut) * 0.38;
  return (
    <svg
      style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", overflow: "visible", pointerEvents: "none" }}
      width={radius * 2 + 20} height={radius * 2 + 20}
    >
      <circle
        cx={radius + 10} cy={radius + 10} r={radius}
        stroke={C.gold} strokeWidth="1.5" fill="none"
        strokeDasharray={circumference} strokeDashoffset={dashOffset}
        strokeLinecap="round"
        opacity={op}
        transform={`rotate(-90 ${radius + 10} ${radius + 10})`}
      />
    </svg>
  );
}

// ─── Logo ─────────────────────────────────────────────────────────────────────
function CimaLogo({ startAt, sz }: { startAt: number; sz: ReturnType<typeof useSz> }) {
  const frame = useCurrentFrame();
  const p = eased(frame, startAt, 22, eBack);
  const scale = interpolate(p, [0, 1], [0.55, 1]);
  return (
    <div style={{ transform: `scale(${scale})`, opacity: p, display: "inline-flex", alignItems: "center", gap: sz.g1 * 0.9 }}>
      <div style={{ width: sz.box, height: sz.box, borderRadius: sz.box * 0.27, background: C.goldDim, border: `1px solid ${C.goldBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <svg width={sz.box * 0.54} height={sz.box * 0.54} viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.5">
          <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /><path d="M6 12H4a2 2 0 0 0-2 2v8h4" /><path d="M18 9h2a2 2 0 0 1 2 2v11h-4" /><path d="M10 6h4M10 10h4M10 14h4" />
        </svg>
      </div>
      <div>
        <p style={{ fontFamily: playfair, fontWeight: 700, fontSize: sz.h3 * 0.58, color: C.text, margin: 0, lineHeight: 1 }}>Cima</p>
        <p style={{ fontFamily: dmSans, fontSize: sz.tag * 0.74, letterSpacing: "0.28em", color: C.textMuted, margin: 0, textTransform: "uppercase" }}>Propiedades</p>
      </div>
    </div>
  );
}

function Counter({ from, to, startAt, dur = 65 }: { from: number; to: number; startAt: number; dur?: number }) {
  const frame = useCurrentFrame();
  const p = eased(frame, startAt, dur, eIO);
  return <span>{Math.floor(interpolate(p, [0, 1], [from, to]))}</span>;
}

function GoldLine({ startAt, dur = 55, maxW }: { startAt: number; dur?: number; maxW: number }) {
  const frame = useCurrentFrame();
  const w = eased(frame, startAt, dur, eOut) * 100;
  return <div style={{ height: 2, width: `${w}%`, maxWidth: maxW, background: `linear-gradient(to right, transparent, ${C.gold}, transparent)` }} />;
}

// ─── ESCENA 1: HOOK ───────────────────────────────────────────────────────────
function SceneHook() {
  const frame = useCurrentFrame();
  const sz = useSz();
  const barsIn = Math.min(1, Math.max(0, interpolate(frame, [0, 16], [1, 0]))) * 100;

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: `0 ${sz.px}px`, gap: sz.g3 }}>
      {/* Barras cinematográficas */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: sz.S ? 76 : 58, background: C.bg, transform: `translateY(-${barsIn}%)` }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: sz.S ? 76 : 58, background: C.bg, transform: `translateY(${barsIn}%)` }} />

      {/* Pill */}
      <MaskedReveal startAt={8} dur={18} distance={30} style={{ display: "flex" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: sz.g1 * 0.7, borderRadius: 999, border: `1px solid ${C.goldBorder}`, background: C.goldDim, padding: `${sz.g1 * 0.75}px ${sz.g2 * 0.9}px` }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.gold, opacity: 0.5 + 0.5 * Math.sin(frame * 0.2), flexShrink: 0 }} />
          <span style={{ fontFamily: dmSans, fontSize: sz.tag, color: C.gold, letterSpacing: "0.2em", textTransform: "uppercase" }}>Para propietarios en Monterrey</span>
        </div>
      </MaskedReveal>

      {/* Headline char-by-char */}
      <CameraMotionBlur shutterAngle={140} samples={5}>
        <CharReveal
          text="¿Tu casa lleva meses sin venderse?"
          startAt={16} charDelay={2.5}
          style={{ fontFamily: playfair, fontWeight: 700, textAlign: "center", fontSize: sz.h1, color: C.text, lineHeight: 1.1, maxWidth: sz.maxW, justifyContent: "center" }}
        />
      </CameraMotionBlur>

      {/* Subtexto */}
      <MaskedReveal startAt={74} dur={22} distance={24}>
        <p style={{ fontFamily: dmSans, fontSize: sz.body, color: C.textMuted, margin: 0, lineHeight: 1.6, textAlign: "center" }}>
          Otras agencias te hacen esperar.{sz.S ? <br /> : " "}Nosotros no.
        </p>
      </MaskedReveal>
    </AbsoluteFill>
  );
}

// ─── ESCENA 2: DOLOR ──────────────────────────────────────────────────────────
function ScenePain() {
  const frame = useCurrentFrame();
  const sz = useSz();

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: `0 ${sz.px}px`, gap: sz.g3 }}>

      {/* Otra agencia — rojo */}
      <div style={{ opacity: eased(frame, 8, 18, eOut), textAlign: "center" }}>
        <MaskedReveal startAt={8} dur={16} distance={20}>
          <p style={{ fontFamily: dmSans, fontSize: sz.tag, color: C.redSoft, letterSpacing: "0.22em", textTransform: "uppercase", margin: `0 0 ${sz.g1}px` }}>Con otra agencia</p>
        </MaskedReveal>
        <CameraMotionBlur shutterAngle={160} samples={5}>
          <BloomText fontSize={sz.disp} color={C.red} style={{ textShadow: "0 0 90px rgba(255,50,50,0.4)" }}>
            <Counter from={0} to={6} startAt={14} dur={55} />
            <span style={{ fontSize: sz.h2 * 0.9, color: C.redSoft }}> meses</span>
          </BloomText>
        </CameraMotionBlur>
        <MaskedReveal startAt={55} dur={18} distance={16}>
          <p style={{ fontFamily: dmSans, fontSize: sz.sm, color: C.redSoft, margin: `${sz.g1}px 0 0`, opacity: 0.8 }}>esperando sin resultados</p>
        </MaskedReveal>
      </div>

      {/* VS */}
      <div style={{ opacity: eased(frame, 72, 14, eOut), display: "flex", alignItems: "center", gap: sz.g2 }}>
        <div style={{ height: 1, width: sz.w * 0.06, background: `linear-gradient(to right, transparent, ${C.textDim})` }} />
        <span style={{ fontFamily: dmSans, fontSize: sz.sm, color: C.textDim, letterSpacing: "0.3em" }}>VS</span>
        <div style={{ height: 1, width: sz.w * 0.06, background: `linear-gradient(to left, transparent, ${C.textDim})` }} />
      </div>

      {/* Con Cima — dorado */}
      <div style={{ opacity: eased(frame, 86, 18, eOut), textAlign: "center" }}>
        <MaskedReveal startAt={86} dur={16} distance={20}>
          <p style={{ fontFamily: dmSans, fontSize: sz.tag, color: C.gold, letterSpacing: "0.22em", textTransform: "uppercase", margin: `0 0 ${sz.g1}px` }}>Con Cima Propiedades</p>
        </MaskedReveal>
        <CameraMotionBlur shutterAngle={160} samples={5}>
          <BloomText fontSize={sz.disp} color={C.gold} style={{ textShadow: `0 0 90px rgba(200,169,110,0.5)` }}>
            <Counter from={0} to={30} startAt={90} dur={52} />
            <span style={{ fontSize: sz.h2 * 0.9, color: C.goldBright }}> días</span>
          </BloomText>
        </CameraMotionBlur>
        <MaskedReveal startAt={112} dur={18} distance={16}>
          <p style={{ fontFamily: dmSans, fontSize: sz.sm, color: C.gold, margin: `${sz.g1}px 0 0`, opacity: 0.85 }}>garantizados</p>
        </MaskedReveal>
      </div>
    </AbsoluteFill>
  );
}

// ─── ESCENA 3: PROMESA ────────────────────────────────────────────────────────
function ScenePromesa() {
  const frame = useCurrentFrame();
  const sz = useSz();
  const circleR = sz.disp * 0.72;

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: `0 ${sz.px}px`, gap: sz.g2 }}>
      {/* Glow central */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 60% 55% at 50% 50%, rgba(200,169,110,0.1) 0%, transparent 70%)`, pointerEvents: "none" }} />

      <div style={{ opacity: eased(frame, 6, 14, eOut) }}>
        <CimaLogo startAt={6} sz={sz} />
      </div>

      <MaskedReveal startAt={20} dur={20} distance={22}>
        <p style={{ fontFamily: dmSans, fontSize: sz.body, color: C.textMuted, margin: 0, letterSpacing: "0.04em" }}>Vendemos tu propiedad en</p>
      </MaskedReveal>

      {/* "30" con bloom + círculo */}
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <AnimatedCircle startAt={28} radius={circleR} />
        <CameraMotionBlur shutterAngle={100} samples={4}>
          <div style={{ opacity: eased(frame, 28, 16, eBack) }}>
            <BloomText fontSize={sz.disp * 1.12} color={C.gold}>
              30
            </BloomText>
          </div>
        </CameraMotionBlur>
        <MaskedReveal startAt={44} dur={18} distance={20}>
          <p style={{ fontFamily: dmSans, fontWeight: 700, letterSpacing: "0.55em", fontSize: sz.h3 * 0.83, color: C.goldBright, margin: 0 }}>DÍAS</p>
        </MaskedReveal>
      </div>

      {/* "o no cobramos" */}
      <div style={{ opacity: eased(frame, 82, 18, eOut), display: "flex", flexDirection: "column", alignItems: "center", gap: sz.g1 }}>
        <CharReveal
          text="o no cobramos comisión"
          startAt={82} charDelay={2.2}
          style={{ fontFamily: playfair, fontSize: sz.h3 * 0.76, color: C.text, fontStyle: "italic", justifyContent: "center" }}
        />
        <GoldLine startAt={82} maxW={sz.S ? sz.w * 0.55 : 380} />
      </div>

      {/* Garantías */}
      <div style={{
        opacity: eased(frame, 118, 18, eOut),
        display: "flex", flexDirection: sz.S ? "column" : "row",
        gap: sz.g1, alignItems: sz.S ? "flex-start" : "center", width: "100%", maxWidth: sz.maxW,
      }}>
        {["Sin cuotas iniciales", "Fotos profesionales incluidas", "Comisión desde 6%"].map((g, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: sz.g1 * 0.7, background: C.goldDim, border: `1px solid ${C.goldBorder}`, borderRadius: 999, padding: `${sz.g1 * 0.8}px ${sz.g2 * 0.9}px`, opacity: eased(frame, 118 + i * 10, 14, eOut) }}>
            <svg width={sz.pill * 0.68} height={sz.pill * 0.68} viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
            <span style={{ fontFamily: dmSans, fontSize: sz.pill, color: C.text }}>{g}</span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
}

// ─── ESCENA 4: PROCESO ────────────────────────────────────────────────────────
function SceneProceso() {
  const frame = useCurrentFrame();
  const sz = useSz();
  const steps = [
    { day: "Día 0",     title: "Valuación gratuita",      desc: "Visitamos y fijamos el precio óptimo para vender rápido." },
    { day: "Días 1–2",  title: "Fotos & publicación",     desc: "Sesión profesional. Publicamos en todos los portales." },
    { day: "Días 3–21", title: "Compradores calificados", desc: "Filtramos interesados serios y coordinamos visitas." },
    { day: "Día 30",    title: "¡Prospecto encontrado!",  desc: "Negociamos el mejor precio y firmamos la promesa." },
  ];

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: `0 ${sz.px}px`, gap: sz.g3 }}>
      <div style={{ opacity: eased(frame, 6, 16, eOut) }}>
        <p style={{ fontFamily: dmSans, fontSize: sz.tag, color: C.gold, letterSpacing: "0.22em", textTransform: "uppercase", margin: `0 0 ${sz.g1}px` }}>El proceso</p>
        <CharReveal text="Del acuerdo a la firma" startAt={10} charDelay={2.2} style={{ fontFamily: playfair, fontWeight: 700, fontSize: sz.h2, color: C.text, lineHeight: 1.05 }} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: sz.g2 }}>
        {steps.map((step, i) => {
          const p = eased(frame, 28 + i * 26, 24, eOut);
          const y = interpolate(p, [0, 1], [35, 0]);
          return (
            <div key={i} style={{ opacity: p, transform: `translateY(${y}px)`, display: "flex", gap: sz.g2, alignItems: "flex-start" }}>
              <div style={{ width: sz.box * 1.08, height: sz.box * 1.08, borderRadius: sz.box * 0.27, flexShrink: 0, background: C.goldDim, border: `1px solid ${C.goldBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: dmSans, fontSize: sz.tag * 0.8, color: C.gold, letterSpacing: "0.04em", textTransform: "uppercase", textAlign: "center", lineHeight: 1.3 }}>{step.day}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: playfair, fontWeight: 700, fontSize: sz.body * 1.14, color: C.text, margin: 0, marginBottom: sz.S ? 2 : 4 }}>{step.title}</p>
                <p style={{ fontFamily: dmSans, fontSize: sz.sm, color: C.textMuted, margin: 0, lineHeight: 1.48 }}>{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

// ─── ESCENA 5: STATS ──────────────────────────────────────────────────────────
function SceneStats() {
  const frame = useCurrentFrame();
  const sz = useSz();

  const stats = [
    { value: <><Counter from={0} to={22} startAt={30} dur={65} /><span style={{ fontSize: sz.stat * 0.42 }}>d</span></>, label: "Promedio de venta", gold: true },
    { value: <><Counter from={90} to={98} startAt={40} dur={65} />%</>, label: "Del precio pedido", gold: false },
    { value: <><Counter from={0} to={50} startAt={50} dur={65} />+</>, label: "Propiedades vendidas", gold: false },
  ];

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: `0 ${sz.px}px`, gap: sz.g3 }}>
      <div style={{ opacity: eased(frame, 8, 18, eOut), textAlign: "center", width: "100%", maxWidth: sz.maxW }}>
        <MaskedReveal startAt={8} dur={18} distance={20}>
          <p style={{ fontFamily: dmSans, fontSize: sz.tag, color: C.gold, letterSpacing: "0.22em", textTransform: "uppercase", margin: `0 0 ${sz.g1}px` }}>Resultados reales</p>
        </MaskedReveal>
        <CharReveal text="Los números no mienten" startAt={14} charDelay={2.2} style={{ fontFamily: playfair, fontWeight: 700, fontSize: sz.h2, color: C.text, justifyContent: "center" }} />
      </div>

      <div style={{ display: "flex", flexDirection: sz.S ? "column" : "row", gap: sz.g2, width: "100%", maxWidth: sz.maxW }}>
        {stats.map((s, i) => {
          // eBack para overshoot AE-style
          const p = eased(frame, 30 + i * 14, 26, eBack);
          return (
            <div key={i} style={{
              opacity: p,
              transform: `scale(${interpolate(p, [0, 1], [0.72, 1])})`,
              background: s.gold ? `linear-gradient(135deg, rgba(200,169,110,0.15), rgba(200,169,110,0.04))` : C.card,
              border: `1px solid ${s.gold ? "rgba(200,169,110,0.42)" : C.goldBorder}`,
              borderRadius: sz.w * 0.012, padding: `${sz.g2}px ${sz.g2 * 0.8}px`,
              flex: 1, textAlign: "center",
              boxShadow: s.gold ? `0 0 70px rgba(200,169,110,0.12)` : "none",
            }}>
              <CameraMotionBlur shutterAngle={120} samples={4}>
                <p style={{ fontFamily: playfair, fontWeight: 900, fontSize: sz.stat, color: s.gold ? C.gold : C.text, margin: `0 0 ${sz.g1 * 0.6}px`, lineHeight: 1 }}>{s.value}</p>
              </CameraMotionBlur>
              <p style={{ fontFamily: dmSans, fontSize: sz.tag * 0.9, color: C.textMuted, margin: 0, textTransform: "uppercase", letterSpacing: "0.13em", lineHeight: 1.4 }}>{s.label}</p>
            </div>
          );
        })}
      </div>

      <div style={{ opacity: eased(frame, 108, 18, eOut), textAlign: "center", maxWidth: sz.maxW }}>
        <MaskedReveal startAt={108} dur={18} distance={18}>
          <p style={{ fontFamily: dmSans, fontSize: sz.sm, color: C.textMuted, margin: 0, lineHeight: 1.65 }}>
            El mercado tarda en promedio <span style={{ color: C.redSoft, fontWeight: 700 }}>4.5 meses.</span>
            {sz.S ? <br /> : " "}
            Nosotros en <span style={{ color: C.gold, fontWeight: 700 }}>22 días.</span>
          </p>
        </MaskedReveal>
      </div>
    </AbsoluteFill>
  );
}

// ─── ESCENA 6: ANTES / DESPUÉS ────────────────────────────────────────────────
function SceneBeforeAfter() {
  const frame = useCurrentFrame();
  const sz = useSz();
  const wipePct = Math.min(100, Math.max(0, interpolate(eased(frame, 22, 90, eIO), [0, 1], [0, 100])));

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: `0 ${sz.px}px`, gap: sz.g2 }}>

      <div style={{ opacity: eased(frame, 8, 16, eOut) }}>
        <MaskedReveal startAt={8} dur={16} distance={20}>
          <p style={{ fontFamily: dmSans, fontSize: sz.tag, color: C.gold, letterSpacing: "0.22em", textTransform: "uppercase", margin: `0 0 ${sz.g1}px` }}>Marketing profesional</p>
        </MaskedReveal>
        <CharReveal text="Tus fotos. Transformadas." startAt={12} charDelay={2.2} style={{ fontFamily: playfair, fontWeight: 700, fontSize: sz.h2, color: C.text }} />
      </div>

      {/* Wipe before/after */}
      <div style={{ position: "relative", width: "100%", aspectRatio: sz.S ? "4/3" : "16/7", borderRadius: sz.w * 0.01, overflow: "hidden", border: `1px solid ${C.goldBorder}` }}>
        <Img src={staticFile("estancia-antes.png")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${100 - wipePct}% 0 0)` }}>
          <Img src={staticFile("estancia-despues.png")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        {/* Línea con glow */}
        <div style={{
          position: "absolute", top: 0, bottom: 0, left: `${wipePct}%`, width: 3,
          background: C.gold, transform: "translateX(-50%)",
          boxShadow: `0 0 20px 4px ${C.gold}`,
          opacity: wipePct > 2 && wipePct < 98 ? 1 : 0,
        }} />
        <span style={{ position: "absolute", top: sz.g1, left: sz.g2, fontFamily: dmSans, fontSize: sz.tag * 0.88, letterSpacing: "0.15em", color: C.textMuted, textTransform: "uppercase", background: "rgba(9,10,13,0.88)", padding: `${sz.g1 * 0.4}px ${sz.g1 * 0.8}px`, borderRadius: sz.w * 0.004 }}>Antes</span>
        <span style={{ position: "absolute", top: sz.g1, right: sz.g2, fontFamily: dmSans, fontSize: sz.tag * 0.88, letterSpacing: "0.15em", color: C.gold, textTransform: "uppercase", background: "rgba(9,10,13,0.88)", padding: `${sz.g1 * 0.4}px ${sz.g1 * 0.8}px`, borderRadius: sz.w * 0.004, border: `1px solid ${C.goldBorder}`, opacity: Math.min(1, Math.max(0, interpolate(wipePct, [20, 45], [0, 1]))) }}>Con Cima</span>
      </div>

      {/* Testimonial */}
      <div style={{ opacity: eased(frame, 100, 22, eOut), transform: `translateX(${interpolate(eased(frame, 100, 22, eOut), [0, 1], [40, 0])}px)`, background: C.card, border: `1px solid ${C.goldBorder}`, borderRadius: sz.w * 0.01, padding: `${sz.g2}px ${sz.g2 * 1.1}px` }}>
        <div style={{ display: "flex", gap: sz.g1 * 0.5, marginBottom: sz.g1 * 0.8 }}>
          {[...Array(5)].map((_, i) => <svg key={i} width={sz.sm * 0.88} height={sz.sm * 0.88} viewBox="0 0 24 24" fill={C.gold}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>)}
        </div>
        <p style={{ fontFamily: dmSans, fontSize: sz.sm, color: C.text, lineHeight: 1.62, margin: `0 0 ${sz.g1}px`, fontStyle: "italic" }}>
          "Teníamos la casa con otra inmobiliaria 4 meses sin resultado. Con Cima la vendimos en 18 días al precio que pedimos."
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontFamily: playfair, fontWeight: 700, fontSize: sz.sm * 1.1, color: C.text, margin: 0 }}>María González</p>
            <p style={{ fontFamily: dmSans, fontSize: sz.tag * 0.88, color: C.textMuted, margin: 0, letterSpacing: "0.1em" }}>Casa en San Jerónimo</p>
          </div>
          <div style={{ background: C.goldDim, border: `1px solid ${C.goldBorder}`, borderRadius: sz.w * 0.006, padding: `${sz.g1 * 0.6}px ${sz.g2 * 0.8}px`, textAlign: "center" }}>
            <p style={{ fontFamily: playfair, fontWeight: 900, fontSize: sz.stat * 0.52, color: C.gold, margin: 0, lineHeight: 1 }}>18</p>
            <p style={{ fontFamily: dmSans, fontSize: sz.tag * 0.74, color: C.textMuted, margin: 0, letterSpacing: "0.15em" }}>DÍAS</p>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ─── ESCENA 7: CTA ────────────────────────────────────────────────────────────
function SceneCTA() {
  const frame = useCurrentFrame();
  const sz = useSz();

  // Pulso WhatsApp
  const pulseT = frame % 65;
  const pScale = 1 + Math.max(0, interpolate(pulseT, [0, 32, 65], [0, 0.07, 0]));
  const pOp   = Math.max(0, interpolate(pulseT, [0, 32, 65], [0.32, 0, 0.32]));
  const btnP  = eased(frame, 72, 24, eBack);

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: `0 ${sz.px}px`, gap: sz.g3 }}>
      {/* Glow central */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 78% 58% at 50% 50%, rgba(200,169,110,0.09) 0%, transparent 70%)`, pointerEvents: "none" }} />

      <div style={{ opacity: eased(frame, 6, 16, eBack) }}>
        <CimaLogo startAt={6} sz={{ ...sz, box: sz.box * 1.45, h3: sz.h3 * 1.45, tag: sz.tag * 1.15 }} />
      </div>

      <CameraMotionBlur shutterAngle={130} samples={5}>
        <CharReveal
          text="¿Lista para vender en 30 días?"
          startAt={22} charDelay={2.4}
          style={{ fontFamily: playfair, fontWeight: 700, textAlign: "center", fontSize: sz.h1, color: C.text, lineHeight: 1.1, maxWidth: sz.maxW, justifyContent: "center" }}
        />
      </CameraMotionBlur>

      <div style={{ opacity: eased(frame, 60, 18, eOut) }}>
        <MaskedReveal startAt={60} dur={20} distance={20}>
          <p style={{ fontFamily: dmSans, fontSize: sz.body, color: C.textMuted, margin: 0, lineHeight: 1.6, textAlign: "center" }}>
            Valuación <span style={{ color: C.gold, fontWeight: 600 }}>gratuita y sin compromiso.</span><br />
            Visita en menos de 48 horas.
          </p>
        </MaskedReveal>
      </div>

      {/* WhatsApp pulsante */}
      <div style={{ opacity: eased(frame, 72, 20, eOut), transform: `scale(${interpolate(btnP, [0, 1], [0.8, 1])})`, position: "relative", display: "inline-flex" }}>
        <div style={{ position: "absolute", inset: -sz.g1, borderRadius: 999, border: "2px solid #25D366", transform: `scale(${pScale})`, opacity: pOp, pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "center", gap: sz.g2, background: "linear-gradient(135deg,#1db954,#25D366)", borderRadius: sz.w * 0.01, padding: `${sz.g2 * 0.9}px ${sz.g3 * 0.88}px`, boxShadow: "0 8px 50px rgba(37,211,102,0.42)" }}>
          <svg width={sz.icon} height={sz.icon} viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          <div>
            <p style={{ fontFamily: dmSans, fontWeight: 700, fontSize: sz.body * 1.1, color: "white", margin: 0, lineHeight: 1 }}>Contactar ahora</p>
            <p style={{ fontFamily: dmSans, fontSize: sz.sm, color: "rgba(255,255,255,0.82)", margin: 0, letterSpacing: "0.1em" }}>81 2198 0008</p>
          </div>
        </div>
      </div>

      <div style={{ opacity: eased(frame, 100, 18, eOut), display: "flex", alignItems: "center", gap: sz.g2 }}>
        <div style={{ height: 1, width: sz.w * 0.04, background: `linear-gradient(to right, transparent, ${C.textDim})` }} />
        <span style={{ fontFamily: dmSans, fontSize: sz.tag * 0.9, color: C.textDim, letterSpacing: "0.14em" }}>propiedades-mty.vercel.app</span>
        <div style={{ height: 1, width: sz.w * 0.04, background: `linear-gradient(to left, transparent, ${C.textDim})` }} />
      </div>
    </AbsoluteFill>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
//  COMPOSICIÓN PRINCIPAL
// ═════════════════════════════════════════════════════════════════════════════
export const SalesVideo: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    // Color grade global — contraste + tono cálido
    <AbsoluteFill style={{ background: C.bg, fontFamily: dmSans, filter: "contrast(1.06) saturate(1.05)" }}>
      {/* ── Fondo persistente ── */}
      <DotGrid />
      <DiagLines />
      <NoiseAurora frame={frame} />
      <Particles frame={frame} />
      <Vignette />
      <FilmGrain frame={frame} />

      {/* ── Escenas con transiciones cinematográficas ── */}
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={152}>
          <SceneHook />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition timing={linearTiming({ durationInFrames: 22 })} presentation={fade()} />

        <TransitionSeries.Sequence durationInFrames={168}>
          <ScenePain />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition timing={springTiming({ durationInFrames: 30, config: { damping: 200 } })} presentation={wipe({ direction: "from-left" })} />

        <TransitionSeries.Sequence durationInFrames={182}>
          <ScenePromesa />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition timing={springTiming({ durationInFrames: 26, config: { damping: 200 } })} presentation={slide({ direction: "from-right" })} />

        <TransitionSeries.Sequence durationInFrames={178}>
          <SceneProceso />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition timing={linearTiming({ durationInFrames: 22 })} presentation={fade()} />

        <TransitionSeries.Sequence durationInFrames={158}>
          <SceneStats />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition timing={springTiming({ durationInFrames: 28, config: { damping: 200 } })} presentation={wipe({ direction: "from-right" })} />

        <TransitionSeries.Sequence durationInFrames={158}>
          <SceneBeforeAfter />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition timing={linearTiming({ durationInFrames: 24 })} presentation={fade()} />

        <TransitionSeries.Sequence durationInFrames={202}>
          <SceneCTA />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
