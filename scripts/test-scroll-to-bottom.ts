/**
 * Puppeteer test: verify scroll-to-bottom works on all 14 chat routes.
 *
 * For each route:
 * 1. Open the page and click the chat bubble
 * 2. Find the scroll container (parent of [data-slot="thread-content"] with overflow-y: auto)
 * 3. Inject 3 large fake message blocks one at a time, checking scroll after each
 * 4. Assert scrollTop is at or near scrollHeight - clientHeight after every injection
 *
 * Usage:
 *   npx tsx scripts/test-scroll-to-bottom.ts
 */

import puppeteer from "puppeteer-core";
import { chatRoutes } from "./routes";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const CHROME_PATH =
  process.env.CHROME_PATH ??
  "/root/.cache/ms-playwright/chromium-1194/chrome-linux/chrome";

const MESSAGE_COUNT = 3;

// Each message is a realistic chat block with multiple paragraphs
const FAKE_MESSAGES = [
  `<div style="padding:12px 16px;margin:8px 0;min-height:180px;background:#e0e0e0;border-radius:8px;font-size:14px;line-height:1.6">
    <p><strong>User:</strong> Can you explain how the scroll-to-bottom feature works in this chat application?</p>
    <p>I've noticed that when new messages appear, the chat should automatically scroll down so the latest message is visible. But it seems like this isn't happening consistently.</p>
    <p>Could you walk me through the implementation and suggest any fixes?</p>
  </div>`,
  `<div style="padding:12px 16px;margin:8px 0;min-height:180px;background:#d0e8ff;border-radius:8px;font-size:14px;line-height:1.6">
    <p><strong>Assistant:</strong> The scroll-to-bottom feature uses a combination of MutationObserver and ResizeObserver to detect when new content is added to the chat container.</p>
    <p>When a mutation is detected, the hook schedules multiple scroll attempts using requestAnimationFrame to ensure the scroll happens after the browser has completed its layout calculations.</p>
    <p>There's also a polling fallback that checks every 120ms whether the container needs to scroll, which catches edge cases that the observers might miss.</p>
  </div>`,
  `<div style="padding:12px 16px;margin:8px 0;min-height:180px;background:#e0e0e0;border-radius:8px;font-size:14px;line-height:1.6">
    <p><strong>User:</strong> That makes sense. What about the ResizeObserver — why is that needed in addition to the MutationObserver?</p>
    <p>Also, I noticed the hook observes direct children of the scroll container. Is that to catch cases where existing elements grow in size (like when an image loads or text is streamed in)?</p>
    <p>One more thing — does the polling fallback handle the case where neither observer fires? For example, if content is added via a framework that batches DOM updates in a way that doesn't trigger mutations?</p>
  </div>`,
];

interface StepResult {
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
  maxScroll: number;
  atBottom: boolean;
}

interface TestResult {
  route: string;
  passed: boolean;
  steps: StepResult[];
  error?: string;
}

async function testRoute(
  browser: Awaited<ReturnType<typeof puppeteer.launch>>,
  route: { name: string; path: string }
): Promise<TestResult> {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  try {
    // 1. Load page
    await page.goto(`${BASE_URL}${route.path}`, {
      waitUntil: "networkidle2",
      timeout: 30000,
    });
    await new Promise((r) => setTimeout(r, 1500));

    // 2. Open chat bubble
    const hasBubble = await page.$('[data-testid="chat-bubble"]');
    if (!hasBubble) {
      return { route: route.name, passed: false, steps: [], error: "No chat bubble found" };
    }
    await page.evaluate(() => {
      const el = document.querySelector('[data-testid="chat-bubble"]');
      if (!el) return;
      const btn = el.tagName === "BUTTON" ? el : el.querySelector("button");
      (btn as HTMLButtonElement | null)?.click();
    });

    // Wait for thread-content to appear
    for (let attempt = 0; attempt < 10; attempt++) {
      await new Promise((r) => setTimeout(r, 500));
      const found = await page.$('[data-slot="thread-content"]');
      if (found) break;
    }

    // 3. Set up: find and mark the scroll container
    const setupError = await page.evaluate(() => {
      const threadContent = document.querySelector('[data-slot="thread-content"]');
      if (!threadContent) return "No thread-content found";

      let scrollContainer: HTMLElement | null = threadContent as HTMLElement;
      while (scrollContainer) {
        const style = getComputedStyle(scrollContainer);
        if (style.overflowY === "auto" || style.overflowY === "scroll") break;
        scrollContainer = scrollContainer.parentElement;
      }
      if (!scrollContainer) return "No scroll container found";

      scrollContainer.setAttribute("data-test-scroll", "true");
      return null;
    });

    if (setupError) {
      return { route: route.name, passed: false, steps: [], error: setupError };
    }

    // 4. Inject messages one at a time and check scroll after each
    const steps: StepResult[] = [];

    for (let i = 0; i < MESSAGE_COUNT; i++) {
      const html = FAKE_MESSAGES[i];

      // Inject one message
      await page.evaluate((msgHtml) => {
        const threadContent = document.querySelector('[data-slot="thread-content"]');
        if (!threadContent) return;
        const wrapper = document.createElement("div");
        wrapper.innerHTML = msgHtml;
        const msg = wrapper.firstElementChild as HTMLElement;
        if (msg) threadContent.appendChild(msg);
      }, html);

      // Wait for auto-scroll (MutationObserver + rAF + polling)
      await new Promise((r) => setTimeout(r, 800));

      // Read scroll position
      const step = await page.evaluate(() => {
        const el = document.querySelector('[data-test-scroll="true"]') as HTMLElement;
        if (!el) return { scrollTop: 0, scrollHeight: 0, clientHeight: 0, maxScroll: 0, atBottom: false };
        const maxScroll = el.scrollHeight - el.clientHeight;
        return {
          scrollTop: Math.round(el.scrollTop),
          scrollHeight: el.scrollHeight,
          clientHeight: el.clientHeight,
          maxScroll: Math.round(maxScroll),
          atBottom: maxScroll <= 0 || el.scrollTop >= maxScroll - 2,
        };
      });

      steps.push(step);
    }

    // Pass only if scrolled to bottom after every step that had overflow
    const passed = steps.every((s) => s.atBottom);

    return { route: route.name, passed, steps };
  } catch (err) {
    return { route: route.name, passed: false, steps: [], error: String(err) };
  } finally {
    await page.close();
  }
}

async function main() {
  console.log(
    `\nScroll-to-bottom test — ${chatRoutes.length} routes × ${MESSAGE_COUNT} messages each\n${"=".repeat(60)}\n`
  );

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
    ],
  });

  const results: TestResult[] = [];

  for (const route of chatRoutes) {
    const result = await testRoute(browser, route);
    const icon = result.passed ? "✅" : "❌";

    if (result.error) {
      console.log(`${icon}  ${result.route.padEnd(16)} ERROR: ${result.error}`);
    } else {
      const stepDetails = result.steps
        .map(
          (s, i) =>
            `msg${i + 1}: scrollTop=${s.scrollTop}/${s.maxScroll} ${s.atBottom ? "✓" : "✗"}`
        )
        .join("  |  ");
      console.log(`${icon}  ${result.route.padEnd(16)} ${stepDetails}`);
    }
    results.push(result);
  }

  await browser.close();

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  console.log(`\n${"=".repeat(60)}`);
  console.log(
    `Results: ${passed} passed, ${failed} failed out of ${results.length} routes`
  );

  if (failed > 0) {
    console.log("\nFailed routes:");
    for (const r of results.filter((x) => !x.passed)) {
      if (r.error) {
        console.log(`  - ${r.route}: ${r.error}`);
      } else {
        for (let i = 0; i < r.steps.length; i++) {
          const s = r.steps[i];
          if (!s.atBottom) {
            console.log(
              `  - ${r.route} msg${i + 1}: scrollTop=${s.scrollTop}, maxScroll=${s.maxScroll}`
            );
          }
        }
      }
    }
    process.exit(1);
  } else {
    console.log("\nAll routes passed! ✅");
    process.exit(0);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
