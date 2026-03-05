---
phase: 04-aesthetic-skins
plan: "01"
subsystem: nes-skin
tags: [nes.css, pixel-art, retro, chat-ui, tambo]
dependency_graph:
  requires: []
  provides: [nes-skin-components, nes-route-group]
  affects: [src/app/(nes), src/skins/nes]
tech_stack:
  added: [nes.css, Press Start 2P (next/font/google)]
  patterns: [pure-css-class-skin, route-group-css-isolation, tambo-hook-wiring]
key_files:
  created:
    - src/skins/nes/NesSidebar.tsx
    - src/skins/nes/NesMessageHistory.tsx
    - src/skins/nes/NesMessageInput.tsx
  modified:
    - src/app/(nes)/layout.tsx
    - src/app/(nes)/nes/page.tsx
    - package.json
    - package-lock.json
decisions:
  - nes.css imported only in (nes)/layout.tsx — route group isolation guarantees no CSS bleed
  - Press Start 2P font applied via next/font/google (weight 400, latin subset) on body element
  - Dark background #212529 via inline style on body
  - nes-balloon from-left/from-right used for AI/user message differentiation
  - nes-progress.is-primary used for streaming/waiting loading indicator
  - Pre-existing Carbon SCSS build failure (from Phase 3) is out of scope — does not affect nes skin
metrics:
  duration: ~25 minutes
  completed: "2026-03-04"
  tasks_completed: 2
  files_created: 3
  files_modified: 4
---

# Phase 4 Plan 01: NES.css Skin Summary

**One-liner:** Pixel-art retro chat skin using nes.css classes (nes-balloon, nes-btn, nes-textarea) with Press Start 2P font scoped to the (nes) route group via CSS isolation.

## What Was Built

Three skin components proving Tambo works with a pure CSS class-based design system (no React component library):

- **NesSidebar** (`src/skins/nes/NesSidebar.tsx`) — Thread sidebar using `nes-container with-title`, `nes-btn is-primary`, `nes-list is-disc`, `nes-text is-primary` for active thread highlight. Wired with `useTambo` + `useTamboThreadList`.
- **NesMessageHistory** (`src/skins/nes/NesMessageHistory.tsx`) — Message area using `nes-balloon from-right` (user) and `nes-balloon from-left` (AI) speech bubbles. Loading state via `nes-progress is-primary`. Wired with `useTambo`.
- **NesMessageInput** (`src/skins/nes/NesMessageInput.tsx`) — Input area using `nes-textarea` and `nes-btn is-success`. Ctrl+Enter to send. Wired with `useTamboThreadInput`.

The `(nes)/layout.tsx` imports `nes.css/css/nes.min.css` and applies Press Start 2P font — both scoped exclusively to the (nes) route group.

## Commits

| Task | Description | Commit |
|------|-------------|--------|
| Task 1 | Install nes.css, layout update with font + CSS import | 15ea65f |
| Task 2 | Create 3 nes skin components + wire page | cbcae69 |

## Deviations from Plan

### Auto-fixed Issues

None — plan executed exactly as written.

### Out-of-Scope Items (Deferred)

**Pre-existing Carbon SCSS build failure** (from Phase 3):
- Build fails with 90 errors: `Module not found: Can't resolve '~@ibm/plex/...'`
- This failure existed before this plan's execution (confirmed via git stash test)
- Not caused by nes.css installation
- Logged to deferred-items per scope boundary rule

## Verification

- nes.css imported ONLY in `src/app/(nes)/layout.tsx` (grep confirmed)
- All 3 skin components export named functions and use correct Tambo hooks
- TypeScript compilation: no type errors (npx tsc --noEmit passed)
- CSS isolation: nes.css is scoped to (nes) route group only

## Self-Check: PASSED

Files exist:
- src/skins/nes/NesSidebar.tsx: FOUND
- src/skins/nes/NesMessageHistory.tsx: FOUND
- src/skins/nes/NesMessageInput.tsx: FOUND
- src/app/(nes)/layout.tsx: FOUND (updated)
- src/app/(nes)/nes/page.tsx: FOUND (updated)

Commits exist:
- 15ea65f: FOUND
- cbcae69: FOUND
