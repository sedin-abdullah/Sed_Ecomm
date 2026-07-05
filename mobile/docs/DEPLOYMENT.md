# Deployment — making the backend reachable by the mobile app

A shareable APK needs the **existing Sed_Ecomm backend** to be publicly reachable
(a phone can't hit your `localhost`). You do **not** build a new backend — you deploy
the existing `Sed_Ecomm_Server` / monorepo `server/` as-is.

## Option A — Local testing only (fastest, no deploy)

Run the backend locally and point the app at your machine's LAN IP:

```bash
cd server && npm run dev          # listens on :5001
ipconfig getifaddr en0            # e.g. 192.168.1.10  (macOS; use ipconfig on Windows)
```
Set `app.json` → `expo.extra.apiUrl` = `http://192.168.1.10:5001/api/v1`, then
`npx expo start` and open in **Expo Go** on a phone on the **same wi-fi**. Good for
development; the app is NOT shareable this way.

## Option B — Public deploy (required for a shareable APK)

Deploy the Node/Express server to any free host. **Render** example:

1. Push `Sed_Ecomm_Server` to GitHub (already done).
2. Render → New → Web Service → connect the repo.
   - Build: `npm install && npm run build`
   - Start: `npm start`
   - Environment variables (from your `server/.env`, do NOT commit them):
     `MONGODB_URI`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`,
     `JWT_ACCESS_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`, `NODE_ENV=production`,
     `PORT` (Render sets this), `PUBLIC_URL=https://<your-service>.onrender.com`,
     `CLIENT_URL=https://<your-web-client>` (for the web app's CORS; the mobile app
     doesn't need CORS).
3. After it's live, seed once if needed: run `npm run seed` locally against the same
   `MONGODB_URI`, or add a one-off Render job.
4. Set the mobile app's API URL to `https://<your-service>.onrender.com/api/v1`
   (`app.json` → `extra.apiUrl`) and rebuild the APK.

MongoDB stays on your existing **MongoDB Atlas** cluster — no change.

## Uploaded product images

Admin-uploaded images are saved to the server's `/uploads` and served as absolute
URLs via the server's `PUBLIC_URL`. Set `PUBLIC_URL` to the deployed origin so those
image URLs resolve on the phone. (Seed/demo product images come from public CDNs and
work regardless.) For production scale, move uploads to a bucket (S3/Cloudinary) later.

## Same-everything guarantee

The mobile app calls the identical REST endpoints as the web client
(`/auth`, `/products`, `/cart`, `/wishlist`, `/orders`, `/payments`, `/coupons`,
`/users`). Business logic, auth, coupons, inventory, and the admin panel are unchanged
and shared — the phone is just another client of the same backend + database.
