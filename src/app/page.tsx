import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Truck, Sparkles, ShieldCheck, Upload } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/lead/WhatsAppFloat";
import { FAQSchema } from "@/components/shared/StructuredData";
import { HeroCarousel } from "@/components/storefront/HeroCarousel";
import { ProductRail } from "@/components/storefront/ProductRail";
import { SectionHeading } from "@/components/storefront/SectionHeading";
import { ProductCard } from "@/components/shop/ProductCard";
import { getCategoriesWithCover, getProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Kalinga Forge — 3D Printed Décor, Collectibles & Custom Prints",
  description:
    "Shop 3D printed home décor, low poly sculptures, flexi toys, keychains and desk gear — printed to order in India. Or upload your own design for a custom 3D printing quote.",
  alternates: { canonical: "/" },
};

// Product data changes in the admin; render per request.
export const dynamic = "force-dynamic";

const HOME_FAQS = [
  {
    question: "What file formats do you accept for 3D printing?",
    answer:
      "We accept STL, STEP, OBJ, and 3MF file formats. STL is the most common and recommended format.",
  },
  {
    question: "How long does 3D printing take in India?",
    answer:
      "Standard delivery is 5–7 business days. Express is 2–3 days. Urgent orders get next business day delivery.",
  },
  {
    question: "What materials are available for 3D printing?",
    answer:
      "We offer PLA, PLA+, PETG, ABS, ASA, TPU, Nylon, Carbon Fiber, and Resin (SLA).",
  },
  {
    question: "How do I get a quote for custom 3D printing?",
    answer:
      "Upload your 3D file, select material and specs, get an instant estimate. Our team sends a final quote within 24 hours.",
  },
  {
    question: "Do you do small batch production?",
    answer:
      "Yes — 1 to 10,000 units with quantity discounts from 5 units. Contact us for bulk pricing.",
  },
];

const USPS = [
  { icon: Sparkles, title: "Printed to order", body: "Every piece made fresh for you" },
  { icon: Truck, title: "Ships across India", body: "Packed safe, tracked to your door" },
  { icon: ShieldCheck, title: "Secure payments", body: "UPI, cards & netbanking" },
  { icon: Upload, title: "Custom prints", body: "Upload your STL for a quote" },
];

export default async function HomePage() {
  const [allCategories, bestsellers, newArrivals, homeDecor, flexi] = await Promise.all([
    getCategoriesWithCover(),
    getProducts({ featured: true, take: 12 }),
    getProducts({ sort: "new", take: 8 }),
    getProducts({ category: "home-and-decor", take: 12 }),
    getProducts({ category: "flexi-collection", take: 12 }),
  ]);
  const categories = allCategories.filter((c) => c.image);

  return (
    <>
      <Header />
      <main className="bg-white text-ink">
        <HeroCarousel />

        {/* USP strip */}
        <section className="border-b border-line">
          <div className="max-w-[1400px] mx-auto grid grid-cols-2 lg:grid-cols-4">
            {USPS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex items-center gap-3 px-4 sm:px-6 py-5">
                <Icon className="h-6 w-6 shrink-0 text-ink" strokeWidth={1.25} />
                <div>
                  <p className="text-[13px] font-medium">{title}</p>
                  <p className="text-[11px] sm:text-xs text-muted-ink">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Shop by category */}
        {categories.length > 0 && (
          <section className="max-w-[1400px] mx-auto pt-14 sm:pt-20">
            <SectionHeading title="Shop by Category" href="/shop" />
            <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-9 gap-3 sm:gap-5 px-4 sm:px-6">
              {categories.map((cat) => (
                <Link key={cat.slug} href={`/shop?category=${cat.slug}`} className="group text-center">
                  <div className="relative aspect-square bg-canvas overflow-hidden mb-2.5">
                    {cat.image && (
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        sizes="(min-width: 1024px) 11vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <p className="text-[12px] sm:text-[13px] leading-tight group-hover:underline underline-offset-2">{cat.name}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Bestsellers */}
        {bestsellers.length > 0 && (
          <section className="max-w-[1400px] mx-auto pt-14 sm:pt-20">
            <SectionHeading title="Bestsellers" subtitle="The pieces everyone's adding to their shelves" href="/shop" />
            <ProductRail>
              {bestsellers.map((p) => (
                <div key={p.id} className="snap-start shrink-0 w-[46%] sm:w-[31%] lg:w-[23%] xl:w-[19%]">
                  <ProductCard product={p} />
                </div>
              ))}
            </ProductRail>
          </section>
        )}

        {/* Collection banners */}
        <section className="max-w-[1400px] mx-auto pt-14 sm:pt-20 px-4 sm:px-6 grid md:grid-cols-2 gap-4 sm:gap-5">
          {[
            {
              title: "Desk & Gaming",
              body: "Organisers, GPU supports and gadgets for a cleaner setup.",
              href: "/shop?category=desk-and-gadgets",
              image: "/products/date-keeper-desk-calendar.jpg",
            },
            {
              title: "Low Poly Collection",
              body: "Faceted sculptures with crisp geometric edges.",
              href: "/shop?category=low-poly-collection",
              image: "/products/low-poly-labrador.jpg",
            },
          ].map((b) => (
            <Link key={b.href} href={b.href} className="group relative block aspect-[4/3] sm:aspect-[16/10] overflow-hidden bg-canvas">
              <Image
                src={b.image}
                alt=""
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute left-0 bottom-0 p-6 sm:p-8 text-white">
                <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-1.5">{b.title}</h3>
                <p className="text-sm text-white/85 mb-4 max-w-sm">{b.body}</p>
                <span className="inline-block text-xs font-medium tracking-[0.12em] border-b border-white pb-0.5">SHOP NOW</span>
              </div>
            </Link>
          ))}
        </section>

        {/* Home & Décor rail */}
        {homeDecor.length > 0 && (
          <section className="max-w-[1400px] mx-auto pt-14 sm:pt-20">
            <SectionHeading title="Home & Décor" subtitle="Vases, planters and accents" href="/shop?category=home-and-decor" />
            <ProductRail>
              {homeDecor.map((p) => (
                <div key={p.id} className="snap-start shrink-0 w-[46%] sm:w-[31%] lg:w-[23%] xl:w-[19%]">
                  <ProductCard product={p} badge={p.isFeatured ? "Bestseller" : undefined} />
                </div>
              ))}
            </ProductRail>
          </section>
        )}

        {/* Custom printing banner */}
        <section className="max-w-[1400px] mx-auto pt-14 sm:pt-20 px-4 sm:px-6">
          <div className="bg-ink text-white grid md:grid-cols-2 items-center">
            <div className="p-8 sm:p-12 lg:p-16">
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/60 mb-4">Custom 3D Printing</p>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight mb-4">
                Got a design?
                <br />
                We&apos;ll forge it.
              </h2>
              <p className="text-sm text-white/70 max-w-md mb-8">
                Prototypes, replacement parts or one-off gifts. Upload your STL, STEP or OBJ file, choose from 9 materials
                and get an instant estimate — final quote within 24 hours.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/quote" className="px-8 py-3.5 bg-white text-ink text-sm font-medium hover:bg-canvas transition-colors">
                  Upload your design
                </Link>
                <Link href="/contact" className="px-8 py-3.5 border border-white/40 text-sm font-medium hover:border-white transition-colors">
                  Talk to us
                </Link>
              </div>
            </div>
            <div className="relative h-72 md:h-full md:min-h-[420px]">
              <Image src="/products/ad5x-enclosure.jpg" alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
            </div>
          </div>
        </section>

        {/* Flexi rail */}
        {flexi.length > 0 && (
          <section className="max-w-[1400px] mx-auto pt-14 sm:pt-20">
            <SectionHeading title="Flexi Collection" subtitle="Print-in-place, fully articulated" href="/shop?category=flexi-collection" />
            <ProductRail>
              {flexi.map((p) => (
                <div key={p.id} className="snap-start shrink-0 w-[46%] sm:w-[31%] lg:w-[23%] xl:w-[19%]">
                  <ProductCard product={p} />
                </div>
              ))}
            </ProductRail>
          </section>
        )}

        {/* New arrivals grid */}
        {newArrivals.length > 0 && (
          <section className="max-w-[1400px] mx-auto pt-14 sm:pt-20">
            <SectionHeading title="New Arrivals" href="/shop?sort=new" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-5 px-4 sm:px-6">
              {newArrivals.map((p) => (
                <ProductCard key={p.id} product={p} badge="New" />
              ))}
            </div>
          </section>
        )}

        {/* Brand story */}
        <section className="max-w-3xl mx-auto text-center px-6 py-20 sm:py-28">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-ink mb-4">The Kalinga Forge way</p>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight leading-snug mb-5">
            Designed with care, printed layer by layer, finished by hand.
          </h2>
          <p className="text-sm sm:text-base text-muted-ink leading-relaxed">
            Every Kalinga Forge piece is printed to order in our studio, inspected, and packed for the journey to you.
            No warehouses full of stock — just thoughtful objects made when you ask for them.
          </p>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
      <FAQSchema faqs={HOME_FAQS} />
    </>
  );
}
