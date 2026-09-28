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
