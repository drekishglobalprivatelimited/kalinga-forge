"use client";

import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { motion } from "framer-motion";

const INDUSTRIES = [
  { emoji: "🤖", name: "Robotics", desc: "Custom frames, mounts, grippers" },
  { emoji: "✈️", name: "Aerospace", desc: "Lightweight structural parts" },
  { emoji: "🚗", name: "Automotive", desc: "Prototypes and custom fittings" },
  { emoji: "🏥", name: "Medical", desc: "Surgical guides, anatomical models" },
  { emoji: "📱", name: "Consumer Goods", desc: "Product housings and enclosures" },
  { emoji: "🎓", name: "Education", desc: "Lab models and demonstrations" },
  { emoji: "🏭", name: "Manufacturing", desc: "Jigs, fixtures, tooling" },
  { emoji: "🚀", name: "Startups", desc: "MVP prototypes at speed" },
];

export function IndustriesSection() {
  return (
    <section className="py-28 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            <span className="text-white">Serving</span>{" "}
            <span className="gradient-text">8 Industries</span>
          </h2>
          <p className="text-sm text-white/35">From aerospace to consumer products — we print it all.</p>
        </ScrollReveal>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {INDUSTRIES.map((ind, i) => (
            <motion.div
              key={ind.name}
              initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: i * 0.05, duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
            >
              {/* Double-bezel pill */}
              <div className="group p-[1px] rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-white/[0.14] hover:shadow-[0_0_24px_rgba(255,255,255,0.05)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] cursor-default">
                <div className="rounded-[calc(1rem-1px)] bg-[#0a0a0a] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] p-4 text-center group-hover:-translate-y-0.5 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
                  <div className="text-2xl mb-2">{ind.emoji}</div>
                  <p className="text-xs font-semibold text-white/70 group-hover:text-white mb-1 transition-colors">{ind.name}</p>
                  <p className="text-[9px] text-white/25 leading-tight hidden sm:block">{ind.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
