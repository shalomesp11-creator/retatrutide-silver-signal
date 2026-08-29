// Structural/factual data only — prices, dosages, images, IDs. All translatable copy
// (labels, names, descriptions) lives in src/i18n/dictionaries, keyed to match these ids.
export const navKeys = ["about", "mechanism", "products", "quality", "faq"] as const;
export type NavKey = (typeof navKeys)[number];

export const receptorMeta = [
  { number: "01", short: "GLP-1" },
  { number: "02", short: "GIP" },
  { number: "03", short: "Glucagon" },
] as const;

export const benefitMeta = [
  { image: "assets/people/1.webp", focus: "68% 2%", focusMobile: "95% center" },
  { image: "assets/people/2.webp", focus: "55% 4%", focusMobile: "78% center" },
  { image: "assets/people/3.webp", focus: "65% 3%", focusMobile: "90% center" },
  { image: "assets/people/4.webp", focus: "60% 10%", focusMobile: "84% center" },
  { image: "assets/people/5.webp", focus: "70% 3%", focusMobile: "97% center" },
] as const;

export type BundleId = "starter" | "performance" | "proCycle";
export type Bundle = {
  id: BundleId;
  quantity: number;
  price: string;
  original: string;
  unit: string;
  popular?: boolean;
};

export type ProductId = "10" | "20";
export type Product = {
  id: ProductId;
  dosage: string;
  image: string;
  price: string;
  original: string;
  labHref?: string;
  bundles: readonly Bundle[];
};

export const products: readonly Product[] = [
  {
    id: "10",
    dosage: "10 mg / vial",
    image: "assets/product/retatrutide-10mg-v4.webp",
    price: "€52.11",
    original: "€61.30",
    labHref: "#quality",
    bundles: [
      { id: "starter", quantity: 1, price: "€52.11", original: "€61.30", unit: "€52.11" },
      { id: "performance", quantity: 3, price: "€156.33", original: "€183.90", unit: "€52.11", popular: true },
      { id: "proCycle", quantity: 5, price: "€260.55", original: "€306.50", unit: "€52.11" },
    ],
  },
  {
    id: "20",
    dosage: "20 mg / vial",
    image: "assets/product/retatrutide-20mg-v4.webp",
    price: "€90.27",
    original: "€106.20",
    bundles: [
      { id: "starter", quantity: 1, price: "€90.27", original: "€106.20", unit: "€90.27" },
      { id: "performance", quantity: 3, price: "€270.81", original: "€318.60", unit: "€90.27", popular: true },
      { id: "proCycle", quantity: 5, price: "€451.35", original: "€531.00", unit: "€90.27" },
    ],
  },
] as const;

export const reviewMeta = [
  { name: "MoltenHarbinger", date: "3 Aug 2026" },
  { name: "Aki", date: "23 Jul 2026" },
  { name: "Personanongrata", date: "5 Jul 2026" },
  { name: "TheGuy", date: "3 Jul 2026" },
  { name: "BrunoBertrand", date: "3 Jul 2026" },
  { name: "Arthuur", date: "7 Jul 2026" },
] as const;

export const countryCodes = ["DE", "FR", "NL", "ES", "IT", "PL", "BE", "AT", "IE", "SE"] as const;
export type CountryCode = (typeof countryCodes)[number];
export const OTHER_COUNTRY = "OTHER";
