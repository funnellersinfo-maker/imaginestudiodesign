"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";
import {
  Phone,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Shield,
  Eye,
  Zap,
  Truck,
  HardHat,
  Wrench,
  TreePine,
  PaintBucket,
  GlassWater,
  Plug,
  Snowflake,
  Building2,
  Home as HomeIcon,
  Store,
  Target,
  Clock,
  Palette,
  Layers,
  Users,
  Star,
  Quote,
  MapPin,
  Menu,
  X,
  Mail,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { useLang } from "@/lib/i18n";
import QuoteFormModal from "@/components/quote-form-modal";
import StickyCTA, { FloatingCTA } from "@/components/sticky-cta";
import LangToggle from "@/components/lang-toggle";
import BeforeAfterSlider from "@/components/before-after-slider";
import GalleryCarousel from "@/components/gallery-carousel";

/* ───────── ANIMATION HELPERS ───────── */
function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>{children}</motion.div>
  );
}
function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8, delay, ease: "easeOut" }} className={className}>{children}</motion.div>
  );
}
function ScaleIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, scale: 0.9 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>{children}</motion.div>
  );
}

/* ───────── DATA (uses t() inside components) ───────── */
const PROJECTS_DATA = [
  { src: "/images/carousel/empire-metal.jpg", altEn: "Empire Metal vehicle wrap", altEs: "Vinilo Empire Metal", label: "Empire Metal" },
  { src: "/images/carousel/leon-tires.jpg", altEn: "Leon Tires & Body Services fleet branding", altEs: "Marca de flota Leon Tires", label: "Leon Tires & Body Services" },
  { src: "/images/carousel/lecheras.jpg", altEn: "Lecheras branded vehicle", altEs: "Vehículo Lecheras", label: "Lecheras" },
  { src: "/images/carousel/sunrise.jpg", altEn: "Sunrise vehicle wrap", altEs: "Vinilo Sunrise", label: "Sunrise" },
  { src: "/images/carousel/four-seasons.jpg", altEn: "Four Seasons Landscapes LLC wrap", altEs: "Vinilo Four Seasons Landscapes", label: "Four Seasons Landscapes LLC" },
  { src: "/images/carousel/rico-landscaping.jpg", altEn: "Rico Landscaping branded truck", altEs: "Camión Rico Landscaping", label: "Rico Landscaping" },
  { src: "/images/carousel/empire-metal-works.jpg", altEn: "Empire Metal Works LLC truck", altEs: "Camión Empire Metal Works", label: "Empire Metal Works LLC" },
];

const INDUSTRIES_DATA = [
  { icon: HardHat, labelKey: "ind.contractors", descKey: "ind.contractorsDesc" },
  { icon: HomeIcon, labelKey: "ind.roofing", descKey: "ind.roofingDesc" },
  { icon: Snowflake, labelKey: "ind.hvac", descKey: "ind.hvacDesc" },
  { icon: Wrench, labelKey: "ind.plumbing", descKey: "ind.plumbingDesc" },
  { icon: Plug, labelKey: "ind.electrical", descKey: "ind.electricalDesc" },
  { icon: TreePine, labelKey: "ind.landscaping", descKey: "ind.landscapingDesc" },
  { icon: PaintBucket, labelKey: "ind.painting", descKey: "ind.paintingDesc" },
  { icon: TreePine, labelKey: "ind.tree", descKey: "ind.treeDesc" },
  { icon: GlassWater, labelKey: "ind.concrete", descKey: "ind.concreteDesc" },
  { icon: Building2, labelKey: "ind.construction", descKey: "ind.constructionDesc" },
];

const PROCESS_DATA = [
  { num: "01", titleKey: "process.step1", descKey: "process.step1Desc", icon: Phone },
  { num: "02", titleKey: "process.step2", descKey: "process.step2Desc", icon: Palette },
  { num: "03", titleKey: "process.step3", descKey: "process.step3Desc", icon: Layers },
  { num: "04", titleKey: "process.step4", descKey: "process.step4Desc", icon: Truck },
  { num: "05", titleKey: "process.step5", descKey: "process.step5Desc", icon: Eye },
];

const METRICS_DATA = [
  { value: "500+", labelKey: "trust.projects" },
  { value: "98%", labelKey: "trust.satisfaction" },
  { value: "10+", labelKey: "trust.experience" },
  { value: "24h", labelKey: "trust.turnaround" },
];

const VISIBILITY_DATA = [
  { icon: Layers, titleKey: "vis.wraps", descKey: "vis.wrapsDesc" },
  { icon: Eye, titleKey: "vis.signage", descKey: "vis.signageDesc" },
  { icon: Users, titleKey: "vis.apparel", descKey: "vis.apparelDesc" },
  { icon: Target, titleKey: "vis.promo", descKey: "vis.promoDesc" },
  { icon: Palette, titleKey: "vis.brandIdentity", descKey: "vis.brandIdentityDesc" },
  { icon: Zap, titleKey: "vis.digital", descKey: "vis.digitalDesc" },
];

/* ───────── NAV ───────── */
function Nav({ onQuote }: { onQuote: () => void }) {
  const [open, setOpen] = useState(false);
  const { t } = useLang();
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glass-strong">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <a href="#" className="flex items-center gap-3 flex-shrink-0">
            <Image src="/LOGO.png" alt="Imagine Studio Design" width={140} height={40} className="h-8 lg:h-12 w-auto object-contain" priority />
          </a>
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <a href="#transformations" className="text-sm lg:text-base text-gray-400 hover:text-white transition-colors">{t("nav.transformations")}</a>
            <a href="#who-we-help" className="text-sm lg:text-base text-gray-400 hover:text-white transition-colors">{t("nav.industries")}</a>
            <a href="#projects" className="text-sm lg:text-base text-gray-400 hover:text-white transition-colors">{t("nav.projects")}</a>
            <a href="#process" className="text-sm lg:text-base text-gray-400 hover:text-white transition-colors">{t("nav.process")}</a>
          </div>
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            <a href="tel:+19105474314" className="flex items-center gap-2 text-sm text-gray-400 hover:text-emerald-400 transition-colors">
              <Phone className="w-4 h-4" />(910) 547-4314
            </a>
            <button onClick={onQuote} className="cta-primary text-white text-sm font-bold px-6 py-2.5 rounded-lg tracking-wide">{t("nav.getQuote")}</button>
          </div>
          <button onClick={() => setOpen(!open)} className="md:hidden w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center" aria-label="Toggle menu">
            {open ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
          </button>
        </div>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden pb-6 pt-2 border-t border-white/5">
            <div className="flex flex-col gap-4">
              <a href="#transformations" onClick={() => setOpen(false)} className="text-gray-300 hover:text-white py-2">{t("nav.transformations")}</a>
              <a href="#who-we-help" onClick={() => setOpen(false)} className="text-gray-300 hover:text-white py-2">{t("nav.industries")}</a>
              <a href="#projects" onClick={() => setOpen(false)} className="text-gray-300 hover:text-white py-2">{t("nav.projects")}</a>
              <a href="#process" onClick={() => setOpen(false)} className="text-gray-300 hover:text-white py-2">{t("nav.process")}</a>
              <div className="section-divider" />
              <a href="tel:+19105474314" className="flex items-center gap-2 text-emerald-400 py-2"><Phone className="w-4 h-4" /> (910) 547-4314</a>
              <button onClick={() => { setOpen(false); onQuote(); }} className="cta-primary text-white font-bold py-3 rounded-xl text-sm tracking-wide w-full">{t("nav.getFreeQuote")}</button>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}

/* ───────── 1. HERO ───────── */
function HeroSection({ onQuote }: { onQuote: () => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const contentOpacity = useTransform(scrollY, [0, 700], [1, 0]);
  const { t } = useLang();

  const headlines = [
    { line1: t("hero.h1.line1"), line2: t("hero.h1.line2"), line3: t("hero.h1.line3") },
    { line1: t("hero.h2.line1"), line2: t("hero.h2.line2"), line3: t("hero.h2.line3") },
    { line1: t("hero.h3.line1"), line2: t("hero.h3.line2"), line3: t("hero.h3.line3") },
    { line1: t("hero.h4.line1"), line2: t("hero.h4.line2"), line3: t("hero.h4.line3") },
  ];

  const [idx, setIdx] = useState(0);

  const scheduleNext = useCallback(() => {
    const delay = 9000 + Math.random() * 3000;
    return setTimeout(() => setIdx((i) => (i + 1) % headlines.length), delay);
  }, [headlines.length]);

  useEffect(() => {
    const id = scheduleNext();
    return () => clearTimeout(id);
  }, [idx, scheduleNext]);

  const h = headlines[idx];
  const key = `${idx}-${h.line1}`;

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Dark base gradient */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#050510] via-[#0a0a1a] to-background" />

      {/* Floating Hero Elements — Vehicle Wrap Design Theme */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden" aria-hidden="true">

        {/* 1. VINYL ROLL — Large, top-left area */}
        <motion.div
          animate={{
            y: [0, -20, 8, -12, 0],
            x: [0, 10, -4, 8, 0],
            rotate: [0, 5, -3, 2, 0],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[1%] sm:left-[4%] lg:left-[6%]"
        >
          <div className="relative">
            <div className="absolute -inset-5 rounded-3xl bg-gradient-to-br from-brand-blue/40 via-brand-purple/30 to-brand-hot-pink/25 blur-2xl" />
            <div className="relative w-[76px] h-[76px] sm:w-[100px] sm:h-[100px] lg:w-[130px] lg:h-[130px] rounded-2xl lg:rounded-3xl border border-brand-purple/30 bg-brand-purple/[0.12] backdrop-blur-sm flex items-center justify-center shadow-xl shadow-brand-purple/20">
              <svg viewBox="0 0 100 100" className="w-11 h-11 sm:w-14 sm:h-14 lg:w-[78px] lg:h-[78px]" fill="none">
                <defs>
                  <linearGradient id="roll-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2D7FE0" />
                    <stop offset="50%" stopColor="#6A3DFF" />
                    <stop offset="100%" stopColor="#E71D8C" />
                  </linearGradient>
                  <filter id="roll-glow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>
                <circle cx="42" cy="50" r="28" fill="none" stroke="url(#roll-grad)" strokeWidth="3.5" opacity="1" filter="url(#roll-glow)" />
                <circle cx="42" cy="50" r="18" fill="none" stroke="url(#roll-grad)" strokeWidth="1.5" opacity="0.6" />
                <circle cx="42" cy="50" r="6" fill="url(#roll-grad)" opacity="0.9" />
                <path d="M70 50 Q78 50 82 44 L92 28 Q94 24 90 23 L75 30 Q68 34 66 42 Z" fill="url(#roll-grad)" opacity="0.75" />
                <path d="M72 42 L86 30" stroke="white" strokeWidth="2" opacity="0.6" strokeLinecap="round" />
                <path d="M70 46 L82 36" stroke="white" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* 2. COLOR PALETTE — Medium, right side upper area */}
        <motion.div
          animate={{
            y: [0, 14, -6, 16, 0],
            x: [0, -12, 4, -8, 0],
            rotate: [0, -6, 3, -2, 0],
            scale: [1, 1.06, 0.97, 1.03, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="absolute top-[20%] right-[1%] sm:right-[4%] lg:right-[6%]"
        >
          <div className="relative">
            <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-brand-hot-pink/35 via-brand-purple/30 to-brand-blue/25 blur-xl" />
            <div className="relative w-[60px] h-[60px] sm:w-[76px] sm:h-[76px] lg:w-[96px] lg:h-[96px] rounded-xl lg:rounded-2xl border border-brand-hot-pink/25 bg-brand-hot-pink/[0.10] backdrop-blur-sm flex items-center justify-center shadow-xl shadow-brand-hot-pink/20">
              <svg viewBox="0 0 100 100" className="w-9 h-9 sm:w-11 sm:h-11 lg:w-14 lg:h-14" fill="none">
                <defs>
                  <filter id="pal-glow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>
                <path d="M50 10 C25 10 8 28 8 52 C8 78 25 95 50 95 C60 95 65 88 62 80 C59 73 66 68 73 72 C80 76 90 70 90 52 C90 28 75 10 50 10Z" fill="white/[0.10]" stroke="url(#roll-grad)" strokeWidth="2.5" opacity="1" filter="url(#pal-glow)" />
                <circle cx="30" cy="38" r="7" fill="#1D68B3" opacity="1" />
                <circle cx="50" cy="28" r="7" fill="#6A3DFF" opacity="1" />
                <circle cx="70" cy="38" r="7" fill="#E71D8C" opacity="1" />
                <circle cx="25" cy="58" r="6" fill="#FBBF24" opacity="0.9" />
                <circle cx="45" cy="52" r="6" fill="#34D399" opacity="0.9" />
                <ellipse cx="72" cy="62" rx="6" ry="7" fill="#0a0a1a" stroke="white/[0.15]" strokeWidth="1" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* 3. SQUEEGEE / APPLICATION TOOL — Small, bottom-left area */}
        <motion.div
          animate={{
            y: [0, -16, 10, -8, 0],
            rotate: [0, 8, -5, 3, 0],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute top-[56%] left-[2%] sm:left-[5%] lg:left-[8%]"
        >
          <div className="relative">
            <div className="absolute -inset-3 rounded-xl bg-gradient-to-br from-brand-blue/30 via-brand-purple/25 to-brand-hot-pink/20 blur-lg" />
            <div className="relative w-[52px] h-[52px] sm:w-[66px] sm:h-[66px] lg:w-[80px] lg:h-[80px] rounded-lg lg:rounded-xl border border-brand-blue/25 bg-brand-blue/[0.10] backdrop-blur-sm flex items-center justify-center shadow-xl shadow-brand-blue/15">
              <svg viewBox="0 0 100 100" className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" fill="none">
                <defs>
                  <linearGradient id="sq-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2D7FE0" />
                    <stop offset="100%" stopColor="#6A3DFF" />
                  </linearGradient>
                </defs>
                <rect x="42" y="8" width="16" height="40" rx="4" fill="url(#sq-grad)" opacity="1" />
                <rect x="44" y="10" width="12" height="36" rx="3" fill="white/[0.15]" />
                <rect x="30" y="48" width="40" height="8" rx="2" fill="url(#sq-grad)" opacity="1" />
                <rect x="32" y="56" width="36" height="14" rx="3" fill="white/[0.10]" stroke="url(#sq-grad)" strokeWidth="2" opacity="0.9" />
                <line x1="35" y1="78" x2="30" y2="90" stroke="#6A3DFF" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
                <line x1="50" y1="78" x2="50" y2="92" stroke="#E71D8C" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
                <line x1="65" y1="78" x2="70" y2="90" stroke="#2D7FE0" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* 4. WRAPPED VAN — Large, bottom-right area */}
        <motion.div
          animate={{
            y: [0, 16, -10, 12, 0],
            x: [0, -10, 6, -8, 0],
            rotate: [0, -3, 4, -1, 0],
          }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
          className="absolute top-[50%] right-[0%] sm:right-[3%] lg:right-[5%]"
        >
          <div className="relative">
            <div className="absolute -inset-5 rounded-3xl bg-gradient-to-br from-brand-hot-pink/35 via-brand-purple/35 to-brand-blue/30 blur-2xl" />
            <div className="relative w-[84px] h-[84px] sm:w-[110px] sm:h-[110px] lg:w-[140px] lg:h-[140px] rounded-2xl lg:rounded-3xl border border-brand-purple/30 bg-brand-purple/[0.10] backdrop-blur-sm flex items-center justify-center shadow-xl shadow-brand-purple/20">
              <svg viewBox="0 0 160 100" className="w-14 h-14 sm:w-16 sm:h-16 lg:w-22 lg:h-14" fill="none">
                <defs>
                  <linearGradient id="van-body" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1D68B3" />
                    <stop offset="100%" stopColor="#6A3DFF" />
                  </linearGradient>
                  <linearGradient id="van-stripe" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6A3DFF" />
                    <stop offset="50%" stopColor="#C62285" />
                    <stop offset="100%" stopColor="#E71D8C" />
                  </linearGradient>
                  <filter id="van-glow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>
                <path d="M16 48 L16 32 Q16 22 26 20 L80 16 Q90 15 96 22 L112 32 Q120 36 125 42 L132 48 Q136 52 130 56 L128 58 Q118 64 106 64 L26 64 Q18 64 16 56Z" fill="url(#van-body)" opacity="0.85" filter="url(#van-glow)" />
                <path d="M16 38 Q40 32 70 34 Q100 36 125 44" stroke="url(#van-stripe)" strokeWidth="3.5" opacity="1" strokeLinecap="round" fill="none" />
                <path d="M20 44 Q50 38 80 40 Q110 42 130 50" stroke="url(#van-stripe)" strokeWidth="2.5" opacity="0.7" strokeLinecap="round" fill="none" />
                <rect x="28" y="30" width="18" height="14" rx="2" fill="white/[0.2]" />
                <rect x="52" y="28" width="18" height="16" rx="2" fill="white/[0.2]" />
                <rect x="76" y="28" width="18" height="16" rx="2" fill="white/[0.2]" />
                <circle cx="36" cy="70" r="9" fill="#0a0a1a" stroke="url(#van-body)" strokeWidth="2.5" opacity="1" />
                <circle cx="36" cy="70" r="4" fill="url(#van-body)" opacity="0.8" />
                <circle cx="116" cy="70" r="9" fill="#0a0a1a" stroke="url(#van-body)" strokeWidth="2.5" opacity="1" />
                <circle cx="116" cy="70" r="4" fill="url(#van-body)" opacity="0.8" />
                <circle cx="100" cy="38" r="5" fill="url(#van-stripe)" opacity="0.9" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Sparkle particles — bigger on mobile */}
        <motion.div animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.4, 0.8] }} transition={{ duration: 3, repeat: Infinity, delay: 0 }} className="absolute top-[18%] left-[20%]">
          <div className="w-2 h-2 rounded-full bg-brand-purple/60" />
        </motion.div>
        <motion.div animate={{ opacity: [0.3, 0.9, 0.3], scale: [0.6, 1.3, 0.6] }} transition={{ duration: 4, repeat: Infinity, delay: 1.2 }} className="absolute top-[35%] right-[18%]">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-hot-pink/60" />
        </motion.div>
        <motion.div animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.7, 1.5, 0.7] }} transition={{ duration: 3.5, repeat: Infinity, delay: 2.4 }} className="absolute top-[65%] left-[25%]">
          <div className="w-2 h-2 rounded-full bg-brand-bright-blue/60" />
        </motion.div>
        <motion.div animate={{ opacity: [0.2, 0.7, 0.2], scale: [0.5, 1.2, 0.5] }} transition={{ duration: 5, repeat: Infinity, delay: 0.8 }} className="absolute top-[45%] right-[25%]">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-hot-pink/50" />
        </motion.div>
        <motion.div animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.6, 1.4, 0.6] }} transition={{ duration: 4.5, repeat: Infinity, delay: 3.2 }} className="absolute top-[75%] right-[35%]">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-purple/50" />
        </motion.div>
      </div>

      <motion.div className="relative z-10 w-full max-w-5xl lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-28 md:pt-32 lg:pt-40 pb-20 md:pb-20 lg:pb-28" style={{ opacity: contentOpacity }}>
        {/* Badge */}
        <FadeUp delay={0.1}>
          <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-4 py-1 sm:py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mt-8 sm:mt-0 mb-6 lg:mb-20">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-brand-hot-pink flex-shrink-0" />
            <span className="text-[9px] sm:text-sm text-gray-300 text-center leading-tight whitespace-nowrap">{t("hero.badge")}</span>
          </div>
        </FadeUp>

        {/* Rotating Headlines */}
        <div className="relative min-h-[9rem] sm:min-h-[11rem] md:min-h-[14rem] lg:min-h-[11rem] mb-8 lg:mb-20">
          <AnimatePresence mode="wait">
            <motion.h1
              key={key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              {/* Mobile/tablet: 3 separate lines */}
              <span className="lg:hidden text-[1.65rem] sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.15] text-white drop-shadow-lg">{h.line1}</span>
              <span className="lg:hidden text-[1.65rem] sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.15] gradient-brand-text drop-shadow-lg">{h.line2}</span>
              <span className="lg:hidden text-[1.65rem] sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.15] text-white drop-shadow-lg">{h.line3}</span>
              {/* Desktop: 2 lines only */}
              <span className="hidden lg:block lg:text-7xl font-black tracking-tight leading-[1.15] text-white drop-shadow-lg">{h.line1}</span>
              <span className="hidden lg:block lg:text-7xl font-black tracking-tight leading-[1.15] gradient-brand-text drop-shadow-lg">{h.line2}</span>
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* Subtitle */}
        <FadeUp delay={0.4}>
          <p className="text-[0.9rem] sm:text-lg md:text-xl lg:text-xl text-gray-300 max-w-2xl lg:max-w-3xl mx-auto mb-8 lg:mb-16 leading-relaxed drop-shadow-md">{t("hero.subtitle")}</p>
        </FadeUp>

        {/* CTA Buttons */}
        <FadeUp delay={0.6}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 lg:gap-6 mb-8 lg:mb-4">
            <button onClick={onQuote} className="cta-primary text-white font-bold px-5 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-4 rounded-xl text-xs sm:text-base lg:text-lg tracking-wide flex items-center gap-2 min-w-[180px] sm:min-w-[240px] lg:min-w-[300px] justify-center whitespace-nowrap">
              {t("hero.cta")} <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <a href="#transformations" className="group flex items-center gap-2 px-5 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm text-gray-300 hover:text-white hover:border-white/20 transition-all text-sm lg:text-base font-medium">
              {t("hero.see")} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </FadeUp>

        {/* Social Proof */}
        <FadeUp delay={0.8}>
          <div className="mt-8 sm:mt-14 lg:mt-20 w-full max-w-xl lg:max-w-3xl mx-auto">
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center gap-x-3 gap-y-2.5 lg:gap-x-10 lg:gap-y-4">
              {[
                t("hero.trust1"),
                t("hero.trust2"),
                t("hero.trust3"),
                t("hero.trust4"),
              ].map((txt, i) => (
                <div key={i} className="flex items-center gap-1.5 sm:gap-2 lg:gap-2.5 justify-center sm:justify-start">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center flex-shrink-0">
                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-xs sm:text-sm lg:text-base text-gray-300 font-medium">{txt}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 sm:mt-8 sm:pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-center gap-3 lg:gap-14">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="flex -space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <span className="text-xs sm:text-sm lg:text-base text-gray-400">{t("hero.trust5Stars")}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-base sm:text-lg lg:text-2xl font-black gradient-brand-text">{t("hero.trustProjects")}</span>
                <span className="text-xs sm:text-sm lg:text-base text-gray-400">{t("hero.trustProjectsLabel")}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-base sm:text-lg lg:text-2xl font-black gradient-brand-text">{t("hero.trustYears")}</span>
                <span className="text-xs sm:text-sm lg:text-base text-gray-400">{t("hero.trustYearsLabel")}</span>
              </div>
            </div>
          </div>
        </FadeUp>
      </motion.div>
      <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2"><div className="w-1.5 h-3 rounded-full bg-white/40" /></div>
      </motion.div>
    </section>
  );
}

/* ───────── 2. PROBLEM ───────── */
function ProblemSection() {
  const { t } = useLang();
  const pains = [t("problem.pain1"), t("problem.pain2"), t("problem.pain3")];
  const icons = [Eye, Shield, Target];
  return (
    <section className="relative py-20 md:py-28 lg:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[#0a0a1a] to-background" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="text-center mb-16 lg:mb-20">
            <span className="inline-block text-sm font-semibold tracking-widest uppercase text-brand-hot-pink mb-4">{t("problem.tag")}</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 lg:mb-8 leading-tight">
              {t("problem.title1")} <span className="gradient-brand-text">{t("problem.titleHighlight")}</span>.
            </h2>
            <p className="text-gray-400 text-lg lg:text-xl max-w-2xl lg:max-w-3xl mx-auto">{t("problem.subtitle")}</p>
          </div>
        </FadeUp>
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {pains.map((txt, i) => (
            <FadeUp key={i} delay={i * 0.15}>
              <div className="relative group p-6 lg:p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-brand-purple/20 transition-all duration-500 h-full backdrop-blur-sm overflow-hidden">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="none"
                  className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500 -z-10"
                >
                  <source src="/card-bg.mp4" type="video/mp4" />
                </video>
                <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl gradient-purple-pink flex items-center justify-center mb-4 lg:mb-5 group-hover:scale-110 transition-transform duration-300 relative z-10">
                  {(() => { const Ic = icons[i]; return <Ic className="w-6 h-6 lg:w-7 lg:h-7 text-white" />; })()}
                </div>
                <p className="text-gray-300 leading-relaxed text-base lg:text-lg relative z-10">{txt}</p>
              </div>
            </FadeUp>
          ))}
        </div>
        <FadeUp delay={0.4}>
          <div className="mt-12 text-center">
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">{t("problem.soundFamiliar")}</p>
            <p className="text-gray-400 text-base lg:text-lg">{t("problem.goodNews")} <span className="text-brand-bright-blue font-semibold">{t("problem.fixable")}</span></p>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ───────── 3. TRANSFORMATION ───────── */
function TransformationSection() {
  const { t } = useLang();
  const realProjects = [
    { src: "/images/real-leon-tires.jpg", name: "Leon Tires & Body Services LLC" },
    { src: "/images/real-pelones-framing.jpg", name: "Los Pelones Framing LLC" },
    { src: "/images/real-cabrera-flooring.jpg", name: "Cabrera Flooring LLC" },
  ];
  return (
    <section id="transformations" className="relative py-20 md:py-28 lg:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-[#080818]" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      {/* Dopaminic looping video background */}
      <div className="absolute inset-0 z-[1]">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        >
          <source src="/transform-bg.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-purple/10 rounded-full blur-[150px] z-[2]" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <span className="inline-block text-sm font-semibold tracking-widest uppercase text-brand-hot-pink mb-4">{t("transform.tag")}</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 lg:mb-8 leading-tight">
              {t("transform.from")} <span className="text-gray-500">{t("transform.invisible")}</span> {t("transform.to")} <span className="gradient-brand-text">{t("transform.impossible")}</span>
            </h2>
            <p className="text-gray-400 text-base sm:text-lg lg:text-xl max-w-2xl lg:max-w-3xl mx-auto">{t("transform.subtitle")}</p>
          </div>
        </FadeUp>

        {/* Interactive Before/After Slider — Real project */}
        <ScaleIn delay={0.1}>
          <div className="mb-10">
            <BeforeAfterSlider
              beforeSrc="/images/before-brothers-painting.png"
              afterSrc="/images/after-brothers-painting.png"
              beforeAlt="Van before wrap - plain white"
              afterAlt="Van after wrap - Brothers Painting Services LLC"
            />
            <p className="text-center text-sm text-gray-500 mt-4">{t("transform.realProject")}</p>
          </div>
        </ScaleIn>
        <div className="grid sm:grid-cols-3 gap-4 lg:gap-6">
          {realProjects.map((item, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <div className="project-card relative rounded-xl overflow-hidden border border-white/5 group">
                <div className="relative aspect-[4/3]">
                  <Image src={item.src} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-3 lg:p-4 bg-white/[0.02]">
                  <p className="text-xs sm:text-sm font-bold text-white/80 group-hover:text-white transition-colors text-center">{item.name}</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── 4. WHO WE HELP ───────── */
function WhoWeHelpSection({ onQuote }: { onQuote: () => void }) {
  const { t } = useLang();
  return (
    <section id="who-we-help" className="relative py-20 md:py-28 lg:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#080818] via-background to-background" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="text-center mb-16 lg:mb-20">
            <span className="inline-block text-sm font-semibold tracking-widest uppercase text-brand-hot-pink mb-4">{t("who.tag")}</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 lg:mb-8 leading-tight">
              {t("who.title1")} <span className="gradient-brand-text">{t("who.titleHighlight")}</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">{t("who.subtitle")}</p>
          </div>
        </FadeUp>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
          {INDUSTRIES_DATA.map((ind, i) => (
            <FadeUp key={i} delay={i * 0.05}>
              <div className="group p-4 lg:p-6 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-brand-purple/20 transition-all duration-300 text-center h-full">
                <div className="w-12 h-12 lg:w-14 lg:h-14 mx-auto rounded-xl gradient-blue-purple flex items-center justify-center mb-3 lg:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <ind.icon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                </div>
                <h3 className="text-white font-bold text-sm lg:text-base mb-1">{t(ind.labelKey)}</h3>
                <p className="text-gray-500 text-xs lg:text-sm leading-relaxed hidden sm:block">{t(ind.descKey)}</p>
              </div>
            </FadeUp>
          ))}
        </div>
        <FadeUp delay={0.5}>
          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-4"><Store className="w-4 h-4 inline mr-1" /> {t("who.also")}</p>
            <button onClick={onQuote} className="cta-primary text-white font-bold px-8 py-3.5 rounded-xl text-sm tracking-wide inline-flex items-center gap-2">
              {t("who.seeCta")} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ───────── 5. VISIBILITY SYSTEM ───────── */
function VisibilitySystemSection({ onQuote }: { onQuote: () => void }) {
  const { t } = useLang();
  return (
    <section id="visibility-system" className="relative py-20 md:py-28 lg:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[#0a0a1a] to-background" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-brand-magenta/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/3 left-0 w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-[150px]" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="text-center mb-16 lg:mb-20">
            <span className="inline-block text-sm font-semibold tracking-widest uppercase text-brand-hot-pink mb-4">{t("vis.tag")}</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 lg:mb-8 leading-tight">
              {t("vis.title1")} <span className="gradient-brand-text">{t("vis.titleHighlight")}</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">{t("vis.subtitle")}</p>
          </div>
        </FadeUp>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {VISIBILITY_DATA.map((item, i) => (
            <FadeUp key={i} delay={i * 0.08}>
              <div className="group relative p-6 lg:p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-brand-purple/20 transition-all duration-500 h-full overflow-hidden">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="none"
                  className="absolute inset-0 w-full h-full object-cover opacity-15 group-hover:opacity-25 transition-opacity duration-500 -z-10"
                >
                  <source src="/vis-card-bg.mp4" type="video/mp4" />
                </video>
                <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl gradient-brand flex items-center justify-center mb-4 lg:mb-5 group-hover:scale-110 transition-transform duration-300 relative z-10">
                  <item.icon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                </div>
                <h3 className="text-white font-bold text-base lg:text-lg mb-2 relative z-10">{t(item.titleKey)}</h3>
                <p className="text-gray-400 text-sm lg:text-base leading-relaxed relative z-10">{t(item.descKey)}</p>
              </div>
            </FadeUp>
          ))}
        </div>
        <FadeUp delay={0.5}>
          <div className="mt-12 p-6 rounded-2xl border border-brand-purple/20 bg-brand-purple/5 text-center">
            <p className="text-white text-lg font-semibold mb-2">{t("vis.everything")} <span className="gradient-brand-text">{t("vis.professional")}</span>.</p>
            <button onClick={onQuote} className="mt-4 cta-primary text-white font-bold px-8 py-3.5 rounded-xl text-sm tracking-wide inline-flex items-center gap-2">
              {t("vis.customCta")} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ───────── 6. FEATURED PROJECTS ───────── */
function FeaturedProjectsSection() {
  const { t } = useLang();
  return (
    <section id="projects" className="relative py-20 md:py-28 lg:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-[#080818]" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-4 lg:mb-6 leading-tight">
              {t("projects.headline")}
            </h2>
            <p className="text-sm sm:text-base text-gray-500 max-w-xl mx-auto">{t("projects.subline")}</p>
          </div>
        </FadeUp>
        <FadeIn delay={0.2}>
          <div className="relative pl-12 pr-12 lg:pl-16 lg:pr-16">
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent className="-ml-4">
                {PROJECTS_DATA.map((project, i) => (
                  <CarouselItem key={i} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <div className="project-card group rounded-xl overflow-hidden border border-white/5 bg-white/[0.02] cursor-pointer">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image src={project.src} alt={project.altEn} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-4">
                          <span className="text-xs sm:text-sm font-bold text-white">{project.label}</span>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-0 bg-white/5 border-white/10 hover:bg-white/10 text-white hover:text-white" />
              <CarouselNext className="right-0 bg-white/5 border-white/10 hover:bg-white/10 text-white hover:text-white" />
            </Carousel>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ───────── 7. TRUST / SOCIAL PROOF ───────── */
function TrustSection() {
  const { t, lang } = useLang();

  const reviewScreenshots = [
    { src: "/reviews/review-river-vibes.png", alt: "Google review - River Vibes" },
    { src: "/reviews/review-jose-avendano.png", alt: "Google review - Jose Avendaño" },
    { src: "/reviews/review-laura-main.png", alt: "Google review - Laura Main Photography" },
    { src: "/reviews/review-christopher-sperry.png", alt: "Google review - Christopher Sperry" },
  ];

  return (
    <section className="relative py-20 md:py-28 lg:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#080818] via-background to-background" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Metrics bar */}
        <FadeUp>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mb-16 lg:mb-20">
            {METRICS_DATA.map((m, i) => (
              <ScaleIn key={i} delay={i * 0.1}>
                <div className="text-center p-6 lg:p-8 rounded-xl border border-white/5 bg-white/[0.02]">
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-black gradient-brand-text mb-1">{m.value}</div>
                  <div className="text-gray-400 text-sm lg:text-base">{t(m.labelKey)}</div>
                </div>
              </ScaleIn>
            ))}
          </div>
        </FadeUp>

        {/* Section title */}
        <FadeUp delay={0.2}>
          <div className="text-center mb-10 lg:mb-14">
            <div className="inline-flex items-center gap-2 mb-4">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-lg sm:text-xl font-bold text-white">{lang === "es" ? "Reseñas Reales de Google" : "Real Google Reviews"}</span>
            </div>
            <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
              {lang === "es"
                ? "Esto es lo que dicen nuestros clientes reales en Google. Sin textos adaptados — capturas reales."
                : "This is what our real customers say on Google. No adapted text — real screenshots."}
            </p>
          </div>
        </FadeUp>

        {/* Real review screenshots */}
        <FadeUp delay={0.3}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6 mb-12">
            {reviewScreenshots.map((review, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className="group rounded-2xl overflow-hidden border border-white/[0.08] bg-white/[0.03] hover:border-brand-purple/25 transition-all duration-300 hover:shadow-xl hover:shadow-brand-purple/10">
                  <div className="relative w-full">
                    <Image
                      src={review.src}
                      alt={review.alt}
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </FadeUp>

        {/* Many more success cases CTA */}
        <FadeUp delay={0.5}>
          <div className="text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-6 p-6 sm:p-8 rounded-2xl border border-brand-purple/20 bg-gradient-to-r from-brand-purple/[0.06] via-brand-hot-pink/[0.04] to-brand-purple/[0.06]">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <span className="text-white font-bold text-sm sm:text-base">{lang === "es" ? "4.9 Promedio" : "4.9 Average"}</span>
              </div>
              <div className="hidden sm:block w-px h-8 bg-white/10" />
              <div>
                <p className="text-white font-bold text-base sm:text-lg">
                  {lang === "es"
                    ? "Y muchos más casos de éxito como estos..."
                    : "And many more success cases like these..."}
                </p>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">
                  {lang === "es"
                    ? "Cada semana ayudamos a nuevos negocios a brillar. Tu negocio puede ser el próximo."
                    : "Every week we help new businesses shine. Your business could be next."}
                </p>
              </div>
            </div>
            <p className="mt-8 text-gray-400 text-sm"><Shield className="w-4 h-4 inline mr-1 text-brand-purple" /> {t("trust.guarantee")}</p>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ───────── 8. PROCESS ───────── */
function ProcessSection({ onQuote }: { onQuote: () => void }) {
  const { t } = useLang();
  return (
    <section id="process" className="relative py-20 md:py-28 lg:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[#0a0a1a] to-background" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="text-center mb-16 lg:mb-20">
            <span className="inline-block text-sm font-semibold tracking-widest uppercase text-brand-hot-pink mb-4">{t("process.tag")}</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 lg:mb-8 leading-tight">
              {t("process.title1")} <span className="gradient-brand-text">{t("process.titleHighlight")}</span>.
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">{t("process.subtitle")}</p>
          </div>
        </FadeUp>
        <div className="hidden md:grid md:grid-cols-5 gap-4 lg:gap-6 relative">
          <div className="absolute top-12 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-brand-blue via-brand-purple to-brand-hot-pink opacity-30" />
          {PROCESS_DATA.map((step, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <div className="relative text-center group">
                <div className="relative z-10 w-24 h-24 lg:w-28 lg:h-28 mx-auto rounded-2xl border border-white/10 bg-white/[0.03] flex flex-col items-center justify-center mb-4 lg:mb-5 group-hover:border-brand-purple/40 group-hover:bg-brand-purple/10 transition-all duration-300">
                  <span className="text-2xl lg:text-3xl font-black gradient-brand-text mb-1">{step.num}</span>
                  <step.icon className="w-5 h-5 lg:w-6 lg:h-6 text-gray-400 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-white font-bold text-sm lg:text-base mb-1">{t(step.titleKey)}</h3>
                <p className="text-gray-500 text-xs lg:text-sm leading-relaxed">{t(step.descKey)}</p>
              </div>
            </FadeUp>
          ))}
        </div>
        <div className="md:hidden space-y-4">
          {PROCESS_DATA.map((step, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <div className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                <div className="w-14 h-14 flex-shrink-0 rounded-xl gradient-brand flex items-center justify-center">
                  <span className="text-lg font-black text-white">{step.num}</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm mb-1">{t(step.titleKey)}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">{t(step.descKey)}</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
        <FadeUp delay={0.5}>
          <div className="mt-12 text-center">
            <button onClick={onQuote} className="cta-primary text-white font-bold px-8 py-3.5 rounded-xl text-sm tracking-wide inline-flex items-center gap-2">
              {t("process.cta")} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ───────── 9. FINAL CTA ───────── */
function FinalCTASection({ onQuote }: { onQuote: () => void }) {
  const { t } = useLang();
  return (
    <section className="relative py-24 md:py-32 lg:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[#080818] to-background" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-purple/15 rounded-full blur-[200px]" />
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-hot-pink/10 rounded-full blur-[150px]" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <FadeUp><Image src="/LOGO.png" alt="Imagine Studio Design" width={120} height={36} className="mx-auto h-10 lg:h-12 w-auto object-contain mb-8 lg:mb-10 opacity-80" /></FadeUp>
        <FadeUp delay={0.1}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-6 lg:mb-8 leading-tight">
            {t("final.title1")} <span className="gradient-brand-text">{t("final.titleHighlight")}</span> {t("final.title2")}
          </h2>
        </FadeUp>
        <FadeUp delay={0.2}>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-400 max-w-2xl lg:max-w-3xl mx-auto mb-4 lg:mb-6 leading-relaxed">{t("final.subtitle")}</p>
        </FadeUp>
        <FadeUp delay={0.3}>
          <p className="text-white text-xl lg:text-2xl font-bold mb-10 lg:mb-14">{t("final.build")} <span className="gradient-brand-text">{t("final.unstoppable")}</span>.</p>
        </FadeUp>
        <FadeUp delay={0.4}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 lg:gap-6 mb-8">
            <button onClick={onQuote} className="cta-primary text-white font-bold px-10 lg:px-12 py-4 lg:py-5 rounded-xl text-lg lg:text-xl tracking-wide flex items-center gap-2 min-w-[280px] lg:min-w-[320px] justify-center animate-pulse-glow">
              {t("final.cta")} <ArrowRight className="w-5 h-5" />
            </button>
            <a href="tel:+19105474314" className="flex items-center gap-2 px-6 lg:px-8 py-4 lg:py-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all text-sm lg:text-base font-semibold">
              <Phone className="w-4 h-4" /> (910) 547-4314
            </a>
          </div>
        </FadeUp>
        <FadeUp delay={0.5}>
          <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-6 text-gray-500 text-sm lg:text-base">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {t("final.fast")}</span>
            <span className="text-white/10">|</span>
            <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> {t("final.quality")}</span>
            <span className="text-white/10">|</span>
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {t("final.wilmington")}</span>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ───────── GOOGLE MAPS ───────── */
function MapSection() {
  const { t, lang } = useLang();
  return (
    <section className="relative py-16 md:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-[#050510]" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="flex items-center justify-center gap-3 mb-8">
            <MapPin className="w-6 h-6 text-brand-purple" />
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white">
              {lang === "es" ? "Encuéntranos en Wilmington, NC" : "Find Us in Wilmington, NC"}
            </h2>
          </div>
        </FadeUp>
        <FadeUp delay={0.2}>
          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3247.5!2d-77.947!3d34.226!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89afa3e5c2c2c0a1%3A0x0!2s4608+Cedar+Ave%2C+Wilmington%2C+NC+28403!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Imagine Studio Design Location"
              className="w-full"
            />
          </div>
        </FadeUp>
        <FadeUp delay={0.3}>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-gray-400">
            <a href="https://www.google.com/maps/place/4608+Cedar+Ave,+Wilmington,+NC+28403" target="_blank" rel="noopener noreferrer" className="hover:text-brand-purple transition-colors flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              4608 Cedar Ave, Wilmington, NC 28403
            </a>
            <a href="tel:+19105474314" className="hover:text-brand-purple transition-colors flex items-center gap-2">
              <Phone className="w-4 h-4" />
              (910) 547-4314
            </a>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ───────── FOOTER ───────── */
function Footer() {
  const { t } = useLang();
  return (
    <footer className="relative border-t border-white/5 bg-[#050510]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Image src="/LOGO.png" alt="Imagine Studio Design" width={120} height={36} className="h-8 w-auto object-contain opacity-70" />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-gray-500">
            <a href="tel:+19105474314" className="hover:text-gray-300 transition-colors flex items-center gap-1"><Phone className="w-3 h-3" /> (910) 547-4314</a>
            <a href="mailto:gtimaginedesign@gmail.com" className="hover:text-gray-300 transition-colors flex items-center gap-1"><Mail className="w-3 h-3" /> gtimaginedesign@gmail.com</a>
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {t("footer.location")}</span>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-white/5 text-center text-xs text-gray-600">
          © {new Date().getFullYear()} {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}

/* ───────── MAIN PAGE ───────── */
export default function Home() {
  const [quoteOpen, setQuoteOpen] = useState(false);
  return (
    <main className="min-h-screen bg-background">
      <Nav onQuote={() => setQuoteOpen(true)} />
      <LangToggle />
      <HeroSection onQuote={() => setQuoteOpen(true)} />
      <GalleryCarousel />
      <ProblemSection />
      <TransformationSection />
      <WhoWeHelpSection onQuote={() => setQuoteOpen(true)} />
      <VisibilitySystemSection onQuote={() => setQuoteOpen(true)} />
      <FeaturedProjectsSection />
      <TrustSection />
      <ProcessSection onQuote={() => setQuoteOpen(true)} />
      <FinalCTASection onQuote={() => setQuoteOpen(true)} />
      <MapSection />
      <Footer />
      <StickyCTA onQuoteClick={() => setQuoteOpen(true)} />
      <FloatingCTA onQuoteClick={() => setQuoteOpen(true)} />
      <QuoteFormModal open={quoteOpen} onOpenChange={setQuoteOpen} />
    </main>
  );
}
