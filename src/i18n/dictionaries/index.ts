import type { Locale } from "../locales";
import en, { type Dictionary } from "./en";
import de from "./de";
import es from "./es";
import it from "./it";
import fr from "./fr";

export type { Dictionary };

export const dictionaries: Record<Locale, Dictionary> = { en, de, es, it, fr };
