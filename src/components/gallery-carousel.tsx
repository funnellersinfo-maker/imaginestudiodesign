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
];

export default function GalleryCarousel() {
  const { lang } = useLang();
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
    setCurrent((c) => (c + 1) % SLIDES.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  // Auto-advance 9-12s random, pause on hover/touch
  useEffect(() => {
    if (isPaused) return;
    const delay = 9000 + Math.random() * 3000;
    timerRef.current = setTimeout(next, delay);
    return () => clearTimeout(timerRef.current);
  }, [current, isPaused, next]);

  const slide = SLIDES[current];
  const alt = lang === "es" ? slide.altEs : slide.altEn;

  return (
    <section className="relative py-10 sm:py-14 md:py-0 overflow-hidden">
      {/* Carousel container */}
      <div
        className="relative mx-auto w-full max-w-5xl lg:max-w-6xl px-2 sm:px-4"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setTimeout(() => setIsPaused(false), 4000)}
      >
        {/* Main image with aspect ratio */}
        <div className="relative w-full aspect-[3/2] sm:aspect-[16/9] md:aspect-[2/1] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-brand-purple/10">
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
          <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2">
            {SLIDES.map((_, i) => (
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
              {String(current + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
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