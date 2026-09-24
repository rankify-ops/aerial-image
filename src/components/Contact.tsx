"use client";

import { useState } from "react";
import { site } from "@/content/site";
import { Arrow, Kicker, Loop, Reveal } from "./ui";

/*
 * Posts to Web3Forms once the client's access key is set as the
 * NEXT_PUBLIC_WEB3FORMS_KEY build env (add it to deploy.yml too). Until then
 * the form opens a pre-filled email to info@ instead, so it is never a dead end.
 * Fields mirror their current WPForms form (First, Last, Email, Comment or
 * Message) plus the service they want, from their own tagline.
 */
const KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "";

export function Contact() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: Record<string, string> = {
      name: `${fd.get("first") || ""} ${fd.get("last") || ""}`.trim(),
      email: String(fd.get("email") || ""),
      service: fd.getAll("service").join(", "),
      message: String(fd.get("message") || ""),
    };
    const subject = `Enquiry — ${data.service || "General"}`;

    if (!KEY) {
      const body = Object.entries(data)
        .filter(([, v]) => v)
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n");
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
      if (res.ok) (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({ event: "generate_lead" });
    } catch {
      setState("error");
    }
  }

  return (
    <section id="contact" className="relative overflow-hidden bg-white">
      <div className="wrap grid gap-14 py-28 sm:py-36 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Kicker index="06">Contact Us</Kicker>
          <h2 className="display mt-8">
            Communication <span className="dim">is key.</span>
          </h2>
          <p className="mt-8 max-w-[420px] text-[16px] leading-relaxed">
            Being passionate about our craft, we are personally invested in every project.
          </p>

          <div className="relative mt-12 hidden aspect-[16/10] overflow-hidden rounded-[22px] bg-ink lg:block">
            <Loop slug="fpv-lighthouse" className="absolute inset-0 h-full w-full object-cover" />
            <span className="mono absolute left-4 top-4 flex items-center gap-2 text-[10px] text-white">
              <span className="rec-dot blink" /> Live
            </span>
          </div>

          <dl className="mt-10 border-t border-ink">
            {[
              ["Email", site.email, `mailto:${site.email}`],
              ["Instagram", site.instagramHandle, site.instagram],
              ["LinkedIn", "Aerial Image", site.linkedin],
            ].map(([k, v, href]) => (
              <div key={k} className="flex items-baseline justify-between gap-4 border-b border-rule py-5">
                <dt className="mono text-ink-3">{k}</dt>
                <dd>
                  <a href={href} className="text-[18px] tracking-tight text-ink transition-colors hover:text-rec-ink sm:text-[20px]" {...(href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}>
                    {v}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <Reveal className="lg:col-span-6 lg:col-start-7">
          {state === "sent" ? (
            <div className="rounded-[26px] border border-rule bg-paper p-10">
              <p className="text-[32px] leading-tight tracking-tight text-ink">Thank you. Your enquiry has been sent.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="rounded-[26px] border border-rule bg-paper p-6 sm:p-10">
              <div className="flex items-center justify-between border-b border-rule pb-5">
                <p className="mono flex items-center gap-3 text-ink">
                  <span className="rec-dot" /> Enquiries
                </p>
                <p className="mono text-[10px] text-ink-3">{site.email}</p>
              </div>

              <fieldset className="mt-8">
                <legend className="mono text-ink-3">I&rsquo;m after</legend>
                <div className="mt-4 flex flex-wrap gap-2">
                  {site.tagline.map((s, i) => (
                    <label key={s}>
                      <input type="checkbox" name="service" value={s} defaultChecked={i === 0} className="peer sr-only" />
                      <span className="chip mono text-[10.5px]">{s}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="mt-6 grid gap-x-8 sm:grid-cols-2">
                <label className="block">
                  <span className="sr-only">First name</span>
                  <input name="first" required placeholder="First name" autoComplete="given-name" className="field" />
                </label>
                <label className="block">
                  <span className="sr-only">Last name</span>
                  <input name="last" placeholder="Last name" autoComplete="family-name" className="field" />
                </label>
              </div>
              <label className="block">
                <span className="sr-only">Email</span>
                <input name="email" type="email" required placeholder="Email" autoComplete="email" className="field" />
              </label>
              <label className="block">
                <span className="sr-only">Comment or Message</span>
                <textarea name="message" rows={4} placeholder="Comment or Message" className="field resize-none" />
              </label>

              <button type="submit" disabled={state === "sending"} className="btn btn-primary mt-10 w-full">
                {state === "sending" ? "Sending…" : "Send enquiry"} <Arrow />
              </button>
              {state === "error" && (
                <p className="mt-4 text-[14px] text-rec-ink">The form could not be sent. Email {site.email}.</p>
              )}
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
