import type { ReactNode } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GradientBackground } from '@/components/GradientBackground';
import { gradients } from '@/constants/theme';

const HIGHLIGHTS = ['✦ Curated picks', '🏷 Exclusive deals', '🚚 Fast delivery'];

/**
 * Mobile auth layout mirroring the web's premium look: a brand-gradient hero
 * (logo + tagline + highlight chips) above a glass form card.
 */
export function AuthShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <GradientBackground>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }} keyboardShouldPersistTaps="handled">
          {/* Brand hero */}
          <LinearGradient
            colors={gradients.brand}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: 28, padding: 24 }}
          >
            <Text className="text-3xl font-bold text-white">Sed_Ecomm</Text>
            <Text className="mt-2 text-base text-white/85">Premium shopping,{'\n'}thoughtfully designed.</Text>
            <View className="mt-4 flex-row flex-wrap gap-2">
              {HIGHLIGHTS.map((h) => (
                <View key={h} className="rounded-full bg-white/15 px-3 py-1">
                  <Text className="text-xs font-medium text-white">{h}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>

          {/* Glass form card */}
          <View className="mt-4 rounded-3xl border border-glass-border/10 bg-glass/[0.06] p-6">
            <Text className="mb-4 text-xl font-bold text-foreground">{title}</Text>
            {children}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}
