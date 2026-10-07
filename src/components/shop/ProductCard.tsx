import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { AddToCartWrapper } from "@/components/shop/AddToCartWrapper";
import type { StorefrontProduct } from "@/lib/catalog";

export function ProductCard({ product, badge }: { product: StorefrontProduct; badge?: string }) {
  const image = product.images[0]?.url;
  const discount =
    product.comparePrice && product.comparePrice > product.basePrice
      ? Math.round((1 - product.basePrice / product.comparePrice) * 100)
      : null;
  const label = badge ?? (product.isFeatured ? "Bestseller" : null);

  return (
    <div className="group flex flex-col">
      <Link href={`/shop/${product.slug}`} className="relative block aspect-square bg-canvas overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-ink">No image</div>
        )}
        {label && (
          <span className="absolute top-3 left-3 bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink">
            {label}
          </span>
        )}
      </Link>

      <div className="flex flex-col flex-1 pt-3">
        <Link href={`/shop/${product.slug}`} className="text-[13px] sm:text-sm text-ink leading-snug line-clamp-2 hover:underline underline-offset-2">
          {product.name}
        </Link>
        <p className="text-[11px] text-muted-ink mt-1">{product.category.name}</p>
        <div className="flex items-baseline gap-2 mt-1.5 mb-3">
          <span className="text-sm font-semibold text-ink">{formatCurrency(product.basePrice)}</span>
          {discount && (
            <>
              <span className="text-xs text-muted-ink line-through">{formatCurrency(product.comparePrice!)}</span>
              <span className="text-xs font-medium text-forge">{discount}% off</span>
            </>
          )}
        </div>
        <div className="mt-auto">
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
}
