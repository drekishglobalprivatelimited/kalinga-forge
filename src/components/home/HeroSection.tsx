"use client";

import { motion, useMotionValue, useTransform, useSpring, type Variants } from "framer-motion";
import Link from "next/link";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { Upload, Zap, Shield, Star } from "lucide-react";

const STATS = [
  { value: 2500, suffix: "+", label: "Parts Printed" },
  { value: 98, suffix: "%", label: "On-Time Delivery" },
  { value: 9, suffix: "", label: "Materials" },
  { value: 24, suffix: "hr", label: "Quote Turnaround" },
];

const TRUST_BADGES = [
  { icon: Zap, label: "Instant Quote" },
  { icon: Shield, label: "Quality Guaranteed" },
  { icon: Star, label: "4.9 / 5 Rating" },
];

export function HeroSection() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-300, 300], [6, -6]);
  const rotateY = useTransform(mouseX, [-300, 300], [-6, 6]);
  const springRotateX = useSpring(rotateX, { stiffness: 80, damping: 25 });
  const springRotateY = useSpring(rotateY, { stiffness: 80, damping: 25 });

  function handleMouseMove(e: React.MouseEvent) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  }

  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
    visible: {
      opacity: 1, y: 0, filter: "blur(0px)",
      transition: { duration: 0.75, ease: [0.32, 0.72, 0, 1] },
    },
  };

  return (
    <section
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[#050505]">
        <div className="absolute top-[-10%] left-[15%] w-[500px] h-[500px] rounded-full bg-blue-700/[0.12] blur-[140px]" />
        <div className="absolute bottom-[-5%] right-[10%] w-[500px] h-[500px] rounded-full bg-violet-700/[0.12] blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-900/[0.06] blur-[120px]" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            {/* Eyebrow */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 mb-8">
              <div className="flex items-center gap-2 rounded-full bg-white/[0.04] border border-white/[0.08] px-3 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                <span className="flex h-1.5 w-1.5 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.8)]">
                  <span className="animate-ping absolute h-1.5 w-1.5 rounded-full bg-green-400 opacity-60" />
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-white/50">Now accepting orders</span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl lg:text-[4.5rem] font-bold tracking-tight leading-[1.05] mb-7"
            >
              <span className="text-white">Turn Ideas</span>
              <br />
              <span className="text-white">Into </span>
              <span className="gradient-text">Reality</span>
              <br />
              <span className="text-white/30 text-4xl sm:text-5xl lg:text-[3.5rem]">Precision 3D Printing</span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              variants={itemVariants}
              className="text-base text-white/45 max-w-md mx-auto lg:mx-0 mb-10 leading-relaxed"
            >
              Upload your STL, STEP, or OBJ file and receive an instant quote.
              Engineering prototypes, custom products, and small-batch manufacturing across India.
            </motion.p>

            {/* CTAs — button-in-button */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-10">
              <Link href="/quote">
                <div className="group flex items-center gap-2.5 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 pl-6 pr-2 py-2 active:scale-[0.97] transition-transform duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] shadow-[0_0_28px_rgba(99,102,241,0.35)] w-full sm:w-auto justify-center">
                  <Upload className="h-4 w-4 text-white/80" strokeWidth={1} />
                  <span className="text-sm font-semibold text-white">Upload & Get Quote</span>
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-105 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]">
                    <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M2.5 9.5L9.5 2.5M9.5 2.5H5M9.5 2.5V7" />
                    </svg>
                  </div>
                </div>
              </Link>
              <Link href="/shop">
                <div className="group flex items-center gap-2.5 rounded-full border border-white/[0.1] bg-white/[0.03] pl-6 pr-2 py-2 hover:bg-white/[0.06] hover:border-white/[0.15] active:scale-[0.97] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] w-full sm:w-auto justify-center">
                  <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">Browse Products</span>
                  <div className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]">
                    <svg className="w-3 h-3 text-white/60 group-hover:text-white transition-colors" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M2.5 9.5L9.5 2.5M9.5 2.5H5M9.5 2.5V7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-2 justify-center lg:justify-start">
              {TRUST_BADGES.map((badge) => (
                <div
                  key={badge.label}
                  className="flex items-center gap-1.5 text-xs text-white/40 rounded-full bg-white/[0.03] border border-white/[0.06] px-3 py-1.5"
                >
                  <badge.icon className="h-3 w-3 text-blue-400/80" strokeWidth={1} />
                  {badge.label}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — 3D Visual with double-bezel */}
          <motion.div
            style={{ rotateX: springRotateX, rotateY: springRotateY, transformStyle: "preserve-3d" }}
            className="hidden lg:flex justify-center items-center"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.32, 0.72, 0, 1] }}
          >
            <div className="relative w-full aspect-square max-w-[420px]">
              {/* Double-bezel central card */}
              <motion.div
                animate={{ y: [-8, 8, -8] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {/* Outer shell */}
                <div className="p-[1.5px] rounded-[2rem] bg-white/[0.04] border border-white/[0.08] shadow-[0_32px_80px_rgba(0,0,0,0.6)]">
                  {/* Inner core */}
                  <div className="rounded-[calc(2rem-1.5px)] bg-[#090909] border border-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] w-64 h-64 flex items-center justify-center">
                    <div className="text-center px-6">
                      <div className="text-6xl mb-4">🔩</div>
                      <p className="text-sm font-medium text-white/70">Engineering Part</p>
                      <p className="text-xs text-white/25 mt-1">Carbon Fiber · 0.1mm · 40% infill</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating spec chips */}
              {[
                { label: "Material", value: "Carbon Fiber", color: "text-white", pos: "top-8 -left-8", delay: 0.5, dir: [5, -5] },
                { label: "Estimate", value: "₹2,499", color: "text-green-400", pos: "top-8 -right-8", delay: 1, dir: [-5, 5] },
                { label: "Print Time", value: "~4.5 hrs", color: "text-blue-400", pos: "bottom-8 -left-8", delay: 1.5, dir: [8, -8] },
                { label: "Layer", value: "0.10 mm", color: "text-violet-400", pos: "bottom-8 -right-8", delay: 0.8, dir: [-8, 8] },
              ].map((chip) => (
                <motion.div
                  key={chip.label}
                  animate={{ y: [chip.dir[0], chip.dir[1], chip.dir[0]] }}
                  transition={{ repeat: Infinity, duration: 3.5 + Math.random(), ease: "easeInOut", delay: chip.delay }}
                  className={`absolute ${chip.pos}`}
                >
                  <div className="p-[1px] rounded-2xl bg-white/[0.06] border border-white/[0.08]">
                    <div className="rounded-[calc(1rem-1px)] bg-zinc-950/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] px-3.5 py-2.5">
                      <p className="text-[10px] text-white/35 mb-0.5">{chip.label}</p>
                      <p className={`text-sm font-semibold ${chip.color}`}>{chip.value}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stats — double-bezel grid */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.85, duration: 0.75, ease: [0.32, 0.72, 0, 1] }}
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="p-[1px] rounded-[1.5rem] bg-white/[0.04] border border-white/[0.07]">
              <div className="rounded-[calc(1.5rem-1px)] bg-[#080808] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] p-6 text-center">
                <div className="text-3xl font-bold gradient-text mb-1.5">
                  <AnimatedCounter to={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-xs text-white/35 tracking-wide">{stat.label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
