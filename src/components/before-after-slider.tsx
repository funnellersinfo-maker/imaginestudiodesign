"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { useLang } from "@/lib/i18n";

interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt?: string;
  afterAlt?: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export default function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt = "Before",
  afterAlt = "After",
  beforeLabel,
  afterLabel,
}: BeforeAfterSliderProps) {
  const { t } = useLang();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [sliderPos, setSliderPos] = useState(50); // percentage
  const [isDragging, setIsDragging] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Track container width
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setContainerWidth(el.offsetWidth);
    const observer = new ResizeObserver(() => setContainerWidth(el.offsetWidth));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Calculate position from pointer event
  const getPositionFromEvent = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!containerRef.current) return 50;
      const rect = containerRef.current.getBoundingClientRect();
      let clientX: number;

      if ("touches" in e) {
        clientX = e.touches[0].clientX;
      } else {
        clientX = e.clientX;
      }

      const x = clientX - rect.left;
      const percent = (x / rect.width) * 100;
      return Math.max(2, Math.min(98, percent));
    },
    []
  );

  const handleStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      setIsDragging(true);
      setSliderPos(getPositionFromEvent(e));
    },
    [getPositionFromEvent]
  );

  const handleMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      setSliderPos(getPositionFromEvent(e));
    },
    [isDragging, getPositionFromEvent]
  );

  const handleEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Global mouse/touch up listener
  useEffect(() => {
    const onUp = () => setIsDragging(false);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, []);

  const bLabel = beforeLabel || t("slider.before");
  const aLabel = afterLabel || t("slider.after");

  return (
    <div
      ref={containerRef}
      className={`relative w-full select-none rounded-2xl overflow-hidden border border-white/10 glow-brand aspect-[4/3] sm:aspect-[16/10] md:aspect-[2/1] ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      onMouseDown={handleStart}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
    >
      {/* AFTER image (full width, behind) */}
      <Image
        src={afterSrc}
        alt={afterAlt}
        fill
        className={`object-cover transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
        priority
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1100px"
      />

      {/* BEFORE image (clipped by slider) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPos}%` }}
      >
        <div
          className="relative"
          style={{ width: containerWidth ? `${containerWidth}px` : "100%", minWidth: "100vw", height: "100%" }}
        >
          <Image
            src={beforeSrc}
            alt={beforeAlt}
            fill
            className={`object-cover transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1100px"
          />
        </div>
      </div>

      {/* Slider line */}
      <div
        className="absolute top-0 bottom-0 w-[3px] z-20"
        style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
      >
        {/* Glow line */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-purple via-white to-brand-magenta shadow-[0_0_12px_rgba(106,61,255,0.6),0_0_24px_rgba(230,29,140,0.3)]" />
      </div>

      {/* Slider handle */}
      <div
        className="absolute top-1/2 z-20 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border-2 border-white/30 shadow-lg flex items-center justify-center gap-1 hover:scale-110 transition-transform duration-200"
        style={{ left: `${sliderPos}%` }}
      >
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12M13 17l5-5m0 0l-5-5m5 5H7" />
        </svg>
      </div>

      {/* Labels */}
      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-gray-900/80 backdrop-blur-sm border border-white/10">
        <span className="text-[10px] sm:text-xs font-bold text-gray-300 uppercase tracking-wider">{bLabel}</span>
      </div>
      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-gray-900/80 backdrop-blur-sm border border-white/10">
        <span className="text-[10px] sm:text-xs font-bold text-gray-300 uppercase tracking-wider">{aLabel}</span>
      </div>

      {/* Instruction hint */}
      <div className={`absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-10 px-3 py-1.5 rounded-full bg-gray-900/70 backdrop-blur-sm border border-white/10 transition-opacity duration-1000 ${isDragging ? "opacity-0" : "opacity-100"}`}>
        <span className="text-[10px] sm:text-xs text-gray-400">{t("slider.hint")}</span>
      </div>
    </div>
  );
}
