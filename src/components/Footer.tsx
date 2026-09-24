import { nav, site } from "@/content/site";
import { asset } from "@/lib/basePath";
import { Logo } from "./Logo";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink text-white/70">
      <div className="wrap pt-20 sm:pt-28">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Logo light />
            <p className="mt-8 text-[clamp(34px,4.4vw,64px)] leading-[0.95] tracking-[-0.045em] text-white">
              {site.tagline.join(" • ")}
            </p>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 lg:col-span-5 lg:col-start-8">
            <ul className="space-y-3">
              {nav.map(([l, h]) => (
                <li key={h}>
                  <a href={h} className="mono text-white/70 transition-colors hover:text-white">
                    {l}
                  </a>
                </li>
              ))}
              <li>
                <a href="#contact" className="mono text-white/70 transition-colors hover:text-white">
                  Contact Us
                </a>
              </li>
            </ul>
            <ul className="space-y-3">
              <li>
                <a href={`mailto:${site.email}`} className="mono text-white/70 hover:text-white">
                  Email
                </a>
              </li>
              <li>
                <a href={site.instagram} target="_blank" rel="noopener" className="mono text-white/70 hover:text-white">
                  Instagram
                </a>
              </li>
              <li>
                <a href={site.linkedin} target="_blank" rel="noopener" className="mono text-white/70 hover:text-white">
                  LinkedIn
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-20 flex flex-wrap items-center gap-10 border-t border-white/10 py-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/img/logos/casa-logo-white.png")} alt="Civil Aviation Safety Authority" className="h-8 w-auto opacity-70" loading="lazy" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/img/logos/vesi-edited-white.png")} alt="VESI Accredited" className="h-8 w-auto opacity-70" loading="lazy" />
        </div>

        <div className="mono flex flex-col gap-3 border-t border-white/10 py-8 text-[10.5px] text-white/45 sm:flex-row sm:justify-between">
          <span>Copyright © {year} Aerial Image</span>
          <span>Contact Us for Terms & Conditions</span>
        </div>

        {/* Oversized wordmark bleeding off the bottom. */}
        <p aria-hidden className="pointer-events-none select-none overflow-hidden whitespace-nowrap text-center text-[clamp(56px,16vw,264px)] leading-[0.74] tracking-[-0.07em] text-white/[0.06]">
          Aerial Image
        </p>
      </div>
    </footer>
  );
}
