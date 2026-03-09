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

/**
 * Scroll the chat message container down in steps, taking a screenshot
 * at each position. Also scrolls in the video for the recording.
 */
async function scrollAndScreenshot(page: Page, outDir: string) {
  // Find the scrollable chat container (the one with overflow:auto that holds messages)
  const scrolled = await page.evaluate(() => {
    // Look for the scroll container — it's the element with overflow auto/scroll
    // that contains data-slot="thread-content"
    const threadContent = document.querySelector('[data-slot="thread-content"]');
    if (!threadContent) return false;
    // Walk up to find the scrollable parent
    let el: HTMLElement | null = threadContent as HTMLElement;
    while (el) {
      const style = getComputedStyle(el);
      if (
        (style.overflowY === "auto" || style.overflowY === "scroll") &&
        el.scrollHeight > el.clientHeight
      ) {
        // Scroll to the very bottom
        el.scrollTop = el.scrollHeight;
        return true;
      }
      el = el.parentElement;
    }
    return false;
  });

  if (scrolled) {
    console.log(`    -> scrolled chat to bottom`);
  }

  await page.waitForTimeout(1000);
  await hideNextDevTools(page);

  // Take the main screenshot
  await page.screenshot({
    path: path.join(outDir, "chat-response.png"),
    fullPage: false,
  });
  console.log(`    -> chat-response.png`);

  // Take additional screenshots scrolling up through the chat
  // to capture the full conversation
  let shotIndex = 1;
  let keepScrolling = true;
  while (keepScrolling) {
    const didScroll = await page.evaluate(() => {
      const threadContent = document.querySelector(
        '[data-slot="thread-content"]'
      );
      if (!threadContent) return false;
      let el: HTMLElement | null = threadContent as HTMLElement;
      while (el) {
        const style = getComputedStyle(el);
        if (
          (style.overflowY === "auto" || style.overflowY === "scroll") &&
          el.scrollHeight > el.clientHeight
        ) {
          const prev = el.scrollTop;
          el.scrollTop = Math.max(0, el.scrollTop - 200);
          return el.scrollTop < prev;
        }
        el = el.parentElement;
      }
      return false;
    });

    if (!didScroll) break;

    await page.waitForTimeout(300);
    await hideNextDevTools(page);
    await page.screenshot({
      path: path.join(outDir, `chat-scroll-${shotIndex}.png`),
      fullPage: false,
    });
    console.log(`    -> chat-scroll-${shotIndex}.png`);
    shotIndex++;
    if (shotIndex > 10) break; // safety limit
  }

  // Scroll back to bottom for the video
  await page.evaluate(() => {
    const threadContent = document.querySelector(
      '[data-slot="thread-content"]'
    );
    if (!threadContent) return;
    let el: HTMLElement | null = threadContent as HTMLElement;
    while (el) {
      const style = getComputedStyle(el);
      if (
        (style.overflowY === "auto" || style.overflowY === "scroll") &&
        el.scrollHeight > el.clientHeight
      ) {
        el.scrollTop = el.scrollHeight;
        return;
      }
      el = el.parentElement;
    }
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
    textarea = page
      .locator('[data-slot="message-input-root"] textarea')
      .first();
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
    sendBtn = page
      .locator(
        '[data-slot="message-input-root"] button[aria-label="Send"], [data-slot="message-input-root"] button[type="submit"]'
      )
      .first();
  }
  await sendBtn.click();
  console.log(`    -> submitted`);

  // Wait for the actual HN component to render (look for "pts" which only
  // appears in the rendered HackerNewsPosts component, not in thinking text)
  try {
    await page.waitForFunction(
      () => {
        const body = document.body.innerText;
        return body.includes(" pts") && body.includes(" comments");
      },
      { timeout: 180000 }
    );
    console.log(`    -> HN component rendered`);
  } catch {
    console.log(`    -> WARNING: timed out waiting for HN component`);
  }

  // Wait 20s for the response to fully settle
  console.log(`    -> waiting 20s for response to settle...`);
  await page.waitForTimeout(20000);

  await hideNextDevTools(page);

  // Scroll through the chat and take screenshots
  await scrollAndScreenshot(page, outDir);

  // Slowly scroll through the entire chat in the video
  console.log(`    -> scrolling chat for video...`);

  // First scroll to top
  await page.evaluate(() => {
    const tc = document.querySelector('[data-slot="thread-content"]');
    if (!tc) return;
    let el: HTMLElement | null = tc as HTMLElement;
    while (el) {
      const style = getComputedStyle(el);
      if (
        (style.overflowY === "auto" || style.overflowY === "scroll") &&
        el.scrollHeight > el.clientHeight
      ) {
        el.scrollTop = 0;
        return;
      }
      el = el.parentElement;
    }
  });
  await page.waitForTimeout(1000);

  // Then scroll down slowly (20px per step) for the video
  for (let i = 0; i < 50; i++) {
    const atBottom = await page.evaluate(() => {
      const tc = document.querySelector('[data-slot="thread-content"]');
      if (!tc) return true;
      let el: HTMLElement | null = tc as HTMLElement;
      while (el) {
        const style = getComputedStyle(el);
        if (
          (style.overflowY === "auto" || style.overflowY === "scroll") &&
          el.scrollHeight > el.clientHeight
        ) {
          el.scrollTop += 20;
          return el.scrollTop + el.clientHeight >= el.scrollHeight - 5;
        }
        el = el.parentElement;
      }
      return true;
    });
    await page.waitForTimeout(100);
    if (atBottom) break;
  }

  // Hold at bottom for a few seconds
  await page.waitForTimeout(3000);

  // Close context to finalize video
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
}

main().catch(console.error);
