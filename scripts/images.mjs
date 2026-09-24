/*
 * assets-raw/site/ → public/img/
 *
 * Originals pulled from aerialimage.com.au (WordPress uploads, full-size —
 * the -768x512 suffixes stripped). Every photo gets a 640 + 1280 webp pair.
 *
 * Run: node scripts/images.mjs
 */
import sharp from "sharp";
import { mkdirSync, readdirSync } from "node:fs";

const RAW = "assets-raw/site";
const OUT = "public/img";
mkdirSync(`${OUT}/logos`, { recursive: true });

const slug = (f) => f.replace(/\.[a-z]+$/i, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");

const LOGOS = new Set([
  "BRM-Logo-Black.png", "CASA-Logo-White.png", "CBRE_WebsiteTile.jpg", "Little-Hinges-Logo.png",
  "VESI-Edited-White.png", "Vewd-Medi.png", "Wiru.png", "auav-logo-1.png", "vidsta-Facebook-Cover-1.png",
]);

for (const f of readdirSync(RAW)) {
  if (!/\.(jpe?g|png)$/i.test(f) || LOGOS.has(f) || /logo|favicon|AerialImage/i.test(f)) continue;
  const meta = await sharp(`${RAW}/${f}`).metadata();
  for (const w of [640, 1280]) {
    await sharp(`${RAW}/${f}`, { limitInputPixels: false })
      .rotate()
      .resize({ width: Math.min(w, meta.width), withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(`${OUT}/${slug(f)}-${w}.webp`);
  }
}

// Client + accreditation logos, trimmed, 2x their display height.
for (const f of LOGOS) {
  await sharp(`${RAW}/${f}`).trim().resize({ height: 160, withoutEnlargement: true }).png().toFile(`${OUT}/logos/${slug(f)}.png`);
}

// Aerial Image mark: their white 8000px PNG → trimmed alpha mask, used via CSS mask so it takes any colour.
await sharp(`${RAW}/logo-white-orig.png`).trim().resize({ height: 240 }).png().toFile(`${OUT}/ai-mark.png`);

// OG card + favicons from the FPV coast frame.
await sharp("public/video/hero-poster.jpg").resize(1200, 630, { fit: "cover" }).jpeg({ quality: 82 }).toFile(`${OUT}/og.jpg`);
for (const s of [32, 180, 192]) {
  const pad = Math.round(s * 0.18);
  const mark = await sharp(`${RAW}/logo-white-orig.png`).trim().resize(s - pad * 2, s - pad * 2, { fit: "contain", background: "#0000" }).png().toBuffer();
  await sharp({ create: { width: s, height: s, channels: 4, background: "#0d0f12" } })
    .composite([{ input: mark, gravity: "center" }])
    .png()
    .toFile(`${OUT}/icon-${s}.png`);
}
console.log("done");
