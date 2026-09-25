"use client";

import { useState } from "react";
import { fpvStatement, licences, pillars, projects, services, site } from "@/content/site";
import { asset } from "@/lib/basePath";
import { openService } from "./ServiceTabs";
import { Arrow, Loop, Photo, Play } from "./ui";
import { openVideo } from "./VideoModal";

/*
 * Mega menu panels for the header (variation 1). One glass sheet drops out
 * of the pill; each nav item has its own layout. Content only mounts while
 * open, so its clips never play hidden.
 */
export type MegaKey = "fpv" | "work" | "services" | "credentials";

const RUNTIME: Record<string, string> = {
  y08uG9t57uo: "2:08",
  H4qmCY8Zn8I: "1:32",
  "4PbgFEQxals": "1:40",
  "8m8P0btFU2c": "2:23",
  yanTU9G9Gus: "1:24",
  "l8oCeA8U-48": "1:41",
  "0e9DGg650N4": "1:00",
};

export function MegaPanel({ which, close }: { which: MegaKey; close: () => void }) {
  return (
    <div key={which} className="mega-in grid gap-6 p-6 lg:grid-cols-12 lg:gap-8 lg:p-8">
      {which === "fpv" && <Fpv close={close} />}
      {which === "work" && <Work close={close} />}
      {which === "services" && <Svc close={close} />}
      {which === "credentials" && <Creds close={close} />}
    </div>
  );
}

function Label({ i, children }: { i: string; children: React.ReactNode }) {
  return (
    <p className="mono flex items-center gap-3 text-[10px] text-ink-3">
      <span className="text-rec">{i}</span>
      <span className="h-px w-6 bg-rule-2" />
      {children}
    </p>
  );
}

function Fpv({ close }: { close: () => void }) {
  const clips = [
    ["fpv-coast", "Coastline"],
    ["fpv-canola", "Open field"],
    ["fpv-lighthouse", "Headland"],
  ];
  return (
    <>
      <div className="flex flex-col lg:col-span-5">
        <Label i="02">FPV Video / Piloting</Label>
        <p className="mt-6 text-[30px] leading-[1.02] tracking-[-0.035em] text-ink">FPV Cinematic Media</p>
        <p className="mt-4 text-[14px] leading-relaxed text-ink-2">{fpvStatement}</p>
        <div className="mt-auto flex gap-2 pt-8">
          <button type="button" onClick={() => { close(); openVideo(site.showreel, "2024 Showreel"); }} className="btn btn-primary h-11 px-5">
            <Play size={10} /> Showreel
          </button>
          <a href="#fpv" onClick={close} className="btn btn-ghost h-11 px-5">
            The reel <Arrow />
          </a>
        </div>
      </div>
      <ul className="grid grid-cols-3 gap-3 lg:col-span-7">
        {clips.map(([slug, label], i) => (
          <li key={slug}>
            <a href="#fpv" onClick={close} className="tile group relative block aspect-[3/4] overflow-hidden rounded-[18px] bg-ink">
              <Loop slug={slug} className="absolute inset-0 h-full w-full object-cover" />
              <span className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
              <span className="mono absolute left-3 top-3 flex items-center gap-1.5 text-[9px] text-white/85">
                <span className="rec-dot blink" /> CH {String(i + 1).padStart(2, "0")}
              </span>
              <span className="absolute inset-x-3 bottom-3 text-[15px] tracking-tight text-white">{label}</span>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}

function Work({ close }: { close: () => void }) {
  const [hi, setHi] = useState(0);
  const p = projects[hi];
  return (
    <>
      <div className="lg:col-span-6">
        <Label i="04">Recent Projects</Label>
        <ul className="mt-4 divide-y divide-rule">
          {projects.map((q, i) => (
            <li key={q.id}>
              <button
                type="button"
                onMouseEnter={() => setHi(i)}
                onFocus={() => setHi(i)}
                onClick={() => { close(); openVideo(q.id, q.title); }}
                className="group flex w-full items-center gap-4 py-2.5 text-left"
              >
                <span className={`mono w-6 text-[10px] ${i === hi ? "text-rec" : "text-ink-3"}`}>{String(i + 1).padStart(2, "0")}</span>
                <span className={`min-w-0 flex-1 truncate text-[16px] tracking-tight transition-colors ${i === hi ? "text-ink" : "text-ink/45"}`}>{q.title}</span>
                <span className="mono text-[10px] text-ink-3">{RUNTIME[q.id]}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col lg:col-span-6">
        <button
          type="button"
          onClick={() => { close(); openVideo(p.id, p.title); }}
          className="tile group relative block aspect-[16/10] w-full overflow-hidden rounded-[20px] bg-ink text-left"
        >
          <Loop key={p.slug} slug={p.slug} className="absolute inset-0 h-full w-full object-cover" />
          <span className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <span className="mono absolute left-4 top-4 rounded-full bg-white/15 px-3 py-1.5 text-[9.5px] text-white backdrop-blur-md">{p.client}</span>
          <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink transition-transform duration-500 group-hover:scale-110">
            <Play size={11} />
          </span>
          <span className="absolute inset-x-4 bottom-4 text-[20px] leading-tight tracking-tight text-white">{p.title}</span>
        </button>
        <div className="mt-4 flex items-center justify-between">
          <p className="mono text-[10px] text-ink-3">Hover a title to preview · click to play</p>
          <a href="#work" onClick={close} className="mono flex items-center gap-2 text-[10.5px] text-ink hover:text-rec-ink">
            All projects <Arrow />
          </a>
        </div>
      </div>
    </>
  );
}

function Svc({ close }: { close: () => void }) {
  const [sel, setSel] = useState<[number, number]>([0, 0]);
  const g = services[sel[0]].groups[sel[1]];
  const go = (t: number, a: number) => {
    close();
    openService(t, a);
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <>
      {services.map((s, t) => (
        <div key={s.key} className="lg:col-span-3">
          <Label i="01">{s.name}</Label>
          <ul className="mt-4">
            {s.groups.map((grp, a) => {
              const on = sel[0] === t && sel[1] === a;
              return (
                <li key={grp.title}>
                  <button
                    type="button"
                    onMouseEnter={() => setSel([t, a])}
                    onFocus={() => setSel([t, a])}
                    onClick={() => go(t, a)}
                    className="group flex w-full items-baseline gap-3 py-2 text-left"
                  >
                    <span className={`h-1.5 w-1.5 shrink-0 translate-y-[-2px] rounded-full transition-colors ${on ? "bg-rec" : "bg-rule-2"}`} />
                    <span className={`text-[17px] leading-snug tracking-tight transition-colors ${on ? "text-ink" : "text-ink/50 group-hover:text-ink/80"}`}>{grp.title}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      <div className="flex flex-col rounded-[20px] border border-rule bg-white p-4 lg:col-span-6">
        <div className="relative aspect-[16/8] overflow-hidden rounded-[14px] bg-mist">
          {"video" in g && g.video ? (
            <Loop key={g.title} slug={g.video} className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <Photo key={g.title} slug={g.img} alt={g.title} sizes="40vw" className="absolute inset-0 h-full w-full object-cover" />
          )}
        </div>
        <p key={`t-${g.title}`} className="mega-in mt-4 text-[20px] tracking-tight text-ink">{g.title}</p>
        <p key={`l-${g.title}`} className="mega-in mt-2 line-clamp-3 text-[13.5px] leading-relaxed text-ink-2">{g.lead}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <button type="button" onClick={() => go(sel[0], sel[1])} className="mono flex items-center gap-2 text-[10.5px] text-ink hover:text-rec-ink">
            View service <Arrow />
          </button>
          <a href="#contact" onClick={close} className="btn btn-primary h-10 px-5">
            Enquiries <Arrow />
          </a>
        </div>
      </div>
    </>
  );
}

function Creds({ close }: { close: () => void }) {
  return (
    <>
      <div className="flex flex-col justify-between rounded-[20px] border border-rule bg-white p-6 lg:col-span-4">
        <p className="mono flex items-center gap-3 text-[10px] text-ink">
          <span className="rec-dot" /> CASA Certified
        </p>
        <div className="mt-8">
          <p className="text-[88px] leading-[0.8] tracking-[-0.06em] text-ink">
            10<span className="text-rec">+</span>
          </p>
          <p className="mono mt-4 text-[10px] text-ink-3">Years in the Photo/Video/Audio industry</p>
        </div>
      </div>
      <div className="lg:col-span-4">
        <Label i="05">Licences</Label>
        <ul className="mt-4 grid grid-cols-2 gap-2">
          {licences.map((l) => (
            <li key={l} className="rounded-[14px] border border-rule bg-white px-4 py-3 text-[22px] tracking-[-0.03em] text-ink">
              {l}
            </li>
          ))}
        </ul>
        <div className="mt-5 flex items-center gap-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/img/logos/casa-logo-white.png")} alt="Civil Aviation Safety Authority" className="h-7 w-auto invert" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/img/logos/vesi-edited-white.png")} alt="VESI Accredited" className="h-7 w-auto invert" />
        </div>
      </div>
      <div className="lg:col-span-4">
        <Label i="05">About Us</Label>
        <ul className="mt-4 divide-y divide-rule">
          {pillars.map((p) => (
            <li key={p.title}>
              <a href="#credentials" onClick={close} className="group flex items-center justify-between py-3 text-[16px] tracking-tight text-ink/70 hover:text-ink">
                {p.title}
                <Arrow className="opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
