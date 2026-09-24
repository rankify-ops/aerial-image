"use client";

import { useEffect, useRef, useState } from "react";
import { projects, site } from "@/content/site";
import { asset } from "@/lib/basePath";
import { Play } from "../ui";
import { openVideo } from "../VideoModal";

/*
 * Recent Projects as the reference's "Transactions" list: round thumbnail,
 * title, category, and the film's running time where the amount would sit.
 * Filter chips work. On desktop a preview clip follows the pointer over the
 * list (one <video>, src swapped per row).
 */
// Running times of the YouTube films (ffprobe on the downloaded masters).
const RUNTIME: Record<string, string> = {
  y08uG9t57uo: "2:08",
  H4qmCY8Zn8I: "1:32",
  "4PbgFEQxals": "1:40",
  "8m8P0btFU2c": "2:23",
  yanTU9G9Gus: "1:24",
  "l8oCeA8U-48": "1:41",
  "0e9DGg650N4": "1:00",
};

export function Ledger() {
  const cats = ["All", ...Array.from(new Set(projects.map((p) => p.client)))];
  const [cat, setCat] = useState("All");
  const [hover, setHover] = useState<string | null>(null);
  const list = projects.filter((p) => cat === "All" || p.client === cat);
  const box = useRef<HTMLDivElement>(null);
  const float = useRef<HTMLDivElement>(null);
  const vid = useRef<HTMLVideoElement>(null);

  // Pointer-follow preview (desktop, fine pointers only).
  useEffect(() => {
    const b = box.current;
    const f = float.current;
    if (!b || !f || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let x = 0, y = 0, tx = 0, ty = 0, raf = 0;
    const move = (e: PointerEvent) => {
      const r = b.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
    };
    const loop = () => {
      x += (tx - x) * 0.14;
      y += (ty - y) * 0.14;
      f.style.transform = `translate3d(${x + 28}px, ${y - 90}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    b.addEventListener("pointermove", move);
    raf = requestAnimationFrame(loop);
    return () => {
      b.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const v = vid.current;
    if (!v) return;
    const p = projects.find((q) => q.id === hover);
    if (!p) {
      v.pause();
      return;
    }
    v.src = asset(`/video/${p.slug}.mp4`);
    v.play().catch(() => {});
  }, [hover]);

  return (
    <section id="work" className="relative py-28 sm:py-36">
      <div className="wrap grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="mono flex items-center gap-4 text-ink-3">
            <span className="text-rec">04</span>
            <span className="h-px w-10 bg-rule-2" />
            Recent Projects
          </p>
          <h2 className="serif mt-8 text-[clamp(44px,5.4vw,88px)] leading-[0.95] tracking-[-0.02em] text-ink">
            Recent <em className="text-ink/45">Projects</em>
          </h2>
          <p className="mt-6 max-w-[360px] text-[15px] leading-relaxed text-ink-2">
            Every project is carefully planned and captured to ensure the final deliverables are captivating and on point.
          </p>
          <div className="mt-10 hidden lg:block">
            <p className="text-[12px] text-ink-3">Total runtime</p>
            <p className="serif text-[64px] leading-none text-ink">
              11<span className="text-ink/25">:48</span>
            </p>
          </div>
        </div>

        <div ref={box} className="relative min-w-0 lg:col-span-8" onPointerLeave={() => setHover(null)}>
          <div className="nglass rounded-[30px] p-4 sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <p className="serif text-[26px] leading-none text-ink">Projects</p>
              <div className="flex items-center gap-2">
                <span className="norb hidden h-10 w-10 items-center justify-center text-ink sm:flex" aria-hidden>
                  <svg width="13" height="13" viewBox="0 0 14 14"><circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3" fill="none" /><path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1.3" /></svg>
                </span>
                <button type="button" onClick={() => openVideo(site.showreel, "2024 Showreel")} className="npill mono h-10 px-4 text-[9.5px] text-ink">
                  <Play size={8} /> Showreel
                </button>
              </div>
            </div>

            <div className="no-scrollbar -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
              {cats.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCat(c)}
                  aria-pressed={cat === c}
                  className={`npill mono h-9 shrink-0 px-4 text-[9.5px] transition-colors ${cat === c ? "npill-ink" : "text-ink-2"}`}
                >
                  {c}
                </button>
              ))}
            </div>

            <p className="mono mt-7 text-[9.5px] text-ink-3">Latest</p>
            <ul className="mt-2 divide-y divide-ink/[0.06]">
              {list.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => openVideo(p.id, p.title)}
                    onPointerEnter={() => setHover(p.id)}
                    className="group flex w-full items-center gap-4 py-4 text-left sm:gap-5"
                  >
                    <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full shadow-[0_6px_14px_-6px_rgb(13_15_18/0.5)] sm:h-14 sm:w-14">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={asset(`/video/${p.slug}.jpg`)} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="serif block truncate text-[19px] leading-tight text-ink sm:text-[24px]">{p.title}</span>
                      <span className="mono mt-1 block text-[9.5px] text-ink-3">
                        {p.client} <span className="text-ink/20">·</span> Film
                      </span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="serif block text-[20px] leading-none text-ink sm:text-[24px]">{RUNTIME[p.id]}</span>
                      <span className="mono mt-1 flex items-center justify-end gap-1 text-[9px] text-rec-ink">
                        <Play size={7} /> Play
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Pointer-follow preview */}
          <div
            ref={float}
            aria-hidden
            className={`pointer-events-none absolute left-0 top-0 z-20 hidden w-[280px] overflow-hidden rounded-[20px] bg-ink shadow-[0_30px_60px_-20px_rgb(13_15_18/0.6)] transition-[opacity,scale] duration-300 lg:block ${
              hover ? "scale-100 opacity-100" : "scale-90 opacity-0"
            }`}
          >
            <video ref={vid} muted loop playsInline className="aspect-video w-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
