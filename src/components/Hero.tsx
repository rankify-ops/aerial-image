"use client";

import { useEffect, useRef } from "react";
import { site, licences } from "@/content/site";
import { asset } from "@/lib/basePath";
import { Arrow, Play } from "./ui";
import { openVideo } from "./VideoModal";
import { HeroServices } from "./HeroServices";

/*
 * Headline, then the showreel in an inset frame. As the frame reaches the top
 * it sticks and opens out to full-bleed (clip-path, so the video element never
 * resizes or re-lays out). The OSD is the FPV goggle overlay: REC timecode,
 * artificial horizon, telemetry — decorative, aria-hidden.
 */
export function Hero() {
  const stage = useRef<HTMLDivElement>(null);
  const tc = useRef<HTMLSpanElement>(null);
  const alt = useRef<HTMLSpanElement>(null);
  const spd = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const span = el.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / (span * 0.7)));
      const e = 1 - Math.pow(1 - p, 3);
      el.style.setProperty("--p", e.toFixed(4));
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

  // Timecode + telemetry tick. Written straight to the DOM — no re-renders.
  useEffect(() => {
    const t0 = performance.now();
    let a = 18;
    let s = 62;
    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (now - last < 40) return;
      last = now;
      const t = (now - t0) / 1000;
      const f = Math.floor((t % 1) * 25);
      const sec = Math.floor(t) % 60;
      const min = Math.floor(t / 60) % 60;
      const pad = (n: number) => String(n).padStart(2, "0");
      if (tc.current) tc.current.textContent = `00:${pad(min)}:${pad(sec)}:${pad(f)}`;
      a = Math.max(2, Math.min(64, a + (Math.random() - 0.5) * 1.6));
      s = Math.max(20, Math.min(118, s + (Math.random() - 0.5) * 5));
      if (alt.current) alt.current.textContent = String(Math.round(a)).padStart(3, "0");
      if (spd.current) spd.current.textContent = String(Math.round(s)).padStart(3, "0");
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section id="top" className="relative">
      <div className="grid-bg pointer-events-none absolute inset-x-0 top-0 h-[900px]" aria-hidden />

      <div className="wrap relative pt-32 sm:pt-40">
        <div className="fade-up mono flex flex-wrap items-center justify-between gap-x-8 gap-y-3 text-ink-2" style={{ animationDelay: "0.1s" }}>
          <p className="flex items-center gap-2.5 whitespace-nowrap text-[9px] tracking-[0.1em] sm:gap-3 sm:text-[11px] sm:tracking-[0.14em]">
            <span className="rec-dot blink" />
            {site.tagline.join(" • ")}
          </p>
          <p className="flex items-center gap-3 text-ink-3">
            CASA Certified
            <span className="hidden gap-1.5 sm:flex">
              {licences.map((l) => (
                <span key={l} className="rounded-full border border-rule-2 px-2 py-1 text-[10px] text-ink-2">
                  {l}
                </span>
              ))}
            </span>
          </p>
        </div>

        {/* Left: headline, intro, CTAs. Right (desktop): services. */}
        <div className="grid gap-12 pb-12 lg:grid-cols-12 lg:items-center lg:gap-10 lg:pb-16">
          <div className="lg:col-span-7">
            <h1 className="mt-8 text-[clamp(48px,6.2vw,112px)] leading-[0.88] tracking-[-0.055em] sm:mt-10">
              <span className="rise">
                <span style={{ animationDelay: "0.15s" }}>
                  <span className="dim">A whole</span> new
                </span>
              </span>
              <span className="rise">
                <span style={{ animationDelay: "0.28s" }}>perspective.</span>
              </span>
            </h1>
            <p className="fade-up mt-8 max-w-[520px] text-[17px] leading-relaxed text-ink-2 sm:mt-10" style={{ animationDelay: "0.5s" }}>
              Aerial Image specialise in <span className="text-ink">FPV (First-Person-View) cinematic capture and piloting services.</span>{" "}
              Every project is carefully planned and captured to ensure the final deliverables are captivating and on point.
            </p>
            {/* Phones/tablets only — on desktop the service tiles carry "Work with us" and the video below has "Play with sound". */}
            <div className="fade-up mt-8 flex flex-col gap-3 sm:flex-row lg:hidden" style={{ animationDelay: "0.62s" }}>
              <a href="#contact" className="btn btn-primary w-full sm:w-auto">
                Work with us <Arrow />
              </a>
              <button type="button" onClick={() => openVideo(site.showreel, "2024 Showreel")} className="btn btn-ghost w-full sm:w-auto">
                <Play size={11} /> Watch Showreel
              </button>
            </div>
          </div>
          <div className="hidden lg:col-span-5 lg:block">
            <HeroServices />
          </div>
        </div>
      </div>

      {/* Scroll stage: 190vh tall, frame sticks and opens to full-bleed. */}
      <div ref={stage} className="relative h-[190vh]" style={{ "--p": 0 } as React.CSSProperties}>
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              clipPath:
                "inset(calc((1 - var(--p)) * 2.5vh) calc((1 - var(--p)) * max(16px, 3vw)) calc((1 - var(--p)) * 9vh) calc((1 - var(--p)) * max(16px, 3vw)) round calc((1 - var(--p)) * 28px))",
            }}
          >
            <video
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster={asset("/video/hero-poster.jpg")}
              aria-label="Aerial Image FPV showreel"
            >
              <source src={asset("/video/hero-540.mp4")} type="video/mp4" media="(max-width: 767px)" />
              <source src={asset("/video/hero-1080.mp4")} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/20" />
          </div>

          {/* OSD — tracks the same inset as the clip. */}
          <div
            className="osd"
            aria-hidden
            style={{
              inset:
                "calc((1 - var(--p)) * 2.5vh) calc((1 - var(--p)) * max(16px, 3vw)) calc((1 - var(--p)) * 9vh) calc((1 - var(--p)) * max(16px, 3vw))",
            }}
          >
            <i className="corner c1" />
            <i className="corner c2" />
            <i className="corner c3" />
            <i className="corner c4" />

            <div className="mono absolute left-6 top-6 flex items-center gap-3 pl-8 pt-1 text-[10.5px] sm:left-8 sm:top-8">
              <span className="rec-dot blink" />
              <span>REC</span>
              <span ref={tc} className="tabular-nums">
                00:00:00:00
              </span>
            </div>
            <div className="mono absolute right-6 top-6 hidden items-center gap-5 pr-8 pt-1 text-[10.5px] sm:right-8 sm:top-8 sm:flex">
              <span>FPV · CH 01</span>
              <span className="flex items-center gap-2">
                <svg width="22" height="10" viewBox="0 0 22 10" fill="none">
                  <rect x="0.5" y="0.5" width="19" height="9" rx="1.5" stroke="currentColor" />
                  <rect x="2.5" y="2.5" width="12" height="5" fill="currentColor" />
                  <rect x="20" y="3" width="1.6" height="4" fill="currentColor" />
                </svg>
                16.4V
              </span>
            </div>

            {/* Crosshair + artificial horizon */}
            <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 sm:block">
              <svg width="360" height="120" viewBox="0 0 360 120" fill="none" className="horizon opacity-80">
                <path d="M0 60h120M240 60h120" stroke="white" strokeWidth="1.2" />
                <path d="M120 60v8M240 60v8" stroke="white" strokeWidth="1.2" />
              </svg>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <circle cx="20" cy="20" r="3" stroke="white" strokeWidth="1.2" />
                <path d="M20 4v8M20 28v8M4 20h8M28 20h8" stroke="white" strokeWidth="1.2" />
              </svg>
            </div>

            <div className="mono absolute bottom-6 right-6 hidden gap-6 pb-1 pr-8 text-[10.5px] sm:bottom-8 sm:right-8 sm:flex">
              <span>
                ALT <span ref={alt} className="tabular-nums">018</span>M
              </span>
              <span>
                SPD <span ref={spd} className="tabular-nums">062</span>KM/H
              </span>
            </div>
          </div>

          {/* Showreel card — real button, outside the aria-hidden OSD. */}
          <div
            className="absolute"
            style={{
              left: "calc((1 - var(--p)) * max(16px, 3vw) + 24px)",
              bottom: "calc((1 - var(--p)) * 9vh + 24px)",
            }}
          >
            <button
              type="button"
              onClick={() => openVideo(site.showreel, "2024 Showreel")}
              className="glass-dark group flex items-center gap-4 rounded-full py-2 pl-2 pr-6 text-left transition-colors hover:bg-black/50"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-ink transition-transform duration-500 group-hover:scale-110">
                <Play size={13} />
              </span>
              <span>
                <span className="mono block text-[10px] text-white/60">Showreel · 1:14</span>
                <span className="block text-[15px] tracking-tight">Play with sound</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
