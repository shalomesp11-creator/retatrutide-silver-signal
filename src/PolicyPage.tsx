import { Arrow, Eyebrow, Header, Footer, CookieBanner, useHeaderInvert } from "./site";
import { useT } from "./i18n";

const LANDING = "./index.html";

export default function PolicyPage() {
  useHeaderInvert();
  const t = useT();
  return (
    <>
      <Header basePath={LANDING} />
      <main className="checkout-main">
        <div className="checkout-topbar section-shell">
          <a className="checkout-back" href={`${LANDING}#top`}><Arrow /><span>{t.policy.back}</span></a>
          <div>
            <Eyebrow>{t.policy.eyebrow}</Eyebrow>
            <h1>{t.policy.title}</h1>
          </div>
        </div>

        <div className="section-shell checkout-form">
          <section className="checkout-card">
            <Eyebrow>{t.policy.overviewEyebrow}</Eyebrow>
            <p className="checkout-note">{t.policy.overview}</p>
          </section>
          {t.policy.sections.map((section, index) => (
            <section key={index} className="checkout-card" aria-labelledby={`policy-section-${index}`}>
              <h2 id={`policy-section-${index}`} className="checkout-card__title">{section.title}</h2>
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
