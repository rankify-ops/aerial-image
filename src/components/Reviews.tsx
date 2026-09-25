"use client";

import { useEffect, useRef, useState } from "react";
import { reviews, type Review } from "@/content/site";
import { Arrow, Kicker, Loop, Reveal } from "./ui";

/*
 * Three review sections for the home page. All read from `reviews` in
 * content/site.ts. That list is empty until the client supplies real reviews
 * (we never invent them), so each section renders designed placeholder slots
 * that are clearly marked as pending — same layout, skeleton text.
 */

const PENDING = "Awaiting client review";

function Stars({ n = 5, ghost = false, className = "" }: { n?: number; ghost?: boolean; className?: string }) {
  return (
    <span className={`flex gap-[3px] ${className}`} aria-label={ghost ? undefined : `${n} out of 5`} aria-hidden={ghost || undefined}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 12 12" aria-hidden>
          <path
            d="M6 .8l1.6 3.3 3.6.5-2.6 2.5.6 3.6L6 9l-3.2 1.7.6-3.6L.8 4.6l3.6-.5z"
            fill={ghost ? "none" : i < n ? "var(--ink)" : "rgb(13 15 18 / 0.15)"}
            stroke={ghost ? "rgb(13 15 18 / 0.25)" : "none"}
            strokeWidth="0.9"
          />
        </svg>
      ))}
    </span>
  );
}

/** Skeleton lines standing in for a quote. */
function Ghost({ lines = [100, 94, 97, 58], h = "0.62em", gap = "0.42em" }: { lines?: number[]; h?: string; gap?: string }) {
  return (
    <span className="block" aria-hidden style={{ display: "grid", gap }}>
      {lines.map((w, i) => (
        <span key={i} className="block rounded-full bg-ink/[0.07]" style={{ width: `${w}%`, height: h }} />
      ))}
    </span>
  );
}

function Person({ r, dark = false }: { r?: Review; dark?: boolean }) {
  const initials = r ? r.name.split(" ").map((w) => w[0]).slice(0, 2).join("") : "";
  return (
    <span className="flex items-center gap-3">
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${r ? (dark ? "bg-white text-ink" : "bg-ink text-paper") : "border border-dashed border-ink/25"} mono text-[10px]`}>
        {initials}
      </span>
      <span className="min-w-0">
        {r ? (
          <>
            <span className="block truncate text-[15px] tracking-tight text-ink">{r.name}</span>
            <span className="mono block truncate text-[9.5px] text-ink-3">{[r.role, r.company].filter(Boolean).join(" · ")}</span>
          </>
        ) : (
          <>
            <span className="block text-[15px] tracking-tight text-ink/35">Client name</span>
            <span className="mono block text-[9.5px] text-ink/30">Role · Company</span>
          </>
        )}
      </span>
    </span>
  );
}

function PendingTag() {
  return (
    <span className="mono inline-flex items-center gap-2 rounded-full border border-dashed border-rec/50 px-3 py-1.5 text-[9.5px] text-rec-ink">
      <span className="h-1.5 w-1.5 rounded-full bg-rec" /> {PENDING}
    </span>
  );
}

/* ── 1. Featured pull-quote beside FPV footage ─────────────────────────── */
export function ReviewFeature() {
  const r = reviews.find((x) => x.featured) ?? reviews[0];
  return (
    <section aria-label="Client review" className="border-y border-rule bg-paper">
      <div className="wrap grid gap-12 py-24 sm:py-32 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-7">
          <Kicker index="“">Client review</Kicker>
          <Reveal>
            <svg aria-hidden width="64" height="48" viewBox="0 0 64 48" className="mt-10 text-rec">
              <path fill="currentColor" d="M0 48V29.6C0 12.9 7.6 3.1 22.8 0l2.6 5.6C17.7 8 13.8 13 13.4 20.6H26V48H0zm38 0V29.6C38 12.9 45.6 3.1 60.8 0l2.6 5.6c-7.7 2.4-11.6 7.4-12 15H64V48H38z" />
            </svg>
            <blockquote className="mt-8 text-[clamp(28px,3.4vw,52px)] leading-[1.08] tracking-[-0.035em] text-ink">
              {r ? r.quote : <Ghost lines={[100, 96, 99, 88, 46]} />}
            </blockquote>
          </Reveal>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-rule pt-6">
            <Person r={r} />
            {r ? <Stars n={r.rating ?? 5} /> : <PendingTag />}
          </div>
        </div>
        <div className="lg:col-span-4 lg:col-start-9">
          <div className="tile relative aspect-[4/5] overflow-hidden rounded-[24px] bg-ink">
            <Loop slug="fpv-interior" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20" />
            <span className="mono absolute left-5 top-5 flex items-center gap-2 text-[10px] text-white">
              <span className="rec-dot blink" /> REC
            </span>
            <span className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 text-white">
              <span className="text-[18px] leading-tight tracking-tight">{r?.company ?? "Project footage"}</span>
              <span className="mono text-[9.5px] text-white/60">FPV</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 2. Main carousel ──────────────────────────────────────────────────── */
export function ReviewCarousel() {
  const items: (Review | null)[] = reviews.length ? reviews : Array.from({ length: 5 }, () => null);
  const track = useRef<HTMLUListElement>(null);
  const [i, setI] = useState(0);

  // Index + progress from the native scroll position (so swipe, wheel and buttons agree).
  useEffect(() => {
    const t = track.current;
    if (!t) return;
    const on = () => {
      const card = t.firstElementChild as HTMLElement | null;
      if (!card) return;
      setI(Math.round(t.scrollLeft / (card.offsetWidth + 16)));
    };
    t.addEventListener("scroll", on, { passive: true });
    return () => t.removeEventListener("scroll", on);
  }, []);

  const go = (d: number) => {
    const t = track.current;
    const card = t?.firstElementChild as HTMLElement | null;
    if (!t || !card) return;
    const n = Math.max(0, Math.min(items.length - 1, i + d));
    t.scrollTo({ left: n * (card.offsetWidth + 16), behavior: "smooth" });
  };

  return (
    <section id="reviews" className="overflow-hidden border-y border-rule bg-white">
      <div className="wrap py-24 sm:py-32">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Kicker index="“">Reviews</Kicker>
            <h2 className="display mt-8">
              Client <span className="dim">reviews</span>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="mono mr-2 text-[11px] text-ink-3 tabular-nums">
              <span className="text-ink">{String(Math.min(i + 1, items.length)).padStart(2, "0")}</span> / {String(items.length).padStart(2, "0")}
            </span>
            <button type="button" onClick={() => go(-1)} disabled={i === 0} aria-label="Previous review" className="flex h-12 w-12 items-center justify-center rounded-full border border-rule-2 text-ink transition-colors hover:border-ink disabled:opacity-30">
              <Arrow className="rotate-180" />
            </button>
            <button type="button" onClick={() => go(1)} disabled={i >= items.length - 1} aria-label="Next review" className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-paper transition-opacity disabled:opacity-30">
              <Arrow />
            </button>
          </div>
        </div>

        <ul ref={track} className="no-scrollbar -mx-4 mt-14 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 sm:mx-0 sm:scroll-px-0 sm:px-0">
          {items.map((r, k) => (
            <li
              key={k}
              className="flex w-[min(86vw,540px)] shrink-0 snap-start flex-col justify-between rounded-[24px] border border-rule bg-paper p-7 sm:p-9"
              style={{ minHeight: 360 }}
            >
              <div>
                <div className="flex items-center justify-between">
                  {r ? <Stars n={r.rating ?? 5} /> : <Stars ghost />}
                  <span className="mono text-[10px] text-ink-3">{r?.source ?? String(k + 1).padStart(2, "0")}</span>
                </div>
                <blockquote className="mt-8 text-[clamp(20px,1.9vw,26px)] leading-[1.25] tracking-[-0.025em] text-ink">
                  {r ? `“${r.quote}”` : <Ghost />}
                </blockquote>
              </div>
              <div className="mt-10 flex items-center justify-between gap-4 border-t border-rule pt-6">
                <Person r={r ?? undefined} />
                {!r && <span className="mono hidden text-[9px] text-rec-ink sm:block">Pending</span>}
              </div>
            </li>
          ))}
        </ul>

        {/* Progress hairline */}
        <div className="relative mt-10 h-px bg-rule">
          <div className="absolute inset-y-0 left-0 bg-ink transition-[width] duration-500" style={{ width: `${((Math.min(i, items.length - 1) + 1) / items.length) * 100}%` }} />
        </div>
        {!reviews.length && (
          <p className="mt-6">
            <PendingTag />
          </p>
        )}
      </div>
    </section>
  );
}

/* ── 3. Drifting review wall ───────────────────────────────────────────── */
export function ReviewWall() {
  const base: (Review | null)[] = reviews.length ? reviews : Array.from({ length: 6 }, () => null);
  const rowA = [...base, ...base];
  const rowB = [...base.slice().reverse(), ...base.slice().reverse()];
  const Card = ({ r }: { r: Review | null }) => (
    <li className="flex w-[340px] shrink-0 flex-col justify-between rounded-[20px] border border-rule bg-white p-6 sm:w-[380px]">
      <div>
        {r ? <Stars n={r.rating ?? 5} /> : <Stars ghost />}
        <p className="mt-5 text-[15.5px] leading-relaxed text-ink-2">{r ? `“${r.quote}”` : <Ghost lines={[100, 92, 70]} h="0.7em" gap="0.55em" />}</p>
      </div>
      <div className="mt-6">
        <Person r={r ?? undefined} />
      </div>
    </li>
  );
  return (
    <section aria-label="More client reviews" className="overflow-hidden bg-paper py-24 sm:py-28">
      <div className="wrap flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Kicker index="“">Reviews</Kicker>
          <p className="h2 mt-6 text-ink">
            Quality over Quantity<span className="text-rec">.</span>
          </p>
        </div>
        {!reviews.length && <PendingTag />}
      </div>
      <div className="mt-12 grid gap-4 [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]">
        <ul className="marquee gap-4 [animation-duration:70s]" aria-hidden={!reviews.length || undefined}>
          {rowA.map((r, k) => (
            <Card key={`a${k}`} r={r} />
          ))}
        </ul>
        <ul className="marquee gap-4 [animation-direction:reverse] [animation-duration:80s]" aria-hidden>
          {rowB.map((r, k) => (
            <Card key={`b${k}`} r={r} />
          ))}
        </ul>
      </div>
    </section>
  );
}
