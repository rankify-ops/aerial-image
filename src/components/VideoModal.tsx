"use client";

import { useEffect, useState } from "react";

/*
 * One lightbox for every "play" on the page. Anything can open it with
 * openVideo(youtubeId, title) — no context provider to thread through.
 * Uses youtube-nocookie and only mounts the iframe while open.
 */
const EVT = "ai:video";

export function openVideo(id: string, title: string) {
  window.dispatchEvent(new CustomEvent(EVT, { detail: { id, title } }));
}

export function VideoModal() {
  const [v, setV] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    const on = (e: Event) => setV((e as CustomEvent).detail);
    window.addEventListener(EVT, on);
    return () => window.removeEventListener(EVT, on);
  }, []);

  useEffect(() => {
    if (!v) return;
    document.body.style.overflow = "hidden";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setV(null);
    window.addEventListener("keydown", esc);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", esc);
    };
  }, [v]);

  if (!v) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={v.title}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgb(243_243_239/0.8)] p-4 backdrop-blur-xl sm:p-10"
      onClick={() => setV(null)}
    >
      <div className="fade-up w-full max-w-[1400px]" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between gap-6">
          <p className="mono flex min-w-0 items-center gap-3 text-ink">
            <span className="rec-dot" />
            <span className="truncate">{v.title}</span>
          </p>
          <button
            type="button"
            onClick={() => setV(null)}
            className="mono flex h-11 shrink-0 items-center gap-3 rounded-full border border-rule-2 px-5 text-ink transition-colors hover:border-ink"
            autoFocus
          >
            Close
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
              <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>
        </div>
        <div className="relative aspect-video overflow-hidden rounded-[20px] bg-ink shadow-[0_40px_120px_-30px_rgb(13_15_18/0.5)]">
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0&modestbranding=1&vq=hd1080`}
            title={v.title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
