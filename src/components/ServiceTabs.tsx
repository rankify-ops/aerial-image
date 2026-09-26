"use client";

import { useEffect, useState } from "react";
import { services } from "@/content/site";
import { Arrow, Kicker, Loop, Photo } from "./ui";
// Pour v2 (droplets). To revert to v1 (tag services-liquid-v1): import { LiquidInk } from "./LiquidInk" and render <LiquidInk on={tab} />.
import { LiquidDrops } from "./LiquidDrops";

/** Deep-link from the mega menu: open a given tab + highlight a card, then scroll here. */
export const SERVICE_EVT = "ai:service";
export function openService(tab: number, active: number) {
  window.dispatchEvent(new CustomEvent(SERVICE_EVT, { detail: { tab, active } }));
}

/*
 * Services as two tabs — Creative | Commercial — directly under the client
 * logos. Each tab is a row of cards (media, their copy, item chips). FPV is
 * the first Creative card and carries the only video; the rest are their
 * photography.
 */
export function ServiceTabs() {
  const [tab, setTab] = useState(0);
  const [hi, setHi] = useState<number | null>(null);
  const cat = services[tab];

  useEffect(() => {
    const on = (e: Event) => {
      const d = (e as CustomEvent<{ tab: number; active: number }>).detail;
      setTab(d.tab);
      setHi(d.active);
      window.setTimeout(() => setHi(null), 2400);
    };
    window.addEventListener(SERVICE_EVT, on);
    return () => window.removeEventListener(SERVICE_EVT, on);
  }, []);

  return (
    <section id="services" className="bg-white">
      <div className="wrap py-24 sm:py-32">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Kicker index="01">Services</Kicker>
            <h2 className="display mt-8">
              Creative <span className="dim">&amp; Commercial</span>
            </h2>
          </div>
          <p className="max-w-[440px] text-[15.5px] leading-relaxed lg:col-span-5 lg:justify-self-end">
            With the love and passion of technology, photography and videography, Aerial Image deliver creative services across the board to any project.
          </p>
        </div>

        {/*
          Tabs: one bar split by a slanted seam so the two halves interlock.
          Liquid ink (LiquidInk.tsx) sits under the active half and pours across
          to the other side when it's hovered (desktop) or tapped.
        */}
        <div role="tablist" aria-label="Service type" data-on={tab} className="svc-twist mt-14">
          <LiquidDrops on={tab} />
          {services.map((s, i) => {
            const on = tab === i;
            return (
              <button
                key={s.key}
                role="tab"
                id={`svc-tab-${s.key}`}
                aria-selected={on}
                aria-controls={`svc-panel-${s.key}`}
                onClick={() => setTab(i)}
                onMouseEnter={() => window.matchMedia("(hover: hover)").matches && setTab(i)}
                className={`svc-twist-tab ${i === 1 ? "is-right" : ""} ${on ? "is-on" : ""}`}
              >
                <span className="text-[24px] leading-none tracking-[-0.04em] sm:text-[clamp(30px,3.6vw,56px)]">{s.name}</span>
                <span className="svc-twist-count mono hidden items-center gap-2 whitespace-nowrap text-[10.5px] sm:flex">
                  {on && <span className="rec-dot" />}
                  {String(s.groups.length).padStart(2, "0")} services
                </span>
              </button>
            );
          })}
        </div>

        {/* Panel */}
        <ul
          key={cat.key}
          id={`svc-panel-${cat.key}`}
          role="tabpanel"
          aria-labelledby={`svc-tab-${cat.key}`}
          className={`mt-10 grid gap-4 sm:grid-cols-2 ${cat.groups.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}
        >
          {cat.groups.map((g, i) => (
            <li
              key={g.title}
              className={`fade-up tile group flex flex-col overflow-hidden rounded-[24px] border bg-paper transition-[border-color,box-shadow] duration-500 ${
                hi === i ? "border-ink shadow-[0_20px_50px_-24px_rgb(13_15_18/0.45)]" : "border-rule"
              }`}
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-mist">
                {"video" in g && g.video ? (
                  <Loop slug={g.video} className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <Photo slug={g.img} alt={g.title} sizes="(min-width:1024px) 25vw, 50vw" className="absolute inset-0 h-full w-full object-cover" />
                )}
                <span className="mono absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-[9.5px] text-ink backdrop-blur-md">
                  {"video" in g && g.video && <span className="rec-dot" />}
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-[22px] leading-[1.1] tracking-[-0.03em]">{g.title}</h3>
                <p className="mt-3 line-clamp-4 text-[14px] leading-relaxed text-ink-2">{g.lead}</p>
                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {g.items.map((it) => (
                    <li key={it} className="mono rounded-full border border-rule-2 px-2.5 py-1.5 text-[9px] leading-tight text-ink-2">
                      {it}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-6">
                  <a href="#contact" className="mono flex items-center justify-between border-t border-rule pt-5 text-[10.5px] text-ink transition-colors hover:text-rec-ink">
                    Work with us <Arrow />
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
