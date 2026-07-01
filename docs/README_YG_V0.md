# YoungGen Portfolio Challenge — YG-V0 — คู่มือรัน & Deploy

## A) รันเดโม local (สำหรับพรุ่งนี้) — ~2 นาที

ถ้าอ้น unzip โปรเจกต์นี้มาสดๆ:
```
cd youngen-portfolio-challenge
cp .env.example .env.local        # แล้วแก้ค่าให้ชี้ Supabase เดิม
npm install
npm run dev
```
เปิด `http://localhost:3000` → MC สร้างห้อง → เปิดอีก tab เป็น "ทีม" แล้ว join → เล่น Challenge 1–2 โชว์ทีมงาน

- ชี้ Supabase เดิมได้เลย **ไม่ต้อง migration** (asset id คนละชุด ไม่ชนข้อมูล Kids)
- แต่ละ tab = 1 ทีม · เปิด 2-3 tab โชว์ leaderboard ขยับ
- ตั้งชื่อทีม → กลับมาวันถัดไปใส่ชื่อเดิมในห้องเดิม
- Ch1–4 โชว์ 6 asset · Ch5 เพิ่ม Oil · Ch6 เพิ่ม Crypto (max 20%) · Ch7 ครบ 8

> **ทำไม local พอสำหรับเดโม:** อ้นขับเครื่องเดียว · วันงานจริงต้องมี URL สาธารณะให้ 20+ ทีม join จากมือถือตัวเอง → ดูข้อ B

---

## B) แก้ไฟล์ต่อคืนนี้ (hot reload)

1. เปิด terminal ค้าง `npm run dev` ไว้ (อย่าปิด)
2. แก้ไฟล์ใน Cursor → Ctrl+S → เบราว์เซอร์ reload เอง 1-2 วิ
3. ก่อนใช้จริงเช็ค: `npx tsc --noEmit` (เงียบ = ผ่าน · แดง = ส่ง error มาให้ช่วยดู)

**แก้ UI ส่วนไหน อยู่ไฟล์ไหน:** จอทีม (มือถือ) → `components/player/InvestmentPanel.tsx` · สี/ไอคอน/ชื่อ asset + brief + event → `lib/constants.ts` · จอใหญ่ → `components/display/*.tsx` · จอ MC → `components/mc/*.tsx`

⚠️ สีใช้ inline style เท่านั้น (`style={{ color: '#...' }}`) — ห้าม `text-[#hex]` (หายตอน build)

---

## C) Push GitHub + Deploy จริง (ก่อน 6 ก.ค.)

### 1. GitHub
สร้าง repo เปล่าบน github.com ก่อน (แนะนำชื่อ `youngen-portfolio-challenge`, ตั้ง **public** ถ้าอยากให้ Claude fetch raw URL ได้) แล้ว:
```
cd youngen-portfolio-challenge
git init
git add .
git commit -m "YG-V0: YoungGen Portfolio Challenge (fork จาก market-wars B20-stable)"
git branch -M main
git remote add origin <repo-url-ใหม่>
git push -u origin main
git tag YG-V0 && git push origin YG-V0
```
> `.env.local` ถูก `.gitignore` อยู่แล้ว → ไม่หลุดขึ้น git
> ถ้า repo owner/ชื่อ ต่างจาก `marketwars-game/youngen-portfolio-challenge` → แก้ raw URL ใน `FILE_REGISTRY.md` (มี sed ให้ในหัวไฟล์)

### 2. Supabase (project แยก)
สร้าง project ใหม่ → SQL Editor → paste & run `docs/schema.sql`

### 3. Vercel
Import repo → ใส่ env 3 ตัว → deploy อัตโนมัติ:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (anon key ไม่ใช่ service role)
- `MC_PIN` (PIN ของ MC)

เปิด URL Vercel → สร้างห้อง → **dry-run เต็ม 7 challenge** ก่อนวันงาน

> แยก repo/Vercel/Supabase ออกจาก kids `market-wars` ให้ขาด → Kids Camp S3 (11 ก.ค.) ไม่กระทบ

---

## หลังจากมี GitHub แล้ว = กลับไป flow เดิม
Claude fetch ไฟล์จาก raw URL เองได้ → แก้ต่อแบบส่งไฟล์เต็มเหมือน market-wars · ไม่ต้องลากไฟล์มาแปะทุกครั้ง (ตราบใดที่ repo public)
