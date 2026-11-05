#!/usr/bin/env bash
# Build and run on a REAL iPhone with a free (personal) Apple developer team.
#
# Personal teams cannot sign "Sign in with Apple" or "Push Notifications", so this
# regenerates the iOS project and removes those two entitlements. Everything else in
# the app works; Apple sign-in and push notifications are unavailable in this build.
# With a paid Apple Developer Program account, use `npx expo run:ios --device` instead.
#
# Usage: npm run ios:free-team   (macOS only)
set -euo pipefail
cd "$(dirname "$0")/.."

npx expo prebuild -p ios --clean

shopt -s nullglob
files=(ios/*/*.entitlements)
if [ ${#files[@]} -eq 0 ]; then echo "No .entitlements file found under ios/"; exit 1; fi
for f in "${files[@]}"; do
  for key in aps-environment com.apple.developer.applesignin; do
    /usr/libexec/PlistBuddy -c "Delete :$key" "$f" 2>/dev/null && echo "Removed $key from $f" || true
  done
done

echo
echo "Next: Xcode → open ios/*.xcworkspace → target → Signing & Capabilities → Team = your personal team."
echo "If it says the bundle ID is taken, change it there (e.g. app.settleingermany.<yourname>)."
echo
npx expo run:ios --device
