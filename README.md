# BottleZero 💧

A Progressive Web App that helps people cut down on single-use plastic bottles — track the bottles you avoid, see your real environmental impact, find places to refill, and turn it into a game with friends.

**Live app:** https://bottlezero.vercel.app
**Built for:** the Congressional App Challenge.

---

## What it does

- **Track** every single-use bottle you avoid, with one tap (and a refill-source picker).
- **See your impact** — plastic, CO₂, and money saved, plus streaks, points, and levels.
- **Find refills** on a live map (real OpenStreetMap fountains + partner spots).
- **Compete** with friends through challenges and leaderboards.
- **Learn** from curated, sourced facts that refresh daily.
- **Dashboard** with charts, trends, and a Python-powered "real-world equivalents" engine.

Works installed (PWA) on phones, tablets, and computers — light/dark themes, offline support, and opt-in daily reminders.

## Tech stack

React + Vite · Tailwind CSS · React Router · Leaflet + OpenStreetMap · Supabase (auth + Postgres) · a Python serverless function on Vercel · PWA. Everything runs on free tiers.

## Run it locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build
```

Cloud accounts need Supabase keys in a `.env` file (the app runs fully without them in device-only mode):

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## More

A full breakdown of the architecture, data model, impact sources, and file structure is in [DETAILS.md](DETAILS.md).
