"use client";

import { projects } from "@/content/site";
import { Kicker, Loop, Play, Reveal } from "./ui";
import { openVideo } from "./VideoModal";

// Bento spans for the seven Recent Projects: 8+4 / 4+4+4 / 6+6.
const SPANS = ["lg:col-span-8", "lg:col-span-4", "lg:col-span-4", "lg:col-span-4", "lg:col-span-4", "lg:col-span-6", "lg:col-span-6"];

export function Work() {
  return (
    <section id="work" className="wrap py-28 sm:py-36">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Kicker index="04">Recent Projects</Kicker>
          <h2 className="display mt-8">
            Recent <span className="dim">Projects</span>
          </h2>
        </div>
        <p className="mono max-w-[340px] text-ink-3 lg:text-right">Hover to preview · Click to play the full film with sound</p>
      </div>

      <ul className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
        {projects.map((p, i) => (
          <Reveal as="li" key={p.id} delay={(i % 3) * 80} className={`${SPANS[i]} ${i === 0 ? "sm:col-span-2" : ""}`}>
            <button
              type="button"
              onClick={() => openVideo(p.id, p.title)}
              className={`tile group relative block aspect-[16/10] w-full overflow-hidden rounded-[22px] bg-ink text-left ${i === 1 ? "lg:aspect-auto lg:h-full" : ""}`}
              aria-label={`Play ${p.title}`}
            >
              <Loop slug={p.slug} hover className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
              <span className="mono absolute left-5 top-5 rounded-full bg-white/15 px-3 py-1.5 text-[10px] text-white backdrop-blur-md">
                {p.client}
              </span>
              <span className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink opacity-0 transition-all duration-500 group-hover:opacity-100 max-lg:opacity-100">
                <Play size={12} />
              </span>
              <span className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
                <span className={`block tracking-tight text-white ${i === 0 ? "text-[clamp(22px,2.4vw,36px)] leading-[1.05]" : "text-[19px] leading-snug"}`}>
                  {p.title}
                </span>
                <span className="mono shrink-0 text-[10px] text-white/60">{String(i + 1).padStart(2, "0")}</span>
              </span>
            </button>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
