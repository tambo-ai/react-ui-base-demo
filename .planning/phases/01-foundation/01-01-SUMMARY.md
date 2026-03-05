---
phase: 01-foundation
plan: 01
subsystem: ui
tags: [next.js, tambo, react, typescript, scaffold-cleanup]

# Dependency graph
requires: []
provides:
  - "@tambo-ai/react installed and importable"
  - "Bare root layout with no CSS or font opinions"
  - "Centralized Tambo API key in src/lib/tambo.ts"
  - "Environment variable template in .env.local.example"
  - "Minimal home page with navigation links to 6 skin routes"
affects: [02-primer-skin, 03-polaris-skin, 04-carbon-skin, 05-neobrutalism-skin, 06-nes-skin, 07-retro-skin]

# Tech tracking
tech-stack:
  added: ["@tambo-ai/react ^1.1.0"]
  patterns: ["Central API key export from src/lib/tambo.ts", "Route group skin architecture — root layout deliberately bare so skins own all CSS"]

key-files:
  created:
    - src/lib/tambo.ts
    - .env.local.example
  modified:
    - src/app/layout.tsx
    - src/app/page.tsx
    - package.json
    - .gitignore

key-decisions:
  - "Root layout is deliberately bare (no CSS, no fonts) so each skin's route group layout can own its full styling context without interference"
  - "Tambo API key centralized in src/lib/tambo.ts — single import point for all skin layouts"
  - "Added .gitignore negation for .env.local.example so the template is tracked in git"

patterns-established:
  - "API key pattern: import { tamboApiKey } from '@/lib/tambo' in each skin layout"
  - "Scaffold cleanup pattern: delete globals.css and page.module.css when building design-system-specific skins"

requirements-completed: [FOUND-01, FOUND-02, FOUND-03]

# Metrics
duration: 2min
completed: 2026-03-05
---

# Phase 1 Plan 01: Foundation Scaffold Strip Summary

**@tambo-ai/react installed, root layout stripped bare (no CSS/fonts), and Tambo API key centralized — clean foundation for 6 skin route groups**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-03-05T02:47:08Z
- **Completed:** 2026-03-05T02:49:01Z
- **Tasks:** 2
- **Files modified:** 6 (+ 2 deleted)

## Accomplishments
- Installed @tambo-ai/react ^1.1.0 as project dependency
- Stripped Next.js scaffold layout (removed Geist fonts, globals.css import, className on body)
- Created centralized Tambo API key module at src/lib/tambo.ts
- Created .env.local.example to document required environment variable
- Replaced scaffold page.tsx with minimal home page linking to all 6 skin routes
- Deleted globals.css and page.module.css (scaffold CSS no longer needed)

## Task Commits

Each task was committed atomically:

1. **Task 1: Install @tambo-ai/react and create Tambo config** - `0c81aa6` (feat)
2. **Task 2: Strip root layout and clean scaffold files** - `1cc1341` (feat)

## Files Created/Modified
- `src/lib/tambo.ts` - Single source of truth for Tambo API key, reads from NEXT_PUBLIC_TAMBO_API_KEY
- `.env.local.example` - Environment variable template for developers
- `src/app/layout.tsx` - Bare root layout: html/body only, "Tambo UI Demo" metadata
- `src/app/page.tsx` - Minimal home page with links to all 6 skin routes (/primer, /polaris, /carbon, /neobrutalism, /nes, /retro)
- `package.json` - Added @tambo-ai/react dependency
- `.gitignore` - Added negation rule to allow .env.local.example to be tracked

## Decisions Made
- Centralized API key in src/lib/tambo.ts rather than inline per-skin — ensures consistent env var usage across all 6 skin layouts
- Added `.gitignore` negation `!.env.local.example` — the example file is documentation, not a secret, and must be tracked

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added .gitignore negation for .env.local.example**
- **Found during:** Task 1 (Install and config)
- **Issue:** `.gitignore` had `.env*` blanket rule which blocked tracking `.env.local.example`. The plan specified creating this file as a committed template, but the gitignore prevented staging it.
- **Fix:** Added `!.env.local.example` negation line to `.gitignore` so the template file is tracked
- **Files modified:** .gitignore
- **Verification:** `git add .env.local.example` succeeded after fix; file appears in commit
- **Committed in:** `0c81aa6` (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 missing critical configuration)
**Impact on plan:** Necessary for plan's intent — .env.local.example exists specifically to be committed as developer documentation. No scope creep.

## Issues Encountered
None beyond the gitignore deviation above.

## User Setup Required
Developers must copy `.env.local.example` to `.env.local` and add their Tambo API key:
```bash
cp .env.local.example .env.local
# Edit .env.local and set NEXT_PUBLIC_TAMBO_API_KEY=<your_key>
```

## Next Phase Readiness
- Foundation complete — bare root layout and Tambo package ready for Plan 02 (Primer skin route group)
- All 6 skin route paths established in home page (currently return 404 — populated by subsequent plans)
- No blockers

---
*Phase: 01-foundation*
*Completed: 2026-03-05*
