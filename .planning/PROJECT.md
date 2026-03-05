# Tambo React UI Base Demo

## What This Is

A demo app showcasing `@tambo-ai/react-ui-base` — a headless React component library that provides AI chat primitives (hooks, state, streaming) without any styling. The demo proves that Tambo works with any design system by implementing the exact same chat interface layout using 6 different UI component libraries.

## Core Value

Prove that Tambo is truly UI-agnostic — the same headless functionality works identically regardless of which design system skins it.

## Requirements

### Validated

- ✓ Home page with navigation cards to all 6 demo pages — v1.0
- ✓ Back-navigation from each demo to home — v1.0
- ✓ TamboProvider per-skin layout with CSS isolation via route groups — v1.0
- ✓ 6 demo pages with identical 3-panel chat layout — v1.0
- ✓ Thread management (create, switch, list) via Tambo hooks — v1.0
- ✓ Message send, history, streaming, loading indicator — v1.0
- ✓ GitHub Primer demo page — v1.0
- ✓ Shopify Polaris demo page — v1.0
- ✓ IBM Carbon demo page — v1.0
- ✓ Neobrutalism demo page — v1.0
- ✓ NES.css demo page — v1.0
- ✓ Retro-futuristic demo page — v1.0

### Active

- [ ] All 6 skins use react-ui-base compound components exclusively (no custom hook wiring)
- [ ] All react-ui-base features showcased: messages, input, thread history, images, elicitation, reasoning, tool calls, rendered components
- [ ] Seed messages demonstrate features without empty screens
- [ ] One registered custom component via useTamboComponentRegistration

## Current Milestone: v1.1 react-ui-base Migration

**Goal:** Migrate all 6 demo skins from manual hook wiring to `@tambo-ai/react-ui-base` compound components, and showcase the full feature set of the headless library.

**Target features:**
- Replace all custom Sidebar/MessageHistory/MessageInput with react-ui-base compound components
- Integrate Message.RenderedComponent, ReasoningInfo, ToolcallInfo, Elicitation, MessageInput.FileButton
- Add seed messages showing off all message types
- Register a custom component for AI rendering

### Out of Scope

- Authentication / user accounts — demo is public, no login needed
- Persistent storage — conversations don't need to survive page refresh
- Mobile-responsive layouts — desktop-first demo
- Custom AI model configuration UI — use Tambo defaults
- Performance benchmarking between libraries
- Dark mode toggle — unnecessary complexity for proving UI-agnostic point

## Context

Shipped v1.0 with ~11K LOC TypeScript/CSS across 79 files.
Tech stack: Next.js App Router, React 19, `@tambo-ai/react` v1.1.0.
Design systems: @primer/react v38, @shopify/polaris, @carbon/react + sass, nes.css, custom CSS (neobrutalism + retro).
Architecture: Route groups with separate root layouts (`<html><body>`) for full CSS isolation.

## Constraints

- **Tech stack**: Next.js App Router, React, `@tambo-ai/react`
- **Layout consistency**: All 6 demo pages have the exact same structural layout (3-panel flex)
- **Library isolation**: Each route group has its own root layout preventing CSS bleed

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Headless Tambo + 6 UI skins | Proves "works with anything" message | ✓ Good — all 6 skins work identically |
| Real thread state via Tambo | Demonstrates actual functionality, not just visual mockup | ✓ Good — full CRUD on threads |
| Route groups for CSS isolation | Full page reload between skins prevents CSS bleed | ✓ Good — no cross-contamination |
| Neobrutalism with custom CSS (no Tailwind) | Tailwind preflight would bleed into other skins | ✓ Good — clean isolation |
| Retro-futuristic with custom CSS | Vendored components don't accept children | ✓ Good — amber/phosphor aesthetic achieved |
| Polaris React 19 overrides | Polaris locks to React 18 peer deps | ✓ Good — works with override |
| Carbon + Dart Sass | Carbon requires SCSS compilation | ✓ Good — sassOptions.silenceDeprecations for warnings |

| react-ui-base compound components | Proves library provides everything needed — no custom wiring | — Pending |

---
*Last updated: 2026-03-05 after v1.1 milestone start*
