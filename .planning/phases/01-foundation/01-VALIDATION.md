---
phase: 1
slug: foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-04
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — Phase 1 uses structural checks only |
| **Config file** | none |
| **Quick run command** | `npx tsc --noEmit && npm run build` |
| **Full suite command** | `npx tsc --noEmit && npm run build` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx tsc --noEmit`
- **After every plan wave:** Run `npm run build`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 1-01-01 | 01 | 1 | FOUND-01 | structural | `ls src/app/\(primer\)/layout.tsx src/app/\(polaris\)/layout.tsx src/app/\(carbon\)/layout.tsx src/app/\(neobrutalism\)/layout.tsx src/app/\(nes\)/layout.tsx src/app/\(retro\)/layout.tsx` | ❌ W0 | ⬜ pending |
| 1-01-02 | 01 | 1 | LAYOUT-01–04 | structural | `grep -r "sidebar\|message-history\|message-input" src/app/` | ❌ W0 | ⬜ pending |
| 1-02-01 | 02 | 1 | FOUND-02 | structural | `grep -r "TamboProvider" src/app/\(primer\)/layout.tsx` | ❌ W0 | ⬜ pending |
| 1-02-02 | 02 | 1 | FOUND-03 | structural | `grep -r "NEXT_PUBLIC_TAMBO_API_KEY" src/` | ❌ W0 | ⬜ pending |
| 1-02-03 | 02 | 1 | FOUND-01 | build | `npm run build` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- Existing infrastructure covers all phase requirements (structural checks + build).

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| CSS isolation between route groups | FOUND-01 | Requires browser inspection | Navigate between /primer and /polaris, check no CSS bleed in DevTools |
| Full page reload on skin navigation | FOUND-01 | Browser behavior | Watch Network tab for full document request when switching skins |

---

## Validation Sign-Off

- [ ] All tasks have automated verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
