import type { Metadata } from "next";
import { HeroAlt } from "@/components/alt/HeroAlt";
import { Clients } from "@/components/Clients";
import { ServiceTabs } from "@/components/ServiceTabs";
import { Statement } from "@/components/Statement";
import { Reel } from "@/components/Reel";
import { Work } from "@/components/Work";
import { Credentials } from "@/components/Credentials";
import { Contact } from "@/components/Contact";
import { ReviewCarousel, ReviewFeature, ReviewWall } from "@/components/Reviews";

/*
 * ALT version — same page as / (variation 1) except the hero: full-screen
 * FPV footage dressed as a goggle OSD, with the headline + buttons in a
 * frosted-glass panel floating over it. / is untouched.
 */
export const metadata: Metadata = {
  title: "ALT",
  robots: { index: false, follow: false },
};

export default function Alt() {
  return (
    <>
      <HeroAlt />
      <Clients />
      <ServiceTabs />
      <ReviewFeature />
      <Statement />
      <Reel />
      <Work />
      <ReviewCarousel />
      <Credentials />
      <ReviewWall />
      <Contact />
    </>
  );
}
