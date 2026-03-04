"use client";

import { useState } from "react";

const PAINS = [
  {
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
        <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" stroke="#9A9490" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Tu portafolio parece igual que el de todos",
    desc: "PDF genérico, presentación en PowerPoint, fotos en WhatsApp. Los propietarios no distinguen por qué elegirte a ti.",
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
        <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#9A9490" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Los propietarios no saben qué haces con su propiedad",
    desc: "Sin visibilidad real, sienten que su exclusiva está abandonada. La desconfianza les hace llamar a otro asesor.",
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
        <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="#9A9490" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Pierdes leads porque el seguimiento es manual",
    desc: "Los contactos se enfrían en 48h. Sin un sistema automático, tu pipeline se escapa entre mensajes no contestados.",
  },
];

const FEATURES = [
  {
    icon: "◈",
    title: "Portal del propietario en tiempo real",
    desc: "Tu cliente ve visitas, feedback y estadísticas. Tú pareces la plataforma más avanzada de Monterrey.",
  },
  {
    icon: "◉",
    title: "Ficha técnica PDF ultra-lujo",
    desc: "Presentaciones A4 con tu marca, fotos profesionales y datos de mercado. Se genera en segundos.",
  },
  {
    icon: "◎",
    title: "Seguimiento automático de leads",
    desc: "El sistema recuerda por ti. Notificaciones, historial completo y scoring para saber a quién llamar hoy.",
  },
  {
    icon: "◐",
    title: "Dashboard de exclusivas y comisiones",
    desc: "Visualiza tu pipeline, proyección de ingresos y KPIs como un broker de nivel internacional.",
  },
];

const TESTIMONIALS = [
  {
    initials: "CR",
    name: "Carlos R.",
    role: "Asesor independiente · San Pedro Garza García",
    quote: "Cerré 2 exclusivas nuevas en mi primer mes. Los propietarios dicen que soy el asesor más profesional que han conocido.",
    result: "+2 exclusivas en 30 días",
  },
  {
    initials: "LM",
    name: "Laura M.",
    role: "Agente independiente · Cumbres, MTY",
    quote: "Antes yo perseguía clientes. Ahora los propietarios me buscan a mí porque les muestro el portal en la primera presentación.",
    result: "3× más referidos",
  },
  {
    initials: "DV",
    name: "Diego V.",
    role: "ERA Inmobiliaria · Monterrey Centro",
    quote: "Mi conversión en presentaciones subió 40%. La ficha PDF sola ya valió la inversión desde la primera semana.",
    result: "40% más cierres",
  },
];

const FAQS = [
  {
    q: "¿Necesito saber de tecnología?",
    a: "No. Nosotros configuramos todo. Tú solo usas tu plataforma desde el celular o computadora, sin instalaciones ni complicaciones técnicas.",
  },
  {
    q: "¿Cuánto cuesta?",
    a: "Te lo mostramos en la demo, personalizado a tu volumen de propiedades. Tenemos planes desde $1,490/mes. La mayoría recupera la inversión con una sola exclusiva adicional.",
  },
  {
    q: "¿En cuánto tiempo veo resultados?",
    a: "La plataforma está lista en 7 días. La mayoría de asesores nota diferencia en su primera presentación con propietario nuevo.",
  },
  {
    q: "¿Qué pasa si no me conviene?",
    a: "Sin contratos de permanencia. Si en 30 días no ves el valor, cancelas y te devolvemos el primer mes. Sin preguntas.",
  },
];

export default function AgendaPage() {
  const [form, setForm] = useState({ nombre: "", telefono: "", email: "", agencia: "" });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const scrollToForm = () => {
    document.getElementById("form-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <style>{`
        @keyframes orbit {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(200,169,110,0.15); }
          50%       { box-shadow: 0 0 40px rgba(200,169,110,0.35); }
        }
        @keyframes scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(400%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        .btn-orbit-wrap {
          padding: 2px;
          border-radius: 10px;
          background: linear-gradient(270deg, #C8A96E, #00E5FF, #7AFFB2, #C8A96E);
          background-size: 400% 400%;
          animation: orbit 4s ease infinite;
          display: inline-block;
        }
        .btn-orbit-inner {
          background: #090A0D;
          border-radius: 8px;
          padding: 14px 32px;
          font-family: var(--font-heading, 'Syne', sans-serif);
          font-weight: 700;
          font-size: 15px;
          letter-spacing: 0.03em;
          color: #F0EDE8;
          cursor: pointer;
          transition: background 0.2s;
          white-space: nowrap;
        }
        .btn-orbit-inner:hover { background: #0F1116; }
        .btn-orbit-wrap-sm {
          padding: 1.5px;
          border-radius: 8px;
          background: linear-gradient(270deg, #C8A96E, #00E5FF, #C8A96E);
          background-size: 300% 300%;
          animation: orbit 3s ease infinite;
          display: inline-block;
        }
        .btn-orbit-inner-sm {
          background: #090A0D;
          border-radius: 6px;
          padding: 8px 18px;
          font-family: var(--font-heading, 'Syne', sans-serif);
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 0.04em;
          color: #C8A96E;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-orbit-inner-sm:hover { background: #0F1116; }
        .fade-up-1 { animation: fadeUp 0.7s ease both; animation-delay: 0.1s; }
        .fade-up-2 { animation: fadeUp 0.7s ease both; animation-delay: 0.25s; }
        .fade-up-3 { animation: fadeUp 0.7s ease both; animation-delay: 0.4s; }
        .fade-up-4 { animation: fadeUp 0.7s ease both; animation-delay: 0.55s; }
        .fade-up-5 { animation: fadeUp 0.7s ease both; animation-delay: 0.7s; }
        .glass-card {
          background: rgba(15,17,22,0.7);
          border: 1px solid rgba(35,37,47,0.9);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .video-glow {
          animation: pulse-glow 3s ease infinite;
        }
        .scanline-anim {
          animation: scanline 2.5s linear infinite;
        }
        .play-float {
          animation: float 3s ease-in-out infinite;
        }
        .noise-bg::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
        }
        .gradient-text {
          background: linear-gradient(135deg, #F0EDE8 0%, #C8A96E 50%, #E2C99A 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .step-line {
          position: absolute;
          top: 28px;
          left: calc(50% + 28px);
          right: calc(-50% + 28px);
          height: 1px;
          background: linear-gradient(90deg, #23252F, transparent);
        }
        input, textarea {
          outline: none;
        }
        input:focus, textarea:focus {
          border-color: rgba(200,169,110,0.5) !important;
          box-shadow: 0 0 0 3px rgba(200,169,110,0.08);
        }
        .faq-answer {
          overflow: hidden;
          transition: max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease;
        }
      `}</style>

      <div
        className="min-h-screen relative"
        style={{ background: "#090A0D", color: "#F0EDE8", fontFamily: "var(--font-sans, 'DM Sans', sans-serif)" }}
      >
        {/* Ambient background blobs */}
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          pointerEvents: "none", zIndex: 0, overflow: "hidden"
        }}>
          <div style={{
            position: "absolute", top: "-20%", left: "60%",
            width: "600px", height: "600px",
            background: "radial-gradient(circle, rgba(200,169,110,0.06) 0%, transparent 70%)",
            borderRadius: "50%"
          }} />
          <div style={{
            position: "absolute", top: "40%", left: "-10%",
            width: "500px", height: "500px",
            background: "radial-gradient(circle, rgba(0,229,255,0.04) 0%, transparent 70%)",
            borderRadius: "50%"
          }} />
          <div style={{
            position: "absolute", bottom: "10%", right: "10%",
            width: "400px", height: "400px",
            background: "radial-gradient(circle, rgba(200,169,110,0.05) 0%, transparent 70%)",
            borderRadius: "50%"
          }} />
        </div>

        {/* ─── NAV ─── */}
        <nav style={{
          position: "sticky", top: 0, zIndex: 100,
          borderBottom: "1px solid rgba(35,37,47,0.8)",
          background: "rgba(9,10,13,0.92)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
              <div style={{ fontFamily: "var(--font-heading, 'Syne', sans-serif)", fontWeight: 800, fontSize: "18px", letterSpacing: "0.12em" }}>
                <span style={{ color: "#C8A96E" }}>CIMA</span>
                <span style={{ color: "#F0EDE8" }}> PRO</span>
              </div>
              <button className="btn-orbit-wrap-sm" onClick={scrollToForm}>
                <div className="btn-orbit-inner-sm">Agenda tu Demo →</div>
              </button>
            </div>
          </div>
        </nav>

        {/* ─── HERO ─── */}
        <section style={{ position: "relative", zIndex: 1, padding: "80px 24px 60px" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
            {/* Badge */}
            <div className="fade-up-1" style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "28px" }}>
              <span style={{
                display: "inline-block", padding: "6px 16px",
                background: "rgba(200,169,110,0.1)",
                border: "1px solid rgba(200,169,110,0.25)",
                borderRadius: "999px",
                fontSize: "12px", fontWeight: 600, letterSpacing: "0.06em",
                color: "#C8A96E", textTransform: "uppercase"
              }}>
                Solo para Asesores en Monterrey
              </span>
              <span style={{
                display: "inline-block", padding: "6px 14px",
                background: "rgba(0,229,255,0.08)",
                border: "1px solid rgba(0,229,255,0.18)",
                borderRadius: "999px",
                fontSize: "12px", fontWeight: 600, letterSpacing: "0.05em",
                color: "#00E5FF"
              }}>
                Cupos limitados
              </span>
            </div>

            {/* Headline */}
            <h1 className="fade-up-2" style={{
              fontFamily: "var(--font-heading, 'Syne', sans-serif)",
              fontSize: "clamp(32px, 6vw, 62px)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              marginBottom: "24px"
            }}>
              ¿Cuántas exclusivas{" "}
              <span className="gradient-text">perdiste</span>
              {" "}porque tu competencia se ve más profesional?
            </h1>

            {/* Subheadline */}
            <p className="fade-up-3" style={{
              fontSize: "clamp(16px, 2.5vw, 20px)",
              color: "#9A9490",
              lineHeight: 1.65,
              maxWidth: "600px",
              margin: "0 auto 40px"
            }}>
              Cima Pro convierte tu gestión en la plataforma más sofisticada de Monterrey —
              <span style={{ color: "#F0EDE8" }}> en 7 días.</span>
            </p>

            {/* VSL Video */}
            <div className="fade-up-4 video-glow" style={{
              position: "relative",
              background: "#0F1116",
              border: "1px solid #23252F",
              borderRadius: "16px",
              overflow: "hidden",
              aspectRatio: "16/9",
              maxWidth: "680px",
              margin: "0 auto 32px",
              cursor: "pointer",
            }}>
              {/* Scanline effect */}
              <div style={{
                position: "absolute", inset: 0,
                background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)",
                pointerEvents: "none", zIndex: 1
              }} />
              {/* Moving scan line */}
              <div className="scanline-anim" style={{
                position: "absolute", left: 0, right: 0, height: "3px",
                background: "linear-gradient(90deg, transparent, rgba(200,169,110,0.3), transparent)",
                zIndex: 2
              }} />

              {/* Grid overlay */}
              <div style={{
                position: "absolute", inset: 0,
                backgroundImage: "linear-gradient(rgba(200,169,110,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(200,169,110,0.03) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
                zIndex: 0
              }} />

              {/* Play button */}
              <div style={{
                position: "absolute", inset: 0, zIndex: 3,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: "16px"
              }}>
                <div className="play-float" style={{
                  width: "72px", height: "72px",
                  background: "rgba(200,169,110,0.15)",
                  border: "2px solid rgba(200,169,110,0.4)",
                  borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  backdropFilter: "blur(8px)",
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="#C8A96E">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{
                    fontFamily: "var(--font-heading, 'Syne', sans-serif)",
                    fontWeight: 700, fontSize: "15px", color: "#F0EDE8",
                    letterSpacing: "0.03em"
                  }}>
                    Video de presentación · 2:47 min
                  </div>
                  <div style={{ fontSize: "13px", color: "#9A9490", marginTop: "4px" }}>
                    Mira cómo los asesores duplican sus exclusivas
                  </div>
                </div>
              </div>

              {/* Corner badges */}
              <div style={{
                position: "absolute", top: "16px", right: "16px", zIndex: 4,
                background: "rgba(0,229,255,0.1)", border: "1px solid rgba(0,229,255,0.2)",
                borderRadius: "6px", padding: "4px 10px",
                fontSize: "11px", color: "#00E5FF", fontWeight: 600,
                letterSpacing: "0.06em"
              }}>● DEMO REAL</div>
            </div>

            {/* CTA */}
            <div className="fade-up-5" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
              <button className="btn-orbit-wrap" onClick={scrollToForm}>
                <div className="btn-orbit-inner" style={{ fontSize: "16px", padding: "16px 40px" }}>
                  Quiero ver la Demo Gratis →
                </div>
              </button>
              <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", justifyContent: "center" }}>
                {["✓ Sin compromiso", "✓ 15 minutos", "✓ Solo 3 cupos/mes en MTY"].map((t) => (
                  <span key={t} style={{ fontSize: "13px", color: "#56524E", fontWeight: 500 }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── PAIN POINTS ─── */}
        <section style={{ position: "relative", zIndex: 1, padding: "60px 24px" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: "12px",
              marginBottom: "12px", justifyContent: "center"
            }}>
              <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, #23252F)" }} />
              <span style={{
                fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em",
                color: "#56524E", textTransform: "uppercase"
              }}>¿Te identificas?</span>
              <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, #23252F, transparent)" }} />
            </div>
            <p style={{
              textAlign: "center", marginBottom: "40px",
              fontFamily: "var(--font-heading, 'Syne', sans-serif)",
              fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 700,
              color: "#F0EDE8"
            }}>
              El 90% de asesores pierde exclusivas por la misma razón
            </p>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "16px"
            }}>
              {PAINS.map((p, i) => (
                <div key={i} style={{
                  background: "#0F1116",
                  border: "1px solid #23252F",
                  borderRadius: "14px",
                  padding: "28px 24px",
                  transition: "border-color 0.2s, transform 0.2s",
                  cursor: "default"
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(200,169,110,0.3)";
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "#23252F";
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                  }}
                >
                  <div style={{ marginBottom: "14px" }}>{p.icon}</div>
                  <h3 style={{
                    fontFamily: "var(--font-heading, 'Syne', sans-serif)",
                    fontWeight: 700, fontSize: "16px", marginBottom: "10px",
                    color: "#F0EDE8"
                  }}>{p.title}</h3>
                  <p style={{ fontSize: "14px", color: "#9A9490", lineHeight: 1.65 }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── SOLUTION / FEATURES ─── */}
        <section style={{ position: "relative", zIndex: 1, padding: "60px 24px" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <span style={{
                display: "inline-block",
                padding: "5px 14px",
                background: "rgba(200,169,110,0.08)",
                border: "1px solid rgba(200,169,110,0.2)",
                borderRadius: "999px",
                fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em",
                color: "#C8A96E", textTransform: "uppercase", marginBottom: "16px"
              }}>La solución</span>
              <h2 style={{
                fontFamily: "var(--font-heading, 'Syne', sans-serif)",
                fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800,
                letterSpacing: "-0.02em", marginBottom: "12px"
              }}>
                Tu plataforma personal de{" "}
                <span className="gradient-text">exclusivas</span>
              </h2>
              <p style={{ color: "#9A9490", fontSize: "16px", maxWidth: "520px", margin: "0 auto" }}>
                Todo lo que necesitas para parecer la plataforma más avanzada de la ciudad, desde el día uno.
              </p>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "16px"
            }}>
              {FEATURES.map((f, i) => (
                <div key={i} style={{
                  position: "relative",
                  background: "linear-gradient(135deg, #0F1116 0%, #161820 100%)",
                  border: "1px solid #23252F",
                  borderRadius: "14px",
                  padding: "28px 24px",
                  overflow: "hidden",
                  transition: "border-color 0.2s"
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(200,169,110,0.35)"}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = "#23252F"}
                >
                  <div style={{
                    position: "absolute", top: 0, right: 0,
                    width: "80px", height: "80px",
                    background: "radial-gradient(circle at top right, rgba(200,169,110,0.08), transparent 70%)"
                  }} />
                  <div style={{
                    fontSize: "28px", marginBottom: "14px",
                    color: "#C8A96E"
                  }}>{f.icon}</div>
                  <h3 style={{
                    fontFamily: "var(--font-heading, 'Syne', sans-serif)",
                    fontWeight: 700, fontSize: "15px",
                    color: "#F0EDE8", marginBottom: "8px", lineHeight: 1.4
                  }}>{f.title}</h3>
                  <p style={{ fontSize: "13px", color: "#9A9490", lineHeight: 1.65 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── TESTIMONIALS ─── */}
        <section style={{ position: "relative", zIndex: 1, padding: "60px 24px" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <span style={{
                display: "inline-block",
                padding: "5px 14px",
                background: "rgba(0,229,255,0.06)",
                border: "1px solid rgba(0,229,255,0.15)",
                borderRadius: "999px",
                fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em",
                color: "#00E5FF", textTransform: "uppercase", marginBottom: "16px"
              }}>Resultados reales</span>
              <h2 style={{
                fontFamily: "var(--font-heading, 'Syne', sans-serif)",
                fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800,
                letterSpacing: "-0.02em"
              }}>
                Asesores que ya lo usan en Monterrey
              </h2>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
              gap: "16px"
            }}>
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="glass-card" style={{
                  borderRadius: "16px",
                  padding: "28px 24px",
                  position: "relative",
                  overflow: "hidden",
                  transition: "transform 0.2s"
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"}
                >
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: "2px",
                    background: "linear-gradient(90deg, #C8A96E, #00E5FF)"
                  }} />

                  {/* Quote mark */}
                  <div style={{
                    fontSize: "48px", lineHeight: 1, color: "rgba(200,169,110,0.15)",
                    fontFamily: "Georgia, serif", marginBottom: "8px"
                  }}>"</div>

                  <p style={{
                    fontSize: "15px", color: "#F0EDE8",
                    lineHeight: 1.7, marginBottom: "20px", fontStyle: "italic"
                  }}>{t.quote}</p>

                  {/* Result pill */}
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: "6px",
                    background: "rgba(122,255,178,0.08)",
                    border: "1px solid rgba(122,255,178,0.18)",
                    borderRadius: "999px", padding: "4px 12px",
                    marginBottom: "20px"
                  }}>
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
                      <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" stroke="#7AFFB2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span style={{ fontSize: "12px", color: "#7AFFB2", fontWeight: 600 }}>{t.result}</span>
                  </div>

                  {/* Author */}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                      width: "42px", height: "42px",
                      background: "linear-gradient(135deg, #C8A96E, #7A6240)",
                      borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "var(--font-heading)", fontWeight: 800,
                      fontSize: "14px", color: "#090A0D",
                      flexShrink: 0
                    }}>
                      {t.initials}
                    </div>
                    <div>
                      <div style={{
                        fontFamily: "var(--font-heading)", fontWeight: 700,
                        fontSize: "14px", color: "#F0EDE8"
                      }}>{t.name}</div>
                      <div style={{ fontSize: "12px", color: "#56524E" }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── HOW IT WORKS ─── */}
        <section style={{ position: "relative", zIndex: 1, padding: "60px 24px" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <h2 style={{
                fontFamily: "var(--font-heading, 'Syne', sans-serif)",
                fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800,
                letterSpacing: "-0.02em", marginBottom: "12px"
              }}>
                Tan simple como 3 pasos
              </h2>
              <p style={{ color: "#9A9490", fontSize: "15px" }}>
                Sin complicaciones. Sin contratos. Sin esperas largas.
              </p>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "32px",
              position: "relative"
            }}>
              {[
                { n: "01", title: "Agenda tu demo gratuita", desc: "15 minutos por videollamada. Te mostramos la plataforma en vivo con propiedades reales." },
                { n: "02", title: "Recibe tu plataforma en 7 días", desc: "Configuramos todo: tu branding, propiedades iniciales y portal listo para mostrar a clientes." },
                { n: "03", title: "Cierra exclusivas con más confianza", desc: "Llega a tus presentaciones con herramientas que ningún otro asesor en tu zona tiene." },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: "center", position: "relative" }}>
                  {i < 2 && (
                    <div className="step-line" style={{
                      position: "absolute", top: "28px",
                      left: "calc(50% + 32px)", right: "calc(-50% + 32px)",
                      height: "1px",
                      background: "linear-gradient(90deg, rgba(200,169,110,0.3), rgba(200,169,110,0.05))"
                    }} />
                  )}
                  <div style={{
                    width: "56px", height: "56px",
                    background: "linear-gradient(135deg, rgba(200,169,110,0.15), rgba(200,169,110,0.05))",
                    border: "1px solid rgba(200,169,110,0.25)",
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 18px",
                    fontFamily: "var(--font-heading)", fontWeight: 800,
                    fontSize: "18px", color: "#C8A96E"
                  }}>
                    {s.n}
                  </div>
                  <h3 style={{
                    fontFamily: "var(--font-heading)", fontWeight: 700,
                    fontSize: "16px", color: "#F0EDE8", marginBottom: "8px"
                  }}>{s.title}</h3>
                  <p style={{ fontSize: "13px", color: "#9A9490", lineHeight: 1.65 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FORM SECTION ─── */}
        <section id="form-section" style={{ position: "relative", zIndex: 1, padding: "60px 24px 80px" }}>
          <div style={{ maxWidth: "520px", margin: "0 auto" }}>

            {/* Urgency bar */}
            <div style={{
              background: "rgba(200,169,110,0.06)",
              border: "1px solid rgba(200,169,110,0.2)",
              borderRadius: "10px",
              padding: "12px 20px",
              textAlign: "center",
              marginBottom: "32px",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
            }}>
              <div style={{
                width: "8px", height: "8px", borderRadius: "50%",
                background: "#C8A96E",
                boxShadow: "0 0 8px rgba(200,169,110,0.6)"
              }} />
              <span style={{ fontSize: "13px", color: "#C8A96E", fontWeight: 600 }}>
                Solo aceptamos 3 nuevos asesores por mes en Monterrey
              </span>
            </div>

            <div style={{
              background: "#0F1116",
              border: "1px solid #23252F",
              borderRadius: "20px",
              padding: "40px 36px",
              position: "relative",
              overflow: "hidden"
            }}>
              {/* Top gradient line */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: "2px",
                background: "linear-gradient(90deg, #C8A96E, #00E5FF, #7AFFB2)"
              }} />

              {submitted ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ fontSize: "56px", marginBottom: "20px" }}>🎯</div>
                  <h3 style={{
                    fontFamily: "var(--font-heading)", fontWeight: 800,
                    fontSize: "24px", color: "#F0EDE8", marginBottom: "12px"
                  }}>¡Gracias, {form.nombre.split(" ")[0]}!</h3>
                  <p style={{ color: "#9A9490", fontSize: "15px", lineHeight: 1.65 }}>
                    Revisamos tu información y te contactamos en{" "}
                    <span style={{ color: "#C8A96E", fontWeight: 600 }}>menos de 2 horas</span>{" "}
                    por WhatsApp para agendar tu demo.
                  </p>
                </div>
              ) : (
                <>
                  <h2 style={{
                    fontFamily: "var(--font-heading, 'Syne', sans-serif)",
                    fontSize: "26px", fontWeight: 800,
                    color: "#F0EDE8", marginBottom: "8px", textAlign: "center"
                  }}>Agenda tu Demo Gratuita</h2>
                  <p style={{
                    color: "#9A9490", fontSize: "14px", textAlign: "center",
                    marginBottom: "32px", lineHeight: 1.6
                  }}>
                    En 15 minutos te mostramos cómo funciona. Sin compromisos.
                  </p>

                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {[
                      { id: "nombre", label: "Nombre completo", type: "text", placeholder: "Ej. Roberto García", required: true },
                      { id: "telefono", label: "Teléfono (WhatsApp)", type: "tel", placeholder: "Ej. 81 1234 5678", required: true },
                      { id: "email", label: "Correo electrónico", type: "email", placeholder: "tu@correo.com", required: true },
                      { id: "agencia", label: "Agencia o zona donde trabajas", type: "text", placeholder: "Ej. San Pedro, independiente, ERA...", required: false },
                    ].map(f => (
                      <div key={f.id}>
                        <label style={{
                          display: "block", fontSize: "12px", fontWeight: 600,
                          letterSpacing: "0.06em", color: "#9A9490", textTransform: "uppercase",
                          marginBottom: "8px"
                        }}>{f.label}</label>
                        <input
                          type={f.type}
                          placeholder={f.placeholder}
                          required={f.required}
                          value={form[f.id as keyof typeof form]}
                          onChange={e => setForm(prev => ({ ...prev, [f.id]: e.target.value }))}
                          style={{
                            width: "100%", boxSizing: "border-box",
                            background: "#161820",
                            border: "1px solid #23252F",
                            borderRadius: "8px",
                            padding: "12px 16px",
                            fontSize: "14px",
                            color: "#F0EDE8",
                            transition: "border-color 0.2s, box-shadow 0.2s",
                          }}
                        />
                      </div>
                    ))}

                    <div style={{ marginTop: "8px" }}>
                      <button type="submit" className="btn-orbit-wrap" style={{ width: "100%", display: "block" }}>
                        <div className="btn-orbit-inner" style={{
                          width: "100%", textAlign: "center",
                          fontSize: "16px", padding: "15px 32px",
                          boxSizing: "border-box"
                        }}>
                          Agendar mi Demo Gratis →
                        </div>
                      </button>
                    </div>

                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "center",
                      gap: "6px", marginTop: "4px"
                    }}>
                      <span style={{ fontSize: "16px" }}>⚡</span>
                      <span style={{ fontSize: "13px", color: "#56524E" }}>
                        Te contactamos en menos de 2 horas
                      </span>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section style={{ position: "relative", zIndex: 1, padding: "40px 24px 80px" }}>
          <div style={{ maxWidth: "680px", margin: "0 auto" }}>
            <h2 style={{
              fontFamily: "var(--font-heading, 'Syne', sans-serif)",
              fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 800,
              textAlign: "center", marginBottom: "36px", letterSpacing: "-0.02em"
            }}>Preguntas frecuentes</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {FAQS.map((faq, i) => (
                <div key={i} style={{
                  background: "#0F1116",
                  border: `1px solid ${openFaq === i ? "rgba(200,169,110,0.3)" : "#23252F"}`,
                  borderRadius: "12px",
                  overflow: "hidden",
                  transition: "border-color 0.2s"
                }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{
                      width: "100%", textAlign: "left",
                      padding: "18px 20px",
                      background: "none", border: "none",
                      cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px"
                    }}
                  >
                    <span style={{
                      fontFamily: "var(--font-heading)", fontWeight: 700,
                      fontSize: "15px", color: "#F0EDE8"
                    }}>{faq.q}</span>
                    <span style={{
                      color: "#C8A96E", fontSize: "20px", lineHeight: 1,
                      transition: "transform 0.25s",
                      transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)",
                      flexShrink: 0
                    }}>+</span>
                  </button>
                  <div className="faq-answer" style={{
                    maxHeight: openFaq === i ? "200px" : "0px",
                    opacity: openFaq === i ? 1 : 0,
                  }}>
                    <p style={{
                      padding: "0 20px 18px",
                      fontSize: "14px", color: "#9A9490", lineHeight: 1.7
                    }}>{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Final mini CTA */}
            <div style={{ textAlign: "center", marginTop: "48px" }}>
              <p style={{ color: "#56524E", fontSize: "14px", marginBottom: "16px" }}>
                ¿Tienes otra pregunta? Escríbenos directo.
              </p>
              <button className="btn-orbit-wrap" onClick={scrollToForm}>
                <div className="btn-orbit-inner">Agenda tu Demo →</div>
              </button>
            </div>
          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <footer style={{
          position: "relative", zIndex: 1,
          borderTop: "1px solid #23252F",
          padding: "28px 24px",
          textAlign: "center"
        }}>
          <div style={{
            fontFamily: "var(--font-heading)", fontWeight: 800,
            fontSize: "16px", letterSpacing: "0.1em", marginBottom: "8px"
          }}>
            <span style={{ color: "#C8A96E" }}>CIMA</span>
            <span style={{ color: "#F0EDE8" }}> PRO</span>
          </div>
          <p style={{ fontSize: "12px", color: "#56524E" }}>
            © 2025 Cima Pro · Monterrey, NL · Todos los derechos reservados
          </p>
        </footer>
      </div>
    </>
  );
}
