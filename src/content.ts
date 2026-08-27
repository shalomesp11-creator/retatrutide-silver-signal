export const nav = [
  ["About", "#about"],
  ["Mechanism", "#mechanism"],
  ["Products", "#products"],
  ["Quality", "#quality"],
  ["FAQ", "#faq"],
] as const;

export const receptors = [
  {
    number: "01",
    short: "GLP-1",
    title: "Appetite & satiety",
    copy: "GLP-1 is secreted by the gut after eating. It signals fullness, reduces hunger and slows gastric emptying. It also supports an insulin response when blood sugar rises and lowers glucagon secretion.",
  },
  {
    number: "02",
    short: "GIP",
    title: "Glucose response",
    copy: "GIP helps regulate blood sugar after meals by amplifying the body’s insulin response. In combination with GLP-1, the two signals can support stronger blood-sugar control and weight management.",
  },
  {
    number: "03",
    short: "Glucagon",
    title: "Energy expenditure",
    copy: "Glucagon mobilises internal energy stores during fasting or low blood sugar. Receptor activation can increase energy expenditure and intensify lipolysis so stored fat is used as fuel.",
  },
] as const;

export const benefits = [
  {
    title: "Weight and appetite control",
    copy: "Retatrutide may reduce appetite and prolong fullness, helping make a planned calorie deficit easier to maintain.",
    image: "assets/people/audience-01.webp",
    // focus marks the face in the source frame, so no crop ever loses it
    focus: "58% 2%",
    alt: "Woman with a balanced meal in a bright contemporary kitchen",
  },
  {
    title: "Insulin resistance or prediabetes",
    copy: "Its combined receptor activity may support insulin sensitivity and blood-sugar regulation.",
    image: "assets/people/audience-02.webp",
    focus: "51% 2%",
    alt: "Man outdoors on a city walk in light activewear",
  },
  {
    title: "Obesity and related conditions",
    copy: "Weight-management progress may reduce strain associated with excess weight and metabolic dysfunction.",
    image: "assets/people/audience-03.webp",
    focus: "56% 2%",
    alt: "Woman on a riverside promenade in light activewear",
  },
  {
    title: "Type 2 diabetes support",
    copy: "The mechanism may support glucose management and appetite control as part of clinician-led care.",
    image: "assets/people/audience-04.webp",
    focus: "46% 2%",
    alt: "Man pausing with a water bottle beside his bicycle",
  },
  {
    title: "Fatty liver prevention goals",
    copy: "Retatrutide may help lower liver fat and reduce systemic inflammation linked with metabolic dysfunction.",
    image: "assets/people/audience-05.webp",
    focus: "57% 2%",
    alt: "Woman taking a drink during a riverside cycling break",
  },
] as const;

export type Bundle = {
  name: string;
  quantity: number;
  supply: string;
  price: string;
  original: string;
  unit: string;
  saving: string;
  popular?: boolean;
};

export type Product = {
  id: "10" | "20";
  dosage: string;
  name: string;
  image: string;
  price: string;
  original: string;
  saving: string;
  accent: string;
  water: string;
  lab: { label: string; href?: string };
  bundles: readonly Bundle[];
};

export const products: readonly Product[] = [
  {
    id: "10",
    dosage: "10 mg / vial",
    name: "Retatrutide 10",
    image: "assets/product/retatrutide-10mg-v4.webp",
    price: "€61.30",
    original: "€73.80",
    saving: "Save €12.50",
    accent: "Violet identity",
    water: "1 ml water for injection",
    lab: { label: "Lab test · 99% purity", href: "#quality" },
    bundles: [
      { name: "Starter", quantity: 1, supply: "1 unit", price: "€61.30", original: "€73.80", unit: "€61.30 / unit", saving: "Save €12.50" },
      { name: "Performance", quantity: 3, supply: "3 units · buy 3 & save", price: "€166.80", original: "€221.40", unit: "€55.60 / unit", saving: "Save €54.60", popular: true },
      { name: "Pro cycle", quantity: 5, supply: "5 units · best value", price: "€251.25", original: "€369.00", unit: "€50.25 / unit", saving: "Save €117.75" },
    ],
  },
  {
    id: "20",
    dosage: "20 mg / vial",
    name: "Retatrutide 20",
    image: "assets/product/retatrutide-20mg-v4.webp",
    price: "€90.27",
    original: "€106.20",
    saving: "Save €15.93",
    accent: "Aqua identity",
    water: "1 ml bacteriostatic water",
    lab: { label: "Lab report · publishing soon" },
    bundles: [
      { name: "Starter", quantity: 1, supply: "1 unit", price: "€90.27", original: "€106.20", unit: "€90.27 / unit", saving: "Save €15.93" },
      { name: "Performance", quantity: 3, supply: "3 units · 3-month supply", price: "€270.81", original: "€318.60", unit: "€90.27 / unit", saving: "Save €47.79", popular: true },
      { name: "Pro cycle", quantity: 5, supply: "5 units · 5-month supply", price: "€451.35", original: "€531.00", unit: "€90.27 / unit", saving: "Save €79.65" },
    ],
  },
] as const;

export const reviews = [
  ["MoltenHarbinger", "3 Aug 2026", "Reported feeling full sooner and finding nutrition easier to manage."],
  ["Aki", "23 Jul 2026", "Noted visible progress in body composition and weight management."],
  ["Personanongrata", "5 Jul 2026", "Highlighted meaningful changes in body composition while also noting side effects."],
  ["TheGuy", "3 Jul 2026", "Focused on body-composition progress rather than changes on the scale alone."],
  ["BrunoBertrand", "3 Jul 2026", "Shared a positive experience with the reviewed Retatrutide product."],
  ["Arthuur", "7 Jul 2026", "Reported reduced appetite and easier adherence to a planned diet."],
] as const;

export const faqs = [
  ["What are the potential benefits of Retatrutide?", "Weight loss, improved glucose control and reduced appetite."],
  ["Can Retatrutide be combined with anabolic steroids?", "Low doses may be used to control appetite during cutting cycles. Combination decisions should be discussed with a qualified clinician."],
  ["Is Retatrutide safe?", "Early studies show it is generally well tolerated, but long-term data remains limited."],
  ["Do I need a prescription for Retatrutide?", "Yes. It is a controlled medication and requires a doctor’s prescription. Cross-border regulations may vary."],
  ["How quickly will I notice results?", "Appetite reduction can begin within the first 1–2 weeks. Noticeable weight-management changes may appear after 3–4 weeks, with effects building over several months."],
  ["Which product options are shown?", "Driada Medical Retatrutide is presented in 10 mg and 20 mg vial options, each supplied with a 1 ml ampoule of water for reconstitution."],
  ["Can I view the laboratory report?", "Yes. The supplied report for batch 82188 is available in the Quality & authenticity section."],
  ["How should Retatrutide be stored?", "Keep refrigerated at 2–8°C (36–46°F). Do not freeze. Protect from light and avoid frequent temperature changes."],
] as const;
