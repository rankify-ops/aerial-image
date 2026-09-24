import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import { Hero2 } from "@/components/v2/Hero2";
import { Clients } from "@/components/Clients";
import { Statement } from "@/components/Statement";
import { Reel } from "@/components/Reel";
import { Work } from "@/components/Work";
import { Services } from "@/components/Services";
import { Credentials } from "@/components/Credentials";
import { Contact } from "@/components/Contact";

/*
 * Variation 2 — full-bleed footage hero with "neu glass" panels and a fine
 * serif. The shared sections below are re-skinned by the .v2 rules in
 * globals.css; / (variation 1) is untouched.
 */
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Variation 2",
  robots: { index: false, follow: false },
};

export default function V2() {
  return (
    <div className={`v2 ${serif.variable}`}>
      <Hero2 />
      <Clients />
      <Statement />
      <Reel />
      <Work />
      <Services />
      <Credentials />
      <Contact />
    </div>
  );
}
