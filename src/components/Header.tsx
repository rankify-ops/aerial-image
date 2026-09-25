"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { nav, site } from "@/content/site";
import { Logo } from "./Logo";
import { MegaPanel, type MegaKey } from "./MegaMenu";
import { Arrow } from "./ui";

/*
 * Floating glass pill. Sits clear of the page at the top and tightens once
 * you scroll. Always visible — no hide-on-scroll.
 *
 * Variation 1 (/) gets a mega menu: hovering a nav item drops one glass sheet
 * out of the pill with that item's panel. Hover intent is debounced so the
 * sheet doesn't flicker crossing the gap; touch/keyboard open it on click and
 * a second click follows the link. Esc or the backdrop closes it.
 */
const KEYS: Record<string, MegaKey> = { "#fpv": "fpv", "#work": "work", "#services": "services", "#credentials": "credentials" };

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  // Variation 2 opens straight onto footage, so the pill is glass from the first frame.
  const overVideo = usePathname().startsWith("/v2");
  const mega = !overVideo;

  const [menu, setMenu] = useState<MegaKey | null>(null);
  // Keeps the last panel mounted while the sheet animates shut.
  const [shown, setShown] = useState<MegaKey | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const show = (k: MegaKey) => {
    clearTimeout(timer.current);
    setMenu(k);
    setShown(k);
  };
  const hide = (delay = 0) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setMenu(null);
      timer.current = setTimeout(() => setShown(null), 450);
    }, delay);
  };

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  useEffect(() => {
    if (!menu) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && hide();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [menu]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const solid = scrolled || open || overVideo || !!menu;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Backdrop behind the mega sheet */}
      {mega && (
        <div
          aria-hidden
          onClick={() => hide()}
          className={`fixed inset-0 -z-10 hidden bg-ink/10 backdrop-blur-[3px] transition-opacity duration-500 lg:block ${menu ? "opacity-100" : "pointer-events-none opacity-0"}`}
        />
      )}

      <div
        className={`wrap transition-[padding] duration-500 ${scrolled ? "pt-3" : "pt-5"}`}
        onMouseEnter={() => menu && clearTimeout(timer.current)}
        onMouseLeave={() => mega && menu && hide(180)}
      >
        <div
          className={`flex h-[62px] items-center justify-between gap-6 rounded-full pl-5 pr-2 transition-all duration-500 ${
            solid ? "glass" : "border border-transparent"
          }`}
        >
          <a href="#top" aria-label="Aerial Image — home" onClick={() => { setOpen(false); hide(); }} className="flex items-center gap-3">
            <Logo />
            <span className="mono hidden text-[10px] leading-[1.4] text-ink sm:block">
              Aerial
              <br />
              Image
            </span>
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {nav.map(([label, href]) => {
              const k = KEYS[href];
              const on = mega && menu === k;
              return (
                <a
                  key={href}
                  href={href}
                  aria-expanded={mega ? on : undefined}
                  aria-controls={mega ? "mega-sheet" : undefined}
                  onMouseEnter={() => mega && window.matchMedia("(hover: hover)").matches && show(k)}
                  onClick={(e) => {
                    if (!mega) return;
                    if (menu !== k) {
                      e.preventDefault();
                      show(k);
                    } else hide();
                  }}
                  className={`mono flex items-center gap-2 rounded-full px-4 py-2.5 transition-colors ${
                    on ? "bg-ink text-paper" : "text-ink-2 hover:bg-ink/5 hover:text-ink"
                  }`}
                >
                  {label}
                  {mega && (
                    <svg width="8" height="5" viewBox="0 0 8 5" aria-hidden className={`transition-transform duration-300 ${on ? "rotate-180" : ""}`}>
                      <path d="M1 1l3 3 3-3" stroke="currentColor" fill="none" strokeWidth="1.2" />
                    </svg>
                  )}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <a href={`mailto:${site.email}`} className="mono hidden px-3 text-ink-2 hover:text-ink xl:block">
              {site.email}
            </a>
            <a href="#contact" onClick={() => hide()} className="btn btn-primary hidden h-[46px] sm:inline-flex">
              Work with us <Arrow />
            </a>
            <button
              type="button"
              className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-ink lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              <span className="relative block h-3 w-4">
                <span className={`absolute left-0 h-px w-4 bg-paper transition-all duration-300 ${open ? "top-1.5 rotate-45" : "top-0.5"}`} />
                <span className={`absolute left-0 h-px w-4 bg-paper transition-all duration-300 ${open ? "top-1.5 -rotate-45" : "top-2.5"}`} />
              </span>
            </button>
          </div>
        </div>

        {/* Mega sheet (desktop, variation 1) */}
        {mega && (
          <div id="mega-sheet" className={`mega-sheet mt-2 hidden lg:block ${menu ? "is-open" : ""}`} role="region" aria-label="Menu">
            {shown && <MegaPanel which={shown} close={() => hide()} />}
            <div className="flex items-center justify-between border-t border-rule px-8 py-4">
              <p className="mono flex items-center gap-3 text-[10px] text-ink-3">
                <span className="rec-dot" /> FPV • Videography • Photography • Commercial
              </p>
              <a href={`mailto:${site.email}`} className="mono text-[10.5px] text-ink hover:text-rec-ink">
                {site.email}
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 -z-10 bg-paper transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <nav aria-label="Mobile" className="wrap flex h-full flex-col pb-8 pt-28">
          {nav.map(([label, href], i) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="flex items-baseline gap-4 border-b border-rule py-5 text-[34px] tracking-tight text-ink"
            >
              <span className="mono text-rec">0{i + 1}</span>
              {label}
            </a>
          ))}
          <div className="mt-auto grid gap-3">
            <a href="#contact" onClick={() => setOpen(false)} className="btn btn-primary w-full">
              Work with us <Arrow />
            </a>
            <a href={`mailto:${site.email}`} className="btn btn-ghost w-full">
              {site.email}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
