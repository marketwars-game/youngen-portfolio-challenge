# 🚀 START HERE — YoungGen V.0 Runbook (จับมือทำ)

> อ่านไฟล์เดียวจบ · ทำตามข้อ 1 → 7 ตามลำดับ · เวลารวม ~30 นาที
> มี 2 เป้าหมาย: **(A) เดโมพรุ่งนี้** (ข้อ 1–4) และ **(B) ขึ้น Vercel จริง** (ข้อ 5–7)

---

## สิ่งที่ต้องมีก่อนเริ่ม (checklist)
- [ ] เครื่อง Mac ที่มี Node.js + npm (อ้นมีอยู่แล้วจาก market-wars)
- [ ] โปรแกรม Cursor (หรือ VS Code)
- [ ] ไฟล์ zip นี้: `youngen-portfolio-challenge_YG-V0.zip`
- [ ] ค่าจาก Supabase เดิม 2 ตัว: `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`
      (หาได้จาก `.env.local` ในโฟลเดอร์ market-wars เดิมของอ้น — เปิดไฟล์นั้นแล้ว copy 2 บรรทัดนี้)
- [ ] ค่า `MC_PIN` (PIN ที่ MC ใช้เข้าคุมเกม — อยู่ใน `.env.local` เดิมเช่นกัน)

---

# ═══════════════════════════════
# PART A — เดโม local (พรุ่งนี้) · ~10 นาที
# ═══════════════════════════════

## ข้อ 1 — แตกไฟล์ zip
1. เอา `youngen-portfolio-challenge_YG-V0.zip` ไปวางไว้ที่เดียวกับโฟลเดอร์ `market-wars` เดิม
   (เช่น `~/Projects/` ที่มี `market-wars` อยู่ → วาง zip ตรงนี้)
2. ดับเบิลคลิก unzip → ได้โฟลเดอร์ `youngen-portfolio-challenge`
3. เปิด Terminal แล้ว cd เข้าไป:
```
cd ~/Projects/youngen-portfolio-challenge
```
> ⚠️ zip นี้ **ไม่มี** `node_modules` (จะติดตั้งในข้อ 3) และ **ไม่มี** `.env.local` (จะสร้างในข้อ 2)

## ข้อ 2 — สร้างไฟล์ env (ชี้ Supabase เดิม)
```
cp .env.example .env.local
```
แล้วเปิด `.env.local` ใน Cursor → แก้ 3 บรรทัดให้เป็นค่าจริง (copy จาก `.env.local` ของ market-wars เดิม):
```
NEXT_PUBLIC_SUPABASE_URL=https://hxzpttyoyltgxyecrjon.supabase.co   ← ใส่ของจริง
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ....                                ← ใส่ของจริง (anon key)
MC_PIN=1234                                                          ← ใส่ PIN จริง
```
> เดโมใช้ Supabase เดิมได้เลย **ไม่ต้องสร้างใหม่ ไม่ต้อง migration** — asset id ของ YoungGen (`cash/bonds/...`) คนละชุดกับ Kids (`robosnack/...`) เขียนทับกันไม่ได้

## ข้อ 3 — ติดตั้ง + รัน
```
npm install
npm run dev
```
รอจนขึ้น `Ready` แล้วเปิดเบราว์เซอร์: **http://localhost:3000**

## ข้อ 4 — ลองเล่น (โชว์ทีมงาน)
1. **จอ MC:** ไปที่ `http://localhost:3000/mc` → ใส่ PIN → **Create Room** → จำ room code 4 ตัว
2. **จอทีม:** เปิด tab ใหม่ → `http://localhost:3000` → ใส่ room code + ตั้งชื่อทีม → Join
   (อยากได้หลายทีม เปิดหลาย tab ใส่ชื่อต่างกัน)
3. **จอใหญ่ (option):** เปิดอีก tab → `http://localhost:3000/display/<ROOMCODE>`
4. ที่จอ MC กด **Start** → กด **Next** ไปเรื่อยๆ ไล่ผ่าน: Challenge Brief → Allocation → Market → Returns → Results → Leaderboard
5. ลองไปให้ถึง **Challenge 5** (Oil โผล่) และ **Challenge 6** (Crypto max 20%) โชว์ unlock

✅ แค่นี้เดโมพร้อม — ถ้าจะแก้ UI ต่อ ปล่อย `npm run dev` ค้างไว้ แก้ไฟล์แล้วเซฟ เบราว์เซอร์ reload เอง

---

# ═══════════════════════════════
# PART B — ขึ้น GitHub + Vercel จริง (ก่อนวันงาน) · ~20 นาที
# ═══════════════════════════════

> ต้องทำก่อนวันงานเพราะวันจริง 20+ ทีม join จากมือถือตัวเอง → เข้า localhost เครื่องอ้นไม่ได้ ต้องมี URL สาธารณะ

## ข้อ 5 — Push ขึ้น GitHub (~5 นาที)
1. ไปที่ github.com → **New repository**
   - ชื่อ: `youngen-portfolio-challenge`
   - ตั้งเป็น **Public** (เพื่อให้ Claude fetch raw URL แก้งานต่อได้ · ถ้า Private ต้องลากไฟล์มาแปะเอง)
   - **อย่า** ติ๊ก "Add README" (เรามีแล้ว)
   - กด Create → copy URL ที่ได้ (เช่น `https://github.com/<you>/youngen-portfolio-challenge.git`)
2. ที่ Terminal (ในโฟลเดอร์โปรเจกต์):
```
git init
git add .
git commit -m "YG-V0: YoungGen Portfolio Challenge (fork จาก market-wars B20-stable)"
git branch -M main
git remote add origin <repo-url-ที่-copy-มา>
git push -u origin main
git tag YG-V0 && git push origin YG-V0
```
> `.env.local` ถูก `.gitignore` อยู่แล้ว → คีย์ไม่หลุดขึ้น git ✅
> **ถ้า owner/ชื่อ repo ไม่ใช่ `marketwars-game/youngen-portfolio-challenge`** ให้แก้ raw URL ใน FILE_REGISTRY (คำสั่งเดียว):
> ```
> sed -i '' 's|marketwars-game/youngen-portfolio-challenge|<OWNER>/<REPO>|g' FILE_REGISTRY.md
> git add FILE_REGISTRY.md && git commit -m "fix registry urls" && git push
> ```
> (Mac ใช้ `sed -i ''` มี quote ว่างตามหลัง `-i`)

## ข้อ 6 — สร้าง Supabase project แยก (~5 นาที)
1. supabase.com → **New project** (ตั้งชื่อ เช่น `youngen`, region Singapore) → รอ provision
2. เข้าเมนู **SQL Editor** → **New query** → เปิดไฟล์ `docs/schema.sql` → copy ทั้งหมด → paste → **Run**
   (สร้างตาราง rooms + players + index + realtime + policy ให้ครบ)
3. เข้า **Project Settings → API** → copy 2 ค่านี้ไว้ (ใช้ข้อ 7):
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`  (⚠️ ใช้ anon ไม่ใช่ service_role)

## ข้อ 7 — Deploy บน Vercel (เปิดโปรเจกต์ใหม่) (~10 นาที)
1. vercel.com → **Add New… → Project**
2. **Import** repo `youngen-portfolio-challenge` จาก GitHub (ให้สิทธิ์ Vercel เข้าถึง repo ถ้าถาม)
3. หน้า Configure — Framework จะ auto-detect เป็น **Next.js** (ไม่ต้องแก้ Build/Output)
4. เปิด **Environment Variables** ใส่ 3 ตัว (ค่าจากข้อ 6 + PIN):
   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | (Project URL จาก Supabase ใหม่) |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (anon key จาก Supabase ใหม่) |
   | `MC_PIN` | (PIN ที่อยากใช้) |
5. กด **Deploy** → รอ ~2 นาที → ได้ URL เช่น `https://youngen-portfolio-challenge.vercel.app`
6. **Dry-run เต็ม:** เปิด URL Vercel → `/mc` สร้างห้อง → เล่นครบทั้ง 7 challenge เช็คว่าทุกจอทำงาน
   - มือถือทีมเข้าผ่าน URL Vercel + room code (ไม่ใช่ localhost แล้ว)

> เปิดโปรเจกต์ Vercel **ใหม่แยก** จากตัว market-wars — คนละ repo คนละ Supabase → Kids Camp S3 (11 ก.ค.) ไม่กระทบเลย

---

## หลังขึ้น GitHub แล้ว → ทำงานกับ Claude ต่อยังไง
ส่ง **URL repo (public)** มาบอก Claude → จากนั้นแก้งานต่อแบบ flow เดิม: Claude fetch ไฟล์ล่าสุดจาก raw URL เอง → แก้ → ส่งไฟล์เต็มกลับ → อ้นวางทับ + commit + push (ไม่ต้องลากไฟล์มาแปะทุกครั้ง)

## ถ้าติดปัญหา (quick fixes)
| อาการ | แก้ |
|------|-----|
| `npm run dev` error หา module | รัน `npm install` ซ้ำ |
| หน้าเว็บขึ้นแต่ join ไม่ได้ / ว่างเปล่า | เช็ค `.env.local` ว่าใส่ค่า Supabase ถูก (ไม่มีเว้นวรรค/บรรทัดเกิน) แล้ว restart `npm run dev` |
| MC ใส่ PIN ไม่ผ่าน | `MC_PIN` ใน `.env.local` (local) หรือ Vercel env (จริง) ยังไม่ตรง |
| Vercel build fail | ดู log — ปกติคือลืมใส่ env var สักตัว ใส่ให้ครบ 3 แล้ว Redeploy |
| แก้ไฟล์แล้วอยากเช็คก่อนใช้ | `npx tsc --noEmit` (เงียบ=ผ่าน) |

## ไฟล์สำคัญในโปรเจกต์
- `START_HERE_RUNBOOK.md` ← ไฟล์นี้
- `README.md` — สรุปสั้น
- `FILE_REGISTRY.md` — index ทุกไฟล์ + raw URL
- `docs/YoungGen_TechSpec_v0.md` — สเปกเต็ม
- `docs/README_YG_V0.md` — คู่มือรัน/deploy (รายละเอียดเสริม)
- `docs/schema.sql` — DB schema (ใช้ข้อ 6)
- `.env.example` — เทมเพลต env
