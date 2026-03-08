/**
 * Record a chat conversation demo for every UI framework page.
 *
 * Flow per page:
 *   1. Load page, wait for settle
 *   2. Open chat bubble
 *   3. Type "show me hn posts" and submit
 *   4. Wait for the LLM response + HN component to render
 *   5. Hold 10s extra, then stop
 *
 * Usage:
 *   RECORD_SIZE=small npx tsx scripts/record-chat.ts   # 960x600
 *   npx tsx scripts/record-chat.ts                      # 1440x900
 *
 * Output: recordings-chat/<name>/  (or recordings-chat-sm/)
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

const routes = [
  { name: "primer", path: "/primer" },
  { name: "neobrutalism", path: "/neobrutalism" },
  { name: "carbon", path: "/carbon" },
  { name: "nes", path: "/nes" },
  { name: "polaris", path: "/polaris" },
  { name: "retro", path: "/retro" },
  { name: "daisyui", path: "/daisyui" },
  { name: "mantine", path: "/mantine" },
  { name: "win98", path: "/win98" },
  { name: "chakra", path: "/chakra" },
  { name: "winxp", path: "/winxp" },
  { name: "papercss", path: "/papercss" },
  { name: "pico", path: "/pico" },
  { name: "antd", path: "/antd" },
];

const OUT_DIR = path.resolve(
  __dirname,
  "..",
  SIZE === "small" ? "recordings-chat-sm" : "recordings-chat"
);

/** Hide the Next.js dev tools overlay so it doesn't appear in recordings. */
async function hideNextDevTools(page: Page) {
  await page.evaluate(() => {
    // Hide the Next.js dev indicator and error overlay
    const selectors = [
      "nextjs-portal",
      "[data-nextjs-dialog-overlay]",
      "[data-nextjs-toast]",
      "#__next-build-indicator",
      "#__next-build-watcher",
    ];
    for (const sel of selectors) {
      document.querySelectorAll(sel).forEach((el) => {
        (el as HTMLElement).style.display = "none";
      });
    }
    // Also hide by shadow DOM — the N indicator
    const allElements = document.querySelectorAll("*");
    allElements.forEach((el) => {
      if (
        el.shadowRoot &&
        el.tagName.toLowerCase().startsWith("nextjs-portal")
      ) {
        (el as HTMLElement).style.display = "none";
      }
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

  // Open chat
  const bubble = page.locator('[data-testid="chat-bubble"]');
  if ((await bubble.count()) > 0) {
    await bubble.first().click();
    console.log(`    -> opened chat`);
  } else {
    console.log(`    -> ERROR: no chat bubble found, skipping`);
    await context.close();
    return;
  }

  await page.waitForTimeout(1000);
  await hideNextDevTools(page);

  // Type the message — prefer data-slot, fall back to generic textarea
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

  // Submit — prefer data-slot, fall back to aria-label/text
  let sendBtn = page.locator('[data-slot="message-input-submit"]');
  if ((await sendBtn.count()) === 0) {
    sendBtn = page.locator(
      '[data-slot="message-input-root"] button[aria-label="Send"], [data-slot="message-input-root"] button[type="submit"]'
    ).first();
  }
  await sendBtn.click();
  console.log(`    -> submitted`);

  // Wait for the HN component to appear (up to 2 minutes)
  try {
    await page.waitForFunction(
      () => {
        const body = document.body.innerText;
        return (
          body.includes("Hacker News") ||
          body.includes("hacker news") ||
          body.includes("HN") ||
          document.querySelectorAll('[class*="hn"], [class*="hacker"]').length >
            0
        );
      },
      { timeout: 120000 }
    );
    console.log(`    -> LLM response with HN component rendered`);
  } catch {
    console.log(`    -> WARNING: timed out waiting for HN component`);
  }

  await hideNextDevTools(page);

  // Take a screenshot of the final state
  await page.screenshot({
    path: path.join(outDir, "chat-response.png"),
    fullPage: false,
  });
  console.log(`    -> chat-response.png`);

  // Hold for 10 more seconds
  console.log(`    -> waiting 10s...`);
  await page.waitForTimeout(10000);

  // Close context to finalize video
  await context.close();

  // Rename video
  const videoFiles = fs.readdirSync(outDir).filter((f) => f.endsWith(".webm"));
  if (videoFiles.length > 0) {
    const src = path.join(outDir, videoFiles[0]);
    const dest = path.join(outDir, "video.webm");
    if (src !== dest) fs.renameSync(src, dest);
    console.log(`    -> video.webm`);
  }
}

async function main() {
  console.log(
    `\nRecording chat demos for ${routes.length} pages to ${OUT_DIR}\n`
  );
  console.log(`Viewport: ${VIEWPORT.width}x${VIEWPORT.height}\n`);
  console.log(`Make sure the dev server is running at ${BASE_URL}\n`);

  const browser = await chromium.launch({
    headless: true,
    args: ["--disable-web-security"],
  });

  for (const route of routes) {
    try {
      await recordChat(browser, route);
      console.log(`  Done: ${route.name}\n`);
    } catch (err) {
      console.error(`  FAILED: ${route.name} — ${err}\n`);
    }
  }

  await browser.close();
  console.log(`\nAll chat recordings saved to ${OUT_DIR}\n`);
}

main().catch(console.error);
