import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

const productInclude = {
  images: { orderBy: { sortOrder: "asc" }, take: 1 },
  category: { select: { name: true, slug: true } },
} satisfies Prisma.ProductInclude;

export type StorefrontProduct = Prisma.ProductGetPayload<{ include: typeof productInclude }>;

export type ProductSort = "featured" | "new" | "price-asc" | "price-desc";

const ORDER_BY: Record<ProductSort, Prisma.ProductOrderByWithRelationInput[]> = {
  featured: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  new: [{ createdAt: "desc" }],
  "price-asc": [{ basePrice: "asc" }],
  "price-desc": [{ basePrice: "desc" }],
};

// Storefront reads return empty results when the database is unreachable,
// so pages still render (e.g. builds without DATABASE_URL).
export async function getProducts(opts: {
  category?: string;
  q?: string;
  featured?: boolean;
  sort?: ProductSort;
  take?: number;
  excludeSlug?: string;
} = {}): Promise<StorefrontProduct[]> {
  try {
    return await prisma.product.findMany({
      where: {
        isActive: true,
        ...(opts.category ? { category: { slug: opts.category } } : {}),
        ...(opts.featured ? { isFeatured: true } : {}),
        ...(opts.excludeSlug ? { slug: { not: opts.excludeSlug } } : {}),
        ...(opts.q
          ? {
              OR: [
                { name: { contains: opts.q, mode: "insensitive" } },
                { shortDesc: { contains: opts.q, mode: "insensitive" } },
                { tags: { has: opts.q.toLowerCase() } },
              ],
            }
          : {}),
      },
      include: productInclude,
      orderBy: ORDER_BY[opts.sort ?? "featured"],
      take: opts.take,
    });
  } catch {
    return [];
  }
}

export async function getProduct(slug: string) {
  try {
    return await prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        category: { select: { name: true, slug: true } },
        reviews: { select: { rating: true } },
      },
    });
  } catch {
    return null;
  }
}

// Categories with a cover image taken from their first featured product.
export async function getCategoriesWithCover() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        _count: { select: { products: { where: { isActive: true } } } },
        products: {
          where: { isActive: true, images: { some: {} } },
          orderBy: [{ isFeatured: "desc" }, { createdAt: "asc" }],
          take: 1,
          select: { images: { orderBy: { sortOrder: "asc" }, take: 1, select: { url: true } } },
        },
      },
    });
    return categories
      .map((c) => ({
        name: c.name,
        slug: c.slug,
        description: c.description,
        count: c._count.products,
        image: c.image ?? c.products[0]?.images[0]?.url ?? null,
      }))
      // Hide empty categories (e.g. leftovers from older seed data).
      .filter((c) => c.count > 0);
  } catch {
    return [];
  }
}
