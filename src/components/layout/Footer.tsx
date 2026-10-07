import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { SHOP_CATEGORIES } from "@/constants/categories";

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  );
}

const LINKS = {
  Shop: [
    ...SHOP_CATEGORIES.slice(0, 6).map((c) => ({ href: `/shop?category=${c.slug}`, label: c.name })),
    { href: "/shop", label: "Shop all" },
  ],
  Services: [
    { href: "/quote", label: "Get a Quote" },
    { href: "/services", label: "All Services" },
    { href: "/materials", label: "Materials Guide" },
    { href: "/shop", label: "3D Print Shop" },
  ],
  "Know Us": [
    { href: "/about", label: "About Us" },
    { href: "/blog", label: "Blog" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
  ],
  "Help Desk": [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/refund-policy", label: "Refund Policy" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-canvas text-ink border-t border-line">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 pt-14 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-10">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="inline-block font-semibold tracking-[0.18em] text-base mb-4">
              KALINGA<span className="text-forge">·</span>FORGE
            </Link>
            <p className="text-sm text-muted-ink leading-relaxed max-w-sm mb-6">
              3D printed décor, collectibles and everyday objects — printed to order. Plus custom 3D printing for
              prototypes, parts and small-batch production.
            </p>
            <div className="space-y-2.5 text-sm text-muted-ink">
              <a href={`tel:${process.env.NEXT_PUBLIC_BUSINESS_PHONE}`} className="flex items-center gap-2 hover:text-ink transition-colors">
                <Phone className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                {process.env.NEXT_PUBLIC_BUSINESS_PHONE ?? "+91 98765 43210"}
              </a>
              <a href="mailto:hello@kalingaforge.in" className="flex items-center gap-2 hover:text-ink transition-colors">
                <Mail className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                hello@kalingaforge.in
              </a>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                Bangalore, Karnataka, India
              </p>
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-4">{category}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-[13px] text-muted-ink hover:text-ink transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-line flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-ink text-center sm:text-left">
            © {new Date().getFullYear()} Kalinga Forge. All rights reserved. GST:{" "}
            {process.env.NEXT_PUBLIC_BUSINESS_GST ?? "29AABCU9603R1ZP"}
          </p>
          <div className="flex items-center gap-4">
            <a href="#" aria-label="Instagram" className="text-muted-ink hover:text-ink transition-colors">
              <InstagramIcon className="h-5 w-5" />
            </a>
            <a href="#" aria-label="Twitter" className="text-muted-ink hover:text-ink transition-colors">
              <TwitterIcon className="h-5 w-5" />
            </a>
            <a href="#" aria-label="YouTube" className="text-muted-ink hover:text-ink transition-colors">
              <YoutubeIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
