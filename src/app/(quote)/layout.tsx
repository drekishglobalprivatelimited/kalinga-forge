import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function QuoteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#050505] text-white pt-10">{children}</main>
      <Footer />
    </>
  );
}
