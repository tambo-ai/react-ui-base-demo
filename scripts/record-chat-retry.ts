/**
 * Re-record specific pages for testing.
 * Usage: ROUTES=nes,antd RECORD_SIZE=small npx tsx scripts/record-chat-retry.ts
 */

import { chromium, type Page } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const SIZE = process.env.RECORD_SIZE ?? "large";
const VIEWPORT =
  SIZE === "small"
    ? { width: 960, height: 600 }
    : { width: 1440, height: 900 };

const routeNames = (process.env.ROUTES || "nes,polaris,retro,antd").split(",");
const routes = routeNames.map((name) => ({
  name: name.trim(),
  path: `/${name.trim()}`,
}));

const OUT_DIR = path.resolve(
  __dirname,
  "..",
  SIZE === "small" ? "recordings-chat-sm" : "recordings-chat"
);

async function hideNextDevTools(page: Page) {
  await page.evaluate(() => {
    document
      .querySelectorAll(
        'nextjs-portal, [data-nextjs-dialog-overlay], [data-nextjs-toast], #__next-build-indicator, #__next-build-watcher'
      )
      .forEach((el) => ((el as HTMLElement).style.display = "none"));
    document.querySelectorAll("*").forEach((el) => {
      if (el.shadowRoot && el.tagName.toLowerCase().startsWith("nextjs-portal"))
        (el as HTMLElement).style.display = "none";
    });
  });
}

async function recordChat(
  browser: Awaited<ReturnType<typeof chromium.launch>>,
  route: (typeof routes)[number]
) {
  const outDir = path.join(OUT_DIR, route.name);
  fs.mkdirSync(outDir, { recursive: true });

  const context = await browser.newContext({
    viewport: VIEWPORT,
    recordVideo: { dir: outDir, size: VIEWPORT },
  });
  const page = await context.newPage();

  console.log(`  Loading ${route.name} (${route.path})...`);
  await page.goto(`${BASE_URL}${route.path}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await hideNextDevTools(page);

  const bubble = page.locator('[data-testid="chat-bubble"]');
  if ((await bubble.count()) > 0) {
    await bubble.first().click();
    console.log(`    -> opened chat`);
  } else {
    console.log(`    -> ERROR: no chat bubble found`);
    await context.close();
    return;
  }

  await page.waitForTimeout(1000);
  await hideNextDevTools(page);

  // Type — prefer data-slot, fall back to generic textarea
  let textarea = page.locator('[data-slot="message-input-textarea"]');
  if ((await textarea.count()) === 0) {
    textarea = page.locator('[data-slot="message-input-root"] textarea').first();
  }
  if ((await textarea.count()) === 0) {
    textarea = page.locator("textarea").first();
  }
  await textarea.fill("show me hn posts");
  console.log(`    -> typed message`);
  await page.waitForTimeout(500);

  // Submit — prefer data-slot, fall back
  let sendBtn = page.locator('[data-slot="message-input-submit"]');
  if ((await sendBtn.count()) === 0) {
    sendBtn = page.locator(
      '[data-slot="message-input-root"] button[aria-label="Send"], [data-slot="message-input-root"] button[type="submit"]'
    ).first();
  }
  await sendBtn.click();
  console.log(`    -> submitted`);

  try {
    await page.waitForFunction(
      () => {
        const body = document.body.innerText;
        return body.includes("Hacker News") || body.includes("hacker news") || body.includes("HN");
      },
      { timeout: 120000 }
    );
    console.log(`    -> LLM response rendered`);
  } catch {
    console.log(`    -> WARNING: timed out`);
  }

  await hideNextDevTools(page);
  await page.screenshot({ path: path.join(outDir, "chat-response.png"), fullPage: false });
  console.log(`    -> chat-response.png`);
  console.log(`    -> waiting 10s...`);
  await page.waitForTimeout(10000);
  await context.close();

  const videoFiles = fs.readdirSync(outDir).filter((f) => f.endsWith(".webm"));
  if (videoFiles.length > 0) {
    const src = path.join(outDir, videoFiles[0]);
    const dest = path.join(outDir, "video.webm");
    if (src !== dest) fs.renameSync(src, dest);
    console.log(`    -> video.webm`);
  }
}

async function main() {
  console.log(`Recording ${routes.length} pages to ${OUT_DIR}\n`);
  const browser = await chromium.launch({ headless: true, args: ["--disable-web-security"] });

  for (const route of routes) {
    try {
      await recordChat(browser, route);
      console.log(`  Done: ${route.name}\n`);
    } catch (err) {
      console.error(`  FAILED: ${route.name} — ${err}\n`);
    }
  }

  await browser.close();
}

main().catch(console.error);
