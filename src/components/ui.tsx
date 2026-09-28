"use client";

import { useEffect, useRef } from "react";
import { asset } from "@/lib/basePath";

/** Fades a block up once it scrolls into view. */
export function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "section" | "figure" | "p";
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("in");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  );
}

/** Photo from public/img, 640 + 1280 webp pair made by scripts/images.mjs. */
export function Photo({
  slug,
  alt,
  sizes = "100vw",
  className = "",
}: {
  slug: string;
  alt: string;
  sizes?: string;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={asset(`/img/${slug}-1280.webp`)}
      srcSet={`${asset(`/img/${slug}-640.webp`)} 640w, ${asset(`/img/${slug}-1280.webp`)} 1280w`}
      sizes={sizes}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
    />
  );
}

/*
 * Video budget shared by every <Loop>. Autoplaying clips compete for the
 * device's hardware decoder; phones stutter past two or three at once. So an
 * autoplay candidate must be ≥50% on screen, and only the MAX most-visible
 * candidates actually play — the rest sit on their poster frame. Hover-driven
 * tiles (desktop) bypass the budget: they only play under the pointer.
 */
const touch = typeof window !== "undefined" && !window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const MAX = touch ? 2 : 4;
const candidates = new Map<HTMLVideoElement, number>(); // video → visible ratio
let scheduled = false;
function rebalance() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    const ranked = [...candidates.entries()].filter(([, r]) => r >= 0.5).sort((a, b) => b[1] - a[1]);
    const allowed = new Set(ranked.slice(0, MAX).map(([v]) => v));
    candidates.forEach((_, v) => {
      if (allowed.has(v)) {
        if (v.paused) v.play().catch(() => {});
      } else if (!v.paused) v.pause();
    });
  });
}

/**
 * Muted loop from public/video that only plays while on screen (within the
 * shared video budget above). `hover` makes it play on pointer hover instead
 * (desktop), still autoplaying on touch screens where there is no hover.
 * Data Saver / reduced motion: poster frame only.
 */
export function Loop({ slug, className = "", hover = false }: { slug: string; className?: string; hover?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
    if (reduce || saveData) return;

    // Start buffering about a screen before the clip arrives, so it's already
    // moving when it scrolls in instead of sitting on its poster.
    // Not while the loader is up — the hero gets the whole connection first.
    let wait = 0;
    const warmNow = () => {
      if (document.documentElement.classList.contains("preloading")) {
        wait = window.setTimeout(warmNow, 500);
        return;
      }
      v.preload = "auto";
    };
    const warm = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        warm.disconnect();
        warmNow();
      },
      { rootMargin: "100% 0px 100% 0px" },
    );
    warm.observe(v);

    const hoverMode = hover && canHover;
    let visible = false;
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (hoverMode) {
          if (!visible) v.pause();
          return;
        }
        if (visible) candidates.set(v, e.intersectionRatio);
        else {
          // Off screen: out of the budget, and stop decoding now.
          candidates.delete(v);
          v.pause();
        }
        rebalance();
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    io.observe(v);
    const host = v.closest(".tile");
    const on = () => visible && v.play().catch(() => {});
    const off = () => v.pause();
    if (hoverMode && host) {
      host.addEventListener("pointerenter", on);
      host.addEventListener("pointerleave", off);
    }
    return () => {
      warm.disconnect();
      clearTimeout(wait);
      io.disconnect();
      candidates.delete(v);
      v.pause();
      rebalance();
      host?.removeEventListener("pointerenter", on);
      host?.removeEventListener("pointerleave", off);
    };
  }, [hover]);
  return (
    <video
      ref={ref}
      className={className}
      src={asset(`/video/${slug}.mp4`)}
      poster={asset(`/video/${slug}.webp`)}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden
    />
  );
}

/**
 * Ref callback for the autoplaying hero videos: they sit outside the budget
 * (always wanted on load) but shouldn't keep decoding once scrolled away.
 */
export function pauseOffscreen(v: HTMLVideoElement | null) {
  if (!v) return;
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) v.play().catch(() => {});
    else v.pause();
  });
  io.observe(v);
  return () => io.disconnect();
}

/*
 * Hero video, chosen here rather than trusted to <source media> (some
 * browsers ignore media= on video sources, and a window that loads narrow
 * then gets maximised would keep the portrait file).
 *
 *   phones  → hero-mobile.mp4 (548×972 portrait, ~1.8 Mbps)
 *   desktop → a small bitrate ladder, like a streaming player:
 *             hero-1080 (~5.9 Mbps) · hero-720 (~2.5) · hero-540 (~1.2)
 *
 * While the loader is up (so any switch is invisible) the download rate is
 * measured as seconds-of-video buffered per second of wall time, counted
 * from the rung's first frame (so request latency doesn't count against it);
 * a rung that can't stay comfortably ahead (< 1.3× real time) steps down,
 * keeping the timestamp. Measuring stops the moment the loader commits to
 * its exit (html.pre-done), so nothing switches during the reveal. After the reveal it only ever steps down, and only on a stall.
 * Data Saver / 2g / 3g start on the lowest rungs outright.
 */
const LADDER = ["hero-1080", "hero-720", "hero-540"] as const;
const MBPS = [5.9, 2.5, 1.2]; // average bitrate of each rung (scripts/media.sh)
const SAFE_RATE = 1.3;
let rung = -1; // shared by all hero mounts; -1 = not decided yet
type Conn = { saveData?: boolean; downlink?: number; effectiveType?: string };
function startRung() {
  const c = (navigator as Navigator & { connection?: Conn }).connection;
  if (!c) return 0;
  if (c.saveData || /2g/.test(c.effectiveType ?? "")) return 2;
  if (c.effectiveType === "3g" || (!!c.downlink && c.downlink < 5)) return 1;
  return 0;
}
export function aheadOf(v: HTMLVideoElement, t: number) {
  for (let i = 0; i < v.buffered.length; i++) {
    if (v.buffered.start(i) <= t + 0.1 && v.buffered.end(i) > t) return v.buffered.end(i);
  }
  return t;
}

/** Ref callback for the three hero videos — picks the file (above) and pauses offscreen. */
export function heroVideo(v: HTMLVideoElement | null) {
  if (!v) return;
  if (rung < 0) rung = startRung();
  const mq = window.matchMedia("(max-width: 767px)");
  const file = () => (mq.matches ? "hero-mobile" : LADDER[rung]);
  const on = (name: string) => !!v.currentSrc && new URL(v.currentSrc).pathname.endsWith(`/${name}.mp4`);

  // Measurement window for the current file: opens at its first frame.
  let since = 0;
  let fromT = 0;
  const open = () => {
    if (since) return;
    since = performance.now();
    fromT = aheadOf(v, v.currentTime);
  };

  const pick = () => {
    if (!v.currentSrc) return; // selection hasn't run yet — loadstart calls again
    const want = file();
    if (on(want)) return;
    const t = v.currentTime;
    v.src = asset(`/video/${want}.mp4`);
    if (t > 0.1) v.addEventListener("loadedmetadata", () => (v.currentTime = t), { once: true });
    v.play().catch(() => {});
    since = 0;
  };
  const stepDown = (to = rung + 1) => {
    if (mq.matches || rung >= LADDER.length - 1) return;
    rung = Math.min(LADDER.length - 1, Math.max(rung + 1, to));
    pick();
  };
  // Best rung for a measured connection speed (Mbps): jump straight there
  // rather than stepping down one rung at a time (each switch costs a restart).
  const fits = (mbps: number) => {
    const i = MBPS.findIndex((b) => b * SAFE_RATE <= mbps);
    return i < 0 ? LADDER.length - 1 : i;
  };
  let loadAt = performance.now();
  v.addEventListener("loadstart", () => (loadAt = performance.now()));

  // Measure while the loader is up.
  const probe = window.setInterval(() => {
    const h = document.documentElement.classList;
    if (!h.contains("preloading") || h.contains("pre-done") || mq.matches) return window.clearInterval(probe);
    // No first frame 2.5s after asking for it → at least one rung down.
    if (!since) {
      if (performance.now() - loadAt > 2500) stepDown();
      return;
    }
    const secs = (performance.now() - since) / 1000;
    if (secs < 1.5) return;
    const end = aheadOf(v, v.currentTime);
    const whole = Number.isFinite(v.duration) && end >= v.duration - 0.25;
    // Plenty in hand already (well past the loader's needs) → keep this rung.
    if (whole || end - v.currentTime >= 8) return;
    const rate = (end - fromT) / secs; // seconds of video per second
    if (rate < SAFE_RATE) stepDown(fits(rate * MBPS[rung]));
  }, 500);
  // After the reveal: a real mid-play stall (still stuck after 0.7s — not a
  // momentary blip) steps down.
  let stall = 0;
  const waiting = () => {
    if (v.currentTime < 0.3 || !document.documentElement.classList.contains("pre-done")) return;
    clearTimeout(stall);
    stall = window.setTimeout(() => v.readyState < 3 && !v.paused && stepDown(), 700);
  };
  const resumed = () => clearTimeout(stall);

  // The browser may have picked a file before this runs, so check now and at
  // every stage it could report one.
  const EVENTS = ["loadstart", "loadedmetadata", "playing"] as const;
  pick();
  EVENTS.forEach((e) => v.addEventListener(e, pick));
  v.addEventListener("loadeddata", open);
  if (v.readyState >= 2) open();
  v.addEventListener("waiting", waiting);
  v.addEventListener("playing", resumed);
  mq.addEventListener("change", pick);
  const stop = pauseOffscreen(v);
  return () => {
    window.clearInterval(probe);
    clearTimeout(stall);
    v.removeEventListener("playing", resumed);
    EVENTS.forEach((e) => v.removeEventListener(e, pick));
    v.removeEventListener("loadeddata", open);
    v.removeEventListener("waiting", waiting);
    mq.removeEventListener("change", pick);
    stop?.();
  };
}

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" className={`arrow ${className}`} aria-hidden>
      <path d="M1.5 10.5l9-9M3 1.5h7.5V9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
    </svg>
  );
}

export function Play({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" aria-hidden>
      <path d="M3 1.5v11l9.5-5.5z" fill="currentColor" />
    </svg>
  );
}

/** Mono kicker: red index, hairline, label. */
export function Kicker({ index, children, light = false }: { index: string; children: React.ReactNode; light?: boolean }) {
  return (
    <p className={`mono flex items-center gap-4 ${light ? "text-white/60" : "text-ink-3"}`}>
      <span className="text-rec-ink">{index}</span>
      <span className={`h-px w-10 ${light ? "bg-white/30" : "bg-rule-2"}`} />
      <span>{children}</span>
    </p>
  );
}
