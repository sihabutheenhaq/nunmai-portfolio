import { ArrowUpRight } from "lucide-react";
import type { Dictionary } from "@/lib/dictionaries";
import { FooterBrand } from "./FooterBrand";
import { Logo } from "./Logo";
import { PixelCanvas } from "./ui/pixel-canvas";

/** Footer background: the site's deepest brand green (also used in the engine cards). */
const FOOTER_BG = "#0b2413";
// Brand greens, deep to bright, for the pixel trail on the dark footer.
const pixelColors = ["#3f6b22", "#6e9938", "#96c35d", "#c8ee93"];

export function Footer({ t }: { t: Dictionary }) {
  const { footer, contact, platform, ui } = t;
  const columns = [
    {
      title: footer.platformTitle,
      links: [
        { label: footer.engineLink, href: "#engine" },
        ...platform.products.map((p) => ({ label: p.name, href: "#platform" })),
      ],
    },
    { title: footer.companyTitle, links: footer.companyLinks },
  ];

  return (
    <footer className="relative overflow-hidden rounded-t-[3rem] text-white" style={{ backgroundColor: FOOTER_BG }}>
      {/* Interactive pixel grid behind the footer: lights up under the cursor and fades. */}
      <PixelCanvas aria-hidden className="absolute inset-0" gap={8} speed={0.03} colors={pixelColors} />

      {/* Content lets the cursor pass through to the canvas; links stay clickable. */}
      <div className="pointer-events-none relative mx-auto max-w-7xl px-6 pt-20 [&_a]:pointer-events-auto">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo label={ui.home} onDark className="text-5xl" gap={FOOTER_BG} />
            <p className="mt-6 max-w-sm text-3xl font-medium leading-tight text-white/70">{footer.tagline}</p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-2xl font-medium">{col.title}</h3>
              <ul className="mt-5 space-y-3 text-lg text-white/60">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {/* inline-block: the whole box of a wrapped link is clickable, not just its text */}
                    <a href={l.href} className="inline-block transition-colors hover:text-brand-light">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-2xl font-medium">{footer.reachTitle}</h3>
            <address className="mt-5 space-y-3 text-lg not-italic text-white/60">
              <a href={`mailto:${contact.email}`} dir="ltr" className="block text-start transition-colors hover:text-brand-light">
                {contact.email}
              </a>
              <a href={contact.phoneHref} className="block transition-colors hover:text-brand-light">
                <span dir="ltr">{contact.phone}</span>
              </a>
              <span className="block">{contact.location}</span>
            </address>
          </div>
        </div>

        <div className="mt-20 flex flex-col-reverse items-start justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
          <p className="text-sm font-medium text-white/50">
            © {new Date().getFullYear()} {contact.company}. {footer.rights}
          </p>
          <a
            href={contact.portal}
            className="inline-flex items-center gap-1 text-sm font-semibold text-white/60 transition-colors hover:text-brand-light"
          >
            {ui.signInPortal} <ArrowUpRight className="size-4 rtl:-scale-x-100" />
          </a>
        </div>
      </div>

      {/* Closing ASCII-art Nunmai lockup, after the copyright row */}
      <FooterBrand />
    </footer>
  );
}
