// Renders PNG icons from the brand mark. Run: node scripts/generate-icons.mjs
import sharp from "sharp";
import { mkdir, readFile } from "node:fs/promises";

const FOREST = "#173D32";
const mark = await readFile(new URL("../public/favicon.svg", import.meta.url), "utf8");

// Maskable icons need the mark inside the central safe zone on a full-bleed background.
const maskable = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="${FOREST}"/>
  <g transform="translate(9.6 9.6) scale(0.7)">${mark.replace(/<svg[^>]*>|<\/svg>/g, "").replace(/<rect[^>]*\/>/, "")}</g>
</svg>`;

await mkdir(new URL("../public/icons/", import.meta.url), { recursive: true });
const out = (name) => new URL(`../public/icons/${name}`, import.meta.url).pathname;

await sharp(Buffer.from(mark), { density: 600 }).resize(192, 192).png().toFile(out("icon-192.png"));
await sharp(Buffer.from(mark), { density: 600 }).resize(512, 512).png().toFile(out("icon-512.png"));
await sharp(Buffer.from(mark), { density: 600 }).resize(180, 180).png().toFile(out("apple-touch-icon.png"));
await sharp(Buffer.from(mark), { density: 600 }).resize(32, 32).png().toFile(out("favicon-32.png"));
await sharp(Buffer.from(maskable), { density: 600 }).resize(512, 512).png().toFile(out("icon-maskable-512.png"));
console.log("Icons written to public/icons");
