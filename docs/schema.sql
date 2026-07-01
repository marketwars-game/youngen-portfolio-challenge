-- ============================================================
-- KKP YoungGen Portfolio Challenge — Supabase schema (YG-V0)
-- รันใน Supabase SQL Editor ของ project ใหม่
-- (ใช้เฉพาะตอน deploy จริงแยก project — เดโม local ใช้ Supabase เดิมได้ ไม่ต้องรัน)
-- ============================================================

-- ---------- rooms (ห้องเกม) ----------
create table if not exists public.rooms (
  id            text primary key,               -- room code 4 ตัว
  status        text not null default 'lobby',  -- lobby | playing | finished
  current_round integer not null default 1,
  current_phase text not null default 'lobby',
  created_at    timestamptz not null default now()
);

-- ---------- players (1 แถว = 1 ทีม) ----------
create table if not exists public.players (
  id                        uuid primary key default gen_random_uuid(),
  room_id                   text not null references public.rooms(id) on delete cascade,
  name                      text not null,               -- ชื่อทีม
  money                     numeric not null default 1000000,
  portfolio                 jsonb not null default '{}'::jsonb,
  portfolio_submitted_round integer not null default 0,
  round_returns             jsonb not null default '{}'::jsonb,
  -- คอลัมน์ dormant (เก็บไว้ให้ component ที่แชร์กับ market-wars ยัง compile ได้ · ไม่ใช้ใน YG-V0)
  quiz_score                integer not null default 0,
  quiz_answered_round       integer not null default 0,
  quiz_correct_this_round   integer not null default 0,
  quiz_speed_ms             numeric not null default 0,
  quiz_speed_this_round_ms  numeric not null default 0,
  duel_money_change         integer not null default 0,
  duel_submitted_round      integer not null default 0,
  created_at                timestamptz not null default now()
);

-- ---------- indexes (perf) ----------
create index if not exists idx_players_room_id    on public.players (room_id);
create index if not exists idx_players_room_money on public.players (room_id, money desc);

-- ---------- Realtime (จอ MC/Display/ทีม sync กัน) ----------
alter publication supabase_realtime add table public.rooms;
alter publication supabase_realtime add table public.players;

-- ---------- Row Level Security ----------
-- แอปใช้ anon key จาก server route · งานสั้นๆ ตั้ง policy อนุญาตทั้งหมด (หรือปิด RLS ไปเลยถ้า DB ส่วนตัว)
alter table public.rooms   enable row level security;
alter table public.players enable row level security;

create policy "rooms_all"   on public.rooms   for all using (true) with check (true);
create policy "players_all" on public.players for all using (true) with check (true);
