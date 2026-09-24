"use client";

import { useEffect, useRef } from "react";
import { licences } from "@/content/site";
import { Loop } from "../ui";
import { Phone } from "./Phone";

/*
 * Pinned stage: a phone playing FPV footage turns from a tilted 3D pose to
 * face-on as you scroll (the hand-held renders in the reference), while their
 * FPV paragraph arrives in three glass callouts. Callouts reveal with
 * clip-path + transform, never opacity (glass fogs in late under an opacity
 * fade). On phones the callouts share one slot and swap.
 */
const LINES = [
  { text: "FPV Cinematic Media is becoming extremely popular across the creative industry.", at: 0.12, pos: "lg:left-0 lg:top-[18%]" },
  { text: "From films to marketing material,", at: 0.36, pos: "lg:right-0 lg:top-[38%]" },
  { text: "this style of immersive and captivating content brings a whole new perspective to your project.", at: 0.6, pos: "lg:left-[3%] lg:bottom-[10%]" },
];

export function FlightDeck() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const calls = Array.from(el.querySelectorAll<HTMLElement>("[data-at]"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const span = el.offsetHeight - window.innerHeight;
      const p = reduce ? 1 : Math.min(1, Math.max(0, -r.top / span));
      el.style.setProperty("--p", p.toFixed(4));
      let current = -1;
      calls.forEach((c, i) => {
        const on = p >= Number(c.dataset.at);
        c.dataset.on = on ? "1" : "0";
        if (on) current = i;
      });
      calls.forEach((c, i) => (c.dataset.past = i < current ? "1" : "0"));
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
    <section ref={root} className="relative h-[300vh]" style={{ "--p": 0 } as React.CSSProperties} aria-label="FPV Video / Piloting">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        {/* Soft halo behind the phone */}
        <div aria-hidden className="absolute left-1/2 top-1/2 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70 blur-3xl" />

        <div className="wrap relative h-full">
          <p className="mono absolute left-4 top-24 flex items-center gap-4 text-ink-3 sm:left-7 lg:left-11">
            <span className="text-rec">01</span>
            <span className="h-px w-10 bg-rule-2" />
            FPV Video / Piloting
          </p>

          {/* Phone */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[56%] lg:-translate-y-1/2" style={{ perspective: "1600px" }}>
            <div
              style={{
                transform:
                  "rotateY(calc((1 - min(1, var(--p) * 1.6)) * -32deg)) rotateX(calc((1 - min(1, var(--p) * 1.6)) * 14deg)) rotateZ(calc((1 - min(1, var(--p) * 1.6)) * -8deg)) scale(calc(0.92 + min(1, var(--p) * 1.6) * 0.08))",
                transformStyle: "preserve-3d",
              }}
            >
              <Phone dark className="w-[min(62vw,300px)] lg:w-[330px]">
                <Loop slug="fpv-canola" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
                <div className="mono absolute left-[8%] top-[44px] flex items-center gap-1.5 text-[8px] text-white">
                  <span className="rec-dot blink" /> REC
                </div>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <svg width="44" height="44" viewBox="0 0 40 40" fill="none" aria-hidden>
                    <circle cx="20" cy="20" r="3" stroke="white" strokeWidth="1.2" />
                    <path d="M20 4v8M20 28v8M4 20h8M28 20h8" stroke="white" strokeWidth="1.2" />
                  </svg>
                </div>
                <div className="absolute inset-x-[7%] bottom-6 flex flex-wrap justify-center gap-1.5">
                  {licences.map((l) => (
                    <span key={l} className="mono rounded-full bg-white/15 px-2.5 py-1.5 text-[8px] text-white backdrop-blur-md">
                      {l}
                    </span>
                  ))}
                </div>
              </Phone>
              {/* Floor shadow */}
              <div aria-hidden className="mx-auto mt-6 h-6 w-[70%] rounded-[50%] bg-ink/25 blur-xl" />
            </div>
          </div>

          {/* Callouts */}
          {LINES.map((l, i) => (
            <div
              key={i}
              data-at={l.at}
              data-on="0"
              className={`fd-call nglass absolute inset-x-4 bottom-6 rounded-[24px] p-5 sm:inset-x-auto sm:left-1/2 sm:w-[440px] sm:-translate-x-1/2 lg:inset-auto lg:w-[340px] lg:translate-x-0 xl:w-[380px] ${l.pos}`}
            >
              <p className="mono flex items-center justify-between text-[9.5px] text-ink-3">
                <span>FPV Cinematic Media</span>
                <span className="text-ink">
                  0{i + 1}
                  <span className="text-ink-3">/03</span>
                </span>
              </p>
              <p className="serif mt-4 text-[clamp(24px,2.3vw,34px)] leading-[1.08] text-ink">{l.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
