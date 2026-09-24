"use client";

import { useRef, useState } from "react";
import { services } from "@/content/site";
import { Arrow, Loop, Photo } from "../ui";
import { Mark } from "./Phone";

/*
 * "Manage Your Cards" from the reference, as the services index. Each service
 * group is a pearl/iridescent card in a wallet stack; the front card tilts
 * with the pointer and its details sit in a glass panel with action orbs.
 */
const CARDS = services.flatMap((s) => s.groups.map((g) => ({ ...g, cat: s.name })));

// Small glyphs for the action orbs, cycled per item.
const GLYPHS = [
  <path key="a" d="M3 7h8M7 3v8" stroke="currentColor" strokeWidth="1.3" fill="none" />,
  <circle key="b" cx="7" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.3" fill="none" />,
  <path key="c" d="M2.5 9.5l3-3 2 2 4-4.5" stroke="currentColor" strokeWidth="1.3" fill="none" />,
  <rect key="d" x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.3" fill="none" />,
];

export function Deck() {
  const [i, setI] = useState(0);
  const card = useRef<HTMLButtonElement>(null);
  const n = CARDS.length;
  const cur = CARDS[i];
  const go = (d: number) => setI((v) => (v + d + n) % n);

  const tilt = (e: React.PointerEvent) => {
    const el = card.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${(-y * 12).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(x * 16).toFixed(2)}deg`);
    el.style.setProperty("--mx", `${((x + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${((y + 0.5) * 100).toFixed(1)}%`);
  };
  const reset = () => {
    const el = card.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <section id="services" className="relative py-28 sm:py-36">
      <div className="wrap">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mono flex items-center gap-4 text-ink-3">
              <span className="text-rec">03</span>
              <span className="h-px w-10 bg-rule-2" />
              Services
            </p>
            <h2 className="serif mt-8 text-[clamp(44px,6vw,96px)] leading-[0.95] tracking-[-0.02em] text-ink">
              Creative <em className="text-ink/45">&amp; Commercial</em>
            </h2>
          </div>
          <div role="tablist" aria-label="Service type" className="nglass inline-flex self-start rounded-full p-1.5">
            {services.map((s) => {
              const first = CARDS.findIndex((c) => c.cat === s.name);
              const on = cur.cat === s.name;
              return (
                <button
                  key={s.key}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setI(first)}
                  className={`mono h-11 rounded-full px-6 transition-colors ${on ? "bg-ink text-paper" : "text-ink-2 hover:text-ink"}`}
                >
                  {s.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-16 grid items-center gap-12 lg:grid-cols-12">
          {/* Wallet stack */}
          <div className="relative mx-auto w-full max-w-[520px] pt-[72px] lg:col-span-6" style={{ perspective: "1400px" }}>
            {[3, 2, 1].map((k) => {
              const c = CARDS[(i + k) % n];
              return (
                <div
                  key={`${c.title}-${k}`}
                  aria-hidden
                  className="deck-card absolute inset-x-0 top-0 aspect-[1.586] rounded-[24px]"
                  style={{
                    transform: `translateY(${(3 - k) * 24}px) scale(${1 - k * 0.05})`,
                    filter: `brightness(${1 - k * 0.04})`,
                    zIndex: 3 - k,
                  }}
                >
                  <p className="mono absolute left-6 top-4 text-[9.5px] text-ink/50">{c.title}</p>
                </div>
              );
            })}
            <button
              ref={card}
              type="button"
              onPointerMove={tilt}
              onPointerLeave={reset}
              onClick={() => go(1)}
              aria-label={`${cur.title} — next service`}
              className="deck-card deck-front relative z-10 block aspect-[1.586] w-full rounded-[24px] p-6 text-left sm:p-8"
            >
              <span className="deck-sheen" aria-hidden />
              <span className="relative flex h-full flex-col">
                <span className="flex items-start justify-between">
                  <span className="mono text-[10px] text-ink/60">
                    {cur.cat} <span className="text-ink/35">Card</span>
                  </span>
                  <Mark className="h-6 w-7 bg-ink" />
                </span>
                <span className="mt-4 flex items-center gap-3">
                  {/* chip */}
                  <svg width="38" height="28" viewBox="0 0 38 28" aria-hidden>
                    <rect x=".5" y=".5" width="37" height="27" rx="6" fill="url(#chipg)" stroke="rgb(13 15 18 / .25)" />
                    <path d="M13 1v26M25 1v26M1 10h12M25 10h12M1 18h12M25 18h12" stroke="rgb(13 15 18 / .25)" />
                    <defs>
                      <linearGradient id="chipg" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#f4efe2" />
                        <stop offset="1" stopColor="#cfc6b0" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden className="text-ink/50">
                    <path d="M5 4.5a6 6 0 010 7M8 3a8.5 8.5 0 010 10M11 1.5a11 11 0 010 13" stroke="currentColor" strokeWidth="1.2" fill="none" />
                  </svg>
                </span>
                <span key={cur.title} className="serif fade-up mt-auto block text-[clamp(26px,3.2vw,40px)] leading-[1] text-ink">
                  {cur.title}
                </span>
                <span className="mono mt-4 flex items-center justify-between text-[11px] text-ink/60">
                  <span>•••• {String(i + 1).padStart(4, "0")}</span>
                  <span className="text-[13px] font-semibold italic tracking-tight text-ink">FPV</span>
                </span>
              </span>
            </button>
            <p className="mono mt-6 text-center text-[10px] text-ink-3">Tap the card to flip through · {String(i + 1).padStart(2, "0")}/{String(n).padStart(2, "0")}</p>
          </div>

          {/* Details panel */}
          <div className="nglass rounded-[30px] p-6 sm:p-9 lg:col-span-6">
            <div className="flex items-center justify-between">
              <p className="serif text-[28px] leading-none text-ink">{cur.title}</p>
              <span className="npill mono text-[9.5px] text-ink-2">{cur.cat}</span>
            </div>
            <div className="relative mt-6 aspect-[16/8] overflow-hidden rounded-[20px] bg-mist">
              {"video" in cur && cur.video ? (
                <Loop key={cur.title} slug={cur.video} className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <Photo key={cur.title} slug={cur.img} alt={cur.title} sizes="(min-width:1024px) 40vw, 100vw" className="absolute inset-0 h-full w-full object-cover" />
              )}
            </div>
            <p className="mt-6 text-[15px] leading-relaxed text-ink-2">{cur.lead}</p>

            {/* Action orbs = the service's items */}
            <ul className="mt-7 grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-4">
              {cur.items.map((it, k) => (
                <li key={it} className="flex flex-col items-center gap-2.5 text-center">
                  <span className="norb flex h-12 w-12 items-center justify-center text-ink">
                    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                      {GLYPHS[k % GLYPHS.length]}
                    </svg>
                  </span>
                  <span className="text-[11.5px] leading-tight text-ink-2">{it}</span>
                </li>
              ))}
            </ul>

            {/* Bottom bar, like the reference's Add Card / Order a Card row */}
            <div className="nglass mt-8 flex items-center gap-2 rounded-full p-1.5">
              <button type="button" onClick={() => go(-1)} aria-label="Previous service" className="norb flex h-11 w-11 shrink-0 items-center justify-center text-ink">
                <Arrow className="rotate-180" />
              </button>
              <a href="#contact" className="btn btn-primary h-11 flex-1 px-4">
                Enquiries <Arrow />
              </a>
              <button type="button" onClick={() => go(1)} aria-label="Next service" className="norb flex h-11 w-11 shrink-0 items-center justify-center text-ink">
                <Arrow />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
