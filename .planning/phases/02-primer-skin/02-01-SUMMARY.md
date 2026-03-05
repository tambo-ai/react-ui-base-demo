---
phase: 02-primer-skin
plan: 01
subsystem: ui
tags: [primer-react, tambo, next-js, react, chat-ui, design-system]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: Route group layout structure, TamboProvider, src/lib/tambo.ts, 3-panel page skeleton

provides:
  - "@primer/react and @primer/primitives installed"
  - "PrimerSidebar: NavList thread list with New Thread button"
  - "PrimerMessageHistory: streaming message display with auto-scroll and Spinner"
  - "PrimerMessageInput: Textarea + Send button with Ctrl+Enter shortcut"
  - "layout.tsx: ThemeProvider + BaseStyles + userKey=demo-user wired"
  - "primer/page.tsx: 3-panel composition of all skin components"

affects:
  - "03-carbon-skin"
  - "04-tailwind-retro-skin"
  - "05-polaris-skin"

# Tech tracking
tech-stack:
  added:
    - "@primer/react@38.14.0"
    - "@primer/primitives@11.5.1"
    - "@primer/octicons-react (auto-installed as @primer/react dep)"
  patterns:
    - "Skin components are pure presentational wrappers around Tambo hooks"
    - "Layout structure uses inline styles; Primer components only for interactive elements"
    - "CSS design tokens imported via @primer/primitives/dist/css/functional/themes/light.css"
    - "ThemeProvider colorMode=day avoids SSR hydration mismatch"
    - "userKey=demo-user required on TamboProvider for thread ownership scoping"

key-files:
  created:
    - "src/skins/primer/PrimerSidebar.tsx"
    - "src/skins/primer/PrimerMessageHistory.tsx"
    - "src/skins/primer/PrimerMessageInput.tsx"
  modified:
    - "src/app/(primer)/layout.tsx"
    - "src/app/(primer)/primer/page.tsx"

key-decisions:
  - "@primer/react v38 removed the Box/sx system entirely - layout uses plain div + inline styles, Primer components used for interactive elements only"
  - "Primer CSS design tokens used as CSS custom properties in inline styles (var(--borderColor-default)) for Primer-themed colors without sx"
  - "userKey=demo-user added to TamboProvider — required for thread list and thread operations to work"

patterns-established:
  - "Pattern: Skin component = Tambo hook state + design system interactive components + plain HTML for layout"
  - "Pattern: Content extraction from TamboThreadMessage.content blocks via filter(c => c.type === 'text').map(c => c.text).join('')"
  - "Pattern: NavList.Item as=button for thread switching (no href, avoids invalid <a> warning)"
  - "Pattern: isStreaming || isWaiting drives loading indicator visibility"

requirements-completed: [SKIN-01, CHAT-01, CHAT-02, CHAT-03, CHAT-04, CHAT-05, CHAT-06, CHAT-07]

# Metrics
duration: 12min
completed: 2026-03-04
---

# Phase 2 Plan 01: Primer Skin Summary

**GitHub Primer React chat UI with NavList sidebar, streaming message history, and controlled textarea input wired to useTambo/useTamboThreadList/useTamboThreadInput hooks**

## Performance

- **Duration:** ~12 min
- **Started:** 2026-03-04T00:00:00Z
- **Completed:** 2026-03-04T00:12:00Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Installed @primer/react and @primer/primitives, wired ThemeProvider + BaseStyles + userKey to the Primer route group layout
- Created three Primer skin components (PrimerSidebar, PrimerMessageHistory, PrimerMessageInput) fully wired to Tambo hooks
- Composed the 3-panel Primer chat page at /primer with real streaming, thread management, and input handling

## Task Commits

Each task was committed atomically:

1. **Task 1: Install Primer React and update layout with ThemeProvider** - `43c2ee8` (feat)
2. **Task 2: Create Primer skin components and wire page** - `e1f7517` (feat)

## Files Created/Modified

- `src/app/(primer)/layout.tsx` - Added ThemeProvider (colorMode=day), BaseStyles, Primer CSS import, userKey="demo-user" on TamboProvider
- `src/skins/primer/PrimerSidebar.tsx` - Thread list (NavList), New Thread button (Button + PlusIcon), useTambo + useTamboThreadList wired
- `src/skins/primer/PrimerMessageHistory.tsx` - Message bubbles with user/assistant styling, Spinner for streaming state, auto-scroll with useRef + useEffect
- `src/skins/primer/PrimerMessageInput.tsx` - Textarea + Send Button, Ctrl+Enter shortcut, useTamboThreadInput wired
- `src/app/(primer)/primer/page.tsx` - 3-panel layout composing all three skin components

## Decisions Made

- Used inline styles with CSS custom properties (var(--borderColor-default)) for layout containers, since @primer/react v38 removed the Box/sx system entirely. Primer components (NavList, Button, Spinner, Text, Heading, Textarea) used only for interactive/display elements.
- colorMode="day" instead of "auto" to avoid SSR hydration mismatch without needing preventSSRMismatch prop.
- userKey="demo-user" added as a static string — sufficient for demo purposes; required for thread ownership scoping in Tambo SDK v1.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] @primer/react v38 removed Box and sx prop system entirely**
- **Found during:** Task 2 (Create Primer skin components)
- **Issue:** Plan referenced `Box` with `sx` prop throughout all three components. @primer/react 38.14.0 has completely removed Box and the sx system (migrated to pure CSS Modules + design tokens). Neither Box, nor sx on any component, exists in this version.
- **Fix:** Replaced all `Box sx={{...}}` with plain `div` with inline styles. Used CSS custom properties (var(--borderColor-default), etc.) for Primer design token colors. Kept Primer components only for interactive elements (NavList, Button, Spinner, Text, Heading, Textarea).
- **Files modified:** PrimerSidebar.tsx, PrimerMessageHistory.tsx, PrimerMessageInput.tsx
- **Verification:** Build passes with no TypeScript errors
- **Committed in:** e1f7517 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - Bug)
**Impact on plan:** Required adaptation but does not affect functionality. Components achieve the same visual structure and behavior using a compatible approach.

## Issues Encountered

- The research doc correctly noted Box/sx might not be available (Pitfall 4) but still recommended using Box/sx in patterns. The installed v38.14.0 has fully removed it. Adaptation was straightforward — layout structure reverted to inline styles while Primer components handle interactive elements.

## User Setup Required

None - no external service configuration required beyond the NEXT_PUBLIC_TAMBO_API_KEY already set up in Phase 1.

## Next Phase Readiness

- Primer skin is the reference implementation proving full Tambo hook wiring end-to-end
- Pattern established: skin component = Tambo hooks + design system components + plain HTML layout
- This pattern is directly replicable for Carbon (Phase 3), Tailwind/Retro (Phase 4), and Polaris (Phase 5)
- No blockers for subsequent phases

## Self-Check: PASSED

All created files verified present. All task commits verified in git history.

---
*Phase: 02-primer-skin*
*Completed: 2026-03-04*
