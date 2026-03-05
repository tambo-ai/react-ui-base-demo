# Roadmap: Tambo React UI Base Demo

## Overview

Build a Next.js demo app that proves `@tambo-ai/react-ui-base` is truly UI-agnostic by implementing an identical chat interface across 6 different design systems. The build order is dictated by dependency: CSS isolation must be established first, one reference skin must prove the full Tambo hook wiring end-to-end, then the remaining skins are added in two groups (brand systems, then aesthetic libraries), and finally the home page navigation is completed once all destinations exist.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation** - Next.js scaffold with route groups, CSS isolation proven, Tambo env configured, and layout contract established (completed 2026-03-05)
- [ ] **Phase 2: Primer Skin** - GitHub Primer demo page with full chat functionality wired to real Tambo hooks (reference implementation)
- [ ] **Phase 3: Brand Skins** - Shopify Polaris and IBM Carbon demo pages replicating the reference layout
- [ ] **Phase 4: Aesthetic Skins** - Neobrutalism, nes.css, and retro-futuristic demo pages with non-standard library setup
- [ ] **Phase 5: Navigation** - Home page with links to all 6 demos and back-navigation on each demo page

## Phase Details

### Phase 1: Foundation
**Goal**: The app's architectural skeleton is in place — CSS isolation is proven, the Tambo provider is configured, and the 3-panel layout contract is defined and verifiable
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, LAYOUT-01, LAYOUT-02, LAYOUT-03, LAYOUT-04
**Success Criteria** (what must be TRUE):
  1. Navigating between two different route-group pages in the browser shows no CSS bleed from one into the other (verified by inspecting the DOM with DevTools)
  2. The Tambo API key is read from `.env.local` and the app boots without a hardcoded key anywhere in source
  3. All 6 route group paths (`/primer`, `/polaris`, `/carbon`, `/neobrutalism`, `/nes`, `/retro`) resolve in the browser without 404
  4. Each route group has its own layout file that mounts a TamboProvider scoped to that skin
  5. A documented layout contract exists describing the three required panels (sidebar, message history, message input) and their structural arrangement
**Plans**: 2 plans

Plans:
- [x] 01-01-PLAN.md — Strip scaffold, install @tambo-ai/react, create Tambo config and env template
- [x] 01-02-PLAN.md — Create 6 route groups with TamboProvider layouts and 3-panel skeleton pages

### Phase 2: Primer Skin
**Goal**: A fully functional GitHub Primer chat demo page exists that exercises every Tambo hook and proves the 3-panel layout works end-to-end
**Depends on**: Phase 1
**Requirements**: SKIN-01, CHAT-01, CHAT-02, CHAT-03, CHAT-04, CHAT-05, CHAT-06, CHAT-07
**Success Criteria** (what must be TRUE):
  1. User can open the Primer demo page and see a 3-panel layout: thread list on the left, message history in the center, and a message input fixed at the bottom
  2. User can create a new thread and see it appear in the thread sidebar
  3. User can switch between threads in the sidebar and see each thread's own message history
  4. User can type a message and send it; the message appears in the history and an AI response arrives with tokens streaming in visibly
  5. User sees a loading indicator while the AI is generating a response
  6. All UI elements on the Primer page are rendered using Primer React components (no foreign library components)
**Plans**: 2 plans

Plans:
- [ ] 02-01-PLAN.md — Install Primer React, create 3 skin components wired to Tambo hooks, compose into page
- [ ] 02-02-PLAN.md — Browser verification of streaming, thread switching, and Primer rendering

### Phase 3: Brand Skins
**Goal**: Shopify Polaris and IBM Carbon demo pages exist with the identical 3-panel layout and full Tambo hook wiring as the Primer reference
**Depends on**: Phase 2
**Requirements**: SKIN-02, SKIN-03
**Success Criteria** (what must be TRUE):
  1. User can open the Polaris demo page and use all chat functionality (create thread, send message, see streaming response) with the UI styled entirely in Polaris components
  2. User can open the Carbon demo page and use all chat functionality with the UI styled entirely in Carbon components
  3. Navigating from Primer to Polaris to Carbon shows visually distinct styling with no cross-contamination between design systems
**Plans**: 2 plans

Plans:
- [ ] 03-01-PLAN.md — Install Shopify Polaris (with React 19 npm override), build Polaris skin components and page
- [ ] 03-02-PLAN.md — Install IBM Carbon (with Dart Sass), build Carbon skin components and page

### Phase 4: Aesthetic Skins
**Goal**: Neobrutalism, nes.css, and retro-futuristic demo pages exist with the identical 3-panel layout and full Tambo hook wiring
**Depends on**: Phase 3
**Requirements**: SKIN-04, SKIN-05, SKIN-06
**Success Criteria** (what must be TRUE):
  1. User can open the Neobrutalism demo page and use all chat functionality with neobrutalism-styled components; Tailwind preflight does not bleed into other skin pages
  2. User can open the nes.css demo page and use all chat functionality with pixel/retro NES styling applied via nes.css classes
  3. User can open the retro-futuristic demo page and use all chat functionality with vendored retro-futuristic components rendering correctly
  4. After adding all three aesthetic skins, navigating back to Primer, Polaris, or Carbon shows their styling is unaffected
**Plans**: TBD

Plans:
- [ ] 04-01: Set up Tailwind v4, add neobrutalism components via shadcn CLI, build Neobrutalism skin
- [ ] 04-02: Build nes.css skin using imported stylesheet and custom components
- [ ] 04-03: Vendor retro-futuristic components from GitHub source, adapt asset paths for Next.js, build Retro skin

### Phase 5: Navigation
**Goal**: The demo has a coherent entry point — a home page that links to all 6 skins — and every demo page has a visible way back to the home page
**Depends on**: Phase 4
**Requirements**: NAV-01, NAV-02
**Success Criteria** (what must be TRUE):
  1. User can visit the root URL (`/`) and see a home page displaying navigation cards or links for all 6 demo pages
  2. User can click any navigation card from the home page and be taken directly to that demo page
  3. User can navigate back to the home page from any demo page without using the browser back button
**Plans**: TBD

Plans:
- [ ] 05-01: Build home page with navigation grid linking to all 6 skins, add back-navigation to each demo layout

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 2/2 | Complete   | 2026-03-05 |
| 2. Primer Skin | 1/2 | In Progress|  |
| 3. Brand Skins | 0/2 | Not started | - |
| 4. Aesthetic Skins | 0/3 | Not started | - |
| 5. Navigation | 0/1 | Not started | - |
