"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import {
  ShoppingCart,
  ChevronDown,
  Layers,
  Package,
  Settings,
  LayoutDashboard,
  LogOut,
  User,
} from "lucide-react";
import { logout } from "@/actions/auth.actions";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  {
    label: "Services",
    children: [
      { href: "/services", label: "All Services" },
      { href: "/quote", label: "Get a Quote" },
      { href: "/materials", label: "Materials Guide" },
    ],
  },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { data: session } = useSession();
  const totalItems = useCartStore((s) => s.totalItems());

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileOpen]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-5 px-4 pointer-events-none">
      {/* Floating pill nav */}
      <motion.nav
        className="pointer-events-auto flex items-center gap-1 rounded-full bg-black/50 backdrop-blur-2xl border border-white/[0.07] px-3 py-2 shadow-[0_8px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)]"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mr-2 group shrink-0">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 shadow-[0_0_12px_rgba(99,102,241,0.4)]">
            <Layers className="h-3.5 w-3.5 text-white" strokeWidth={1.5} />
          </div>
          <span className="text-sm font-bold tracking-tight">
            <span className="text-white">Kalinga</span>{" "}
            <span className="gradient-text">Forge</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-0.5">
          {NAV_LINKS.map((link) =>
            link.children ? (
              <div key={link.label} className="relative">
                <button
                  onMouseEnter={() => setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white/55 hover:text-white transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] rounded-full hover:bg-white/[0.05]"
                >
                  {link.label}
                  <ChevronDown
                    className="h-3 w-3 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
                    strokeWidth={1}
                    style={{ transform: openDropdown === link.label ? "rotate(180deg)" : "rotate(0deg)" }}
                  />
                </button>
                <AnimatePresence>
                  {openDropdown === link.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
                      className="absolute left-0 top-full mt-2 w-44 origin-top"
                      onMouseEnter={() => setOpenDropdown(link.label)}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      <div className="p-[1.5px] rounded-[1.2rem] bg-white/[0.04] border border-white/[0.08]">
                        <div className="rounded-[calc(1.2rem-1.5px)] bg-zinc-950/98 border border-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] p-1.5">
                          {link.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block rounded-xl px-3 py-2 text-xs text-white/55 hover:bg-white/[0.05] hover:text-white transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href!}
                className="px-3 py-1.5 text-xs font-medium text-white/55 hover:text-white transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] rounded-full hover:bg-white/[0.05]"
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        <div className="hidden md:block h-4 w-px bg-white/10 mx-1" />

        {/* Actions */}
        <div className="flex items-center gap-1">
          {/* Cart */}
          <Link href="/cart" className="relative group">
            <div className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/[0.05] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.95]">
              <ShoppingCart className="h-3.5 w-3.5 text-white/55 group-hover:text-white transition-colors" strokeWidth={1} />
            </div>
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white shadow-[0_0_8px_rgba(37,99,235,0.6)]">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Auth — desktop */}
          {session ? (
            <div className="relative group hidden md:block">
              <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-white/55 hover:text-white transition-colors rounded-full hover:bg-white/[0.05]">
                <User className="h-3.5 w-3.5" strokeWidth={1} />
                <span className="max-w-[72px] truncate">{session.user?.name ?? "Account"}</span>
                <ChevronDown className="h-3 w-3" strokeWidth={1} />
              </button>
              <div className="absolute right-0 top-full mt-2 w-44 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]">
                <div className="p-[1.5px] rounded-[1.2rem] bg-white/[0.04] border border-white/[0.08]">
                  <div className="rounded-[calc(1.2rem-1.5px)] bg-zinc-950/98 border border-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] p-1.5">
                    {session.user?.role === "ADMIN" ? (
                      <Link href="/admin" className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-white/55 hover:bg-white/[0.05] hover:text-white transition-colors">
                        <Settings className="h-3.5 w-3.5" strokeWidth={1} /> Admin Panel
                      </Link>
                    ) : (
                      <Link href="/dashboard" className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-white/55 hover:bg-white/[0.05] hover:text-white transition-colors">
                        <LayoutDashboard className="h-3.5 w-3.5" strokeWidth={1} /> Dashboard
                      </Link>
                    )}
                    <Link href="/orders" className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-white/55 hover:bg-white/[0.05] hover:text-white transition-colors">
                      <Package className="h-3.5 w-3.5" strokeWidth={1} /> Orders
                    </Link>
                    <hr className="my-1 border-white/[0.06]" />
                    <form action={logout}>
                      <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-red-400/70 hover:bg-red-500/[0.08] hover:text-red-400 transition-colors">
                        <LogOut className="h-3.5 w-3.5" strokeWidth={1} /> Sign Out
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Link href="/login" className="hidden md:block">
              <span className="px-3 py-1.5 text-xs font-medium text-white/55 hover:text-white transition-colors rounded-full hover:bg-white/[0.05] cursor-pointer">
                Sign in
              </span>
            </Link>
          )}

          {/* Primary CTA — button-in-button */}
          <Link href="/quote">
            <div className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 pl-4 pr-1.5 py-1.5 active:scale-[0.97] transition-transform duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] shadow-[0_0_20px_rgba(99,102,241,0.3)]">
              <span className="text-xs font-semibold text-white">Get Quote</span>
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]">
                <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2 8L8 2M8 2H4M8 2V6" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Mobile hamburger */}
          <button
            className="md:hidden w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/[0.05] transition-colors"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle menu"
          >
            <div className="relative w-4 h-3">
              <span className={`absolute top-0 left-0 h-px w-4 bg-white/70 transition-all duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] origin-center ${isMobileOpen ? "top-1.5 rotate-45" : ""}`} />
              <span className={`absolute top-1.5 left-0 h-px bg-white/70 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${isMobileOpen ? "w-0 opacity-0" : "w-3 opacity-100"}`} />
              <span className={`absolute top-3 left-0 h-px w-4 bg-white/70 transition-all duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] origin-center ${isMobileOpen ? "top-1.5 -rotate-45" : ""}`} />
            </div>
          </button>
        </div>
      </motion.nav>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-0 bg-black/88 backdrop-blur-3xl flex flex-col items-center justify-center pointer-events-auto"
          >
            <nav className="flex flex-col items-center gap-1 w-full px-8">
              {NAV_LINKS.map((link, i) =>
                link.children ? (
                  <div key={link.label} className="w-full text-center mb-2">
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.06 + i * 0.04, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                      className="text-[9px] uppercase tracking-[0.25em] text-white/25 font-medium mb-2"
                    >
                      {link.label}
                    </motion.p>
                    {link.children.map((child, j) => (
                      <motion.div
                        key={child.href}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08 + i * 0.04 + j * 0.03, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                      >
                        <Link
                          href={child.href}
                          onClick={() => setIsMobileOpen(false)}
                          className="block py-1.5 text-sm text-white/50 hover:text-white transition-colors"
                        >
                          {child.label}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 + i * 0.04, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                    className="w-full text-center"
                  >
                    <Link
                      href={link.href!}
                      onClick={() => setIsMobileOpen(false)}
                      className="block py-2.5 text-2xl font-medium text-white/75 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                )
              )}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
              className="mt-10 flex flex-col gap-3 w-full px-8 max-w-xs"
            >
              {session ? (
                <>
                  <Link href="/dashboard" onClick={() => setIsMobileOpen(false)}>
                    <button className="w-full py-3 rounded-full border border-white/[0.08] text-sm text-white/60 hover:text-white transition-colors">
                      Dashboard
                    </button>
                  </Link>
                  <form action={logout}>
                    <button className="w-full py-3 rounded-full text-sm text-red-400/60 hover:text-red-400 transition-colors">
                      Sign Out
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsMobileOpen(false)}>
                    <button className="w-full py-3 rounded-full border border-white/[0.08] text-sm text-white/60 hover:text-white transition-colors">
                      Sign In
                    </button>
                  </Link>
                  <Link href="/quote" onClick={() => setIsMobileOpen(false)}>
                    <button className="w-full py-3 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-sm font-semibold text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                      Get Quote
                    </button>
                  </Link>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
