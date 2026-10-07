import Link from "next/link";

export function SectionHeading({ title, subtitle, href }: { title: string; subtitle?: string; href?: string }) {
  return (
    <div className="flex items-end justify-between gap-4 px-4 sm:px-6 mb-6 sm:mb-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-ink">{title}</h2>
        {subtitle && <p className="text-sm text-muted-ink mt-1">{subtitle}</p>}
      </div>
      {href && (
        <Link href={href} className="shrink-0 text-xs sm:text-sm font-medium text-ink underline underline-offset-4 hover:opacity-70">
          View all
        </Link>
      )}
    </div>
  );
}
