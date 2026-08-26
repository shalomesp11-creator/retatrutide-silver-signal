import { useEffect, useId, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import { benefits, faqs, nav, products, receptors, reviews, type Product } from "./content";

const CART_ENDPOINT = "https://driadashop.to/index.php?route=external/cart/add";
const CART_TOKEN = "1912.bedc2c70ff05b76507b1478aa3f0ed44ed757a932014dbf6c0993527f02bc750";
const CONSULT_URL = "https://driadashop.helpline.to/en-US/new-ticket";
const REVIEW_URL = "https://peds.to/reviews/retatrutide.157/reviews";
const TRACKING_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
const SUBID_KEYS = ["subid", "sub_id", "clickid", "click_id", "cid", "cnv_id", "tid", "transaction_id"] as const;

function Arrow() {
  return <svg className="arrow-icon" aria-hidden="true" viewBox="0 0 16 16"><path d="M4 12 12 4M6 4h6v6" /></svg>;
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow"><span />{children}</p>;
}

function CartForm({ quantity = 1, className = "", children = "Buy now" }: { quantity?: number; className?: string; children?: ReactNode }) {
  const query = typeof window === "undefined" ? null : new URLSearchParams(window.location.search);
  const tracking: Array<{ name: string; value: string }> = TRACKING_KEYS.flatMap((name) => {
    const value = query?.get(name);
    return value ? [{ name, value: value.slice(0, 120) }] : [];
  });
  const subid = SUBID_KEYS.map((name) => query?.get(name)).find(Boolean);
  if (subid) tracking.push({ name: "subid", value: subid.slice(0, 120) });
  return (
    <form className={`cart-form ${className}`.trim()} method="post" action={CART_ENDPOINT}>
      <input type="hidden" name="token" value={CART_TOKEN} />
      <input type="hidden" name="quantity" value={quantity} />
      {tracking.map((field) => <input key={field.name} type="hidden" name={field.name} value={field.value} />)}
      <button className="button button--dark" type="submit">{children}<Arrow /></button>
    </form>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  return (
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="Retatrutide home">RETATRUTIDE</a>
      <button className="menu-button" type="button" aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen(!open)}>
        <span>{open ? "Close" : "Menu"}</span><i /><i />
      </button>
      <nav id="site-nav" className={open ? "nav is-open" : "nav"} aria-label="Main navigation">
        {nav.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}
      </nav>
      <div className="header-actions">
        <a className="button button--ghost" href={CONSULT_URL}>Consult an expert<Arrow /></a>
        <a className="button button--dark" href="#products">Buy now<Arrow /></a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-orbit hero-orbit--one" aria-hidden="true" />
      <div className="hero-orbit hero-orbit--two" aria-hidden="true" />
      <div className="hero-topline">
        <span><i /> In stock</span>
        <span>Lab tested · 99% purity</span>
        <span>EU delivery · dispatch within 48 hours</span>
      </div>
      <div className="hero-copy" data-reveal>
        <Eyebrow>Triple-receptor peptide · Driada Medical</Eyebrow>
        <h1>Reta<span>trutide</span></h1>
        <div className="hero-intro">
          <h2>A next-generation peptide developed to support weight loss.</h2>
          <p>One molecule designed to activate GLP-1, GIP and glucagon pathways — supporting appetite control, glucose response and energy expenditure.</p>
        </div>
        <div className="hero-cta">
          <a className="button button--dark" href="#mechanism">Explore the mechanism<Arrow /></a>
          <a className="text-link" href={CONSULT_URL}>Consult an expert<Arrow /></a>
        </div>
      </div>
      <div className="hero-signal" aria-label="Three receptor pathways">
        {receptors.map((item) => (
          <div key={item.short}>
            <small>{item.number}</small>
            <strong>{item.short}</strong>
            <span>{item.title}</span>
          </div>
        ))}
        <div className="hero-signal__result">
          <small>Combined</small><strong>Triple-action signal</strong><span>One coordinated mechanism</span>
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
        <div className="trust-rail__group" aria-hidden="true">
          {items.map((item) => <div key={item.value}><strong>{item.value}</strong><span>{item.label}</span></div>)}
        </div>
      </div>
    </aside>
  );
}

function Transformation() {
  const [position, setPosition] = useState(50);
  const [manual, setManual] = useState(false);
  const labelId = useId();
  return (
    <div className={manual ? "transformation is-manual" : "transformation"} style={{ "--compare": `${position}%` } as CSSProperties}>
      <img src="assets/people/transformation-start-v2.webp" alt="Woman before an illustrative body-composition transformation" width="900" height="1350" decoding="async" />
      <div className="transformation-after"><img src="assets/people/transformation-progress-v2.webp" alt="The same woman after an illustrative body-composition transformation" width="900" height="1350" decoding="async" /></div>
      <div className="transformation-line" aria-hidden="true"><span><svg viewBox="0 0 24 24"><path d="m9 7-5 5 5 5M15 7l5 5-5 5M4 12h16" /></svg></span></div>
      <div className="transformation-labels"><span>Start</span><span>Progress</span></div>
      <label id={labelId} className="sr-only" htmlFor={`${labelId}-range`}>Compare illustrative before and after images</label>
      <input id={`${labelId}-range`} type="range" min="8" max="92" value={position} aria-labelledby={labelId} onInput={(event: FormEvent<HTMLInputElement>) => { setManual(true); setPosition(Number(event.currentTarget.value)); }} />
    </div>
  );
}

function About() {
  return (
    <section className="section about" id="about">
      <div className="section-shell">
        <div className="section-heading split-heading" data-reveal>
          <div><Eyebrow>What is Retatrutide</Eyebrow><h2>Three signals.<br />One molecule.</h2></div>
          <p>Retatrutide is designed to activate three key metabolic pathways at the same time. That combined approach represents a new direction in metabolic research.</p>
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
    <section className="section mechanism" id="mechanism">
      <div className="section-shell">
        <div className="section-heading split-heading" data-reveal>
          <div><Eyebrow>How Retatrutide works</Eyebrow><h2>A coordinated<br />metabolic response.</h2></div>
          <p>The three receptor pathways address different parts of the metabolic response — appetite, glucose regulation and energy expenditure.</p>
        </div>
        <div className="mechanism-list">
          {receptors.map((item) => (
            <article key={item.number} data-reveal>
              <span className="mechanism-number">{item.number}</span>
              <h3>{item.short}</h3>
              <div><h4>{item.title}</h4><p>{item.copy}</p></div>
              <i aria-hidden="true" />
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
          <p>Select an area to review the information provided for that group.</p>
        </div>
        <div className="who-stage" data-reveal>
          <div className="who-media">
            {benefits.map((item, index) => (
              <img
                key={item.image}
                className={active === index ? "is-active" : ""}
                src={item.image}
                alt={active === index ? item.alt : ""}
                aria-hidden={active !== index}
                width="1440"
                height="960"
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
        <div className="product-card__halo" aria-hidden="true" />
        <img src={product.image} alt={`Driada Medical Retatrutide ${product.dosage} packaging`} width="900" height="900" loading="lazy" />
      </div>
      <div className="product-card__body">
        <div className="product-card__meta"><span><i /> In stock</span><a href="#quality">Lab test · 99% purity</a></div>
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
        <div className="product-card__actions"><CartForm /><a className="button button--ghost" href={CONSULT_URL}>Consult an expert<Arrow /></a></div>
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
        <strong>{product.price}<small> / unit</small></strong>
      </header>
      <div className="pricing-rows">
        {product.bundles.map((bundle) => (
          <article key={bundle.name} className={bundle.popular ? "is-popular" : ""}>
            <div className="pricing-name">{bundle.popular && <span>Most popular</span>}<strong>{bundle.name}</strong><small>{bundle.supply}</small></div>
            <div className="pricing-total"><strong>{bundle.price}</strong><s>{bundle.original}</s></div>
            <div className="pricing-value"><span>{bundle.unit}</span><span>{bundle.saving}</span></div>
            <CartForm quantity={bundle.quantity}>Choose {bundle.quantity} {bundle.quantity === 1 ? "unit" : "units"}</CartForm>
          </article>
        ))}
      </div>
    </section>
  );
}

function Products() {
  return (
    <section className="section products" id="products">
      <div className="section-shell">
        <div className="section-heading split-heading" data-reveal>
          <div><Eyebrow>Two product options</Eyebrow><h2>Choose your<br />Retatrutide.</h2></div>
          <p>Two Driada Medical formats, shown at their real proportions and with their individual pricing.</p>
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
          <p>The supplied laboratory report is presented with the product identity and batch information so the available material can be reviewed directly.</p>
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

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-signal" aria-hidden="true">RETATRUTIDE</div>
      <div className="footer-grid">
        <div><a className="wordmark" href="#top">RETATRUTIDE</a><p>Product information, documentation and the next purchasing step in one place.</p><div><a className="button button--light" href={CONSULT_URL}>Consult an expert<Arrow /></a><a className="button button--metal" href="#products">Buy now<Arrow /></a></div></div>
        <nav aria-label="Footer"><strong>Explore</strong>{nav.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</nav>
        <div className="footer-meta"><strong>Independent sources</strong><a href={REVIEW_URL}>Forum reviews<Arrow /></a><a href="https://www.eroids.com/reviews/driadashop.to">DriadaShop reviews<Arrow /></a><button type="button" onClick={() => window.dispatchEvent(new Event("retatrutide:open-cookie-settings"))}>Cookie settings</button></div>
      </div>
      <div className="footer-bottom"><p>Early studies show Retatrutide is generally well tolerated, but long-term data is limited. A doctor’s prescription is required.</p><span>© 2026 Retatrutide</span><a href="#top">Back to top ↑</a></div>
    </footer>
  );
}

function MobileBuy() {
  const [heroVisible, setHeroVisible] = useState(true);
  const [footerVisible, setFooterVisible] = useState(false);
  useEffect(() => {
    const hero = document.getElementById("top");
    const footer = document.querySelector(".site-footer");
    const heroObserver = hero ? new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting), { threshold: .01 }) : null;
    const footerObserver = footer ? new IntersectionObserver(([entry]) => setFooterVisible(entry.isIntersecting), { threshold: .01 }) : null;
    if (hero && heroObserver) heroObserver.observe(hero);
    if (footer && footerObserver) footerObserver.observe(footer);
    return () => { heroObserver?.disconnect(); footerObserver?.disconnect(); };
  }, []);
  if (heroVisible || footerVisible) return null;
  return <div className="mobile-buy"><CartForm>Buy now</CartForm></div>;
}

function CookieBanner() {
  const consentKey = "retatrutide-essential-cookie-choice";
  const dismissedKey = "retatrutide-cookie-notice-dismissed";
  const [visible, setVisible] = useState(() => {
    try { return localStorage.getItem(consentKey) !== "accepted" && sessionStorage.getItem(dismissedKey) !== "true"; }
    catch { return true; }
  });
  useEffect(() => {
    const open = () => setVisible(true);
    window.addEventListener("retatrutide:open-cookie-settings", open);
    return () => window.removeEventListener("retatrutide:open-cookie-settings", open);
  }, []);
  if (!visible) return null;
  return (
    <aside className="cookie-banner" aria-label="Cookie notice" aria-live="polite">
      <p><strong>Your privacy matters.</strong> This site uses essential cookies only.</p>
      <div><button type="button" onClick={() => { try { sessionStorage.setItem(dismissedKey, "true"); } catch { /* storage can be unavailable */ } setVisible(false); }}>Dismiss</button><button type="button" onClick={() => { try { localStorage.setItem(consentKey, "accepted"); } catch { /* storage can be unavailable */ } setVisible(false); }}>Accept essential</button></div>
    </aside>
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
  useEffect(() => {
    document.documentElement.classList.add("js");
    const nodes = [...document.querySelectorAll<HTMLElement>("[data-reveal]")];
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } }), { rootMargin: "0px 0px -8%", threshold: 0.08 });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
  return (
    <>
      <Header /><main><Hero /><TrustRail /><About /><Mechanism /><WhoFor /><Products /><Quality onOpen={() => setReportOpen(true)} /><Reviews /><FAQ /></main><Footer />
      <MobileBuy /><CookieBanner />
      <ReportDialog open={reportOpen} onClose={() => setReportOpen(false)} />
    </>
  );
}
