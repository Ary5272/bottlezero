# Build the BottleZero Android app (.apk) — step by step

A complete beginner walkthrough. You only need **Android Studio** — it includes the
correct Java and the Android SDK, so you don't have to install or fix anything else.

Your Android project lives here:
`C:\Users\Kids\OneDrive\Desktop\CLAUDE SANDBOX\bottlezero\android`

---

## 1. Install Android Studio (one time, free)

1. Go to **https://developer.android.com/studio**
2. Download and run the installer. Click **Next** through everything (keep the defaults).
3. On first launch it runs a **Setup Wizard** — choose **Standard**, accept the
   licenses, and let it download the SDK components (a few minutes).

> This bundles its own Java (JBR), so ignore your system's Java 25 — it isn't used here.

## 2. Open the project

1. On the Android Studio welcome screen, click **Open** (not "New Project").
2. Navigate to and select this folder (the `android` one):
   `...\CLAUDE SANDBOX\bottlezero\android`
3. Click **OK**. Android Studio opens and starts a **Gradle sync** (bottom status bar).
   The first sync downloads dependencies — **let it finish** (can take 2–10 min).

If a yellow bar says something like *"Install missing SDK package(s): Android SDK
Platform 36"*, click **Install** / **Accept** and let it download. Sync again if asked.

## 3. Build the APK

1. Top menu: **Build → Build App Bundle(s) / APK(s) → Build APK(s)**.
2. Wait for the build (first one is the slowest). A notification appears:
   **"APK(s) generated successfully."**
3. Click **locate** in that notification — or find the file yourself at:
   `...\bottlezero\android\app\build\outputs\apk\debug\app-debug.apk`

That `app-debug.apk` **is your Android app.**

## 4. Put it on a phone

1. Copy `app-debug.apk` to an Android phone (email it to yourself, Google Drive, or USB).
2. On the phone, tap the file. Android will ask to allow installing from this source —
   approve it (Settings → "Install unknown apps" for your browser/Files app).
3. Tap **Install**. BottleZero appears in the app drawer with its droplet icon. 🎉

---

## Troubleshooting

- **"SDK location not found":** Android Studio → **Tools → SDK Manager**, note the
  *Android SDK Location*, and make sure **Android 16 (API 36)** is checked under
  *SDK Platforms*. Click Apply to install, then re-sync.
- **Gradle sync fails / Java error:** Settings → **Build, Execution, Deployment →
  Build Tools → Gradle**, set **Gradle JDK** to the bundled **"jbr-..." (JetBrains
  Runtime)**. Re-sync.
- **Slow first build:** normal — it's downloading Gradle + libraries once. Later builds
  are fast.

## After you change the app's code later

Rebuild the web app and re-sync, then build the APK again:

```bash
npm run build
npx cap sync android
```

## Note: debug vs. Play Store

`app-debug.apk` is perfect for installing on your own phone and showing people. To put
it on the **Google Play Store**, you'd create a **signed release** build (Build →
Generate Signed Bundle / APK → Android App Bundle) and pay the one-time **$25**
Play Developer fee.
