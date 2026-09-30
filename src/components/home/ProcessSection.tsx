"use client";

import { ScrollReveal, StaggerReveal, StaggerItem } from "@/components/shared/ScrollReveal";
import { Upload, Settings, CreditCard, Package } from "lucide-react";
import { type Variants } from "framer-motion";

const STEPS = [
  {
    step: "01",
    icon: Upload,
    title: "Upload Your File",
    description: "Drag and drop your STL, STEP, OBJ, or 3MF file. Analysed instantly.",
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/[0.08]",
    accentGlow: "hover:shadow-[0_0_40px_rgba(37,99,235,0.1)]",
    rotate: "-1deg",
  },
  {
    step: "02",
    icon: Settings,
    title: "Configure & Quote",
    description: "Choose material, finish, and quantity. Live pricing updates as you configure.",
    iconColor: "text-violet-400",
    iconBg: "bg-violet-500/[0.08]",
    accentGlow: "hover:shadow-[0_0_40px_rgba(124,58,237,0.1)]",
    rotate: "1deg",
  },
  {
    step: "03",
    icon: CreditCard,
    title: "Pay Securely",
    description: "Admin finalises quote. Pay via UPI, cards, or net banking through Razorpay.",
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-500/[0.08]",
    accentGlow: "hover:shadow-[0_0_40px_rgba(6,182,212,0.1)]",
    rotate: "-0.5deg",
  },
  {
    step: "04",
    icon: Package,
    title: "Receive Your Parts",
    description: "Track production in real time. Delivered to your door with full tracking.",
    iconColor: "text-green-400",
    iconBg: "bg-green-500/[0.08]",
    accentGlow: "hover:shadow-[0_0_40px_rgba(34,197,94,0.1)]",
    rotate: "0.8deg",
  },
];

const STATUS_FLOW = [
  "Submitted", "Under Review", "Quoted", "Payment",
  "In Production", "Quality Check", "Shipped", "Delivered",
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 32, filter: "blur(8px)" },
  visible: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.32, 0.72, 0, 1] },
  },
};

export function ProcessSection() {
  return (
    <section className="py-36 relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-violet-900/[0.06] rounded-full blur-[140px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal className="text-center mb-20">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.03] border border-white/[0.07] px-3 py-1.5 mb-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.7)]" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-white/40">How It Works</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] mb-5">
            <span className="text-white">From File to Doorstep</span>
            <br />
            <span className="gradient-text">In 4 Simple Steps</span>
          </h2>
          <p className="text-white/40 max-w-md mx-auto text-sm leading-relaxed">
            The fastest way to get professional-grade 3D printed parts in India.
          </p>
        </ScrollReveal>

        {/* Z-Axis Cascade — cards with subtle rotations */}
        <StaggerReveal className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5" staggerDelay={0.1}>
          {STEPS.map((step, index) => (
            <StaggerItem key={step.step} variants={cardVariants}>
              <div className="relative h-full">
                {/* Connector line on desktop */}
                {index < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-7 left-[calc(100%+10px)] w-[calc(100%-18px)] h-px bg-gradient-to-r from-white/[0.12] to-transparent z-10 pointer-events-none" />
                )}

                {/* Double-bezel card with subtle rotation */}
                <div
                  className={`h-full p-[1.5px] rounded-[1.75rem] bg-white/[0.03] border border-white/[0.07] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${step.accentGlow} hover:rotate-0 will-change-transform`}
                  style={{ transform: `rotate(${step.rotate})`, transition: "transform 0.7s cubic-bezier(0.32,0.72,0,1), box-shadow 0.7s cubic-bezier(0.32,0.72,0,1)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "rotate(0deg)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = `rotate(${step.rotate})`; }}
                >
                  <div className="h-full rounded-[calc(1.75rem-1.5px)] bg-[#0a0a0a] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div className={`w-12 h-12 rounded-xl ${step.iconBg} flex items-center justify-center`}>
                        <step.icon className={`h-5 w-5 ${step.iconColor}`} strokeWidth={1} />
                      </div>
                      <span className="text-4xl font-bold text-white/[0.06] tabular-nums">{step.step}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-2.5 tracking-tight">{step.title}</h3>
                    <p className="text-xs text-white/40 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerReveal>

        {/* Status flow — double-bezel panel */}
        <ScrollReveal className="mt-12" delay={0.2}>
          <div className="p-[1.5px] rounded-[1.75rem] bg-white/[0.03] border border-white/[0.07]">
            <div className="rounded-[calc(1.75rem-1.5px)] bg-[#090909] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] p-6 md:p-8">
              <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/25 mb-5">Order Status Flow</p>
              <div className="flex flex-wrap gap-2 items-center">
                {STATUS_FLOW.map((status, i) => (
                  <div key={status} className="flex items-center gap-2">
                    <span className="text-xs text-white/50 bg-white/[0.04] border border-white/[0.07] rounded-full px-3 py-1 hover:text-white/80 hover:bg-white/[0.07] transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] cursor-default">
                      {status}
                    </span>
                    {i < STATUS_FLOW.length - 1 && (
                      <svg className="w-3 h-3 text-white/15 shrink-0" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1">
                        <path d="M2 6h8M7 3l3 3-3 3" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
