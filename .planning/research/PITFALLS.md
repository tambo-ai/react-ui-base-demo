# Pitfalls Research

**Domain:** Multi-UI-library headless AI chat demo (Next.js + 6 design system skins)
**Researched:** 2026-03-04
**Confidence:** HIGH (most pitfalls verified via official issues/docs)

---

## Critical Pitfalls

### Pitfall 1: Global CSS Stylesheet Accumulation in Next.js App Router

**What goes wrong:**
When a user navigates from one demo page (e.g., `/polaris`) to another (e.g., `/carbon`), Next.js App Router does NOT remove the previous page's imported stylesheets. Both stylesheets accumulate and remain active simultaneously. This is confirmed intentional Next.js behavior, not a bug (closed as "works as intended" in July 2024). The result: Carbon's global resets clobber Polaris's token values, Primer's base styles leak into the nes.css page, and every page visited adds more global style noise.

**Why it happens:**
Next.js retains stylesheets during client-side navigation for performance reasons (avoids re-fetching and flicker). This design assumes pages share a coherent global style foundation — an assumption that breaks catastrophically when 6 different design systems each inject opinionated global CSS.

**How to avoid:**
- Import each library's CSS inside its own page-level component using a CSS layer or scoped wrapper, not at the layout level.
- Use CSS `@layer` to contain each library's global styles: wrap each design system's import in a layer with lower specificity than page-specific styles.
- For page-level CSS isolation, prefer CSS Modules for structural layout and import library CSS only within the page component's render tree, not in `layout.tsx`.
- Consider a `:where(.demo-polaris)` wrapper class on each page's root `<div>` to namespace CSS selectors from libraries that support it.

**Warning signs:**
- Visiting `/polaris` and then `/carbon` shows visual artifacts from Polaris styles still active.
- `body` font-size or color changes that shouldn't apply on the current page.
- DevTools shows multiple `<style>` or `<link>` tags from different libraries stacked up.

**Phase to address:** Foundation phase — establish the CSS isolation strategy before implementing any individual library page.

---

### Pitfall 2: Library-Level CSS Resets Overriding Each Other

**What goes wrong:**
Several of the 6 libraries ship opinionated global CSS resets that target bare HTML elements (`body`, `*`, `a`, `h1`–`h6`, `input`). IBM Carbon resets `box-sizing` and sets base font size. Polaris has its own baseline. nes.css sets `font-family: 'Press Start 2P'` on `:root` or `body` — meaning the retro pixel font bleeds onto every other page once its stylesheet is loaded (see Pitfall 1 above). These resets are mutually incompatible.

**Why it happens:**
Design systems are built to own the entire page. They assume they are the only system running. None of them scope their resets to a container class.

**How to avoid:**
- Do not import any library's global CSS in `app/layout.tsx` or `globals.css`.
- Contain each library's stylesheet import inside the specific route segment for that demo.
- Isolate nes.css especially: its `Press Start 2P` font assignment must be scoped to `<div className="nes-page-root">` with the font applied only to that subtree.
- For Carbon specifically: import only `@carbon/react/scss/components/...` individual component files rather than the full `styles.scss` bundle to avoid global resets.

**Warning signs:**
- Pixel font (Press Start 2P) visible on pages other than the nes.css demo.
- `box-sizing: border-box` applied universally when only Carbon should set it.
- Navigation bar or shared header visually breaks after visiting certain pages.

**Phase to address:** Foundation phase — CSS isolation architecture must be decided before touching any individual library.

---

### Pitfall 3: Shopify Polaris Requires `AppProvider` and Has React 19 Peer Dependency Conflicts

**What goes wrong:**
Polaris React requires wrapping all Polaris components in `<AppProvider>`, which uses React Context internally. This means it cannot render as a React Server Component — attempting to use Polaris without the `'use client'` directive causes: `TypeError: (0, react__WEBPACK_IMPORTED_MODULE_0__.createContext) is not a function`. Additionally, Polaris React locks its peer dependency to React 18 and does not officially support React 19. Next.js 15 ships with React 19 by default, which causes npm install failures or forced `--legacy-peer-deps` usage.

**Why it happens:**
Polaris was deprecated in favor of Polaris Web Components in October 2025 and is no longer receiving maintenance. Its peer dependency constraints were not updated for React 19.

**How to avoid:**
- Mark the Polaris demo page and its components with `'use client'` explicitly.
- Use `--legacy-peer-deps` during install if on React 19, or pin the project to React 18 if Polaris compatibility is required.
- Check `@shopify/polaris` npm page for the latest version's peer dependency requirements before installing.
- Document the React version decision in the project so other library integrations don't assume React 19.

**Warning signs:**
- `npm install` fails with dependency tree errors mentioning `@shopify/polaris`.
- Server-side rendering errors: `window is not defined` or `createContext is not a function` from Polaris components.

**Phase to address:** Polaris demo phase — verify compatibility before building, not mid-build.

---

### Pitfall 4: IBM Carbon Requires Dart Sass and Emits SCSS Deprecation Warnings in Next.js 15

**What goes wrong:**
Carbon v11 migrated to Sass Modules (`@use`/`@forward`) and requires Dart Sass. Legacy node-sass will fail. Additionally, there are documented sass-loader deprecation warnings specific to Carbon when used with Next.js 15 ([GitHub issue #17458](https://github.com/carbon-design-system/carbon/issues/17458), [#18271](https://github.com/carbon-design-system/carbon/issues/18271)). These manifest as build errors or noisy console output that obscures real errors.

**Why it happens:**
Carbon's SCSS architecture uses Sass Modules features not available in node-sass. Next.js 15 uses a different Sass compiler behavior that triggers deprecation paths in Carbon's scss files.

**How to avoid:**
- Ensure `sass` (Dart Sass) is installed, not `node-sass`: `npm install --save-dev sass`.
- Configure `sassOptions` in `next.config.js` to silence specific Carbon deprecation warnings if needed.
- Consider using `@carbon/react`'s pre-built CSS output instead of SCSS compilation for the demo context: import `@carbon/react/css/index.css` if available, to avoid the SCSS pipeline entirely.
- Test Carbon SCSS compilation in isolation before integrating other libraries.

**Warning signs:**
- Build errors mentioning `@use` vs `@import` Sass syntax.
- Warnings like "Sass's behavior for declarations that appear after nested rules will be changing."
- Build times unusually long (Carbon's full SCSS is ~1.5MB unminified).

**Phase to address:** Carbon demo phase — verify SCSS build pipeline before writing components.

---

### Pitfall 5: Retro-Futuristic UI Is Not an npm Package — Components Must Be Manually Extracted

**What goes wrong:**
The `retro-futuristic-ui-design` project (Imetomi/retro-futuristic-ui-design) is a standalone Vite + React Router gallery application, not a published npm package. There is no `npm install @imetomi/retro-futuristic-ui-design`. The components (`CRTTerminal.tsx`, `LCDGadget.tsx`) must be manually copied from the repository into the project, along with their associated CSS files. Assuming this is an installable library will block the retro-futuristic demo page entirely.

**Why it happens:**
The project README and GitHub page present it as a design inspiration/component gallery, not a distributable library. It is easy to confuse the "extractable for reuse" phrasing with package availability.

**How to avoid:**
- Clone the repository separately and copy needed component files and CSS into the project's `app/(retro-futuristic)/components/` directory.
- Adapt the Vite-specific imports (e.g., CSS imports, asset paths) to be compatible with Next.js.
- Acknowledge the components are vendored (not managed by npm) and document this clearly in the codebase.
- Check the project's CSS for hardcoded `url()` asset references that may break when moved.

**Warning signs:**
- `npm install retro-futuristic-ui-design` or similar returns no package found.
- Searching npm for this library yields no results.

**Phase to address:** Retro-futuristic demo phase — do not assume npm-installable; plan for manual extraction upfront.

---

### Pitfall 6: Neobrutalism.dev Is a Copy-Paste Shadcn-Based System — Requires Tailwind and Shadcn/ui

**What goes wrong:**
Neobrutalism.dev components are NOT a standalone npm library. They are a copy-paste system built on top of `shadcn/ui`, which itself requires Tailwind CSS. Adding Tailwind to the project to support the neobrutalism page will cause Tailwind's base/preflight styles (which reset all browser defaults) to bleed globally across every other page. Tailwind's `preflight` resets margins, paddings, and font sizes project-wide.

**Why it happens:**
Tailwind CSS is typically added as a global stylesheet applied to the entire Next.js app. Its `@tailwind base` / preflight layer touches the same bare HTML elements that Carbon, Polaris, and nes.css also target.

**How to avoid:**
- Scope Tailwind's application to only the neobrutalism page: use Tailwind v4's `@layer` API or configure a prefix (e.g., `prefix: 'nb-'` in `tailwind.config.js`) to namespace all utility classes.
- Disable Tailwind preflight (`corePlugins: { preflight: false }`) to avoid the global reset conflicting with other libraries.
- Alternatively, use only inline styles or a fork of the neobrutalism styles without the full Tailwind dependency for this demo context.
- Keep shadcn/ui component installation (if used) isolated to the neobrutalism page route segment.

**Warning signs:**
- After adding Tailwind, other demo pages (especially nes.css and Polaris) lose their baseline styling.
- `margin: 0; padding: 0;` or `box-sizing: border-box` appearing on all elements across all pages.

**Phase to address:** Neobrutalism demo phase — Tailwind integration strategy must be scoped before Tailwind is installed.

---

### Pitfall 7: Primer React Brings styled-components — SSR Hydration Mismatches

**What goes wrong:**
`@primer/react` uses `styled-components` as a peer dependency for theming and component styling. When using Next.js App Router with SSR, styled-components generates CSS class names server-side that differ from client-side class names, causing React hydration mismatches. These appear as console errors and visual flash of unstyled content. The fix requires configuring the styled-components Babel plugin with `"ssr": true`, which conflicts with Next.js's default SWC compiler (SWC and styled-components Babel plugin cannot coexist without `swcMinify: false`).

**Why it happens:**
styled-components v5 and below generate class names based on a runtime counter. Server and client counters diverge, producing different class name sequences. styled-components v6 improved this with React 19's inline style hoisting, but Primer React's dependency version may not be v6.

**How to avoid:**
- Check which version of styled-components `@primer/react` depends on: `npm ls styled-components`.
- If v5: configure `babel-plugin-styled-components` with `{ "ssr": true }` or use the Next.js SWC styled-components transform via `compiler: { styledComponents: true }` in `next.config.js`.
- Mark the Primer page with `'use client'` to opt out of SSR for that page segment.
- Alternatively, wrap the Primer page in a `dynamic()` import with `{ ssr: false }` to render client-side only — acceptable for a demo.

**Warning signs:**
- React hydration errors in the console: "Prop `className` did not match."
- Flash of unstyled content (FOUC) on the Primer page on first load.
- Different visual output between development (client-rendered) and production (SSR).

**Phase to address:** Primer demo phase — verify SSR behavior before completing the page.

---

### Pitfall 8: Tambo API Key Exposed Client-Side

**What goes wrong:**
`TamboProvider` requires an `apiKey` prop. In a demo context it is tempting to hardcode or inline the API key directly in the React component. In Next.js, any value passed to a client component is bundled into the client-side JavaScript and is fully visible in the browser via DevTools or `view-source`. Any public demo will expose the Tambo API key to all visitors.

**Why it happens:**
Demo projects skip authentication infrastructure. The shortcut of hardcoding keys in source code or `.env.local` and referencing them as `process.env.NEXT_PUBLIC_TAMBO_API_KEY` means the key is intentionally shipped to the browser.

**How to avoid:**
- Use a `NEXT_PUBLIC_TAMBO_API_KEY` environment variable (accepted risk for demo, but document it explicitly).
- Ensure the Tambo project/key used for the demo has rate limiting and is scoped to demo-only permissions.
- Never commit the `.env.local` file to the repository — add it to `.gitignore`.
- Document in the README that users deploying their own demo should set their own API key.

**Warning signs:**
- API key string visible in browser DevTools > Sources.
- Committed `.env.local` in git history.

**Phase to address:** Foundation phase — API key handling must be established before any Tambo integration.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Import library CSS in `layout.tsx` | Fast setup per page | Styles accumulate across all pages; breaks isolation | Never — defeats the whole demo premise |
| `--legacy-peer-deps` for Polaris | Unblocks install | Masks real version conflicts; may break at runtime | MVP only, document explicitly |
| Copy-paste retro-futuristic components without adapting CSS paths | Gets components in faster | Asset URLs break in production; no version control on vendored code | Acceptable if paths verified and documented |
| Disable Tailwind preflight globally | Avoids writing custom reset | Tailwind utility classes may not render correctly on the neobrutalism page | Never — scope properly instead |
| `dynamic(() => import('./Page'), { ssr: false })` for Primer or Polaris | Eliminates hydration errors | Loses SSR entirely for that page; first-load blank flash | Acceptable for demo context only |
| Hardcode Tambo API key in source | Zero config complexity | Key exposed in git history and browser bundle | Never in source code — use env vars |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Shopify Polaris | Forgetting `AppProvider` wrapper inside demo page | Wrap all Polaris components in `<AppProvider>` within the page component, marked `'use client'` |
| IBM Carbon | Importing all of `@carbon/styles` globally | Import only the specific component SCSS files needed, or use the pre-built CSS output |
| GitHub Primer | Not configuring styled-components SSR | Set `compiler: { styledComponents: true }` in `next.config.js` or use `'use client'` |
| nes.css | Importing CSS in global stylesheet | Import `nes.css` only inside the nes.css page's scoped CSS module or component |
| Neobrutalism | Installing Tailwind without disabling preflight | Set `corePlugins: { preflight: false }` or use Tailwind v4 with layer scoping |
| Retro-futuristic | Expecting an npm package | Clone repo, manually vendor the components, adapt imports for Next.js |
| Tambo provider | Placing `TamboProvider` inside individual page components | Place `TamboProvider` once in `app/layout.tsx` or a shared provider file — it is the single shared context |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Carbon full SCSS import | 5–15 second build times, 400KB+ CSS bundle per page | Import only needed Carbon component SCSS files | Immediately at first `next build` |
| Press Start 2P loaded globally | Extra 80KB+ font weight loaded on all pages | Load font only in the nes.css page segment using `next/font/google` locally | Visible in Lighthouse from first audit |
| All 6 libraries loaded on home page | Home page first-load > 2MB | Keep home page minimal — only link to demos, do not import any library | At initial render |
| Polaris full CSS bundle | ~300–400KB CSS without tree-shaking | PurgeCSS was reported to break Polaris layout — accept bundle size for demo | Immediately |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Tambo API key in `NEXT_PUBLIC_` env var | Key visible in client bundle and browser; can be used by anyone visiting demo | Use env var but document the exposure risk; restrict key permissions server-side at Tambo |
| Tambo API key committed to git | Key permanently in git history; cannot be rotated without history rewrite | `.gitignore` `.env.local`; use secret scanning on the repo |
| No rate limiting assumption | Open demo could be abused to rack up Tambo API costs | Set up Tambo project-level rate limits before publishing demo |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| All 6 demo pages look identical except color | Demo fails to show the value of different design systems | Each page must feel authentically designed in that library's style — Polaris should feel like Shopify Admin, Carbon like IBM products, nes.css like a Game Boy |
| Thread state not shared between pages | User loses conversation when switching library demos | Decide upfront: shared Tambo provider means threads can persist across page navigations — leverage this as a feature |
| No visual indicator of which library is active | Users lose context when navigating | Add clear labeling — the library name and a brief descriptor on each demo page |
| Chat layout not truly identical across pages | Demo claim ("identical layout, different skin") is falsified | Define a strict layout spec (sidebar width, input height, scroll behavior) and enforce it across all 6 implementations |
| Streaming chat with no loading state | Messages appear to hang; AI appears broken | Every demo page must show a streaming indicator (spinner, typing dots, etc.) during AI response generation |

---

## "Looks Done But Isn't" Checklist

- [ ] **CSS isolation:** Verify that visiting `/polaris` then navigating to `/carbon` does NOT show Polaris styles still active — check DevTools for accumulated `<link>` or `<style>` tags.
- [ ] **Thread persistence:** Verify switching between demo pages (navigating `/primer` to `/polaris`) maintains thread history because `TamboProvider` is in the root layout.
- [ ] **nes.css font containment:** Verify Press Start 2P font does NOT appear on any page except the nes.css demo page.
- [ ] **Retro-futuristic asset paths:** Verify all images, SVGs, and CSS `url()` references in vendored components resolve correctly in Next.js (public folder vs relative paths).
- [ ] **Polaris SSR:** Verify the Polaris page does not produce hydration errors in production build (`next build && next start`), not just dev mode.
- [ ] **Carbon SCSS build:** Verify `next build` completes without SASS errors or unusually long compile times.
- [ ] **Neobrutalism Tailwind isolation:** Verify Tailwind preflight does NOT reset styles on the Primer or Carbon pages.
- [ ] **API key not in source:** Verify `git log --all -S "tambo" -- "*.ts" "*.tsx" "*.env*"` returns no committed keys.
- [ ] **Layout consistency:** Verify sidebar width, input position, and scroll behavior are visually identical across all 6 pages (screenshot comparison).

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| CSS accumulation discovered after all pages built | HIGH | Audit and refactor each page's CSS import strategy; add CSS layer wrappers; regression test all 6 pages |
| Polaris React 19 incompatibility at install time | LOW | Add `--legacy-peer-deps` flag; document in README; pin React version if needed |
| Carbon SCSS build failure | MEDIUM | Switch to pre-built Carbon CSS output; remove SCSS pipeline; test each Carbon component works with CSS-only approach |
| Retro-futuristic expected as npm package | LOW | Clone source repo; manually vendor components; ~1–2 hours of adaptation work |
| Tailwind preflight bleeds across all pages | MEDIUM | Set `preflight: false` in Tailwind config; re-add base styles explicitly within the neobrutalism page scope |
| styled-components hydration mismatch on Primer | LOW | Add `'use client'` to Primer page or configure SWC styledComponents transform |
| API key committed to git | HIGH | Rotate key immediately; rewrite git history or accept exposure; document in security review |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Global CSS accumulation (Next.js stylesheet retention) | Foundation / CSS architecture phase | Navigate between all 6 demo pages and inspect DevTools for accumulated stylesheets |
| CSS reset conflicts between libraries | Foundation / CSS architecture phase | Each page renders without visual artifacts from other libraries after navigation |
| Polaris React 19 peer dependency conflict | Polaris demo phase (first library built) | `npm install` succeeds without `--force`; or explicit `--legacy-peer-deps` documented |
| Carbon SCSS / Dart Sass issues | Carbon demo phase | `next build` completes without SASS errors |
| Retro-futuristic not an npm package | Retro-futuristic demo phase | Component files vendored and rendering before phase begins |
| Neobrutalism Tailwind preflight bleed | Neobrutalism demo phase | All other pages visually verified after Tailwind added |
| Primer styled-components SSR hydration | Primer demo phase | `next build && next start` shows no hydration errors on Primer page |
| Tambo API key exposure | Foundation phase | `.gitignore` verified; env var approach documented; key never in source |
| Layout inconsistency across pages | Every demo page | Screenshot comparison of all 6 pages side-by-side at completion |

---

## Sources

- [Next.js App Router global styles not removed on navigation (Issue #65672)](https://github.com/vercel/next.js/issues/65672) — confirmed intentional behavior, closed July 2024
- [Next.js: Global CSS not removed between app router pages (Issue #58597)](https://github.com/vercel/next.js/issues/58597)
- [Shopify Polaris React 19 support community thread](https://community.shopify.dev/t/shopify-polaris-react-19-support/6010)
- [Polaris AppProvider SSR / window is not defined issue (PR #372)](https://github.com/Shopify/polaris-react/pull/372)
- [Carbon Design System: SASS errors with Next.js 15 (Issue #18271)](https://github.com/carbon-design-system/carbon/issues/18271)
- [Carbon Design System: sass-loader deprecation warnings (Issue #17458)](https://github.com/carbon-design-system/carbon/issues/17458)
- [Imetomi/retro-futuristic-ui-design GitHub repository](https://github.com/Imetomi/retro-futuristic-ui-design) — not an npm package, standalone Vite app
- [Neobrutalism components installation docs (v3)](https://v3.neobrutalism.dev/docs/installation) — copy-paste shadcn system, requires Tailwind
- [Primer React SSR documentation](https://primer.style/guides/react/) — styled-components peer dependency
- [How to fix styled-components hydration error in Next.js](https://www.meje.dev/blog/styled-components-hydration-error)
- [Setting Up Shopify Polaris with Next.js](https://medium.com/@0xDayton/setting-up-shopify-polaris-with-next-js-a-step-by-step-guide-8163771ee37b)
- [Using IBM Carbon with Next.js](https://theadhocracy.co.uk/wrote/using-carbon-with-nextjs)
- [Tambo documentation (TamboProvider setup)](https://docs.tambo.co/)

---
*Pitfalls research for: Multi-UI-library headless AI chat demo (Next.js, @tambo-ai/react, GitHub Primer, Shopify Polaris, IBM Carbon, Neobrutalism.dev, nes.css, retro-futuristic-ui-design)*
*Researched: 2026-03-04*
