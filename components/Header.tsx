"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Globe, Menu, X } from "lucide-react";
import type { Dictionary } from "@/lib/dictionaries";
import { localeCookie, type Locale } from "@/lib/i18n";
import { Logo } from "./Logo";

export function Header({ t, locale }: { t: Dictionary; locale: Locale }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const other: Locale = locale === "en" ? "ar" : "en";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Remember the choice so the root URL opens in this language next time (see proxy.ts).
  const rememberChoice = () => {
    document.cookie = `${localeCookie}=${other}; path=/; max-age=31536000; samesite=lax`;
  };

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4 sm:px-6">
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between rounded-full px-5 py-3 transition-all duration-500 sm:px-7 ${
          scrolled ? "bg-white/90 shadow-lg shadow-ink/5 backdrop-blur-md" : "bg-surface/95"
        }`}
      >
        <Logo label={t.ui.home} className="text-2xl" />

        <nav className="hidden lg:block" aria-label="Main">
          <ul className="flex items-center gap-8 text-[15px] font-medium">
            {t.nav.map((item, i) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`relative py-1 transition-colors hover:text-brand-dark after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100 rtl:after:origin-right ${
                    i === 0 ? "after:scale-x-100" : "after:scale-x-0"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href={`/${other}`}
            hrefLang={other}
            lang={other}
            onClick={rememberChoice}
            aria-label={t.ui.switchAria}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold transition-colors hover:bg-surface-2"
          >
            <Globe className="size-4" />
            {t.ui.switchLabel}
          </Link>
          <a href={t.contact.portal} className="hidden px-2 text-sm font-semibold transition-colors hover:text-brand-dark md:inline-block">
            {t.ui.signIn}
          </a>
          <a
            href="#contact"
            className="hidden rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark sm:inline-block"
          >
            {t.ui.requestPilot}
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? t.ui.closeMenu : t.ui.openMenu}
            className="grid size-10 place-items-center rounded-full hover:bg-surface-2 lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`mx-auto mt-2 max-w-7xl overflow-hidden rounded-3xl bg-white shadow-xl transition-all duration-300 lg:hidden ${
          open ? "max-h-[32rem] opacity-100" : "pointer-events-none max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col p-4 text-lg font-medium">
          {t.nav.map((item) => (
            <li key={item.href}>
              <a href={item.href} onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3 hover:bg-surface">
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <a href={t.contact.portal} className="block rounded-2xl px-4 py-3 text-muted hover:bg-surface">
              {t.ui.signInPortal}
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
