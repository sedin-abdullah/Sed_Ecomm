import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { gradients } from '@/constants/theme';

/** Premium near-black navy gradient backdrop used on every screen. */
export function GradientBackground({ children }: { children: ReactNode }) {
  return (
    <LinearGradient colors={gradients.background} style={{ flex: 1 }}>
      <View className="flex-1">{children}</View>
    </LinearGradient>
  );
}
