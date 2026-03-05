# Tambo React UI Base Demo

## What This Is

A demo app showcasing `@tambo-ai/react-ui-base` — a headless React component library that provides AI chat primitives (hooks, state, streaming) without any styling. The demo proves that Tambo works with any design system by implementing the exact same chat interface layout using 6 different UI component libraries.

## Core Value

Prove that Tambo is truly UI-agnostic — the same headless functionality works identically regardless of which design system skins it.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Home page with navigation to all 6 demo pages
- [ ] Shared Tambo provider wrapping the entire app
- [ ] 6 demo pages, each implementing an identical chat layout using a different UI library
- [ ] Chat layout: thread selector sidebar (left), message input (bottom), chat history scrolling up
- [ ] Real Tambo thread management — thread selector switches between separate conversations
- [ ] GitHub Primer demo page
- [ ] Shopify Polaris demo page
- [ ] IBM Carbon demo page
- [ ] Neobrutalism.dev demo page
- [ ] nes.css demo page
- [ ] Retro-futuristic UI demo page

### Out of Scope

- Authentication / user accounts — demo is public, no login needed
- Persistent storage — conversations don't need to survive page refresh
- Mobile-responsive layouts — desktop-first demo
- Custom AI model configuration UI — use Tambo defaults
- Performance benchmarking between libraries

## Context

- Built on a fresh Next.js scaffold (Create Next App)
- `@tambo-ai/react-ui-base` is published on npm
- The 6 UI libraries span three categories:
  - **Brand design systems:** GitHub Primer, Shopify Polaris, IBM Carbon
  - **Style libraries:** Neobrutalism.dev, nes.css, retro-futuristic-ui-design
- Each demo page is self-contained except for the global Tambo provider
- The retro-futuristic UI library: https://github.com/Imetomi/retro-futuristic-ui-design

## Constraints

- **Tech stack**: Next.js (existing scaffold), React, `@tambo-ai/react-ui-base`
- **Layout consistency**: All 6 demo pages must have the exact same structural layout
- **Library isolation**: Each page's styling must not leak into other pages

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Headless Tambo + 6 UI skins | Proves "works with anything" message | — Pending |
| Real thread state via Tambo | Demonstrates actual functionality, not just visual mockup | — Pending |
| 3 brand systems + 3 style libraries | Shows range from enterprise to creative design systems | — Pending |

---
*Last updated: 2026-03-04 after initialization*
