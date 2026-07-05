# Build & Distribute — APK, AAB, iOS

The actual binaries are produced by **Expo EAS Build** (Expo's free cloud) or a local
Android/iOS toolchain. This repo is already configured for both — you just run the
commands with your own free Expo account.

---

## Prerequisites (one time)

1. Create a free Expo account: https://expo.dev/signup
2. Install the CLI and log in:
   ```bash
   npm install -g eas-cli
   eas login
   ```
3. From `mobile/`, link the project (writes `expo.extra.eas.projectId` in `app.json`):
   ```bash
   cd mobile
   eas build:configure
   ```
4. **Set the production API URL** in `app.json` → `expo.extra.apiUrl` to your
   **publicly deployed** backend (see `DEPLOYMENT.md`). A shareable APK must not
   point at `localhost` or a LAN IP.

---

## Android APK (installable, shareable)  ← what you asked for

```bash
npm run build:apk        # = eas build -p android --profile preview
```

- EAS builds in the cloud (~10–20 min) and prints a **download URL**.
- Download the `.apk`, then share it via **WhatsApp / Telegram / Email / Google Drive**.
- Anyone can install it: open the file on Android → allow "Install from unknown
  sources" → Install → open. No coding needed.

The `preview` profile is configured for APK output in `eas.json`:
```json
"preview": { "distribution": "internal", "android": { "buildType": "apk" } }
```

## Android AAB (for Google Play)

```bash
npm run build:aab        # = eas build -p android --profile production
```
Produces an `.aab` (App Bundle) — the format Google Play requires. `production`
auto-increments `versionCode`.

## iOS build

```bash
npm run build:ios        # = eas build -p ios --profile production
```
- Requires a **paid Apple Developer account ($99/yr)** to install on real devices or
  submit to the App Store. EAS manages signing credentials for you.
- For free on-device testing without a paid account, use **Expo Go** (`npx expo start`)
  or an iOS Simulator build (`eas build -p ios --profile preview` with a simulator profile).

---

## App icon & splash

Replace the placeholder solid-color images in `src/assets/` with your real artwork,
keeping the same filenames/sizes:

| File | Size | Purpose |
|---|---|---|
| `icon.png` | 1024×1024 | App icon (iOS + Android) |
| `adaptive-icon.png` | 1024×1024 | Android adaptive foreground |
| `splash.png` | ~1284×1284 (or taller) | Launch screen |
| `notification-icon.png` | 96×96, white on transparent | Android notification |

No code change needed — paths are already wired in `app.json`.

## Version management

Bump before each store release in `app.json`:
- `expo.version` — user-facing (e.g. `1.0.1`)
- `expo.ios.buildNumber` and `expo.android.versionCode` — the `production` profile
  auto-increments `versionCode`; set others manually or use `"autoIncrement": true`.

## Build management / tips

- `eas build:list` — see all past builds + download links.
- `eas build --platform all` — Android + iOS in one command.
- Env per build: put secrets in EAS (`eas secret:create`) or `EXPO_PUBLIC_*` vars;
  the app reads `EXPO_PUBLIC_API_URL` if set, else `app.json`'s `extra.apiUrl`.
- OTA JS updates (no rebuild) later via `eas update` + `expo-updates`.

## Play Store / App Store readiness

The project is structured so publishing needs **no refactor** — only store assets +
accounts:
- Google Play: upload the `.aab`, add store listing, use `eas submit -p android`.
- App Store: paid Apple account, `eas submit -p ios`.
- Both bundle IDs are already set: `com.sedecomm.app`.
