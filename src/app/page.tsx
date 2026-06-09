"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
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
        <div className="flex items-center justify-between h-16 md:h-18">
          <a href="#" className="flex items-center gap-3 flex-shrink-0">
            <Image src="/LOGO.png" alt="Imagine Studio Design" width={140} height={40} className="h-8 md:h-10 w-auto object-contain" priority />
          </a>
          <div className="hidden md:flex items-center gap-6">
            <a href="#transformations" className="text-sm text-gray-400 hover:text-white transition-colors">{t("nav.transformations")}</a>
            <a href="#who-we-help" className="text-sm text-gray-400 hover:text-white transition-colors">{t("nav.industries")}</a>
            <a href="#projects" className="text-sm text-gray-400 hover:text-white transition-colors">{t("nav.projects")}</a>
            <a href="#process" className="text-sm text-gray-400 hover:text-white transition-colors">{t("nav.process")}</a>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <a href="tel:+19105550123" className="flex items-center gap-2 text-sm text-gray-400 hover:text-emerald-400 transition-colors">
              <Phone className="w-4 h-4" />(910) 555-0123
            </a>
            <button onClick={onQuote} className="cta-primary text-white text-sm font-bold px-5 py-2.5 rounded-lg tracking-wide">{t("nav.getQuote")}</button>
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
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const { t } = useLang();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0a0a1a] via-background to-background" />
      <div className="absolute top-1/4 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-brand-purple/20 rounded-full blur-[100px] sm:blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-brand-magenta/15 rounded-full blur-[100px] sm:blur-[120px]" />

      <motion.div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16" style={{ opacity }}>
        <FadeUp delay={0.1}>
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/10 bg-white/5 mt-12 sm:mt-0 mb-6 sm:mb-8">
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-hot-pink" />
            <span className="text-[11px] sm:text-sm text-gray-300 whitespace-nowrap">{t("hero.badge")}</span>
          </div>
        </FadeUp>
        <FadeUp delay={0.2}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6">
            <span className="text-white">{t("hero.line1")}</span><br />
            <span className="gradient-brand-text">{t("hero.line2")}</span><br />
            <span className="text-white">{t("hero.line3")}</span>
          </h1>
        </FadeUp>
        <FadeUp delay={0.4}>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">{t("hero.subtitle")}</p>
        </FadeUp>
        <FadeUp delay={0.6}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={onQuote} className="cta-primary text-white font-bold px-8 py-4 rounded-xl text-base tracking-wide flex items-center gap-2 min-w-[240px] justify-center">
              {t("hero.cta")} <ArrowRight className="w-5 h-5" />
            </button>
            <a href="#transformations" className="group flex items-center gap-2 px-6 py-4 rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:border-white/20 transition-all text-sm font-medium">
              {t("hero.see")} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </FadeUp>
        <FadeUp delay={0.8}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-gray-500 text-sm">
            {[t("hero.freeConsultation"), t("hero.customDesign"), t("hero.resultsInDays")].map((txt, i) => (
              <div key={i} className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-purple" />{txt}</div>
            ))}
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
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[#0a0a1a] to-background" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold tracking-widest uppercase text-brand-hot-pink mb-4">{t("problem.tag")}</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              {t("problem.title1")} <span className="gradient-brand-text">{t("problem.titleHighlight")}</span>.
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">{t("problem.subtitle")}</p>
          </div>
        </FadeUp>
        <div className="grid md:grid-cols-3 gap-6">
          {pains.map((txt, i) => (
            <FadeUp key={i} delay={i * 0.15}>
              <div className="relative group p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-brand-purple/20 transition-all duration-500 h-full">
                <div className="w-12 h-12 rounded-xl gradient-purple-pink flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  {(() => { const Ic = icons[i]; return <Ic className="w-6 h-6 text-white" />; })()}
                </div>
                <p className="text-gray-300 leading-relaxed text-base">{txt}</p>
              </div>
            </FadeUp>
          ))}
        </div>
        <FadeUp delay={0.4}>
          <div className="mt-12 text-center">
            <p className="text-xl sm:text-2xl font-bold text-white mb-2">{t("problem.soundFamiliar")}</p>
            <p className="text-gray-400 text-base">{t("problem.goodNews")} <span className="text-brand-bright-blue font-semibold">{t("problem.fixable")}</span></p>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ───────── 3. TRANSFORMATION ───────── */
function TransformationSection() {
  const { t, lang } = useLang();
  const gridItems = [
    { src: "/images/truck-wrap-1.png", labelKey: "transform.fleet" },
    { src: "/images/pickup-wrap.png", labelKey: "transform.graphics" },
    { src: "/images/fleet-branding.png", labelKey: "transform.fullFleet" },
  ];
  return (
    <section id="transformations" className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-[#080818]" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-purple/10 rounded-full blur-[150px]" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold tracking-widest uppercase text-brand-hot-pink mb-4">{t("transform.tag")}</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              {t("transform.from")} <span className="text-gray-500">{t("transform.invisible")}</span> {t("transform.to")} <span className="gradient-brand-text">{t("transform.impossible")}</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">{t("transform.subtitle")}</p>
          </div>
        </FadeUp>
        <ScaleIn delay={0.1}>
          <div className="relative rounded-2xl overflow-hidden border border-white/10 glow-brand mb-10">
            <div className="grid md:grid-cols-2">
              <div className="relative aspect-[4/3] md:aspect-auto">
                <Image src="/images/before-after-van.png" alt={t("transform.beforeAfter")} fill className="object-cover" />
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-gray-900/80 border border-white/10">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t("transform.beforeAfter")}</span>
                </div>
              </div>
              <div className="relative aspect-[4/3] md:aspect-auto">
                <Image src="/images/transformation-1.png" alt={t("transform.real")} fill className="object-cover" />
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-gray-900/80 border border-white/10">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t("transform.real")}</span>
                </div>
              </div>
            </div>
          </div>
        </ScaleIn>
        <div className="grid sm:grid-cols-3 gap-4">
          {gridItems.map((item, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <div className="project-card relative rounded-xl overflow-hidden border border-white/5 group cursor-pointer aspect-[4/3]">
                <Image src={item.src} alt={t(item.labelKey)} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-sm font-bold text-white">{t(item.labelKey)}</span>
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
    <section id="who-we-help" className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#080818] via-background to-background" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold tracking-widest uppercase text-brand-hot-pink mb-4">{t("who.tag")}</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              {t("who.title1")} <span className="gradient-brand-text">{t("who.titleHighlight")}</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">{t("who.subtitle")}</p>
          </div>
        </FadeUp>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {INDUSTRIES_DATA.map((ind, i) => (
            <FadeUp key={i} delay={i * 0.05}>
              <div className="group p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-brand-purple/20 transition-all duration-300 text-center h-full">
                <div className="w-12 h-12 mx-auto rounded-xl gradient-blue-purple flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <ind.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-bold text-sm mb-1">{t(ind.labelKey)}</h3>
                <p className="text-gray-500 text-xs leading-relaxed hidden sm:block">{t(ind.descKey)}</p>
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
    <section id="visibility-system" className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[#0a0a1a] to-background" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-brand-magenta/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/3 left-0 w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-[150px]" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold tracking-widest uppercase text-brand-hot-pink mb-4">{t("vis.tag")}</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              {t("vis.title1")} <span className="gradient-brand-text">{t("vis.titleHighlight")}</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">{t("vis.subtitle")}</p>
          </div>
        </FadeUp>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VISIBILITY_DATA.map((item, i) => (
            <FadeUp key={i} delay={i * 0.08}>
              <div className="group p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-brand-purple/20 transition-all duration-500 h-full">
                <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-bold text-base mb-2">{t(item.titleKey)}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{t(item.descKey)}</p>
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
    <section id="projects" className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-[#080818]" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold tracking-widest uppercase text-brand-hot-pink mb-4">{t("projects.tag")}</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              {t("projects.title1")} <span className="gradient-brand-text">{t("projects.titleHighlight")}</span>.
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">{t("projects.subtitle")}</p>
          </div>
        </FadeUp>
        <FadeIn delay={0.2}>
          <div className="relative pl-12 pr-12 md:pl-14 md:pr-14">
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
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#080818] via-background to-background" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {METRICS_DATA.map((m, i) => (
              <ScaleIn key={i} delay={i * 0.1}>
                <div className="text-center p-6 rounded-xl border border-white/5 bg-white/[0.02]">
                  <div className="text-3xl sm:text-4xl font-black gradient-brand-text mb-1">{m.value}</div>
                  <div className="text-gray-400 text-sm">{t(m.labelKey)}</div>
                </div>
              </ScaleIn>
            ))}
          </div>
        </FadeUp>
        <FadeUp delay={0.3}>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { quoteKey: "trust.testimonial1", nameKey: "trust.testimonial1Name", bizKey: "trust.testimonial1Biz", stars: 5 },
              { quoteKey: "trust.testimonial2", nameKey: "trust.testimonial2Name", bizKey: "trust.testimonial2Biz", stars: 5 },
            ].map((item, i) => (
              <FadeUp key={i} delay={i * 0.15}>
                <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] h-full flex flex-col">
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
    <section id="process" className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[#0a0a1a] to-background" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold tracking-widest uppercase text-brand-hot-pink mb-4">{t("process.tag")}</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              {t("process.title1")} <span className="gradient-brand-text">{t("process.titleHighlight")}</span>.
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">{t("process.subtitle")}</p>
          </div>
        </FadeUp>
        <div className="hidden md:grid md:grid-cols-5 gap-4 relative">
          <div className="absolute top-12 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-brand-blue via-brand-purple to-brand-hot-pink opacity-30" />
          {PROCESS_DATA.map((step, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <div className="relative text-center group">
                <div className="relative z-10 w-24 h-24 mx-auto rounded-2xl border border-white/10 bg-white/[0.03] flex flex-col items-center justify-center mb-4 group-hover:border-brand-purple/40 group-hover:bg-brand-purple/10 transition-all duration-300">
                  <span className="text-2xl font-black gradient-brand-text mb-1">{step.num}</span>
                  <step.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-white font-bold text-sm mb-1">{t(step.titleKey)}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{t(step.descKey)}</p>
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
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[#080818] to-background" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-purple/15 rounded-full blur-[200px]" />
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-hot-pink/10 rounded-full blur-[150px]" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <FadeUp><Image src="/LOGO.png" alt="Imagine Studio Design" width={120} height={36} className="mx-auto h-10 w-auto object-contain mb-8 opacity-80" /></FadeUp>
        <FadeUp delay={0.1}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            {t("final.title1")} <span className="gradient-brand-text">{t("final.titleHighlight")}</span> {t("final.title2")}
          </h2>
        </FadeUp>
        <FadeUp delay={0.2}>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-4 leading-relaxed">{t("final.subtitle")}</p>
        </FadeUp>
        <FadeUp delay={0.3}>
          <p className="text-white text-xl font-bold mb-10">{t("final.build")} <span className="gradient-brand-text">{t("final.unstoppable")}</span>.</p>
        </FadeUp>
        <FadeUp delay={0.4}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <button onClick={onQuote} className="cta-primary text-white font-bold px-10 py-4 rounded-xl text-lg tracking-wide flex items-center gap-2 min-w-[280px] justify-center animate-pulse-glow">
              {t("final.cta")} <ArrowRight className="w-5 h-5" />
            </button>
            <a href="tel:+19105550123" className="flex items-center gap-2 px-6 py-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all text-sm font-semibold">
              <Phone className="w-4 h-4" /> (910) 555-0123
            </a>
          </div>
        </FadeUp>
        <FadeUp delay={0.5}>
          <div className="flex flex-wrap items-center justify-center gap-4 text-gray-500 text-sm">
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
