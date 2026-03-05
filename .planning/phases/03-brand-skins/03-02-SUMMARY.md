---
phase: 03-brand-skins
plan: 02
subsystem: carbon-skin
tags: [carbon, ibm, chat, skin, tambo]
dependency_graph:
  requires: []
  provides: [SKIN-03]
  affects: [src/app/(carbon)]
tech_stack:
  added: ["@carbon/react", "sass"]
  patterns: ["Carbon kind prop", "InlineLoading for streaming", "SCSS import via index.scss"]
key_files:
  created:
    - src/skins/carbon/CarbonSidebar.tsx
    - src/skins/carbon/CarbonMessageHistory.tsx
    - src/skins/carbon/CarbonMessageInput.tsx
  modified:
    - src/app/(carbon)/layout.tsx
    - src/app/(carbon)/carbon/page.tsx
    - next.config.ts
    - package.json
decisions:
  - "Carbon SCSS import used via @carbon/react/index.scss (no pre-built CSS directory exists in package)"
  - "sassOptions.silenceDeprecations added for legacy-js-api to suppress Carbon SCSS deprecation warnings"
  - "Pre-existing build failures (Polaris, Tailwind missing packages) are out of scope — Carbon-specific TypeScript is clean"
metrics:
  duration: ~10 minutes
  completed: 2026-03-04
  tasks_completed: 2
  files_created: 3
  files_modified: 4
---

# Phase 3 Plan 02: IBM Carbon Skin Summary

**One-liner:** IBM Carbon chat skin with 3-panel layout using Carbon Button/Heading/TextArea/InlineLoading wired to Tambo hooks, mirroring the Primer reference pattern.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Install Carbon + sass, update layout | eaca847 | package.json, next.config.ts, layout.tsx |
| 2 | Create Carbon skin components and wire page | 8a31258 | 4 component files |

## What Was Built

### CarbonSidebar (`src/skins/carbon/CarbonSidebar.tsx`)
- Hooks: `useTambo()` for `currentThreadId`, `switchThread`, `startNewThread`; `useTamboThreadList()` for thread list
- UI: Carbon `Heading`, `Button` with `Add` icon (kind="primary" for new thread, primary/ghost for list items)
- Layout: 260px fixed sidebar with border-right, flex column

### CarbonMessageHistory (`src/skins/carbon/CarbonMessageHistory.tsx`)
- Hook: `useTambo()` for `messages`, `isStreaming`, `isWaiting`
- UI: Message bubbles (blue #0f62fe for user, grey #f4f4f4 for assistant), Carbon `InlineLoading` for streaming state
- Auto-scroll via `bottomRef` useEffect on messages change

### CarbonMessageInput (`src/skins/carbon/CarbonMessageInput.tsx`)
- Hook: `useTamboThreadInput()` for `value`, `setValue`, `submit`, `isDisabled`
- UI: Carbon `TextArea` (labelText="Message", hideLabel), Carbon `Button` with `Send` icon
- Keyboard: Ctrl+Enter / Cmd+Enter to send

### Layout Updates
- `next.config.ts`: Added `sassOptions.silenceDeprecations: ["legacy-js-api"]`
- `layout.tsx`: Added `import "@carbon/react/index.scss"`, `className="cds--layer-one"` on body, `userKey="demo-user"` on TamboProvider
- `page.tsx`: 3-panel flex layout composing all three Carbon components

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check: PASSED

- [x] `src/skins/carbon/CarbonSidebar.tsx` exists
- [x] `src/skins/carbon/CarbonMessageHistory.tsx` exists
- [x] `src/skins/carbon/CarbonMessageInput.tsx` exists
- [x] `src/app/(carbon)/layout.tsx` imports Carbon SCSS
- [x] All Carbon files have "use client" directive
- [x] TypeScript clean for Carbon files (zero errors)
- [x] Commits eaca847 and 8a31258 exist
