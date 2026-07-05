import { Text, TextInput, View, type TextInputProps } from 'react-native';
import { colors } from '@/constants/theme';

export function TextField({ label, ...props }: TextInputProps & { label?: string }) {
  return (
    <View className="w-full">
      {label ? <Text className="mb-1.5 text-sm font-medium text-secondary">{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.muted}
        className="h-12 rounded-2xl border border-glass-border/10 bg-glass/[0.06] px-4 text-base text-foreground"
        {...props}
      />
    </View>
  );
}
