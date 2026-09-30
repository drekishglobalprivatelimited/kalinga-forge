import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { ShoppingCart, Star } from "lucide-react";
import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/shared/StructuredData";
import { AddToCartWrapper } from "@/components/shop/AddToCartWrapper";

export const metadata: Metadata = {
  title: "3D Print Shop — Ready-Made Products",
  description:
    "Browse our collection of 3D printed products. Gifts, home decor, engineering parts, collectibles, and more. Ships across India.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const params = await searchParams;

  type Category = Awaited<ReturnType<typeof prisma.category.findMany>>[number];
  type Product = Awaited<ReturnType<typeof prisma.product.findMany<{
    include: { images: true; category: true; reviews: true };
  }>>>[number];

  let categories: Category[] = [];
  let products: Product[] = [];
  let dbError = false;

  try {
    const result = await Promise.all([
      prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.product.findMany({
        where: {
          isActive: true,
          ...(params.category ? { category: { slug: params.category } } : {}),
          ...(params.q
            ? {
                OR: [
                  { name: { contains: params.q, mode: "insensitive" } },
                  { shortDesc: { contains: params.q, mode: "insensitive" } },
                ],
              }
            : {}),
        },
        include: {
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
          category: { select: { name: true, slug: true } },
          reviews: { select: { rating: true } },
        },
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      }),
    ]);
    categories = result[0] as Category[];
    products = result[1] as Product[];
  } catch {
    dbError = true;
  }

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: process.env.NEXT_PUBLIC_APP_URL ?? "/" },
          { name: "Shop", url: `${process.env.NEXT_PUBLIC_APP_URL}/shop` },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">
            3D Print <span className="gradient-text">Shop</span>
          </h1>
          <p className="text-white/50">{products.length} products available</p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            href="/shop"
            className={`text-sm px-4 py-2 rounded-full border transition-colors ${
              !params.category
                ? "bg-blue-600 border-blue-600 text-white"
                : "border-white/15 text-white/60 hover:border-white/30 hover:text-white"
            }`}
          >
            All Products
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop?category=${cat.slug}`}
              className={`text-sm px-4 py-2 rounded-full border transition-colors ${
                params.category === cat.slug
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "border-white/15 text-white/60 hover:border-white/30 hover:text-white"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Product grid */}
        {dbError ? (
          <div className="glass rounded-2xl p-20 text-center">
            <ShoppingCart className="h-10 w-10 text-white/20 mx-auto mb-4" />
            <p className="text-white font-medium mb-2">Shop coming soon</p>
            <p className="text-white/40 text-sm">Products are being added. Check back shortly or get a custom quote.</p>
          </div>
        ) : products.length === 0 ? (
          <div className="glass rounded-2xl p-20 text-center">
            <ShoppingCart className="h-10 w-10 text-white/20 mx-auto mb-4" />
            <p className="text-white/50">No products found</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product) => {
              const avgRating =
                product.reviews.length > 0
                  ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
                  : null;
              const image = product.images[0]?.url;

              return (
                <div key={product.id} className="glass rounded-2xl overflow-hidden group hover:border-white/15 transition-all duration-300">
                  <Link href={`/shop/${product.slug}`}>
                    <div className="aspect-square bg-white/5 overflow-hidden">
                      {image ? (
                        <Image
                          src={image}
                          alt={product.name}
                          width={400}
                          height={400}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">🔩</div>
                      )}
                    </div>
                  </Link>
                  <div className="p-4">
                    <p className="text-xs text-white/40 mb-1">{product.category.name}</p>
                    <Link href={`/shop/${product.slug}`}>
                      <h3 className="text-sm font-semibold text-white hover:text-blue-400 transition-colors line-clamp-2 mb-2">
                        {product.name}
                      </h3>
                    </Link>
                    {avgRating && (
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs text-white/60">{avgRating.toFixed(1)} ({product.reviews.length})</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <div>
                        <span className="text-base font-bold text-white">{formatCurrency(product.basePrice)}</span>
                        {product.comparePrice && (
                          <span className="text-xs text-white/30 line-through ml-1">{formatCurrency(product.comparePrice)}</span>
                        )}
                      </div>
                      <AddToCartWrapper
                        productId={product.id}
                        name={product.name}
                        slug={product.slug}
                        price={product.basePrice}
                        image={image ?? ""}
                        sku={product.sku}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
