/**
 * Record raw demo footage for every UI framework page.
 *
 * Usage:
 *   1. Start the dev server:  npm run dev
 *   2. In another terminal:   npm run record
 *
 * Output: recordings/<name>/  with video.webm, dashboard.png, chat-open.png
 *
 * Prerequisites:
 *   npm install -D @playwright/test
 *   npx playwright install chromium
 */

import { chromium, type Page } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import { routes, type Route } from "./routes";

/** Hide the Next.js dev tools overlay so it doesn't appear in recordings. */
async function hideNextDevTools(page: Page) {
  await page.evaluate(() => {
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
    document.querySelectorAll("*").forEach((el) => {
      if (
        el.shadowRoot &&
        el.tagName.toLowerCase().startsWith("nextjs-portal")
      ) {
        (el as HTMLElement).style.display = "none";
      }
    });
  });
}

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";

const SIZE = process.env.RECORD_SIZE ?? "large"; // "large" (1440x900) or "small" (960x600)
const VIEWPORT =
  SIZE === "small"
    ? { width: 960, height: 600 }
    : { width: 1440, height: 900 };


const RECORDINGS_DIR = path.resolve(
  __dirname,
  "..",
  SIZE === "small" ? "recordings-sm" : "recordings"
);

/**
 * Try multiple selector strategies to find the chat bubble button.
 * Returns null if none found (e.g. landing page).
 */
async function findChatBubble(page: Page) {
  const bubble = page.locator('[data-testid="chat-bubble"]');
  if ((await bubble.count()) > 0) return bubble.first();
  return null;
}

async function recordRoute(
  browser: Awaited<ReturnType<typeof chromium.launch>>,
  route: Route
) {
  const outDir = path.join(RECORDINGS_DIR, route.name);
  fs.mkdirSync(outDir, { recursive: true });

  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 4,
    recordVideo: {
      dir: outDir,
      size: VIEWPORT,
    },
  });

  const page = await context.newPage();

  console.log(`  Loading ${route.name} (${route.path})...`);
  await page.goto(`${BASE_URL}${route.path}`, { waitUntil: "networkidle" });

  // Let fonts, images, and animations settle
  await page.waitForTimeout(1500);
  await hideNextDevTools(page);

  // Screenshot: dashboard only
  await page.screenshot({
    path: path.join(outDir, "dashboard.png"),
    fullPage: false,
  });
  console.log(`    -> dashboard.png`);

  if (route.hasChat) {
    const bubble = await findChatBubble(page);

    if (bubble) {
      await bubble.click();
      console.log(`    -> clicked chat bubble`);
    } else {
      // Fallback: click bottom-right coordinates
      console.log(`    -> fallback: clicking bottom-right coordinates`);
      await page.mouse.click(VIEWPORT.width - 40, VIEWPORT.height - 40);
    }

    // Wait for chat window open animation
    await page.waitForTimeout(1000);
    await hideNextDevTools(page);

    // Screenshot: with chat open
    await page.screenshot({
      path: path.join(outDir, "chat-open.png"),
      fullPage: false,
    });
    console.log(`    -> chat-open.png`);

    // Hold for 3s to capture animations (CRT flicker, marquee, etc.)
    await page.waitForTimeout(3000);
  } else {
    // Landing page: just hold for a few seconds
    await page.waitForTimeout(3000);
  }

  // Close context to finalize video
  await context.close();

  // Rename the auto-generated video file to video.webm
  const videoFiles = fs.readdirSync(outDir).filter((f) => f.endsWith(".webm"));
  if (videoFiles.length > 0) {
    const src = path.join(outDir, videoFiles[0]);
    const dest = path.join(outDir, "video.webm");
    if (src !== dest) fs.renameSync(src, dest);
    console.log(`    -> video.webm`);
  }
}

async function main() {
  console.log(`\nRecording ${routes.length} pages to ${RECORDINGS_DIR}\n`);
  console.log(`Make sure the dev server is running at ${BASE_URL}\n`);

  const browser = await chromium.launch({ headless: true });

  for (const route of routes) {
    try {
      await recordRoute(browser, route);
      console.log(`  Done: ${route.name}\n`);
    } catch (err) {
      console.error(`  FAILED: ${route.name} — ${err}\n`);
    }
  }

  await browser.close();
  console.log(`\nAll recordings saved to ${RECORDINGS_DIR}`);
  console.log(
    "Each folder contains: video.webm, dashboard.png, chat-open.png\n"
  );
}

main().catch(console.error);
