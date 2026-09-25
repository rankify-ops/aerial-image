"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { asset } from "@/lib/basePath";
import { Mark } from "./v2/Phone";

/*
 * Focus-pull loader, shown until the hero footage has buffered enough to play.
 * Their hero still fills the frame, starting heavily defocused; a thin-line
 * lens aperture in the centre opens stop by stop (f/22 → f/1.4) as the hero
 * <video> buffers (target ~3s, or readyState 4), and the image racks into
 * focus with it. ISO / shutter readouts are decorative.
 * Exit: wide open → the blades clear, dip to black, black dissolves onto the page.
 * (Earlier versions were a quad, then a single prop — Tom asked for "not a drone".)
 *
 * Server-rendered visible (no flash of the page first), hidden for no-JS via
 * the .js class, never holds the page longer than MAX_MS.
 */
const MIN_MS = 1600;
const MAX_MS = 7000;
const TARGET_S = 3;
const STOPS = [22, 16, 11, 8, 5.6, 4, 2.8, 2, 1.4];
const BLADES = 6;

/** Aperture geometry: rim minus a hexagon opening, plus each blade edge extended across the rim. */
function aperture(open: number, spin: number) {
  const R = 100;
  const r = 10 + open * 100; // opening radius; >= R means fully clear
  const pts = Array.from({ length: BLADES }, (_, i) => {
    const a = ((i * 360) / BLADES + spin) * (Math.PI / 180);
    return [100 + r * Math.cos(a), 100 + r * Math.sin(a)];
  });
  const hex = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`).join(" ") + " Z";
  const rim = "M200 100 A100 100 0 1 0 0 100 A100 100 0 1 0 200 100 Z";
  const lines = pts.map(([x1, y1], i) => {
    const [x2, y2] = pts[(i + 1) % BLADES];
    const len = Math.hypot(x2 - x1, y2 - y1) || 1;
    const ux = (x2 - x1) / len;
    const uy = (y2 - y1) / len;
    return `M${(x1 - ux * 2 * R).toFixed(2)} ${(y1 - uy * 2 * R).toFixed(2)} L${(x1 + ux * 0.2 * R).toFixed(2)} ${(y1 + uy * 0.2 * R).toFixed(2)}`;
  });
  return { fill: `${rim} ${hex}`, lines, clear: r >= R };
}

export function Preloader() {
  const [p, setP] = useState(0);
  const [phase, setPhase] = useState<"load" | "armed" | "exit" | "reveal" | "gone">("load");
  const shown = useRef(0);

  useEffect(() => {
    const t0 = performance.now();
    document.documentElement.classList.add("preloading");
    let raf = 0;
    let done = false;

    const video = () => document.querySelector<HTMLVideoElement>("#top video");
    const target = () => {
      const v = video();
      if (!v) return 0;
      if (v.readyState >= 4) return 1;
      let ahead = 0;
      for (let i = 0; i < v.buffered.length; i++) {
        if (v.buffered.start(i) <= v.currentTime + 0.1) ahead = Math.max(ahead, v.buffered.end(i) - v.currentTime);
      }
      const dur = Number.isFinite(v.duration) && v.duration > 0 ? Math.min(TARGET_S, v.duration) : TARGET_S;
      return Math.min(1, ahead / dur);
    };

    const tick = (now: number) => {
      const elapsed = now - t0;
      const real = target();
      const floor = Math.min(0.9, elapsed / MAX_MS);
      const goal = elapsed >= MAX_MS ? 1 : Math.max(real, floor);
      shown.current += Math.min(0.03, (goal - shown.current) * 0.1);
      if (goal >= 1 && shown.current > 0.985) shown.current = 1;
      setP(shown.current);

      if (!done && shown.current >= 1 && elapsed >= MIN_MS) {
        done = true;
        // wide open 600ms → blades clear + dip to black 1000ms → reveal 900ms.
        setPhase("armed");
        setTimeout(() => setPhase("exit"), 600);
        setTimeout(() => {
          setPhase("reveal");
          document.documentElement.classList.remove("preloading");
        }, 600 + 1000);
        setTimeout(() => setPhase("gone"), 600 + 1000 + 900);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("preloading");
    };
  }, []);

  if (phase === "gone") return null;
  const pct = Math.round(p * 100);
  const stop = STOPS[Math.min(STOPS.length - 1, Math.floor(p * STOPS.length))];
  // Blades open with a slight twist, like a real iris; fully clear once exiting.
  const ap = aperture(phase === "load" || phase === "armed" ? 0.08 + p * 0.62 : 1.2, (1 - p) * 40);
  const blur = Math.max(0, (1 - p) * 26);

  return (
    <div className={`preloader ${phase === "exit" ? "is-exit" : ""} ${phase === "reveal" ? "is-reveal" : ""}`} role="status" aria-live="polite" aria-label={`Loading ${pct}%`}>
      {/* Their hero still, racking into focus */}
      <div
        className="pre-photo"
        aria-hidden
        style={{
          backgroundImage: `url(${asset("/video/hero-poster.jpg")})`,
          filter: `blur(${blur.toFixed(1)}px) saturate(${(0.6 + p * 0.4).toFixed(2)})`,
          transform: `scale(${(1.12 - p * 0.08).toFixed(3)})`,
        }}
      />
      <div className="pre-vignette" aria-hidden />

      {/* Viewfinder frame */}
      <div className="osd-light is-white" aria-hidden>
        <i className="k1" />
        <i className="k2" />
        <i className="k3" />
        <i className="k4" />
      </div>
      <div className="pre-ui mono absolute inset-x-6 top-6 flex items-center justify-between text-[10px] text-white/75 sm:inset-x-10 sm:top-9">
        <span className="flex items-center gap-3 text-white">
          <Mark className="h-4 w-5 bg-white" />
          Aerial Image <span className="text-white/60">— Focus</span>
        </span>
        <span className="flex items-center gap-2 text-white">
          <span className="rec-dot blink" /> {phase === "load" ? "Standby" : "Rec"}
        </span>
      </div>

      {/* Aperture */}
      <div className="pre-stage-wrap absolute inset-0 flex flex-col items-center justify-center">
        <div className="pre-drone relative h-[240px] w-[240px] sm:h-[300px] sm:w-[300px]">
          <svg viewBox="-20 -20 240 240" className="h-full w-full overflow-visible" aria-hidden>
            <defs>
              <clipPath id="apRim">
                <circle cx="100" cy="100" r="100" />
              </clipPath>
            </defs>
            {!ap.clear && (
              <g clipPath="url(#apRim)">
                <path d={ap.fill} fillRule="evenodd" fill="rgb(255 255 255 / 0.16)" />
                {ap.lines.map((d, i) => (
                  <path key={i} d={d} stroke="rgb(255 255 255 / 0.85)" strokeWidth="0.9" fill="none" />
                ))}
              </g>
            )}
            <circle cx="100" cy="100" r="100" fill="none" stroke="rgb(255 255 255 / 0.9)" strokeWidth="1.1" />
            {/* Focus scale, turning as focus pulls */}
            <g transform={`rotate(${(p * 120).toFixed(2)} 100 100)`}>
              {Array.from({ length: 48 }, (_, i) => (
                <line
                  key={i}
                  x1="100"
                  y1={i % 4 === 0 ? -14 : -10}
                  x2="100"
                  y2="-6"
                  stroke="rgb(255 255 255 / 0.6)"
                  strokeWidth={i % 4 === 0 ? 1.1 : 0.6}
                  transform={`rotate(${i * 7.5} 100 100)`}
                />
              ))}
            </g>
            <path d="M92 100h16M100 92v16" stroke="#fff" strokeWidth="1" />
          </svg>
        </div>

        {/* Readout */}
        <div className="pre-readout mt-10 text-center text-white">
          <p className="text-[clamp(56px,8vw,104px)] leading-none tracking-[-0.05em] tabular-nums">
            <span className="text-white/45">f/</span>
            {stop}
          </p>
          <p className="mono mt-4 flex items-center justify-center gap-3 text-[10.5px] text-white/75 tabular-nums">
            <span>
              Focus <span className="text-white">{String(pct).padStart(3, "0")}%</span>
            </span>
            <span className="text-white/30">·</span>
            <span>ISO 100</span>
            <span className="text-white/30">·</span>
            <span>1/1000</span>
          </p>
        </div>
      </div>

      <p className="mono absolute bottom-7 left-6 text-[10px] text-white/75 sm:bottom-10 sm:left-10">{phase === "load" ? "Pulling focus" : "Wide open"}</p>
      <p className="mono absolute bottom-7 right-6 hidden text-[10px] text-white/75 sm:bottom-10 sm:right-10 sm:block">{site.tagline.join(" • ")}</p>
      <div className="pre-black" aria-hidden />
    </div>
  );
}
