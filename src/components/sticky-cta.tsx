"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MessageCircle, X } from "lucide-react";
import { useLang } from "@/lib/i18n";

interface StickyCTAProps {
  onQuoteClick: () => void;
}

export default function StickyCTA({ onQuoteClick }: StickyCTAProps) {
  const { t } = useLang();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (dismissed) return;
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dismissed]);

  return (
    <AnimatePresence>
      {visible && !dismissed && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        >
          <div className="glass-strong border-t border-white/10 px-4 py-3 flex items-center gap-3">
            <button
              onClick={onQuoteClick}
              className="flex-1 cta-primary text-white font-bold py-3 rounded-xl text-sm tracking-wide flex items-center justify-center gap-2"
            >
              {t("sticky.cta")}
            </button>
            <a
              href="tel:+19105474314"
              className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0"
              aria-label="Call us"
            >
              <Phone className="w-5 h-5 text-emerald-400" />
            </a>
            <button
              onClick={() => setDismissed(true)}
              className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* Desktop floating CTA */
export function FloatingCTA({ onQuoteClick }: { onQuoteClick: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="hidden md:flex fixed bottom-6 right-6 z-50 flex-col gap-3"
        >
          <a
            href="tel:+19105474314"
            className="w-14 h-14 rounded-full bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center hover:bg-emerald-600/30 transition-colors glow-brand-sm"
            aria-label="Call us"
          >
            <Phone className="w-6 h-6 text-emerald-400" />
          </a>
          <button
            onClick={onQuoteClick}
            className="w-14 h-14 rounded-full gradient-brand flex items-center justify-center animate-pulse-glow"
            aria-label="Get a quote"
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
