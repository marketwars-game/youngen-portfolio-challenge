# YoungGen Portfolio Challenge — Tech Spec

**Version:** YG-V0 (MVP — โครงแรกที่วิ่งได้)
**Last Updated:** 01 Jul 2026
**งาน:** KKP YoungGen 2026 · 6–10 ก.ค. 2026 · ทีมนักเรียน ม.ปลาย (ม.4–6)
**Fork จาก:** `market-wars @ B20-stable` (Dime! Kids Camp) — แชร์ engine/DB/routes, แตกต่างที่ content / phase flow / asset config
**เกี่ยวข้อง:** Dime! Kids Camp ใช้ repo `market-wars` เดิม (ไม่ถูกแตะ) — คนละโปรเจกต์ อย่ารวม task tracking

---

## YG-V0 คืออะไร
Clone เกม Market Wars แบบ lean เปลี่ยนจากเกมเด็ก (6 sector ไทย) เป็นเกม KKP Wealth "Portfolio Challenge": ทีมจัดสรร **น้ำหนัก % ข้าม 8 asset class** ตลอด **7 challenge** เริ่มจาก **฿1,000,000** พอร์ต **compound** ไปเรื่อยๆ · ผลตอบแทน **scripted ตายตัว** (จาก Master Brief) — ไม่มี layer ดวง (quiz/chance) · จัดอันดับด้วยมูลค่าพอร์ตสุดท้าย

**สถานะ:** build ผ่าน (`tsc` + `next build` 12/12) · **return engine verified:** พอร์ต all-cash compound 7 รอบได้ ฿1,132,683 ตรงกับตัวอย่างในโจทย์เป๊ะ

---

## Design หลัก (ล็อกแล้ว)
| # | หัวข้อ | ค่า |
|---|--------|-----|
| 1 | ทีม | 1 อุปกรณ์ = 1 ทีม · ตั้งชื่อทีมเอง · reconnect ด้วยชื่อเดิม (mechanic เดิม) |
| 2 | อันดับ | มูลค่าพอร์ตสุดท้าย (Ch7 "double" **ตัดทิ้ง** ใน V.0 — ตรงกับตัวอย่างในโจทย์เอง ค่อยถามทีม Wealth) |
| 3 | ภาษา | EN ล้วน |
| 4 | Ch6 lock + surprise | **simplify** ใน V.0 (เล่นเป็นรอบปกติ) · lock+twist จริงไป V.1 |
| 5 | Smart Diversifier | ตัดออก (เหลือ Top-3 by value) |
| 6 | Multi-day | state ค้างใน Supabase · MC เปิดห้องเดิมมาต่อวันถัดไป |
| 7 | Allocation step | 10% ใน V.0 (1% ไป V.1) |
| 8 | ทุน | ฿1,000,000 · 7 challenge |

## 8 Asset Classes — `id` = key ถาวรใน portfolio / RETURN_TABLE
`cash` Cash & Bank Deposit · `bonds` Thai Gov Bonds · `thai_eq` Thai Equity (SET) · `global_eq` Global Equity · `mutual` Mutual Funds (Mixed) · `gold` Gold · `oil` Crude Oil (Ch5+) · `crypto` Digital Assets/Crypto (Ch6+, max 20%)

## Progressive unlock (AVAILABLE_ASSETS)
Ch1–4 = 6 core · Ch5 = +oil · Ch6 = +crypto, −oil · Ch7 = ครบ 8

## RETURN_TABLE (8 asset × 7 challenge, %)
|        | Ch1 | Ch2 | Ch3 | Ch4 | Ch5 | Ch6 | Ch7 |
|--------|----|----|----|----|----|----|----|
| cash      | 1.0 | 1.2 | 3.8 | 2.0 | 2.0 | 1.8 | 0.8 |
| bonds     | 1.8 | 3.5 | -6.0 | 3.0 | -1.5 | 3.0 | 6.5 |
| thai_eq   | 5.0 | -2.0 | -10.0 | 13.0 | -12.0 | -3.0 | -14.0 |
| global_eq | 6.5 | 4.0 | -14.0 | 22.0 | -10.0 | -1.0 | 3.0 |
| mutual    | 4.0 | 1.5 | -7.0 | 9.0 | -6.0 | 0.0 | -4.0 |
| gold      | 3.0 | 5.0 | 14.0 | -3.0 | 18.0 | 7.0 | 20.0 |
| oil       | — | — | — | — | 30.0 | — | -25.0 |
| crypto    | — | — | — | — | — | -35.0 | 30.0 |

## Phase flow (YG-V0)
`year_intro → invest → market_open → event → event_result → results → leaderboard` (Ch7: `… → results → final`) · ตัด phase quiz/research/chance ออก

---

## ไฟล์ที่แก้จาก `market-wars @ B20-stable` (5 ไฟล์)
| ไฟล์ | แก้อะไร |
|------|---------|
| `lib/constants.ts` | 8 asset (EN) · RETURN_TABLE 8×7 · STARTING_MONEY 1,000,000 · TOTAL_ROUNDS 7 · AVAILABLE_ASSETS + getAvailableAssets + getAssetCap · EN brief/event/step/phase · quiz/chance/golden = dormant |
| `lib/game-engine.ts` | `getPhaseOrder` ตัด research/research_reveal/chance_card |
| `components/player/InvestmentPanel.tsx` | filter asset ตาม round (unlock) · cap crypto ≤20% · บังคับ total = 100% ก่อน submit |
| `app/play/[roomId]/page.tsx` | ส่ง `round` เข้า InvestmentPanel |
| `app/api/players/route.ts` | ทีมเริ่มเงิน → STARTING_MONEY (1,000,000) |

**ไม่แตะ (reuse ตรงๆ):** engine ใน calculate/phase route (loop COMPANIES generic → compound เอง ไม่ต้อง migration) · Display spectator · leaderboard · sound · Bi · dormant components ยัง compile แต่ไม่ render

---

## Deferred → V.1 (ก่อน 6 ก.ค.)
- allocation step 1%
- Ch6 **lock + surprise reveal** จริง (hack $2.3B twist หลังล็อกน้ำหนัก)
- content brief/lesson เต็มบนจอ brief + result
- FinalRanking benchmark ghost คำนวณใหม่ให้ 8 asset / 7 challenge (ref `piggybank` ตอนนี้ no-op — ไม่พัง)
- prize copy / debrief จบเกม
- deploy จริง: GitHub + Vercel + Supabase แยก (ดู `docs/README_YG_V0.md`)
- optional: filter Oil/Crypto ออกจาก EventDisplay ในรอบที่ยัง lock (ตอนนี้โชว์ 0%)

## Convention version / tag
ใช้ `YG-V0`, `YG-V1`, … (แยกจากสาย kids `B{n}`) สำหรับ commit/tag ทุกครั้ง

## Workflow (เหมือน market-wars)
1. Design Session ก่อน → รอ "เริ่มได้" → ค่อย code
2. แก้ code = ส่งไฟล์เต็มทั้งไฟล์ (ห้าม diff)
3. version header ทุกไฟล์: `// VERSION: YG-V{n} — ...`
4. build verify ก่อนส่ง: `npx tsc --noEmit` + `next build`
5. ปิด task: Task Summary + update Tech Spec + FILE_REGISTRY + commit + push + tag `YG-V{n}`
6. **กติกากันพลาด:** สีใช้ inline style เท่านั้น (ห้าม `text-[#hex]` — purge ตอน build) · ข้อความสว่างขั้นต่ำ `rgba(255,255,255,0.65)` · CSS zoom ใช้ `useEffect+useState` · `parseFloat` ไม่ใช่ `Number()` กับ field numeric จาก Supabase
