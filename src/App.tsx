import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import { benefits, faqs, products, receptors, reviews, type Bundle, type Product } from "./content";
import { Arrow, Eyebrow, CONSULT_URL, REVIEW_URL, Header, Footer, CookieBanner, useHeaderInvert, useReveal } from "./site";

const TRACKING_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
const SUBID_KEYS = ["subid", "sub_id", "clickid", "click_id", "cid", "cnv_id", "tid", "transaction_id"] as const;

// Carries the chosen product + bundle into the checkout mock via the query string —
// the hand-off point a real cart/session would replace later.
function checkoutHref(product: Product, bundle: Bundle) {
  const params = new URLSearchParams({ product: product.id, bundle: bundle.name, qty: String(bundle.quantity) });
  if (typeof window !== "undefined") {
    const query = new URLSearchParams(window.location.search);
    TRACKING_KEYS.forEach((key) => { const value = query.get(key); if (value) params.set(key, value.slice(0, 120)); });
    const subid = SUBID_KEYS.map((key) => query.get(key)).find(Boolean);
    if (subid) params.set("subid", subid.slice(0, 120));
  }
  return `checkout.html?${params.toString()}`;
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-topline">
        <span><i /> In stock</span>
        <span>Lab tested · 99% purity</span>
        <span>EU delivery · dispatch within 48 hours</span>
      </div>
      <div className="hero-copy" data-reveal>
        <Eyebrow>Triple-receptor peptide · Driada Medical</Eyebrow>
        <h1>Retat<span>rutide</span></h1>
        <div className="hero-intro">
          <h2>A next-generation peptide developed to support weight loss.</h2>
          <p>One molecule designed to activate GLP-1, GIP and glucagon pathways — supporting appetite control, glucose response and energy expenditure.</p>
        </div>
        <div className="hero-cta">
          <a className="button button--dark" href="#mechanism">Explore the mechanism<Arrow /></a>
          <a className="text-link" href={CONSULT_URL}>Consult an expert<Arrow /></a>
        </div>
      </div>
    </section>
  );
}

function TrustRail() {
  const items = [
    { value: "99%", label: "third-party tested purity", href: "#quality" },
    { value: "4.92 / 5", label: "36 forum reviews", href: REVIEW_URL },
    { value: "EU", label: "European delivery" },
    { value: "48h", label: "dispatch target" },
  ];
  return (
    <aside className="trust-rail" aria-label="Product highlights">
      <div className="trust-rail__track">
        <div className="trust-rail__group">
          {items.map((item) => item.href
            ? <a key={item.value} href={item.href}><strong>{item.value}</strong><span>{item.label}</span></a>
            : <div key={item.value}><strong>{item.value}</strong><span>{item.label}</span></div>)}
        </div>
        {[1, 2, 3, 4, 5].map((copy) => (
          <div className="trust-rail__group" aria-hidden="true" key={copy}>
            {items.map((item) => <div key={item.value}><strong>{item.value}</strong><span>{item.label}</span></div>)}
          </div>
        ))}
      </div>
    </aside>
  );
}

function Transformation() {
  const [progress, setProgress] = useState(0);
  const [manual, setManual] = useState(false);
  const progressRef = useRef(0);
  const phaseRef = useRef(0);
  const manualRef = useRef(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const labelId = useId();

  const commitProgress = (nextProgress: number) => {
    const next = Math.min(100, Math.max(0, nextProgress));
    progressRef.current = next;
    setProgress(next);
  };

  const takeControl = () => {
    if (manualRef.current) return;
    manualRef.current = true;
    setManual(true);
  };

  const updateFromPointer = (clientX: number) => {
    const track = trackRef.current;
    if (!track) return;
    const bounds = track.getBoundingClientRect();
    commitProgress(((clientX - bounds.left) / bounds.width) * 100);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || !event.isPrimary) return;
    event.preventDefault();
    takeControl();
    event.currentTarget.setPointerCapture(event.pointerId);
    updateFromPointer(event.clientX);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    event.preventDefault();
    updateFromPointer(event.clientX);
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const commands: Record<string, number> = {
      ArrowUp: 2,
      ArrowRight: 2,
      ArrowDown: -2,
      ArrowLeft: -2,
      PageUp: 10,
      PageDown: -10,
    };
    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      takeControl();
      commitProgress(event.key === "Home" ? 0 : 100);
      return;
    }
    const adjustment = commands[event.key];
    if (adjustment === undefined) return;
    event.preventDefault();
    takeControl();
    commitProgress(progressRef.current + adjustment);
  };

  useEffect(() => {
    if (manual) return;
    const desktop = window.matchMedia("(min-width: 761px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame = 0;
    let previousTime = 0;

    const animate = (time: number) => {
      if (manualRef.current || !desktop.matches || reducedMotion.matches) return;
      if (previousTime) {
        const elapsed = Math.min(time - previousTime, 48);
        phaseRef.current = (phaseRef.current + elapsed * ((Math.PI * 2) / 9200)) % (Math.PI * 2);
        commitProgress(50 - Math.cos(phaseRef.current) * 50);
      }
      previousTime = time;
      animationFrame = window.requestAnimationFrame(animate);
    };

    const syncAnimation = () => {
      window.cancelAnimationFrame(animationFrame);
      previousTime = 0;
      if (desktop.matches && !reducedMotion.matches && !manualRef.current) {
        animationFrame = window.requestAnimationFrame(animate);
      }
    };

    syncAnimation();
    desktop.addEventListener("change", syncAnimation);
    reducedMotion.addEventListener("change", syncAnimation);
    return () => {
      window.cancelAnimationFrame(animationFrame);
      desktop.removeEventListener("change", syncAnimation);
      reducedMotion.removeEventListener("change", syncAnimation);
    };
  }, [manual]);

  return (
    <div
      className={manual ? "transformation is-manual" : "transformation"}
      style={{ "--p": progress } as CSSProperties}
    >
      <div className="transformation-frame">
        <img className="transformation-before" src="assets/people/transformation-start-v2.webp" alt="Woman at the start of an illustrative body-composition transformation" width="900" height="1350" decoding="async" />
        <img className="transformation-after" src="assets/people/transformation-progress-v2.webp" alt="The same woman after an illustrative body-composition transformation" width="900" height="1350" decoding="async" />
      </div>
      <div className="transformation-labels" aria-hidden="true"><span>Start</span><span>Progress</span></div>
      <span id={labelId} className="sr-only">Drag horizontally from Start to Progress to move from the fuller starting figure to the slimmer progress figure</span>
      <div
        ref={trackRef}
        className="transformation-control"
        role="slider"
        tabIndex={0}
        aria-labelledby={labelId}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
        aria-valuetext={`${Math.round(progress)}% progress`}
        aria-orientation="horizontal"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onKeyDown={handleKeyDown}
      />
      <div className="transformation-range" aria-hidden="true"><div className="transformation-divider"><b /></div></div>
    </div>
  );
}

function About() {
  return (
    <section className="section about" id="about">
      <div className="section-shell">
        <div className="section-heading split-heading" data-reveal>
          <div><Eyebrow>What is Retatrutide</Eyebrow><h2>Three signals.<br />One molecule.</h2></div>
          <p><span>Retatrutide is designed to activate three key metabolic pathways at the same time. That combined approach represents a new direction in metabolic research.</span></p>
        </div>
        <div className="about-grid">
          <div data-reveal><Transformation /></div>
          <div className="signal-diagram" data-reveal>
            <p>One molecule · three signals</p>
            <div className="signal-diagram__nodes">{receptors.map((item) => <span key={item.short}>{item.short}</span>)}</div>
            <div className="signal-diagram__threads" aria-hidden="true"><i /><i /><i /></div>
            <div className="signal-diagram__core"><small>Combined activation</small><strong>Triple-action<br />signal</strong></div>
            <div className="signal-diagram__outcomes">{receptors.map((item) => <span key={item.title}><small>{item.number}</small>{item.title}</span>)}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Mechanism() {
  return (
    <section className="section mechanism" id="mechanism" data-dark>
      <div className="section-shell">
        <div className="section-heading split-heading" data-reveal>
          <div><Eyebrow>How Retatrutide works</Eyebrow><h2>A coordinated<br />metabolic response.</h2></div>
          <p><span>The three receptor pathways address different parts of the metabolic response — appetite, glucose regulation and energy expenditure.</span></p>
        </div>
        <div className="mechanism-list">
          {receptors.map((item) => (
            <article key={item.number} data-reveal>
              <span className="mechanism-number">{item.number}</span>
              <h3>{item.short}</h3>
              <div><h4>{item.title}</h4><p>{item.copy}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhoFor() {
  const [active, setActive] = useState(0);
  const tabsId = useId();
  const moveTab = (index: number) => {
    const next = (index + benefits.length) % benefits.length;
    setActive(next);
    requestAnimationFrame(() => document.getElementById(`${tabsId}-tab-${next}`)?.focus());
  };
  return (
    <section className="section who" id="who">
      <div className="section-shell">
        <div className="section-heading split-heading" data-reveal>
          <div><Eyebrow>Who may benefit</Eyebrow><h2>Designed around<br />real-life goals.</h2></div>
          <p><span>Select an area to review the information provided for that group.</span></p>
        </div>
        <div className="who-stage" data-reveal>
          <div className="who-media">
            {benefits.map((item, index) => (
              <img
                key={item.image}
                className={active === index ? "is-active" : ""}
                src={item.image}
                style={{ objectPosition: item.focus }}
                alt={active === index ? item.alt : ""}
                aria-hidden={active !== index}
                width="1536"
                height="1024"
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
              />
            ))}
          </div>
          <div className="who-card" id={`${tabsId}-panel`} role="tabpanel" aria-labelledby={`${tabsId}-tab-${active}`} aria-live="polite">
            <span>0{active + 1} / 05</span>
            <h3>{benefits[active].title}</h3>
            <p>{benefits[active].copy}</p>
          </div>
        </div>
        <div className="who-tabs" role="tablist" aria-label="Benefit topics">
          {benefits.map((item, index) => (
            <button key={item.title} id={`${tabsId}-tab-${index}`} role="tab" aria-controls={`${tabsId}-panel`} aria-selected={active === index} tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={(event) => {
              if (event.key === "ArrowRight") { event.preventDefault(); moveTab(index + 1); }
              if (event.key === "ArrowLeft") { event.preventDefault(); moveTab(index - 1); }
              if (event.key === "Home") { event.preventDefault(); moveTab(0); }
              if (event.key === "End") { event.preventDefault(); moveTab(benefits.length - 1); }
            }}>
              <span>0{index + 1}</span>{item.title}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <article className={`product-card product-card--${product.id}`} data-reveal>
      <div className="product-card__visual">
        <span className="product-card__index">{product.id} MG</span>
        <img src={product.image} alt={`Driada Medical Retatrutide ${product.dosage} packaging`} width="1400" height="933" loading="eager" />
      </div>
      <div className="product-card__body">
        <div className="product-card__meta"><span><i /> In stock</span>{product.lab.href
          ? <a href={product.lab.href}>{product.lab.label}</a>
          : <em>{product.lab.label}</em>}</div>
        <Eyebrow>Driada Medical · {product.accent}</Eyebrow>
        <h3>Retatrutide</h3>
        <p className="product-card__dose">{product.dosage}</p>
        <div className="product-card__price"><strong>{product.price}</strong><s>{product.original}</s><span>{product.saving}</span></div>
        <dl>
          <div><dt>Composition</dt><dd>Retatrutide {product.id} mg</dd></div>
          <div><dt>Category</dt><dd>Peptide</dd></div>
          <div><dt>Purpose</dt><dd>Weight loss</dd></div>
          <div><dt>Form</dt><dd>Vial with lyophilised powder + {product.water}</dd></div>
          <div><dt>Administration</dt><dd>Subcutaneous injections</dd></div>
        </dl>
        <div className="product-card__actions"><a className="button button--dark" href={checkoutHref(product, product.bundles[0])}>Buy now<Arrow /></a><a className="button button--ghost" href={CONSULT_URL}>Consult an expert<Arrow /></a></div>
      </div>
    </article>
  );
}

function PricingGroup({ product }: { product: Product }) {
  return (
    <section className={`pricing-group pricing-group--${product.id}`} aria-labelledby={`pricing-${product.id}`} data-reveal>
      <header>
        <div><span>{product.id}</span><p>Driada Medical</p></div>
        <div><h3 id={`pricing-${product.id}`}>Retatrutide {product.id} mg</h3><p>Choose the quantity that fits your plan.</p></div>
        <strong className="pricing-group__unit">{product.price}<small> / unit</small></strong>
      </header>
      <div className="pricing-rows">
        {product.bundles.map((bundle) => (
          <article key={bundle.name} className={bundle.popular ? "is-popular" : ""}>
            <div className="pricing-name"><strong>{bundle.name}</strong><small>{bundle.supply}</small></div>
            <div className="pricing-total"><strong>{bundle.price}</strong><s>{bundle.original}</s></div>
            <div className="pricing-value"><span>{bundle.unit}</span><span>{bundle.saving}</span></div>
            <a className="button button--dark" href={checkoutHref(product, bundle)}>Choose {bundle.quantity} {bundle.quantity === 1 ? "unit" : "units"}<Arrow /></a>
          </article>
        ))}
      </div>
    </section>
  );
}

const paymentDeliveryPoints = [
  { label: "EU Delivery", copy: "Delivery options are available across supported EU destinations." },
  { label: "Dispatch", copy: "Order processing and dispatch details are confirmed as part of checkout." },
  { label: "Payment Methods", copy: "Available payment options are presented on the checkout page." },
  { label: "Tracking", copy: "Tracking is provided where offered by the selected shipping method." },
] as const;

function PaymentDelivery() {
  return (
    <div className="payment-delivery" data-reveal>
      <div className="payment-delivery__head">
        <Eyebrow>Payment & delivery</Eyebrow>
        <p>What to expect once you check out.</p>
      </div>
      <div className="payment-delivery__grid">
        {paymentDeliveryPoints.map((point, index) => (
          <div key={point.label}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{point.label}</strong>
            <p>{point.copy}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Products() {
  return (
    <section className="section products" id="products">
      <div className="section-shell">
        <div className="section-heading split-heading" data-reveal>
          <div><Eyebrow>Two product options</Eyebrow><h2>Choose your<br />Retatrutide.</h2></div>
          <p><span>Two Driada Medical formats, shown at their real proportions and with their individual pricing.</span></p>
        </div>
        <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
        <div className="pricing-heading" data-reveal><Eyebrow>Quantity & price</Eyebrow><h2>One clear choice at a time.</h2></div>
        <div className="pricing-stack">{products.map((product) => <PricingGroup key={product.id} product={product} />)}</div>
        <aside className="storage" data-reveal>
          <div><Eyebrow>Storage & safety</Eyebrow><h3>Keep it stable.</h3></div>
          <ul>
            <li>Keep refrigerated at 2–8°C (36–46°F).</li><li>Do not freeze.</li><li>Protect from light.</li><li>Avoid frequent temperature changes.</li><li>Once reconstituted, refrigerate and use within approximately one month.</li>
          </ul>
        </aside>
        <PaymentDelivery />
      </div>
    </section>
  );
}

function Quality({ onOpen }: { onOpen: () => void }) {
  return (
    <section className="section quality" id="quality">
      <div className="section-shell">
        <div className="section-heading split-heading" data-reveal>
          <div><Eyebrow>Quality & authenticity</Eyebrow><h2>Documentation<br />you can inspect.</h2></div>
          <p><span>The supplied laboratory report is presented with the product identity and batch information so the available material can be reviewed directly.</span></p>
        </div>
        <div className="quality-card" data-reveal>
          <button className="quality-preview" type="button" onClick={onOpen} aria-label="Open laboratory report">
            <img src="assets/documents/retatrutide-lab-report.png" alt="Preview of laboratory report for Retatrutide batch 82188" width="725" height="1107" loading="lazy" />
            <span>Open document<Arrow /></span>
          </button>
          <div className="quality-data">
            <span className="status-pill"><i /> Document available</span>
            <h3>Laboratory analysis report</h3>
            <dl><div><dt>Report date</dt><dd>24 June 2026</dd></div><div><dt>Batch</dt><dd>82188</dd></div><div><dt>Reported content</dt><dd>10.77 mg</dd></div><div><dt>Reported purity</dt><dd>99%</dd></div></dl>
            <button className="button button--dark" type="button" onClick={onOpen}>View laboratory report<Arrow /></button>
            <p>Independent third-party laboratory test. Values are reproduced from the supplied document; review the full report before relying on individual figures.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  return (
    <section className="section reviews" id="reviews">
      <div className="section-shell">
        <div className="reviews-heading" data-reveal><div><Eyebrow>Verified forum reviews</Eyebrow><h2>What customers say.</h2></div><a href={REVIEW_URL}><strong>4.92 / 5</strong><span>★★★★★</span><small>36 reviews<Arrow /></small></a></div>
        <div className="review-grid">{reviews.map(([name, date, body], index) => <a href={REVIEW_URL} className="review-card" key={name} data-reveal><div><span>{String(index + 1).padStart(2, "0")}</span><span>★★★★★</span></div><blockquote>“{body}”</blockquote><footer><strong>{name}</strong><time>{date}</time></footer></a>)}</div>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section className="section faq" id="faq">
      <div className="section-shell faq-grid">
        <div className="faq-heading" data-reveal><Eyebrow>FAQ</Eyebrow><h2>Questions,<br />answered.</h2><p>Need product or order support?</p><a className="text-link" href={CONSULT_URL}>Consult an expert<Arrow /></a></div>
        <div className="faq-list">{faqs.map(([question, answer], index) => <details key={question} open={index === 0} data-reveal><summary><span>{String(index + 1).padStart(2, "0")}</span>{question}<i /></summary><p>{answer}</p></details>)}</div>
      </div>
    </section>
  );
}

function ReportDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);
  return (
    <dialog ref={dialogRef} className="report-dialog" onClose={onClose} onClick={(event) => { if (event.target === dialogRef.current) onClose(); }}>
      <header><strong>Laboratory analysis report</strong><button type="button" onClick={onClose} aria-label="Close report">×</button></header>
      <img src="assets/documents/retatrutide-lab-report.png" alt="Laboratory analysis report for Driada Medical Retatrutide batch 82188" width="725" height="1107" />
    </dialog>
  );
}

export default function App() {
  const [reportOpen, setReportOpen] = useState(false);
  useHeaderInvert();
  useReveal();
  return (
    <>
      <Header /><main><Hero /><TrustRail /><About /><Mechanism /><WhoFor /><Products /><Quality onOpen={() => setReportOpen(true)} /><Reviews /><FAQ /></main><Footer />
      <CookieBanner />
      <ReportDialog open={reportOpen} onClose={() => setReportOpen(false)} />
    </>
  );
}
