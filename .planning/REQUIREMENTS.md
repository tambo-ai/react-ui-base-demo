# Requirements: Tambo React UI Base Demo

**Defined:** 2026-03-04
**Core Value:** Prove that Tambo is truly UI-agnostic — the same headless functionality works identically regardless of which design system skins it.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Foundation

- [x] **FOUND-01**: App uses Next.js App Router with route groups for CSS isolation between demo pages
- [x] **FOUND-02**: TamboProvider is mounted per-skin layout (not shared root) to isolate thread state
- [x] **FOUND-03**: Tambo API key is configured via environment variable (not hardcoded)

### Chat Functionality

- [ ] **CHAT-01**: User can create a new thread via the UI
- [ ] **CHAT-02**: User can switch between existing threads via the sidebar
- [ ] **CHAT-03**: User can see a list of all threads in the sidebar
- [ ] **CHAT-04**: User can type and send a message in the input area
- [ ] **CHAT-05**: User can see full message history for the selected thread, scrolling up
- [ ] **CHAT-06**: User can see AI response tokens streaming in real-time as they arrive
- [ ] **CHAT-07**: User sees a loading indicator while AI is generating a response

### Layout

- [x] **LAYOUT-01**: Each demo page has a thread selector sidebar on the left
- [x] **LAYOUT-02**: Each demo page has a message history area as the main panel
- [x] **LAYOUT-03**: Each demo page has a message input fixed at the bottom of the main panel
- [x] **LAYOUT-04**: All 6 demo pages have structurally identical layouts (same panel arrangement)

### Skins

- [ ] **SKIN-01**: GitHub Primer demo page — all chat components styled with Primer React
- [ ] **SKIN-02**: Shopify Polaris demo page — all chat components styled with Polaris React
- [ ] **SKIN-03**: IBM Carbon demo page — all chat components styled with Carbon React
- [ ] **SKIN-04**: Neobrutalism.dev demo page — all chat components styled with neobrutalism components
- [ ] **SKIN-05**: nes.css demo page — all chat components styled with nes.css classes
- [ ] **SKIN-06**: Retro-futuristic demo page — all chat components styled with retro-futuristic UI

### Navigation

- [ ] **NAV-01**: Home page displays navigation cards/links to all 6 demo pages
- [ ] **NAV-02**: Each demo page has a way to navigate back to the home page

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Polish

- **POLISH-01**: Empty state message when thread has no messages
- **POLISH-02**: Threads get auto-generated or user-set names
- **POLISH-03**: Markdown rendering in AI responses
- **POLISH-04**: Code syntax highlighting in AI responses

### Responsive

- **RESP-01**: Mobile-friendly layout with collapsible sidebar

## Out of Scope

| Feature | Reason |
|---------|--------|
| Authentication / user accounts | Demo is public, no login needed |
| Persistent storage | Conversations don't need to survive page refresh |
| Mobile-responsive layouts | Desktop-first demo |
| Custom AI model configuration UI | Use Tambo defaults |
| Performance benchmarking | Not the point of this demo |
| Dark mode toggle | Unnecessary complexity for proving UI-agnostic point |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 | Complete |
| FOUND-02 | Phase 1 | Complete |
| FOUND-03 | Phase 1 | Complete |
| LAYOUT-01 | Phase 1 | Complete |
| LAYOUT-02 | Phase 1 | Complete |
| LAYOUT-03 | Phase 1 | Complete |
| LAYOUT-04 | Phase 1 | Complete |
| SKIN-01 | Phase 2 | Pending |
| CHAT-01 | Phase 2 | Pending |
| CHAT-02 | Phase 2 | Pending |
| CHAT-03 | Phase 2 | Pending |
| CHAT-04 | Phase 2 | Pending |
| CHAT-05 | Phase 2 | Pending |
| CHAT-06 | Phase 2 | Pending |
| CHAT-07 | Phase 2 | Pending |
| SKIN-02 | Phase 3 | Pending |
| SKIN-03 | Phase 3 | Pending |
| SKIN-04 | Phase 4 | Pending |
| SKIN-05 | Phase 4 | Pending |
| SKIN-06 | Phase 4 | Pending |
| NAV-01 | Phase 5 | Pending |
| NAV-02 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 22 total
- Mapped to phases: 22
- Unmapped: 0

---
*Requirements defined: 2026-03-04*
*Last updated: 2026-03-04 after roadmap creation*
