import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { useAuth } from '../state/AuthContext'
import { useApp } from '../state/AppContext'

export default function DeleteAccount() {
  const { user, isSupabaseEnabled, deleteAccount } = useAuth()
  const { clearDeviceData } = useApp()
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [deleted, setDeleted] = useState(false)
  const signedIn = isSupabaseEnabled && !!user

  async function handleDelete() {
    setBusy(true)
    setError('')
    try {
      await deleteAccount()
      clearDeviceData()
      setDeleted(true)
    } catch {
      setError("Couldn't delete your account right now. Check your connection and try again, or email us using the steps below.")
    } finally {
      setBusy(false)
      setConfirming(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-5 pb-10 flex flex-col gap-5">
      <PageHeader title="Delete Your Data or Account" subtitle="BottleZero, by Ary5272" />

      <section className="bg-surface rounded-2xl border border-line p-4 flex flex-col gap-2.5">
        <h2 className="text-sm font-semibold text-ink">Delete your entire account</h2>
        {deleted ? (
          <p className="text-[13px] text-muted leading-relaxed" role="status">
            Your account has been deleted, along with everything in it, and the copy saved on this
            device has been cleared. You can keep using BottleZero without an account, or make a new
            one anytime.
          </p>
        ) : signedIn ? (
          <>
            <p className="text-[13px] text-muted leading-relaxed">
              You're signed in as <strong className="text-ink font-medium">{user.email}</strong>.
              Deleting your account happens right away and also clears the copy saved on this device.
            </p>
            {confirming ? (
              <div className="border border-warn/30 rounded-xl p-3 flex flex-col gap-2">
                <p className="text-[13px] text-muted">
                  This permanently deletes your account, every bottle you've logged, your fountain
                  ratings, and any challenges you created. This can't be undone.
                </p>
                <div className="flex gap-2">
                  <button onClick={handleDelete} disabled={busy}
                    className="bg-warn text-white py-1.5 px-4 rounded-lg text-sm font-medium cursor-pointer disabled:opacity-50">
                    {busy ? 'Deleting…' : 'Delete forever'}
                  </button>
                  <button onClick={() => setConfirming(false)} disabled={busy}
                    className="py-1.5 px-4 rounded-lg text-sm text-muted hover:bg-canvas cursor-pointer disabled:opacity-50">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setConfirming(true)}
                className="self-start bg-warn text-white py-1.5 px-4 rounded-lg text-sm font-medium cursor-pointer">
                Delete my account
              </button>
            )}
            {error && <p className="text-xs text-warn" role="alert">{error}</p>}
          </>
        ) : (
          <p className="text-[13px] text-muted leading-relaxed">
            The fastest way is inside the app: <Link to="/auth" className="text-accent font-medium">sign in</Link>,
            then go to <strong className="text-ink font-medium">Profile → Delete my account</strong> and
            tap <strong className="text-ink font-medium">Delete my account</strong>. It happens right away.
          </p>
        )}
      </section>

      <section className="bg-surface rounded-2xl border border-line p-4 flex flex-col gap-2.5">
        <h2 className="text-sm font-semibold text-ink">Delete some data, keep your account</h2>
        <p className="text-[13px] text-muted leading-relaxed">
          You don't need to delete your whole account to clear your data — this works instantly,
          with no waiting period and no email required.
        </p>
        <ol className="text-[13px] text-muted leading-relaxed list-decimal pl-4 flex flex-col gap-1.5">
          <li>Open BottleZero and go to the <strong className="text-ink font-medium">Profile</strong> tab.</li>
          <li>Scroll to the bottom and tap <strong className="text-ink font-medium">Reset all data</strong>, then confirm.</li>
          <li>
            This immediately and permanently deletes every bottle you've logged from our database.
            Your account, email, display name, and daily goal setting are kept and unaffected.
          </li>
        </ol>
      </section>

      <section className="bg-surface rounded-2xl border border-line p-4 flex flex-col gap-2.5">
        <h2 className="text-sm font-semibold text-ink">Or ask us to delete it by email</h2>
        <p className="text-[13px] text-muted leading-relaxed">
          If you can't sign in or no longer have the app, you can request deletion instead.
        </p>
        <ol className="text-[13px] text-muted leading-relaxed list-decimal pl-4 flex flex-col gap-1.5">
          <li>
            Email{' '}
            <a href="mailto:sim89892@gmail.com?subject=Delete%20my%20BottleZero%20account" className="text-accent font-medium">
              sim89892@gmail.com
            </a>{' '}
            from the email address on your BottleZero account, with the subject line "Delete my account."
          </li>
          <li>Include the email address your BottleZero account uses, if it's different from the one you're writing from.</li>
          <li>Your account and its data will be deleted within 30 days, and you'll get a confirmation reply once it's done.</li>
        </ol>
      </section>

      <section className="bg-surface rounded-2xl border border-line p-4 flex flex-col gap-2.5">
        <h2 className="text-sm font-semibold text-ink">What gets deleted</h2>
        <p className="text-[13px] text-muted leading-relaxed">
          Your account, email address, display name, every bottle you've logged, your daily goal,
          your fountain ratings, and any challenges you created or joined are permanently deleted
          from BottleZero's database. This cannot be undone.
        </p>
      </section>

      <section className="bg-surface rounded-2xl border border-line p-4 flex flex-col gap-2.5">
        <h2 className="text-sm font-semibold text-ink">What isn't affected</h2>
        <p className="text-[13px] text-muted leading-relaxed">
          The app-wide community counter shown on the home screen is an aggregate total that
          doesn't identify any individual user, so it isn't reduced when an account is deleted.
          Data saved only on your own device (device-only mode, no account) was never sent to us
          in the first place — you can already clear that yourself anytime from
          Profile → Reset all data, with no waiting period.
        </p>
      </section>
    </div>
  )
}
