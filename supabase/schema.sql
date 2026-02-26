-- ============================================================
-- LightWeight — Supabase Schema (idempotent — safe to re-run)
-- ============================================================

create table if not exists workouts (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  color       text default '#7c3aed',
  created_at  timestamptz default now()
);

create table if not exists exercises (
  id            uuid primary key default gen_random_uuid(),
  workout_id    uuid references workouts(id) on delete cascade,
  name          text not null,
  focus         text,
  target_weight numeric default 0,
  target_reps   int default 8,
  video_url     text,
  order_index   int default 0,
  created_at    timestamptz default now()
);

create table if not exists session_logs (
  id           uuid primary key default gen_random_uuid(),
  workout_id   uuid references workouts(id) on delete set null,
  started_at   timestamptz default now(),
  completed_at timestamptz,
  notes        text
);

create table if not exists set_logs (
  id               uuid primary key default gen_random_uuid(),
  session_log_id   uuid references session_logs(id) on delete cascade,
  exercise_id      uuid references exercises(id) on delete cascade,
  actual_weight    numeric default 0,
  actual_reps      int default 0,
  logged_at        timestamptz default now()
);

create table if not exists commitments (
  id             uuid primary key default gen_random_uuid(),
  workout_id     uuid references workouts(id) on delete cascade,
  scheduled_date date not null,
  note           text,
  created_at     timestamptz default now()
);

alter table workouts     enable row level security;
alter table exercises    enable row level security;
alter table session_logs enable row level security;
alter table set_logs     enable row level security;
alter table commitments  enable row level security;

drop policy if exists "Public access workouts"     on workouts;
drop policy if exists "Public access exercises"    on exercises;
drop policy if exists "Public access session_logs" on session_logs;
drop policy if exists "Public access set_logs"     on set_logs;
drop policy if exists "Public access commitments"  on commitments;

create policy "Public access workouts"     on workouts     for all using (true) with check (true);
create policy "Public access exercises"    on exercises    for all using (true) with check (true);
create policy "Public access session_logs" on session_logs for all using (true) with check (true);
create policy "Public access set_logs"     on set_logs     for all using (true) with check (true);
create policy "Public access commitments"  on commitments  for all using (true) with check (true);

-- Seed workouts (fixed UUIDs, idempotent)
insert into workouts (id, name, description, color) values
  ('a1000000-0000-0000-0000-000000000001', 'Chest & Triceps',  'Mentzer HIT — Push A',  '#e8003d'),
  ('a1000000-0000-0000-0000-000000000002', 'Back & Biceps',    'Mentzer HIT — Pull B',  '#7c3aed'),
  ('a1000000-0000-0000-0000-000000000003', 'Legs & Calves',    'Mentzer HIT — Legs C',  '#0ea5e9'),
  ('a1000000-0000-0000-0000-000000000004', 'Shoulders & Arms', 'Mentzer HIT — Press D', '#10b981')
on conflict (id) do nothing;

-- ⚠️  DEDUP: Remove duplicate exercises (schema ran multiple times)
-- Run this if exercises appear 2-3x in the session screen:
-- DELETE FROM exercises
-- WHERE id NOT IN (
--   SELECT DISTINCT ON (workout_id, name) id
--   FROM exercises
--   ORDER BY workout_id, name, created_at ASC
-- );

-- Seed exercises with fixed UUIDs
insert into exercises (id, workout_id, name, focus, target_weight, target_reps, order_index) values
  ('b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Incline Barbell Press', 'Upper Chest',    185, 6,  0),
  ('b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'Pec Deck Fly',          'Chest Isolation',140, 8,  1),
  ('b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', 'Triceps Pushdown',      'Triceps',        65,  10, 2),
  ('b1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000001', 'Weighted Dips',         'Chest/Triceps',  45,  8,  3),
  ('b1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000002', 'Deadlift',              'Full Back',      225, 5,  0),
  ('b1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000002', 'Bent-Over Row',         'Mid Back',       155, 6,  1),
  ('b1000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000002', 'Lat Pulldown',          'Lats',           140, 8,  2),
  ('b1000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000002', 'Barbell Curl',          'Biceps',         75,  8,  3),
  ('b1000000-0000-0000-0000-000000000009', 'a1000000-0000-0000-0000-000000000003', 'Barbell Squat',         'Quads/Glutes',   225, 6,  0),
  ('b1000000-0000-0000-0000-000000000010', 'a1000000-0000-0000-0000-000000000003', 'Leg Press',             'Quads',          400, 8,  1),
  ('b1000000-0000-0000-0000-000000000011', 'a1000000-0000-0000-0000-000000000003', 'Leg Curl',              'Hamstrings',     120, 8,  2),
  ('b1000000-0000-0000-0000-000000000012', 'a1000000-0000-0000-0000-000000000003', 'Standing Calf Raise',   'Calves',         180, 12, 3),
  ('b1000000-0000-0000-0000-000000000013', 'a1000000-0000-0000-0000-000000000004', 'Seated DB Shoulder Press','Front Delts',   65,  6,  0),
  ('b1000000-0000-0000-0000-000000000014', 'a1000000-0000-0000-0000-000000000004', 'Lateral Raise',         'Side Delts',     30,  10, 1),
  ('b1000000-0000-0000-0000-000000000015', 'a1000000-0000-0000-0000-000000000004', 'Skull Crushers',        'Triceps',        75,  8,  2),
  ('b1000000-0000-0000-0000-000000000016', 'a1000000-0000-0000-0000-000000000004', 'Hammer Curl',           'Biceps/Brachialis',50, 10, 3)
on conflict (id) do nothing;
