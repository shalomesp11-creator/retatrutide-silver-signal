import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import { benefitMeta, products, receptorMeta, reviewMeta, type Bundle, type Product } from "./content";
import { Arrow, Eyebrow, CONSULT_URL, REVIEW_URL, Header, Footer, CookieBanner, useHeaderInvert, useReveal } from "./site";
import { useT } from "./i18n";

const TRACKING_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
const SUBID_KEYS = ["subid", "sub_id", "clickid", "click_id", "cid", "cnv_id", "tid", "transaction_id"] as const;

// Carries the chosen product + bundle into the checkout mock via the query string —
// the hand-off point a real cart/session would replace later.
function checkoutHref(product: Product, bundle: Bundle) {
  const params = new URLSearchParams({ product: product.id, bundle: bundle.id, qty: String(bundle.quantity) });
  if (typeof window !== "undefined") {
    const query = new URLSearchParams(window.location.search);
    TRACKING_KEYS.forEach((key) => { const value = query.get(key); if (value) params.set(key, value.slice(0, 120)); });
    const subid = SUBID_KEYS.map((key) => query.get(key)).find(Boolean);
    if (subid) params.set("subid", subid.slice(0, 120));
  }
  return `checkout.html?${params.toString()}`;
}

function Hero() {
  const t = useT();
  return (
    <section className="hero" id="top">
      <div className="hero-topline">
        <span><i /> {t.hero.inStock}</span>
        <span>{t.hero.labTested}</span>
        <span>{t.hero.delivery}</span>
      </div>
      <div className="hero-copy" data-reveal>
        <Eyebrow>{t.hero.eyebrow} · Driada Medical</Eyebrow>
        <h1>Retat<span>rutide</span></h1>
        <div className="hero-intro">
          <h2>{t.hero.subtitle}</h2>
          <p>{t.hero.description}</p>
        </div>
        <div className="hero-cta">
          <a className="button button--dark" href="#mechanism">{t.hero.ctaExplore}<Arrow /></a>
          <a className="text-link" href={CONSULT_URL}>{t.common.consultExpert}<Arrow /></a>
        </div>
      </div>
    </section>
  );
}

function TrustRail() {
  const t = useT();
  const items = [
    { value: "99%", label: t.trustRail.purity, href: "#quality" },
    { value: "4.92 / 5", label: `36 ${t.trustRail.reviews}`, href: REVIEW_URL },
    { value: "EU", label: t.trustRail.delivery },
    { value: "48h", label: t.trustRail.dispatch },
  ];
  return (
    <aside className="trust-rail" aria-label={t.trustRail.ariaLabel}>
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
  const t = useT();
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
        <img className="transformation-before" src="assets/people/transformation-start-v2.webp" alt={t.transformation.altBefore} width="900" height="1350" decoding="async" />
        <img className="transformation-after" src="assets/people/transformation-progress-v2.webp" alt={t.transformation.altAfter} width="900" height="1350" decoding="async" />
      </div>
      <div className="transformation-labels" aria-hidden="true"><span>{t.transformation.start}</span><span>{t.transformation.progress}</span></div>
      <span id={labelId} className="sr-only">{t.transformation.srDescription}</span>
      <div
        ref={trackRef}
        className="transformation-control"
        role="slider"
        tabIndex={0}
        aria-labelledby={labelId}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
        aria-valuetext={`${Math.round(progress)}% ${t.transformation.progress}`}
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
  const t = useT();
  return (
    <section className="section about" id="about">
      <div className="section-shell">
        <div className="section-heading split-heading" data-reveal>
          <div><Eyebrow>{t.about.eyebrow}</Eyebrow><h2>{t.about.titleLine1}<br />{t.about.titleLine2}</h2></div>
          <p><span>{t.about.description}</span></p>
        </div>
        <div className="about-grid">
          <div data-reveal><Transformation /></div>
          <div className="signal-diagram" data-reveal>
            <p>{t.about.diagramLabel}</p>
            <div className="signal-diagram__nodes">{receptorMeta.map((item) => <span key={item.short}>{item.short}</span>)}</div>
            <div className="signal-diagram__threads" aria-hidden="true"><i /><i /><i /></div>
            <div className="signal-diagram__core"><small>{t.about.coreLabel}</small><strong>{t.about.coreLine1}<br />{t.about.coreLine2}</strong></div>
            <div className="signal-diagram__outcomes">{receptorMeta.map((item, index) => <span key={item.short}><small>{item.number}</small>{t.mechanism.items[index].title}</span>)}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Mechanism() {
  const t = useT();
  return (
    <section className="section mechanism" id="mechanism" data-dark>
      <div className="section-shell">
        <div className="section-heading split-heading" data-reveal>
          <div><Eyebrow>{t.mechanism.eyebrow}</Eyebrow><h2>{t.mechanism.titleLine1}<br />{t.mechanism.titleLine2}</h2></div>
          <p><span>{t.mechanism.description}</span></p>
        </div>
        <div className="mechanism-list">
          {receptorMeta.map((item, index) => (
            <article key={item.number} data-reveal>
              <span className="mechanism-number">{item.number}</span>
              <h3>{item.short}</h3>
              <div><h4>{t.mechanism.items[index].title}</h4><p>{t.mechanism.items[index].copy}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhoFor() {
  const t = useT();
  const benefits = t.who.items;
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
          <div><Eyebrow>{t.who.eyebrow}</Eyebrow><h2>{t.who.titleLine1}<br />{t.who.titleLine2}</h2></div>
          <p><span>{t.who.description}</span></p>
        </div>
        <div className="who-stage" data-reveal>
          <div className="who-media">
            {benefitMeta.map((meta, index) => (
              <img
                key={meta.image}
                className={active === index ? "is-active" : ""}
                src={meta.image}
                style={{ objectPosition: meta.focus }}
                alt={active === index ? benefits[index].alt : ""}
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
        <div className="who-tabs" role="tablist" aria-label={t.who.tabsAriaLabel}>
          {benefits.map((item, index) => (
            <button key={benefitMeta[index].image} id={`${tabsId}-tab-${index}`} role="tab" aria-controls={`${tabsId}-panel`} aria-selected={active === index} tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={(event) => {
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
  const t = useT();
  const info = t.products.byId[product.id];
  return (
    <article className={`product-card product-card--${product.id}`} data-reveal>
      <div className="product-card__visual">
        <span className="product-card__index">{product.id} MG</span>
        <img src={product.image} alt={`${t.products.imgAltPrefix}${product.dosage}${t.products.imgAltSuffix}`} width="1400" height="933" loading="eager" />
      </div>
      <div className="product-card__body">
        <div className="product-card__meta"><span><i /> {t.common.inStock}</span>{product.labHref
          ? <a href={product.labHref}>{info.labLabel}</a>
          : <em>{info.labLabel}</em>}</div>
        <Eyebrow>Driada Medical · {info.accent}</Eyebrow>
        <h3>Retatrutide</h3>
        <p className="product-card__dose">{product.dosage}</p>
        <div className="product-card__price"><strong>{product.price}</strong><s>{product.original}</s><span>{t.common.savingBadge}</span></div>
        <dl>
          <div><dt>{t.products.composition}</dt><dd>Retatrutide {product.id} mg</dd></div>
          <div><dt>{t.products.category}</dt><dd>{t.products.categoryValue}</dd></div>
          <div><dt>{t.products.purpose}</dt><dd>{t.products.purposeValue}</dd></div>
          <div><dt>{t.products.form}</dt><dd>{t.products.formPrefix}{info.water}</dd></div>
          <div><dt>{t.products.administration}</dt><dd>{t.products.administrationValue}</dd></div>
        </dl>
        <div className="product-card__actions"><a className="button button--dark" href={checkoutHref(product, product.bundles[0])}>{t.common.buyNow}<Arrow /></a><a className="button button--ghost" href={CONSULT_URL}>{t.common.consultExpert}<Arrow /></a></div>
      </div>
    </article>
  );
}

function PricingGroup({ product }: { product: Product }) {
  const t = useT();
  const info = t.products.byId[product.id];
  return (
    <section className={`pricing-group pricing-group--${product.id}`} aria-labelledby={`pricing-${product.id}`} data-reveal>
      <header>
        <div><span>{product.id}</span><p>Driada Medical</p></div>
        <div><h3 id={`pricing-${product.id}`}>Retatrutide {product.id} mg</h3><p>{t.products.choosePlan}</p></div>
        <strong className="pricing-group__unit">{product.price}<small> {t.common.perUnit}</small></strong>
      </header>
      <div className="pricing-rows">
        {product.bundles.map((bundle) => {
          const bundleInfo = info.bundles[bundle.id];
          return (
            <article key={bundle.id} className={bundle.popular ? "is-popular" : ""}>
              <div className="pricing-name"><strong>{bundleInfo.name}</strong><small>{bundleInfo.supply}</small></div>
              <div className="pricing-total"><strong>{bundle.price}</strong><s>{bundle.original}</s></div>
              <div className="pricing-value"><span>{bundle.unit} {t.common.perUnit}</span><span>{t.common.savingBadge}</span></div>
              <a className="button button--dark" href={checkoutHref(product, bundle)}>{t.common.chooseButton(bundle.quantity)}<Arrow /></a>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function PaymentDelivery() {
  const t = useT();
  return (
    <div className="payment-delivery" data-reveal>
      <div className="payment-delivery__head">
        <Eyebrow>{t.paymentDelivery.eyebrow}</Eyebrow>
        <p>{t.paymentDelivery.subtitle}</p>
      </div>
      <div className="payment-delivery__grid">
        {t.paymentDelivery.points.map((point, index) => (
          <div key={index}>
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
  const t = useT();
  return (
    <section className="section products" id="products">
      <div className="section-shell">
        <div className="section-heading split-heading" data-reveal>
          <div><Eyebrow>{t.products.eyebrow}</Eyebrow><h2>{t.products.titleLine1}<br />{t.products.titleLine2}</h2></div>
          <p><span>{t.products.description}</span></p>
        </div>
        <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
        <div className="pricing-heading" data-reveal><Eyebrow>{t.products.quantityEyebrow}</Eyebrow><h2>{t.products.quantityTitle}</h2></div>
        <div className="pricing-stack">{products.map((product) => <PricingGroup key={product.id} product={product} />)}</div>
        <aside className="storage" data-reveal>
          <div><Eyebrow>{t.storage.eyebrow}</Eyebrow><h3>{t.storage.title}</h3></div>
          <ul>{t.storage.items.map((item, index) => <li key={index}>{item}</li>)}</ul>
        </aside>
        <PaymentDelivery />
      </div>
    </section>
  );
}

function Quality({ onOpen }: { onOpen: () => void }) {
  const t = useT();
  return (
    <section className="section quality" id="quality">
      <div className="section-shell">
        <div className="section-heading split-heading" data-reveal>
          <div><Eyebrow>{t.quality.eyebrow}</Eyebrow><h2>{t.quality.titleLine1}<br />{t.quality.titleLine2}</h2></div>
          <p><span>{t.quality.description}</span></p>
        </div>
        <div className="quality-card" data-reveal>
          <button className="quality-preview" type="button" onClick={onOpen} aria-label={t.quality.openReportAriaLabel}>
            <img src="assets/documents/retatrutide-lab-report.png" alt={t.quality.previewAlt} width="725" height="1107" loading="lazy" />
            <span>{t.quality.openDocument}<Arrow /></span>
          </button>
          <div className="quality-data">
            <span className="status-pill"><i /> {t.quality.documentAvailable}</span>
            <h3>{t.quality.reportTitle}</h3>
            <dl><div><dt>{t.quality.reportDate}</dt><dd>{t.quality.reportDateValue}</dd></div><div><dt>{t.quality.batch}</dt><dd>82188</dd></div><div><dt>{t.quality.reportedContent}</dt><dd>10.77 mg</dd></div><div><dt>{t.quality.reportedPurity}</dt><dd>99%</dd></div></dl>
            <button className="button button--dark" type="button" onClick={onOpen}>{t.quality.viewReport}<Arrow /></button>
            <p>{t.quality.disclaimer}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  const t = useT();
  return (
    <section className="section reviews" id="reviews">
      <div className="section-shell">
        <div className="reviews-heading" data-reveal><div><Eyebrow>{t.reviews.eyebrow}</Eyebrow><h2>{t.reviews.title}</h2></div><a href={REVIEW_URL}><strong>4.92 / 5</strong><span>★★★★★</span><small>36 {t.reviews.reviewsLabel}<Arrow /></small></a></div>
        <div className="review-grid">{reviewMeta.map((meta, index) => <a href={REVIEW_URL} className="review-card" key={meta.name} data-reveal><div><span>{String(index + 1).padStart(2, "0")}</span><span>★★★★★</span></div><blockquote>“{t.reviews.body[index]}”</blockquote><footer><strong>{meta.name}</strong><time>{meta.date}</time></footer></a>)}</div>
      </div>
    </section>
  );
}

function FAQ() {
  const t = useT();
  return (
    <section className="section faq" id="faq">
      <div className="section-shell faq-grid">
        <div className="faq-heading" data-reveal><Eyebrow>{t.faq.eyebrow}</Eyebrow><h2>{t.faq.titleLine1}<br />{t.faq.titleLine2}</h2><p>{t.faq.needSupport}</p><a className="text-link" href={CONSULT_URL}>{t.common.consultExpert}<Arrow /></a></div>
        <div className="faq-list">{t.faq.items.map((item, index) => <details key={index} open={index === 0} data-reveal><summary><span>{String(index + 1).padStart(2, "0")}</span>{item.q}<i /></summary><p>{item.a}</p></details>)}</div>
      </div>
    </section>
  );
}

function ReportDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useT();
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);
  return (
    <dialog ref={dialogRef} className="report-dialog" onClose={onClose} onClick={(event) => { if (event.target === dialogRef.current) onClose(); }}>
      <header><strong>{t.reportDialog.title}</strong><button type="button" onClick={onClose} aria-label={t.reportDialog.closeAriaLabel}>×</button></header>
      <img src="assets/documents/retatrutide-lab-report.png" alt={t.reportDialog.imgAlt} width="725" height="1107" />
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
