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
import QuoteFormModal from "@/components/quote-form-modal";
import StickyCTA, { FloatingCTA } from "@/components/sticky-cta";

/* ───────── ANIMATION HELPERS ───────── */
function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ScaleIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ───────── DATA ───────── */
const PROJECTS = [
  { src: "/images/truck-wrap-1.png", alt: "HVAC commercial truck wrap", label: "HVAC Fleet Wrap" },
  { src: "/images/plumber-van.png", alt: "Plumber service van branding", label: "Plumber Van Branding" },
  { src: "/images/electrician-truck.png", alt: "Electrician work truck wrap", label: "Electrician Fleet" },
  { src: "/images/pickup-wrap.png", alt: "Construction pickup truck wrap", label: "Construction Pickup" },
  { src: "/images/fleet-branding.png", alt: "Landscaping fleet branding", label: "Landscaping Fleet" },
  { src: "/images/wrap-detail.png", alt: "Vehicle wrap installation detail", label: "Premium Installation" },
  { src: "/images/signage-project.png", alt: "Commercial business signage", label: "Business Signage" },
  { src: "/images/apparel-project.png", alt: "Branded work apparel", label: "Branded Apparel" },
];

const INDUSTRIES = [
  { icon: HardHat, label: "Contractors", desc: "Build trust before you step on site" },
  { icon: HomeIcon, label: "Roofing", desc: "Dominate neighborhoods with mobile authority" },
  { icon: Snowflake, label: "HVAC", desc: "Be the company everyone recognizes" },
  { icon: Wrench, label: "Plumbing", desc: "First call, not the last resort" },
  { icon: Plug, label: "Electrical", desc: "Professional power, visible brand" },
  { icon: TreePine, label: "Landscaping", desc: "Green work, bold branding" },
  { icon: PaintBucket, label: "Painting", desc: "Your vans are your gallery" },
  { icon: TreePine, label: "Tree Service", desc: "Stand tall with a stand-out brand" },
  { icon: GlassWater, label: "Concrete", desc: "Solid brand on solid wheels" },
  { icon: Building2, label: "Construction", desc: "Project credibility on every truck" },
];

const PROCESS_STEPS = [
  { num: "01", title: "Request Your Quote", desc: "Tell us about your business and vision. Free, no-obligation.", icon: Phone },
  { num: "02", title: "Design Approval", desc: "We create a custom design. You approve it before anything is printed.", icon: Palette },
  { num: "03", title: "Production", desc: "Premium materials, precision printing. Built to last and impress.", icon: Layers },
  { num: "04", title: "Installation", desc: "Professional installation at your location. Minimal downtime.", icon: Truck },
  { num: "05", title: "You're Visible", desc: "Your business becomes impossible to ignore. Watch the calls roll in.", icon: Eye },
];

const TRUST_METRICS = [
  { value: "500+", label: "Projects Completed" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "10+", label: "Years Experience" },
  { value: "24h", label: "Quote Turnaround" },
];

const VISIBILITY_ITEMS = [
  { icon: Layers, title: "Vehicle Wraps & Fleet Branding", desc: "Turn every mile into a marketing opportunity. Full wraps, partial wraps, and fleet-consistent designs." },
  { icon: Eye, title: "Custom Signage", desc: "Storefront signs, banners, window graphics, yard signs — everything that makes you impossible to miss." },
  { icon: Users, title: "Branded Apparel", desc: "Uniforms, safety vests, caps, polos — your team becomes walking brand ambassadors." },
  { icon: Target, title: "Promotional Materials", desc: "Business cards, brochures, vehicle magnets, and marketing collateral that matches your brand." },
  { icon: Palette, title: "Brand Identity Design", desc: "Logos, color systems, brand guidelines — build a visual identity that commands respect." },
  { icon: Zap, title: "Digital Presence", desc: "Consistent branding across your website, social media, and digital platforms." },
];

/* ───────── NAV ───────── */
function Nav({ onQuote }: { onQuote: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glass-strong">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 flex-shrink-0">
            <Image src="/LOGO.png" alt="Imagine Studio Design" width={140} height={40} className="h-8 md:h-10 w-auto object-contain" priority />
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#transformations" className="text-sm text-gray-400 hover:text-white transition-colors">Transformations</a>
            <a href="#who-we-help" className="text-sm text-gray-400 hover:text-white transition-colors">Industries</a>
            <a href="#projects" className="text-sm text-gray-400 hover:text-white transition-colors">Projects</a>
            <a href="#process" className="text-sm text-gray-400 hover:text-white transition-colors">Process</a>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a href="tel:+19105550123" className="flex items-center gap-2 text-sm text-gray-400 hover:text-emerald-400 transition-colors">
              <Phone className="w-4 h-4" />
              (910) 555-0123
            </a>
            <button onClick={onQuote} className="cta-primary text-white text-sm font-bold px-5 py-2.5 rounded-lg tracking-wide">
              GET MY QUOTE
            </button>
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setOpen(!open)} className="md:hidden w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center" aria-label="Toggle menu">
            {open ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pb-6 pt-2 border-t border-white/5"
          >
            <div className="flex flex-col gap-4">
              <a href="#transformations" onClick={() => setOpen(false)} className="text-gray-300 hover:text-white py-2">Transformations</a>
              <a href="#who-we-help" onClick={() => setOpen(false)} className="text-gray-300 hover:text-white py-2">Industries</a>
              <a href="#projects" onClick={() => setOpen(false)} className="text-gray-300 hover:text-white py-2">Projects</a>
              <a href="#process" onClick={() => setOpen(false)} className="text-gray-300 hover:text-white py-2">Process</a>
              <div className="section-divider" />
              <a href="tel:+19105550123" className="flex items-center gap-2 text-emerald-400 py-2">
                <Phone className="w-4 h-4" /> (910) 555-0123
              </a>
              <button onClick={() => { setOpen(false); onQuote(); }} className="cta-primary text-white font-bold py-3 rounded-xl text-sm tracking-wide w-full">
                GET MY FREE QUOTE
              </button>
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
  const y = useTransform(scrollY, [0, 600], [0, 200]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image with parallax */}
      <motion.div className="absolute inset-0 z-0" style={{ y }}>
        <Image src="/images/hero-montage.png" alt="Professional vehicle wraps and fleet branding" fill className="object-cover object-center" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
      </motion.div>

      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-purple/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-magenta/15 rounded-full blur-[120px]" />

      {/* Content */}
      <motion.div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16" style={{ opacity }}>
        <FadeUp delay={0.1}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8">
            <MapPin className="w-4 h-4 text-brand-hot-pink" />
            <span className="text-sm text-gray-300">Wilmington, NC&apos;s #1 Business Visibility Company</span>
          </div>
        </FadeUp>

        <FadeUp delay={0.2}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6">
            <span className="text-white">LOOK PROFESSIONAL.</span>
            <br />
            <span className="gradient-brand-text">GET NOTICED.</span>
            <br />
            <span className="text-white">WIN MORE CUSTOMERS.</span>
          </h1>
        </FadeUp>

        <FadeUp delay={0.4}>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Your competitors look more professional than you — and they&apos;re getting the calls. 
            It&apos;s time to change that. Turn every vehicle, every sign, every impression into a customer magnet.
          </p>
        </FadeUp>

        <FadeUp delay={0.6}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={onQuote} className="cta-primary text-white font-bold px-8 py-4 rounded-xl text-base tracking-wide flex items-center gap-2 min-w-[240px] justify-center">
              GET MY FREE QUOTE <ArrowRight className="w-5 h-5" />
            </button>
            <a href="#transformations" className="group flex items-center gap-2 px-6 py-4 rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:border-white/20 transition-all text-sm font-medium">
              SEE WHAT WE DO <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </FadeUp>

        <FadeUp delay={0.8}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-gray-500 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-purple" />
              Free Consultation
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-purple" />
              Custom Design Included
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-purple" />
              Results in Days, Not Weeks
            </div>
          </div>
        </FadeUp>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
          <div className="w-1.5 h-3 rounded-full bg-white/40" />
        </div>
      </motion.div>
    </section>
  );
}

/* ───────── 2. PROBLEM AWARENESS ───────── */
function ProblemSection() {
  const painPoints = [
    { icon: Eye, text: "Nobody knows who you are — your plain white van blends into the parking lot." },
    { icon: Shield, text: "Customers choose competitors who look more established and trustworthy." },
    { icon: Target, text: "You're losing jobs before you even get a chance to bid — all because of first impressions." },
  ];

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[#0a0a1a] to-background" />
      <div className="absolute top-0 left-0 right-0 section-divider" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold tracking-widest uppercase text-brand-hot-pink mb-4">The Problem</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Your Business Looks <span className="gradient-brand-text">Invisible</span>.
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              People judge your business before they call you. If you look generic, outdated, or unprofessional — they move on. 
              Every day you wait costs you customers.
            </p>
          </div>
        </FadeUp>

        <div className="grid md:grid-cols-3 gap-6">
          {painPoints.map((point, i) => (
            <FadeUp key={i} delay={i * 0.15}>
              <div className="relative group p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-brand-purple/20 transition-all duration-500 h-full">
                <div className="w-12 h-12 rounded-xl gradient-purple-pink flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <point.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-gray-300 leading-relaxed text-base">{point.text}</p>
              </div>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={0.4}>
          <div className="mt-12 text-center">
            <p className="text-xl sm:text-2xl font-bold text-white mb-2">
              Sound familiar?
            </p>
            <p className="text-gray-400 text-base">
              The good news: <span className="text-brand-bright-blue font-semibold">it&apos;s fixable in days, not months.</span>
            </p>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ───────── 3. VISUAL TRANSFORMATION ───────── */
function TransformationSection() {
  return (
    <section id="transformations" className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-[#080818]" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-purple/10 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold tracking-widest uppercase text-brand-hot-pink mb-4">The Transformation</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              From <span className="text-gray-500">Invisible</span> to <span className="gradient-brand-text">Impossible to Ignore</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              This is what happens when your business gets a professional brand identity. See the difference with your own eyes.
            </p>
          </div>
        </FadeUp>

        {/* Before/After main showcase */}
        <ScaleIn delay={0.1}>
          <div className="relative rounded-2xl overflow-hidden border border-white/10 glow-brand mb-10">
            <div className="grid md:grid-cols-2">
              <div className="relative aspect-[4/3] md:aspect-auto">
                <Image src="/images/before-after-van.png" alt="Before and after vehicle wrap transformation" fill className="object-cover" />
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-gray-900/80 border border-white/10">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Before → After</span>
                </div>
              </div>
              <div className="relative aspect-[4/3] md:aspect-auto">
                <Image src="/images/transformation-1.png" alt="Vehicle branding transformation" fill className="object-cover" />
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-gray-900/80 border border-white/10">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Real Transformation</span>
                </div>
              </div>
            </div>
          </div>
        </ScaleIn>

        {/* Secondary grid */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { src: "/images/truck-wrap-1.png", alt: "HVAC truck wrap", label: "Fleet Branding" },
            { src: "/images/pickup-wrap.png", alt: "Pickup truck wrap", label: "Vehicle Graphics" },
            { src: "/images/fleet-branding.png", alt: "Fleet branding", label: "Full Fleet Design" },
          ].map((item, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <div className="project-card relative rounded-xl overflow-hidden border border-white/5 group cursor-pointer aspect-[4/3]">
                <Image src={item.src} alt={item.alt} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-sm font-bold text-white">{item.label}</span>
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
  return (
    <section id="who-we-help" className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#080818] via-background to-background" />
      <div className="absolute top-0 left-0 right-0 section-divider" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold tracking-widest uppercase text-brand-hot-pink mb-4">Who We Help</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Built for Businesses That <span className="gradient-brand-text">Work Hard</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              If you drive to your customers, your vehicles are your best marketing tool. We make sure they work for you.
            </p>
          </div>
        </FadeUp>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {INDUSTRIES.map((ind, i) => (
            <FadeUp key={i} delay={i * 0.05}>
              <div className="group p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-brand-purple/20 transition-all duration-300 text-center h-full">
                <div className="w-12 h-12 mx-auto rounded-xl gradient-blue-purple flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <ind.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-bold text-sm mb-1">{ind.label}</h3>
                <p className="text-gray-500 text-xs leading-relaxed hidden sm:block">{ind.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={0.5}>
          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-4">
              <Store className="w-4 h-4 inline mr-1" /> Also: Restaurants, retail shops, and local service businesses
            </p>
            <button onClick={onQuote} className="cta-primary text-white font-bold px-8 py-3.5 rounded-xl text-sm tracking-wide inline-flex items-center gap-2">
              SEE WHAT YOUR BUSINESS COULD LOOK LIKE <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ───────── 5. VISIBILITY SYSTEM ───────── */
function VisibilitySystemSection({ onQuote }: { onQuote: () => void }) {
  return (
    <section id="visibility-system" className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[#0a0a1a] to-background" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      {/* Glow */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-brand-magenta/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/3 left-0 w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold tracking-widest uppercase text-brand-hot-pink mb-4">The System</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              The Business <span className="gradient-brand-text">Visibility System</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Not random services. A complete system designed to make your business impossible to ignore — from the street to the screen.
            </p>
          </div>
        </FadeUp>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VISIBILITY_ITEMS.map((item, i) => (
            <FadeUp key={i} delay={i * 0.08}>
              <div className="group p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-brand-purple/20 transition-all duration-500 h-full">
                <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-bold text-base mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={0.5}>
          <div className="mt-12 p-6 rounded-2xl border border-brand-purple/20 bg-brand-purple/5 text-center">
            <p className="text-white text-lg font-semibold mb-2">
              Everything works together. Everything matches. Everything screams <span className="gradient-brand-text">professional</span>.
            </p>
            <button onClick={onQuote} className="mt-4 cta-primary text-white font-bold px-8 py-3.5 rounded-xl text-sm tracking-wide inline-flex items-center gap-2">
              GET A CUSTOM QUOTE FOR MY BUSINESS <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ───────── 6. FEATURED PROJECTS CAROUSEL ───────── */
function FeaturedProjectsSection() {
  return (
    <section id="projects" className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-[#080818]" />
      <div className="absolute top-0 left-0 right-0 section-divider" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold tracking-widest uppercase text-brand-hot-pink mb-4">Our Work</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Real Projects. <span className="gradient-brand-text">Real Results</span>.
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Every project below is real work we&apos;ve delivered for businesses just like yours.
            </p>
          </div>
        </FadeUp>

        <FadeIn delay={0.2}>
          <div className="relative pl-12 pr-12 md:pl-14 md:pr-14">
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent className="-ml-4">
                {PROJECTS.map((project, i) => (
                  <CarouselItem key={i} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <div className="project-card group rounded-xl overflow-hidden border border-white/5 bg-white/[0.02] cursor-pointer">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image src={project.src} alt={project.alt} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <span className="text-sm font-bold text-white">{project.label}</span>
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
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#080818] via-background to-background" />
      <div className="absolute top-0 left-0 right-0 section-divider" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Metrics bar */}
        <FadeUp>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {TRUST_METRICS.map((m, i) => (
              <ScaleIn key={i} delay={i * 0.1}>
                <div className="text-center p-6 rounded-xl border border-white/5 bg-white/[0.02]">
                  <div className="text-3xl sm:text-4xl font-black gradient-brand-text mb-1">{m.value}</div>
                  <div className="text-gray-400 text-sm">{m.label}</div>
                </div>
              </ScaleIn>
            ))}
          </div>
        </FadeUp>

        {/* Testimonials */}
        <FadeUp delay={0.3}>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                quote: "After Imagine Studio wrapped our fleet, our phone started ringing from people who saw our trucks on the road. Best investment we ever made.",
                name: "Mike Rodriguez",
                biz: "Rodriguez Roofing — Wilmington, NC",
                stars: 5,
              },
              {
                quote: "We went from looking like a two-man operation to looking like the biggest company in town. Customers trust us before we even show up.",
                name: "James Patterson",
                biz: "Patterson HVAC — Leland, NC",
                stars: 5,
              },
            ].map((t, i) => (
              <FadeUp key={i} delay={i * 0.15}>
                <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] h-full flex flex-col">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.stars }).map((_, si) => (
                      <Star key={si} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-brand-purple/30 mb-3" />
                  <p className="text-gray-300 leading-relaxed flex-1 mb-4">&ldquo;{t.quote}&rdquo;</p>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.biz}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </FadeUp>

        <FadeUp delay={0.5}>
          <div className="mt-12 text-center">
            <p className="text-gray-400 text-sm">
              <Shield className="w-4 h-4 inline mr-1 text-brand-purple" /> Premium materials &bull; Professional installation &bull; 100% satisfaction guarantee
            </p>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ───────── 8. PROCESS ───────── */
function ProcessSection({ onQuote }: { onQuote: () => void }) {
  return (
    <section id="process" className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[#0a0a1a] to-background" />
      <div className="absolute top-0 left-0 right-0 section-divider" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold tracking-widest uppercase text-brand-hot-pink mb-4">How It Works</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Simple Process. <span className="gradient-brand-text">Stunning Results</span>.
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              From first call to finished install — we handle everything so you can focus on running your business.
            </p>
          </div>
        </FadeUp>

        {/* Desktop step flow */}
        <div className="hidden md:grid md:grid-cols-5 gap-4 relative">
          <div className="absolute top-12 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-brand-blue via-brand-purple to-brand-hot-pink opacity-30" />

          {PROCESS_STEPS.map((step, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <div className="relative text-center group">
                <div className="relative z-10 w-24 h-24 mx-auto rounded-2xl border border-white/10 bg-white/[0.03] flex flex-col items-center justify-center mb-4 group-hover:border-brand-purple/40 group-hover:bg-brand-purple/10 transition-all duration-300">
                  <span className="text-2xl font-black gradient-brand-text mb-1">{step.num}</span>
                  <step.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-white font-bold text-sm mb-1">{step.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{step.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* Mobile step flow */}
        <div className="md:hidden space-y-4">
          {PROCESS_STEPS.map((step, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <div className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                <div className="w-14 h-14 flex-shrink-0 rounded-xl gradient-brand flex items-center justify-center">
                  <span className="text-lg font-black text-white">{step.num}</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm mb-1">{step.title}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">{step.desc}</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={0.5}>
          <div className="mt-12 text-center">
            <button onClick={onQuote} className="cta-primary text-white font-bold px-8 py-3.5 rounded-xl text-sm tracking-wide inline-flex items-center gap-2">
              START WITH A FREE QUOTE <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ───────── 9. FINAL CTA ───────── */
function FinalCTASection({ onQuote }: { onQuote: () => void }) {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[#080818] to-background" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      {/* Intense glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-purple/15 rounded-full blur-[200px]" />
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-hot-pink/10 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <FadeUp>
          <Image src="/LOGO.png" alt="Imagine Studio Design" width={120} height={36} className="mx-auto h-10 w-auto object-contain mb-8 opacity-80" />
        </FadeUp>

        <FadeUp delay={0.1}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            Stop Being <span className="gradient-brand-text">Invisible</span> in Your Market.
          </h2>
        </FadeUp>

        <FadeUp delay={0.2}>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-4 leading-relaxed">
            Your competitors invested in their image. They&apos;re winning the customers you deserve. 
            The longer you wait, the more business you lose.
          </p>
        </FadeUp>

        <FadeUp delay={0.3}>
          <p className="text-white text-xl font-bold mb-10">
            Let&apos;s build a brand that makes your business <span className="gradient-brand-text">unstoppable</span>.
          </p>
        </FadeUp>

        <FadeUp delay={0.4}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <button onClick={onQuote} className="cta-primary text-white font-bold px-10 py-4 rounded-xl text-lg tracking-wide flex items-center gap-2 min-w-[280px] justify-center animate-pulse-glow">
              GET MY FREE QUOTE <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href="tel:+19105550123"
              className="flex items-center gap-2 px-6 py-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all text-sm font-semibold"
            >
              <Phone className="w-4 h-4" /> (910) 555-0123
            </a>
          </div>
        </FadeUp>

        <FadeUp delay={0.5}>
          <div className="flex flex-wrap items-center justify-center gap-4 text-gray-500 text-sm">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Fast Turnaround</span>
            <span className="text-white/10">|</span>
            <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> Quality Guaranteed</span>
            <span className="text-white/10">|</span>
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Wilmington, NC</span>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ───────── FOOTER ───────── */
function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-[#050510]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Image src="/LOGO.png" alt="Imagine Studio Design" width={120} height={36} className="h-8 w-auto object-contain opacity-70" />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            <a href="tel:+19105550123" className="hover:text-gray-300 transition-colors flex items-center gap-1">
              <Phone className="w-3 h-3" /> (910) 555-0123
            </a>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Wilmington, North Carolina
            </span>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-white/5 text-center text-xs text-gray-600">
          © {new Date().getFullYear()} Imagine Studio Design. All rights reserved. Business Visibility Company.
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
