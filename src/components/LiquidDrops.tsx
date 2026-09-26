"use client";

import { useEffect, useId, useRef } from "react";

/*
 * Liquid ink with droplets for the Creative | Commercial bar (v2 of the pour —
 * v1 is LiquidInk.tsx, tagged services-liquid-v1).
 *
 * Same spring-driven body as v1 (each edge on its own spring, edges bow with
 * velocity), plus droplets, all rendered through a "goo" filter (blur + alpha
 * threshold) so shapes that touch fuse like surface tension:
 *   - tail: as the trailing edge pulls away, 2–3 droplets cling behind on weak
 *     springs — the neck stretches, snaps, and each drop is reeled back in
 *     until it merges with the body again;
 *   - front: the leading edge flicks one small splash ahead that falls back.
 *
 * Drawn in real pixels (ResizeObserver) so the drops stay round.
 */
const TILT = 0.034; // edge slant as a fraction of width
const REST: Record<number, [number, number]> = { 0: [-0.08, 0.5], 1: [0.5, 1.08] };

type Spring = { x: number; v: number };
type Drop = { x: number; y: number; vx: number; vy: number; r: number; k: number; age: number; anchor: "trail" | "lead"; dy: number };

export function LiquidDrops({ on }: { on: number }) {
  const uid = useId().replace(/:/g, "");
  const svg = useRef<SVGSVGElement>(null);
  const body = useRef<SVGPathElement>(null);
  const dropsG = useRef<SVGGElement>(null);
  const size = useRef({ w: 1000, h: 140 });
  const st = useRef<{ L: Spring; R: Spring; target: [number, number]; dir: number; drops: Drop[]; tailFrom: number; spawned: boolean } | null>(null);
  const raf = useRef(0);

  const draw = () => {
    const s = st.current;
    const p = body.current;
    const g = dropsG.current;
    if (!s || !p || !g) return;
    const { w, h } = size.current;
    const X = (u: number) => u * w;
    const bow = (v: number) => Math.max(-0.14, Math.min(0.14, v * 0.09)) * w;
    const t = (TILT / 2) * w;
    const L = X(s.L.x), R = X(s.R.x);
    const bL = bow(s.L.v), bR = bow(s.R.v);
    // Body extends 40px above/below the bar so the goo threshold never erodes the top/bottom.
    p.setAttribute(
      "d",
      [
        `M ${L + t} -40 L ${R + t} -40 L ${R + t} 0`,
        `C ${R + t + bR} ${h * 0.3}, ${R - t + bR * 0.55} ${h * 0.7}, ${R - t} ${h}`,
        `L ${R - t} ${h + 40} L ${L - t} ${h + 40} L ${L - t} ${h}`,
        `C ${L - t + bL * 0.55} ${h * 0.7}, ${L + t + bL} ${h * 0.3}, ${L + t} 0 Z`,
      ].join(" "),
    );
    // Sync circles.
    while (g.childNodes.length < s.drops.length) g.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "circle"));
    while (g.childNodes.length > s.drops.length) g.removeChild(g.lastChild as Node);
    s.drops.forEach((d, i) => {
      const c = g.childNodes[i] as SVGCircleElement;
      c.setAttribute("cx", d.x.toFixed(1));
      c.setAttribute("cy", d.y.toFixed(1));
      c.setAttribute("r", Math.max(0, d.r).toFixed(1));
    });
  };

  // Track the bar's pixel size.
  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      size.current = { w: e.contentRect.width, h: e.contentRect.height };
      el.setAttribute("viewBox", `0 0 ${size.current.w} ${size.current.h}`);
      draw();
    });
    ro.observe(el);
    const [l, r] = REST[on];
    st.current = { L: { x: l, v: 0 }, R: { x: r, v: 0 }, target: [l, r], dir: 0, drops: [], tailFrom: l, spawned: true };
    draw();
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const s = st.current;
    if (!s) return;
    const target = REST[on];
    if (s.target[0] === target[0]) return;
    s.dir = target[0] > s.target[0] ? 1 : -1;
    s.target = target;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      s.L = { x: target[0], v: 0 };
      s.R = { x: target[1], v: 0 };
      s.drops = [];
      draw();
      return;
    }

    // The tail (visible edge sweeping toward the middle) sheds drops mid-sweep — see step().
    s.tailFrom = s.dir > 0 ? s.L.x : s.R.x;
    s.spawned = false;
    // Front: the edge leaving the middle flicks one small splash ahead.
    {
      const { w, h } = size.current;
      const leadX = (s.dir > 0 ? s.R.x : s.L.x) * w;
      s.drops.push({ x: leadX, y: h * (0.4 + Math.random() * 0.2), vx: s.dir * w * 0.55, vy: -h * 0.4, r: h * 0.09, k: 38, age: 0, anchor: "lead", dy: h * 0.5 });
    }

    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      const lead = s.dir > 0 ? s.R : s.L;
      const trail = s.dir > 0 ? s.L : s.R;
      const leadT = s.dir > 0 ? s.target[1] : s.target[0];
      const trailT = s.dir > 0 ? s.target[0] : s.target[1];
      const spring = (sp: Spring, to: number, k: number, c: number) => {
        sp.v += (k * (to - sp.x) - c * sp.v) * dt;
        sp.x += sp.v * dt;
      };
      spring(lead, leadT, 150, 13);
      spring(trail, trailT, 70, 10);

      // Tail sheds 2–3 drops at ~55% of its sweep (edge decelerating): born on the edge, moving slower than it,
      // so the goo neck stretches and snaps, then they're reeled back in and merge.
      if (!s.spawned) {
        const from = s.tailFrom, to = trailT;
        const prog = (trail.x - from) / (to - from || 1);
        if (prog > 0.55) {
          s.spawned = true;
          const { h } = size.current;
          const n = 2 + Math.round(Math.random());
          for (let i = 0; i < n; i++) {
            const dy = h * (0.3 + Math.random() * 0.4);
            s.drops.push({
              x: trail.x * size.current.w - s.dir * 6,
              y: dy,
              vx: trail.v * size.current.w * (0.5 + Math.random() * 0.2),
              vy: (Math.random() - 0.5) * h * 0.6,
              r: h * (0.12 + Math.random() * 0.07),
              k: 7 + Math.random() * 5,
              age: -i * 0.05,
              anchor: "trail",
              dy,
            });
          }
        }
      }

      // Droplets: reeled toward their edge on a weak spring (so they lag, the neck
      // stretches and snaps), drift vertically back to mid-height, and shrink as they re-merge.
      const { w: W } = size.current;
      const tx = (s.dir > 0 ? s.L.x : s.R.x) * W; // trailing edge px
      const lx = (s.dir > 0 ? s.R.x : s.L.x) * W; // leading edge px
      s.drops = s.drops.filter((d) => {
        d.age += dt;
        if (d.age < 0) return true; // staggered release
        const anchor = d.anchor === "trail" ? tx + s.dir * 44 : lx - s.dir * 30; // park well inside the body so nothing bumps the surface
        const kx = d.anchor === "trail" ? d.k * (d.age > 0.35 ? 2.2 : 1) : d.k;
        d.vx += (kx * (anchor - d.x) - 4.5 * d.vx) * dt;
        d.vy += (6 * (d.dy - d.y) - 4 * d.vy) * dt;
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        if (d.age > 0.4) d.r -= size.current.h * 0.22 * dt;
        return d.r > 0.5 && d.age < 1.6;
      });

      draw();
      const settled =
        s.drops.length === 0 && [s.L, s.R].every((sp, i) => Math.abs(sp.v) < 0.002 && Math.abs(sp.x - s.target[i]) < 0.0006);
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
    <svg ref={svg} className="pointer-events-none absolute inset-0 h-full w-full" style={{ zIndex: -1 }} aria-hidden>
      <defs>
        <filter id={`goo-${uid}`} x="-10%" y="-60%" width="120%" height="220%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="b" />
          <feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10" />
        </filter>
      </defs>
      <g filter={`url(#goo-${uid})`} fill="var(--ink)">
        <path ref={body} />
        <g ref={dropsG} />
      </g>
    </svg>
  );
}
