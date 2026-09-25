import { Hero } from "@/components/Hero";
import { Clients } from "@/components/Clients";
import { ServiceTabs } from "@/components/ServiceTabs";
import { Statement } from "@/components/Statement";
import { Reel } from "@/components/Reel";
import { Work } from "@/components/Work";
import { Credentials } from "@/components/Credentials";
import { Contact } from "@/components/Contact";
import { ReviewCarousel, ReviewFeature, ReviewWall } from "@/components/Reviews";

export default function Home() {
  return (
    <>
      <Hero />
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
