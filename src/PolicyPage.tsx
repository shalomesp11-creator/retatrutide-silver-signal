import { Arrow, Eyebrow, Header, Footer, CookieBanner, useHeaderInvert } from "./site";

const LANDING = "./index.html";

const sections = [
  {
    title: "Shipping & delivery",
    copy: "Shipping and delivery terms — including supported destinations, processing times and delivery options — will be published on this page.",
  },
  {
    title: "Returns & cancellations",
    copy: "Our returns and cancellation terms will be described here once finalized.",
  },
  {
    title: "Payment terms",
    copy: "Accepted payment methods and related terms will be listed here.",
  },
  {
    title: "Privacy & data",
    copy: "Information about how data is collected, used and protected will be provided here.",
  },
] as const;

export default function PolicyPage() {
  useHeaderInvert();
  return (
    <>
      <Header basePath={LANDING} />
      <main className="checkout-main">
        <div className="checkout-topbar section-shell">
          <a className="checkout-back" href={`${LANDING}#top`}><Arrow /><span>Back to homepage</span></a>
          <div>
            <Eyebrow>Legal & policies</Eyebrow>
            <h1>Policy</h1>
          </div>
        </div>

        <div className="section-shell checkout-form">
          <section className="checkout-card">
            <Eyebrow>Overview</Eyebrow>
            <p className="checkout-note">This page collects our shipping, returns, payment and privacy policies in one place. Full details are being finalized and will be published here.</p>
          </section>
          {sections.map((section) => (
            <section key={section.title} className="checkout-card" aria-labelledby={`policy-${section.title}`}>
              <h2 id={`policy-${section.title}`} className="checkout-card__title">{section.title}</h2>
              <p className="checkout-note">{section.copy}</p>
            </section>
          ))}
        </div>
      </main>
      <Footer basePath={LANDING} />
      <CookieBanner />
    </>
  );
}
