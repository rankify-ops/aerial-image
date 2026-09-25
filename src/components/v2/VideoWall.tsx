"use client";

import { useEffect, useRef } from "react";
import { site, stills } from "@/content/site";
import { Arrow, Loop, Photo, Play } from "../ui";
import { openVideo } from "../VideoModal";

/*
 * A tilted wall of footage: six columns of FPV loops and their aerial stills
 * on a perspective plane, drifting in opposite directions as you scroll, with
 * one glass card pinned in the middle. Only on-screen clips decode (Loop).
 */
type Tile = { v: string } | { p: string };

const COLS: Tile[][] = [
  [{ v: "fpv-coast" }, { p: stills[0] }, { v: "fpv-stadium" }, { p: stills[1] }],
  [{ p: stills[2] }, { v: "fpv-canola" }, { p: stills[3] }, { v: "fpv-interior" }],
  [{ v: "fpv-lighthouse" }, { p: stills[4] }, { v: "fpv-boat" }, { p: stills[5] }],
  [{ p: stills[6] }, { v: "fpv-bar" }, { p: stills[8] }, { v: "fpv-school" }],
  [{ v: "fpv-canola" }, { p: stills[7] }, { v: "fpv-coast" }, { p: stills[9] }],
  [{ p: stills[1] }, { v: "fpv-lighthouse" }, { p: stills[4] }, { v: "fpv-stadium" }],
];

export function VideoWall() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const span = el.offsetHeight + window.innerHeight;
      const p = (window.innerHeight - r.top) / span; // 0 → 1 while on screen
      el.style.setProperty("--t", Math.min(1, Math.max(0, p)).toFixed(4));
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
    <section ref={root} id="fpv" className="relative h-[170vh]" style={{ "--t": 0.3 } as React.CSSProperties}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* The plane */}
        <div className="absolute inset-0" style={{ perspective: "1800px" }} aria-hidden>
          <div
            className="absolute left-1/2 top-1/2 flex w-[240vw] gap-3 sm:w-[170vw] sm:gap-4 lg:w-[132vw]"
            style={{
              transform: "translate(-50%, -50%) rotateX(24deg) rotateZ(-12deg) scale(1.05)",
              transformStyle: "preserve-3d",
            }}
          >
            {COLS.map((col, c) => (
              <div
                key={c}
                className="flex flex-1 flex-col gap-3 sm:gap-4"
                style={{
                  transform: `translateY(calc(${c % 2 ? "-1" : "1"} * (var(--t) - 0.5) * 46vh + ${c % 2 ? "-8vh" : "6vh"}))`,
                }}
              >
                {[...col, ...col.slice(0, 2)].map((t, i) => (
                  <div key={i} className="relative aspect-[4/5] overflow-hidden rounded-[18px] bg-mist shadow-[0_30px_60px_-30px_rgb(13_15_18/0.5)] sm:rounded-[24px]">
                    {"v" in t ? (
                      <>
                        <Loop slug={t.v} className="absolute inset-0 h-full w-full object-cover" />
                        <span className="mono absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/25 px-2 py-1 text-[8.5px] text-white backdrop-blur-md sm:left-4 sm:top-4">
                          <span className="rec-dot blink" /> FPV
                        </span>
                      </>
                    ) : (
                      <Photo slug={t.p} alt="" sizes="30vw" className="absolute inset-0 h-full w-full object-cover" />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Pearl vignette so the wall melts into the page */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 65% at 50% 50%, rgb(235 234 230 / 0), rgb(235 234 230 / 0.25) 62%, #ebeae6 96%), linear-gradient(180deg, #ebeae6, transparent 14%, transparent 86%, #ebeae6)",
          }}
        />

        {/* Pinned glass card */}
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="nglass w-full max-w-[560px] rounded-[32px] p-7 text-center sm:p-10">
            <p className="mono flex items-center justify-center gap-3 text-[10px] text-ink-3">
              <span className="text-rec">01</span>
              <span className="h-px w-8 bg-rule-2" />
              FPV Video / Piloting
            </p>
            <h2 className="serif mt-6 text-[clamp(44px,5.6vw,84px)] leading-[0.92] tracking-[-0.02em] text-ink">
              FPV Cinematic <em className="text-ink/45">Media</em>
            </h2>
            <p className="mx-auto mt-6 max-w-[420px] text-[15.5px] leading-relaxed text-ink-2">
              With the combination of ground and aerial imagery, Aerial Image specialise in FPV (First-Person-View) cinematic capture and piloting services.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-2.5 sm:flex-row">
              <button type="button" onClick={() => openVideo(site.showreel, "2024 Showreel")} className="nbtn w-full sm:w-auto">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-paper">
                  <Play size={10} />
                </span>
                Watch Showreel
              </button>
              <a href="#contact" className="btn btn-primary w-full sm:w-auto">
                Work with us <Arrow />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
