import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage } from "@/components/LegalPage";
import { hasLocale } from "@/lib/i18n";
import { privacy } from "@/lib/legal";

export const metadata: Metadata = { title: "Privacy Policy · Nunmai", description: privacy.intro.slice(0, 155) };

export default async function Page({ params }: PageProps<"/[lang]/privacy">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return <LegalPage doc={privacy} home={`/${lang}`} other={{ label: "Terms of Service", href: `/${lang}/terms` }} />;
}
