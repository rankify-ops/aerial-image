"use client";

import { useEffect, useRef, useState } from "react";

/*
 * Minimal loader, shown until the hero footage has buffered enough to play:
 * a small thin-line lens aperture on the plain ground, opening stop by stop
 * (f/22 → f/1.4) as the hero <video> buffers (target ~3s, or readyState 4),
 * with a tiny f-stop / % readout underneath.
 * Exit: wide open → blades clear, dip to black, black dissolves onto the page.
 * (Tom rejected a quad, a prop, and a full-screen photo focus-pull — keep it small.)
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

  return (
    <div className={`preloader ${phase === "exit" ? "is-exit" : ""} ${phase === "reveal" ? "is-reveal" : ""}`} role="status" aria-live="polite" aria-label={`Loading ${pct}%`}>
      <div className="pre-stage-wrap absolute inset-0 flex flex-col items-center justify-center">
        <div className="pre-drone h-[72px] w-[72px]">
          <svg viewBox="-6 -6 212 212" className="h-full w-full" aria-hidden>
            <defs>
              <clipPath id="apRim">
                <circle cx="100" cy="100" r="100" />
              </clipPath>
            </defs>
            {!ap.clear && (
              <g clipPath="url(#apRim)">
                <path d={ap.fill} fillRule="evenodd" fill="rgb(13 15 18 / 0.08)" />
                {ap.lines.map((d, i) => (
                  <path key={i} d={d} stroke="var(--ink)" strokeWidth="4" fill="none" />
                ))}
              </g>
            )}
            <circle cx="100" cy="100" r="100" fill="none" stroke="var(--ink)" strokeWidth="5" />
          </svg>
        </div>
        <p className="pre-readout mono mt-6 flex items-center gap-3 text-[10.5px] text-ink-3 tabular-nums">
          <span className="text-ink">f/{stop}</span>
          <span className="text-ink/20">·</span>
          <span>{String(pct).padStart(3, "0")}%</span>
        </p>
      </div>
      <div className="pre-black" aria-hidden />
    </div>
  );
}
