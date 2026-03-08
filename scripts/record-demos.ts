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

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const VIEWPORT = { width: 1440, height: 900 };

// Ordered per storyboard — maximum visual contrast between adjacent cuts
const routes = [
  { name: "landing", path: "/", hasChat: false },
  { name: "primer", path: "/primer", hasChat: true },
  { name: "neobrutalism", path: "/neobrutalism", hasChat: true },
  { name: "carbon", path: "/carbon", hasChat: true },
  { name: "nes", path: "/nes", hasChat: true },
  { name: "polaris", path: "/polaris", hasChat: true },
  { name: "retro", path: "/retro", hasChat: true },
  { name: "daisyui", path: "/daisyui", hasChat: true },
  { name: "mantine", path: "/mantine", hasChat: true },
  { name: "win98", path: "/win98", hasChat: true },
  { name: "chakra", path: "/chakra", hasChat: true },
  { name: "winxp", path: "/winxp", hasChat: true },
  { name: "papercss", path: "/papercss", hasChat: true },
  { name: "pico", path: "/pico", hasChat: true },
  { name: "antd", path: "/antd", hasChat: true },
];

const RECORDINGS_DIR = path.resolve(__dirname, "..", "recordings");

/**
 * Try multiple selector strategies to find the chat bubble button.
 * Returns null if none found (e.g. landing page).
 */
async function findChatBubble(page: Page) {
  // Strategy 1: inline style with position: fixed + bottom (most pages)
  const inlineFixed = page.locator(
    'button[style*="position: fixed"][style*="bottom"]'
  );
  if ((await inlineFixed.count()) > 0) return inlineFixed.first();

  // Strategy 2: Tailwind utility classes (neobrutalism)
  const tailwindFixed = page.locator("button.fixed");
  if ((await tailwindFixed.count()) > 0) return tailwindFixed.first();

  // Strategy 3: parent div with fixed positioning wrapping a button
  const parentFixed = page.locator(
    'div[style*="position: fixed"][style*="bottom"] button'
  );
  if ((await parentFixed.count()) > 0) return parentFixed.first();

  // Strategy 4: coordinate-based click as last resort
  // Chat bubbles are always bottom-right, roughly 40px from edges
  return null;
}

async function recordRoute(
  browser: Awaited<ReturnType<typeof chromium.launch>>,
  route: (typeof routes)[number]
) {
  const outDir = path.join(RECORDINGS_DIR, route.name);
  fs.mkdirSync(outDir, { recursive: true });

  const context = await browser.newContext({
    viewport: VIEWPORT,
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
