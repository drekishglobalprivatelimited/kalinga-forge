"use client";

import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/cartStore";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { NAV_MENU, SHOP_CATEGORIES } from "@/constants/categories";
import { logout } from "@/actions/auth.actions";
import { Search, User, ShoppingBag, Menu, X, ChevronDown, ChevronRight } from "lucide-react";

const ANNOUNCEMENTS = [
  "Printed to order in premium PLA · Ships across India",
  "Have a design? Get a custom 3D print quote in minutes",
];

export function Header() {
  const router = useRouter();
  const { data: session } = useSession();
  const totalItems = useCartStore((s) => s.totalItems());
  const openCart = useCartStore((s) => s.openCart);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [announcement, setAnnouncement] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);

  // Cart count comes from localStorage; render it only after hydration.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  useEffect(() => {
    const id = setInterval(() => setAnnouncement((i) => (i + 1) % ANNOUNCEMENTS.length), 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setSearchOpen(false);
    setMobileOpen(false);
    router.push(`/shop?q=${encodeURIComponent(q)}`);
  }

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-ink text-white text-[11px] sm:text-xs tracking-wide text-center py-2 px-4">
        <p key={announcement} className="animate-[fadeIn_0.4s_ease]">
          {ANNOUNCEMENTS[announcement]}
        </p>
      </div>

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-line">
        <div className="max-w-[1400px] mx-auto h-16 px-4 sm:px-6 flex items-center gap-4">
          {/* Mobile menu */}
          <button
            className="lg:hidden -ml-1 p-1.5 text-ink"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" strokeWidth={1.5} />
          </button>

          {/* Logo */}
          <Link href="/" className="shrink-0 font-semibold tracking-[0.18em] text-[15px] sm:text-base text-ink">
            KALINGA<span className="text-forge">·</span>FORGE
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 mx-auto">
            {NAV_MENU.map((item) =>
              "children" in item ? (
                <div key={item.label} className="relative group">
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 px-3 py-5 text-[13px] text-ink/80 hover:text-ink transition-colors"
                  >
                    {item.label}
                    <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" strokeWidth={1.5} />
                  </Link>
                  <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity absolute left-0 top-full w-60 bg-white border border-line shadow-lg py-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-5 py-2.5 text-[13px] text-ink/75 hover:text-ink hover:bg-canvas transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="px-3 py-5 text-[13px] text-ink/80 hover:text-ink transition-colors"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Actions */}
          <div className="ml-auto lg:ml-0 flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="p-2 text-ink hover:opacity-70 transition-opacity"
              aria-label="Search"
            >
              <Search className="h-5 w-5" strokeWidth={1.5} />
            </button>

            <div className="relative group hidden sm:block">
              <Link
                href={session ? (session.user?.role === "ADMIN" ? "/admin" : "/dashboard") : "/login"}
                className="block p-2 text-ink hover:opacity-70 transition-opacity"
                aria-label="Account"
              >
                <User className="h-5 w-5" strokeWidth={1.5} />
              </Link>
              {session && (
                <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity absolute right-0 top-full w-48 bg-white border border-line shadow-lg py-2">
                  <p className="px-4 pb-2 mb-1 border-b border-line text-xs text-muted-ink truncate">
                    {session.user?.name ?? session.user?.email}
                  </p>
                  {session.user?.role === "ADMIN" && (
                    <Link href="/admin" className="block px-4 py-2 text-[13px] text-ink/75 hover:bg-canvas">
                      Admin Panel
                    </Link>
                  )}
                  <Link href="/dashboard" className="block px-4 py-2 text-[13px] text-ink/75 hover:bg-canvas">
                    My Account
                  </Link>
                  <Link href="/orders" className="block px-4 py-2 text-[13px] text-ink/75 hover:bg-canvas">
                    Orders
                  </Link>
                  <form action={logout}>
                    <button className="w-full text-left px-4 py-2 text-[13px] text-forge hover:bg-canvas">
                      Sign out
                    </button>
                  </form>
                </div>
              )}
            </div>

            <button
              onClick={openCart}
              className="relative p-2 text-ink hover:opacity-70 transition-opacity"
              aria-label="Open cart"
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
              {mounted && totalItems > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-4 h-4 px-1 rounded-full bg-forge text-white text-[10px] font-semibold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search panel */}
        {searchOpen && (
          <div className="border-t border-line bg-white">
            <form onSubmit={submitSearch} className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
              <Search className="h-5 w-5 text-muted-ink shrink-0" strokeWidth={1.5} />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search vases, keychains, low poly figures…"
                className="flex-1 bg-transparent text-sm text-ink placeholder:text-muted-ink outline-none py-2"
              />
              <button type="button" onClick={() => setSearchOpen(false)} className="p-1 text-muted-ink hover:text-ink" aria-label="Close search">
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[86%] max-w-sm bg-white flex flex-col">
            <div className="flex items-center justify-between h-16 px-4 border-b border-line">
              <span className="font-semibold tracking-[0.18em] text-sm text-ink">
                KALINGA<span className="text-forge">·</span>FORGE
              </span>
              <button onClick={() => setMobileOpen(false)} className="p-1.5 text-ink" aria-label="Close menu">
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            <form onSubmit={submitSearch} className="m-4 flex items-center gap-2 border border-line px-3">
              <Search className="h-4 w-4 text-muted-ink" strokeWidth={1.5} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products"
                className="flex-1 py-2.5 text-sm text-ink outline-none bg-transparent"
              />
            </form>

            <nav className="flex-1 overflow-y-auto">
              <p className="px-4 pt-2 pb-1 text-[11px] uppercase tracking-[0.15em] text-muted-ink">Shop by category</p>
              {SHOP_CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/shop?category=${cat.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between px-4 py-3 text-sm text-ink border-b border-line/70"
                >
                  {cat.name}
                  <ChevronRight className="h-4 w-4 text-muted-ink" strokeWidth={1.5} />
                </Link>
              ))}
              <Link
                href="/shop"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between px-4 py-3 text-sm font-medium text-ink border-b border-line/70"
              >
                Shop all
                <ChevronRight className="h-4 w-4 text-muted-ink" strokeWidth={1.5} />
              </Link>
              <Link
                href="/quote"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between px-4 py-3 text-sm font-medium text-forge border-b border-line/70"
              >
                Custom 3D printing
                <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between px-4 py-3 text-sm text-ink border-b border-line/70"
              >
                Contact us
                <ChevronRight className="h-4 w-4 text-muted-ink" strokeWidth={1.5} />
              </Link>
            </nav>

            <div className="p-4 border-t border-line">
              {session ? (
                <form action={logout}>
                  <button className="w-full py-3 border border-ink text-sm font-medium text-ink">Sign out</button>
                </form>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full py-3 bg-ink text-white text-sm font-medium text-center"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      <CartDrawer />
    </>
  );
}
