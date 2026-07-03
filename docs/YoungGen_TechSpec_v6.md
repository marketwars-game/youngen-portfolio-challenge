# YoungGen Portfolio Challenge — Tech Spec

**Version:** YG-V6 (4–8 team display layout · full EN sweep · rejoin QR at Challenge Brief · End & New Room · bit.ly/portchallenge)
**Last Updated:** 03 Jul 2026
**งาน:** KKP YoungGen 2026 · 6–10 ก.ค. 2026 · ทีมนักเรียน ม.ปลาย (ม.4–6) · **6 ทีม**
**Fork จาก:** `market-wars @ B20-stable` (Dime! Kids Camp) — แชร์ engine/DB/routes, แตกต่างที่ content / phase flow / asset config
**เกี่ยวข้อง:** Dime! Kids Camp ใช้ repo `market-wars` เดิม (ไม่ถูกแตะ) — คนละโปรเจกต์ อย่ารวม task tracking

## Deployment
- **Repo:** https://github.com/marketwars-game/youngen-portfolio-challenge (public) · tags: `YG-V0` → … → `YG-V5` → **`YG-V6`**
- **Vercel:** project แยก — auto-deploy on push to `main`
- **Supabase:** project `youngen` แยก · schema `docs/schema.sql` (✅ verified) · **legacy anon key** (`eyJ...`)
- **Env (Vercel):** `NEXT_PUBLIC_SUPABASE_URL` (ไม่มี `/` ท้าย) · `NEXT_PUBLIC_SUPABASE_ANON_KEY` (legacy) · `MC_PIN`

---

## Design หลัก (ล็อกแล้ว — อัปเดต YG-V4)
| # | หัวข้อ | ค่า |
|---|--------|-----|
| 1 | ทีม | 1 อุปกรณ์ = 1 ทีม · **6 ทีม** · ตั้งชื่อทีมเอง · reconnect ด้วยชื่อเดิม |
| 2 | อันดับ | มูลค่าพอร์ตสุดท้าย (Ch7 "double" ตัดทิ้ง — ยืนยันกับทีม Wealth ภายหลัง) |
| 3 | ภาษา | **EN ล้วน (จอน้องๆ)** · ✅ **YG-V6** EN sweep ครบทุกจอ Display + player mobile · MC-facing คงไทย (bilingual) ตามที่เคาะ · ฿ คงไว้ |
| 4 | Submit lock + reveal | ✅ **YG-V4** — submit → hold (จอ masked) → MC กด Reveal → ทุกทีมเห็นพร้อมกัน (phase `reveal` ทุกรอบ) · content twist Ch6 (hack) = งาน content แยก |
| 5 | Smart Diversifier | ตัดออก (เหลือ Top-3 by value) |
| 6 | Multi-day | state ค้างใน Supabase · **ห้ามกด end ระหว่างวัน** (ห้องคง `playing` → team rejoin ด้วยชื่อเดิม) · ✅ **YG-V6** rejoin QR corner card ที่ Challenge Brief (โผล่ต้นแต่ละ challenge = ต้นวัน) |
| 7 | Allocation step | **5%** (YG-V3) |
| 8 | ทุน | ฿1,000,000 · 7 challenge |
| 9 | Submit | **Final — แก้ไม่ได้หลัง submit** (YG-V3) |
| 10 | Timer | **ไม่มี — เล่นไม่จำกัดเวลา MC คุม pacing** (YG-V4; `PHASE_TIMERS = {}`) |

## 8 Asset Classes
`cash` · `bonds` · `thai_eq` · `global_eq` · `mutual` · `gold` · `oil` (Ch5+) · `crypto` (Ch6+, **ไม่มีเพดาน** — YG-V3)
> per-asset cap mechanism generic (`getAssetCap`) แต่ไม่มี asset ไหนตั้ง cap

## Progressive unlock
Ch1–4 = 6 core · Ch5 = +oil (7) · Ch6 = +crypto, −oil (7) · Ch7 = 8

## RETURN_TABLE (8 × 7, %)
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

## Phase flow (YG-V4)
`year_intro → invest → reveal → market_open → event → event_result → results → leaderboard` (Ch7: `… → results → final`)
- **`reveal` (ใหม่ V4):** อยู่ระหว่าง invest → market · จอ display โชว์ allocation ทุกทีมพร้อมกัน · MC คุมด้วยปุ่ม next ("Reveal Allocations" → "Continue to Market")
- ตัด phase quiz/research/chance
- **`current_phase text`** — เพิ่ม `'reveal'` ไม่ต้อง migrate

## Reveal flow (YG-V4) — กลไก
- **invest:** ทีม submit · `LiveNameBoard` variant `invest` = **masked** (โชว์แค่ ✓ ใคร submit, ไม่มี %) · MC เห็น `submittedCount/6`
- **MC กด "🔓 Reveal Allocations"** → phase `reveal`
- **reveal:** `LiveNameBoard` variant `reveal` = โชว์ allocation bar ทุกทีม + legend (unlocked assets) · player เห็น `PHASE_DISPLAY.reveal.playerMessage` ("Allocations are on the big screen — watch together")
- **MC กด "Next → Market Open"** → เล่นต่อ
- calc ผลตอบแทนยังอยู่ที่ `results` — reveal ไม่กระทบ

## Final flow (YG-V5) — 3 step (เดิม 4)
`final (suspense) → final_podium → final_ranking` — **ตัด `final_awards` (Step Reward) ออก**
- **`final` / `final_podium`:** MC ปั่น "ใครคือแชมป์?" → กดเฉลย → podium ไล่ #3→#2→#1 (+confetti). จอมือถือ **hold** ("Watch the big screen") กันสปอยล์ — เห็นผลตัวเองตอน `final_ranking` เท่านั้น
- **`final_ranking`:** อันดับ **ทีมจริงล้วน** — ตัด benchmark ghost (bm_best/savings/equal/worst) + legend กรอบฟ้า · ตัด 🏅 Smart Diversifier (badge/ไฮไลต์/legend) · **คง 🎯/🧺 strategy tags** (บอกวิธีเล่นของทีมจริง ไม่ใช่ award)
- **Smart Diversifier เอาออกทุกจอในหน้าจบ:** FinalRanking (badge/legend), FinalPodium (pill "ชนะ 2 รางวัล" — เดิม bug นับผิดใน YG), FinalView มือถือ (award badge), FinalMC (SPECIAL AWARDS box + script "② Awards")
- **`final_awards` phase = orphan** (ไม่มีปุ่มไป · FinalAwards.tsx = dormant ไม่ import) · `current_phase text` → ไม่ต้อง migrate

## Timer removal (YG-V4)
`PHASE_TIMERS = {}` → `timerDuration = PHASE_TIMERS[phase] || 0` = 0 ทุก phase → timer UI (guard `timerDuration > 0`) + countdown sfx (guard `timeLeft > 0`) เป็น no-op ทุกจอ · ไม่มี auto-advance (MC กด next เอง) → ไม่ต้องรื้อโค้ด timer (เหลือ inert)

---

## Validation rules (สำคัญ)
- **Allocation step 2 จุดต้องตรงกัน:** `ALLOCATION_STEP` (client) + `portfolio/route.ts` server (`% ALLOCATION_STEP`, YG-V3 fix จาก hardcode `% 10`)
- Weights รวม = 100% พอดี ก่อน submit

---

## Pending เทียบกับ Requirement (Master Brief v3)

### A. Build to-do
| # | รายการ | สถานะ |
|---|--------|-------|
| A1 | allocation step | ✅ 5% (V3) |
| A2 | Ch6 lock submission + surprise reveal | ✅ **lock+reveal mechanic done (V4)** · content twist (hack $2.3B) = ยังไม่ทำ (อยู่ A3) |
| A3 | content เต็มต่อ challenge | มี headline สั้น ยังไม่เต็ม |
| A4 | Day-5 debrief 3 example portfolios | ยังไม่มี (B4) |
| A5 | Prize screen + CTA Dime! | ยังไม่มี |
| A6 | FinalRanking benchmark | ✅ **done (V5)** — ตัด benchmark ghost + Smart Diversifier; เหลือทีมจริงล้วน |
| A7 | filter Oil/Crypto EventDisplay | ✅ done (V3) |
| A8 | Dry-run เต็ม 7 challenge | ยังไม่ทำ |
| A9 | EN pass ทุกจอ | ⏳ partial (V3 EventDisplay · V4 LiveNameBoard/reveal/MC labels) → sweep ที่เหลือ **V6** |
| A10 | `bit.ly/marketwars` → URL YoungGen | → **V6** |
| A11 | neon dormant CSS | → **V6** |

### B. Client decisions
| # | ประเด็น | สถานะ |
|---|---------|-------|
| B1 | Ch7 "counts double" | ยังไม่คูณ — ยืนยันภายหลัง |
| B2 | ภาษา | ✅ EN ล้วน |
| B3 | MS Forms → แอป | ใช้แอป |
| B4 | Day-5 debrief | ยังไม่เคาะ |
| B5 | allocation step | ✅ 5% |
| B6 | crypto cap 20% | ✅ ถอดออก (V3) — ⚠️ ต่างจาก Brief |

---

## Version roadmap
| Tag | Scope | สถานะ |
|-----|-------|-------|
| **YG-V3** | step 5% + validation fix + crypto cap removed + submit final + EventDisplay filter + EN(touched) | ✅ |
| **YG-V4** | เอา timer ออก + submit→hold→MC reveal (ทุกทีมพร้อมกัน) | ✅ **done + tested** |
| **YG-V5** | final rework: ตัด Awards step · champion reveal → final ranking · มือถือ spoiler guard · ตัด benchmark + Smart Diversifier | ✅ **done + build ผ่าน** |
| **YG-V6** | 4–8 team layout (Leaderboard/LiveNameBoard/Results/**FinalRanking**) · full EN sweep · rejoin QR (Challenge Brief) · End & New Room · bit.ly/portchallenge · **FitStage h-full fix** (จอ final) | ✅ **done + build ผ่าน** |
| **dry-run** | เล่นเต็ม 7 challenge บน Vercel (3 จอ) ก่อน 6 ก.ค. | ถัดไป (ทีมทดสอบ) |

---

## Workflow
1. Design Session → รอ "เริ่มได้" → code · 2. ส่งไฟล์เต็ม (ห้าม diff) · 3. version header `YG-V{n}` ทุกไฟล์ที่แตะ · 4. build verify (`tsc` + `next build`) · 5. ปิด task: Task Summary + Tech Spec + FILE_REGISTRY + commit + tag
6. กันพลาด: สี inline style · ข้อความสว่างขั้นต่ำ `rgba(255,255,255,0.65)` · `parseFloat` ไม่ใช่ `Number()` · **rule ที่มี logic ทั้ง client+server → grep semantics (`% 10`) ไม่ใช่แค่ชื่อ constant** · **bump header ทุกไฟล์ที่แตะ** · **จอที่ render ใน FitStage ต้องใช้ `h-full` ไม่ใช่ `h-screen`** (FitStage=box 720 คงที่ · `h-screen`=100vh → ล้นบน viewport >720 / projector 1080p) · **responsive rows วัดความสูงด้วย ResizeObserver ไม่ hardcode px**

## Changelog
| Version | วันที่ | สรุป |
|---------|-------|------|
| **YG-V0** | 01 ก.ค. | Fork → Portfolio Challenge (8 asset · 8×7 returns · 1M · 7 challenge · unlock). Deployed. |
| **YG-V1** | 02 ก.ค. | Re-theme NextGen Royal 29 ไฟล์. Deployed + tag. |
| **YG-V2** | 02 ก.ค. | Fit-to-screen (FitStage). Deployed + tag. |
| **YG-V3** | 02 ก.ค. | step 5% + server validation fix + crypto cap removed + submit final + EventDisplay filter + EN(EventDisplay). 4 ไฟล์. |
| **YG-V4** | 02 ก.ค. | **เอา timer ออกทั้งหมด** (`PHASE_TIMERS={}`) + **phase `reveal` ใหม่** (masked submit → MC reveal, ทุกทีมพร้อมกัน). 7 ไฟล์ (6 แก้ + RevealDisplay ใหม่). ไม่มี DB migration. Build ผ่าน. Tested. |
| **YG-V5** | 03 ก.ค. | **final rework** — ตัด Awards step (router 4→3) · FinalRanking ทีมจริงล้วน (ตัด benchmark + Smart Diversifier, คง 🎯/🧺) · มือถือ spoiler guard (hold ตอน podium) · Smart Diversifier ออกทุกจอจบเกม (Podium/View/MC). 7 ไฟล์. ไม่มี DB migration. Build ผ่าน (tsc + next build 12/12). |
| **YG-V6** | 03 ก.ค. | **4–8 team layout** (Leaderboard→rows+money bar · LiveNameBoard→invest ✓/reveal allocation bar+🎯🧺 · Results→diverging bars + fixed amount col + Best/Worst guard · **FinalRanking→rows+money bar+medals+🎯🧺+return%+money**) · **full EN sweep** จอน้องๆ + "Y E A R"→"CHALLENGE" + player year_intro list→YG steps + Allocate ใช้ money ปัจจุบัน · **rejoin QR** ที่ Challenge Brief · **End & New Room** MC final · bit.ly→`bit.ly/portchallenge` · ลบ dead `final_awards` · **FitStage fix:** จอ final `h-screen`→`h-full` (กันล้นบน viewport >720 / projector 1080p). **15 ไฟล์**. ไม่มี DB migration. Build ผ่าน (tsc + next build 12/12). งานสุดท้ายของ YoungGen. |
