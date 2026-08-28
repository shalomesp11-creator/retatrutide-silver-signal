import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_LOCALE, getStoredLocale, htmlLangByLocale, storeLocale, type Locale } from "./locales";
import { dictionaries, type Dictionary } from "./dictionaries";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  // Reads the persisted choice synchronously on first render, so the very
  // first paint already uses the right language — no flash of English.
  const [locale, setLocaleState] = useState<Locale>(getStoredLocale);

  useEffect(() => {
    document.documentElement.lang = htmlLangByLocale[locale];
  }, [locale]);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    storeLocale(next);
  };

  const value = useMemo(() => ({ locale, setLocale }), [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}

export function useT(): Dictionary {
  const { locale } = useContext(LocaleContext);
  return dictionaries[locale];
}
