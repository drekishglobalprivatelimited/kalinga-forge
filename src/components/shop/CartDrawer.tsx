"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { X, ShoppingBag, Plus, Minus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50"
            onClick={closeCart}
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white text-ink flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between h-16 px-5 border-b border-line">
              <h2 className="text-sm font-semibold tracking-[0.12em] uppercase">
                Your bag ({items.reduce((n, i) => n + i.quantity, 0)})
              </h2>
              <button onClick={closeCart} className="p-1.5 hover:opacity-60 transition-opacity" aria-label="Close cart">
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-8">
                  <ShoppingBag className="h-12 w-12 text-line mb-4" strokeWidth={1} />
                  <p className="font-medium mb-1">Your bag is empty</p>
                  <p className="text-sm text-muted-ink mb-6">Find something you love in our collections.</p>
                  <Link
                    href="/shop"
                    onClick={closeCart}
                    className="px-8 py-3 bg-ink text-white text-sm font-medium hover:bg-black transition-colors"
                  >
                    Shop now
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-line">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-4 p-5">
                      <Link
                        href={`/shop/${item.slug}`}
                        onClick={closeCart}
                        className="w-20 h-20 bg-canvas overflow-hidden shrink-0"
                      >
                        {item.image && (
                          <Image src={item.image} alt={item.name} width={80} height={80} className="w-full h-full object-cover" />
                        )}
                      </Link>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-snug line-clamp-2">{item.name}</p>
                        <p className="text-sm mt-1">{formatCurrency(item.price)}</p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border border-line">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-canvas"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-canvas"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-xs text-muted-ink underline underline-offset-2 hover:text-ink"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-5 border-t border-line space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-ink">Subtotal</span>
                  <span>{formatCurrency(subtotal())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-ink">GST (18%)</span>
                  <span>{formatCurrency(subtotal() * 0.18)}</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t border-line">
                  <span>Total</span>
                  <span>{formatCurrency(subtotal() * 1.18)}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="block w-full py-3.5 bg-ink text-white text-sm font-medium text-center tracking-wide hover:bg-black transition-colors"
                >
                  CHECKOUT
                </Link>
                <button onClick={closeCart} className="block w-full text-center text-xs text-muted-ink underline underline-offset-2 hover:text-ink">
                  Continue shopping
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
