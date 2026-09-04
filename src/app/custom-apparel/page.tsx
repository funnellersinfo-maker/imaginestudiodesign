"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowRight, MapPin, Phone, Mail, X, Menu } from "lucide-react";
import { useLang } from "@/lib/i18n";
import StickyCTA, { FloatingCTA } from "@/components/sticky-cta";
import LangToggle from "@/components/lang-toggle";

/* ═══════════════════════════════════════════════════
   CUSTOM APPAREL LANDING — Premium, editorial, short
   ═══════════════════════════════════════════════════ */

const WHATSAPP_NUMBER = "19105474314";
const ADDRESS = "4608 Cedar Ave, Suite 105, Wilmington, NC 28403";

/* ───────── NAV ───────── */
function Nav({ waLink }: { waLink: string }) {
  const [open, setOpen] = useState(false);
  const { t, lang } = useLang();

  const navText = lang === "es" ? {
    visit: "VISITAR TIENDA",
    quote: "COTIZACIÓN GRATIS",
    links: ["Trabajo", "Servicios", "Equipo", "Contacto"]
  } : {
    visit: "VISIT OUR SHOP",
    quote: "FREE QUOTE",
    links: ["Work", "Services", "Team", "Contact"]
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glass-strong">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <a href="/" className="flex items-center gap-3 flex-shrink-0">
            <Image src="/LOGO.png" alt="Imagine Studio Design" width={140} height={40} className="h-8 lg:h-12 w-auto object-contain" priority />
          </a>
          <div className="hidden md:flex items-center gap-8">
            {navText.links.map((link, i) => (
              <a key={i} href={`#section-${i + 2}`} className="text-sm text-gray-400 hover:text-white transition-colors">{link}</a>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-4">
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="cta-primary text-white text-sm font-bold px-6 py-2.5 rounded-lg tracking-wide flex items-center gap-2">
              {navText.quote} <ArrowRight className="w-4 h-4" />
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

/* ───────── HERO — Carrusel automático con resplandor dopaminérgico ───────── */
const HERO_SLIDES = [
  "/images/apparel/hero/20220209_104058.jpg",
  "/images/apparel/hero/20220209_104128.jpg",
  "/images/apparel/hero/IMG-20260203-WA0056.jpg",
  "/images/apparel/hero/IMG-20260203-WA0099.jpg",
  "/images/apparel/hero/IMG-20260203-WA0100.jpg",
  "/images/apparel/hero/3b27ba9b-8ede-45e3-9777-4bf3d4526442.jpg",
  "/images/apparel/hero/5c7d8526-4bf8-4bbf-b0bd-3518955db925.jpg",
  "/images/apparel/hero/IMG-2HH0260423-WA0070.jpg",
];

function Hero({ waLink }: { waLink: string }) {
  const { lang } = useLang();
  const [slideIdx, setSlideIdx] = useState(0);

  // Auto-advance cada 3 segundos
  useEffect(() => {
    const id = setTimeout(() => setSlideIdx((i) => (i + 1) % HERO_SLIDES.length), 3000);
    return () => clearTimeout(id);
  }, [slideIdx]);

  const text = lang === "es" ? {
    headline1: "TU MARCA.",
    headline2: "EN CADA HILO.",
    sub: "Camisetas, Bordados y Gorras personalizadas para tu negocio, equipo o próximo evento.",
    cta: "COTIZACIÓN GRATIS"
  } : {
    headline1: "YOUR BRAND.",
    headline2: "ON EVERY THREAD.",
    sub: "Custom T-Shirts, Embroidery & Caps made for your business, team or next big event.",
    cta: "GET A FREE QUOTE"
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#050510] pt-40 pb-20">
      {/* Dopaminic glow background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#050510] via-[#0a0a1a] to-[#050510]" />
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-brand-purple/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-brand-hot-pink/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-brand-bright-blue/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Hook — headline + subtitle + CTA (ARRIBA) */}
      <div className="relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tighter leading-[0.95] text-white drop-shadow-2xl"
        >
          {text.headline1}<br />
          <span className="gradient-brand-text">{text.headline2}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-2xl mx-auto mt-8 mb-10 leading-relaxed drop-shadow-lg"
        >
          {text.sub}
        </motion.p>

        <motion.a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="cta-primary text-white font-bold px-10 py-5 rounded-xl text-base sm:text-lg tracking-wide flex items-center gap-3 min-w-[260px] justify-center animate-pulse-glow mx-auto"
          style={{ width: "fit-content" }}
        >
          {text.cta} <ArrowRight className="w-5 h-5" />
        </motion.a>
      </div>

      {/* Carrusel automático con shimmer-border-glow (ABAJO) */}
      <div className="relative z-10 w-full max-w-[500px] sm:max-w-[600px] lg:max-w-[700px] px-4">
        <div className="shimmer-border-glow rounded-3xl">
          <div className="shimmer-inner-dark rounded-[22px] overflow-hidden">
            <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-video rounded-[22px] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slideIdx}
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={HERO_SLIDES[slideIdx]}
                    alt={`Custom apparel work ${slideIdx + 1} — t-shirts, embroidery, caps by Imagine Studio Design in Wilmington NC`}
                    fill
                    priority={slideIdx === 0}
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 700px"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Slide dots */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlideIdx(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === slideIdx ? "bg-brand-hot-pink w-6" : "bg-white/30 hover:bg-white/50"}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
          <div className="w-1.5 h-3 rounded-full bg-white/40" />
        </div>
      </motion.div>
    </section>
  );
}

/* ───────── SECTION 2 — SERVICES (antes Section 3) ───────── */
function Services({ waLink }: { waLink: string }) {
  const { lang } = useLang();
  const text = lang === "es" ? {
    title: "LO QUE HACEMOS",
    services: [
      { num: "01", title: "Estampado", desc: "Tu diseño.\nTu mensaje.\nTu camiseta.", img: "/images/apparel/20220207_154015.jpg", cta: "EXPLORAR" },
      { num: "02", title: "Bordado Personalizado", desc: "Hecho para verse profesional.\nHecho para durar.", img: "/images/apparel/service-embroidery.jpg", cta: "EXPLORAR" },
      { num: "03", title: "Gorras Personalizadas", desc: "Pon tu marca\n donde la gente la vea.", img: "/images/apparel/service-caps.jpg", cta: "EXPLORAR" },
    ]
  } : {
    title: "WHAT WE MAKE",
    services: [
      { num: "01", title: "Custom Printing", desc: "Your design.\nYour message.\nYour shirt.", img: "/images/apparel/20220207_154015.jpg", cta: "EXPLORE" },
      { num: "02", title: "Custom Embroidery", desc: "Made to look professional.\nMade to last.", img: "/images/apparel/service-embroidery.jpg", cta: "EXPLORE" },
      { num: "03", title: "Custom Caps", desc: "Put your brand\nwhere people can see it.", img: "/images/apparel/service-caps.jpg", cta: "EXPLORE" },
    ]
  };

  return (
    <section id="section-3" className="relative py-24 lg:py-40 overflow-hidden bg-[#0a0a1a]">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-purple/10 rounded-full blur-[100px]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-center text-white mb-16 lg:mb-24"
        >
          {text.title}
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-10">
          {text.services.map((service, i) => (
            <motion.a
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="group cursor-pointer"
              href={waLink} target="_blank" rel="noopener noreferrer"
            >
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-6">
                <Image src={service.img} alt={`Custom apparel service: ${service.title} by Imagine Studio Design in Wilmington NC`} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <span className="absolute top-4 left-4 text-white/30 font-black text-2xl lg:text-3xl">{service.num}</span>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white font-bold text-xl lg:text-2xl mb-2">{service.title}</h3>
                  <p className="text-gray-300 text-sm lg:text-base whitespace-pre-line leading-relaxed">{service.desc}</p>
                  <span className="inline-flex items-center gap-1 mt-4 text-brand-hot-pink font-bold text-sm group-hover:gap-2 transition-all">
                    {service.cta} <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── SECTION 4 — BUSINESS APPAREL ───────── */
function BusinessApparel({ waLink }: { waLink: string }) {
  const { lang } = useLang();
  const text = lang === "es" ? {
    headline: "Haz que tu equipo luzca como un equipo.",
    body: "La ropa con marca ayuda a tu negocio a verse consistente, profesional y reconocible dondequiera que vaya tu equipo.",
    cta: "COTIZACIÓN GRATIS"
  } : {
    headline: "MAKE YOUR TEAM LOOK LIKE A TEAM.",
    body: "Branded apparel helps your business look consistent, professional and recognizable wherever your team goes.",
    cta: "GET A FREE QUOTE"
  };

  return (
    <section id="section-4" className="relative py-24 lg:py-40 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-black leading-[1.05] mb-8">
              {text.headline}
            </motion.h2>
            <p className="text-gray-600 text-lg lg:text-xl leading-relaxed mb-10 max-w-lg">
              {text.body}
            </p>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-black text-white font-bold px-8 py-4 rounded-xl text-base hover:bg-gray-800 transition-colors">
              {text.cta} <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative aspect-[4/3] rounded-3xl overflow-hidden"
          >
            <Image src="/images/apparel/team-imagine.jpg" alt="Imagine Studio Design team wearing matching branded apparel" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ───────── SECTION 5 — REAL WORK ───────── */
function RealWork() {
  const { lang } = useLang();
  const title = lang === "es" ? "HECHO AQUÍ." : "MADE HERE.";
  const subtitle = lang === "es" ? "Una tienda real con equipo real y producción real." : "A real shop with real equipment and real production.";

  const images = [
    { src: "/images/apparel/hero/20220209_104058.jpg", alt: "Custom apparel work — embroidered shirts and caps" },
    { src: "/images/apparel/hero/20220209_104128.jpg", alt: "Custom apparel work — branded apparel display" },
    { src: "/images/apparel/hero/IMG-20260203-WA0099.jpg", alt: "Custom apparel work — embroidery detail" },
    { src: "/images/apparel/hero/IMG-20260203-WA0100.jpg", alt: "Custom apparel work — finished branded apparel" },
    { src: "/images/apparel/hero/3b27ba9b-8ede-45e3-9777-4bf3d4526442.jpg", alt: "Custom apparel work — production process" },
    { src: "/images/apparel/hero/5c7d8526-4bf8-4bbf-b0bd-3518955db925.jpg", alt: "Custom apparel work — branded merchandise" },
    { src: "/images/apparel/hero/IMG-2HH0260423-WA0070.jpg", alt: "Custom apparel work — branded caps and shirts" },
    { src: "/images/apparel/hero/IMG-20260203-WA0056.jpg", alt: "Custom apparel work — finished embroidery" },
  ];

  return (
    <section id="section-5" className="relative py-24 lg:py-40 overflow-hidden bg-[#050510]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 lg:mb-24"
        >
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-white mb-4">{title}</h2>
          <p className="text-gray-400 text-lg lg:text-xl">{subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative overflow-hidden rounded-2xl ${i === 0 || i === 3 ? "aspect-[3/4]" : "aspect-square"}`}
            >
              <Image src={img.src} alt={img.alt} fill className="object-cover hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 50vw, 25vw" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── SECTION 6 — OCCASIONS ───────── */
function Occasions({ waLink }: { waLink: string }) {
  const { lang } = useLang();
  const text = lang === "es" ? {
    title: "¿QUÉ ESTÁS HACIENDO?",
    items: ["TU NEGOCIO", "TU EQUIPO", "TU EVENTO", "TU MARCA"]
  } : {
    title: "WHAT ARE YOU MAKING?",
    items: ["YOUR BUSINESS", "YOUR TEAM", "YOUR EVENT", "YOUR BRAND"]
  };

  const images = [
    "/images/apparel/hero/20220209_104058.jpg",
    "/images/apparel/hero/IMG-20260203-WA0099.jpg",
    "/images/apparel/20220207_154015.jpg",
    "/images/apparel/hero/IMG-20260203-WA0056.jpg",
  ];

  return (
    <section id="section-6" className="relative py-24 lg:py-40 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-center text-black mb-16 lg:mb-24"
        >
          {text.title}
        </motion.h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {text.items.map((item, i) => (
            <motion.a
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group cursor-pointer"
              href={waLink} target="_blank" rel="noopener noreferrer"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4">
                <Image src={images[i]} alt={`${item} — custom apparel for ${item.toLowerCase()} by Imagine Studio Design`} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 50vw, 25vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <h3 className="absolute bottom-0 left-0 right-0 p-4 lg:p-6 text-white font-bold text-base lg:text-xl">{item}</h3>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── SECTION 7 — FINAL CTA ───────── */
function FinalCTA({ waLink }: { waLink: string }) {
  const { lang } = useLang();
  const text = lang === "es" ? {
    headline: "¿LISTO PARA USAR TU MARCA?",
    sub: "Creemos algo que tu equipo estará orgulloso de usar.",
    cta: "COTIZACIÓN GRATIS",
    cta2: "VISITAR TIENDA",
    address: "4608 Cedar Ave, Suite 105, Wilmington, NC 28403",
    phone: "(910) 547-4314",
    email: "gtimaginedesign@gmail.com"
  } : {
    headline: "READY TO WEAR YOUR BRAND?",
    sub: "Let's create something your team will be proud to wear.",
    cta: "GET A FREE QUOTE",
    cta2: "VISIT OUR SHOP",
    address: "4608 Cedar Ave, Suite 105, Wilmington, NC 28403",
    phone: "(910) 547-4314",
    email: "gtimaginedesign@gmail.com"
  };

  return (
    <section id="section-7" className="relative py-24 lg:py-40 overflow-hidden bg-[#050510]">
      <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-brand-hot-pink/15 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] bg-brand-purple/15 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <Image src="/LOGO.png" alt="Imagine Studio Design" width={120} height={36} className="mx-auto h-10 lg:h-12 w-auto object-contain opacity-80" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter text-white mb-6 leading-[0.95]"
        >
          {text.headline}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-2xl mx-auto mb-12"
        >
          {text.sub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="cta-primary text-white font-bold px-10 py-5 rounded-xl text-base sm:text-lg tracking-wide flex items-center gap-3 min-w-[260px] justify-center animate-pulse-glow">
            {text.cta} <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center gap-3 text-gray-400 text-sm"
        >
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-hot-pink" />
            <span>{text.address}</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <a href="tel:+19105474314" className="flex items-center gap-2 text-gray-300 hover:text-emerald-400 transition-colors">
              <Phone className="w-4 h-4" /> {text.phone}
            </a>
            <a href={`mailto:${text.email}`} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
              <Mail className="w-4 h-4" /> {text.email}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ───────── MAIN PAGE ───────── */
export default function CustomApparelPage() {
  const { lang } = useLang();

  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    lang === "es"
      ? "Hola! Quiero una cotizacion de ropa personalizada (camisetas, bordados, gorras)."
      : "Hi! I'd like a quote for custom apparel (t-shirts, embroidery, caps)."
  )}`;

  const handleWaClick = () => {
    try { (window as any).fbq("track", "Lead", { content_name: "Apparel WhatsApp" }); } catch {}
    window.open(waLink, "_blank");
  };

  return (
    <main className="min-h-screen bg-background">
      <Nav waLink={waLink} />
      <LangToggle />
      <Hero waLink={waLink} />
      <Services waLink={waLink} />
      <BusinessApparel waLink={waLink} />
      <RealWork />
      <Occasions waLink={waLink} />
      <FinalCTA waLink={waLink} />
      <StickyCTA onQuoteClick={handleWaClick} />
      <FloatingCTA onQuoteClick={handleWaClick} />
    </main>
  );
}
