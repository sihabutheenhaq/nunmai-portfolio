import type { LegalDoc } from "@/lib/legal";
import { NunmaiMark } from "./NunmaiMark";

/** A plain, readable legal page (Privacy Policy, Terms). English for every locale, so it is always laid out left to right. */
export function LegalPage({ doc, home, other }: { doc: LegalDoc; home: string; other: { label: string; href: string } }) {
  return (
    <div dir="ltr" lang="en" className="min-h-screen bg-white text-ink">
      <header className="border-b border-black/10">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
          <a href={home} aria-label="Nunmai home" className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight">
            <NunmaiMark className="h-[1.25em] w-auto text-deep" gap="#ffffff" />
            Nunmai
          </a>
          <a href={other.href} className="text-sm font-semibold text-ink/70 underline-offset-4 hover:underline">
            {other.label}
          </a>
        </div>
      </header>
      <main id="main" className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-4xl font-semibold tracking-tight">{doc.title}</h1>
        <p className="mt-2 text-sm text-ink/60">Last updated {doc.updated}</p>
        <p className="mt-8 text-base leading-7 text-ink/80">{doc.intro}</p>
        {doc.sections.map((s) => (
          <section key={s.title} className="mt-10">
            <h2 className="text-2xl font-semibold tracking-tight">{s.title}</h2>
            {s.body.map((p) => (
              <p key={p.slice(0, 40)} className="mt-4 text-base leading-7 text-ink/80">
                {p}
              </p>
            ))}
          </section>
        ))}
        <p className="mt-16 border-t border-black/10 pt-6 text-sm text-ink/60">
          <a href={home} className="underline-offset-4 hover:underline">Back to nunmai.in</a>
        </p>
      </main>
    </div>
  );
}
