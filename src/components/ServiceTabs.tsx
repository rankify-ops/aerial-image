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
 * Services behind a full-width neumorphic switch (Creative ⇄ Commercial) directly under the client
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
    <section id="services" className="bg-[#efeeea]">
      <div className="wrap py-24 sm:py-32">
        <div>
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

        </div>

        {/*
          Full-width neumorphic switch: a raised pill the same colour as the
          page, a big 3D ball in one end, the current category on the other.
          Clicking slides the ball across and swaps the name.
        */}
        <button
          type="button"
          role="switch"
          aria-checked={tab === 1}
          aria-label={`Showing ${cat.name} services — switch to ${services[1 - tab].name}`}
          onClick={() => setTab((t) => 1 - t)}
          data-on={tab}
          className="svc-neu mt-12 sm:mt-14"
        >
          <span className="svc-ball" aria-hidden />
          <span className="svc-label">
            <span key={cat.key} className="fade-up flex items-baseline gap-4">
              <span className="text-[34px] leading-none tracking-[-0.04em] text-ink/55 sm:text-[clamp(44px,5.4vw,92px)]">{cat.name}</span>
              <span className="mono hidden text-[10.5px] text-ink-3 sm:inline">
                {String(cat.groups.length).padStart(2, "0")} services
              </span>
            </span>
          </span>
        </button>

        {/* Panel */}
        <ul
          key={cat.key}
          aria-label={`${cat.name} services`}
          className={`mt-14 grid gap-4 sm:grid-cols-2 ${cat.groups.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}
        >
          {cat.groups.map((g, i) => (
            <li
              key={g.title}
              className={`fade-up tile group flex flex-col overflow-hidden rounded-[24px] border bg-white transition-[border-color,box-shadow] duration-500 ${
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
