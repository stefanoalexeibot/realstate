"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./alejandro-landing.module.css";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronDown, Compass, Handshake, House, MapPin, Megaphone, MessageCircle, ShieldCheck } from "lucide-react";
import { CAMPAIGN_MUNICIPALITIES } from "@/lib/buyer-config";
import type { BuyerAttribution } from "@/lib/buyer-whatsapp";

const PHONE = "528121980008";
const choices = {
  tradicional: { label: "Venta tradicional", short: "Quiero vender en el mercado", description: "Diseñamos una estrategia para ofrecer tu propiedad a compradores y negociar las condiciones de venta.", icon: Megaphone },
  directa: { label: "Compra directa", short: "Quiero una propuesta de Cima", description: "Revisamos tu casa en su estado actual y, si la operación es viable, Cima presenta una propuesta de compra.", icon: House },
  orientacion: { label: "Necesito orientación", short: "Todavía no sé cuál elegir", description: "Primero conversamos sobre tu casa, tus tiempos y lo que quieres resolver. Después comparamos las opciones.", icon: Compass },
} as const;
type Modality = keyof typeof choices;
const field = "mt-2 block w-full rounded-xl border border-white/15 bg-[#101216] px-4 py-3.5 text-base text-[#f4f0e8] placeholder:text-[#90918f] focus:outline-none focus:ring-2 focus:ring-[#d5b87d]";
const goldButton = "inline-flex items-center justify-center gap-2 rounded-xl bg-[#d5b87d] px-6 py-3.5 font-semibold text-[#131416] transition-colors hover:bg-[#e4cc9a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d5b87d]";
const faq = [
  ["¿Cuál es la diferencia entre las dos modalidades?", "En la venta tradicional te acompaño a comercializar tu casa para encontrar un comprador. En la compra directa revisamos si Cima puede comprarla. Cambian el proceso, la forma de determinar el precio y las condiciones; los comparamos contigo antes de decidir."],
  ["¿Pueden revisar una casa con Infonavit o adeudos?", "Sí, podemos revisar el caso. Tener un crédito o adeudos no significa que la operación sea automáticamente viable. Primero conocemos la situación de la propiedad y después te explicamos los pasos que correspondan."],
  ["¿Necesito reparar mi casa antes de contactar?", "No necesitas hacer reparaciones para conversar sobre tus opciones. En compra directa revisamos su estado actual; en venta tradicional podemos analizar qué mejoras conviene considerar antes de ofrecerla."],
  ["¿La oferta de compra directa es igual al precio de publicación?", "No necesariamente. Una propuesta de compra considera el estado de la casa, reparaciones, adeudos y costos de la operación. El precio de publicación en venta tradicional es una estrategia de salida al mercado y tampoco garantiza el precio final de cierre."],
  ["¿Cuánto cuesta vender con asesoría?", "En venta tradicional te explico la comisión y el alcance del servicio antes de contratar. En compra directa revisamos el precio propuesto, los gastos y lo que recibirías. Las condiciones se aclaran para tu caso antes de avanzar."],
  ["¿Al escribirte me comprometo a vender?", "No. La primera conversación sirve para conocer tu situación. Tú decides si quieres continuar y bajo qué condiciones."],
];

export default function AlejandroLanding({ attribution }: { attribution: BuyerAttribution }) {
  const [modality, setModality] = useState<Modality>("orientacion");
  const [name, setName] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [timeline, setTimeline] = useState("");
  const [context, setContext] = useState("");
  const [attempted, setAttempted] = useState(false);
  const contactRef = useRef<HTMLElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [contactVisible, setContactVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [compareMode, setCompareMode] = useState<"tradicional" | "directa">("tradicional");

  useEffect(() => {
    const formObserver = new IntersectionObserver(([entry]) => setContactVisible(entry.isIntersecting), { threshold: 0 });
    if (formRef.current) formObserver.observe(formRef.current);
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries.find((entry) => entry.isIntersecting);
      if (visible) setActiveSection(visible.target.id);
    }, { rootMargin: "-20% 0px -65% 0px" });
    ["modalidades", "comparar", "sobre-mi", "contacto", "preguntas"].forEach((id) => {
      const section = document.getElementById(id);
      if (section) sectionObserver.observe(section);
    });
    return () => { formObserver.disconnect(); sectionObserver.disconnect(); };
  }, []);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        if (preference.matches || !(entry.target instanceof HTMLElement)) return;
        // Content remains visible without JavaScript or animation support.
        const animation = entry.target.animate([
          { opacity: 0.45, transform: "translateY(16px)" },
          { opacity: 1, transform: "translateY(0)" },
        ], { duration: 480, easing: "cubic-bezier(.22,1,.36,1)" });
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      });
    }, { threshold: 0.08 });
    pageRef.current?.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));
    const cancelMotion = () => { if (preference.matches) { animations.forEach(animation => animation.cancel()); animations.clear(); } };
    preference.addEventListener("change", cancelMotion);
    let frame = 0;
    const updateProgress = () => {
      frame = 0;
      const range = document.documentElement.scrollHeight - window.innerHeight;
      const progress = range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(updateProgress); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const resizeObserver = new ResizeObserver(onScroll);
    if (pageRef.current) resizeObserver.observe(pageRef.current);
    updateProgress();
    return () => {
      observer.disconnect(); resizeObserver.disconnect();
      animations.forEach(animation => animation.cancel());
      preference.removeEventListener("change", cancelMotion);
      window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  function whatsapp(message: string) {
    const source = [["Origen", attribution.utmSource], ["Medio", attribution.utmMedium], ["Campaña", attribution.utmCampaign], ["Anuncio", attribution.utmContent]]
      .flatMap(([label, value]) => value ? [`${label}: ${value.replace(/[\r\n]/g, " ").slice(0, 120)}`] : []);
    return `https://wa.me/${PHONE}?text=${encodeURIComponent([message, "Página: Alejandro Luna / asesoría personal", ...source].join("\n"))}`;
  }
  function choose(value: Modality) {
    setModality(value);
    formRef.current?.focus({ preventScroll: true });
    formRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  }
  const directContact = whatsapp("Hola Alejandro, me gustaría conversar contigo sobre cómo vender mi casa.");
  const formContact = whatsapp([
    `Hola Alejandro${name.trim() ? `, soy ${name.trim()}` : ""}. Quiero conocer mis opciones para vender.`,
    `Modalidad: ${choices[modality].label}`,
    `Municipio / zona de la propiedad: ${municipality.trim()}`,
    `Cuándo me gustaría vender: ${timeline}`,
    context.trim() ? `Sobre mi casa: ${context.trim()}` : "",
  ].filter(Boolean).join("\n"));
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAttempted(true);
    window.location.assign(formContact);
  }

  return (
    <div ref={pageRef} className={`${styles.page} min-h-screen bg-[#0b0e12] text-[#f4f0e8] selection:bg-[#d5b87d] selection:text-[#101216] pb-24 md:pb-0`}>
      <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-[#d5b87d] focus:p-3 focus:text-black">Saltar al contenido</a>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0e12]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
          <a href="#contenido" aria-label="Alejandro Luna, inicio" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d5b87d]/40 font-serif text-xl text-[#d5b87d]">AL</span>
            <span><span className="block text-sm font-semibold tracking-wide">Alejandro Luna</span><span className="mt-1 block text-[10px] uppercase tracking-[0.2em] text-[#d5b87d]">Cima Propiedades</span></span>
          </a>
          <nav aria-label="Navegación principal" className="hidden items-center gap-7 text-sm text-[#b9b9b5] md:flex">
            {[["modalidades", "Modalidades"], ["comparar", "Compara"], ["sobre-mi", "Sobre mí"], ["preguntas", "Preguntas"]].map(([id, label]) => <a key={id} href={`#${id}`} aria-current={activeSection === id ? "location" : undefined} className={activeSection === id ? "text-[#d5b87d]" : "hover:text-white"}>{label}</a>)}
          </nav>
          <a href={directContact} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#d5b87d]/35 px-3 text-sm text-[#d5b87d] sm:px-4"><MessageCircle size={17} aria-hidden="true" /><span className="hidden sm:inline">Hablemos</span><span className="sm:hidden">WhatsApp</span></a>
        </div>
        <nav aria-label="Secciones en celular" className="grid grid-cols-3 border-t border-white/10 text-xs md:hidden">
          {[["modalidades", "Modalidades"], ["comparar", "Comparar"], ["contacto", "Contactar"]].map(([id, label]) => <a key={id} href={`#${id}`} aria-current={activeSection === id ? "location" : undefined} className={`flex min-h-11 items-center justify-center border-b-2 transition-colors ${activeSection === id ? "border-[#d5b87d] text-[#d5b87d]" : "border-transparent text-[#b9b9b5]"}`}>{label}</a>)}
        </nav>
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-white/5"><div ref={progressRef} className="h-full origin-left bg-[#d5b87d]" style={{ transform: "scaleX(0)" }} /></div>
      </header>

      <main id="contenido">
        <section className={`${styles.architectureHero} relative overflow-hidden border-b border-white/10 px-5 py-10 sm:px-8 lg:py-24`}>
          <div aria-hidden="true" className={styles.architectureBackdrop}>
            <Image src="/asesores/casa-nuevo-leon-v1.png" alt="" fill priority sizes="100vw" quality={70} className={styles.architectureImage} />
            <div className={styles.architectureShade} />
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-32 h-[650px] w-[650px] rounded-full bg-[radial-gradient(ellipse,rgba(213,184,125,0.10),transparent_65%)]" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div>
              <a href="#sobre-mi" className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.03] py-2 pl-2 pr-5 transition-colors hover:border-[#d5b87d]/50">
                <Image src="/asesores/alejandro-luna.png" alt="" width={48} height={48} sizes="48px" priority className="h-12 w-12 rounded-full object-cover object-[50%_30%]" />
                <span className="text-left"><span className="block text-sm font-medium">Alejandro Luna</span><span className="block text-xs text-[#d5b87d]">Conoce a tu asesor <ArrowUpRight size={12} className="inline" aria-hidden="true" /></span></span>
              </a>
              <p className="mb-6 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[#d5b87d]"><span className="h-px w-8 bg-[#d5b87d]" />Asesoría personal · Nuevo León</p>
              <h1 data-reveal className="font-heading text-[2.4rem] font-bold leading-[1.08] tracking-[-0.045em] sm:text-6xl lg:text-[4.4rem]">Tu casa.<br />Tu siguiente paso.<br /><span className="font-serif font-normal italic tracking-[-0.035em] text-[#d5b87d]">Tu forma de vender.</span></h1>
              <p className="mt-7 max-w-lg text-base leading-relaxed text-[#b9b9b5] sm:text-lg">Soy <strong className="font-medium text-[#f4f0e8]">Alejandro Luna</strong>, de Cima Propiedades. Te ayudo a comparar la venta tradicional y la compra directa para elegir según tu casa, tus tiempos y tus prioridades.</p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"><a href="#modalidades" className={goldButton}>Conocer mis opciones <ArrowDown size={17} aria-hidden="true" /></a><a href={directContact} className="inline-flex min-h-11 items-center justify-center gap-2 text-sm text-[#d5b87d]">Hablar con Alejandro <ArrowUpRight size={17} aria-hidden="true" /></a></div>
              <p className="mt-6 text-xs leading-relaxed text-[#a5a7a5]">Una conversación para empezar. Tú decides cómo avanzar.</p>
            </div>
            <div className="relative rounded-[1.75rem] border border-white/40 bg-[#efe9dc]/95 p-6 text-[#17201e] shadow-[0_25px_90px_rgba(0,0,0,0.25)] sm:p-8">
              <div className="mb-7 flex items-center justify-between border-b border-[#17201e]/15 pb-5"><span className="text-[10px] font-semibold uppercase tracking-[0.2em]">Empecemos por ti</span><Compass className="text-[#78613c]" size={24} aria-hidden="true" /></div>
              <h2 data-reveal className="font-serif text-3xl leading-tight sm:text-4xl">¿Qué buscas<br />al vender tu casa?</h2>
              <p className="mb-6 mt-3 text-sm leading-relaxed text-[#5b635e]">Elige una opción para conversar sobre ella.</p>
              <div className="space-y-3">{(Object.entries(choices) as [Modality, typeof choices[Modality]][]).map(([key, item], index) => <button key={key} type="button" onClick={() => choose(key)} className={`${styles.choice} group flex w-full items-center gap-3 rounded-xl border border-[#17201e]/15 bg-white/40 p-4 text-left transition-colors hover:border-[#78613c] hover:bg-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#78613c]`}><span className="text-xs text-[#78613c]">0{index + 1}</span><span className="flex-1 text-sm font-semibold">{item.short}</span><ArrowUpRight size={18} className="text-[#78613c]" aria-hidden="true" /></button>)}</div>
              <div className="mt-6 flex items-center gap-2 text-xs text-[#5b635e]"><ShieldCheck size={16} aria-hidden="true" />Sin compromiso de venta</div>
            </div>
          </div>
        </section>

        <div className="border-b border-white/10 px-5 py-5"><div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-10 gap-y-3 text-xs text-[#b9b9b5] sm:justify-between">{[[Handshake,"Trato directo conmigo"],[Compass,"Dos modalidades de venta"],[FileIcon,"Condiciones claras antes de decidir"]].map(([Icon,label]) => {const I=Icon as typeof Handshake;return <span key={String(label)} className="flex items-center gap-2"><I size={16} className="text-[#d5b87d]" aria-hidden="true" />{String(label)}</span>})}</div></div>

        <section id="modalidades" className="scroll-mt-36 md:scroll-mt-24 px-5 py-16 sm:px-8 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs uppercase tracking-[0.2em] text-[#d5b87d]">Dos caminos, una decisión tuya</p>
            <div className="mb-10 mt-4 flex flex-col justify-between gap-5 md:flex-row md:items-end"><h2 data-reveal className="max-w-xl font-heading text-3xl font-semibold tracking-tight sm:text-4xl">Una estrategia que empiece<br className="hidden sm:block" /> por lo que tú necesitas.</h2><p className="max-w-sm text-sm leading-relaxed text-[#b9b9b5]">El estado de tu casa, el tiempo disponible y el precio esperado nos ayudan a elegir el camino.</p></div>
            <div className="grid gap-5 md:grid-cols-2">
              <article data-reveal className={`${styles.modalityCard} flex flex-col rounded-3xl border border-white/15 bg-[#11161c] p-6 sm:p-9`}>
                <div className="mb-8 flex items-center justify-between"><Megaphone size={28} className="text-[#d5b87d]" aria-hidden="true" /><span className="font-mono text-xs text-[#a5a7a5]">01 / COMERCIALIZACIÓN</span></div>
                <h3 className="font-serif text-4xl">Venta tradicional</h3><p className="mb-5 mt-2 text-sm text-[#d5b87d]">Te acompaño a encontrar un comprador.</p>
                <p className="text-sm leading-relaxed text-[#b9b9b5]">Para quien quiere ofrecer su propiedad al mercado y puede dedicar tiempo a la promoción, las visitas y la negociación.</p>
                <ul className="my-7 space-y-3 text-sm text-[#e0dfd9]">{["Análisis de la propiedad y estrategia de precio", "Plan de promoción y atención a interesados", "Coordinación de visitas y negociación", "Acompañamiento durante el proceso de venta"].map(text=><li key={text} className="flex gap-3"><Check size={17} className="mt-0.5 shrink-0 text-[#d5b87d]" aria-hidden="true" />{text}</li>)}</ul>
                <p className="mb-7 border-t border-white/10 pt-5 text-xs leading-relaxed text-[#a5a7a5]">El precio final y los tiempos dependen del mercado. Te explico la comisión y el servicio antes de contratar.</p><button type="button" onClick={()=>choose("tradicional")} className={`${goldButton} mt-auto`}>Quiero vender con asesoría <ArrowRight size={17} aria-hidden="true" /></button>
              </article>
              <article data-reveal className={`${styles.modalityCard} flex flex-col rounded-3xl border border-[#d5b87d]/35 bg-[linear-gradient(145deg,#23231e,#12171b)] p-6 sm:p-9`}>
                <div className="mb-8 flex items-center justify-between"><House size={28} className="text-[#d5b87d]" aria-hidden="true" /><span className="font-mono text-xs text-[#d5b87d]">02 / TE COMPRAMOS</span></div>
                <h3 className="font-serif text-4xl">Compra directa</h3><p className="mb-5 mt-2 text-sm text-[#d5b87d]">Revisamos si Cima puede comprar tu casa.</p>
                <p className="text-sm leading-relaxed text-[#b9b9b5]">Para quien quiere explorar una propuesta directa, incluso si la casa necesita reparaciones, tiene adeudos o está desocupada.</p>
                <ul className="my-7 space-y-3 text-sm text-[#e0dfd9]">{["Revisión de la casa en su estado actual", "Evaluación de crédito Infonavit o hipoteca", "Revisión de adeudos y documentación", "Propuesta explicada, si la compra es viable"].map(text=><li key={text} className="flex gap-3"><Check size={17} className="mt-0.5 shrink-0 text-[#d5b87d]" aria-hidden="true" />{text}</li>)}</ul>
                <p className="mb-7 border-t border-white/10 pt-5 text-xs leading-relaxed text-[#a5a7a5]">Cada caso requiere evaluación. La propuesta puede diferir del precio de venta en mercado abierto.</p><button type="button" onClick={()=>choose("directa")} className={`${goldButton} mt-auto`}>Quiero una propuesta de compra <ArrowRight size={17} aria-hidden="true" /></button>
              </article>
            </div>
            <div className="mt-5 flex flex-col items-start justify-between gap-4 rounded-2xl border border-white/10 px-6 py-5 sm:flex-row sm:items-center"><p className="text-sm text-[#b9b9b5]"><strong className="font-medium text-[#f4f0e8]">¿Tu situación es distinta?</strong> También podemos conversar antes de elegir.</p><button type="button" onClick={()=>choose("orientacion")} className="inline-flex min-h-11 shrink-0 items-center gap-2 text-sm text-[#d5b87d]">Ayúdame a decidir <ArrowRight size={16} aria-hidden="true" /></button></div>
          </div>
        </section>

        <section aria-label="Tu siguiente etapa" className="px-5 pb-16 sm:px-8 lg:pb-24">
          <div className="relative mx-auto min-h-[240px] max-w-6xl overflow-hidden rounded-3xl border border-[#d5b87d]/25 sm:min-h-[280px]">
            <Image src="/asesores/casa-nuevo-leon-v1.png" alt="" fill sizes="(max-width: 1200px) 100vw, 1152px" quality={65} className="object-cover object-[70%_60%]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0b0e12]/95 via-[#0b0e12]/70 to-[#0b0e12]/15" />
            <div className="relative max-w-lg px-6 py-10 sm:px-10 sm:py-12">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#e4cc9a]">Un nuevo comienzo</p>
              <h2 data-reveal className="mt-4 font-serif text-3xl leading-tight text-white sm:text-4xl">Cada casa tiene una historia.<br /><span className="italic text-[#e4cc9a]">Hablemos de la tuya.</span></h2>
              <a href="#contacto" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-white underline decoration-[#d5b87d]/60 underline-offset-8">Conversemos sobre tu casa <ArrowUpRight size={16} aria-hidden="true" /></a>
            </div>
            <span className="absolute bottom-3 right-4 rounded bg-black/55 px-2 py-1 text-[10px] text-white/80">Imagen ilustrativa</span>
          </div>
        </section>

        <section id="comparar" className="scroll-mt-36 md:scroll-mt-24 bg-[#efe9dc] px-5 py-16 text-[#17201e] sm:px-8 lg:py-20">
          <div className="mx-auto max-w-6xl"><p className="text-xs uppercase tracking-[0.2em] text-[#78613c]">Compara con calma</p><h2 data-reveal className="mb-9 mt-4 font-serif text-4xl sm:text-5xl">Lo que cambia en cada opción.</h2>
            <div className="hidden overflow-hidden rounded-2xl border border-[#17201e]/15 md:block"><table className="w-full text-left text-sm"><caption className="sr-only">Comparación de venta tradicional y compra directa</caption><thead className="bg-[#17201e]/5"><tr><th scope="col" className="p-5">Qué considerar</th><th scope="col" className="p-5">Venta tradicional</th><th scope="col" className="p-5">Compra directa</th></tr></thead><tbody>{comparison.map(row=><tr key={row[0]} className="border-t border-[#17201e]/15"><th scope="row" className="p-5 font-medium">{row[0]}</th><td className="max-w-xs p-5 leading-relaxed text-[#4f5953]">{row[1]}</td><td className="max-w-xs p-5 leading-relaxed text-[#4f5953]">{row[2]}</td></tr>)}</tbody></table></div>
            <div className="md:hidden">
              <div className="mb-5 grid grid-cols-2 rounded-xl border border-[#17201e]/20 p-1" role="group" aria-label="Modalidad para comparar">
                {(["tradicional", "directa"] as const).map((mode) => <button key={mode} type="button" aria-pressed={compareMode === mode} onClick={() => setCompareMode(mode)} className={`min-h-12 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${compareMode === mode ? "bg-[#17201e] text-[#efe9dc] shadow-sm" : "text-[#4f5953]"}`}>{choices[mode].label}</button>)}
              </div>
              <dl className="divide-y divide-[#17201e]/15 rounded-2xl border border-[#17201e]/15 px-5" aria-live="polite">
                {comparison.map((row) => <div key={row[0]} className="py-5"><dt className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#78613c]">{row[0]}</dt><dd key={compareMode} className={`${styles.contentChange} text-sm leading-relaxed text-[#4f5953]`}>{row[compareMode === "tradicional" ? 1 : 2]}</dd></div>)}
              </dl>
              <button type="button" onClick={() => choose(compareMode)} className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#17201e]/30 px-4 py-3 text-sm font-semibold">Consultar {choices[compareMode].label.toLowerCase()} <ArrowRight size={16} aria-hidden="true" /></button>
            </div>
            <p className="mt-6 max-w-3xl text-sm leading-relaxed text-[#5b635e]">La mejor opción depende de tu propiedad. Revisamos las condiciones y el monto que recibirías antes de tomar una decisión.</p>
          </div>
        </section>

        <section id="sobre-mi" className={`${styles.advisorScene} relative isolate overflow-hidden scroll-mt-36 md:scroll-mt-24 px-5 py-16 sm:px-8 lg:py-24`}>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            <Image src="/asesores/interior-asesor-v1.png" alt="" fill sizes="100vw" quality={65} className="object-cover object-center" />
            <div className={styles.advisorShade} />
          </div>
          <div className="mx-auto max-w-6xl">
            <div className="mb-14 grid items-center gap-9 md:grid-cols-[0.8fr_1fr] lg:gap-16">
              <figure data-reveal className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-[#d5b87d]/25 bg-[#171a1d]">
                <Image src="/asesores/alejandro-luna.png" alt="Alejandro Luna, asesor de Cima Propiedades" width={1086} height={1448} sizes="(max-width: 767px) calc(100vw - 40px), 448px" className="aspect-[3/4] w-full object-cover" />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent px-7 pb-7 pt-20"><span className="block font-serif text-3xl text-white">Alejandro Luna</span><span className="mt-2 block text-xs uppercase tracking-[0.18em] text-[#e4cc9a]">Asesor · Cima Propiedades</span></figcaption>
              </figure>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#d5b87d]">Conoce a tu asesor</p>
                <h2 data-reveal className="mt-4 font-heading text-3xl font-semibold leading-tight sm:text-4xl">Soy Alejandro Luna.<br /><span className="font-serif font-normal italic text-[#d5b87d]">Hablemos de lo que sigue para ti.</span></h2>
                <p className="mt-6 text-base leading-relaxed text-[#b9b9b5]">Tengo 25 años y soy asesor de Cima Propiedades en Nuevo León. He cerrado alrededor de 30 propiedades. Esa experiencia me ha enseñado que detrás de cada operación hay una historia y una persona que necesita respuestas claras.</p>
                <p className="mt-4 text-base leading-relaxed text-[#b9b9b5]">Mi forma de trabajar empieza por escucharte: conocer tu propiedad, entender tus tiempos y saber qué necesitas resolver. Te acompaño a comparar la venta tradicional y la compra directa, explicándote las opciones y las condiciones antes de que decidas.</p>
                <div className="mt-7 grid grid-cols-2 gap-4 rounded-2xl border border-[#d5b87d]/25 bg-[#d5b87d]/5 p-5" aria-label="Experiencia de Alejandro Luna">
                  <div><p className="font-serif text-4xl text-[#d5b87d]" aria-label="Alrededor de 30">≈30</p><p className="mt-2 text-sm text-[#e0dfd9]">Propiedades cerradas</p><p className="mt-1 text-xs text-[#a5a7a5]">A lo largo de mi trayectoria</p></div>
                  <div className="border-l border-[#d5b87d]/20 pl-5"><p className="font-serif text-4xl text-[#d5b87d]">1 a 1</p><p className="mt-2 text-sm text-[#e0dfd9]">Trato personal</p><p className="mt-1 text-xs text-[#a5a7a5]">Hablas directamente conmigo</p></div>
                </div>
                <ul className="my-7 space-y-3 text-sm text-[#e0dfd9]">{["Conversación directa conmigo", "Opciones explicadas según tu situación", "Seguimiento del siguiente paso acordado"].map(text=><li key={text} className="flex gap-3"><Check size={17} className="mt-0.5 shrink-0 text-[#d5b87d]" aria-hidden="true" />{text}</li>)}</ul>
                <a href={directContact} className={goldButton}>Platicar con Alejandro <MessageCircle size={17} aria-hidden="true" /></a>
              </div>
            </div>
            <div className="grid gap-7 md:grid-cols-3">{[["01","Conversamos","Me compartes dónde está tu casa, su situación y cuándo te gustaría vender."],["02","Comparamos","Revisamos qué modalidad podría encajar y qué necesitamos conocer de la propiedad."],["03","Tú decides","Te explico el proceso y las condiciones para que elijas si quieres avanzar."]].map(([number,title,text])=><div key={number} className="border-t border-[#d5b87d]/30 pt-6"><span className="font-mono text-xs text-[#d5b87d]">{number}</span><h3 className="mb-3 mt-4 text-xl font-medium">{title}</h3><p className="text-sm leading-relaxed text-[#b9b9b5]">{text}</p></div>)}</div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#11161c] px-5 py-10 sm:px-8"><div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2"><div><p className="mb-3 flex items-center gap-2 text-sm text-[#d5b87d]"><MapPin size={17} aria-hidden="true" />Nuevo León</p><h2 data-reveal className="font-serif text-3xl">Tu ubicación también importa.</h2><p className="mt-3 max-w-md text-sm leading-relaxed text-[#b9b9b5]">Para venta tradicional, cuéntame el municipio y la zona. Para compra directa, estamos enfocándonos en:</p></div><div className="flex flex-col justify-center"><div className="flex flex-wrap gap-2">{CAMPAIGN_MUNICIPALITIES.map(name=><span key={name} className="rounded-full border border-white/15 px-4 py-2 text-sm">{name}</span>)}</div><p className="mt-4 text-xs leading-relaxed text-[#a5a7a5]">Si la casa está cerca, comparte su ubicación para revisar si podemos atenderla.</p></div></div></section>

        <section id="contacto" ref={contactRef} className="scroll-mt-36 md:scroll-mt-24 px-5 py-16 sm:px-8 lg:py-24"><div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.85fr_1fr] lg:gap-20"><div><p className="text-xs uppercase tracking-[0.2em] text-[#d5b87d]">Hablemos de tu casa</p><h2 data-reveal className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">El siguiente paso<br />es una conversación.</h2><p className="mt-5 max-w-md text-base leading-relaxed text-[#b9b9b5]">Cuéntame lo básico y seguimos por WhatsApp. No necesitas tener todos los documentos ni saber qué modalidad elegir.</p><div className="mt-8 flex items-center gap-4"><Image src="/asesores/alejandro-luna.png" alt="Alejandro Luna" width={56} height={56} sizes="56px" className="h-14 w-14 rounded-full border border-[#d5b87d]/40 object-cover object-[50%_30%]" /><div><p className="font-medium">Alejandro Luna</p><p className="mt-1 text-sm text-[#a5a7a5]">Asesor · Cima Propiedades</p></div></div><a href={directContact} className="mt-7 inline-flex items-center gap-3 text-lg text-[#d5b87d]"><MessageCircle size={20} aria-hidden="true" />812 198 0008</a><p className="mt-3 text-xs text-[#a5a7a5]">También puedes escribirme directamente.</p></div>
          <form ref={formRef} tabIndex={-1} aria-label="Consulta personal con Alejandro" onSubmit={submit} className="scroll-mt-36 md:scroll-mt-24 rounded-3xl border border-white/15 bg-[#11161c] p-6 sm:p-8">
            <div className="mb-6 border-b border-white/10 pb-5">
              <span className="text-[10px] uppercase tracking-[0.18em] text-[#d5b87d]">Tu consulta personal</span>
              <h3 className="mt-2 text-xl font-medium">Cuéntame lo esencial.</h3>
              <p className="mt-2 text-xs leading-relaxed text-[#b9b9b5]">Solo necesitas la zona y cuándo te gustaría vender. Lo demás es opcional.</p>
              <div className="mt-4 flex gap-2" aria-label={`${Number(Boolean(municipality.trim())) + Number(Boolean(timeline))} de 2 datos necesarios completos`}>
                {[Boolean(municipality.trim()), Boolean(timeline)].map((complete, index) => <span key={index} className={`h-1 flex-1 rounded-full transition-colors ${complete ? "bg-[#d5b87d]" : "bg-white/15"}`} />)}
              </div>
            </div>
            <label htmlFor="al-modality" className="block text-sm">Me interesa<select id="al-modality" className={field} value={modality} onChange={event=>setModality(event.target.value as Modality)}>{(Object.entries(choices) as [Modality, typeof choices[Modality]][]).map(([key,value])=><option key={key} value={key}>{value.label}</option>)}</select></label>
            <p key={modality} className={`${styles.contentChange} mt-3 text-xs leading-relaxed text-[#b9b9b5]`} aria-live="polite">{choices[modality].description}</p>
            <label htmlFor="al-municipality" className="mt-5 block text-sm">Municipio o zona de la propiedad <span className="text-[#d5b87d]">*</span><input id="al-municipality" className={field} required pattern=".*\S.*" maxLength={120} list="al-zones" placeholder="Ej. García, Nuevo León" value={municipality} onChange={event=>setMunicipality(event.target.value)} /><datalist id="al-zones">{CAMPAIGN_MUNICIPALITIES.map(value=><option key={value} value={value} />)}<option value="Monterrey" /><option value="Guadalupe" /><option value="Apodaca" /></datalist></label>
            <label htmlFor="al-timeline" className="mt-5 block text-sm">¿Cuándo te gustaría vender? <span className="text-[#d5b87d]">*</span><select id="al-timeline" className={field} required value={timeline} onChange={event=>setTimeline(event.target.value)}><option value="">Selecciona una opción</option>{["Lo antes posible","En 1 a 3 meses","Más adelante","Estoy explorando opciones"].map(value=><option key={value}>{value}</option>)}</select></label>
            <details className="mt-5 rounded-xl border border-white/10 px-4 py-3">
              <summary className="cursor-pointer py-1 text-sm text-[#d5b87d]">Agregar mi nombre o detalles (opcional)</summary>
            <label htmlFor="al-name" className="mt-5 block text-sm">Tu nombre <span className="text-[#a5a7a5]">(opcional)</span><input id="al-name" className={field} maxLength={80} autoComplete="given-name" placeholder="¿Cómo te llamas?" value={name} onChange={event=>setName(event.target.value)} /></label>
            <label htmlFor="al-context" className="mt-5 block text-sm">¿Qué te gustaría resolver? <span className="text-[#a5a7a5]">(opcional)</span><textarea id="al-context" className={`${field} resize-y`} maxLength={600} rows={3} placeholder="Por ejemplo: está desocupada, necesita arreglos o quiero cambiar de casa." value={context} onChange={event=>setContext(event.target.value)} /></label>
            </details>
            <details className="mt-5 text-xs text-[#b9b9b5]">
              <summary className="cursor-pointer py-2">Ver el mensaje antes de continuar</summary>
              <p className="mt-2 whitespace-pre-line rounded-xl border border-white/10 bg-[#0b0e12] p-4 leading-relaxed">{[
                `Hola Alejandro${name.trim() ? `, soy ${name.trim()}` : ""}. Quiero conocer mis opciones para vender.`,
                `Modalidad: ${choices[modality].label}`,
                `Municipio / zona: ${municipality.trim() || "Por completar"}`,
                `Cuándo me gustaría vender: ${timeline || "Por completar"}`,
                context.trim() ? `Sobre mi casa: ${context.trim()}` : "",
              ].filter(Boolean).join("\n")}</p>
            </details>
            <button type="submit" className={`${goldButton} mt-6 w-full`}>Conversar con Alejandro <ArrowUpRight size={18} aria-hidden="true" /></button>
            <p className="mt-4 text-xs leading-relaxed text-[#a5a7a5]">Se abrirá WhatsApp con tu mensaje preparado. Revísalo y pulsa Enviar para hacérmelo llegar. No se guarda una solicitud en esta página.</p>
            {attempted && <p role="status" className="mt-3 text-sm text-[#d5b87d]">¿No se abrió WhatsApp? <a className="underline" href={formContact}>Abre aquí tu mensaje</a>.</p>}
            <details id="datos-personales" className="mt-5 scroll-mt-36 md:scroll-mt-24 border-t border-white/10 pt-4 text-xs text-[#a5a7a5]"><summary className="cursor-pointer">Cómo se comparten tus datos</summary><p className="mt-3 leading-relaxed">Al continuar, lo que escribiste se incluye en un enlace a WhatsApp. Alejandro recibe el mensaje cuando lo envías allí y puede responderte por ese medio. No incluyas números de crédito, documentos ni datos bancarios.</p>{process.env.NEXT_PUBLIC_PRIVACY_URL && <a href={process.env.NEXT_PUBLIC_PRIVACY_URL} className="mt-3 inline-block underline">Aviso de privacidad</a>}</details>
          </form></div></section>

        <section id="preguntas" className="scroll-mt-36 md:scroll-mt-24 border-t border-white/10 px-5 py-16 sm:px-8"><div className="mx-auto max-w-3xl"><p className="text-xs uppercase tracking-[0.2em] text-[#d5b87d]">Antes de decidir</p><h2 data-reveal className="mb-8 mt-4 font-heading text-3xl font-semibold">Respuestas claras.</h2><div className="divide-y divide-white/10">{faq.map(([question,answer])=><details key={question} className="group py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium [&::-webkit-details-marker]:hidden">{question}<ChevronDown size={17} className="shrink-0 text-[#d5b87d] transition-transform group-open:rotate-180" aria-hidden="true" /></summary><p className="mt-4 pr-6 text-sm leading-relaxed text-[#b9b9b5]">{answer}</p></details>)}</div></div></section>
      </main>
      <footer className="border-t border-white/10 px-5 py-8 sm:px-8"><div className="mx-auto flex max-w-6xl flex-col justify-between gap-5 text-xs text-[#a5a7a5] md:flex-row"><p><span className="font-medium text-[#f4f0e8]">Alejandro Luna</span> · Cima Propiedades · Nuevo León</p><div className="flex flex-wrap gap-5"><Link href="/" className="hover:text-white">Sitio general de Cima <ArrowUpRight size={12} className="inline" aria-hidden="true" /></Link><a href="#datos-personales" className="hover:text-white">Cómo se comparten tus datos</a></div><p>© {new Date().getFullYear()} Cima Propiedades</p></div></footer>
      {!contactVisible && <div className={`${styles.stickyEnter} fixed inset-x-0 bottom-0 z-40 border-t border-white/15 bg-[#0b0e12]/95 px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-lg md:hidden`}><a href="#contacto" className={`${goldButton} w-full text-sm`}>Hablemos de tu casa <MessageCircle size={17} aria-hidden="true" /></a></div>}
    </div>
  );
}

const FileIcon = ShieldCheck;
const comparison = [
  ["Quién compra", "Un comprador que encontramos mediante la comercialización.", "Cima, si la propiedad y la operación son viables."],
  ["Cómo se plantea el precio", "Definimos una estrategia de publicación y negociamos con interesados.", "Se prepara una propuesta considerando estado, adeudos y costos."],
  ["Estado de la casa", "Analizamos cómo presentarla y qué ajustes conviene considerar.", "Se evalúa en su estado actual, incluso si necesita reparaciones."],
  ["Tiempo y condiciones", "Dependen de la demanda, el comprador y la documentación.", "Se acuerdan después de revisar la viabilidad de la compra."],
];
