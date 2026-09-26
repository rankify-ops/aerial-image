"use client";

import { useEffect, useRef } from "react";

/*
 * Custom cursor (desktop, fine pointer only): a dot that tracks the pointer
 * exactly and a ring that trails it. The ring changes with what's underneath:
 *   link   — any a / button / switch / label: grows into a disc that inverts
 *            what's beneath it (mix-blend-mode: difference)
 *   play   — video tiles (.tile, [data-cursor="play"]): a solid ink bubble
 *            reading "Play"
 *   text   — inputs / textareas: collapses to a thin caret-like bar
 * Native cursor is hidden via html.has-cursor; touch devices never get it.
 */
type Mode = "default" | "link" | "play" | "text";

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const html = document.documentElement;
    html.classList.add("has-cursor");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let x = -100, y = -100, rx = -100, ry = -100, raf = 0, last = 0;
    let mode: Mode = "default";
    const setMode = (m: Mode) => {
      if (m === mode) return;
      mode = m;
      if (root.current) root.current.dataset.mode = m;
    };

    // Dot moves on the event itself (no frame of delay); the ring is chased in rAF.
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (root.current && root.current.dataset.hidden !== "0") {
        root.current.dataset.hidden = "0";
        rx = x;
        ry = y;
      }
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };
    const over = (e: PointerEvent) => {
      const t = e.target as Element | null;
      if (!t || !t.closest) return;
      if (t.closest('input, textarea, select, [contenteditable="true"]')) return setMode("text");
      if (t.closest('.tile, [data-cursor="play"]')) return setMode("play");
      if (t.closest('a, button, [role="switch"], [role="tab"], label, summary')) return setMode("link");
      setMode("default");
    };
    const down = () => root.current && (root.current.dataset.down = "1");
    const up = () => root.current && (root.current.dataset.down = "0");
    const leave = () => root.current && (root.current.dataset.hidden = "1");

    // Frame-rate-independent spring (~22ms time constant): tight on 60Hz and 144Hz alike.
    // Sleeps once the ring has caught up, so an idle cursor costs nothing.
    function loop(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const k = reduce ? 1 : 1 - Math.exp(-dt / 0.022);
      rx += (x - rx) * k;
      ry += (y - ry) * k;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      if (Math.abs(x - rx) < 0.1 && Math.abs(y - ry) < 0.1) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(loop);
    }

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      html.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div ref={root} className="cursor" data-mode="default" data-hidden="1" aria-hidden>
      <div ref={ring} className="cur-ring-pos">
        <div className="cur-ring">
          <span className="cur-label">Play</span>
        </div>
      </div>
      <div ref={dot} className="cur-dot-pos">
        <div className="cur-dot" />
      </div>
    </div>
  );
}
