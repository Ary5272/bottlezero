#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

fail() { printf '\n\033[31m%s\033[0m\n\n' "$1"; exit 1; }
step() { printf '\n\033[32m==> %s\033[0m\n' "$1"; }

step "Checking Xcode"
xcodebuild -version >/dev/null 2>&1 || fail "Xcode isn't ready. Install Xcode from the App Store, open it once and accept the license, then run: sudo xcode-select -s /Applications/Xcode.app/Contents/Developer"

step "Checking Node.js"
command -v node >/dev/null || fail "Node.js isn't installed. Get the LTS version from https://nodejs.org and rerun this script."
node -e 'const [a,b]=process.versions.node.split(".").map(Number);process.exit(a>20||(a===20&&b>=19)?0:1)' \
  || fail "Node.js $(node -v) is too old. Install the LTS version from https://nodejs.org and rerun this script."

step "Installing packages"
npm ci

step "Building the web app"
npm run build

if [ ! -d ios ]; then
  step "Creating the iOS project"
  npx cap add ios --packagemanager SPM
fi

step "Copying the app into iOS"
npx cap sync ios

PLIST=ios/App/App/Info.plist
if ! plutil -extract NSLocationWhenInUseUsageDescription raw "$PLIST" >/dev/null 2>&1; then
  step "Adding the location permission message"
  plutil -insert NSLocationWhenInUseUsageDescription -string "BottleZero uses your location to show water refill spots near you." "$PLIST"
fi

step "Generating the app icon and splash screen"
npx @capacitor/assets generate --ios || printf '\n\033[33mIcons failed to generate. The app still builds; ask Claude to fix the icons.\033[0m\n'

step "Opening Xcode"
npx cap open ios

printf '\n\033[32mDone. In Xcode:\033[0m\n'
printf '  1. Click "App" in the left sidebar, then the "Signing & Capabilities" tab\n'
printf '  2. Under Team, click "Add an Account" and sign in with an Apple ID\n'
printf '  3. Pick an iPhone simulator at the top of the window and press the Play button\n\n'
