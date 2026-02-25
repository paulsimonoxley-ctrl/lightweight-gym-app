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

alter table workouts     enable row level security;
alter table exercises    enable row level security;
alter table session_logs enable row level security;
alter table set_logs     enable row level security;

drop policy if exists "Public access workouts"     on workouts;
drop policy if exists "Public access exercises"    on exercises;
drop policy if exists "Public access session_logs" on session_logs;
drop policy if exists "Public access set_logs"     on set_logs;

create policy "Public access workouts"     on workouts     for all using (true) with check (true);
create policy "Public access exercises"    on exercises    for all using (true) with check (true);
create policy "Public access session_logs" on session_logs for all using (true) with check (true);
create policy "Public access set_logs"     on set_logs     for all using (true) with check (true);

insert into workouts (id, name, description, color) values
  ('a1000000-0000-0000-0000-000000000001', 'Chest & Triceps',  'Mentzer HIT — Push A',  '#e8003d'),
  ('a1000000-0000-0000-0000-000000000002', 'Back & Biceps',    'Mentzer HIT — Pull B',  '#7c3aed'),
  ('a1000000-0000-0000-0000-000000000003', 'Legs & Calves',    'Mentzer HIT — Legs C',  '#0ea5e9'),
  ('a1000000-0000-0000-0000-000000000004', 'Shoulders & Arms', 'Mentzer HIT — Press D', '#10b981')
on conflict (id) do nothing;

insert into exercises (workout_id, name, focus, target_weight, target_reps, order_index) values
  ('a1000000-0000-0000-0000-000000000001', 'Incline Barbell Press', 'Upper Chest',     185, 6,  0),
  ('a1000000-0000-0000-0000-000000000001', 'Pec Deck Fly',          'Chest Isolation', 140, 8,  1),
  ('a1000000-0000-0000-0000-000000000001', 'Triceps Pushdown',      'Triceps',         65,  10, 2),
  ('a1000000-0000-0000-0000-000000000001', 'Weighted Dips',         'Chest/Triceps',   45,  8,  3)
on conflict do nothing;

insert into exercises (workout_id, name, focus, target_weight, target_reps, order_index) values
  ('a1000000-0000-0000-0000-000000000002', 'Deadlift',      'Full Back', 225, 5, 0),
  ('a1000000-0000-0000-0000-000000000002', 'Bent-Over Row', 'Mid Back',  155, 6, 1),
  ('a1000000-0000-0000-0000-000000000002', 'Lat Pulldown',  'Lats',      140, 8, 2),
  ('a1000000-0000-0000-0000-000000000002', 'Barbell Curl',  'Biceps',    75,  8, 3)
on conflict do nothing;

insert into exercises (workout_id, name, focus, target_weight, target_reps, order_index) values
  ('a1000000-0000-0000-0000-000000000003', 'Barbell Squat',       'Quads/Glutes', 225, 6,  0),
  ('a1000000-0000-0000-0000-000000000003', 'Leg Press',           'Quads',        400, 8,  1),
  ('a1000000-0000-0000-0000-000000000003', 'Leg Curl',            'Hamstrings',   120, 8,  2),
  ('a1000000-0000-0000-0000-000000000003', 'Standing Calf Raise', 'Calves',       180, 12, 3)
on conflict do nothing;

insert into exercises (workout_id, name, focus, target_weight, target_reps, order_index) values
  ('a1000000-0000-0000-0000-000000000004', 'Seated DB Shoulder Press', 'Front Delts',        65, 6,  0),
  ('a1000000-0000-0000-0000-000000000004', 'Lateral Raise',            'Side Delts',         30, 10, 1),
  ('a1000000-0000-0000-0000-000000000004', 'Skull Crushers',           'Triceps',            75, 8,  2),
  ('a1000000-0000-0000-0000-000000000004', 'Hammer Curl',              'Biceps/Brachialis',  50, 10, 3)
on conflict do nothing;
