"use client";

import Link from "next/link";
import { ScrollReveal, StaggerReveal, StaggerItem } from "@/components/shared/ScrollReveal";
import { Wrench, Cpu, Layers, Box, Repeat, Factory } from "lucide-react";
import { type Variants } from "framer-motion";

const SERVICES = [
  {
    icon: Layers,
    title: "STL / STEP Printing",
    description: "Upload any 3D file and get it printed with precision. We support STL, STEP, OBJ, and 3MF formats. The fastest path from idea to physical object.",
    accentColor: "from-blue-600/20 to-blue-600/5",
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/[0.08]",
    borderGlow: "hover:shadow-[0_0_48px_rgba(37,99,235,0.12)]",
    href: "/quote",
    tag: "Most Popular",
    featured: true,
  },
  {
    icon: Cpu,
    title: "Engineering Prototypes",
    description: "Functional prototypes for mechanical, electronic, and structural applications with tight tolerances.",
    accentColor: "from-violet-600/15 to-transparent",
    iconColor: "text-violet-400",
    iconBg: "bg-violet-500/[0.08]",
    borderGlow: "hover:shadow-[0_0_40px_rgba(124,58,237,0.1)]",
    href: "/services",
    tag: null,
    featured: false,
  },
  {
    icon: Wrench,
    title: "CAD Design",
    description: "No 3D file? Our engineers design your part from sketches, drawings, or descriptions.",
    accentColor: "from-cyan-600/15 to-transparent",
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-500/[0.08]",
    borderGlow: "hover:shadow-[0_0_40px_rgba(6,182,212,0.1)]",
    href: "/services",
    tag: null,
    featured: false,
  },
  {
    icon: Box,
    title: "Reverse Engineering",
    description: "We scan existing parts and recreate digital models for replacement, modification, or improvement.",
    accentColor: "from-green-600/15 to-transparent",
    iconColor: "text-green-400",
    iconBg: "bg-green-500/[0.08]",
    borderGlow: "hover:shadow-[0_0_40px_rgba(34,197,94,0.1)]",
    href: "/services",
    tag: null,
    featured: false,
  },
  {
    icon: Repeat,
    title: "Small Batch Production",
    description: "10 to 10,000 units with consistent quality. Perfect for startups and product launches.",
    accentColor: "from-orange-600/15 to-transparent",
    iconColor: "text-orange-400",
    iconBg: "bg-orange-500/[0.08]",
    borderGlow: "hover:shadow-[0_0_40px_rgba(249,115,22,0.1)]",
    href: "/services",
    tag: null,
    featured: false,
  },
  {
    icon: Factory,
    title: "Architecture Models",
    description: "High-detail architectural scale models for presentations, client pitches, and exhibitions.",
    accentColor: "from-pink-600/15 to-transparent",
    iconColor: "text-pink-400",
    iconBg: "bg-pink-500/[0.08]",
    borderGlow: "hover:shadow-[0_0_40px_rgba(236,72,153,0.1)]",
    href: "/services",
    tag: null,
    featured: false,
  },
];

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  visible: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.65, ease: [0.32, 0.72, 0, 1] },
  },
};

export function ServicesSection() {
  const [featured, ...rest] = SERVICES;

  return (
    <section className="py-36 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-700/[0.07] rounded-full blur-[140px]" />
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-violet-700/[0.06] rounded-full blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <ScrollReveal className="mb-20">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.03] border border-white/[0.07] px-3 py-1.5 mb-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              <Wrench className="h-3 w-3 text-blue-400/70" strokeWidth={1} />
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-white/40">What We Do</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] mb-5">
              <span className="text-white">Manufacturing Services</span>
              <br />
              <span className="gradient-text">Tailored to Your Needs</span>
            </h2>
            <p className="text-white/40 max-w-lg text-sm leading-relaxed">
              From rapid prototypes to production-ready parts — the materials, machines,
              and expertise to deliver quality at every scale.
            </p>
          </div>
        </ScrollReveal>

        {/* Asymmetric Bento Grid */}
        <StaggerReveal
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-3 gap-4"
          staggerDelay={0.07}
        >
          {/* Featured card — col-span-2, row-span-2 */}
          <StaggerItem variants={itemVariants} className="lg:col-span-2 lg:row-span-2">
            <Link href={featured.href} className="block h-full group">
              <div className={`h-full p-[1.5px] rounded-[2rem] bg-white/[0.04] border border-white/[0.08] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${featured.borderGlow}`}>
                <div className="h-full rounded-[calc(2rem-1.5px)] bg-[#090909] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] relative overflow-hidden p-8 flex flex-col min-h-[320px] lg:min-h-0">
                  {/* Gradient wash */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${featured.accentColor} opacity-60 pointer-events-none`} />
                  {/* Tag */}
                  <div className="relative flex items-start justify-between mb-8">
                    <div className={`w-14 h-14 rounded-2xl ${featured.iconBg} flex items-center justify-center`}>
                      <featured.icon className={`h-7 w-7 ${featured.iconColor}`} strokeWidth={1} />
                    </div>
                    <span className="text-[10px] font-semibold tracking-[0.15em] uppercase bg-blue-500/[0.1] text-blue-400 border border-blue-500/[0.2] rounded-full px-3 py-1">
                      {featured.tag}
                    </span>
                  </div>
                  {/* Content */}
                  <div className="relative mt-auto">
                    <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{featured.title}</h3>
                    <p className="text-sm text-white/45 leading-relaxed max-w-sm mb-6">{featured.description}</p>
                    {/* Button-in-button CTA */}
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] border border-white/[0.1] pl-4 pr-1.5 py-1.5 group-hover:bg-white/[0.09] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]">
                      <span className="text-xs font-medium text-white/70 group-hover:text-white transition-colors">Get a Quote</span>
                      <div className="w-5 h-5 rounded-full bg-white/[0.08] flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-px transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]">
                        <svg className="w-2.5 h-2.5 text-white/60 group-hover:text-white transition-colors" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M2 8L8 2M8 2H4M8 2V6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  {/* Decorative grid lines */}
                  <div className="absolute bottom-0 right-0 w-48 h-48 opacity-[0.04]"
                    style={{
                      backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                      backgroundSize: "24px 24px",
                    }}
                  />
                </div>
              </div>
            </Link>
          </StaggerItem>

          {/* Regular cards */}
          {rest.map((service) => (
            <StaggerItem key={service.title} variants={itemVariants}>
              <Link href={service.href} className="block h-full group">
                <div className={`h-full p-[1.5px] rounded-[1.75rem] bg-white/[0.03] border border-white/[0.07] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${service.borderGlow}`}>
                  <div className="h-full rounded-[calc(1.75rem-1.5px)] bg-[#0a0a0a] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] p-6 flex flex-col relative overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.accentColor} opacity-50 pointer-events-none`} />
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-xl ${service.iconBg} flex items-center justify-center mb-4`}>
                        <service.icon className={`h-5 w-5 ${service.iconColor}`} strokeWidth={1} />
                      </div>
                      <h3 className="text-sm font-semibold text-white mb-2 tracking-tight">{service.title}</h3>
                      <p className="text-xs text-white/40 leading-relaxed flex-1 mb-4">{service.description}</p>
                      <span className={`text-xs ${service.iconColor} opacity-70 group-hover:opacity-100 transition-opacity flex items-center gap-1`}>
                        Learn more
                        <svg className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform duration-300" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M2 5h6M5 2l3 3-3 3" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerReveal>

        {/* CTA */}
        <ScrollReveal className="mt-14 text-center" delay={0.15}>
          <Link href="/quote">
            <div className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 pl-6 pr-2 py-2 active:scale-[0.97] transition-transform duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] shadow-[0_0_28px_rgba(99,102,241,0.3)]">
              <span className="text-sm font-semibold text-white">Start Your Project</span>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-105 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]">
                <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2.5 9.5L9.5 2.5M9.5 2.5H5M9.5 2.5V7" />
                </svg>
              </div>
            </div>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
