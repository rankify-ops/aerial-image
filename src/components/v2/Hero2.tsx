"use client";

import { useEffect, useRef } from "react";
import { licences, projects, site } from "@/content/site";
import { asset } from "@/lib/basePath";
import { Arrow, Loop, Play } from "../ui";
import { openVideo } from "../VideoModal";

/*
 * Variation 2 hero: the showreel fills the screen inside a rounded frame and
 * the information floats over it on "neu glass" — pearl frosted panels with
 * inner highlights, borrowed from fintech app UI (the reference Tom sent).
 * Glass panels are never opacity-animated (they fog in late — see memory
 * "glass under an opacity fade"); only their text rises, and depth comes
 * from a scroll parallax on transform.
 */

const BARS = 56;

export function Hero2() {
  const root = useRef<HTMLElement>(null);
  const tc = useRef<HTMLSpanElement>(null);
  const bars = useRef<HTMLDivElement>(null);

  // Scroll parallax: video eases back, panels drift up at different rates.
  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const p = Math.min(1, Math.max(0, window.scrollY / el.offsetHeight));
      el.style.setProperty("--s", p.toFixed(4));
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

  // REC timecode + live "telemetry" barcode (decorative).
  useEffect(() => {
    const t0 = performance.now();
    const cols = bars.current ? Array.from(bars.current.querySelectorAll<HTMLElement>("[data-b]")) : [];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (now - last < 60) return;
      last = now;
      const t = (now - t0) / 1000;
      const pad = (n: number) => String(n).padStart(2, "0");
      if (tc.current) tc.current.textContent = `${pad(Math.floor(t / 60) % 60)}:${pad(Math.floor(t) % 60)}:${pad(Math.floor((t % 1) * 25))}`;
      if (reduce) return;
      cols.forEach((c, i) => {
        const x = i / BARS;
        const up = 0.25 + 0.55 * Math.abs(Math.sin(x * 5.2 + t * 0.9)) * (0.6 + 0.4 * Math.sin(x * 13 - t * 1.7));
        const dn = 0.2 + 0.5 * Math.abs(Math.cos(x * 4.1 - t * 0.7)) * (0.6 + 0.4 * Math.cos(x * 11 + t * 1.3));
        c.style.setProperty("--u", Math.max(0.08, up).toFixed(3));
        c.style.setProperty("--d", Math.max(0.06, dn).toFixed(3));
      });
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const feature = projects[0];

  return (
    <section ref={root} id="top" className="relative h-[100svh] min-h-[760px] p-2.5 sm:p-4" style={{ "--s": 0 } as React.CSSProperties}>
      <div className="relative h-full overflow-hidden rounded-[26px] bg-ink sm:rounded-[34px]">
        {/* Footage */}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          style={{ transform: "scale(calc(1.02 + var(--s) * 0.12))" }}
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/35" />

        {/* Top-right REC tag, clear of the header pill */}
        <div className="mono absolute right-5 top-[96px] flex items-center gap-2 text-[10px] text-white sm:right-8 sm:top-[108px]">
          <span className="rec-dot blink" /> REC <span ref={tc} className="tabular-nums">00:00:00</span>
        </div>

        <div className="absolute inset-0 flex flex-col justify-end gap-4 p-3 pb-24 sm:p-6 sm:pb-28 lg:flex-row lg:items-end lg:justify-between lg:p-8 lg:pb-8">
          {/* Headline panel */}
          <div
            className="nglass w-full max-w-[640px] rounded-[26px] p-6 sm:rounded-[30px] sm:p-9"
            style={{ transform: "translateY(calc(var(--s) * -60px))" }}
          >
            <p className="fade-up mono flex flex-nowrap items-center gap-2 text-[10px] text-ink-2">
              {/* Phones get FPV + CASA only, so the row never wraps. */}
              {site.tagline.map((t, i) => (
                <span key={t} className={`npill ${i === 0 ? "npill-ink" : "hidden sm:inline-flex"}`}>
                  {t}
                </span>
              ))}
              <span className="npill sm:hidden">
                <span className="rec-dot" /> CASA Certified
              </span>
            </p>
            <h1 className="serif mt-7 text-[clamp(44px,6.2vw,96px)] leading-[0.95] tracking-[-0.025em] text-ink">
              <span className="rise">
                <span style={{ animationDelay: "0.1s" }}>A whole new</span>
              </span>
              <span className="rise">
                <span style={{ animationDelay: "0.22s" }}>
                  <em>perspective</em>
                  <span className="text-ink/25">.</span>
                </span>
              </span>
            </h1>
            <p className="fade-up mt-6 max-w-[460px] text-[15.5px] leading-relaxed text-ink-2" style={{ animationDelay: "0.4s" }}>
              Aerial Image specialise in FPV (First-Person-View) cinematic capture and piloting services.
            </p>
            <div className="fade-up mt-8 flex flex-col gap-2.5 sm:flex-row" style={{ animationDelay: "0.5s" }}>
              <a href="#contact" className="btn btn-primary w-full sm:w-auto">
                Work with us <Arrow />
              </a>
              <button type="button" onClick={() => openVideo(site.showreel, "2024 Showreel")} className="nbtn w-full sm:w-auto">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-paper">
                  <Play size={10} />
                </span>
                Watch Showreel
              </button>
            </div>
          </div>

          {/* Widget column (desktop) */}
          <div className="hidden w-[380px] shrink-0 flex-col gap-3 lg:flex" style={{ transform: "translateY(calc(var(--s) * -130px))" }}>
            {/* Telemetry — mirrored barcode, the reference's income/expense chart */}
            <div className="nglass rounded-[26px] p-5">
              <div className="flex items-center justify-between">
                <p className="serif text-[22px] leading-none text-ink">Live flight</p>
                <span className="npill mono text-[9.5px] text-ink-2">
                  FPV · CH 01 <svg width="8" height="5" viewBox="0 0 8 5" aria-hidden><path d="M1 1l3 3 3-3" stroke="currentColor" fill="none" /></svg>
                </span>
              </div>
              <div ref={bars} aria-hidden className="mt-5 flex h-[120px] items-center gap-[2px]">
                {Array.from({ length: BARS }, (_, i) => {
                  const hot = i >= 26 && i <= 31;
                  return (
                    <div key={i} data-b className="flex h-full flex-1 flex-col" style={{ "--u": 0.4, "--d": 0.3 } as React.CSSProperties}>
                      <span className="flex h-1/2 items-end pb-[2px]">
                        <span className={`w-full rounded-[1px] ${hot ? "bg-ink" : "bg-ink/15"}`} style={{ height: "calc(var(--u) * 100%)", transition: "height .25s linear" }} />
                      </span>
                      <span className="flex h-1/2 items-start pt-[2px]">
                        <span className={`w-full rounded-[1px] ${hot ? "bg-rec/80" : "bg-rec/15"}`} style={{ height: "calc(var(--d) * 100%)", transition: "height .25s linear" }} />
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mono mt-4 flex justify-between text-[9.5px] text-ink-3">
                <span>ALT</span>
                <span className="text-ink">Now</span>
                <span className="text-rec-ink">SPD</span>
              </div>
            </div>

            {/* Licences — the reference's "quick actions" avatar grid */}
            <div className="nglass rounded-[26px] p-5">
              <div className="flex items-center justify-between">
                <p className="serif text-[22px] leading-none text-ink">CASA Certified</p>
                <span className="mono text-[9.5px] text-ink-3">Fully insured</span>
              </div>
              <ul className="mt-5 grid grid-cols-4 gap-2">
                {licences.map((l) => (
                  <li key={l} className="flex flex-col items-center gap-2">
                    <span className="norb mono flex h-14 w-14 items-center justify-center text-[10px] text-ink">{l}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Latest project */}
            <button
              type="button"
              onClick={() => openVideo(feature.id, feature.title)}
              className="nglass tile group flex items-center gap-4 rounded-[26px] p-3 pr-5 text-left"
            >
              <span className="relative h-[68px] w-[96px] shrink-0 overflow-hidden rounded-[18px] bg-ink">
                <Loop slug={feature.slug} className="absolute inset-0 h-full w-full object-cover" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="mono block text-[9.5px] text-ink-3">Recent project</span>
                <span className="mt-1 block truncate text-[15px] tracking-tight text-ink">{feature.title}</span>
              </span>
              <span className="norb flex h-10 w-10 shrink-0 items-center justify-center text-ink transition-transform duration-500 group-hover:scale-110">
                <Play size={11} />
              </span>
            </button>
          </div>
        </div>

        {/* Dock — the reference's bottom action bar */}
        <nav
          aria-label="Quick actions"
          className="nglass absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full p-1.5 sm:bottom-5 lg:hidden"
        >
          <button type="button" onClick={() => openVideo(site.showreel, "2024 Showreel")} className="nbtn h-11 px-4 text-[10.5px]">
            <Play size={10} /> Reel
          </button>
          <a href="#work" className="norb flex h-11 w-11 items-center justify-center text-ink" aria-label="Work">
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
              <circle cx="3.5" cy="3.5" r="2.5" fill="currentColor" />
              <circle cx="10.5" cy="3.5" r="2.5" fill="currentColor" />
              <circle cx="3.5" cy="10.5" r="2.5" fill="currentColor" />
              <circle cx="10.5" cy="10.5" r="2.5" fill="currentColor" />
            </svg>
          </a>
          <a href="#contact" className="nbtn h-11 px-4 text-[10.5px]">
            Work with us <Arrow />
          </a>
        </nav>

        {/* Scroll cue */}
        <a
          href="#fpv"
          className="mono absolute bottom-8 left-1/2 hidden -translate-x-1/2 items-center gap-3 text-[10px] text-white/80 lg:flex"
          aria-label="Scroll to FPV"
        >
          <span className="relative block h-9 w-[22px] rounded-full border border-white/50">
            <span className="scroll-dot absolute left-1/2 top-2 h-1.5 w-1 -translate-x-1/2 rounded-full bg-white" />
          </span>
        </a>
      </div>
    </section>
  );
}
