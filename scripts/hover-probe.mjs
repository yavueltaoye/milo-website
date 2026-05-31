// Sweeps the cursor over the spiral until a card is hovered, then screenshots
// the pill. Dev-only.
import { chromium } from "playwright";

const browser = await chromium.launch({
  headless: true,
  args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});
const W = 1440, H = 820;
const page = await browser.newPage({ viewport: { width: W, height: H } });
await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded", timeout: 60000 });
try {
  await page.getByRole("button", { name: /Bienvenido al mundo de MILO/i }).click({ timeout: 8000 });
} catch {}
await page.waitForTimeout(3500);

// Pause the idle spin so a hovered card stays put: dispatch wheel up a lot? No —
// instead just sweep points and check for the pill text.
const cols = [0.32, 0.42, 0.5, 0.58, 0.68];
const rows = [0.32, 0.42, 0.5, 0.58, 0.68];
let hit = null;
outer: for (const ry of rows) {
  for (const cx of cols) {
    await page.mouse.move(W * cx, H * ry);
    await page.waitForTimeout(350);
    const txt = await page.evaluate(() => {
      // the pill is the bottom-center paper chip with petroleum text
      const chips = [...document.querySelectorAll(".bg-paper")].filter((e) =>
        getComputedStyle(e).position === "absolute" && /rounded-full/.test(e.className),
      );
      return chips[0]?.textContent?.trim() || "";
    });
    if (txt) { hit = { cx, ry, txt }; break outer; }
  }
}
await page.waitForTimeout(500);
await page.screenshot({ path: "shots/v3-spiral-pill.png" });
console.log("pill hit:", JSON.stringify(hit));
await browser.close();
