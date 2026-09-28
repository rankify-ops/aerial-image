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
 * ALT 2 — identical to /alt, but with the normal system cursor (arrow, and
 * the pointer hand over anything clickable) instead of the custom cursor.
 */
export const metadata: Metadata = {
  title: "ALT 2",
  robots: { index: false, follow: false },
};

export default function Alt2() {
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
