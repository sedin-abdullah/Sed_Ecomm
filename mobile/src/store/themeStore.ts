import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { colorScheme } from 'nativewind';

export type ThemeName = 'light' | 'dark';
const STORAGE_KEY = 'app-theme';

interface ThemeState {
  theme: ThemeName;
  hydrated: boolean;
  setTheme: (t: ThemeName) => void;
  toggle: () => void;
  hydrate: () => Promise<void>;
}

/** App-wide light/dark theme. Persisted in SecureStore and mirrored to
 *  NativeWind's colorScheme so `dark:` variants stay in sync. */
export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'dark',
  hydrated: false,
  setTheme: (theme) => {
    colorScheme.set(theme);
    void SecureStore.setItemAsync(STORAGE_KEY, theme);
    set({ theme });
  },
  toggle: () => get().setTheme(get().theme === 'dark' ? 'light' : 'dark'),
  hydrate: async () => {
    let theme: ThemeName = 'dark';
    try {
      const stored = await SecureStore.getItemAsync(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') theme = stored;
    } catch {
      // fall back to dark
    }
    colorScheme.set(theme);
    set({ theme, hydrated: true });
  },
}));
