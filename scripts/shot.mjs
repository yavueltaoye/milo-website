// Dev-only screenshot helper: drives a headless Chromium (software WebGL) so we
// can actually see the WebGL constellation. Usage:
//   node scripts/shot.mjs <path> <enter:0|1> <outfile>
import { chromium } from "playwright";

const path = process.argv[2] ?? "/";
const enter = (process.argv[3] ?? "1") === "1";
const out = process.argv[4] ?? "shots/out.png";

const browser = await chromium.launch({
  headless: true,
  args: [
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--ignore-gpu-blocklist",
  ],
});
const page = await browser.newPage({
  viewport: { width: 1440, height: 820 },
  deviceScaleFactor: 1,
});
const errors = [];
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));

await page.goto("http://localhost:3000" + path, {
  waitUntil: "domcontentloaded",
  timeout: 60000,
});
if (enter) {
  try {
    await page.getByRole("button", { name: /Bienvenido al mundo de MILO/i }).click({ timeout: 8000 });
  } catch {
    /* not on a portal page */
  }
}
await page.waitForTimeout(5000);
await page.screenshot({ path: out });
console.log("shot:", out, "| console errors:", errors.length);
for (const e of errors.slice(0, 8)) console.log("  -", e);
await browser.close();
