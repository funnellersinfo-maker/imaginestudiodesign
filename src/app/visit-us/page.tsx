"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Phone, Navigation, ArrowRight, MessageCircle } from "lucide-react";
import LangToggle from "@/components/lang-toggle";
import { useLang } from "@/lib/i18n";

const LAT = 34.2134;
const LNG = -77.8824;
const ADDRESS = "4608 Cedar Ave, Suite 105, Wilmington, NC 28403";
const PHONE = "19105474314";
const PHONE_DISPLAY = "(910) 547-4314";
const BUSINESS_QUERY = "Imagine+Studio+Design+4608+Cedar+Ave+Wilmington+NC+28403";

const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${BUSINESS_QUERY}`;
const wazeUrl = `https://www.waze.com/ul?q=${BUSINESS_QUERY}&navigate=yes`;
const appleMapsUrl = `maps://?daddr=${LAT},${LNG}&q=${BUSINESS_QUERY}`;
const waLink = `https://wa.me/${PHONE}?text=${encodeURIComponent("Hi! I'd like to visit your studio. Can you help me with directions?")}`;

function trackGetDirections() {
  try { (window as any).fbq("track", "Lead", { content_name: "Get Directions" }); } catch {}
  try { (window as any).fbq("trackCustom", "VisitIntent", { source: "directions_button" }); } catch {}
}
function trackCall() {
  try { (window as any).fbq("track", "Contact", { content_name: "Call Us" }); } catch {}
}
function trackWhatsApp() {
  try { (window as any).fbq("track", "Contact", { content_name: "WhatsApp Visit Us" }); } catch {}
}

/* ───────── TRACKING — Analytics (sin geolocalización, cero fricción) ───────── */
const SESSION_ID = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

function trackPageView() {
  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "pageview",
      path: window.location.pathname,
      referrer: document.referrer,
      sessionId: SESSION_ID,
    }),
  }).catch(() => {});
}

function trackHeartbeat(scrollDepth: number) {
  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "heartbeat",
      sessionId: SESSION_ID,
      scrollDepth,
    }),
  }).catch(() => {});
}

function trackSessionEnd(scrollDepth: number, reason: string) {
  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "session_end",
      sessionId: SESSION_ID,
      scrollDepth,
      reason,
    }),
  }).catch(() => {});
}

function trackEvent(eventName: string) {
  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "event",
      eventName,
      sessionId: SESSION_ID,
      path: window.location.pathname,
    }),
  }).catch(() => {});
}

/* ───────── STICKY BAR (mobile) ───────── */
function StickyBar() {
  const { lang } = useLang();
  const [visible, setVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 200);
    window.addEventListener("scroll", onScroll, { passive: true });
    const ua = navigator.userAgent || "";
    const ios = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    setIsIOS(ios);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const text = lang === "es" ? { google: "Google Maps", waze: "Waze", wa: "WhatsApp" } : { google: "Google Maps", waze: "Waze", wa: "WhatsApp" };
  if (!visible) return null;

  return (
    <motion.div
      initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
    >
      <div className="glass-strong border-t border-white/10 px-2 py-2 flex items-center gap-1.5">
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" onClick={() => { trackGetDirections(); trackEvent("Get Directions"); }} className="flex-1 flex items-center justify-center gap-1 cta-primary text-white font-bold py-3 rounded-xl text-[10px] min-h-[56px]">
          <Navigation className="w-4 h-4" /> {text.google}
        </a>
        <a href={isIOS ? appleMapsUrl : wazeUrl} target="_blank" rel="noopener noreferrer" onClick={() => { trackGetDirections(); trackEvent("Get Directions"); }} className="flex-1 flex items-center justify-center gap-1 bg-white/10 border border-white/20 text-white font-bold py-3 rounded-xl text-[10px] min-h-[56px]">
          <Navigation className="w-4 h-4" /> {isIOS ? "Apple Maps" : text.waze}
        </a>
        <a href={waLink} target="_blank" rel="noopener noreferrer" onClick={() => { trackWhatsApp(); trackEvent("WhatsApp"); }} className="w-14 h-14 rounded-xl bg-[#25D366] flex items-center justify-center flex-shrink-0 glow-brand-sm">
          <MessageCircle className="w-5 h-5 text-white" />
        </a>
      </div>
    </motion.div>
  );
}

/* ───────── HERO ───────── */
function Hero() {
  const { lang } = useLang();
  const text = lang === "es" ? {
    badge: "Wilmington, NC",
    h1: "HAZ QUE TU NEGOCIO",
    h1highlight: "DESTAQUE.",
    sub: "Vinilos vehiculares, ropa personalizada y bordado para negocios locales.",
    urgency: "Puedes venir cuando quieras · Agenda para atenderte mejor",
    directions: "CÓMO LLEGAR",
    call: "LLAMAR",
    whatsapp: "WHATSAPP",
    hours: "Lunes – Viernes · 9:00 AM – 5:30 PM"
  } : {
    badge: "Wilmington, NC",
    h1: "MAKE YOUR BUSINESS",
    h1highlight: "STAND OUT.",
    sub: "Vehicle wraps, custom apparel & embroidery for local businesses.",
    urgency: "Walk-ins welcome · Appointments get priority",
    directions: "GET DIRECTIONS",
    call: "CALL US",
    whatsapp: "WHATSAPP",
    hours: "Monday – Friday · 9:00 AM – 5:30 PM"
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#050510]">
      <div className="absolute inset-0 z-0">
        <Image src="/images/hero/20240804_173141.jpg" alt="Custom vehicle wrap by Imagine Studio Design in Wilmington NC" fill priority className="object-cover opacity-40" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050510]/70 via-[#050510]/80 to-[#050510]" />
      </div>
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-brand-purple/15 rounded-full blur-[120px] z-0" />
      <div className="absolute bottom-1/3 right-1/3 w-[400px] h-[400px] bg-brand-hot-pink/10 rounded-full blur-[100px] z-0" />

      {/* Nav */}
      <div className="absolute top-0 left-0 right-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <Image src="/LOGO.png" alt="Imagine Studio Design" width={120} height={36} className="h-8 w-auto object-contain" />
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-32 pb-12">
        <div className="text-center mb-8">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="text-sm font-semibold tracking-widest uppercase text-brand-hot-pink mb-6">
            {text.badge}
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.95] text-white mb-6">
            {text.h1}<br /><span className="gradient-brand-text">{text.h1highlight}</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-xl mx-auto mb-4">
            {text.sub}
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> {text.urgency}
          </motion.p>
        </div>

        {/* MAP */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="max-w-2xl mx-auto">
          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-brand-purple/10 mb-4">
            <iframe src={`https://www.google.com/maps?q=${BUSINESS_QUERY}&output=embed`} width="100%" height="280" style={{ border: 0, display: "block" }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Imagine Studio Design Location" />
          </div>

          <div className="text-center mb-6">
            <p className="text-white font-semibold text-sm lg:text-base flex items-center justify-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-brand-hot-pink" /> {ADDRESS}
            </p>
            <p className="text-gray-400 text-xs lg:text-sm">{text.hours}</p>
          </div>

          {/* CTAs with animations */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <motion.a href={mapsUrl} target="_blank" rel="noopener noreferrer" onClick={() => { trackGetDirections(); trackEvent("Get Directions"); }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="cta-primary text-white font-bold py-4 rounded-xl text-sm tracking-wide flex items-center justify-center gap-2 animate-pulse-glow">
              <Navigation className="w-4 h-4" /> Google Maps
            </motion.a>
            <motion.a href={wazeUrl} target="_blank" rel="noopener noreferrer" onClick={() => { trackGetDirections(); trackEvent("Get Directions"); }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-[#33CCFF] text-white font-bold py-4 rounded-xl text-sm tracking-wide flex items-center justify-center gap-2 hover:bg-[#2BB5E8] transition-colors">
              <Navigation className="w-4 h-4" /> Waze
            </motion.a>
            <motion.a href={waLink} target="_blank" rel="noopener noreferrer" onClick={() => { trackWhatsApp(); trackEvent("WhatsApp"); }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-[#25D366] text-white font-bold py-4 rounded-xl text-sm tracking-wide flex items-center justify-center gap-2 hover:bg-[#22c55e] transition-colors">
              <MessageCircle className="w-4 h-4" /> {text.whatsapp}
            </motion.a>
            <motion.a href={`tel:+${PHONE}`} onClick={() => { trackCall(); trackEvent("Call Us"); }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-emerald-600 text-white font-bold py-4 rounded-xl text-sm tracking-wide flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors">
              <Phone className="w-4 h-4" /> {text.call}
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ───────── REAL WORK ───────── */
function RealWork() {
  const { lang } = useLang();
  const title = lang === "es" ? "NUESTRO TRABAJO." : "SEE OUR WORK.";
  const images = [
    { src: "/images/real-leon-tires.jpg", alt: "Leon Tires vehicle wrap" },
    { src: "/images/apparel/service-embroidery.jpg", alt: "Custom embroidery caps" },
    { src: "/images/apparel/fleet-two-cars.jpg", alt: "Fleet branding two vehicles" },
    { src: "/images/real-cabrera-flooring.jpg", alt: "Cabrera Flooring vehicle wrap" },
    { src: "/images/carousel/sunrise.jpg", alt: "Sunrise landscaping vehicle wrap" },
    { src: "/images/apparel/20220207_154015.jpg", alt: "Custom apparel printing" },
    { src: "/images/real-pelones-framing.jpg", alt: "Los Pelones Framing van wrap" },
    { src: "/images/carousel/empire-metal.jpg", alt: "Empire Metal roofing truck wrap" },
  ];
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-center text-black mb-16 lg:mb-20">{title}</motion.h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {images.map((img, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: (i % 4) * 0.1 }} className={`relative overflow-hidden rounded-2xl ${i < 2 ? "aspect-[3/4]" : i < 4 ? "aspect-square" : i < 6 ? "aspect-[3/4]" : "aspect-square"}`}>
              <Image src={img.src} alt={img.alt} fill className="object-cover hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 50vw, 25vw" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── VISIT STUDIO ───────── */
function VisitStudio() {
  const { lang } = useLang();
  const text = lang === "es" ? { title: "VEN A VERNOS.", body: "Visita nuestro estudio en Wilmington y hablemos de tu proyecto en persona.", hours: "Lunes – Viernes · 9:00 AM – 5:30 PM" } : { title: "COME SEE US.", body: "Visit our studio in Wilmington and let's talk about your project in person.", hours: "Monday – Friday · 9:00 AM – 5:30 PM" };
  return (
    <section className="relative py-24 lg:py-40 overflow-hidden bg-[#050510]">
      <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-brand-hot-pink/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] bg-brand-purple/10 rounded-full blur-[100px]" />
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-white mb-8">{text.title}</motion.h2>
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-lg lg:text-xl text-gray-300 mb-8">{text.body}</motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="glass-strong rounded-2xl p-6 lg:p-8 mb-8 max-w-lg mx-auto">
          <div className="flex items-start gap-4 text-left">
            <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center flex-shrink-0"><MapPin className="w-6 h-6 text-white" /></div>
            <div className="flex-1"><p className="text-white font-bold text-base lg:text-lg mb-1">{ADDRESS}</p><p className="text-gray-400 text-sm lg:text-base">{text.hours}</p></div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
          <motion.a href={mapsUrl} target="_blank" rel="noopener noreferrer" onClick={() => { trackGetDirections(); trackEvent("Get Directions"); }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="cta-primary text-white font-bold py-4 rounded-xl text-sm flex items-center justify-center gap-2"><Navigation className="w-4 h-4" /> Google Maps</motion.a>
          <motion.a href={wazeUrl} target="_blank" rel="noopener noreferrer" onClick={() => { trackGetDirections(); trackEvent("Get Directions"); }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-[#33CCFF] text-white font-bold py-4 rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-[#2BB5E8] transition-colors"><Navigation className="w-4 h-4" /> Waze</motion.a>
          <motion.a href={waLink} target="_blank" rel="noopener noreferrer" onClick={() => { trackWhatsApp(); trackEvent("WhatsApp"); }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-[#25D366] text-white font-bold py-4 rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-[#22c55e] transition-colors"><MessageCircle className="w-4 h-4" /> WhatsApp</motion.a>
        </motion.div>
      </div>
    </section>
  );
}

/* ───────── CONTACT ───────── */
function Contact() {
  const { lang } = useLang();
  const text = lang === "es" ? { title: "¿PREGUNTAS?", sub: "Llámanos o escríbenos por WhatsApp antes de visitar.", call: "LLAMAR" } : { title: "QUESTIONS?", sub: "Call us or WhatsApp us before you visit.", call: "CALL US" };
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl sm:text-6xl font-black tracking-tighter text-black mb-6">{text.title}</motion.h2>
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-lg lg:text-xl text-gray-500 mb-12">{text.sub}</motion.p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.a href={`tel:+${PHONE}`} onClick={() => { trackCall(); trackEvent("Call Us"); }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center gap-3 bg-[#25D366] text-white font-bold px-10 py-5 rounded-xl text-base sm:text-lg hover:bg-[#22c55e] transition-colors animate-pulse-glow"><Phone className="w-5 h-5" /> {PHONE_DISPLAY}</motion.a>
          <motion.a href={waLink} target="_blank" rel="noopener noreferrer" onClick={() => { trackWhatsApp(); trackEvent("WhatsApp"); }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center gap-3 bg-black text-white font-bold px-10 py-5 rounded-xl text-base sm:text-lg hover:bg-gray-800 transition-colors"><MessageCircle className="w-5 h-5" /> WhatsApp</motion.a>
        </div>
      </div>
    </section>
  );
}

/* ───────── FOOTER ───────── */
function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-[#050510] py-10 pb-24 md:pb-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-4">
        <Image src="/LOGO.png" alt="Imagine Studio Design" width={120} height={36} className="h-8 w-auto object-contain opacity-70" />
        <p className="text-gray-500 text-sm">Wilmington, NC</p>
        <div className="flex items-center gap-4">
          <a href="https://www.facebook.com/ImagineStudioD/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
          <a href="https://www.instagram.com/imaginestudiodesign/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></a>
        </div>
      </div>
    </footer>
  );
}

/* ───────── MAIN PAGE ───────── */
export default function VisitUsPage() {
  const scrollDepthRef = useRef(0);

  useEffect(() => {
    // Track pageview (no geo, cero fricción)
    trackPageView();

    // Heartbeat every 10s + scroll depth
    const heartbeatInterval = setInterval(() => {
      const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      scrollDepthRef.current = Math.max(scrollDepthRef.current, scrollPercent);
      trackHeartbeat(scrollDepthRef.current);
    }, 10000);

    // Track visibility change (tab in background)
    const handleVisibility = () => {
      if (document.hidden) {
        trackSessionEnd(scrollDepthRef.current, "tab_hidden");
      } else {
        trackHeartbeat(scrollDepthRef.current);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // Track before unload
    const handleBeforeUnload = () => {
      trackSessionEnd(scrollDepthRef.current, "page_close");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearInterval(heartbeatInterval);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <LangToggle />
      <Hero />
      <RealWork />
      <VisitStudio />
      <Contact />
      <Footer />
      <StickyBar />
    </main>
  );
}
