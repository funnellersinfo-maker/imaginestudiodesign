"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Sparkles } from "lucide-react";
import { useLang } from "@/lib/i18n";

interface ExitIntentPopupProps {
  onQuote: () => void;
}

const INACTIVITY_MS = 3 * 60 * 1000; // 3 minutos
const MOUSE_TOP_THRESHOLD = 8; // px desde el top
const STORAGE_KEY = "isd-exit-popup-shown";

export default function ExitIntentPopup({ onQuote }: ExitIntentPopupProps) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // No mostrar si ya se mostró en esta sesión
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    let inactivityTimer: ReturnType<typeof setTimeout>;
    let shown = false;

    const trigger = (reason: string) => {
      if (shown) return;
      shown = true;
      sessionStorage.setItem(STORAGE_KEY, "1");
      setOpen(true);
      console.log(`[ExitIntentPopup] triggered by ${reason}`);
      cleanup();
    };

    // Reset timer en cualquier actividad
    const resetInactivity = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => trigger("inactivity"), INACTIVITY_MS);
    };

    // Exit-intent estándar: mouse sale por el top de la ventana (relatedTarget null)
    const handleMouseOut = (e: MouseEvent) => {
      // Solo dispara si el mouse sale de la ventana (relatedTarget es null)
      // y clientY es negativo o muy pequeño (saliendo por arriba)
      if (e.relatedTarget === null && e.clientY <= MOUSE_TOP_THRESHOLD) {
        trigger("exit-intent-top");
      }
    };

    const cleanup = () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener("mousemove", resetInactivity);
      window.removeEventListener("scroll", resetInactivity);
      window.removeEventListener("keydown", resetInactivity);
      window.removeEventListener("touchstart", resetInactivity);
      document.removeEventListener("mouseout", handleMouseOut);
    };

    // Iniciar timer de inactividad
    resetInactivity();

    // Solo activar exit-intent en desktop (mouse)
    if (window.matchMedia("(min-width: 768px)").matches) {
      document.addEventListener("mouseout", handleMouseOut);
    }

    // Actividad resetea el timer
    window.addEventListener("mousemove", resetInactivity);
    window.addEventListener("scroll", resetInactivity);
    window.addEventListener("keydown", resetInactivity);
    window.addEventListener("touchstart", resetInactivity);

    return cleanup;
  }, []);

  const handleClose = () => setOpen(false);
  const handleQuote = () => {
    setOpen(false);
    onQuote();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md glass-strong rounded-2xl border border-brand-purple/30 p-6 sm:p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>

            {/* Icon */}
            <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-brand flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>

            {/* Headline */}
            <h3 className="text-2xl sm:text-3xl font-black text-white mb-2 leading-tight">
              {t("exit.title")}
            </h3>

            {/* Subtitle */}
            <p className="text-gray-300 text-sm sm:text-base mb-5 leading-relaxed">
              {t("exit.subtitle")}
            </p>

            {/* Trust badge */}
            <div className="flex items-center justify-center gap-2 mb-5 text-xs text-gray-400">
              <Clock className="w-3.5 h-3.5 text-brand-hot-pink" />
              <span>{t("exit.trust")}</span>
            </div>

            {/* CTA button */}
            <button
              onClick={handleQuote}
              className="w-full cta-primary text-white font-bold py-3.5 rounded-xl text-sm sm:text-base tracking-wide flex items-center justify-center gap-2 mb-3"
            >
              {t("exit.cta")}
            </button>

            {/* Dismiss link */}
            <button
              onClick={handleClose}
              className="text-xs text-gray-500 hover:text-gray-400 transition-colors"
            >
              {t("exit.dismiss")}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
