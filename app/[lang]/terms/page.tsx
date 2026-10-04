import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage } from "@/components/LegalPage";
import { hasLocale } from "@/lib/i18n";
import { terms } from "@/lib/legal";

export const metadata: Metadata = { title: "Terms of Service · Nunmai", description: terms.intro.slice(0, 155) };

export default async function Page({ params }: PageProps<"/[lang]/terms">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return <LegalPage doc={terms} home={`/${lang}`} other={{ label: "Privacy Policy", href: `/${lang}/privacy` }} />;
}
