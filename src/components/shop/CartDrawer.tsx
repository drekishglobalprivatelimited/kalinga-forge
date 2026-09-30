"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { X, ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-zinc-950 border-l border-white/10 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-white" />
                <h2 className="font-semibold text-white">Cart ({items.length})</h2>
              </div>
              <button onClick={closeCart} className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <ShoppingCart className="h-12 w-12 text-white/10 mb-4" />
                  <p className="text-white/40">Your cart is empty</p>
                  <Link href="/shop" onClick={closeCart}>
                    <Button variant="ghost" size="sm" className="mt-4">Browse Products</Button>
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="glass rounded-xl p-3 flex gap-3">
                    <div className="w-16 h-16 rounded-lg bg-white/5 overflow-hidden shrink-0">
                      {item.image && (
                        <Image src={item.image} alt={item.name} width={64} height={64} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{item.name}</p>
                      <p className="text-xs text-white/40 mt-0.5">{formatCurrency(item.price)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                        >
                          <Minus className="h-3 w-3 text-white" />
                        </button>
                        <span className="text-sm text-white w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                        >
                          <Plus className="h-3 w-3 text-white" />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button onClick={() => removeItem(item.id)} className="text-white/30 hover:text-red-400 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <span className="text-sm font-semibold text-white">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-4 border-t border-white/8 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Subtotal</span>
                  <span className="font-bold text-white">{formatCurrency(subtotal())}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-white/30">
                  <span>GST (18%)</span>
                  <span>{formatCurrency(subtotal() * 0.18)}</span>
                </div>
                <div className="flex justify-between items-center border-t border-white/8 pt-2">
                  <span className="font-semibold text-white">Total</span>
                  <span className="text-lg font-bold gradient-text">{formatCurrency(subtotal() * 1.18)}</span>
                </div>
                <Link href="/checkout" onClick={closeCart}>
                  <Button variant="gradient" className="w-full">Proceed to Checkout</Button>
                </Link>
                <Link href="/shop" onClick={closeCart}>
                  <Button variant="ghost" size="sm" className="w-full">Continue Shopping</Button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
