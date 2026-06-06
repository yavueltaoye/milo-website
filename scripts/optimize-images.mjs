/**
 * One-shot image optimizer for the project/team photography in public/images.
 *
 * The source assets ship at camera resolution (single files up to ~55 MB), which
 * bloats the deploy and can OOM the Next image optimizer. This caps the longest
 * side at MAX px and re-encodes (mozjpeg for JPEG, max-compression for PNG),
 * overwriting in place only when the result is actually smaller. Next.js still
 * serves AVIF/WebP at request time on top of these.
 *
 * Run: node scripts/optimize-images.mjs
 */
import { readdir, stat, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve("public/images");
const MAX = 2400;
const EXT = new Set([".jpg", ".jpeg", ".png"]);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else yield p;
  }
}

const fmt = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

let totalBefore = 0;
let totalAfter = 0;
let changed = 0;
let scanned = 0;

for await (const file of walk(ROOT)) {
  const ext = path.extname(file).toLowerCase();
  if (!EXT.has(ext)) continue;
  scanned++;

  const before = (await stat(file)).size;
  // Read the whole file into a buffer first so sharp holds no handle on the
  // path — required to safely overwrite the same file on Windows/OneDrive.
  const input = await readFile(file);
  const meta = await sharp(input, { failOn: "none" }).metadata();

  let pipe = sharp(input, { failOn: "none" }).rotate();
  if (Math.max(meta.width ?? 0, meta.height ?? 0) > MAX) {
    pipe = pipe.resize({ width: MAX, height: MAX, fit: "inside", withoutEnlargement: true });
  }
  pipe =
    ext === ".png"
      ? pipe.png({ compressionLevel: 9, effort: 8 })
      : pipe.jpeg({ quality: 78, mozjpeg: true });

  const buf = await pipe.toBuffer();
  totalBefore += before;

  if (buf.length < before) {
    await writeFile(file, buf);
    totalAfter += buf.length;
    changed++;
    console.log(`✓ ${path.relative(ROOT, file)}  ${fmt(before)} → ${fmt(buf.length)}`);
  } else {
    totalAfter += before;
  }
}

console.log(
  `\nDone. ${changed}/${scanned} re-encoded. ${fmt(totalBefore)} → ${fmt(totalAfter)} ` +
    `(saved ${fmt(totalBefore - totalAfter)}).`,
);
