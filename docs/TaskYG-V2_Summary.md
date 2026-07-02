# Task YG-V2 — Fit-to-Screen Display · Summary

**Tag:** `YG-V2` · **Date:** 02 ก.ค. 2026 · **Status:** ✅ DEPLOYED
**Scope:** แก้จอ display ที่เนื้อหาหลุด/ต้อง scroll เมื่อเปิดบนจอที่ไม่ใช่ 1920×1080 พอดี

## ปัญหา
เดิม (B15-v2) ใช้ `zoom = min(innerWidth/1280, 1.5)` บนกล่อง `h-screen` → พอ `zoom > 1` (จอกว้าง > 1280) กล่องสูงเกิน viewport → เนื้อหา (เช่น "PLAYERS JOINED" ใน Lobby) หลุดใต้จอ ต้อง scroll · เป๊ะเฉพาะ projector 1920×1080 พอดีเท่านั้น (จอ/หน้าต่างอื่นเพี้ยนหมด)

## แก้ (5 ไฟล์)
- **ใหม่ `components/display/FitStage.tsx`** — canvas ขนาดคงที่ **1280×720** จัดกลาง viewport + `transform: scale()` (letterbox) · `scale = min(innerWidth/1280, innerHeight/720)` → พอดีจอเสมอทุก aspect · projector 1920×1080 = 1.5 เท่าเดิม (ไม่กระทบงานจริง)
- `app/display/[roomId]/page.tsx` — สูตร zoom ดูทั้งกว้าง+สูง · ห่อทุก phase (lobby/final/year_intro/market_open/gameplay) ด้วย `<FitStage>`
- `LobbyDisplay` / `YearIntroDisplay` / `MarketOpenDisplay` — ถอด `zoom` prop (กล่องในเป็น `w-full h-full` ให้ FitStage คุม scale)

## Build verified
`npx tsc --noEmit` clean · `next build` 12/12 pages · FitStage เปิด/ปิดครบ 5/5 branch · ทดสอบ dev ทุก phase พอดีจอ (ยืนยันโดย OANIE)

## Design decision (จาก demo)
เลือก **canvas + transform scale** แทน "ปรับสูตร zoom" เพราะ transform scale บนกล่องคงที่ = deterministic ไม่พึ่งพฤติกรรม CSS zoom+vh ที่กำกวมและต่างกันในแต่ละ browser (OANIE รีวิว `display_fit_demo.html` แล้วเลือกแบบนี้)

## Portable → Kids Camp
กลไก FitStage เอาไปแก้ market-wars (Kids Camp) ได้ตรงๆ เพราะโครง display เหมือนกัน → ดู `docs/BACKPORT_FitStage_to_KidsCamp.md`

## Key learning
CSS `zoom` บน `h-screen` = กับดัก (สูงเกิน viewport เมื่อ zoom>1) → ใช้ fixed canvas + transform scale เสมอสำหรับ fit-to-screen
