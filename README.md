# LightWeight

> Mentzer HIT Workout Tracker — React + Vite + Supabase + PWA

## Tech Stack
- React 19 + TypeScript
- Vite 7
- Supabase (Postgres backend)
- React Router v7
- Tailwind CSS v4
- vite-plugin-pwa

## Setup

1. Clone repo and install dependencies:
```bash
npm install
```

2. Create `.env` file:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

3. Run the SQL schema in your Supabase SQL Editor:
```
supabase/schema.sql
```

4. Start dev server:
```bash
npm run dev
```

## Deploy to Vercel
1. Import this repo at vercel.com
2. Add the two env vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) in Project Settings
3. Deploy \u2014 done!

## Screens
- **Home** `/` \u2014 Select workout program
- **Session** `/session/:id` \u2014 Live workout runner with timer
- **History** `/history` \u2014 Past sessions with set logs
- **Builder** `/builder` \u2014 CRUD for workouts & exercises
