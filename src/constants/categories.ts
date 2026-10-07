// Storefront categories, mirrored from prisma/data/poka-products.json so
// client components (header, footer) can render nav without a DB call.
export const SHOP_CATEGORIES = [
  { name: "Low Poly Collection", slug: "low-poly-collection" },
  { name: "Flexi Collection", slug: "flexi-collection" },
  { name: "Gaming Setup", slug: "gaming-setup" },
  { name: "Desk & Gadgets", slug: "desk-and-gadgets" },
  { name: "Keychains", slug: "keychains" },
  { name: "Anime & Pop Culture", slug: "anime-and-pop-culture" },
  { name: "Home & Décor", slug: "home-and-decor" },
  { name: "Toys & Figures", slug: "toys-and-figures" },
  { name: "Printer Upgrades", slug: "printer-upgrades" },
] as const;

export const NAV_MENU = [
  {
    label: "Collections",
    href: "/shop",
    children: [
      { label: "Low Poly Collection", href: "/shop?category=low-poly-collection" },
      { label: "Flexi Collection", href: "/shop?category=flexi-collection" },
      { label: "Anime & Pop Culture", href: "/shop?category=anime-and-pop-culture" },
      { label: "Toys & Figures", href: "/shop?category=toys-and-figures" },
    ],
  },
  {
    label: "Home & Décor",
    href: "/shop?category=home-and-decor",
  },
  {
    label: "Desk & Gaming",
    href: "/shop?category=desk-and-gadgets",
    children: [
      { label: "Desk & Gadgets", href: "/shop?category=desk-and-gadgets" },
      { label: "Gaming Setup", href: "/shop?category=gaming-setup" },
      { label: "Printer Upgrades", href: "/shop?category=printer-upgrades" },
    ],
  },
  { label: "Keychains", href: "/shop?category=keychains" },
  { label: "Custom Printing", href: "/quote" },
  { label: "New Arrivals", href: "/shop?sort=new" },
] as const;
