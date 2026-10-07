"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export function WhatsAppFloat() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919876543210";
  const message = encodeURIComponent(
    "Hi Kalinga Forge! I'd like to know more about your 3D printing services."
  );

  return (
    <motion.a
      href={`https://wa.me/${phone}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-400 transition-colors group"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Chat on WhatsApp"
    >
      <div className="flex items-center justify-center w-14 h-14">
        <MessageCircle className="h-7 w-7 fill-white" />
      </div>
      <motion.span
        className="overflow-hidden whitespace-nowrap pr-4 text-sm font-medium"
        initial={{ width: 0, opacity: 0 }}
        whileHover={{ width: "auto", opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        Chat with us
      </motion.span>
    </motion.a>
  );
}
