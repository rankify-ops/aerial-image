import { about, licences, pillars, stills } from "@/content/site";
import { asset } from "@/lib/basePath";
import { Kicker, Photo, Reveal } from "./ui";

export function Credentials() {
  return (
    <section id="credentials" className="bg-paper">
      <div className="wrap py-28 sm:py-36">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Kicker index="05">About Us</Kicker>
            <h2 className="display mt-8">
              Quality <span className="dim">over</span> Quantity
            </h2>
          </div>
          <Reveal className="lg:col-span-6 lg:col-start-7">
            <p className="text-[17px] leading-relaxed">{about}</p>
          </Reveal>
        </div>

        {/* Licence panel */}
        <Reveal className="mt-20">
          <div className="grid overflow-hidden rounded-[26px] border border-rule bg-white lg:grid-cols-12">
            <div className="flex flex-col justify-between gap-10 p-7 sm:p-10 lg:col-span-5 lg:border-r lg:border-rule">
              <p className="mono flex items-center gap-3 text-ink">
                <span className="rec-dot" /> CASA Certified
              </p>
              <div>
                <p className="text-[clamp(64px,8vw,128px)] leading-[0.8] tracking-[-0.06em] text-ink">
                  10<span className="text-rec">+</span>
                </p>
                <p className="mono mt-5 text-ink-3">Years in the Photo/Video/Audio industry</p>
              </div>
            </div>
            <div className="grid grid-cols-2 border-t border-rule lg:col-span-7 lg:border-t-0">
              {licences.map((l, i) => (
                <div key={l} className={`flex flex-col justify-between gap-8 p-7 sm:p-10 ${i % 2 === 0 ? "border-r border-rule" : ""} ${i < 2 ? "border-b border-rule" : ""}`}>
                  <span className="mono text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[clamp(32px,3.6vw,56px)] leading-none tracking-[-0.04em] text-ink">{l}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-6 border-t border-rule px-7 py-6 sm:px-10 lg:col-span-12">
              <p className="mono text-ink-3">Fully licensed and insured</p>
              <div className="flex items-center gap-8">
                {/* Their logos are white; inverted to ink for the light panel. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset("/img/logos/casa-logo-white.png")} alt="Civil Aviation Safety Authority" className="h-9 w-auto invert" loading="lazy" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset("/img/logos/vesi-edited-white.png")} alt="VESI Accredited" className="h-9 w-auto invert" loading="lazy" />
              </div>
            </div>
          </div>
        </Reveal>

        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 90} className="flex flex-col rounded-[22px] border border-rule bg-white p-7">
              <span className="mono text-rec">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-10 text-[24px] leading-tight tracking-[-0.03em]">{p.title}</h3>
              <p className="mt-4 text-[14.5px] leading-relaxed">{p.body}</p>
            </Reveal>
          ))}
        </ul>
      </div>

      {/* Stills — their photography, aerial & ground, drifting. */}
      <div className="overflow-hidden border-t border-rule py-10" aria-label="Photography">
        <p className="wrap mono mb-6 text-ink-3">Photography (Aerial & Ground)</p>
        <ul className="marquee gap-4 [animation-duration:90s]">
          {[...stills, ...stills].map((s, i) => (
            <li key={i} aria-hidden={i >= stills.length} className="relative h-[240px] w-[340px] shrink-0 overflow-hidden rounded-[18px] bg-mist sm:h-[300px] sm:w-[420px]">
              <Photo slug={s} alt="" sizes="420px" className="absolute inset-0 h-full w-full object-cover" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
