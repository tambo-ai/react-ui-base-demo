# Requirements: Tambo React UI Base Demo

**Defined:** 2026-03-05
**Core Value:** Prove that Tambo is truly UI-agnostic — the same headless functionality works identically regardless of which design system skins it.

## v1.1 Requirements

Requirements for react-ui-base migration. Each maps to roadmap phases.

### Migration

- [ ] **MIGR-01**: All 6 skins use ThreadContent.* components for message display
- [ ] **MIGR-02**: All 6 skins use MessageInput.* components for message composition
- [ ] **MIGR-03**: All 6 skins use ThreadHistory.* components for thread sidebar
- [ ] **MIGR-04**: No skin imports hooks directly from @tambo-ai/react (except useTamboComponentRegistration for rendered components)

### Features

- [ ] **FEAT-01**: Message.LoadingIndicator renders streaming state styled per skin
- [ ] **FEAT-02**: Message.RenderedComponent displays AI-generated React components
- [ ] **FEAT-03**: ReasoningInfo shows collapsible thinking/reasoning per skin
- [ ] **FEAT-04**: ToolcallInfo shows tool call status per skin
- [ ] **FEAT-05**: MessageInput.FileButton enables image attachment per skin
- [ ] **FEAT-06**: Elicitation forms render inline styled per skin

### Demo

- [ ] **DEMO-01**: Seed messages in initial thread demonstrate message types (user, assistant, reasoning, tool calls)
- [ ] **DEMO-02**: At least one custom component registered via @tambo-ai/react for AI rendering

## Future Requirements

None — this milestone covers the full react-ui-base showcase.

## Out of Scope

| Feature | Reason |
|---------|--------|
| McpPrompts / McpResources | Requires MCP server setup beyond demo scope |
| ThreadDropdown (compact) | ThreadHistory sidebar already demonstrates thread switching |
| Message.RenderedComponentCanvasButton | Canvas mode is advanced; base rendering sufficient for demo |
| Custom TipTap extensions | Default MessageInput.Textarea editor is sufficient |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| MIGR-01 | Phase 6 + 7 + 8 | Pending |
| MIGR-02 | Phase 6 + 7 + 8 | Pending |
| MIGR-03 | Phase 6 + 7 + 8 | Pending |
| MIGR-04 | Phase 6 + 7 + 8 | Pending |
| FEAT-01 | Phase 6 + 7 + 8 | Pending |
| FEAT-02 | Phase 6 | Pending |
| FEAT-03 | Phase 6 + 7 + 8 | Pending |
| FEAT-04 | Phase 6 + 7 + 8 | Pending |
| FEAT-05 | Phase 6 + 7 + 8 | Pending |
| FEAT-06 | Phase 6 + 7 + 8 | Pending |
| DEMO-01 | Phase 6 | Pending |
| DEMO-02 | Phase 6 | Pending |

**Coverage:**
- v1.1 requirements: 12 total
- Mapped to phases: 12
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-05*
*Last updated: 2026-03-05 after initial definition*
