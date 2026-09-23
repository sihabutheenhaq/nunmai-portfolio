import { ArrowRight, ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import type { Dictionary } from "@/lib/dictionaries";
import { Reveal } from "./Reveal";

export function Contact({ t }: { t: Dictionary }) {
  const { cta, contact, ui } = t;
  return (
    <section id="contact" className="mx-auto max-w-7xl scroll-mt-28 px-6 py-16">
      <Reveal>
        <div className="rounded-[2rem] bg-surface px-6 py-14 sm:px-12">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-block rounded-full bg-white px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-dark">
              {cta.badge}
            </span>
            <h2 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">{cta.title}</h2>
            <p className="mt-5 text-[15px] font-medium leading-relaxed text-muted sm:text-base">{cta.text}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={contact.pilotMailto}
                className="group inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3 font-semibold text-white transition-colors hover:bg-brand-dark"
              >
                {ui.requestPilot}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
              </a>
              <a
                href={cta.secondary.href}
                className="inline-flex items-center rounded-full border border-ink/15 bg-white px-7 py-3 font-semibold transition-colors hover:border-brand hover:text-brand-dark"
              >
                {cta.secondary.label}
              </a>
            </div>
          </div>

          <ol className="mt-12 grid gap-4 md:grid-cols-3">
            {cta.phases.map((p, i) => (
              <li key={p.name} className="rounded-3xl bg-white p-6">
                <span className="grid size-10 place-items-center rounded-full bg-brand font-semibold text-white">{i + 1}</span>
                <h3 className="mt-4 text-xl font-medium">{p.name}</h3>
                <p className="text-sm font-bold text-brand-dark">{p.duration}</p>
                <p className="mt-2 leading-relaxed text-muted">{p.text}</p>
              </li>
            ))}
          </ol>

          <div className="mt-12 text-center">
            <p className="text-lg font-medium">{cta.reachTitle}</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold hover:text-brand-dark">
                <Mail className="size-4 text-brand-dark" /> <span dir="ltr">{contact.email}</span>
              </a>
              <a href={contact.phoneHref} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold hover:text-brand-dark">
                <Phone className="size-4 text-brand-dark" /> <span dir="ltr">{contact.phone}</span>
              </a>
              <a href={contact.portal} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold hover:text-brand-dark">
                {cta.portalLabel} <ArrowUpRight className="size-4 text-brand-dark rtl:-scale-x-100" />
              </a>
            </div>
            <p className="mt-5 flex items-center justify-center gap-1.5 text-sm text-muted">
              <MapPin className="size-4" /> {contact.location}
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}