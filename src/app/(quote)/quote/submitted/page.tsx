import Link from "next/link";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { QuoteSteps } from "@/components/quote/QuoteSteps";
import { primaryButtonClass, secondaryButtonClass } from "@/components/storefront/fields";

const NEXT_STEPS = [
  "A confirmation email is on its way to your inbox.",
  "Our team reviews your file within 24 hours.",
  "We send you a final quote with exact pricing.",
  "Approve and pay to start production.",
];

export default async function SubmittedPage({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const params = await searchParams;
  const ref = params.ref ?? "Q-XXXXXXXX";
  const whatsapp = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919876543210"}?text=${encodeURIComponent(
    `Hi! My quote reference is ${ref}`
  )}`;

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <div className="flex justify-center mb-10">
        <QuoteSteps current={3} />
      </div>

      <div className="text-center">
        <CheckCircle2 className="h-14 w-14 mx-auto mb-6" strokeWidth={1} />
        <h1 className="text-3xl font-semibold tracking-tight mb-3">Quote request received</h1>
        <p className="text-sm text-muted-ink mb-8">
          Thanks! Our team will review your file and email you a final quote within 24 hours.
        </p>
      </div>

      <div className="bg-canvas p-6 text-center mb-8">
        <p className="text-[11px] uppercase tracking-[0.15em] text-muted-ink mb-1">Reference number</p>
        <p className="text-2xl font-semibold font-mono tracking-wide">{ref}</p>
        <p className="text-xs text-muted-ink mt-1">Keep this handy to track your quote</p>
      </div>

      <div className="border-t border-line pt-6 mb-10">
        <p className="text-[11px] uppercase tracking-[0.15em] text-muted-ink mb-4">What happens next</p>
        <ol className="space-y-3">
          {NEXT_STEPS.map((step, i) => (
            <li key={step} className="flex gap-3 text-sm">
              <span className="text-muted-ink tabular-nums">0{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <Link href="/quotes" className={primaryButtonClass}>
          TRACK QUOTE
        </Link>
        <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={secondaryButtonClass}>
          <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
          WHATSAPP US
        </a>
      </div>

      <div className="mt-6 flex justify-center gap-6 text-sm">
        <Link href="/quote" className="underline underline-offset-4 hover:opacity-70">
          Submit another file
        </Link>
        <Link href="/shop" className="underline underline-offset-4 hover:opacity-70">
          Browse the shop
        </Link>
      </div>
    </div>
  );
}
