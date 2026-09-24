import { Hero } from "@/components/Hero";
import { Clients } from "@/components/Clients";
import { Statement } from "@/components/Statement";
import { Reel } from "@/components/Reel";
import { Work } from "@/components/Work";
import { Services } from "@/components/Services";
import { Credentials } from "@/components/Credentials";
import { Contact } from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Clients />
      <Statement />
      <Reel />
      <Work />
      <Services />
      <Credentials />
      <Contact />
    </>
  );
}
