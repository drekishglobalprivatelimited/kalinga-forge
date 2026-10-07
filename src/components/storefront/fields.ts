// Light storefront overrides for the shared form primitives in components/ui,
// which default to the dark admin styling. Pass via className.
export const fieldClass =
  "h-11 rounded-none border-line bg-white px-3.5 text-ink placeholder:text-muted-ink focus:border-ink focus:bg-white focus:ring-0";

export const textareaClass =
  "rounded-none border-line bg-white px-3.5 py-2.5 text-ink placeholder:text-muted-ink focus:border-ink focus:bg-white focus:ring-0";

export const labelClass = "text-[11px] font-medium uppercase tracking-[0.12em] text-ink/70";

export const selectContentClass = "rounded-none border-line bg-white text-ink shadow-lg";

export const selectItemClass = "rounded-none text-ink/80 focus:bg-canvas focus:text-ink";

export const primaryButtonClass =
  "inline-flex items-center justify-center gap-2 w-full py-3.5 bg-ink text-white text-sm font-medium tracking-wide hover:bg-black transition-colors disabled:opacity-50 disabled:pointer-events-none";

export const secondaryButtonClass =
  "inline-flex items-center justify-center gap-2 w-full py-3.5 border border-ink text-ink text-sm font-medium tracking-wide hover:bg-ink hover:text-white transition-colors";
