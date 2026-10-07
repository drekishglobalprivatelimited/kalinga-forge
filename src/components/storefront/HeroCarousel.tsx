"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    eyebrow: "Home & Décor",
    title: "Sculpted for\nevery shelf",
    body: "Vases, planters and accents with flowing, layered forms — printed to order.",
    cta: "Shop Home & Décor",
    href: "/shop?category=home-and-decor",
    image: "/products/swirl-vase.jpg",
    bg: "bg-[#efe7dc]",
  },
  {
    eyebrow: "Flexi Collection",
    title: "Printed in place.\nBuilt to wiggle.",
    body: "Articulated creatures that pose, flex and fidget straight off the print bed.",
    cta: "Explore Flexi",
    href: "/shop?category=flexi-collection",
    image: "/products/flexi-fox.jpg",
    bg: "bg-[#e3e8e1]",
  },
  {
    eyebrow: "Custom 3D Printing",
    title: "Your design.\nOur printers.",
    body: "Upload an STL, pick a material and get an instant estimate for prototypes and parts.",
    cta: "Get a quote",
    href: "/quote",
    image: "/products/carbon-13-jointed-figure.jpg",
    bg: "bg-[#e4e2ec]",
  },
];

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 6000);
    return () => clearInterval(id);
  }, [paused]);

  const go = (delta: number) => setIndex((i) => (i + delta + SLIDES.length) % SLIDES.length);

  return (
    <section
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      <div className="flex transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]" style={{ transform: `translateX(-${index * 100}%)` }}>
        {SLIDES.map((slide, i) => (
          <div key={slide.href} className={`w-full shrink-0 ${slide.bg}`} aria-hidden={i !== index}>
            <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 items-center min-h-[460px] md:min-h-[540px]">
              <div className="order-2 md:order-1 px-6 sm:px-10 lg:px-16 py-10 md:py-0">
                <p className="text-[11px] uppercase tracking-[0.2em] text-ink/60 mb-4">{slide.eyebrow}</p>
                <h2 className="whitespace-pre-line text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight text-ink mb-5">
                  {slide.title}
                </h2>
                <p className="text-sm sm:text-base text-ink/70 max-w-md mb-8">{slide.body}</p>
                <Link
                  href={slide.href}
                  tabIndex={i === index ? 0 : -1}
                  className="inline-block px-8 py-3.5 bg-ink text-white text-sm font-medium tracking-wide hover:bg-black transition-colors"
                >
                  {slide.cta}
                </Link>
              </div>
              <div className="order-1 md:order-2 relative h-[300px] sm:h-[380px] md:h-full md:min-h-[540px]">
                <Image
                  src={slide.image}
                  alt=""
                  fill
                  priority={i === 0}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => go(-1)}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center bg-white/80 hover:bg-white text-ink transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
      </button>
      <button
        onClick={() => go(1)}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center bg-white/80 hover:bg-white text-ink transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.href}
            onClick={() => setIndex(i)}
            className={`h-1 transition-all duration-300 ${i === index ? "w-8 bg-ink" : "w-4 bg-ink/25"}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
