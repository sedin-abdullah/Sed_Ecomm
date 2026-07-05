import { useThemeStore } from '@/store/themeStore';
import { colors, lightColors } from '@/constants/theme';

/** Returns the JS color palette for the active theme — for props that can't
 *  take a Tailwind class (Ionicons `color`, ActivityIndicator, placeholders). */
export function useThemeColors() {
  const theme = useThemeStore((s) => s.theme);
  return theme === 'light' ? lightColors : colors;
}
