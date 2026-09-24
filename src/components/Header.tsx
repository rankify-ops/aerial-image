"use client";

import { useEffect, useState } from "react";
import { nav, site } from "@/content/site";
import { Logo } from "./Logo";
import { Arrow } from "./ui";

/*
 * Floating glass pill. Sits clear of the page at the top, tightens once you
 * scroll, hides on scroll-down and returns on scroll-up so it never covers
 * the footage.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const on = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > 600 && y > last + 4);
      if (y < last - 4) setHidden(false);
      last = y;
    };
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

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-transform duration-500 ${hidden && !open ? "-translate-y-[120%]" : ""}`}
    >
      <div className={`wrap transition-[padding] duration-500 ${scrolled ? "pt-3" : "pt-5"}`}>
        <div
          className={`flex h-[62px] items-center justify-between gap-6 rounded-full pl-5 pr-2 transition-all duration-500 ${
            scrolled || open ? "glass" : "border border-transparent"
          }`}
        >
          <a href="#top" aria-label="Aerial Image — home" onClick={() => setOpen(false)} className="flex items-center gap-3">
            <Logo />
            <span className="mono hidden text-[10px] leading-[1.4] text-ink sm:block">
              Aerial
              <br />
              Image
            </span>
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {nav.map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="mono rounded-full px-4 py-2.5 text-ink-2 transition-colors hover:bg-ink/5 hover:text-ink"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a href={`mailto:${site.email}`} className="mono hidden px-3 text-ink-2 hover:text-ink xl:block">
              {site.email}
            </a>
            <a href="#contact" className="btn btn-primary hidden h-[46px] sm:inline-flex">
              Enquiries <Arrow />
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
              Enquiries <Arrow />
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
