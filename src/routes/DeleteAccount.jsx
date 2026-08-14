import PageHeader from '../components/PageHeader'

export default function DeleteAccount() {
  return (
    <div className="max-w-xl mx-auto px-4 py-5 pb-10 flex flex-col gap-5">
      <PageHeader title="Delete Your Data or Account" subtitle="BottleZero, by Ary5272" />

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
        <h2 className="text-sm font-semibold text-ink">Delete your entire account</h2>
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
          and any challenges you created or joined are permanently deleted from BottleZero's
          database. This cannot be undone.
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
