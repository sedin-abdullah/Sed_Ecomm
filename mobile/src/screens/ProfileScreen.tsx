import { ScrollView, View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { GradientBackground } from '@/components/GradientBackground';
import { LoginPrompt } from '@/components/LoginPrompt';
import { useAuthStore } from '@/store/authStore';
import { SUPPORTED_LANGUAGES } from '@/i18n';
import { colors } from '@/constants/theme';
import type { RootStackParamList } from '@/navigation/types';

function Item({ icon, label, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center gap-3 border-b border-white/5 py-4">
      <Ionicons name={icon} size={20} color={colors.muted} />
      <Text className="flex-1 text-foreground">{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.muted} />
    </Pressable>
  );
}

export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, isAuthenticated, logout } = useAuthStore();

  if (!isAuthenticated) return <LoginPrompt message="Log in to view your profile" />;

  return (
    <GradientBackground>
      <ScrollView style={{ paddingTop: insets.top + 8 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <View className="mb-4 flex-row items-center gap-4">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-brand-500/20">
            <Text className="text-2xl font-bold text-brand-400">{user?.name?.[0]?.toUpperCase() ?? 'U'}</Text>
          </View>
          <View>
            <Text className="text-xl font-bold text-foreground">{user?.name}</Text>
            <Text className="text-muted-foreground">{user?.email}</Text>
          </View>
        </View>

        <View className="rounded-3xl border border-white/10 bg-white/[0.06] px-4">
          <Item icon="bag-outline" label={t('nav.orders')} onPress={() => nav.navigate('Orders' as never)} />
          <Item icon="heart-outline" label={t('nav.wishlist')} onPress={() => nav.navigate('MainTabs', { screen: 'Wishlist' } as never)} />
          <Item icon="bag-handle-outline" label={t('nav.cart')} onPress={() => nav.navigate('MainTabs', { screen: 'Cart' } as never)} />
        </View>

        {/* Language switcher */}
        <Text className="mb-2 mt-6 font-semibold text-foreground">Language</Text>
        <View className="flex-row flex-wrap gap-2">
          {SUPPORTED_LANGUAGES.map((l) => {
            const active = i18n.language === l.code;
            return (
              <Pressable
                key={l.code}
                onPress={() => i18n.changeLanguage(l.code)}
                className={`rounded-full border px-4 py-2 ${active ? 'border-brand-500 bg-brand-500/20' : 'border-white/10 bg-white/[0.06]'}`}
              >
                <Text className={active ? 'text-brand-400' : 'text-secondary'}>{l.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable onPress={() => logout()} className="mt-8 flex-row items-center justify-center gap-2 rounded-2xl border border-sale/40 py-3">
          <Ionicons name="log-out-outline" size={18} color={colors.sale} />
          <Text className="font-semibold text-sale">{t('auth.logout')}</Text>
        </Pressable>
      </ScrollView>
    </GradientBackground>
  );
}
