"use client";

import { useEffect, useRef } from "react";

/*
 * Liquid ink for the Creative | Commercial bar. The ink is an SVG path whose
 * left and right edges each ride their own spring: the edge in the direction
 * of travel is stiffer and surges ahead, the trailing edge lags, so the body
 * stretches as it pours across and snaps back. Each edge bows into an S-curve
 * in proportion to its velocity (the slosh), and the springs are slightly
 * under-damped so it wobbles to rest. At rest the edges keep the bar's
 * slanted "interlock" tilt.
 *
 * Coordinates are a 1000 × 100 viewBox stretched to the bar (preserveAspectRatio none).
 */
const TILT = 34; // top vs bottom offset of an edge at rest, the slant
const REST: Record<number, [number, number]> = { 0: [-80, 500], 1: [500, 1080] };

type Spring = { x: number; v: number };

export function LiquidInk({ on }: { on: number }) {
  const path = useRef<SVGPathElement>(null);
  const state = useRef<{ L: Spring; R: Spring; target: [number, number]; dir: number } | null>(null);
  const raf = useRef(0);

  const draw = () => {
    const s = state.current;
    const p = path.current;
    if (!s || !p) return;
    const { L, R } = s;
    // Bulge: velocity → how far the middle of each edge bows (clamped).
    const bow = (v: number) => Math.max(-140, Math.min(140, v * 0.09));
    const bL = bow(L.v);
    const bR = bow(R.v);
    const t = TILT / 2;
    // Right edge: top leans right, bottom left (the slant); S-curve from bow.
    const d = [
      `M ${L.x + t} 0`,
      `L ${R.x + t} 0`,
      `C ${R.x + t + bR} 30, ${R.x - t + bR * 0.55} 70, ${R.x - t} 100`,
      `L ${L.x - t} 100`,
      `C ${L.x - t + bL * 0.55} 70, ${L.x + t + bL} 30, ${L.x + t} 0`,
      "Z",
    ].join(" ");
    p.setAttribute("d", d);
  };

  // First paint at rest.
  useEffect(() => {
    const [l, r] = REST[on];
    state.current = { L: { x: l, v: 0 }, R: { x: r, v: 0 }, target: [l, r], dir: 0 };
    draw();
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pour to the new side whenever `on` changes.
  useEffect(() => {
    const s = state.current;
    if (!s) return;
    const target = REST[on];
    if (s.target[0] === target[0]) return;
    s.dir = target[0] > s.target[0] ? 1 : -1;
    s.target = target;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      s.L = { x: target[0], v: 0 };
      s.R = { x: target[1], v: 0 };
      draw();
      return;
    }

    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      // Leading edge (in travel direction) is stiffer: it surges; trailing edge lags.
      const lead = s.dir > 0 ? s.R : s.L;
      const trail = s.dir > 0 ? s.L : s.R;
      const leadT = s.dir > 0 ? s.target[1] : s.target[0];
      const trailT = s.dir > 0 ? s.target[0] : s.target[1];
      const spring = (sp: Spring, to: number, k: number, c: number) => {
        const a = k * (to - sp.x) - c * sp.v;
        sp.v += a * dt;
        sp.x += sp.v * dt;
      };
      spring(lead, leadT, 150, 13); // lively front, ~0.6s pour
      spring(trail, trailT, 70, 10); // heavier tail that drags and sloshes
      draw();
      const settled = [s.L, s.R].every((sp, i) => Math.abs(sp.v) < 2 && Math.abs(sp.x - s.target[i]) < 0.6);
      if (settled) {
        s.L.x = s.target[0];
        s.R.x = s.target[1];
        s.L.v = s.R.v = 0;
        draw();
        return;
      }
      raf.current = requestAnimationFrame(step);
    };
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(step);
  }, [on]);

  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" style={{ zIndex: -1 }} viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden>
      <path ref={path} fill="var(--ink)" />
    </svg>
  );
}
