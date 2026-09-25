import type { Metadata, Viewport } from "next";
import { Inter, Fragment_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { VideoModal } from "@/components/VideoModal";
import { MobileCTA } from "@/components/MobileCTA";
import { Preloader } from "@/components/Preloader";
import { site } from "@/content/site";
import { asset } from "@/lib/basePath";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-inter",
  display: "swap",
});

const mono = Fragment_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-mono-face",
  display: "swap",
});

const title = "Aerial Image – FPV • Videography • Photography • Commercial";
// Their own lines (home, creative).
const description =
  "Aerial Image specialise in FPV (First-Person-View) cinematic capture and piloting services. CASA certified (ReOC, RePL, AROC & EVLOS) and fully insured.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: "%s | Aerial Image" },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: site.name,
    url: site.url,
    title,
    description,
    images: [{ url: asset("/img/og.jpg"), width: 1200, height: 630 }],
  },
  icons: {
    icon: [{ url: asset("/img/icon-32.png"), sizes: "32x32" }, { url: asset("/img/icon-192.png"), sizes: "192x192" }],
    apple: asset("/img/icon-180.png"),
  },
};

export const viewport: Viewport = { themeColor: "#f3f3ef" };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.name,
  url: site.url,
  email: site.email,
  areaServed: "AU",
  image: `${site.url}/img/og.jpg`,
  sameAs: [site.instagram, site.linkedin],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" className={`${inter.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "var d=document.documentElement;d.classList.add('js','preloading');setTimeout(function(){d.classList.remove('preloading')},9000)" }} />
        <link rel="preload" as="image" href={asset("/video/hero-poster.jpg")} />
      </head>
      <body>
        <Preloader />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Header />
        <main>{children}</main>
        <Footer />
        <VideoModal />
        <MobileCTA />
      </body>
    </html>
  );
}
