"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: "blue" | "violet" | "cyan" | "none";
  onClick?: () => void;
}

export function GlassCard({
  children,
  className = "",
  hover = true,
  glow = "none",
  onClick,
}: GlassCardProps) {
  const glowStyles = {
    blue: "hover:shadow-[0_0_40px_rgba(0,112,243,0.15)]",
    violet: "hover:shadow-[0_0_40px_rgba(124,58,237,0.15)]",
    cyan: "hover:shadow-[0_0_40px_rgba(6,182,212,0.15)]",
    none: "",
  };

  return (
    <motion.div
      className={cn(
        "glass rounded-2xl",
        hover && "glass-hover cursor-pointer",
        glow !== "none" && glowStyles[glow],
        "transition-shadow duration-300",
        className
      )}
      whileHover={hover ? { scale: 1.01 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
