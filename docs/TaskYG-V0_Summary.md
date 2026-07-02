# Task Summary — YG-V0 (YoungGen Portfolio Challenge)

**วันที่:** 01 ก.ค. 2026 · **สถานะ:** ✅ DONE — Deployed & Verified · **Tag:** `YG-V0`

## เป้าหมาย
Clone Market Wars เป็นเกมใหม่สำหรับ KKP YoungGen (ทีม ม.ปลาย) — allocation 8 asset class × 7 challenge, ทุน ฿1,000,000, compound, ผลตอบแทน scripted, ไม่มี layer ดวง. แยกขาดจาก Kids Camp 100%.

## ทำอะไรไป
- **Fork** `market-wars @ B20-stable` → repo ใหม่ `youngen-portfolio-challenge`
- **แก้ 5 ไฟล์:** `lib/constants.ts` (8 asset EN + RETURN_TABLE 8×7 + STARTING_MONEY 1M + TOTAL_ROUNDS 7 + AVAILABLE_ASSETS/getAvailableAssets/getAssetCap + EN content + quiz/chance dormant) · `lib/game-engine.ts` (getPhaseOrder ตัด quiz/research/chance) · `components/player/InvestmentPanel.tsx` (unlock filter + cap crypto ≤20% + บังคับ 100%) · `app/play/[roomId]/page.tsx` (ส่ง round) · `app/api/players/route.ts` (เงินเริ่ม 1M)
- **ไม่แตะ:** engine calculate/phase (loop COMPANIES generic → compound เอง), Display/leaderboard/sound
- **Verify:** `tsc` + `next build` 12/12 · return engine ตรง PDF (all-cash = ฿1,132,683)
- **Deploy:** GitHub public + Vercel project แยก + Supabase `youngen` แยก · schema verified ตรง DB จริง 100% (แก้ bug `joined_at`, เพิ่ม action/duel_* dormant)

## Decisions ที่ล็อก (V.0)
ทีม = 1 device ตั้งชื่อเอง reconnect ชื่อเดิม · rank = มูลค่าพอร์ต (ตัด Ch7 double) · EN ล้วน · Ch6 lock+surprise simplify · ตัด Smart Diversifier · multi-day = state ค้าง DB · step 10%

## Deferred → V.1 (ก่อน 6 ก.ค.) — ดูรายการเต็มใน Tech Spec section "Pending เทียบกับ Requirement"
**A. ต้องสร้าง:** dry-run 7 challenge · step 1% ("any whole %") · Ch6 lock+surprise · content เต็ม (story/reference/lesson + MC script) · **Day-5 debrief 3 example portfolios + ตารางรายปี + 4 habits** · prize screen Top-3 + CTA Dime · FinalRanking benchmark 8/7 · (opt) EventDisplay filter locked assets
**B. ต้องเคาะกับทีม Wealth:** Ch7 "counts double" (ตอนนี้ไม่คูณ) · ภาษา EN/TH · MS Forms → แอปแทน ยืนยันไหม · Day-5 debrief ทำในแอปหรือ facilitator เล่า · allocation step 1% หรือ 5/10%

## ของที่ deliver
`youngen-portfolio-challenge` (repo) · `START_HERE_RUNBOOK.md` · `FILE_REGISTRY.md` · `docs/YoungGen_TechSpec_v0.md` · `docs/README_YG_V0.md` · `docs/schema.sql` (verified) · `.env.example`
