"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { submitContactForm } from "@/actions/contact.actions";
import { toast } from "@/components/ui/toast";

export function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Check if already shown this session
    if (sessionStorage.getItem("exit-popup-shown")) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !dismissed) {
        setIsVisible(true);
        sessionStorage.setItem("exit-popup-shown", "1");
      }
    };

    // Also trigger after 30 seconds on mobile
    const timer = setTimeout(() => {
      if (!dismissed && !sessionStorage.getItem("exit-popup-shown")) {
        setIsVisible(true);
        sessionStorage.setItem("exit-popup-shown", "1");
      }
    }, 30000);

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      clearTimeout(timer);
    };
  }, [dismissed]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!phone) return;
    setSubmitting(true);

    const result = await submitContactForm({
      name: "Lead",
      phone,
      source: "exit-popup",
    });

    setSubmitting(false);

    if (result.success) {
      toast("We'll call you back within 2 hours! 🎉", { type: "success" } as Parameters<typeof toast>[1]);
      setIsVisible(false);
      setDismissed(true);
    } else {
      toast("Failed to submit. Please try WhatsApp.", { type: "error" } as Parameters<typeof toast>[1]);
    }
  }

  function dismiss() {
    setIsVisible(false);
    setDismissed(true);
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={dismiss}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-md mx-4"
          >
            <div className="glass rounded-3xl p-8 border border-white/15 shadow-2xl">
              <button
                onClick={dismiss}
                className="absolute top-4 right-4 p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="text-center mb-6">
                <div className="text-4xl mb-3">⚡</div>
                <h2 className="text-xl font-bold text-white mb-2">
                  Wait! Get 10% Off Your First Order
                </h2>
                <p className="text-white/60 text-sm">
                  Leave your number and we&apos;ll call back with a special discount for first-time customers.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <Input
                  type="tel"
                  placeholder="Your mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <Button
                  type="submit"
                  variant="gradient"
                  className="w-full"
                  disabled={submitting}
                >
                  {submitting ? "Sending..." : "Get My 10% Discount"}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <Link href="/quote" onClick={dismiss} className="text-sm text-blue-400 hover:text-blue-300 flex items-center justify-center gap-1">
                  <Upload className="h-3 w-3" />
                  Or upload a file for instant quote →
                </Link>
              </div>

              <p className="mt-3 text-center text-xs text-white/30">
                No spam. We only call once. Unsubscribe anytime.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
