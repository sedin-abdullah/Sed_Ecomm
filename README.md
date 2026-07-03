# Sed_Ecomm

Full-stack e-commerce app — React/TypeScript/Vite frontend, Node/Express/TypeScript/MongoDB backend, dummy payment gateway, i18n (12 languages), PWA-ready.

```
Sed_Ecomm/
  client/   React + Vite + Tailwind frontend        → http://localhost:5173
  server/   Express + TypeScript + MongoDB backend   → http://localhost:5000/api/v1
  docs/     API_CONTRACT.md, PAYMENT_SPEC.md
```

## 1. Backend setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `server/.env` and set:
- `MONGODB_URI` — your MongoDB Atlas connection string (Atlas → Database → Connect → Drivers)
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` — any long random strings

```bash
npm run seed   # creates categories, ~100 products, coupons, an admin user + demo customer
npm run dev    # http://localhost:5000/api/v1/health
```

Seeded accounts:
- Admin: `admin@sedecomm.com` / `Admin@123`
- Customer: see seed output for the demo customer's credentials

## 2. Frontend setup

```bash
cd client
npm install
cp .env.example .env   # VITE_API_URL=http://localhost:5000/api/v1
npm run dev             # http://localhost:5173
```

## 3. What's implemented

- Auth (register/login/logout/forgot/reset, JWT access+refresh, protected routes)
- Product catalog: listing with filters/sort/search, detail with variants/reviews, categories
- Cart, wishlist, coupons, save-for-later
- Checkout → dummy payment gateway (card/UPI/net banking/wallet/COD, OTP `123456`) → order confirmation
- Orders: list, detail, tracking timeline, cancel, return, invoice
- Admin dashboard: sales summary, best sellers, manage products/orders/customers/coupons
- 12 languages (en, ta, hi, ar, fr, de, es, zh, ja, ml, te, kn) with RTL for Arabic, currency auto-switch by language
- Light/dark theme, responsive 320px–1920px, PWA manifest + service worker

## 4. Deployment (when you're ready)

- **Frontend → Vercel**: import the repo, set root directory to `client`, add env var `VITE_API_URL` pointing to your deployed backend.
- **Backend → Render**: new Web Service, root directory `server`, build command `npm install && npm run build`, start command `npm start`, add all vars from `server/.env.example` (with `CLIENT_URL` set to your Vercel domain).
- **Database → MongoDB Atlas**: already free-tier — just whitelist Render's IP (or `0.0.0.0/0` for simplicity) in Atlas Network Access.

Full API reference: [docs/API_CONTRACT.md](docs/API_CONTRACT.md). Dummy payment flow details: [docs/PAYMENT_SPEC.md](docs/PAYMENT_SPEC.md).
