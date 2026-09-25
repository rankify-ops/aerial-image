"use client";

import { useEffect, useRef } from "react";
import { reel, site, creativeIntro } from "@/content/site";
import { Kicker, Loop, Play } from "./ui";
import { openVideo } from "./VideoModal";

/*
 * Desktop: the section pins and vertical scroll drives the clip track
 * sideways, like flying down a corridor. Mobile / reduced motion: a plain
 * swipeable row — never scroll-jack a phone.
 */
export function Reel() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const sec = section.current;
    const tr = track.current;
    if (!sec || !tr) return;
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    let raf = 0;
    let dist = 0;

    const measure = () => {
      if (!mq.matches) {
        sec.style.height = "";
        tr.style.transform = "";
        return;
      }
      dist = Math.max(0, tr.scrollWidth - window.innerWidth + 48);
      sec.style.height = `${window.innerHeight + dist}px`;
      update();
    };
    const update = () => {
      raf = 0;
      if (!mq.matches) return;
      const r = sec.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / dist));
      tr.style.transform = `translate3d(${-p * dist}px,0,0)`;
      sec.style.setProperty("--rp", p.toFixed(4));
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    measure();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", measure);
    mq.addEventListener("change", measure);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", measure);
      mq.removeEventListener("change", measure);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={section} className="relative bg-paper" style={{ "--rp": 0 } as React.CSSProperties}>
      <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:overflow-hidden">
        <div className="wrap grid gap-8 pb-10 lg:grid-cols-12 lg:items-end lg:pb-12">
          <div className="lg:col-span-7">
            <Kicker index="03">FPV Cinematic Media</Kicker>
            <h2 className="display mt-8">
              Immersive <span className="dim">and captivating.</span>
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="max-w-[460px] text-[15.5px] leading-relaxed">{creativeIntro}</p>
          </div>
        </div>

        <ul
          ref={track}
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 will-change-transform sm:px-7 lg:snap-none lg:overflow-visible lg:px-11"
        >
          {reel.map((c, i) => (
            <li
              key={c.slug}
              className="tile group relative aspect-[4/5] w-[78vw] shrink-0 snap-start overflow-hidden rounded-[22px] bg-ink sm:w-[46vw] lg:aspect-[3/4] lg:h-[58vh] lg:w-auto"
            >
              <Loop slug={c.slug} hover className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />
              <div className="mono absolute inset-x-5 top-5 flex items-center justify-between text-[10.5px] text-white/85">
                <span className="flex items-center gap-2">
                  <span className="rec-dot opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  CH {String(i + 1).padStart(2, "0")}
                </span>
                <span>{String(i + 1).padStart(2, "0")} / {String(reel.length).padStart(2, "0")}</span>
              </div>
              <p className="absolute inset-x-5 bottom-5 text-[22px] tracking-tight text-white">{c.label}</p>
            </li>
          ))}
          <li className="flex aspect-[4/5] w-[78vw] shrink-0 snap-start flex-col justify-between rounded-[22px] border border-rule bg-white p-7 sm:w-[46vw] lg:aspect-[3/4] lg:h-[58vh] lg:w-auto">
            <p className="mono text-ink-3">Full cut</p>
            <div>
              <p className="text-[34px] leading-[1] tracking-tight text-ink">
                2024 Website
                <br />
                Main
              </p>
              <button type="button" onClick={() => openVideo(site.showreel, "2024 Showreel")} className="btn btn-primary mt-8 w-full">
                <Play size={11} /> Play showreel
              </button>
            </div>
          </li>
        </ul>

        {/* Progress hairline (desktop). */}
        <div className="wrap mt-8 hidden lg:block">
          <div className="relative h-px bg-rule">
            <div className="absolute inset-y-0 left-0 bg-ink" style={{ width: "calc(var(--rp) * 100%)" }} />
          </div>
        </div>
      </div>
    </section>
  );
}
