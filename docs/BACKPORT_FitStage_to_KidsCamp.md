# Backport — Fit-to-Screen (FitStage) → Kids Camp (`market-wars`)

**ที่มา:** YoungGen YG-V2 แก้ปัญหาจอ display หลุด/ต้อง scroll เมื่อไม่ได้เปิดบน 1920×1080 พอดี
**market-wars มีปัญหา + โครงเดียวกันเป๊ะ** (YoungGen fork มาจาก B20 และไม่เคยแตะไฟล์เหล่านี้จนถึง YG-V2) → port ได้ตรงๆ
**ต่างกันจุดเดียว:** market-wars ใช้ `bg-[#0D1117]` (arbitrary), YoungGen ใช้ `bg-base` (token) — ตอน port คงสีเดิม kids ไว้

---

## จดไว้ที่ไหน (ให้ไม่ลืมกลับมาทำ)
1. วางไฟล์นี้ที่ `market-wars/docs/BACKPORT_FitStage.md`
2. เพิ่ม 1 แถวใน Task list / Tech Spec ของ Kids Camp:
   `[ ] BX — Display fit-to-screen (port FitStage จาก YoungGen YG-V2) — ดู docs/BACKPORT_FitStage.md`
3. ทำเป็น task ปกติ: tag `B{n}-stable` เมื่อเสร็จ

---

## การแก้ (4 จุด + 1 ไฟล์ใหม่)

### 1. เพิ่มไฟล์ใหม่ `components/display/FitStage.tsx`
คัดลอกทั้งไฟล์ (ใช้ `bg-base` ได้เลย — market-wars มี token `base: "#0D1117"`):
```tsx
// FILE: components/display/FitStage.tsx — Fixed 1280×720 canvas scaled to fit any viewport (letterbox)
// VERSION: B{n} — fit-to-screen; ported from YoungGen YG-V2 (retire CSS zoom)
'use client';
import type { ReactNode } from 'react';
export const STAGE_W = 1280;
export const STAGE_H = 720;
export default function FitStage({ scale, children }: { scale: number; children: ReactNode }) {
  return (
    <div className="fixed inset-0 bg-base overflow-hidden grid place-items-center">
      <div style={{ width: STAGE_W, height: STAGE_H, transform: `scale(${scale})`, transformOrigin: 'center center', flex: '0 0 auto' }}>
        {children}
      </div>
    </div>
  );
}
```
> ถ้า `bg-base` ไม่ทำงานใน market-wars ให้เปลี่ยนเป็น `bg-[#0D1117]`

### 2. `app/display/[roomId]/page.tsx` — สูตร scale
```tsx
// เดิม:
const updateZoom = () => setZoom(Math.min(window.innerWidth / 1280, 1.5));
// เป็น:
const updateZoom = () => setZoom(Math.min(window.innerWidth / 1280, window.innerHeight / 720));
```
+ `import FitStage from '@/components/display/FitStage';`

### 3. `app/display/[roomId]/page.tsx` — ห่อทุก phase ด้วย FitStage
- **final block:** เปลี่ยน `<div className="h-screen bg-[#0D1117] text-white" style={{ zoom }}>` → `<FitStage scale={zoom}>` (ปิดด้วย `</FitStage>`)
- **year_intro:** `<YearIntroDisplay round={round} zoom={zoom} />` → `<FitStage scale={zoom}><YearIntroDisplay round={round} /></FitStage>`
- **market_open:** เช่นเดียวกัน
- **lobby:** `<LobbyDisplay ... zoom={zoom} />` → `<FitStage scale={zoom}><LobbyDisplay ... /></FitStage>`
- **gameplay block (else):** `<div className="h-screen bg-[#0D1117] text-white flex flex-col overflow-hidden" style={{ zoom }}>` → `<FitStage scale={zoom}><div className="w-full h-full bg-[#0D1117] text-white flex flex-col overflow-hidden">` (เพิ่ม `</div>` ปิด + `</FitStage>`)

### 4. Lobby / YearIntro / MarketOpen — ถอด zoom prop
- signature: ตัด `, zoom` และ `; zoom: number` ออก
- outer div: `<div className="h-screen bg-[#0D1117] text-white ... " style={{ zoom }}>` → `<div className="w-full h-full bg-[#0D1117] text-white ...">` (ตัด `style={{ zoom }}`)

---

## Verify (เหมือนทุก task)
```sh
npx tsc --noEmit
NEXT_PUBLIC_SUPABASE_URL="https://placeholder.supabase.co" NEXT_PUBLIC_SUPABASE_ANON_KEY="placeholder" npx next build
npm run dev   # เปิด display แล้วย่อ/ขยายหน้าต่าง — เนื้อหาพอดีจอทุกขนาด ไม่ scroll
```

## ระวัง
- market-wars มี component ที่ **ไม่ dormant** (ResearchQuiz/ChanceCard/MarketFight/Fight/QuizSpeedWall) ต่างจาก YoungGen — แต่ **fit fix ไม่แตะพวกนี้** (แค่ wrapper + 3 splash) จึงปลอดภัย
- อย่าเผลอเปลี่ยนสี — คง `bg-[#0D1117]` / neon เดิมของ Kids Camp ทั้งหมด (นี่เป็น layout fix ล้วน)
- แก้ header comment อย่าใช้ `sed s/ x//g` (กินช่องว่างใน `import{`/`export default`) — ใช้แก้มือ
