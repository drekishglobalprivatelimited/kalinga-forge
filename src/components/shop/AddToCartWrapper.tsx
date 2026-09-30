"use client";

import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface Props {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  sku: string;
  variantId?: string;
}

export function AddToCartWrapper({ productId, name, slug, price, image, sku, variantId }: Props) {
  const addItem = useCartStore((s) => s.addItem);

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    addItem({ productId, variantId, name, slug, image, price, sku });
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="h-8 w-8 rounded-lg shrink-0"
      onClick={handleAdd}
      aria-label={`Add ${name} to cart`}
    >
      <ShoppingCart className="h-4 w-4" />
    </Button>
  );
}
