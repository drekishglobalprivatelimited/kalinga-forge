import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white text-ink">
      {/* Brand panel */}
      <div className="relative hidden lg:block bg-canvas">
        <Image src="/products/ribbed-bulb-vase.jpg" alt="" fill priority sizes="50vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/20" />
        <Link href="/" className="absolute top-8 left-10 font-semibold tracking-[0.18em] text-white">
          KALINGA<span className="text-forge">·</span>FORGE
        </Link>
        <div className="absolute bottom-10 left-10 right-10 text-white">
          <p className="text-3xl font-semibold tracking-tight leading-tight mb-2">
            Objects printed
            <br />
            layer by layer.
          </p>
          <p className="text-sm text-white/80">Track orders, quotes and invoices in one place.</p>
        </div>
      </div>

      {/* Form */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between h-16 px-6 sm:px-10 border-b border-line lg:border-0">
          <Link href="/" className="lg:invisible font-semibold tracking-[0.18em] text-[15px]">
            KALINGA<span className="text-forge">·</span>FORGE
          </Link>
          <Link href="/shop" className="text-xs text-muted-ink hover:text-ink underline underline-offset-4">
            Back to shop
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-12">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}
