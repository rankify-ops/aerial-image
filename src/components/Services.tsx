"use client";

import { useState } from "react";
import { services } from "@/content/site";
import { Arrow, Kicker, Loop, Photo, Reveal } from "./ui";

/*
 * Creative / Commercial toggle, then an index of service groups. Hovering
 * (or tapping) a row swaps the sticky media panel on the right. FPV is always
 * first and opens by default — it is the lead service.
 */
export function Services() {
  const [tab, setTab] = useState(0);
  const [active, setActive] = useState(0);
  const cat = services[tab];
  const g = cat.groups[active] ?? cat.groups[0];

  return (
    <section id="services" className="border-t border-rule bg-white">
      <div className="wrap py-28 sm:py-36">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Kicker index="04">Services</Kicker>
            <h2 className="display mt-8">
              {cat.name} <span className="dim">Services</span>
            </h2>
          </div>
          <div role="tablist" aria-label="Service type" className="glass inline-flex self-start rounded-full p-1.5 lg:self-auto">
            {services.map((s, i) => (
              <button
                key={s.key}
                role="tab"
                aria-selected={tab === i}
                onClick={() => {
                  setTab(i);
                  setActive(0);
                }}
                className={`mono h-11 rounded-full px-6 transition-colors duration-300 ${tab === i ? "bg-ink text-paper" : "text-ink-2 hover:text-ink"}`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-12">
          <ol className="border-t border-ink lg:col-span-7" role="tabpanel">
            {cat.groups.map((grp, i) => {
              const on = i === active;
              return (
                <li key={grp.title} className="border-b border-rule">
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    aria-expanded={on}
                    className="group flex w-full items-baseline gap-6 py-7 text-left"
                  >
                    <span className={`mono w-8 shrink-0 transition-colors ${on ? "text-rec" : "text-ink-3"}`}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={`flex-1 text-[clamp(24px,2.6vw,40px)] leading-[1.05] tracking-[-0.035em] transition-colors duration-300 ${on ? "text-ink" : "text-ink/35 group-hover:text-ink/70"}`}>
                      {grp.title}
                    </span>
                    <Arrow className={`shrink-0 transition-all duration-500 ${on ? "translate-x-0 text-ink opacity-100" : "-translate-x-2 opacity-0"}`} />
                  </button>
                  <div className={`grid transition-[grid-template-rows] duration-700 ease-[var(--ease)] ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <div className="pb-8 pl-14">
                        <p className="max-w-[560px] text-[15.5px] leading-relaxed">{grp.lead}</p>
                        <ul className="mt-6 flex flex-wrap gap-2">
                          {grp.items.map((it) => (
                            <li key={it} className="mono rounded-full border border-rule-2 px-3.5 py-2 text-[10.5px] text-ink-2">
                              {it}
                            </li>
                          ))}
                        </ul>
                        {/* Media inline on mobile; the sticky panel handles desktop. */}
                        <div className="relative mt-6 aspect-[16/10] overflow-hidden rounded-[18px] bg-mist lg:hidden">
                          {"video" in grp && grp.video ? (
                            <Loop slug={grp.video} className="absolute inset-0 h-full w-full object-cover" />
                          ) : (
                            <Photo slug={grp.img} alt={grp.title} sizes="100vw" className="absolute inset-0 h-full w-full object-cover" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="hidden lg:col-span-5 lg:block">
            <Reveal className="sticky top-28">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[26px] bg-mist">
                {cat.groups.map((grp, i) => (
                  <div
                    key={grp.title}
                    className={`absolute inset-0 transition-[opacity,transform] duration-700 ${i === active ? "scale-100 opacity-100" : "scale-[1.04] opacity-0"}`}
                  >
                    {"video" in grp && grp.video ? (
                      <Loop slug={grp.video} className="absolute inset-0 h-full w-full object-cover" />
                    ) : (
                      <Photo slug={grp.img} alt={grp.title} sizes="40vw" className="absolute inset-0 h-full w-full object-cover" />
                    )}
                  </div>
                ))}
                <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-full glass px-5 py-3">
                  <span className="mono text-ink">{g.title}</span>
                  <span className="mono text-ink-3">
                    {String(active + 1).padStart(2, "0")}/{String(cat.groups.length).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
