"use client";

import { useEffect, useRef } from "react";
import { licences, site } from "@/content/site";
import { asset } from "@/lib/basePath";
import { Arrow, Play } from "../ui";
import { openVideo } from "../VideoModal";

/*
 * ALT hero: the showreel full-screen, dressed as an FPV goggle feed — corner
 * brackets, REC + timecode, channel/battery, a heading tape along the top and
 * altitude / speed ladders down the sides. The headline and buttons sit in a
 * frosted-glass panel (same glass as the header) that floats over the footage
 * and drifts up over the next section as you scroll. OSD numbers are decorative.
 */
/** Vertical OSD tape (altitude left, speed right); the parent scrolls it via the ref. */
function Ladder({ tape, side }: { tape: React.RefObject<HTMLDivElement | null>; side: "l" | "r" }) {
  return (
  <div className={`absolute top-1/2 hidden h-[240px] w-10 -translate-y-1/2 overflow-hidden md:block ${side === "l" ? "left-6 lg:left-10" : "right-6 lg:right-10"}`} style={{ maskImage: "linear-gradient(transparent, #000 20%, #000 80%, transparent)" }}>
    <div ref={tape} className="absolute inset-x-0 -top-6 flex flex-col">
      {Array.from({ length: 14 }, (_, i) => (
        <span key={i} className={`flex h-6 items-center ${side === "l" ? "justify-start" : "justify-end"}`}>
          <i className={`block h-px bg-white/80 ${i % 2 ? "w-2" : "w-4"}`} />
        </span>
      ))}
    </div>
  </div>
  );
}

export function HeroAlt() {
  const root = useRef<HTMLElement>(null);
  const tc = useRef<HTMLSpanElement>(null);
  const alt = useRef<HTMLSpanElement>(null);
  const spd = useRef<HTMLSpanElement>(null);
  const hdg = useRef<HTMLSpanElement>(null);
  const altTape = useRef<HTMLDivElement>(null);
  const spdTape = useRef<HTMLDivElement>(null);
  const hdgTape = useRef<HTMLDivElement>(null);

  // Scroll: footage eases in, glass panel drifts up over the next section.
  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      el.style.setProperty("--s", Math.min(1, Math.max(0, window.scrollY / el.offsetHeight)).toFixed(4));
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

  // OSD telemetry: timecode, drifting ALT/SPD/HDG with their tapes. Written straight to the DOM.
  useEffect(() => {
    const t0 = performance.now();
    let a = 18, s = 62, h = 312, raf = 0, last = 0;
    const pad = (n: number, l = 2) => String(Math.round(n)).padStart(l, "0");
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (now - last < 40) return;
      last = now;
      const t = (now - t0) / 1000;
      if (tc.current) tc.current.textContent = `00:${pad(Math.floor(t / 60) % 60)}:${pad(Math.floor(t) % 60)}:${pad(Math.floor((t % 1) * 25))}`;
      a = Math.max(2, Math.min(64, a + (Math.random() - 0.5) * 1.4));
      s = Math.max(20, Math.min(118, s + (Math.random() - 0.5) * 4));
      h = (h + (Math.random() - 0.45) * 1.2 + 360) % 360;
      if (alt.current) alt.current.textContent = pad(a, 3);
      if (spd.current) spd.current.textContent = pad(s, 3);
      if (hdg.current) hdg.current.textContent = pad(h, 3);
      // Tapes scroll with the values (ticks every 10 units = 24px).
      if (altTape.current) altTape.current.style.transform = `translateY(${((a % 10) / 10) * 24}px)`;
      if (spdTape.current) spdTape.current.style.transform = `translateY(${((s % 10) / 10) * 24}px)`;
      if (hdgTape.current) hdgTape.current.style.transform = `translateX(${-((h % 10) / 10) * 24}px)`;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section ref={root} id="top" className="relative h-[100svh] min-h-[720px] p-2.5 sm:p-3.5" style={{ "--s": 0 } as React.CSSProperties}>
      <div className="relative h-full overflow-hidden rounded-[22px] bg-ink sm:rounded-[30px]">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          style={{ transform: "scale(calc(1.02 + var(--s) * 0.14))" }}
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/5 to-black/40" />

        {/* ── OSD ─────────────────────────────────────────── */}
        <div className="osd" aria-hidden>
          <i className="corner c1" />
          <i className="corner c2" />
          <i className="corner c3" />
          <i className="corner c4" />

          {/* Top row, clear of the header pill */}
          <div className="mono absolute inset-x-8 top-[104px] flex items-center justify-between text-[10.5px] sm:inset-x-12 sm:top-[112px]">
            <span className="flex items-center gap-3">
              <span className="rec-dot blink" /> REC <span ref={tc} className="tabular-nums">00:00:00:00</span>
            </span>
            {/* Heading tape */}
            <span className="relative hidden h-7 w-[280px] overflow-hidden lg:block" style={{ maskImage: "linear-gradient(90deg, transparent, #000 25%, #000 75%, transparent)" }}>
              <span ref={hdgTape} className="absolute inset-y-0 -left-6 flex items-end">
                {Array.from({ length: 16 }, (_, i) => (
                  <i key={i} className={`mr-[23px] block w-px bg-white/80 ${i % 3 ? "h-1.5" : "h-3"}`} />
                ))}
              </span>
              <span className="absolute left-1/2 top-0 -translate-x-1/2 tabular-nums">
                HDG <span ref={hdg}>312</span>°
              </span>
            </span>
            <span className="flex items-center gap-5">
              <span className="hidden sm:inline">FPV · CH 01</span>
              <span className="flex items-center gap-2">
                <svg width="22" height="10" viewBox="0 0 22 10" fill="none">
                  <rect x="0.5" y="0.5" width="19" height="9" rx="1.5" stroke="currentColor" />
                  <rect x="2.5" y="2.5" width="12" height="5" fill="currentColor" />
                  <rect x="20" y="3" width="1.6" height="4" fill="currentColor" />
                </svg>
                16.4V
              </span>
            </span>
          </div>

          {/* Side ladders + readouts */}
          <Ladder tape={altTape} side="l" />
          <Ladder tape={spdTape} side="r" />
          <span className="mono absolute left-[70px] top-1/2 hidden -translate-y-1/2 text-[11px] tabular-nums md:block lg:left-[84px]">
            <span className="block text-[9px] text-white/60">ALT</span>
            <span ref={alt}>018</span>
            <span className="text-white/60">M</span>
          </span>
          <span className="mono absolute right-[70px] top-1/2 hidden -translate-y-1/2 text-right text-[11px] tabular-nums md:block lg:right-[84px]">
            <span className="block text-[9px] text-white/60">SPD</span>
            <span ref={spd}>062</span>
            <span className="text-white/60">KM/H</span>
          </span>

          {/* Centre reticle */}
          <svg width="46" height="46" viewBox="0 0 40 40" fill="none" className="absolute left-1/2 top-[42%] hidden -translate-x-1/2 -translate-y-1/2 lg:block">
            <circle cx="20" cy="20" r="3" stroke="white" strokeWidth="1.2" />
            <path d="M20 4v8M20 28v8M4 20h8M28 20h8" stroke="white" strokeWidth="1.2" />
          </svg>

          {/* Bottom-right: licences */}
          <div className="mono absolute bottom-8 right-8 hidden items-center gap-2 text-[9.5px] sm:bottom-10 sm:right-12 md:flex">
            CASA
            {licences.map((l) => (
              <span key={l} className="rounded-full border border-white/40 px-2 py-1">
                {l}
              </span>
            ))}
          </div>
        </div>

        {/* ── Frosted-glass hero panel ─────────────────────── */}
        <div
          className="absolute inset-x-3 bottom-3 sm:inset-x-auto sm:bottom-8 sm:left-8 lg:bottom-10 lg:left-12"
          style={{ transform: "translateY(calc(var(--s) * -90px))" }}
        >
          <div className="glass w-full rounded-[26px] p-6 sm:w-[560px] sm:rounded-[30px] sm:p-9 lg:w-[620px]">
            <p className="fade-up mono flex items-center gap-2 whitespace-nowrap text-[8.5px] tracking-[0.08em] text-ink-2 sm:gap-2.5 sm:text-[10px] sm:tracking-[0.14em]">
              <span className="rec-dot blink" />
              {site.tagline.join(" • ")}
            </p>
            <h1 className="mt-6 text-[clamp(44px,5.4vw,84px)] leading-[0.9] tracking-[-0.05em] text-ink">
              <span className="rise">
                <span style={{ animationDelay: "0.1s" }}>
                  <span className="dim">A whole</span> new
                </span>
              </span>
              <span className="rise">
                <span style={{ animationDelay: "0.22s" }}>perspective.</span>
              </span>
            </h1>
            <p className="fade-up mt-5 max-w-[460px] text-[15.5px] leading-relaxed text-ink-2" style={{ animationDelay: "0.4s" }}>
              Aerial Image specialise in <span className="text-ink">FPV (First-Person-View) cinematic capture and piloting services.</span>
            </p>
            <div className="fade-up mt-7 flex flex-col gap-2.5 sm:flex-row" style={{ animationDelay: "0.5s" }}>
              <a href="#contact" className="btn btn-primary w-full sm:w-auto">
                Work with us <Arrow />
              </a>
              <button type="button" onClick={() => openVideo(site.showreel, "2024 Showreel")} className="btn btn-ghost w-full bg-white/40 sm:w-auto">
                <Play size={11} /> Watch Showreel
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
