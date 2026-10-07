import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { FileText, Package, Users, TrendingUp, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Overview" };

export default async function AdminPage() {
  const [
    totalQuotes,
    newQuotes,
    inProductionOrders,
    totalCustomers,
    totalRevenue,
    recentQuotes,
  ] = await Promise.all([
    prisma.quoteRequest.count(),
    prisma.quoteRequest.count({ where: { status: "SUBMITTED" } }),
    prisma.order.count({ where: { status: { in: ["PAID", "IN_PRODUCTION", "QUALITY_CHECK"] } } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.payment.aggregate({ where: { status: "CAPTURED" }, _sum: { amount: true } }),
    prisma.quoteRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { user: { select: { name: true, email: true } } },
    }),
  ]);

  const stats = [
    { label: "Total Quotes", value: totalQuotes, icon: <FileText className="h-5 w-5" />, color: "text-blue-400", href: "/admin/quotes" },
    { label: "New Quotes", value: newQuotes, icon: <FileText className="h-5 w-5" />, color: "text-yellow-400", href: "/admin/quotes?status=SUBMITTED" },
    { label: "Active Production", value: inProductionOrders, icon: <Package className="h-5 w-5" />, color: "text-violet-400", href: "/admin/orders" },
    { label: "Total Customers", value: totalCustomers, icon: <Users className="h-5 w-5" />, color: "text-green-400", href: "/admin/customers" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Overview</h1>
          <p className="text-white/50 mt-1">Manage Kalinga Forge operations</p>
        </div>
        <div className="glass rounded-xl px-5 py-3">
          <p className="text-xs text-white/40">Total Revenue</p>
          <p className="text-2xl font-bold gradient-text">
            {formatCurrency(totalRevenue._sum.amount ?? 0)}
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <div className="glass rounded-2xl p-5 hover:border-white/15 transition-colors">
              <div className={`flex items-center gap-2 mb-3 ${stat.color}`}>
                {stat.icon}
                <span className="text-xs text-white/50">{stat.label}</span>
              </div>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Revenue highlight */}
      <div className="glass rounded-2xl p-6 border border-green-500/20 bg-green-500/5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
          <TrendingUp className="h-6 w-6 text-green-400" />
        </div>
        <div>
          <p className="text-sm text-white/60">Captured Revenue</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(totalRevenue._sum.amount ?? 0)}</p>
        </div>
      </div>

      {/* Recent Quotes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white">Recent Quote Requests</h2>
          <Link href="/admin/quotes" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                <th className="text-left p-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Reference</th>
                <th className="text-left p-4 text-xs font-semibold text-white/40 uppercase tracking-wider hidden sm:table-cell">Customer</th>
                <th className="text-left p-4 text-xs font-semibold text-white/40 uppercase tracking-wider hidden md:table-cell">Material</th>
                <th className="text-left p-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Status</th>
                <th className="text-right p-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Price</th>
              </tr>
            </thead>
            <tbody>
              {recentQuotes.map((q) => (
                <tr key={q.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="p-4">
                    <Link href={`/admin/quotes/${q.id}`} className="text-blue-400 hover:underline font-mono text-xs">
                      {q.referenceNo}
                    </Link>
                  </td>
                  <td className="p-4 text-white/70 hidden sm:table-cell">
                    {q.user?.name ?? q.guestName ?? "Guest"}
                  </td>
                  <td className="p-4 text-white/60 hidden md:table-cell">{q.material}</td>
                  <td className="p-4">
                    <span className="text-xs bg-white/10 border border-white/10 rounded-full px-2 py-0.5 text-white/60">
                      {q.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="p-4 text-right text-white/80">
                    {q.finalPrice ? formatCurrency(q.finalPrice) : q.estimatedPrice ? `~${formatCurrency(q.estimatedPrice)}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
