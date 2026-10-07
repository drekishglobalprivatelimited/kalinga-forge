"use client";

import { useCartStore } from "@/store/cartStore";
import { cn } from "@/lib/utils";

interface Props {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  sku: string;
  variantId?: string;
  size?: "sm" | "lg";
  className?: string;
}

export function AddToCartWrapper({ productId, name, slug, price, image, sku, variantId, size = "sm", className }: Props) {
  const addItem = useCartStore((s) => s.addItem);

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    addItem({ productId, variantId, name, slug, image, price, sku });
  }

  return (
    <button
      onClick={handleAdd}
      aria-label={`Add ${name} to bag`}
      className={cn(
        "w-full font-medium tracking-wide transition-colors",
        size === "sm"
          ? "py-2.5 text-xs border border-ink text-ink hover:bg-ink hover:text-white"
          : "py-4 text-sm bg-ink text-white hover:bg-black",
        className
      )}
    >
      ADD TO BAG
    </button>
  );
}
