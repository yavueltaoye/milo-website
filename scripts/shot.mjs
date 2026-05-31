// Dev-only screenshot helper (headless Chromium w/ software WebGL).
//   node scripts/shot.mjs <path> <enter:0|1> <out> [clickText] [hoverText] [hoverCenter:0|1]
import { chromium } from "playwright";

const path = process.argv[2] ?? "/";
const enter = (process.argv[3] ?? "1") === "1";
const out = process.argv[4] ?? "shots/out.png";
const clickText = process.argv[5] ?? "";
const hoverText = process.argv[6] ?? "";
const hoverCenter = (process.argv[7] ?? "0") === "1";

const browser = await chromium.launch({
  headless: true,
  args: [
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--ignore-gpu-blocklist",
  ],
});
const W = 1440;
const H = 820;
const page = await browser.newPage({
  viewport: { width: W, height: H },
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
    await page
      .getByRole("button", { name: /Bienvenido al mundo de MILO/i })
      .click({ timeout: 8000 });
  } catch {
    /* not a portal page */
  }
}
await page.waitForTimeout(3500);
if (clickText) {
  try {
    await page.getByText(clickText, { exact: false }).first().click({ timeout: 6000 });
    await page.waitForTimeout(1200);
  } catch (e) {
    console.log("clickText failed:", String(e).slice(0, 80));
  }
}
if (hoverText) {
  try {
    await page.getByText(hoverText, { exact: false }).first().hover({ timeout: 6000 });
    await page.waitForTimeout(1000);
  } catch (e) {
    console.log("hoverText failed:", String(e).slice(0, 80));
  }
}
if (hoverCenter) {
  await page.mouse.move(W / 2, H / 2 - 10);
  await page.waitForTimeout(1000);
}
await page.waitForTimeout(800);
await page.screenshot({ path: out });
console.log("shot:", out, "| console errors:", errors.length);
for (const e of errors.slice(0, 6)) console.log("  -", e);
await browser.close();
