# YoungGen Portfolio Challenge — Tech Spec

**Version:** YG-V2 (re-themed "NextGen Royal" + fit-to-screen display · **DEPLOYED & VERIFIED บน Vercel**)
**Last Updated:** 02 Jul 2026
**งาน:** KKP YoungGen 2026 · 6–10 ก.ค. 2026 · ทีมนักเรียน ม.ปลาย (ม.4–6)
**Fork จาก:** `market-wars @ B20-stable` (Dime! Kids Camp) — แชร์ engine/DB/routes, แตกต่างที่ content / phase flow / asset config
**เกี่ยวข้อง:** Dime! Kids Camp ใช้ repo `market-wars` เดิม (ไม่ถูกแตะ) — คนละโปรเจกต์ อย่ารวม task tracking

## Deployment (YG-V2)
- **Repo:** https://github.com/marketwars-game/youngen-portfolio-challenge (public) · latest tag `YG-V2` (`YG-V0` MVP → `YG-V1` re-theme → `YG-V2` display fit)
- **Vercel:** project แยก (คนละอันกับ market-wars) — auto-deploy on push to `main`
- **Supabase:** project `youngen` แยก (คนละ DB กับ Kids) — schema จาก `docs/schema.sql` (✅ verified ตรง DB จริง 100%) · ใช้ **legacy anon key** (`eyJ...`) ไม่ใช่ publishable ตัวใหม่
- **Env (Vercel):** `NEXT_PUBLIC_SUPABASE_URL` (ไม่มี `/` ต่อท้าย) · `NEXT_PUBLIC_SUPABASE_ANON_KEY` (legacy anon) · `MC_PIN`
- **สถานะ:** create room / join / lobby / MC เห็น player ✅ — ทำงานครบ (ยัง dry-run เต็ม 7 challenge ให้ครบก่อนวันงาน)

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
| 3 | ภาษา | Join/Lobby/splash + branding = **EN (YG-V1)** · จอ gameplay (results/leaderboard/final ฯลฯ) ยังมี TH ปน — รอ EN pass |
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

## UI / Branding — "NextGen Royal" (YG-V1)
Re-theme ทั้ง 3 จอ (player / mc / display) จากธีมเด็ก Kids-Camp (neon เขียว/ฟ้า) → แบรนด์ YoungGen ม่วง/ชมพู เพื่อแยกภาพลักษณ์จาก Kids Camp

**สีเก็บเป็น brand token — แหล่งเดียวใน `app/globals.css` `:root`** แล้ว map เข้า `tailwind.config.ts` (แก้ธีมทั้งเกมที่เดียว)
| Token (CSS var) | ค่า | เดิม (Kids) | ใช้ |
|---|---|---|---|
| `--mw-base` | `#12102E` | `#0D1117` | พื้นหลัง (indigo) |
| `--mw-surface` | `#211E4A` | `#161B22` | การ์ด |
| `--mw-border` | `#37326B` | `#30363D` | ขอบ |
| `--mw-violet` / `-deep` | `#9B82FF` / `#8A6BFF` | `#00FFB2` (green) | **primary / MARKET** |
| `--mw-rose` | `#D57BA8` | `#00D4FF` (cyan) | **secondary / WARS** |

+ rgb-triple vars (`--mw-violet-rgb: 155,130,255` · `--mw-rose-rgb: 213,123,168`) สำหรับ `rgba()` tint
**หลักการ:** เปลี่ยนเฉพาะสี **identity/แบรนด์** — คงสี **data-semantics** (gain `#22C55E` เขียว · loss `#EF4444` แดง · gold/podium) ไว้ ห้ามกวาด
**Word-mark:** คง **MARKET WARS** (MARKET=violet, WARS=rose) + subtitle 2 บรรทัด `PORTFOLIO CHALLENGE` / `KKP YoungGen Edition` · tab title = `MARKET WARS · Portfolio Challenge — KKP YoungGen Edition`
**Join page + Lobby + splash = EN** · หัวจอ display = `Challenge N / 7` (เดิม "ปีที่")

**Header convention (ทุกไฟล์ที่แตะ):**
```
// FILE: <path> — <role>
// VERSION: YG-V{n} — <change>
// LAST MODIFIED: <date>
// HISTORY: market-wars B1..B20 (kids-camp lineage — see market-wars repo) | YG-V0 fork | YG-V{n} <summary>
```

## Display scaling — FitStage fit-to-screen (YG-V2)
**ปัญหาเดิม (B15-v2 CSS zoom):** `zoom = min(innerWidth/1280, 1.5)` ใส่บนกล่อง `h-screen` → พอ `zoom > 1` (จอกว้าง > 1280) กล่องสูงเกิน viewport → เนื้อหา (เช่น players ใน Lobby) หลุดใต้จอ ต้อง scroll · เป๊ะเฉพาะ projector 1920×1080 พอดีเท่านั้น

**แก้:** `components/display/FitStage.tsx` — วาง canvas **ขนาดคงที่ 1280×720** จัดกลาง viewport แล้ว `transform: scale()` (letterbox)
```
scale = min( innerWidth / 1280 , innerHeight / 720 )   // พอดีจอเสมอ ทุก aspect · 1920×1080 = 1.5 เท่าเดิม
```
display page ห่อทุก phase ด้วย `<FitStage scale={...}>` · Lobby / YearIntro / MarketOpen ถอด `zoom` prop ทิ้ง (กล่องในเป็น `w-full h-full`)
> กลไกนี้ **port กลับ market-wars ได้** (โครง display เหมือนกัน) — ดู `docs/BACKPORT_FitStage_to_KidsCamp.md`

---

## Pending เทียบกับ Requirement (Master Brief v3) — เช็คก่อน 6 ก.ค.

### A. ยังต้องสร้าง (build to-do)
| # | รายการจาก brief | สถานะ V.0 |
|---|-----------------|-----------|
| A1 | "any whole percentage" — allocation step 1% | ตอนนี้ 10% |
| A2 | Ch6 **lock submission + surprise reveal** (hack $2.3B หลังล็อกน้ำหนัก) | simplify (เล่นเป็นรอบปกติ) |
| A3 | content เต็มต่อ challenge: story + Real-World Reference + Teaching Focus + Lesson (บนจอ brief/result + MC script) | มี headline สั้น ยังไม่เต็ม |
| A4 | **Day-5 debrief: 3 example portfolios** (Diversifier +20.2% / All-Cash +13.3% / Chaser −23.2% + ตารางรายปี + 4 habits) | ❌ ยังไม่มี (FinalRanking มี benchmark คนละชุด) — ดู B4 |
| A5 | Prize screen (Top Performance Top 3) + CTA "เปิดบัญชี Dime!" ตอนจบ | ยังไม่มี |
| A6 | FinalRanking benchmark ghost → คำนวณใหม่ 8 asset / 7 challenge (ref `piggybank` no-op) | ค้าง |
| A7 | (optional) filter Oil/Crypto ออกจาก EventDisplay ในรอบที่ lock (ตอนนี้โชว์ 0%) | ค้าง |
| A8 | Dry-run เต็ม 7 challenge ก่อนงาน | ยังไม่ทำ |
| A9 | **EN pass บนจอ gameplay** — TH ที่เหลือ (ResultsDisplay/LeaderboardDisplay/FinalView/ResultsPanel/EventDisplay ฯลฯ) → EN (YG-V1 แปลเฉพาะ join/lobby/branding) | ค้าง |
| A10 | **`bit.ly/marketwars`** ใน LobbyDisplay (2 จุด) ยังชี้ short link Kids Camp → เปลี่ยนเป็น URL deploy YoungGen | ค้าง |
| A11 | neon เดิมใน compiled CSS (2 utility) มาจากไฟล์ dormant — ลบตอน cleanup | ค้าง (ไม่ render จริง) |

### B. ต้องตัดสินใจกับทีม Wealth (client decisions — ยังไม่ยืนยัน)
| # | ประเด็น | สถานะปัจจุบัน / ที่ต้องถาม |
|---|---------|---------------------------|
| B1 | **Ch7 "counts double"** — brief เขียนนับสองเท่า แต่ตาราง example ของเขาเอง compound แบบไม่คูณ | ตอนนี้ = rank by มูลค่าพอร์ตตรงๆ (ไม่คูณ) → ยืนยัน/เปลี่ยน |
| B2 | **ภาษา** — EN / TH / สองภาษา | เลือก EN เพื่อความเร็ว → ยืนยันว่าไม่ต้อง TH? |
| B3 | **MS Forms** — brief สมมติ submit ผ่าน Microsoft Form + leaderboard มือ | แอปแทนทั้งคู่อัตโนมัติ → ยืนยันใช้แอปเป็นตัวจริง? |
| B4 | **Day-5 debrief (A4)** — ทำในแอป หรือ facilitator เล่าจากเอกสาร? | ยังไม่เคาะ |
| B5 | **allocation step** — 1% ตาม brief เป๊ะ หรือ 5%/10% (เด็กกรอกเร็วกว่า) | ตอนนี้ 10% |

> หมายเหตุ: deploy (GitHub + Vercel + Supabase แยก) — ✅ **ทำแล้ว** (ดู section Deployment)

## Convention version / tag
ใช้ `YG-V0`, `YG-V1`, … (แยกจากสาย kids `B{n}`) สำหรับ commit/tag ทุกครั้ง

## Workflow (เหมือน market-wars)
1. Design Session ก่อน → รอ "เริ่มได้" → ค่อย code
2. แก้ code = ส่งไฟล์เต็มทั้งไฟล์ (ห้าม diff)
3. version header ทุกไฟล์: `// VERSION: YG-V{n} — ...`
4. build verify ก่อนส่ง: `npx tsc --noEmit` + `next build`
5. ปิด task: Task Summary + update Tech Spec + FILE_REGISTRY + commit + push + tag `YG-V{n}`
6. **กติกากันพลาด:** สีใช้ inline style เท่านั้น (ห้าม `text-[#hex]` — purge ตอน build) · ข้อความสว่างขั้นต่ำ `rgba(255,255,255,0.65)` · CSS zoom ใช้ `useEffect+useState` · `parseFloat` ไม่ใช่ `Number()` กับ field numeric จาก Supabase

## Learnings (YG-V0 deploy)
- **schema.sql = reconstruct จากโค้ด ไม่ใช่ export จริง** → เคยตก `joined_at` (MC/play สั่ง `.order('joined_at')` แต่ผมตั้งชื่อ `created_at`) ทำให้ MC ไม่เห็น player. แก้แล้ว + เทียบ `information_schema` กับ DB จริง → `docs/schema.sql` ตรง 100% แล้ว (มี action/duel_* dormant ครบ, `duel_money_change` = numeric)
- **Supabase API keys ใหม่:** ต้องใช้แท็บ **Legacy anon** (`eyJ...`) — โค้ดไม่รองรับ `sb_publishable_...`
- **Vercel `NEXT_PUBLIC_*` bake ตอน build** → แก้ env แล้วต้อง **Redeploy** · URL ห้ามมี `/` ต่อท้าย (ไม่งั้น "Invalid path specified in request URL")
- **เดโม local ใช้ DB เดิมได้** (asset id คนละชุด) · **deploy จริงใช้ DB แยก** (ต้องรัน schema.sql)
- **(YG-V1) hex มี 2 case** — color sweep ต้องครอบทั้ง `#00FFB2` และ `#00ffb2` · **`text-[#hex]` อย่าแปลงเป็น `text-base`** (ชนกับ utility font-size ของ Tailwind → ใช้ `text-[color:var(--mw-base)]`) · `text-[var(--x)]` กำกวมสำหรับ text/border → ใส่ hint `[color:var(...)]`
- **(YG-V2) CSS `zoom` บน `h-screen` = กับดัก** — พอ zoom>1 กล่องสูงเกิน viewport เนื้อหาหลุด ต้อง scroll (เป๊ะเฉพาะจอ 16:9 ที่ design-height×zoom = viewport พอดี) → ใช้ **canvas ขนาดคงที่ + `transform: scale(min(w/1280,h/720))`** แทน ทนทานทุกจอ
- **แก้ header comment ด้วย sed ระวังกินช่องว่าง** — `s/ marker//g` เผลอลบ space ใน `import{`/`export default` ทั้งไฟล์ → ใช้ str_replace/python แก้ header แทน sed ที่ match กว้าง

---

## Changelog
| Version | วันที่ | สรุป |
|---------|-------|------|
| **YG-V0** | 01 ก.ค. 2026 | Fork จาก market-wars B20-stable → YoungGen Portfolio Challenge. แก้ 5 ไฟล์ (constants 8 asset + RETURN_TABLE 8×7 + ทุน 1M + 7 challenge + unlock/cap · game-engine pure allocation loop · InvestmentPanel 100% gate · play page round prop · players route เงินเริ่ม 1M). Build ผ่าน (tsc + next build 12/12). Return engine verified (all-cash = ฿1,132,683 ตรง PDF). **Deployed:** GitHub public + Vercel + Supabase `youngen` แยก. Schema verified ตรง DB จริง 100%. |
| **YG-V1** | 02 ก.ค. 2026 | Re-theme "NextGen Royal" ทั้ง 3 จอ — 29 ไฟล์. brand token ใน globals.css `:root` + tailwind map · กวาดสี identity (green→violet, cyan→rose, base→indigo) คงสี data-semantics · word-mark MARKET WARS + subtitle Portfolio Challenge / KKP YoungGen Edition · Join/Lobby/splash → EN · header "Challenge N/7" · FinalPodium "MARKET WARS Champion" + แก้บั๊ก "6 ปี"→"7 challenges" · header convention. Build ผ่าน (tsc + next build 12/12). **Deployed + tag YG-V1.** |
| **YG-V2** | 02 ก.ค. 2026 | Fit-to-screen display — 5 ไฟล์ (+`components/display/FitStage.tsx` ใหม่). เลิกใช้ CSS zoom บน h-screen (เนื้อหาหลุดจอเมื่อ aspect ≠ 16:9) → canvas 1280×720 + `transform:scale(min(w/1280,h/720))` letterbox พอดีทุกจอ · display page ห่อทุก phase ด้วย FitStage · Lobby/YearIntro/MarketOpen ถอด zoom prop. Build ผ่าน (tsc + next build 12/12). **Portable → market-wars** (ดู BACKPORT doc). **Deployed + tag YG-V2.** |
