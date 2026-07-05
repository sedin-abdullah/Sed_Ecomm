import Constants from 'expo-constants';

/**
 * Base URL of the EXISTING Sed_Ecomm backend (reused as-is — no new backend).
 *
 * Resolution order:
 *  1. `EXPO_PUBLIC_API_URL` env var (set in .env / EAS build env)
 *  2. `expo.extra.apiUrl` in app.json
 *  3. a localhost fallback (simulator only)
 *
 * IMPORTANT: a physical device / installed APK cannot reach `localhost`.
 *  - Expo Go on the same wi-fi: use your machine's LAN IP, e.g. http://192.168.1.10:5001/api/v1
 *  - A shareable APK: use your PUBLICLY DEPLOYED backend, e.g. https://sed-ecomm-server.onrender.com/api/v1
 */
const extra = (Constants.expoConfig?.extra ?? {}) as { apiUrl?: string };

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? extra.apiUrl ?? 'http://localhost:5001/api/v1';

/** Dummy payment demo constants — mirror the web app. */
export const DEMO = {
  otp: '123456',
  card: { number: '4111 1111 1111 1111', expiry: '12/30', cvv: '123' },
};
