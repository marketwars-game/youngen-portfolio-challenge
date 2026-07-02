# Task Summary — YG-V4

**Project:** YoungGen Portfolio Challenge · **Tag:** `YG-V4` · **Date:** 02 Jul 2026 · **Base:** `YG-V3`
**Build:** ✅ `tsc --noEmit` clean · `next build` 12/12 · **Tested & passed**

---

## Scope
เอา timer ออกทั้งหมด (item 2) + submit → hold → MC reveal (item 4). ไม่มี DB migration. 7 ไฟล์ (6 แก้ + 1 ใหม่).

## Files
| File | Change |
|------|--------|
| `lib/constants.ts` | `PHASE_TIMERS = {}` · `invest.hasTimer:false` · เพิ่ม `PHASE_DISPLAY.reveal` · `reveal` เข้า STEP_GROUPS allocate |
| `lib/game-engine.ts` | แทรก `'reveal'` หลัง `'invest'` ใน getPhaseOrder |
| `components/display/LiveNameBoard.tsx` | invest variant masked (✓ only) · reveal variant (bars + legend unlocked assets) · EN |
| `components/display/InvestDisplay.tsx` | header (masked semantics; code เดิม) |
| `components/display/RevealDisplay.tsx` 🆕 | reveal phase board (LiveNameBoard variant reveal) |
| `app/display/[roomId]/page.tsx` | import RevealDisplay + branch `reveal` · header YG-V4 |
| `app/mc/[roomId]/page.tsx` | next button "🔓 Reveal Allocations" ตอน invest · EN challenge label · header YG-V4 |

## Key findings / learnings
- **Timer ออกได้แบบ lean สุด = แค่ `PHASE_TIMERS = {}`** — `timerDuration = PHASE_TIMERS[phase] || 0` = 0 ทุก phase → timer UI (guard `timerDuration > 0`) + countdown sfx (guard `timeLeft > 0`) เป็น no-op เอง ทั้ง 3 จอ · ไม่มี auto-advance (grep ยืนยัน) → ไม่ต้องแตะ page.
- **codebase เป็น PHASE_DISPLAY-driven** → play page ไม่ต้องแตะเลย: generic "phase info" block (phase ที่ไม่มี custom UI) render `PHASE_DISPLAY.reveal.playerMessage` ให้เอง · MC header + tip ก็ดึงจาก `PHASE_DISPLAY.reveal` · MC next label ดึงจาก `PHASE_DISPLAY[next].name`
- **`current_phase` เป็น `text`** → เพิ่ม phase ใหม่ไม่ต้อง migrate DB
- **calc อยู่ที่ `results`** → reveal (ก่อน market) ไม่กระทบ
- **getNextPhase auto-เดิน** เพราะใช้ `order.indexOf` — แค่แทรกใน array ก็ทำงาน ไม่ต้องแก้ getNextPhase
- **⚠️ พลาดแล้วแก้:** ครั้งแรกลืม bump header YG-V4 ของ display/mc page (OANIE จับได้) → กฎ: **bump header ทุกไฟล์ที่แตะ แม้แก้ 1-2 บรรทัด**

## Verification
- `tsc --noEmit` exit 0 · `next build` 12/12 exit 0
- Header ครบทั้ง 7 ไฟล์ = YG-V4
- Tested: masked invest → reveal → market flow ผ่าน · ไม่มี timer/เสียงนับถอยหลัง

## Follow-ups
- A2 content twist Ch6 (hack) ยังไม่ทำ (mechanic เสร็จ) · A9 EN sweep ที่เหลือ → V6 · reveal board layout สวย 6 ทีม → V6

## Version roadmap
- ✅ V3 · ✅ **V4** · 🔜 V5 (final rework) · 🔜 V6 (6-team layout + EN sweep + cleanup)

## Commit + tag
```bash
git add lib/constants.ts lib/game-engine.ts components/display/LiveNameBoard.tsx \
        components/display/InvestDisplay.tsx components/display/RevealDisplay.tsx \
        "app/display/[roomId]/page.tsx" "app/mc/[roomId]/page.tsx" \
        FILE_REGISTRY.md docs/YoungGen_TechSpec_v4.md
git commit -m "YG-V4: remove all timers + reveal phase (masked submit → MC reveal, all teams together)"
git tag YG-V4 && git push && git push --tags
```
