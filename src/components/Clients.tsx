import { clients } from "@/content/site";
import { asset } from "@/lib/basePath";

// Home — "We have had the pleasure of working with –". Doubled for a seamless loop.
export function Clients() {
  const row = [...clients, ...clients];
  return (
    <section aria-label="Clients" className="border-y border-rule bg-paper">
      <div className="wrap flex flex-col gap-6 py-10 lg:flex-row lg:items-center lg:gap-12">
        <p className="mono shrink-0 text-ink-3">We have had the pleasure of working with –</p>
        <div className="relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
          <ul className="marquee items-center gap-4">
            {row.map((c, i) => (
              <li
                key={i}
                aria-hidden={i >= clients.length}
                className="group flex h-[76px] w-[168px] shrink-0 items-center justify-center rounded-2xl border border-rule bg-white px-6"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset(`/img/logos/${c.src}.png`)}
                  alt={c.alt}
                  loading="lazy"
                  className="max-h-9 max-w-full rounded-[4px] object-contain opacity-70 grayscale transition duration-500 group-hover:opacity-100 group-hover:grayscale-0"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
