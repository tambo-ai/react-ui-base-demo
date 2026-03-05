# Phase 3: Brand Skins (Polaris + Carbon) - Research

**Researched:** 2026-03-04
**Domain:** Shopify Polaris v13 + IBM Carbon v1 React skin implementation over Tambo headless chat
**Confidence:** HIGH (stack verified in prior research; Primer reference pattern is complete in codebase)

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| SKIN-02 | Shopify Polaris demo page — all chat components styled with Polaris React | Polaris v13 component map + AppProvider + React 19 override documented below |
| SKIN-03 | IBM Carbon demo page — all chat components styled with Carbon React | Carbon v1 component map + Sass setup + pre-built CSS option documented below |
</phase_requirements>

---

## Summary

Phase 3 builds two new skin pages — Shopify Polaris and IBM Carbon — replicating the exact three-panel layout (sidebar / message history / message input) already proven by the Primer reference implementation in Phase 2. The Tambo hook wiring (`useTambo`, `useTamboThreadList`, `useTamboThreadInput`) is identical across all skins; only the visual components change.

Polaris v13 is straightforward to wire but requires a package.json `overrides` entry because it declares a React `^18` peer dep despite working fine at runtime on React 19. Every Polaris component must sit inside an `<AppProvider>` and the entire module must be marked `"use client"`. IBM Carbon requires `sass` (Dart Sass) installed as a dev dep. The safest approach for a demo is to import only the needed Carbon component SCSS files rather than the full `styles.scss` bundle, avoiding long build times and noisy deprecation warnings.

Both skins already have stub route-group layouts and page stubs at `src/app/(polaris)/` and `src/app/(carbon)/`. The layouts need library providers added (Polaris `AppProvider`, Carbon has no extra provider). Skin components should live at `src/skins/polaris/` and `src/skins/carbon/` matching the `src/skins/primer/` pattern.

**Primary recommendation:** Copy the Primer three-component pattern (Sidebar / MessageHistory / MessageInput) exactly. Swap Primer components for Polaris/Carbon equivalents one-for-one. Keep all layout structure as inline styles on plain `<div>` elements — do not use library layout primitives for the three-panel shell (per the Phase 2 decision: `@primer/react v38 removed Box/sx system — layout uses plain div + inline styles`).

---

## Standard Stack

### Core (already installed)

| Library | Version | Purpose | Notes |
|---------|---------|---------|-------|
| @tambo-ai/react | ^1.1.0 | Hooks: useTambo, useTamboThreadList, useTamboThreadInput | Already in package.json |
| react | 19.2.3 | Runtime | Already installed |
| next | 16.1.6 | App Router + route groups | Already installed |

### Polaris Skin

| Library | Version | Purpose | Install |
|---------|---------|---------|---------|
| @shopify/polaris | 13.9.5 | Polaris React components | `npm install @shopify/polaris --legacy-peer-deps` |

**React 19 override required.** Add to `package.json` before installing:

```json
"overrides": {
  "@shopify/polaris": {
    "react": "^19.2.3",
    "react-dom": "^19.2.3"
  }
}
```

Then: `npm install @shopify/polaris`

### Carbon Skin

| Library | Version | Purpose | Install |
|---------|---------|---------|---------|
| @carbon/react | 1.102.0 | Carbon React components + SCSS | `npm install @carbon/react` |
| sass | ^1.97.3 | Dart Sass for Carbon SCSS compilation | `npm install --save-dev sass` |

**Installation:**

```bash
# Polaris (after adding overrides to package.json)
npm install @shopify/polaris

# Carbon
npm install @carbon/react
npm install --save-dev sass
```

---

## Architecture Patterns

### Recommended File Structure

```
src/
├── skins/
│   ├── primer/                  # DONE — reference implementation
│   │   ├── PrimerSidebar.tsx
│   │   ├── PrimerMessageHistory.tsx
│   │   └── PrimerMessageInput.tsx
│   ├── polaris/                 # Phase 3 — NEW
│   │   ├── PolarisSidebar.tsx
│   │   ├── PolarisMessageHistory.tsx
│   │   └── PolarisMessageInput.tsx
│   └── carbon/                  # Phase 3 — NEW
│       ├── CarbonSidebar.tsx
│       ├── CarbonMessageHistory.tsx
│       └── CarbonMessageInput.tsx
├── app/
│   ├── (polaris)/               # STUB EXISTS — needs update
│   │   ├── layout.tsx           # Add AppProvider + import Polaris CSS
│   │   └── polaris/
│   │       └── page.tsx         # Wire skin components
│   └── (carbon)/                # STUB EXISTS — needs update
│       ├── layout.tsx           # Add sass import
│       └── carbon/
│           └── page.tsx         # Wire skin components
```

### Pattern: Tambo Hook Wiring (identical across all skins)

This is the exact pattern from Primer — replicate verbatim for Polaris and Carbon, swapping only the imported UI components.

**Sidebar hook usage:**
```typescript
// src/skins/polaris/PolarisSidebar.tsx
"use client";
import { useTambo, useTamboThreadList } from "@tambo-ai/react";

export function PolarisSidebar() {
  const { currentThreadId, switchThread, startNewThread } = useTambo();
  const { data, isLoading } = useTamboThreadList();
  const threads = data?.threads ?? [];
  // render with Polaris components...
}
```

**MessageHistory hook usage:**
```typescript
// src/skins/polaris/PolarisMessageHistory.tsx
"use client";
import { useTambo } from "@tambo-ai/react";

export function PolarisMessageHistory() {
  const { messages, isStreaming, isWaiting } = useTambo();
  // render with Polaris components...
}
```

**MessageInput hook usage:**
```typescript
// src/skins/polaris/PolarisMessageInput.tsx
"use client";
import { useTamboThreadInput } from "@tambo-ai/react";

export function PolarisMessageInput() {
  const { value, setValue, submit, isDisabled } = useTamboThreadInput();
  // render with Polaris components...
}
```

### Pattern: Polaris Layout Setup

The Polaris layout wraps everything in `AppProvider`. Import the Polaris CSS here at the layout level — it is safe because the `(polaris)` route group has its own root layout, guaranteeing full-page reload between skin navigations (no CSS bleed).

```typescript
// src/app/(polaris)/layout.tsx
"use client";
import "@shopify/polaris/build/esm/styles.css";
import { AppProvider } from "@shopify/polaris";
import { TamboProvider } from "@tambo-ai/react";
import { tamboApiKey } from "@/lib/tambo";

export default function PolarisLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProvider i18n={{}}>
          <TamboProvider apiKey={tamboApiKey} userKey="demo-user">
            {children}
          </TamboProvider>
        </AppProvider>
      </body>
    </html>
  );
}
```

### Pattern: Carbon Layout Setup

Carbon has no mandatory root provider component. Import the component SCSS (or pre-built CSS) at the layout level.

```typescript
// src/app/(carbon)/layout.tsx
"use client";
// Option A: pre-built CSS (no Sass pipeline needed — preferred for demo)
import "@carbon/react/css/index.css";
// Option B: selective SCSS (requires sass dev dep)
// import "@carbon/react/scss/components/button/index.scss";
import { TamboProvider } from "@tambo-ai/react";
import { tamboApiKey } from "@/lib/tambo";

export default function CarbonLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="cds--layer-one">
        <TamboProvider apiKey={tamboApiKey} userKey="demo-user">
          {children}
        </TamboProvider>
      </body>
    </html>
  );
}
```

Note: `cds--layer-one` sets the Carbon token layer for proper background/border colors.

### Pattern: Page Assembly (both skins identical structure)

```typescript
// src/app/(polaris)/polaris/page.tsx
"use client";
import { PolarisSidebar } from "@/skins/polaris/PolarisSidebar";
import { PolarisMessageHistory } from "@/skins/polaris/PolarisMessageHistory";
import { PolarisMessageInput } from "@/skins/polaris/PolarisMessageInput";

export default function PolarisPage() {
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <PolarisSidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <PolarisMessageHistory />
        <PolarisMessageInput />
      </div>
    </div>
  );
}
```

### Anti-Patterns to Avoid

- **Using Polaris layout primitives (BlockStack, InlineStack, Box) for the 3-panel shell:** These add unnecessary complexity. The three-panel shell is 5 lines of inline flex. Keep layout as inline styles; use library components only for interactive elements (buttons, inputs, text, navigation).
- **Importing `@carbon/styles` or full Carbon SCSS bundle:** Triggers 1.5MB SCSS compilation, long build times, and deprecation warnings. Import only what's needed or use the pre-built CSS.
- **Forgetting `AppProvider` wrapping Polaris components:** Polaris throws at runtime without it. It must be in the layout, not in individual components.
- **Not marking Polaris files `"use client"`:** Polaris uses context internally. Any file importing Polaris must be a client component.

---

## Component Maps

### Polaris: Primer component → Polaris equivalent

| Primer Component | Polaris Equivalent | Notes |
|------------------|--------------------|-------|
| `<Heading as="h2">` | `<Text as="h2" variant="headingMd">` | Polaris Text component covers headings |
| `<Button variant="primary">` | `<Button variant="primary">` | Same prop name |
| `<NavList>` / `<NavList.Item>` | `<Navigation>` / custom list | Or plain `<ul>/<li>` with Polaris `<Text>` — Navigation requires complex region setup; simpler to use a custom button list |
| `<Textarea>` | `<TextField multiline={2}>` | Polaris TextField with multiline prop handles textarea |
| `<Spinner size="small">` | `<Spinner size="small">` | Same API |
| `<Text size="medium">` | `<Text variant="bodyMd">` | Polaris Text has variant prop |

**Polaris Navigation component caveat (MEDIUM confidence):** The full `<Navigation>` component is designed for Shopify Admin app navigation and requires `<Navigation.Section>` with complex item shapes. For the thread list, a simpler approach is a plain `<ul>` of `<Button variant="plain">` elements styled with Polaris tokens, or a `<ResourceList>` with single-line items.

### Carbon: Primer component → Carbon equivalent

| Primer Component | Carbon Equivalent | Import Path |
|------------------|-------------------|-------------|
| `<Heading as="h2">` | `<Heading>` | `@carbon/react` |
| `<Button variant="primary">` | `<Button kind="primary">` | `@carbon/react` — note `kind` not `variant` |
| `<NavList>` / thread list | `<SideNav>` / `<SideNavItems>` / `<SideNavLink>` | `@carbon/react` — or plain list with Carbon styling |
| `<Textarea>` | `<TextArea>` | `@carbon/react` |
| `<Spinner size="small">` | `<InlineLoading>` | `@carbon/react` — Carbon's standard inline loading state |
| `<Text>` | `<p>` with Carbon typography classes, or plain text | No direct equivalent; Carbon applies typography globally |

**Carbon `Button` prop difference:** Uses `kind` prop values: `"primary"`, `"secondary"`, `"tertiary"`, `"danger"`, `"ghost"`. Not `variant`.

**Carbon `InlineLoading` for streaming state:**
```typescript
import { InlineLoading } from "@carbon/react";
// Use when isStreaming || isWaiting:
<InlineLoading description="AI is responding..." />
```

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Polaris React 19 compat | Custom React 19 shim | `overrides` in package.json | Runtime already works; just the peer dep check fails |
| Carbon icon set | Custom SVG icons | `@carbon/icons-react` | Carbon ships its own icon package; matches design system |
| Polaris icon set | Custom SVG icons | `@shopify/polaris-icons` | Ships with Polaris; already included as dep |
| Thread list scrolling | Custom virtual scroll | CSS `overflow-y: auto` on container | Thread count is tiny for a demo; no virtualization needed |

---

## Common Pitfalls

### Pitfall 1: Polaris `AppProvider` must wrap ALL Polaris components

**What goes wrong:** Polaris components call `useContext(PolarisContext)` internally. If any Polaris component renders outside `<AppProvider>`, it throws: `Error: No Polaris AppProvider context found`.

**How to avoid:** `AppProvider` is in `(polaris)/layout.tsx`, above `TamboProvider`. This wraps all children automatically.

**Warning signs:** Runtime error on Polaris page load mentioning context or AppProvider.

### Pitfall 2: Polaris npm install fails without React override

**What goes wrong:** `npm install @shopify/polaris` fails with peer dep conflict: `@shopify/polaris@13.9.5 requires react@^18.0.0 but found react@19.2.3`.

**How to avoid:** Add `overrides` block to `package.json` BEFORE running install. Alternatively use `--legacy-peer-deps` flag.

**Warning signs:** npm ERESOLVE error during install.

### Pitfall 3: Carbon `@carbon/react/css/index.css` may not exist

**What goes wrong:** Carbon's pre-built CSS output path varies by version. `@carbon/react/css/index.css` is documented for some versions but may be absent in v1.102.0.

**How to avoid:** After installing, run `ls node_modules/@carbon/react/css/` to verify the path exists. If absent, fall back to SCSS with Dart Sass: import `@carbon/react/scss/globals/scss/styles.scss` or selective component files.

**Verification command:** `ls node_modules/@carbon/react/css/ 2>/dev/null || echo "No CSS dir — use SCSS"`

**Confidence:** MEDIUM — path documented in Carbon docs but not independently verified for v1.102.0.

### Pitfall 4: Carbon SCSS deprecation warnings in Next.js

**What goes wrong:** `next build` produces Sass deprecation warnings from Carbon's SCSS files (documented issues #17458 and #18271 in carbon-design-system/carbon). These are noisy but not build-breaking.

**How to avoid:** If using SCSS path, add `sassOptions` to `next.config.ts`:

```typescript
const nextConfig = {
  sassOptions: {
    silenceDeprecations: ["legacy-js-api"],
  },
};
```

### Pitfall 5: Polaris `TextField` does not accept `onKeyDown` the same way

**What goes wrong:** Polaris `TextField` wraps the native input. The `onKeyDown` prop may need to be passed as part of the `inputProps` or may behave differently from a bare `<textarea>`.

**How to avoid:** Test Ctrl+Enter submit behavior specifically. If `onKeyDown` on `TextField` does not fire correctly, add a wrapper `<div onKeyDown={...}>` around the `TextField`, or use `multiline` with `value`/`onChange` and handle keyboard via the outer container.

**Confidence:** MEDIUM — Polaris TextField API verified on polaris-react.shopify.com but keyboard handler specifics not tested.

---

## Code Examples

### Polaris Sidebar (complete pattern)

```typescript
"use client";
import { Button, Text, Spinner } from "@shopify/polaris";
import { PlusIcon } from "@shopify/polaris-icons"; // included with polaris
import { useTambo, useTamboThreadList } from "@tambo-ai/react";

export function PolarisSidebar() {
  const { currentThreadId, switchThread, startNewThread } = useTambo();
  const { data, isLoading } = useTamboThreadList();
  const threads = data?.threads ?? [];

  return (
    <div style={{ width: 260, flexShrink: 0, borderRight: "1px solid #e1e3e5", display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: 16, borderBottom: "1px solid #e1e3e5", display: "flex", flexDirection: "column", gap: 8 }}>
        <Text as="h2" variant="headingMd">Threads</Text>
        <Button icon={PlusIcon} variant="primary" size="slim" fullWidth onClick={() => startNewThread()}>
          New thread
        </Button>
      </div>
      <div style={{ overflowY: "auto", flex: 1, padding: 8 }}>
        {isLoading ? null : (
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {threads.map((thread) => (
              <li key={thread.id}>
                <Button
                  variant={thread.id === currentThreadId ? "primary" : "plain"}
                  fullWidth
                  textAlign="left"
                  onClick={() => switchThread(thread.id)}
                >
                  {thread.name ?? thread.id.slice(0, 8)}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
```

### Carbon MessageHistory (complete pattern)

```typescript
"use client";
import { useRef, useEffect } from "react";
import { InlineLoading } from "@carbon/react";
import { useTambo } from "@tambo-ai/react";

export function CarbonMessageHistory() {
  const { messages, isStreaming, isWaiting } = useTambo();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
      {messages.map((msg) => {
        const isUser = msg.role === "user";
        const text = msg.content
          .filter((c) => c.type === "text")
          .map((c) => ("text" in c ? c.text : ""))
          .join("");
        return (
          <div key={msg.id} style={{ marginBottom: 12, display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "70%",
              padding: "8px 12px",
              backgroundColor: isUser ? "#0f62fe" : "#f4f4f4",
              color: isUser ? "#ffffff" : "#161616",
            }}>
              <p style={{ margin: 0 }}>{text}</p>
            </div>
          </div>
        );
      })}
      {(isStreaming || isWaiting) && (
        <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 12 }}>
          <InlineLoading description="AI is responding..." />
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Polaris `TextContainer` | `BlockStack` with gap values | Polaris v12+ | TextContainer is deprecated; use BlockStack |
| Carbon `@carbon/icons-react` separate install | Included as dep of `@carbon/react` | Carbon v11 | No separate icon install needed |
| Polaris archived/maintenance mode | Polaris React still works, moving to web components | Jan 2026 | For this demo, React package is still appropriate |

**Deprecated/outdated:**
- `TextContainer` (Polaris): replaced by `BlockStack`. Do not use.
- Carbon `@carbon/ibmdotcom-react`: wrong package — that is for IBM.com marketing sites. Use `@carbon/react`.
- Carbon `node-sass`: incompatible with Carbon v11 SCSS. Use `sass` (Dart Sass) only.

---

## Open Questions

1. **Carbon pre-built CSS path existence**
   - What we know: `@carbon/react` v1.102.0 supports both SCSS and (possibly) a pre-built CSS output
   - What's unclear: Whether `@carbon/react/css/index.css` exists in the installed package
   - Recommendation: First task in Carbon wave: run `ls node_modules/@carbon/react/css/` after install and branch on result. If CSS exists, import it. If not, use selective SCSS imports with `sassOptions.silenceDeprecations`.

2. **Polaris `TextField` `onKeyDown` behavior**
   - What we know: Polaris TextField renders a wrapper div + native input; `onKeyDown` prop is documented
   - What's unclear: Whether the prop is forwarded to the native input or the wrapper
   - Recommendation: Implement and test Ctrl+Enter immediately. Fallback: wrap TextField in a `<div onKeyDown={...}>`.

3. **Polaris `Button` `icon` prop vs `leadingVisual`**
   - What we know: Primer uses `leadingVisual`; Polaris v13 uses `icon` prop for leading icons
   - What's unclear: Exact prop name in v13 (was `icon`, may have changed)
   - Recommendation: Verify against `node_modules/@shopify/polaris/build/ts/src/components/Button/Button.d.ts` after install.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None detected — no test config in project |
| Config file | None |
| Quick run command | `npm run build` (type-check + build as smoke test) |
| Full suite command | `npm run build && npm run lint` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SKIN-02 | Polaris page renders 3-panel layout with working chat | smoke (build) | `npm run build` | ❌ Wave 0 |
| SKIN-03 | Carbon page renders 3-panel layout with working chat | smoke (build) | `npm run build` | ❌ Wave 0 |

### Sampling Rate

- **Per task commit:** `npm run lint` (fast type + lint check)
- **Per wave merge:** `npm run build` (full Next.js build — catches import errors, missing types)
- **Phase gate:** `npm run build` green before phase is done

### Wave 0 Gaps

- [ ] No test framework in project — rely on TypeScript compilation and `npm run build` as primary correctness gate
- [ ] Manual browser verification required: visit `/polaris` and `/carbon`, send a message, confirm streaming indicator appears

*(No unit test framework to configure — project uses build as smoke test)*

---

## Sources

### Primary (HIGH confidence)
- `/Users/lachlan/Projects/tambo-labs/react-ui-base-demo/src/skins/primer/` — reference pattern: hook wiring, component structure, layout convention
- `/Users/lachlan/Projects/tambo-labs/react-ui-base-demo/.planning/research/STACK.md` — verified package versions, React 19 compat, install commands
- `/Users/lachlan/Projects/tambo-labs/react-ui-base-demo/.planning/research/PITFALLS.md` — Polaris AppProvider requirement, Carbon SCSS issues, peer dep conflicts

### Secondary (MEDIUM confidence)
- https://polaris-react.shopify.com/components — Polaris component list and props (current docs)
- https://polaris-react.shopify.com/components/actions/button — Button component API
- https://polaris-react.shopify.com/components/selection-and-input/text-field — TextField API
- https://www.npmjs.com/package/@shopify/polaris — v13.9.5 peer deps confirmed
- Carbon Design System GitHub issues #17458 and #18271 — Next.js 15 Sass deprecation warnings

### Tertiary (LOW confidence)
- Carbon `@carbon/react/css/index.css` path — documented but not independently verified for v1.102.0

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — versions verified in STACK.md via npm registry
- Tambo hook wiring: HIGH — reference implementation is complete and live in codebase
- Polaris component map: MEDIUM — docs reviewed, Button/TextField/Spinner confirmed; Navigation workaround is recommended pattern not tested
- Carbon component map: MEDIUM — Carbon React docs reviewed; `InlineLoading` for streaming state is correct; pre-built CSS path is LOW
- Pitfalls: HIGH — peer dep conflict, AppProvider requirement, and SCSS issues all documented in PITFALLS.md from prior research

**Research date:** 2026-03-04
**Valid until:** 2026-04-04 (Polaris is in maintenance mode — unlikely to change; Carbon stable)
