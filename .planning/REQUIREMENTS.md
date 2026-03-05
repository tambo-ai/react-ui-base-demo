# Requirements: Tambo React UI Base Demo

**Defined:** 2026-03-05
**Core Value:** Prove that Tambo is truly UI-agnostic — the same headless functionality works identically regardless of which design system skins it.

## v1.1 Requirements

Requirements for react-ui-base migration. Each maps to roadmap phases.

### Migration

- [x] **MIGR-01**: All 6 skins use ThreadContent.* components for message display
- [x] **MIGR-02**: All 6 skins use MessageInput.* components for message composition
- [x] **MIGR-03**: All 6 skins use ThreadHistory.* components for thread sidebar
- [x] **MIGR-04**: No skin imports hooks directly from @tambo-ai/react (except useTamboComponentRegistration for rendered components)

### Features

- [x] **FEAT-01**: Message.LoadingIndicator renders streaming state styled per skin
- [x] **FEAT-02**: Message.RenderedComponent displays AI-generated React components
- [x] **FEAT-03**: ReasoningInfo shows collapsible thinking/reasoning per skin
- [x] **FEAT-04**: ToolcallInfo shows tool call status per skin
- [x] **FEAT-05**: MessageInput.FileButton enables image attachment per skin
- [x] **FEAT-06**: Elicitation forms render inline styled per skin

### Demo

- [x] **DEMO-01**: Seed messages in initial thread demonstrate message types (user, assistant, reasoning, tool calls)
- [x] **DEMO-02**: At least one custom component registered via @tambo-ai/react for AI rendering

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
| MIGR-01 | Phase 6 + 7 + 8 | Complete |
| MIGR-02 | Phase 6 + 7 + 8 | Complete |
| MIGR-03 | Phase 6 + 7 + 8 | Complete |
| MIGR-04 | Phase 6 + 7 + 8 | Complete |
| FEAT-01 | Phase 6 + 7 + 8 | Complete |
| FEAT-02 | Phase 6 | Complete |
| FEAT-03 | Phase 6 + 7 + 8 | Complete |
| FEAT-04 | Phase 6 + 7 + 8 | Complete |
| FEAT-05 | Phase 6 + 7 + 8 | Complete |
| FEAT-06 | Phase 6 + 7 + 8 | Complete |
| DEMO-01 | Phase 6 | Complete |
| DEMO-02 | Phase 6 | Complete |

**Coverage:**
- v1.1 requirements: 12 total
- Mapped to phases: 12
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-05*
*Last updated: 2026-03-05 after initial definition*
