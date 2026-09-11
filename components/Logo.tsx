import { NunmaiMark } from "./NunmaiMark";

export function Logo({
  label,
  className = "",
  gap = "#f7fbf3",
  onDark = false,
}: {
  label: string;
  className?: string;
  /** Colour of the outline around the mark's diamond: set it to the background colour. */
  gap?: string;
  /** Light version (white wordmark, lime mark) for dark backgrounds. */
  onDark?: boolean;
}) {
  return (
    <a
      href="#top"
      aria-label={label}
      dir="ltr"
      className={`inline-flex items-center gap-2 font-bold tracking-tight ${onDark ? "text-white" : "text-ink"} ${className}`}
    >
      <NunmaiMark className={`h-[1.25em] w-auto ${onDark ? "text-brand-light" : "text-deep"}`} gap={gap} />
      Nunmai
    </a>
  );
}
