import { useState, type ChangeEvent, type FormEvent } from "react";
import { countryCodes, OTHER_COUNTRY, products, type Product } from "./content";
import { Arrow, Eyebrow, Header, Footer, CookieBanner, useHeaderInvert } from "./site";
import { useT } from "./i18n";

const LANDING = "./index.html";

function parsePrice(value: string): number {
  const num = parseFloat(value.replace(/[^0-9.,]/g, "").replace(",", "."));
  return Number.isFinite(num) ? num : 0;
}

function formatPrice(value: number): string {
  return `€${value.toFixed(2)}`;
}

// Reads the product/bundle handed off from the landing page's "Buy now" links,
// with sane fallbacks so the page still renders a full mock order on its own.
function useOrderSelection() {
  const params = typeof window === "undefined" ? new URLSearchParams() : new URLSearchParams(window.location.search);
  const requestedProduct = params.get("product") === "20" ? "20" : "10";
  const requestedBundleId = params.get("bundle");
  const requestedQty = Number(params.get("qty"));

  const [productId, setProductId] = useState<Product["id"]>(requestedProduct);
  const product = products.find((item) => item.id === productId) ?? products[0];

  const [bundleId, setBundleId] = useState<string>(() => {
    const byId = product.bundles.find((item) => item.id === requestedBundleId);
    const byQty = product.bundles.find((item) => item.quantity === requestedQty);
    return (byId ?? byQty ?? product.bundles[0]).id;
  });
  const bundle = product.bundles.find((item) => item.id === bundleId) ?? product.bundles[0];

  const changeProduct = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextId = event.target.value as Product["id"];
    setProductId(nextId);
    const nextProduct = products.find((item) => item.id === nextId) ?? products[0];
    setBundleId(nextProduct.bundles[0].id);
  };

  const changeBundle = (event: ChangeEvent<HTMLSelectElement>) => setBundleId(event.target.value);

  return { product, bundle, changeProduct, changeBundle };
}

export default function CheckoutPage() {
  useHeaderInvert();
  const t = useT();
  const { product, bundle, changeProduct, changeBundle } = useOrderSelection();
  const info = t.products.byId[product.id];
  const bundleInfo = info.bundles[bundle.id];

  const shippingOptions = [
    { id: "standard" as const, name: t.checkout.standardName, eta: t.checkout.standardEta, cost: 0 },
    { id: "express" as const, name: t.checkout.expressName, eta: t.checkout.expressEta, cost: 9 },
  ];
  const paymentOptions = [
    { id: "card" as const, label: t.checkout.cardLabel, note: t.checkout.cardNote },
    { id: "bank" as const, label: t.checkout.bankLabel, note: t.checkout.bankNote },
    { id: "crypto" as const, label: t.checkout.cryptoLabel, note: t.checkout.cryptoNote },
  ];

  const [shipping, setShipping] = useState<(typeof shippingOptions)[number]["id"]>("standard");
  const [payment, setPayment] = useState<(typeof paymentOptions)[number]["id"]>("card");
  const [country, setCountry] = useState("");
  const [otherCountry, setOtherCountry] = useState("");
  const isOtherCountry = country === OTHER_COUNTRY;
  const [submitted, setSubmitted] = useState(false);

  const subtotal = parsePrice(bundle.price);
  const shippingCost = shippingOptions.find((option) => option.id === shipping)?.cost ?? 0;
  const total = subtotal + shippingCost;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    // Frontend-only mock: no order is created and no payment provider is contacted.
    setSubmitted(true);
  };

  return (
    <>
      <Header basePath={LANDING} />
      <main className="checkout-main">
        <div className="checkout-topbar section-shell">
          <a className="checkout-back" href={`${LANDING}#products`}><Arrow /><span>{t.checkout.back}</span></a>
          <div>
            <Eyebrow>{t.checkout.eyebrow}</Eyebrow>
            <h1>{t.checkout.title}</h1>
          </div>
        </div>

        <form className="checkout-grid section-shell" onSubmit={handleSubmit}>
          <div className="checkout-form">
            <section className="checkout-card checkout-product" aria-labelledby="checkout-product-heading">
              <Eyebrow>{t.checkout.selectedProduct}</Eyebrow>
              <div className="checkout-product__body">
                <div className={`checkout-product__visual checkout-product__visual--${product.id}`}>
                  <img src={product.image} alt={`${t.products.imgAltPrefix}${product.dosage}${t.products.imgAltSuffix}`} width="1400" height="933" />
                </div>
                <div className="checkout-product__meta">
                  <h2 id="checkout-product-heading">Retatrutide</h2>
                  <p className="checkout-product__dose">{product.dosage}</p>
                  <div className="checkout-product__controls">
                    <label className="checkout-field"><span>{t.checkout.dosage}</span>
                      <select value={product.id} onChange={changeProduct}>
                        {products.map((item) => <option key={item.id} value={item.id}>{item.dosage}</option>)}
                      </select>
                    </label>
                    <label className="checkout-field"><span>{t.checkout.bundle}</span>
                      <select value={bundle.id} onChange={changeBundle}>
                        {product.bundles.map((item) => <option key={item.id} value={item.id}>{info.bundles[item.id].name} · {info.bundles[item.id].supply}</option>)}
                      </select>
                    </label>
                  </div>
                  <div className="checkout-product__price"><strong>{bundle.price}</strong><span>{bundle.quantity} {bundle.quantity === 1 ? t.common.unit : t.common.units}</span></div>
                </div>
              </div>
            </section>

            <section className="checkout-card" aria-labelledby="checkout-contact-heading">
              <Eyebrow>{t.checkout.contactInfo}</Eyebrow>
              <h2 id="checkout-contact-heading" className="checkout-card__title">{t.checkout.contactTitle}</h2>
              <div className="checkout-field-grid">
                <label className="checkout-field"><span>{t.checkout.email}</span><input type="email" name="email" placeholder={t.checkout.emailPlaceholder} autoComplete="email" /></label>
                <label className="checkout-field"><span>{t.checkout.phone}</span><input type="tel" name="phone" placeholder={t.checkout.phonePlaceholder} autoComplete="tel" /></label>
              </div>
            </section>

            <section className="checkout-card" aria-labelledby="checkout-address-heading">
              <Eyebrow>{t.checkout.shippingAddress}</Eyebrow>
              <h2 id="checkout-address-heading" className="checkout-card__title">{t.checkout.addressTitle}</h2>
              <div className="checkout-field-grid">
                <label className="checkout-field"><span>{t.checkout.firstName}</span><input name="firstName" autoComplete="given-name" /></label>
                <label className="checkout-field"><span>{t.checkout.lastName}</span><input name="lastName" autoComplete="family-name" /></label>
                <label className="checkout-field checkout-field--full"><span>{t.checkout.address}</span><input name="address" autoComplete="street-address" placeholder={t.checkout.addressPlaceholder} /></label>
                <label className="checkout-field"><span>{t.checkout.city}</span><input name="city" autoComplete="address-level2" /></label>
                <label className="checkout-field"><span>{t.checkout.postalCode}</span><input name="postalCode" autoComplete="postal-code" /></label>
                <label className="checkout-field checkout-field--full"><span>{t.checkout.country}</span>
                  <select name="country" value={country} onChange={(event) => setCountry(event.target.value)}>
                    <option value="" disabled>{t.checkout.selectCountry}</option>
                    {countryCodes.map((code) => <option key={code} value={code}>{t.checkout.countries[code]}</option>)}
                    <option value={OTHER_COUNTRY}>{t.checkout.otherCountryOption}</option>
                  </select>
                </label>
                <div className={isOtherCountry ? "checkout-field-collapse is-open" : "checkout-field-collapse"}>
                  <label className="checkout-field checkout-field--full">
                    <span>{t.checkout.enterCountry}</span>
                    <input
                      type="text"
                      name="countryOther"
                      placeholder={t.checkout.enterCountry}
                      value={otherCountry}
                      onChange={(event) => setOtherCountry(event.target.value)}
                      required={isOtherCountry}
                      disabled={!isOtherCountry}
                      tabIndex={isOtherCountry ? 0 : -1}
                    />
                  </label>
                </div>
              </div>
            </section>

            <section className="checkout-card" aria-labelledby="checkout-shipping-heading">
              <Eyebrow>{t.checkout.shipping}</Eyebrow>
              <h2 id="checkout-shipping-heading" className="checkout-card__title">{t.checkout.shippingTitle}</h2>
              <div className="checkout-options" role="radiogroup" aria-label={t.checkout.shippingAriaLabel}>
                {shippingOptions.map((option) => (
                  <label key={option.id} className={option.id === shipping ? "checkout-option is-selected" : "checkout-option"}>
                    <input type="radio" name="shipping" value={option.id} checked={option.id === shipping} onChange={() => setShipping(option.id)} />
                    <span className="checkout-option__body"><strong>{option.name}</strong><small>{option.eta}</small></span>
                    <span className="checkout-option__price">{option.cost === 0 ? t.common.free : formatPrice(option.cost)}</span>
                  </label>
                ))}
              </div>
            </section>

            <section className="checkout-card" aria-labelledby="checkout-payment-heading">
              <Eyebrow>{t.checkout.payment}</Eyebrow>
              <h2 id="checkout-payment-heading" className="checkout-card__title">{t.checkout.paymentTitle}</h2>
              <div className="checkout-options" role="radiogroup" aria-label={t.checkout.paymentAriaLabel}>
                {paymentOptions.map((option) => (
                  <label key={option.id} className={option.id === payment ? "checkout-option is-selected" : "checkout-option"}>
                    <input type="radio" name="payment" value={option.id} checked={option.id === payment} onChange={() => setPayment(option.id)} />
                    <span className="checkout-option__body"><strong>{option.label}</strong><small>{option.note}</small></span>
                  </label>
                ))}
              </div>
              <p className="checkout-note">{t.checkout.paymentNote}</p>
            </section>
          </div>

          <aside className="checkout-summary" aria-label={t.checkout.orderSummary}>
            <div className="checkout-card checkout-summary__card">
              <Eyebrow>{t.checkout.orderSummary}</Eyebrow>
              <div className="checkout-summary__product">
                <img src={product.image} alt="" width="1400" height="933" />
                <div>
                  <strong>Retatrutide {product.id}</strong>
                  <span>{product.dosage}</span>
                  <span>{bundleInfo.name} · {bundle.quantity} {bundle.quantity === 1 ? t.common.unit : t.common.units}</span>
                </div>
                <strong className="checkout-summary__product-price">{bundle.price}</strong>
              </div>
              <dl className="checkout-summary__totals">
                <div><dt>{t.checkout.subtotal}</dt><dd>{formatPrice(subtotal)}</dd></div>
                <div><dt>{t.checkout.shippingLabel}</dt><dd>{shippingCost === 0 ? t.common.free : formatPrice(shippingCost)}</dd></div>
                <div className="checkout-summary__total"><dt>{t.checkout.total}</dt><dd>{formatPrice(total)}</dd></div>
              </dl>
              <button type="submit" className="button button--dark button--metal-hover checkout-cta">
                {submitted ? t.checkout.previewSubmitted : t.checkout.continueToPayment}<Arrow />
              </button>
              {submitted && (
                <p className="checkout-preview-note" role="status">
                  {t.checkout.previewNote}
                </p>
              )}
              <a className="text-link checkout-summary__edit" href={`${LANDING}#products`}>{t.checkout.editOrder}<Arrow /></a>
              <p className="checkout-legal">{t.checkout.legal}</p>
            </div>
          </aside>
        </form>
      </main>
      <Footer basePath={LANDING} />
      <CookieBanner />
    </>
  );
}
