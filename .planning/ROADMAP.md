# Roadmap: Tambo React UI Base Demo

## Milestones

- ✅ **v1.0 MVP** — Phases 1-5 (shipped 2026-03-05) — [Archive](milestones/v1.0-ROADMAP.md)
- 🔄 **v1.1 react-ui-base Migration** — Phases 6-8

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1-5) — SHIPPED 2026-03-05</summary>

- [x] Phase 1: Foundation (2/2 plans) — completed 2026-03-05
- [x] Phase 2: Primer Skin (2/2 plans) — completed 2026-03-05
- [x] Phase 3: Brand Skins (2/2 plans) — completed 2026-03-05
- [x] Phase 4: Aesthetic Skins (3/3 plans) — completed 2026-03-05
- [x] Phase 5: Navigation (1/1 plan) — completed 2026-03-05

</details>

### v1.1 react-ui-base Migration (Phases 6-8)

#### Phase 6: Reference Migration + Features
**Goal:** Migrate Primer skin to react-ui-base compound components, add all feature components (RenderedComponent, ReasoningInfo, ToolcallInfo, Elicitation, FileButton), register a custom component, and create seed messages. Establishes the reference pattern for all other skins.

**Requirements:** MIGR-01 (partial), MIGR-02 (partial), MIGR-03 (partial), MIGR-04 (partial), FEAT-01 through FEAT-06 (partial — Primer only), DEMO-01, DEMO-02

**Success criteria:**
1. Primer page uses only react-ui-base components — no direct hook imports except useTamboComponentRegistration
2. Primer page shows seed messages with assistant text, reasoning block, tool call info
3. Custom component is registered and renderable by AI
4. All react-ui-base features (images, elicitation, reasoning, tool calls, rendered components) are visible in Primer skin
5. Pattern is documented and replicable for other skins

#### Phase 7: Brand Skin Migration (Carbon + Polaris)
**Goal:** Migrate Carbon and Polaris skins to react-ui-base following the Primer reference pattern.

**Requirements:** MIGR-01 (partial), MIGR-02 (partial), MIGR-03 (partial), MIGR-04 (partial), FEAT-01 through FEAT-06 (partial — Carbon + Polaris)

**Success criteria:**
1. Carbon page uses only react-ui-base components styled with Carbon design system
2. Polaris page uses only react-ui-base components styled with Polaris design system
3. Both pages show seed messages and all features identical to Primer
4. No direct hook imports from @tambo-ai/react (except useTamboComponentRegistration)

#### Phase 8: Aesthetic Skin Migration (NES + Neobrutalism + Retro)
**Goal:** Migrate NES, Neobrutalism, and Retro skins to react-ui-base. Complete milestone.

**Requirements:** MIGR-01 (complete), MIGR-02 (complete), MIGR-03 (complete), MIGR-04 (complete), FEAT-01 through FEAT-06 (complete)

**Success criteria:**
1. NES page uses react-ui-base styled with nes.css classes
2. Neobrutalism page uses react-ui-base styled with neobrutalism CSS
3. Retro page uses react-ui-base styled with retro CSS
4. All 3 show seed messages and all features
5. All 6 skins now use zero custom hook wiring — fully react-ui-base

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation | v1.0 | 2/2 | Complete | 2026-03-05 |
| 2. Primer Skin | v1.0 | 2/2 | Complete | 2026-03-05 |
| 3. Brand Skins | v1.0 | 2/2 | Complete | 2026-03-05 |
| 4. Aesthetic Skins | v1.0 | 3/3 | Complete | 2026-03-05 |
| 5. Navigation | v1.0 | 1/1 | Complete | 2026-03-05 |
| 6. Reference Migration + Features | v1.1 | 0/0 | Pending | — |
| 7. Brand Skin Migration | v1.1 | 0/0 | Pending | — |
| 8. Aesthetic Skin Migration | v1.1 | 0/0 | Pending | — |
