# YoungGen Portfolio Challenge — File Registry

**Location:** วางที่ root ของ repo (`/FILE_REGISTRY.md`) — version control โดย git
**Last Updated:** YG-V2 (re-theme + fit-to-screen) — 02 Jul 2026
**Repo:** https://github.com/marketwars-game/youngen-portfolio-challenge
**Default branch:** `main`
**Latest tag:** `YG-V2`
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
| MC Control | จอ MC คุมเกม | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/app/mc/[roomId]/page.tsx |
| Display (Projector) | จอใหญ่ | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/app/display/[roomId]/page.tsx |

### API Routes

| Endpoint | ทำอะไร | Raw URL |
|----------|--------|---------|
| Rooms | สร้าง/ปิดห้อง | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/app/api/rooms/route.ts |
| Auth PIN | ตรวจ PIN ของ MC | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/app/api/auth/pin/route.ts |
| Players | Join + reconnect (🔧 YG-V0: เงินเริ่ม 1,000,000) | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/app/api/players/route.ts |
| Player Portfolio | Save allocation | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/app/api/players/portfolio/route.ts |
| Player Quiz | (dormant ใน YG-V0) | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/app/api/players/quiz/route.ts |
| Game Phase | Start/Next/End + auto-calc returns (loop COMPANIES → generic, ใช้ได้เลย) | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/app/api/game/phase/route.ts |
| Game Calculate | Standalone calculate (fallback) | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/app/api/game/calculate/route.ts |
| Health Check | Health endpoint | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/app/api/health/route.ts |

---

## lib/ — Game Logic & Config

| ไฟล์ | หน้าที่ | Raw URL |
|------|--------|---------|
| constants | 🔧 YG-V0 — asset classes / RETURN_TABLE 8×7 / unlock / cap / content | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/lib/constants.ts |
| game-engine | 🔧 YG-V0 — phase state machine (pure allocation loop) | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/lib/game-engine.ts |
| supabase | Supabase client | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/lib/supabase.ts |
| awards | Awards (Smart Diversifier ไม่ใช้ใน V.0 แต่ยัง compile) | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/lib/awards.ts |
| ranking | comparator กลาง (จัดอันดับ) | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/lib/ranking.ts |
| sound | registry เสียง + PHASE_BGM | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/lib/sound.ts |
| debug | debug instrumentation (`?debug=1`) | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/lib/debug.ts |

---

## Player Components (มือถือ)

| ไฟล์ | หน้าที่ | Raw URL |
|------|--------|---------|
| InvestmentPanel | 🔧 YG-V0 — allocation 8 asset + unlock + cap + 100% gate | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/components/player/InvestmentPanel.tsx |
| ResultsPanel | ผลรอบ (มือถือ) | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/components/player/ResultsPanel.tsx |
| LeaderboardView | อันดับ + ตัวเอง | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/components/player/LeaderboardView.tsx |
| FinalView | สรุป + รางวัล | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/components/player/FinalView.tsx |
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
| InvestDisplay | จอลงทุน (LiveNameBoard) | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/components/display/InvestDisplay.tsx |
| EventDisplay | event + period returns | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/components/display/EventDisplay.tsx |
| ResultsDisplay | heatmap ผลรอบ | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/components/display/ResultsDisplay.tsx |
| LeaderboardDisplay | podium + ranking (racing) | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/components/display/LeaderboardDisplay.tsx |
| FinalDisplay | สรุปจบเกม (router 4-step) | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/components/display/FinalDisplay.tsx |
| FinalPodium | เฉลย 3→2→1 + confetti | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/components/display/FinalPodium.tsx |
| FinalAwards | รางวัล (Smart Diversifier ไม่ใช้ใน V.0) | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/components/display/FinalAwards.tsx |
| FinalRanking | อันดับทุกทีม + benchmark (⚠️ ref `piggybank` no-op ใน V.0) | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/components/display/FinalRanking.tsx |
| LiveNameBoard | wall ทุกทีม (invest/chance) | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/components/display/LiveNameBoard.tsx |
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
| FinalMC | สรุปจบเกม | https://raw.githubusercontent.com/marketwars-game/youngen-portfolio-challenge/main/components/mc/FinalMC.tsx |
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
| `docs/YoungGen_TechSpec_v0.md` | Tech Spec (สเปกหลัก) |
| `docs/README_YG_V0.md` | คู่มือรัน demo + deploy |
| `docs/schema.sql` | Supabase schema (สำหรับ project แยกตอน deploy จริง) |

> 💤 dormant = ไฟล์จาก market-wars ที่ phase ถูกตัดใน V.0 — ยังอยู่เพื่อให้ import ไม่พัง ไม่ render จริง ลบได้ตอน cleanup V.1 (ต้องตาม import ออกด้วย)
