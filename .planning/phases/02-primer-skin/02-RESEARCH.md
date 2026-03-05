# Phase 2: Primer Skin — Research

**Researched:** 2026-03-04
**Domain:** GitHub Primer React + Tambo hook integration for a 3-panel chat UI
**Confidence:** HIGH

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| SKIN-01 | GitHub Primer demo page — all chat components styled with Primer React | Primer React 38.14.0 confirmed, component selection documented below |
| CHAT-01 | User can create a new thread via the UI | `startNewThread()` from `useTambo()` — zero-arg, returns temp ID |
| CHAT-02 | User can switch between existing threads via the sidebar | `switchThread(threadId)` from `useTambo()` + `useTamboThreadList()` for list |
| CHAT-03 | User can see a list of all threads in the sidebar | `useTamboThreadList()` returns `{ data: { threads: Thread[] } }` via React Query |
| CHAT-04 | User can type and send a message in the input area | `useTamboThreadInput()` returns `{ value, setValue, submit, isPending, isDisabled }` |
| CHAT-05 | User can see full message history for the selected thread | `useTambo()` returns `{ messages: TamboThreadMessage[] }` — auto-updated on thread switch |
| CHAT-06 | User can see AI response tokens streaming in real-time | `useTambo().messages` updates incrementally as tokens arrive; `isStreaming` flag tracks state |
| CHAT-07 | User sees a loading indicator while AI is generating | `useTambo().isStreaming` or `isWaiting` — use Primer `Spinner` component |
</phase_requirements>

---

## Summary

Phase 2 wires the existing 3-panel skeleton (`(primer)/primer/page.tsx`) to real Tambo hooks and replaces all inline-styled placeholder HTML with GitHub Primer React components. The skeleton layout contract (3 divs with inline flex CSS) is already proven from Phase 1 and must be preserved structurally while Primer components replace the internals.

The critical technical finding is that **@primer/react 38.14.0 has no styled-components dependency**. Starting from v37, Primer migrated from styled-components to CSS Modules. This eliminates the primary SSR concern flagged in earlier architecture research. No styled-components registry or `ServerStyleSheet` is needed. The library uses CSS custom properties (design tokens from `@primer/primitives`) and CSS Modules internally — fully compatible with Next.js App Router.

The Tambo hook API is well-typed and verified from installed source. The three hooks cover all chat requirements: `useTambo()` for thread state and navigation functions, `useTamboThreadList()` for the sidebar thread list, and `useTamboThreadInput()` for the input area. One important discovery: `TamboProvider` requires either `userKey` or `userToken` for thread ownership scoping. The current `(primer)/layout.tsx` does not pass `userKey` — this must be added (a static demo string like `"demo-user"` is sufficient).

**Primary recommendation:** Install `@primer/react @primer/primitives`, add `ThemeProvider + BaseStyles` to the Primer layout, add `userKey="demo-user"` to `TamboProvider`, then implement three client components (`PrimerSidebar`, `PrimerMessageHistory`, `PrimerMessageInput`) in `src/skins/primer/`.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @primer/react | 38.14.0 | GitHub's design system — all UI components | Only official Primer React implementation; used on GitHub.com |
| @primer/primitives | 11.5.1 | CSS design tokens and theme CSS | Required by @primer/react for CSS custom properties |
| @tambo-ai/react | 1.1.0 (installed) | Tambo hooks: `useTambo`, `useTamboThreadList`, `useTamboThreadInput` | Already installed; core of the demo |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @primer/octicons-react | ^19.21.0 | GitHub icons (PlusIcon, etc.) | Auto-installed as @primer/react dep; use for "New thread" button icon |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| NavList | ActionList | NavList is purpose-built for sidebar navigation; ActionList is more generic |
| Textarea | TextInput | Textarea supports multi-line; TextInput is single-line — Textarea better for chat input |
| Spinner | SkeletonBox/custom | Spinner is the idiomatic Primer loading indicator; cleanest choice |

**Installation:**

```bash
npm install @primer/react @primer/primitives
```

> `@primer/octicons-react` is a dependency of `@primer/react` and installs automatically.

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── app/
│   └── (primer)/
│       ├── layout.tsx      # Add ThemeProvider + BaseStyles + CSS import + userKey
│       └── primer/
│           └── page.tsx    # Replace skeleton with PrimerSidebar + PrimerMessageHistory + PrimerMessageInput
└── skins/
    └── primer/
        ├── PrimerSidebar.tsx         # NavList thread list + New Thread button
        ├── PrimerMessageHistory.tsx  # Box scroll container + message bubbles + Spinner
        └── PrimerMessageInput.tsx    # Textarea + Button submit row
```

### Pattern 1: Primer Layout Setup

**What:** Import CSS from `@primer/primitives`, wrap with `ThemeProvider` and `BaseStyles`, add `userKey` to `TamboProvider`.

**When to use:** Always — this is the required Primer setup for v38.

**Example:**

```typescript
// src/app/(primer)/layout.tsx
"use client";
import "@primer/primitives/dist/css/functional/themes/light.css";
import { ThemeProvider, BaseStyles } from "@primer/react";
import { TamboProvider } from "@tambo-ai/react";
import { tamboApiKey } from "@/lib/tambo";

export default function PrimerLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider colorMode="day">
          <BaseStyles>
            <TamboProvider apiKey={tamboApiKey} userKey="demo-user">
              {children}
            </TamboProvider>
          </BaseStyles>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

> Key: `colorMode="day"` avoids SSR mismatch vs `colorMode="auto"` (which would need `preventSSRMismatch`). `userKey="demo-user"` is required for thread operations.

### Pattern 2: Sidebar with Thread List and New Thread

**What:** Use `NavList` for the thread list with `aria-current="page"` on the active thread. Use `useTamboThreadList()` for data, `switchThread()` and `startNewThread()` from `useTambo()` for actions.

**When to use:** Sidebar component — CHAT-01, CHAT-02, CHAT-03.

**Example:**

```typescript
// src/skins/primer/PrimerSidebar.tsx
"use client";
import { NavList, Button, Box, Heading } from "@primer/react";
import { PlusIcon } from "@primer/octicons-react";
import { useTambo } from "@tambo-ai/react";
import { useTamboThreadList } from "@tambo-ai/react";

export function PrimerSidebar() {
  const { currentThreadId, switchThread, startNewThread } = useTambo();
  const { data, isLoading } = useTamboThreadList();
  const threads = data?.threads ?? [];

  return (
    <Box
      sx={{
        width: 260,
        flexShrink: 0,
        borderRight: "1px solid",
        borderColor: "border.default",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Box sx={{ p: 3, borderBottom: "1px solid", borderColor: "border.default" }}>
        <Heading as="h2" sx={{ fontSize: 1, mb: 2 }}>
          Threads
        </Heading>
        <Button
          leadingVisual={PlusIcon}
          variant="primary"
          size="small"
          block
          onClick={() => startNewThread()}
        >
          New thread
        </Button>
      </Box>
      <Box sx={{ overflowY: "auto", flex: 1, p: 2 }}>
        {isLoading ? null : (
          <NavList>
            {threads.map((thread) => (
              <NavList.Item
                key={thread.id}
                aria-current={thread.id === currentThreadId ? "page" : undefined}
                onClick={() => switchThread(thread.id)}
                sx={{ cursor: "pointer" }}
              >
                {thread.name ?? thread.id.slice(0, 8)}
              </NavList.Item>
            ))}
          </NavList>
        )}
      </Box>
    </Box>
  );
}
```

### Pattern 3: Message History with Streaming and Loading

**What:** Use `useTambo()` for messages. Map `role === "user"` vs `"assistant"` to different box styles. Show `Spinner` when `isStreaming || isWaiting`. Auto-scroll to bottom on new messages using `useEffect` + a ref.

**When to use:** MessageHistory component — CHAT-05, CHAT-06, CHAT-07.

**Example:**

```typescript
// src/skins/primer/PrimerMessageHistory.tsx
"use client";
import { useRef, useEffect } from "react";
import { Box, Spinner, Text } from "@primer/react";
import { useTambo } from "@tambo-ai/react";

export function PrimerMessageHistory() {
  const { messages, isStreaming, isWaiting } = useTambo();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Box sx={{ flex: 1, overflowY: "auto", p: 3 }}>
      {messages.map((msg) => {
        const isUser = msg.role === "user";
        // Extract text content from content blocks
        const text = msg.content
          .filter((c) => c.type === "text")
          .map((c) => ("text" in c ? c.text : ""))
          .join("");
        return (
          <Box
            key={msg.id}
            sx={{
              mb: 3,
              display: "flex",
              justifyContent: isUser ? "flex-end" : "flex-start",
            }}
          >
            <Box
              sx={{
                maxWidth: "70%",
                px: 3,
                py: 2,
                borderRadius: 2,
                bg: isUser ? "accent.emphasis" : "canvas.subtle",
                color: isUser ? "fg.onEmphasis" : "fg.default",
              }}
            >
              <Text sx={{ fontSize: 1 }}>{text}</Text>
            </Box>
          </Box>
        );
      })}
      {(isStreaming || isWaiting) && (
        <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 3 }}>
          <Spinner size="small" srText="AI is responding..." />
        </Box>
      )}
      <div ref={bottomRef} />
    </Box>
  );
}
```

### Pattern 4: Message Input with Submit

**What:** Use `useTamboThreadInput()` for controlled input state. Textarea for multi-line input (matches chat conventions). Button for submit. Disable both when `isDisabled` (pending or not authenticated). Submit on Ctrl+Enter or button click.

**When to use:** MessageInput component — CHAT-04.

**Example:**

```typescript
// src/skins/primer/PrimerMessageInput.tsx
"use client";
import { Box, Textarea, Button } from "@primer/react";
import { useTamboThreadInput } from "@tambo-ai/react";

export function PrimerMessageInput() {
  const { value, setValue, submit, isPending, isDisabled } = useTamboThreadInput();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (!isDisabled) submit();
    }
  };

  return (
    <Box
      sx={{
        flexShrink: 0,
        p: 3,
        borderTop: "1px solid",
        borderColor: "border.default",
        display: "flex",
        gap: 2,
        alignItems: "flex-end",
      }}
    >
      <Textarea
        block
        rows={2}
        resize="none"
        placeholder="Type a message… (Ctrl+Enter to send)"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isDisabled}
        sx={{ flex: 1 }}
      />
      <Button
        variant="primary"
        disabled={isDisabled}
        onClick={() => submit()}
      >
        Send
      </Button>
    </Box>
  );
}
```

### Pattern 5: Page Composition

**What:** The page file imports all three skin components and composes the 3-panel layout using the same inline-flex structure proved in Phase 1.

**Example:**

```typescript
// src/app/(primer)/primer/page.tsx
"use client";
import { PrimerSidebar } from "@/skins/primer/PrimerSidebar";
import { PrimerMessageHistory } from "@/skins/primer/PrimerMessageHistory";
import { PrimerMessageInput } from "@/skins/primer/PrimerMessageInput";

export default function PrimerDemo() {
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <PrimerSidebar />
      <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
        <PrimerMessageHistory />
        <PrimerMessageInput />
      </div>
    </div>
  );
}
```

### Anti-Patterns to Avoid

- **Using `sx` prop for layout that belongs in the page shell:** The outer 3-panel structure uses inline styles (from Phase 1 contract) — don't move it into Primer `Box` sx — it conflates the layout contract with skin styling.
- **Forgetting `"use client"` on skin components:** All three components use hooks (`useTambo`, `useTamboThreadInput`, `useTamboThreadList`). Without `"use client"` they will fail at runtime in Next.js App Router.
- **Reading `msg.content` as a string:** Messages use content blocks (Anthropic-style). Text content is in `{ type: "text", text: string }` blocks. Always filter by type before extracting text.
- **Omitting `userKey` from `TamboProvider`:** Without `userKey` or `userToken`, thread operations may fail silently or return empty results. The current layout is missing this — it must be added.
- **Using `colorMode="auto"` without `preventSSRMismatch`:** Auto mode reads `prefers-color-scheme` at runtime. In SSR this can produce a hydration mismatch. Either use `colorMode="day"` (simple) or add `preventSSRMismatch` prop (if auto is needed).

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Sidebar navigation with active state | Custom `<ul>/<li>` with active class toggling | `NavList` + `aria-current="page"` | Built-in keyboard nav, focus management, active visual; correct ARIA semantics |
| Loading spinner | CSS spinner animation | `Spinner` component | Matches GitHub's design; has `srText` for accessibility; handles delay |
| Thread list fetching and caching | `useState` + `useEffect` + `fetch` | `useTamboThreadList()` (uses React Query internally) | Auto-refreshes every 5s; handles loading/error states; caches correctly |
| Streaming detection | Polling or timeout logic | `useTambo().isStreaming` / `isWaiting` | Directly tied to AG-UI protocol event stream state |
| Input disable during submission | Manually tracking `isPending` state | `useTamboThreadInput().isDisabled` | Combines `isPending` AND auth state — correct unified disable condition |
| Text content extraction from messages | Custom recursive parser | Filter `content` blocks by `type === "text"` and read `.text` field | Messages use typed content blocks; simple filter is correct and future-proof |

**Key insight:** The Tambo hooks handle all async complexity (streaming, caching, thread switching). Skin components are purely presentational wrappers around hook state.

---

## Common Pitfalls

### Pitfall 1: Missing `userKey` on TamboProvider

**What goes wrong:** `useTamboThreadList()` returns an empty thread list. New threads appear to create but are never listed. The API requires a user scope for all thread operations.

**Why it happens:** The v1 Tambo SDK changed to require `userKey` OR `userToken`. The existing `(primer)/layout.tsx` only passes `apiKey` — it was scaffolded before this requirement was enforced.

**How to avoid:** Add `userKey="demo-user"` (or any stable string) to `<TamboProvider>` in `layout.tsx`. For a public demo, a hardcoded static key is fine.

**Warning signs:** Thread list always empty; creating threads appears to work but they never show up in the sidebar.

### Pitfall 2: Content Block Extraction

**What goes wrong:** Rendering `msg.content` directly in JSX gives `[object Object]` because `content` is an array of typed content block objects, not a string.

**Why it happens:** Tambo messages follow the Anthropic content block pattern: `{ type: "text", text: string }`, `{ type: "tool_use", ... }`, etc.

**How to avoid:** Always extract text with:
```typescript
const text = msg.content
  .filter((c) => c.type === "text")
  .map((c) => c.text)
  .join("");
```

**Warning signs:** Messages render as `[object Object]` or the TypeScript compiler complains about `string` not being assignable to `Content[]`.

### Pitfall 3: `NavList.Item` as a button vs link

**What goes wrong:** `NavList.Item` defaults to rendering an `<a>` tag. Passing no `href` but using `onClick` for thread switching produces invalid HTML (`<a>` without `href`) and may trigger Next.js router warnings.

**Why it happens:** `NavList` is designed for navigation, not action buttons.

**How to avoid:** Use `as="button"` prop on `NavList.Item` when there's no URL destination, or set `href="#"` — but `as="button"` is semantically cleaner for thread-switching actions.

**Warning signs:** Console warning about `<a>` elements without `href`; keyboard users can't activate items correctly.

### Pitfall 4: `@primer/react` CSS Modules require CSS processing

**What goes wrong:** Components render without styles; Primer `Box` shows unstyled boxes. Internal CSS Modules from `@primer/react` aren't processed.

**Why it happens:** Starting v37, @primer/react uses CSS Modules internally. Next.js handles CSS Modules automatically for app code, but must also process imports from `node_modules`. Next.js 13+ handles this via `transpilePackages` or automatic CSS module support for npm packages.

**How to avoid:** If components appear unstyled, add `@primer/react` to `transpilePackages` in `next.config.ts`. Also ensure the primitives CSS is imported in `layout.tsx`.

**Warning signs:** Components render with no visual styling despite correct JSX; no errors thrown.

### Pitfall 5: Thread switching doesn't load message history

**What goes wrong:** Clicking a thread in the sidebar switches `currentThreadId` (via `switchThread()`), but message history doesn't populate because the thread data hasn't been fetched.

**Why it happens:** `switchThread()` only updates the active thread ID in stream state. It does NOT fetch the thread's messages. For pre-existing threads, `useTamboThread(threadId)` must be called to fetch and initialize thread data.

**How to avoid:** On thread switch, call both `switchThread(threadId)` AND use `useTamboThread(threadId)` (which fetches from API), then call `initThread(threadId, threadData)` to populate stream state. Alternatively, check if the Tambo SDK handles this automatically on `switchThread` — test empirically.

**Warning signs:** Thread sidebar shows threads, clicking them updates URL/state, but message history stays empty.

---

## Code Examples

Verified patterns from installed source (`@tambo-ai/react@1.1.0`):

### Complete Hook Return Types

```typescript
// useTambo() — thread state + navigation
const {
  messages,          // TamboThreadMessage[] — current thread messages
  isStreaming,       // boolean — AI is currently streaming tokens
  isWaiting,         // boolean — request sent, waiting for first token
  isIdle,            // boolean — not streaming or waiting
  currentThreadId,   // string — active thread ID ("placeholder" for new)
  switchThread,      // (threadId: string) => void
  startNewThread,    // () => string — returns temp ID
  initThread,        // (threadId: string, initialThread?) => void
  streamingState,    // StreamingState object with status, runId, etc.
} = useTambo();

// useTamboThreadList() — sidebar thread list (React Query)
const {
  data,              // { threads: Thread[], hasMore: boolean, nextCursor?: string }
  isLoading,         // boolean
  isError,           // boolean
} = useTamboThreadList({ limit: 20 });

// useTamboThreadInput() — controlled input
const {
  value,             // string
  setValue,          // React.Dispatch<React.SetStateAction<string>>
  submit,            // (options?: SubmitOptions) => Promise<{ threadId: string | undefined }>
  isPending,         // boolean — submission in flight
  isDisabled,        // boolean — isPending OR not authenticated
  threadId,          // string | undefined — thread ID from stream state
} = useTamboThreadInput();
```

### TamboThreadMessage Structure

```typescript
interface TamboThreadMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: Content[];  // Array of typed content blocks
  createdAt?: string;
  metadata?: Record<string, unknown>;
}

// Content block types:
// { type: "text", text: string }
// { type: "tool_use", id, name, input }
// { type: "tool_result", ... }
// { type: "component", ... }  (for AI-rendered React components)

// Extract displayable text:
const text = msg.content
  .filter(c => c.type === "text")
  .map(c => (c as TextContent).text)
  .join("");
```

### Primer Box sx Color Tokens

```typescript
// Use CSS design token names in sx prop (not hardcoded colors):
sx={{
  bg: "canvas.default",          // page background
  bg: "canvas.subtle",           // slightly elevated surface
  bg: "accent.emphasis",         // primary blue (user message bubble)
  color: "fg.default",           // primary text
  color: "fg.onEmphasis",        // text on colored background
  borderColor: "border.default", // standard border
}}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| @primer/react uses styled-components | @primer/react uses CSS Modules | v37 (2024) | No styled-components registry needed; no SSR special handling |
| SSRProvider required in Primer React | SSRProvider removed | v37 | Do not import SSRProvider — it no longer exists |
| Tambo `useTambo().thread.messages` | `useTambo().messages` (flat array, shorthand) | v1 SDK | Use `messages` directly; `thread` object still accessible but `messages` is preferred |
| System props on Primer components | `sx` prop only | v37+ | System props deprecated on all components except Box and Text; use `sx` everywhere |

**Deprecated/outdated:**

- `SSRProvider` from @primer/react: Removed in v37. Do not import.
- `Button` variants imported as named exports (`PrimaryButton`, `DangerButton`): Removed in v37. Use `<Button variant="primary">`.
- System props (e.g., `<Box color="...">` without `sx`): Deprecated. Use `<Box sx={{ color: "..." }}>`.
- styled-components as a peer dependency of @primer/react: Removed in v37. Do not install.

---

## Open Questions

1. **Does `switchThread()` automatically fetch message history?**
   - What we know: The type definition says "Does not fetch thread data — use `useTamboThread` for that"
   - What's unclear: Whether the starter template patterns handle this automatically, or if manual `initThread()` calls are needed after switching
   - Recommendation: Test empirically when first wiring up the sidebar. If messages don't load on switch, add `useTamboThread(currentThreadId)` in `PrimerMessageHistory` to trigger the fetch.

2. **Does `@primer/react` v38 need `transpilePackages` in Next.js config?**
   - What we know: v37+ uses CSS Modules internally; Next.js handles CSS Modules from node_modules automatically in recent versions
   - What's unclear: Whether Next.js 16.1.6 processes @primer/react CSS Modules without explicit config
   - Recommendation: Start without `transpilePackages`; if components render unstyled, add `transpilePackages: ['@primer/react']` to `next.config.ts`.

---

## Validation Architecture

> `nyquist_validation` is enabled in `.planning/config.json`.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None installed — this is a demo app with no test infrastructure |
| Config file | None — Wave 0 gap |
| Quick run command | N/A — no test runner |
| Full suite command | N/A |

### Phase Requirements — Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SKIN-01 | Primer components render without errors | smoke (visual) | manual-only — requires browser | N/A |
| CHAT-01 | New thread button creates a thread | smoke (browser) | manual-only — requires Tambo API | N/A |
| CHAT-02 | Clicking thread in sidebar switches active thread | smoke (browser) | manual-only — requires Tambo API | N/A |
| CHAT-03 | Thread list renders existing threads | smoke (browser) | manual-only — requires Tambo API | N/A |
| CHAT-04 | Input accepts text and submits on button click | smoke (browser) | manual-only — requires Tambo API | N/A |
| CHAT-05 | Message history shows full conversation | smoke (browser) | manual-only — requires Tambo API | N/A |
| CHAT-06 | AI tokens stream in real-time (no full-page reload) | smoke (browser) | manual-only — streaming behavior | N/A |
| CHAT-07 | Spinner shows during AI response generation | smoke (browser) | manual-only — streaming behavior | N/A |

All requirements for this phase require a live Tambo API connection and a browser. They are manual smoke tests. No unit test framework is installed and no Wave 0 setup is needed — the verifier will do a live browser check of the `/primer` route.

### Sampling Rate

- **Per task commit:** `npm run build` (catches type errors and import failures)
- **Per wave merge:** `npm run build` + manual browser verify at `/primer`
- **Phase gate:** All 8 requirements verified manually in browser before `/gsd:verify-work`

### Wave 0 Gaps

None — no test infrastructure to scaffold. Verification is manual browser smoke testing.

---

## Sources

### Primary (HIGH confidence)

- Installed source: `/node_modules/@tambo-ai/react/dist/v1/index.d.ts` — complete exported hook list
- Installed source: `/node_modules/@tambo-ai/react/dist/v1/hooks/use-tambo-v1.d.ts` — `UseTamboReturn` interface
- Installed source: `/node_modules/@tambo-ai/react/dist/v1/hooks/use-tambo-v1-thread-list.d.ts` — `useTamboThreadList` signature
- Installed source: `/node_modules/@tambo-ai/react/dist/v1/providers/tambo-v1-thread-input-provider.d.ts` — `TamboThreadInputContextProps`
- Installed source: `/node_modules/@tambo-ai/react/dist/v1/providers/tambo-v1-provider.d.ts` — `TamboProviderProps` including `userKey` requirement
- `npm show @primer/react@38.14.0 dependencies` — confirmed NO styled-components dependency
- `npm show @primer/react` — confirmed latest version 38.14.0, peerDeps `react: "18.x || 19.x"`
- `npm show @primer/primitives` — latest version 11.5.1
- [Primer React v37 Release Discussion](https://github.com/primer/react/discussions/5165) — confirmed CSS Modules migration, styled-components removal, SSRProvider removal

### Secondary (MEDIUM confidence)

- [Primer product getting started](https://primer.style/product/getting-started/react/) — ThemeProvider + BaseStyles setup, @primer/primitives CSS import
- [Primer theming](https://primer.style/react/theming/) — `colorMode`, `preventSSRMismatch` prop
- [Primer NavList](https://primer.style/react/NavList) — `aria-current`, `NavList.Item` props
- [Primer Spinner](https://primer.style/react/Spinner/) — `size`, `srText`, `delay` props
- [Primer Button](https://primer.style/react/Button/) — variants, `leadingVisual`, `disabled`, `block`
- [Primer PageLayout](https://primer.style/react/PageLayout/) — sidebar layout option (not used in this phase; inline flex preferred)
- [GitHub issue #3330](https://github.com/primer/react/issues/3330) — confirmed RSC compatibility fixed in v36.6.0

### Tertiary (LOW confidence)

- WebSearch: styled-components removal in v37 — corroborated by npm dependency check (HIGH)

---

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH — versions confirmed from npm registry; deps confirmed from installed packages
- Tambo hook APIs: HIGH — verified from installed TypeScript declarations
- Architecture patterns: HIGH — code examples derived directly from confirmed type signatures
- Primer component API: MEDIUM — verified from official docs; some component pages returned incomplete content but cross-verified with multiple sources
- Pitfalls: MEDIUM — `userKey` requirement verified from types; content block pitfall verified from type definitions; others from pattern analysis

**Research date:** 2026-03-04
**Valid until:** 2026-04-04 (stable libraries; Tambo alpha package may change faster — re-verify if version bumped)
