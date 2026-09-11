import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, hasLocale, localeCookie, type Locale } from "@/lib/i18n";

/** Pick a language: the visitor's saved choice first, then their browser's Accept-Language. */
function preferredLocale(request: NextRequest): Locale {
  const saved = request.cookies.get(localeCookie)?.value;
  if (saved && hasLocale(saved)) return saved;

  const ranked = (request.headers.get("accept-language") ?? "")
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { base: tag.toLowerCase().split("-")[0], q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  return ranked.find((r) => hasLocale(r.base))?.base as Locale | undefined ?? defaultLocale;
}

// Only the bare root is redirected; /en and /ar are served directly.
export function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL(`/${preferredLocale(request)}`, request.url));
}

export const config = {
  matcher: "/",
};
