# Phase 4: Aesthetic Skins — Research

**Researched:** 2026-03-04
**Domain:** Non-standard UI library integration (Neobrutalism.dev, nes.css, retro-futuristic vendored components)
**Confidence:** MEDIUM-HIGH (neobrutalism and nes.css verified via official sources; retro-futuristic verified via GitHub)

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| SKIN-04 | Neobrutalism.dev demo page — all chat components styled with neobrutalism components | shadcn init + globals.css replacement + Tailwind v4; copy Button, Textarea, nav components |
| SKIN-05 | nes.css demo page — all chat components styled with nes.css classes | npm install nes.css; import in route-group layout; use nes-* CSS classes on plain HTML |
| SKIN-06 | Retro-futuristic demo page — all chat components styled with retro-futuristic UI | Vendor CRTTerminal.tsx + CRTTerminal.css + LCDGadget.tsx + LCDGadget.css; build custom chat panels around them |
</phase_requirements>

---

## Summary

Phase 4 introduces three aesthetically distinct skins that all use non-standard distribution models: a copy-paste shadcn-based system (Neobrutalism.dev), a pure CSS class framework (nes.css), and vendored TypeScript source files from a GitHub-only project (retro-futuristic-ui-design). None are installable as conventional npm packages in the standard sense.

The critical challenge is CSS isolation. The project already uses route groups with separate root layouts — this architecture is already in place (confirmed: `(neobrutalism)`, `(nes)`, `(retro)` route groups exist in `src/app/`). Each skin's stylesheet must be imported only inside its own route-group layout to avoid bleed. The neobrutalism skin additionally requires Tailwind v4, whose preflight reset must be disabled or scoped to avoid poisoning the other skins.

The retro-futuristic skin requires special design strategy: `CRTTerminal` and `LCDGadget` are fully self-contained, hardcoded display components that accept no children. They cannot wrap chat content. The implementation must build custom CSS panels that visually match the retro-futuristic aesthetic using the same CSS patterns (scanlines, phosphor glow, amber/LCD color palette) while wiring up Tambo hooks independently.

**Primary recommendation:** For each skin, follow the Primer reference pattern exactly — `"use client"` components, Tambo hooks (`useTambo`, `useTamboThreadList`, `useTamboThreadInput`), layout via plain `div` + inline styles, and design-system elements only for interactive components (buttons, inputs, list items).

---

## Standard Stack

### Core (already installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @tambo-ai/react | 1.1.0 | Hooks: useTambo, useTamboThreadList, useTamboThreadInput | Required; provides all chat state |
| @tambo-ai/react-ui-base | 0.1.0-alpha.8 | Headless primitives (if used) | Being demoed; hooks are sufficient |

### Skin-Specific Stack

| Library | Version | Distribution | Install Method |
|---------|---------|-------------|----------------|
| nes.css | 2.3.0 | npm | `npm install nes.css` |
| Press Start 2P | Google Fonts | CDN / next/font | `next/font/google` in nes route-group layout only |
| tailwindcss | ^4.x | npm | `npm install tailwindcss @tailwindcss/postcss` |
| neobrutalism components | N/A | Copy-paste via shadcn CLI | `npx shadcn@latest init` then copy components |
| CRTTerminal.tsx | N/A | Vendor from GitHub | Manual copy from Imetomi/retro-futuristic-ui-design |
| CRTTerminal.css | N/A | Vendor from GitHub | Manual copy |
| LCDGadget.tsx | N/A | Vendor from GitHub | Manual copy |
| LCDGadget.css | N/A | Vendor from GitHub | Manual copy |

### Installation

```bash
# nes.css
npm install nes.css

# Tailwind v4 (for neobrutalism)
npm install tailwindcss @tailwindcss/postcss

# shadcn init (for neobrutalism — run in project root)
npx shadcn@latest init
# When prompted: choose CSS variables mode (NOT utility class mode)
# Then copy component code from neobrutalism.dev/docs/[component] pages

# retro-futuristic: clone and copy files manually
# git clone https://github.com/Imetomi/retro-futuristic-ui-design /tmp/retro-src
# cp /tmp/retro-src/src/components/CRTTerminal.tsx src/skins/retro/
# cp /tmp/retro-src/src/components/CRTTerminal.css src/skins/retro/
# cp /tmp/retro-src/src/components/LCDGadget.tsx src/skins/retro/
# cp /tmp/retro-src/src/components/LCDGadget.css src/skins/retro/
```

---

## Architecture Patterns

### Existing Project Structure (relevant to Phase 4)

```
src/app/
├── (neobrutalism)/
│   └── neobrutalism/
│       ├── layout.tsx   ← import Tailwind + neobrutalism globals HERE ONLY
│       └── page.tsx
├── (nes)/
│   └── nes/
│       ├── layout.tsx   ← import nes.css HERE ONLY
│       └── page.tsx
├── (retro)/
│   └── retro/
│       ├── layout.tsx   ← no external CSS import needed
│       └── page.tsx
src/skins/
├── primer/              ← reference implementation
├── carbon/
├── polaris/
├── neobrutalism/        ← create: NeoSidebar, NeoMessageHistory, NeoMessageInput
├── nes/                 ← create: NesSidebar, NesMessageHistory, NesMessageInput
└── retro/               ← create: RetroSidebar, RetroMessageHistory, RetroMessageInput
                             + vendored: CRTTerminal.tsx, CRTTerminal.css, LCDGadget.tsx, LCDGadget.css
```

### Pattern: Reference Implementation (follow exactly)

The Primer skin is the reference. Every skin component follows this structure:

```typescript
// Source: src/skins/primer/PrimerSidebar.tsx
"use client";
// 1. Import design-system components
// 2. Import Tambo hooks
import { useTambo, useTamboThreadList } from "@tambo-ai/react";

export function XxxSidebar() {
  const { currentThreadId, switchThread, startNewThread } = useTambo();
  const { data, isLoading } = useTamboThreadList();
  const threads = data?.threads ?? [];
  // Layout: plain div + inline styles
  // Interactive elements: design system components
}
```

Key hook APIs (verified against reference):
- `useTambo()` → `{ currentThreadId, switchThread, startNewThread, messages, isStreaming, isWaiting }`
- `useTamboThreadList()` → `{ data: { threads }, isLoading }`
- `useTamboThreadInput()` → `{ value, setValue, submit, isDisabled }`

### Pattern: nes.css Skin

nes.css is pure CSS classes applied to standard HTML elements. No React components to import — build everything from `<div>`, `<button>`, `<textarea>`, `<ul>`, `<li>` with `nes-*` class names.

```typescript
// src/skins/nes/NesSidebar.tsx
"use client";
import { useTambo, useTamboThreadList } from "@tambo-ai/react";

export function NesSidebar() {
  const { currentThreadId, switchThread, startNewThread } = useTambo();
  const { data, isLoading } = useTamboThreadList();
  const threads = data?.threads ?? [];

  return (
    <div className="nes-container" style={{ width: 260, height: "100%", ... }}>
      <p className="title">Threads</p>
      <button className="nes-btn is-primary" onClick={() => startNewThread()}>
        + New Thread
      </button>
      <ul className="nes-list is-disc">
        {threads.map((thread) => (
          <li
            key={thread.id}
            className={thread.id === currentThreadId ? "nes-text is-primary" : ""}
            onClick={() => switchThread(thread.id)}
            style={{ cursor: "pointer" }}
          >
            {thread.name ?? thread.id.slice(0, 8)}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

CSS import in route-group layout ONLY:
```typescript
// src/app/(nes)/layout.tsx
import "nes.css/css/nes.min.css";
// Font scoped here too
```

### Pattern: Neobrutalism Skin

Neobrutalism uses shadcn/ui components with neobrutalism styling (thick borders, offset shadows, bold colors). Components are copied into the project. Requires Tailwind v4 with preflight disabled.

```typescript
// src/skins/neobrutalism/NeoMessageInput.tsx
"use client";
import { useTamboThreadInput } from "@tambo-ai/react";
// Button and Textarea are copied neobrutalism components
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function NeoMessageInput() {
  const { value, setValue, submit, isDisabled } = useTamboThreadInput();
  // ...
}
```

Tailwind scoping in route-group layout:
```css
/* src/app/(neobrutalism)/neobrutalism.css */
/* Import Tailwind scoped to this skin only */
@import "tailwindcss" layer(neobrutalism);
```

Or in `globals.css` for the route group with `preflight: false`.

### Pattern: Retro-Futuristic Skin

CRTTerminal and LCDGadget are self-contained, accept no children, and cannot be used as wrappers. Build the chat panels using CSS that matches the retro aesthetic — amber/phosphor palette, scanline overlays, monospace fonts — without using these components as structural containers.

Strategy: Use `LCDGadget` as decorative sidebar element. Build chat panels as custom CSS styled to match the retro-futuristic look (dark background, amber `#ffb000` text, `Courier New` or `VT323` monospace font, CSS box-shadow glow effects, border scanlines).

```typescript
// src/skins/retro/RetroMessageHistory.tsx
"use client";
import { useTambo } from "@tambo-ai/react";

export function RetroMessageHistory() {
  const { messages, isStreaming, isWaiting } = useTambo();
  // Custom retro-styled divs — NO use of CRTTerminal/LCDGadget as wrappers
  return (
    <div style={{
      flex: 1, overflowY: "auto", padding: 16,
      background: "#0a0a0a",
      color: "#ffb000",
      fontFamily: "'Courier New', monospace",
    }}>
      {messages.map((msg) => (
        // amber text bubbles with phosphor glow box-shadow
      ))}
    </div>
  );
}
```

### Anti-Patterns to Avoid

- **Importing nes.css in `app/layout.tsx`:** Press Start 2P font will apply to ALL pages project-wide.
- **Importing Tailwind without disabling preflight:** Margin/padding resets bleed into Primer, Carbon, Polaris skins.
- **Trying to use CRTTerminal as a chat wrapper:** It accepts no children; content is hardcoded.
- **Using `nes-react` npm package:** Unmaintained wrapper — import nes.css directly instead.
- **Expecting neobrutalism as an npm package:** Not published; shadcn CLI copy-paste only.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Pixel font for nes.css | Custom CSS @font-face | `next/font/google` with "Press Start 2P" | Handles preload, display:swap, scoping |
| Neobrutalism button styles | Custom CSS from scratch | Copy from neobrutalism.dev/docs/button | Exact border/shadow ratios already calibrated |
| Retro scanline effect | Complex JS animation | Pure CSS: `repeating-linear-gradient` overlay on `::after` pseudo-element | CSS-only, no JS overhead |
| Thread list in nes skin | Custom styled list | `<ul class="nes-list is-disc">` | nes.css already has list variants |
| Retro-futuristic amber glow | Third-party lib | `box-shadow: 0 0 10px #ffb000, 0 0 20px #ffb000` CSS | Two-layer shadow creates phosphor glow |

---

## Common Pitfalls

### Pitfall 1: Tailwind Preflight Bleeds Across All Skins
**What goes wrong:** Installing Tailwind v4 for the neobrutalism skin applies its CSS reset (`margin: 0`, `padding: 0`, `box-sizing: border-box`, heading resets) globally, breaking Primer, Carbon, Polaris, nes.css skins.
**Why it happens:** Tailwind's preflight targets bare HTML elements with no scope selector.
**How to avoid:** In the neobrutalism route-group layout, use Tailwind v4's `@import "tailwindcss"` scoped via CSS layers OR use Tailwind v4's `prefix` option. Verify other skin pages visually after Tailwind is added.
**Warning signs:** Headings losing size, `body` margin disappearing on non-neobrutalism pages.

### Pitfall 2: Press Start 2P Font Leaks to All Pages
**What goes wrong:** Importing nes.css at the wrong level loads the Press Start 2P font globally.
**How to avoid:** Import `nes.css` only in `src/app/(nes)/layout.tsx`. Use `next/font/google` for Press Start 2P within that same layout. Never import in `app/layout.tsx` or `globals.css`.
**Warning signs:** Pixel font visible on Primer or Carbon demo pages.

### Pitfall 3: Retro-Futuristic Components Are Hardcoded — Cannot Wrap Chat Content
**What goes wrong:** CRTTerminal renders a fixed boot animation and menu. LCDGadget renders a fixed surveillance UI. Neither accepts children or customizable content slots. Using them as the chat container means users see hardcoded menus, not real chat messages.
**How to avoid:** Use vendored components as decorative accents only (e.g., LCDGadget in sidebar as visual flair). Build actual Sidebar/MessageHistory/MessageInput as custom CSS-styled components matching the retro aesthetic palette.
**Warning signs:** The chat messages are hidden behind/inside a fixed hardcoded menu.

### Pitfall 4: Neobrutalism Requires CSS Variables Mode (Not Utility Mode)
**What goes wrong:** Neobrutalism no longer supports the utility class variant. If shadcn is initialized in the wrong mode, components will not style correctly.
**How to avoid:** During `npx shadcn@latest init`, select "CSS variables" mode. Replace `globals.css` content with the neobrutalism palette from neobrutalism.dev/styling. Do not use the utility variant.
**Warning signs:** Components render with default shadcn gray styling, no thick borders or offset shadows.

### Pitfall 5: CRTTerminal/LCDGadget CSS Uses Project-Local Class Names
**What goes wrong:** Vendored CSS files use generic class names (`.crt-container`, `.nes-screen`) that may conflict with other skins' class names if both CSS files are loaded simultaneously.
**How to avoid:** CSS files are only imported inside the `(retro)` route-group layout, so they are isolated. Confirm no other skin uses class names starting with `.crt-` or `.lcd-`.
**Warning signs:** Visual glitches on other pages after vendoring retro CSS.

---

## Code Examples

### nes.css — Available Classes for Chat UI

```html
<!-- Container with border -->
<div class="nes-container with-title">
  <p class="title">Threads</p>
</div>

<!-- Primary button -->
<button class="nes-btn is-primary">New Thread</button>

<!-- Textarea -->
<textarea class="nes-textarea"></textarea>

<!-- List -->
<ul class="nes-list is-disc">
  <li>Thread name</li>
</ul>

<!-- Loading balloon / speech bubble -->
<div class="nes-balloon from-left">
  <p>Message text</p>
</div>

<!-- Progress / loading indicator -->
<progress class="nes-progress is-primary" value="70" max="100"></progress>
```

Source: https://nostalgic-css.github.io/NES.css/ (HIGH confidence)

### Tailwind v4 — Scoped Import Strategy

```css
/* src/app/(neobrutalism)/neobrutalism-globals.css */
/* Import Tailwind only for this route group */
@import "tailwindcss";

/* Override preflight to not bleed — Tailwind v4 approach */
/* Use @layer to contain within this file's scope */
```

```typescript
// src/app/(neobrutalism)/layout.tsx
import "./neobrutalism-globals.css"; // scoped to this route group only
```

Source: Tailwind v4 docs (MEDIUM confidence — verify at install time)

### Retro-Futuristic — Phosphor Glow CSS Pattern

```css
/* Amber phosphor text glow */
.retro-text {
  color: #ffb000;
  text-shadow: 0 0 5px #ffb000, 0 0 10px #ff8c00;
}

/* Scanline overlay using pseudo-element */
.retro-panel::after {
  content: "";
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.15) 2px,
    rgba(0, 0, 0, 0.15) 4px
  );
  pointer-events: none;
}

/* Panel border with glow */
.retro-panel {
  border: 1px solid #ffb000;
  box-shadow: 0 0 8px #ffb000, inset 0 0 8px rgba(255, 176, 0, 0.05);
  background: #050505;
  position: relative;
}
```

Source: Derived from CRTTerminal.css patterns (MEDIUM confidence)

### Neobrutalism — Expected Visual Characteristics

From neobrutalism.dev components (verified via site):
- Thick solid black borders (`border: 2px solid black` or `border: 3px solid #000`)
- Offset box shadow (`box-shadow: 4px 4px 0px #000` or similar)
- Bold, saturated background colors (yellows, greens, pinks)
- Sans-serif bold typography
- On-hover: shift + shadow-remove animation

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| neobrutalism npm package | Copy-paste via shadcn CLI from neobrutalism.dev | No npm package exists; must copy source |
| nes-react wrapper | Direct nes.css import + raw HTML | nes-react is unmaintained; pure CSS is simpler |
| Tailwind v3 with shadcn | Tailwind v4 + shadcn (CSS variables mode) | v4 requires `@tailwindcss/postcss` not the v3 PostCSS plugin |
| Retro-futuristic as wrapper | Retro-futuristic as decorative accent only | Components are hardcoded; cannot wrap dynamic content |

---

## Open Questions

1. **Tailwind v4 preflight scoping in Next.js App Router route groups**
   - What we know: Tailwind v4 uses `@import "tailwindcss"` in CSS; route groups have separate layout files
   - What's unclear: Whether importing Tailwind CSS only in `(neobrutalism)/layout.tsx` truly prevents preflight from affecting other route groups (Next.js may still accumulate stylesheets client-side)
   - Recommendation: Run a quick spike — add Tailwind import to neobrutalism layout, navigate to Primer page, inspect DevTools. If preflight bleeds, use Tailwind v4 `@layer` with a `.neobrutalism-root` scope selector.

2. **shadcn init interaction with existing project**
   - What we know: `npx shadcn@latest init` will create/modify `globals.css`, `tailwind.config`, `components/ui/`
   - What's unclear: Whether shadcn init overwrites existing `globals.css` or merges; whether it modifies `next.config.ts`
   - Recommendation: Read shadcn init output carefully; keep neobrutalism globals in a separate CSS file imported only from the neobrutalism layout.

3. **nes.css import path**
   - What we know: Package is `nes.css@2.3.0`; CSS is a standard npm-distributed stylesheet
   - What's unclear: Exact import path — may be `nes.css/css/nes.min.css` or `nes.css`
   - Recommendation: After install, check `node_modules/nes.css/` for the correct CSS file path.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None detected — visual/integration demo; no automated test suite |
| Config file | None |
| Quick run command | `npm run build` (verifies no compile errors) |
| Full suite command | `npm run build && npm run dev` (manual visual inspection) |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SKIN-04 | Neobrutalism page renders chat UI with neobrutalism styling | smoke | `npm run build` (no TS errors) | ❌ Wave 0 |
| SKIN-05 | nes.css page renders chat UI with pixel/retro NES styling | smoke | `npm run build` (no TS errors) | ❌ Wave 0 |
| SKIN-06 | Retro-futuristic page renders chat UI with amber/phosphor styling | smoke | `npm run build` (no TS errors) | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npm run build` — catches TypeScript errors and import failures
- **Per wave merge:** Manual visual check of all 3 new pages + existing skins for CSS bleed
- **Phase gate:** All 3 pages render correctly; no CSS bleed to other skins; full build succeeds

### Wave 0 Gaps
- [ ] No automated test infrastructure — this project is a visual demo; `npm run build` is the primary gate
- [ ] Manual CSS isolation check needed: visit all 6 skin pages after Tailwind is added; verify no bleed
- [ ] Vendored retro files: `src/skins/retro/CRTTerminal.tsx`, `CRTTerminal.css`, `LCDGadget.tsx`, `LCDGadget.css` — must exist before implementation tasks run

---

## Sources

### Primary (HIGH confidence)
- `src/skins/primer/PrimerSidebar.tsx`, `PrimerMessageHistory.tsx`, `PrimerMessageInput.tsx` — verified reference implementation, hook APIs confirmed
- https://github.com/Imetomi/retro-futuristic-ui-design — confirmed 4 files to vendor; no url() asset refs; TypeScript; scale prop only; no children
- https://nostalgic-css.github.io/NES.css/ — nes.css class reference

### Secondary (MEDIUM confidence)
- https://www.neobrutalism.dev/docs/installation — shadcn init required; CSS variables mode only; globals.css replacement
- https://www.neobrutalism.dev/docs — 50+ components available; Tailwind required; shadcn-based
- WebFetch of CRTTerminal.tsx structure — confirmed self-contained, no children, CSS class list

### Tertiary (LOW confidence)
- Tailwind v4 CSS layer scoping strategy for route groups — needs spike to verify in this project's Next.js setup
- Exact nes.css import path after npm install — verify at install time

---

## Metadata

**Confidence breakdown:**
- nes.css integration: HIGH — pure CSS, well-documented, straightforward import
- Neobrutalism setup: MEDIUM — shadcn init interaction with existing project is an unknown; Tailwind preflight scoping needs spike
- Retro-futuristic vendoring: HIGH — GitHub repo structure confirmed; no url() assets; clear copy strategy
- Retro-futuristic design strategy: MEDIUM — CSS patterns derived from component inspection, not tested

**Research date:** 2026-03-04
**Valid until:** 2026-04-04 (neobrutalism.dev may update component APIs; check before planning)
