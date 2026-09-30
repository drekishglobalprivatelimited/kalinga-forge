import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Settings" };

export default async function AdminSettingsPage() {
  const session = await auth();
  const [productCount, categoryCount, blogCount, adminCount] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.blogPost.count(),
    prisma.user.count({ where: { role: "ADMIN" } }),
  ]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-white/50 mt-1">Account & platform info</p>
      </div>

      <div className="glass rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold text-white">Account</h2>
        <dl className="space-y-2 text-sm">
          {[
            { label: "Name", value: session?.user?.name ?? "—" },
            { label: "Email", value: session?.user?.email ?? "—" },
            { label: "Role", value: "ADMIN" },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between">
              <span className="text-white/40">{label}</span>
              <span className="text-white/80">{value}</span>
            </div>
          ))}
        </dl>
      </div>

      <div className="glass rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold text-white">Platform</h2>
        <dl className="space-y-2 text-sm">
          {[
            { label: "Products", value: productCount },
            { label: "Categories", value: categoryCount },
            { label: "Blog Posts", value: blogCount },
            { label: "Admins", value: adminCount },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between">
              <span className="text-white/40">{label}</span>
              <span className="text-white/80">{value}</span>
            </div>
          ))}
        </dl>
      </div>

      <div className="glass rounded-2xl p-6">
        <p className="text-xs text-white/40">Server time</p>
        <p className="text-white/80 text-sm mt-1">{formatDate(new Date())}</p>
      </div>
    </div>
  );
}
