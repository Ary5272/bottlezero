# BottleZero — Project Details

A complete reference for what this app is and everything it does.

---

## 1. Overview

**BottleZero** is a Progressive Web App that helps people cut down on single-use plastic
bottles by tracking the bottles they avoid, showing the real-world impact, finding places to
refill, and turning it into a game with friends.

- **Purpose:** Congressional App Challenge submission.
- **Live app:** https://bottlezero.vercel.app
- **Type:** Installable web app (PWA) — works on phones, tablets, and computers; no app store needed.
- **Cost to run:** $0 — every service used has a free tier with no credit card required.

---

## 2. Tech stack

| Area | Technology |
|---|---|
| Framework | React 19 + Vite 8 |
| Styling | Tailwind CSS v4 (CSS-variable theming for light/dark) |
| Routing | React Router 7 |
| Maps | Leaflet + react-leaflet + OpenStreetMap tiles (no API key) |
| Live refill data | Overpass API (OpenStreetMap) — real drinking fountains near you |
| Backend / Auth / DB | Supabase (Postgres + Auth, free tier) |
| Compute API | Python serverless function on Vercel (impact "equivalents engine") |
| Local storage | Browser `localStorage` (offline / signed-out mode) |
| Hosting | Vercel |
| App format | PWA (installable, offline-capable, service worker) |

---

## 3. Features

### Tracking & gamification
- One-tap **bottle logging** with a source picker (Home / Fountain / Station / Store).
- **Optimistic logging** — the count updates instantly, then syncs in the background.
- **Undo** on every log (toast with an Undo button).
- **Animated stats**: bottles saved, day streak, plastic avoided, CO₂ prevented, money saved.
- **Daily goal** with a progress ring and a "goal reached" celebration.
- **Points & levels** (Seedling → Sprout → Sapling → Young Tree → Grove → Forest → Guardian).
- **14 achievement badges** (totals, streaks, daily-goal milestones).
- **Level-up & goal confetti**, plus a "log today" nudge to protect streaks.
- **Daily reminder**: opt-in notification at a time you choose. It fires while the app is open,
  and nudges you once when you reopen the app past that time without having logged. (Per device.
  Always-on push when the app is fully closed needs a server and is not enabled.)
- **App-icon badge** (on an installed PWA): shows how many bottles you still owe toward today's goal.

### Locating alternatives (Map)
- Interactive map centered on the user (defaults to Raleigh, NC if location is denied).
- **Live water fountains** pulled from OpenStreetMap via the Overpass API.
- Curated **seed locations** + **partner spots** with perks (e.g., "10% off with a reusable bottle").
- Color-coded pins: fountain, refill station, eco-store, cafe, partner.

### Community & social
- **Accounts** (email + password) with cloud sync across devices.
- **Friend challenges**: create a challenge, share a join code, others join.
- **Leaderboards** with live rankings and a team-progress bar.
- **Web Share** for impact and challenge invites (native share sheet, clipboard fallback).

### Education hub (Learn)
- Curated facts, tips, DIY, and news — each card **links to a real, cited source**
  (UNEP, WHO, National Geographic, The Guardian, Pacific Institute, EPA, NOAA, Earthday, Refill).
- **"Today's spotlight"** and the article order **rotate daily** so content feels fresh.

### Insights (analytics)
- 7-day bar chart with week-over-week trend.
- This-week total, daily average, best day.
- "Where you refill" source breakdown.
- **Recent activity** log with per-entry delete.
- Lifetime impact summary.
- **Real-world equivalents** (miles not driven, phone charges, LED-hours, plastic bags by weight)
  computed by a **Python serverless function** (`api/impact.py`); the section hides gracefully if the
  API is unavailable (e.g., offline).

### Experience & polish
- **Onboarding**: welcome → a 4-slide guided tour (Log / Track / Map / Rewards, each with a
  mini preview of the real screen) → profile setup → account step. Replayable from Profile.
- **Dark mode**: light / dark / system, persisted, with no flash on load.
- Minimal design system: Inter font, single emerald accent, custom line-icon set, soft elevation.
- Toasts, ripple + haptic feedback, page transitions — all respecting `prefers-reduced-motion`.
- **PWA install banner** for one-tap "add to home screen".

---

## 4. How it works (architecture)

**Hybrid local + cloud.** The app fully works signed-out using `localStorage`. When a user
signs in, the same data shapes move to Supabase and become the source of truth; logging stays
optimistic (instant UI, background sync, reconciled by a stable local id + a separate server id).

**Python compute API.** A Python serverless function (`api/impact.py`, Vercel free tier) is the
"equivalents engine": the Dashboard sends a bottle count and Python returns real-world comparisons.
The frontend treats it as a progressive enhancement — if it's offline, the section simply hides.

**Security.** Supabase Row Level Security ensures users can only read/write their own profile
and logs. Friend leaderboards use a `SECURITY DEFINER` Postgres function so members can see
each other's totals without exposing raw data.

**Privacy.** Data stays on-device unless an account is created. Location is used only to find
nearby refill points and is never stored or shared. Theme and reminder preferences are stored
per device in `localStorage`; notifications are generated locally on the device.

---

## 5. Data model (Supabase)

| Table | Key fields |
|---|---|
| `profiles` | id (= auth user), name, daily_goal, created_at |
| `bottle_logs` | id, user_id, count, source, created_at |
| `challenges` | id, name, code (unique), goal, created_by, start/end dates |
| `challenge_members` | id, challenge_id, user_id, joined_at |

- Trigger `handle_new_user` auto-creates a profile on signup (name from signup metadata).
- Function `get_challenge_leaderboard(p_code)` returns per-member bottle totals for a challenge.
- Full schema lives in [`supabase/schema.sql`](supabase/schema.sql).

---

## 6. Impact calculations

All constants live in `src/lib/impact.js` so they're easy to verify and cite:

| Value | Figure | Source |
|---|---|---|
| Plastic per bottle | 12.7 g | NAPCOR (2020 PET bottle weight) |
| CO₂ per bottle | 82.8 g CO₂e | Quantis for IBWA (2010 lifecycle study) |
| Cost per bottle | $1.29 | Beverage Marketing Corporation |
| Car equivalent | 0.21 kg CO₂/mile | EPA (typical passenger vehicle, 2023) |

Points: 10 per bottle, 50 per badge, 15 per goal-day (see `src/lib/rewards.js`).

---

## 7. Project structure

```
bottlezero/
  index.html              app shell + PWA meta + no-flash theme script
  vite.config.js          Vite + Tailwind + React plugins
  vercel.json             SPA rewrite (all routes → index.html)
  .env                    Supabase keys (not committed)
  api/impact.py           Python serverless function (impact equivalents)
  scripts/generate_icons.py  Python (PIL) generator for the PNG app icons
  scripts/generate_og.py     Python (PIL) generator for the 1200x630 social card
  public/og.png           social share image (og:image / twitter card)
  supabase/schema.sql     database schema + RLS + functions
  public/                 manifest.json, sw.js, icons, favicon
  src/
    main.jsx              providers: Theme → Auth → App data → Toast
    App.jsx               routes (lazy-loaded), top/bottom chrome, onboarding
    routes/               Dashboard, Map, Rewards, Insights, Challenges,
                          Learn, Profile, About, Auth
    components/           BottleButton, StatCard, BadgeCard, MapView, NavBar,
                          TopBar, Icon, Onboarding, ThemeToggle, Celebrations,
                          HabitReminders, InstallPrompt, AnimatedNumber, PageHeader
    state/                AppContext, AuthContext, ThemeContext, ToastContext, ReminderContext
    lib/                  storage, impact, badges, rewards, overpass, share,
                          motion, confetti, supabase
    data/                 facts.json, seedLocations.json, partners.json
```

---

## 8. Running it locally

```bash
cd bottlezero
npm install
npm run dev          # http://localhost:5173
npm run build        # production build into dist/
```

**Environment variables** (in `bottlezero/.env`) enable cloud accounts:

```
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon public key>
```

Without these, the app runs in device-only (localStorage) mode — nothing breaks.

**Backend setup (one time):** create a free Supabase project, run `supabase/schema.sql` in the
SQL Editor, turn off "Confirm email" under Authentication → Providers → Email for instant
signups, then copy the Project URL + anon key into `.env` and into Vercel's environment variables.

---

## 9. Deployment

Hosted on Vercel. Deploy with:

```bash
cd bottlezero
npx vercel --prod
```

Vercel builds from source and serves the SPA. The Supabase keys are set as Production
environment variables in the Vercel project. Live at https://bottlezero.vercel.app.

---

## 10. Phase roadmap (all current phases complete)

- **Phase 1 — MVP:** logging, dashboard, impact math, badges, map, education hub.
- **Phase 2 — Social + backend:** accounts, cloud sync, friend challenges, web share.
- **Phase 3 — Rewards & scale:** points/levels, partner locations, advanced analytics.
- **Polish:** dark mode, onboarding tour, animations, performance (code-splitting), PWA install.

Possible future ideas: always-on push reminders even when the app is closed (needs a small
server / Supabase Edge Function with Web Push), more partner data, real-world rewards via brand
partnerships.
