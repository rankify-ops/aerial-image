"use client";

import { useEffect, useRef } from "react";
import { about, clients, licences, pillars } from "@/content/site";
import { asset } from "@/lib/basePath";
import { Mark } from "./Phone";

/*
 * The tilted, close-up UI shots in the reference (slides 2–3): credentials as
 * a dashboard lying on an isometric plane that lifts flat as you scroll in.
 * Desktop only tilts — phones get the flat board.
 */
export function Board() {
  const root = useRef<HTMLElement>(null);
  const grid = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const g = grid.current;
    if (!el || !g) return;
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    let raf = 0;
    const update = () => {
      raf = 0;
      if (!mq.matches) {
        el.style.setProperty("--f", "1");
        return;
      }
      const r = g.getBoundingClientRect();
      const p = (window.innerHeight - r.top) / (window.innerHeight * 0.7);
      const e = Math.min(1, Math.max(0, p));
      el.style.setProperty("--f", (1 - Math.pow(1 - e, 3)).toFixed(4));
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={root} id="credentials" className="relative overflow-hidden py-28 sm:py-36" style={{ "--f": 0 } as React.CSSProperties}>
      <div className="wrap">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <p className="mono flex items-center gap-4 text-ink-3">
              <span className="text-rec">05</span>
              <span className="h-px w-10 bg-rule-2" />
              About Us
            </p>
            <h2 className="serif mt-8 text-[clamp(44px,6vw,96px)] leading-[0.95] tracking-[-0.02em] text-ink">
              Quality <em className="text-ink/45">over</em> Quantity
            </h2>
          </div>
          <p className="text-[15.5px] leading-relaxed text-ink-2 lg:col-span-5 lg:col-start-8">{about}</p>
        </div>

        <div ref={grid} className="mt-16" style={{ perspective: "2200px" }}>
          <div
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-12"
            style={{
              transform:
                "rotateX(calc((1 - var(--f)) * 48deg)) rotateZ(calc((1 - var(--f)) * -24deg)) translateY(calc((1 - var(--f)) * 60px)) scale(calc(0.86 + var(--f) * 0.14))",
              transformOrigin: "50% 30%",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Balance-style headline tile */}
            <div className="nglass rounded-[28px] p-7 sm:col-span-2 lg:col-span-5 lg:row-span-2">
              <div className="flex items-center justify-between">
                <span className="norb flex h-10 w-10 items-center justify-center">
                  <Mark className="h-4 w-5 bg-ink" />
                </span>
                <span className="npill mono text-[9.5px] text-ink-2">CASA Certified ▾</span>
              </div>
              <p className="mt-10 text-[13px] text-ink-3">Years in the Photo/Video/Audio industry</p>
              <p className="serif mt-2 text-[clamp(88px,10vw,150px)] leading-[0.85] text-ink">
                10<span className="text-ink/25">+</span>
              </p>
              <p className="mt-8 text-[14px] leading-relaxed text-ink-2">
                Aerial Image and its pilots are approved by CASA (ReOC, RePL, AROC &amp; EVLOS) to operate within Australia. We are also fully insured.
              </p>
              <div className="mt-8 flex items-center gap-6 border-t border-ink/[0.07] pt-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset("/img/logos/casa-logo-white.png")} alt="Civil Aviation Safety Authority" className="h-8 w-auto invert" loading="lazy" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset("/img/logos/vesi-edited-white.png")} alt="VESI Accredited" className="h-8 w-auto invert" loading="lazy" />
              </div>
            </div>

            {/* Licences as quick-action orbs */}
            <div className="nglass rounded-[28px] p-7 lg:col-span-4">
              <p className="serif text-[26px] leading-none text-ink">Licences</p>
              <ul className="mt-6 grid grid-cols-4 gap-2">
                {licences.map((l) => (
                  <li key={l} className="flex flex-col items-center gap-2">
                    <span className="norb mono flex h-[58px] w-[58px] items-center justify-center text-[10px] text-ink">{l}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Clients as avatar orbs */}
            <div className="nglass rounded-[28px] p-7 lg:col-span-3">
              <p className="serif text-[26px] leading-none text-ink">Worked with</p>
              <ul className="mt-6 grid grid-cols-4 gap-2">
                {clients.map((c) => (
                  <li key={c.src} className="norb flex aspect-square items-center justify-center overflow-hidden p-2" title={c.alt}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={asset(`/img/logos/${c.src}.png`)} alt={c.alt} className="max-h-full max-w-full object-contain grayscale" loading="lazy" />
                  </li>
                ))}
                <li aria-hidden className="flex aspect-square items-center justify-center rounded-full bg-ink text-paper">
                  <span className="text-[18px] leading-none">+</span>
                </li>
              </ul>
            </div>

            {/* Pillars */}
            {pillars.slice(1).map((p, i) => (
              <div key={p.title} className={`nglass rounded-[28px] p-7 ${i === 0 ? "sm:col-span-2 lg:col-span-7" : "lg:col-span-6"}`}>
                <div className="flex items-baseline justify-between gap-4">
                  <p className="serif text-[26px] leading-none text-ink">{p.title}</p>
                  <span className="mono text-[9.5px] text-rec">0{i + 2}</span>
                </div>
                <p className="mt-4 text-[14px] leading-relaxed text-ink-2">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
