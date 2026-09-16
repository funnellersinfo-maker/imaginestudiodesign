"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Phone, Navigation, ArrowRight } from "lucide-react";

/* ═══════════════════════════════════════════════════
   VISIT US — Ultra-short, high-conversion landing
   Goal: Get Directions → Visit the studio
   ═══════════════════════════════════════════════════ */

const LAT = 34.2134;
const LNG = -77.8824;
const ADDRESS = "4608 Cedar Ave, Suite 105, Wilmington, NC 28403";
const PHONE = "19105474314";
const PHONE_DISPLAY = "(910) 547-4314";

const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${LAT},${LNG}`;

/* 🔒 META PIXEL — GetDirections event */
function trackGetDirections() {
  try {
    (window as any).fbq("track", "Lead", { content_name: "Get Directions" });
  } catch {}
}

/* 🔒 META PIXEL — Call event */
function trackCall() {
  try {
    (window as any).fbq("track", "Contact", { content_name: "Call Us" });
  } catch {}
}

/* ───────── STICKY CTA (mobile only) ───────── */
function StickyDirections() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!visible) return null;
  return (
    <motion.a
      href={directionsUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={trackGetDirections}
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
    >
      <div className="cta-primary text-white font-bold py-4 text-center text-base tracking-wide flex items-center justify-center gap-2">
        <MapPin className="w-5 h-5" /> GET DIRECTIONS
      </div>
    </motion.a>
  );
}

/* ───────── HERO ───────── */
function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#050510]">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero/20240804_173141.jpg"
          alt="Custom vehicle wrap by Imagine Studio Design in Wilmington NC"
          fill
          priority
          className="object-cover opacity-50"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050510]/80 via-[#050510]/60 to-[#050510]" />
      </div>

      {/* Glow */}
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-brand-purple/15 rounded-full blur-[120px] z-0" />
      <div className="absolute bottom-1/3 right-1/3 w-[400px] h-[400px] bg-brand-hot-pink/10 rounded-full blur-[100px] z-0" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-sm font-semibold tracking-widest uppercase text-brand-hot-pink mb-6"
        >
          Wilmington, NC
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] text-white mb-8"
        >
          MAKE YOUR BUSINESS <span className="gradient-brand-text">STAND OUT.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-xl mx-auto mb-12"
        >
          Vehicle wraps, custom apparel & embroidery for local businesses.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackGetDirections}
            className="cta-primary text-white font-bold px-10 py-5 rounded-xl text-base sm:text-lg tracking-wide flex items-center gap-3 min-w-[260px] justify-center animate-pulse-glow"
          >
            <Navigation className="w-5 h-5" /> GET DIRECTIONS <ArrowRight className="w-5 h-5" />
          </a>
          <a
            href={`tel:+${PHONE}`}
            onClick={trackCall}
            className="flex items-center gap-2 px-8 py-5 rounded-xl border border-white/20 bg-white/5 text-white hover:bg-white/10 transition-all text-base sm:text-lg font-semibold backdrop-blur-sm"
          >
            <Phone className="w-5 h-5" /> CALL US
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* ───────── REAL WORK ───────── */
function RealWork() {
  const images = [
    { src: "/images/real-leon-tires.jpg", alt: "Leon Tires vehicle wrap by Imagine Studio Design" },
    { src: "/images/apparel/service-embroidery.jpg", alt: "Custom embroidery — caps and shirts by Imagine Studio Design" },
    { src: "/images/apparel/fleet-two-cars.jpg", alt: "Fleet branding — two branded vehicles by Imagine Studio Design" },
    { src: "/images/real-cabrera-flooring.jpg", alt: "Cabrera Flooring vehicle wrap by Imagine Studio Design" },
    { src: "/images/apparel/service-caps.jpg", alt: "Imagine Studio Design team at their booth" },
  ];
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-center text-black mb-16 lg:mb-20"
        >
          SEE OUR WORK.
        </motion.h2>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative overflow-hidden rounded-2xl aspect-square"
            >
              <Image src={img.src} alt={img.alt} fill className="object-cover hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 50vw, 20vw" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── VISIT OUR STUDIO ───────── */
function VisitStudio() {
  return (
    <section className="relative py-24 lg:py-40 overflow-hidden bg-[#050510]">
      <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-brand-hot-pink/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] bg-brand-purple/10 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-white mb-8"
        >
          COME SEE US.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg lg:text-xl text-gray-300 mb-12"
        >
          Visit our studio in Wilmington and let's talk about your project in person.
        </motion.p>

        {/* Address card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="glass-strong rounded-2xl p-6 lg:p-8 mb-8 max-w-lg mx-auto"
        >
          <div className="flex items-start gap-4 text-left">
            <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white font-bold text-base lg:text-lg mb-1">{ADDRESS}</p>
              <p className="text-gray-400 text-sm lg:text-base mb-4">
                Monday – Friday<br />9:00 AM – 5:30 PM
              </p>
            </div>
          </div>
        </motion.div>

        {/* Get Directions button */}
        <motion.a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={trackGetDirections}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="cta-primary text-white font-bold px-10 py-5 rounded-xl text-base sm:text-lg tracking-wide flex items-center gap-3 min-w-[260px] justify-center animate-pulse-glow mx-auto"
          style={{ width: "fit-content" }}
        >
          <Navigation className="w-5 h-5" /> GET DIRECTIONS <ArrowRight className="w-5 h-5" />
        </motion.a>
      </div>
    </section>
  );
}

/* ───────── CONTACT ───────── */
function Contact() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl sm:text-6xl font-black tracking-tighter text-black mb-6"
        >
          QUESTIONS?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg lg:text-xl text-gray-500 mb-12"
        >
          Call us before you visit.
        </motion.p>
        <motion.a
          href={`tel:+${PHONE}`}
          onClick={trackCall}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-3 bg-black text-white font-bold px-10 py-5 rounded-xl text-base sm:text-lg hover:bg-gray-800 transition-colors"
        >
          <Phone className="w-5 h-5" /> {PHONE_DISPLAY}
        </motion.a>
      </div>
    </section>
  );
}

/* ───────── FOOTER ───────── */
function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-[#050510] py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-4">
        <Image src="/LOGO.png" alt="Imagine Studio Design" width={120} height={36} className="h-8 w-auto object-contain opacity-70" />
        <p className="text-gray-500 text-sm">Wilmington, NC</p>
      </div>
    </footer>
  );
}

/* ───────── MAIN PAGE ───────── */
export default function VisitUsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <RealWork />
      <VisitStudio />
      <Contact />
      <Footer />
      <StickyDirections />
    </main>
  );
}
