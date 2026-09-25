/*
 * ALL COPY IS THE CLIENT'S OWN WORDS, taken from aerialimage.com.au
 * (home, creative, commercial, contact-us). Do not reword, "correct" or add
 * to it. The only words that are ours are UI labels (nav, buttons, form
 * placeholders) and the short shot descriptors on the FPV reel.
 */

export const site = {
  name: "Aerial Image",
  url: "https://aerialimage.com.au",
  email: "info@aerialimage.com.au",
  instagram: "https://www.instagram.com/aerialimageofficial/",
  instagramHandle: "@aerialimageofficial",
  linkedin: "https://linkedin.com/company/aerialimage",
  youtube: "https://www.youtube.com/channel/UCk5-P4a0Hd8-R3ypHps9mCQ",
  // Home hero line.
  tagline: ["FPV", "Videography", "Photography", "Commercial"],
  showreel: "bDZVGZLOdZA",
};

export const nav = [
  ["FPV", "#fpv"],
  ["Work", "#work"],
  ["Services", "#services"],
  ["Credentials", "#credentials"],
] as const;

// Creative page — Marketing & Promotional Content.
export const fpvStatement =
  "FPV Cinematic Media is becoming extremely popular across the creative industry. From films to marketing material, this style of immersive and captivating content brings a whole new perspective to your project.";

// Home — Creative Services.
export const creativeIntro =
  "Aerial Image are passionate about Creative Works. Having had more than 10 years in the Photo/Video/Audio industry, we are perfectionists when it comes to media. With the combination of ground and aerial imagery, Aerial Image specialise in FPV (First-Person-View) cinematic capture and piloting services. Every project is carefully planned and captured to ensure the final deliverables are captivating and on point.";

// Home — About Us.
export const about =
  "Aerial Image focuses on bringing drone technology, digital marketing and client services to the top of the list. With the love and passion of technology, photography and videography, Aerial Image deliver creative services across the board to any project. Being at the forefront of emerging technology, having industry experience, being fully licensed and insured, Aerial Images drive to deliver above and beyond client expectations, is unsurpassed. We believe in a quality over quantity approach";

// FPV reel: loops cut from the 2024 Website Main showreel.
export const reel = [
  { slug: "fpv-coast", label: "Coastline" },
  { slug: "fpv-canola", label: "Open field" },
  { slug: "fpv-interior", label: "Office interior" },
  { slug: "fpv-stadium", label: "Stadium" },
  { slug: "fpv-lighthouse", label: "Headland" },
  { slug: "fpv-bar", label: "Hospitality" },
  { slug: "fpv-boat", label: "Top-down" },
  { slug: "fpv-school", label: "Campus" },
];

// Home — Recent Projects (titles as published on their YouTube embeds).
export const projects = [
  { id: "y08uG9t57uo", slug: "p-cbre-l8", title: "CBRE - 818 Bourke St - Level 8", client: "CBRE" },
  { id: "H4qmCY8Zn8I", slug: "p-flinders", title: "452 Flinders St - Commercial Office Space Promo", client: "Commercial" },
  { id: "4PbgFEQxals", slug: "p-alpine", title: "Alpine Hotel Warburton Promo", client: "Hospitality" },
  { id: "8m8P0btFU2c", slug: "p-portmelb", title: "Port Melbourne Primary Promo", client: "Education" },
  { id: "yanTU9G9Gus", slug: "p-wds", title: "WDS Wurdi Youang", client: "Wiru Drone Solutions" },
  { id: "l8oCeA8U-48", slug: "p-cbre-l6", title: "CBRE 818 Bourke St Level 6 (Suite 2)", client: "CBRE" },
  { id: "0e9DGg650N4", slug: "p-francis", title: "Francis Winifred Promo", client: "Hospitality" },
];

// Home — "We have had the pleasure of working with –"
export const clients = [
  { src: "cbre-websitetile", alt: "CBRE" },
  { src: "little-hinges-logo", alt: "Little Hinges" },
  { src: "auav-logo-1", alt: "AUAV" },
  { src: "wiru", alt: "Wiru Drone Solutions" },
  { src: "vewd-medi", alt: "Vewd Media" },
  { src: "vidsta-facebook-cover-1", alt: "Vidsta" },
  { src: "brm-logo-black", alt: "Black Raven Media" },
];

// Home — the four pillars.
export const pillars = [
  {
    title: "CASA Certified",
    body: "Aerial Image and its pilots are approved by CASA (ReOC, RePL, AROC & EVLOS) to operate within Australia. We are also fully insured.",
  },
  {
    title: "Qualification & Compliance",
    body: "We appreciate the dynamics of every project and clients needs. Being serious about compliance, having all necessary industry qualifications are a must.",
  },
  {
    title: "Quality over Quantity",
    body: "We believe in a Quality over Quantity approach. Being passionate about our craft, we are personally invested in every project. Communication is key.",
  },
  {
    title: "Skills & Experience",
    body: "Having years of combined experience in the creative (audio/video/photo) and the commercial (drone technology) sectors, we are equipped with the skillsets to deliver.",
  },
];

export const licences = ["ReOC", "RePL", "AROC", "EVLOS"];

// Creative + Commercial pages. Group headings and item lists verbatim.
export const services = [
  {
    key: "creative",
    name: "Creative",
    groups: [
      {
        title: "FPV Video / Piloting",
        lead: fpvStatement,
        items: ["FPV Cinematic Media", "Films", "Marketing material"],
        img: "8pix2617-hdr-2",
        video: "fpv-coast",
      },
      {
        title: "Videography & Photography",
        lead: "Aerial Image provide a wide range of Videography and Photography services. Focusing on clients requirements and a quality over quantity approach in all areas, these services include;",
        items: ["General Videography & Photography", "Social Media Content", "Specific Aerial Digital Content", "Events & PR"],
        img: "8pix2540",
      },
      {
        title: "Marketing & Promotional Content",
        lead: "Being adaptable to client needs, Aerial Image provide detailed content for marketing, products and a wide array of promotional media.",
        items: [
          "Business Marketing / Promotions",
          "Product Videography / Photography (Studio / Onsite)",
          "Social/Web Content",
          "Company/Business Showreels",
        ],
        img: "franwinubermenu-5-of-8",
      },
      {
        title: "Property / Development & Construction",
        lead: "Aerial imagery and video are almost becoming a mandatory viewpoint for Real Estate and Property Development. The Construction industry is also taking advantage of the new technology to show in detail building stages and amazing final showreels.",
        items: [
          "Real Estate (Aerial/Internal/External / Floor and Site Plans)",
          "Property Development (Block highlights and size)",
          "Construction/Demolition Showreels (Hyper Lapse etc)",
        ],
        img: "5thomasstdaytodusk",
      },
    ],
  },
  {
    key: "commercial",
    name: "Commercial",
    groups: [
      {
        title: "Asset Inspections",
        lead: "Obtaining high quality aerial imagery or video can also provide invaluable information in regards condition, position, degradation, movement and other variables that require regular maintenance to assets.",
        items: ["Distribution / Transmission Power", "Roof Inspections", "Solar and wind generation assets", "Safety assessments"],
        img: "powerpolezoommavic3ex4",
      },
      {
        title: "Photogrammetry",
        lead: "Emerging technologies like Photogrammetry (3D modelling) can provide priceless data to multiple parties at once. Using this technology, you can assess, measure, view and report on any asset.",
        items: ["Assess", "Measure", "View", "Report"],
        img: "photogram-example-web",
      },
      {
        title: "Live Remote Feed",
        lead: "Engineers, inspectors and consultants alike can inspect and view a video feed remotely from our aerial assets, anywhere. This enables an extremely fast, cost efficient solution for a vast variety of situations.",
        items: ["Real time", "Remote", "Cost efficient"],
        img: "dji-0189",
      },
    ],
  },
];

// Stills strip — their photography from the Creative + Commercial pages.
export const stills = [
  "dji-0793-hdr",
  "8pix7990",
  "franwinubermenu-22-of-29",
  "tbp-46-chevoit-dusk",
  "dji-0050-hdr",
  "8pix8360",
  "dji-0007",
  "8pix0730-edit",
  "dji-0798",
  "8pix8141",
];

/*
 * CLIENT REVIEWS — PENDING.
 * No public reviews exist for Aerial Image (searched Google/Facebook, none on
 * their site), and we never invent them. Until this list has real entries the
 * review sections render clearly-marked placeholder slots.
 * Add each review VERBATIM from the client (Google / email / LinkedIn), e.g.
 *   { quote: "…", name: "Jane Smith", role: "Leasing Director", company: "CBRE", rating: 5, source: "Google" },
 * The first entry with `featured: true` (or the first entry) fills the pull-quote section.
 */
export type Review = {
  quote: string;
  name: string;
  role?: string;
  company?: string;
  rating?: number;
  source?: string;
  featured?: boolean;
};
export const reviews: Review[] = [];
