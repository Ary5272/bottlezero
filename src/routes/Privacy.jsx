import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'

export default function Privacy() {
  return (
    <div className="max-w-xl mx-auto px-4 py-5 pb-10 flex flex-col gap-5">
      <PageHeader title="Privacy Policy" subtitle="Last updated August 2026" />

      <section className="bg-surface rounded-2xl border border-line p-4 flex flex-col gap-2.5">
        <h2 className="text-sm font-semibold text-ink">Who this is</h2>
        <p className="text-[13px] text-muted leading-relaxed">
          BottleZero is an independent student project built for the Congressional App Challenge.
          It is not affiliated with any company. Questions about your data can be sent to{' '}
          <a href="mailto:sairam@raasailabs.com" className="text-accent font-medium">sairam@raasailabs.com</a>.
        </p>
      </section>

      <section className="bg-surface rounded-2xl border border-line p-4 flex flex-col gap-2.5">
        <h2 className="text-sm font-semibold text-ink">What BottleZero collects</h2>
        <p className="text-[13px] text-muted leading-relaxed">
          If you use the app without an account, everything you log stays only on your device and
          is never sent anywhere. If you create an account, BottleZero stores your email address,
          an optional display name, your daily goal, and the bottles you log (a count, a source
          like "fountain" or "store," and a timestamp) in a Supabase database so your progress can
          sync across devices. If you create or join a friend challenge, the challenge name, join
          code, and your membership in it are stored as well.
        </p>
      </section>

      <section className="bg-surface rounded-2xl border border-line p-4 flex flex-col gap-2.5">
        <h2 className="text-sm font-semibold text-ink">Location</h2>
        <p className="text-[13px] text-muted leading-relaxed">
          The map feature can use your device's location, with your permission, to find nearby
          water refill points using OpenStreetMap data. Your location is used only to load that
          map and is never stored by BottleZero or attached to your account.
        </p>
      </section>

      <section className="bg-surface rounded-2xl border border-line p-4 flex flex-col gap-2.5">
        <h2 className="text-sm font-semibold text-ink">What BottleZero does not do</h2>
        <p className="text-[13px] text-muted leading-relaxed">
          BottleZero has no ads, no ad networks, and no third-party analytics or tracking scripts.
          Your data is never sold or shared with advertisers. The only outside services involved
          are Supabase (the database, for accounts and syncing), Vercel (hosting), and OpenStreetMap
          (map data) — each only handles what's needed to make that one feature work.
        </p>
      </section>

      <section className="bg-surface rounded-2xl border border-line p-4 flex flex-col gap-2.5">
        <h2 className="text-sm font-semibold text-ink">Your choices</h2>
        <p className="text-[13px] text-muted leading-relaxed">
          You can export a copy of your data at any time from Profile → Export my data. Profile →
          Reset all data permanently deletes your logs and stats. To fully delete your account,
          see the{' '}
          <Link to="/delete-account" className="text-accent font-medium">account deletion instructions</Link>.
        </p>
      </section>

      <section className="bg-surface rounded-2xl border border-line p-4 flex flex-col gap-2.5">
        <h2 className="text-sm font-semibold text-ink">Children's privacy</h2>
        <p className="text-[13px] text-muted leading-relaxed">
          BottleZero was built by a student and is meant to be usable by students. It collects the
          minimum needed to make an account work, shows no ads, and does not use behavioral or
          targeted advertising of any kind.
        </p>
      </section>
    </div>
  )
}
