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
import { Phone, Building2, User, Mail, MessageSquare, CheckCircle2, Loader2 } from "lucide-react";

const BUSINESS_TYPES = [
  "Contractor / General Construction",
  "Roofing",
  "HVAC",
  "Plumbing",
  "Electrical",
  "Landscaping",
  "Painting",
  "Tree Service",
  "Concrete / Masonry",
  "Restaurant / Food Service",
  "Retail Store",
  "Other Service Business",
  "Other",
];

interface QuoteFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source?: string;
}

export default function QuoteFormModal({ open, onOpenChange, source = "website" }: QuoteFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    businessType: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim() || !formData.phone.trim() || !formData.businessType) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, source }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setIsSuccess(true);
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({ name: "", phone: "", businessType: "", email: "", message: "" });
    setIsSuccess(false);
    setError("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleReset(); else onOpenChange(true); }}>
      <DialogContent className="glass-strong sm:max-w-md p-0 overflow-hidden">
        <div className="relative">
          {/* Header gradient bar */}
          <div className="h-1.5 gradient-brand" />

          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="p-8 text-center"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full gradient-brand flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Request Received!</h3>
                <p className="text-gray-300 mb-6">
                  We&apos;ll review your project and contact you within 24 hours with a custom quote.
                </p>
                <button
                  onClick={handleReset}
                  className="cta-primary text-white font-bold px-8 py-3 rounded-xl text-sm tracking-wide"
                >
                  CLOSE
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <DialogHeader className="p-6 pb-0">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-lg gradient-brand flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <DialogTitle className="text-xl font-bold text-white">
                        Get Your Free Quote
                      </DialogTitle>
                      <DialogDescription className="text-gray-400 text-sm">
                        Tell us about your business — we&apos;ll make it look amazing.
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-4">
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-2">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="quote-name" className="text-gray-300 text-sm font-medium">
                      Full Name *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        id="quote-name"
                        placeholder="John Smith"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-brand-purple/50 focus:ring-brand-purple/20"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quote-phone" className="text-gray-300 text-sm font-medium">
                      Phone Number *
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        id="quote-phone"
                        placeholder="(910) 555-0123"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-brand-purple/50 focus:ring-brand-purple/20"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quote-business" className="text-gray-300 text-sm font-medium">
                      Business Type *
                    </Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 z-10" />
                      <Select
                        value={formData.businessType}
                        onValueChange={(v) => setFormData({ ...formData, businessType: v })}
                      >
                        <SelectTrigger className="pl-10 w-full bg-white/5 border-white/10 text-white data-[placeholder]:text-gray-600 focus:border-brand-purple/50 focus:ring-brand-purple/20">
                          <SelectValue placeholder="Select your industry..." />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0c0c1e] border-white/10">
                          {BUSINESS_TYPES.map((type) => (
                            <SelectItem
                              key={type}
                              value={type}
                              className="text-gray-300 focus:text-white focus:bg-white/10"
                            >
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quote-email" className="text-gray-300 text-sm font-medium">
                      Email (Optional)
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        id="quote-email"
                        placeholder="john@company.com"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-brand-purple/50 focus:ring-brand-purple/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quote-message" className="text-gray-300 text-sm font-medium">
                      Project Details (Optional)
                    </Label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                      <Textarea
                        id="quote-message"
                        placeholder="Tell us about your project — vehicle wraps, fleet branding, signage, etc."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-brand-purple/50 focus:ring-brand-purple/20 min-h-[80px]"
                        rows={3}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full cta-primary text-white font-bold py-3.5 rounded-xl text-sm tracking-wide flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "GET MY FREE QUOTE →"
                    )}
                  </button>

                  <p className="text-center text-gray-500 text-xs">
                    No spam. No obligation. Just a real quote for your business.
                  </p>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
