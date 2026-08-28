import { useEffect, useState, type ReactNode } from "react";
import { nav } from "./content";

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

// basePath is "" on the landing page (in-page anchors) or "./index.html" from another
// page (e.g. checkout.html), so nav/CTA links always resolve to the right document.
export function Header({ basePath = "" }: { basePath?: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  return (
    <header className="site-header">
      <a className="wordmark" href={`${basePath}#top`} aria-label="Retatrutide home">RETATRUTIDE</a>
      <button className="menu-button" type="button" aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen(!open)}>
        <span>{open ? "Close" : "Menu"}</span><i /><i />
      </button>
      <nav id="site-nav" className={open ? "nav is-open" : "nav"} aria-label="Main navigation">
        {nav.map(([label, href]) => <a key={href} href={`${basePath}${href}`} onClick={() => setOpen(false)}>{label}</a>)}
      </nav>
      <div className="header-actions">
        <a className="button button--ghost" href={CONSULT_URL}>Consult an expert<Arrow /></a>
        <a className="button button--dark" href={`${basePath}#products`}>Buy now<Arrow /></a>
      </div>
    </header>
  );
}

export function Footer({ basePath = "" }: { basePath?: string }) {
  return (
    <footer className="site-footer" data-dark>
      <div className="footer-signal" aria-hidden="true">RETATRUTIDE</div>
      <div className="footer-grid">
        <div><a className="wordmark" href={`${basePath}#top`}>RETATRUTIDE</a><p>Product information, documentation and the next purchasing step in one place.</p><div><a className="button button--light" href={CONSULT_URL}>Consult an expert<Arrow /></a><a className="button button--metal" href={`${basePath}#products`}>Buy now<Arrow /></a></div></div>
        <nav aria-label="Footer"><strong>Explore</strong>{nav.map(([label, href]) => <a key={href} href={`${basePath}${href}`}>{label}</a>)}</nav>
        <div className="footer-meta"><strong>Independent sources</strong><a href={REVIEW_URL}>Forum reviews<Arrow /></a><a href="https://www.eroids.com/reviews/driadashop.to">DriadaShop reviews<Arrow /></a><button type="button" onClick={() => window.dispatchEvent(new Event("retatrutide:open-cookie-settings"))}>Cookie settings</button></div>
      </div>
      <div className="footer-bottom"><p>Early studies show Retatrutide is generally well tolerated, but long-term data is limited. A doctor’s prescription is required.</p><span>© 2026 Retatrutide</span><div className="footer-bottom-links"><a href={POLICY_URL}>Policy</a><a href={`${basePath}#top`}>Back to top ↑</a></div></div>
    </footer>
  );
}

export function CookieBanner() {
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
