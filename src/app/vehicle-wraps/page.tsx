"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MapPin, Phone, Mail, X, Menu } from "lucide-react";
import { useLang } from "@/lib/i18n";
import StickyCTA, { FloatingCTA } from "@/components/sticky-cta";
import LangToggle from "@/components/lang-toggle";

const WHATSAPP_NUMBER = "19105474314";

/* ═══════════════════════════════════════════════════
   VEHICLE WRAPS PREMIUM LANDING
   ═══════════════════════════════════════════════════ */

const HERO_SLIDES = [
  "/images/hero/20240804_173141.jpg",
  "/images/hero/20230909_132155.jpg",
  "/images/hero/20240804_165750.jpg",
  "/images/hero/20250315_131334.jpg",
  "/images/hero/IMG-20250915-WA0057.jpg",
  "/images/hero/IMG-20251022-WA0069.jpg",
  "/images/hero/20240804_165723.jpg",
];

/* ───────── NAV ───────── */
function Nav({ waLink }: { waLink: string }) {
  const [open, setOpen] = useState(false);
  const { lang } = useLang();
  const nav = lang === "es" ? { quote: "COTIZAR", links: ["Trabajo", "Servicios", "Industrias", "Contacto"] } : { quote: "FREE QUOTE", links: ["Work", "Services", "Industries", "Contact"] };
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glass-strong">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <a href="/" className="flex items-center gap-3 flex-shrink-0">
            <Image src="/LOGO.png" alt="Imagine Studio Design" width={140} height={40} className="h-8 lg:h-12 w-auto object-contain" priority />
          </a>
          <div className="hidden md:flex items-center gap-8">
            {nav.links.map((link, i) => (
              <a key={i} href={`#section-${i + 2}`} className="text-sm text-gray-400 hover:text-white transition-colors">{link}</a>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-4">
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="cta-primary text-white text-sm font-bold px-6 py-2.5 rounded-lg tracking-wide flex items-center gap-2">
              {nav.quote} <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <button onClick={() => setOpen(!open)} className="md:hidden w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center" aria-label="Toggle menu">
            {open ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
          </button>
        </div>
      </div>
    </nav>
  );
}

/* ───────── HERO ───────── */
function Hero({ waLink }: { waLink: string }) {
  const { lang } = useLang();
  const [slideIdx, setSlideIdx] = useState(0);
  useEffect(() => {
    const id = setTimeout(() => setSlideIdx((i) => (i + 1) % HERO_SLIDES.length), 3000);
    return () => clearTimeout(id);
  }, [slideIdx]);
  const text = lang === "es" ? { h1: "TU VEHÍCULO ES", h2: "TU MEJOR VENDEDOR.", sub: "Vinilos vehiculares que convierten cada viaje en publicidad. Wilmington, NC.", cta: "COTIZACIÓN GRATIS" } : { h1: "YOUR VEHICLE IS", h2: "YOUR BEST SALESPERSON.", sub: "Vehicle wraps that turn every drive into advertising. Wilmington, NC.", cta: "GET A FREE QUOTE" };
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#050510] pt-40 pb-20">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#050510] via-[#0a0a1a] to-[#050510]" />
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-brand-purple/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-brand-hot-pink/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-brand-bright-blue/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: "2s" }} />
      </div>
      <div className="relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10">
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tighter leading-[0.95] text-white drop-shadow-2xl">
          {text.h1}<br /><span className="gradient-brand-text">{text.h2}</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-2xl mx-auto mt-8 mb-10 leading-relaxed drop-shadow-lg">
          {text.sub}
        </motion.p>
        <motion.a href={waLink} target="_blank" rel="noopener noreferrer" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="cta-primary text-white font-bold px-10 py-5 rounded-xl text-base sm:text-lg tracking-wide flex items-center gap-3 min-w-[260px] justify-center animate-pulse-glow mx-auto" style={{ width: "fit-content" }}>
          {text.cta} <ArrowRight className="w-5 h-5" />
        </motion.a>
      </div>
      <div className="relative z-10 w-full max-w-[500px] sm:max-w-[600px] lg:max-w-[700px] px-4">
        <div className="shimmer-border-glow rounded-3xl">
          <div className="shimmer-inner-dark rounded-[22px] overflow-hidden">
            <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-video rounded-[22px] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div key={slideIdx} initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-0">
                  <Image src={HERO_SLIDES[slideIdx]} alt={`Vehicle wrap work ${slideIdx + 1} — custom truck and van wraps by Imagine Studio Design in Wilmington NC`} fill priority={slideIdx === 0} className="object-cover" sizes="(max-width: 768px) 100vw, 700px" />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 mt-4">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setSlideIdx(i)} className={`w-2 h-2 rounded-full transition-all ${i === slideIdx ? "bg-brand-hot-pink w-6" : "bg-white/30 hover:bg-white/50"}`} aria-label={`Go to slide ${i + 1}`} />
          ))}
        </div>
      </div>
      <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2"><div className="w-1.5 h-3 rounded-full bg-white/40" /></div>
      </motion.div>
    </section>
  );
}

/* ───────── SECTION 2 — SERVICES ───────── */
function Services({ waLink }: { waLink: string }) {
  const { lang } = useLang();
  const text = lang === "es" ? {
    title: "LO QUE HACEMOS",
    services: [
      { num: "01", title: "Vinilo Completo", desc: "Tu vehículo completo\ntransformado en un\nbillboard móvil.", img: "/images/real-leon-tires.jpg", cta: "EXPLORAR" },
      { num: "02", title: "Vinilos Parciales", desc: "Impacto sin cubrir\ntodo el vehículo.\nMás económico.", img: "/images/apparel/partial-wrap-car.png", cta: "EXPLORAR" },
      { num: "03", title: "Branding de Flota", desc: "Tu flota completa\ncon la misma identidad.\nReconocimiento total.", img: "/images/apparel/fleet-two-cars.jpg", cta: "EXPLORAR" },
    ]
  } : {
    title: "WHAT WE MAKE",
    services: [
      { num: "01", title: "Full Wraps", desc: "Your entire vehicle\ntransformed into a\nmobile billboard.", img: "/images/real-leon-tires.jpg", cta: "EXPLORE" },
      { num: "02", title: "Partial Wraps", desc: "High impact without\nwrapping the whole\nvehicle. More affordable.", img: "/images/apparel/partial-wrap-car.png", cta: "EXPLORE" },
      { num: "03", title: "Fleet Branding", desc: "Your entire fleet with\nthe same identity.\nTotal recognition.", img: "/images/apparel/fleet-two-cars.jpg", cta: "EXPLORE" },
    ]
  };
  return (
    <section id="section-2" className="relative py-24 lg:py-40 overflow-hidden bg-[#0a0a1a]">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-purple/10 rounded-full blur-[100px]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-center text-white mb-16 lg:mb-24">{text.title}</motion.h2>
        <div className="grid md:grid-cols-3 gap-6 lg:gap-10">
          {text.services.map((service, i) => (
            <motion.a key={i} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.15 }} className="group cursor-pointer" href={waLink} target="_blank" rel="noopener noreferrer">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-6">
                <Image src={service.img} alt={`Vehicle wrap service: ${service.title} by Imagine Studio Design in Wilmington NC`} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <span className="absolute top-4 left-4 text-white/30 font-black text-2xl lg:text-3xl">{service.num}</span>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white font-bold text-xl lg:text-2xl mb-2">{service.title}</h3>
                  <p className="text-gray-300 text-sm lg:text-base whitespace-pre-line leading-relaxed">{service.desc}</p>
                  <span className="inline-flex items-center gap-1 mt-4 text-brand-hot-pink font-bold text-sm group-hover:gap-2 transition-all">{service.cta} <ArrowRight className="w-4 h-4" /></span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── SECTION 3 — BUSINESS WRAPS ───────── */
function BusinessWraps({ waLink }: { waLink: string }) {
  const { lang } = useLang();
  const text = lang === "es" ? { headline: "CADA VEHÍCULO ES UNA OPORTUNIDAD.", body: "Tu vehículo trabaja para ti cada día. Haz que cuente con un vinilo profesional que captura atención en cada esquina de Wilmington.", cta: "COTIZACIÓN GRATIS" } : { headline: "EVERY VEHICLE IS AN OPPORTUNITY.", body: "Your vehicle works for you every day. Make it count with a professional wrap that grabs attention on every corner of Wilmington.", cta: "GET A FREE QUOTE" };
  return (
    <section id="section-3" className="relative py-24 lg:py-40 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-black leading-[1.05] mb-8">{text.headline}</h2>
            <p className="text-gray-600 text-lg lg:text-xl leading-relaxed mb-10 max-w-lg">{text.body}</p>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-black text-white font-bold px-8 py-4 rounded-xl text-base hover:bg-gray-800 transition-colors">{text.cta} <ArrowRight className="w-5 h-5" /></a>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="relative aspect-[4/3] rounded-3xl overflow-hidden">
            <Image src="/images/apparel/team-booth.jpg" alt="Imagine Studio Design team at their booth with branded vehicle wraps showcase" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ───────── SECTION 4 — REAL WORK ───────── */
function RealWork() {
  const { lang } = useLang();
  const title = lang === "es" ? "HECHO AQUÍ." : "MADE HERE.";
  const subtitle = lang === "es" ? "Un taller real con equipo real y producción real." : "A real shop with real equipment and real production.";
  const images = [
    { src: "/images/real-leon-tires.jpg", alt: "Leon Tires vehicle wrap by Imagine Studio Design" },
    { src: "/images/real-pelones-framing.jpg", alt: "Los Pelones Framing van wrap by Imagine Studio Design" },
    { src: "/images/real-cabrera-flooring.jpg", alt: "Cabrera Flooring vehicle wrap by Imagine Studio Design" },
    { src: "/images/gallery-20230908_183945-web.jpg", alt: "Custom vehicle wrap detail work" },
    { src: "/images/gallery-IMG_7721-web.png", alt: "Commercial vehicle wrap installation" },
    { src: "/images/gallery-IMG_7809-web.png", alt: "Custom truck wrap finished project" },
    { src: "/images/carousel/empire-metal.jpg", alt: "Empire Metal roofing truck wrap by Imagine Studio Design" },
    { src: "/images/carousel/sunrise.jpg", alt: "Sunrise landscaping vehicle wrap by Imagine Studio Design" },
  ];
  return (
    <section id="section-4" className="relative py-24 lg:py-40 overflow-hidden bg-[#050510]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16 lg:mb-24">
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-white mb-4">{title}</h2>
          <p className="text-gray-400 text-lg lg:text-xl">{subtitle}</p>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {images.map((img, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className={`relative overflow-hidden rounded-2xl ${i === 0 || i === 3 ? "aspect-[3/4]" : "aspect-square"}`}>
              <Image src={img.src} alt={img.alt} fill className="object-cover hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 50vw, 25vw" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── SECTION 5 — INDUSTRIES (lista dopaminérgica, sin imágenes) ───────── */
function Industries({ waLink }: { waLink: string }) {
  const { lang } = useLang();
  const text = lang === "es" ? {
    title: "¿PARA QUIÉN?",
    subtitle: "Si tienes un vehículo de trabajo, necesitamos hablar.",
    items: ["CONTRATISTAS", "TECHADORES", "HVAC", "PLOMEROS", "ELECTRICISTAS", "JARDINEROS", "PINTORES", "TRANSPORTISTAS", "RESTAURANTES", "CONSTRUCTORES"]
  } : {
    title: "WHO'S IT FOR?",
    subtitle: "If you have a work vehicle, we need to talk.",
    items: ["CONTRACTORS", "ROOFERS", "HVAC", "PLUMBERS", "ELECTRICIANS", "LANDSCAPERS", "PAINTERS", "MOVERS", "RESTAURANTS", "BUILDERS"]
  };
  return (
    <section id="section-5" className="relative py-24 lg:py-40 overflow-hidden bg-[#050510]">
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-hot-pink/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-brand-purple/10 rounded-full blur-[100px]" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-white mb-6">{text.title}</motion.h2>
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-lg lg:text-xl text-gray-400 mb-16 lg:mb-20">{text.subtitle}</motion.p>
        <div className="flex flex-wrap items-center justify-center gap-3 lg:gap-5">
          {text.items.map((item, i) => (
            <motion.a
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group px-5 py-3 lg:px-7 lg:py-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-gradient-to-r hover:from-brand-purple/20 hover:to-brand-hot-pink/20 hover:border-brand-purple/30 transition-all duration-300"
            >
              <span className="text-white font-bold text-sm lg:text-lg tracking-wide group-hover:gradient-brand-text transition-all">{item}</span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── SECTION 6 — FINAL CTA ───────── */
function FinalCTA({ waLink }: { waLink: string }) {
  const { lang } = useLang();
  const text = lang === "es" ? { headline: "¿LISTO PARA DESTACAR?", sub: "Tu vehículo debería estar trabajando para ti. Convirtamos cada viaje en clientes.", cta: "COTIZACIÓN GRATIS", address: "4608 Cedar Ave, Suite 105, Wilmington, NC 28403", phone: "(910) 547-4314", email: "gtimaginedesign@gmail.com" } : { headline: "READY TO STAND OUT?", sub: "Your vehicle should be working for you. Let's turn every drive into customers.", cta: "GET A FREE QUOTE", address: "4608 Cedar Ave, Suite 105, Wilmington, NC 28403", phone: "(910) 547-4314", email: "gtimaginedesign@gmail.com" };
  return (
    <section id="section-6" className="relative py-24 lg:py-40 overflow-hidden bg-[#050510]">
      <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-brand-hot-pink/15 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] bg-brand-purple/15 rounded-full blur-[100px]" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-8">
          <Image src="/LOGO.png" alt="Imagine Studio Design" width={120} height={36} className="mx-auto h-10 lg:h-12 w-auto object-contain opacity-80" />
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter text-white mb-6 leading-[0.95]">{text.headline}</motion.h2>
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-2xl mx-auto mb-12">{text.sub}</motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="cta-primary text-white font-bold px-10 py-5 rounded-xl text-base sm:text-lg tracking-wide flex items-center gap-3 min-w-[260px] justify-center animate-pulse-glow">{text.cta} <ArrowRight className="w-5 h-5" /></a>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.6 }} className="flex flex-col items-center gap-3 text-gray-400 text-sm">
          <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-brand-hot-pink" /><span>{text.address}</span></div>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <a href="tel:+19105474314" className="flex items-center gap-2 text-gray-300 hover:text-emerald-400 transition-colors"><Phone className="w-4 h-4" /> {text.phone}</a>
            <a href={`mailto:${text.email}`} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"><Mail className="w-4 h-4" /> {text.email}</a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ───────── MAIN PAGE ───────── */
export default function VehicleWrapsPage() {
  const { lang } = useLang();
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    lang === "es" ? "Hola! Quiero una cotizacion de vinilos vehiculares." : "Hi! I'd like a quote for vehicle wraps."
  )}`;
  const handleWaClick = () => {
    try { (window as any).fbq("track", "Lead", { content_name: "Vehicle Wraps Premium WhatsApp" }); } catch {}
    window.open(waLink, "_blank");
  };
  return (
    <main className="min-h-screen bg-background">
      <Nav waLink={waLink} />
      <LangToggle />
      <Hero waLink={waLink} />
      <Services waLink={waLink} />
      <BusinessWraps waLink={waLink} />
      <RealWork />
      <Industries waLink={waLink} />
      <FinalCTA waLink={waLink} />
      <StickyCTA onQuoteClick={handleWaClick} />
      <FloatingCTA onQuoteClick={handleWaClick} />
    </main>
  );
}
