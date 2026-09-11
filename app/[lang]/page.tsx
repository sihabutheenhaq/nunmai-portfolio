import { notFound } from "next/navigation";
import { Contact } from "@/components/Contact";
import { Deployment } from "@/components/Deployment";
import { Engine } from "@/components/Engine";
import { Faq } from "@/components/Faq";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";
import { Founder } from "@/components/Founder";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Locations } from "@/components/Locations";
import { Mission } from "@/components/Mission";
import { Operations } from "@/components/Operations";
import { Platform } from "@/components/Platform";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale, isRtl } from "@/lib/i18n";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] rounded-full bg-brand px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
      >
        {t.ui.skip}
      </a>
      <Header t={t} locale={lang} />
      <main id="main">
        {/* Product first (what, how, control, where to start), then the company, then next steps. */}
        <Hero t={t} />
        <Platform t={t} />
        <Engine t={t} rtl={isRtl(lang)} />
        <Deployment t={t} />
        <Operations t={t} />
        <Mission t={t} />
        <Founder t={t} />
        <Features t={t} />
        <Locations t={t} locale={lang} />
        <Faq t={t} />
        <Contact t={t} />
      </main>
      <Footer t={t} />
    </>
  );
}
