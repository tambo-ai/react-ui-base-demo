---
phase: 03-brand-skins
plan: "01"
subsystem: polaris-skin
tags: [polaris, shopify, tambo, skin, chat-ui]
one_liner: "Shopify Polaris chat skin with AppProvider, 3-panel layout, and all Tambo hooks wired"
dependency_graph:
  requires: []
  provides: [polaris-skin]
  affects: [src/app/(polaris)/layout.tsx, src/app/(polaris)/polaris/page.tsx]
tech_stack:
  added: ["@shopify/polaris@13.9.5", "@shopify/polaris-icons"]
  patterns: ["AppProvider wrapping TamboProvider", "route group CSS isolation", "inline-style layout with Polaris interactive components"]
key_files:
  created:
    - src/skins/polaris/PolarisSidebar.tsx
    - src/skins/polaris/PolarisMessageHistory.tsx
    - src/skins/polaris/PolarisMessageInput.tsx
  modified:
    - package.json
    - package-lock.json
    - src/app/(polaris)/layout.tsx
    - src/app/(polaris)/polaris/page.tsx
decisions:
  - "@shopify/polaris requires React 19 overrides in package.json — added overrides block to resolve peer dep mismatch"
  - "Polaris TextField onChange returns string value (not event) — used (val) => setValue(val) pattern"
  - "Polaris Spinner uses accessibilityLabel prop (not srText like Primer) — adjusted accordingly"
  - "onKeyDown for Ctrl+Enter wrapped in parent div since Polaris TextField does not expose native keyboard events"
metrics:
  duration_minutes: 25
  completed_date: "2026-03-04"
  tasks_completed: 2
  files_changed: 7
---

# Phase 03 Plan 01: Polaris Skin Summary

Shopify Polaris chat skin with AppProvider, 3-panel layout, and all Tambo hooks wired identically to the Primer reference pattern.

## What Was Built

Two tasks executed:

**Task 1: Install Polaris + Update Layout**
- Added `@shopify/polaris` and `@shopify/polaris-icons` to dependencies
- Added React 19 overrides block to package.json to resolve peer dep conflicts
- Updated `src/app/(polaris)/layout.tsx` to import Polaris CSS and wrap `TamboProvider` inside `AppProvider`
- Added `userKey="demo-user"` to `TamboProvider`

**Task 2: Create Skin Components + Wire Page**
- `PolarisSidebar.tsx` — thread list + new thread button using Polaris `Button`, `Text`, `Spinner`; wired to `useTambo()` and `useTamboThreadList()`
- `PolarisMessageHistory.tsx` — message bubbles with auto-scroll; wired to `useTambo()` for messages/isStreaming/isWaiting; Polaris `Spinner` and `Text`
- `PolarisMessageInput.tsx` — Polaris `TextField` (multiline) + `Button`; wired to `useTamboThreadInput()`; Ctrl+Enter via parent div `onKeyDown`
- `src/app/(polaris)/polaris/page.tsx` — 3-panel flex layout composing all three skin components

## Verification

- TypeScript: `npx tsc --noEmit` passes with 0 errors
- No Polaris-specific build errors
- All 3 skin components exist with `"use client"` directive
- All Tambo hooks wired identically to Primer reference pattern

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] @shopify/polaris-icons not in original install command**
- **Found during:** Task 2 (PolarisSidebar uses PlusIcon)
- **Issue:** Plan's install step only mentioned `@shopify/polaris`, but `PlusIcon` requires `@shopify/polaris-icons`
- **Fix:** Included `@shopify/polaris-icons` in the npm install command
- **Files modified:** package.json, package-lock.json

**2. [Rule 1 - Bug] Polaris Spinner prop name differs from Primer**
- **Found during:** Task 2
- **Issue:** Primer's `Spinner` uses `srText` prop; Polaris `Spinner` uses `accessibilityLabel`
- **Fix:** Used `accessibilityLabel` in both `PolarisSidebar` and `PolarisMessageHistory`
- **Files modified:** src/skins/polaris/PolarisSidebar.tsx, src/skins/polaris/PolarisMessageHistory.tsx

**3. [Rule 1 - Bug] Polaris TextField onChange returns string, not event**
- **Found during:** Task 2
- **Issue:** Plan referenced Primer pattern `onChange={(e) => setValue(e.target.value)}` but Polaris `TextField` onChange signature is `(value: string) => void`
- **Fix:** Used `onChange={(val) => setValue(val)}` in PolarisMessageInput
- **Files modified:** src/skins/polaris/PolarisMessageInput.tsx

### Out-of-scope Pre-existing Issues (Deferred)

The build reports 90 errors all from `@carbon/react/index.scss.css` (missing IBM Plex font asset paths). This is a pre-existing issue unrelated to this plan's changes — deferred to Phase 4 (Carbon skin).

## Commits

- `8a2d8a2` — feat(03-brand-skins-01): install Polaris and update layout with AppProvider
- `f61fec4` — feat(03-brand-skins-01): create Polaris skin components and wire 3-panel page

## Self-Check

- [x] src/skins/polaris/PolarisSidebar.tsx exists
- [x] src/skins/polaris/PolarisMessageHistory.tsx exists
- [x] src/skins/polaris/PolarisMessageInput.tsx exists
- [x] src/app/(polaris)/polaris/page.tsx updated
- [x] src/app/(polaris)/layout.tsx has AppProvider + Polaris CSS import
- [x] Commits 8a2d8a2 and f61fec4 exist
- [x] TypeScript passes with 0 errors
