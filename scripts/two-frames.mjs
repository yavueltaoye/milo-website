import { chromium } from "playwright";
const browser = await chromium.launch({
  headless: true,
  args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 820 } });
await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded", timeout: 60000 });
try { await page.getByRole("button", { name: /Bienvenido al mundo de MILO/i }).click({ timeout: 8000 }); } catch {}
await page.waitForTimeout(3000);
await page.screenshot({ path: "shots/frameA.png" });
await page.waitForTimeout(3000);
await page.screenshot({ path: "shots/frameB.png" });
console.log("two frames captured");
await browser.close();
