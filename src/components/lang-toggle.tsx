"use client";

import { useLang } from "@/lib/i18n";
import { motion } from "framer-motion";
import { Languages } from "lucide-react";

export default function LangToggle() {
  const { lang, toggle } = useLang();

  return (
    <div className="fixed top-[88px] right-3 z-50 lg:top-[92px] lg:right-6">
      <button
        onClick={toggle}
        className="group flex items-center gap-2 px-3 py-2 rounded-full glass-strong hover:bg-white/10 transition-all duration-300 cursor-pointer"
        aria-label={lang === "en" ? "Cambiar a Español" : "Switch to English"}
      >
        <Languages className="w-4 h-4 text-brand-purple" />
        {/* Toggle track */}
        <div className="relative w-10 h-[22px] rounded-full bg-white/10 border border-white/10 overflow-hidden flex-shrink-0">
          <motion.div
            className="absolute top-[2px] left-[2px] w-[16px] h-[16px] rounded-full gradient-brand shadow-md"
            animate={{ x: lang === "es" ? 16 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </div>
        {/* Labels */}
        <span className={`text-xs font-bold transition-colors duration-200 ${lang === "en" ? "text-white" : "text-gray-500"}`}>
          EN
        </span>
        <span className={`text-[10px] text-gray-600`}>/</span>
        <span className={`text-xs font-bold transition-colors duration-200 ${lang === "es" ? "text-white" : "text-gray-500"}`}>
          ES
        </span>
      </button>
    </div>
  );
}
