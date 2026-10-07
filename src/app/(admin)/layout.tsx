import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Layers, LayoutDashboard, FileText, Package, Users, ShoppingBag, Receipt, Settings, LogOut,
} from "lucide-react";
import { logout } from "@/actions/auth.actions";

const NAV = [
  { href: "/admin", icon: <LayoutDashboard className="h-4 w-4" />, label: "Overview" },
  { href: "/admin/quotes", icon: <FileText className="h-4 w-4" />, label: "Quotes" },
  { href: "/admin/orders", icon: <Package className="h-4 w-4" />, label: "Orders" },
  { href: "/admin/customers", icon: <Users className="h-4 w-4" />, label: "Customers" },
  { href: "/admin/products", icon: <ShoppingBag className="h-4 w-4" />, label: "Products" },
  { href: "/admin/invoices", icon: <Receipt className="h-4 w-4" />, label: "Invoices" },
  { href: "/admin/settings", icon: <Settings className="h-4 w-4" />, label: "Settings" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="min-h-screen bg-[#050505] flex">
      <aside className="hidden md:flex w-56 flex-col border-r border-white/8 bg-zinc-950/80 backdrop-blur-xl fixed top-0 bottom-0 left-0 z-30">
        <Link href="/admin" className="flex items-center gap-2 px-4 py-5 border-b border-white/8">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600">
            <Layers className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="font-bold text-sm">
              <span className="text-white">Kalinga</span>{" "}
              <span className="gradient-text">Forge</span>
            </span>
            <span className="block text-[10px] text-white/30">Admin</span>
          </div>
        </Link>

        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/8 transition-colors"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-white/8">
          <div className="px-3 py-2 mb-2">
            <p className="text-xs font-medium text-white truncate">{session.user?.name}</p>
            <p className="text-[10px] text-yellow-400">ADMIN</p>
          </div>
          <form action={logout}>
            <button className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors">
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </form>
        </div>
      </aside>

      <div className="flex-1 md:ml-56">
        {/* Mobile nav */}
        <div className="md:hidden flex overflow-x-auto gap-1 px-2 py-2 border-b border-white/8 bg-zinc-950/60 sticky top-0 z-20">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/60 hover:text-white hover:bg-white/8 whitespace-nowrap transition-colors"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>

        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
