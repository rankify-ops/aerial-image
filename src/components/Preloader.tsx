"use client";

import { useEffect, useRef, useState } from "react";
import { licences, site } from "@/content/site";
import { Mark } from "./v2/Phone";

/*
 * Pre-flight spin-up, shown until the hero footage has buffered enough to
 * play. A single FPV tri-blade prop is the throttle gauge: its speed, the
 * gimbal ring and the % all track how many seconds of the hero <video> are
 * buffered (target ~3s, or readyState 4). At speed the blades smear into a
 * motion-blur disc (ghost blades + disc fade in as RPM climbs, which also
 * hides wagon-wheel aliasing). RPM and the checklist are decorative.
 * Exit: full throttle → the spinning disc rushes the lens, cut to black, the
 * black dissolves onto the page.
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
  { at: 0.8, label: "Motors", value: "Armed" },
];

export function Preloader() {
  const [p, setP] = useState(0);
  const [phase, setPhase] = useState<"load" | "armed" | "exit" | "reveal" | "gone">("load");
  const shown = useRef(0);
  const phaseRef = useRef(phase);
  const blades = useRef<SVGGElement>(null);
  const ghosts = useRef<SVGGElement>(null);
  const disc = useRef<SVGCircleElement>(null);
  const rpm = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  // Prop spin loop — runs until unmount, speed follows the displayed progress.
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let angle = 0;
    let omega = 0.5; // rev/s, eased toward target
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const target = phaseRef.current === "load" ? 0.6 + 22 * Math.pow(shown.current, 1.7) : 32;
      omega += (target - omega) * Math.min(1, dt * 3);
      angle = (angle + omega * 360 * dt) % 360;
      const sf = Math.min(1, Math.max(0, (omega - 3) / 16)); // 0 = crisp blades, 1 = full blur
      if (blades.current) {
        blades.current.setAttribute("transform", `rotate(${reduce ? 0 : angle} 100 100)`);
        blades.current.style.opacity = String(1 - 0.6 * sf);
      }
      if (ghosts.current) {
        const kids = ghosts.current.children;
        for (let i = 0; i < kids.length; i++) {
          const g = kids[i] as SVGGElement;
          g.setAttribute("transform", `rotate(${angle - (i + 1) * (6 + 16 * sf)} 100 100)`);
          g.style.opacity = String((0.34 - i * 0.07) * sf);
        }
      }
      if (disc.current) disc.current.style.opacity = String(0.15 + 0.85 * sf);
      if (rpm.current) rpm.current.textContent = Math.round(1200 + omega * 60 * 16).toLocaleString("en-AU");
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

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
        // armed 520ms → fly-through 1150ms (black lands at ~0.95s) → reveal 900ms.
        setTimeout(() => setPhase("exit"), 520);
        setTimeout(() => {
          setPhase("reveal");
          document.documentElement.classList.remove("preloading");
        }, 520 + 1150);
        setTimeout(() => setPhase("gone"), 520 + 1150 + 900);
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
    <div className={`preloader ${phase === "exit" ? "is-exit" : ""} ${phase === "reveal" ? "is-reveal" : ""}`} role="status" aria-live="polite" aria-label={`Loading ${pct}%`}>
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
          Aerial Image <span className="text-ink-3">— Spin-up</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="rec-dot blink" /> {phase === "load" ? "Standby" : "Rec"}
        </span>
      </div>

      {/* Stage */}
      <div className="pre-stage-wrap absolute inset-0 flex flex-col items-center justify-center">
        <div className="pre-stage relative h-[300px] w-[300px] sm:h-[340px] sm:w-[340px]" style={{ perspective: "900px" }}>
          {/* Gimbal ring: ticks rotate slowly, arc = buffer progress */}
          <svg viewBox="0 0 300 300" className="pre-ring absolute inset-0 h-full w-full" aria-hidden>
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

          {/* FPV tri-blade prop, top-down */}
          <div className="pre-drone absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="h-[74%] w-[74%] overflow-visible" aria-hidden>
              <defs>
                <radialGradient id="propDisc" cx="50%" cy="50%" r="50%">
                  <stop offset="0.12" stopColor="rgb(13 15 18)" stopOpacity="0.06" />
                  <stop offset="0.8" stopColor="rgb(13 15 18)" stopOpacity="0.16" />
                  <stop offset="0.96" stopColor="rgb(13 15 18)" stopOpacity="0.28" />
                  <stop offset="1" stopColor="rgb(13 15 18)" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="propBlade" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0" stopColor="#0d0f12" />
                  <stop offset="1" stopColor="#3a3f47" />
                </linearGradient>
              </defs>
              {/* Motion-blur disc + tip ring */}
              <circle ref={disc} cx="100" cy="100" r="95" fill="url(#propDisc)" style={{ opacity: 0.15 }} />
              <circle cx="100" cy="100" r="95" fill="none" stroke="rgb(13 15 18 / 0.1)" strokeDasharray="2 5" />
              {/* Ghost blades (trail) */}
              <g ref={ghosts}>
                {[0, 1, 2].map((k) => (
                  <g key={k} style={{ opacity: 0 }}>
                    {[0, 120, 240].map((r) => (
                      <path key={r} d="M100 100 C 111 82, 119 46, 108 12 C 105 4, 97 4, 95 11 C 91 38, 92 76, 100 100 Z" fill="#0d0f12" transform={`rotate(${r} 100 100)`} />
                    ))}
                  </g>
                ))}
              </g>
              {/* Blades */}
              <g ref={blades}>
                {[0, 120, 240].map((r) => (
                  <g key={r} transform={`rotate(${r} 100 100)`}>
                    <path d="M100 100 C 111 82, 119 46, 108 12 C 105 4, 97 4, 95 11 C 91 38, 92 76, 100 100 Z" fill="url(#propBlade)" />
                    <path d="M100 96 C 104 74, 106 44, 103 18" stroke="rgb(255 255 255 / 0.18)" strokeWidth="1.2" fill="none" />
                  </g>
                ))}
              </g>
              {/* Hub, bell and prop nut */}
              <circle cx="100" cy="100" r="17" fill="#0d0f12" />
              <circle cx="100" cy="100" r="12" fill="#2a2e35" />
              <polygon points="100,91.5 107.4,95.8 107.4,104.2 100,108.5 92.6,104.2 92.6,95.8" fill="#50555d" />
              <circle cx="100" cy="100" r="3" fill="var(--rec)" />
            </svg>
          </div>
        </div>

        {/* Readout */}
        <div className="pre-readout mt-8 text-center">
          <p className="text-[clamp(56px,8vw,96px)] leading-none tracking-[-0.06em] text-ink tabular-nums">
            {String(pct).padStart(3, "0")}
            <span className="text-ink/25">%</span>
          </p>
          <p className="mono mt-3 text-[11px] text-ink-3 tabular-nums">
            RPM <span ref={rpm} className="text-ink">1,200</span>
            <span className="mx-2 text-ink/20">·</span>
            <span className={phase === "load" ? "" : "text-rec-ink"}>{phase === "load" ? "Spooling up" : "Full throttle"}</span>
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
      <div className="pre-black" aria-hidden />
      <p className="mono absolute bottom-7 right-6 hidden text-[10px] text-ink-3 sm:bottom-10 sm:right-10 sm:block">{site.tagline.join(" • ")}</p>
    </div>
  );
}
