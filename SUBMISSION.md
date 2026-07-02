# Congressional App Challenge — Submission Kit

Everything needed to submit BottleZero, in one place. Fill in the `[bracketed]` parts with your own words — judges can tell (and care) when it's authentically you.

---

## What judges actually score

Congressional App Challenge judges are typically congressional staff plus local tech volunteers. They spend a few minutes per entry, and the **demo video is the main event**. They look for:

1. **A real problem, clearly stated** — why does this app need to exist?
2. **A working app** — does the demo show it actually functioning?
3. **Technical accomplishment, explained simply** — what did you build and learn?
4. **You** — your story, your effort, your growth.

BottleZero has strong answers for all four. Don't bury them.

---

## Demo video script (~2 minutes)

Film in this order. Screen-record the phone for app shots (iPhone: Settings → Control Center → Screen Recording. Android: swipe down → Screen record).

| # | Shot | Length | What you say (roughly) |
|---|------|--------|------------------------|
| 1 | You, on camera, holding a plastic bottle | 15s | "Hi, I'm [name] from [city], North Carolina. The world buys about a million plastic bottles every minute, and most end up in landfills or the ocean. I built BottleZero to help people actually change that habit." |
| 2 | Phone: log a bottle (big button tap, confetti) | 15s | "Every time you refill instead of buying a bottle, you log it with one tap. BottleZero turns that into your real impact — plastic avoided, CO₂ prevented, money saved." |
| 3 | Phone: Dashboard charts | 15s | "The dashboard shows your trends, streaks, and daily goal — and a Python engine translates your impact into real-world equivalents." |
| 4 | Phone: the map | 15s | "The map finds real water fountains near you using live OpenStreetMap data, so refilling is always easy." |
| 5 | Phone: challenges / community counter | 15s | "You can challenge friends, climb the leaderboard, and see what the whole community has saved together." |
| 6 | Phone: share card + install | 10s | "Your impact becomes a shareable card, and the app installs on any phone — I also built native Android and iOS versions from the same code." |
| 7 | You, on camera | 15s | "I built this with React, Python, and a cloud database. The hardest bug was [pick one — e.g. 'my data silently stopped saving past 1,000 logs — I learned to debug systematically instead of guessing']. BottleZero made my own habits better, and I hope it does the same for my community." |

**Tips**
- Record audio in a quiet room; re-record any mumbled line — narration quality matters more than fancy editing.
- Show the REAL app on a REAL phone. Judges notice.
- Keep it under the time limit in the current rules (check appchallenge.us).

---

## Written answers (draft — personalize before pasting)

**What inspired you to create this app?**
> [Your genuine story — e.g. noticing bottle waste at school/practice.] I kept seeing single-use bottles everywhere and read that humanity buys roughly a million every minute. Recycling alone doesn't fix it — the habit has to change. I wanted an app that makes skipping a bottle feel like an achievement instead of a sacrifice.

**What does your app do?**
> BottleZero tracks every single-use bottle you avoid. One tap logs a refill and converts it into real impact: kilograms of plastic and CO₂ kept out of the environment and money saved. It has streaks, badges, and levels for motivation; a live map of nearby water fountains from OpenStreetMap; friend challenges with leaderboards; a community-wide counter; shareable impact cards; and a daily education hub. It works as an installable web app and as native Android/iOS apps from one codebase, online or offline.

**What technologies did you use, and what did you learn?**
> The app is built with React and Vite, styled with Tailwind CSS, with Supabase (PostgreSQL) for accounts and cloud sync, a Python serverless function for the impact-equivalents engine, Leaflet with OpenStreetMap for the map, and Capacitor to package the same code as native Android and iOS apps. Everything runs on free tiers.
>
> The biggest lesson was debugging: my progress silently stopped saving, and the cause turned out to be a database rule that only returns 1,000 rows per query. I learned to reproduce a bug and gather evidence before assuming a fix, and to page through data instead of trusting defaults. I also learned real-world skills like row-level security, offline caching strategies, and shipping to an actual phone.

**Who is your app for?**
> Anyone who wants to cut plastic waste — starting with students. Schools have refill stations everywhere; BottleZero makes using them a game. It needs no sign-up to start, works offline, and is free.

---

## Pre-submission checklist

- [ ] Register at appchallenge.us for your district (you enter [your district, NC-__])
- [ ] Video recorded, under the time limit, audio clear
- [ ] Video uploaded (YouTube unlisted works) and link tested in an incognito window
- [ ] Written answers personalized — no placeholder brackets left
- [ ] Live app tested at bottlezero.vercel.app right before submitting
- [ ] Run `supabase/community_stats.sql` in the Supabase SQL editor so the community counter is live for the demo
- [ ] Parent/guardian consent form (required if under 18)
- [ ] Submitted before your district's deadline — don't wait for the last day
