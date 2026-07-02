# Task YG-V1 — NextGen Royal Re-theme · Summary

**Tag:** `YG-V1` · **Date:** 02 ก.ค. 2026 · **Status:** ✅ DEPLOYED
**Scope:** re-theme ทั้ง 3 จอ (player / mc / display) จาก Kids-Camp neon → แบรนด์ YoungGen "NextGen Royal"

## ทำอะไร (29 ไฟล์)
- **Token foundation** — ย้ายสีทั้งหมดเป็น CSS var ใน `app/globals.css` `:root` (แหล่งเดียว) + map ใน `tailwind.config.ts`
- **Color sweep identity** ทั้ง 3 จอ: green `#00FFB2`→violet `#9B82FF` · cyan `#00D4FF`→rose `#D57BA8` · base `#0D1117`→`#12102E` · surface `#161B22`→`#211E4A` (+ rgba tint → rgb-triple vars)
- **คงสี data-semantics** (ไม่กวาด): gain `#22C55E` · loss `#EF4444` · gold/podium `#FFD700` — พอ identity เป็นม่วง gain/loss ยิ่งอ่านง่าย
- **Word-mark** MARKET (violet) WARS (rose) + subtitle `PORTFOLIO CHALLENGE` / `KKP YoungGen Edition`
- **Join page → EN เต็ม** (คง logic join/reconnect/duplicate + localStorage key เดิม) + metadata EN
- **Wording in-scope:** Lobby → EN + tagline lockup · DisplayHeader "ปีที่ N" → "Challenge N / 7" · SoundGate ตัดคำ "เด็ก" · FinalPodium "แชมป์" → "MARKET WARS Champion" **+ แก้บั๊ก** "จบครบ 6 ปี" → "7 challenges complete"
- **Header convention** normalize ทุกไฟล์ที่แตะ

## Build verified
`npx tsc --noEmit` clean · `next build` 12/12 pages · compiled CSS ยืนยันมี `--mw-violet:#9b82ff` + arbitrary var class gen ถูก

## ยังไม่ทำ (ค้าง → ดู Tech Spec A9–A11)
- TH บนจอ gameplay ที่เหลือ (results/leaderboard/final/event ฯลฯ) — ยังไม่แปล (นอก scope)
- `bit.ly/marketwars` ใน Lobby ยังเป็น link Kids Camp
- neon เดิม 2 utility ใน CSS จากไฟล์ dormant (ไม่ render)

## Key learnings
- hex มี 2 case (`#00FFB2`/`#00ffb2`) — sweep ต้องครอบทั้งคู่
- `text-[#hex]` อย่าแปลงเป็น `text-base` (ชน utility font-size) → `text-[color:var(--mw-base)]`
- `text-[var(--x)]` กำกวมสำหรับ text/border → ใส่ hint `[color:var(...)]`
