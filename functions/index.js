// Root locale redirect for nunmai.in: a Cloudflare Pages Function (functions/ at the repo root)
// (a Cloudflare Pages Function, so it only ever runs for "/").
//
// Reconstructed 2026-09-16 — the original was lost with an earlier scratchpad, and the
// only surviving copy was the one already running in production. The rules below were
// read back off the live site with curl, case by case:
//
//   cookie locale=ar + Accept-Language: en   -> /ar      cookie wins outright
//   cookie locale=fr + Accept-Language: ar   -> /ar      an unsupported cookie is ignored
//   Accept-Language: en;q=0.7, ar;q=0.9      -> /ar      highest q wins, not first listed
//   Accept-Language: ar-SA,ar;q=0.9,en;q=0.8 -> /ar      region subtags match their base
//   Accept-Language: fr-FR                   -> /en      nothing supported -> default
//   no cookie, no Accept-Language            -> /en
//
// All of them answer 307. Keep it that way: 301/308 would be cached by the browser and
// pin a visitor to whichever language they happened to arrive in first.

const LOCALES = ["en", "ar"];
const DEFAULT_LOCALE = "en";

function fromCookie(header) {
  if (!header) return null;
  for (const part of header.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === "NEXT_LOCALE" || name === "locale") {
      const value = rest.join("=").trim();
      return LOCALES.includes(value) ? value : null;
    }
  }
  return null;
}

function fromAcceptLanguage(header) {
  if (!header) return null;
  let best = null;
  let bestQ = 0;
  for (const part of header.split(",")) {
    const [tagRaw, ...params] = part.trim().split(";");
    const tag = tagRaw.trim().toLowerCase();
    if (!tag || tag === "*") continue;
    let q = 1;
    for (const p of params) {
      const m = /^\s*q=([0-9.]+)\s*$/i.exec(p);
      if (m) q = parseFloat(m[1]);
    }
    if (!(q > bestQ)) continue;              // ties keep the earlier tag
    const base = tag.split("-")[0];          // ar-SA -> ar
    if (!LOCALES.includes(base)) continue;
    best = base;
    bestQ = q;
  }
  return best;
}

export function onRequest({ request }) {
  // OUTAGE DRILL 2026-09-25: deliberate failure to test the Watching incident flow. Revert this commit.
  return new Response("maintenance", { status: 503 });
  const url = new URL(request.url);
  const locale =
    fromCookie(request.headers.get("cookie")) ||
    fromAcceptLanguage(request.headers.get("accept-language")) ||
    DEFAULT_LOCALE;

  url.pathname = `/${locale}`;
  return Response.redirect(url.toString(), 307);
}
