"use client";

import { motion } from "framer-motion";

export type ElType = "vinyl-strip" | "car-silhouette" | "sparkle" | "color-swatch" | "curve" | "ring" | "hexagon" | "gradient-bar" | "diamond";

export interface FloatEl {
  type: ElType;
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  rotate: number;
  duration: number;
  delay: number;
  drift: number;
  rotSpeed: number;
}

/* SVG element renderers */
function VinylStripSVG({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size * 0.45} viewBox="0 0 100 45" fill="none">
      <path d="M2 38C15 30 30 10 50 8C70 6 85 20 98 15" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <path d="M2 38C15 30 30 10 50 8C70 6 85 20 98 15" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.3" strokeDasharray="4 6" transform="translate(2,3)" />
      <circle cx="98" cy="15" r="2" fill={color} opacity="0.5" />
    </svg>
  );
}

function CarSilhouetteSVG({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size * 0.4} viewBox="0 0 120 48" fill="none">
      <path d="M10 36 L10 28 L22 16 L40 10 L75 10 L95 20 L110 28 L110 36" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
      <circle cx="28" cy="36" r="5" stroke={color} strokeWidth="1.5" opacity="0.4" />
      <circle cx="92" cy="36" r="5" stroke={color} strokeWidth="1.5" opacity="0.4" />
      <line x1="45" y1="10" x2="45" y2="20" stroke={color} strokeWidth="1" opacity="0.3" />
      <line x1="70" y1="10" x2="70" y2="20" stroke={color} strokeWidth="1" opacity="0.3" />
    </svg>
  );
}

function SparkleSVG({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path d="M20 2 L22 16 L36 20 L22 24 L20 38 L18 24 L4 20 L18 16 Z" fill={color} opacity="0.6" />
      <path d="M20 8 L21 17 L30 20 L21 23 L20 32 L19 23 L10 20 L19 17 Z" fill={color} opacity="0.3" />
    </svg>
  );
}

function ColorSwatchSVG({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 30 18" fill="none">
      <rect x="1" y="1" width="28" height="16" rx="3" stroke={color} strokeWidth="1.2" opacity="0.4" />
      <rect x="4" y="4" width="22" height="10" rx="2" fill={color} opacity="0.15" />
      <line x1="10" y1="4" x2="10" y2="14" stroke={color} strokeWidth="0.5" opacity="0.3" />
      <line x1="20" y1="4" x2="20" y2="14" stroke={color} strokeWidth="0.5" opacity="0.3" />
    </svg>
  );
}

function CurveSVG({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size * 0.5} viewBox="0 0 80 40" fill="none">
      <path d="M2 35 C20 5, 60 5, 78 35" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.35" />
      <path d="M15 35 C28 12, 52 12, 65 35" stroke={color} strokeWidth="0.8" strokeLinecap="round" opacity="0.2" strokeDasharray="3 4" />
    </svg>
  );
}

function RingSVG({ color, size }: { color: string; size: number }) {
  const r = size * 0.4;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r={r} stroke={color} strokeWidth="1" opacity="0.3" />
      <circle cx="20" cy="20" r={r * 0.6} stroke={color} strokeWidth="0.6" opacity="0.15" strokeDasharray="2 3" />
    </svg>
  );
}

function HexagonSVG({ color, size }: { color: string; size: number }) {
  const r = size * 0.42;
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    return `${20 + r * Math.cos(a)},${20 + r * Math.sin(a)}`;
  }).join(" ");
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <polygon points={pts} stroke={color} strokeWidth="1" opacity="0.3" />
    </svg>
  );
}

function GradientBarSVG({ color, size }: { color: string; size: number }) {
  const uid = color.replace("#", "") + size;
  return (
    <svg width={size * 1.5} height={size * 0.15} viewBox="0 0 60 6" fill="none">
      <defs>
        <linearGradient id={`gb-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity="0.5" />
          <stop offset="50%" stopColor={color} stopOpacity="0.1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <rect x="0" y="1" width="60" height="4" rx="2" fill={`url(#gb-${uid})`} />
    </svg>
  );
}

function DiamondSVG({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 24 30" fill="none">
      <path d="M12 2 L22 12 L12 28 L2 12 Z" stroke={color} strokeWidth="1" opacity="0.35" />
      <path d="M12 8 L17 12 L12 22 L7 12 Z" fill={color} opacity="0.08" />
    </svg>
  );
}

function renderElement(el: FloatEl) {
  const props = { color: el.color, size: el.size };
  switch (el.type) {
    case "vinyl-strip": return <VinylStripSVG {...props} />;
    case "car-silhouette": return <CarSilhouetteSVG {...props} />;
    case "sparkle": return <SparkleSVG {...props} />;
    case "color-swatch": return <ColorSwatchSVG {...props} />;
    case "curve": return <CurveSVG {...props} />;
    case "ring": return <RingSVG {...props} />;
    case "hexagon": return <HexagonSVG {...props} />;
    case "gradient-bar": return <GradientBarSVG {...props} />;
    case "diamond": return <DiamondSVG {...props} />;
  }
}

/* Section-specific element configurations */
export const HERO_ELEMENTS: FloatEl[] = [
  { type: "car-silhouette", x: 5, y: 12, size: 90, color: "#6A3DFF", opacity: 0.08, rotate: -5, duration: 22, delay: 0, drift: 18, rotSpeed: 3 },
  { type: "vinyl-strip", x: 75, y: 8, size: 80, color: "#E71D8C", opacity: 0.1, rotate: 12, duration: 18, delay: 2, drift: 22, rotSpeed: -2 },
  { type: "sparkle", x: 15, y: 70, size: 30, color: "#2D7FE0", opacity: 0.25, rotate: 0, duration: 14, delay: 1, drift: 15, rotSpeed: 45 },
  { type: "sparkle", x: 85, y: 75, size: 22, color: "#6A3DFF", opacity: 0.2, rotate: 15, duration: 16, delay: 4, drift: 12, rotSpeed: -30 },
  { type: "curve", x: 60, y: 20, size: 100, color: "#C62285", opacity: 0.08, rotate: -8, duration: 26, delay: 3, drift: 20, rotSpeed: 2 },
  { type: "ring", x: 90, y: 40, size: 50, color: "#2D7FE0", opacity: 0.1, rotate: 0, duration: 20, delay: 1, drift: 25, rotSpeed: 10 },
  { type: "gradient-bar", x: 10, y: 45, size: 30, color: "#E71D8C", opacity: 0.15, rotate: 15, duration: 24, delay: 5, drift: 10, rotSpeed: -1 },
  { type: "hexagon", x: 45, y: 85, size: 40, color: "#6A3DFF", opacity: 0.07, rotate: 0, duration: 28, delay: 2, drift: 16, rotSpeed: 15 },
  { type: "color-swatch", x: 70, y: 60, size: 28, color: "#2D7FE0", opacity: 0.12, rotate: -10, duration: 19, delay: 6, drift: 14, rotSpeed: -5 },
  { type: "diamond", x: 30, y: 15, size: 25, color: "#C62285", opacity: 0.15, rotate: 0, duration: 16, delay: 3, drift: 20, rotSpeed: 20 },
  { type: "vinyl-strip", x: 20, y: 88, size: 60, color: "#6A3DFF", opacity: 0.06, rotate: -15, duration: 30, delay: 4, drift: 12, rotSpeed: 4 },
  { type: "sparkle", x: 55, y: 5, size: 18, color: "#E71D8C", opacity: 0.3, rotate: 0, duration: 12, delay: 0, drift: 10, rotSpeed: 60 },
];

export const PROBLEM_ELEMENTS: FloatEl[] = [
  { type: "vinyl-strip", x: 8, y: 15, size: 70, color: "#E71D8C", opacity: 0.08, rotate: 8, duration: 24, delay: 0, drift: 20, rotSpeed: -3 },
  { type: "ring", x: 85, y: 20, size: 55, color: "#6A3DFF", opacity: 0.1, rotate: 0, duration: 20, delay: 2, drift: 18, rotSpeed: 12 },
  { type: "sparkle", x: 20, y: 75, size: 25, color: "#C62285", opacity: 0.2, rotate: 0, duration: 15, delay: 1, drift: 14, rotSpeed: 40 },
  { type: "hexagon", x: 75, y: 70, size: 35, color: "#2D7FE0", opacity: 0.08, rotate: 30, duration: 26, delay: 4, drift: 16, rotSpeed: -10 },
  { type: "curve", x: 50, y: 10, size: 80, color: "#6A3DFF", opacity: 0.07, rotate: 5, duration: 22, delay: 3, drift: 22, rotSpeed: 2 },
  { type: "gradient-bar", x: 90, y: 85, size: 25, color: "#E71D8C", opacity: 0.12, rotate: -20, duration: 18, delay: 5, drift: 10, rotSpeed: 1 },
];

export const TRANSFORM_ELEMENTS: FloatEl[] = [
  { type: "car-silhouette", x: 80, y: 10, size: 100, color: "#6A3DFF", opacity: 0.07, rotate: 3, duration: 25, delay: 0, drift: 20, rotSpeed: -2 },
  { type: "vinyl-strip", x: 5, y: 25, size: 90, color: "#2D7FE0", opacity: 0.08, rotate: -12, duration: 20, delay: 2, drift: 18, rotSpeed: 3 },
  { type: "sparkle", x: 40, y: 80, size: 28, color: "#E71D8C", opacity: 0.22, rotate: 0, duration: 14, delay: 1, drift: 16, rotSpeed: 50 },
  { type: "diamond", x: 15, y: 70, size: 30, color: "#6A3DFF", opacity: 0.12, rotate: 0, duration: 18, delay: 3, drift: 14, rotSpeed: 25 },
  { type: "color-swatch", x: 65, y: 50, size: 32, color: "#C62285", opacity: 0.1, rotate: 20, duration: 22, delay: 5, drift: 12, rotSpeed: -4 },
  { type: "ring", x: 50, y: 15, size: 45, color: "#E71D8C", opacity: 0.08, rotate: 0, duration: 24, delay: 1, drift: 20, rotSpeed: 8 },
  { type: "hexagon", x: 25, y: 40, size: 38, color: "#2D7FE0", opacity: 0.07, rotate: 15, duration: 28, delay: 4, drift: 18, rotSpeed: -12 },
  { type: "gradient-bar", x: 85, y: 80, size: 28, color: "#6A3DFF", opacity: 0.14, rotate: 10, duration: 19, delay: 6, drift: 10, rotSpeed: -2 },
];

export const VISIBILITY_ELEMENTS: FloatEl[] = [
  { type: "vinyl-strip", x: 12, y: 20, size: 75, color: "#6A3DFF", opacity: 0.07, rotate: 10, duration: 23, delay: 0, drift: 18, rotSpeed: -2 },
  { type: "sparkle", x: 80, y: 15, size: 24, color: "#C62285", opacity: 0.2, rotate: 0, duration: 13, delay: 2, drift: 14, rotSpeed: 55 },
  { type: "car-silhouette", x: 70, y: 80, size: 80, color: "#2D7FE0", opacity: 0.06, rotate: -4, duration: 26, delay: 1, drift: 16, rotSpeed: 3 },
  { type: "curve", x: 40, y: 85, size: 90, color: "#E71D8C", opacity: 0.07, rotate: -6, duration: 21, delay: 4, drift: 20, rotSpeed: 2 },
  { type: "ring", x: 88, y: 50, size: 48, color: "#6A3DFF", opacity: 0.09, rotate: 0, duration: 19, delay: 3, drift: 22, rotSpeed: -10 },
  { type: "hexagon", x: 8, y: 75, size: 32, color: "#C62285", opacity: 0.08, rotate: 20, duration: 25, delay: 5, drift: 14, rotSpeed: 8 },
];

export const FINAL_CTA_ELEMENTS: FloatEl[] = [
  { type: "car-silhouette", x: 5, y: 15, size: 110, color: "#6A3DFF", opacity: 0.07, rotate: -3, duration: 24, delay: 0, drift: 22, rotSpeed: 2 },
  { type: "vinyl-strip", x: 80, y: 10, size: 85, color: "#E71D8C", opacity: 0.09, rotate: 15, duration: 20, delay: 1, drift: 20, rotSpeed: -3 },
  { type: "sparkle", x: 25, y: 70, size: 32, color: "#2D7FE0", opacity: 0.25, rotate: 0, duration: 12, delay: 0, drift: 16, rotSpeed: 60 },
  { type: "sparkle", x: 70, y: 65, size: 24, color: "#E71D8C", opacity: 0.2, rotate: 0, duration: 15, delay: 3, drift: 12, rotSpeed: -45 },
  { type: "diamond", x: 90, y: 30, size: 28, color: "#C62285", opacity: 0.12, rotate: 0, duration: 18, delay: 2, drift: 18, rotSpeed: 20 },
  { type: "ring", x: 15, y: 40, size: 55, color: "#6A3DFF", opacity: 0.08, rotate: 0, duration: 22, delay: 4, drift: 20, rotSpeed: 10 },
  { type: "curve", x: 55, y: 85, size: 100, color: "#2D7FE0", opacity: 0.07, rotate: -5, duration: 28, delay: 2, drift: 22, rotSpeed: -2 },
  { type: "color-swatch", x: 40, y: 10, size: 30, color: "#E71D8C", opacity: 0.1, rotate: -15, duration: 20, delay: 5, drift: 14, rotSpeed: 4 },
  { type: "gradient-bar", x: 60, y: 50, size: 35, color: "#6A3DFF", opacity: 0.15, rotate: 8, duration: 24, delay: 3, drift: 10, rotSpeed: -1 },
  { type: "hexagon", x: 85, y: 80, size: 42, color: "#C62285", opacity: 0.08, rotate: 10, duration: 26, delay: 6, drift: 16, rotSpeed: -8 },
];

export default function FloatingElements({ elements }: { elements: FloatEl[] }) {
  return (
    <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden">
      {elements.map((el, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${el.x}%`,
            top: `${el.y}%`,
            opacity: el.opacity,
            rotate: el.rotate,
          }}
          animate={{
            y: [0, -el.drift, el.drift * 0.5, 0],
            x: [0, el.drift * 0.3, -el.drift * 0.2, 0],
            rotate: el.rotate + el.rotSpeed,
            opacity: [el.opacity, el.opacity * 1.4, el.opacity * 0.6, el.opacity],
          }}
          transition={{
            duration: el.duration,
            delay: el.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {renderElement(el)}
        </motion.div>
      ))}
    </div>
  );
}