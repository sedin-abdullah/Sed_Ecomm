# Sed_Ecomm — Full Project Documentation

A complete e-commerce platform: **web app + mobile app + backend API + database**, all on **free tiers**. This document explains the entire tech stack, the API, the database, and **step-by-step how to run and host everything** (Vercel + Render). Anyone can follow this from scratch.

---

## 1. What this project is

- A premium dark-themed shopping platform (Apple × Linear style) with products, cart, wishlist, coupons, checkout, a dummy payment flow, orders + tracking, an admin panel, and 9-language support.
- **One backend + one database** serve **both** the web app and the mobile app — no duplicated logic.

### Architecture (high level)

```
                ┌─────────────────────┐
   Web (Vercel) │  React + Vite (SPA)  │┐
                └─────────────────────┘│
                                        │   HTTPS / REST (JSON, JWT)
   Mobile (APK)  ┌─────────────────────┐│      ┌──────────────────────┐      ┌───────────────────┐
   Android/iOS   │ React Native + Expo ││───▶ │  Node/Express API     │────▶│  MongoDB Atlas    │
                └─────────────────────┘┘      │  (Render web service) │      │  (cloud database) │
                                               └──────────────────────┘      └───────────────────┘
```

### The three repositories

| Repo | Contents | Hosted on |
|---|---|---|
| `Sed_Ecomm_Client` | Web frontend (React/Vite) | **Vercel** |
| `Sed_Ecomm_Server` | Backend API (Node/Express) | **Render** |
| `Sed_Ecomm_Mobile` | Mobile app (React Native/Expo) | Built to **APK** via EAS |
| `Sed_Ecomm` | Monorepo (all three, for reference) | GitHub only |

---

## 2. Tech stack

### Backend (`server/`)
- **Node.js + Express** (REST API), **TypeScript**
- **MongoDB** via **Mongoose** (ODM)
- **JWT auth** (access token + httpOnly refresh cookie), **bcrypt** password hashing
- **Zod** request validation, **Helmet** + **CORS** + **express-rate-limit** security
- **Multer** for image uploads
- MVC-ish layout: `routes → controllers → services → models`

### Web frontend (`client/`)
- **React 18 + Vite + TypeScript**
- **React Router** (routing), **TanStack React Query** (server state), **Zustand** (auth/UI state)
- **Tailwind CSS** (theming via CSS variables), **Framer Motion** (animations)
- **i18next** (9 languages), **Axios** (API client), **Vitest** (tests)

### Mobile app (`mobile/`)
- **React Native + Expo + TypeScript**
- **React Navigation** (stack + bottom tabs), **React Query** + **Zustand**
- **NativeWind** (Tailwind for RN), **Reanimated** (animations), **expo-image**
- **expo-secure-store** (JWT storage), **i18next**, **expo-notifications**
- **EAS Build** → APK / AAB / iOS

### Database
- **MongoDB Atlas** (free M0 cluster) — collections: users, products, categories, carts, wishlists, coupons, orders, payments, addresses, reviews, emaillogs.

### Hosting (all free tier)
- **Vercel** — web frontend
- **Render** — backend API
- **MongoDB Atlas** — database
- **Expo EAS** — mobile builds

---

## 3. Prerequisites (install once)

- **Node.js 18+** and **npm** — https://nodejs.org
- **Git** + a **GitHub** account
- A **MongoDB Atlas** account (free) — https://www.mongodb.com/atlas
- A **Vercel** account (free) — https://vercel.com
- A **Render** account (free) — https://render.com
- An **Expo** account (free) — https://expo.dev (for mobile builds)
- (Mobile) **Expo Go** app on your phone for testing; **eas-cli**: `npm i -g eas-cli`

---

## 4. Database — MongoDB Atlas setup

1. Create a free account → **Build a Database** → **M0 (free)** → pick a cloud/region → create.
2. **Database Access** → Add a database user (username + password). Save these.
3. **Network Access** → **Add IP Address** → `0.0.0.0/0` (allow from anywhere — needed so Render can connect).
4. **Connect → Drivers** → copy the connection string. It looks like:
   ```
   mongodb+srv://<user>:<password>@<cluster>.mongodb.net/sed_ecomm?retryWrites=true&w=majority
   ```
   Replace `<user>`/`<password>`, and keep `/sed_ecomm` as the database name.
5. You'll paste this as `MONGODB_URI` in the backend env.

---

## 5. Backend — run locally

```bash
cd server
cp .env.example .env          # then edit .env (see below)
npm install
npm run seed                  # populates demo products, categories, coupons, users
npm run dev                   # starts on http://localhost:5001
```

### `server/.env`
```
PORT=5001
NODE_ENV=development
MONGODB_URI=<your Atlas connection string>
JWT_ACCESS_SECRET=<any long random string>
JWT_REFRESH_SECRET=<a different long random string>
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Check it's up: open `http://localhost:5001/api/v1/health` → `{"success":true,"message":"ok"}`.

### Demo logins (created by the seed)
- **Admin:** `admin@sedecomm.com` / `Admin@123`
- **Customer:** `demo@sedecomm.com` / `Demo@123`

---

## 6. Web frontend — run locally

```bash
cd client
cp .env.example .env          # set VITE_API_URL (below)
npm install
npm run dev                   # http://localhost:5173
```

### `client/.env`
```
VITE_API_URL=http://localhost:5001/api/v1
```

Build check: `npm run build` (outputs `dist/`). Tests: `npm run test`.

---

## 7. Mobile app — run locally (Expo Go, free)

```bash
cd mobile
npm install
npx expo start                # scan the QR with Expo Go
```

- Set the backend URL in `mobile/app.json` → `expo.extra.apiUrl`.
  - **Local testing (Expo Go, same Wi-Fi):** your computer's LAN IP, e.g. `http://192.168.1.9:5001/api/v1` (find it with `ipconfig getifaddr en0` on macOS).
  - **Shareable build:** your deployed backend, e.g. `https://sed-ecomm-server.onrender.com/api/v1`.
- Phone and computer must be on the **same Wi-Fi** for LAN testing. If it won't connect, use `npx expo start --tunnel`.

---

## 8. Deploy the BACKEND to Render (point-wise)

The repo includes `server/render.yaml` (a blueprint), so most of this is automatic.

1. Push `Sed_Ecomm_Server` to GitHub (already done if using the repos above).
2. Go to **render.com** → sign up / log in (GitHub login is easiest).
3. **New → Blueprint** → connect GitHub → select **`Sed_Ecomm_Server`** (NOT the mobile repo).
4. Branch: `main`, Blueprint Path: `render.yaml`. Give it a name (e.g. `sed-ecomm`) → **Apply**.
5. When prompted, fill the **secret env vars**:
   | Key | Value |
   |---|---|
   | `MONGODB_URI` | your Atlas connection string |
   | `JWT_ACCESS_SECRET` | any long random string |
   | `JWT_REFRESH_SECRET` | a different long random string |
   (`NODE_ENV`, JWT expiries, `CLIENT_URL` come from the blueprint.)
6. In **MongoDB Atlas → Network Access**, ensure `0.0.0.0/0` is allowed.
7. Wait for the service status to become **Live** (first build ~3–5 min). Logs should show `Sed_Ecomm API listening…` and `MongoDB connected`.
8. Your URL is like `https://sed-ecomm-server.onrender.com`. Test `…/api/v1/health` → `ok`.
9. Back in the service → **Environment**, set `PUBLIC_URL` = your Render URL (so uploaded image links resolve) → it redeploys.

> **Free-tier note:** Render free services **sleep after ~15 min idle**; the first request afterward takes ~50s to wake, then it's fast. Seed once (locally against the same `MONGODB_URI`) — no need to reseed on Render.

**Manual (no blueprint) alternative:** New → Web Service → connect repo → Build `npm install --include=dev && npm run build` → Start `npm start` → add the env vars above.

---

## 9. Deploy the WEB app to Vercel (point-wise)

1. Push `Sed_Ecomm_Client` to GitHub.
2. Go to **vercel.com** → **Add New → Project** → import `Sed_Ecomm_Client`.
3. Framework preset: **Vite** (auto-detected). Build: `npm run build`, Output: `dist`.
4. **Environment Variables** → add:
   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://sed-ecomm-server.onrender.com/api/v1` (your Render URL) |
5. **Deploy.** You get a URL like `https://sed-ecomm-client.vercel.app`.
6. SPA routing is handled by `vercel.json` (rewrites all paths to `index.html`).
7. Update the backend's `CLIENT_URL` env (on Render) to this Vercel URL so browser CORS is allowed → redeploy backend.

Every `git push` to `main` auto-redeploys on Vercel.

---

## 10. Build & share the MOBILE APK (point-wise)

Prereq: `npm i -g eas-cli`, a free Expo account.

1. Point the app at the **deployed** backend: `mobile/app.json` → `extra.apiUrl` = `https://sed-ecomm-server.onrender.com/api/v1`.
2. Log in + init:
   ```bash
   cd mobile
   eas login
   eas init            # creates the EAS project, writes extra.eas.projectId
   ```
3. Build the APK:
   ```bash
   npm run build:apk   # = eas build -p android --profile preview
   ```
   When asked "Generate a new Android Keystore?" → **Yes**.
4. EAS builds in the cloud (~10–20 min) → gives a **build page + download link**.
5. **Download the `.apk`** from the build page.
6. **Share it permanently via a GitHub Release:**
   - `Sed_Ecomm_Mobile` → **Releases → Create a new release** → tag `v1.0.0` → attach the `.apk` → **Publish**.
   - Share the release's download link — it never expires.
   - (Or upload the `.apk` to Google Drive with "anyone with the link".)
7. **Recipient (Android):** open the link → download `.apk` → tap → allow "install from unknown source" → Install → open → log in.

### Other mobile build targets
- **AAB (Google Play):** `npm run build:aab`
- **iOS Simulator (Mac + Xcode, free, no Apple account):** `npm run build:ios-sim` then `eas build:run -p ios`
- **iOS on real iPhones:** needs a paid **Apple Developer account ($99/yr)** + TestFlight (`eas build -p ios --profile production` → `eas submit -p ios`).

### Platform reality
| Target | Free? | Shareable to anyone? |
|---|---|---|
| Android APK | ✅ | ✅ (link/file) |
| Android emulator | ✅ | ✅ (drag APK / `adb install`) |
| iOS Simulator | ✅ | ❌ Mac devs only |
| Real iPhone | ❌ ($99/yr) | ✅ via TestFlight |

> An APK **cannot** run on an iOS Simulator, and an iOS build can't run on Android — they're different platforms.

---

## 11. API reference

**Base URL** (prepend to every path below):

| Environment | Base URL |
|---|---|
| **Production** | `https://sed-ecomm-server.onrender.com/api/v1` |
| **Local** | `http://localhost:5001/api/v1` |

So a login call is `POST https://sed-ecomm-server.onrender.com/api/v1/auth/login`.

All responses are JSON: `{ success, data?, message?, errors? }`. Protected routes need the header `Authorization: Bearer <accessToken>` (get `accessToken` from the login/register response); admin routes also require an admin account.

```bash
# 1) Log in and grab the token
curl -X POST https://sed-ecomm-server.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sedecomm.com","password":"Admin@123"}'
# 2) Call a protected route
curl https://sed-ecomm-server.onrender.com/api/v1/auth/me \
  -H "Authorization: Bearer <accessToken>"
```

### Auth — `/auth`
| Method | Path | Purpose |
|---|---|---|
| POST | `/auth/register` | Create account → `{ user, accessToken }` (+ refresh cookie) |
| POST | `/auth/login` | Log in → `{ user, accessToken }` |
| POST | `/auth/logout` | Clear refresh cookie |
| POST | `/auth/refresh-token` | New access token (+ user) from refresh cookie |
| POST | `/auth/forgot-password` | Send reset link (dummy/logged) |
| POST | `/auth/reset-password/:token` | Reset password |
| GET | `/auth/me` | Current user |

### Users / addresses — `/users`
| Method | Path | Purpose |
|---|---|---|
| GET / PATCH | `/users/me` | Get / update profile (name, phone, avatar) |
| GET / POST | `/users/addresses` | List / add address |
| PATCH / DELETE | `/users/addresses/:id` | Update / delete address |

### Products — `/products`
| Method | Path | Purpose |
|---|---|---|
| GET | `/products` | List (filters: `category, minPrice, maxPrice, rating, brand, size, color, inStock, onSale, flashSale, featured, newArrival, bestSeller, sort, search, page, limit`) |
| GET | `/products/facets` | Distinct brands/sizes/colors for filters |
| GET | `/products/search/suggest?q=` | Search suggestions |
| GET | `/products/:slug` | Product detail |
| GET | `/products/:id/related` | Related products |
| GET / POST | `/products/:id/reviews` | List / create review |
| POST / PATCH / DELETE | `/products` `/products/:id` | **Admin** create / update / delete (multipart for images) |
| POST | `/products/:id/images` | **Admin** add images |

### Categories — `/categories`
`GET /categories`, `GET /categories/:slug`; **admin** `POST/PATCH/DELETE`.

### Cart — `/cart`
| Method | Path | Purpose |
|---|---|---|
| GET | `/cart` | Get cart + totals (subtotal, discount, tax, shipping, total) |
| POST | `/cart/items` | Add item `{ productId, qty, variant }` |
| PATCH / DELETE | `/cart/items/:itemId` | Update qty / remove |
| POST | `/cart/items/:itemId/save-for-later` | Toggle save for later |
| POST | `/cart/apply-coupon` `/cart/remove-coupon` | Apply / remove coupon |

### Wishlist — `/wishlist`
`GET /wishlist`, `POST /wishlist/:productId`, `DELETE /wishlist/:productId`.

### Coupons — `/coupons`
`GET /coupons/validate/:code`; **admin** `GET /coupons`, `POST /coupons`, `PATCH /coupons/:id`, `DELETE /coupons/:id`.

### Orders — `/orders`
| Method | Path | Purpose |
|---|---|---|
| POST | `/orders` | Place order `{ items: [{ product, qty, variant? }], shippingAddress, couponCode?, paymentMethod }` |
| GET | `/orders` | Order history |
| GET | `/orders/:id` | Order detail |
| GET | `/orders/:id/track` | Status timeline |
| GET | `/orders/:id/invoice` | Invoice data |
| POST | `/orders/:id/cancel` `/orders/:id/return` | Cancel / return |

### Payments (dummy) — `/payments`
`POST /payments/initiate` `{ orderId, method, details }` → `{ paymentId, requiresOtp }`; `POST /payments/verify` `{ paymentId, otp }`. Methods: `card_credit, card_debit, upi, netbanking, wallet, cod`. Demo OTP: **123456**. Any card number is accepted (dummy gateway).

### Admin — `/admin`
`GET /admin/dashboard/summary`, `GET /admin/dashboard/best-sellers`, `GET /admin/orders`, `PATCH /admin/orders/:id/status` `{ status, note? }`, `GET /admin/customers`, `GET /admin/customers/:id`, `PATCH /admin/customers/:id/role`.

### Meta / health
`GET /api/v1/health`, `GET /meta/currency-rates`, `GET /meta/countries`.

---

## 12. Database models (collections)

| Model | Key fields |
|---|---|
| **User** | name, email, password(hashed), role(customer/admin), phone, addresses[], wishlist |
| **Product** | name, slug, brand, description, category(ref), images[], price, discountPrice, stock, rating, numReviews, variants{sizes,colors}, tags, flags(isFeatured/isFlashSale/isNewArrival/isBestSeller) |
| **Category** | name, slug, parent(ref), image |
| **Cart** | user(ref), items[{ product, variant, qty, savedForLater }], couponCode |
| **Wishlist** | user(ref), products[ref] |
| **Coupon** | code, type(percentage/flat), value, minOrderValue, maxDiscount, expiresAt, usageLimit, usedCount, isActive |
| **Order** | user, items[snapshot], shippingAddress, subtotal, discount, tax, shippingFee, total, paymentMethod, paymentStatus, status, trackingTimeline[] |
| **Payment** | order(ref), user, method, status, amount, transactionRef, requiresOtp |
| **Address** | user, fullName, phone, line1/2, city, state, postalCode, country, isDefault |
| **Review** | product, user, rating, comment, images[], likes[] |
| **EmailLog** | order, to, subject, body (dummy email record) |

> All models expose an `id` field (Mongoose `toJSON` virtuals) so the frontends can use `.id` consistently.

---

## 13. Build order for a brand-new setup (summary)

1. **MongoDB Atlas** → cluster + user + allow `0.0.0.0/0` + copy connection string.
2. **Backend** → set `.env`, `npm install`, `npm run seed`, `npm run dev`, verify `/health`.
3. **Deploy backend to Render** (blueprint + env vars) → get public URL.
4. **Web** → set `VITE_API_URL` → run locally, then **deploy to Vercel** (env var) → set backend `CLIENT_URL`.
5. **Mobile** → set `extra.apiUrl` to the Render URL → `eas login` → `eas init` → `npm run build:apk` → share via GitHub Release.

---

## 14. Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Web: no data / login fails | `VITE_API_URL` wrong, or backend `CLIENT_URL` doesn't match the web origin (CORS). |
| Render: "Not Found" on first hit | Free tier asleep — wait ~50s; or the deploy crashed (check **Logs**: missing env var / Mongo not reachable). |
| Render build fails on `tsc` | Ensure build command is `npm install --include=dev && npm run build` (TypeScript is a devDependency). |
| Mongo connection error | Atlas Network Access missing `0.0.0.0/0`, or wrong user/password in `MONGODB_URI`. |
| Mobile can't reach API | Using `localhost` (won't work on device) — use LAN IP (Expo Go) or the deployed URL (APK); or `expo start --tunnel`. |
| `eas build:configure` "Invalid UUID appId" | Remove any placeholder `extra.eas.projectId`, then run `eas init`. |
| APK install blocked | Enable "install from unknown sources" on Android. |
| iOS won't run APK | Expected — iOS needs its own build (Simulator on Mac, or TestFlight for iPhones). |

---

## 15. Free-tier limits to know

- **Render free**: sleeps after 15 min idle (~50s cold start); limited monthly hours.
- **MongoDB Atlas M0**: 512 MB storage.
- **Vercel free**: generous for a SPA.
- **Expo EAS free**: limited concurrent builds (queue), artifacts kept ~30 days (host the APK yourself for a permanent link).

---

*Same backend + database power both the web and mobile apps. Build the backend + DB first, deploy it, then point both frontends at its URL.*
