import type { Metadata } from "next";
import Link from "next/link";
import { FileUploadZone } from "@/components/quote/FileUploadZone";
import { QuoteSteps } from "@/components/quote/QuoteSteps";
import { Zap, Lock, ShieldCheck, Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "Get Instant 3D Printing Quote — Upload Your File",
  description:
    "Upload your STL, STEP, OBJ, or 3MF file and get an instant 3D printing quote. Configure material, finish, and quantity for accurate pricing.",
};

const TRUST_ITEMS = [
  { icon: Zap, title: "Instant estimate", body: "Price in under a minute" },
  { icon: Lock, title: "Private files", body: "Your designs stay yours" },
  { icon: ShieldCheck, title: "No commitment", body: "Pay only after approval" },
  { icon: Layers, title: "9 materials", body: "PLA to carbon fibre & resin" },
];

const TIPS = [
  "Export from Fusion 360, SolidWorks or Blender as STL or STEP.",
  "Make sure the model is manifold (watertight) for the best print quality.",
  "Several parts? Upload the main one and list the rest in the notes.",
];

export default function QuotePage() {
  return (
    <>
      <div className="bg-canvas">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <nav className="text-xs text-muted-ink mb-3">
            <Link href="/" className="hover:text-ink">Home</Link>
            <span className="mx-1.5">/</span>
            <span className="text-ink">Custom 3D Printing</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Custom 3D printing</h1>
          <p className="text-sm text-muted-ink mt-2 max-w-xl">
            Prototypes, replacement parts or one-off gifts. Upload your design, choose a material and get an instant
            estimate — our team confirms the final quote within 24 hours.
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10 sm:py-14 grid lg:grid-cols-[1.6fr_1fr] gap-10 lg:gap-16">
        <section>
          <div className="mb-6">
            <QuoteSteps current={0} />
          </div>
          <FileUploadZone />
        </section>

        <aside className="space-y-8">
          <ul className="grid grid-cols-2 gap-px bg-line border border-line">
            {TRUST_ITEMS.map(({ icon: Icon, title, body }) => (
              <li key={title} className="bg-white p-5">
                <Icon className="h-5 w-5 mb-3" strokeWidth={1.25} />
                <p className="text-sm font-medium">{title}</p>
                <p className="text-xs text-muted-ink mt-0.5">{body}</p>
              </li>
            ))}
          </ul>

          <div>
            <p className="text-[11px] uppercase tracking-[0.15em] text-muted-ink mb-3">Tips for best results</p>
            <ol className="space-y-3">
              {TIPS.map((tip, i) => (
                <li key={tip} className="flex gap-3 text-sm text-ink/80">
                  <span className="text-muted-ink tabular-nums">0{i + 1}</span>
                  {tip}
                </li>
              ))}
            </ol>
          </div>

          <div className="border-t border-line pt-6 text-sm text-ink/80">
            Don&apos;t have a 3D file?{" "}
            <Link href="/contact" className="font-medium text-ink underline underline-offset-4">
              Ask us about design help
            </Link>
            .
          </div>
        </aside>
      </div>
    </>
  );
}
