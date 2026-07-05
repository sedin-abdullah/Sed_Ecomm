# Sed_Ecomm Mobile (React Native + Expo)

Premium dark-glassmorphism e-commerce app for **Android + iOS + tablets**, built with
**Expo + TypeScript**. It reuses the **existing Sed_Ecomm backend, MongoDB, auth,
coupons, orders, cart, wishlist, and product management** — no new backend.

## Tech stack (all free)

| Concern | Choice |
|---|---|
| Framework | Expo (React Native) + TypeScript |
| State / data | Zustand + TanStack React Query |
| Navigation | React Navigation (native-stack + bottom-tabs) |
| Styling | NativeWind (Tailwind for RN) |
| Animation | React Native Reanimated + Gesture Handler |
| Images | expo-image (caching + blurhash) |
| Auth token | expo-secure-store (JWT) |
| i18n | i18next + react-i18next (9 languages) |
| Notifications | expo-notifications (Expo push — free) |
| Builds | Expo EAS Build (APK / AAB / iOS) |

## Project structure

```
mobile/
├── App.tsx                 # providers, auth hydration, navigation container
├── app.json                # Expo config (icon, splash, versioning, plugins, apiUrl)
├── eas.json                # EAS build profiles (preview=APK, production=AAB)
├── src/
│   ├── components/         # GlassCard, Button, ProductCard, FlashSaleRail, ...
│   ├── screens/            # Home, Products, ProductDetail, Cart, Wishlist,
│   │                       # Checkout, Payment, Orders, OrderDetail, Profile, Search, auth
│   ├── navigation/         # RootNavigator, TabNavigator, AuthNavigator, types
│   ├── services/           # api client + auth/products/cart/wishlist/orders/notifications
│   ├── hooks/              # React Query hooks (products, cart, wishlist, orders, auth)
│   ├── store/              # authStore (SecureStore), uiStore (badges), queryClient
│   ├── i18n/               # i18next setup, 9-language resources, product translation
│   ├── constants/          # theme (colors/gradients), config (API_URL)
│   ├── types/              # shared API types (mirror backend)
│   └── assets/             # icon / splash / notification-icon (replace placeholders)
```

## 1. Point the app at your backend  ← do this first

A phone / installed APK **cannot** reach `localhost`. Set the API base URL:

- **Local testing (Expo Go, same wi-fi):** your computer's LAN IP, e.g.
  `http://192.168.1.10:5001/api/v1` — edit `expo.extra.apiUrl` in `app.json`
  (find your IP with `ipconfig getifaddr en0` on macOS).
- **Shareable APK (anyone, anywhere):** your **publicly deployed** backend, e.g.
  `https://sed-ecomm-server.onrender.com/api/v1`. Deploy `Sed_Ecomm_Server` first
  (see `docs/DEPLOYMENT.md`).

You can also set `EXPO_PUBLIC_API_URL` as an env var (takes precedence).

> Native apps don't enforce CORS, so no server CORS change is needed.

## 2. Run it

```bash
cd mobile
npm install
npx expo start          # scan the QR with Expo Go (Android/iOS)
```

Demo logins (from the backend seed): `admin@sedecomm.com / Admin@123`,
`demo@sedecomm.com / Demo@123`.

## 3. Build an installable APK / AAB / iOS

See **`docs/BUILD_APK.md`** for step-by-step EAS instructions. Short version:

```bash
npm i -g eas-cli
eas login                      # your free Expo account
eas build:configure            # fills expo.extra.eas.projectId
npm run build:apk              # -> installable .apk (share via WhatsApp/Drive/etc.)
npm run build:aab              # -> .aab for Google Play
npm run build:ios              # -> iOS build (needs Apple Developer account to install)
```

## Features

Auth (login/register/forgot + JWT + dummy OTP at payment) · Home (hero, categories,
flash sale, trending, new arrivals, best sellers, recommended) · product listing &
detail (image slider, variants, related) · search with suggestions · cart (qty,
coupon apply/remove, live tax/shipping/total) · wishlist (sync + move to cart) ·
checkout + dummy payment (card/UPI/wallet/netbanking/COD → OTP → success) · orders
(history, tracking, cancel) · profile + address management · 9-language UI **and**
translated product names/descriptions/categories · push notifications · offline-friendly
image + query caching.
