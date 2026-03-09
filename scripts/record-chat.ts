/**
 * Record a chat conversation demo for every UI framework page.
 *
 * Flow per page:
 *   1. Load page, wait for settle
 *   2. Open chat bubble
 *   3. Type "show me hn posts" and submit
 *   4. Wait for the LLM response + HN component to render
 *   5. Wait 20s for response to settle
 *   6. Scroll through chat for video, take screenshots, then stop
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
    document
      .querySelectorAll(
        'nextjs-portal, [data-nextjs-dialog-overlay], [data-nextjs-toast], #__next-build-indicator, #__next-build-watcher'
      )
      .forEach((el) => ((el as HTMLElement).style.display = "none"));
    document.querySelectorAll("*").forEach((el) => {
      if (
        el.shadowRoot &&
        el.tagName.toLowerCase().startsWith("nextjs-portal")
      )
        (el as HTMLElement).style.display = "none";
    });
  });
}

/** Find the scrollable chat container ancestor of thread-content. */
function scrollChatJS(action: "top" | "bottom" | "down20") {
  return `(() => {
    const tc = document.querySelector('[data-slot="thread-content"]');
    if (!tc) return false;
    let el = tc;
    while (el) {
      const style = getComputedStyle(el);
      if ((style.overflowY === "auto" || style.overflowY === "scroll") && el.scrollHeight > el.clientHeight) {
        ${
          action === "top"
            ? "el.scrollTop = 0; return true;"
            : action === "bottom"
              ? "el.scrollTop = el.scrollHeight; return true;"
              : "el.scrollTop += 20; return el.scrollTop + el.clientHeight >= el.scrollHeight - 5;"
        }
      }
      el = el.parentElement;
    }
    return false;
  })()`;
}

async function scrollAndScreenshot(page: Page, outDir: string) {
  // Scroll to bottom first
  await page.evaluate(scrollChatJS("bottom"));
  await page.waitForTimeout(1000);
  await hideNextDevTools(page);

  // Main screenshot (at bottom showing HN component)
  await page.screenshot({
    path: path.join(outDir, "chat-response.png"),
    fullPage: false,
  });
  console.log(`    -> chat-response.png`);

  // Scroll up in steps, capturing additional screenshots
  let shotIndex = 1;
  for (let i = 0; i < 10; i++) {
    const didScroll = await page.evaluate(`(() => {
      const tc = document.querySelector('[data-slot="thread-content"]');
      if (!tc) return false;
      let el = tc;
      while (el) {
        const style = getComputedStyle(el);
        if ((style.overflowY === "auto" || style.overflowY === "scroll") && el.scrollHeight > el.clientHeight) {
          const prev = el.scrollTop;
          el.scrollTop = Math.max(0, el.scrollTop - 200);
          return el.scrollTop < prev;
        }
        el = el.parentElement;
      }
      return false;
    })()`);
    if (!didScroll) break;

    await page.waitForTimeout(300);
    await hideNextDevTools(page);
    await page.screenshot({
      path: path.join(outDir, `chat-scroll-${shotIndex}.png`),
      fullPage: false,
    });
    console.log(`    -> chat-scroll-${shotIndex}.png`);
    shotIndex++;
  }

  // Scroll back to bottom
  await page.evaluate(scrollChatJS("bottom"));
}

/** Type a message character by character with a delay between each keystroke. */
async function typeCharByChar(page: Page, locator: ReturnType<Page["locator"]>, text: string, delayMs = 80) {
  await locator.click();
  for (const char of text) {
    await page.keyboard.type(char, { delay: 0 });
    await page.waitForTimeout(delayMs);
  }
}

async function recordChat(
  browser: Awaited<ReturnType<typeof chromium.launch>>,
  route: (typeof routes)[number]
) {
  const outDir = path.join(OUT_DIR, route.name);
  fs.mkdirSync(outDir, { recursive: true });

  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 4,
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

  // Move mouse cursor away from the send button to a neutral spot
  await page.mouse.move(VIEWPORT.width / 2, VIEWPORT.height / 2);
  await page.waitForTimeout(300);

  // Type the message — prefer data-slot, fall back to generic textarea
  let textarea = page.locator('[data-slot="message-input-textarea"]');
  if ((await textarea.count()) === 0) {
    textarea = page
      .locator('[data-slot="message-input-root"] textarea')
      .first();
  }
  if ((await textarea.count()) === 0) {
    textarea = page.locator("textarea").first();
  }
  await typeCharByChar(page, textarea, "show me hn posts");
  console.log(`    -> typed message`);
  await page.waitForTimeout(500);

  // Submit — prefer data-slot, fall back to aria-label/text
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

  // Wait for the actual HN component to render (look for "pts" + "comments"
  // which only appear in the rendered HackerNewsPosts component)
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

  // Scroll through chat and take screenshots
  await scrollAndScreenshot(page, outDir);

  // Slowly scroll through entire chat for the video
  console.log(`    -> scrolling chat for video...`);
  await page.evaluate(scrollChatJS("top"));
  await page.waitForTimeout(1000);

  for (let i = 0; i < 50; i++) {
    const atBottom = await page.evaluate(scrollChatJS("down20"));
    await page.waitForTimeout(100);
    if (atBottom) break;
  }

  // Hold at bottom
  await page.waitForTimeout(3000);

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
