# YoungGen Portfolio Challenge — Tech Spec

**Version:** YG-V3 (config & correctness pass — step 5% · crypto cap removed · submit final · EventDisplay unlock filter)
**Last Updated:** 02 Jul 2026
**งาน:** KKP YoungGen 2026 · 6–10 ก.ค. 2026 · ทีมนักเรียน ม.ปลาย (ม.4–6) · **6 ทีม**
**Fork จาก:** `market-wars @ B20-stable` (Dime! Kids Camp) — แชร์ engine/DB/routes, แตกต่างที่ content / phase flow / asset config
**เกี่ยวข้อง:** Dime! Kids Camp ใช้ repo `market-wars` เดิม (ไม่ถูกแตะ) — คนละโปรเจกต์ อย่ารวม task tracking

## Deployment
- **Repo:** https://github.com/marketwars-game/youngen-portfolio-challenge (public) · tags: `YG-V0` MVP → `YG-V1` re-theme → `YG-V2` display fit → **`YG-V3` config/correctness**
- **Vercel:** project แยก — auto-deploy on push to `main`
- **Supabase:** project `youngen` แยก · schema จาก `docs/schema.sql` (✅ verified 100%) · **legacy anon key** (`eyJ...`)
- **Env (Vercel):** `NEXT_PUBLIC_SUPABASE_URL` (ไม่มี `/` ต่อท้าย) · `NEXT_PUBLIC_SUPABASE_ANON_KEY` (legacy) · `MC_PIN`

---

## Design หลัก (ล็อกแล้ว — อัปเดต YG-V3)
| # | หัวข้อ | ค่า |
|---|--------|-----|
| 1 | ทีม | 1 อุปกรณ์ = 1 ทีม · **6 ทีม** · ตั้งชื่อทีมเอง · reconnect ด้วยชื่อเดิม |
| 2 | อันดับ | มูลค่าพอร์ตสุดท้าย (Ch7 "double" ตัดทิ้ง — ยืนยันกับทีม Wealth ภายหลัง) |
| 3 | ภาษา | **EN ล้วน** (ทีมยืนยัน) · YG-V3 แปลจอที่แตะแล้ว (EventDisplay) · จอที่เหลือ → EN sweep ใน **V6** |
| 4 | Ch6 lock + surprise | simplify (เล่นเป็นรอบปกติ) · lock+reveal จริง (submit→hold→MC reveal) ไป **V4** |
| 5 | Smart Diversifier | ตัดออก (เหลือ Top-3 by value) |
| 6 | Multi-day | state ค้างใน Supabase · MC เปิดห้องเดิมมาต่อวันถัดไป |
| 7 | Allocation step | **5%** (YG-V3 — team decision; brief spec 1% deferred) |
| 8 | ทุน | ฿1,000,000 · 7 challenge |
| 9 | Submit | **Final — แก้ไม่ได้หลัง submit** (YG-V3; ปุ่ม Edit ถูกเอาออก) |

## 8 Asset Classes — `id` = key ถาวรใน portfolio / RETURN_TABLE
`cash` · `bonds` · `thai_eq` · `global_eq` · `mutual` · `gold` · `oil` (Ch5+) · `crypto` (Ch6+, **ไม่มีเพดานแล้ว** — YG-V3 ถอด cap 20%)

> **Per-asset cap:** กลไก `getAssetCap` ยังอยู่ (generic) แต่ **ไม่มี asset ไหนตั้ง cap** ใน YG-V3 · ถ้าจะ cap อีกแค่เพิ่ม `cap: N` ใน constants

## Progressive unlock (AVAILABLE_ASSETS)
Ch1–4 = 6 core · Ch5 = +oil (7) · Ch6 = +crypto, −oil (7) · Ch7 = ครบ 8

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

## Phase flow
`year_intro → invest → market_open → event → event_result → results → leaderboard` (Ch7: `… → results → final`)
> V4 จะแทรก state "submitted/locked" (hold ก่อน MC reveal) ระหว่าง invest → เฉลย

---

## Validation rules (สำคัญ — YG-V3)
- **Allocation step มี 2 จุดต้องตรงกัน:**
  1. `ALLOCATION_STEP` (client, InvestmentPanel — ปุ่ม +/-)
  2. Server validation ใน `app/api/players/portfolio/route.ts` — YG-V3 เปลี่ยนจาก hardcode `% 10` → `% ALLOCATION_STEP` (derive จาก constant) เพื่อไม่ให้หลุด sync อีก
- Weights ต้องรวม = 100% พอดี ก่อน submit (ไม่มี leftover cash — Cash เป็น asset ของตัวเอง)

---

## Pending เทียบกับ Requirement (Master Brief v3)

### A. Build to-do
| # | รายการ | สถานะ |
|---|--------|-------|
| A1 | allocation step (brief 1%) | ✅ **5%** (YG-V3) |
| A2 | Ch6 lock submission + surprise reveal | → **V4** (submit→hold→MC reveal) |
| A3 | content เต็มต่อ challenge (story + reference + teaching) | มี headline สั้น ยังไม่เต็ม |
| A4 | Day-5 debrief 3 example portfolios | ยังไม่มี (client decision B4) |
| A5 | Prize screen + CTA "เปิดบัญชี Dime!" | ยังไม่มี |
| A6 | FinalRanking benchmark | → **V5** (ตัด benchmark ออกหมด — decision เปลี่ยนเป็น remove) |
| A7 | filter Oil/Crypto ออกจาก EventDisplay รอบ lock | ✅ **done (YG-V3)** |
| A8 | Dry-run เต็ม 7 challenge | ยังไม่ทำ |
| A9 | EN pass ทุกจอ | ⏳ partial (YG-V3 แปล EventDisplay) → เหลือ sweep ใน **V6** |
| A10 | `bit.ly/marketwars` → URL YoungGen | → **V6** |
| A11 | neon dormant ใน compiled CSS | → **V6** cleanup |

### B. Client decisions
| # | ประเด็น | สถานะ |
|---|---------|-------|
| B1 | Ch7 "counts double" | ยังไม่คูณ (rank by มูลค่าตรงๆ) — ยืนยันภายหลัง |
| B2 | ภาษา | ✅ EN ล้วน (ยืนยัน) |
| B3 | MS Forms → แอปแทน | ใช้แอปเป็นตัวจริง |
| B4 | Day-5 debrief | ยังไม่เคาะ |
| B5 | allocation step | ✅ **5%** |
| B6 | **crypto cap 20%** | ✅ **ถอดออก (YG-V3)** — ⚠️ ต่างจาก Brief (≤20%) เป็น team decision |

---

## Version roadmap (V3 → V6)
| Tag | Scope | Deploy point |
|-----|-------|--------------|
| **YG-V3** ✅ | step 5% + server validation fix + crypto cap removed + submit final + EventDisplay unlock filter + EN (touched) | milestone ✓ |
| **YG-V4** | เอา timer ออกทั้งหมด + submit→hold→MC reveal (ทุกทีมเห็นผลพร้อมกัน) | structural — rollback point |
| **YG-V5** | final rework: ตัด Step Reward · champion reveal → final ranking · player screen masked ตอนลุ้นแชมป์ · ตัด benchmark | structural |
| **YG-V6** | 6-team display layout + full EN sweep + YoungGen QR link + dormant cleanup → dry-run | polish ก่อนงาน |

---

## Workflow (เหมือน market-wars)
1. Design Session → รอ "เริ่มได้" → code
2. ส่งไฟล์เต็มทั้งไฟล์ (ห้าม diff)
3. version header ทุกไฟล์: `// VERSION: YG-V{n} — ...`
4. build verify ก่อนส่ง: `npx tsc --noEmit` + `next build`
5. ปิด task: Task Summary + Tech Spec + FILE_REGISTRY + commit + tag
6. กติกากันพลาด: สี inline style เท่านั้น · ข้อความสว่างขั้นต่ำ `rgba(255,255,255,0.65)` · `parseFloat` ไม่ใช่ `Number()` · **แก้ rule ที่มี logic ทั้ง client+server ต้อง grep semantics (`% 10`, `multiple`) ไม่ใช่แค่ชื่อ constant**

## Changelog
| Version | วันที่ | สรุป |
|---------|-------|------|
| **YG-V0** | 01 ก.ค. 2026 | Fork จาก B20-stable → Portfolio Challenge. 8 asset + RETURN_TABLE 8×7 + ทุน 1M + 7 challenge + unlock/cap. Build ผ่าน. Deployed. |
| **YG-V1** | 02 ก.ค. 2026 | Re-theme "NextGen Royal" 29 ไฟล์. brand token · Join/Lobby/splash → EN · word-mark. Deployed + tag. |
| **YG-V2** | 02 ก.ค. 2026 | Fit-to-screen display — FitStage canvas 1280×720 + scale. Deployed + tag. |
| **YG-V3** | 02 ก.ค. 2026 | Config/correctness — allocation step 5% + **server validation fix** (`% 10` → `% ALLOCATION_STEP`) + **crypto 20% cap removed** + **submit final** (Edit button out) + EventDisplay filter unlocked assets only + EN (EventDisplay). 4 ไฟล์. Build ผ่าน (tsc + next build 12/12). ⚠️ crypto cap ต่างจาก Brief = team decision. |
