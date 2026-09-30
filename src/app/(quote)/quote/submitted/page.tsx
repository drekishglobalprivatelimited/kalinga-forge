import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, ArrowRight, MessageCircle } from "lucide-react";

function SubmittedContent({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  return (
    <Suspense fallback={null}>
      <SubmittedContentInner searchParams={searchParams} />
    </Suspense>
  );
}

async function SubmittedContentInner({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const params = await searchParams;
  const ref = params.ref ?? "Q-XXXXXXXX";

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      {/* Success icon */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-400" />
          </div>
          <div className="absolute -inset-3 rounded-full border border-green-500/20 animate-ping" />
        </div>
      </div>

      <h1 className="text-3xl font-bold text-white mb-3">
        Quote Request Submitted!
      </h1>
      <p className="text-white/60 mb-6">
        Your request has been received. Our team will review your file and send a final quote to your email within 24 hours.
      </p>

      {/* Reference number */}
      <div className="glass rounded-2xl p-6 mb-8 border border-white/10">
        <p className="text-xs text-white/40 mb-1">Reference Number</p>
        <p className="text-2xl font-bold font-mono gradient-text">{ref}</p>
        <p className="text-xs text-white/30 mt-1">Save this for tracking your quote</p>
      </div>

      {/* What happens next */}
      <div className="glass rounded-2xl p-6 mb-8 text-left">
        <p className="text-sm font-semibold text-white mb-4">What happens next?</p>
        <div className="space-y-3">
          {[
            { icon: "📧", text: "Confirmation email sent to your inbox" },
            { icon: "🔍", text: "Our team reviews your file within 24 hours" },
            { icon: "💬", text: "We send you a final quote with exact pricing" },
            { icon: "✅", text: "Approve and make payment to start production" },
          ].map((item) => (
            <div key={item.text} className="flex items-start gap-3 text-sm">
              <span className="text-lg shrink-0">{item.icon}</span>
              <span className="text-white/60">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/dashboard/quotes" className="flex-1">
          <Button variant="gradient" className="w-full gap-2">
            <Package className="h-4 w-4" />
            Track Quote
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919876543210"}?text=${encodeURIComponent(`Hi! My quote reference is ${ref}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
        >
          <Button variant="outline" className="w-full gap-2">
            <MessageCircle className="h-4 w-4 text-green-400" />
            WhatsApp Follow-up
          </Button>
        </a>
      </div>

      <Link href="/quote" className="block mt-4 text-sm text-white/40 hover:text-white transition-colors">
        Submit another quote →
      </Link>
    </div>
  );
}

export default function SubmittedPage({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  return <SubmittedContent searchParams={searchParams} />;
}
