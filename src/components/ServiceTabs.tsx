"use client";

import { useEffect, useState } from "react";
import { services } from "@/content/site";
import { Arrow, Kicker, Loop, Photo } from "./ui";

/** Deep-link from the mega menu: open a given tab + highlight a card, then scroll here. */
export const SERVICE_EVT = "ai:service";
export function openService(tab: number, active: number) {
  window.dispatchEvent(new CustomEvent(SERVICE_EVT, { detail: { tab, active } }));
}

const BLURB: Record<string, string> = {
  creative: "Aerial Image provide a wide range of Videography and Photography services.",
  commercial: "Assess, measure, view and report on any asset.",
};

/*
 * Services behind a pill switch — Creative ◯— Commercial — directly under the client
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
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Kicker index="01">Services</Kicker>
            <h2 className="display mt-8">
              Creative <span className="dim">&amp; Commercial</span>
            </h2>
            {/* Short line for each, always visible; the active one is full ink. */}
            <div className="mt-8 grid max-w-[760px] gap-3 sm:grid-cols-2 sm:gap-6">
              {services.map((s, i) => {
                const on = tab === i;
                return (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => setTab(i)}
                    aria-pressed={on}
                    className={`group flex flex-col items-start justify-start border-l-2 pl-4 text-left transition-colors duration-500 ${on ? "border-ink" : "border-rule hover:border-rule-2"}`}
                  >
                    <span className={`mono flex items-center gap-2 text-[10px] transition-colors ${on ? "text-ink" : "text-ink-3"}`}>
                      {s.name}
                      <span className="text-ink/25">·</span>
                      {String(s.groups.length).padStart(2, "0")}
                    </span>
                    <span className={`mt-2 block text-[15px] leading-snug transition-colors duration-500 ${on ? "text-ink-2" : "text-ink/35 group-hover:text-ink/55"}`}>
                      {BLURB[s.key]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pill switch: Creative ◯—— Commercial */}
          <div className="flex items-center gap-4 self-start sm:gap-5 lg:self-auto lg:pb-1">
            <button type="button" onClick={() => setTab(0)} className={`text-[22px] tracking-[-0.03em] transition-colors duration-500 sm:text-[26px] ${tab === 0 ? "text-ink" : "text-ink/25 hover:text-ink/50"}`}>
              {services[0].name}
            </button>
            <button
              type="button"
              role="switch"
              aria-checked={tab === 1}
              aria-label={`Showing ${services[tab].name} services — switch to ${services[1 - tab].name}`}
              onClick={() => setTab((t) => 1 - t)}
              data-on={tab}
              className="svc-switch"
            >
              <span className="svc-knob">
                <span className="rec-dot" />
              </span>
            </button>
            <button type="button" onClick={() => setTab(1)} className={`text-[22px] tracking-[-0.03em] transition-colors duration-500 sm:text-[26px] ${tab === 1 ? "text-ink" : "text-ink/25 hover:text-ink/50"}`}>
              {services[1].name}
            </button>
          </div>
        </div>

        {/* Panel */}
        <ul
          key={cat.key}
          aria-label={`${cat.name} services`}
          className={`mt-14 grid gap-4 sm:grid-cols-2 ${cat.groups.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}
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
