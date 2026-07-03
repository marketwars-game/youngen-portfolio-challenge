# Task Summary — YG-V6 (final task of YoungGen)

**Project:** YoungGen Portfolio Challenge · **Tag:** `YG-V6` · **Date:** 03 Jul 2026 · **Base:** `YG-V5`
**Build:** ✅ `tsc --noEmit` clean · `next build` 12/12 (Next 16.1.6 Turbopack) · **ไม่มี DB migration**
**บริบท:** งานสุดท้ายของ YoungGen ก่อน event 6–10 ก.ค. — display พร้อมสำหรับ 4–8 ทีม + EN ครบ + multi-day rejoin + สลับกลุ่ม

---

## Scope
1. **Block B — display layout 4–8 ทีม** (rewrite จอที่ inherit layout ~70 คนจาก Kids Camp; responsive วัดความสูง container ด้วย ResizeObserver):
   - `LeaderboardDisplay` → single-column big rows + money bar (fill ∝ ผู้นำ) · เก็บ racing/medal/movement/dark-horse inline · ตัด TOP8/#9+ split + paginate
   - `LiveNameBoard` → invest = ✓/Waiting rows · reveal = allocation-bar rows + 🎯 Concentrated / 🧺 Diversified + legend · ตัด tierOf/PAGE_SIZE/paginate
   - `ResultsDisplay` → **diverging bars** (center=0, gain→ขวา / loss→ซ้าย) เรียงตามผลรอบ · amount ใน **fixed right column** (กัน clip) · Best/Worst โชว์เฉพาะเมื่อมีจริง · เก็บ summary + wave reveal
   - `FinalRanking` → **rework** เป็น big rows + money bar + medals + 🎯/🧺 chip + return% + final money · เก็บ stats header + wave-in
2. **Block C — full EN sweep (จอน้องๆ) + terminology:** ทุกจอ Display + player mobile เป็น EN · **"Y E A R" → "CHALLENGE"** · player year_intro list เดิมชี้ Quiz/Chance (ตัดไปแล้ว) → **YG steps** (Allocate → Reveal → Market → Results) · Allocate ใช้ **money ปัจจุบัน** (compound) ไม่ใช่ 1,000,000 ตายตัว · MC-facing คงไทย · ฿ คงไว้
3. **Additions:** `bit.ly/portchallenge` · **rejoin QR corner card** ที่ Challenge Brief (multi-day) · **End & New Room** ปุ่ม MC final (สลับกลุ่ม) · ลบ dead `final_awards` (display branch)
4. **FitStage fix (สำคัญ):** จอ final ทั้ง 3 เดิม root `h-screen` (100vh) แต่ render ใน FitStage box 720 → ล้น/เลื่อนบน viewport >720 (projector 1080p) → แก้เป็น `h-full`

## Files — 15 แก้ · 0 ใหม่
| # | File | Change |
|---|------|--------|
| 1 | `components/display/LeaderboardDisplay.tsx` | rewrite: rows + money bar + racing/medal/movement/DH · EN · responsive 4–8 |
| 2 | `components/display/LiveNameBoard.tsx` | rewrite: invest ✓ / reveal allocation bar + 🎯/🧺 + legend · drop tier/paginate · EN |
| 3 | `components/display/ResultsDisplay.tsx` | rewrite: diverging bars · fixed amount column (no clip) · Best/Worst guard (no ฿0) · EN |
| 4 | `components/display/FinalRanking.tsx` | rework 4–8 rows + money bar + medals + 🎯/🧺 + return% + money · EN · `h-full` |
| 5 | `components/display/FinalPodium.tsx` | `h-screen`→`h-full` (fit FitStage 720) |
| 6 | `components/display/FinalDisplay.tsx` | EN suspense (WHO'S THE CHAMPION? / Waiting for the reveal) · suspense root `h-full` |
| 7 | `components/display/YearIntroDisplay.tsx` | "Y E A R"→"CHALLENGE" · EN fallback · + rejoin QR corner card (props roomId/joinUrl) |
| 8 | `components/display/MarketOpenDisplay.tsx` | EN splash + YEAR→CHALLENGE |
| 9 | `components/display/SoundGate.tsx` | EN-only |
| 10 | `components/display/LobbyDisplay.tsx` | join URL text → `bit.ly/portchallenge` (2 จุด) |
| 11 | `app/display/[roomId]/page.tsx` | ส่ง roomId/joinUrl เข้า YearIntroDisplay · ลบ dead `final_awards` |
| 12 | `app/play/[roomId]/page.tsx` | EN header/lobby/market_open · year_intro list→YG steps · Allocate ใช้ money ปัจจุบัน · "Y E A R"→"CHALLENGE" |
| 13 | `components/player/ResultsPanel.tsx` | EN (This challenge · Portfolio return) · ROUND→CHALLENGE |
| 14 | `components/player/FinalView.tsx` | EN (RETURN BY CHALLENGE · Ch N) |
| 15 | `app/mc/[roomId]/page.tsx` | + ปุ่ม End & New Room (next-group) · MC-facing คงไทย |

**+ docs:** `FILE_REGISTRY.md` · `docs/YoungGen_TechSpec_v6.md` · `docs/TaskYG-V6_Summary.md` · `docs/YG_V3-V6_WhatChanged.md`

## Fixes ระหว่างทาง (หลัง "เริ่มได้" — เจอจากภาพจริงตอน dry-run)
- **ResultsDisplay: ตัวเลข ฿ หลุดขอบขวา** — เดิม amount วางที่ปลาย bar (`calc(50% + w% + 12px)`) พอทุกทีมกำไร bar ยาวเกือบสุด → หลุดจอ · fix: fixed right column 168px right-aligned + หด bar cap 46→44%
- **ResultsDisplay: "💀 Worst: TEAM4 ฿0"** — เดิม `Math.min(0, worst.chg)` clamp ทีมกำไรน้อยสุดเป็น ฿0 · fix: Best โชว์เฉพาะมีคนกำไรจริง / Worst เฉพาะมีคนขาดทุนจริง + ใช้ค่าจริง
- **play year_intro: "Allocate your ฿1,000,000" ตายตัว** — เงิน compound ทุก challenge · fix: ใช้ `player.money` ปัจจุบัน
- **จอ final ล้น/ตกขอบ** — `h-screen` ใน FitStage 720 · fix: `h-full` ทั้ง FinalRanking/FinalPodium/FinalDisplay

## Key findings / learnings
- **⚠️ `h-screen` ห้ามใช้ในจอที่ render ผ่าน FitStage** — FitStage เป็น box 720px คงที่ · `h-screen`=100vh (viewport จริง) → บน projector 1080p เกิน 720 → ล้น/drift · ต้อง `h-full` เสมอ (leaderboard/lobby ถูกอยู่แล้ว, จอ final พลาด)
- **ก่อน V6: tag `YG-V5` เคยชี้ commit V4-state** (docs commit) — โค้ด V5 ไม่ได้ push จริง · re-push แล้ว tag ขยับมา `c44f454` · **บทเรียน: full clone สด + grep marker เนื้อโค้ด ไม่ใช่ header/tag**
- **Multi-day rejoin = ห้าม end เกม** (players route: `finished`→block · `playing`+ชื่อเดิม→reconnect พร้อม portfolio/money เดิม) → ปุ่ม End & New Room เตือนชัด "สลับกลุ่มเท่านั้น"
- **3 จอ layout ใช้ 3 รูปทรงต่างกันโดยตั้งใจ** (leaderboard=money bar ซ้าย-anchor · reveal=segmented allocation · results=diverging center) → ผู้ชมไม่สับสนว่าอันไหนอันดับ/อันไหนผลรอบ
- **QR ไม่ต้องแก้** — `${origin}/?room=` dynamic · bit.ly เป็นแค่ text ให้พิมพ์เอง
- **player year_intro list = stale content** (ชี้ Quiz/Chance ที่ตัดไปแล้ว) → EN sweep = แก้เนื้อหาด้วย

## Verification
- `tsc --noEmit` exit 0 · `next build` exit 0 (12/12 pages, 14 routes)
- audit ไทยตกค้าง (จอน้องๆ non-comment, exclude ฿) = ว่าง · MC-facing คงไทย · dormant ไม่แตะ
- header ครบทุกไฟล์ที่แตะ = YG-V6

## 🚀 Deploy / Tag steps
```bash
# 1) วางไฟล์ทั้ง 15 (+ docs) ทับใน repo local (Cursor)

# 2) build verify ก่อน push (สำคัญ — dev mode ไม่จับ TS error)
npx tsc --noEmit
NEXT_PUBLIC_SUPABASE_URL="https://placeholder.supabase.co" NEXT_PUBLIC_SUPABASE_ANON_KEY="placeholder" npx next build

# 3) commit + tag + push
git add -A
git commit -m "YG-V6: 4-8 team display layout + full EN sweep + rejoin QR + End&NewRoom + FitStage fix"
git tag YG-V6
git push && git push --tags

# 4) Vercel auto-deploy on push to main (ไม่ต้องแตะ env — ไม่มี env ใหม่ · ไม่มี DB migration)
#    ถ้าเคยแก้ NEXT_PUBLIC_* → ต้อง Redeploy (bake ตอน build) แต่รอบนี้ไม่มี

# 5) DRY-RUN บน projector/หน้าจอ 1080p จริง — ไล่ทุก phase:
#    - Challenge Brief → เห็น rejoin QR มุมขวาบน + "CHALLENGE"
#    - invest → submit wall (✓/Waiting) · reveal → allocation bars + 🎯/🧺
#    - results → diverging bars (ตัวเลขไม่หลุดขอบ · all-gain โชว์แค่ Best)
#    - leaderboard → rows + money bar racing
#    - final → suspense → podium → FINAL STANDINGS (ทุกแถว fit ไม่ตกขอบ)
#    - ทดสอบ rejoin: ปิดจอทีม → เปิดใหม่ → สแกน QR → พิมพ์ชื่อเดิม → กลับเข้าพร้อม portfolio
#    - ทดสอบ End & New Room: จบเกม → กดปุ่ม → เข้าห้องใหม่
```

## Follow-ups
- **dry-run เต็ม 7 challenge** บน projector จริง ก่อน 6 ก.ค. (โดยเฉพาะจอ final ที่เพิ่งแก้ h-full + rejoin ต้นวัน)
- `final_awards` ใน `api/game/phase` `ALLOWED_FINAL` ยังค้าง (harmless whitelist — MC ไปไม่ถึง) ลบได้ถ้าอยากสะอาด 100%
- dormant files (Research*/Chance/Fight/QuizSpeedWall/awards) — คงไว้ (import ไม่พัง) ลบได้ตอน cleanup ถ้าต้องการ
- **ห้ามกด End & New Room ระหว่างวัน** — ระหว่างวันแค่ปิดโน้ตบุ๊ก (ห้องคง `playing` ทีม rejoin ด้วยชื่อเดิม)
