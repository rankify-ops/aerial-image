"use client";

import { services } from "@/content/site";
import { openService } from "./ServiceTabs";
import { Arrow } from "./ui";

/*
 * Hero services (desktop only, right of the headline): all seven service
 * groups as compact tiles with a line icon, plus a "Work with us" tile — 2 × 4. A tile opens that
 * service in the Services section below and scrolls there.
 */

const ICONS: Record<string, React.ReactNode> = {
  // FPV — quad, top-down
  "FPV Video / Piloting": (
    <>
      <path d="M7 7l10 10M17 7L7 17" />
      <circle cx="6" cy="6" r="3" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="18" r="3" />
      <rect x="10" y="10" width="4" height="4" rx="1" />
    </>
  ),
  // Camera
  "Videography & Photography": (
    <>
      <path d="M3 8.5A1.5 1.5 0 014.5 7H7l1.5-2h7L17 7h2.5A1.5 1.5 0 0121 8.5v9a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 17.5z" />
      <circle cx="12" cy="13" r="3.5" />
    </>
  ),
  // Megaphone
  "Marketing & Promotional Content": (
    <>
      <path d="M4 10v4h3l7 4V6L7 10z" />
      <path d="M17.5 9.5a3.5 3.5 0 010 5M7 14l1.2 4.5" />
    </>
  ),
  // Building
  "Property / Development & Construction": (
    <>
      <path d="M4 20h16M6 20V9l6-4 6 4v11" />
      <path d="M10 20v-5h4v5M9.5 11h1M13.5 11h1" />
    </>
  ),
  // Inspection — magnifier over a pylon
  "Asset Inspections": (
    <>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="M15 15l5 5M10.5 7v7M8 9h5M8.5 13.5L10.5 7l2 6.5" />
    </>
  ),
  // Photogrammetry — 3D cube
  Photogrammetry: (
    <>
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" />
      <path d="M4 7.5l8 4.5 8-4.5M12 12v9" />
    </>
  ),
  // Live feed — broadcast
  "Live Remote Feed": (
    <>
      <circle cx="12" cy="12" r="1.8" />
      <path d="M8.5 8.5a5 5 0 000 7M15.5 8.5a5 5 0 010 7M5.6 5.6a9 9 0 000 12.8M18.4 5.6a9 9 0 010 12.8" />
    </>
  ),
};

export function HeroServices() {
  const tiles = services.flatMap((s, t) => s.groups.map((g, a) => ({ title: g.title, cat: s.name, t, a })));
  const go = (t: number, a: number) => {
    openService(t, a);
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav aria-label="Services" className="fade-up grid grid-cols-2 gap-2.5" style={{ animationDelay: "0.72s" }}>
      {tiles.map((x, i) => (
        <button
          key={x.title}
          type="button"
          onClick={() => go(x.t, x.a)}
          className="group flex min-h-[76px] items-center gap-3 rounded-[16px] border border-rule bg-white/70 p-3 text-left transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-ink hover:bg-white"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-rule bg-paper text-ink transition-colors duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-paper">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              {ICONS[x.title]}
            </svg>
          </span>
          <span className="min-w-0">
            <span className="block text-[14px] leading-snug tracking-[-0.015em] text-ink">{x.title}</span>
            <span className="mono mt-1 block text-[9.5px] text-ink-3">
              {String(i + 1).padStart(2, "0")} · {x.cat}
            </span>
          </span>
        </button>
      ))}
      <a
        href="#contact"
        className="group flex min-h-[76px] items-center justify-between gap-3 rounded-[16px] border border-ink bg-ink p-3 pl-4 text-paper transition-transform duration-300 hover:-translate-y-0.5"
      >
        <span>
          <span className="block text-[15px] tracking-[-0.015em]">Work with us</span>
          <span className="mono mt-1 block text-[9.5px] text-paper/60">{services.reduce((n, s) => n + s.groups.length, 0)} services</span>
        </span>
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-paper text-ink">
          <Arrow />
        </span>
      </a>
    </nav>
  );
}
