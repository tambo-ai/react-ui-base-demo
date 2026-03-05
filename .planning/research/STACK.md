# Stack Research

**Domain:** Next.js headless AI chat demo with multi-skin UI showcase
**Researched:** 2026-03-04
**Confidence:** HIGH (core stack verified via npm registry; MEDIUM on CSS isolation pattern)

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js | 16.1.6 (already installed) | App framework, routing, SSR | Already scaffolded; App Router provides route groups for CSS isolation between demo pages |
| React | 19.2.3 (already installed) | UI runtime | Already installed; React 19 is current stable |
| TypeScript | ^5 (already installed) | Type safety | Already configured; critical for @tambo-ai/react-ui-base's compound component types |
| @tambo-ai/react | 1.1.0 | Core Tambo provider, hooks, thread management | Required peer dep of react-ui-base; provides TamboProvider, useTambo, thread state |
| @tambo-ai/react-ui-base | 0.1.0-alpha.8 | Headless chat primitives | The library being demoed; provides Message, MessageInput, ThreadHistory, ThreadDropdown etc. |

### UI Component Libraries (6 Demo Skins)

| Library | Version | Skin | Integration Method | Notes |
|---------|---------|------|-------------------|-------|
| @primer/react | 38.14.0 | GitHub Primer | npm install | Explicitly supports React 18.x \|\| 19.x; straightforward |
| @shopify/polaris | 13.9.5 | Shopify Polaris | npm install --legacy-peer-deps | Peer dep locked to React ^18; use npm overrides; runtime works fine |
| @carbon/react | 1.102.0 | IBM Carbon | npm install + sass | Supports React 16-19; requires sass ^1.33 as peer dep |
| neobrutalism-components | N/A (not on npm) | Neobrutalism | shadcn CLI copy-paste + Tailwind CSS | Based on shadcn/ui; components copied into project; requires Tailwind v4 |
| nes.css | 2.3.0 | NES retro pixel | npm install (CSS only) | Pure CSS framework; import the stylesheet, build components from scratch |
| retro-futuristic-ui-design | N/A (not on npm) | Retro-futuristic | Copy source from GitHub | Not published; 2 components (CRTTerminal, LCDGadget); copy `.tsx` files directly |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| sass | ^1.97.3 | SCSS compilation | Required for @carbon/react; install as dev dep |
| tailwindcss | ^4.2.1 | Utility CSS | Required for neobrutalism-components (based on shadcn which requires Tailwind) |
| @tailwindcss/postcss | ^4.x | PostCSS integration | Required alongside Tailwind v4 in Next.js |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| ESLint 9 (already configured) | Linting | Already set up with eslint-config-next |
| React Compiler (already enabled) | Auto-memoization | Already enabled in next.config.ts via reactCompiler: true |

## Installation

```bash
# Core Tambo
npm install @tambo-ai/react @tambo-ai/react-ui-base

# Brand design systems
npm install @primer/react @primer/octicons-react
npm install @carbon/react sass
# Polaris requires overriding React peer dep (locked at ^18, runtime works with 19)
npm install @shopify/polaris --legacy-peer-deps

# Or use package.json overrides instead of --legacy-peer-deps:
# "overrides": { "@shopify/polaris": { "react": "^19.0.0", "react-dom": "^19.0.0" } }

# Tailwind (for neobrutalism)
npm install tailwindcss @tailwindcss/postcss

# nes.css (CSS only)
npm install nes.css

# Neobrutalism: use shadcn CLI after Tailwind is configured
# npx shadcn@latest init
# Then copy components from neobrutalism.dev/docs

# retro-futuristic-ui-design: copy CRTTerminal.tsx and LCDGadget.tsx
# from https://github.com/Imetomi/retro-futuristic-ui-design
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Route groups with separate root layouts | Single root layout with CSS Modules | Only when all libraries are CSS-Modules-based; doesn't work for global CSS libs like Carbon or nes.css |
| npm overrides for Polaris peer dep | Downgrade to React 18 | Never — React 19 is required by @tambo-ai/react-ui-base's dev setup |
| Copy retro-futuristic source files | Build from scratch | Only if the library's aesthetics don't match the brief |
| Tailwind v4 | Tailwind v3 | Use v3 only if neobrutalism components haven't migrated; check docs at install time |
| @carbon/react v1.102.0 | @carbon/ibmdotcom-react | ibmdotcom-react is for IBM.com marketing sites; @carbon/react is the general-purpose one |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| @shopify/polaris React package as-is without peer dep override | Peer dep locked to `react: ^18.0.0`; npm will refuse to install alongside React 19 without workaround | Use `--legacy-peer-deps` flag or add `overrides` in package.json |
| CSS-in-JS (styled-components, emotion) for page-level library styles | RSC-incompatible without "use client" boundaries; adds client bundle weight | Use native CSS imports scoped to route group layouts |
| Single shared layout.tsx with all 6 library stylesheets imported | Next.js does NOT remove global stylesheets between page navigations (intentional behavior per vercel/next.js#58597); styles from Carbon will bleed into Primer page | Use route groups with separate root layouts — full page reload between groups guarantees CSS isolation |
| nes-react or other nes.css React wrappers | unmaintained, last published years ago | Import nes.css stylesheet directly and build components from raw HTML elements |
| neobrutalism as npm package | Not published to npm | Copy-paste via shadcn CLI from neobrutalism.dev/docs |
| retro-futuristic-ui-design via npm | Not published to npm; GitHub-only | Copy the two component files (CRTTerminal.tsx, LCDGadget.tsx) directly into project |

## Stack Patterns by Variant

**For libraries with global CSS (Carbon, nes.css, retro-futuristic):**
- Place each demo page in its own route group: `app/(carbon)/carbon/page.tsx`
- Add a `layout.tsx` inside the route group that imports ONLY that library's stylesheet
- Route groups with separate root layouts trigger full page reloads (no CSS bleed between navigations)
- This is the only reliable CSS isolation strategy in Next.js App Router

**For libraries that use CSS-in-JS or scoped styles (Primer uses styled-components under the hood):**
- Wrap page in `"use client"` since Primer's ThemeProvider uses context
- CSS leakage is less of a concern since styles are injected/removed by the library itself

**For Polaris React 19 peer dep conflict:**
- Preferred: Add to `package.json` → `"overrides": { "@shopify/polaris": { "react": "^19.2.3" } }`
- Fallback: `npm install @shopify/polaris --legacy-peer-deps` (documents the override decision)
- Note: Polaris React is in maintenance mode since Jan 2026; Shopify is moving to web components. For this demo, the React package is still appropriate since we need React components.

**For neobrutalism (shadcn-based copy-paste):**
- Requires Tailwind v4 to be configured globally or at route group level
- Components live in `components/neobrutalism/` as copied source files
- No npm package to install after Tailwind setup

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| @tambo-ai/react-ui-base@0.1.0-alpha.8 | react@^18.0.0 \|\| ^19.0.0 | Alpha package; verify API against source before each phase |
| @tambo-ai/react@1.1.0 | react@^19.0.0 (assumed) | Required peer of react-ui-base; install together |
| @primer/react@38.14.0 | react@18.x \|\| 19.x | Full React 19 support confirmed in peerDependencies |
| @shopify/polaris@13.9.5 | react@^18.0.0 (declared) | React 19 runtime works; peer dep declaration not updated; use overrides |
| @carbon/react@1.102.0 | react@^16.8.6 \|\| ... \|\| ^19.0.0 | Full React 19 support; requires sass@^1.33 |
| nes.css@2.3.0 | Any React version | Pure CSS; no React dependency |
| tailwindcss@4.2.1 | Next.js 16 App Router | Tailwind v4 requires @tailwindcss/postcss, not the v3 postcss plugin |
| @tambo-ai/react-ui-base@0.1.0-alpha.8 | @base-ui/react@^1.2.0 | react-ui-base depends on base-ui; installed automatically as dep |

## Sources

- npm registry (`npm show <package>`) — versions, peer dependencies, publish dates for all packages (HIGH confidence)
- https://github.com/vercel/next.js/issues/58597 — CSS not removed between pages; intentional Next.js behavior (HIGH confidence)
- https://github.com/Imetomi/retro-futuristic-ui-design — Confirmed not on npm; must copy source (HIGH confidence)
- https://community.shopify.dev/t/shopify-polaris-react-19-support/6010 — Polaris React 19 status; runtime works, peer dep not updated (MEDIUM confidence)
- https://github.com/tambo-ai/tambo/blob/main/packages/react-ui-base/src/index.ts — Confirmed exports: Message, MessageInput, ThreadHistory, ThreadDropdown, ThreadContent, Elicitation components (HIGH confidence)
- https://www.neobrutalism.dev/docs — shadcn CLI copy-paste model confirmed; Tailwind required (MEDIUM confidence)
- WebSearch: Shopify polaris-react archived January 2026; moving to web components — for demo purposes React package still appropriate (MEDIUM confidence)

---
*Stack research for: Next.js headless AI chat demo showcasing @tambo-ai/react-ui-base across 6 UI library skins*
*Researched: 2026-03-04*
