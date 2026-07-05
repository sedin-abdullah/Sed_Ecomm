import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { setAccessToken as setApiToken, registerAuthFailureHandler } from '@/services/api';
import * as authService from '@/services/auth';
import type { User } from '@/types';

const TOKEN_KEY = 'sed_ecomm_token';
const USER_KEY = 'sed_ecomm_user';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  hydrated: boolean;
  setSession: (user: User, token: string) => Promise<void>;
  setUser: (user: User) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  hydrated: false,

  setSession: async (user, token) => {
    setApiToken(token);
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  setUser: async (user) => {
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    set({ user });
  },

  logout: async () => {
    setApiToken(null);
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
    set({ user: null, token: null, isAuthenticated: false });
  },

  // On launch: restore the persisted user, then re-mint a fresh access token
  // from the refresh cookie and resync the user to match it (prevents a stale
  // role/token mismatch — same guarantee as the web app).
  hydrate: async () => {
    try {
      const [storedToken, storedUser] = await Promise.all([
        SecureStore.getItemAsync(TOKEN_KEY),
        SecureStore.getItemAsync(USER_KEY),
      ]);
      if (storedToken && storedUser) {
        const user = JSON.parse(storedUser) as User;
        setApiToken(storedToken);
        set({ user, token: storedToken, isAuthenticated: true });
        const refreshed = await authService.refreshSession();
        if (refreshed?.accessToken) {
          setApiToken(refreshed.accessToken);
          set({ token: refreshed.accessToken });
          if (refreshed.user) await get().setUser(refreshed.user);
        }
      }
    } catch {
      await get().logout();
    } finally {
      set({ hydrated: true });
    }
  },
}));

// When a token refresh ultimately fails, force logout so the UI reacts.
registerAuthFailureHandler(() => {
  void useAuthStore.getState().logout();
});
