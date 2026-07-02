# Task Summary — YG-V3 (Batch 0)

**Project:** YoungGen Portfolio Challenge (`youngen-portfolio-challenge`)
**Tag:** `YG-V3` · **Date:** 02 Jul 2026
**Base:** `YG-V2` (re-theme + fit-to-screen)
**Build:** ✅ `tsc --noEmit` clean · `next build` 12/12 static pages (Next 16.1.6 / Turbopack)

---

## Scope
Config & correctness fixes from team review — 6 changes, 4 files. No DB/schema change, no phase-flow change.

| # | Change | Origin |
|---|--------|--------|
| 1 | Allocation step 10% → **5%** | Team decision (Brief spec 1% deferred) |
| 2 | **Server-side validation bug fix** — hardcoded `% 10` rejected 5% steps | Bug found in testing |
| 3 | Removed **crypto 20% cap** (cap machinery kept, generic) | Team decision (⚠️ differs from Brief v3 ≤20%) |
| 4 | **Submit is final** — Edit button + `handleEdit` removed | Team decision |
| 5 | EventDisplay: filter returns grid to **unlocked assets only** | Pending A7 |
| 6 | **EN-only pass** on touched files (EventDisplay) | Pending A9 (partial) |

## Files changed (4)
| File | Change |
|------|--------|
| `lib/constants.ts` | `ALLOCATION_STEP` 5 · removed `cap: 20` from crypto + description · comments/header YG-V3 |
| `app/api/players/portfolio/route.ts` | validation `% 10` → `% ALLOCATION_STEP` + dynamic error message · added version header (was header-less) |
| `components/player/InvestmentPanel.tsx` | crypto cap auto-clears (generic) · removed Edit button + `handleEdit` → "🔒 Allocation locked" chip · header YG-V3 |
| `components/display/EventDisplay.tsx` | `COMPANIES.map` → `getAvailableAssets(round).map` · 3 TH strings → EN · header YG-V3 |

## Key findings / learnings
- **Allocation step lived in TWO places:** `ALLOCATION_STEP` (client, InvestmentPanel) AND a hardcoded `% 10` server validation (`portfolio/route.ts`). The client change alone passed `next build` but broke at runtime on submit. → Now server derives from `ALLOCATION_STEP` (single source of truth). *Lesson: grep for the value's semantics (`multiple`, `% 10`) not just the constant name when changing a rule.*
- **Crypto cap was fully generic in the UI** (`getAssetCap(id) ?? 100`, conditional badge, `atCap` false when undefined). Removing `cap: 20` from constants was sufficient — no UI edit needed. No server-side cap enforcement existed.
- **`submitted` state resets safely per round** because play page renders `InvestmentPanel` only during `phase === 'invest'` (unmounts otherwise) — so removing `handleEdit` doesn't strand `submitted=true` into the next round.
- **`฿` (U+0E3F) is in the Thai Unicode block** — TH-detection scripts flag it; it is the Baht symbol, intentionally kept.

## Verification
- `npx tsc --noEmit` → exit 0
- `next build` (placeholder env) → 12/12 static pages, exit 0
- Manual grep confirms: no `cap: 20`, no `% 10` validation, no `handleEdit` / Edit button remaining

## Follow-ups (Tech Spec updated accordingly)
- A1 (step) ✅ done · A7 (Oil/Crypto filter) ✅ done · A9 (EN) partial (touched files) · B5 (step) resolved → 5%
- ⚠️ Crypto cap removal deviates from Master Brief v3 — flagged in Tech Spec
- Parked: 5% doubles tap count for all-in → possible slider/quick-fill later
- Balance note: no crypto cap → all-in crypto possible (Ch6 −35% / Ch7 +30%) → higher variance, revisit in balancing

## Version roadmap (re-scoped)
V3 closed at Batch 0. Timer removal folded into V4.
- **V3** (this) — step 5% + validation fix + cap removed + submit final + EventDisplay filter + partial EN
- **V4** — remove all timers + submit→hold→MC reveal (everyone sees together)
- **V5** — final rework: drop Step Reward, champion reveal + ranking only, player screen masked during reveal, benchmark removed
- **V6** — 6-team display layout + full EN sweep + YoungGen QR link + dormant cleanup

## Commit + tag
```bash
git add lib/constants.ts app/api/players/portfolio/route.ts \
        components/player/InvestmentPanel.tsx components/display/EventDisplay.tsx \
        FILE_REGISTRY.md docs/YoungGen_TechSpec_v3.md
git commit -m "YG-V3: step 5% (+server validation fix) + crypto cap removed + submit final + EventDisplay unlock filter + EN pass"
git tag YG-V3
git push && git push --tags
```
