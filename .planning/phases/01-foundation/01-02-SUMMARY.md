---
phase: 01-foundation
plan: 02
subsystem: ui
tags: [nextjs, tambo, react, route-groups, css-isolation, layout]

# Dependency graph
requires:
  - phase: 01-foundation plan 01
    provides: src/lib/tambo.ts with tamboApiKey export, bare root layout
provides:
  - 6 route group root layouts with TamboProvider (primer, polaris, carbon, neobrutalism, nes, retro)
  - 6 skeleton demo pages with 3-panel layout contract
  - CSS isolation via separate root layouts per skin
affects: [02-primer, 03-polaris, 04-carbon, 05-neobrutalism-nes-retro]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Route group per skin with own root layout (html+body+TamboProvider) for CSS isolation
    - 3-panel layout contract (sidebar 260px left, scrollable message history, fixed-bottom input)
    - Inline styles for structural proof before any skin CSS is introduced

key-files:
  created:
    - src/app/(primer)/layout.tsx
    - src/app/(primer)/primer/page.tsx
    - src/app/(polaris)/layout.tsx
    - src/app/(polaris)/polaris/page.tsx
    - src/app/(carbon)/layout.tsx
    - src/app/(carbon)/carbon/page.tsx
    - src/app/(neobrutalism)/layout.tsx
    - src/app/(neobrutalism)/neobrutalism/page.tsx
    - src/app/(nes)/layout.tsx
    - src/app/(nes)/nes/page.tsx
    - src/app/(retro)/layout.tsx
    - src/app/(retro)/retro/page.tsx
  modified: []

key-decisions:
  - "Each route group layout includes html+body tags making it a root layout — this is the key to CSS isolation (forces full page reload on skin navigation)"
  - "TamboProvider mounted in each skin's root layout, not global root, keeping thread state isolated between demos"
  - "3-panel layout uses inline styles only — proves structural contract before any skin CSS is introduced"

patterns-established:
  - "Route group layout pattern: (skin)/layout.tsx = root layout with TamboProvider wrapping children"
  - "URL routing pattern: (skin)/skin/page.tsx resolves to /skin in browser"
  - "3-panel contract: sidebar(260px) | flex-column(message-history + input)"

requirements-completed: [FOUND-01, FOUND-02, LAYOUT-01, LAYOUT-02, LAYOUT-03, LAYOUT-04]

# Metrics
duration: 4min
completed: 2026-03-05
---

# Phase 1 Plan 02: Route Groups and 3-Panel Layout Summary

**6 Next.js route group root layouts with TamboProvider and structurally-identical 3-panel skeleton pages proving CSS isolation architecture**

## Performance

- **Duration:** ~4 min
- **Started:** 2026-03-05T02:50:12Z
- **Completed:** 2026-03-05T02:54:00Z
- **Tasks:** 2
- **Files modified:** 12

## Accomplishments

- Created 6 route group directories each with a root layout (html+body+TamboProvider) that forces full page reloads between skins, guaranteeing CSS isolation
- Created 6 skeleton demo pages each implementing the 3-panel layout contract (sidebar, message history, message input) using inline styles
- Verified build succeeds with all 6 routes (/primer, /polaris, /carbon, /neobrutalism, /nes, /retro) prerendered as static pages

## Task Commits

Each task was committed atomically:

1. **Task 1: Create 6 route group layouts with TamboProvider** - `3284bdd` (feat)
2. **Task 2: Create 6 skeleton pages with 3-panel layout contract** - `37da9cc` (feat)

## Files Created/Modified

- `src/app/(primer)/layout.tsx` - Root layout with PrimerLayout and TamboProvider
- `src/app/(primer)/primer/page.tsx` - Primer 3-panel skeleton at /primer
- `src/app/(polaris)/layout.tsx` - Root layout with PolarisLayout and TamboProvider
- `src/app/(polaris)/polaris/page.tsx` - Polaris 3-panel skeleton at /polaris
- `src/app/(carbon)/layout.tsx` - Root layout with CarbonLayout and TamboProvider
- `src/app/(carbon)/carbon/page.tsx` - Carbon 3-panel skeleton at /carbon
- `src/app/(neobrutalism)/layout.tsx` - Root layout with NeobrutalismLayout and TamboProvider
- `src/app/(neobrutalism)/neobrutalism/page.tsx` - Neobrutalism 3-panel skeleton at /neobrutalism
- `src/app/(nes)/layout.tsx` - Root layout with NesLayout and TamboProvider
- `src/app/(nes)/nes/page.tsx` - NES 3-panel skeleton at /nes
- `src/app/(retro)/layout.tsx` - Root layout with RetroLayout and TamboProvider
- `src/app/(retro)/retro/page.tsx` - Retro 3-panel skeleton at /retro

## Decisions Made

- Each route group layout includes `html` and `body` tags to be a root layout — without these it becomes a nested layout and loses the full-page-reload behavior required for CSS isolation
- TamboProvider is mounted per-skin layout (not global root) to keep thread state isolated between demos
- All 6 pages use identical structural layout with inline styles only, proving the 3-panel contract before any skin CSS libraries are introduced

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All 6 skin routes resolve and the build is clean — ready for Phase 2 (Primer skin implementation)
- CSS isolation architecture is proven: separate root layouts per route group
- 3-panel layout contract established and verified across all 6 skins

## Self-Check: PASSED

All 12 files verified present. All task commits (3284bdd, 37da9cc) verified in git log.

---
*Phase: 01-foundation*
*Completed: 2026-03-05*
