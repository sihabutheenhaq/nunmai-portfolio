import type { Locale } from "../i18n";
import { ar } from "./ar";
import { en, type Dictionary } from "./en";

export type { Dictionary };

const dictionaries: Record<Locale, Dictionary> = { en, ar };

export const getDictionary = (locale: Locale) => dictionaries[locale];
