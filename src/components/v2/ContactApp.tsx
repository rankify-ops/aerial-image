"use client";

import { useState } from "react";
import { site } from "@/content/site";
import { Arrow } from "../ui";
import { Mark } from "./Phone";

/*
 * The reference's "Transfer" screen as the enquiry form: a pearl app panel
 * with an account pill, "send to" row, service pills, soft inset fields and
 * the Send Money bar. Same Web3Forms / mailto fallback as variation 1.
 */
const KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "";

export function ContactApp() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [svc, setSvc] = useState<string[]>([site.tagline[0]]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: Record<string, string> = {
      name: `${fd.get("first") || ""} ${fd.get("last") || ""}`.trim(),
      email: String(fd.get("email") || ""),
      service: svc.join(", "),
      message: String(fd.get("message") || ""),
    };
    const subject = `Enquiry — ${data.service || "General"}`;
    if (!KEY) {
      const body = Object.entries(data).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join("\n");
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      return;
    }
    setState("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ access_key: KEY, subject, ...data }),
      });
      setState(res.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  }

  const toggle = (s: string) => setSvc((v) => (v.includes(s) ? v.filter((x) => x !== s) : [...v, s]));

  return (
    <section id="contact" className="relative py-28 sm:py-36">
      <div className="wrap grid gap-14 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5">
          <p className="mono flex items-center gap-4 text-ink-3">
            <span className="text-rec">06</span>
            <span className="h-px w-10 bg-rule-2" />
            Contact Us
          </p>
          <h2 className="serif mt-8 text-[clamp(48px,6.4vw,104px)] leading-[0.92] tracking-[-0.02em] text-ink">
            Communication <em className="text-ink/45">is key.</em>
          </h2>
          <p className="mt-8 max-w-[420px] text-[16px] leading-relaxed text-ink-2">
            Being passionate about our craft, we are personally invested in every project.
          </p>
          <ul className="nglass mt-10 divide-y divide-ink/[0.06] rounded-[24px] px-5">
            {[
              ["Email", site.email, `mailto:${site.email}`],
              ["Instagram", site.instagramHandle, site.instagram],
              ["LinkedIn", "Aerial Image", site.linkedin],
            ].map(([k, v, href]) => (
              <li key={k}>
                <a href={href} className="flex items-center justify-between gap-4 py-4" {...(href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}>
                  <span className="mono text-[9.5px] text-ink-3">{k}</span>
                  <span className="serif text-[20px] text-ink">{v}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          {state === "sent" ? (
            <div className="nglass rounded-[34px] p-10 text-center">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ink text-paper">✓</span>
              <p className="serif mt-6 text-[34px] leading-tight text-ink">Enquiry sent.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="nglass relative rounded-[34px] p-5 sm:p-8">
              <div className="flex items-center justify-between">
                <span className="norb flex h-10 w-10 items-center justify-center">
                  <Mark className="h-4 w-5 bg-ink" />
                </span>
                <p className="serif text-[22px] text-ink">Enquiries</p>
                <span className="norb flex h-10 w-10 items-center justify-center">
                  <span className="rec-dot" />
                </span>
              </div>

              <div className="mt-6 text-center">
                <span className="npill mono mx-auto h-7 text-[9px] text-ink-2">{site.email}</span>
              </div>

              {/* Service pills */}
              <fieldset className="mt-7">
                <legend className="sr-only">Service</legend>
                <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-center">
                  {site.tagline.map((s) => {
                    const on = svc.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        aria-pressed={on}
                        onClick={() => toggle(s)}
                        className={`npill mono h-10 justify-center px-4 text-[10px] ${on ? "npill-ink" : "text-ink-2"}`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              {/* Send-to row */}
              <div className="mt-7 flex items-center gap-3 rounded-[18px] bg-white/60 p-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink">
                  <Mark className="h-3.5 w-4 bg-white" />
                </span>
                <span className="text-[13px] text-ink">Send to Aerial Image</span>
                <span className="mono ml-auto text-[9px] text-ink-3">CASA Certified</span>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <input name="first" required placeholder="First name" autoComplete="given-name" className="nfield" />
                <input name="last" placeholder="Last name" autoComplete="family-name" className="nfield" />
              </div>
              <input name="email" type="email" required placeholder="Email" autoComplete="email" className="nfield mt-3" />
              <textarea name="message" rows={4} placeholder="Comment or Message" className="nfield mt-3 resize-none" />

              {/* Send bar */}
              <div className="nglass mt-6 flex items-center gap-2 rounded-full p-1.5">
                <button type="reset" onClick={() => setSvc([site.tagline[0]])} aria-label="Clear form" className="norb flex h-12 w-12 shrink-0 items-center justify-center text-ink">
                  <svg width="14" height="12" viewBox="0 0 14 12" aria-hidden><path d="M5 1L1 5l4 4M1 5h8a4 4 0 010 8" stroke="currentColor" strokeWidth="1.3" fill="none" /></svg>
                </button>
                <button type="submit" disabled={state === "sending"} className="btn btn-primary h-12 flex-1 pl-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-paper text-ink">✓</span>
                  {state === "sending" ? "Sending…" : "Send enquiry"} <Arrow />
                </button>
              </div>
              {state === "error" && <p className="mt-4 text-center text-[13px] text-rec-ink">The form could not be sent. Email {site.email}.</p>}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
