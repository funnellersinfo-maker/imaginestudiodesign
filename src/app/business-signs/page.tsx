"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Phone,
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
  User,
  MessageSquare,
  Navigation,
  Type,
  Briefcase,
  TrendingUp,
  Sparkles,
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
import ExitIntentPopup from "@/components/exit-intent-popup";
import LangToggle from "@/components/lang-toggle";
import BeforeAfterSlider from "@/components/before-after-slider";
import GalleryCarousel from "@/components/gallery-carousel";
import FloatingElements, { HERO_ELEMENTS, PROBLEM_ELEMENTS, TRANSFORM_ELEMENTS, VISIBILITY_ELEMENTS, FINAL_CTA_ELEMENTS } from "@/components/floating-elements";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/* ═══════════════════════════════════════════════════
   ANIMATION HELPERS (reused from Vehicle Wraps landing)
   ═══════════════════════════════════════════════════ */
function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>{children}</motion.div>
  );
}

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>{children}</motion.div>
  );
}

function ScaleIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, scale: 0.9 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>{children}</motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   DATA — adapted for Business Signs
   ═══════════════════════════════════════════════════ */
const BS_HERO_STATIC_IMAGE = "/images/signage-project.png";
const BS_SHOWCASE_IMAGE = "/images/showcase-everything.jpg";

const BS_BIZ_KEYS = [
  "bs.biz.contractor", "bs.biz.roofing", "bs.biz.hvac", "bs.biz.plumbing", "bs.biz.electrical",
  "bs.biz.landscaping", "bs.biz.painting", "bs.biz.tree", "bs.biz.concrete",
  "bs.biz.restaurant", "bs.biz.retail", "bs.biz.otherService", "bs.biz.other",
];

const BS_INDUSTRIES_DATA = [
  { icon: HardHat, labelKey: "bs.ind.contractors", descKey: "bs.ind.contractorsDesc" },
  { icon: HomeIcon, labelKey: "bs.ind.roofing", descKey: "bs.ind.roofingDesc" },
  { icon: Snowflake, labelKey: "bs.ind.hvac", descKey: "bs.ind.hvacDesc" },
  { icon: Wrench, labelKey: "bs.ind.plumbing", descKey: "bs.ind.plumbingDesc" },
  { icon: Plug, labelKey: "bs.ind.electrical", descKey: "bs.ind.electricalDesc" },
  { icon: TreePine, labelKey: "bs.ind.landscaping", descKey: "bs.ind.landscapingDesc" },
  { icon: PaintBucket, labelKey: "bs.ind.painting", descKey: "bs.ind.paintingDesc" },
  { icon: TreePine, labelKey: "bs.ind.tree", descKey: "bs.ind.treeDesc" },
  { icon: GlassWater, labelKey: "bs.ind.concrete", descKey: "bs.ind.concreteDesc" },
  { icon: Building2, labelKey: "bs.ind.construction", descKey: "bs.ind.constructionDesc" },
  { icon: Store, labelKey: "bs.ind.restaurant", descKey: "bs.ind.restaurantDesc" },
  { icon: Store, labelKey: "bs.ind.retail", descKey: "bs.ind.retailDesc" },
];

const BS_SIGN_TYPES_DATA = [
  { icon: Building2, titleKey: "bs.vis.exterior", descKey: "bs.vis.exteriorDesc" },
  { icon: HomeIcon, titleKey: "bs.vis.indoor", descKey: "bs.vis.indoorDesc" },
  { icon: Layers, titleKey: "bs.vis.monument", descKey: "bs.vis.monumentDesc" },
  { icon: Type, titleKey: "bs.vis.channel", descKey: "bs.vis.channelDesc" },
  { icon: Briefcase, titleKey: "bs.vis.office", descKey: "bs.vis.officeDesc" },
  { icon: Sparkles, titleKey: "bs.vis.custom", descKey: "bs.vis.customDesc" },
];

const BS_PROCESS_DATA = [
  { num: "01", titleKey: "bs.process.step1", descKey: "bs.process.step1Desc", icon: Phone },
  { num: "02", titleKey: "bs.process.step2", descKey: "bs.process.step2Desc", icon: Palette },
  { num: "03", titleKey: "bs.process.step3", descKey: "bs.process.step3Desc", icon: Layers },
  { num: "04", titleKey: "bs.process.step4", descKey: "bs.process.step4Desc", icon: Truck },
  { num: "05", titleKey: "bs.process.step5", descKey: "bs.process.step5Desc", icon: Eye },
];

const BS_METRICS_DATA = [
  { value: "1500+", labelKey: "bs.trust.projects" },
  { value: "98%", labelKey: "bs.trust.satisfaction" },
  { value: "10+", labelKey: "bs.trust.experience" },
  { value: "24h", labelKey: "bs.trust.turnaround" },
];

const BS_PROJECTS_DATA = [
  { src: "/images/signage-project.png", altEn: "Custom business sign installation", label: "Custom Storefront Sign" },
  { src: "/images/showcase-everything.jpg", altEn: "Business signage portfolio", label: "Sign Portfolio" },
  { src: "/images/projects/20220207_154015.jpg", altEn: "Branded apparel with sign matching", label: "Brand Consistency" },
  { src: "/images/projects/20220207_154152.jpg", altEn: "Business cards and signage", label: "Business Cards" },
  { src: "/images/projects/IMG-20260423-WA0066.jpg", altEn: "Branded hats matching signs", label: "Branded Apparel" },
  { src: "/images/projects/IMG-20260423-WA0070.jpg", altEn: "Painting company branding", label: "Company Branding" },
  { src: "/images/projects/IMG-20260306-WA0016.jpg", altEn: "Empire Metal Works signage", label: "Empire Metal Works" },
  { src: "/images/projects/IMG-20260306-WA0020.jpg", altEn: "Empire Metal Works branded hoodie", label: "Empire Metal Works" },
];

const BS_FAQ_KEYS = [
  { qKey: "bs.faq.q1", aKey: "bs.faq.a1" },
  { qKey: "bs.faq.q2", aKey: "bs.faq.a2" },
  { qKey: "bs.faq.q3", aKey: "bs.faq.a3" },
  { qKey: "bs.faq.q4", aKey: "bs.faq.a4" },
  { qKey: "bs.faq.q5", aKey: "bs.faq.a5" },
];

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════
   NAV — reused, adapted nav links for Business Signs
   ═══════════════════════════════════════════════════ */
function Nav({ onQuote }: { onQuote: () => void }) {
  const [open, setOpen] = useState(false);
  const { t } = useLang();
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glass-strong">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <a href="/" className="flex items-center gap-3 flex-shrink-0">
            <Image src="/LOGO.png" alt="Imagine Studio Design" width={140} height={40} className="h-8 lg:h-12 w-auto object-contain" priority />
          </a>
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <a href="#our-work" className="text-sm lg:text-base text-gray-400 hover:text-white transition-colors">{t("bs.nav.transformations")}</a>
            <a href="#sign-types" className="text-sm lg:text-base text-gray-400 hover:text-white transition-colors">{t("bs.nav.services")}</a>
            <a href="#portfolio" className="text-sm lg:text-base text-gray-400 hover:text-white transition-colors">{t("bs.nav.projects")}</a>
            <a href="#process" className="text-sm lg:text-base text-gray-400 hover:text-white transition-colors">{t("bs.nav.process")}</a>
          </div>
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            <a href="tel:+19105474314" className="flex items-center gap-2 text-sm text-gray-400 hover:text-emerald-400 transition-colors">
              <Phone className="w-4 h-4" />(910) 547-4314
            </a>
            <button onClick={onQuote} className="cta-primary text-white text-sm font-bold px-6 py-2.5 rounded-lg tracking-wide">{t("bs.nav.getQuote")}</button>
          </div>
          <button onClick={() => setOpen(!open)} className="md:hidden w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center" aria-label="Toggle menu">
            {open ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
          </button>
        </div>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden pb-6 pt-2 border-t border-white/5">
            <div className="flex flex-col gap-4">
              <a href="#our-work" onClick={() => setOpen(false)} className="text-gray-300 hover:text-white py-2">{t("bs.nav.transformations")}</a>
              <a href="#sign-types" onClick={() => setOpen(false)} className="text-gray-300 hover:text-white py-2">{t("bs.nav.services")}</a>
              <a href="#portfolio" onClick={() => setOpen(false)} className="text-gray-300 hover:text-white py-2">{t("bs.nav.projects")}</a>
              <a href="#process" onClick={() => setOpen(false)} className="text-gray-300 hover:text-white py-2">{t("bs.nav.process")}</a>
              <div className="section-divider" />
              <a href="tel:+19105474314" className="flex items-center gap-2 text-emerald-400 py-2"><Phone className="w-4 h-4" /> (910) 547-4314</a>
              <button onClick={() => { setOpen(false); onQuote(); }} className="cta-primary text-white font-bold py-3 rounded-xl text-sm tracking-wide w-full">{t("bs.nav.getFreeQuote")}</button>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════
   1. HERO — adapted for Business Signs
   ═══════════════════════════════════════════════════ */
function HeroSection({ onQuote }: { onQuote: () => void }) {
  const { t, lang } = useLang();
  const [form, setForm] = useState({ name: "", businessType: "", message: "" });

  const WHATSAPP_NUMBER = "19105474314";
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    lang === "es"
      ? `Hola! Quiero una cotizacion para letreros.\n1. Nombre: ${form.name || "..."}\n2. Negocio: ${form.businessType || "..."}\n3. Mensaje: ${form.message || "..."}`
      : `Hi! I'd like a quote for business signs.\n1. Name: ${form.name || "..."}\n2. Business: ${form.businessType || "..."}\n3. Message: ${form.message || "..."}`
  )}`;

  const isFormValid = form.name.trim() !== "" && form.businessType !== "" && form.message.trim() !== "";

  const headlines = [
    { line1: t("bs.hero.h1.line1"), line2: t("bs.hero.h1.line2"), line3: t("bs.hero.h1.line3") },
    { line1: t("bs.hero.h2.line1"), line2: t("bs.hero.h2.line2"), line3: t("bs.hero.h2.line3") },
    { line1: t("bs.hero.h3.line1"), line2: t("bs.hero.h3.line2"), line3: t("bs.hero.h3.line3") },
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#050510] via-[#0a0a1a] to-background" />
      <FloatingElements elements={HERO_ELEMENTS} />

      <div className="relative z-10 w-full max-w-5xl lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-32 md:pt-40 lg:pt-48 pb-20 md:pb-20 lg:pb-28">
        {/* Badge */}
        <FadeUp delay={0.1}>
          <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-4 py-1 sm:py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mt-10 sm:mt-0 mb-8 lg:mb-24">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-brand-hot-pink flex-shrink-0" />
            <span className="text-[9px] sm:text-sm text-gray-300 text-center leading-tight whitespace-nowrap">{t("bs.hero.badge")}</span>
          </div>
        </FadeUp>

        {/* Rotating Headlines */}
        <div className="relative min-h-[9rem] sm:min-h-[11rem] md:min-h-[14rem] lg:min-h-[11rem] mb-7 sm:mb-10 lg:mb-20">
          <AnimatePresence mode="wait">
            <motion.h1
              key={key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <span className="lg:hidden text-[1.65rem] sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.15] text-white drop-shadow-lg">{h.line1}</span>
              <span className="lg:hidden text-[1.65rem] sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.15] gradient-brand-text drop-shadow-lg">{h.line2}</span>
              <span className="lg:hidden text-[1.65rem] sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.15] text-white drop-shadow-lg">{h.line3}</span>
              <span className="hidden lg:block lg:text-7xl font-black tracking-tight leading-[1.15] text-white drop-shadow-lg">{h.line1}</span>
              <span className="hidden lg:block lg:text-7xl font-black tracking-tight leading-[1.15] gradient-brand-text drop-shadow-lg">{h.line2}</span>
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* Hero Static Image */}
        <FadeUp delay={0.3}>
          <div className="relative w-full max-w-[700px] mx-auto mb-6 sm:mb-8 lg:mb-10">
            <div className="shimmer-border rounded-2xl">
              <div className="shimmer-inner-dark rounded-[14px]">
                <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-video rounded-[14px] overflow-hidden bg-white/5">
                  <Image src={BS_HERO_STATIC_IMAGE} alt="Custom business sign installation by Imagine Studio Design in Wilmington NC" fill priority className="object-cover" sizes="(max-width: 700px) 100vw, 700px" />
                </div>
              </div>
            </div>
          </div>
        </FadeUp>

        {/* Subtitle */}
        <FadeUp delay={0.35}>
          <p className="text-[0.9rem] sm:text-lg md:text-xl lg:text-xl text-gray-300 max-w-2xl lg:max-w-3xl mx-auto mb-8 lg:mb-12 leading-relaxed drop-shadow-md">{t("bs.hero.subtitle")}</p>
        </FadeUp>

        {/* Mini WhatsApp Form */}
        <FadeUp delay={0.4}>
          <div className="w-full max-w-[600px] mx-auto mb-4 sm:mb-6 lg:mb-8">
            <p className="text-center text-xs sm:text-sm font-bold text-white mb-3 leading-snug drop-shadow-md whitespace-pre-line">
              {t("bs.hero.form.cta")}
            </p>
            <div className="shimmer-border-glow rounded-2xl">
              <div className="shimmer-inner-dark rounded-[14px] p-4 sm:p-6">
                {/* Name */}
                <div className="relative mb-3">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-500" />
                  <Input
                    value={form.name}
                    onChange={(e) => { setForm((f) => ({ ...f, name: e.target.value })); }}
                    placeholder={t("bs.hero.form.name")}
                    className="pl-10 bg-white/5 text-white placeholder:text-gray-500 rounded-xl h-11 text-sm border-white/10 focus:border-brand-hot-pink/50"
                  />
                </div>
                {/* Business Type */}
                <div className="relative mb-3">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none z-10 text-gray-500" />
                  <Select value={form.businessType} onValueChange={(v) => { setForm((f) => ({ ...f, businessType: v })); }}>
                    <SelectTrigger className="pl-10 bg-white/5 text-white rounded-xl h-11 text-sm border-white/10 focus:border-brand-hot-pink/50">
                      <SelectValue placeholder={t("bs.hero.form.business")} />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111128] border-white/10 text-white max-h-60 overflow-y-auto">
                      {BS_BIZ_KEYS.map((key) => (
                        <SelectItem key={key} value={key} className="text-gray-300 focus:text-white focus:bg-white/5">{t(key)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Message */}
                <div className="relative mb-4">
                  <MessageSquare className="absolute left-3 top-3 w-4 h-4 pointer-events-none text-gray-500" />
                  <Textarea
                    value={form.message}
                    onChange={(e) => { setForm((f) => ({ ...f, message: e.target.value })); }}
                    placeholder={t("bs.hero.form.message")}
                    className="pl-10 bg-white/5 text-white placeholder:text-gray-500 rounded-xl min-h-[100px] sm:min-h-[120px] text-sm resize-none border-white/10 focus:border-brand-hot-pink/50"
                  />
                </div>
                {/* Proof social */}
                <div className="flex items-center justify-center gap-2 mb-3 text-xs text-gray-300">
                  <div className="flex -space-x-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <span className="font-bold text-white">4.8</span>
                  <span className="text-gray-500">·</span>
                  <span>1,500+ projects</span>
                  <span className="text-gray-500">·</span>
                  <span>10+ years</span>
                </div>
                {/* WhatsApp Button */}
                <a
                  href={isFormValid ? waLink : undefined}
                  target={isFormValid ? "_blank" : undefined}
                  rel={isFormValid ? "noopener noreferrer" : undefined}
                  aria-disabled={!isFormValid}
                  /* 🔒 META PIXEL LEAD — DO NOT DELETE */
                  onClick={(e) => {
                    if (!isFormValid) { e.preventDefault(); return; }
                    try { (window as any).fbq("track", "Lead", { content_name: "Business Signs Hero Mini Form" }); } catch {}
                  }}
                  className={`w-full flex items-center justify-center gap-2.5 text-white font-bold rounded-xl py-3.5 sm:py-4 text-sm sm:text-base lg:text-lg tracking-wide transition-all no-underline ${
                    isFormValid
                      ? "bg-[#25D366] hover:bg-[#22c55e] active:bg-[#1da851] cursor-pointer"
                      : "bg-[#25D366]/40 cursor-not-allowed opacity-60"
                  }`}
                >
                  <WhatsAppIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  {t("bs.hero.form.send")}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              </div>
            </div>
          </div>
        </FadeUp>

        {/* Or call text */}
        <FadeUp delay={0.45}>
          <p className="text-sm text-gray-400 mb-6 lg:mb-8">
            {t("bs.hero.form.orCall")}
          </p>
        </FadeUp>

        {/* Static Showcase Image with gradient glow */}
        <FadeUp delay={0.5}>
          <div className="w-full max-w-[700px] mx-auto mb-6 lg:mb-8">
            <div className="shimmer-border-glow rounded-2xl">
              <div className="shimmer-inner-dark rounded-[14px]">
                <div className="relative aspect-[16/9] rounded-[14px] overflow-hidden bg-white/5">
                  <Image src={BS_SHOWCASE_IMAGE} alt="Imagine Studio Design business signs showcase — exterior signs, channel letters, monument signs and more" fill loading="lazy" className="object-cover" sizes="(max-width: 700px) 100vw, 700px" />
                </div>
              </div>
            </div>
            <p className="text-center text-sm sm:text-base font-bold gradient-brand-text mt-4 leading-snug drop-shadow-md">
              {t("bs.hero.showcase.tagline")}
            </p>
          </div>
        </FadeUp>

        {/* Social Proof */}
        <FadeUp delay={0.8}>
          <div className="mt-8 sm:mt-14 lg:mt-20 w-full max-w-xl lg:max-w-3xl mx-auto">
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center gap-x-3 gap-y-2.5 lg:gap-x-10 lg:gap-y-4">
              {[
                t("bs.hero.trust1"),
                t("bs.hero.trust2"),
                t("bs.hero.trust3"),
                t("bs.hero.trust4"),
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
                <span className="text-xs sm:text-sm lg:text-base text-gray-400">{t("bs.hero.trust5Stars")}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-base sm:text-lg lg:text-2xl font-black gradient-brand-text">{t("bs.hero.trustProjects")}</span>
                <span className="text-xs sm:text-sm lg:text-base text-gray-400">{t("bs.hero.trustProjectsLabel")}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-base sm:text-lg lg:text-2xl font-black gradient-brand-text">{t("bs.hero.trustYears")}</span>
                <span className="text-xs sm:text-sm lg:text-base text-gray-400">{t("bs.hero.trustYearsLabel")}</span>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
      <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2"><div className="w-1.5 h-3 rounded-full bg-white/40" /></div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   2. GALLERY CAROUSEL — reused component
   ═══════════════════════════════════════════════════ */
// GalleryCarousel is imported and used directly in the page render

/* ═══════════════════════════════════════════════════
   3. PROBLEM — adapted for Business Signs
   ═══════════════════════════════════════════════════ */
function ProblemSection() {
  const { t } = useLang();
  const pains = [t("bs.problem.pain1"), t("bs.problem.pain2"), t("bs.problem.pain3")];
  const icons = [Eye, TrendingUp, Shield];
  return (
    <section id="our-work" className="relative py-20 md:py-28 lg:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[#0a0a1a] to-background" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <FloatingElements elements={PROBLEM_ELEMENTS} />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="text-center mb-16 lg:mb-20">
            <span className="inline-block text-sm font-semibold tracking-widest uppercase text-brand-hot-pink mb-4">{t("bs.problem.tag")}</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 lg:mb-8 leading-tight">
              {t("bs.problem.title1")} <span className="gradient-brand-text">{t("bs.problem.titleHighlight")}</span>.
            </h2>
            <p className="text-gray-400 text-lg lg:text-xl max-w-2xl lg:max-w-3xl mx-auto">{t("bs.problem.subtitle")}</p>
          </div>
        </FadeUp>
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {pains.map((txt, i) => (
            <FadeUp key={i} delay={i * 0.15}>
              <div className="relative group p-6 lg:p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-brand-purple/20 transition-all duration-500 h-full backdrop-blur-sm">
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
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">{t("bs.problem.soundFamiliar")}</p>
            <p className="text-gray-400 text-base lg:text-lg">{t("bs.problem.goodNews")} <span className="text-brand-bright-blue font-semibold">{t("bs.problem.fixable")}</span></p>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   4. TRANSFORMATION — adapted for Business Signs
   ═══════════════════════════════════════════════════ */
function TransformationSection() {
  const { t } = useLang();
  const realProjects = [
    { src: "/images/real-leon-tires.jpg", name: "Leon Tires & Body Services LLC" },
    { src: "/images/real-pelones-framing.jpg", name: "Los Pelones Framing LLC" },
    { src: "/images/real-cabrera-flooring.jpg", name: "Cabrera Flooring LLC" },
  ];
  return (
    <section className="relative py-20 md:py-28 lg:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-[#080818]" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <FloatingElements elements={TRANSFORM_ELEMENTS} />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <span className="inline-block text-sm font-semibold tracking-widest uppercase text-brand-hot-pink mb-4">{t("bs.transform.tag")}</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 lg:mb-8 leading-tight">
              {t("bs.transform.from")} <span className="text-gray-500">{t("bs.transform.invisible")}</span> {t("bs.transform.to")} <span className="gradient-brand-text">{t("bs.transform.impossible")}</span>
            </h2>
            <p className="text-gray-400 text-base sm:text-lg lg:text-xl max-w-2xl lg:max-w-3xl mx-auto">{t("bs.transform.subtitle")}</p>
          </div>
        </FadeUp>
        <ScaleIn delay={0.1}>
          <div className="mb-10">
            <BeforeAfterSlider
              beforeSrc="/images/after-brothers-painting.png"
              afterSrc="/images/before-brothers-painting.png"
              beforeAlt="Business before new signage"
              afterAlt="Business after new signage - Brothers Painting Services LLC"
            />
            <p className="text-center text-sm text-gray-500 mt-4">{t("bs.transform.realProject")}</p>
          </div>
        </ScaleIn>
        <div className="grid sm:grid-cols-3 gap-4 lg:gap-6">
          {realProjects.map((item, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <div className="project-card relative rounded-xl overflow-hidden border border-white/5 group">
                <div className="relative aspect-[4/3]">
                  <Image src={item.src} alt={`${item.name} business signage by Imagine Studio Design`} fill loading="lazy" className="object-cover group-hover:scale-105 transition-transform duration-700" />
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

/* ═══════════════════════════════════════════════════
   5. WHO WE HELP — adapted for Business Signs
   ═══════════════════════════════════════════════════ */
function WhoWeHelpSection({ onQuote }: { onQuote: () => void }) {
  const { t } = useLang();
  return (
    <section className="relative py-20 md:py-28 lg:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#080818] via-background to-background" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="text-center mb-16 lg:mb-20">
            <span className="inline-block text-sm font-semibold tracking-widest uppercase text-brand-hot-pink mb-4">{t("bs.who.tag")}</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 lg:mb-8 leading-tight">
              {t("bs.who.title1")} <span className="gradient-brand-text">{t("bs.who.titleHighlight")}</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">{t("bs.who.subtitle")}</p>
          </div>
        </FadeUp>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
          {BS_INDUSTRIES_DATA.map((ind, i) => (
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
            <p className="text-gray-400 mb-4"><Store className="w-4 h-4 inline mr-1" /> {t("bs.who.also")}</p>
            <button onClick={onQuote} className="cta-primary text-white font-bold px-8 py-3.5 rounded-xl text-sm tracking-wide inline-flex items-center gap-2">
              {t("bs.who.seeCta")} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   6. SIGN TYPES (Visibility System) — adapted for Business Signs
   ═══════════════════════════════════════════════════ */
function SignTypesSection({ onQuote }: { onQuote: () => void }) {
  const { t } = useLang();
  return (
    <section id="sign-types" className="relative py-20 md:py-28 lg:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[#0a0a1a] to-background" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <FloatingElements elements={VISIBILITY_ELEMENTS} />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="text-center mb-16 lg:mb-20">
            <span className="inline-block text-sm font-semibold tracking-widest uppercase text-brand-hot-pink mb-4">{t("bs.vis.tag")}</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 lg:mb-8 leading-tight">
              {t("bs.vis.title1")} <span className="gradient-brand-text">{t("bs.vis.titleHighlight")}</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">{t("bs.vis.subtitle")}</p>
          </div>
        </FadeUp>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {BS_SIGN_TYPES_DATA.map((item, i) => (
            <FadeUp key={i} delay={i * 0.08}>
              <div className="group relative p-6 lg:p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-brand-purple/20 transition-all duration-500 h-full">
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
            <p className="text-white text-lg font-semibold mb-2">{t("bs.vis.everything")} <span className="gradient-brand-text">{t("bs.vis.professional")}</span>.</p>
            <button onClick={onQuote} className="mt-4 cta-primary text-white font-bold px-8 py-3.5 rounded-xl text-sm tracking-wide inline-flex items-center gap-2">
              {t("bs.vis.customCta")} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   7. FEATURED PROJECTS — adapted for Business Signs
   ═══════════════════════════════════════════════════ */
function FeaturedProjectsSection() {
  const { t } = useLang();
  return (
    <section id="portfolio" className="relative py-20 md:py-28 lg:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-[#080818]" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-4 lg:mb-6 leading-tight">
              {t("bs.featured.headline")}
            </h2>
            <p className="text-sm sm:text-base text-gray-500 max-w-xl mx-auto">{t("bs.featured.subline")}</p>
          </div>
        </FadeUp>
        <FadeIn delay={0.2}>
          <div className="relative pl-12 pr-12 lg:pl-16 lg:pr-16">
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent className="-ml-4">
                {BS_PROJECTS_DATA.map((project, i) => (
                  <CarouselItem key={i} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <div className="project-card group rounded-xl overflow-hidden border border-white/5 bg-white/[0.02] cursor-pointer">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image src={project.src} alt={project.altEn} fill loading="lazy" className="object-cover group-hover:scale-110 transition-transform duration-700" />
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

/* ═══════════════════════════════════════════════════
   8. TRUST — adapted for Business Signs
   ═══════════════════════════════════════════════════ */
function TrustSection() {
  const { t } = useLang();
  const REVIEW_IMAGES = [
    { src: "/images/reviews/f92beccc-7b6d-4a81-b4da-fc7aeb7dc0cf.jpg", alt: "Google review from River Vibes praising quick graduation lab coat embroidery fix", w: 1080, h: 1433 },
    { src: "/images/reviews/cfc6823b-e282-4728-b5f8-46303650b57b.jpg", alt: "Google review from Jose Avendaño (Local Guide) recommending the service 100%", w: 1079, h: 1062 },
    { src: "/images/reviews/0e5d2cac-3128-4f0f-8b5f-d69ee4e9c5ad.jpg", alt: "Google review from Christopher Sperry praising corporate shirts and stand materials", w: 636, h: 1280 },
    { src: "/images/reviews/0a7143ef-48a3-42ae-82f6-55bafa2448bb.jpg", alt: "Google review from Falco Bauer (Local Guide) praising quick t-shirt printing and professionalism", w: 1080, h: 577 },
    { src: "/images/reviews/d9581e25-79bf-4b55-bacc-1090ac09c993.jpg", alt: "Google review from Elsa Sutkevich (Local Guide) praising Genny as creative and professional", w: 1080, h: 468 },
  ];
  return (
    <section className="relative py-20 md:py-28 lg:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#080818] via-background to-background" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Metrics bar */}
        <FadeUp>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mb-16 lg:mb-20">
            {BS_METRICS_DATA.map((m, i) => (
              <ScaleIn key={i} delay={i * 0.1}>
                <div className="text-center p-4 lg:p-6 rounded-xl border border-white/5 bg-white/[0.02]">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-black gradient-brand-text mb-1">{m.value}</div>
                  <div className="text-gray-400 text-xs lg:text-sm">{t(m.labelKey)}</div>
                </div>
              </ScaleIn>
            ))}
          </div>
        </FadeUp>
        {/* Google Reviews */}
        <FadeUp delay={0.1}>
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-1.5 mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />)}
              <span className="text-white font-bold text-sm ml-1">4.8</span>
              <span className="text-gray-400 text-sm">Google</span>
            </div>
          </div>
        </FadeUp>
        <FadeUp delay={0.2}>
          <div className="space-y-4 mb-16 lg:mb-20">
            {REVIEW_IMAGES.map((review, i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-white/5 bg-white/[0.02]">
                <Image src={review.src} alt={review.alt} width={review.w} height={review.h} loading="lazy" className="w-full h-auto" />
              </div>
            ))}
          </div>
        </FadeUp>
        {/* Team/Family photo */}
        <FadeUp delay={0.1}>
          <div className="mb-16 lg:mb-20">
            <div className="relative rounded-2xl overflow-hidden lg:aspect-[21/9]">
              <Image
                src="/images/team-family-booth.jpg"
                alt="Imagine Studio Design team and family"
                width={1200}
                height={800}
                className="w-full h-auto lg:absolute lg:inset-0 lg:w-full lg:h-full lg:object-cover"
              />
            </div>
            <p className="text-white text-base sm:text-lg lg:text-xl font-semibold leading-relaxed text-center mt-4 px-4">
              {t("bs.trust.teamText")}
            </p>
          </div>
        </FadeUp>
        {/* Metrics strip */}
        <FadeUp delay={0.2}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mb-16 lg:mb-20">
            <div className="flex items-center justify-center gap-2 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
              <div className="flex -space-x-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span className="text-gray-300 text-sm lg:text-base font-medium">Google</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
              <span className="text-xl lg:text-2xl font-black gradient-brand-text">1500+</span>
              <span className="text-gray-300 text-sm lg:text-base font-medium">{t("bs.trust.projects")}</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
              <span className="text-xl lg:text-2xl font-black gradient-brand-text">10+</span>
              <span className="text-gray-300 text-sm lg:text-base font-medium">{t("bs.trust.experience")}</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
              <span className="text-xl lg:text-2xl font-black gradient-brand-text">98%</span>
              <span className="text-gray-300 text-sm lg:text-base font-medium">{t("bs.trust.satisfaction")}</span>
            </div>
          </div>
        </FadeUp>
        {/* Guarantee */}
        <FadeUp delay={0.3}>
          <div className="text-center">
            <p className="text-gray-400 text-sm"><Shield className="w-4 h-4 inline mr-1 text-brand-purple" /> {t("bs.trust.guarantee")}</p>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   8.5. FAQ — NEW section for Business Signs
   ═══════════════════════════════════════════════════ */
function FAQSection() {
  const { t } = useLang();
  return (
    <section className="relative py-20 md:py-28 lg:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[#0a0a1a] to-background" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="text-center mb-12 lg:mb-16">
            <span className="inline-block text-sm font-semibold tracking-widest uppercase text-brand-hot-pink mb-4">{t("bs.faq.tag")}</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 lg:mb-8 leading-tight">
              {t("bs.faq.title1")} <span className="gradient-brand-text">{t("bs.faq.titleHighlight")}</span>
            </h2>
          </div>
        </FadeUp>
        <FadeUp delay={0.2}>
          <Accordion type="single" collapsible className="space-y-4">
            {BS_FAQ_KEYS.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="rounded-xl border border-white/5 bg-white/[0.02] px-4 lg:px-6">
                <AccordionTrigger className="text-white font-bold text-sm sm:text-base lg:text-lg text-left hover:no-underline py-5 lg:py-6">
                  {t(faq.qKey)}
                </AccordionTrigger>
                <AccordionContent className="text-gray-400 text-sm sm:text-base leading-relaxed pb-5 lg:pb-6">
                  {t(faq.aKey)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeUp>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   9. PROCESS — adapted for Business Signs
   ═══════════════════════════════════════════════════ */
function ProcessSection({ onQuote }: { onQuote: () => void }) {
  const { t } = useLang();
  return (
    <section id="process" className="relative py-20 md:py-28 lg:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[#0a0a1a] to-background" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="text-center mb-16 lg:mb-20">
            <span className="inline-block text-sm font-semibold tracking-widest uppercase text-brand-hot-pink mb-4">{t("bs.process.tag")}</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 lg:mb-8 leading-tight">
              {t("bs.process.title1")} <span className="gradient-brand-text">{t("bs.process.titleHighlight")}</span>.
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">{t("bs.process.subtitle")}</p>
          </div>
        </FadeUp>
        <div className="hidden md:grid md:grid-cols-5 gap-4 lg:gap-6 relative">
          <div className="absolute top-12 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-brand-blue via-brand-purple to-brand-hot-pink opacity-30" />
          {BS_PROCESS_DATA.map((step, i) => (
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
          {BS_PROCESS_DATA.map((step, i) => (
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
              {t("bs.process.cta")} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   10. FINAL CTA — adapted for Business Signs
   ═══════════════════════════════════════════════════ */
function FinalCTASection({ onQuote }: { onQuote: () => void }) {
  const { t } = useLang();
  return (
    <section className="relative py-24 md:py-32 lg:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[#080818] to-background" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <FloatingElements elements={FINAL_CTA_ELEMENTS} />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <FadeUp><Image src="/LOGO.png" alt="Imagine Studio Design" width={120} height={36} loading="lazy" className="mx-auto h-10 lg:h-12 w-auto object-contain mb-8 lg:mb-10 opacity-80" /></FadeUp>
        <FadeUp delay={0.1}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-6 lg:mb-8 leading-tight">
            {t("bs.final.title1")} <span className="gradient-brand-text">{t("bs.final.titleHighlight")}</span> {t("bs.final.title2")}
          </h2>
        </FadeUp>
        <FadeUp delay={0.2}>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-400 max-w-2xl lg:max-w-3xl mx-auto mb-4 lg:mb-6 leading-relaxed">{t("bs.final.subtitle")}</p>
        </FadeUp>
        <FadeUp delay={0.3}>
          <p className="text-white text-xl lg:text-2xl font-bold mb-10 lg:mb-14">{t("bs.final.build")} <span className="gradient-brand-text">{t("bs.final.unstoppable")}</span>.</p>
        </FadeUp>
        <FadeUp delay={0.4}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 lg:gap-6 mb-8">
            <button onClick={onQuote} className="cta-primary text-white font-bold px-10 lg:px-12 py-4 lg:py-5 rounded-xl text-lg lg:text-xl tracking-wide flex items-center gap-2 min-w-[280px] lg:min-w-[320px] justify-center animate-pulse-glow">
              {t("bs.final.cta")} <ArrowRight className="w-5 h-5" />
            </button>
            <a href="tel:+19105474314" className="flex items-center gap-2 px-6 lg:px-8 py-4 lg:py-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all text-sm lg:text-base font-semibold">
              <Phone className="w-4 h-4" /> (910) 547-4314
            </a>
          </div>
        </FadeUp>
        <FadeUp delay={0.5}>
          <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-6 text-gray-500 text-sm lg:text-base">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {t("bs.final.fast")}</span>
            <span className="text-white/10">|</span>
            <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> {t("bs.final.quality")}</span>
            <span className="text-white/10">|</span>
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {t("bs.final.wilmington")}</span>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   INTERACTIVE MAP — reused
   ═══════════════════════════════════════════════════ */
function MapSection() {
  const { t, lang } = useLang();
  const LAT = 34.2134;
  const LNG = -77.8824;
  const ADDRESS = "4608 Cedar Ave, Suite 105, Wilmington, NC 28403";

  const handleDirections = () => {
    if (!navigator.geolocation) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${LAT},${LNG}`, "_blank");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${LAT},${LNG}`, "_blank");
      },
      () => {
        alert(lang === "es" ? "Por favor activa tu GPS/ubicación para usar esta función." : "Please enable your GPS/Location to use this feature.");
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${LAT},${LNG}`, "_blank");
      }
    );
  };

  return (
    <section id="location" className="relative py-20 md:py-28 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[#0a0a1a] to-[#050510]" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="text-center mb-10 lg:mb-14">
            <span className="inline-block text-sm font-semibold tracking-widest uppercase text-brand-hot-pink mb-4">{t("bs.map.tag")}</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight">{t("bs.map.title")}</h2>
            <p className="text-gray-400 text-base lg:text-lg max-w-2xl mx-auto">{t("bs.map.subtitle")}</p>
          </div>
        </FadeUp>
        <FadeUp delay={0.1}>
          <div className="glass rounded-2xl p-6 lg:p-8 mb-8 max-w-2xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg mb-1">{t("bs.map.addressLabel")}</h3>
                <p className="text-gray-300 text-base mb-4">{ADDRESS}</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a href="tel:+19105474314" className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors font-medium text-sm">
                    <Phone className="w-4 h-4" /> (910) 547-4314
                  </a>
                  <a href="mailto:gtimaginedesign@gmail.com" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-medium text-sm">
                    <Mail className="w-4 h-4" /> gtimaginedesign@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </FadeUp>
        <FadeUp delay={0.2}>
          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-brand-purple/10">
            <div className="relative w-full aspect-[4/3] md:aspect-[16/9]">
              <iframe
                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3268.5!2d${LNG}!3d${LAT}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDEyJzQ4LjIiTiA3N8KwNTInNTYuNiJX!5e0!3m2!1sen!2sus!4v1`}
                width="100%"
                height="100%"
                style={{ border: 0, position: "absolute", inset: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Imagine Studio Design Location"
              />
            </div>
            <div className="p-4 lg:p-6 bg-[#0a0a1a] border-t border-white/5">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Navigation className="w-4 h-4" />
                  <span>{t("bs.map.findUs")}</span>
                </div>
                <button
                  onClick={handleDirections}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl gradient-brand text-white font-bold text-sm tracking-wide hover:scale-[1.03] transition-transform"
                >
                  <Navigation className="w-4 h-4" />
                  {t("bs.map.getDirections")}
                </button>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   FOOTER — reused, adapted for Business Signs
   ═══════════════════════════════════════════════════ */
function Footer() {
  const { t } = useLang();
  return (
    <footer className="relative border-t border-white/5 bg-[#050510]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Image src="/LOGO.png" alt="Imagine Studio Design" width={120} height={36} loading="lazy" className="h-8 w-auto object-contain opacity-70" />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-gray-500">
            <a href="tel:+19105474314" className="hover:text-gray-300 transition-colors flex items-center gap-1"><Phone className="w-3 h-3" /> (910) 547-4314</a>
            <a href="mailto:gtimaginedesign@gmail.com" className="hover:text-gray-300 transition-colors flex items-center gap-1"><Mail className="w-3 h-3" /> gtimaginedesign@gmail.com</a>
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {t("bs.footer.location")}</span>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-white/5 text-center text-xs text-gray-600">
          © {new Date().getFullYear()} {t("bs.footer.rights")}
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE — Business Signs Landing
   ═══════════════════════════════════════════════════ */
export default function BusinessSignsPage() {
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
      <SignTypesSection onQuote={() => setQuoteOpen(true)} />
      <FeaturedProjectsSection />
      <TrustSection />
      <FAQSection />
      <ProcessSection onQuote={() => setQuoteOpen(true)} />
      <FinalCTASection onQuote={() => setQuoteOpen(true)} />
      <MapSection />
      <Footer />
      <StickyCTA onQuoteClick={() => setQuoteOpen(true)} />
      <FloatingCTA onQuoteClick={() => setQuoteOpen(true)} />
      <ExitIntentPopup onQuote={() => setQuoteOpen(true)} />
      <QuoteFormModal open={quoteOpen} onOpenChange={setQuoteOpen} />
    </main>
  );
}
