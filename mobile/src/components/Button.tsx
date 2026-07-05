import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import type { ReactNode } from 'react';
import { gradients } from '@/constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props {
  onPress?: () => void;
  children: ReactNode;
  variant?: 'primary' | 'glass' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

/** Primary CTA with a press-scale micro-interaction (Reanimated). */
export function Button({ onPress, children, variant = 'primary', loading, disabled, className = '' }: Props) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const isDisabled = disabled || loading;

  const inner = (
    <View className="h-13 flex-row items-center justify-center gap-2 px-6" style={{ height: 52 }}>
      {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-base font-semibold text-white">{children}</Text>}
    </View>
  );

  return (
    <AnimatedPressable
      onPress={isDisabled ? undefined : onPress}
      onPressIn={() => (scale.value = withTiming(0.97, { duration: 120 }))}
      onPressOut={() => (scale.value = withTiming(1, { duration: 120 }))}
      style={[style, { opacity: isDisabled ? 0.55 : 1 }]}
      className={`overflow-hidden rounded-2xl ${className}`}
    >
      {variant === 'primary' ? (
        <LinearGradient colors={gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          {inner}
        </LinearGradient>
      ) : (
        <View className={variant === 'glass' ? 'border border-glass-border/10 bg-glass/[0.06]' : ''}>{inner}</View>
      )}
    </AnimatedPressable>
  );
}
