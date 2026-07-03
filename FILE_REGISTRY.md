# YoungGen Portfolio Challenge — File Registry

**Location:** วางที่ root ของ repo (`/FILE_REGISTRY.md`) — version control โดย git
**Last Updated:** YG-V5 (final rework — cut Awards step, real-teams-only ranking, mobile spoiler guard) — 03 Jul 2026
**Repo:** https://github.com/marketwars-game/youngen-portfolio-challenge
**Default branch:** `main`
**Latest tag:** `YG-V5`
**Forked from:** `market-wars @ B20-stable` (Dime! Kids Camp) — แชร์ engine/DB/routes, แตกต่างที่ content / phase flow / asset config

---

## ⚠️ ถ้า owner หรือชื่อ repo ต่างจากด้านบน
ทุก raw URL ในไฟล์นี้ขึ้นต้นด้วย `marketwars-game/youngen-portfolio-challenge` — ถ้าอ้นสร้าง repo ใต้ชื่อ/owner อื่น ให้ find-replace ทั้งไฟล์ด้วยคำสั่งเดียว:
```
sed -i 's|marketwars-game/youngen-portfolio-challenge|<OWNER>/<REPO>|g' FILE_REGISTRY.md
```
(repo ต้องเป็น **public** ถ้าอยากให้ Claude fetch raw URL ได้เอง เหมือน market-wars)

---

## หลักการ Registry-in-Repo
Registry นี้อยู่ใน repo — version control โดย git อัตโนมัติ:
- ทุกครั้งที่ tag (เช่น `YG-V1`) registry จะถูก snapshot ไปด้วย
- เพิ่ม/ลบไฟล์ → update registry → commit พร้อมกัน
- Claude fetch registry นี้จาก GitHub raw URL ได้ตรงๆ ไม่ต้องพึ่ง Project Knowledge

**Raw URL ของ registry นี้:**
```
https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/FILE_REGISTRY.md
```

**Raw URL format ทั่วไป:**
```
https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/<path>
```

---

## 🔧 ไฟล์ที่แก้ใน YG-V4 (timers removed + reveal phase — 7 ไฟล์: 6 แก้ + 1 ใหม่)
| ไฟล์ | แก้อะไร |
|------|---------|
| `lib/constants.ts` | `PHASE_TIMERS = {}` (timer หมด) · `invest.hasTimer:false` · เพิ่ม `PHASE_DISPLAY.reveal` · reveal เข้า STEP_GROUPS |
| `lib/game-engine.ts` | แทรก `'reveal'` หลัง `'invest'` ใน getPhaseOrder |
| `components/display/LiveNameBoard.tsx` | invest variant masked (✓ only) · reveal variant (bars ครบ) · legend unlocked assets · EN |
| `components/display/InvestDisplay.tsx` | header (masked semantics) |
| `components/display/RevealDisplay.tsx` 🆕 | ใหม่ — LiveNameBoard variant reveal |
| `app/display/[roomId]/page.tsx` | import RevealDisplay + branch `reveal` |
| `app/mc/[roomId]/page.tsx` | next button "🔓 Reveal Allocations" ตอน invest + EN challenge label |

## 🔧 ไฟล์ที่แก้ใน YG-V3 (config/correctness — 4 ไฟล์)
| ไฟล์ | แก้อะไร |
|------|---------|
| `lib/constants.ts` | ALLOCATION_STEP 10→5 · ลบ `cap: 20` crypto + description |
| `app/api/players/portfolio/route.ts` | validation `% 10` → `% ALLOCATION_STEP` + dynamic error msg + version header |
| `components/player/InvestmentPanel.tsx` | เอาปุ่ม Edit + `handleEdit` ออก (submit final) · crypto cap auto-clear (generic) |
| `components/display/EventDisplay.tsx` | `COMPANIES.map` → `getAvailableAssets(round).map` · TH→EN |

## 🔧 ไฟล์ที่แก้ใน YG-V0 (fork จาก B20-stable — 5 ไฟล์)

| ไฟล์ | แก้อะไร | Raw URL |
|------|---------|---------|
| `lib/constants.ts` | 8 asset class (EN) · RETURN_TABLE 8×7 · STARTING_MONEY 1,000,000 · TOTAL_ROUNDS 7 · AVAILABLE_ASSETS + getAvailableAssets + getAssetCap · EN brief/event/step/phase · quiz/chance/golden = dormant | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/lib/constants.ts |
| `lib/game-engine.ts` | `getPhaseOrder` ตัด research/research_reveal/chance_card → pure allocation loop | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/lib/game-engine.ts |
| `components/player/InvestmentPanel.tsx` | asset ตาม round (unlock) · cap crypto ≤20% · บังคับ total = 100% ก่อน submit | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/components/player/InvestmentPanel.tsx |
| `app/play/[roomId]/page.tsx` | ส่ง `round` เข้า InvestmentPanel | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/app/play/[roomId]/page.tsx |
| `app/api/players/route.ts` | ทีมเริ่มเงิน → STARTING_MONEY (1,000,000) | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/app/api/players/route.ts |

---

## App Routes (Next.js pages + API)

| ไฟล์ | หน้าที่ | Raw URL |
|------|--------|---------|
| Root Layout | wrapper หลักของทุกหน้า | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/app/layout.tsx |
| Landing / Join | หน้าแรก join / create | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/app/page.tsx |
| Player Game | จอทีม (มือถือ) — 🔧 YG-V0 | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/app/play/[roomId]/page.tsx |
| MC Entry | หน้า MC เลือก/สร้างห้อง | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/app/mc/page.tsx |
| MC Control | 🔧 YG-V4 — reveal button + EN label · จอ MC คุมเกม | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/app/mc/[roomId]/page.tsx |
| Display (Projector) | 🔧 YG-V4 — render reveal phase · จอใหญ่ | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/app/display/[roomId]/page.tsx |

### API Routes

| Endpoint | ทำอะไร | Raw URL |
|----------|--------|---------|
| Rooms | สร้าง/ปิดห้อง | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/app/api/rooms/route.ts |
| Auth PIN | ตรวจ PIN ของ MC | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/app/api/auth/pin/route.ts |
| Players | Join + reconnect (🔧 YG-V0: เงินเริ่ม 1,000,000) | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/app/api/players/route.ts |
| Player Portfolio | 🔧 YG-V3 — step validation `% ALLOCATION_STEP` (fix 5% reject) · Save allocation | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/app/api/players/portfolio/route.ts |
| Player Quiz | (dormant ใน YG-V0) | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/app/api/players/quiz/route.ts |
| Game Phase | Start/Next/End + auto-calc returns (loop COMPANIES → generic, ใช้ได้เลย) | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/app/api/game/phase/route.ts |
| Game Calculate | Standalone calculate (fallback) | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/app/api/game/calculate/route.ts |
| Health Check | Health endpoint | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/app/api/health/route.ts |

---

## lib/ — Game Logic & Config

| ไฟล์ | หน้าที่ | Raw URL |
|------|--------|---------|
| constants | 🔧 YG-V4 — timers off + reveal phase config · (YG-V3: step 5% + crypto cap removed) | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/lib/constants.ts |
| game-engine | 🔧 YG-V4 — insert reveal phase after invest · (YG-V0: pure allocation loop) | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/lib/game-engine.ts |
| supabase | Supabase client | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/lib/supabase.ts |
| awards | Awards (Smart Diversifier ไม่ใช้ใน V.0 แต่ยัง compile) | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/lib/awards.ts |
| ranking | comparator กลาง (จัดอันดับ) | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/lib/ranking.ts |
| sound | registry เสียง + PHASE_BGM | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/lib/sound.ts |
| debug | debug instrumentation (`?debug=1`) | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/lib/debug.ts |

---

## Player Components (มือถือ)

| ไฟล์ | หน้าที่ | Raw URL |
|------|--------|---------|
| InvestmentPanel | 🔧 YG-V3 — Edit button removed (submit final) · crypto cap auto-cleared · (YG-V0: allocation 8 asset + unlock + 100% gate) | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/components/player/InvestmentPanel.tsx |
| ResultsPanel | ผลรอบ (มือถือ) | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/components/player/ResultsPanel.tsx |
| LeaderboardView | อันดับ + ตัวเอง | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/components/player/LeaderboardView.tsx |
| FinalView | สรุปจบเกม (มือถือ) — 🔧 YG-V5 spoiler guard + ตัด award badge | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/components/player/FinalView.tsx |
| ResearchQuiz | 💤 dormant (phase ถูกตัด แต่ยัง import) | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/components/player/ResearchQuiz.tsx |
| ChanceCard | 💤 dormant | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/components/player/ChanceCard.tsx |
| MarketFight | 💤 dormant (ไม่ import) | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/components/player/MarketFight.tsx |

---

## Display Components (Projector)

| ไฟล์ | หน้าที่ | Raw URL |
|------|--------|---------|
| DisplayHeader | header (phase progress + challenge) | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/components/display/DisplayHeader.tsx |
| LobbyDisplay | lobby (QR + teams) | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/components/display/LobbyDisplay.tsx |
| YearIntroDisplay | challenge brief splash | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/components/display/YearIntroDisplay.tsx |
| MarketOpenDisplay | market-open splash | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/components/display/MarketOpenDisplay.tsx |
| InvestDisplay | 🔧 YG-V4 — masked submit wall (LiveNameBoard invest, no bars) | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/components/display/InvestDisplay.tsx |
| RevealDisplay 🆕 | 🔧 YG-V4 — reveal phase: all teams' allocations together (LiveNameBoard reveal) | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/components/display/RevealDisplay.tsx |
| EventDisplay | 🔧 YG-V3 — filter to unlocked assets (no phantom 0% oil/crypto) + EN · (event + period returns) | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/components/display/EventDisplay.tsx |
| ResultsDisplay | heatmap ผลรอบ | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/components/display/ResultsDisplay.tsx |
| LeaderboardDisplay | podium + ranking (racing) | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/components/display/LeaderboardDisplay.tsx |
| FinalDisplay | สรุปจบเกม (router **3-step**: final→podium→ranking) — 🔧 YG-V5 | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/components/display/FinalDisplay.tsx |
| FinalPodium | เฉลย 3→2→1 + confetti — 🔧 YG-V5 ตัด award pill | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/components/display/FinalPodium.tsx |
| FinalAwards | 💤 **dormant** ตั้งแต่ YG-V5 (ไม่ import — Awards step ถูกตัด) | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/components/display/FinalAwards.tsx |
| FinalRanking | อันดับทีมจริงล้วน — 🔧 YG-V5 ตัด benchmark + Smart Diversifier (คง 🎯/🧺) | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/components/display/FinalRanking.tsx |
| LiveNameBoard | 🔧 YG-V4 — invest masked + reveal variant (all allocations) | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/components/display/LiveNameBoard.tsx |
| LiveNameFeed | research sidebar feed | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/components/display/LiveNameFeed.tsx |
| AnimatedBackdrop | backdrop (particle + grid + glow) | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/components/display/AnimatedBackdrop.tsx |
| ConfettiCanvas | confetti | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/components/display/ConfettiCanvas.tsx |
| SoundGate | ปลดล็อก autoplay | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/components/display/SoundGate.tsx |
| FitStage | 🆕 YG-V2 canvas 1280×720 + scale (fit-to-screen wrapper ทุก phase) | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/components/display/FitStage.tsx |
| ResearchDisplay | 💤 dormant | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/components/display/ResearchDisplay.tsx |
| QuizSpeedWall | 💤 dormant | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/components/display/QuizSpeedWall.tsx |
| ChanceCardDisplay | 💤 dormant | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/components/display/ChanceCardDisplay.tsx |
| FightDisplay | 💤 dormant (ไม่ import) | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/components/display/FightDisplay.tsx |

---

## MC Components

| ไฟล์ | หน้าที่ | Raw URL |
|------|--------|---------|
| ResultsMC | สรุปผลรอบ | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/components/mc/ResultsMC.tsx |
| LeaderboardMC | ดูอันดับทุกทีม | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/components/mc/LeaderboardMC.tsx |
| FinalMC | จอ MC ปิดเกม — 🔧 YG-V5 script 2-step + ตัด awards box | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/components/mc/FinalMC.tsx |
| ResearchMC | 💤 dormant | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/components/mc/ResearchMC.tsx |

---

## Common / Hooks

| ไฟล์ | หน้าที่ | Raw URL |
|------|--------|---------|
| Bi | bilingual renderer (ไม่ใช้ใน V.0 EN-only แต่ยัง import) | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/components/common/Bi.tsx |
| DebugPanel | debug overlay (`?debug=1`) | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/components/debug/DebugPanel.tsx |
| useDisplaySound | HTMLAudio manager | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/hooks/useDisplaySound.ts |

---

## เอกสาร (docs/)

| ไฟล์ | หน้าที่ |
|------|--------|
| `docs/YoungGen_TechSpec_v4.md` | Tech Spec (สเปกหลัก — current) |
| `docs/README_YG_V0.md` | คู่มือรัน demo + deploy |
| `docs/schema.sql` | Supabase schema (สำหรับ project แยกตอน deploy จริง) |

> 💤 dormant = ไฟล์จาก market-wars ที่ phase ถูกตัดใน V.0 — ยังอยู่เพื่อให้ import ไม่พัง ไม่ render จริง ลบได้ตอน cleanup V.1 (ต้องตาม import ออกด้วย)
