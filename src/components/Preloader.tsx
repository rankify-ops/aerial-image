"use client";

import { useEffect, useRef, useState } from "react";
import { aheadOf } from "./ui";

/*
 * Minimal loader, shown until the hero footage has buffered enough to play:
 * two squares on the plain ground — an ink outline and a small REC-red solid —
 * turning against each other in crisp 90° ticks, with a tiny % underneath
 * that tracks how much of the hero <video> has buffered (target ~3s, or
 * readyState 4). Exit: squares defocus, dip to black, dissolve onto the page.
 * (Tom rejected a quad, a prop, a full-screen photo and an aperture — keep it small + abstract.)
 *
 * Server-rendered visible (no flash of the page first), hidden for no-JS via
 * the .js class, never holds the page longer than MAX_MS.
 */
const MIN_MS = 1600;
const MAX_MS = 7000; // normal ceiling for the counter…
const HARD_MS = 11000; // …but never reveal a frozen hero before this (head-script failsafe is 15s)
const TARGET_S = 3;
export function Preloader() {
  const [p, setP] = useState(0);
  const [phase, setPhase] = useState<"load" | "armed" | "exit" | "reveal" | "gone">("load");
  const shown = useRef(0);

  useEffect(() => {
    const t0 = performance.now();
    document.documentElement.classList.add("preloading");
    let raf = 0;
    let done = false;
    let last = t0;

    const video = () => document.querySelector<HTMLVideoElement>("#top video");
    // Autoplay can be refused (iOS Low Power Mode). Then the poster is what
    // the page shows, and there's nothing worth waiting for.
    let blocked = false;
    video()
      ?.play()
      .catch((e: Error) => {
        if (e.name === "NotAllowedError") blocked = true;
      });
    // "Ready" = actually playing, with at least 2.5s more already downloaded
    // (or the whole file) — so the page never reveals onto a stall.
    const ready = () => {
      const v = video();
      if (!v || blocked) return true;
      if (v.paused || v.readyState < 3) return false;
      const end = aheadOf(v, v.currentTime);
      return end - v.currentTime >= 2.5 || (Number.isFinite(v.duration) && end >= v.duration - 0.25);
    };
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

    // Time-based, not per-frame: a busy machine dropping frames (decoding
    // 1080p while hydrating) must not slow the counter down.
    const tick = (now: number) => {
      const elapsed = now - t0;
      const dt = Math.min(0.25, (now - last) / 1000);
      last = now;
      const real = target();
      const floor = Math.min(0.9, elapsed / MAX_MS);
      const ok = ready() || elapsed >= HARD_MS;
      const goal = !ok ? Math.min(0.97, Math.max(real, floor)) : elapsed >= MAX_MS ? 1 : Math.max(real, floor);
      shown.current += Math.min(dt * 1.8, (goal - shown.current) * (1 - Math.exp(-dt / 0.16)));
      if (goal >= 1 && shown.current > 0.985) shown.current = 1;
      if (ok && elapsed >= MAX_MS + 400) shown.current = 1;
      setP(shown.current);

      if (!done && shown.current >= 1 && elapsed >= MIN_MS && ok) {
        done = true;
        // Tells heroVideo() to stop measuring/switching: the reveal is committed.
        document.documentElement.classList.add("pre-done");
        // done 600ms → squares defocus + dip to black 1000ms → reveal 900ms.
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

  return (
    <div className={`preloader ${phase === "exit" ? "is-exit" : ""} ${phase === "reveal" ? "is-reveal" : ""}`} role="status" aria-live="polite" aria-label={`Loading ${pct}%`}>
      <div className="pre-stage-wrap absolute inset-0 flex flex-col items-center justify-center">
        <div className="pre-drone relative h-[44px] w-[44px]" aria-hidden>
          <span className="sq sq-a" />
          <span className="sq sq-b" />
        </div>
        <p className="pre-readout mono mt-7 text-[10.5px] text-ink-3 tabular-nums">{String(pct).padStart(3, "0")}%</p>
      </div>
      <div className="pre-black" aria-hidden />
    </div>
  );
}
