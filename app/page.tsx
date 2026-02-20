import Link from "next/link";
import { Building2, MapPin, TrendingUp, Shield, Phone, Star, Home, ArrowRight, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import PropertyCard from "@/components/landing/property-card";
import SellForm from "@/components/landing/sell-form";
import type { Property } from "@/lib/types";

const ZONES = [
  { name: "San Pedro Garza García", tag: "Premium" },
  { name: "Valle Oriente",          tag: "Ejecutivo" },
  { name: "Cumbres",                tag: "Familiar" },
  { name: "Obispado",               tag: "Tradicional" },
  { name: "San Jerónimo",           tag: "Residencial" },
  { name: "Monterrey Centro",       tag: "Inversión" },
];

const TESTIMONIALS = [
  { name: "Ana Martínez", role: "Compradora", text: "El proceso fue increíblemente fluido. Encontré mi departamento ideal en Valle Oriente en menos de 3 semanas.", stars: 5 },
  { name: "Roberto Garza", role: "Vendedor", text: "Vendimos nuestra casa en San Pedro por arriba del precio que esperábamos. Servicio impecable.", stars: 5 },
  { name: "Laura Sánchez", role: "Compradora", text: "El equipo de Cima conoce Monterrey mejor que nadie. Me ayudaron a invertir correctamente.", stars: 5 },
];

export default async function HomePage() {
  const supabase = createClient();
  const { data: featuredProps } = await supabase
    .from("re_properties")
    .select("*")
    .eq("status", "active")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(3);

  const { count: totalProps } = await supabase
    .from("re_properties")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  const featured = (featuredProps ?? []) as Property[];

  return (
    <div className="min-h-screen bg-cima-bg">
      {/* ── NAVBAR ─────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-cima-border/50 bg-cima-bg/90 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center">
              <Building2 className="h-4 w-4 text-cima-gold" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-heading font-bold text-sm text-cima-text">Cima</span>
              <span className="font-mono text-[9px] tracking-[0.2em] text-cima-text-muted uppercase">Propiedades</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/propiedades" className="text-sm text-cima-text-muted hover:text-cima-text transition-colors">Propiedades</Link>
            <Link href="#vender" className="text-sm text-cima-text-muted hover:text-cima-text transition-colors">Vender</Link>
            <Link href="#zonas" className="text-sm text-cima-text-muted hover:text-cima-text transition-colors">Zonas</Link>
          </nav>

          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_CIMA_WA}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-lg bg-cima-gold/10 border border-cima-gold/30 px-3 py-1.5 text-xs font-mono text-cima-gold hover:bg-cima-gold/20 transition-colors"
          >
            <Phone className="h-3 w-3" />
            WhatsApp
          </a>
        </div>
      </header>

      {/* ── HERO ───────────────────────────────── */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-cima-gold/[0.03] rounded-full blur-[120px]" />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, #C8A96E 1px, transparent 0)",
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cima-gold/20 bg-cima-gold/5 px-4 py-1.5 mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-cima-gold animate-pulse" />
            <span className="font-mono text-xs text-cima-gold tracking-widest uppercase">Monterrey, Nuevo León</span>
          </div>

          <h1 className="font-heading font-bold text-5xl sm:text-6xl lg:text-7xl text-cima-text leading-[1.05] mb-6">
            Tu próximo hogar,{" "}
            <span className="text-cima-gold">en la mejor</span>
            <br />ciudad del norte.
          </h1>

          <p className="text-lg text-cima-text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            Casas, departamentos y terrenos en venta y renta en Monterrey y su área metropolitana.
            Asesoría honesta, resultados reales.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link
              href="/propiedades"
              className="flex items-center gap-2 rounded-xl bg-cima-gold px-7 py-3.5 font-heading font-semibold text-sm text-cima-bg hover:bg-cima-gold-light transition-colors"
            >
              Ver propiedades
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#vender"
              className="flex items-center gap-2 rounded-xl border border-cima-border px-7 py-3.5 font-heading font-semibold text-sm text-cima-text-muted hover:border-cima-gold/40 hover:text-cima-text transition-colors"
            >
              Quiero vender mi propiedad
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { label: `${totalProps ?? 0}+ propiedades activas`, icon: Home },
              { label: "8 años en el mercado",                    icon: TrendingUp },
              { label: "200+ familias asesoradas",                icon: Star },
              { label: "Operaciones verificadas",                 icon: Shield },
            ].map(({ label, icon: Icon }) => (
              <div key={label} className="flex items-center gap-2 rounded-full border border-cima-border bg-cima-card px-4 py-2">
                <Icon className="h-3.5 w-3.5 text-cima-gold" />
                <span className="text-xs text-cima-text-muted">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PROPERTIES ─────────────────── */}
      {featured.length > 0 && (
        <section className="px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="font-mono text-[10px] tracking-[0.2em] text-cima-gold uppercase mb-2">Propiedades destacadas</p>
                <h2 className="font-heading font-bold text-2xl text-cima-text">Selección premium</h2>
              </div>
              <Link href="/propiedades" className="flex items-center gap-1.5 text-sm text-cima-text-muted hover:text-cima-gold transition-colors">
                Ver todas
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── HOW IT WORKS ────────────────────────── */}
      <section className="px-6 py-16 border-y border-cima-border/50">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <p className="font-mono text-[10px] tracking-[0.2em] text-cima-gold uppercase mb-2">Proceso simple</p>
            <h2 className="font-heading font-bold text-2xl text-cima-text">¿Cómo funciona?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <p className="font-heading font-semibold text-cima-text mb-6 flex items-center gap-2">
                <span className="h-6 w-6 rounded-md bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center text-xs text-cima-gold font-mono">C</span>
                Para comprar o rentar
              </p>
              {[
                { n: "01", title: "Explora el catálogo",     desc: "Filtra por zona, precio y tipo de propiedad." },
                { n: "02", title: "Agenda una visita",       desc: "Selecciona fecha y hora. Tu asesor confirma en minutos." },
                { n: "03", title: "Cierra tu operación",     desc: "Te acompañamos hasta la firma y entrega de llaves." },
              ].map((step) => (
                <div key={step.n} className="flex gap-4 mb-6 last:mb-0">
                  <span className="font-mono text-xs text-cima-gold-dim shrink-0 mt-1">{step.n}</span>
                  <div>
                    <p className="font-medium text-sm text-cima-text mb-1">{step.title}</p>
                    <p className="text-xs text-cima-text-muted leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <p className="font-heading font-semibold text-cima-text mb-6 flex items-center gap-2">
                <span className="h-6 w-6 rounded-md bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center text-xs text-cima-gold font-mono">V</span>
                Para vender o rentar tu propiedad
              </p>
              {[
                { n: "01", title: "Solicita tu valuación",   desc: "Gratis y sin compromiso. Te decimos el precio justo." },
                { n: "02", title: "Publicamos y promovemos", desc: "Fotos profesionales, anuncios digitales y nuestro catálogo." },
                { n: "03", title: "Recibe ofertas",          desc: "Filtramos compradores serios. Solo hablas con interesados reales." },
              ].map((step) => (
                <div key={step.n} className="flex gap-4 mb-6 last:mb-0">
                  <span className="font-mono text-xs text-cima-gold-dim shrink-0 mt-1">{step.n}</span>
                  <div>
                    <p className="font-medium text-sm text-cima-text mb-1">{step.title}</p>
                    <p className="text-xs text-cima-text-muted leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SELL CTA ────────────────────────────── */}
      <section id="vender" className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-cima-gold/20 bg-gradient-to-br from-cima-card to-cima-surface p-8 md:p-12 gold-glow">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
              <div>
                <p className="font-mono text-[10px] tracking-[0.2em] text-cima-gold uppercase mb-3">Propietarios</p>
                <h2 className="font-heading font-bold text-3xl text-cima-text mb-4 leading-snug">
                  ¿Quieres vender o rentar tu propiedad?
                </h2>
                <p className="text-sm text-cima-text-muted leading-relaxed mb-6">
                  Cuéntanos sobre tu inmueble y un asesor de Cima te contactará para una valuación gratuita y sin compromiso.
                </p>
                <div className="space-y-2">
                  {[
                    "Valuación gratuita y sin compromiso",
                    "Fotos y video profesional incluidos",
                    "Publicación en múltiples plataformas",
                    "Asesoría legal durante todo el proceso",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-cima-gold shrink-0" />
                      <p className="text-xs text-cima-text-muted">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-cima-border bg-cima-card p-6">
                <SellForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ZONES ───────────────────────────────── */}
      <section id="zonas" className="px-6 py-16 border-t border-cima-border/50">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <p className="font-mono text-[10px] tracking-[0.2em] text-cima-gold uppercase mb-2">Cobertura</p>
            <h2 className="font-heading font-bold text-2xl text-cima-text">Zonas que manejamos</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {ZONES.map((zone) => (
              <Link
                key={zone.name}
                href={`/propiedades?zona=${encodeURIComponent(zone.name)}`}
                className="group rounded-xl border border-cima-border bg-cima-card px-5 py-4 hover:border-cima-gold/40 hover:bg-cima-surface transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-sm text-cima-text group-hover:text-cima-gold-light transition-colors leading-snug">{zone.name}</p>
                    <span className="font-mono text-[9px] tracking-widest text-cima-text-dim uppercase mt-1 block">{zone.tag}</span>
                  </div>
                  <MapPin className="h-3.5 w-3.5 text-cima-text-dim group-hover:text-cima-gold shrink-0 mt-0.5 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────── */}
      <section className="px-6 py-16 border-t border-cima-border/50">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <p className="font-mono text-[10px] tracking-[0.2em] text-cima-gold uppercase mb-2">Clientes</p>
            <h2 className="font-heading font-bold text-2xl text-cima-text">Lo que dicen de nosotros</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="rounded-xl border border-cima-border bg-cima-card p-6">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-cima-gold text-cima-gold" />
                  ))}
                </div>
                <p className="text-sm text-cima-text-muted leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="font-medium text-sm text-cima-text">{t.name}</p>
                  <p className="font-mono text-[10px] text-cima-text-dim uppercase tracking-widest">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────── */}
      <footer className="border-t border-cima-border px-6 py-10">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center">
              <Building2 className="h-3.5 w-3.5 text-cima-gold" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-heading font-bold text-sm text-cima-text">Cima Propiedades</span>
              <span className="font-mono text-[9px] tracking-[0.15em] text-cima-text-muted uppercase">Monterrey, N.L.</span>
            </div>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/propiedades" className="text-xs text-cima-text-muted hover:text-cima-text transition-colors">Propiedades</Link>
            <Link href="#vender" className="text-xs text-cima-text-muted hover:text-cima-text transition-colors">Vender</Link>
            <Link href="/admin" className="text-xs text-cima-text-dim hover:text-cima-text-muted transition-colors">Admin</Link>
          </nav>
          <p className="font-mono text-[10px] text-cima-text-dim">
            © {new Date().getFullYear()} Cima Propiedades
          </p>
        </div>
      </footer>

      {/* ── WA FLOATING BUTTON ─────────────────── */}
      <a
        href={`https://wa.me/${process.env.NEXT_PUBLIC_CIMA_WA}?text=Hola,%20me%20interesa%20una%20propiedad%20en%20Cima%20Propiedades`}
        target="_blank"
        rel="noreferrer"
        style={{ height: 52, width: 52 }}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full bg-[#25D366] shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:shadow-[0_4px_28px_rgba(37,211,102,0.6)] transition-shadow"
        aria-label="WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="white" width="26" height="26">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
}
