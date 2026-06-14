"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Phone, Building2, User, Mail, MessageSquare, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { useLang } from "@/lib/i18n";

const BIZ_KEYS = [
  "biz.contractor", "biz.roofing", "biz.hvac", "biz.plumbing", "biz.electrical",
  "biz.landscaping", "biz.painting", "biz.tree", "biz.concrete",
  "biz.restaurant", "biz.retail", "biz.otherService", "biz.other",
];

const WHATSAPP_NUMBER = "19105474314";

function buildWhatsAppURL(data: { name: string; phone: string; businessType: string; email: string; message: string }, lang: "en" | "es"): string {
  let text: string;
  if (lang === "es") {
    text = `👋 *¡Hola! Quiero una cotización para mi negocio.*

👤 *Nombre:* ${data.name}
📞 *Teléfono:* ${data.phone}
🏢 *Tipo de negocio:* ${data.businessType}${data.email ? `\n📧 *Email:* ${data.email}` : ""}${data.message ? `\n💬 *Mensaje:* ${data.message}` : ""}

📍 *Fuente:* Página web Imagine Studio Design`;
  } else {
    text = `👋 *Hi! I'd like a quote for my business.*

👤 *Name:* ${data.name}
📞 *Phone:* ${data.phone}
🏢 *Business Type:* ${data.businessType}${data.email ? `\n📧 *Email:* ${data.email}` : ""}${data.message ? `\n💬 *Message:* ${data.message}` : ""}

📍 *Source:* Imagine Studio Design Website`;
  }
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

interface QuoteFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function QuoteFormModal({ open, onOpenChange }: QuoteFormModalProps) {
  const { t, lang } = useLang();
  const [formData, setFormData] = useState({ name: "", phone: "", businessType: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!formData.name.trim() || !formData.phone.trim() || !formData.businessType) {
      setError(t("quote.nameRequired"));
      return;
    }
    setIsSubmitting(true);

    // Build WhatsApp URL with personalized message
    const waURL = buildWhatsAppURL(formData, lang);

    // Show success briefly, then redirect to WhatsApp
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        window.open(waURL, "_blank", "noopener,noreferrer");
      }, 800);
    }, 400);
  };

  const handleReset = () => {
    setFormData({ name: "", phone: "", businessType: "", email: "", message: "" });
    setIsSuccess(false); setError(""); onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleReset(); else onOpenChange(true); }}>
      <DialogContent className="glass-strong sm:max-w-md p-0 overflow-hidden">
        <div className="relative">
          <div className="h-1.5 gradient-brand" />
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#25D366]/20 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-[#25D366]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{lang === "es" ? "¡Abriendo WhatsApp!" : "Opening WhatsApp!"}</h3>
                <p className="text-gray-300 mb-6">{lang === "es" ? "Tu mensaje personalizado se está enviando..." : "Your personalized message is being sent..."}</p>
                <div className="flex items-center justify-center gap-2 text-[#25D366] text-sm">
                  <ArrowRight className="w-4 h-4 animate-pulse" />
                  {lang === "es" ? "Redirigiendo a WhatsApp..." : "Redirecting to WhatsApp..."}
                </div>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <DialogHeader className="p-6 pb-0">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-lg gradient-brand flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <DialogTitle className="text-xl font-bold text-white">{t("quote.title")}</DialogTitle>
                      <DialogDescription className="text-gray-400 text-sm">{t("quote.subtitle")}</DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-4">
                  {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-2">{error}</div>}
                  <div className="space-y-2">
                    <Label htmlFor="quote-name" className="text-gray-300 text-sm font-medium">{t("quote.name")}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input id="quote-name" placeholder={t("quote.namePlaceholder")} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-brand-purple/50 focus:ring-brand-purple/20" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quote-phone" className="text-gray-300 text-sm font-medium">{t("quote.phone")}</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input id="quote-phone" placeholder={t("quote.phonePlaceholder")} type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-brand-purple/50 focus:ring-brand-purple/20" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quote-business" className="text-gray-300 text-sm font-medium">{t("quote.business")}</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 z-10" />
                      <Select value={formData.businessType} onValueChange={(v) => setFormData({ ...formData, businessType: v })}>
                        <SelectTrigger className="pl-10 w-full bg-white/5 border-white/10 text-white data-[placeholder]:text-gray-600 focus:border-brand-purple/50 focus:ring-brand-purple/20">
                          <SelectValue placeholder={t("quote.businessPlaceholder")} />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0c0c1e] border-white/10">
                          {BIZ_KEYS.map((key) => (
                            <SelectItem key={key} value={t(key)} className="text-gray-300 focus:text-white focus:bg-white/10">{t(key)}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quote-email" className="text-gray-300 text-sm font-medium">{t("quote.email")}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input id="quote-email" placeholder={t("quote.emailPlaceholder")} type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-brand-purple/50 focus:ring-brand-purple/20" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quote-message" className="text-gray-300 text-sm font-medium">{t("quote.details")}</Label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                      <Textarea id="quote-message" placeholder={t("quote.detailsPlaceholder")} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-brand-purple/50 focus:ring-brand-purple/20 min-h-[80px]" rows={3} />
                    </div>
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full cta-primary text-white font-bold py-3.5 rounded-xl text-sm tracking-wide flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                    {isSubmitting ? (<><Loader2 className="w-4 h-4 animate-spin" />{t("quote.submitting")}</>) : t("quote.submit")}
                  </button>
                  <p className="text-center text-gray-500 text-xs">{t("quote.noSpam")}</p>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}