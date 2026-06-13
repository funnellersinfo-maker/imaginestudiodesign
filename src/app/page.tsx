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
  { src: "/images/truck-wrap-1.png", altEn: "HVAC commercial truck wrap", altEs: "Vinilo de camión HVAC", labelKey: "projects.hvacFleet" },
  { src: "/images/plumber-van.png", altEn: "Plumber service van branding", altEs: "Marca de van de plomería", labelKey: "projects.plumberVan" },
  { src: "/images/electrician-truck.png", altEn: "Electrician work truck wrap", altEs: "Vinilo de camión eléctrico", labelKey: "projects.electricFleet" },
  { src: "/images/pickup-wrap.png", altEn: "Construction pickup truck wrap", altEs: "Vinilo de camioneta de construcción", labelKey: "projects.constructionPickup" },
  { src: "/images/fleet-branding.png", altEn: "Landscaping fleet branding", altEs: "Marca de flota de paisajismo", labelKey: "projects.landscapeFleet" },
  { src: "/images/wrap-detail.png", altEn: "Vehicle wrap installation detail", altEs: "Detalle de instalación de vinilo", labelKey: "projects.premiumInstall" },
  { src: "/images/signage-project.png", altEn: "Commercial business signage", altEs: "Señalización comercial", labelKey: "projects.businessSignage" },
  { src: "/images/apparel-project.png", altEn: "Branded work apparel", altEs: "Ropa de trabajo de marca", labelKey: "projects.brandedApparel" },
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
            <a href="tel:+19105550123" className="flex items-center gap-2 text-sm text-gray-400 hover:text-emerald-400 transition-colors">
              <Phone className="w-4 h-4" />(910) 555-0123
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
              <a href="tel:+19105550123" className="flex items-center gap-2 text-emerald-400 py-2"><Phone className="w-4 h-4" /> (910) 555-0123</a>
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

      {/* Looping video background — plays instantly, never stops */}
      <div className="absolute inset-0 z-[1]">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#050510]/50 via-[#0a0a1a]/30 to-[#0a0a1a]/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050510]/40 via-transparent to-[#050510]/40" />
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
                  preload="metadata"
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
          preload="metadata"
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
              beforeSrc="/images/after-brothers-painting.png"
              afterSrc="/images/before-brothers-painting.png"
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
              <div className="group p-6 lg:p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-brand-purple/20 transition-all duration-500 h-full">
                <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl gradient-brand flex items-center justify-center mb-4 lg:mb-5 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                </div>
                <h3 className="text-white font-bold text-base lg:text-lg mb-2">{t(item.titleKey)}</h3>
                <p className="text-gray-400 text-sm lg:text-base leading-relaxed">{t(item.descKey)}</p>
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
  const { t, lang } = useLang();
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
                        <Image src={project.src} alt={lang === "es" ? project.altEs : project.altEn} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <span className="text-sm font-bold text-white">{t(project.labelKey)}</span>
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

/* ───────── 7. TRUST ───────── */
function TrustSection() {
  const { t } = useLang();
  return (
    <section className="relative py-20 md:py-28 lg:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#080818] via-background to-background" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <FadeUp delay={0.3}>
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {[
              { quoteKey: "trust.testimonial1", nameKey: "trust.testimonial1Name", bizKey: "trust.testimonial1Biz", stars: 5 },
              { quoteKey: "trust.testimonial2", nameKey: "trust.testimonial2Name", bizKey: "trust.testimonial2Biz", stars: 5 },
            ].map((item, i) => (
              <FadeUp key={i} delay={i * 0.15}>
                <div className="p-6 lg:p-8 rounded-2xl border border-white/5 bg-white/[0.02] h-full flex flex-col">
                  <div className="flex gap-1 mb-4">{Array.from({ length: item.stars }).map((_, si) => <Star key={si} className="w-5 h-5 text-yellow-400 fill-yellow-400" />)}</div>
                  <Quote className="w-8 h-8 text-brand-purple/30 mb-3" />
                  <p className="text-gray-300 leading-relaxed flex-1 mb-4">&ldquo;{t(item.quoteKey)}&rdquo;</p>
                  <div>
                    <p className="text-white font-semibold text-sm">{t(item.nameKey)}</p>
                    <p className="text-gray-500 text-xs">{t(item.bizKey)}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </FadeUp>
        <FadeUp delay={0.5}>
          <div className="mt-12 text-center">
            <p className="text-gray-400 text-sm"><Shield className="w-4 h-4 inline mr-1 text-brand-purple" /> {t("trust.guarantee")}</p>
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
            <a href="tel:+19105550123" className="flex items-center gap-2 px-6 lg:px-8 py-4 lg:py-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all text-sm lg:text-base font-semibold">
              <Phone className="w-4 h-4" /> (910) 555-0123
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
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            <a href="tel:+19105550123" className="hover:text-gray-300 transition-colors flex items-center gap-1"><Phone className="w-3 h-3" /> (910) 555-0123</a>
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
      <Footer />
      <StickyCTA onQuote={() => setQuoteOpen(true)} />
      <FloatingCTA onQuote={() => setQuoteOpen(true)} />
      <QuoteFormModal open={quoteOpen} onOpenChange={setQuoteOpen} />
    </main>
  );
}
