# Phase 1: Foundation - Research

**Researched:** 2026-03-04
**Domain:** Next.js App Router route groups, CSS isolation, TamboProvider configuration, 3-panel layout contract
**Confidence:** HIGH

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FOUND-01 | App uses Next.js App Router with route groups for CSS isolation between demo pages | Route groups with separate root layouts cause full page reload — guarantees CSS isolation. Verified via Next.js official docs and confirmed intentional behavior (GitHub issue #58597). |
| FOUND-02 | TamboProvider is mounted per-skin layout (not shared root) to isolate thread state | TamboProvider is a "use client" component; mounting per-layout keeps thread state scoped to each demo. Pattern verified via tambo-ai/tambo-template reference implementation. |
| FOUND-03 | Tambo API key is configured via environment variable (not hardcoded) | `NEXT_PUBLIC_TAMBO_API_KEY` is the established convention. Verified via official Tambo docs (docs.tambo.co/getting-started/integrate). |
| LAYOUT-01 | Each demo page has a thread selector sidebar on the left | Sidebar is a flex column at fixed width, consuming `useTamboThreadList()`. Structural contract documented in ARCHITECTURE.md. |
| LAYOUT-02 | Each demo page has a message history area as the main panel | MessageHistory takes `flex: 1`, overflows vertically, consumes `useTambo()`. |
| LAYOUT-03 | Each demo page has a message input fixed at the bottom of the main panel | MessageInput is pinned to bottom of the flex column. No absolute positioning needed — flex column with `mt-auto` or similar handles it. |
| LAYOUT-04 | All 6 demo pages have structurally identical layouts (same panel arrangement) | Phase 1 defines the layout contract in prose/code. Phase 2 proves it with the first skin. Identical outer structure enforced via shared inline style spec documented in this phase. |
</phase_requirements>

---

## Summary

Phase 1 establishes the architectural skeleton the remaining phases build on. There are three distinct concerns to address: (1) restructuring the existing Next.js scaffold so the root layout is bare and route groups exist for each of the 6 skins, (2) wiring a working TamboProvider in at least one skeleton layout using an environment variable API key, and (3) defining and verifying the 3-panel layout contract as a concrete structure any skin can fill.

The existing project is a stock `create-next-app` output with Next.js 16.1.6, React 19.2.3, TypeScript, and the React Compiler enabled. No Tambo packages are installed yet. The root `layout.tsx` imports `globals.css` and Geist font variables — both of which need to be handled carefully. The `globals.css` contains global resets (`box-sizing`, `margin: 0`, etc.) that will interfere with skin libraries if not contained.

The critical insight from prior research: route groups with separate root layouts in Next.js App Router trigger full page reloads on navigation between them. This is the only reliable CSS isolation mechanism for libraries that ship opinionated global stylesheets. This must be established in Phase 1 before any skin CSS is introduced.

**Primary recommendation:** Strip the root layout to a bare HTML/body shell, create the 6 route group directories with skeleton layouts, install `@tambo-ai/react`, configure the env var, and define the 3-panel layout as an annotated wireframe structure (inline styles only — no library CSS yet).

---

## Standard Stack

### Core (Phase 1 installs)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @tambo-ai/react | 1.1.0 | TamboProvider, useTambo, useTamboThreadList, useTamboThreadInput | The headless AI layer being demoed; required before any skin work |
| next | 16.1.6 (installed) | App Router, route groups, SSR | Already scaffolded |
| react | 19.2.3 (installed) | UI runtime | Already installed |
| typescript | ^5 (installed) | Type safety | Already configured |

### Environment Setup

| Variable | Value Pattern | Scope |
|----------|--------------|-------|
| `NEXT_PUBLIC_TAMBO_API_KEY` | `your_key_here` | Client-visible (required for TamboProvider in browser) |
| `NEXT_PUBLIC_TAMBO_URL` | Optional — Tambo Cloud default if omitted | Client-visible |

### Supporting (Phase 1 does NOT install)

All skin libraries (Primer, Polaris, Carbon, etc.) are deferred to their respective phases. Phase 1 installs only `@tambo-ai/react`.

**Installation:**
```bash
npm install @tambo-ai/react
```

---

## Architecture Patterns

### Recommended Project Structure (Phase 1 output)

```
src/
├── app/
│   ├── layout.tsx                  # STRIPPED — bare <html><body> only, NO CSS lib imports
│   ├── globals.css                 # STRIPPED — minimal font vars only, no resets
│   ├── page.tsx                    # Placeholder home page (Phase 5 will style it)
│   │
│   ├── (primer)/
│   │   └── layout.tsx              # Skeleton: "use client", TamboProvider, bare <div>
│   │
│   ├── (polaris)/
│   │   └── layout.tsx              # Skeleton: "use client", TamboProvider, bare <div>
│   │
│   ├── (carbon)/
│   │   └── layout.tsx              # Skeleton: "use client", TamboProvider, bare <div>
│   │
│   ├── (neobrutalism)/
│   │   └── layout.tsx              # Skeleton: "use client", TamboProvider, bare <div>
│   │
│   ├── (nes)/
│   │   └── layout.tsx              # Skeleton: "use client", TamboProvider, bare <div>
│   │
│   └── (retro)/
│       └── layout.tsx              # Skeleton: "use client", TamboProvider, bare <div>
│
├── skins/                          # Created as empty directories — filled in Phase 2+
│   ├── primer/
│   ├── polaris/
│   ├── carbon/
│   ├── neobrutalism/
│   ├── nes/
│   └── retro/
│
└── lib/
    └── tambo.ts                    # Exports tamboConfig object (apiKey from env var)
```

### Pattern 1: Bare Root Layout

**What:** Strip `src/app/layout.tsx` to the absolute minimum — `<html>` and `<body>` tags only. No font imports, no `globals.css` beyond truly global variables (custom font var declarations only, not resets).

**When to use:** Always. This is the foundation for CSS isolation.

**Why:** The existing `globals.css` contains `* { box-sizing: border-box; padding: 0; margin: 0; }` — these resets at root will interfere with skin library styles. Additionally, importing Geist fonts at root means those CSS variables bleed into all skin pages even if a skin wants to set its own root font.

**Example:**
```typescript
// src/app/layout.tsx — FINAL STATE after Phase 1
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tambo UI Demo",
  description: "Tambo headless AI chat across 6 UI libraries",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

**Note:** The existing Geist font setup and `globals.css` opinionated resets must be removed. The `page.module.css` from the scaffold can also be removed — the home page gets a minimal unstyled treatment in Phase 1.

### Pattern 2: Route Group with Skeleton Layout

**What:** Each of the 6 skins gets a route group directory `(name)` with a `layout.tsx` that mounts `TamboProvider`. In Phase 1, no skin CSS is imported — just the structural shell.

**When to use:** Create all 6 in Phase 1 so the architecture is provably correct before any skin CSS is introduced.

**Critical detail:** Route groups with separate root layouts require each layout to include `<html>` and `<body>` tags. This is what triggers the full page reload when navigating between groups — because the browser sees a different root HTML document structure.

**Example:**
```typescript
// src/app/(primer)/layout.tsx — Phase 1 skeleton (no Primer CSS yet)
"use client";
import { TamboProvider } from "@tambo-ai/react";
import { tamboConfig } from "@/lib/tambo";

export default function PrimerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TamboProvider {...tamboConfig}>
          {children}
        </TamboProvider>
      </body>
    </html>
  );
}
```

**Note:** The `"use client"` directive is required because TamboProvider uses React Context internally. Server Components cannot use Context.

### Pattern 3: Centralized Tambo Config

**What:** Export TamboProvider props from a single `lib/tambo.ts` so each skin layout can spread them consistently.

**When to use:** Always — prevents each layout from independently managing env var references.

**Example:**
```typescript
// src/lib/tambo.ts
export const tamboConfig = {
  apiKey: process.env.NEXT_PUBLIC_TAMBO_API_KEY!,
} satisfies React.ComponentProps<typeof import("@tambo-ai/react").TamboProvider>;
```

**Simpler alternative** (avoid the circular type reference):
```typescript
// src/lib/tambo.ts
export const tamboApiKey = process.env.NEXT_PUBLIC_TAMBO_API_KEY!;
```

Then each layout: `<TamboProvider apiKey={tamboApiKey}>`.

### Pattern 4: 3-Panel Layout Contract (inline styles only)

**What:** Define the 3-panel layout using inline styles or a minimal CSS module so it works in Phase 1 without any skin library. This proves the structural contract before Phase 2 fills it in.

**When to use:** In the skeleton page component for each route group.

**The contract:**
- Outer container: `display: flex; height: 100vh; overflow: hidden`
- Sidebar: `width: 260px; flex-shrink: 0; overflow-y: auto` (left column)
- Main area: `display: flex; flex-direction: column; flex: 1; overflow: hidden` (right column)
- MessageHistory: `flex: 1; overflow-y: auto` (grows, scrollable)
- MessageInput: `flex-shrink: 0` (pinned bottom — no absolute positioning needed)

**Example:**
```typescript
// src/app/(primer)/page.tsx — Phase 1 structural proof
"use client";

export default function PrimerDemo() {
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <div style={{ width: 260, flexShrink: 0, borderRight: "1px solid #ccc", overflowY: "auto", padding: 16 }}>
        <p>Sidebar (threads)</p>
      </div>
      {/* Main Panel */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
        {/* MessageHistory */}
        <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
          <p>Message history</p>
        </div>
        {/* MessageInput */}
        <div style={{ flexShrink: 0, borderTop: "1px solid #ccc", padding: 16 }}>
          <p>Message input</p>
        </div>
      </div>
    </div>
  );
}
```

This page has no Tambo hooks wired yet — that's Phase 2's job. Phase 1 just proves the structure.

### Anti-Patterns to Avoid

- **Keeping globals.css resets at root:** The existing scaffold's `globals.css` sets `* { box-sizing: border-box; padding: 0; margin: 0; }` and `body { font-family: Arial, ... }`. These MUST be removed from the root — they will interfere with Carbon, Polaris, and nes.css in later phases.
- **Keeping Geist font import at root:** Geist font CSS variables at root mean they exist in every skin's DOM. Skins that define their own root font will have Geist as a fallback. Remove the Geist font import from root layout.
- **Creating route groups without `<html><body>` in their layouts:** Omitting these tags means the route group shares the root layout's document shell — no full page reload, no CSS isolation. Every skin layout MUST be a root layout with `<html>` and `<body>`.
- **Putting TamboProvider in root layout.tsx:** This shares thread state across all skins. Per-skin layouts must each mount their own TamboProvider.
- **Committing `.env.local`:** The API key file must be in `.gitignore`. Check before first commit.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Thread state management | Custom React context + reducer | `TamboProvider` + `useTambo()`, `useTamboThreadList()`, `useTamboThreadInput()` | Tambo handles streaming, thread storage, active thread context — all correct edge cases |
| CSS isolation between skins | CSS Modules scope trickery, Shadow DOM | Route groups with separate root layouts | Only route-group-separate-root-layout triggers full page reload; CSS Modules don't help with global stylesheets from third-party libraries |
| Env var validation | Custom process.env checks | Standard `!` assertion + runtime error | Demo app; not worth infrastructure for validation |

**Key insight:** The CSS isolation problem looks simple but has a documented pitfall that catches everyone — Next.js intentionally retains stylesheets across client-side navigation. The only escape is full page reloads via separate root layouts. This is non-obvious and must be established in Phase 1 before any skin CSS is introduced.

---

## Common Pitfalls

### Pitfall 1: Root Layout Retains Global CSS Across Navigation

**What goes wrong:** If any skin's CSS is imported at the root layout level (or if route groups share a root layout), navigating between skins accumulates stylesheets. Carbon's resets override Primer's tokens. This is confirmed intentional Next.js behavior (GitHub issues #58597, #65672, closed "works as intended").

**Why it happens:** Next.js retains stylesheets during SPA navigation for performance — it assumes a coherent global style foundation, which breaks when 6 design systems each inject opinionated global CSS.

**How to avoid:** All 6 skin layouts must be separate root layouts (include `<html>` and `<body>`). Never import any skin library's CSS in `src/app/layout.tsx`.

**Warning signs:** DevTools shows multiple `<link>` or `<style>` tags from different libraries after navigating between pages.

### Pitfall 2: TamboProvider Must Be "use client"

**What goes wrong:** TamboProvider uses React Context internally. Placing it in a Server Component causes: `TypeError: createContext is not a function` or similar RSC context errors.

**Why it happens:** Next.js App Router defaults to Server Components. Context is client-only.

**How to avoid:** Add `"use client"` to every skin layout that mounts TamboProvider. Phase 1 establishes this pattern.

### Pitfall 3: Route Group Layouts Must Include html + body

**What goes wrong:** If a route group's `layout.tsx` does not include `<html>` and `<body>`, it becomes a nested layout sharing the root's document shell. Navigation between skins becomes SPA-style (no page reload), and CSS accumulates.

**Why it happens:** Next.js Route Groups docs explain: "creating a layout.js inside a group creates a root layout for that group" — but only when it includes the html/body tags. Without them, it's a nested layout, not a root layout.

**How to avoid:** Every skin layout in Phase 1 must have `<html lang="en"><body>...</body></html>` as its return structure.

**Warning signs:** Chrome Network tab shows no full page reload when navigating between `/primer` and `/polaris`.

### Pitfall 4: Existing globals.css Resets Must Be Cleared

**What goes wrong:** The scaffold's `globals.css` sets universal resets (`* { box-sizing: border-box; padding: 0; margin: 0; }`). If left in the root layout, these resets override skin library defaults in unexpected ways — particularly Carbon and nes.css which have their own strong resets.

**Why it happens:** `create-next-app` ships opinionated defaults that assume a single-skin app.

**How to avoid:** Phase 1 must strip `globals.css` to only truly cross-cutting concerns (if any — likely none for this project). The root `layout.tsx` should import no CSS at all, or only a file with zero element selectors.

### Pitfall 5: API Key Exposure via NEXT_PUBLIC

**What goes wrong:** `NEXT_PUBLIC_TAMBO_API_KEY` is bundled into client-side JavaScript and visible to anyone viewing page source. For a public demo this is an accepted risk, but the key must never be committed to git.

**How to avoid:** Create `.env.local` (already in `.gitignore` by Next.js convention). Document in README that users must supply their own key. Verify `.gitignore` covers `.env.local` before first commit.

---

## Code Examples

Verified patterns from official Tambo documentation and tambo-ai/tambo-template:

### TamboProvider Setup (from docs.tambo.co/getting-started/integrate)
```typescript
// src/app/(primer)/layout.tsx
"use client";
import { TamboProvider } from "@tambo-ai/react";

export default function PrimerLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TamboProvider apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}>
          {children}
        </TamboProvider>
      </body>
    </html>
  );
}
```

### Environment Variable File
```bash
# .env.local (DO NOT COMMIT)
NEXT_PUBLIC_TAMBO_API_KEY=your_tambo_api_key_here
```

### Verifying CSS Isolation (manual check procedure)
```bash
# After Phase 1 is built:
# 1. Start dev server: npm run dev
# 2. Navigate to /primer (or any skin page)
# 3. Navigate to /polaris (different skin)
# 4. Open DevTools > Network tab
# 5. Confirm a full page reload occurred (not XHR/fetch)
# 6. Open DevTools > Elements > <head>
# 7. Confirm only one skin's CSS is present
```

### .gitignore Verification
```bash
# Verify .env.local is ignored (Next.js default includes this)
grep ".env.local" .gitignore
# Should output: .env.local
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| iframe sandboxing for CSS isolation | Route groups with separate root layouts | Next.js App Router (2023) | No cross-frame complexity; full page reload guarantees CSS unload |
| CSS Modules for skin isolation | Route group root layouts | Next.js App Router (2023) | Works even when libraries ship global stylesheets (CSS Modules can't contain third-party globals) |
| TamboProvider in root layout | TamboProvider per skin layout | Project decision (2026-03-04) | Thread state isolated per demo; each skin is a fresh session |
| Hardcoded API keys in demos | NEXT_PUBLIC_ env var | Standard practice | Keys not in source; deployable by others |

**Deprecated/outdated in this project:**
- `globals.css` universal resets from scaffold: must be removed — they conflict with skin library resets
- Geist font at root: must be removed — each skin should control its own typography
- `page.module.css` from scaffold: can be deleted — Phase 1 home page uses minimal styling or nothing

---

## Open Questions

1. **Does the existing scaffold's `.gitignore` already include `.env.local`?**
   - What we know: Next.js scaffolds typically include `.env.local` in `.gitignore` by default
   - What's unclear: This specific scaffold's `.gitignore` content not yet verified
   - Recommendation: Verify first thing in Phase 1 execution; add if missing

2. **Should the root layout import any CSS at all?**
   - What we know: The root layout must be minimal; no skin CSS
   - What's unclear: Whether truly zero CSS at root causes any visual issues on the home page
   - Recommendation: Start with zero imports; add only if the home page has visible problems from missing browser defaults

3. **TamboProvider `userKey` prop — required or optional for this demo?**
   - What we know: Official docs show `userKey="user-1"` in examples; this scopes threads to a user
   - What's unclear: Whether omitting `userKey` causes errors or just uses a default scope
   - Recommendation: Include a static `userKey="demo-user"` per skin layout to match documented patterns; low risk either way

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None installed — Next.js scaffold has no test framework |
| Config file | None — Wave 0 must install |
| Quick run command | `npm run build` (type-check + build verification) |
| Full suite command | `npm run build && npm run lint` |

**Note:** Phase 1 is infrastructure/structure — there are no unit-testable behaviors. Validation is structural (file exists, builds, renders) and manual (browser navigation test for CSS isolation). No test framework installation is needed for Phase 1; the build pipeline is the test.

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FOUND-01 | Route groups exist with separate root layouts | structural | `ls src/app/\(primer\)/layout.tsx src/app/\(polaris\)/layout.tsx ...` | Wave 0 creates them |
| FOUND-01 | CSS isolation: navigating between skins triggers full page reload | manual | Open DevTools Network tab; navigate /primer → /polaris; verify full reload | Manual only |
| FOUND-02 | TamboProvider mounted in each skin layout, not root | structural | `grep -r "TamboProvider" src/app/ --include="*.tsx"` — should NOT appear in root `layout.tsx` | Wave 0 creates |
| FOUND-03 | API key from env var, not hardcoded | structural | `grep -r "NEXT_PUBLIC_TAMBO_API_KEY" src/` — should appear; `grep -r "sk-" src/` — should not | Manual + grep |
| LAYOUT-01–04 | 3-panel structure present in all 6 skeleton pages | structural | `npm run build` — TypeScript validates structure; visual inspect in browser | Wave 0 creates |
| All | Project builds without errors | build | `npm run build` | N/A |
| All | No TypeScript errors | type-check | `npx tsc --noEmit` | N/A |

### Sampling Rate
- **Per task commit:** `npm run build` (catches TS errors and build failures)
- **Per wave merge:** `npm run build && npm run lint`
- **Phase gate:** Build green + manual browser navigation test confirms full page reload between skins

### Wave 0 Gaps
- [ ] `src/lib/tambo.ts` — doesn't exist yet; created in Phase 1 Wave 0
- [ ] `src/app/(primer)/layout.tsx` through `src/app/(retro)/layout.tsx` — route group skeletons; created in Wave 0
- [ ] `.env.local` — must be created manually by developer (cannot be committed); document in task
- [ ] `@tambo-ai/react` package — not installed; `npm install @tambo-ai/react` in Wave 0

---

## Sources

### Primary (HIGH confidence)
- [docs.tambo.co/getting-started/integrate](https://docs.tambo.co/getting-started/integrate) — TamboProvider props, NEXT_PUBLIC_TAMBO_API_KEY env var name, "use client" requirement
- [tambo-ai/tambo-template (GitHub)](https://github.com/tambo-ai/tambo-template) — Reference project structure; confirms `src/lib/tambo.ts` pattern, apiKey prop usage
- [Next.js Route Groups docs](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups) — Confirms separate root layouts cause full page reload; html/body required per root layout
- `.planning/research/ARCHITECTURE.md` — Project-specific architecture decisions (route group isolation, per-skin TamboProvider, 3-panel contract)
- `.planning/research/STACK.md` — Package versions, installation commands, compatibility notes
- `.planning/research/PITFALLS.md` — CSS isolation pitfalls, TamboProvider placement anti-patterns, API key security

### Secondary (MEDIUM confidence)
- [Next.js Issue #58597](https://github.com/vercel/next.js/issues/58597) — CSS not removed between pages; intentional behavior confirmation
- [Next.js Issue #65672](https://github.com/vercel/next.js/issues/65672) — Same CSS accumulation issue; closed July 2024 as "works as intended"
- WebSearch results confirming NEXT_PUBLIC_TAMBO_API_KEY is the standard env var name (cross-verified with official docs)

### Tertiary (LOW confidence)
- None in this phase — all critical claims verified via primary sources

---

## Metadata

**Confidence breakdown:**
- Route group CSS isolation mechanism: HIGH — verified via Next.js official docs and confirmed GitHub issues
- TamboProvider API / env var name: HIGH — verified via official Tambo docs and reference template
- 3-panel layout contract: HIGH — project decision from ARCHITECTURE.md; no external library involved
- Existing scaffold state: HIGH — read directly from project files

**Research date:** 2026-03-04
**Valid until:** 2026-05-04 (stable — Next.js route group behavior and Tambo API are well-established; re-verify if Next.js major version changes)
