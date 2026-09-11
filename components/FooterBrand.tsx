import { AsciiWordmark } from "./AsciiWordmark";

/**
 * Closing ASCII-art Nunmai lockup (mark + wordmark) across the full width of the dark footer.
 * A spotlight follows the cursor; the lockup is built from public/brand/nunmai-lockup.svg.
 */
export function FooterBrand() {
  return (
    <div className="relative mt-14 border-t border-white/10">
      {/* ~4.5:1 leaves room above the letters for the spotlight; the logo's lower 12%
          is cropped by the page's bottom edge. Brand green at rest, lime under the cursor. */}
      <AsciiWordmark
        src="/brand/nunmai-lockup.svg"
        className="aspect-[4.5/1] w-full"
        color="#96c35d"
        glowColor="#96c35d"
        hotColor="#c8ee93"
        restOpacity={0.7}
      />
    </div>
  );
}
