"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, X } from "lucide-react";
import { useLang } from "@/lib/i18n";

const WHATSAPP_NUMBER = "19105474314";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

interface StickyCTAProps {
  onQuoteClick: () => void;
}

export default function StickyCTA({ onQuoteClick }: StickyCTAProps) {
  const { t, lang } = useLang();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    lang === "es"
      ? "👋 ¡Hola! Quiero información sobre sus servicios de diseño para mi negocio."
      : "👋 Hi! I'd like information about your design services for my business."
  )}`;

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
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-xl bg-[#25D366]/20 border border-[#25D366]/30 flex items-center justify-center flex-shrink-0"
              aria-label="WhatsApp"
            >
              <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
            </a>
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
  const { lang } = useLang();
  const [visible, setVisible] = useState(false);

  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    lang === "es"
      ? "👋 ¡Hola! Quiero información sobre sus servicios de diseño para mi negocio."
      : "👋 Hi! I'd like information about your design services for my business."
  )}`;

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
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 rounded-full bg-[#25D366]/20 border border-[#25D366]/30 flex items-center justify-center hover:bg-[#25D366]/30 transition-colors"
            aria-label="WhatsApp"
          >
            <WhatsAppIcon className="w-6 h-6 text-[#25D366]" />
          </a>
          <button
            onClick={onQuoteClick}
            className="w-14 h-14 rounded-full gradient-brand flex items-center justify-center animate-pulse-glow"
            aria-label="Get a quote"
          >
            <Phone className="w-6 h-6 text-white" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}