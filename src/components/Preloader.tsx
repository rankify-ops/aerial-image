"use client";

import { useEffect, useRef, useState } from "react";
import { licences, site } from "@/content/site";
import { Mark } from "./v2/Phone";

/*
 * Pre-flight arming screen, shown until the hero footage has buffered enough
 * to play. The gimbal ring and % are real: they track how many seconds of the
 * hero <video> are buffered (target ~3s, or readyState 4). The checklist and
 * telemetry are decorative. Exit: ARMED → the quad punches past the camera and
 * an iris opens from the centre onto the page.
 *
 * Server-rendered visible (so there's no flash of the page first), hidden for
 * no-JS via the .js class, and never holds the page longer than MAX_MS.
 */
const MIN_MS = 1600;
const MAX_MS = 7000;
const TARGET_S = 3;

const CHECKS = [
  { at: 0.12, label: "Video link", value: "5.8 GHz · CH 01" },
  { at: 0.35, label: "Satellites", value: "Locked" },
  { at: 0.58, label: "CASA", value: licences.join(" · ") },
  { at: 0.8, label: "Props", value: "Spun up" },
];

export function Preloader() {
  const [p, setP] = useState(0);
  const [phase, setPhase] = useState<"load" | "armed" | "exit" | "gone">("load");
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
      // Real buffer progress, but never ahead of a minimum pace, and forced home at MAX_MS.
      const real = target();
      const floor = Math.min(0.9, elapsed / MAX_MS);
      const goal = elapsed >= MAX_MS ? 1 : Math.max(real, floor);
      // Ease the displayed value toward the goal; cap speed so it reads as a sweep.
      shown.current += Math.min(0.035, (goal - shown.current) * 0.12);
      if (goal >= 1 && shown.current > 0.985) shown.current = 1;
      setP(shown.current);

      if (!done && shown.current >= 1 && elapsed >= MIN_MS) {
        done = true;
        setPhase("armed");
        setTimeout(() => setPhase("exit"), 520);
        setTimeout(() => {
          setPhase("gone");
          document.documentElement.classList.remove("preloading");
        }, 520 + 1300);
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
  const R = 118;
  const C = 2 * Math.PI * R;

  return (
    <div className={`preloader ${phase === "exit" ? "is-exit" : ""}`} role="status" aria-live="polite" aria-label={`Loading ${pct}%`}>
      {/* Frame corners + top telemetry */}
      <div className="osd-light" aria-hidden>
        <i className="k1" />
        <i className="k2" />
        <i className="k3" />
        <i className="k4" />
      </div>
      <div className="mono absolute inset-x-6 top-6 flex items-center justify-between text-[10px] text-ink-3 sm:inset-x-10 sm:top-9">
        <span className="flex items-center gap-3 text-ink">
          <Mark className="h-4 w-5 bg-ink" />
          Aerial Image <span className="text-ink-3">— Pre-flight</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="rec-dot blink" /> {phase === "load" ? "Standby" : "Rec"}
        </span>
      </div>

      {/* Stage */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="pre-stage relative h-[300px] w-[300px] sm:h-[340px] sm:w-[340px]">
          {/* Gimbal ring: ticks rotate slowly, arc = buffer progress */}
          <svg viewBox="0 0 300 300" className="absolute inset-0 h-full w-full" aria-hidden>
            <g className="pre-ticks" style={{ transformOrigin: "150px 150px" }}>
              {Array.from({ length: 72 }, (_, i) => (
                <line
                  key={i}
                  x1="150"
                  y1={i % 6 === 0 ? 8 : 12}
                  x2="150"
                  y2="18"
                  stroke="currentColor"
                  strokeWidth={i % 6 === 0 ? 1.4 : 0.8}
                  className="text-ink/25"
                  transform={`rotate(${i * 5} 150 150)`}
                />
              ))}
            </g>
            <circle cx="150" cy="150" r={R} fill="none" stroke="rgb(13 15 18 / 0.08)" strokeWidth="1.5" />
            <circle
              cx="150"
              cy="150"
              r={R}
              fill="none"
              stroke={phase === "load" ? "var(--ink)" : "var(--rec)"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - p)}
              transform="rotate(-90 150 150)"
              style={{ transition: "stroke .3s" }}
            />
            {/* Leading marker on the arc */}
            <g transform={`rotate(${p * 360 - 90} 150 150)`}>
              <circle cx={150 + R} cy="150" r="4" fill="var(--rec)" />
            </g>
          </svg>

          {/* Quad, top-down */}
          <div className="pre-drone absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="h-[62%] w-[62%] overflow-visible" aria-hidden>
              {/* arms */}
              <g stroke="var(--ink)" strokeWidth="7" strokeLinecap="round">
                <line x1="100" y1="100" x2="42" y2="42" />
                <line x1="100" y1="100" x2="158" y2="42" />
                <line x1="100" y1="100" x2="42" y2="158" />
                <line x1="100" y1="100" x2="158" y2="158" />
              </g>
              {/* props (blurred discs + spinning blades) */}
              {[
                [42, 42, 1],
                [158, 42, -1],
                [42, 158, -1],
                [158, 158, 1],
              ].map(([x, y, dir], i) => (
                <g key={i}>
                  <circle cx={x} cy={y} r="30" fill="rgb(13 15 18 / 0.05)" stroke="rgb(13 15 18 / 0.12)" strokeWidth="1" />
                  <g className={dir > 0 ? "prop-cw" : "prop-ccw"} style={{ transformOrigin: `${x}px ${y}px` }}>
                    <ellipse cx={x} cy={y} rx="28" ry="3.2" fill="rgb(13 15 18 / 0.55)" />
                    <ellipse cx={x} cy={y} rx="3.2" ry="28" fill="rgb(13 15 18 / 0.18)" />
                  </g>
                  <circle cx={x} cy={y} r="7" fill="var(--ink)" />
                  <circle cx={x} cy={y} r="2.4" fill="var(--paper)" />
                </g>
              ))}
              {/* body + stack */}
              <rect x="80" y="70" width="40" height="60" rx="12" fill="var(--ink)" />
              <rect x="88" y="84" width="24" height="30" rx="5" fill="#2a2e35" />
              {/* camera pod + REC */}
              <rect x="90" y="58" width="20" height="16" rx="5" fill="var(--ink)" />
              <circle cx="100" cy="64" r="4" fill="#2a2e35" stroke="#50555d" strokeWidth="1" />
              <circle cx="112" cy="122" r="2.6" fill="var(--rec)" className="blink" />
              {/* antennas */}
              <path d="M92 130 l-6 12 M108 130 l6 12" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Readout */}
        <div className="mt-8 text-center">
          <p className="text-[clamp(56px,8vw,96px)] leading-none tracking-[-0.06em] text-ink tabular-nums">
            {String(pct).padStart(3, "0")}
            <span className="text-ink/25">%</span>
          </p>
          <p className={`mono mt-3 text-[11px] ${phase === "load" ? "text-ink-3" : "text-rec-ink"}`}>
            {phase === "load" ? "Buffering footage" : "Armed — take off"}
          </p>
        </div>
      </div>

      {/* Checklist */}
      <ul className="mono absolute bottom-7 left-6 grid gap-1.5 text-[10px] sm:bottom-10 sm:left-10">
        {CHECKS.map((c) => {
          const ok = p >= c.at;
          return (
            <li key={c.label} className={`flex items-center gap-3 transition-colors duration-300 ${ok ? "text-ink" : "text-ink/30"}`}>
              <span className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border ${ok ? "border-ink bg-ink text-paper" : "border-ink/25"}`}>
                {ok && (
                  <svg width="7" height="6" viewBox="0 0 7 6" aria-hidden>
                    <path d="M1 3l1.8 1.8L6 1" stroke="currentColor" strokeWidth="1.2" fill="none" />
                  </svg>
                )}
              </span>
              <span className="w-[92px] whitespace-nowrap">{c.label}</span>
              <span className="hidden text-ink-3 sm:inline">{ok ? c.value : "—"}</span>
            </li>
          );
        })}
      </ul>
      <p className="mono absolute bottom-7 right-6 hidden text-[10px] text-ink-3 sm:bottom-10 sm:right-10 sm:block">{site.tagline.join(" • ")}</p>
    </div>
  );
}
