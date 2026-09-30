import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Orders" };

const STATUSES = [
  "ALL", "PENDING", "PAYMENT_PENDING", "PAID", "IN_PRODUCTION",
  "QUALITY_CHECK", "SHIPPED", "DELIVERED", "COMPLETED", "CANCELLED", "REFUNDED",
];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const status = params.status && params.status !== "ALL" ? params.status : undefined;

  const orders = await prisma.order.findMany({
    where: status ? { status: status as never } : {},
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      items: { select: { id: true } },
      payment: { select: { status: true } },
    },
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Orders</h1>
        <p className="text-white/50 mt-1">{orders.length} total</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={s === "ALL" ? "/admin/orders" : `/admin/orders?status=${s}`}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              (s === "ALL" && !status) || s === status
                ? "bg-blue-600 border-blue-600 text-white"
                : "border-white/15 text-white/50 hover:border-white/30 hover:text-white"
            }`}
          >
            {s.replace(/_/g, " ")}
          </Link>
        ))}
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                {["Order No", "Customer", "Type", "Items", "Status", "Payment", "Total", "Date"].map((h) => (
                  <th key={h} className="text-left p-4 text-xs font-semibold text-white/40 uppercase tracking-wider first:rounded-tl-2xl last:rounded-tr-2xl">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="p-4 font-mono text-xs text-blue-400">{o.orderNo}</td>
                  <td className="p-4 text-white/70">{o.user?.name ?? "—"}</td>
                  <td className="p-4 text-white/60">{o.type}</td>
                  <td className="p-4 text-white/60">{o.items.length}</td>
                  <td className="p-4">
                    <span className={`text-xs border rounded-full px-2 py-0.5 ${getStatusColor(o.status)}`}>
                      {getStatusLabel(o.status)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs border rounded-full px-2 py-0.5 ${getStatusColor(o.payment?.status ?? "PENDING")}`}>
                      {getStatusLabel(o.payment?.status ?? "PENDING")}
                    </span>
                  </td>
                  <td className="p-4 text-white/80">{formatCurrency(o.total)}</td>
                  <td className="p-4 text-white/40 text-xs">{formatDate(o.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
