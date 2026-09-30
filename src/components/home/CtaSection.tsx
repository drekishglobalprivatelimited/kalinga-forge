"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { Upload, MessageCircle } from "lucide-react";

export function CtaSection() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919876543210";

  return (
    <section className="py-36 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/[0.08] to-transparent" />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ repeat: Infinity, duration: 9, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/[0.12] blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ repeat: Infinity, duration: 11, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-violet-600/[0.1] blur-[100px]"
        />
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          {/* Outer shell */}
          <div className="p-[1.5px] rounded-[2.5rem] bg-white/[0.05] border border-white/[0.1] shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
            {/* Inner core */}
            <div className="rounded-[calc(2.5rem-1.5px)] bg-[#080808] shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] relative overflow-hidden px-8 py-16 md:px-16 md:py-20 text-center">

              {/* Noise-like grain (fixed, pointer-events-none) */}
              <div
                className="absolute inset-0 opacity-[0.025] pointer-events-none"
                style={{
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
                }}
              />

              {/* Top gradient wash */}
              <div className="absolute inset-0 bg-gradient-to-b from-blue-600/[0.05] via-transparent to-transparent pointer-events-none" />

              <div className="relative">
                {/* Eyebrow */}
                <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.04] border border-white/[0.08] px-3 py-1.5 mb-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.8)]">
                    <span className="animate-ping absolute h-1.5 w-1.5 rounded-full bg-green-400 opacity-60" />
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-white/45">Ready to print your idea?</span>
                </div>

                {/* Headline */}
                <h2 className="text-4xl sm:text-5xl md:text-[3.5rem] font-bold text-white leading-[1.05] mb-6 tracking-tight">
                  Get Your Free{" "}
                  <span className="gradient-text">Instant Quote</span>
                  <br />
                  in Under 60 Seconds
                </h2>

                <p className="text-sm text-white/40 max-w-md mx-auto leading-relaxed mb-12">
                  Upload your 3D file, configure your specs, and get an accurate price estimate immediately.
                  No sign-up required to quote.
                </p>

                {/* CTAs — button-in-button */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/quote">
                    <div className="group flex items-center gap-2.5 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 pl-6 pr-2 py-2 active:scale-[0.97] transition-transform duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] shadow-[0_0_36px_rgba(99,102,241,0.45)] w-full sm:w-auto justify-center">
                      <Upload className="h-4 w-4 text-white/80" strokeWidth={1} />
                      <span className="text-sm font-semibold text-white">Upload File & Quote</span>
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-105 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]">
                        <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M2.5 9.5L9.5 2.5M9.5 2.5H5M9.5 2.5V7" />
                        </svg>
                      </div>
                    </div>
                  </Link>

                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="group flex items-center gap-2.5 rounded-full border border-white/[0.1] bg-white/[0.03] pl-6 pr-2 py-2 hover:bg-white/[0.06] hover:border-white/[0.16] active:scale-[0.97] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] w-full sm:w-auto justify-center">
                      <MessageCircle className="h-4 w-4 text-green-400" strokeWidth={1} />
                      <span className="text-sm font-medium text-white/65 group-hover:text-white transition-colors">WhatsApp Us</span>
                      <div className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]">
                        <svg className="w-3 h-3 text-white/50 group-hover:text-white transition-colors" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M2.5 9.5L9.5 2.5M9.5 2.5H5M9.5 2.5V7" />
                        </svg>
                      </div>
                    </div>
                  </a>
                </div>

                <p className="mt-7 text-xs text-white/20">
                  No commitments &nbsp;·&nbsp; Instant estimate &nbsp;·&nbsp; Reply within 24 hours
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
