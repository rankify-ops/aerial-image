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

/**
 * Muted loop from public/video that only plays while on screen, so a page of
 * twenty clips never decodes more than the two or three you can see.
 * `hover` makes it play on pointer hover instead (desktop), still autoplaying
 * on touch screens where there is no hover.
 */
export function Loop({ slug, className = "", hover = false }: { slug: string; className?: string; hover?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const canHover = window.matchMedia("(hover: hover)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let visible = false;
    const play = () => v.play().catch(() => {});
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (!visible) v.pause();
        else if (!hover || !canHover) play();
      },
      { rootMargin: "120px" },
    );
    io.observe(v);
    const host = v.closest(".tile");
    const on = () => visible && play();
    const off = () => v.pause();
    if (hover && canHover && host) {
      host.addEventListener("pointerenter", on);
      host.addEventListener("pointerleave", off);
    }
    return () => {
      io.disconnect();
      host?.removeEventListener("pointerenter", on);
      host?.removeEventListener("pointerleave", off);
    };
  }, [hover]);
  return (
    <video
      ref={ref}
      className={className}
      src={asset(`/video/${slug}.mp4`)}
      poster={asset(`/video/${slug}.jpg`)}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden
    />
  );
}

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" className={`arrow ${className}`} aria-hidden>
      <path d="M0 5h12.5M9 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
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
      <span className="text-rec">{index}</span>
      <span className={`h-px w-10 ${light ? "bg-white/30" : "bg-rule-2"}`} />
      <span>{children}</span>
    </p>
  );
}
