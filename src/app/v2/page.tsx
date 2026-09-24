import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import { Hero2 } from "@/components/v2/Hero2";
import { VideoWall } from "@/components/v2/VideoWall";
import { FlightDeck } from "@/components/v2/FlightDeck";
import { Deck } from "@/components/v2/Deck";
import { Ledger } from "@/components/v2/Ledger";
import { Board } from "@/components/v2/Board";
import { ContactApp } from "@/components/v2/ContactApp";

/*
 * Variation 2 — its own sections, built from the fintech-app reference Tom
 * sent (juicelab.uiux): a tilted wall of footage, a hand-held phone
 * turning to face you, a wallet card stack, a transactions list, tilted
 * isometric UI, and the transfer screen as the form. / (variation 1) is
 * untouched.
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
      <VideoWall />
      <FlightDeck />
      <Deck />
      <Ledger />
      <Board />
      <ContactApp />
    </div>
  );
}
