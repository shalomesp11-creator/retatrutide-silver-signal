import { useState, type ChangeEvent, type FormEvent } from "react";
import { products, type Product } from "./content";
import { Arrow, Eyebrow, Header, Footer, CookieBanner, useHeaderInvert } from "./site";

const LANDING = "./index.html";

const shippingOptions = [
  { id: "standard", name: "Standard shipping", eta: "5–8 business days", cost: 0 },
  { id: "express", name: "Express shipping", eta: "2–3 business days", cost: 9 },
] as const;

const paymentOptions = [
  { id: "card", label: "Credit / debit card", note: "Visa, Mastercard, Amex" },
  { id: "bank", label: "Bank transfer", note: "Pay directly from your bank" },
  { id: "crypto", label: "Cryptocurrency", note: "BTC, ETH, USDT" },
] as const;

const countries = ["Germany", "France", "Netherlands", "Spain", "Italy", "Poland", "Belgium", "Austria", "Ireland", "Sweden", "Other EU country"];

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
  const requestedBundle = params.get("bundle");
  const requestedQty = Number(params.get("qty"));

  const [productId, setProductId] = useState<Product["id"]>(requestedProduct);
  const product = products.find((item) => item.id === productId) ?? products[0];

  const [bundleName, setBundleName] = useState<string>(() => {
    const byName = product.bundles.find((item) => item.name === requestedBundle);
    const byQty = product.bundles.find((item) => item.quantity === requestedQty);
    return (byName ?? byQty ?? product.bundles[0]).name;
  });
  const bundle = product.bundles.find((item) => item.name === bundleName) ?? product.bundles[0];

  const changeProduct = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextId = event.target.value as Product["id"];
    setProductId(nextId);
    const nextProduct = products.find((item) => item.id === nextId) ?? products[0];
    setBundleName(nextProduct.bundles[0].name);
  };

  const changeBundle = (event: ChangeEvent<HTMLSelectElement>) => setBundleName(event.target.value);

  return { product, bundle, changeProduct, changeBundle };
}

export default function CheckoutPage() {
  useHeaderInvert();
  const { product, bundle, changeProduct, changeBundle } = useOrderSelection();
  const [shipping, setShipping] = useState<(typeof shippingOptions)[number]["id"]>("standard");
  const [payment, setPayment] = useState<(typeof paymentOptions)[number]["id"]>("card");
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
          <a className="checkout-back" href={`${LANDING}#products`}><Arrow /><span>Back to product selection</span></a>
          <div>
            <Eyebrow>Secure checkout · Frontend preview</Eyebrow>
            <h1>Complete your order</h1>
          </div>
        </div>

        <form className="checkout-grid section-shell" onSubmit={handleSubmit}>
          <div className="checkout-form">
            <section className="checkout-card checkout-product" aria-labelledby="checkout-product-heading">
              <Eyebrow>Selected product</Eyebrow>
              <div className="checkout-product__body">
                <div className={`checkout-product__visual checkout-product__visual--${product.id}`}>
                  <img src={product.image} alt={`Driada Medical Retatrutide ${product.dosage} packaging`} width="1400" height="933" />
                </div>
                <div className="checkout-product__meta">
                  <h2 id="checkout-product-heading">Retatrutide</h2>
                  <p className="checkout-product__dose">{product.dosage}</p>
                  <div className="checkout-product__controls">
                    <label className="checkout-field"><span>Dosage</span>
                      <select value={product.id} onChange={changeProduct}>
                        {products.map((item) => <option key={item.id} value={item.id}>{item.dosage}</option>)}
                      </select>
                    </label>
                    <label className="checkout-field"><span>Bundle</span>
                      <select value={bundle.name} onChange={changeBundle}>
                        {product.bundles.map((item) => <option key={item.name} value={item.name}>{item.name} · {item.supply}</option>)}
                      </select>
                    </label>
                  </div>
                  <div className="checkout-product__price"><strong>{bundle.price}</strong><span>{bundle.quantity} {bundle.quantity === 1 ? "unit" : "units"}</span></div>
                </div>
              </div>
            </section>

            <section className="checkout-card" aria-labelledby="checkout-contact-heading">
              <Eyebrow>Contact information</Eyebrow>
              <h2 id="checkout-contact-heading" className="checkout-card__title">How should we reach you?</h2>
              <div className="checkout-field-grid">
                <label className="checkout-field"><span>Email</span><input type="email" name="email" placeholder="you@example.com" autoComplete="email" /></label>
                <label className="checkout-field"><span>Phone</span><input type="tel" name="phone" placeholder="+49 30 1234 5678" autoComplete="tel" /></label>
              </div>
            </section>

            <section className="checkout-card" aria-labelledby="checkout-address-heading">
              <Eyebrow>Shipping address</Eyebrow>
              <h2 id="checkout-address-heading" className="checkout-card__title">Where should we deliver?</h2>
              <div className="checkout-field-grid">
                <label className="checkout-field"><span>First name</span><input name="firstName" autoComplete="given-name" /></label>
                <label className="checkout-field"><span>Last name</span><input name="lastName" autoComplete="family-name" /></label>
                <label className="checkout-field checkout-field--full"><span>Address</span><input name="address" autoComplete="street-address" placeholder="Street and house number" /></label>
                <label className="checkout-field"><span>City</span><input name="city" autoComplete="address-level2" /></label>
                <label className="checkout-field"><span>Postal code</span><input name="postalCode" autoComplete="postal-code" /></label>
                <label className="checkout-field checkout-field--full"><span>Country</span>
                  <select name="country" defaultValue="">
                    <option value="" disabled>Select country</option>
                    {countries.map((country) => <option key={country} value={country}>{country}</option>)}
                  </select>
                </label>
              </div>
            </section>

            <section className="checkout-card" aria-labelledby="checkout-shipping-heading">
              <Eyebrow>Shipping</Eyebrow>
              <h2 id="checkout-shipping-heading" className="checkout-card__title">Choose a delivery speed</h2>
              <div className="checkout-options" role="radiogroup" aria-label="Shipping method">
                {shippingOptions.map((option) => (
                  <label key={option.id} className={option.id === shipping ? "checkout-option is-selected" : "checkout-option"}>
                    <input type="radio" name="shipping" value={option.id} checked={option.id === shipping} onChange={() => setShipping(option.id)} />
                    <span className="checkout-option__body"><strong>{option.name}</strong><small>{option.eta}</small></span>
                    <span className="checkout-option__price">{option.cost === 0 ? "Free" : formatPrice(option.cost)}</span>
                  </label>
                ))}
              </div>
            </section>

            <section className="checkout-card" aria-labelledby="checkout-payment-heading">
              <Eyebrow>Payment</Eyebrow>
              <h2 id="checkout-payment-heading" className="checkout-card__title">Choose a payment method</h2>
              <div className="checkout-options" role="radiogroup" aria-label="Payment method">
                {paymentOptions.map((option) => (
                  <label key={option.id} className={option.id === payment ? "checkout-option is-selected" : "checkout-option"}>
                    <input type="radio" name="payment" value={option.id} checked={option.id === payment} onChange={() => setPayment(option.id)} />
                    <span className="checkout-option__body"><strong>{option.label}</strong><small>{option.note}</small></span>
                  </label>
                ))}
              </div>
              <p className="checkout-note">Payment providers aren’t connected yet — this step is a visual placeholder, ready for a future integration.</p>
            </section>
          </div>

          <aside className="checkout-summary" aria-label="Order summary">
            <div className="checkout-card checkout-summary__card">
              <Eyebrow>Order summary</Eyebrow>
              <div className="checkout-summary__product">
                <img src={product.image} alt="" width="1400" height="933" />
                <div>
                  <strong>{product.name}</strong>
                  <span>{product.dosage}</span>
                  <span>{bundle.name} · {bundle.quantity} {bundle.quantity === 1 ? "unit" : "units"}</span>
                </div>
                <strong className="checkout-summary__product-price">{bundle.price}</strong>
              </div>
              <dl className="checkout-summary__totals">
                <div><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
                <div><dt>Shipping</dt><dd>{shippingCost === 0 ? "Free" : formatPrice(shippingCost)}</dd></div>
                <div className="checkout-summary__total"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
              </dl>
              <button type="submit" className="button button--dark checkout-cta">
                {submitted ? "Preview submitted" : "Continue to payment"}<Arrow />
              </button>
              {submitted && (
                <p className="checkout-preview-note" role="status">
                  This is a UI preview — no payment was processed and no order was created. Payment and shipping providers will be connected here in a future integration.
                </p>
              )}
              <a className="text-link checkout-summary__edit" href={`${LANDING}#products`}>Edit order<Arrow /></a>
              <p className="checkout-legal">A doctor’s prescription is required. Orders are subject to review before dispatch.</p>
            </div>
          </aside>
        </form>
      </main>
      <Footer basePath={LANDING} />
      <CookieBanner />
    </>
  );
}
