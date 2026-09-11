import { ArrowRight, Bot, Check, Gem, type LucideIcon } from "lucide-react";
import type { Dictionary } from "@/lib/dictionaries";
import { CardBeam, ProductVisual } from "./ProductVisuals";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { SectorMarquee } from "./SectorMarquee";

const icons: Record<string, LucideIcon> = {
  workforce: Bot,
  intelligence: Gem,
};

export function Platform({ t }: { t: Dictionary }) {
  const { platform, ui } = t;
  return (
    <section id="platform" className="mx-auto max-w-7xl scroll-mt-28 px-6 py-24">
      <SectionHeading eyebrow={platform.label} title={platform.title} text={platform.text} />
      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {platform.products.map((p, i) => {
          const Icon = icons[p.id];
          return (
            <Reveal key={p.id} delay={i * 120} className="h-full">
              <article className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] bg-surface p-6 ring-1 ring-inset ring-ink/5 transition-shadow duration-500 hover:shadow-xl hover:shadow-brand/10 sm:p-8">
                <CardBeam delay={i * 7} />

                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-2xl bg-white text-brand-dark shadow-sm transition-transform duration-500 group-hover:scale-110">
                    <Icon className="size-5" strokeWidth={1.75} />
                  </span>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-dark">{p.tagline}</p>
                  <span className="ms-auto font-mono text-sm font-semibold text-ink/25" aria-hidden>
                    0{i + 1}
                  </span>
                </div>

                <h3 className="mt-6 text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl lg:min-h-[2lh] xl:min-h-0">{p.name}</h3>
                <p className="mt-3 max-w-lg text-[17px] leading-relaxed text-ink/75">{p.summary}</p>

                {/* Live demo: task feed for the workforce, forecast story for foresight */}
                <ProductVisual product={p} ui={ui} />

                <ul className="mt-6 grid flex-1 content-start gap-2.5 sm:grid-cols-2">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-2.5 rounded-2xl bg-white px-4 py-3 text-[15px] font-medium">
                      <Check className="size-4 shrink-0 text-brand-dark" />
                      {pt}
                    </li>
                  ))}
                </ul>

                <a
                  href={platform.cta.href}
                  className="group/btn mt-7 inline-flex items-center gap-2 self-start rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
                >
                  {platform.cta.label}
                  <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1 rtl:-scale-x-100 rtl:group-hover/btn:-translate-x-1" />
                </a>
              </article>
            </Reveal>
          );
        })}
      </div>

      {/* Who the products are for, right under the product cards */}
      <SectorMarquee t={t} />
    </section>
  );
}
