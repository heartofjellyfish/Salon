// Generates quiet, tonal color-field placeholders for each painting so the room
// looks intentional before real artwork exists. Re-run after editing the manifest:
//
//   node scripts/generate-placeholders.mjs
//
// To use real artwork instead, drop a high-res file into public/paintings/ and
// point the painting's `imageUrl` (in src/data/rooms.ts) at it — these SVGs are
// only fallbacks and can be deleted once every work has a real image.

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "..", "public", "paintings");

// id → dominant color, kept in sync with src/data/rooms.ts
const works = [
  { id: "morning-unmade", color: "#cdbb9c" },
  { id: "white-bowl", color: "#dccfba" },
  { id: "long-afternoon", color: "#bd9f78" },
  { id: "open-window-noon", color: "#d2c4a8" },
  { id: "north-light", color: "#bcc4c5" },
  { id: "folded-cloth", color: "#c6cac7" },
  { id: "quiet-corner", color: "#b0b7b8" },
  { id: "two-vessels", color: "#c9cecb" },
  { id: "green-shade", color: "#9aa583" },
  { id: "threshold", color: "#abb49a" },
  { id: "wet-stones", color: "#909a8c" },
  { id: "garden-edge", color: "#a8b18f" },
  { id: "after-rain", color: "#939e88" },
];

const hexToRgb = (hex) => {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};
const channel = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
const mix = ([r, g, b], [tr, tg, tb], amt) =>
  `#${channel(r + (tr - r) * amt)}${channel(g + (tg - g) * amt)}${channel(b + (tb - b) * amt)}`;
const lighten = (hex, amt) => mix(hexToRgb(hex), [255, 255, 255], amt);
const darken = (hex, amt) => mix(hexToRgb(hex), [0, 0, 0], amt);

const svg = (color) => {
  const top = lighten(color, 0.2);
  const midUpper = lighten(color, 0.04);
  const horizon = darken(color, 0.16);
  const deep = darken(color, 0.3);
  const glow = lighten(color, 0.42);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">
  <defs>
    <linearGradient id="field" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${top}"/>
      <stop offset="0.54" stop-color="${midUpper}"/>
      <stop offset="0.63" stop-color="${horizon}"/>
      <stop offset="1" stop-color="${deep}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.32" cy="0.26" r="0.85">
      <stop offset="0" stop-color="${glow}" stop-opacity="0.8"/>
      <stop offset="0.55" stop-color="${glow}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vignette" cx="0.5" cy="0.48" r="0.75">
      <stop offset="0.58" stop-color="#000000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0.2"/>
    </radialGradient>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
  </defs>
  <rect width="1200" height="1200" fill="url(#field)"/>
  <rect width="1200" height="1200" fill="url(#glow)"/>
  <rect width="1200" height="1200" fill="url(#vignette)"/>
  <rect width="1200" height="1200" filter="url(#grain)" opacity="0.05"/>
</svg>
`;
};

mkdirSync(outDir, { recursive: true });
for (const work of works) {
  writeFileSync(join(outDir, `${work.id}.svg`), svg(work.color));
}
console.log(`Wrote ${works.length} placeholder paintings to ${outDir}`);
