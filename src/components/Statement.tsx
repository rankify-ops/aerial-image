"use client";

import { useEffect, useRef } from "react";
import { fpvStatement } from "@/content/site";
import { Kicker } from "./ui";

/*
 * Their FPV paragraph set huge, each word inking in as you scroll past —
 * reading pace set by the thumb. Words are plain spans, so the full sentence
 * is always in the DOM for screen readers and search.
 */
export function Statement() {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = fpvStatement.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const spans = Array.from(el.querySelectorAll<HTMLSpanElement>(".ink-word"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      spans.forEach((s) => s.classList.add("on"));
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.75 - r.top) / (r.height + vh * 0.35)));
      const n = Math.round(p * spans.length);
      spans.forEach((s, i) => s.classList.toggle("on", i < n));
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", on, { passive: true });
    return () => {
      window.removeEventListener("scroll", on);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="fpv" className="wrap py-28 sm:py-40">
      <Kicker index="02">FPV Video / Piloting</Kicker>
      <p ref={ref} className="mt-12 max-w-[1280px] text-[clamp(30px,4.6vw,72px)] leading-[1.02] tracking-[-0.04em]">
        {words.map((w, i) => (
          <span key={i} className="ink-word">
            {w}{" "}
          </span>
        ))}
      </p>
    </section>
  );
}
