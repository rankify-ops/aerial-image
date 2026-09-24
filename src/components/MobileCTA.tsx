"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { Arrow } from "./ui";

// Phone-only bottom bar: appears after the hero, hides once the form is on screen.
export function MobileCTA() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const contact = document.getElementById("contact");
    let formVisible = false;
    const io = new IntersectionObserver(([e]) => {
      formVisible = e.isIntersecting;
      on();
    });
    if (contact) io.observe(contact);
    const on = () => setShow(window.scrollY > window.innerHeight * 0.9 && !formVisible);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", on);
    };
  }, []);
  return (
    <div
      className={`fixed inset-x-3 bottom-3 z-40 transition-all duration-500 sm:hidden ${show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"}`}
    >
      <div className="glass flex items-center gap-2 rounded-full p-1.5">
        <a href={`mailto:${site.email}`} className="mono flex-1 truncate px-4 text-[10px] text-ink-2">
          {site.email}
        </a>
        <a href="#contact" className="btn btn-primary h-11 px-5">
          Enquiries <Arrow />
        </a>
      </div>
    </div>
  );
}
