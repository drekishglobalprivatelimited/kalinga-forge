import { Check } from "lucide-react";

const STEPS = ["Upload", "Configure", "Submit"];

// current: index of the active step; 3 marks every step complete.
export function QuoteSteps({ current }: { current: 0 | 1 | 2 | 3 }) {
  return (
    <ol className="flex items-center gap-3 text-[12px] sm:text-[13px]">
      {STEPS.map((step, i) => (
        <li key={step} className="flex items-center gap-3">
          <span className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center text-[11px] font-semibold ${
                i < current ? "bg-ink text-white" : i === current ? "border border-ink text-ink" : "border border-line text-muted-ink"
              }`}
            >
              {i < current ? <Check className="h-3.5 w-3.5" strokeWidth={2} /> : i + 1}
            </span>
            <span className={i <= current ? "text-ink" : "text-muted-ink"}>{step}</span>
          </span>
          {i < STEPS.length - 1 && <span className="w-6 sm:w-10 h-px bg-line" />}
        </li>
      ))}
    </ol>
  );
}
