import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Layers, LayoutDashboard, FileText, Package, Receipt, User, LogOut } from "lucide-react";
import { logout } from "@/actions/auth.actions";

const NAV = [
  { href: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" />, label: "Overview" },
  { href: "/quotes", icon: <FileText className="h-4 w-4" />, label: "My Quotes" },
  { href: "/orders", icon: <Package className="h-4 w-4" />, label: "Orders" },
  { href: "/invoices", icon: <Receipt className="h-4 w-4" />, label: "Invoices" },
  { href: "/profile", icon: <User className="h-4 w-4" />, label: "Profile" },
];

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-[#050505] flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-56 flex-col border-r border-white/8 bg-zinc-950/80 backdrop-blur-xl fixed top-0 bottom-0 left-0 z-30">
        <Link href="/" className="flex items-center gap-2 px-4 py-5 border-b border-white/8">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600">
            <Layers className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-lg">
            <span className="text-white">Kalinga</span>{" "}
            <span className="gradient-text">Forge</span>
          </span>
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
            <p className="text-xs text-white/40 truncate">{session.user?.email}</p>
          </div>
          <form action={logout}>
            <button className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors">
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 md:ml-56">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-white/8 bg-zinc-950/80">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600">
              <Layers className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold">Kalinga <span className="gradient-text">Forge</span></span>
          </Link>
          <span className="text-sm text-white/60">{session.user?.name}</span>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden flex overflow-x-auto gap-1 px-2 py-2 border-b border-white/8 bg-zinc-950/60">
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
