"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "new", label: "New arrivals" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

export function SortSelect({ value }: { value: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const qs = new URLSearchParams(searchParams.toString());
    if (e.target.value === "featured") qs.delete("sort");
    else qs.set("sort", e.target.value);
    const s = qs.toString();
    router.push(s ? `${pathname}?${s}` : pathname);
  }

  return (
    <label className="shrink-0 flex items-center gap-2 text-[13px]">
      <span className="hidden sm:inline text-muted-ink">Sort by</span>
      <select
        value={value}
        onChange={onChange}
        className="bg-white border border-line px-2 py-1.5 text-[13px] text-ink outline-none focus:border-ink"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
