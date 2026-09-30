import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Products" };

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: { select: { name: true } } },
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Products</h1>
        <p className="text-white/50 mt-1">{products.length} total</p>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                {["Name", "SKU", "Category", "Price", "Stock", "Active", "Featured"].map((h) => (
                  <th key={h} className="text-left p-4 text-xs font-semibold text-white/40 uppercase tracking-wider first:rounded-tl-2xl last:rounded-tr-2xl">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="p-4 text-white/80 font-medium">{p.name}</td>
                  <td className="p-4 font-mono text-xs text-white/50">{p.sku}</td>
                  <td className="p-4 text-white/60">{p.category.name}</td>
                  <td className="p-4 text-white/80">{formatCurrency(p.basePrice)}</td>
                  <td className="p-4 text-white/60">{p.stock}</td>
                  <td className="p-4">
                    <span className={`text-xs border rounded-full px-2 py-0.5 ${p.isActive ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"}`}>
                      {p.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4">
                    {p.isFeatured ? (
                      <span className="text-xs border rounded-full px-2 py-0.5 bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                        Featured
                      </span>
                    ) : (
                      <span className="text-white/30 text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-white/40">
                    No products yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
