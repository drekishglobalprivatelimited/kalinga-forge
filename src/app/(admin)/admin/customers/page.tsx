import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Customers" };

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { quotes: true, orders: true } },
    },
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Customers</h1>
        <p className="text-white/50 mt-1">{customers.length} total</p>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                {["Name", "Email", "Phone", "Company", "Quotes", "Orders", "Joined"].map((h) => (
                  <th key={h} className="text-left p-4 text-xs font-semibold text-white/40 uppercase tracking-wider first:rounded-tl-2xl last:rounded-tr-2xl">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="p-4 text-white/80 font-medium">{c.name ?? "—"}</td>
                  <td className="p-4 text-white/60">{c.email}</td>
                  <td className="p-4 text-white/60">{c.phone ?? "—"}</td>
                  <td className="p-4 text-white/60">{c.companyName ?? "—"}</td>
                  <td className="p-4 text-white/60">{c._count.quotes}</td>
                  <td className="p-4 text-white/60">{c._count.orders}</td>
                  <td className="p-4 text-white/40 text-xs">{formatDate(c.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
