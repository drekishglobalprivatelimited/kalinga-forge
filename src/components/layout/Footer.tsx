import Link from "next/link";
import { Layers, Mail, Phone, MapPin } from "lucide-react";

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
  Services: [
    { href: "/quote", label: "Get a Quote" },
    { href: "/services", label: "All Services" },
    { href: "/materials", label: "Materials Guide" },
    { href: "/shop", label: "3D Print Shop" },
  ],
  Company: [
    { href: "/about", label: "About Us" },
    { href: "/blog", label: "Blog" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
  ],
  Legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/refund-policy", label: "Refund Policy" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-white/8 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600">
                <Layers className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold">
                <span className="text-white">Kalinga</span>{" "}
                <span className="gradient-text">Forge</span>
              </span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm mb-6">
              India&apos;s premium 3D printing service. From rapid prototypes to small-batch production, we bring your designs to life with precision and speed.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-white/50">
                <Phone className="h-4 w-4 text-blue-400 shrink-0" />
                <a href={`tel:${process.env.NEXT_PUBLIC_BUSINESS_PHONE}`} className="hover:text-white transition-colors">
                  {process.env.NEXT_PUBLIC_BUSINESS_PHONE ?? "+91 98765 43210"}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/50">
                <Mail className="h-4 w-4 text-blue-400 shrink-0" />
                <a href="mailto:hello@kalingaforge.in" className="hover:text-white transition-colors">
                  hello@kalingaforge.in
                </a>
              </div>
              <div className="flex items-start gap-2 text-sm text-white/50">
                <MapPin className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Bangalore, Karnataka, India</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-white mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} Kalinga Forge. All rights reserved. GST:{" "}
            {process.env.NEXT_PUBLIC_BUSINESS_GST ?? "29AABCU9603R1ZP"}
          </p>
          <div className="flex items-center gap-3">
            <a href="#" aria-label="Instagram" className="text-white/40 hover:text-white transition-colors">
              <InstagramIcon className="h-5 w-5" />
            </a>
            <a href="#" aria-label="Twitter" className="text-white/40 hover:text-white transition-colors">
              <TwitterIcon className="h-5 w-5" />
            </a>
            <a href="#" aria-label="YouTube" className="text-white/40 hover:text-white transition-colors">
              <YoutubeIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
