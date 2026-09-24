"use client";

import { useEffect, useRef } from "react";

/*
 * Mirrored hairline bar chart from the reference's Analytics screen: ink bars
 * up, REC-red bars down, a dark "now" band in the middle. Heights drift
 * slowly (decorative telemetry). Written straight to CSS vars — no re-renders.
 */
export function Barcode({
  bars = 48,
  hot = [0.46, 0.56],
  className = "",
  labels,
  still = false,
}: {
  bars?: number;
  hot?: [number, number];
  className?: string;
  labels?: string[];
  still?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [h0, h1] = hot;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const cols = Array.from(el.querySelectorAll<HTMLElement>("[data-b]"));
    const set = (t: number) =>
      cols.forEach((c, i) => {
        const x = i / bars;
        // Bell-ish envelope peaking at the hot band, like the reference.
        const env = 0.35 + 0.65 * Math.exp(-Math.pow((x - (h0 + h1) / 2) / 0.22, 2));
        const up = env * (0.55 + 0.45 * Math.abs(Math.sin(x * 9 + t * 0.8)));
        const dn = env * (0.45 + 0.4 * Math.abs(Math.cos(x * 7 - t * 0.6)));
        c.style.setProperty("--u", up.toFixed(3));
        c.style.setProperty("--d", dn.toFixed(3));
      });
    set(0);
    if (still || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let last = 0;
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    const t0 = performance.now();
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible || now - last < 80) return;
      last = now;
      set((now - t0) / 1000);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [bars, h0, h1, still]);

  return (
    <div className={`flex flex-col ${className}`} aria-hidden>
      <div ref={ref} className="flex min-h-0 flex-1 items-stretch gap-[1.5px]">
        {Array.from({ length: bars }, (_, i) => {
          const on = i / bars >= hot[0] && i / bars <= hot[1];
          return (
            <div key={i} data-b className="flex flex-1 flex-col" style={{ "--u": 0.4, "--d": 0.3 } as React.CSSProperties}>
              <span className="flex h-1/2 items-end pb-[1.5px]">
                <span className={`w-full ${on ? "bg-ink" : "bg-ink/[0.14]"}`} style={{ height: "calc(var(--u) * 100%)", transition: "height .3s linear" }} />
              </span>
              <span className="flex h-1/2 items-start pt-[1.5px]">
                <span className={`w-full ${on ? "bg-rec/85" : "bg-rec/[0.14]"}`} style={{ height: "calc(var(--d) * 100%)", transition: "height .3s linear" }} />
              </span>
            </div>
          );
        })}
      </div>
      {labels && (
        <div className="mono mt-1.5 flex shrink-0 justify-between text-[7.5px] text-ink-3">
          {labels.map((l, i) => (
            <span key={l} className={i === Math.floor(labels.length / 2) ? "text-ink" : ""}>
              {l}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
