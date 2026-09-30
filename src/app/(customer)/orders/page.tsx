import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from "@/lib/utils";
import { Package, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Orders" };

export default async function OrdersPage() {
  const session = await auth();
  const orders = await prisma.order.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
    include: { payment: true, invoice: true },
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Orders</h1>
        <p className="text-white/50 mt-1">{orders.length} order{orders.length !== 1 ? "s" : ""}</p>
      </div>

      {orders.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center">
          <Package className="h-10 w-10 text-white/20 mx-auto mb-4" />
          <p className="text-white/50 mb-4">No orders yet</p>
          <Link href="/shop" className="text-blue-400 hover:underline text-sm">Browse products →</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <Link key={o.id} href={`/orders/${o.id}`}>
              <div className="glass rounded-2xl p-5 hover:border-white/15 transition-colors group">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">{o.orderNo}</p>
                    <p className="text-xs text-white/40">
                      {formatDate(o.createdAt)} · {o.type === "QUOTE" ? "Custom Print" : "Product Order"}
                    </p>
                    {o.trackingNumber && (
                      <p className="text-xs text-blue-400 mt-1">Tracking: {o.trackingNumber}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">{formatCurrency(o.total)}</p>
                      <p className="text-xs text-white/30">incl. GST</p>
                    </div>
                    <span className={`text-xs border rounded-full px-2.5 py-0.5 ${getStatusColor(o.status)}`}>
                      {getStatusLabel(o.status)}
                    </span>
                    <ArrowRight className="h-4 w-4 text-white/20 group-hover:text-white/50 transition-colors" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
