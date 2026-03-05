# Feature Landscape

**Domain:** Headless AI chat library showcase / multi-skin demo app
**Researched:** 2026-03-04

---

## Context

This is a demo app, not a product. Its job is to prove a single proposition: `@tambo-ai/react-ui-base` works with any design system. Features must serve that proof. Anything that does not serve the proof is waste — and waste in a demo actively harms the message by making the core point harder to see.

Every feature decision should be evaluated against: "Does this help a developer understand that Tambo is UI-agnostic?"

---

## Table Stakes

Features without which the demo fails to prove its point.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Home page with links to all 6 skins | Developers need a starting point; without it the demo has no discoverability | Low | Simple nav grid or list of cards. Each card names the library and links to the demo page. |
| 6 fully functional chat demo pages | The core thesis — you must have all 6 or the "any library" claim is unproven | Med-High | One page per library: Primer, Polaris, Carbon, Neobrutalism, nes.css, retro-futuristic |
| Identical layout across all 6 skins | Structural parity is how the viewer sees "same thing, different skin" | Med | Sidebar left (thread list) + scrolling message area + bottom input. Must be the same shape on all 6. |
| Real Tambo thread state | Mockup chat data would undermine the demo — developers need to see Tambo hooks actually working | Med | `useTamboThreadList`, `useTamboThread`, `useTamboThreadInput`, `useTambo` all wired up. Thread creation must work. |
| Thread selector sidebar | Without thread management the demo doesn't show the full API surface | Med | Lists existing threads, allows switching, allows creating new thread. Each thread is a separate conversation. |
| Message history display | Core of any chat UI — must render messages from Tambo's message array | Low-Med | Map over messages from `useTambo()`, render user and assistant messages differently. |
| Message input with submission | The interactive part — without it you can't observe streaming | Low-Med | Uses `useTamboThreadInput()`. Submit on Enter or button click. |
| Streaming response display | The "wow" moment in any AI demo; shows Tambo handles streaming, not the UI library | Med | Live token streaming visible in the message bubble as it fills in. |
| Style isolation between pages | If Primer's CSS leaks into Carbon's page, the demo is broken | Med | CSS Modules, scoped imports, or per-page provider configuration. Critical. |
| Global `TamboProvider` | All 6 pages share Tambo state; provider must wrap the app at root level | Low | Wired in `app/layout.tsx` with API key from env var. |

---

## Differentiators

Features that make the demo more persuasive or developer-friendly without being required for correctness.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Loading / streaming indicator | Shows developers how to handle async UX — blinking cursor or spinner during generation | Low | Single component, reused across skins. Each skin styles it differently (CSS shows library isolation working). |
| Empty state for new threads | "Start a conversation" prompt when no messages exist — teaches the developer what to render on first load | Low | Per-skin styling, same conditional logic. |
| Thread naming (auto or manual) | Seeing named threads in the sidebar is more realistic than "Thread 1, Thread 2" | Med | Auto-name from first message (string slice) or let Tambo provide a title if the API supports it. |
| "New thread" button | Makes thread creation discoverable; without it new users may not know how to start fresh | Low | One button in sidebar header. Standard pattern from ChatGPT, Claude web, etc. |
| Code annotation / label | Small badge or footer note on each demo page naming the library being used | Low | "Built with GitHub Primer" — reminds the viewer what they're looking at. Reinforces the message. |
| Keyboard accessibility for input | Submit on Enter, Shift+Enter for newline — standard expectation from developers | Low | Handled in `useTamboThreadInput` submission handler. |
| Environment-variable API key setup | Documented `.env.local` setup removes a common friction point for developers trying to run locally | Low | README + `NEXT_PUBLIC_TAMBO_API_KEY` env var check. Not a UI feature but reduces drop-off. |
| Visible hook names in source comments | If a developer views source, inline comments like `// useTambo() provides messages` accelerate understanding | Low | Source-level DX, costs nothing. |
| Demo prompt suggestions | Placeholder text or chip suggestions in input that prompt the user to try something | Low | "Ask me anything" or specific starter prompts seeded per demo. Shows developers how to add hints. |

---

## Anti-Features

Things to explicitly NOT build. Building these would dilute the demo's signal, add maintenance cost, and suggest scope the library doesn't intend to cover.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Authentication / user accounts | Login screens hide the chat demo behind a gate; every visitor should land directly in the UI | Keep the app public. No login. |
| Persistent storage / database | Demos don't need durability; adding a database introduces irrelevant complexity and deployment concerns | Use Tambo's in-memory thread state. Conversations reset on refresh — acceptable for a demo. |
| Mobile-responsive layouts | Mobile layout requires per-library responsive work for 6 separate implementations; costs 6x the effort for minimal demo value | Desktop-first. Note this in README. |
| Custom model/API configuration UI | A settings panel for model selection would make visitors think Tambo is a ChatGPT wrapper, not a UI library | Hardcode sensible defaults. Use `TamboProvider` config. |
| File upload / image attachments | `useTamboThreadInput` supports image uploads but showcasing it requires significant per-skin UI work | Out of scope for MVP. Can be a follow-up demo. |
| Performance comparison across skins | Measuring render time or bundle size differences between the 6 skins is interesting engineering but not the demo's point | Don't include benchmark UI. If needed, document separately. |
| Feature toggles / A/B variants within a skin | Having switches inside a skin page adds complexity without proving anything new | One canonical implementation per skin. Keep it clean. |
| Search across threads | Search is a product feature. This is a proof-of-concept. | Not needed. Thread list with scroll is sufficient. |
| Markdown / rich text rendering in messages | Rich rendering requires a shared renderer (e.g. `react-markdown`) that may conflict with individual library styles | Render plain text only, or use a single unstyled markdown renderer if needed. Test carefully per skin. |
| Animated page transitions | Adds complexity with zero contribution to the "headless = UI-agnostic" proof | Standard Next.js routing, no animation. |

---

## Feature Dependencies

```
TamboProvider (root)
  └─ useTamboThreadList()      → Thread selector sidebar (list + new button)
       └─ useTamboThread(id)   → Active thread context
            └─ useTambo()      → Message history display + streaming state
                 └─ useTamboThreadInput() → Message input + submission
                      └─ Streaming indicator (derived from streaming state in useTambo)

Home page
  └─ Navigation links to all 6 demo pages (static, no Tambo deps)

Style isolation
  └─ Required before any page can be tested (CSS leak breaks visual proof)
```

Key dependency insight: the thread selector depends on thread list working before you can demonstrate conversation switching. Build data flow bottom-up (provider → hooks → UI) before styling.

---

## MVP Recommendation

Prioritize strictly:

1. **TamboProvider wired at app root** — everything depends on this
2. **One complete demo page (Primer or Carbon)** — proves the pattern before replicating
3. **Style isolation verified** — test that page's CSS does not bleed before proceeding
4. **Replicate to all 5 remaining skins** — copy the pattern, apply each library's components
5. **Home page navigation** — build last; all links must already exist

Defer:
- **Thread auto-naming**: Nice to have, adds UX polish but requires either Tambo API support or a string-slice hack. Build after all 6 skins are functional.
- **Demo prompt suggestions**: Add after core chat loop is verified working across all skins.
- **Streaming indicator styling per skin**: Wire the shared logic first, style last.

---

## Sources

- Tambo SDK hooks: [react-sdk README](https://github.com/tambo-ai/tambo/blob/main/react-sdk/README.md) — HIGH confidence
- Tambo component library: [ui.tambo.co](https://ui.tambo.co/) — HIGH confidence (official)
- Tambo docs overview: [docs.tambo.co](https://docs.tambo.co/) — HIGH confidence (official)
- AI chat UX patterns: [UX for AI Chatbots (2026)](https://www.parallelhq.com/blog/ux-ai-chatbots) — MEDIUM confidence
- Chat UI design patterns: [16 Chat UI Design Patterns 2025](https://bricxlabs.com/blogs/message-screen-ui-deisgn) — MEDIUM confidence
- AI UI patterns (streaming, typing indicators): [patterns.dev AI UI Patterns](https://www.patterns.dev/react/ai-ui-patterns/) — MEDIUM confidence
- CSS isolation in Next.js: [Next.js CSS Docs](https://nextjs.org/docs/app/getting-started/css) — HIGH confidence
