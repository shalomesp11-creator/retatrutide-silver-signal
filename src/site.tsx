import { useEffect, useRef, useState, type ReactNode } from "react";
import { navKeys } from "./content";
import { locales, localeLabels, localeNames, useLocale, useT } from "./i18n";

export const CONSULT_URL = "https://driadashop.helpline.to/en-US/new-ticket";
export const REVIEW_URL = "https://peds.to/reviews/retatrutide.157/reviews";
// policy.html is a sibling page at the site root, so this relative path resolves
// correctly from index.html, checkout.html and policy.html alike.
export const POLICY_URL = "policy.html";

export function Arrow() {
  return <svg className="arrow-icon" aria-hidden="true" viewBox="0 0 16 16"><path d="M4 12 12 4M6 4h6v6" /></svg>;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow"><span />{children}</p>;
}

// Compact dropdown used in the desktop header-actions row (hidden on mobile by
// the same CSS that hides .header-actions there).
function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  const t = useT();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="lang-switch" ref={rootRef}>
      <button type="button" className="lang-switch__trigger" aria-haspopup="listbox" aria-expanded={open} aria-label={t.languageSwitcher.ariaLabel} onClick={() => setOpen((value) => !value)}>
        {localeLabels[locale]}<i />
      </button>
      {open && (
        <ul className="lang-switch__menu" role="listbox" aria-label={t.languageSwitcher.ariaLabel}>
          {locales.map((code) => (
            <li key={code}>
              <button type="button" role="option" aria-selected={code === locale} className={code === locale ? "is-active" : ""} onClick={() => { setLocale(code); setOpen(false); }}>
                <span>{localeLabels[code]}</span><small>{localeNames[code]}</small>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Flat row of language buttons shown inside the mobile nav panel — a dropdown-inside-a-
// dropdown is fiddly to tap accurately, so mobile gets direct one-tap selection instead.
function LanguageRow() {
  const { locale, setLocale } = useLocale();
  const t = useT();
  return (
    <div className="lang-row" role="group" aria-label={t.languageSwitcher.ariaLabel}>
      {locales.map((code) => (
        <button key={code} type="button" className={code === locale ? "is-active" : ""} aria-pressed={code === locale} onClick={() => setLocale(code)}>
          {localeLabels[code]}
        </button>
      ))}
    </div>
  );
}

// basePath is "" on the landing page (in-page anchors) or "./index.html" from another
// page (e.g. checkout.html), so nav/CTA links always resolve to the right document.
export function Header({ basePath = "" }: { basePath?: string }) {
  const [open, setOpen] = useState(false);
  const t = useT();
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  return (
    <header className="site-header">
      <a className="wordmark" href={`${basePath}#top`} aria-label={t.header.homeAriaLabel}>RETATRUTIDE</a>
      <button className="menu-button" type="button" aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen(!open)}>
        <span>{open ? t.header.close : t.header.menu}</span><i /><i />
      </button>
      <nav id="site-nav" className={open ? "nav is-open" : "nav"} aria-label={t.header.navAriaLabel}>
        {navKeys.map((key) => <a key={key} href={`${basePath}#${key}`} onClick={() => setOpen(false)}>{t.header.nav[key]}</a>)}
        <LanguageRow />
      </nav>
      <div className="header-actions">
        <LanguageSwitcher />
        <a className="button button--ghost" href={CONSULT_URL}>{t.common.consultExpert}<Arrow /></a>
        <a className="button button--dark" href={`${basePath}#products`}>{t.common.buyNow}<Arrow /></a>
      </div>
    </header>
  );
}

export function Footer({ basePath = "" }: { basePath?: string }) {
  const t = useT();
  return (
    <footer className="site-footer" data-dark>
      <div className="footer-signal" aria-hidden="true">RETATRUTIDE</div>
      <div className="footer-grid">
        <div><a className="wordmark" href={`${basePath}#top`}>RETATRUTIDE</a><p>{t.footer.tagline}</p><div><a className="button button--light" href={CONSULT_URL}>{t.common.consultExpert}<Arrow /></a><a className="button button--metal" href={`${basePath}#products`}>{t.common.buyNow}<Arrow /></a></div></div>
        <nav aria-label={t.footer.footerNavAriaLabel}><strong>{t.footer.exploreLabel}</strong>{navKeys.map((key) => <a key={key} href={`${basePath}#${key}`}>{t.header.nav[key]}</a>)}</nav>
        <div className="footer-meta"><strong>{t.footer.sourcesLabel}</strong><a href={REVIEW_URL}>{t.footer.forumReviews}<Arrow /></a><a href="https://www.eroids.com/reviews/driadashop.to">{t.footer.driadaShopReviews}<Arrow /></a><button type="button" onClick={() => window.dispatchEvent(new Event("retatrutide:open-cookie-settings"))}>{t.footer.cookieSettings}</button></div>
      </div>
      <div className="footer-bottom"><p>{t.footer.disclaimer}</p><span>© 2026 Retatrutide</span><div className="footer-bottom-links"><a href={POLICY_URL}>{t.footer.policy}</a><a href={`${basePath}#top`}>{t.footer.backToTop}</a></div></div>
    </footer>
  );
}

export function CookieBanner() {
  const t = useT();
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
    <aside className="cookie-banner" aria-label={t.cookieBanner.ariaLabel} aria-live="polite">
      <p><strong>{t.cookieBanner.title}</strong> {t.cookieBanner.message}</p>
      <div><button type="button" onClick={() => { try { sessionStorage.setItem(dismissedKey, "true"); } catch { /* storage can be unavailable */ } setVisible(false); }}>{t.cookieBanner.dismiss}</button><button type="button" onClick={() => { try { localStorage.setItem(consentKey, "accepted"); } catch { /* storage can be unavailable */ } setVisible(false); }}>{t.cookieBanner.accept}</button></div>
    </aside>
  );
}

// The header is translucent, so it inverts wherever it floats over a dark surface.
export function useHeaderInvert() {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>(".site-header");
    if (!header) return;
    const update = () => {
      const box = header.getBoundingClientRect();
      const y = box.top + box.height / 2;
      const overDark = [18, window.innerWidth / 2, window.innerWidth - 18].some((x) =>
        document.elementsFromPoint(x, y).some((el) => !el.closest(".site-header") && el instanceof HTMLElement && el.hasAttribute("data-dark")));
      header.classList.toggle("is-inverted", overDark);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);
}

export function useReveal() {
  useEffect(() => {
    document.documentElement.classList.add("js");
    const nodes = [...document.querySelectorAll<HTMLElement>("[data-reveal]")];
    const revealPassed = () => nodes.forEach((node) => {
      if (!node.classList.contains("is-visible") && node.getBoundingClientRect().top <= window.innerHeight * .94) node.classList.add("is-visible");
    });
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } }), { rootMargin: "0px 0px 80px", threshold: 0.01 });
    nodes.forEach((node) => observer.observe(node));
    revealPassed();
    window.addEventListener("scroll", revealPassed, { passive: true });
    window.addEventListener("resize", revealPassed);
    return () => { observer.disconnect(); window.removeEventListener("scroll", revealPassed); window.removeEventListener("resize", revealPassed); };
  }, []);
}
