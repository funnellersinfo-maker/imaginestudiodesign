"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLang } from "@/lib/i18n";

const SLIDES = [
  {
    src: "/images/gallery-20250917_102801-web.jpg",
    altEn: "Professional vehicle wrap installation",
    altEs: "Instalación profesional de vinilo vehicular",
  },
  {
    src: "/images/gallery-IMG_0223-web.png",
    altEn: "Custom branded vehicle fleet",
    altEs: "Flota vehicular con marca personalizada",
  },
  {
    src: "/images/gallery-IMG_7721-web.png",
    altEn: "Commercial signage and branding project",
    altEs: "Proyecto de señalización y marca comercial",
  },
  {
    src: "/images/gallery-IMG_7809-web.png",
    altEn: "Eye-catching vehicle wrap design",
    altEs: "Diseño de vinilo vehicular llamativo",
  },
  {
    src: "/images/gallery-IMG_7991-web.JPG",
    altEn: "Finished wrap project on service vehicle",
    altEs: "Proyecto de vinilo terminado en vehículo de servicio",
  },
  {
    src: "/images/gallery-20230908_183945-web.jpg",
    altEn: "Detailed vehicle wrap craftsmanship",
    altEs: "Artesanía detallada de vinilo vehicular",
  },
  {
    src: "/images/gallery/IMG-20260203-WA0056.jpg",
    altEn: "Custom vehicle wrap showcase",
    altEs: "Muestra de vinilo vehicular personalizado",
  },
  {
    src: "/images/gallery/IMG-20260423-WA0071.jpg",
    altEn: "Branded commercial vehicle",
    altEs: "Vehículo comercial con marca",
  },
  {
    src: "/images/gallery/5c7d8526-4bf8-4bbf-b0bd-3518955db925.jpg",
    altEn: "Professional fleet branding",
    altEs: "Marca de flota profesional",
  },
  {
    src: "/images/gallery/20211018_115311.jpg",
    altEn: "Vehicle wrap transformation",
    altEs: "Transformación con vinilo vehicular",
  },
  {
    src: "/images/gallery/c7cfcce3-5233-44a6-85d0-bb0ec980e92b.jpg",
    altEn: "Custom business vehicle wrap",
    altEs: "Vinilo vehicular personalizado para negocios",
  },
  {
    src: "/images/gallery/IMG-20260423-WA0068.jpg",
    altEn: "Colorful insulated tumblers branded for the Wilmington Marathon event",
    altEs: "Vasos térmicos coloridos con marca del evento Wilmington Marathon",
  },
  {
    src: "/images/gallery/IMG-20260203-WA0050.jpg",
    altEn: "Baseball caps branded with Lucero Masonry Inc logos",
    altEs: "Gorras de béisbol con marca de Lucero Masonry Inc",
  },
  {
    src: "/images/gallery/IMG-20260203-WA0056.jpg",
    altEn: "Mannequin displaying Lucero Masonry t-shirt and branded baseball caps",
    altEs: "Maniquí con camiseta de Lucero Masonry y gorras con marca",
  },
  {
    src: "/images/gallery/IMG-20250924-WA0021.jpg",
    altEn: "Pink t-shirt with Run for the Ta Tas sponsor logos",
    altEs: "Camiseta rosada con logos de patrocinadores de Run for the Ta Tas",
  },
  {
    src: "/images/gallery/IMG-20250924-WA0025.jpg",
    altEn: "Pink t-shirt with breast cancer awareness branding on a mannequin",
    altEs: "Camiseta rosada con branding de conciencia sobre cáncer de mama en maniquí",
  },
  {
    src: "/images/gallery/IMG-20251021-WA0056.jpg",
    altEn: "White long-sleeve shirt with Brothers Painting Services logo",
    altEs: "Camiseta blanca de manga larga con logo de Brothers Painting Services",
  },
  {
    src: "/images/gallery/IMG-20251021-WA0058.jpg",
    altEn: "White long-sleeve shirts branded for Brothers Painting Services LLC",
    altEs: "Camisetas blancas de manga larga con marca de Brothers Painting Services LLC",
  },
  {
    src: "/images/gallery/IMG-20251118-WA0040.jpg",
    altEn: "Two hoodies displaying Kings Garage branding on a table",
    altEs: "Dos hoodies con marca de Kings Garage sobre una mesa",
  },
];

// Fisher-Yates shuffle (se ejecuta una sola vez al montar el componente)
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function GalleryCarousel() {
  const { lang, t } = useLang();
  // Shuffle inicial: cada carga muestra las 11 imágenes en orden aleatorio distinto
  const [slides] = useState(() => shuffle(SLIDES));
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const goTo = useCallback(
    (next: number) => {
      setDirection(next > current ? 1 : -1);
      setCurrent(next);
    },
    [current]
  );

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((c) => (c + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Auto-advance 9-12s random, pause on hover/touch
  useEffect(() => {
    if (isPaused) return;
    const delay = 9000 + Math.random() * 3000;
    timerRef.current = setTimeout(next, delay);
    return () => clearTimeout(timerRef.current);
  }, [current, isPaused, next]);

  const slide = slides[current];
  const alt = lang === "es" ? slide.altEs : slide.altEn;

  return (
    <section className="relative py-10 sm:py-14 lg:py-16 overflow-hidden">
      {/* Header text */}
      <div className="text-center mb-6 sm:mb-8 lg:mb-10 px-4 sm:px-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-white mb-2 lg:mb-3 leading-tight">
          {t("projects.headline")}
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">{t("projects.subline")}</p>
      </div>

      {/* Carousel container */}
      <div
        className="relative mx-auto w-full max-w-5xl lg:max-w-7xl px-2 sm:px-4 lg:px-6"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setTimeout(() => setIsPaused(false), 4000)}
      >
        {/* Main image with aspect ratio */}
        <div className="relative w-full aspect-[3/2] sm:aspect-[16/9] lg:aspect-[21/9] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-brand-purple/10">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current}
              initial={{ opacity: 0, scale: 1.08, x: direction * 60 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, x: direction * -60 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={slide.src}
                alt={alt}
                fill
                priority={current === 0}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 92vw, 1152px"
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>

          {/* Gradient overlays for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10 pointer-events-none" />

          {/* Counter dots */}
          <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center max-w-[90%]">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`transition-all duration-500 rounded-full ${
                  i === current
                    ? "w-6 sm:w-8 h-2 sm:h-2.5 gradient-brand"
                    : "w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Slide counter */}
          <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/10">
            <span className="text-xs font-bold text-white/70">
              {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </span>
          </div>

          {/* Left arrow */}
          <button
            onClick={prev}
            className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/50 hover:border-white/20 transition-all duration-300 group"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          {/* Right arrow */}
          <button
            onClick={next}
            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/50 hover:border-white/20 transition-all duration-300 group"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}