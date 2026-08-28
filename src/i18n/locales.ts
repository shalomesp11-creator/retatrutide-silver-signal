export const locales = ["en", "de", "es", "it", "fr"] as const;
export type Locale = (typeof locales)[number];

export const localeLabels: Record<Locale, string> = {
  en: "EN",
  de: "DE",
  es: "ES",
  it: "IT",
  fr: "FR",
};

export const localeNames: Record<Locale, string> = {
  en: "English",
  de: "Deutsch",
  es: "Español",
  it: "Italiano",
  fr: "Français",
};

export const htmlLangByLocale: Record<Locale, string> = {
  en: "en",
  de: "de",
  es: "es",
  it: "it",
  fr: "fr",
};

export const DEFAULT_LOCALE: Locale = "en";
const STORAGE_KEY = "retatrutide-locale";

export function isLocale(value: string | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

// Reads a persisted choice synchronously so the very first render already
// uses the right language — no post-mount flash of English.
export function getStoredLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isLocale(stored)) return stored;
  } catch {
    /* storage can be unavailable */
  }
  return DEFAULT_LOCALE;
}

export function storeLocale(locale: Locale) {
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    /* storage can be unavailable */
  }
}
