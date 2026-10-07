import Link from "next/link";
import type { Metadata } from "next";
import { ShoppingBag } from "lucide-react";
import { BreadcrumbSchema } from "@/components/shared/StructuredData";
import { ProductCard } from "@/components/shop/ProductCard";
import { SortSelect } from "@/components/shop/SortSelect";
import { getCategoriesWithCover, getProducts, type ProductSort } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Shop 3D Printed Products",
  description:
    "Browse 3D printed home décor, low poly sculptures, flexi toys, keychains, desk and gaming accessories. Printed to order and shipped across India.",
};

const SORTS: ProductSort[] = ["featured", "new", "price-asc", "price-desc"];

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const sort = SORTS.includes(params.sort as ProductSort) ? (params.sort as ProductSort) : "featured";

  const [categories, products] = await Promise.all([
    getCategoriesWithCover(),
    getProducts({ category: params.category, q: params.q, sort }),
  ]);

  const active = categories.find((c) => c.slug === params.category);
  const title = params.q ? `Results for “${params.q}”` : active?.name ?? "Shop All";
  const subtitle = params.q ? null : active?.description ?? "Décor, collectibles and everyday objects, printed to order.";

  const hrefFor = (category?: string) => {
    const qs = new URLSearchParams();
    if (category) qs.set("category", category);
    if (sort !== "featured") qs.set("sort", sort);
    const s = qs.toString();
    return s ? `/shop?${s}` : "/shop";
  };

  return (
    <div className="bg-white text-ink">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: process.env.NEXT_PUBLIC_APP_URL ?? "/" },
          { name: "Shop", url: `${process.env.NEXT_PUBLIC_APP_URL}/shop` },
        ]}
      />

      {/* Page header */}
      <div className="bg-canvas">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <nav className="text-xs text-muted-ink mb-3">
            <Link href="/" className="hover:text-ink">Home</Link>
            <span className="mx-1.5">/</span>
            <Link href="/shop" className="hover:text-ink">Shop</Link>
            {active && (
              <>
                <span className="mx-1.5">/</span>
                <span className="text-ink">{active.name}</span>
              </>
            )}
          </nav>
          <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-muted-ink mt-2 max-w-xl">{subtitle}</p>}
        </div>
      </div>

      {/* Category chips */}
      <div className="border-b border-line sticky top-16 z-30 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex items-center gap-4">
          <div className="no-scrollbar flex-1 flex gap-2 overflow-x-auto py-3">
            <Link
              href={hrefFor()}
              className={`shrink-0 px-4 py-1.5 text-[13px] border transition-colors ${
                !params.category ? "bg-ink border-ink text-white" : "border-line text-ink hover:border-ink"
              }`}
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={hrefFor(cat.slug)}
                className={`shrink-0 px-4 py-1.5 text-[13px] border transition-colors ${
                  params.category === cat.slug ? "bg-ink border-ink text-white" : "border-line text-ink hover:border-ink"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
          <SortSelect value={sort} />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <p className="text-xs text-muted-ink mb-6">{products.length} products</p>

        {products.length === 0 ? (
          <div className="py-24 text-center">
            <ShoppingBag className="h-10 w-10 text-line mx-auto mb-4" strokeWidth={1} />
            <p className="font-medium mb-1">No products found</p>
            <p className="text-sm text-muted-ink mb-6">Try another category or search term.</p>
            <Link href="/shop" className="inline-block px-8 py-3 bg-ink text-white text-sm font-medium">
              Shop all
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
