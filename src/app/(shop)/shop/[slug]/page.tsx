import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Star, Truck, Sparkles, MessageCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { getProduct, getProducts } from "@/lib/catalog";
import { AddToCartWrapper } from "@/components/shop/AddToCartWrapper";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductRail } from "@/components/storefront/ProductRail";
import { SectionHeading } from "@/components/storefront/SectionHeading";
import { BreadcrumbSchema, ProductSchema } from "@/components/shared/StructuredData";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.metaTitle ?? product.name,
    description: product.metaDesc ?? product.shortDesc ?? undefined,
    openGraph: product.images[0] ? { images: [product.images[0].url] } : undefined,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product || !product.isActive) notFound();

  const related = await getProducts({ category: product.category.slug, excludeSlug: product.slug, take: 12 });

  const avgRating =
    product.reviews.length > 0 ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length : null;
  const discount =
    product.comparePrice && product.comparePrice > product.basePrice
      ? Math.round((1 - product.basePrice / product.comparePrice) * 100)
      : null;
  const image = product.images[0]?.url ?? "";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";

  return (
    <div className="bg-white text-ink">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: appUrl || "/" },
          { name: "Shop", url: `${appUrl}/shop` },
          { name: product.category.name, url: `${appUrl}/shop?category=${product.category.slug}` },
          { name: product.name, url: `${appUrl}/shop/${product.slug}` },
        ]}
      />
      <ProductSchema
        product={{
          name: product.name,
          description: product.description,
          image,
          price: product.basePrice,
          slug: product.slug,
        }}
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-5 pb-14">
        <nav className="text-xs text-muted-ink mb-5">
          <Link href="/" className="hover:text-ink">Home</Link>
          <span className="mx-1.5">/</span>
          <Link href={`/shop?category=${product.category.slug}`} className="hover:text-ink">
            {product.category.name}
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-ink">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-14">
          {/* Gallery */}
          <div className="space-y-3">
            {product.images.length > 0 ? (
              product.images.map((img, i) => (
                <div key={img.id} className="relative aspect-square bg-canvas overflow-hidden">
                  <Image
                    src={img.url}
                    alt={img.altText ?? product.name}
                    fill
                    priority={i === 0}
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ))
            ) : (
              <div className="aspect-square bg-canvas" />
            )}
          </div>

          {/* Details */}
          <div className="md:sticky md:top-24 md:self-start">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-ink mb-2">{product.category.name}</p>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight leading-tight mb-3">{product.name}</h1>

            {avgRating && (
              <div className="flex items-center gap-1.5 mb-4 text-sm">
                <Star className="h-4 w-4 fill-ink text-ink" />
                <span className="font-medium">{avgRating.toFixed(1)}</span>
                <span className="text-muted-ink">({product.reviews.length} reviews)</span>
              </div>
            )}

            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-semibold">{formatCurrency(product.basePrice)}</span>
              {discount && (
                <>
                  <span className="text-base text-muted-ink line-through">{formatCurrency(product.comparePrice!)}</span>
                  <span className="text-sm font-medium text-forge">{discount}% off</span>
                </>
              )}
            </div>
            <p className="text-xs text-muted-ink mt-1 mb-6">Price excludes GST, added at checkout.</p>

            {product.shortDesc && <p className="text-sm text-ink/80 leading-relaxed mb-6">{product.shortDesc}</p>}

            <AddToCartWrapper
              productId={product.id}
              name={product.name}
              slug={product.slug}
              price={product.basePrice}
              image={image}
              sku={product.sku}
              size="lg"
            />

            <ul className="grid grid-cols-3 gap-2 mt-6 text-center">
              {[
                { icon: Sparkles, label: "Printed to order" },
                { icon: Truck, label: "Ships across India" },
                { icon: MessageCircle, label: "Custom requests" },
              ].map(({ icon: Icon, label }) => (
                <li key={label} className="bg-canvas px-2 py-4">
                  <Icon className="h-5 w-5 mx-auto mb-1.5" strokeWidth={1.25} />
                  <span className="text-[11px] sm:text-xs">{label}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 border-t border-line divide-y divide-line">
              <details open className="group py-4">
                <summary className="flex justify-between cursor-pointer list-none text-sm font-medium">
                  Description
                  <span className="group-open:rotate-45 transition-transform text-lg leading-none">+</span>
                </summary>
                <p className="mt-3 text-sm text-ink/75 leading-relaxed whitespace-pre-line">{product.description}</p>
              </details>
              <details className="group py-4">
                <summary className="flex justify-between cursor-pointer list-none text-sm font-medium">
                  Material &amp; care
                  <span className="group-open:rotate-45 transition-transform text-lg leading-none">+</span>
                </summary>
                <div className="mt-3 text-sm text-ink/75 leading-relaxed space-y-1">
                  {product.material && <p>Material: {product.material}</p>}
                  {product.printTime && <p>Print time: {product.printTime}</p>}
                  <p>Wipe clean with a dry or slightly damp cloth. Keep away from direct heat and prolonged strong sunlight.</p>
                </div>
              </details>
              <details className="group py-4">
                <summary className="flex justify-between cursor-pointer list-none text-sm font-medium">
                  Shipping
                  <span className="group-open:rotate-45 transition-transform text-lg leading-none">+</span>
                </summary>
                <p className="mt-3 text-sm text-ink/75 leading-relaxed">
                  Each piece is printed after you order, then packed and shipped across India. Need it customised or in a
                  different size?{" "}
                  <Link href="/contact" className="underline underline-offset-2">
                    Get in touch
                  </Link>
                  .
                </p>
              </details>
              <p className="py-4 text-xs text-muted-ink">SKU: {product.sku}</p>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="max-w-[1400px] mx-auto pb-20">
          <SectionHeading title="You may also like" href={`/shop?category=${product.category.slug}`} />
          <ProductRail>
            {related.map((p) => (
              <div key={p.id} className="snap-start shrink-0 w-[46%] sm:w-[31%] lg:w-[23%] xl:w-[19%]">
                <ProductCard product={p} />
              </div>
            ))}
          </ProductRail>
        </section>
      )}
    </div>
  );
}
