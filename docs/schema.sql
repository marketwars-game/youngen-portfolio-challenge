-- ============================================================
-- KKP YoungGen Portfolio Challenge — Supabase schema (YG-V0)
-- ✅ ตรงกับ DB จริง 100% (เทียบ information_schema กับ market-wars DB — 01 Jul 2026)
-- รันใน Supabase SQL Editor ของ project ใหม่ (deploy จริง) · เดโม local ใช้ DB เดิมได้ ไม่ต้องรัน
-- ============================================================

-- ---------- rooms (ห้องเกม) ----------
create table if not exists public.rooms (
  id            text primary key,               -- room code 4 ตัว
  status        text not null default 'lobby',  -- lobby | playing | finished
  current_round integer not null default 1,
  current_phase text not null default 'lobby',
  created_at    timestamptz default now()
);

-- ---------- players (1 แถว = 1 ทีม) ----------
create table if not exists public.players (
  id                        uuid primary key default gen_random_uuid(),
  room_id                   text not null references public.rooms(id) on delete cascade,
  name                      text not null,
  money                     numeric not null default 1000000,   -- YG: ทีมเริ่ม 1,000,000 (โค้ด players route เขียนค่านี้เอง)
  portfolio                 jsonb default '{}'::jsonb,
  portfolio_submitted_round integer default 0,
  round_returns             jsonb default '{}'::jsonb,
  joined_at                 timestamptz default now(),          -- โค้ด MC/play สั่ง .order('joined_at')
  quiz_score                integer not null default 0,
  -- คอลัมน์ dormant (จาก market-wars — ไม่ใช้ใน YG-V0 แต่เก็บให้ตรงต้นฉบับ 100%)
  quiz_answered_round       integer default 0,
  quiz_correct_this_round   integer default 0,
  quiz_speed_ms             numeric not null default 0,
  quiz_speed_this_round_ms  numeric not null default 0,
  action                    text,
  action_target             uuid,
  duel_opponent_id          uuid,
  duel_move                 text,
  duel_result               text,
  duel_opponent_name        text,
  duel_money_change         numeric default 0,
  duel_submitted_round      integer default 0
);

-- ---------- indexes (perf) ----------
create index if not exists idx_players_room_id    on public.players (room_id);
create index if not exists idx_players_room_money on public.players (room_id, money desc);

-- ---------- Realtime (จอ MC/Display/ทีม sync กัน — ต้องมี rooms + players) ----------
alter publication supabase_realtime add table public.rooms;
alter publication supabase_realtime add table public.players;

-- ---------- Row Level Security ----------
alter table public.rooms   enable row level security;
alter table public.players enable row level security;

create policy "rooms_all"   on public.rooms   for all using (true) with check (true);
create policy "players_all" on public.players for all using (true) with check (true);
