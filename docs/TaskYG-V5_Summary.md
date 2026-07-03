# Task Summary — YG-V5

**Project:** YoungGen Portfolio Challenge · **Tag:** `YG-V5` · **Date:** 03 Jul 2026 · **Base:** `YG-V4`
**Build:** ✅ `tsc --noEmit` clean · `next build` 12/12 (Next 16.1.6 Turbopack) · ไม่มี DB migration

---

## Scope
Final-screen rework (planning items 9–10 + spoiler guard):
1. **ตัด Awards step (Step Reward)** — final router 4→3 step: `final → final_podium → final_ranking`
2. **FinalRanking = ทีมจริงล้วน** — ตัด benchmark ghost (4 ใบ) + ตัด Smart Diversifier (badge/ไฮไลต์/legend) · คง 🎯/🧺 strategy tags
3. **มือถือ spoiler guard** — hold หน้า "Watch the big screen" ตอน `final`/`final_podium` · เฉลย recap ตัวเองตอน `final_ranking`

**เพิ่มระหว่างทาง (เคาะกับ OANIE):** เอา Smart Diversifier ออก **ทุกจอในหน้าจบ** (ไม่ใช่แค่ Ranking) → กระทบ FinalPodium (award pill), FinalView (badge), FinalMC (SPECIAL AWARDS box + script).

## Files (7 แก้ · ไม่มีไฟล์ใหม่ · FinalAwards.tsx = dormant)
| File | Change |
|------|--------|
| `components/display/FinalDisplay.tsx` | router 4→3 step (ตัด `final_awards` จาก type + branch + import FinalAwards) |
| `components/display/FinalPodium.tsx` | ตัด award pill "🏆 ชนะ 2 รางวัล" + `calculateAwards`/`getPlayerAwards`/`wonTwo` (เดิม pill นี้ bug — นับ "2 รางวัล" ทั้งที่ YG มี award เดียว) |
| `components/display/FinalRanking.tsx` | ตัด `computeBenchmarks`/ghost render/legend กรอบฟ้า + ตัด Smart Diversifier (`calculateAwards`/winnerIds/ไฮไลต์ม่วง/🏅/legend) · `combined`→`sortedPlayers` · import ตัด `RETURN_TABLE` (−92 บรรทัด) |
| `components/player/FinalView.tsx` | + prop `phase` + spoiler guard (return holding screen ตอน final/final_podium) · ตัด award badge block + ตัด YOUR STATS card (quiz/chance dormant → เดิมโชว์ 0/14 · ฿0) · เลิก import จาก awards |
| `components/mc/FinalMC.tsx` | script 4-step → 2-step (① Podium → ② Ranking) · ตัด SPECIAL AWARDS box + `calculateAwards`/`COMPANIES` import |
| `app/play/[roomId]/page.tsx` | ส่ง `phase={phase}` เข้า FinalView + comment |
| `app/mc/[roomId]/page.tsx` | final stepper: `order` + `stepBtns` ตัด Awards, renumber ① Podium / ② Ranking + comment |

## Key findings / learnings
- **⚠️ CDN cache หลอก git clone ได้:** clone แรก (`git clone --depth 1` ผ่าน codeload) ได้ pack เก่า SHA `0119c03` (registry ยังเป็น V2, docs ไม่มี v3/v4) → เข้าใจผิดว่า V4 push ไม่ครบ. **re-clone สด** ได้ SHA `a548238`+`836c01a` → docs/registry ครบจริง. บทเรียน: **สงสัย state ให้ re-clone ยืนยัน อย่าเชื่อ clone เดียว** (แม้แต่ git protocol).
- **force-push เกิดขึ้น** (SHA ต่างแต่ message เดียวกัน) → เช็ค diff ไฟล์เป้าหมายก่อนแก้ (โชคดี 5 ไฟล์ SAME) — ควร re-read source จาก clone สดเสมอ
- **Smart Diversifier โผล่ 4 จุดในหน้าจบ** (Ranking, Podium pill, mobile badge, MC box) — planning doc พูดถึงแค่ ranking · grep `calculateAwards` เจอครบก่อนพลาด
- **FinalPodium "ชนะ 2 รางวัล" = bug แฝงใน YG** (quiz ถูกตัด → มี award เดียว แต่ป้ายเขียน "2") — การตัด award เลยแก้ bug ไปด้วย
- **FinalMC ขัดกันเองถ้าไม่แก้:** stepper เหลือ 2 step แต่ script เดิมเขียน 4 step + อ้าง Awards ที่ตัดไปแล้ว → ต้องแก้ให้ตรง (MC จะงงตอนงานจริง 6–10 ก.ค.)
- **spoiler guard ทำที่ FinalView layer** (ไม่ใช่ play page) — play page ส่ง `phase` เข้าไป · guard `phase==='final'||'final_podium'` return holding screen ก่อนคำนวณ recap

## Verification
- `tsc --noEmit` exit 0 · `next build` exit 0 (12/12 pages)
- grep leftover (`final_awards`/`computeBenchmarks`/`winnerIds`/`wonTwo`/`myAwards`) = ว่าง
- header ครบ 7 ไฟล์ = YG-V5 · `calculateAwards` เหลือใช้แค่ FinalAwards.tsx (dormant)

## Follow-ups → V6
- FinalMC: 5 บทเรียน อ้าง "PiggyBank+" (ไม่มีใน YG) + wording ควร EN
- FinalSuspense / FinalRanking header ยังมีไทย ("ใครคือแชมป์?", "อันดับสุดท้าย") → EN sweep
- FinalAwards.tsx dormant — พิจารณาลบใน V6 หรือเก็บเป็น reference
- A8 dry-run เต็ม 7 challenge · 6-team display layout

## Commit + tag
```bash
git add components/display/FinalDisplay.tsx components/display/FinalPodium.tsx \
        components/display/FinalRanking.tsx components/player/FinalView.tsx \
        components/mc/FinalMC.tsx "app/play/[roomId]/page.tsx" "app/mc/[roomId]/page.tsx" \
        FILE_REGISTRY.md docs/YoungGen_TechSpec_v5.md docs/TaskYG-V5_Summary.md
git commit -m "YG-V5: final rework — cut Awards step, real-teams-only ranking, mobile spoiler guard"
git tag YG-V5 && git push && git push --tags
```
