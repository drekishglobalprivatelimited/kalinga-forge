"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Horizontally scrolling row; children should be fixed-width items.
export function ProductRail({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className="relative group/rail">
      <div ref={ref} className="no-scrollbar flex gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory scroll-px-4 px-4 sm:px-6">
        {children}
      </div>
      <button
        onClick={() => scroll(-1)}
        className="hidden md:flex absolute left-2 top-[38%] -translate-y-1/2 w-10 h-10 items-center justify-center bg-white shadow-md text-ink opacity-0 group-hover/rail:opacity-100 transition-opacity"
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
      </button>
      <button
        onClick={() => scroll(1)}
        className="hidden md:flex absolute right-2 top-[38%] -translate-y-1/2 w-10 h-10 items-center justify-center bg-white shadow-md text-ink opacity-0 group-hover/rail:opacity-100 transition-opacity"
        aria-label="Scroll right"
      >
        <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
      </button>
    </div>
  );
}
