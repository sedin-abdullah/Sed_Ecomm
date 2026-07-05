import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { gradients } from '@/constants/theme';
import { useThemeStore } from '@/store/themeStore';

/** Full-screen gradient backdrop used on every screen — light or dark. */
export function GradientBackground({ children }: { children: ReactNode }) {
  const theme = useThemeStore((s) => s.theme);
  const colors = theme === 'dark' ? gradients.background : gradients.backgroundLight;
  return (
    <LinearGradient colors={colors} style={{ flex: 1 }}>
      <View className="flex-1">{children}</View>
    </LinearGradient>
  );
}
