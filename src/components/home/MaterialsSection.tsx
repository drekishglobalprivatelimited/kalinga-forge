"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { MATERIALS } from "@/constants/materials";
import Link from "next/link";

const MATERIAL_LIST = Object.values(MATERIALS);

export function MaterialsSection() {
  const [active, setActive] = useState(MATERIAL_LIST[0].id);
  const activeMaterial = MATERIAL_LIST.find((m) => m.id === active)!;

  return (
    <section className="py-36 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-white/[0.01]">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-violet-700/[0.07] rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-blue-700/[0.06] rounded-full blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal className="text-center mb-20">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.03] border border-white/[0.07] px-3 py-1.5 mb-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_6px_rgba(167,139,250,0.7)]" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-white/40">Materials</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] mb-5">
            <span className="text-white">9 Professional</span>{" "}
            <span className="gradient-text">Materials</span>
          </h2>
          <p className="text-white/40 max-w-lg mx-auto text-sm leading-relaxed">
            From biodegradable PLA to aerospace carbon fiber — choose the right material for your application.
          </p>
        </ScrollReveal>

        {/* Editorial split layout */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Material selector */}
          <ScrollReveal direction="left" className="flex flex-col gap-1.5">
            {MATERIAL_LIST.map((mat) => (
              <button
                key={mat.id}
                onClick={() => setActive(mat.id)}
                className={`group flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                  active === mat.id
                    ? "bg-white/[0.06] border border-white/[0.1] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                    : "text-white/40 hover:text-white/70 hover:bg-white/[0.03] border border-transparent"
                }`}
              >
                <div
                  className="w-3 h-3 rounded-full shrink-0 border border-white/[0.15]"
                  style={
                    mat.color === "gradient"
                      ? { background: "linear-gradient(135deg, #0070f3, #7c3aed)" }
                      : { background: mat.color }
                  }
                />
                <span className={`text-sm font-medium transition-colors ${active === mat.id ? "text-white" : ""}`}>
                  {mat.name}
                </span>
                {mat.recommended && (
                  <span className="ml-auto text-[10px] font-medium bg-blue-500/[0.1] text-blue-400 border border-blue-500/[0.15] px-2 py-0.5 rounded-full">
                    Popular
                  </span>
                )}
              </button>
            ))}
          </ScrollReveal>

          {/* Material detail — double-bezel */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 16, filter: "blur(6px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -16, filter: "blur(6px)" }}
                transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                className="h-full"
              >
                {/* Outer shell */}
                <div className="h-full p-[1.5px] rounded-[2rem] bg-white/[0.04] border border-white/[0.08]">
                  {/* Inner core */}
                  <div className="h-full rounded-[calc(2rem-1.5px)] bg-[#090909] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] p-8 relative overflow-hidden">
                    {/* Subtle gradient wash from material color */}
                    <div
                      className="absolute inset-0 opacity-[0.06] pointer-events-none"
                      style={{
                        background: activeMaterial.color === "gradient"
                          ? "radial-gradient(ellipse at top left, #0070f3 0%, transparent 60%)"
                          : `radial-gradient(ellipse at top left, ${activeMaterial.color} 0%, transparent 60%)`,
                      }}
                    />

                    <div className="relative">
                      {/* Material header */}
                      <div className="flex items-center gap-4 mb-7">
                        <div className="p-[1px] rounded-2xl bg-white/[0.06] border border-white/[0.1]">
                          <div
                            className="w-14 h-14 rounded-[calc(1rem-1px)] shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]"
                            style={
                              activeMaterial.color === "gradient"
                                ? { background: "linear-gradient(135deg, #0070f3, #7c3aed)" }
                                : { background: activeMaterial.color }
                            }
                          />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white tracking-tight">{activeMaterial.name}</h3>
                          <p className="text-xs text-white/35 mt-0.5">Starting from ₹{activeMaterial.pricePerGram}/gram</p>
                        </div>
                      </div>

                      <p className="text-sm text-white/55 mb-7 leading-relaxed">{activeMaterial.description}</p>

                      {/* Properties */}
                      <div className="grid sm:grid-cols-2 gap-2 mb-7">
                        {activeMaterial.properties.map((prop) => (
                          <div key={prop} className="flex items-center gap-2.5 text-xs text-white/50">
                            <span className="w-1 h-1 rounded-full bg-blue-400/60 shrink-0" />
                            {prop}
                          </div>
                        ))}
                      </div>

                      {/* Specs row — nested double-bezel */}
                      <div className="p-[1px] rounded-2xl bg-white/[0.04] border border-white/[0.07] mb-7">
                        <div className="rounded-[calc(1rem-1px)] bg-white/[0.02] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] grid grid-cols-3 divide-x divide-white/[0.05]">
                          {[
                            { label: "Price/gram", value: `₹${activeMaterial.pricePerGram}` },
                            { label: "Density", value: `${activeMaterial.density} g/cm³` },
                            { label: "Min. Infill", value: `${activeMaterial.minInfill}%` },
                          ].map((spec) => (
                            <div key={spec.label} className="p-4 text-center">
                              <p className="text-[10px] text-white/30 mb-1">{spec.label}</p>
                              <p className="text-sm font-semibold text-white">{spec.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CTA — button-in-button */}
                      <Link href={`/quote?material=${active}`}>
                        <div className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 pl-5 pr-2 py-2 active:scale-[0.97] transition-transform duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] shadow-[0_0_20px_rgba(99,102,241,0.25)]">
                          <span className="text-xs font-semibold text-white">Quote with {activeMaterial.name}</span>
                          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]">
                            <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M2 8L8 2M8 2H4M8 2V6" />
                            </svg>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
