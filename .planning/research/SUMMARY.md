# Project Research Summary

**Project:** Tambo React UI Base Demo
**Domain:** Headless AI chat library showcase — multi-skin Next.js demo app
**Researched:** 2026-03-04
**Confidence:** HIGH

## Executive Summary

This project is a demonstration app built to prove a single proposition: `@tambo-ai/react-ui-base` works with any design system. The correct way to build it is as 6 fully isolated chat implementations — each skin uses a different UI library (GitHub Primer, Shopify Polaris, IBM Carbon, Neobrutalism.dev, nes.css, retro-futuristic) while sharing identical structural layout and real Tambo hook wiring. Research confirms the approach is sound and the patterns are well-understood, but CSS isolation is the central execution risk.

The recommended approach is Route Group isolation in Next.js App Router: each skin lives in its own `(skin)` route group with its own `layout.tsx` that imports only that skin's stylesheet. Navigating between skins triggers a full page reload, guaranteeing CSS isolation without iframe complexity. Tambo providers are mounted per skin (not globally) to keep thread state clean across demos. Each skin implements three components — Sidebar, MessageHistory, MessageInput — wired directly to Tambo hooks (`useTamboThreadList`, `useTambo`, `useTamboThreadInput`). The structural layout contract is identical across all 6; only the component primitives differ.

The primary risk is CSS stylesheet accumulation: Next.js App Router intentionally does not unload stylesheets on client-side navigation, meaning styles from multiple skins accumulate if standard routing is used. Route groups with separate root layouts are the correct mitigation — they force full page reloads on skin transitions. Secondary risks include Polaris's React 19 peer dependency conflict (use npm overrides), Carbon's Dart Sass requirement (install `sass` not `node-sass`), Tailwind preflight bleed for the neobrutalism skin (disable preflight or scope it), and Primer's styled-components SSR hydration mismatch (add `'use client'` or configure SWC transform). Two of the 6 libraries are not available on npm: retro-futuristic-ui-design must be vendored from GitHub source, and neobrutalism.dev components are copied via the shadcn CLI.

## Key Findings

### Recommended Stack

The project is built on an existing Next.js 16.1.6 scaffold with React 19.2.3 and TypeScript already configured. The core additions are `@tambo-ai/react` (1.1.0) and `@tambo-ai/react-ui-base` (0.1.0-alpha.8), which provide TamboProvider, hooks, and headless chat primitives. The 6 UI libraries span three categories: brand design systems (Primer 38.14.0, Polaris 13.9.5, Carbon 1.102.0), and style/aesthetic libraries (neobrutalism via shadcn copy-paste + Tailwind v4, nes.css 2.3.0 as pure CSS, retro-futuristic as vendored source). Supporting tools are sass (for Carbon), Tailwind v4 + @tailwindcss/postcss (for neobrutalism).

See `/planning/research/STACK.md` for full version table, installation commands, and version compatibility matrix.

**Core technologies:**
- `@tambo-ai/react` + `@tambo-ai/react-ui-base`: Tambo provider, hooks, and headless chat primitives — the library being demonstrated
- `@primer/react` (38.14.0): GitHub Primer skin — full React 19 support, straightforward install
- `@shopify/polaris` (13.9.5): Shopify Polaris skin — React 19 peer dep conflict; use npm overrides in package.json
- `@carbon/react` (1.102.0): IBM Carbon skin — React 19 supported; requires Dart Sass as dev dependency
- `neobrutalism-components`: Neobrutalism skin — not on npm; copy-paste via shadcn CLI after Tailwind v4 setup
- `nes.css` (2.3.0): Retro pixel skin — pure CSS, import stylesheet only, build components from scratch
- Vendored retro-futuristic components: Not on npm; copy CRTTerminal.tsx and LCDGadget.tsx from GitHub source

### Expected Features

Research confirms this is a demo, not a product. Every feature decision should serve one question: "Does this help a developer understand that Tambo is UI-agnostic?" Features that don't serve that proof are waste.

See `/planning/research/FEATURES.md` for full feature table, dependency graph, and anti-features list.

**Must have (table stakes):**
- Home page with navigation links to all 6 skins — without this, the demo has no entry point
- 6 fully functional chat demo pages — all 6 required; fewer skins weakens the "any library" claim
- Identical 3-panel layout across all 6 pages (sidebar + message history + input) — structural parity is the visual proof
- Real Tambo thread state (`useTamboThreadList`, `useTambo`, `useTamboThreadInput` wired up) — mock data would undermine the demo
- Thread selector sidebar with create, list, and switch functionality — shows full API surface
- Message history display with streaming response — live token streaming is the "wow" moment
- CSS isolation between pages — if Primer styles leak into Carbon, the demo is broken
- Global `TamboProvider` (per skin) — required by all Tambo hooks

**Should have (differentiators):**
- Loading/streaming indicator per skin — each skin styles it differently, reinforcing library isolation
- Empty state for new threads — teaches developers what to render on first load
- "New thread" button in sidebar — discoverable thread creation
- Code annotation / library label on each page — reminds the viewer what design system they are seeing
- Demo prompt suggestions in input — shows developers how to add contextual hints

**Defer to v2+:**
- Thread auto-naming from first message
- Mobile-responsive layouts (desktop-first is acceptable for demo)
- Markdown/rich text rendering in messages
- File upload or image attachment support

### Architecture Approach

Each of the 6 skins lives in its own Next.js App Router route group (`app/(primer)/`, `app/(polaris)/`, etc.). Each group has its own `layout.tsx` that imports that skin's CSS and mounts a TamboProvider. Each group's `page.tsx` composes three components from the skin's folder in `src/skins/[skin]/`: Sidebar, MessageHistory, and MessageInput. The root `layout.tsx` stays minimal — no CSS imports, no providers — to prevent any bleed. Because route group navigation triggers full page reloads, CSS is fully isolated at runtime.

See `/planning/research/ARCHITECTURE.md` for system diagram, component responsibility table, data flow sequences, and anti-patterns.

**Major components:**
1. Root `layout.tsx` — bare HTML shell only; imports no library CSS
2. Skin `layout.tsx` (x6) — imports skin CSS, mounts TamboProvider for that skin's isolated context
3. Skin `page.tsx` (x6) — composes the 3-panel ChatShell from the skin's own components
4. `src/skins/[skin]/Sidebar.tsx` (x6) — renders thread list, handles switching, "New thread" action via `useTamboThreadList()`
5. `src/skins/[skin]/MessageHistory.tsx` (x6) — renders messages, auto-scrolls, shows streaming state via `useTambo()`
6. `src/skins/[skin]/MessageInput.tsx` (x6) — controlled input, submit on Enter/button via `useTamboThreadInput()`
7. `src/lib/tambo.ts` — single file exporting TamboProvider config (API key from env var)

### Critical Pitfalls

See `/planning/research/PITFALLS.md` for full pitfall catalog with warning signs, recovery strategies, and a phase-to-pitfall mapping table.

1. **Global CSS stylesheet accumulation** — Next.js App Router does not unload stylesheets during client-side navigation (confirmed intentional behavior). Mitigation: use route groups with separate root layouts, which force full page reloads and guarantee stylesheet isolation. Never import any library CSS at root layout or globals.css.

2. **Tailwind preflight bleed for neobrutalism skin** — Tailwind's `@tailwind base` resets all bare HTML elements globally, corrupting other skins. Mitigation: disable Tailwind preflight (`corePlugins: { preflight: false }`) or use Tailwind v4 layer scoping so resets are contained to the neobrutalism route group.

3. **Polaris React 19 peer dependency conflict** — Polaris locks to `react: ^18.0.0`; npm install fails on React 19 without workaround. Mitigation: add `"overrides": { "@shopify/polaris": { "react": "^19.2.3" } }` to package.json before installation.

4. **Carbon Dart Sass requirement** — Carbon v11 uses Sass Modules (`@use`/`@forward`) and requires Dart Sass; legacy node-sass fails. Mitigation: install `sass` (Dart Sass) as a dev dependency, never `node-sass`.

5. **Primer styled-components SSR hydration mismatch** — Primer uses styled-components which generates class names server-side that differ from client, causing React hydration errors. Mitigation: add `'use client'` to Primer page, or configure `compiler: { styledComponents: true }` in `next.config.js`.

6. **Tambo API key exposure** — `NEXT_PUBLIC_` env vars are bundled into client JavaScript and visible in the browser. Mitigation: use env var approach (accepted risk for demo context), ensure `.env.local` is in `.gitignore`, restrict the demo API key's permissions at the Tambo project level.

## Implications for Roadmap

Based on combined research, the dependency graph is clear and shallow. CSS isolation must be proven before any skin is built. One reference skin must be completed end-to-end before the pattern is replicated. The suggested phase structure below reflects these constraints.

### Phase 1: Foundation — Project Setup and CSS Isolation

**Rationale:** CSS isolation is the single most consequential architectural decision. Getting it wrong after 6 skins are built means a full refactor. Establish it first, verify it, then build on it. Also covers the one infrastructure concern that touches every subsequent phase: Tambo API key handling.

**Delivers:** A working Next.js app with 6 empty route groups, proven CSS isolation between them, Tambo env var configuration, and a minimal home page stub.

**Addresses:** Style isolation (table stakes feature), `TamboProvider` infrastructure, API key security

**Avoids:** Global CSS accumulation (Pitfall 1), library CSS reset conflicts (Pitfall 2), API key exposure (Pitfall 8)

**Research flag:** Standard patterns — Next.js route groups are well-documented; no additional research needed.

### Phase 2: First Skin End-to-End — GitHub Primer

**Rationale:** Primer is the most straightforward library to start with (full React 19 support, npm-installable). Building one complete skin end-to-end proves the architecture before it is replicated 5 more times. Any issues with the Tambo hook wiring or layout contract are found here, not after all 6 skins exist.

**Delivers:** A fully functional chat demo page using GitHub Primer — thread sidebar, streaming message history, message input, all wired to real Tambo hooks.

**Uses:** `@primer/react`, `@tambo-ai/react`, `@tambo-ai/react-ui-base`, `useTamboThreadList`, `useTambo`, `useTamboThreadInput`

**Implements:** Sidebar, MessageHistory, MessageInput components in `src/skins/primer/`

**Avoids:** Primer styled-components hydration mismatch (Pitfall 7) — verify with production build before proceeding

**Research flag:** Standard patterns — Primer is well-documented; styled-components SSR may need one-time investigation.

### Phase 3: Brand Design System Skins — Polaris and Carbon

**Rationale:** Polaris and Carbon share the "brand design system" category and both have known integration quirks that are best resolved together before moving to the aesthetic libraries. Addressing their peer dep and SCSS issues as a pair keeps the tricky installs grouped.

**Delivers:** Two additional fully functional chat demo pages using Shopify Polaris and IBM Carbon.

**Uses:** `@shopify/polaris` (with npm overrides for React 19), `@carbon/react` (with Dart Sass)

**Avoids:** Polaris React 19 peer dep conflict (Pitfall 3) — apply overrides before install; Carbon Dart Sass failure (Pitfall 4) — verify SCSS pipeline before writing components

**Research flag:** Low — pitfalls are well-documented with specific mitigations; no new research needed.

### Phase 4: Style/Aesthetic Library Skins — Neobrutalism, nes.css, Retro-Futuristic

**Rationale:** These three libraries require non-standard integration (copy-paste CLI, pure CSS, vendored source files). Grouping them in a final phase means the Tailwind + preflight decision and retro-futuristic vendoring are handled together, with CSS isolation already proven stable from Phase 1.

**Delivers:** Three additional fully functional chat demo pages (neobrutalism, nes.css, retro-futuristic).

**Avoids:** Tailwind preflight bleed into other skins (Pitfall 6) — verify other pages after Tailwind is added; retro-futuristic npm assumption (Pitfall 5) — vendor components before starting page build; nes.css pixel font containment — scope Press Start 2P font to nes route group only

**Research flag:** Medium — neobrutalism Tailwind scoping strategy may need validation. Retro-futuristic CSS asset paths (`url()` references) may need investigation after vendoring.

### Phase 5: Polish and Home Page

**Rationale:** Home page navigation is the last thing to build — all 6 links must already exist and be verified working. Polish (loading indicators, empty states, library labels) is applied after all skins are functional so it doesn't mask underlying issues.

**Delivers:** Home page with navigation grid to all 6 demos; per-skin streaming indicators, empty states, library labels, and demo prompt suggestions.

**Addresses:** Home page (table stakes), loading indicators, empty states, library labels (differentiators)

**Research flag:** Standard patterns — no research needed; this is UI polish with established patterns.

### Phase Ordering Rationale

- CSS isolation cannot be retrofitted after skins exist — it must precede all skin work (Phase 1 first).
- One reference skin must exist before replication — the Primer skin (Phase 2) defines the structural contract.
- Brand systems (Polaris, Carbon) share common integration challenges best solved together (Phase 3).
- Aesthetic libraries (neobrutalism, nes.css, retro-futuristic) require non-standard setup best handled as a group (Phase 4).
- Home page and polish are last — they depend on all 6 skins existing and working (Phase 5).
- This order directly mirrors the MVP recommendation in FEATURES.md and the build order implications in ARCHITECTURE.md.

### Research Flags

Phases likely needing `/gsd:research-phase` during planning:
- **Phase 4 (neobrutalism):** Tailwind v4 layer scoping in Next.js App Router is a newer pattern; confirm the exact config for disabling/scoping preflight to a route group without affecting other pages.
- **Phase 4 (retro-futuristic):** After vendoring components, CSS `url()` asset references may need adaptation for Next.js public folder conventions — verify before building.

Phases with standard patterns (skip research-phase):
- **Phase 1:** Next.js route groups with separate layouts are officially documented.
- **Phase 2:** Primer, Tambo hooks, and the 3-panel layout are all well-documented.
- **Phase 3:** Polaris React 19 override and Carbon Dart Sass fix are specific, documented mitigations.
- **Phase 5:** UI polish is standard React component work.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Core packages verified via npm registry; version compatibility confirmed; two libraries (retro-futuristic, neobrutalism) not on npm — confirmed by direct repo check |
| Features | HIGH | Feature set derived from official Tambo SDK docs and hooks; feature scope is tightly constrained by the demo's single purpose |
| Architecture | HIGH | Route group CSS isolation verified against official Next.js docs and confirmed GitHub issues; Tambo hook API verified against official source |
| Pitfalls | HIGH | Most pitfalls backed by filed GitHub issues with resolution status; Polaris community thread and Carbon SCSS issues are documented and specific |

**Overall confidence:** HIGH

### Gaps to Address

- **Tambo alpha API stability:** `@tambo-ai/react-ui-base` is at `0.1.0-alpha.8`. The exact hook signatures and available exports should be verified against source before each phase begins. The package may change between roadmap creation and implementation.
- **Tailwind v4 route-group scoping:** Tailwind v4 is recent; the exact configuration for disabling preflight scoped to a single route group (rather than globally) has limited documented examples. This needs a quick spike before Phase 4.
- **Neobrutalism shadcn component set:** The specific shadcn components available from neobrutalism.dev that are suitable for Sidebar, MessageHistory, and MessageInput patterns should be confirmed at implementation time — the component set may have changed since research.
- **retro-futuristic CSS asset paths:** The vendored components reference assets with relative paths from the original Vite project structure. These will likely need adaptation for Next.js public folder conventions — a small but non-trivial amount of work.

## Sources

### Primary (HIGH confidence)
- npm registry (`npm show <package>`) — all package versions, peer dependencies, and publish dates
- `https://github.com/tambo-ai/tambo/blob/main/packages/react-ui-base/src/index.ts` — confirmed Tambo exports
- `https://docs.tambo.co/` — official Tambo documentation
- `https://nextjs.org/docs/app/api-reference/file-conventions/route-groups` — Next.js route groups
- `https://github.com/vercel/next.js/issues/58597` and `#65672` — CSS stylesheet persistence in App Router, confirmed intentional
- `https://github.com/Imetomi/retro-futuristic-ui-design` — confirmed not on npm; standalone Vite app

### Secondary (MEDIUM confidence)
- `https://community.shopify.dev/t/shopify-polaris-react-19-support/6010` — Polaris React 19 runtime compatibility
- `https://www.neobrutalism.dev/docs` — neobrutalism copy-paste model, Tailwind requirement
- `https://github.com/carbon-design-system/carbon/issues/17458` and `#18271` — Carbon SCSS / Next.js 15 issues
- `https://primer.style/guides/react/` — Primer styled-components peer dependency

### Tertiary (LOW confidence — validate during implementation)
- Tailwind v4 preflight scoping in route groups — limited documented examples; spike recommended before Phase 4
- nes.css font containment strategy — inferred from CSS architecture principles; validate in Phase 4

---
*Research completed: 2026-03-04*
*Ready for roadmap: yes*
