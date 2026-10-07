"use client";

import { ScrollReveal, StaggerReveal, StaggerItem } from "@/components/shared/ScrollReveal";
import { type Variants } from "framer-motion";

const TESTIMONIALS = [
  {
    name: "Rahul Sharma",
    role: "Mechanical Engineer, Bangalore",
    rating: 5,
    text: "Kalinga Forge printed our motor bracket prototype in just 2 days. Perfect dimensional accuracy and the carbon fiber finish exceeded expectations. Will be ordering in bulk.",
    avatar: "RS",
    avatarBg: "from-blue-600 to-blue-800",
    rotate: "-0.8deg",
  },
  {
    name: "Priya Menon",
    role: "Product Designer, Hyderabad",
    rating: 5,
    text: "The instant quote system is brilliant. Uploaded my STL, got a price in seconds, approved it and parts arrived on time. Quality is exceptional for the price.",
    avatar: "PM",
    avatarBg: "from-violet-600 to-violet-800",
    rotate: "0.6deg",
  },
  {
    name: "Arjun Patel",
    role: "Startup Founder, Pune",
    rating: 5,
    text: "We ordered 50 units of our product housing. Kalinga Forge handled batch production perfectly. The admin dashboard made tracking easy. Highly recommend.",
    avatar: "AP",
    avatarBg: "from-cyan-600 to-cyan-800",
    rotate: "-0.5deg",
  },
  {
    name: "Dr. Lakshmi Nair",
    role: "Researcher, IIT Madras",
    rating: 5,
    text: "Used their resin printing for anatomical models. Incredible detail at 0.1mm layer height. Team was very responsive and accommodated our custom requirements.",
    avatar: "LN",
    avatarBg: "from-green-600 to-green-800",
    rotate: "1deg",
  },
  {
    name: "Vikram Reddy",
    role: "Architect, Chennai",
    rating: 5,
    text: "Scale models for 3 major projects this year. Quality and turnaround time makes client presentations so much better. Always impressed.",
    avatar: "VR",
    avatarBg: "from-orange-600 to-orange-800",
    rotate: "-0.7deg",
  },
  {
    name: "Neha Gupta",
    role: "Gift Shop Owner, Mumbai",
    rating: 5,
    text: "Ordered personalised name plates for my store. Customers loved them. Easy ordering, beautiful quality, and they even helped with slight design tweaks.",
    avatar: "NG",
    avatarBg: "from-pink-600 to-pink-800",
    rotate: "0.4deg",
  },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  visible: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.65, ease: [0.32, 0.72, 0, 1] },
  },
};

function StarIcon() {
  return (
    <svg className="w-3 h-3 fill-yellow-400 text-yellow-400" viewBox="0 0 12 12">
      <path d="M6 1l1.5 3 3.3.5L8.5 6.7l.6 3.3L6 8.5 2.9 10l.6-3.3L1.2 4.5l3.3-.5z" />
    </svg>
  );
}

export function TestimonialsSection() {
  return (
    <section className="py-36 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-yellow-600/[0.04] rounded-full blur-[140px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal className="text-center mb-20">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.03] border border-white/[0.07] px-3 py-1.5 mb-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <StarIcon />
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-white/40">4.9 / 5 from 200+ reviews</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1]">
            <span className="text-white">Trusted by</span>{" "}
            <span className="gradient-text">Engineers,</span>
            <br />
            <span className="gradient-text">Designers</span>
            <span className="text-white"> & Entrepreneurs</span>
          </h2>
        </ScrollReveal>

        {/* Cards grid */}
        <StaggerReveal className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" staggerDelay={0.07}>
          {TESTIMONIALS.map((t) => (
            <StaggerItem key={t.name} variants={cardVariants}>
              <div
                className="h-full p-[1.5px] rounded-[1.75rem] bg-white/[0.03] border border-white/[0.07] hover:border-white/[0.12] hover:shadow-[0_0_48px_rgba(255,255,255,0.04)] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] will-change-transform"
                style={{ transform: `rotate(${t.rotate})`, transition: "transform 0.6s cubic-bezier(0.32,0.72,0,1), box-shadow 0.6s cubic-bezier(0.32,0.72,0,1), border-color 0.6s cubic-bezier(0.32,0.72,0,1)" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "rotate(0deg)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = `rotate(${t.rotate})`; }}
              >
                <div className="h-full rounded-[calc(1.75rem-1.5px)] bg-[#0a0a0a] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] p-6 flex flex-col">
                  {/* Stars */}
                  <div className="flex items-center gap-0.5 mb-5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <StarIcon key={i} />
                    ))}
                  </div>

                  {/* Quote text */}
                  <p className="text-sm text-white/55 leading-relaxed flex-1 mb-6">&ldquo;{t.text}&rdquo;</p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-white/[0.05]">
                    <div className="p-[1px] rounded-full bg-white/[0.08] border border-white/[0.1] shrink-0">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${t.avatarBg} flex items-center justify-center text-[11px] font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]`}>
                        {t.avatar}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white/85">{t.name}</p>
                      <p className="text-[10px] text-white/30 mt-0.5">{t.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
