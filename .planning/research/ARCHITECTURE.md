# Architecture Research

**Domain:** Multi-skin headless AI chat demo — Next.js App Router with 6 isolated UI libraries
**Researched:** 2026-03-04
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Next.js App Router                            │
│                                                                  │
│   src/app/layout.tsx  (root — minimal, no UI-lib CSS)           │
│   ├── page.tsx        (home / navigation hub)                    │
│   │                                                              │
│   ├── (primer)/                 Route Group — GitHub Primer      │
│   │   ├── layout.tsx  ← imports Primer CSS + ThemeProvider       │
│   │   └── page.tsx   ← ChatShell wired to Tambo hooks            │
│   │                                                              │
│   ├── (polaris)/                Route Group — Shopify Polaris    │
│   │   ├── layout.tsx  ← imports Polaris CSS + AppProvider        │
│   │   └── page.tsx   ← ChatShell wired to Tambo hooks            │
│   │                                                              │
│   ├── (carbon)/                 Route Group — IBM Carbon         │
│   │   ├── layout.tsx  ← imports Carbon SCSS + Theme              │
│   │   └── page.tsx   ← ChatShell wired to Tambo hooks            │
│   │                                                              │
│   ├── (neobrutalism)/           Route Group — Neobrutalism.dev   │
│   │   ├── layout.tsx  ← imports Neobrutalism CSS                 │
│   │   └── page.tsx   ← ChatShell wired to Tambo hooks            │
│   │                                                              │
│   ├── (nes)/                    Route Group — NES.css            │
│   │   ├── layout.tsx  ← imports NES.css global styles            │
│   │   └── page.tsx   ← ChatShell wired to Tambo hooks            │
│   │                                                              │
│   └── (retro)/                  Route Group — Retro-futuristic   │
│       ├── layout.tsx  ← imports retro-futuristic-ui CSS          │
│       └── page.tsx   ← ChatShell wired to Tambo hooks            │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                    Tambo Layer (shared state)                    │
│                                                                  │
│   TamboProvider (mounted in each skin's layout.tsx)             │
│   ├── useTamboThreadList()    — sidebar: list of threads         │
│   ├── useTambo()             — active thread messages + stream   │
│   └── useTamboThreadInput()  — input value, submit, isPending    │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                    Skin Component Layer                          │
│                                                                  │
│   Each skin implements the same 3-panel ChatShell:              │
│   ┌──────────────┬───────────────────────────────────────┐      │
│   │  Sidebar     │  MessageHistory (scrollable)           │      │
│   │  ThreadList  │                                        │      │
│   │              ├───────────────────────────────────────┤      │
│   │  + New Thread│  MessageInput (bottom)                 │      │
│   └──────────────┴───────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| Root `layout.tsx` | HTML shell only — no CSS imports, no UI-lib providers | nothing |
| Home `page.tsx` | Navigation hub linking to all 6 skin pages | nothing |
| Skin `layout.tsx` (x6) | Imports skin CSS, mounts TamboProvider, sets skin-level theme wrapper | TamboProvider |
| Skin `page.tsx` (x6) | Composes the 3-panel ChatShell from skin's own components | Tambo hooks |
| `Sidebar` (per skin) | Renders thread list, handles thread switching, "New thread" action | `useTamboThreadList()` |
| `MessageHistory` (per skin) | Renders messages, auto-scrolls to bottom | `useTambo()` |
| `MessageInput` (per skin) | Controlled input, submit on enter/button | `useTamboThreadInput()` |

## Recommended Project Structure

```
src/
├── app/
│   ├── layout.tsx                  # Root — bare HTML/body only, no UI lib CSS
│   ├── globals.css                 # Truly global base (font variables etc.) — MINIMAL
│   ├── page.tsx                    # Home: navigation to all 6 demos
│   │
│   ├── (primer)/
│   │   ├── layout.tsx              # Imports @primer/react CSS, wraps TamboProvider
│   │   └── page.tsx                # PrimerChatShell
│   │
│   ├── (polaris)/
│   │   ├── layout.tsx              # Imports @shopify/polaris/build/esm/styles.css
│   │   └── page.tsx                # PolarisChatShell
│   │
│   ├── (carbon)/
│   │   ├── layout.tsx              # Imports @carbon/styles (SCSS compiled)
│   │   └── page.tsx                # CarbonChatShell
│   │
│   ├── (neobrutalism)/
│   │   ├── layout.tsx              # Imports neobrutalism CSS
│   │   └── page.tsx                # NeobrutalismChatShell
│   │
│   ├── (nes)/
│   │   ├── layout.tsx              # Imports nes.css
│   │   └── page.tsx                # NesChatShell
│   │
│   └── (retro)/
│       ├── layout.tsx              # Imports retro-futuristic-ui CSS
│       └── page.tsx                # RetroChatShell
│
├── skins/
│   ├── primer/
│   │   ├── Sidebar.tsx             # ThreadList using Primer Nav/Link
│   │   ├── MessageHistory.tsx      # Message bubbles using Primer Box
│   │   └── MessageInput.tsx        # Primer TextInput + Button
│   │
│   ├── polaris/
│   │   ├── Sidebar.tsx
│   │   ├── MessageHistory.tsx
│   │   └── MessageInput.tsx
│   │
│   ├── carbon/
│   │   ├── Sidebar.tsx
│   │   ├── MessageHistory.tsx
│   │   └── MessageInput.tsx
│   │
│   ├── neobrutalism/
│   │   ├── Sidebar.tsx
│   │   ├── MessageHistory.tsx
│   │   └── MessageInput.tsx
│   │
│   ├── nes/
│   │   ├── Sidebar.tsx
│   │   ├── MessageHistory.tsx
│   │   └── MessageInput.tsx
│   │
│   └── retro/
│       ├── Sidebar.tsx
│       ├── MessageHistory.tsx
│       └── MessageInput.tsx
│
└── lib/
    └── tambo.ts                    # TamboProvider config, API key env var
```

### Structure Rationale

- **`app/(skin)/layout.tsx`:** Route groups are the key isolation mechanism. Each skin gets its own layout that imports that skin's CSS. Because navigating between route groups triggers a **full page reload** in Next.js App Router, the previous skin's CSS is fully unloaded. There is no CSS bleed between skins at runtime.
- **`skins/` folder:** All skin-specific component code lives outside `app/` to keep the routing tree clean. Each skin subfolder contains only the 3 components it needs — no shared component base class.
- **`lib/tambo.ts`:** A single file exports the Tambo API key (from environment variables) so each skin's layout can instantiate its own TamboProvider consistently.
- **Root `layout.tsx` stays minimal:** It imports no UI library CSS and no UI library providers. This prevents any library's global reset or typography styles from reaching pages that don't belong to it.

## Architectural Patterns

### Pattern 1: Route Group CSS Isolation (primary isolation strategy)

**What:** Wrap each skin in an App Router route group `(name)`. Each group has its own `layout.tsx` that imports that skin's stylesheet at the top. Because route group navigation causes a full page reload, the browser unloads the previous skin's styles before mounting the new page's DOM and stylesheets.

**When to use:** Any time you need truly separate CSS environments within one Next.js app. This is the correct approach when UI libraries ship global stylesheets (Polaris, Carbon, NES.css all do).

**Trade-offs:** Full page reload on skin navigation (not SPA-style). Acceptable for a demo; in fact desirable — it proves each skin is fully independent.

**Example:**
```typescript
// src/app/(polaris)/layout.tsx
import "@shopify/polaris/build/esm/styles.css";
import { AppProvider } from "@shopify/polaris";
import { TamboProvider } from "@tambo-ai/react";
import { tamboConfig } from "@/lib/tambo";

export default function PolarisLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider i18n={{}}>
      <TamboProvider {...tamboConfig}>
        {children}
      </TamboProvider>
    </AppProvider>
  );
}
```

### Pattern 2: TamboProvider Per Skin (not global)

**What:** Mount `TamboProvider` inside each skin's layout rather than at the root layout level. Each skin gets its own isolated Tambo context, thread list, and conversation history.

**When to use:** Always, for this project. A global provider would mean all skins share thread history — confusing for demo purposes and impossible to unmount cleanly alongside a skin's CSS.

**Trade-offs:** Six provider instances instead of one. Thread data does not persist across skins (acceptable — PROJECT.md explicitly says no persistent storage needed).

**Example:**
```typescript
// src/skins/primer/MessageHistory.tsx
"use client";
import { useTambo } from "@tambo-ai/react";
import { Box } from "@primer/react";

export function MessageHistory() {
  const { thread } = useTambo();
  return (
    <Box sx={{ overflowY: "auto", flex: 1, p: 3 }}>
      {thread?.messages?.map((msg) => (
        <Box key={msg.id} sx={{ mb: 2 }}>
          {msg.content}
        </Box>
      ))}
    </Box>
  );
}
```

### Pattern 3: Identical Layout Contract Across Skins

**What:** Every skin implements the same 3-panel layout: thread sidebar (left column), message history (right column, scrollable), message input (pinned bottom of right column). The visual appearance differs completely; the structural contract is identical.

**When to use:** Always — this is the core proof-of-concept. Drift from this contract makes the demo misleading.

**Trade-offs:** Requires discipline. Each skin dev needs to internalize the layout spec, not just style freely.

**Example:**
```typescript
// src/app/(primer)/page.tsx  — same structure in all 6 pages
"use client";
import { Sidebar } from "@/skins/primer/Sidebar";
import { MessageHistory } from "@/skins/primer/MessageHistory";
import { MessageInput } from "@/skins/primer/MessageInput";

export default function PrimerDemo() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />                          {/* left column, fixed width */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <MessageHistory />               {/* grows, scrollable */}
        <MessageInput />                 {/* pinned bottom */}
      </div>
    </div>
  );
}
```

## Data Flow

### Thread Selection Flow

```
User clicks thread in Sidebar
    ↓
useTamboThreadList() returns thread IDs
    ↓
Skin's Sidebar calls setActiveThread(threadId)
    ↓
TamboProvider updates active thread context
    ↓
useTambo() in MessageHistory re-renders with new thread's messages
```

### Message Send Flow

```
User types in MessageInput
    ↓
useTamboThreadInput().setValue(text)
    ↓
User submits (Enter key or button)
    ↓
useTamboThreadInput().submit()
    ↓
TamboProvider streams response from Tambo Cloud
    ↓
useTambo().thread.messages updated incrementally
    ↓
MessageHistory re-renders as stream arrives (isPending → false)
```

### CSS Isolation Flow

```
User navigates /primer → /polaris
    ↓
Full page reload triggered (different root layouts)
    ↓
Browser unloads primer layout, including @primer/react CSS
    ↓
Browser loads polaris layout, mounting @shopify/polaris CSS
    ↓
Zero CSS bleed between skins
```

### Key Data Flows

1. **Thread switching:** `useTamboThreadList()` surfaces the list; each skin's Sidebar renders it and calls the active-thread setter provided by Tambo context. `useTambo()` downstream re-renders with new messages automatically.
2. **Streaming messages:** `useTambo().thread.messages` updates in real-time as the Tambo backend streams tokens. `useTamboThreadInput().isPending` is `true` during streaming — skins use this to show loading states using their own library's spinner/skeleton.
3. **New thread creation:** A "New chat" button in the Sidebar calls a Tambo hook to create a new thread, which automatically becomes the active thread. The message history clears.

## Scaling Considerations

This is a demo app. Scaling is not a primary concern. The table reflects demo-appropriate constraints only.

| Scale | Architecture Adjustments |
|-------|--------------------------|
| Single demo (current) | Route group isolation per skin, TamboProvider per skin, no persistence needed |
| Adding more skins | Copy an existing skin folder, add a new route group — zero changes to shared code |
| Production (hypothetical) | Move TamboProvider to root, implement persistent threads, consider CSS Modules or CSS-in-JS for style isolation instead of page reloads |

### Scaling Priorities

1. **First bottleneck (demo):** CSS conflict between libraries — solved by route-group isolation and full page reloads on navigation.
2. **Second bottleneck (if this grows):** TamboProvider instantiation cost per skin — irrelevant at demo scale, addressable by hoisting provider to root if needed.

## Anti-Patterns

### Anti-Pattern 1: Global CSS Imports at Root Layout

**What people do:** Import `@shopify/polaris/styles.css` and `@primer/react` styles in `src/app/layout.tsx` or `src/app/globals.css`.

**Why it's wrong:** All UI library stylesheets ship global resets, typography overrides, and component classes. Importing multiple at root causes them to fight each other — Polaris's button styles override Primer's, Carbon's typography reset conflicts with NES.css's pixel-font rules. The result is visual corruption on all pages simultaneously.

**Do this instead:** Import each library's CSS only in the skin's own `layout.tsx`. The route group boundary guarantees they never co-exist in the browser at the same time.

### Anti-Pattern 2: Shared UI Component Base Class

**What people do:** Create a `ChatShell` base component that all skins extend or compose, with the idea of sharing logic.

**Why it's wrong:** Skins use different component libraries with incompatible prop systems. Trying to unify them into a shared base creates prop explosion, type gymnastics, and leaking abstractions. Each skin's components need to speak their library's native API.

**Do this instead:** Share only the *structural contract* (layout spec) as documentation. Each skin implements its own `Sidebar`, `MessageHistory`, and `MessageInput` natively. The Tambo hooks are the true shared layer — they're identical across all skins.

### Anti-Pattern 3: One TamboProvider at Root

**What people do:** Put `TamboProvider` in `src/app/layout.tsx` so it wraps the whole app and persists across navigation.

**Why it's wrong:** Thread state accumulated in one skin's session bleeds into another skin's view. Also, if skins need different Tambo configuration (different registered components per skin in future), a shared provider can't accommodate this. Full page reloads already reset JavaScript state — a root provider would persist state across reloads unexpectedly due to browser session storage if Tambo uses it.

**Do this instead:** Mount `TamboProvider` in each skin's `layout.tsx`. Each demo is a fresh, isolated Tambo session. Clean, predictable, demonstrably independent.

### Anti-Pattern 4: iframe Sandboxing Per Skin

**What people do:** Load each skin in an `<iframe>` on a parent shell page to guarantee style isolation.

**Why it's wrong:** Iframes introduce cross-frame communication complexity (postMessage), break React context across boundaries, and make Next.js routing awkward. They're appropriate for true plugin sandboxing, not for a same-origin demo.

**Do this instead:** Route group isolation with full page reloads. Same outcome (isolated CSS), none of the iframe pain.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Tambo Cloud | `TamboProvider` with API key from env var | API key in `NEXT_PUBLIC_TAMBO_API_KEY` or server-side env. Tambo handles streaming, thread storage, agent execution. |
| Each UI library | npm package, CSS imported in skin layout | No external service — pure client-side dependency |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Root layout ↔ Skin layout | React children prop only | Root layout passes no props, owns no providers |
| Skin layout ↔ Skin page | React children prop + TamboProvider context | Provider is mounted in layout, consumed via hooks in page/components |
| Skin page ↔ Skin components | React props (thread ID, callbacks) | Components call Tambo hooks directly — no prop drilling of Tambo state |
| Skin components ↔ Tambo hooks | `useTambo()`, `useTamboThreadList()`, `useTamboThreadInput()` | Each hook call directly reads from nearest TamboProvider in tree |

## Build Order Implications

The dependency graph is shallow and clean. Recommended build sequence:

1. **Root shell** — Gut `layout.tsx` to minimal HTML/body, replace `page.tsx` with navigation hub. No UI library involved.
2. **One skin end-to-end (Primer recommended)** — Build the route group, layout, and all 3 components (Sidebar, MessageHistory, MessageInput) wired to real Tambo hooks. Proves the architecture works before multiplying it.
3. **Remaining 5 skins** — Each is a copy-adapt of the Primer pattern. Order does not matter between them; they share no code.
4. **Polish** — Home page styling, skin-to-skin navigation links within each demo page, loading/error states.

The pattern established in step 2 becomes the template. Every subsequent skin should match it structurally.

## Sources

- [Next.js Route Groups — official docs](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups) — HIGH confidence (official, fetched 2026-02-27)
- [Tambo React SDK README](https://github.com/tambo-ai/tambo/blob/main/react-sdk/README.md) — HIGH confidence (official)
- [Tambo Docs — Chat Starter App](https://docs.tambo.co/examples-and-templates/chat-starter-app) — HIGH confidence (official)
- [IBM Carbon SASS `$prefix` variable](https://github.com/carbon-design-system/carbon/blob/main/docs/guides/sass.md) — MEDIUM confidence (official, useful if Carbon styles need namespace override)
- [Next.js CSS stylesheet persistence issue](https://github.com/vercel/next.js/discussions/49744) — MEDIUM confidence (community discussion confirming stylesheets persist across SPA navigation, reinforcing why route groups + full reload is the right approach)
- [Style Blocker: Shadow DOM isolation](https://matthewjamestaylor.com/style-blocker) — LOW confidence (considered and rejected — see Anti-Pattern 4)

---
*Architecture research for: multi-skin headless AI chat demo (Tambo + 6 UI libraries)*
*Researched: 2026-03-04*
