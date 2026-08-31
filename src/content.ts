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
  discountPercent: number;
  popular?: boolean;
};

export type ProductId = "10" | "20";
export type Product = {
  id: ProductId;
  dosage: string;
  image: string;
  price: string;
  original: string;
  discountPercent: number;
  labHref?: string;
  bundles: readonly Bundle[];
  cartToken: string;
};

// Driada Shop external-cart integration, as provided by the client. Each product ID
// has its own dedicated token — never share the 20 mg token as a fallback default,
// that's what caused 10 mg orders to silently add 20 mg to the cart.
export const CART_ACTION = "https://driadashop.to/index.php?route=external/cart/add";
const CART_TOKENS: Record<ProductId, string> = {
  "10": "1545.289fe2810caf4525f60713713a5b1d7709be2cca912ac13838ee796ef2b7b8f0",
  "20": "1912.bedc2c70ff05b76507b1478aa3f0ed44ed757a932014dbf6c0993527f02bc750",
};

// --- Pricing switch -----------------------------------------------------
// Single source of truth for every price on the site (product cards, bundle
// selectors, checkout, order summary, discount badges — everywhere). Prices
// flip automatically once Europe/Berlin reaches PRICE_SWITCH_AT; no manual
// step or redeploy is needed on the day itself, and the logic ships inside
// this file so it keeps working after the project is handed off and rebuilt
// on any other hosting.
const PRICING_TIMEZONE = "Europe/Berlin";
const PRICE_SWITCH_AT = "2026-09-01T00:00:00";

function isNewPricingActive(now: Date = new Date()): boolean {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: PRICING_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const part = (type: string) => parts.find((entry) => entry.type === type)?.value ?? "00";
  const berlinTimestamp = `${part("year")}-${part("month")}-${part("day")}T${part("hour")}:${part("minute")}:${part("second")}`;
  return berlinTimestamp >= PRICE_SWITCH_AT;
}

type BundlePricing = { price: string; original: string; unit: string; discountPercent: number };
type ProductPricing = Record<BundleId, BundlePricing>;

// Prices in effect through 31 August 2026 (Europe/Berlin) — flat 15% off every bundle.
const LEGACY_PRICING: Record<ProductId, ProductPricing> = {
  "10": {
    starter: { price: "€52.11", original: "€61.30", unit: "€52.11", discountPercent: 15 },
    performance: { price: "€156.33", original: "€183.90", unit: "€52.11", discountPercent: 15 },
    proCycle: { price: "€260.55", original: "€306.50", unit: "€52.11", discountPercent: 15 },
  },
  "20": {
    starter: { price: "€90.27", original: "€106.20", unit: "€90.27", discountPercent: 15 },
    performance: { price: "€270.81", original: "€318.60", unit: "€90.27", discountPercent: 15 },
    proCycle: { price: "€451.35", original: "€531.00", unit: "€90.27", discountPercent: 15 },
  },
};

// Prices in effect from 1 September 2026, 00:00 Europe/Berlin — 1x at full price
// (no discount), 3x at -5%, 5x at -7%.
const NEXT_PRICING: Record<ProductId, ProductPricing> = {
  "10": {
    starter: { price: "€61.30", original: "€61.30", unit: "€61.30", discountPercent: 0 },
    performance: { price: "€174.71", original: "€183.90", unit: "€61.30", discountPercent: 5 },
    proCycle: { price: "€285.05", original: "€306.50", unit: "€61.30", discountPercent: 7 },
  },
  "20": {
    starter: { price: "€106.20", original: "€106.20", unit: "€106.20", discountPercent: 0 },
    performance: { price: "€302.67", original: "€318.60", unit: "€106.20", discountPercent: 5 },
    proCycle: { price: "€493.83", original: "€531.00", unit: "€106.20", discountPercent: 7 },
  },
};

const ACTIVE_PRICING = isNewPricingActive() ? NEXT_PRICING : LEGACY_PRICING;

const bundleOrder: readonly { id: BundleId; quantity: number; popular?: boolean }[] = [
  { id: "starter", quantity: 1 },
  { id: "performance", quantity: 3, popular: true },
  { id: "proCycle", quantity: 5 },
];

function buildProduct(id: ProductId, dosage: string, image: string, labHref?: string): Product {
  const pricing = ACTIVE_PRICING[id];
  const bundles: Bundle[] = bundleOrder.map((meta) => ({ ...meta, ...pricing[meta.id] }));
  const starter = pricing.starter;
  return {
    id,
    dosage,
    image,
    labHref,
    price: starter.price,
    original: starter.original,
    discountPercent: starter.discountPercent,
    bundles,
    cartToken: CART_TOKENS[id],
  };
}

export const products: readonly Product[] = [
  buildProduct("10", "10 mg / vial", "assets/product/retatrutide-10mg-v4.webp", "#quality"),
  buildProduct("20", "20 mg / vial", "assets/product/retatrutide-20mg-v4.webp"),
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
