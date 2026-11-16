# BottleZero — Project Details

A complete reference for what this app is and everything it does.

---

## 1. Overview

**BottleZero** is a Progressive Web App that helps people cut down on single-use plastic
bottles by tracking the bottles they avoid, showing the real-world impact, finding places to
refill, and turning it into a game with friends.

- **Purpose:** Congressional App Challenge submission.
- **Live app:** https://bottlezero.vercel.app
- **Type:** Installable web app (PWA) that works on phones, tablets, and computers, plus an
  Android app on [Google Play](https://play.google.com/store/apps/details?id=com.bottlezero.app)
  built from the same code with Capacitor.
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
- **Fountain ratings**: signed-in users can mark a fountain as working or broken, and whether
  they would drink from it. Everyone sees the totals ("Works · 4 of 5 would drink from it"),
  never who rated. A fountain whose latest rating says broken turns gray on the map.

### Community & social
- **Accounts** (email + password) with cloud sync across devices.
- **Export my data** (JSON download) and **in-app account deletion** from Profile, which
  permanently removes the account and everything tied to it.
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
- **Onboarding**: welcome → a short guided tour with mini previews of the real screens →
  profile setup → account step.
- **Interactive walkthrough**: after onboarding, a spotlight walkthrough highlights the real
  controls one at a time (log button, map, challenges, profile). Replayable from Profile.
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
| `fountain_ratings` | fountain_id, user_id, works, would_drink, updated_at |

- Trigger `handle_new_user` auto-creates a profile on signup (name from signup metadata).
- Function `get_challenge_leaderboard(p_code)` returns per-member bottle totals for a challenge.
- Function `fountain_rating_summary(p_ids)` returns per-fountain rating totals (no user ids).
- Function `delete_my_account()` deletes the signed-in user; everything else cascades.
- Full schema lives in [`supabase/schema.sql`](../supabase/schema.sql).

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
  capacitor.config.json   native app config (app id, web dir)
  .env                    Supabase keys (not committed)
  api/impact.py           Python serverless function (impact equivalents)
  supabase/               schema.sql (tables, RLS, functions) + follow-up SQL files
  android/                Capacitor Android project
  assets/                 source icon + splash for the native apps
  scripts/                Python (PIL) icon/image generators, ios-setup.sh
  public/                 manifest.json, sw.js, icons, favicon, og.png
  docs/                   these docs, README images
  src/
    main.jsx              providers: Theme → Auth → App data → Toast
    App.jsx               routes (lazy-loaded), top/bottom chrome, onboarding
    routes/               Dashboard, Map, Rewards, Insights, Challenges, Learn,
                          Profile, About, Auth, Privacy, DeleteAccount
    components/           BottleButton, StatCard, BadgeCard, MapView, FountainRating,
                          NavBar, TopBar, Icon, Onboarding, TourOverlay, ThemeToggle,
                          Celebrations, HabitReminders, InstallModal, CommunityImpact, ...
    state/                AppContext, AuthContext, ThemeContext, ToastContext,
                          ReminderContext, TourContext
    lib/                  storage, impact, badges, rewards, streak, ratings, overpass,
                          share, shareCard, native, pwa, supabase (+ *.test.js)
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

**Backend setup (one time):** create a free Supabase project, run `supabase/schema.sql`,
`community_stats.sql`, `security_hardening.sql`, and `challenge_delete.sql` (in that order) in the
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

---

## 11. Security posture

All tables are protected with Postgres Row Level Security: users can only read and write
their own rows. Cross-user reads happen exclusively through a few deliberately narrow
`SECURITY DEFINER` functions, each with a pinned `search_path`:

- **`community_stats()`** — callable by anyone, including signed-out visitors, on purpose.
  It returns exactly two aggregate numbers (total bottles, total members) and no
  row-level or personal data. This powers the public community counter.
- **`get_challenge_leaderboard(code)`** — callable by signed-in users only. It verifies
  the caller is a member of the challenge before returning names and totals, and raises
  an exception otherwise.
- **`fountain_rating_summary(ids)`**: callable by anyone. It returns only per-fountain
  totals (how many ratings, works/broken, would drink or not, latest status) and never
  user ids. It accepts at most 500 fountain ids per call.
- **`delete_my_account()`**: callable by signed-in users only, and it can only delete the
  caller's own account.

The `handle_new_user()` trigger function is not executable by any API role; only the
database invokes it. Supabase's security linter intentionally flags every publicly
callable `SECURITY DEFINER` function so developers confirm the exposure is deliberate —
for the functions above, it is, for the reasons stated. Leaked-password protection
(HaveIBeenPwned checks) is a Supabase Pro feature and is not enabled on the free plan.

Anon keys are public by design (they ship in the client bundle); real protection comes
from RLS. The Android release signing keystore and `.env` secrets are git-ignored and
never committed. A daily GitHub Actions ping keeps the free-tier project from being
auto-paused for inactivity.
