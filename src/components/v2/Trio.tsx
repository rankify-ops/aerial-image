"use client";

import { useEffect, useRef } from "react";
import { projects, clients, site } from "@/content/site";
import { asset } from "@/lib/basePath";
import { Loop, Play } from "../ui";
import { openVideo } from "../VideoModal";
import { Barcode } from "./Barcode";
import { Mark, Phone } from "./Phone";

/*
 * Slide 1 of the reference: a giant faded title with three phone screens
 * standing in front of it, mono labels in the corners. Here the "app" is
 * Aerial Image — onboarding (FPV), home (projects + clients), telemetry.
 * Side phones rise at a different rate on scroll for depth.
 */
export function Trio() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const p = (window.innerHeight - r.top) / (window.innerHeight + r.height); // 0 → 1 through the viewport
      el.style.setProperty("--t", Math.min(1, Math.max(0, p)).toFixed(4));
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", on, { passive: true });
    return () => {
      window.removeEventListener("scroll", on);
      cancelAnimationFrame(raf);
    };
  }, []);

  const list = projects.slice(0, 4);

  return (
    <section ref={root} id="fpv" className="relative overflow-hidden pb-10 pt-24 sm:pt-32" style={{ "--t": 0.5 } as React.CSSProperties}>
      <div className="wrap relative">
        <div className="mono flex justify-between text-[10.5px] text-ink-3">
          <span>
            <span className="text-ink">FPV</span> Video / Piloting
          </span>
          <span>
            Aerial <span className="text-ink">Image</span>
          </span>
        </div>

        {/* Giant faded title behind the phones */}
        <p
          aria-hidden
          className="pointer-events-none mt-10 select-none whitespace-nowrap text-center text-[clamp(44px,9.4vw,180px)] font-medium leading-[0.8] tracking-[-0.06em] text-transparent"
          style={{
            backgroundImage: "linear-gradient(180deg, rgb(13 15 18 / 0.2), rgb(13 15 18 / 0) 78%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            transform: "translateY(calc((var(--t) - 0.5) * 80px))",
          }}
        >
          FPV Cinematic
        </p>

        <div className="relative -mt-[4.5vw] flex items-start justify-center gap-4 sm:gap-8 lg:-mt-[3.5vw] lg:gap-14">
          {/* 1 — onboarding */}
          <Phone
            className="hidden w-[250px] md:block lg:w-[290px]"
            style={{ transform: "translateY(calc(90px + (0.5 - var(--t)) * 140px))" }}
          >
            <div className="absolute inset-0">
              <div className="absolute inset-x-0 top-0 h-[58%] overflow-hidden">
                <Loop slug="fpv-coast" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-[#ecebe7]" />
              </div>
              <div className="absolute inset-x-0 top-[40px] flex items-center justify-between px-[8%]">
                <Mark className="h-4 w-5 bg-white" />
                <span className="flex gap-1">
                  <i className="h-[3px] w-4 rounded-full bg-white" />
                  <i className="h-[3px] w-4 rounded-full bg-white/40" />
                  <i className="h-[3px] w-4 rounded-full bg-white/40" />
                </span>
                <span className="mono text-[8px] text-white">Skip</span>
              </div>
              <div className="absolute inset-x-0 bottom-0 flex h-[46%] flex-col items-center px-[9%] pb-9 text-center">
                <p className="serif text-[23px] leading-[1.05] text-ink">
                  FPV Cinematic
                  <br />
                  <em>Media</em>
                </p>
                <p className="mt-2 text-[9.5px] leading-snug text-ink-2">
                  this style of immersive and captivating content brings a whole new perspective to your project.
                </p>
                <div className="mt-auto grid w-full gap-1.5">
                  <button type="button" onClick={() => openVideo(site.showreel, "2024 Showreel")} className="mono flex h-9 items-center justify-center gap-2 rounded-full bg-ink text-[8.5px] text-paper">
                    <Play size={8} /> Watch Showreel
                  </button>
                  <a href="#contact" className="npill mono h-9 justify-center text-[8.5px] text-ink">
                    Enquiries
                  </a>
                </div>
              </div>
            </div>
          </Phone>

          {/* 2 — home */}
          <Phone className="relative z-10 w-[280px] sm:w-[300px] lg:w-[330px]">
            <div className="absolute inset-0 overflow-hidden px-[6%] pt-[42px]">
              <div className="flex items-center justify-between">
                <span className="norb flex h-8 w-8 items-center justify-center">
                  <Mark className="h-3.5 w-4 bg-ink" />
                </span>
                <span className="mono text-[9px] tracking-[0.3em] text-ink">AERIAL IMAGE</span>
                <span className="norb flex h-8 w-8 items-center justify-center">
                  <span className="rec-dot blink" />
                </span>
              </div>

              <div className="mt-4 text-center">
                <span className="npill mono mx-auto h-6 text-[7.5px] text-ink-2">CASA · ReOC · RePL ▾</span>
                <p className="mt-3 text-[10px] text-ink-3">Recent Projects</p>
                <p className="serif text-[40px] leading-none text-ink">
                  {String(projects.length).padStart(2, "0")}
                  <span className="text-ink/25">.00</span>
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="nglass rounded-[16px] p-2.5">
                  <p className="text-[9px] text-ink">Flight profile</p>
                  <Barcode bars={22} hot={[0.42, 0.58]} className="mt-2 h-[58px]" />
                </div>
                <div className="nglass rounded-[16px] p-2.5">
                  <p className="text-[9px] text-ink">Worked with</p>
                  <div className="mt-2 grid grid-cols-3 gap-1.5">
                    {clients.slice(0, 6).map((c) => (
                      <span key={c.src} className="norb flex aspect-square items-center justify-center overflow-hidden p-1.5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={asset(`/img/logos/${c.src}.png`)} alt={c.alt} className="max-h-full max-w-full object-contain grayscale" loading="lazy" />
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="nglass mt-2 rounded-[16px] p-2.5">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-ink">Recent Projects</p>
                  <span className="npill mono h-5 px-2 text-[7px] text-ink-2">View All</span>
                </div>
                <p className="mono mt-1.5 text-[7px] text-ink-3">Latest</p>
                <ul className="mt-1">
                  {list.map((p) => (
                    <li key={p.id}>
                      <button type="button" onClick={() => openVideo(p.id, p.title)} className="flex w-full items-center gap-2 py-1.5 text-left">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={asset(`/video/${p.slug}.jpg`)} alt="" className="h-6 w-6 rounded-full object-cover" loading="lazy" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[9px] text-ink">{p.title}</span>
                          <span className="mono block text-[6.5px] text-ink-3">{p.client}</span>
                        </span>
                        <span className="text-[9px] text-ink">▶</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="nglass absolute inset-x-[6%] bottom-4 flex items-center justify-between rounded-full p-1">
                <button type="button" onClick={() => openVideo(site.showreel, "2024 Showreel")} className="npill mono h-7 text-[7.5px] text-ink">
                  <Play size={7} /> Reel
                </button>
                <span className="norb flex h-7 w-7 items-center justify-center text-ink">
                  <svg width="9" height="9" viewBox="0 0 14 14" aria-hidden>
                    <circle cx="3.5" cy="3.5" r="2.5" fill="currentColor" />
                    <circle cx="10.5" cy="3.5" r="2.5" fill="currentColor" />
                    <circle cx="3.5" cy="10.5" r="2.5" fill="currentColor" />
                    <circle cx="10.5" cy="10.5" r="2.5" fill="currentColor" />
                  </svg>
                </span>
                <a href="#contact" className="npill mono h-7 text-[7.5px] text-ink">
                  Enquire →
                </a>
              </div>
            </div>
          </Phone>

          {/* 3 — telemetry */}
          <Phone
            className="hidden w-[250px] md:block lg:w-[290px]"
            style={{ transform: "translateY(calc(90px + (0.5 - var(--t)) * 100px))" }}
          >
            <div className="absolute inset-0 px-[7%] pt-[42px]">
              <div className="flex items-center justify-between">
                <span className="norb flex h-7 w-7 items-center justify-center">
                  <Mark className="h-3 w-3.5 bg-ink" />
                </span>
                <span className="serif text-[15px] text-ink">Live flight</span>
                <span className="norb h-7 w-7" />
              </div>
              <div className="mt-3 text-center">
                <span className="npill mono mx-auto h-5 px-2 text-[7px] text-ink-2">FPV · CH 01 ▾</span>
                <p className="mt-2 text-[9px] text-ink-3">Altitude</p>
                <p className="serif text-[28px] leading-none text-ink">
                  018<span className="text-ink/25">m</span>
                </p>
              </div>
              <Barcode bars={40} className="mt-3 h-[165px]" labels={["0s", "10s", "20s", "Now", "40s", "50s", "60s"]} />
              <div className="mt-2 text-center">
                <p className="text-[9px] text-ink-3">Speed</p>
                <p className="serif text-[28px] leading-none text-ink">
                  062<span className="text-ink/25">km/h</span>
                </p>
              </div>
              <div className="nglass absolute inset-x-[7%] bottom-5 rounded-[14px] p-2.5">
                <p className="text-[9px] text-ink">{projects[4].title}</p>
                <p className="mono mt-0.5 text-[6.5px] text-ink-3">{projects[4].client}</p>
              </div>
            </div>
          </Phone>
        </div>

        <div className="mono mt-16 flex justify-between text-[10.5px] text-ink-3 md:mt-28">
          <span>
            Videography <span className="text-ink">&amp;</span> Photography
          </span>
          <span className="text-ink">CASA Certified</span>
        </div>
      </div>
    </section>
  );
}
