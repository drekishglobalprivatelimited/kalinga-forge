import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from "@/lib/utils";
import { FileText, Package, Upload, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [quotes, orders] = await Promise.all([
    prisma.quoteRequest.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { payment: true },
    }),
  ]);

  const stats = {
    totalQuotes: await prisma.quoteRequest.count({ where: { userId } }),
    totalOrders: await prisma.order.count({ where: { userId } }),
    activeOrders: await prisma.order.count({
      where: { userId, status: { in: ["PAID", "IN_PRODUCTION", "QUALITY_CHECK", "SHIPPED"] } },
    }),
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Welcome back, {session?.user?.name?.split(" ")[0]}! 👋
        </h1>
        <p className="text-white/50 mt-1">Here&apos;s an overview of your account.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Quotes", value: stats.totalQuotes, icon: <FileText className="h-5 w-5 text-blue-400" />, href: "/quotes" },
          { label: "Total Orders", value: stats.totalOrders, icon: <Package className="h-5 w-5 text-violet-400" />, href: "/orders" },
          { label: "Active Orders", value: stats.activeOrders, icon: <Package className="h-5 w-5 text-green-400" />, href: "/orders" },
        ].map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <div className="glass rounded-2xl p-5 hover:border-white/15 transition-colors">
              <div className="flex items-center gap-2 mb-2">{stat.icon}<span className="text-xs text-white/50">{stat.label}</span></div>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick action */}
      <div className="glass rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-blue-500/20 bg-blue-500/5">
        <div>
          <p className="font-semibold text-white">Ready to print something new?</p>
          <p className="text-sm text-white/50">Upload your STL or STEP file for an instant quote</p>
        </div>
        <Link href="/quote">
          <Button variant="gradient" size="sm" className="gap-2 shrink-0">
            <Upload className="h-4 w-4" />
            New Quote
          </Button>
        </Link>
      </div>

      {/* Recent Quotes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white">Recent Quotes</h2>
          <Link href="/quotes" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {quotes.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center">
            <FileText className="h-8 w-8 text-white/20 mx-auto mb-3" />
            <p className="text-white/50 text-sm">No quotes yet</p>
            <Link href="/quote" className="text-sm text-blue-400 hover:underline mt-2 block">
              Get your first quote →
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {quotes.map((q) => (
              <Link key={q.id} href={`/quotes/${q.id}`}>
                <div className="glass rounded-xl p-4 flex items-center justify-between hover:border-white/15 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-white">{q.fileName}</p>
                    <p className="text-xs text-white/40">{q.referenceNo} · {formatDate(q.createdAt)} · {q.material}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {q.estimatedPrice && (
                      <span className="text-sm font-semibold text-white">{formatCurrency(q.estimatedPrice)}</span>
                    )}
                    <span className={`text-xs border rounded-full px-2.5 py-0.5 ${getStatusColor(q.status)}`}>
                      {getStatusLabel(q.status)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recent Orders */}
      {orders.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Recent Orders</h2>
            <Link href="/orders" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {orders.map((o) => (
              <Link key={o.id} href={`/orders/${o.id}`}>
                <div className="glass rounded-xl p-4 flex items-center justify-between hover:border-white/15 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-white">{o.orderNo}</p>
                    <p className="text-xs text-white/40">{formatDate(o.createdAt)} · {o.type}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-white">{formatCurrency(o.total)}</span>
                    <span className={`text-xs border rounded-full px-2.5 py-0.5 ${getStatusColor(o.status)}`}>
                      {getStatusLabel(o.status)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
